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
    // Lenis needs a tall scrollable wrapper to map vertical scroll → horizontal position.
    // We create a dedicated scroll container div with height = totalWidth so that
    // scrolling from top to bottom maps to scrolling the full carousel left to right.
    const scrollContainer = document.getElementById(
      "timeline-scroll-container",
    );

    if (!scrollContainer) {
      console.error("❌ Scroll container not found! #timeline-scroll-container");
      return;
    }

    console.log("✅ Found scroll container:", scrollContainer);
    console.log("Container height:", scrollContainer.offsetHeight);
    console.log("Content height:", scrollContainer.firstElementChild?.scrollHeight);

    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: scrollContainer.firstElementChild as HTMLElement,
      orientation: "vertical",
      gestureOrientation: "both", // capture both vertical wheel and horizontal trackpad
      smoothWheel: true,
      lerp: 0.08, // matches the feel of the original (0.08 = their lerp factor)
      touchMultiplier: 2,
      wheelEventsTarget: window, // Listen to wheel events on window instead of wrapper
    });

    lenisRef.current = lenis;
    console.log("✅ Lenis initialized:", lenis);

    lenis.on(
      "scroll",
      ({ scroll, limit }: { scroll: number; limit: number }) => {
        console.log("📜 Scroll event:", { scroll, limit });
        // Map vertical scroll progress (0→1) to horizontal pixel offset (0→-(totalWidth - vw))
        const progress = limit > 0 ? scroll / limit : 0;
        const maxX = -(totalWidth - window.innerWidth);
        scrollXRef.current = progress * maxX;
        listenersRef.current.forEach((cb) => cb());
      },
    );

    // Lenis needs its own rAF loop
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      console.log("🧹 Cleaning up Lenis");
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [totalWidth]);

  return { getScroll, subscribe, lenisRef };
}
