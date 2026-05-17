import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { CATEGORY_SLUGS } from "@/lib/categories";

export const PAGE_SIZE = 9;

export const getCategories = cache(async () => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  if (categories.length) {
    return [...categories].sort((a, b) => CATEGORY_SLUGS.indexOf(a.slug as any) - CATEGORY_SLUGS.indexOf(b.slug as any));
  }
  return CATEGORY_SLUGS.map((slug) => ({
    id: slug,
    slug,
    name: slug
      .split("-")
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" "),
    description: "",
    createdAt: new Date(),
    updatedAt: new Date()
  }));
});

export const getPublishedArticles = cache(async (take = 12) => {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take
  });
});

export const getFeaturedArticle = cache(async () => {
  const featured = await prisma.article.findFirst({
    where: { published: true, featured: true },
    orderBy: { updatedAt: "desc" }
  });
  if (featured) return featured;
  return prisma.article.findFirst({ where: { published: true }, orderBy: { createdAt: "desc" } });
});

export async function getCategoryArticles(category: string, page = 1) {
  const skip = (page - 1) * PAGE_SIZE;
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { published: true, category },
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE
    }),
    prisma.article.count({ where: { published: true, category } })
  ]);

  return { articles, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export const getArticleBySlug = cache(async (slug: string, includeDraft = false) => {
  return prisma.article.findFirst({
    where: { slug, ...(includeDraft ? {} : { published: true }) }
  });
});

export async function getRelatedArticles(category: string, currentSlug: string) {
  return prisma.article.findMany({
    where: { published: true, category, slug: { not: currentSlug } },
    orderBy: { createdAt: "desc" },
    take: 3
  });
}

export const getAllArticleSlugs = cache(async () => {
  return prisma.article.findMany({
    where: { published: true },
    select: { slug: true }
  });
});

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://netherlandsbest.nl").replace(/\/$/, "");
  return `${base}${path}`;
}
