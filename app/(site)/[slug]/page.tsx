import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page || page.builtIn) return notFound();

  // Automate column count: 3 columns if total sections count is a multiple of 3, otherwise 2.
  const cols = page.sections.length % 3 === 0 ? 3 : 2;

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
        {/* Content sections — always use project-card style */}
        {page.sections.length > 0 && (
          <div className={`projects-grid${cols === 3 ? " cols-3" : ""}`}>
            {page.sections.map((sec, i) => {
              const hasOverlay = !!(sec.sectionOverlayTitle || sec.sectionOverlaySub);
              return (
                <div key={i} className="project-card reveal">
                  <div className="project-image-wrapper">
                    {sec.sectionImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sec.sectionImage} alt={sec.sectionTitle || ""} />
                    )}
                    <div className="project-card-glow" />
                    {hasOverlay && (
                      <div className="project-card-overlay">
                        {sec.sectionOverlayTitle && (
                          <h4 className="project-overlay-title">{sec.sectionOverlayTitle}</h4>
                        )}
                        {sec.sectionOverlaySub && (
                          <p className="project-overlay-sub">{sec.sectionOverlaySub}</p>
                        )}
                      </div>
                    )}
                  </div>
                  {sec.sectionTitle && <h4 className="project-title">{sec.sectionTitle}</h4>}
                  {sec.sectionBody && (
                    <p className="project-excerpt" dangerouslySetInnerHTML={{ __html: sec.sectionBody }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {page.sections.length === 0 && (
          <p style={{ color: "var(--text-gray)" }}>No content yet.</p>
        )}
      </main>
    </>
  );
}
