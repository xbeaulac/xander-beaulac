// components/timeline/TimelineSection.tsx
"use client";
import { useRef, useEffect, useState } from "react";
import { useLenisScroll } from "./useLenisScroll";
import { TimelineCard } from "./TimelineCard";
import { TimelineRuler } from "./TimelineRuler";
import type { TimelineItem } from "@/types/timeline";

interface Props {
  items: TimelineItem[];
}

const CARD_WIDTH = 450; // px (28.125rem at 16px base)
const CARD_GAP = 48; // px  (mr-12 = 3rem = 48px)
const CARD_SLOT = CARD_WIDTH + CARD_GAP; // 498px per card

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
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch by only calculating width on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple width calculation - cards + starting padding
  const totalTrackWidth = CARD_GAP + items.length * CARD_SLOT;

  const { getScroll, subscribe } = useLenisScroll(totalTrackWidth);

  // Simple translate3d - just move the track horizontally based on scroll
  useEffect(() => {
    return subscribe(() => {
      if (trackRef.current) {
        const scrollX = getScroll();
        trackRef.current.style.transform = `translate3d(${scrollX}px, 0, 0)`;
      }
    });
  }, [getScroll, subscribe]);

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
      <div className="fixed inset-0 flex items-center overflow-hidden pointer-events-none">
        <div className="relative select-none pointer-events-auto">
          <div
            ref={trackRef}
            className="flex items-center will-change-transform"
            style={{ width: `${totalTrackWidth}px`, paddingLeft: `${CARD_GAP}px` }}
          >
            {/* Just render cards once for now */}
            {items.map((item, i) => (
              <TimelineCard
                key={item.id}
                item={item}
                index={i}
              />
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
