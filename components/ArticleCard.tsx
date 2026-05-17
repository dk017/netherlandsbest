import type { Article } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { categoryLabel } from "@/lib/categories";
import { readingTime } from "@/lib/articles";

export default function ArticleCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <article className="h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-mist">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
            data-pin-description={article.pinterestDescription}
          />
        </div>
        <div className="pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">{categoryLabel(article.category)}</p>
          <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-navy transition group-hover:text-orange">
            {article.title}
          </h3>
          <p className="mt-4 text-sm text-ink/55">
            {format(article.createdAt, "MMM d, yyyy")} · {readingTime(article.content)} min read
          </p>
          <p className="mt-4 line-clamp-3 text-base leading-7 text-ink/70">{article.metaDescription}</p>
        </div>
      </article>
    </Link>
  );
}
