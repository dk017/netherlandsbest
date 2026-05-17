"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Article, Category } from "@prisma/client";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Draft = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  verticalCoverImage: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  pinterestDescription: string;
  featured: boolean;
  published: boolean;
};

const emptyDraft: Draft = {
  title: "",
  slug: "",
  category: "travel",
  coverImage: "",
  verticalCoverImage: "",
  content: "",
  seoTitle: "",
  metaDescription: "",
  pinterestDescription: "",
  featured: false,
  published: false
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminEditor({ initialArticles, categories }: { initialArticles: Article[]; categories: Category[] }) {
  const [articles, setArticles] = useState(initialArticles);
  const [signups, setSignups] = useState<Array<{ id: string; email: string; source: string | null; page: string | null; createdAt: string }>>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  const selectedTitleSlug = useMemo(() => slugify(draft.title), [draft.title]);

  useEffect(() => {
    if (autoSlug && !draft.id) {
      setDraft((current) => ({ ...current, slug: selectedTitleSlug }));
    }
  }, [autoSlug, draft.id, selectedTitleSlug]);

  useEffect(() => {
    fetch("/api/newsletter")
      .then((response) => (response.ok ? response.json() : { signups: [] }))
      .then((data) => setSignups(data.signups ?? []))
      .catch(() => setSignups([]));
  }, []);

  function edit(article: Article) {
    setAutoSlug(false);
    setDraft({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.category,
      coverImage: article.coverImage,
      verticalCoverImage: article.verticalCoverImage ?? "",
      content: article.content,
      seoTitle: article.seoTitle,
      metaDescription: article.metaDescription,
      pinterestDescription: article.pinterestDescription,
      featured: article.featured,
      published: article.published
    });
  }

  async function save() {
    setMessage("Saving...");
    const response = await fetch(draft.id ? `/api/articles/${draft.id}` : "/api/articles", {
      method: draft.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Unable to save");
      return;
    }
    setArticles((current) => {
      const next = current.filter((item) => item.id !== data.article.id);
      return [data.article, ...next];
    });
    setDraft(emptyDraft);
    setAutoSlug(true);
    setMessage("Saved");
  }

  async function remove(id: string) {
    if (!confirm("Delete this article?")) return;
    const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (response.ok) {
      setArticles((current) => current.filter((item) => item.id !== id));
    }
  }

  async function upload(file: File, field: "coverImage" | "verticalCoverImage") {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await response.json();
    if (response.ok) setDraft((current) => ({ ...current, [field]: data.url }));
  }

  return (
    <div className="container-padded grid gap-10 py-12 lg:grid-cols-[360px_1fr]">
      <aside>
        <h1 className="text-3xl font-semibold tracking-tight text-navy">Admin</h1>
        <p className="mt-2 text-sm text-ink/60">Create and maintain NetherlandsBest articles.</p>
        <div className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
          {articles.map((article) => (
            <div key={article.id} className="py-4">
              <button onClick={() => edit(article)} className="text-left text-base font-semibold leading-snug text-navy hover:text-orange">
                {article.title}
              </button>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink/45">{article.category}</p>
              <div className="mt-3 flex gap-3 text-sm">
                <button onClick={() => edit(article)} className="font-semibold text-orange">Edit</button>
                <button onClick={() => remove(article.id)} className="font-semibold text-ink/45 hover:text-orange">Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-navy">Newsletter emails</h2>
          <p className="mt-2 text-sm text-ink/60">{signups.length} saved locally.</p>
          <div className="mt-4 max-h-72 overflow-auto border-y border-navy/10">
            {signups.map((signup) => (
              <div key={signup.id} className="border-b border-navy/10 py-3 text-sm last:border-b-0">
                <p className="font-semibold text-navy">{signup.email}</p>
                <p className="mt-1 text-xs text-ink/45">
                  {signup.source ?? "unknown"} {signup.page ? `· ${signup.page}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-semibold text-navy">
            Title
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange" />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Slug
            <input value={draft.slug} onChange={(event) => { setAutoSlug(false); setDraft({ ...draft, slug: event.target.value }); }} className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange" />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Category
            <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange">
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-navy">
            Cover image upload
            <input type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && upload(event.target.files[0], "coverImage")} className="mt-2 w-full border border-navy/15 px-4 py-3 text-sm" />
          </label>
          <label className="block text-sm font-semibold text-navy md:col-span-2">
            Cover image URL
            <input value={draft.coverImage} onChange={(event) => setDraft({ ...draft, coverImage: event.target.value })} className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange" />
          </label>
          <label className="block text-sm font-semibold text-navy md:col-span-2">
            Vertical Pinterest cover URL
            <input value={draft.verticalCoverImage} onChange={(event) => setDraft({ ...draft, verticalCoverImage: event.target.value })} className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange" />
          </label>
        </div>

        <label className="block text-sm font-semibold text-navy">
          Content
          <div className="mt-2" data-color-mode="light">
            <MDEditor height={460} value={draft.content} onChange={(value) => setDraft({ ...draft, content: value ?? "" })} preview="live" />
          </div>
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-semibold text-navy">
            SEO title
            <input value={draft.seoTitle} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange" />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Meta description
            <textarea value={draft.metaDescription} onChange={(event) => setDraft({ ...draft, metaDescription: event.target.value })} rows={3} className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange" />
          </label>
          <label className="block text-sm font-semibold text-navy md:col-span-2">
            Pinterest description
            <textarea value={draft.pinterestDescription} onChange={(event) => setDraft({ ...draft, pinterestDescription: event.target.value })} rows={3} className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange" />
          </label>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-navy">
            <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-navy">
            <input type="checkbox" checked={draft.published} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} />
            Published
          </label>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={save} className="bg-orange px-6 py-3 text-sm font-semibold text-white hover:bg-navy">Save article</button>
          <button onClick={() => { setDraft(emptyDraft); setAutoSlug(true); }} className="border border-navy/15 px-6 py-3 text-sm font-semibold text-navy">New</button>
          {message && <p className="text-sm text-ink/60">{message}</p>}
        </div>
      </section>
    </div>
  );
}
