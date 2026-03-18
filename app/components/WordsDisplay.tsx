"use client";

import { useEffect, useRef, useState } from "react";

interface Lyric {
  text: string;
  delay: number;
}

interface WordsDisplayProps {
  lyrics: Lyric[];
  currentLine: number;
  onLineClick?: (index: number) => void;
}

export default function WordsDisplay({
  lyrics,
  currentLine,
  onLineClick,
}: WordsDisplayProps) {
  const currentLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [centerLineIndex, setCenterLineIndex] = useState(0);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const updateCenterLine = () => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    lineRefs.current.forEach((lineRef, index) => {
      if (!lineRef) return;

      const lineRect = lineRef.getBoundingClientRect();
      const lineCenter = lineRect.top + lineRect.height / 2;
      const distance = Math.abs(lineCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setCenterLineIndex(closestIndex);
  };

  const handleScroll = () => {
    if (isScrollingRef.current) return;

    setAutoScroll(false);
    updateCenterLine();

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };

  const handleSync = () => {
    setAutoScroll(true);
    if (currentLineRef.current) {
      isScrollingRef.current = true;
      currentLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      setCenterLineIndex(currentLine);
      if (currentLineRef.current) {
        isScrollingRef.current = true;
        currentLineRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    }
  }, [currentLine, autoScroll]);

  useEffect(() => {
    updateCenterLine();
  }, []);

  return (
    <div className="w-full h-[175px] md:h-[250px] overflow-hidden relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-8 no-scrollbar snap-y snap-mandatory"
      >
        <div className="space-y-4 py-[100px]">
          {lyrics.map((lyric, index) => {
            const isCentered = index === centerLineIndex;
            const isActive = index === currentLine;

            return (
              <div
                key={index}
                ref={(el) => {
                  lineRefs.current[index] = el;
                  if (index === currentLine) {
                    currentLineRef.current = el;
                  }
                }}
                onClick={() => {
                  onLineClick?.(index);
                  setAutoScroll(true);
                }}
                className={`w-fit transition-all duration-300 text-4xl md:text-6xl font-bold text-black font-display leading-[0.95] underline decoration-transparent hover:decoration-black cursor-pointer snap-center ${
                  isCentered
                    ? "opacity-100 blur-0"
                    : isActive
                      ? "opacity-100 blur-sm"
                      : index < currentLine
                        ? "opacity-40 blur-sm"
                        : "opacity-20 blur-sm"
                }`}
              >
                {lyric.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradient mask overlay */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-white via-transparent to-white" />

      {/* Sync button */}
      <button
        onClick={handleSync}
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium transition-opacity duration-300 ${
          autoScroll ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        Sync
      </button>
    </div>
  );
}
