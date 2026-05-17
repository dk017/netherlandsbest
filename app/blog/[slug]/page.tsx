import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticlePage from "@/components/ArticlePage";
import { getAllArticleSlugs, getArticleBySlug, getRelatedArticles, readingTime, siteUrl } from "@/lib/articles";
import { categoryLabel } from "@/lib/categories";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return {};
  const url = siteUrl(`/blog/${article.slug}`);
  const image = article.coverImage;

  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.seoTitle || article.title,
      description: article.metaDescription,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: article.title }]
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle || article.title,
      description: article.metaDescription,
      images: [image]
    },
    other: {
      "article:published_time": article.createdAt.toISOString(),
      "article:modified_time": article.updatedAt.toISOString()
    }
  };
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article.category, article.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: [article.coverImage, article.verticalCoverImage].filter(Boolean),
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "NetherlandsBest.nl" },
    publisher: { "@type": "Organization", name: "NetherlandsBest.nl" },
    mainEntityOfPage: siteUrl(`/blog/${article.slug}`),
    articleSection: categoryLabel(article.category),
    timeRequired: `PT${readingTime(article.content)}M`
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticlePage article={article} related={related} />
    </>
  );
}
