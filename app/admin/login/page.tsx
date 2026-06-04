"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Login failed.");
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-brand">Jithin · Admin</div>
        <p className="admin-sub">Sign in to manage your portfolio.</p>
        <form onSubmit={onSubmit}>
          <div className="admin-field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" autoComplete="username" required />
          </div>
          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <div className="admin-error">{error}</div>}
          <button className="admin-btn" type="submit" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
