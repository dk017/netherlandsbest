import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/articles";
import { isAdminAuthenticated } from "@/lib/admin";
import AdminEditor from "@/components/AdminEditor";
import AdminLogin from "@/components/AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAdminAuthenticated()) {
    return <AdminLogin />;
  }

  const [articles, categories] = await Promise.all([
    prisma.article.findMany({ orderBy: { createdAt: "desc" } }),
    getCategories()
  ]);

  return <AdminEditor initialArticles={articles} categories={categories} />;
}
