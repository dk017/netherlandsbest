"use client";

import { useState } from "react";

export default function NewsletterForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        source,
        page: window.location.pathname
      })
    });

    const data = await response.json();
    setBusy(false);

    if (!response.ok) {
      setMessage(data.error ?? "Could not subscribe. Please try again.");
      return;
    }

    setEmail("");
    setMessage(data.alreadySubscribed ? "You are already on the list." : "You are on the list.");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          className="min-w-0 flex-1 border border-navy/15 px-4 py-3 text-sm text-ink outline-none focus:border-orange"
        />
        <button disabled={busy} className="bg-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Saving" : "Subscribe"}
        </button>
      </div>
      {message && <p className="text-sm text-ink/65">{message}</p>}
    </form>
  );
}
