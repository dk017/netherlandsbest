import NewsletterForm from "@/components/NewsletterForm";

export default function NewsletterInline({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "my-10 border-y border-navy/10 py-8" : "my-16 bg-navy px-6 py-12 text-white md:px-12"}>
      <div className={compact ? "" : "mx-auto max-w-3xl text-center"}>
        <h2 className={compact ? "text-2xl font-semibold tracking-tight text-navy" : "text-3xl font-semibold tracking-tight"}>
          Get sharper Netherlands guides in your inbox
        </h2>
        <p className={compact ? "mt-3 text-ink/65" : "mx-auto mt-4 max-w-2xl text-white/75"}>
          Practical travel notes, expat context, and polished city ideas without the noise.
        </p>
        <div className={compact ? "mt-6" : "mx-auto mt-8 max-w-xl bg-white p-3 text-ink"}>
          <NewsletterForm source={compact ? "article-inline" : "newsletter-band"} />
        </div>
      </div>
    </section>
  );
}
