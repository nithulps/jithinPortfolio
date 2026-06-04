import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 24px",
        gap: 18,
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-wide)",
          fontSize: "8rem",
          lineHeight: 1,
          fontWeight: 800,
          color: "var(--cyan)",
          textShadow: "0 0 40px rgba(0,222,255,0.3)",
        }}
      >
        404
      </h1>
      <p style={{ color: "var(--text-gray)", fontSize: "1.15rem", maxWidth: 460 }}>
        This page took a wrong turn. Let&apos;s get you back on track.
      </p>
      <Link href="/" className="btn-hero">
        Back to home
      </Link>
    </main>
  );
}
