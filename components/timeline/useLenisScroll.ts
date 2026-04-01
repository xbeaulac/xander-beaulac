// components/timeline/useLenisScroll.ts
"use client";
import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

export function useLenisScroll(totalWidth: number) {
  const lenisRef = useRef<Lenis | null>(null);
  const listenersRef = useRef<(() => void)[]>([]);
  const scrollXRef = useRef(0);

  const getScroll = useCallback(() => scrollXRef.current, []);

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.push(cb);
    return () => {
      listenersRef.current = listenersRef.current.filter((fn) => fn !== cb);
    };
  }, []);

  useEffect(() => {
    const scrollContainer = document.getElementById("timeline-scroll-container");
    if (!scrollContainer) return;

    const content = scrollContainer.firstElementChild as HTMLElement;
    if (!content) return;

    // Detect if mobile
    const isMobile = window.innerWidth < 640;

    // Proper Lenis setup with wrapper and content
    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: content,
      eventsTarget: window,
      orientation: isMobile ? "horizontal" : "vertical",
      smoothWheel: true,
      lerp: 0.08,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Listen to Lenis scroll events and map to horizontal position
    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      if (isMobile) {
        // Mobile: direct horizontal scroll position
        scrollXRef.current = -scroll;
      } else {
        // Desktop: vertical scroll progress to horizontal position
        const progress = limit > 0 ? scroll / limit : 0;
        const maxX = -(totalWidth - window.innerWidth);
        scrollXRef.current = progress * maxX;
      }
      listenersRef.current.forEach((cb) => cb());
    });

    // Lenis RAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [totalWidth]);

  return { getScroll, subscribe, lenisRef };
}
