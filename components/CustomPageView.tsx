"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
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

export default function CustomPageView({ page }: { page: PageDTO }) {
  const categories = page.categories || [];
  const hasCategories = categories.length > 0;

  // The open category is driven by the URL (?category=<key>) so opening a
  // category pushes a history entry — swiping back from a section detail page
  // then returns to the category's sections, not the category grid.
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const requestedKey = searchParams.get("category");
  const activeKey =
    requestedKey && categories.some((c) => c.key === requestedKey) ? requestedKey : null;

  const openCategory = (key: string) =>
    router.push(`${pathname}?category=${encodeURIComponent(key)}`, { scroll: false });
  const backToGrid = () => router.push(pathname, { scroll: false });

  const displayMode = page.displayMode || "grid";
  const pageSlug = page.slug;
  const activeCat = activeKey ? categories.find((c) => c.key === activeKey) : null;

  // Jump to top when switching between the category grid and a category's
  // sections (the param change re-renders without a fresh page load).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.scrollTo(0, 0);
  }, [activeKey]);

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

  function renderContent() {
    if (page.sections.length === 0 && !hasCategories) {
      return <p style={{ color: "var(--text-gray)" }}>No content yet.</p>;
    }
    // No categories — render every section.
    if (!hasCategories) return renderSections(page.sections);
    // A category is selected — show its sections.
    if (activeKey) {
      const secs = page.sections.filter((s) => s.categoryKey === activeKey);
      return (
        <div className="reveal active">
          {activeCat?.name && <h2 className="page-category-name">{activeCat.name}</h2>}
          {activeCat?.description && (
            <p className="hero-desc" style={{ marginTop: -12, marginBottom: 30, maxWidth: 760 }}>
              {activeCat.description}
            </p>
          )}
          {renderSections(secs)}
        </div>
      );
    }
    // Default — category cards.
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
              onClick={() => openCategory(cat.key)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openCategory(cat.key)}
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
              {cat.description ? (
                <p className="project-excerpt">{cat.description}</p>
              ) : (
                <p className="project-excerpt">{count} {count === 1 ? "item" : "items"}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <div className="breadcrumbs-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">{page.title}</li>
          {activeCat?.name && <li className="breadcrumb-item active">{activeCat.name}</li>}
        </ul>
        {activeKey && (
          <button
            type="button"
            className="btn-outline"
            onClick={backToGrid}
            style={{ padding: "8px 20px", fontSize: "0.9rem" }}
          >
← Back
          </button>
        )}
      </div>

      <section className="page-header-sec reveal">
        <h1>{page.heading || page.title}</h1>
        {page.subtitle && (
          <p className="hero-desc" style={{ marginTop: 12 }}>
            {page.subtitle}
          </p>
        )}
      </section>

      <main className="container" style={{ paddingTop: 0 }}>
        {renderContent()}
      </main>
    </>
  );
}
