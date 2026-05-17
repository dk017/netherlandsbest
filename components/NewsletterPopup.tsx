"use client";

import { useEffect, useState } from "react";
import NewsletterForm from "@/components/NewsletterForm";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("nb_newsletter_seen")) return;

    function onScroll() {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) return;
      if (window.scrollY / documentHeight > 0.4) {
        sessionStorage.setItem("nb_newsletter_seen", "true");
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-ink/25 p-4 backdrop-blur-sm md:items-center md:justify-center">
      <div className="w-full max-w-lg bg-white p-6 shadow-editorial md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-navy">Travel smarter in the Netherlands</h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">A short, useful dispatch for Dutch travel and expat life.</p>
          </div>
          <button className="text-2xl leading-none text-ink/45 hover:text-orange" onClick={() => setVisible(false)} aria-label="Close newsletter popup">
            ×
          </button>
        </div>
        <div className="mt-6">
          <NewsletterForm source="scroll-popup" />
        </div>
      </div>
    </div>
  );
}
