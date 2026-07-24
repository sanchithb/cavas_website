import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display face: Space Grotesk — a modern grotesk with real character.
// Swap for Neue Montreal / Söhne via next/font/local if the lab licenses one.
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Telemetry / data readout face.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CAVAS — Connected and Autonomous Vehicle Applications and Systems | University at Buffalo",
  description:
    "CAVAS at the University at Buffalo researches connected and autonomous vehicle technology: the iCAVE2 5-in-1 evaluation instrument, the Autoware-based Lincoln MKZ research vehicle, and the Olli self-driving electric shuttle.",
  keywords: [
    "CAVAS",
    "University at Buffalo",
    "autonomous vehicles",
    "connected vehicles",
    "iCAVE2",
    "LiDAR",
    "Autoware",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-carbon text-ink font-display">{children}</body>
    </html>
  );
}
