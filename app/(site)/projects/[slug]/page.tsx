import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  return { title: project ? `${project.title} - Jithin` : "Project - Jithin" };
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const paragraphs = project.description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <section className="project-detail-hero">
        <div className="project-detail-hero-bg">
          {project.coverImage &&
            (isVideo(project.coverImage) ? (
              <video src={project.coverImage} autoPlay loop muted playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.coverImage} alt={project.title} />
            ))}
        </div>
        <div className="project-detail-hero-overlay" />
        <div className="project-detail-hero-content reveal">
          <div className="project-tags">
            {(project.tags?.length ? project.tags : [project.category])
              .filter(Boolean)
              .map((t) => (
                <span key={t}>{t}</span>
              ))}
          </div>
          <h1>{project.title}</h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10 }}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-hero">
                View live
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-outline">
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="project-detail-body">
        <div className="project-detail-grid-layout">
          <div className="project-description-content reveal">
            {paragraphs.length ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{project.excerpt}</p>
            )}
          </div>

          <aside className="project-meta-sidebar reveal">
            {project.category && (
              <div className="meta-sidebar-item">
                <h4>Category</h4>
                <p>{project.category}</p>
              </div>
            )}
            {project.client && (
              <div className="meta-sidebar-item">
                <h4>Client</h4>
                <p>{project.client}</p>
              </div>
            )}
            {project.role && (
              <div className="meta-sidebar-item">
                <h4>Role</h4>
                <p>{project.role}</p>
              </div>
            )}
            {project.year && (
              <div className="meta-sidebar-item">
                <h4>Year</h4>
                <p>{project.year}</p>
              </div>
            )}
            {project.liveUrl && (
              <div className="meta-sidebar-item">
                <h4>Live</h4>
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Visit site
                </a>
              </div>
            )}
          </aside>
        </div>

        {project.visuals?.length > 0 && (
          <section className="project-visuels-sec reveal">
            <h3>Visuals</h3>
            <div className="project-visuels-grid">
              {project.visuals.map((url, i) =>
                isVideo(url) ? (
                  <video key={i} src={url} controls loop muted playsInline />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`${project.title} visual ${i + 1}`} />
                )
              )}
            </div>
          </section>
        )}

        <div className="project-navigation">
          <Link href="/projects" className="project-nav-link">
            <span className="nav-dir">Back</span>
            <span className="nav-title">All projects</span>
          </Link>
          <Link href="/contact" className="project-nav-link next-link">
            <span className="nav-dir">Next step</span>
            <span className="nav-title">Start a project</span>
          </Link>
        </div>
      </div>
    </>
  );
}
