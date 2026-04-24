import draftedImage from "@/public/events/drafted.png";
import ivAccessImage from "@/public/events/iv-access.jpg";
import krustyKrabCover from "@/public/events/krusty-krab-cover.webp";
import memoriesCover from "@/public/events/memories-cover.jpeg";
import pixelPeopleImage from "@/public/events/pixel-people.png";
import runClubImage from "@/public/events/running-club.jpg";
import skiingImage from "@/public/events/skiing.jpg";
import stoodoiusImage from "@/public/events/stoodious.png";
import wavesCover from "@/public/events/waves-cover.jpeg";
import youngMeImage from "@/public/events/little-me.jpg";
import useHomeLoansImage from "@/public/events/usa-home-loans.png";
import type { TimelineItem } from "@/types/timeline";

// Timeline data in reverse chronological order (newest first)
export const timelineItems: TimelineItem[] = [
  {
    id: 1,
    month: "March",
    year: 2026,
    category: "Project",
    title: "Founded Stoodious",
    imageUrl: stoodoiusImage,
    needsBorder: true,
    link: "https://stoodious.io",
    highlights: [
      "Degree planner for me and my friends",
      "Pitched to Chapman for university-wide adoption",
    ],
  },
  {
    id: 2,
    month: "December",
    year: 2025,
    category: "Work",
    title: "Ski Instructor at Diamond Peak",
    imageUrl: skiingImage,
    highlights: [
      "Loved being outside and on my feet",
      "Loved seeing that spark when someone figured it out",
    ],
  },
  {
    id: 3,
    month: "September",
    year: 2025,
    category: "Work",
    title: "Built Drafted MVP",
    imageUrl: draftedImage,
    needsBorder: true,
    link: "https://drafted.ai",
    highlights: [
      "Met the founder on the street",
      "Built their landing page 2 hours later",
      "Shipped MVP doing full stack web development",
    ],
  },
  {
    id: 4,
    month: "April",
    year: 2025,
    category: "Music",
    title: "Released Waves",
    imageUrl: wavesCover,
    link: "https://open.spotify.com/track/3aQ5szsZqiRR0KmeQnEf8p",
    highlights: ["Shifted artistic direction to indie pop", "Recorded acoustic instruments"],
  },
  {
    id: 5,
    month: "August",
    year: 2023,
    category: "Project",
    title: "Founded Chapman Run Club",
    imageUrl: runClubImage,
    link: "https://www.instagram.com/runningclubcu/",
    highlights: ["Chapman didn't have a run club, so I started it!"],
  },
  {
    id: 6,
    month: "June",
    year: 2023,
    category: "Music",
    title: "Released Album",
    imageUrl: memoriesCover,
    link: "https://open.spotify.com/album/2J8MvpbTonmhKTDkaFnobZ?si=3RH98G9pSTSmmSR3Fwj-og",
    highlights: ["Songs I made over the years", "Released on my 18th birthday"],
  },
  {
    id: 7,
    month: "March",
    year: 2023,
    category: "Project",
    title: "Designed a CRM",
    imageUrl: useHomeLoansImage,
    needsBorder: true,
    link: "https://github.com/xbeaulac/usahomeloans-crm",
    highlights: ["For a family friend at 16"],
  },
  {
    id: 8,
    month: "February",
    year: 2022,
    category: "Project",
    title: "Pixel People NFT Collection",
    imageUrl: pixelPeopleImage,
    link: "https://github.com/xbeaulac/pixel-people",
    highlights: [
      "Taught myself pixel art at 16",
      "Programmatically generated Pixel People",
    ],
  },
  {
    id: 9,
    month: "September",
    year: 2021,
    category: "Project",
    title: "Built Beach Access App",
    imageUrl: ivAccessImage,
    link: "https://github.com/xbeaulac/incline-village-access",
    highlights: [
      "Managed access to my local beach",
      "Forget my punchcard, so I put it on my phone.",
    ],
  },

  {
    id: 10,
    month: "June",
    year: 2019,
    category: "Music",
    title: "Dropped Krusty Krab",
    imageUrl: krustyKrabCover,
    link: "https://open.spotify.com/track/3IpWC0lKJEy3PjOPgImN59?si=d87ee5fe424e4b60",
    highlights: ["Meme rap song that blew up", "Released when I was 13"],
  },
  {
    id: 11,
    month: "September",
    year: 2017,
    category: "Life",
    title: "Started the Journey",
    imageUrl: youngMeImage,
    highlights: ["My passions for tech and music began", "I was 12 years old"],
  },
];
