"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/contact", label: "Contact Page" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">Jithin · Admin</div>
      <nav>
        {LINKS.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link key={l.href} href={l.href} className={`admin-nav-link${active ? " active" : ""}`}>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-bottom">
        <a className="admin-nav-link" href="/" target="_blank" rel="noreferrer">
          ↗ View site
        </a>
        <button className="admin-btn ghost" onClick={logout}>
          Log out
        </button>
      </div>
    </aside>
  );
}
