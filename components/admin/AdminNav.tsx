"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/site-settings", label: "Site Settings" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/footer", label: "Footer" },
  { href: "/admin/messages", label: "Messages" },
];

const ICON_PROPS = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  style: { flexShrink: 0 },
};

function NavIcon({ href }: { href: string }) {
  switch (href) {
    case "/admin":
      return <svg {...ICON_PROPS}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>;
    case "/admin/projects":
      return <svg {...ICON_PROPS}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
    case "/admin/services":
      return <svg {...ICON_PROPS}><path d="m12 2 9 5-9 5-9-5 9-5z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></svg>;
    case "/admin/hero":
      return <svg {...ICON_PROPS}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 20" /></svg>;
    case "/admin/about":
      return <svg {...ICON_PROPS}><circle cx="12" cy="8" r="4" /><path d="M6 21v-1a6 6 0 0 1 12 0v1" /></svg>;
    case "/admin/pages":
      return <svg {...ICON_PROPS}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></svg>;
    case "/admin/site-settings":
      return <svg {...ICON_PROPS}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    case "/admin/contact":
      return <svg {...ICON_PROPS}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.95.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.86.35 1.81.59 2.81.72A2 2 0 0 1 22 16.92z" /></svg>;
    case "/admin/footer":
      return <svg {...ICON_PROPS}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="15" x2="21" y2="15" /></svg>;
    case "/admin/messages":
      return <svg {...ICON_PROPS}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
    default:
      return <svg {...ICON_PROPS}><circle cx="12" cy="12" r="9" /></svg>;
  }
}

export default function AdminNav({ logo }: { logo?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [links, setLinks] = useState(LINKS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const stored = localStorage.getItem("admin_sidebar_order");
    if (stored) {
      try {
        const order = JSON.parse(stored) as string[];
        const sorted = [...LINKS].sort((a, b) => {
          const idxA = order.indexOf(a.href);
          const idxB = order.indexOf(b.href);
          if (idxA === -1 && idxB === -1) return 0;
          if (idxA === -1) return 1;
          if (idxB === -1) return -1;
          return idxA - idxB;
        });
        setLinks(sorted);
      } catch (e) {
        console.error("Failed to parse stored sidebar order", e);
      }
    }
  }, []);

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...links];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);
    setLinks(updated);
    setDraggedIndex(index);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    const order = links.map((l) => l.href);
    localStorage.setItem("admin_sidebar_order", JSON.stringify(order));
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <button
        className="admin-menu-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        )}
      </button>

      {open && <div className="admin-sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar${open ? " open" : ""}`}>
        <div className="admin-brand">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="Jithin" className="admin-brand-logo" />
          ) : (
            <span>Jithin · Admin</span>
          )}
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {links.map((l, i) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={`admin-nav-link${active ? " active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "grab",
                opacity: draggedIndex === i ? 0.3 : 1,
                userSelect: "none",
                transition: "opacity 0.2s ease, background 0.15s"
              }}
            >
              <span className="admin-nav-icon" style={{ marginRight: 12, display: "inline-flex" }}>
                <NavIcon href={l.href} />
              </span>
              <span>{l.label}</span>
            </Link>
          );
        })}
        </nav>
        <div className="admin-sidebar-bottom">
          <button className="admin-btn ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
