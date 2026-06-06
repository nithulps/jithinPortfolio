"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8b93a3",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px"
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
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
