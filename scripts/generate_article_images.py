#!/usr/bin/env python3
"""Generate article images with the OpenAI Images API.

Usage:
  python scripts/generate_article_images.py articles/article-4-things-that-make-you-want-to-move.md --dry-run
  python scripts/generate_article_images.py articles/article-4-things-that-make-you-want-to-move.md --limit 3
  python scripts/generate_article_images.py articles/article-4-things-that-make-you-want-to-move.md --update-markdown
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import os
import re
import sys
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = ROOT / "public" / "uploads" / "generated"
IMAGE_RE = re.compile(r"!\[(?P<alt>[^\]]*)\]\((?P<url>[^)]+)\)")
HEADING_RE = re.compile(r"^(#{1,3})\s+(?P<heading>.+)$", re.MULTILINE)


@dataclass
class MarkdownImage:
    index: int
    alt: str
    url: str
    section: str
    context: str
    start: int
    end: int


def load_env(path: Path) -> None:
    if not path.exists():
        return

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def slugify(value: str, fallback: str = "image") -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:80] or fallback


def article_title(markdown: str, article_path: Path) -> str:
    match = re.search(r"^#\s+(.+)$", markdown, flags=re.MULTILINE)
    return match.group(1).strip() if match else article_path.stem.replace("-", " ").title()


def nearest_section(markdown: str, position: int, title: str) -> str:
    section = title
    for match in HEADING_RE.finditer(markdown):
        if match.start() > position:
            break
        section = match.group("heading").strip()
    return section


def nearby_context(markdown: str, image_end: int, max_chars: int = 700) -> str:
    after = markdown[image_end:]
    after = re.sub(r"^\s*\*[^*\r\n]+?\*\s*", "", after)
    after = re.split(r"\n---\n|\n##\s+", after, maxsplit=1)[0]
    after = re.sub(r"\s+", " ", after).strip()
    return after[:max_chars].strip()


def extract_images(markdown: str, title: str) -> list[MarkdownImage]:
    images: list[MarkdownImage] = []
    for index, match in enumerate(IMAGE_RE.finditer(markdown), start=1):
        images.append(
            MarkdownImage(
                index=index,
                alt=match.group("alt").strip(),
                url=match.group("url").strip(),
                section=nearest_section(markdown, match.start(), title),
                context=nearby_context(markdown, match.end()),
                start=match.start("url"),
                end=match.end("url"),
            )
        )
    return images


def build_prompt(title: str, image: MarkdownImage, style: str) -> str:
    return "\n".join(
        [
            "Create one premium editorial travel-magazine photograph for NetherlandsBest.nl.",
            f"Article: {title}",
            f"Section: {image.section}",
            f"Image subject: {image.alt}",
            f"Article context near this image: {image.context or 'No nearby paragraph context available.'}",
            f"Style: {style}",
            "Make it realistic and location-appropriate for the Netherlands.",
            "Use natural light, clean composition, warm but not oversaturated colors, and high-end magazine framing.",
            "Do not include text, captions, logos, watermarks, fake UI, distorted hands, or unreadable signage.",
            "The image must work as a website article image and for Pinterest cropping.",
        ]
    )


def output_for_image(image: MarkdownImage, article_slug: str, output_dir: Path) -> tuple[Path, str]:
    if image.url.startswith("/uploads/generated/"):
        public_path = image.url
        return ROOT / "public" / image.url.lstrip("/"), public_path

    file_name = f"{image.index:02d}-{slugify(image.alt)}.png"
    output_path = output_dir / article_slug / file_name
    public_path = "/" + output_path.relative_to(ROOT / "public").as_posix()
    return output_path, public_path


def write_image_from_response(response, output_path: Path) -> None:
    data = response.data[0]
    b64 = getattr(data, "b64_json", None)
    url = getattr(data, "url", None)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    if b64:
        output_path.write_bytes(base64.b64decode(b64))
        return

    if url:
        with urllib.request.urlopen(url, timeout=60) as remote:
            output_path.write_bytes(remote.read())
        return

    raise RuntimeError("OpenAI image response did not include b64_json or url")


def generate_image(prompt: str, output_path: Path, model: str, size: str, quality: str) -> None:
    try:
        from openai import OpenAI
    except ImportError as exc:
        raise RuntimeError("Missing Python package: openai. Run: python -m pip install -r scripts/requirements-imagegen.txt") from exc

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    response = client.images.generate(
        model=model,
        prompt=prompt,
        size=size,
        quality=quality,
        n=1,
    )
    write_image_from_response(response, output_path)


def rewrite_markdown(article_path: Path, markdown: str, replacements: dict[str, str]) -> None:
    updated = markdown
    for source_url, local_url in replacements.items():
        updated = updated.replace(source_url, local_url)

    if updated == markdown:
        return

    backup_path = article_path.with_suffix(article_path.suffix + ".bak")
    backup_path.write_text(markdown, encoding="utf-8")
    article_path.write_text(updated, encoding="utf-8")


def iter_limited(images: Iterable[MarkdownImage], limit: int | None) -> Iterable[MarkdownImage]:
    for count, image in enumerate(images, start=1):
        if limit is not None and count > limit:
            break
        yield image


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate local article images with OpenAI.")
    parser.add_argument("article", type=Path, help="Path to an article Markdown file.")
    parser.add_argument("--limit", type=int, default=None, help="Only generate the first N images.")
    parser.add_argument("--dry-run", action="store_true", help="Print prompts and output paths without calling OpenAI.")
    parser.add_argument("--update-markdown", action="store_true", help="Replace Markdown image URLs with generated local image paths.")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR, help="Output directory for generated images.")
    parser.add_argument("--model", default=os.environ.get("OPENAI_IMAGE_MODEL", "gpt-image-1.5"), help="OpenAI image model.")
    parser.add_argument("--size", default=os.environ.get("OPENAI_IMAGE_SIZE", "1536x1024"), help="Output size, for example 1536x1024 or 1024x1536.")
    parser.add_argument("--quality", default=os.environ.get("OPENAI_IMAGE_QUALITY", "high"), help="Image quality.")
    parser.add_argument(
        "--style",
        default="realistic editorial photography, premium travel magazine, authentic Dutch atmosphere, minimal clutter",
        help="Shared image style instruction.",
    )
    args = parser.parse_args()

    load_env(ROOT / ".env")

    article_path = args.article if args.article.is_absolute() else ROOT / args.article
    if not article_path.exists():
        print(f"Article not found: {article_path}", file=sys.stderr)
        return 1

    if not args.dry_run and not os.environ.get("OPENAI_API_KEY"):
        print("OPENAI_API_KEY is missing. Add it to .env first.", file=sys.stderr)
        return 1

    markdown = article_path.read_text(encoding="utf-8")
    title = article_title(markdown, article_path)
    article_slug = slugify(title, article_path.stem)
    images = extract_images(markdown, title)

    if not images:
        print("No Markdown images found.")
        return 0

    replacements: dict[str, str] = {}
    metadata: list[dict[str, str]] = []

    for image in iter_limited(images, args.limit):
        prompt = build_prompt(title, image, args.style)
        output_path, public_path = output_for_image(image, article_slug, args.output_dir)

        print(f"\n[{image.index}] {image.alt}")
        print(f"Source: {image.url}")
        print(f"Output: {output_path}")
        print(prompt)

        if not args.dry_run:
            if output_path.exists():
                print("Skipping existing file.")
            else:
                generate_image(prompt, output_path, args.model, args.size, args.quality)
            replacements[image.url] = public_path

        metadata.append(
            {
                "source_url": image.url,
                "local_url": public_path,
                "alt": image.alt,
                "section": image.section,
                "prompt": prompt,
                "model": args.model,
                "size": args.size,
                "quality": args.quality,
            }
        )

    if not args.dry_run:
        meta_path = args.output_dir / article_slug / "metadata.json"
        meta_path.write_text(
            json.dumps({"created_at": dt.datetime.now(dt.UTC).isoformat(), "images": metadata}, indent=2),
            encoding="utf-8",
        )

    if args.update_markdown and replacements:
        rewrite_markdown(article_path, markdown, replacements)
        print(f"\nUpdated Markdown image URLs and wrote backup: {article_path}.bak")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
