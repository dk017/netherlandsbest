import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";
import { CATEGORY_SLUGS } from "@/lib/categories";
import { getCategories, getCategoryArticles, siteUrl } from "@/lib/articles";

export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === params.category);
  if (!category) return {};
  const url = siteUrl(`/${category.slug}`);
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${category.name} | NetherlandsBest.nl`,
      description: category.description,
      url
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | NetherlandsBest.nl`,
      description: category.description
    }
  };
}

export default async function CategoryPage({ params, searchParams }: { params: { category: string }; searchParams: { page?: string } }) {
  if (!CATEGORY_SLUGS.includes(params.category as any)) notFound();
  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === params.category);
  if (!category) notFound();

  const { articles, pages } = await getCategoryArticles(params.category, page);

  return (
    <section className="container-padded py-12 md:py-16">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-semibold tracking-tight text-navy md:text-6xl">{category.name}</h1>
        <p className="mt-5 text-lg leading-8 text-ink/65">{category.description}</p>
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {pages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-3">
          {Array.from({ length: pages }).map((_, index) => {
            const nextPage = index + 1;
            return (
              <Link
                key={nextPage}
                href={`/${params.category}?page=${nextPage}`}
                className={nextPage === page ? "bg-orange px-4 py-2 text-sm font-semibold text-white" : "border border-navy/15 px-4 py-2 text-sm font-semibold text-navy"}
              >
                {nextPage}
              </Link>
            );
          })}
        </nav>
      )}
    </section>
  );
}
