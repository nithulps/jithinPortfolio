"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Same worker the full viewer uses (served from public/).
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function PdfPreview({ url, title }: { url: string; title: string }) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      if (w) setWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Link
      href={`/pdf-viewer?url=${encodeURIComponent(url)}`}
      target="_blank"
      className="pdf-card"
      aria-label={`Open ${title}`}
    >
      <div className="pdf-card-thumb" ref={thumbRef}>
        {width > 0 && (
          <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="pdf-card-state"><div className="pdf-card-spinner" /></div>}
            error={<div className="pdf-card-state pdf-card-err">PDF</div>}
          >
            <Page
              pageNumber={1}
              width={width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<div className="pdf-card-state"><div className="pdf-card-spinner" /></div>}
            />
          </Document>
        )}

        <span className="pdf-card-badge">PDF</span>

        <div className="pdf-card-overlay">
          <span className="pdf-card-view">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View PDF
          </span>
        </div>
      </div>

      <div className="pdf-card-foot">
        <span className="pdf-card-foot-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff8095" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </span>
        <span className="pdf-card-meta">
          <span className="pdf-card-title">{title}</span>
          <span className="pdf-card-sub">PDF{numPages ? ` · ${numPages} page${numPages > 1 ? "s" : ""}` : ""}</span>
        </span>
      </div>

      <style>{`
        @keyframes pdf-prev-spin { to { transform: rotate(360deg); } }
      `}</style>
    </Link>
  );
}
