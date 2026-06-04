"use client";

import { useEffect, useState } from "react";

interface Service {
  _id?: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  order: number;
}

const EMPTY: Service = {
  title: "",
  slug: "",
  icon: "",
  shortDescription: "",
  longDescription: "",
  features: [],
  order: 0,
};

export default function ServicesManager() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function set<K extends keyof Service>(k: K, v: Service[K]) {
    setEditing((s) => (s ? { ...s, [k]: v } : s));
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    setError("");
    const isNew = !editing._id;
    const res = await fetch(isNew ? "/api/admin/services" : `/api/admin/services/${editing._id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
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
    if (!id || !confirm("Delete this service?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    load();
  }

  if (editing) {
    return (
      <div>
        <div className="admin-toolbar">
          <h1 className="admin-h1">{editing._id ? "Edit service" : "New service"}</h1>
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
              <label>Slug (optional)</label>
              <input value={editing.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />
            </div>
          </div>
          <div className="admin-field">
            <label>Icon (inline SVG markup)</label>
            <textarea rows={3} value={editing.icon} onChange={(e) => set("icon", e.target.value)} placeholder="<svg ...>...</svg>" />
          </div>
          <div className="admin-field">
            <label>Short description (cards)</label>
            <textarea rows={2} value={editing.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Long description (services page)</label>
            <textarea rows={4} value={editing.longDescription} onChange={(e) => set("longDescription", e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Features (one per line)</label>
            <textarea
              rows={4}
              value={editing.features.join("\n")}
              onChange={(e) => set("features", e.target.value.split("\n").map((f) => f.trim()).filter(Boolean))}
            />
          </div>
          <div className="admin-field">
            <label>Order (lower = first)</label>
            <input type="number" value={editing.order} onChange={(e) => set("order", Number(e.target.value))} />
          </div>
          {error && <div className="admin-error">{error}</div>}
          <button className="admin-btn" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save service"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <div>
          <h1 className="admin-h1">Services</h1>
          <p className="admin-sub" style={{ marginBottom: 0 }}>Manage the services you offer.</p>
        </div>
        <button className="admin-btn" onClick={() => setEditing({ ...EMPTY })}>
          + New service
        </button>
      </div>
      <div className="admin-card">
        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p style={{ color: "#8b93a3" }}>No services yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Features</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td>{s.title}</td>
                  <td>{s.features?.length || 0}</td>
                  <td>{s.order}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="admin-btn ghost" onClick={() => setEditing(s)}>
                      Edit
                    </button>
                    <button className="admin-btn danger" onClick={() => remove(s._id)}>
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
