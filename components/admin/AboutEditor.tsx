"use client";

import { useEffect, useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

interface About {
  name: string;
  heroPhrases: string[];
  heroDescription: string;
  headline: string;
  aboutPhrases: string[];
  bioParagraphs: string[];
  image: string;
  resumeUrl: string;
  competencyText: string;
  roleLabel: string;
  socials: { linkedin: string; github: string; twitter: string; instagram: string };
}

const EMPTY: About = {
  name: "",
  heroPhrases: [],
  heroDescription: "",
  headline: "",
  aboutPhrases: [],
  bioParagraphs: [],
  image: "",
  resumeUrl: "",
  competencyText: "",
  roleLabel: "",
  socials: { linkedin: "", github: "", twitter: "", instagram: "" },
};

export default function AboutEditor() {
  const [data, setData] = useState<About>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/about");
      const j = await res.json();
      setData({ ...EMPTY, ...j, socials: { ...EMPTY.socials, ...(j.socials || {}) } });
      setLoading(false);
    })();
  }, []);

  function set<K extends keyof About>(k: K, v: About[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }
  function setSocial(k: keyof About["socials"], v: string) {
    setData((d) => ({ ...d, socials: { ...d.socials, [k]: v } }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setMsg(res.ok ? "Saved!" : "Could not save.");
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="admin-h1">About Section</h1>
      <p className="admin-sub">Content for the About page.</p>

      <div className="admin-card">
        <div className="admin-field">
          <label>Role pill (next to your name)</label>
          <input
            value={data.roleLabel}
            placeholder="QA Engineer"
            onChange={(e) => set("roleLabel", e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>About headline</label>
          <textarea rows={2} value={data.headline} onChange={(e) => set("headline", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>About rotating phrases (one per line)</label>
          <textarea
            rows={3}
            value={data.aboutPhrases.join("\n")}
            onChange={(e) => set("aboutPhrases", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>
        <div className="admin-field">
          <label>Bio paragraphs (one paragraph per line — HTML like &lt;b&gt; allowed)</label>
          <textarea
            rows={5}
            value={data.bioParagraphs.join("\n")}
            onChange={(e) => set("bioParagraphs", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>
        <MediaUploader label="Profile image" value={data.image} folder="portfolio/about" onChange={(u) => set("image", u)} />
        <MediaUploader label="Resume (PDF or link)" value={data.resumeUrl} folder="portfolio/about" allowPdf onChange={(u) => set("resumeUrl", u)} />
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 14 }}>Social links</h3>
        <div className="admin-row">
          <div className="admin-field">
            <label>LinkedIn</label>
            <input value={data.socials.linkedin} onChange={(e) => setSocial("linkedin", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>GitHub</label>
            <input value={data.socials.github} onChange={(e) => setSocial("github", e.target.value)} />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label>Twitter / X</label>
            <input value={data.socials.twitter} onChange={(e) => setSocial("twitter", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Instagram</label>
            <input value={data.socials.instagram} onChange={(e) => setSocial("instagram", e.target.value)} />
          </div>
        </div>
      </div>

      {msg && <div className={msg === "Saved!" ? "admin-ok" : "admin-error"}>{msg}</div>}
      <button className="admin-btn" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save about"}
      </button>
    </div>
  );
}
