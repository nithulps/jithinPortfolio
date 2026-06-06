"use client";

import { useEffect, useState } from "react";

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
  statusText: string;
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
  statusText: "",
  socials: { linkedin: "", github: "", twitter: "", instagram: "" },
};

export default function HeroEditor() {
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
      <h1 className="admin-h1">Hero Section</h1>
      <p className="admin-sub">Content shown in the hero area at the top of the home page.</p>

      <div className="admin-card">
        <div className="admin-field">
          <label>Name (big hero title)</label>
          <input value={data.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Hero rotating phrases (one per line)</label>
          <textarea
            rows={3}
            value={data.heroPhrases.join("\n")}
            onChange={(e) => set("heroPhrases", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          />
        </div>
        <div className="admin-field">
          <label>Hero description</label>
          <textarea rows={3} value={data.heroDescription} onChange={(e) => set("heroDescription", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Competency statement (HTML allowed — wrap highlights in &lt;span class=&quot;gradient-text&quot;&gt;…&lt;/span&gt;)</label>
          <textarea rows={3} value={data.competencyText} onChange={(e) => set("competencyText", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>&quot;Open to work&quot; badge text (floating side label)</label>
          <input
            value={data.statusText}
            placeholder="Open to work"
            onChange={(e) => set("statusText", e.target.value)}
          />
        </div>
      </div>

      {msg && <div className={msg === "Saved!" ? "admin-ok" : "admin-error"}>{msg}</div>}
      <button className="admin-btn" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save hero"}
      </button>
    </div>
  );
}
