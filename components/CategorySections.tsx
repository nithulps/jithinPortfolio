"use client";

import { useState } from "react";
import Link from "next/link";
import type { PageDTO } from "@/types";

type Section = PageDTO["sections"][number];
type Category = PageDTO["categories"][number];

const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);

function sectionSlugOf(sec: Section) {
  return (
    sec.sectionSlug ||
    sec.sectionTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
  );
}

export default function CategorySections({ page }: { page: PageDTO }) {
  const categories = page.categories || [];
  const hasCategories = categories.length > 0;
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const displayMode = page.displayMode || "grid";
  const pageSlug = page.slug;

  function renderSections(sections: Section[]) {
    if (sections.length === 0) {
      return <p style={{ color: "var(--text-gray)" }}>No content in this category yet.</p>;
    }

    if (displayMode === "grid") {
      return (
        <div className="projects-grid">
          {sections.map((sec, i) => {
            const hasOverlay = !!(sec.sectionOverlayTitle || sec.sectionOverlaySub);
            const secSlug = sectionSlugOf(sec);
            const cardInner = (
              <>
                <div className="project-image-wrapper">
                  {sec.sectionImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sec.sectionImage} alt={sec.sectionTitle || ""} />
                  )}
                  <div className="project-card-glow" />
                  {hasOverlay && (
                    <div className="project-card-overlay">
                      {sec.sectionOverlayTitle && <h4 className="project-overlay-title">{sec.sectionOverlayTitle}</h4>}
                      {sec.sectionOverlaySub && <p className="project-overlay-sub">{sec.sectionOverlaySub}</p>}
                    </div>
                  )}
                </div>
                {sec.sectionTitle && <h4 className="project-title">{sec.sectionTitle}</h4>}
                {sec.sectionBody && <p className="project-excerpt" dangerouslySetInnerHTML={{ __html: sec.sectionBody }} />}
              </>
            );
            return secSlug ? (
              <Link key={i} href={`/${pageSlug}/${secSlug}`} className="project-card reveal active" style={{ textDecoration: "none" }}>
                {cardInner}
              </Link>
            ) : (
              <div key={i} className="project-card reveal active">{cardInner}</div>
            );
          })}
        </div>
      );
    }

    // List mode — full-width service-style rows
    return (
      <div className="services-container">
        {sections.map((sec, i) => {
          const secSlug = sectionSlugOf(sec);
          return (
            <section key={i} className="service-detail-section">
              <div className="service-detail-grid">
                <div className="service-detail-info reveal active">
                  {sec.sectionTitle && (
                    secSlug
                      ? <Link href={`/${pageSlug}/${secSlug}`} style={{ textDecoration: "none" }}><h2 style={{ textDecoration: "none" }}>{sec.sectionTitle}</h2></Link>
                      : <h2>{sec.sectionTitle}</h2>
                  )}
                  {sec.sectionBody && <div dangerouslySetInnerHTML={{ __html: sec.sectionBody }} />}
                  {secSlug && (
                    <div style={{ marginTop: 20 }}>
                      <Link href={`/${pageSlug}/${secSlug}`} className="btn-hero">View details</Link>
                    </div>
                  )}
                </div>
                {sec.sectionImage && (
                  <div className="service-detail-card-wrapper">
                    <div className="project-image-wrapper" style={{ borderRadius: 16, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sec.sectionImage} alt={sec.sectionTitle || ""} style={{ width: "100%", display: "block" }} />
                      {(sec.sectionOverlayTitle || sec.sectionOverlaySub) && (
                        <div className="project-card-overlay">
                          {sec.sectionOverlayTitle && <h4 className="project-overlay-title">{sec.sectionOverlayTitle}</h4>}
                          {sec.sectionOverlaySub && <p className="project-overlay-sub">{sec.sectionOverlaySub}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // No categories on this page — render every section as before.
  if (!hasCategories) {
    return renderSections(page.sections);
  }

  // A category is selected — show its mapped sections.
  if (activeKey) {
    const cat = categories.find((c) => c.key === activeKey);
    const secs = page.sections.filter((s) => s.categoryKey === activeKey);
    return (
      <div className="reveal active">
        <button type="button" className="btn-outline" onClick={() => setActiveKey(null)} style={{ marginBottom: 30 }}>
          ← Back to categories
        </button>
        {cat?.name && <h2 className="page-category-name">{cat.name}</h2>}
        {renderSections(secs)}
      </div>
    );
  }

  // Default — show the category cards.
  return (
    <div className="projects-grid">
      {categories.map((cat: Category) => {
        const hasOverlay = !!(cat.overlayTitle || cat.overlaySubtitle);
        const count = page.sections.filter((s) => s.categoryKey === cat.key).length;
        return (
          <div
            key={cat.key}
            className="project-card reveal active"
            role="button"
            tabIndex={0}
            onClick={() => setActiveKey(cat.key)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveKey(cat.key)}
            style={{ cursor: "pointer" }}
          >
            <div className="project-image-wrapper">
              {cat.coverImage ? (
                isVideo(cat.coverImage) ? (
                  <video src={cat.coverImage} autoPlay loop muted playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.coverImage} alt={cat.name || ""} />
                )
              ) : null}
              <div className="project-card-glow" />
              {hasOverlay && (
                <div className="project-card-overlay">
                  {cat.overlayTitle && <h4 className="project-overlay-title">{cat.overlayTitle}</h4>}
                  {cat.overlaySubtitle && <p className="project-overlay-sub">{cat.overlaySubtitle}</p>}
                </div>
              )}
            </div>
            {cat.name && <h4 className="project-title">{cat.name}</h4>}
            <p className="project-excerpt">{count} {count === 1 ? "item" : "items"}</p>
          </div>
        );
      })}
    </div>
  );
}
