"use client";

import dynamic from "next/dynamic";
import { useHeroMode } from "@/lib/hooks";
import HeroStatic from "./HeroStatic";

// The full WebGL sequence is client-only; the loading frame mirrors the
// cold-open so the handoff is invisible.
const Hero3DSequence = dynamic(() => import("./Hero3DSequence"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-carbon">
      <p className="blink-cursor font-mono text-xs uppercase tracking-eyebrow text-lidar/90">
        INITIALIZING SENSOR ARRAY&nbsp;
      </p>
    </div>
  ),
});

export default function Hero() {
  const mode = useHeroMode();
  if (mode === undefined) {
    // Pre-hydration frame: neutral cold-open, no layout shift either way.
    return (
      <div className="flex h-screen items-center justify-center bg-carbon">
        <p className="blink-cursor font-mono text-xs uppercase tracking-eyebrow text-lidar/90">
          INITIALIZING SENSOR ARRAY&nbsp;
        </p>
      </div>
    );
  }
  return mode === "full" ? <Hero3DSequence /> : <HeroStatic />;
}
