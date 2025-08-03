import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xander Beaulac",
  description:
    "I'm Xander Beaulac, a software engineer, entrepreneur, and recording artist.",
  openGraph: {
    title: "Xander Beaulac",
    description:
      "I'm Xander Beaulac, a software engineer, entrepreneur, and recording artist.",
    url: "https://xanderbeaulac.com",
    siteName: "Xander Beaulac",
    images: [
      {
        url: "https://xanderbeaulac.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xander Beaulac hero graphic",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xander Beaulac",
    description:
      "I'm Xander Beaulac, a software engineer, entrepreneur, and recording artist.",
    images: ["https://xanderbeaulac.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
