// types/timeline.ts
import type { StaticImageData } from "next/image";

export type TimelineItem = {
  id: number;
  month: string; // e.g. "March"
  year: number; // e.g. 2025
  category: string; // e.g. "Inspire" | "Educate" | "Showcase"
  title: string;
  imageUrl: string | StaticImageData;
  videoUrl?: string; // optional video URL (loops silently)
  needsBorder?: boolean; // add border for images with white/light backgrounds
  link?: string; // optional link for the card
  highlights?: string[]; // optional bullet points (max 3)
};
