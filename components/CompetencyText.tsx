"use client";

import { useEffect, useRef } from "react";

/**
 * Renders the competency statement and reveals it word-by-word, linked to
 * scroll position. As the block scrolls up through the viewport the words
 * progressively fade + rise + unblur in a left-to-right sweep; scrolling back
 * down reverses the reveal. Gradient phrases (span.gradient-text) reveal as a
 * single unit so their gradient stays intact.
 */
export default function CompetencyText({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 1) Split into words once (idempotent across StrictMode re-runs).
    if (el.dataset.split !== "true") {
      let idx = 0;
      const frag = document.createDocumentFragment();

      const makeWord = (text: string) => {
        const w = document.createElement("span");
        w.className = "cw";
        w.style.setProperty("--i", String(idx++));
        w.textContent = text;
        return w;
      };

      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          (node.textContent || "").split(/(\s+)/).forEach((part) => {
            if (part === "") return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
            else frag.appendChild(makeWord(part));
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const elem = node as HTMLElement;
          elem.classList.add("cw");
          elem.style.setProperty("--i", String(idx++));
          frag.appendChild(elem);
        } else {
          frag.appendChild(node.cloneNode(true));
        }
      });

      el.innerHTML = "";
      el.appendChild(frag);
      el.dataset.split = "true";
    }

    const words = Array.from(el.querySelectorAll<HTMLElement>(".cw"));
    const N = words.length || 1;

    // Respect reduced-motion: show everything, no scroll scrubbing.
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      words.forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
        w.style.filter = "none";
      });
      return;
    }

    // How many words are "softened" into the transition at once. Larger = a
    // longer trailing gradient of half-revealed words.
    const SPREAD = 6;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // progress 0 -> 1 as the block sweeps up through the viewport.
      const start = vh * 0.78; // begin only once the block has risen up from the bottom
      const end = vh * 0.30; // fully revealed when the top reaches the upper third
      let p = (start - rect.top) / (start - end);
      p = Math.max(0, Math.min(1, p));

      const head = p * (N + SPREAD); // leading edge of the reveal
      for (let i = 0; i < N; i++) {
        let o = (head - i) / SPREAD;
        o = Math.max(0, Math.min(1, o));
        const w = words[i];
        w.style.opacity = String(o);
        w.style.transform = `translateY(${((1 - o) * 0.45).toFixed(3)}em)`;
        w.style.filter = `blur(${((1 - o) * 10).toFixed(2)}px)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [html]);

  return (
    <h2
      ref={ref}
      className={`competency-text reveal-words ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
