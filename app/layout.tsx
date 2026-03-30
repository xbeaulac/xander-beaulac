import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cabinetGrotesk = localFont({
  src: "./fonts/CabinetGrotesk-Variable.woff2",
  variable: "--font-cabinet-grotesk",
  display: "swap",
});

const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
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
    <html lang="en" className="bg-cornsilk">
      <body
        className={`${cabinetGrotesk.variable} ${satoshi.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
