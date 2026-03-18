"use client";

import { useEffect, useRef } from "react";

interface Lyric {
  text: string;
  delay: number;
}

interface WordsDisplayProps {
  lyrics: Lyric[];
  currentLine: number;
}

export default function WordsDisplay({
  lyrics,
  currentLine,
}: WordsDisplayProps) {
  const currentLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLineRef.current) {
      currentLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLine]);

  return (
    <div className="w-full h-[175px] md:h-[250px] overflow-hidden relative">
      <div className="h-full overflow-y-auto px-8 no-scrollbar">
        <div className="space-y-4 py-[100px]">
          {lyrics.map((lyric, index) => (
            <div
              key={index}
              ref={index === currentLine ? currentLineRef : null}
              className={`transition-all duration-700 text-4xl md:text-6xl font-bold text-black font-display leading-[0.95] ${
                index === currentLine
                  ? "opacity-100 blur-0"
                  : index < currentLine
                    ? "opacity-40 blur-sm"
                    : "opacity-20 blur-sm"
              }`}
            >
              {lyric.text}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient mask overlay */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-white via-transparent to-white" />
    </div>
  );
}
