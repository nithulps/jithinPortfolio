"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong");
      }
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="contact-form-panel">
      <form
        className="contact-form"
        onSubmit={handleSubmit}
        onInput={() => status === "ok" && setStatus("idle")}
      >
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input className="form-input" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input className="form-input" id="email" name="email" type="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="projectType">Project type</label>
          <select className="form-select" id="projectType" name="projectType" defaultValue="">
            <option value="" disabled>
              Select an option
            </option>
            <option>Manual Testing</option>
            <option>Test Automation</option>
            <option>API &amp; Performance Testing</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="budget">Budget (optional)</label>
          <input className="form-input" id="budget" name="budget" />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea className="form-textarea" id="message" name="message" rows={5} required />
        </div>

        {status === "error" && (
          <p style={{ color: "#ff6b6b", fontSize: "0.9rem" }}>{error}</p>
        )}

        <button className="form-submit-btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {status === "ok" && (
          <div className="form-success" role="status" aria-live="polite">
            <span className="form-success-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </span>
            <div>
              <strong>Message delivered!</strong>
              <p>Thank you — I&apos;ll get back to you as soon as possible.</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
