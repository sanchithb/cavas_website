"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** Oversized numeral that counts up when scrolled into view.
 *  Renders the final value immediately under prefers-reduced-motion. */
export default function Stat({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const reduced = usePrefersReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const u = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - u, 3);
          setDisplay(Math.round(value * eased));
          if (u < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]);

  return (
    <div ref={ref}>
      <p className="text-6xl font-bold tracking-tighter text-ink md:text-7xl">
        {display}
        <span className="text-lidar">{suffix}</span>
      </p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-eyebrow text-dim">{label}</p>
    </div>
  );
}
