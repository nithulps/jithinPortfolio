"use client";

import { useState, useRef } from "react";

export default function MediaUploader({
  label,
  value = "",
  onChange,
  folder = "portfolio",
  allowPdf = false,
}: {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  allowPdf?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  }

  const isVideo = /\.(mp4|webm|mov|ogg)(\?|$)/i.test(value);
  const isPdf = /\.pdf(\?|$)/i.test(value) || value.includes("/raw/upload/");

  return (
    <div className="admin-field" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
      <label style={{ fontWeight: 600, fontSize: "0.95rem", color: "#aab2c0" }}>{label}</label>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowPdf ? "image/*,video/*,application/pdf" : "image/*,video/*"}
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: "none" }}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: dragActive ? "2px dashed #00deff" : "2px dashed #2a3340",
          backgroundColor: dragActive ? "rgba(0, 222, 255, 0.05)" : "#11151a",
          borderRadius: "10px",
          padding: "24px 16px",
          textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease-in-out",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          minHeight: "150px"
        }}
        className="uploader-zone"
      >
        {uploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div className="uploader-spinner" />
            <span style={{ color: "#00deff", fontSize: "0.9rem", fontWeight: 500 }}>Uploading media...</span>
          </div>
        ) : value ? (
          <div style={{ position: "relative", width: "100%", maxWidth: "300px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #2a3340",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              backgroundColor: "#0b0d10",
              position: "relative"
            }}>
              {isPdf ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px 16px" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff8095" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="15" y2="17" />
                  </svg>
                  <span style={{ color: "#e7e9ee", fontSize: "0.85rem", wordBreak: "break-all", textAlign: "center" }}>
                    {value.split("/").pop()?.split("?")[0] || "document.pdf"}
                  </span>
                  <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#00deff", fontSize: "0.8rem" }}>
                    Open PDF
                  </a>
                </div>
              ) : isVideo ? (
                <video src={value} controls style={{ width: "100%", display: "block", maxHeight: "180px", objectFit: "contain" }} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="Preview" style={{ width: "100%", display: "block", maxHeight: "180px", objectFit: "contain" }} />
              )}
              
              <div 
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(11, 13, 16, 0.75)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  opacity: 0,
                  transition: "opacity 0.2s ease",
                  cursor: "default"
                }}
                className="preview-overlay"
              >
                <button
                  type="button"
                  className="admin-btn mini"
                  style={{
                    backgroundColor: "#00deff",
                    color: "#0b0d10",
                    border: "none",
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change
                </button>
                <button
                  type="button"
                  className="admin-btn mini danger"
                  style={{
                    backgroundColor: "#ff8095",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                  onClick={() => onChange("")}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", pointerEvents: "none" }}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke={dragActive ? "#00deff" : "#aab2c0"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: "stroke 0.2s ease" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div style={{ fontSize: "0.95rem", color: "#e7e9ee" }}>
              Drag & drop a file here, or <span style={{ color: "#00deff", fontWeight: 500 }}>browse</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#6a768a" }}>
              {allowPdf ? "Supports images, videos, and PDFs" : "Supports images and videos"}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
        <input
          type="text"
          placeholder="…or paste a media URL directly"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            backgroundColor: "#11151a",
            border: "1px solid #2a3340",
            borderRadius: "6px",
            color: "#e7e9ee",
            outline: "none",
            fontSize: "0.9rem",
            transition: "border-color 0.15s ease"
          }}
          className="admin-url-input"
        />
        {value && (
          <button
            type="button"
            className="admin-btn mini secondary"
            style={{
              padding: "8px 12px",
              height: "100%",
              backgroundColor: "#2a3340",
              color: "#e7e9ee",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
            onClick={() => onChange("")}
          >
            Clear
          </button>
        )}
      </div>

      {error && <div className="admin-error" style={{ color: "#ff8095", fontSize: "0.85rem", marginTop: "4px" }}>{error}</div>}
      
      <style jsx global>{`
        .uploader-zone:hover {
          border-color: #00deff !important;
          background-color: rgba(0, 222, 255, 0.02) !important;
        }
        .uploader-zone:hover svg {
          stroke: #00deff !important;
        }
        .preview-overlay:hover {
          opacity: 1 !important;
        }
        .uploader-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid rgba(0, 222, 255, 0.1);
          border-radius: 50%;
          border-top-color: #00deff;
          animation: uploader-spin 0.8s ease-in-out infinite;
        }
        @keyframes uploader-spin {
          to { transform: rotate(360deg); }
        }
        .admin-url-input:focus {
          border-color: #00deff !important;
        }
      `}</style>
    </div>
  );
}
