// app/timeline/page.tsx
"use client";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import { useLenisScroll } from "@/components/timeline/useLenisScroll";
import { timelineItems } from "@/data/timeline";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useEffect } from "react";

gsap.registerPlugin(useGSAP);

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);

  const lenisRef = useLenisScroll("timeline-scroll-wrapper");

  // Apply 3D rotation to cards based on velocity
  useEffect(() => {
    if (!lenisRef.current) return;

    const unsubscribe = lenisRef.current.on("scroll", () => {
      if (trackRef.current && lenisRef.current) {
        const velocity = lenisRef.current.velocity || 0;
        velocityRef.current = velocity;

        // Apply 3D rotation to each card's inner wrapper based on velocity
        const cardInners = trackRef.current.querySelectorAll(
          ".timeline-card-inner",
        );
        const sign = velocity >= 0 ? -1 : 1;
        const absVelocity = Math.abs(velocity);
        const rotation = sign * Math.min(80, Math.pow(absVelocity, 1.4) * 0.04);

        cardInners.forEach((inner) => {
          (inner as HTMLElement).style.transform = `rotateY(${rotation}deg)`;
        });
      }
    });

    return () => unsubscribe?.();
  }, [lenisRef]);


  // GSAP animation sequence
  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });

      const cards = trackRef.current?.querySelectorAll(".timeline-card");

      tl.set(containerRef.current, {
        display: "block",
      });

      // 0. Set initial transform state (replaces Tailwind centering)
      tl.set(headerRef.current, {
        xPercent: -50,
        yPercent: -50,
      });

      // 1. Name in
      tl.fromTo(
        nameRef.current,
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
          duration: 0.75,
          ease: "power3.out",
        },
      );

      // 2. Subtitle in
      tl.fromTo(
        subtitleRef.current,
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
          duration: 0.75,
          ease: "power3.out",
        },
        "+=0.1",
      );

      // 3. Header moves up + cards come in AT THE SAME TIME
      tl.to(
        headerRef.current,
        {
          yPercent: 0, // removes vertical centering
          top: "1rem", // anchors to top
          duration: 0.75,
          ease: "power3.inOut",
        },
        "+=0.3",
      );

      if (cards) {
        tl.fromTo(
          cards,
          {
            y: "100vh",
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
          },
          "<", // perfectly synced with header movement
        );
      }
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={containerRef}
      className="hidden w-screen h-screen overflow-hidden"
    >
      <div
        ref={headerRef}
        className="absolute w-screen px-4 top-1/2 left-1/2 sm:text-center z-10"
      >
        <div className="overflow-hidden">
          <h1
            ref={nameRef}
            className="leading-[0.90] text-4xl sm:text-5xl lg:text-6xl text-nowrap tracking-tight font-black"
          >
            XANDER BEAULAC
          </h1>
        </div>
        <div className="overflow-hidden mt-2">
          <p
            ref={subtitleRef}
            className="font-mono text-sm lg:text-base text-gray-600"
          >
            Software Engineer, Founder, and Recording Artist
          </p>
        </div>
      </div>
      {/* Horizontal scrolling carousel */}
      <div
        id="timeline-scroll-wrapper"
        className="fixed inset-0 flex items-center overflow-x-auto overflow-y-hidden z-[1]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div
          ref={trackRef}
          className="flex items-center select-none"
        >
          {timelineItems.map((item, i) => (
            <TimelineCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
