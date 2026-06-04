import Link from "next/link";
import type { ProjectDTO } from "@/lib/data";

export default function ProjectCard({ project }: { project: ProjectDTO }) {
  return (
    <Link href={`/projects/${project.slug}`} className="project-card reveal">
      <div className="project-image-wrapper">
        {project.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverImage} alt={project.title} />
        )}
        <div className="project-card-glow" />
      </div>
      <div className="project-tags">
        {(project.tags?.length ? project.tags : [project.category]).filter(Boolean).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <h4 className="project-title">{project.title}</h4>
      <p className="project-excerpt">{project.excerpt}</p>
    </Link>
  );
}
