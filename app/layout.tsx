import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsAfterConsent from "@/components/AnalyticsAfterConsent";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://netherlandsbest.nl";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NetherlandsBest.nl | Travel and Expat Guides",
    template: "%s | NetherlandsBest.nl"
  },
  description: "Premium travel, culture, where-to-stay, and expat guides for the Netherlands.",
  openGraph: {
    type: "website",
    siteName: "NetherlandsBest.nl",
    title: "NetherlandsBest.nl",
    description: "Premium travel and expat guides for the Netherlands.",
    url: siteUrl
  },
  twitter: {
    card: "summary_large_image",
    title: "NetherlandsBest.nl",
    description: "Premium travel and expat guides for the Netherlands."
  },
  other: {
    "p:domain_verify": "6fe0559c93884bf712c999203c9da49b"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <AnalyticsAfterConsent />
        <NewsletterPopup />
        <CookieBanner />
      </body>
    </html>
  );
}
