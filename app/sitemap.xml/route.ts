import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { siteUrl } from "@/lib/articles";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  });

  const staticPaths = ["", "about", ...CATEGORY_SLUGS];
  const urls = [
    ...staticPaths.map((path) => `<url><loc>${siteUrl(path ? `/${path}` : "")}</loc></url>`),
    ...articles.map(
      (article) =>
        `<url><loc>${siteUrl(`/blog/${article.slug}`)}</loc><lastmod>${article.updatedAt.toISOString()}</lastmod></url>`
    )
  ];

  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`, {
    headers: { "Content-Type": "application/xml" }
  });
}
