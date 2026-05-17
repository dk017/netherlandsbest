"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function AnalyticsAfterConsent() {
  const [allowed, setAllowed] = useState(false);
  const analyticsSrc = process.env.NEXT_PUBLIC_ANALYTICS_SRC;

  useEffect(() => {
    setAllowed(localStorage.getItem("nb_cookie_consent") === "accepted");
    function onConsent(event: Event) {
      const detail = (event as CustomEvent).detail;
      setAllowed(detail === "accepted");
    }
    window.addEventListener("analytics-consent", onConsent);
    return () => window.removeEventListener("analytics-consent", onConsent);
  }, []);

  if (!analyticsSrc || !allowed) return null;
  return <Script src={analyticsSrc} strategy="afterInteractive" />;
}
