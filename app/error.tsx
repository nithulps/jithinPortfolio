"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          fontSize: "3rem",
          fontWeight: 800,
          color: "var(--cyan)",
        }}
      >
        Something went wrong
      </h1>
      <p style={{ color: "var(--text-gray)", fontSize: "1.1rem", maxWidth: 460 }}>
        An unexpected error occurred. You can try again.
      </p>
      <button className="btn-hero" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
