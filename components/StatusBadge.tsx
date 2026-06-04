import Link from "next/link";

export default function StatusBadge() {
  return (
    <Link id="status-badge" href="/contact" aria-label="Open to work — get in touch">
      <span className="status-dot" />
      <span className="status-text">Open to work</span>
    </Link>
  );
}
