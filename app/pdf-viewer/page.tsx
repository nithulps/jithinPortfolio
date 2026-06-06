"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Served from public/ — exact version match with the bundled pdfjs-dist (avoids CDN mismatch)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

function PdfViewerInner() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";

  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sidebarWidth] = useState(260);

  const onDocumentLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  }, []);

  if (!url) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#aab2c0" }}>
        No PDF URL provided.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#0b0d10", fontFamily: "inherit" }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        backgroundColor: "#11151a",
        borderRight: "1px solid #1e2530",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Sidebar header */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e2530", display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href="javascript:history.back()"
            style={{ color: "#aab2c0", textDecoration: "none", fontSize: "1.1rem", lineHeight: 1 }}
            title="Go back"
          >
            ←
          </a>
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#e7e9ee" }}>PDF Viewer</div>
            <div style={{ fontSize: "0.75rem", color: "#6a768a" }}>{numPages} pages</div>
          </div>
        </div>

        {/* Page thumbnails */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
          {numPages > 0 && Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                background: "none",
                border: currentPage === page ? "2px solid #00deff" : "2px solid #1e2530",
                borderRadius: 8,
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                transition: "border-color 0.15s ease",
                backgroundColor: currentPage === page ? "rgba(0,222,255,0.06)" : "transparent",
              }}
            >
              <div style={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 4,
                overflow: "hidden",
                pointerEvents: "none",
              }}>
                <Document file={url} loading={null} error={null}>
                  <Page
                    pageNumber={page}
                    width={sidebarWidth - 40}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    loading={
                      <div style={{ height: 140, backgroundColor: "#1e2530", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 20, height: 20, border: "2px solid #2a3340", borderTopColor: "#00deff", borderRadius: "50%", animation: "pdf-spin 0.8s linear infinite" }} />
                      </div>
                    }
                  />
                </Document>
              </div>
              <span style={{ fontSize: "0.75rem", color: currentPage === page ? "#00deff" : "#6a768a", fontWeight: currentPage === page ? 700 : 400 }}>
                {page}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main viewer */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#161c24" }}>
        {/* Toolbar */}
        <div style={{
          height: 50,
          backgroundColor: "#11151a",
          borderBottom: "1px solid #1e2530",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: "0 20px",
          flexShrink: 0,
        }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            style={{ background: "none", border: "1px solid #2a3340", color: "#e7e9ee", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: "0.9rem", opacity: currentPage <= 1 ? 0.4 : 1 }}
          >
            ‹ Prev
          </button>
          <span style={{ color: "#aab2c0", fontSize: "0.88rem", minWidth: 100, textAlign: "center" }}>
            Page <strong style={{ color: "#e7e9ee" }}>{currentPage}</strong> of <strong style={{ color: "#e7e9ee" }}>{numPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            style={{ background: "none", border: "1px solid #2a3340", color: "#e7e9ee", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: "0.9rem", opacity: currentPage >= numPages ? 0.4 : 1 }}
          >
            Next ›
          </button>
        </div>

        {/* PDF page display */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px" }}>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoad}
            loading={
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 80, color: "#aab2c0" }}>
                <div style={{ width: 36, height: 36, border: "3px solid #2a3340", borderTopColor: "#00deff", borderRadius: "50%", animation: "pdf-spin 0.8s linear infinite" }} />
                <span>Loading PDF…</span>
              </div>
            }
            error={
              <div style={{ color: "#ff8095", marginTop: 80, textAlign: "center" }}>
                Could not load PDF. <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#00deff" }}>Open directly</a>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              width={Math.min(900, typeof window !== "undefined" ? window.innerWidth - sidebarWidth - 80 : 800)}
              renderAnnotationLayer
              renderTextLayer
              loading={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 600 }}>
                  <div style={{ width: 32, height: 32, border: "3px solid #2a3340", borderTopColor: "#00deff", borderRadius: "50%", animation: "pdf-spin 0.8s linear infinite" }} />
                </div>
              }
            />
          </Document>
        </div>
      </main>

      <style>{`
        @keyframes pdf-spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #11151a; }
        ::-webkit-scrollbar-thumb { background: #2a3340; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a4350; }
      `}</style>
    </div>
  );
}

export default function PdfViewerPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#0b0d10", color: "#aab2c0" }}>
        Loading…
      </div>
    }>
      <PdfViewerInner />
    </Suspense>
  );
}
