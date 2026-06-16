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
          <Link href={`/${page.slug}`} className="project-nav-link">
            <span className="nav-dir">Back</span>
            <span className="nav-title">{page.title}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
