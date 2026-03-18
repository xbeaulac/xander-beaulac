"use client";

import { useEffect, useRef, useState } from "react";
import MediaDisplay from "./components/MediaDisplay";
import WordsDisplay from "./components/WordsDisplay";

interface Lyric {
  text: string;
  delay: number;
}

interface MediaItem {
  src: string;
  type: "image" | "video";
  startDelay: number;
  endDelay: number;
}

const lyrics: Lyric[] = [
  { text: "Hi! I'm Xander Beaulac.", delay: 0 },
  { text: "I build websites and make music,", delay: 3000 },
  { text: "usually above 6000 feet.", delay: 4500 },
  { text: "I'm a junior at Chapman University,", delay: 7500 },
  { text: "studying Software Engineering", delay: 9000 },
  { text: "and Music Technology.", delay: 10500 },
  { text: "I love to run, hike,", delay: 13500 },
  { text: "rock climb, and ski.", delay: 15000 },
  { text: "I just had my 21st birthday,", delay: 18000 },
  { text: "where I jumped out of a plane.", delay: 19500 },
];

const media: MediaItem[] = [
  { src: "/images/portrait.jpg", type: "image", startDelay: 0, endDelay: 3000 },
  {
    src: "/images/coding.jpg",
    type: "image",
    startDelay: 3000,
    endDelay: 6000,
  },
  {
    src: "/images/mountain.jpg",
    type: "image",
    startDelay: 4500,
    endDelay: 7500,
  },
  {
    src: "/images/chapman.jpg",
    type: "image",
    startDelay: 7500,
    endDelay: 12000,
  },
  {
    src: "/images/outdoor.jpg",
    type: "image",
    startDelay: 13500,
    endDelay: 16500,
  },
  {
    src: "/images/skydiving.jpg",
    type: "image",
    startDelay: 18000,
    endDelay: 21000,
  },
];

export default function Home() {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const handleLineClick = (index: number) => {
    setCurrentLine(index);
    startTimeRef.current = Date.now() - lyrics[index].delay;
  };

  useEffect(() => {
    if (currentLine < lyrics.length - 1) {
      const timer = setTimeout(
        () => {
          setCurrentLine(currentLine + 1);
        },
        lyrics[currentLine + 1].delay - lyrics[currentLine].delay,
      );

      return () => clearTimeout(timer);
    }
  }, [currentLine]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now() - startTimeRef.current);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Media on top */}
      <div className="flex-1">
        <MediaDisplay currentTime={currentTime} media={media} />
      </div>

      {/* Lyrics below */}
      <WordsDisplay
        lyrics={lyrics}
        currentLine={currentLine}
        onLineClick={handleLineClick}
      />
    </div>
  );
}
