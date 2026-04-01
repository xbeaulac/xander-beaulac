// app/timeline/page.tsx
"use client";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import { useLenisScroll } from "@/components/timeline/useLenisScroll";
import { timelineItems } from "@/data/timeline";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);

  const [emailCopied, setEmailCopied] = React.useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("hello@xanderbeaulac.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1500);
  };

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
        const rotation = sign * Math.min(80, Math.pow(1.2, absVelocity) - 1);

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
          duration: 0.8,
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
          duration: 0.8,
          ease: "power3.out",
        },
      );

      // 3. Header moves up + cards come in AT THE SAME TIME
      tl.to(headerRef.current, {
        yPercent: 0, // removes vertical centering
        top: "1rem", // anchors to top
        duration: 0.8,
        ease: "power3.inOut",
      });

      if (cards) {
        tl.fromTo(
          cards,
          {
            y: "100vh",
          },
          {
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.5", // perfectly synced with header movement
        );
      }

      // Email slides up from bottom
      tl.fromTo(
        emailRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "<", // perfectly synced with header and cards
      );
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={containerRef}
      className="hidden w-screen h-screen overflow-hidden font-sans"
    >
      <div
        ref={headerRef}
        className="absolute w-screen px-4 top-1/2 left-1/2 sm:text-center z-10"
      >
        <div className="overflow-hidden">
          <h1
            ref={nameRef}
            className="leading-[0.90] text-4xl sm:text-6xl text-nowrap tracking-tight font-black"
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
        className="fixed inset-0 flex items-center overflow-x-auto overflow-y-hidden z-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div
          ref={trackRef}
          className="flex items-center select-none px-4 sm:px-6 gap-4 sm:gap-6"
        >
          {timelineItems.map((item, i) => (
            <TimelineCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        ref={emailRef}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="font-mono text-sm text-gray-900">
          <span>Let&apos;s talk: </span>
          <a
            href="mailto:hello@xanderbeaulac.com"
            onClick={handleEmailClick}
            className="relative inline-block group cursor-pointer"
          >
            <span className="relative flex items-start overflow-hidden">
              <span
                className={`inline-block transition-transform duration-300 ${emailCopied ? "-translate-y-full" : "translate-y-0"}`}
              >
                hello@xanderbeaulac.com
              </span>
              <span
                className={`absolute inset-0 inline-block transition-transform duration-300 ${emailCopied ? "translate-y-0" : "translate-y-full"}`}
              >
                copied!
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-px bg-gray-900 origin-left transition-transform duration-300 ease-out ${emailCopied ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100"}`}
              ></span>
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
