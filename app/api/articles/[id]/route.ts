import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/admin";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const article = await prisma.article.update({
    where: { id: params.id },
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

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.article.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
