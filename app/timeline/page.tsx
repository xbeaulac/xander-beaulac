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
      {/* Hero title — sits above the cards, fixed position */}
      <div className="fixed inset-x-0 top-0 flex items-center justify-center z-[2] pointer-events-none select-none pt-8">
        <h1 className="text-[clamp(3rem,10vw,9rem)] font-black leading-none tracking-tight text-center mix-blend-multiply text-black">
          XANDER BEAULAC
        </h1>
      </div>

      {/* The timeline */}
      <TimelineSection items={timelineItems} />
    </main>
  );
}
