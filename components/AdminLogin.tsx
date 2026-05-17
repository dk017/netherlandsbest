"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    if (response.ok) {
      window.location.reload();
      return;
    }
    setError("Invalid password");
  }

  return (
    <div className="container-padded flex min-h-[70vh] items-center justify-center py-16">
      <form onSubmit={login} className="w-full max-w-md border border-navy/10 bg-white p-8 shadow-editorial">
        <h1 className="text-3xl font-semibold tracking-tight text-navy">Admin login</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">Enter the site password to manage articles.</p>
        <label className="mt-8 block text-sm font-semibold text-navy">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full border border-navy/15 px-4 py-3 text-ink outline-none focus:border-orange"
          />
        </label>
        {error && <p className="mt-3 text-sm text-orange">{error}</p>}
        <button className="mt-6 w-full bg-orange px-5 py-3 text-sm font-semibold text-white hover:bg-navy">Login</button>
      </form>
    </div>
  );
}
