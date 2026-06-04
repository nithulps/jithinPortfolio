"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps a row/grid of items and reveals its direct children on scroll, linked
 * to scroll position (scrubbed): each child slides in from the right + fades in
 * as the row sweeps up through the viewport, and slides back out on scroll up.
 * Children reveal in a left-to-right stagger.
 */
export default function ScrollRevealRow({
  children,
  className = "",
  distance = 90,
  spread = 1.6,
  start = 0.9,
  end = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  spread?: number;
  start?: number;
  end?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const items = Array.from(root.children) as HTMLElement[];
    const M = items.length || 1;

    // Take full control of these items (neutralise the global .reveal handler).
    items.forEach((it) => {
      it.classList.remove("reveal", "active");
      it.style.transition = "none";
      it.style.willChange = "opacity, transform";
    });

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      items.forEach((it) => {
        it.style.opacity = "1";
        it.style.transform = "none";
      });
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const s = vh * start;
      const e = vh * end;
      let p = (s - rect.top) / (s - e);
      p = Math.max(0, Math.min(1, p));

      const head = p * (M + spread);
      items.forEach((it, i) => {
        let o = (head - i) / spread;
        o = Math.max(0, Math.min(1, o));
        it.style.opacity = String(o);
        it.style.transform = `translateX(${((1 - o) * distance).toFixed(2)}px)`;
      });
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
  }, [children, distance, spread, start, end]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
