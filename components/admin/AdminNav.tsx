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

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [links, setLinks] = useState(LINKS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
    <aside className="admin-sidebar">
      <div className="admin-brand">Jithin · Admin</div>
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
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: 8, opacity: 0.35, flexShrink: 0 }}
              >
                <circle cx="9" cy="5" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="9" cy="19" r="1.5" />
                <circle cx="15" cy="5" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="15" cy="19" r="1.5" />
              </svg>
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
  );
}
