import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { getAbout } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact — Jithin" };

export default async function ContactPage() {
  const about = await getAbout();

  return (
    <>
      <div className="breadcrumbs-container">
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item active">Contact</li>
        </ul>
      </div>

      <section className="page-header-sec reveal">
        <h1>Contact</h1>
        <div className="page-filter-pills">
          <span className="filter-pill active">Let&apos;s talk</span>
        </div>
      </section>

      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-info-panel reveal">
            <h2>Let&apos;s build something reliable.</h2>
            <p>
              Tell me about your product and testing needs. Whether it&apos;s manual QA, an
              automation framework, or performance testing — I&apos;m here to help you ship with
              confidence.
            </p>
            <p>
              <em>Fill out the form and I&apos;ll get back to you as soon as possible.</em>
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
