// app/timeline/page.tsx
"use client";
import { TimelineCard } from "@/components/timeline/TimelineCard";
import { useLenisScroll } from "@/components/timeline/useLenisScroll";
import { timelineItems } from "@/data/timeline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const tracks = [
  "evergreen.mp3",
  "geetar.mp3",
  "just wanna dance.mp3",
  "waves.mp3",
];

function trackLabel(filename: string) {
  return filename.replace(/\.mp3$/i, "");
}

function randomTrack() {
  return tracks[Math.floor(Math.random() * tracks.length)];
}

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const trackDropdownRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const soundPromptRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const velocityRef = useRef(0);

  const [emailCopied, setEmailCopied] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const selectedTrackRef = useRef<string>("");

  useEffect(() => {
    const t = randomTrack();
    setSelectedTrack(t);
    selectedTrackRef.current = t;
  }, []);
  const [withSound, setWithSound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("hello@xanderbeaulac.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1500);
  };

  const lenisRef = useLenisScroll("timeline-scroll-wrapper");

  useEffect(() => {
    if (!lenisRef.current) return;
    const unsubscribe = lenisRef.current.on("scroll", () => {
      if (cardsTrackRef.current && lenisRef.current) {
        const velocity = lenisRef.current.velocity || 0;
        velocityRef.current = velocity;
        const cardInners = cardsTrackRef.current.querySelectorAll(
          ".timeline-card-inner",
        );
        const sign = velocity >= 0 ? -1 : 1;
        const absVelocity = Math.abs(velocity);
        const rotation = sign * Math.min(80, Math.pow(absVelocity, 1.4) * 0.5);
        cardInners.forEach((inner) => {
          (inner as HTMLElement).style.transform = `rotateY(${rotation}deg)`;
        });
      }
    });
    return () => unsubscribe?.();
  }, [lenisRef]);

  // Keep ref in sync so the ended handler always sees the current track
  useEffect(() => {
    selectedTrackRef.current = selectedTrack;
  }, [selectedTrack]);

  function selectTrack(t: string) {
    setSelectedTrack(t);
    selectedTrackRef.current = t;
    if (!audioRef.current) {
      const audio = new Audio(`/music/${encodeURIComponent(t)}`);
      audio.volume = 0.6;
      audio.addEventListener("ended", () => {
        const currentIndex = tracks.indexOf(selectedTrackRef.current);
        const next = tracks[(currentIndex + 1) % tracks.length];
        setSelectedTrack(next);
        selectedTrackRef.current = next;
        audio.src = `/music/${encodeURIComponent(next)}`;
        audio.play().catch(() => {});
      });
      audioRef.current = audio;
    } else {
      audioRef.current.src = `/music/${encodeURIComponent(t)}`;
    }
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  }

  function proceedToTimeline(sound: boolean) {
    setWithSound(sound);

    if (sound) {
      const audio = new Audio(`/music/${encodeURIComponent(selectedTrack)}`);
      audio.volume = 0.6;
      audio.addEventListener("ended", () => {
        const currentIndex = tracks.indexOf(selectedTrackRef.current);
        const next = tracks[(currentIndex + 1) % tracks.length];
        setSelectedTrack(next);
        selectedTrackRef.current = next;
        audio.src = `/music/${encodeURIComponent(next)}`;
        audio.play().catch(() => {});
      });
      audio.play().catch(() => {});
      audioRef.current = audio;
      setIsPlaying(true);
    }

    const postChoice = tlRef.current;
    if (!postChoice) return;

    gsap.to(soundPromptRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(soundPromptRef.current, { display: "none" });
        if (carouselRef.current)
          carouselRef.current.style.pointerEvents = "auto";
        postChoice.play();
      },
    });
  }

  useGSAP(
    () => {
      const cards = cardsTrackRef.current?.querySelectorAll(".timeline-card");

      // Post-choice: header slides up, track dropdown fades in below subtitle, cards + footer come in
      const postChoice = gsap.timeline({ paused: true });
      tlRef.current = postChoice;

      postChoice.to(headerRef.current, {
        marginTop: 0,
        duration: 0.9,
        ease: "power3.inOut",
      });
      postChoice.set(trackDropdownRef.current, { display: "flex" }, "-=0.4");
      postChoice.fromTo(
        trackDropdownRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "<",
      );
      if (cards) {
        postChoice.fromTo(
          cards,
          { y: "100vh" },
          { y: 0, duration: 1.2, ease: "power3.out", stagger: 0.08 },
          "-=0.6",
        );
      }
      postChoice.fromTo(
        emailRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "<",
      );

      // Intro: plays immediately, ends waiting for user choice
      const intro = gsap.timeline({ delay: 0.3 });
      intro.set(containerRef.current, { display: "flex" });
      intro.set(headerRef.current, { marginTop: "35dvh" });
      intro.fromTo(
        nameRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.8, ease: "power3.out" },
      );
      intro.fromTo(
        subtitleRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.8, ease: "power3.out" },
      );
      intro.fromTo(
        soundPromptRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
    },
    { scope: containerRef },
  );

  return (
    <main
      ref={containerRef}
      className="hidden flex-col w-screen h-dvh overflow-hidden font-sans gap-4 py-4"
    >
      {/* Header */}
      <div ref={headerRef} className="shrink-0 sm:text-center px-4 sm:px-6">
        <div className="overflow-hidden">
          <h1
            ref={nameRef}
            className="leading-[0.90] text-4xl sm:text-6xl text-nowrap tracking-tight font-black"
          >
            XANDER BEAULAC
          </h1>
        </div>
        <div className="overflow-hidden mt-2">
          <p
            ref={subtitleRef}
            className="font-mono text-sm lg:text-base text-gray-600"
          >
            Software Engineer, Founder, and Recording Artist
          </p>
        </div>

        {/* Track dropdown — hidden until after sound choice, lives in main UI */}
        <div
          ref={trackDropdownRef}
          className="mt-3 flex justify-start sm:justify-center items-center gap-3"
          style={{ display: "none" }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="font-mono text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 cursor-pointer outline-none">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" fill="currentColor" />
                <circle cx="18" cy="16" r="3" fill="currentColor" />
              </svg>
              {trackLabel(selectedTrack)}
              <svg className="w-3.5 h-3.5" viewBox="0 0 10 6" fill="none">
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="max-h-56 overflow-y-auto min-w-48"
            >
              {tracks.map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => selectTrack(t)}
                  className={`font-mono ${t === selectedTrack ? "font-semibold text-gray-900" : ""}`}
                >
                  {trackLabel(t)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Play/pause button */}
          <button
            onClick={() => {
              if (!audioRef.current) {
                selectTrack(selectedTrackRef.current);
                return;
              }
              if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
              } else {
                audioRef.current.play().catch(() => {});
                setIsPlaying(true);
              }
            }}
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor" className="w-4 h-4"
              >
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            )}
          </button>
        </div>

        {/* Sound prompt — shown during intro only */}
        <div
          ref={soundPromptRef}
          className="mt-6 flex flex-col items-center gap-2 opacity-0"
        >
          <button
            onClick={() => proceedToTimeline(true)}
            className="font-mono text-sm px-5 py-2 bg-gray-900 text-[var(--color-cornsilk)] rounded-full cursor-pointer hover:bg-gray-700 transition-colors duration-200"
          >
            Continue with sound
          </button>
          <button
            onClick={() => proceedToTimeline(false)}
            className="font-mono text-sm text-gray-400 cursor-pointer hover:text-gray-900 transition-colors duration-200"
          >
            Without sound
          </button>
        </div>
      </div>

      {/* Carousel — pointer-events disabled until user makes a choice */}
      <div
        ref={carouselRef}
        id="timeline-scroll-wrapper"
        className="flex-1 min-h-0 flex items-center  px-4 sm:px-6 overflow-x-auto overflow-y-hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          pointerEvents: "none",
          scrollPaddingLeft: "1rem",
        }}
      >
        <div
          ref={cardsTrackRef}
          className="flex items-center select-none gap-4 sm:gap-6"
        >
          {timelineItems.map((item, i) => (
            <TimelineCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div ref={emailRef} className="shrink-0 flex justify-center px-4 sm:px-6">
        <div className="font-mono text-sm text-gray-900 flex items-center gap-8">
          <a
            href="mailto:hello@xanderbeaulac.com"
            onClick={handleEmailClick}
            className="relative inline-block group cursor-pointer"
          >
            <span className="relative flex items-start overflow-hidden">
              <span
                className={`inline-block transition-transform duration-300 ${emailCopied ? "-translate-y-full" : "translate-y-0"}`}
              >
                hello@xanderbeaulac.com
              </span>
              <span
                className={`absolute inset-0 inline-block transition-transform duration-300 ${emailCopied ? "translate-y-0" : "translate-y-full"}`}
              >
                copied!
              </span>
              <span
                className={`absolute bottom-0 left-0 w-full h-px bg-gray-900 origin-left transition-transform duration-300 ease-out ${emailCopied ? "scale-x-0" : "scale-x-100 group-hover:scale-x-0"}`}
              ></span>
            </span>
          </a>
          <a
            href="https://docs.google.com/document/d/16AFFCZI-t5xr9_4XJtL9KRd-Lrt2qV9i/edit?usp=sharing&ouid=111632038240813900288&rtpof=true&sd=true"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block group cursor-pointer"
          >
            <span className="relative inline-block">
              resumé
              <span className="absolute bottom-0 left-0 w-full h-px bg-gray-900 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-300 ease-out"></span>
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
