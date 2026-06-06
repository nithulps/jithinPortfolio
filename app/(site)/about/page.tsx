import Link from "next/link";
import RotatingText from "@/components/RotatingText";
import { getAbout } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "About — Jithin" };

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <>
      <div className="breadcrumbs-container">
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">About</li>
        </ul>
      </div>

      <section className="page-header-sec reveal">
        <h1>About</h1>
        <div className="page-filter-pills">
          <span className="filter-pill active">{about?.name || "Jithin"}</span>
          <span className="filter-pill active">{about?.roleLabel || "QA Engineer"}</span>
        </div>
      </section>

      <main className="about-container">
        <div className="about-grid about-stacked">
          {/* Order 1: headline */}
          <h1 className="about-headline reveal">
            {about?.headline || "Hello! I'm Jithin, a Software Test Engineer & QA Specialist."}{" "}
            {about?.aboutPhrases?.length ? (
              <RotatingText
                phrases={about.aboutPhrases}
                wrapperClass="about-phrase-container"
                itemClass="about-phrase"
              />
            ) : null}
          </h1>

          {/* Order 2: image */}
          {about?.image && (
            <div className="about-image-panel reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.image} alt={about.name || "Jithin"} />
            </div>
          )}

          {/* Order 3: bio */}
          <div className="about-info-panel reveal">
            <div className="about-bio-text">
              {(about?.bioParagraphs?.length ? about.bioParagraphs : []).map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
            {about?.resumeUrl && (
              <div style={{ marginTop: 20 }}>
                <a className="btn-outline" href={about.resumeUrl} target="_blank" rel="noreferrer">
                  Download my Resume
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
