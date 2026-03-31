// components/timeline/TimelineRuler.tsx
"use client";
import { useRef, useEffect, useState } from "react";
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
const TICK_INTERVAL = 10; // px between ticks (denser like reference)
const TICK_HEIGHT_MINOR = 24; // normal grey ticks
const TICK_HEIGHT_LABEL = 48; // taller tick at label center
const TICK_HEIGHT_CENTER = 96; // center viewport tick (tallest, black)
const TICK_HEIGHT_HOVER_ADD = 24; // add 24px on hover (not center tick)
const TICK_COLOR_NORMAL = "#9ca3af"; // grey-400 - darker for visibility
const TICK_COLOR_CENTER = "#000000"; // black for center tick
const TICK_LINE_WIDTH = 1; // thicker lines for visibility
const HOVER_RADIUS = 64; // px radius around cursor to extend ticks

function drawTicks(
  canvas: HTMLCanvasElement,
  totalRulerWidth: number,
  labelPositions: number[],
  mouseX: number | null,
  scrollX: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = TICK_LINE_WIDTH;

  // The canvas is scaled by devicePixelRatio, so we need to use the logical size
  const logicalWidth = canvas.offsetWidth;
  const logicalHeight = canvas.offsetHeight;

  const viewportCenterX = logicalWidth / 2; // Center of viewport in LOGICAL coordinates

  // For infinite scrolling: calculate which ticks are visible in the viewport
  // Use modulo to loop the ruler infinitely
  const scrollOffset = scrollX * RULER_SCALE;

  // Calculate the range of ticks we need to draw (visible area + buffer)
  const tickStart = Math.floor((0 - scrollOffset - 100) / TICK_INTERVAL);
  const tickEnd = Math.ceil((logicalWidth - scrollOffset + 100) / TICK_INTERVAL);

  // First pass: find the tick closest to viewport center
  let closestTickIndex = -1;
  let minDistance = Infinity;
  const tickPositions: { canvasX: number; rulerX: number; i: number }[] = [];

  for (let i = tickStart; i <= tickEnd; i++) {
    const rulerX = i * TICK_INTERVAL;
    // Apply the scroll offset with RULER_SCALE for parallax
    const canvasX = rulerX + scrollOffset;

    // Skip ticks outside visible canvas (with small buffer)
    if (canvasX < -10 || canvasX > logicalWidth + 10) continue;

    tickPositions.push({ canvasX, rulerX, i });

    const distanceFromCenter = Math.abs(canvasX - viewportCenterX);
    if (distanceFromCenter < minDistance) {
      minDistance = distanceFromCenter;
      closestTickIndex = i;
    }
  }

  // Second pass: draw all ticks
  tickPositions.forEach(({ canvasX, rulerX, i }) => {
    const isCenterTick = i === closestTickIndex;

    // Check if this tick is at a label position
    const isLabelTick = labelPositions.some((labelPos) => {
      return Math.abs(rulerX - labelPos) < TICK_INTERVAL / 2;
    });

    // Determine tick height and color
    let tickH: number;
    let tickColor: string;

    if (isCenterTick) {
      // Center tick: tallest and black
      tickH = TICK_HEIGHT_CENTER;
      tickColor = TICK_COLOR_CENTER;
    } else if (isLabelTick) {
      // Label tick: taller than normal
      tickH = TICK_HEIGHT_LABEL;
      tickColor = TICK_COLOR_NORMAL;
    } else {
      // Normal tick
      tickH = TICK_HEIGHT_MINOR;
      tickColor = TICK_COLOR_NORMAL;
    }

    // Apply hover effect (add fixed height, excluding center tick)
    if (mouseX !== null && !isCenterTick) {
      const distanceFromMouse = Math.abs(canvasX - mouseX);
      if (distanceFromMouse < HOVER_RADIUS) {
        const hoverFalloff = 1 - distanceFromMouse / HOVER_RADIUS;
        const hoverAddition = TICK_HEIGHT_HOVER_ADD * hoverFalloff;
        tickH += hoverAddition;
      }
    }

    ctx.strokeStyle = tickColor;
    ctx.beginPath();
    ctx.moveTo(canvasX, height / 2 - tickH / 2);
    ctx.lineTo(canvasX, height / 2 + tickH / 2);
    ctx.stroke();
  });

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
  const [mouseX, setMouseX] = useState<number | null>(null);
  const scrollXRef = useRef(0);

  // Calculate label positions in ruler space (for taller ticks)
  const labelPositions = monthMarkers.map(
    (marker) => marker.index * cardSlot * RULER_SCALE,
  );

  // Setup canvas and redraw on mount/resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawTicks(canvas, rulerWidth, labelPositions, mouseX, scrollXRef.current);
    };

    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [rulerWidth, labelPositions]);

  // Redraw ticks when mouse moves or scroll changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redraw = () => {
      drawTicks(canvas, rulerWidth, labelPositions, mouseX, scrollXRef.current);
    };

    // Subscribe to scroll updates
    const unsubscribe = subscribe(() => {
      scrollXRef.current = getScroll();
      if (trackRef.current) {
        const scrollX = getScroll();
        // Apply same modulo wrapping as cards for infinite labels
        const singleLoopWidth = (items.length * cardSlot);
        const wrappedX = ((scrollX % singleLoopWidth) - singleLoopWidth) * RULER_SCALE;
        trackRef.current.style.transform = `translate3d(${wrappedX}px, 0, 0)`;
      }
      redraw();
    });

    redraw();
    return unsubscribe;
  }, [getScroll, subscribe, totalWidth, rulerWidth, labelPositions, mouseX, items.length, cardSlot]);

  // Track mouse position over ruler
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMouseX(e.clientX - rect.left);
    }
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  return (
    <div className="fixed bottom-20 md:bottom-[50px] inset-x-0 z-10 pointer-events-none">
      <div
        className="relative h-[60px] pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Ruler area with canvas ticks */}
        <div className="relative h-full">
          {/* Canvas tick marks — covers full viewport width */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
          />

          {/* Moving month label track */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none">
            <div
              ref={trackRef}
              className="relative will-change-transform"
              style={{ width: `${rulerWidth * 3}px` }}
            >
              {/* Render labels 3 times for infinite loop */}
              {[0, 1, 2].map((loopIndex) =>
                monthMarkers.map((marker) => {
                  // Position label based on the card index × scaled card slot + loop offset
                  const leftPx = (marker.index * cardSlot * RULER_SCALE) + (loopIndex * rulerWidth);
                  return (
                    <span
                      key={`${loopIndex}-${marker.label}-${marker.index}`}
                      className="absolute text-[10px] font-mono tracking-widest text-black -translate-x-1/2 top-[15px] uppercase"
                      style={{ left: `${leftPx}px` }}
                    >
                      {marker.label}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
