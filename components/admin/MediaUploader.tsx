"use client";

import { useState } from "react";

export default function MediaUploader({
  label,
  value,
  onChange,
  folder = "portfolio",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Upload failed");
      onChange(j.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const isVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(value);

  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className="admin-media-row">
        {value &&
          (isVideo ? (
            <video src={value} className="admin-thumb" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} className="admin-thumb" alt="preview" />
          ))}
        <input type="file" accept="image/*,video/*" onChange={handleFile} disabled={uploading} />
        {uploading && <span style={{ color: "#00deff", fontSize: ".85rem" }}>Uploading…</span>}
      </div>
      <input
        type="text"
        placeholder="…or paste a URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="admin-error">{error}</div>}
    </div>
  );
}
