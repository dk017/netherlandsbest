import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title || !body.slug || !body.content || !body.category || !body.coverImage) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const article = await prisma.article.create({
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content,
      category: body.category,
      coverImage: body.coverImage,
      verticalCoverImage: body.verticalCoverImage || null,
      seoTitle: body.seoTitle || body.title,
      metaDescription: body.metaDescription || "",
      pinterestDescription: body.pinterestDescription || body.metaDescription || body.title,
      featured: Boolean(body.featured),
      published: Boolean(body.published)
    }
  });

  return NextResponse.json({ article });
}
