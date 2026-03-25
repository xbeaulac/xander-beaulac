"use client";

import { useEffect, useRef, useState } from "react";

interface PlayerControlsProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
}

export default function PlayerControls({
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
}: PlayerControlsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const targetTime = percentage * duration;
    onSeek(Math.max(0, Math.min(targetTime, duration)));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !progressBarRef.current || duration === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const targetTime = percentage * duration;
    onSeek(Math.max(0, Math.min(targetTime, duration)));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-8 py-6 bg-[#fefae0]">
      {/* Progress bar */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="w-full h-2 bg-[#dda15e]/30 rounded-full cursor-pointer mb-4 relative group"
      >
        <div
          className="h-full bg-[#606C38] rounded-full relative transition-all duration-100"
          style={{ width: `${progress}%` }}
        >
          <div
            onMouseDown={handleMouseDown}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-4 h-4 bg-[#283618] rounded-full cursor-grab active:cursor-grabbing transform transition-transform group-hover:scale-125"
          />
        </div>
      </div>

      {/* Time display */}
      <div className="flex justify-between text-sm text-[#283618]/60 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onPrevious}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#dda15e]/20 transition-colors"
          aria-label="Restart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-[#283618]"
          >
            <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
          </svg>
        </button>

        <button
          onClick={onPlayPause}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-[#283618] hover:bg-[#606C38] transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-[#fefae0]"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 text-[#fefae0] ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={onNext}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#dda15e]/20 transition-colors"
          aria-label="Skip to end"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-[#283618]"
          >
            <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
