"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    setChoice(localStorage.getItem("nb_cookie_consent"));
  }, []);

  function choose(value: "accepted" | "declined") {
    localStorage.setItem("nb_cookie_consent", value);
    setChoice(value);
    window.dispatchEvent(new CustomEvent("analytics-consent", { detail: value }));
  }

  if (choice) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl border border-navy/10 bg-white p-5 shadow-editorial">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-6 text-ink/70">
          We use optional analytics cookies to understand which guides are useful. Analytics loads only after consent.
        </p>
        <div className="flex shrink-0 gap-3">
          <button onClick={() => choose("declined")} className="border border-navy/15 px-4 py-2 text-sm font-semibold text-navy">
            Decline
          </button>
          <button onClick={() => choose("accepted")} className="bg-orange px-4 py-2 text-sm font-semibold text-white">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
