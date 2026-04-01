// app/timeline/page.tsx
"use client";
import { useEffect } from "react";
import { TimelineSection } from "@/components/timeline/TimelineSection";
import { timelineItems } from "@/data/timeline";

export default function TimelinePage() {
  // Add timeline-page class to body for overflow control
  useEffect(() => {
    document.body.classList.add("timeline-page");
    return () => {
      document.body.classList.remove("timeline-page");
    };
  }, []);

  return (
    <main className="w-screen h-screen overflow-hidden bg-white">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center z-10">
        <h1 className="leading-[0.90] text-6xl lg:text-[clamp(3rem,8vw,9rem)] lg:text-nowrap tracking-tight font-black">
          XANDER BEAULAC
        </h1>
        <p className="font-mono text-sm lg:text-base text-gray-600 mt-2">
          Software Engineer, Founder, and Recording Artist
        </p>
      </div>
      <TimelineSection items={timelineItems} />
    </main>
  );
}
