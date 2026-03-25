"use client";

import { useEffect, useRef, useState } from "react";
import MediaDisplay from "./components/MediaDisplay";
import WordsDisplay from "./components/WordsDisplay";
import PlayerControls from "./components/PlayerControls";
import phraseData from "../public/phrases.json";

interface Phrase {
  text: string;
  start: number;
  end: number;
}

interface MediaItem {
  src: string;
  type: "image" | "video";
  startDelay: number;
  endDelay: number;
}

// Load pre-generated phrases
const phrases: Phrase[] = phraseData.phrases;
const AUDIO_URL = phraseData.audioUrl;

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(AUDIO_URL);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // Find current phrase based on time
      for (let i = 0; i < phrases.length; i++) {
        if (
          audio.currentTime >= phrases[i].start &&
          audio.currentTime < phrases[i].end
        ) {
          setCurrentPhraseIndex(i);
          break;
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    // Skip to last phrase (CTA)
    if (!audioRef.current) return;
    const lastPhrase = phrases[phrases.length - 1];
    audioRef.current.currentTime = lastPhrase.start;
    setCurrentPhraseIndex(phrases.length - 1);
  };

  const handlePrevious = () => {
    // Restart from beginning
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentPhraseIndex(0);
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  };

  return (
    <div className="min-h-screen bg-[#fefae0] flex flex-col">
      {/* Media on top */}
      <div className="flex-1">
        <MediaDisplay currentTime={currentTime * 1000} media={media} />
      </div>

      {/* Captions in the middle */}
      <WordsDisplay phrases={phrases} currentPhraseIndex={currentPhraseIndex} />

      {/* Player controls at the bottom */}
      <PlayerControls
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
      />
    </div>
  );
}
