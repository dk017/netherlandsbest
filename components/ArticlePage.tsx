import type { Article } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { categoryLabel } from "@/lib/categories";
import { readingTime, siteUrl } from "@/lib/articles";
import NewsletterInline from "@/components/NewsletterInline";
import PinterestButton from "@/components/PinterestButton";
import ArticleCard from "@/components/ArticleCard";

function splitAfterThirdParagraph(markdown: string) {
  const blocks = markdown.split(/\n{2,}/);
  if (blocks.length <= 3) return { before: markdown, after: "" };
  return { before: blocks.slice(0, 3).join("\n\n"), after: blocks.slice(3).join("\n\n") };
}

function MarkdownBody({ content, article }: { content: string; article: Article }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        img: ({ src = "", alt = "" }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} data-pin-description={article.pinterestDescription} className="w-full" />
        )
      }}
      className="prose prose-lg prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-navy prose-a:text-orange prose-strong:text-ink prose-blockquote:border-orange prose-blockquote:text-ink/80"
    >
      {content}
    </ReactMarkdown>
  );
}

export default function ArticlePage({ article, related }: { article: Article; related: Article[] }) {
  const { before, after } = splitAfterThirdParagraph(article.content);
  const shareUrl = siteUrl(`/blog/${article.slug}`);
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  return (
    <article>
      <header className="container-padded pt-10 md:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <Link href={`/${article.category}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
            {categoryLabel(article.category)}
          </Link>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-navy md:text-6xl">{article.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink/65">{article.metaDescription}</p>
          <p className="mt-6 text-sm text-ink/50">
            {format(article.createdAt, "MMMM d, yyyy")} · {readingTime(article.content)} min read
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <a href={facebookUrl} target="_blank" rel="noreferrer" className="border border-navy/15 px-4 py-2 text-sm font-semibold text-navy hover:border-orange hover:text-orange">
              Facebook
            </a>
            <a href={twitterUrl} target="_blank" rel="noreferrer" className="border border-navy/15 px-4 py-2 text-sm font-semibold text-navy hover:border-orange hover:text-orange">
              Twitter
            </a>
          </div>
        </div>
      </header>

      <div className="container-padded mt-10">
        <div className="group relative aspect-[16/9] overflow-hidden bg-mist">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            data-pin-description={article.pinterestDescription}
          />
          <PinterestButton article={article} />
        </div>
      </div>

      <div className="container-padded mt-12">
        <div className="mx-auto max-w-3xl">
          <MarkdownBody content={before} article={article} />
          <NewsletterInline compact />
          {after && <MarkdownBody content={after} article={article} />}
          <NewsletterInline />
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-padded mt-20 border-t border-navy/10 pt-14">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-3xl font-semibold tracking-tight text-navy">Related articles</h2>
            <Link href={`/${article.category}`} className="hidden text-sm font-semibold text-orange md:block">
              View category
            </Link>
          </div>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
