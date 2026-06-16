"use client";

import { useEffect, useState } from "react";

interface FooterData {
  footerHeading: string;
  footerSubtitle: string;
}

interface About extends Partial<FooterData> {
  [key: string]: unknown;
}

const EMPTY: FooterData = {
  footerHeading: "",
  footerSubtitle: "",
};

export default function FooterEditor() {
  const [about, setAbout] = useState<About | null>(null);
  const [footer, setFooter] = useState<FooterData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/about");
      const j = await res.json();
      setAbout(j);
      setFooter({
        footerHeading: j.footerHeading || "",
        footerSubtitle: j.footerSubtitle || "",
      });
      setLoading(false);
    })();
  }, []);

  function set<K extends keyof FooterData>(k: K, v: FooterData[K]) {
    setFooter((c) => ({ ...c, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const payload = { ...(about || {}), ...footer };
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
      <h1 className="admin-h1">Footer</h1>
      <p className="admin-sub">Footer call-to-action heading and sub-text.</p>

      <div className="admin-card">
        <div className="admin-field">
          <label>Footer CTA heading</label>
          <input
            value={footer.footerHeading}
            placeholder="Ready to ship quality software?"
            onChange={(e) => set("footerHeading", e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>Footer CTA sub-text</label>
          <textarea
            rows={2}
            value={footer.footerSubtitle}
            placeholder="Tell me about your project and testing needs - let's discuss and work together!"
            onChange={(e) => set("footerSubtitle", e.target.value)}
          />
        </div>
      </div>

      {msg && <div className={msg === "Saved!" ? "admin-ok" : "admin-error"}>{msg}</div>}
      <button className="admin-btn" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save footer"}
      </button>
    </div>
  );
}
