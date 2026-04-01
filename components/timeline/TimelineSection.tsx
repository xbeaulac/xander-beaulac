// components/timeline/TimelineSection.tsx
"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenisScroll } from "./useLenisScroll";
import { TimelineCard } from "./TimelineCard";
import type { TimelineItem } from "@/types/timeline";

gsap.registerPlugin(useGSAP);

interface Props {
  items: TimelineItem[];
}

const CARD_WIDTH = 384; // px (24rem at 16px base)
const CARD_GAP = 24; // px  (mr-6 = 1.5rem = 24px)
const CARD_SLOT = CARD_WIDTH + CARD_GAP; // 408px per card

function getMonthMarkers(items: TimelineItem[]) {
  const markers: { label: string; index: number }[] = [];
  let lastMonth = "";
  items.forEach((item, i) => {
    const monthYear = `${item.month} ${item.year}`;
    if (monthYear !== lastMonth) {
      markers.push({ label: monthYear, index: i });
      lastMonth = monthYear;
    }
  });
  return markers;
}

export function TimelineSection({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);

  // Simple width calculation - cards + starting padding
  const totalTrackWidth = CARD_GAP + items.length * CARD_SLOT;

  const { getScroll, subscribe, lenisRef } = useLenisScroll(totalTrackWidth);

  // Apply translate3d to track and rotateY to cards
  useEffect(() => {
    return subscribe(() => {
      if (trackRef.current && lenisRef.current) {
        const scrollX = getScroll();
        trackRef.current.style.transform = `translate3d(${scrollX}px, 0, 0)`;

        // Update velocity for cards
        const velocity = lenisRef.current.velocity || 0;
        console.log("velocity:", velocity);
        velocityRef.current = velocity;

        // Apply 3D rotation to each card's inner wrapper based on velocity
        const cardInners = trackRef.current.querySelectorAll(
          ".timeline-card-inner",
        );
        // Positive velocity (scrolling down/right) = rotate left side away
        // Use exponential scaling - higher exponent = harder to reach max
        const sign = velocity >= 0 ? -1 : 1;
        const absVelocity = Math.abs(velocity);
        const rotation = sign * Math.min(75, Math.pow(absVelocity, 1.8) * 0.04);
        console.log("rotation:", rotation, "cards found:", cardInners.length);

        cardInners.forEach((inner) => {
          (inner as HTMLElement).style.transform = `rotateY(${rotation}deg)`;
        });
      }
    });
  }, [getScroll, subscribe, lenisRef]);

  return (
    <>
      {/* Scroll container for Lenis - positioned behind everything */}
      <div
        id="timeline-scroll-container"
        className="fixed inset-0 overflow-y-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <div style={{ height: `${totalTrackWidth}px`, width: "1px" }} />
      </div>

      {/* Fixed visual carousel */}
      <div className="fixed inset-0 flex items-center overflow-hidden pointer-events-none z-[1]">
        <div className="relative select-none pointer-events-auto">
          <div
            ref={trackRef}
            className="flex items-center will-change-transform"
            style={{
              width: `${totalTrackWidth}px`,
              paddingLeft: `${CARD_GAP}px`,
            }}
          >
            {/* Just render cards once for now */}
            {items.map((item, i) => (
              <TimelineCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Timeline ruler — HIDDEN FOR NOW */}
      {/* <TimelineRuler
        items={items}
        monthMarkers={monthMarkers}
        totalWidth={totalTrackWidth}
        cardSlot={CARD_SLOT}
        getScroll={getScroll}
        subscribe={subscribe}
      /> */}
    </>
  );
}
