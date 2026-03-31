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

  const CardContent = (
    <article
      className="
        relative
        min-w-[20rem] max-w-[20rem]
        md:min-w-[28.1rem] md:max-w-[28.1rem]
        mr-12 md:mr-20
        group
        cursor-pointer
        pointer-events-auto
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
            transition-transform duration-700 ease-out-expo
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
          <figure className="absolute inset-0 overflow-hidden origin-top-left rounded-lg bg-gray-300">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 320px, 450px"
            />
          </figure>
        </div>

        {/* Title overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg flex items-end p-6">
          <h3 className="text-white font-bold text-xl md:text-2xl">
            {item.title}
          </h3>
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
            transition-transform duration-700 ease-out-expo
          "
          >
            {item.category} / {item.month} {item.year}
          </div>
        </div>
      </div>
    </article>
  );

  // If there's a link, wrap in an anchor tag
  if (item.link) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
