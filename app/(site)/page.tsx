import Link from "next/link";
import RotatingText from "@/components/RotatingText";
import ProjectCard from "@/components/ProjectCard";
import ServiceCard from "@/components/ServiceCard";
import CompetencyText from "@/components/CompetencyText";
import ScrollRevealRow from "@/components/ScrollRevealRow";
import { getAbout, getFeaturedProjects, getServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [about, projects, services] = await Promise.all([
    getAbout(),
    getFeaturedProjects(4),
    getServices(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="hero">
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

      {/* Featured projects */}
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

      {/* Competency */}
      {about?.competencyText && (
        <section className="competency-box" id="competences">
          <CompetencyText html={about.competencyText} />
          <Link href="/contact" className="btn-hero reveal" style={{ marginTop: 40 }}>
            Start a project
          </Link>
        </section>
      )}

      {/* Services */}
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
    </>
  );
}
