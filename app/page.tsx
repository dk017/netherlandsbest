import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import NewsletterInline from "@/components/NewsletterInline";
import { getCategories, getFeaturedArticle, getPublishedArticles, readingTime } from "@/lib/articles";
import { categoryLabel } from "@/lib/categories";
import { format } from "date-fns";

export const revalidate = 3600;

export default async function HomePage() {
  const [featured, articles, categories] = await Promise.all([
    getFeaturedArticle(),
    getPublishedArticles(9),
    getCategories()
  ]);
  const recent = featured ? articles.filter((article) => article.id !== featured.id) : articles;

  return (
    <>
      <section className="container-padded pt-10 md:pt-16">
        {featured ? (
          <Link href={`/blog/${featured.slug}`} className="group grid gap-8 md:grid-cols-[1fr_1.15fr] md:items-end">
            <div className="order-1 pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange">{categoryLabel(featured.category)}</p>
              <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-navy sm:text-5xl md:text-7xl md:leading-[0.98]">
                {featured.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-ink/65">{featured.metaDescription}</p>
              <p className="mt-6 text-sm text-ink/50">
                {format(featured.createdAt, "MMM d, yyyy")} · {readingTime(featured.content)} min read
              </p>
              <span className="mt-8 inline-flex bg-orange px-6 py-3 text-sm font-semibold text-white transition group-hover:bg-navy">
                Read the feature
              </span>
            </div>
            <div className="order-2">
              <div className="relative aspect-[4/5] overflow-hidden bg-mist shadow-editorial md:aspect-[5/4]">
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  data-pin-description={featured.pinterestDescription}
                />
              </div>
            </div>
          </Link>
        ) : (
          <div className="py-20 text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-navy">NetherlandsBest.nl</h1>
            <p className="mt-5 text-ink/65">Publish your first article from the admin panel.</p>
          </div>
        )}
      </section>

      <section className="container-padded mt-12 border-y border-navy/10 py-5">
        <div className="flex gap-4 overflow-x-auto text-sm font-semibold text-navy md:justify-center md:gap-10">
          {categories.map((category) => (
            <Link key={category.slug} href={`/${category.slug}`} className="shrink-0 transition hover:text-orange">
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-padded mt-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-navy md:text-4xl">Recent articles</h2>
            <p className="mt-3 max-w-xl text-ink/60">Fresh, practical guides for travelling, staying, and settling in the Netherlands.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {recent.map((article, index) => (
            <ArticleCard key={article.id} article={article} priority={index < 2} />
          ))}
        </div>
      </section>

      <div className="container-padded">
        <NewsletterInline />
      </div>
    </>
  );
}
