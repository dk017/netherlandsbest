import type { Article } from "@prisma/client";
import { siteUrl } from "@/lib/articles";

export default function PinterestButton({ article }: { article: Article }) {
  const href = new URL("https://www.pinterest.com/pin/create/button/");
  href.searchParams.set("url", siteUrl(`/blog/${article.slug}`));
  href.searchParams.set("media", article.verticalCoverImage || article.coverImage);
  href.searchParams.set("description", article.pinterestDescription || article.title);

  return (
    <a
      href={href.toString()}
      target="_blank"
      rel="noreferrer"
      className="absolute right-4 top-4 z-10 bg-orange px-4 py-2 text-sm font-semibold text-white opacity-100 shadow-lg transition hover:bg-navy md:opacity-0 md:group-hover:opacity-100"
    >
      Save
    </a>
  );
}
