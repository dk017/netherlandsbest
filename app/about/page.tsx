import type { Metadata } from "next";
import NewsletterInline from "@/components/NewsletterInline";
import { siteUrl } from "@/lib/articles";

export const metadata: Metadata = {
  title: "About",
  description: "NetherlandsBest.nl is a clear, premium guide to travel, culture, where to stay, and expat life in the Netherlands.",
  alternates: { canonical: siteUrl("/about") },
  openGraph: {
    title: "About NetherlandsBest.nl",
    description: "A clear, premium guide to travel, culture, where to stay, and expat life in the Netherlands.",
    url: siteUrl("/about")
  }
};

export default function AboutPage() {
  return (
    <section className="container-padded py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-semibold tracking-tight text-navy md:text-6xl">A clearer way to experience the Netherlands</h1>
        <div className="mt-8 space-y-6 text-lg leading-8 text-ink/70">
          <p>
            NetherlandsBest.nl publishes practical, polished guides for travellers, newcomers, and residents who want better decisions without digging through noisy forums or generic lists.
          </p>
          <p>
            The site focuses on four useful lanes: travel, expat life, Dutch culture, and where to stay. Every guide is written to be direct, current, and easy to act on.
          </p>
        </div>
        <NewsletterInline />
      </div>
    </section>
  );
}
