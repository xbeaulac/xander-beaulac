# Horizontal Timeline Component — Implementation Spec

> Reverse-engineered from [tlb.betteroff.studio](https://tlb.betteroff.studio)
> Target: Next.js + Tailwind CSS

---

## What You're Building

A full-viewport horizontal scroll timeline where:

- The page has **no native scroll** — wheel/touch events are captured and converted to horizontal `translate3d` motion
- Cards sit in a fixed viewport and slide left as the user scrolls down/right
- A **ruler at the bottom** shows tick marks (drawn on Canvas) and month labels that move in sync
- Each card has **hover-reveal labels** (slide in from top/bottom) and a **GSAP Flip** animation when active
- The title text overlaps the cards and is fixed in place

---

## Packages to Install

```bash
npm install gsap @gsap/react lenis
```

GSAP Flip is included in the gsap package (not a separate install). Register it at app level:

```ts
// app/layout.tsx or a client component
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);
```

---

## File Structure

```
components/
  timeline/
    TimelineSection.tsx    # outer wrapper, wires Lenis to the visual carousel
    TimelineCard.tsx       # individual card with hover labels
    TimelineRuler.tsx      # bottom canvas + month labels
    useLenisScroll.ts      # Lenis setup + scroll → horizontal position mapping
    useGsapFlip.ts         # GSAP Flip hook for card expand transitions

types/
  timeline.ts              # TimelineItem type
```

---

## Data Shape

```ts
// types/timeline.ts
export type TimelineItem = {
  id: number;
  month: string; // e.g. "March"
  year: number; // e.g. 2025
  category: string; // e.g. "Inspire" | "Educate" | "Showcase"
  title: string;
  imageUrl: string;
  imageAspectRatio?: number; // default ~1.26 (portrait)
};
```

---

## 1. Lenis Setup

Lenis replaces the custom scroll engine. It handles wheel normalization, lerp smoothing, touch, reduced-motion, and drag — all the edge cases you'd otherwise debug yourself.

Lenis works by creating a "virtual" scroll on a tall element, then firing a `scroll` event each rAF tick with the smoothed position. We use that position to drive our horizontal `translate3d`.

```ts
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
    if (!scrollContainer) return;

    const lenis = new Lenis({
      wrapper: scrollContainer,
      content: scrollContainer.firstElementChild as HTMLElement,
      orientation: "vertical",
      gestureOrientation: "both", // capture both vertical wheel and horizontal trackpad
      smoothWheel: true,
      lerp: 0.08, // matches the feel of the original (0.08 = their lerp factor)
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on(
      "scroll",
      ({ scroll, limit }: { scroll: number; limit: number }) => {
        // Map vertical scroll progress (0→1) to horizontal pixel offset (0→-(totalWidth - vw))
        const progress = scroll / limit;
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
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [totalWidth]);

  return { getScroll, subscribe, lenisRef };
}
```

---

## 2. Main Timeline Section

The key structural change with Lenis: we need a tall scrollable div (`#timeline-scroll-container`) whose height equals the carousel track width. Lenis scrolls that div vertically; we map that scroll progress to a horizontal `translate3d`. The visual carousel stays `fixed`.

```tsx
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
    if (item.month !== lastMonth) {
      markers.push({ label: item.month, index: i });
      lastMonth = item.month;
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
        The div is invisible; only the fixed carousel is visible.
      */}
      <div
        id="timeline-scroll-container"
        className="absolute inset-x-0 top-0 overflow-y-scroll"
        style={{ height: "100vh" }} // viewport height wrapper
      >
        {/* Inner content taller than wrapper — this is what Lenis scrolls */}
        <div style={{ height: `${totalTrackWidth}px` }} />
      </div>

      {/* Fixed visual carousel — positioned independently of scroll container */}
      <div className="fixed inset-0 flex items-center overflow-hidden z-[1]">
        <div className="relative select-none cursor-grab active:cursor-grabbing">
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
```

---

## 3. Timeline Card

```tsx
// components/timeline/TimelineCard.tsx
"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import type { TimelineItem } from "@/types/timeline";

interface Props {
  item: TimelineItem;
  index: number;
  getScroll: () => number;
  subscribe: (cb: () => void) => () => void;
}

// Subtle per-card parallax offset (each card moves slightly differently)
const PARALLAX_FACTOR = 0.04; // matches the ~0.04px values seen in the source

export function TimelineCard({ item, index, getScroll, subscribe }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Each card gets a tiny individual parallax shift on the content inside
  useEffect(() => {
    return subscribe(() => {
      if (!cardRef.current) return;
      const x = getScroll() * PARALLAX_FACTOR;
      cardRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
    });
  }, [getScroll, subscribe]);

  return (
    <article
      className="
        relative
        min-w-[20rem] max-w-[20rem]
        md:min-w-[28.1rem] md:max-w-[28.1rem]
        mr-12 md:mr-20
        group
        cursor-pointer
      "
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      {/* Card content wrapper — rotateY for 3D flip effect */}
      <div ref={cardRef} className="relative will-change-transform">
        {/* Number label — slides in from top on hover */}
        <div
          className="
          absolute bottom-full left-0 mb-4
          overflow-hidden
          hidden md:block
        "
        >
          <div
            className="
            text-xs font-mono text-gray-400
            translate-y-full
            group-hover:translate-y-0
            transition-transform duration-700 ease-out
          "
          >
            {String(item.id).padStart(3, "0")}
          </div>
        </div>

        {/* Image container — this is the GSAP Flip target */}
        <div
          className="relative w-full"
          style={{ aspectRatio: item.imageAspectRatio ?? "0.794" }} // portrait ~4:5
        >
          <figure className="absolute inset-0 overflow-hidden origin-top-left">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 320px, 450px"
            />
          </figure>
        </div>

        {/* Category label — slides in from bottom on hover */}
        <div
          className="
          absolute top-full left-0 mt-4
          overflow-hidden
          hidden md:block
        "
        >
          <div
            className="
            text-xs font-mono text-gray-400
            -translate-y-full
            group-hover:translate-y-0
            transition-transform duration-700 ease-out
          "
          >
            {item.category} / {item.month}
          </div>
        </div>
      </div>
    </article>
  );
}
```

---

## 4. Timeline Ruler (Canvas + Month Labels)

This is the bottom scrubber bar. Tick marks are drawn on a `<canvas>`. Month labels are absolutely positioned on a wide track that translates in sync with the cards.

```tsx
// components/timeline/TimelineRuler.tsx
"use client";
import { useRef, useEffect } from "react";
import type { TimelineItem } from "@/types/timeline";

interface MonthMarker {
  label: string;
  index: number;
}

interface Props {
  items: TimelineItem[];
  monthMarkers: MonthMarker[];
  totalWidth: number; // full carousel track width in px
  cardSlot: number; // px per card (width + gap)
  getScroll: () => number;
  subscribe: (cb: () => void) => () => void;
}

const RULER_SCALE = 0.572; // timeline track is ~57.2% of carousel track width
// (38610 / 67662 from the source)
const TICK_INTERVAL = 20; // px between minor ticks in ruler space
const TICK_HEIGHT_MINOR = 6;
const TICK_HEIGHT_MAJOR = 12; // every 5th tick is taller
const TICK_COLOR = "#d2d0cf"; // --timberwolf from the source CSS vars

function drawTicks(canvas: HTMLCanvasElement, totalRulerWidth: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = TICK_COLOR;
  ctx.lineWidth = 1;

  const tickCount = Math.floor(totalRulerWidth / TICK_INTERVAL);
  for (let i = 0; i <= tickCount; i++) {
    const x = ((i * TICK_INTERVAL) / totalRulerWidth) * width;
    const isMajor = i % 5 === 0;
    const tickH = isMajor ? TICK_HEIGHT_MAJOR : TICK_HEIGHT_MINOR;
    ctx.beginPath();
    ctx.moveTo(x, height / 2 - tickH / 2);
    ctx.lineTo(x, height / 2 + tickH / 2);
    ctx.stroke();
  }
}

export function TimelineRuler({
  items,
  monthMarkers,
  totalWidth,
  cardSlot,
  getScroll,
  subscribe,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rulerWidth = totalWidth * RULER_SCALE;

  // Draw ticks once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Set canvas to full viewport width
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    canvas
      .getContext("2d")
      ?.scale(window.devicePixelRatio, window.devicePixelRatio);
    drawTicks(canvas, rulerWidth);
  }, [rulerWidth]);

  // Sync ruler translate3d with main carousel scroll
  useEffect(() => {
    return subscribe(() => {
      if (!trackRef.current) return;
      // Scale scroll to ruler coordinate space
      const x = getScroll() * RULER_SCALE;
      trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
    });
  }, [getScroll, subscribe, RULER_SCALE]);

  return (
    <div className="fixed bottom-20 md:bottom-[50px] inset-x-0 z-10 pointer-events-none">
      <div className="relative">
        {/* Ruler area with canvas ticks */}
        <div className="relative h-[60px]">
          {/* Canvas tick marks — covers full viewport width */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
          />

          {/* Center scrubber indicator line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[24px] bg-gray-800" />

          {/* Moving month label track */}
          <div className="absolute inset-x-0 bottom-0">
            <div
              ref={trackRef}
              className="relative will-change-transform"
              style={{ width: `${rulerWidth}px` }}
            >
              {monthMarkers.map((marker) => {
                // Position label based on the card index × scaled card slot
                const leftPx = marker.index * cardSlot * RULER_SCALE;
                return (
                  <span
                    key={`${marker.label}-${marker.index}`}
                    className="absolute text-[10px] font-mono tracking-widest text-gray-400 -translate-x-1/2 top-[15px] uppercase"
                    style={{ left: `${leftPx}px` }}
                  >
                    {marker.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Page Usage

```tsx
// app/page.tsx  (or wherever you want the timeline)
import { TimelineSection } from "@/components/timeline/TimelineSection";
import type { TimelineItem } from "@/types/timeline";

// Example data — replace with your CMS/API data
const items: TimelineItem[] = [
  {
    id: 1,
    month: "March",
    year: 2025,
    category: "Inspire",
    title: "Article title",
    imageUrl: "/images/1.jpg",
  },
  {
    id: 2,
    month: "March",
    year: 2025,
    category: "Educate",
    title: "Article title",
    imageUrl: "/images/2.jpg",
  },
  // ... more items, grouped by month chronologically (newest first)
];

export default function HomePage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-white">
      {/* Hero title — sits above the cards, fixed position */}
      <div className="fixed inset-x-0 top-0 flex items-center justify-center z-[2] pointer-events-none select-none pt-8">
        <h1 className="text-[clamp(3rem,10vw,9rem)] font-black leading-none tracking-tight text-center mix-blend-multiply">
          Your Title
          <br />
          THE LOOKBACK
        </h1>
      </div>

      {/* The timeline */}
      <TimelineSection items={items} />
    </main>
  );
}
```

---

## 6. Required Tailwind Config

The source uses custom `ease-out-expo` easing. Add to your `tailwind.config.ts`:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
};
export default config;
```

Then use `ease-out-expo` in Tailwind classes:

```
transition-transform duration-700 ease-out-expo
```

---

## 7. GSAP Flip Integration (Optional — for click-to-expand animation)

When a card is clicked, GSAP Flip animates the image expanding to fill the viewport. This is the `js-flip-o` / `js-flip-target` behavior from the source.

```tsx
// components/timeline/useGsapFlip.ts
"use client";
import { useCallback } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

export function useGsapFlip() {
  const triggerFlip = useCallback(
    (fromEl: HTMLElement, toEl: HTMLElement, onComplete?: () => void) => {
      // 1. Capture the "before" state
      const state = Flip.getState(fromEl);

      // 2. Move/resize the element to its new position/size
      toEl.appendChild(fromEl);

      // 3. Animate from old state to new
      Flip.from(state, {
        duration: 0.8,
        ease: "power3.inOut",
        onComplete,
      });
    },
    [],
  );

  return { triggerFlip };
}
```

In your card component, capture the image ref and call `triggerFlip` on click to send it to a full-screen overlay.

---

## 8. Key CSS (add to globals.css)

```css
/* globals.css */

/* Disable native scroll on the timeline page */
body.timeline-page {
  overflow: hidden;
  height: 100vh;
}

/* Card 3D perspective — required for the rotateY flip effect */
.carousel-item {
  perspective: 1000px;
  transform-style: preserve-3d;
}

/* Smooth font rendering for big titles */
h1 {
  -webkit-font-smoothing: antialiased;
}
```

Add `timeline-page` class to `<body>` on the timeline page using Next.js layout or `useEffect`.

---

## Architecture Summary

| Layer                 | Technique                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| Scroll engine         | Lenis (`lerp: 0.08`) attached to a tall invisible div; fires smoothed scroll position each rAF |
| Vertical → horizontal | Lenis scroll progress (0→1) mapped to horizontal pixel offset (0→maxX)                         |
| Card movement         | Single `translate3d(x, 0, 0)` on the whole track div, set in Lenis `scroll` callback           |
| Per-card parallax     | Each card also gets a tiny individual `translate3d` (multiplied by ~0.04)                      |
| Ruler sync            | Ruler track gets `translate3d(x * 0.572, 0, 0)` — scaled down from card track                  |
| Tick marks            | Drawn on `<canvas>` once at mount; minor ticks every 20px, major every 5th                     |
| Month labels          | `position: absolute; left: Xpx` on the ruler track, X = `cardIndex × cardSlot × RULER_SCALE`   |
| Card hover            | CSS only — `translate-y-full → translate-y-0` on labels with `overflow-hidden` clip            |
| Image expand          | GSAP Flip — capture state, move DOM element, animate from captured state                       |
| Drag                  | Handled by Lenis natively (touch + pointer)                                                    |

---

## Gotchas

1. **`will-change-transform`** on the sliding track is essential — without it, the browser repaints the whole track on every frame.
2. The **canvas pixel ratio** must be set to `window.devicePixelRatio` to avoid blurry ticks on retina screens.
3. **Touch devices**: The original uses `has-hover` to detect hover capability. Disable hover-reveal labels on touch devices using `@media (hover: hover)`.
4. **Card count → total width**: Always compute `totalWidth` dynamically from your actual item count × `CARD_SLOT`. Don't hardcode.
5. The Lenis **`lerp: 0.08`** gives the characteristic "sticky then glides" feel. Lower = more slippery, higher = snappier. This is the main tuning knob.
6. The `RULER_SCALE` (`0.572`) was measured from the source: the ruler track width is 38610px while the card track is 67662px. Adjust if your card sizes differ.
7. **Lenis + Next.js App Router**: Lenis must run in a `'use client'` component. If you're using the App Router, wrap `useLenisScroll` in a client component boundary — don't try to instantiate it in a Server Component.
8. **Lenis scroll container must be in the DOM before Lenis initializes**. Use `useEffect` (not `useLayoutEffect`) to instantiate Lenis so the `#timeline-scroll-container` element is guaranteed to exist.
