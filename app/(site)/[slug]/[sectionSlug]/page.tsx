import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageSection } from "@/lib/data";
import PdfPreview from "@/components/PdfPreview";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string; sectionSlug: string } }) {
  const result = await getPageSection(params.slug, params.sectionSlug);
  if (!result) return {};
  return { title: `${result.section.sectionTitle} - ${result.page.title}` };
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

  const category = (page.categories || []).find((c) => c.key === section.categoryKey);
  const files = section.sectionFiles || [];
  const docCount = files.filter(isPdf).length;
  const mediaCount = files.filter((u) => !isPdf(u)).length;

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
            <span className="accent">{page.title}</span>
            {category?.name && <span className="accent">{category.name}</span>}
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
            <aside className="project-meta-sidebar reveal">
              <div className="meta-sidebar-item">
                <h4>In this document</h4>
                <div className="project-tags" style={{ marginTop: 12 }}>
                  {docCount > 0 && (
                    <span className="tag-meta">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      {docCount} {docCount === 1 ? "Document" : "Documents"}
                    </span>
                  )}
                  {mediaCount > 0 && (
                    <span className="tag-meta">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 20" /></svg>
                      {mediaCount} {mediaCount === 1 ? "Visual" : "Visuals"}
                    </span>
                  )}
                  <span className="tag-meta">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Read &amp; learn
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* PDF files - inline preview with link to the full viewer */}
        {section.sectionFiles && section.sectionFiles.filter(isPdf).length > 0 && (
          <section className="project-visuels-sec reveal">
            <h3>Documents</h3>
            <div className="pdf-grid">
              {section.sectionFiles.filter(isPdf).map((url, i) => (
                <PdfPreview key={i} url={url} title={`Document ${i + 1}`} />
              ))}
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
          <Link href={`/${page.slug}`} className="btn-hero">
            ← Back to {page.title}
          </Link>
        </div>
      </div>
    </>
  );
}
