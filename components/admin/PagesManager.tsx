"use client";

import { useEffect, useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

interface Section {
  sectionTitle: string;
  sectionBody: string;
  sectionImage: string;
  showOnHomepage: boolean;
  sectionOverlayTitle: string;
  sectionOverlaySub: string;
}

interface PageItem {
  _id?: string;
  title: string;
  slug: string;
  heading: string;
  subtitle: string;
  description: string;
  image: string;
  sections: Section[];
  showInNavbar: boolean;
  navLabel: string;
  showOnHomepage: boolean;
  homepageExcerpt: string;
  order: number;
  builtIn: boolean;
  builtInKey: string;
  displayMode: "list" | "grid";
  gridColumns: 2 | 3;
}

const EMPTY_SECTION: Section = { sectionTitle: "", sectionBody: "", sectionImage: "", showOnHomepage: false, sectionOverlayTitle: "", sectionOverlaySub: "" };

const EMPTY: PageItem = {
  title: "",
  slug: "",
  heading: "",
  subtitle: "",
  description: "",
  image: "",
  sections: [],
  showInNavbar: false,
  navLabel: "",
  showOnHomepage: false,
  homepageExcerpt: "",
  order: 0,
  builtIn: false,
  builtInKey: "",
  displayMode: "grid",
  gridColumns: 2,
};

export default function PagesManager() {
  const [items, setItems] = useState<PageItem[]>([]);
  const [editing, setEditing] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      // Only show custom (non-built-in) pages here
      const custom = Array.isArray(data) ? data.filter((p: PageItem) => !p.builtIn) : [];
      setItems(custom);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function set<K extends keyof PageItem>(key: K, val: PageItem[K]) {
    setEditing((p) => (p ? { ...p, [key]: val } : p));
  }

  function setSection(index: number, key: keyof Section, val: string | boolean) {
    if (!editing) return;
    const updated = editing.sections.map((s, i) =>
      i === index ? { ...s, [key]: val } : s
    );
    set("sections", updated);
  }

  function addSection() {
    if (!editing) return;
    set("sections", [...editing.sections, { ...EMPTY_SECTION }]);
  }

  function removeSection(index: number) {
    if (!editing) return;
    set("sections", editing.sections.filter((_, i) => i !== index));
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    const isNew = !editing._id;
    const res = await fetch(
      isNew ? "/api/admin/pages" : `/api/admin/pages/${editing._id}`,
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
    if (!id || !confirm("Delete this page?")) return;
    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Could not delete page.");
        return;
      }
      setError("");
      load();
    } catch {
      setError("Could not delete page.");
    }
  }

  const isBuiltIn = editing?.builtIn ?? false;

  if (editing) {
    return (
      <div>
        <div className="admin-toolbar">
          <h1 className="admin-h1">
            {editing._id ? "Edit page" : "New page"}
            {isBuiltIn && (
              <span style={{ fontSize: ".7em", color: "var(--cyan)", marginLeft: 10 }}>Built-in</span>
            )}
          </h1>
          <button className="admin-btn ghost" onClick={() => setEditing(null)}>
            ← Back
          </button>
        </div>

        {/* Content fields — only for custom pages */}
        {!isBuiltIn && (
          <>
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
              <div className="admin-field">
                <label>Page heading</label>
                <input value={editing.heading} onChange={(e) => set("heading", e.target.value)} placeholder="Shown at the top of the page" />
              </div>
              <div className="admin-field">
                <label>Subtitle</label>
                <input value={editing.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Description (HTML allowed)</label>
                <textarea rows={4} value={editing.description} onChange={(e) => set("description", e.target.value)} />
              </div>
            </div>

            {/* Sections */}
            <div className="admin-card">
              <h3 style={{ marginBottom: 14 }}>Content Sections</h3>
              {editing.sections.map((sec, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,.06)", paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 600, color: "#8b93a3" }}>Section {i + 1}</h4>
                    <button
                      type="button"
                      className="admin-btn danger"
                      style={{ padding: "4px 10px", fontSize: "0.8rem", width: "auto" }}
                      onClick={() => removeSection(i)}
                    >
                      Remove Section
                    </button>
                  </div>
                  <div className="admin-field">
                    <label>Section title</label>
                    <input value={sec.sectionTitle} onChange={(e) => setSection(i, "sectionTitle", e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Section body (HTML allowed)</label>
                    <textarea rows={3} value={sec.sectionBody} onChange={(e) => setSection(i, "sectionBody", e.target.value)} />
                  </div>
                  <MediaUploader
                    label="Section image"
                    value={sec.sectionImage}
                    folder="portfolio/pages"
                    onChange={(url) => setSection(i, "sectionImage", url)}
                  />
                  <div className="admin-row" style={{ marginTop: 8 }}>
                    <div className="admin-field">
                      <label>Image overlay title (optional)</label>
                      <input value={sec.sectionOverlayTitle || ""} onChange={(e) => setSection(i, "sectionOverlayTitle", e.target.value)} placeholder="Text on image" />
                    </div>
                    <div className="admin-field">
                      <label>Image overlay subtitle (optional)</label>
                      <input value={sec.sectionOverlaySub || ""} onChange={(e) => setSection(i, "sectionOverlaySub", e.target.value)} placeholder="Subtext on image" />
                    </div>
                  </div>
                  <div className="admin-field" style={{ marginTop: 8 }}>
                    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        style={{ width: "auto" }}
                        checked={sec.showOnHomepage ?? false}
                        onChange={(e) => setSection(i, "showOnHomepage", e.target.checked)}
                      />
                      Show this section on homepage
                    </label>
                  </div>
                </div>
              ))}
              <button className="admin-btn ghost" onClick={addSection}>
                + Add section
              </button>
            </div>
          </>
        )}

        {/* Built-in info note */}
        {isBuiltIn && (
          <div className="admin-card">
            <p style={{ color: "#8b93a3", margin: 0 }}>
              <strong>{editing.title}</strong> is a built-in section. Content is managed from its dedicated editor
              {editing.builtInKey === "hero" && " (Hero)"}
              {editing.builtInKey === "projects" && " (Projects)"}
              {editing.builtInKey === "competency" && " (Hero → Competency statement)"}
              {editing.builtInKey === "services" && " (Services)"}
              {editing.builtInKey === "about" && " (About)"}
              {editing.builtInKey === "contact" && " (Contact)"}
              . You can control its visibility and sort order below.
            </p>
          </div>
        )}

        {/* Visibility & ordering — for ALL pages */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 14 }}>Visibility &amp; Order</h3>
          <div className="admin-field">
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                style={{ width: "auto" }}
                checked={editing.showInNavbar}
                onChange={(e) => set("showInNavbar", e.target.checked)}
              />
              Show in navbar
            </label>
          </div>
          {editing.showInNavbar && (
            <div className="admin-field">
              <label>Navbar label (defaults to title)</label>
              <input value={editing.navLabel} onChange={(e) => set("navLabel", e.target.value)} placeholder={editing.title || "Page title"} />
            </div>
          )}
          <div className="admin-field">
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                style={{ width: "auto" }}
                checked={editing.showOnHomepage}
                onChange={(e) => set("showOnHomepage", e.target.checked)}
              />
              Show on homepage
            </label>
          </div>
          {editing.showOnHomepage && !isBuiltIn && (
            <div className="admin-field">
              <label>Homepage excerpt</label>
              <textarea rows={2} value={editing.homepageExcerpt} onChange={(e) => set("homepageExcerpt", e.target.value)} placeholder="Short text shown in the homepage section" />
            </div>
          )}
          <div className="admin-field">
            <label>Sort order (lower = first)</label>
            <input type="number" value={editing.order} onChange={(e) => set("order", Number(e.target.value))} />
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}
        <button className="admin-btn" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save page"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-h1">Pages</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Manage custom pages. For homepage section order, use{" "}
            <a href="/admin/site-settings" style={{ color: "#00deff", textDecoration: "underline" }}>Site Settings</a>.
          </p>
        </div>
        <button className="admin-btn" onClick={() => setEditing({ ...EMPTY })}>
          + New page
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ color: "#8b93a3" }}>No custom pages yet. Click &ldquo;+ New page&rdquo; to create one.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Order</th>
                <th>Navbar</th>
                <th>Homepage</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td style={{ color: "#8b93a3", fontSize: ".85rem" }}>/{p.slug}</td>
                  <td>{p.order}</td>
                  <td>{p.showInNavbar ? <span className="admin-pill unread">Yes</span> : "—"}</td>
                  <td>{p.showOnHomepage ? <span className="admin-pill unread">Yes</span> : "—"}</td>
                  <td>
                    {p.builtIn ? (
                      <span style={{ color: "var(--cyan)", fontSize: ".8rem" }}>Built-in</span>
                    ) : (
                      <span style={{ color: "#8b93a3", fontSize: ".8rem" }}>Custom</span>
                    )}
                  </td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="admin-btn ghost" onClick={() => setEditing(p)}>
                      Edit
                    </button>
                    {!p.builtIn && (
                      <button className="admin-btn danger" onClick={() => remove(p._id)}>
                        Delete
                      </button>
                    )}
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
