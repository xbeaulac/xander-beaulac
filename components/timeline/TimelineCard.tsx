// components/timeline/TimelineCard.tsx
"use client";
import Image from "next/image";
import type { TimelineItem } from "@/types/timeline";

interface Props {
  item: TimelineItem;
  index: number;
}

export function TimelineCard({ item, index }: Props) {
  const CardContent = (
    <article
      className="
        timeline-card
        relative
        w-[28.125rem]
        mr-12
        cursor-pointer
        pointer-events-auto
      "
      style={{
        perspective: "1200px",
      }}
    >
      {/* Inner wrapper for 3D transform */}
      <div
        className="timeline-card-inner transition-transform duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
        }}
      >
      {/* Card content wrapper */}
      <div className="relative">
        {/* Date label — slides in from top on hover */}
        <div
          className="
          absolute bottom-full left-0 mb-2
          overflow-hidden
          w-full
        "
        >
          <div
            className="
            text-xs font-mono text-gray-600 uppercase
            translate-y-full
            group-hover:translate-y-0
            transition-transform duration-500
          "
          >
            {item.month} {item.year}
          </div>
        </div>

        {/* Image container */}
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

        {/* Title label — slides in from bottom on hover */}
        <div
          className="
          absolute top-full left-0 mt-2
          overflow-hidden
          w-full
        "
        >
          <div
            className="
            text-sm font-medium text-gray-900 uppercase
            -translate-y-full
            group-hover:translate-y-0
            transition-transform duration-500
          "
          >
            {item.title}
          </div>
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
        className="block group"
      >
        {CardContent}
      </a>
    );
  }

  return <div className="group">{CardContent}</div>;
}
