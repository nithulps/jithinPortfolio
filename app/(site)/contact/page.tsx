import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { getAbout } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact — Jithin" };

export default async function ContactPage() {
  const about = await getAbout();
  const contact = about?.contact;
  const socials = about?.socials;

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

  const hasSocials =
    !!(socials && (socials.linkedin || socials.github || socials.twitter || socials.instagram));

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

            <div className="contact-details">
              {contact?.email && (
                <a className="contact-detail-row" href={`mailto:${contact.email}`}>
                  <span className="contact-detail-icon">
                    <i className="fas fa-envelope" />
                  </span>
                  <span>{contact.email}</span>
                </a>
              )}
              {contact?.phone && (
                <a
                  className="contact-detail-row"
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                >
                  <span className="contact-detail-icon">
                    <i className="fas fa-phone" />
                  </span>
                  <span>{contact.phone}</span>
                </a>
              )}
              {contact?.address && (
                <div className="contact-detail-row">
                  <span className="contact-detail-icon">
                    <i className="fas fa-location-dot" />
                  </span>
                  <span>{contact.address}</span>
                </div>
              )}
            </div>

            {hasSocials && (
              <div className="contact-socials">
                {socials?.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in" />
                  </a>
                )}
                {socials?.github && (
                  <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                    <i className="fab fa-github" />
                  </a>
                )}
                {socials?.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter / X">
                    <i className="fab fa-x-twitter" />
                  </a>
                )}
                {socials?.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <i className="fab fa-instagram" />
                  </a>
                )}
              </div>
            )}
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
