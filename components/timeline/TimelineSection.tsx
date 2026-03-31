// components/timeline/TimelineSection.tsx
"use client";
import { useRef, useEffect } from "react";
import { useLenisScroll } from "./useLenisScroll";
import { TimelineCard } from "./TimelineCard";
import { TimelineRuler } from "./TimelineRuler";
import type { TimelineItem } from "@/types/timeline";

interface Props {
  items: TimelineItem[];
}

const CARD_WIDTH = 320; // px  (20rem at 16px base)
const CARD_GAP = 48; // px  (mr-12 = 3rem = 48px)
const CARD_SLOT = CARD_WIDTH + CARD_GAP; // 368px per card

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
  const totalTrackWidth = items.length * CARD_SLOT + 200;
  const monthMarkers = getMonthMarkers(items);

  const { getScroll, subscribe } = useLenisScroll(totalTrackWidth);

  // Apply translate3d on each Lenis tick
  useEffect(() => {
    return subscribe(() => {
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${getScroll()}px, 0, 0)`;
      }
    });
  }, [getScroll, subscribe]);

  return (
    <>
      {/*
        Tall scroll container — gives Lenis something to scroll vertically.
        Height = totalTrackWidth so that scrolling end-to-end maps to the full carousel.
        overflow-y: scroll so Lenis can attach to it.
        The div is invisible but captures scroll events.
      */}
      <div
        id="timeline-scroll-container"
        className="fixed inset-0 overflow-y-scroll no-scrollbar z-[100]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Inner content taller than wrapper — this is what Lenis scrolls */}
        <div style={{ height: `${totalTrackWidth}px`, width: "1px" }} />
      </div>

      {/* Fixed visual carousel — positioned independently of scroll container */}
      <div className="fixed inset-0 flex items-center overflow-hidden z-[1] pointer-events-none">
        <div className="relative select-none pointer-events-auto">
          <div
            ref={trackRef}
            className="flex items-center will-change-transform"
            style={{ width: `${totalTrackWidth}px` }}
          >
            {items.map((item, i) => (
              <TimelineCard
                key={item.id}
                item={item}
                index={i}
                getScroll={getScroll}
                subscribe={subscribe}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Timeline ruler — fixed at bottom */}
      <TimelineRuler
        items={items}
        monthMarkers={monthMarkers}
        totalWidth={totalTrackWidth}
        cardSlot={CARD_SLOT}
        getScroll={getScroll}
        subscribe={subscribe}
      />
    </>
  );
}
