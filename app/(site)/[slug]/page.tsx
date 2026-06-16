import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/data";
import CategorySections from "@/components/CategorySections";

export const dynamic = "force-dynamic";

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page || page.builtIn) return notFound();

  return (
    <>
      <div className="breadcrumbs-container">
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">{page.title}</li>
        </ul>
      </div>

      <section className="page-header-sec reveal">
        <h1>{page.heading || page.title}</h1>
        {page.subtitle && (
          <p className="hero-desc" style={{ marginTop: 12 }}>
            {page.subtitle}
          </p>
        )}
      </section>

      <main className="container" style={{ paddingTop: 0 }}>
        {page.sections.length === 0 && (page.categories?.length ?? 0) === 0 ? (
          <p style={{ color: "var(--text-gray)" }}>No content yet.</p>
        ) : (
          <CategorySections page={page} />
        )}
      </main>
    </>
  );
}
