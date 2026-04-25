// components/timeline/TimelineCard.tsx
"use client";
import type { TimelineItem } from "@/types/timeline";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

interface Props {
  item: TimelineItem;
  index: number;
}

function getAspectRatioFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/(\d+)$/);
  if (match) return parseInt(match[1]) / parseInt(match[2]);
  return 0.794;
}

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
        flex flex-col
        w-[24rem] max-w-[70vw]
        ${item.link ? "cursor-pointer" : "cursor-default"}
        pointer-events-auto
      `}
      style={{
        perspective: "1200px",
        transform: "translateY(100vh)",
      }}
    >
      <div
        className="timeline-card-inner flex flex-col transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
      >
        {/* Date label — hidden by default on sm+, slides in on hover */}
        <div className="overflow-hidden mb-2 h-4">
          <div className="text-xs font-mono text-gray-600 uppercase translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
            {item.month} {item.year}
          </div>
        </div>

        {/* Media — fixed width, height derived from aspect ratio, capped */}
        <div
          className={`relative w-full overflow-hidden rounded-lg bg-gray-300 ${item.needsBorder ? "border border-gray-200" : ""}`}
          style={{ aspectRatio: aspectRatio.toString(), maxHeight: "min(55dvh, 26rem)" }}
        >
          {item.videoUrl ? (
            <video
              src={item.videoUrl}
              loop muted autoPlay playsInline draggable={false}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              draggable={false}
              loading="eager"
              className="object-cover"
              sizes="(max-width: 768px) 70vw, 384px"
            />
          )}
        </div>

        {/* Title + highlights — hidden by default on sm+, slides in on hover */}
        <div className="mt-2">
          <div className="overflow-hidden">
            <h3 className="text-sm font-mono font-semibold text-gray-900 mb-1 translate-y-0 sm:-translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
              {item.title}
            </h3>
          </div>
          {item.highlights && item.highlights.length > 0 && (
            <ul className="space-y-1">
              {item.highlights.slice(0, 3).map((highlight, i) => (
                <li key={i} className="overflow-hidden">
                  <div
                    className="text-xs font-mono text-gray-600 flex items-start translate-y-0 sm:-translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300"
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
    </article>
  );

  if (item.link) {
    return (
      <Link href={item.link} target="_blank" rel="noopener noreferrer" className="block group" draggable={false}>
        {CardContent}
      </Link>
    );
  }

  return <div className="group">{CardContent}</div>;
}
