import Link from "next/link";
import RotatingText from "@/components/RotatingText";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import CompetencyText from "@/components/CompetencyText";
import ScrollRevealRow from "@/components/ScrollRevealRow";
import HeroBackground from "@/components/HeroBackground";
import { getAbout, getFeaturedProjects, getServices, getHomepagePages } from "@/lib/data";
import type { AboutDTO, ProjectDTO, ServiceDTO, PageDTO } from "@/types";

export const dynamic = "force-dynamic";

/* ── Built-in section renderers ── */

function HeroSection({ about }: { about: AboutDTO | null }) {
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
      <Link href="/contact" className="btn-hero reveal">
        Start a project
      </Link>
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>
    </section>
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
      <ScrollRevealRow className="services-grid">
        {services.map((s) => (
          <ServiceCard key={s._id} service={s} />
        ))}
      </ScrollRevealRow>
    </section>
  );
}

function CustomPageSection({ page }: { page: PageDTO }) {
  /* Show sections marked for homepage; fall back to ALL sections */
  const markedSections = page.sections.filter((s) => s.showOnHomepage);
  const homeSections = markedSections.length > 0 ? markedSections : page.sections;
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
  const [about, projects, services, dbSections] = await Promise.all([
    getAbout(),
    getFeaturedProjects(4),
    getServices(),
    getHomepagePages(),
  ]);

  // Built-in sections always render; use DB order if available, else defaults
  const BUILT_IN_SLUGS = new Set(["projects", "services", "competency"]);
  const builtInFromDb = new Map(
    dbSections.filter((s) => BUILT_IN_SLUGS.has(s.slug)).map((s) => [s.slug, s])
  );
  const customPages = dbSections.filter((s) => !BUILT_IN_SLUGS.has(s.slug));

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
