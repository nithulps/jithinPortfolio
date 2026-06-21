"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";

/**
 * Ports the interactivity from the original index.js:
 * smooth scroll (Lenis), custom cursor, scroll-reveal, navbar scrolled
 * state, and back-to-top button visibility.
 */
export default function ClientEffects() {
  const pathname = usePathname();
  const router = useRouter();
  const lenisRef = useRef<Lenis | null>(null);

  // On a full page reload (not in-app navigation), send the visitor home.
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload" && window.location.pathname !== "/") {
      router.replace("/");
    }
    // Run once on initial document load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth scroll - set up once.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Custom cursor (desktop only)
    let cursorRaf = 0;
    const cursor = document.getElementById("cur");
    if (cursor && window.innerWidth > 768) {
      let mouseX = 0,
        mouseY = 0,
        posX = 0,
        posY = 0;
      const onMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      const animate = () => {
        posX += (mouseX - posX) * 0.15;
        posY += (mouseY - posY) * 0.15;
        cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
        cursorRaf = requestAnimationFrame(animate);
      };
      document.addEventListener("mousemove", onMove);
      animate();
      const down = () => cursor.classList.add("click");
      const up = () => cursor.classList.remove("click");
      document.addEventListener("mousedown", down);
      document.addEventListener("mouseup", up);
    }

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(cursorRaf);
      lenis.destroy();
    };
  }, []);

  // Re-run reveal + hover wiring whenever the route changes (new DOM).
  useEffect(() => {
    // Reset scroll to the top on navigation. Lenis keeps its own scroll
    // position across route changes, so reset it (and the native scroll).
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    const revealEls = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach((el) => obs.observe(el));

    // Cursor hover states
    const cursor = document.getElementById("cur");
    const addHover = () => cursor?.classList.add("hover");
    const removeHover = () => cursor?.classList.remove("hover");
    const hoverEls = document.querySelectorAll(
      "a, button, .project-card, .logo, .menu-toggle"
    );
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    // Navbar scrolled state + back-to-top visibility
    const header = document.querySelector(".header-nav");
    const btnTop = document.getElementById("btnTop");
    const onScroll = () => {
      if (window.scrollY > 50) header?.classList.add("scrolled");
      else header?.classList.remove("scrolled");
      if (window.scrollY > 400) btnTop?.classList.add("visible");
      else btnTop?.classList.remove("visible");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      obs.disconnect();
      hoverEls.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
