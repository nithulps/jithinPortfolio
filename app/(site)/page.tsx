import Link from "next/link";
import RotatingText from "@/components/RotatingText";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import CompetencyText from "@/components/CompetencyText";
import ScrollRevealRow from "@/components/ScrollRevealRow";
import HeroBackground from "@/components/HeroBackground";
import { getAbout, getFeaturedProjects, getServices, getHomepagePages, getHomepageCategories } from "@/lib/data";
import type { AboutDTO, ProjectDTO, ServiceDTO, PageDTO, HomeCategoryDTO } from "@/types";

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);

export const dynamic = "force-dynamic";

/* ── Built-in section renderers ── */

function HeroSection({ about }: { about: AboutDTO | null }) {
  // Downloads via our proxy route so it saves as a properly named PDF.
  const resumeHref = about?.resumeUrl ? "/api/resume" : "";
  return (
    <section className="hero">
      <HeroBackground />
      <RotatingText
        phrases={about?.heroPhrases?.length ? about.heroPhrases : ["MANUAL & AUTOMATION"]}
        wrapperClass="animated-headline reveal"
        itemClass="headline-phrase"
      />
      <h1 className="hero-title reveal">{about?.name || "JITHIN"}</h1>
      <p className="hero-desc reveal">
        {about?.heroDescription ||
          "I deliver comprehensive software testing solutions — from manual QA to full automation frameworks."}
      </p>
      {resumeHref ? (
        <a href={resumeHref} className="btn-hero reveal" download>
          <i className="fas fa-download" style={{ marginRight: 10 }} />
          Download Resume
        </a>
      ) : (
        <Link href="/contact" className="btn-hero reveal">
          Start a project
        </Link>
      )}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>
    </section>
  );
}

function HomeCategoriesSection({ categories }: { categories: HomeCategoryDTO[] }) {
  if (categories.length === 0) return null;

  // Group categories by their parent page, preserving order.
  const groups: { slug: string; title: string; items: HomeCategoryDTO[] }[] = [];
  for (const cat of categories) {
    let group = groups.find((g) => g.slug === cat.pageSlug);
    if (!group) {
      group = { slug: cat.pageSlug, title: cat.pageTitle, items: [] };
      groups.push(group);
    }
    group.items.push(cat);
  }

  return (
    <>
      {groups.map((group) => (
        <section className="container" id={`categories-${group.slug}`} key={group.slug}>
          <div className="section-header reveal">
            <h3>{group.title}</h3>
            <Link href={`/${group.slug}`} className="btn-outline">
              View all
            </Link>
          </div>
          <div className="projects-grid">
            {group.items.map((cat) => {
              const hasOverlay = !!(cat.overlayTitle || cat.overlaySubtitle);
              return (
                <Link
                  key={`${cat.pageSlug}-${cat.key}`}
                  href={`/${cat.pageSlug}?category=${encodeURIComponent(cat.key)}`}
                  className="project-card reveal"
                  style={{ textDecoration: "none" }}
                >
                  <div className="project-image-wrapper">
                    {cat.coverImage &&
                      (isVideoUrl(cat.coverImage) ? (
                        <video src={cat.coverImage} autoPlay loop muted playsInline />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cat.coverImage} alt={cat.name || ""} />
                      ))}
                    <div className="project-card-glow" />
                    {hasOverlay && (
                      <div className="project-card-overlay">
                        {cat.overlayTitle && <h4 className="project-overlay-title">{cat.overlayTitle}</h4>}
                        {cat.overlaySubtitle && <p className="project-overlay-sub">{cat.overlaySubtitle}</p>}
                      </div>
                    )}
                  </div>
                  {cat.name && <h4 className="project-title">{cat.name}</h4>}
                  {cat.description && <p className="project-excerpt">{cat.description}</p>}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

function ProjectsSection({ projects }: { projects: ProjectDTO[] }) {
  return (
    <section className="container" id="projets">
      <div className="section-header reveal">
        <h3>Featured Projects</h3>
        <Link href="/projects" className="btn-outline">
          All projects
        </Link>
      </div>
      <div className="projects-grid">
        {projects.map((p) => (
          <ProjectCard key={p._id} project={p} />
        ))}
        {projects.length === 0 && (
          <p style={{ color: "var(--text-gray)" }}>No projects yet — add some in the admin panel.</p>
        )}
      </div>
    </section>
  );
}

function CompetencySection({ about }: { about: AboutDTO | null }) {
  if (!about?.competencyText) return null;
  return (
    <section className="competency-box" id="competences">
      <CompetencyText html={about.competencyText} />
      <Link href="/contact" className="btn-hero reveal" style={{ marginTop: 40 }}>
        Start a project
      </Link>
    </section>
  );
}

function ServicesSection({ services }: { services: ServiceDTO[] }) {
  return (
    <section className="container" id="services">
      <div className="section-header reveal">
        <h3>My Services</h3>
        <Link href="/services" className="btn-outline">
          Learn more
        </Link>
      </div>
      <ScrollRevealRow className="services-grid" start={0.6} end={0.22}>
        {services.map((s) => (
          <ServiceCard key={s._id} service={s} />
        ))}
      </ScrollRevealRow>
    </section>
  );
}

function CustomPageSection({ page }: { page: PageDTO }) {
  /* Only show sections explicitly marked for the homepage. */
  const homeSections = page.sections.filter((s) => s.showOnHomepage);
  if (homeSections.length === 0 && !page.homepageExcerpt) return null;

  return (
    <section className="container" id={page.slug}>
      <div className="section-header reveal">
        <h3>{page.heading || page.title}</h3>
        <Link href={`/${page.slug}`} className="btn-outline">
          Learn more
        </Link>
      </div>
      {page.homepageExcerpt && (
        <p className="reveal" style={{ color: "var(--text-gray)", maxWidth: 700, lineHeight: 1.7, marginBottom: 30 }}>
          {page.homepageExcerpt}
        </p>
      )}
      {homeSections.length > 0 && (
        <div className="projects-grid reveal">
          {homeSections.map((sec, i) => {
            const hasOverlay = !!(sec.sectionOverlayTitle || sec.sectionOverlaySub);
            return (
              <div key={i} className="project-card">
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
                {sec.sectionBody && (
                  <p className="project-excerpt" dangerouslySetInnerHTML={{ __html: sec.sectionBody }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ── Homepage ── */

// Default order for built-in sections (used when DB has no records yet)
const DEFAULT_ORDER: { key: string; order: number }[] = [
  { key: "hero", order: 0 },
  { key: "projects", order: 1 },
  { key: "competency", order: 2 },
  { key: "services", order: 3 },
];

export default async function HomePage() {
  const [about, projects, services, dbSections, homeCategories] = await Promise.all([
    getAbout(),
    getFeaturedProjects(4),
    getServices(),
    getHomepagePages(),
    getHomepageCategories(),
  ]);

  // Built-in sections always render; use DB order if available, else defaults
  const BUILT_IN_SLUGS = new Set(["projects", "services", "competency"]);
  const builtInFromDb = new Map(
    dbSections.filter((s) => BUILT_IN_SLUGS.has(s.slug)).map((s) => [s.slug, s])
  );
  // Pages already represented by the homepage categories grid — don't render
  // their plain page section too (avoids a duplicate widget for the same page).
  const categoryPageSlugs = new Set(homeCategories.map((c) => c.pageSlug));
  const customPages = dbSections.filter(
    (s) => !BUILT_IN_SLUGS.has(s.slug) && !categoryPageSlugs.has(s.slug)
  );

  type SectionItem = { key: string; order: number; page?: PageDTO };
  const sections: SectionItem[] = [];

  // Always include built-in sections with DB order or fallback
  for (const d of DEFAULT_ORDER) {
    if (d.key === "hero") continue;
    const fromDb = builtInFromDb.get(d.key);
    sections.push({ key: d.key, order: fromDb?.order ?? d.order });
  }

  // Add custom pages
  for (const p of customPages) {
    sections.push({ key: `custom-${p._id}`, order: p.order, page: p });
  }

  // Sort everything by order
  sections.sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Hero is always rendered first */}
      <HeroSection about={about} />

      {/* Categories flagged to show on the homepage */}
      <HomeCategoriesSection categories={homeCategories} />

      {sections.map((sec) => {
        switch (sec.key) {
          case "projects":
            return <ProjectsSection key="projects" projects={projects} />;
          case "competency":
            return <CompetencySection key="competency" about={about} />;
          case "services":
            return <ServicesSection key="services" services={services} />;
          default:
            return sec.page ? <CustomPageSection key={sec.page._id} page={sec.page} /> : null;
        }
      })}
    </>
  );
}
