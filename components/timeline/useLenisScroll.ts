// components/timeline/useLenisScroll.ts
"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useLenisScroll(wrapperId: string) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const content = wrapper.firstElementChild as HTMLElement;
    if (!content) return;

    // Initialize Lenis with horizontal orientation
    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      gestureOrientation: "both",
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaExponent: 1.7,
      lerp: 0.1,
    });

    lenisRef.current = lenis;

    // RAF loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [wrapperId]);

  return lenisRef;
}
