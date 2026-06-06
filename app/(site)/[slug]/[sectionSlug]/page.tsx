import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageSection } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string; sectionSlug: string } }) {
  const result = await getPageSection(params.slug, params.sectionSlug);
  if (!result) return {};
  return { title: `${result.section.sectionTitle} — ${result.page.title}` };
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

function isPdf(url: string) {
  return /\.pdf(\?|$)/i.test(url) || url.includes("/raw/upload/");
}

export default async function SectionDetailPage({
  params,
}: {
  params: { slug: string; sectionSlug: string };
}) {
  const result = await getPageSection(params.slug, params.sectionSlug);
  if (!result) return notFound();

  const { page, section } = result;

  return (
    <>
      {/* Hero */}
      <section className="project-detail-hero">
        <div className="project-detail-hero-bg">
          {section.sectionImage &&
            (isVideo(section.sectionImage) ? (
              <video src={section.sectionImage} autoPlay loop muted playsInline />
            ) : isPdf(section.sectionImage) ? null : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={section.sectionImage} alt={section.sectionTitle} />
            ))}
        </div>
        <div className="project-detail-hero-overlay" />
        <div className="project-detail-hero-content reveal">
          <div className="project-tags">
            <span>{page.title}</span>
          </div>
          <h1>{section.sectionTitle}</h1>
        </div>
      </section>

      {/* Body */}
      <div className="project-detail-body">
        {section.sectionBody && (
          <div className="project-detail-grid-layout">
            <div
              className="project-description-content reveal"
              dangerouslySetInnerHTML={{ __html: section.sectionBody }}
            />
          </div>
        )}

        {/* PDF files — special card with viewer button */}
        {section.sectionFiles && section.sectionFiles.filter(isPdf).length > 0 && (
          <section className="project-visuels-sec reveal">
            <h3>Documents</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {section.sectionFiles.filter(isPdf).map((url, i) => {
                const filename = url.split("/").pop()?.split("?")[0] || `Document ${i + 1}`;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 20px",
                      background: "#11151a",
                      border: "1px solid #2a3340",
                      borderRadius: 12,
                    }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff8095" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="9" y1="13" x2="15" y2="13" />
                      <line x1="9" y1="17" x2="15" y2="17" />
                    </svg>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={{ fontWeight: 600, color: "#e7e9ee", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{filename}</div>
                      <div style={{ fontSize: "0.78rem", color: "#6a768a", marginTop: 2 }}>PDF Document</div>
                    </div>
                    <Link
                      href={`/pdf-viewer?url=${encodeURIComponent(url)}`}
                      target="_blank"
                      className="btn-hero"
                      style={{ flexShrink: 0, fontSize: "0.85rem", padding: "8px 18px" }}
                    >
                      View PDF
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Images & videos gallery */}
        {section.sectionFiles && section.sectionFiles.filter((u) => !isPdf(u)).length > 0 && (
          <section className="project-visuels-sec reveal">
            <h3>Gallery</h3>
            <div className="project-visuels-grid">
              {section.sectionFiles.filter((u) => !isPdf(u)).map((url, i) =>
                isVideo(url) ? (
                  <video key={i} src={url} controls loop muted playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`${section.sectionTitle} ${i + 1}`} />
                )
              )}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="project-navigation">
          <Link href={`/${page.slug}`} className="project-nav-link">
            <span className="nav-dir">Back</span>
            <span className="nav-title">{page.title}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
