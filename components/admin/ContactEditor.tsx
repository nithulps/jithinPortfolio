"use client";

import { useEffect, useState } from "react";

interface Contact {
  heading: string;
  pill: string;
  infoHeading: string;
  infoParagraphs: string[];
  email: string;
}

interface About {
  contact: Contact;
  [key: string]: unknown;
}

const EMPTY_CONTACT: Contact = {
  heading: "",
  pill: "",
  infoHeading: "",
  infoParagraphs: [],
  email: "",
};

export default function ContactEditor() {
  const [about, setAbout] = useState<About | null>(null);
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/about");
      const j = await res.json();
      setAbout(j);
      setContact({ ...EMPTY_CONTACT, ...(j.contact || {}) });
      setLoading(false);
    })();
  }, []);

  function set<K extends keyof Contact>(k: K, v: Contact[K]) {
    setContact((c) => ({ ...c, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const payload = { ...(about || {}), contact };
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved!" : "Could not save.");
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="admin-h1">Contact Page</h1>
      <p className="admin-sub">Text shown on the public Contact page.</p>

      <div className="admin-card">
        <div className="admin-field">
          <label>Page heading</label>
          <input
            value={contact.heading}
            placeholder="Contact"
            onChange={(e) => set("heading", e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>Filter pill label</label>
          <input
            value={contact.pill}
            placeholder="Let's talk"
            onChange={(e) => set("pill", e.target.value)}
          />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-field">
          <label>Info panel heading</label>
          <input
            value={contact.infoHeading}
            placeholder="Let's build something reliable."
            onChange={(e) => set("infoHeading", e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>Info panel paragraphs (one paragraph per line — HTML like &lt;em&gt; allowed)</label>
          <textarea
            rows={5}
            value={contact.infoParagraphs.join("\n")}
            onChange={(e) =>
              set("infoParagraphs", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
            }
          />
        </div>
        <div className="admin-field">
          <label>Contact email (optional — shown on the page)</label>
          <input
            value={contact.email}
            placeholder="you@example.com"
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
      </div>

      {msg && <div className={msg === "Saved!" ? "admin-ok" : "admin-error"}>{msg}</div>}
      <button className="admin-btn" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save contact"}
      </button>
    </div>
  );
}
