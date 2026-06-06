import Link from "next/link";

export default function StatusBadge({ text }: { text?: string }) {
  return (
    <Link id="status-badge" href="/contact" aria-label="Open to work — get in touch">
      <span className="status-dot" />
      <span className="status-text">{text || "Open to work"}</span>
    </Link>
  );
}
