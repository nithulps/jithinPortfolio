import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page || page.builtIn) return notFound();

  const displayMode = page.displayMode || "grid";

  return (
    <>
      <div className="breadcrumbs-container">
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">{page.title}</li>
        </ul>
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
        {page.sections.length === 0 && (
          <p style={{ color: "var(--text-gray)" }}>No content yet.</p>
        )}

        {/* Grid mode — 2-column project card layout */}
        {page.sections.length > 0 && displayMode === "grid" && (
          <div className="projects-grid">
            {page.sections.map((sec, i) => {
              const hasOverlay = !!(sec.sectionOverlayTitle || sec.sectionOverlaySub);
              const secSlug = sec.sectionSlug || sec.sectionTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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
                <Link key={i} href={`/${page.slug}/${secSlug}`} className="project-card reveal" style={{ textDecoration: "none" }}>
                  {cardInner}
                </Link>
              ) : (
                <div key={i} className="project-card reveal">{cardInner}</div>
              );
            })}
          </div>
        )}

        {/* List mode — full-width service-style rows */}
        {page.sections.length > 0 && displayMode === "list" && (
          <div className="services-container">
            {page.sections.map((sec, i) => {
              const secSlug = sec.sectionSlug || sec.sectionTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
              return (
              <section key={i} className="service-detail-section">
                <div className="service-detail-grid">
                  <div className="service-detail-info reveal">
                    {sec.sectionTitle && (
                      secSlug
                        ? <Link href={`/${page.slug}/${secSlug}`}><h2 style={{ textDecoration: "none" }}>{sec.sectionTitle}</h2></Link>
                        : <h2>{sec.sectionTitle}</h2>
                    )}
                    {sec.sectionBody && <div dangerouslySetInnerHTML={{ __html: sec.sectionBody }} />}
                    {secSlug && (
                      <div style={{ marginTop: 20 }}>
                        <Link href={`/${page.slug}/${secSlug}`} className="btn-hero">View details</Link>
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
        )}
      </main>
    </>
  );
}
