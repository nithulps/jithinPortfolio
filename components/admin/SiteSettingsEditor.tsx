"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import MediaUploader from "@/components/admin/MediaUploader";

interface SectionRow {
  _id: string;
  title: string;
  slug: string;
  order: number;
  builtIn: boolean;
  builtInKey: string;
  showOnHomepage: boolean;
  showInNavbar: boolean;
  navLabel: string;
}

const BUILT_IN_LABEL: Record<string, string> = {
  projects: "Projects",
  services: "Services",
  competency: "Competency",
  about: "About",
  contact: "Contact",
};

const badgeStyle = (bg: string, color: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 100,
  background: bg,
  color,
  fontSize: "0.78rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
});

const arrowColStyle: React.CSSProperties = {
  display: "flex",
  gap: 4,
};

const getRowStyle = (isLast: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 0",
  borderBottom: isLast ? "none" : "1px solid #1e2530",
});

export default function SiteSettingsEditor() {
  const [rows, setRows] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"order" | "visibility" | "branding" | "security">("order");

  // Branding (logo) state
  const [logo, setLogo] = useState("");
  const [savingLogo, setSavingLogo] = useState(false);

  // Admin credentials state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingCreds, setUpdatingCreds] = useState(false);
  const [credError, setCredError] = useState("");
  const [credSuccess, setCredSuccess] = useState("");

  // Password visibility state
  const [showNewPassword, setShowNewPassword] = useState(false);
  const credFormRef = useRef<HTMLFormElement>(null);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCredError("");
    setCredSuccess("");

    if (newPassword.length < 4) {
      setCredError("Password must be at least 4 characters long.");
      return;
    }

    setUpdatingCreds(true);
    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newUsername,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update credentials.");
      }

      setCredSuccess("Credentials updated successfully! Redirecting to login...");
      setNewUsername("");
      setNewPassword("");
      
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 2000);
    } catch (err) {
      setCredError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setUpdatingCreds(false);
    }
  }


  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data: SectionRow[] = await res.json();
      const filtered = data.filter(r => !(r.builtIn && (r.builtInKey === "about" || r.builtInKey === "contact")));
      const sorted = filtered.sort((a, b) => a.order - b.order);
      setRows(sorted);
    } catch {
      setError("Could not load pages.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/about");
        const j = await res.json();
        setLogo(j.logo || "");
      } catch {
        // ignore — logo stays empty
      }
    })();
  }, []);

  async function saveLogo() {
    setSavingLogo(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Could not save logo.");
    }
    setSavingLogo(false);
  }

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= rows.length) return;
    const updated = [...rows];
    [updated[index], updated[next]] = [updated[next], updated[index]];
    // Re-assign sequential order values
    const reordered = updated.map((r, i) => ({ ...r, order: i + 1 }));
    setRows(reordered);
    setSaved(false);
  }

  function toggleHomepage(id: string, checked: boolean) {
    setRows((prev) =>
      prev.map((r) => (r._id === id ? { ...r, showOnHomepage: checked } : r))
    );
    setSaved(false);
  }

  async function saveOrder() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await Promise.all(
        rows.map((r) =>
          fetch(`/api/admin/pages/${r._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order: r.order,
              showInNavbar: r.showInNavbar,
              navLabel: r.navLabel,
              showOnHomepage: r.showOnHomepage,
            }),
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Could not save changes.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div>
        <h1 className="admin-h1">Site Settings</h1>
        <p className="admin-sub">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-h1">Site Settings</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>
            Control homepage section order, visibility, and admin security settings.
          </p>
        </div>
        <button
          className="admin-btn"
          onClick={() =>
            activeTab === "security"
              ? credFormRef.current?.requestSubmit()
              : activeTab === "branding"
                ? saveLogo()
                : saveOrder()
          }
          disabled={saving || updatingCreds || savingLogo}
        >
          {activeTab === "security"
            ? (updatingCreds ? "Updating…" : "Update Credentials")
            : activeTab === "branding"
              ? (savingLogo ? "Saving…" : "Save logo")
              : (saving ? "Saving…" : "Save changes")}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs-nav" style={{ marginBottom: 24 }}>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "order" ? "active" : ""}`}
          onClick={() => setActiveTab("order")}
        >
          Section Order
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "visibility" ? "active" : ""}`}
          onClick={() => setActiveTab("visibility")}
        >
          Section Visibility
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "branding" ? "active" : ""}`}
          onClick={() => setActiveTab("branding")}
        >
          Branding
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Admin Security
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {saved && <div className="admin-ok">✓ Changes saved successfully!</div>}

      {/* Tab 1: Section Order */}
      {activeTab === "order" && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 6, fontSize: "1rem", fontWeight: 700 }}>
            Homepage Section Order
          </h3>
          <p style={{ color: "#8b93a3", fontSize: "0.85rem", marginBottom: 18 }}>
            Use ↑ ↓ to reorder how sections appear on the homepage. <strong>Hero</strong> is always first and pinned.
          </p>

          {/* Hero — always pinned first */}
          <div style={{ ...getRowStyle(false), opacity: 0.45 }}>
            <div style={{ minWidth: 72 }}>
              <span style={badgeStyle("#1a2030", "#8b93a3")}>Built-in</span>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600 }}>Hero</span>
              <span style={{ color: "#8b93a3", fontSize: "0.8rem", marginLeft: 8 }}>
                (always first — pinned)
              </span>
            </div>
            <div style={{ color: "#8b93a3", fontSize: "0.82rem", minWidth: 40, textAlign: "center" }}>
              #0
            </div>
            <div style={arrowColStyle}>
              <button className="admin-btn ghost" disabled style={{ padding: "4px 10px", opacity: 0.3 }}>↑</button>
              <button className="admin-btn ghost" disabled style={{ padding: "4px 10px", opacity: 0.3 }}>↓</button>
            </div>
          </div>

          {rows.map((row, i) => {
            const isBuiltIn = row.builtIn;
            return (
              <div key={row._id} style={getRowStyle(i === rows.length - 1)}>
                <div style={{ minWidth: 72 }}>
                  <span
                    style={
                      isBuiltIn
                        ? badgeStyle("rgba(0,222,255,0.12)", "#00deff")
                        : badgeStyle("#1e2530", "#aab2c0")
                    }
                  >
                    {isBuiltIn
                      ? (BUILT_IN_LABEL[row.builtInKey] ? "Built-in" : "Built-in")
                      : "Custom"}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600 }}>{row.title}</span>
                  <span style={{ color: "#8b93a3", fontSize: "0.82rem", marginLeft: 8 }}>
                    /{row.slug}
                  </span>
                  {!row.showOnHomepage && (
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: "0.75rem",
                        color: "#ff8095",
                        background: "rgba(255,84,112,0.1)",
                        padding: "2px 8px",
                        borderRadius: 100,
                      }}
                    >
                      Hidden from homepage
                    </span>
                  )}
                </div>
                <div style={{ color: "#8b93a3", fontSize: "0.82rem", minWidth: 40, textAlign: "center" }}>
                  #{i + 1}
                </div>
                <div style={arrowColStyle}>
                  <button
                    className="admin-btn ghost"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    style={{ padding: "4px 10px" }}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="admin-btn ghost"
                    onClick={() => move(i, 1)}
                    disabled={i === rows.length - 1}
                    style={{ padding: "4px 10px" }}
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Section Visibility */}
      {activeTab === "visibility" && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 6, fontSize: "1rem", fontWeight: 700 }}>
            Homepage Visibility
          </h3>
          <p style={{ color: "#8b93a3", fontSize: "0.85rem", marginBottom: 18 }}>
            Toggle whether each section appears on the homepage. Save changes after editing.
          </p>
          {rows.map((row, i) => (
            <div
              key={row._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 0",
                borderBottom: i === rows.length - 1 ? "none" : "1px solid #1e2530",
              }}
            >
              <input
                type="checkbox"
                id={`hp-${row._id}`}
                checked={row.showOnHomepage}
                onChange={(e) => toggleHomepage(row._id, e.target.checked)}
                style={{ accentColor: "#00deff", width: 16, height: 16, cursor: "pointer" }}
              />
              <label
                htmlFor={`hp-${row._id}`}
                style={{ cursor: "pointer", flex: 1, fontWeight: 500 }}
              >
                {row.title}
                <span style={{ color: "#8b93a3", fontSize: "0.82rem", marginLeft: 8 }}>
                  /{row.slug}
                </span>
              </label>
              <span
                style={
                  row.builtIn
                    ? badgeStyle("rgba(0,222,255,0.12)", "#00deff")
                    : badgeStyle("#1e2530", "#aab2c0")
                }
              >
                {row.builtIn ? "Built-in" : "Custom"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Branding */}
      {activeTab === "branding" && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 6, fontSize: "1rem", fontWeight: 700 }}>
            Site Logo
          </h3>
          <p style={{ color: "#8b93a3", fontSize: "0.85rem", marginBottom: 18 }}>
            Upload the logo shown in the site header. Leave empty to use the default
            &ldquo;J.&rdquo; text mark. Save logo after uploading.
          </p>
          <MediaUploader
            label="Header logo"
            value={logo}
            onChange={setLogo}
            folder="branding"
          />
        </div>
      )}

      {/* Tab 4: Admin Credentials */}
      {activeTab === "security" && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 6, fontSize: "1rem", fontWeight: 700 }}>
            Admin Credentials
          </h3>
          <p style={{ color: "#8b93a3", fontSize: "0.85rem", marginBottom: 18 }}>
            Change your admin username and password. Saving will log you out, requiring you to log back in with your new credentials.
          </p>

          {credError && <div className="admin-error">{credError}</div>}
          {credSuccess && <div className="admin-ok">{credSuccess}</div>}

          <form ref={credFormRef} onSubmit={handleCredentialsSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>New Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. admin"
                required
              />
            </div>
            
            <div className="admin-field">
              <label style={{ fontWeight: 600 }}>New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters recommended"
                  required
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
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
                  {showNewPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}
    </div>
  );
}

