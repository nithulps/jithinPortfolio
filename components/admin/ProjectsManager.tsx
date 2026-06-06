"use client";

import { useEffect, useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

interface Project {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  excerpt: string;
  description: string;
  coverImage: string;
  visuals: string[];
  client: string;
  role: string;
  year: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  overlayTitle: string;
  overlaySub: string;
}

const EMPTY: Project = {
  title: "",
  slug: "",
  category: "",
  tags: [],
  excerpt: "",
  description: "",
  coverImage: "",
  visuals: [],
  client: "",
  role: "",
  year: "",
  liveUrl: "",
  githubUrl: "",
  featured: false,
  order: 0,
  overlayTitle: "",
  overlaySub: "",
};

export default function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function set<K extends keyof Project>(key: K, val: Project[K]) {
    setEditing((p) => (p ? { ...p, [key]: val } : p));
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    const isNew = !editing._id;
    const res = await fetch(
      isNew ? "/api/admin/projects" : `/api/admin/projects/${editing._id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      }
    );
    setSaving(false);
    if (res.ok) {
      setEditing(null);
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Could not save.");
    }
  }

  async function remove(id?: string) {
    if (!id || !confirm("Delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    load();
  }

  if (editing) {
    return (
      <div>
        <div className="admin-toolbar">
          <h1 className="admin-h1">{editing._id ? "Edit project" : "New project"}</h1>
          <button className="admin-btn ghost" onClick={() => setEditing(null)}>
            ← Back
          </button>
        </div>
        <div className="admin-card">
          <div className="admin-row">
            <div className="admin-field">
              <label>Title</label>
              <input value={editing.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Slug (URL, optional)</label>
              <input value={editing.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />
            </div>
          </div>
          <div className="admin-row">
            <div className="admin-field">
              <label>Category (primary tag)</label>
              <input value={editing.category} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Tags (comma separated)</label>
              <input
                value={editing.tags.join(", ")}
                onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              />
            </div>
          </div>
          <div className="admin-field">
            <label>Excerpt (short summary on cards)</label>
            <textarea rows={2} value={editing.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Description (full — separate paragraphs with a blank line)</label>
            <textarea rows={6} value={editing.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          <MediaUploader
            label="Cover image / video"
            value={editing.coverImage}
            folder="portfolio/projects"
            onChange={(url) => set("coverImage", url)}
          />

          <div className="admin-row">
            <div className="admin-field">
              <label>Image overlay title (optional — shown on cover image)</label>
              <input value={editing.overlayTitle} onChange={(e) => set("overlayTitle", e.target.value)} placeholder="e.g. CRM TECH-O ft. SINEO" />
            </div>
            <div className="admin-field">
              <label>Image overlay subtitle (optional)</label>
              <input value={editing.overlaySub} onChange={(e) => set("overlaySub", e.target.value)} placeholder="e.g. UX/UI DESIGN" />
            </div>
          </div>

          <div className="admin-field">
            <label>Gallery visuals</label>
            {editing.visuals.map((v, i) => (
              <div key={i} className="admin-media-row" style={{ marginBottom: 6 }}>
                {/\.(mp4|webm|mov|ogg)(\?|$)/i.test(v) ? (
                  <video src={v} className="admin-thumb" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v} className="admin-thumb" alt="" />
                )}
                <span style={{ fontSize: ".8rem", color: "#8b93a3", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                <button
                  className="admin-btn danger"
                  onClick={() => set("visuals", editing.visuals.filter((_, idx) => idx !== i))}
                >
                  Remove
                </button>
              </div>
            ))}
            <MediaUploader
              label="Add a visual"
              value=""
              folder="portfolio/projects"
              onChange={(url) => url && set("visuals", [...editing.visuals, url])}
            />
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label>Client</label>
              <input value={editing.client} onChange={(e) => set("client", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Role</label>
              <input value={editing.role} onChange={(e) => set("role", e.target.value)} />
            </div>
          </div>
          <div className="admin-row">
            <div className="admin-field">
              <label>Year</label>
              <input value={editing.year} onChange={(e) => set("year", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Order (lower = first)</label>
              <input type="number" value={editing.order} onChange={(e) => set("order", Number(e.target.value))} />
            </div>
          </div>
          <div className="admin-row">
            <div className="admin-field">
              <label>Live URL</label>
              <input value={editing.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>GitHub URL</label>
              <input value={editing.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
            </div>
          </div>
          <div className="admin-field">
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                style={{ width: "auto" }}
                checked={editing.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured on home page
            </label>
          </div>

          {error && <div className="admin-error">{error}</div>}
          <button className="admin-btn" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save project"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-h1">Projects</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>Manage your portfolio projects.</p>
        </div>
        <button className="admin-btn" onClick={() => setEditing({ ...EMPTY })}>
          + New project
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ color: "#8b93a3" }}>No projects yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Category</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td>
                    {p.coverImage &&
                      (/\.(mp4|webm|mov|ogg)(\?|$)/i.test(p.coverImage) ? (
                        <video src={p.coverImage} className="admin-thumb" muted />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} className="admin-thumb" alt="" />
                      ))}
                  </td>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>{p.featured ? <span className="admin-pill unread">Featured</span> : "—"}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="admin-btn ghost" onClick={() => setEditing(p)}>
                      Edit
                    </button>
                    <button className="admin-btn danger" onClick={() => remove(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
