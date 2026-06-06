import Link from "next/link";

const MESSAGES = [
  "Ready to ship quality software?",
  "Contact me!",
  "Every great product starts with great testing.",
  "Contact me!",
  "Ready to eliminate bugs?",
  "Contact me!",
  "When do we start?",
  "Contact me!",
];

export default function Footer({
  heading,
  subtitle,
}: {
  heading?: string;
  subtitle?: string;
}) {
  return (
    <footer className="site-footer" id="contact">
      <div className="aeruk-marquee">
        {/* duplicated content for a seamless CSS marquee loop */}
        <div className="marquee-content">
          {[...MESSAGES, ...MESSAGES].map((m, i) => (
            <Link key={i} href="/contact">
              {m}
            </Link>
          ))}
        </div>
      </div>

      <div className="footer-cta reveal">
        <h2>{heading || "Ready to ship quality software?"}</h2>
        <p>{subtitle || "Tell me about your project and testing needs — let\u2019s discuss and work together!"}</p>
        <Link href="/contact" className="btn-footer">
          Start a project
        </Link>
      </div>

      <div className="footer-bottom">
        <div className="copyright">&copy;{new Date().getFullYear()}. Jithin.</div>
        <Link href="/" className="btn-legal">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
