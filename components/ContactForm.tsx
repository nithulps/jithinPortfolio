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

  if (status === "ok") {
    return (
      <div className="contact-form-panel">
        <h2 style={{ color: "var(--cyan)" }}>Thank you!</h2>
        <p style={{ color: "var(--text-gray)" }}>
          Your message has been received. I&apos;ll get back to you soon.
        </p>
        <button className="form-submit-btn" onClick={() => setStatus("idle")} style={{ marginTop: 20 }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="contact-form-panel">
      <form className="contact-form" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}
