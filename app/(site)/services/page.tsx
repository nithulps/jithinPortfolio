import Link from "next/link";
import { getServices } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services - Jithin" };

const CHECK = (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M173.9 439.4l-166.4-166.4c-9.4-9.4-9.4-24.6 0-33.9l33.9-33.9c9.4-9.4 24.6-9.4 33.9 0L192 312.7 432.7 72c9.4-9.4 24.6-9.4 33.9 0l33.9 33.9c9.4 9.4 9.4 24.6 0 33.9l-291.7 291.7c-9.3 9.3-24.5 9.3-33.9-.1z" />
  </svg>
);

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <div className="breadcrumbs-container">
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">Services</li>
        </ul>
      </div>

      <section className="page-header-sec reveal">
        <h1>Services</h1>
        <div className="page-filter-pills">
          {services.map((s) => (
            <a key={s._id} href={`#${s.slug}`} className="filter-pill">
              {s.title}
            </a>
          ))}
        </div>
      </section>

      <div className="services-container">
        {services.map((s) => (
          <section key={s._id} className="service-detail-section" id={s.slug}>
            <div className="service-detail-grid">
              <div className="service-detail-info reveal">
                <h2>{s.title}</h2>
                <p>{s.longDescription || s.shortDescription}</p>
                {s.features?.length > 0 && (
                  <ul className="service-feature-list">
                    {s.features.map((f, i) => (
                      <li key={i} className="service-feature-item">
                        {CHECK}
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="service-detail-actions">
                  <Link href="/contact" className="btn-hero">
                    Start a project
                  </Link>
                  <Link href="/projects" className="btn-outline">
                    See related work
                  </Link>
                </div>
              </div>

              <div className="service-detail-card-wrapper">
                <div className="service-card" style={{ alignItems: "flex-start" }}>
                  <div
                    className="service-icon"
                    dangerouslySetInnerHTML={{ __html: s.icon }}
                  />
                  <h4>{s.title}</h4>
                  <p>{s.shortDescription}</p>
                </div>
              </div>
            </div>
          </section>
        ))}
        {services.length === 0 && (
          <p style={{ color: "var(--text-gray)", padding: "60px 0" }}>
            No services yet - add some in the admin panel.
          </p>
        )}
      </div>
    </>
  );
}
