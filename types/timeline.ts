// types/timeline.ts
export type TimelineItem = {
  id: number;
  month: string; // e.g. "March"
  year: number; // e.g. 2025
  category: string; // e.g. "Inspire" | "Educate" | "Showcase"
  title: string;
  imageUrl: string;
  imageAspectRatio?: number; // default ~1.26 (portrait)
  link?: string; // optional link for the card
};
