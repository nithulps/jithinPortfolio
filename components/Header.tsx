"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const DEFAULT_NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // Highlight the parent nav item on its sub-pages too (e.g. detail pages).
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header({
  logo,
  socials,
  extraNav,
}: {
  logo?: string;
  socials?: { linkedin?: string; github?: string; instagram?: string };
  extraNav?: { href: string; label: string }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Insert custom pages before Contact (last default item)
  const NAV = extraNav?.length
    ? [
        ...DEFAULT_NAV.slice(0, -1),
        ...extraNav,
        DEFAULT_NAV[DEFAULT_NAV.length - 1],
      ]
    : DEFAULT_NAV;

  return (
    <>
      <header className="header-nav reveal">
        <div className="logo">
          <Link href="/">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="Jithin logo" />
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-wide)",
                  fontWeight: 800,
                  fontSize: "1.4rem",
                  color: "var(--cyan)",
                }}
              >
                J.
              </span>
            )}
          </Link>
        </div>

        <nav className="main-menu">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive(pathname, item.href) ? "active" : ""}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-btn">
          <Link href="/contact" className="btn-project">
            Start a project
          </Link>
        </div>

        <button
          className="menu-toggle"
          aria-label="Open navigation menu"
          onClick={() => setOpen(true)}
        >
          <i className="fas fa-bars" style={{ fontSize: 26, color: "#fff" }} />
        </button>
      </header>

      <div className={`menu-overlay${open ? " open" : ""}`}>
        <header
          className="header-nav"
          style={{ position: "absolute", background: "transparent", borderBottom: "none" }}
        >
          <div className="logo">
            <Link href="/" onClick={() => setOpen(false)}>
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="Jithin logo" />
              ) : (
                <span
                  style={{
                    fontFamily: "var(--font-wide)",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "var(--cyan)",
                  }}
                >
                  J.
                </span>
              )}
            </Link>
          </div>
          <div />
          <button
            className="menu-toggle"
            aria-label="Close navigation menu"
            style={{ display: "block" }}
            onClick={() => setOpen(false)}
          >
            <i className="fas fa-times" style={{ fontSize: 28, color: "#fff" }} />
          </button>
        </header>

        <div className="menu-overlay-links">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="menu-overlay-socials">
          {socials?.linkedin && (
            <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin" />
            </a>
          )}
          {socials?.github && (
            <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <i className="fab fa-github" />
            </a>
          )}
          {socials?.instagram && (
            <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram" />
            </a>
          )}
        </div>

        <div className="menu-overlay-marquee">
          <div className="marquee-content">
            {Array.from({ length: 6 }).map((_, i) => (
              <Link key={i} href="/contact" onClick={() => setOpen(false)}>
                LET&apos;S WORK TOGETHER
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
