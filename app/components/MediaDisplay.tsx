"use client";

interface MediaItem {
  src: string;
  type: "image" | "video";
  startDelay: number;
  endDelay: number;
}

interface MediaDisplayProps {
  currentTime: number;
  media: MediaItem[];
}

export default function MediaDisplay({ currentTime, media }: MediaDisplayProps) {
  const currentMedia = media.find(
    (item) => currentTime >= item.startDelay && currentTime < item.endDelay,
  );

  if (!currentMedia) return null;

  return (
    <div className="w-full h-full relative">
      {currentMedia.type === "image" ? (
        <img
          src={currentMedia.src}
          alt="Media content"
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      ) : (
        <video
          src={currentMedia.src}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      )}
    </div>
  );
}
