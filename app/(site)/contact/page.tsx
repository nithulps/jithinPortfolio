import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { getAbout } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact — Jithin" };

export default async function ContactPage() {
  const about = await getAbout();
  const contact = about?.contact;

  const heading = contact?.heading || "Contact";
  const pill = contact?.pill || "Let's talk";
  const infoHeading = contact?.infoHeading || "Let's build something reliable.";
  const infoParagraphs =
    contact?.infoParagraphs && contact.infoParagraphs.length
      ? contact.infoParagraphs
      : [
          "Tell me about your product and testing needs. Whether it's manual QA, an automation framework, or performance testing — I'm here to help you ship with confidence.",
          "<em>Fill out the form and I'll get back to you as soon as possible.</em>",
        ];

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
        <h1>{heading}</h1>
        <div className="page-filter-pills">
          <span className="filter-pill active">{pill}</span>
        </div>
      </section>

      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-info-panel reveal">
            <h2>{infoHeading}</h2>
            {infoParagraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
            ))}
            {contact?.email && (
              <p>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            )}
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
