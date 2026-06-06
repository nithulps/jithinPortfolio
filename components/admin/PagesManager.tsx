"use client";

import { useEffect, useState } from "react";
import MediaUploader from "@/components/admin/MediaUploader";
import MultiFileUploader from "@/components/admin/MultiFileUploader";

interface Section {
  sectionTitle: string;
  sectionSlug: string;
  sectionBody: string;
  sectionImage: string;
  sectionFiles: string[];
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

const EMPTY_SECTION: Section = { sectionTitle: "", sectionSlug: "", sectionBody: "", sectionImage: "", sectionFiles: [], showOnHomepage: false, sectionOverlayTitle: "", sectionOverlaySub: "" };

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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"basic" | "sections" | "settings">("basic");

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

  function setSection(index: number, key: keyof Section, val: string | boolean | string[]) {
    if (!editing) return;
    const updated = editing.sections.map((s, i) =>
      i === index ? { ...s, [key]: val } : s
    );
    set("sections", updated);
  }

  function addSection() {
    if (!editing) return;
    const newIndex = editing.sections.length;
    set("sections", [...editing.sections, { ...EMPTY_SECTION }]);
    setExpandedIndex(newIndex);
  }

  function removeSection(index: number) {
    if (!editing) return;
    const updated = editing.sections.filter((_, i) => i !== index);
    set("sections", updated);
    
    if (expandedIndex === index) {
      setExpandedIndex(updated.length > 0 ? Math.max(0, index - 1) : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  }

  function moveSection(index: number, direction: -1 | 1) {
    if (!editing) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= editing.sections.length) return;
    
    const updated = [...editing.sections];
    [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];
    set("sections", updated);
    
    if (expandedIndex === index) {
      setExpandedIndex(nextIndex);
    } else if (expandedIndex === nextIndex) {
      setExpandedIndex(index);
    }
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
          <div style={{ display: "flex", gap: 8 }}>
            <button className="admin-btn ghost" onClick={() => { setEditing(null); setActiveTab("basic"); }}>
              ← Back
            </button>
            <button className="admin-btn" onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save page"}
            </button>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-card">
          {/* Tab Navigation */}
          {!isBuiltIn && (
            <div className="admin-tabs-nav">
              <button type="button" className={`admin-tab-btn ${activeTab === "basic" ? "active" : ""}`} onClick={() => setActiveTab("basic")}>
                Basic Info
              </button>
              <button type="button" className={`admin-tab-btn ${activeTab === "sections" ? "active" : ""}`} onClick={() => setActiveTab("sections")}>
                Sections {editing.sections.length > 0 && `(${editing.sections.length})`}
              </button>
              <button type="button" className={`admin-tab-btn ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
                Settings
              </button>
            </div>
          )}

          {/* Built-in info note */}
          {isBuiltIn && (
            <p style={{ color: "#8b93a3", margin: "0 0 16px" }}>
              <strong>{editing.title}</strong> is a built-in section managed from its dedicated editor. Use Settings below to control visibility.
            </p>
          )}

          {/* Tab: Basic Info */}
          {!isBuiltIn && activeTab === "basic" && (
            <>
              <div className="admin-field">
                <label>Title</label>
                <input
                  value={editing.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                    setEditing((p) => p ? { ...p, title, slug } : p);
                  }}
                />
              </div>
              <div className="admin-field">
                <label>Page heading</label>
                <input value={editing.heading} onChange={(e) => set("heading", e.target.value)} placeholder="Shown at the top of the page" />
              </div>
              <div className="admin-row">
                <div className="admin-field">
                  <label>Subtitle</label>
                  <input value={editing.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
                </div>
              </div>
              <div className="admin-field">
                <label>Description (HTML allowed)</label>
                <textarea rows={4} value={editing.description} onChange={(e) => set("description", e.target.value)} />
              </div>
            </>
          )}

          {/* Tab: Sections */}
          {!isBuiltIn && activeTab === "sections" && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button type="button" className="admin-btn" style={{ fontSize: "0.85rem", padding: "6px 12px" }} onClick={addSection}>
                  + Add section
                </button>
              </div>
              {editing.sections.length === 0 ? (
                <p style={{ color: "#8b93a3", textAlign: "center", padding: "24px 0", border: "1px dashed #2a3340", borderRadius: 8, margin: 0 }}>
                  No sections yet. Click "+ Add section" to start building your content.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {editing.sections.map((sec, i) => {
                    const isExpanded = expandedIndex === i;
                    const titleText = sec.sectionTitle ? `Section ${i + 1}: ${sec.sectionTitle}` : `Section ${i + 1} (Untitled)`;
                    return (
                      <div key={i} style={{ border: "1px solid #1e2530", borderRadius: 8, overflow: "hidden", backgroundColor: "#11151a" }}>
                        <div
                          onClick={() => setExpandedIndex(isExpanded ? null : i)}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: isExpanded ? "rgba(0, 222, 255, 0.04)" : "#11151a", borderBottom: isExpanded ? "1px solid #1e2530" : "none", cursor: "pointer", userSelect: "none" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ color: "#00deff", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease", display: "inline-block", fontSize: "0.8rem" }}>▶</span>
                            <span style={{ fontWeight: 600, fontSize: "0.95rem", color: isExpanded ? "#ffffff" : "#aab2c0" }}>{titleText}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                            <button type="button" className="admin-btn ghost" style={{ padding: "3px 8px", fontSize: "0.75rem" }} disabled={i === 0} onClick={() => moveSection(i, -1)} title="Move Up">↑</button>
                            <button type="button" className="admin-btn ghost" style={{ padding: "3px 8px", fontSize: "0.75rem" }} disabled={i === editing.sections.length - 1} onClick={() => moveSection(i, 1)} title="Move Down">↓</button>
                            <button type="button" className="admin-btn danger" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={() => removeSection(i)}>Delete</button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div style={{ padding: 16, backgroundColor: "#161c24" }}>
                            <div className="admin-field">
                              <label>Section title</label>
                              <input
                                value={sec.sectionTitle}
                                onChange={(e) => {
                                  const sectionTitle = e.target.value;
                                  const sectionSlug = sectionTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                                  if (!editing) return;
                                  const updated = editing.sections.map((s, idx) =>
                                    idx === i ? { ...s, sectionTitle, sectionSlug } : s
                                  );
                                  set("sections", updated);
                                }}
                                placeholder="Heading of this section"
                              />
                            </div>
                            <div className="admin-field">
                              <label>Section body (HTML allowed)</label>
                              <textarea rows={4} value={sec.sectionBody} onChange={(e) => setSection(i, "sectionBody", e.target.value)} placeholder="Main description or content..." />
                            </div>
                            <MediaUploader label="Cover image (shown on listing card)" value={sec.sectionImage} folder="portfolio/pages" allowPdf onChange={(url) => setSection(i, "sectionImage", url)} />

                            {/* Multi-file gallery for detail page */}
                            <div className="admin-field" style={{ marginTop: 8 }}>
                              <label style={{ fontWeight: 600, fontSize: "0.95rem", color: "#aab2c0", marginBottom: 8, display: "block" }}>
                                Detail page files ({sec.sectionFiles?.length || 0}) — images, videos, PDFs
                              </label>
                              {(sec.sectionFiles || []).length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 12 }}>
                                  {(sec.sectionFiles || []).map((url, fi) => (
                                    <div key={fi} style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#1e2530", border: "1px solid #2a3340", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                      {/\.(mp4|webm|mov|ogg)(\?|$)/i.test(url) ? (
                                        <video src={url} muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                      ) : /\.pdf(\?|$)/i.test(url) || url.includes("/raw/upload/") ? (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff8095" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                          <span style={{ fontSize: "0.75rem", color: "#aab2c0" }}>PDF</span>
                                        </div>
                                      ) : (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => setSection(i, "sectionFiles", (sec.sectionFiles || []).filter((_, idx) => idx !== fi))}
                                        style={{
                                          position: "absolute", top: 6, right: 6,
                                          width: 24, height: 24, borderRadius: "50%",
                                          background: "rgba(0,0,0,0.7)", border: "none",
                                          color: "#fff", cursor: "pointer",
                                          display: "flex", alignItems: "center", justifyContent: "center",
                                          fontSize: 14, lineHeight: 1, fontWeight: 700,
                                        }}
                                        title="Remove"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <MultiFileUploader
                                folder="portfolio/pages"
                                onAdd={(urls) => setSection(i, "sectionFiles", [...(sec.sectionFiles || []), ...urls])}
                              />
                            </div>

                            <div className="admin-row" style={{ marginTop: 8 }}>
                              <div className="admin-field">
                                <label>Image overlay title (optional)</label>
                                <input value={sec.sectionOverlayTitle || ""} onChange={(e) => setSection(i, "sectionOverlayTitle", e.target.value)} placeholder="Text shown on image hover" />
                              </div>
                              <div className="admin-field">
                                <label>Image overlay subtitle (optional)</label>
                                <input value={sec.sectionOverlaySub || ""} onChange={(e) => setSection(i, "sectionOverlaySub", e.target.value)} placeholder="Subtext shown on image hover" />
                              </div>
                            </div>
                            <div className="admin-field" style={{ marginTop: 8 }}>
                              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <input type="checkbox" style={{ width: "auto" }} checked={sec.showOnHomepage ?? false} onChange={(e) => setSection(i, "showOnHomepage", e.target.checked)} />
                                Show this section on homepage
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Tab: Settings (also shown for built-in pages) */}
          {(activeTab === "settings" || isBuiltIn) && (
            <>
              <div className="admin-field">
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="checkbox" style={{ width: "auto" }} checked={editing.showInNavbar} onChange={(e) => set("showInNavbar", e.target.checked)} />
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
                  <input type="checkbox" style={{ width: "auto" }} checked={editing.showOnHomepage} onChange={(e) => set("showOnHomepage", e.target.checked)} />
                  Show on homepage
                </label>
              </div>
              {editing.showOnHomepage && !isBuiltIn && (
                <div className="admin-field">
                  <label>Homepage excerpt</label>
                  <textarea rows={2} value={editing.homepageExcerpt} onChange={(e) => set("homepageExcerpt", e.target.value)} placeholder="Short text shown in the homepage section" />
                </div>
              )}
              {!isBuiltIn && (
                <div className="admin-field" style={{ marginTop: 16 }}>
                  <label style={{ fontWeight: 600, marginBottom: 10, display: "block" }}>Sections display mode</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    {(["grid", "list"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => set("displayMode", mode)}
                        style={{
                          flex: 1,
                          padding: "14px 12px",
                          borderRadius: 10,
                          border: editing.displayMode === mode ? "2px solid #00deff" : "2px solid #2a3340",
                          backgroundColor: editing.displayMode === mode ? "rgba(0,222,255,0.06)" : "#11151a",
                          color: editing.displayMode === mode ? "#00deff" : "#aab2c0",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                          transition: "all 0.15s ease",
                        }}
                      >
                        {mode === "grid" ? (
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                          </svg>
                        ) : (
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="5" rx="1" /><rect x="3" y="10" width="18" height="5" rx="1" /><rect x="3" y="17" width="18" height="5" rx="1" />
                          </svg>
                        )}
                        <span style={{ fontWeight: 600, fontSize: "0.85rem", textTransform: "capitalize" }}>{mode}</span>
                        <span style={{ fontSize: "0.75rem", color: "#6a768a", textAlign: "center" }}>
                          {mode === "grid" ? "2-column card grid (like Projects)" : "Full-width rows (like Services)"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
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
