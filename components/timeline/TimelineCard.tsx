// components/timeline/TimelineCard.tsx
"use client";
import type { TimelineItem } from "@/types/timeline";
import type { StaticImageData } from "next/image";
import Image from "next/image";

interface Props {
  item: TimelineItem;
  index: number;
}

// Extract dimensions from URL like "https://picsum.photos/seed/ski/400/450"
function getAspectRatioFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/(\d+)$/);
  if (match) {
    const width = parseInt(match[1]);
    const height = parseInt(match[2]);
    return width / height;
  }
  return 0.794; // default portrait aspect ratio
}

// Get aspect ratio from static image data or URL
function getAspectRatio(imageUrl: string | StaticImageData): number {
  if (typeof imageUrl === "object" && "width" in imageUrl) {
    return imageUrl.width / imageUrl.height;
  }
  return getAspectRatioFromUrl(imageUrl as string);
}

export function TimelineCard({ item }: Props) {
  const aspectRatio = getAspectRatio(item.imageUrl);

  const CardContent = (
    <article
      className={`
        timeline-card
        relative
        w-[70vw] sm:w-[24rem]
        ${item.link ? "cursor-pointer" : "cursor-default"}
        pointer-events-auto
      `}
      style={{
        perspective: "1200px",
        transform: "translateY(100vh)",
        opacity: 0,
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
            translate-y-0 sm:translate-y-full
            sm:group-hover:translate-y-0
            transition-transform duration-300
          "
            >
              {item.month} {item.year}
            </div>
          </div>

          {/* Media container */}
          <div
            className="relative w-full"
            style={{ aspectRatio: aspectRatio.toString() }}
          >
            <figure
              className={`absolute inset-0 overflow-hidden origin-top-left rounded-lg bg-gray-300 ${item.needsBorder ? "border border-gray-200" : ""}`}
            >
              {item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  loop
                  muted
                  autoPlay
                  playsInline
                  draggable={false}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  draggable={false}
                  className="object-cover"
                  sizes="(max-width: 768px) 320px, 450px"
                />
              )}
            </figure>
          </div>

          {/* Title and highlights — cascade animation */}
          <div className="absolute top-full left-0 mt-2 w-full">
            {/* Title */}
            <div className="overflow-hidden">
              <h3
                className="text-sm font-mono font-semibold text-gray-900 mb-1 translate-y-0 sm:-translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300"
                style={{ transitionDelay: "0ms" }}
              >
                {item.title}
              </h3>
            </div>

            {/* Highlights - each with cascading delay */}
            {item.highlights && item.highlights.length > 0 && (
              <ul className="space-y-1">
                {item.highlights.slice(0, 3).map((highlight, i) => (
                  <li key={i} className="overflow-hidden">
                    <div
                      className="text-xs sm:text-sm font-mono text-gray-600 flex items-start translate-y-0 sm:-translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300"
                      style={{ transitionDelay: `${(i + 1) * 0}ms` }}
                    >
                      <span className="mr-1.5">•</span>
                      <span>{highlight}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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
        draggable={false}
      >
        {CardContent}
      </a>
    );
  }

  return <div className="group">{CardContent}</div>;
}
