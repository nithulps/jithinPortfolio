"use client";

import { useState, useRef } from "react";

interface UploadStatus {
  name: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

export default function MultiFileUploader({
  label = "Add files",
  folder = "portfolio",
  onAdd,
}: {
  label?: string;
  folder?: string;
  onAdd: (urls: string[]) => void;
}) {
  const [statuses, setStatuses] = useState<UploadStatus[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadSingle(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || "Upload failed");
    return j.url as string;
  }

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (!arr.length) return;

    setStatuses(arr.map((f) => ({ name: f.name, status: "pending" })));

    const urls: string[] = [];

    for (let i = 0; i < arr.length; i++) {
      setStatuses((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "uploading" } : s))
      );
      try {
        const url = await uploadSingle(arr[i]);
        if (url) urls.push(url);
        setStatuses((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "done" } : s))
        );
      } catch (err) {
        setStatuses((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: "error", error: err instanceof Error ? err.message : "Failed" }
              : s
          )
        );
      }
    }

    if (urls.length) onAdd(urls);
    setTimeout(() => setStatuses([]), 2000);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }

  const isUploading = statuses.some((s) => s.status === "uploading" || s.status === "pending");

  return (
    <div style={{ marginTop: 8 }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          border: dragActive ? "2px dashed #00deff" : "2px dashed #2a3340",
          backgroundColor: dragActive ? "rgba(0,222,255,0.05)" : "#11151a",
          borderRadius: 10,
          padding: "20px 16px",
          textAlign: "center",
          cursor: isUploading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
        }}
        className="uploader-zone"
      >
        {isUploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div className="uploader-spinner" />
            <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 6 }}>
              {statuses.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem" }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                    background: s.status === "done" ? "#00deff" : s.status === "error" ? "#ff8095" : "#2a3340",
                  }} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#aab2c0" }}>{s.name}</span>
                  <span style={{ color: s.status === "error" ? "#ff8095" : "#6a768a", flexShrink: 0 }}>
                    {s.status === "uploading" ? "Uploading…" : s.status === "done" ? "✓" : s.status === "error" ? s.error : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={dragActive ? "#00deff" : "#aab2c0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ fontSize: "0.9rem", color: "#e7e9ee" }}>
              {label} - <span style={{ color: "#00deff", fontWeight: 500 }}>browse</span> or drag & drop
            </span>
            <span style={{ fontSize: "0.78rem", color: "#6a768a" }}>
              Select multiple files at once · images, videos, PDFs
            </span>
          </div>
        )}
      </div>

      <style jsx global>{`
        .uploader-zone:hover { border-color: #00deff !important; background-color: rgba(0,222,255,0.02) !important; }
        .uploader-spinner { width: 24px; height: 24px; border: 3px solid rgba(0,222,255,0.1); border-radius: 50%; border-top-color: #00deff; animation: uploader-spin 0.8s ease-in-out infinite; }
        @keyframes uploader-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
