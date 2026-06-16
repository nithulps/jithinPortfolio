import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Projects - Jithin" };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <div className="breadcrumbs-container">
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">Projects</li>
        </ul>
      </div>

      <section className="page-header-sec reveal">
        <h1>Projects</h1>
        <div className="page-filter-pills">
          <span className="filter-pill active">All work</span>
        </div>
      </section>

      <main className="container" style={{ paddingTop: 0 }}>
        <div className="projects-grid">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
          {projects.length === 0 && (
            <p style={{ color: "var(--text-gray)" }}>No projects yet.</p>
          )}
        </div>
      </main>
    </>
  );
}
