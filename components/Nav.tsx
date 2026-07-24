"use client";

import { useEffect, useState } from "react";
import { useHeroMode } from "@/lib/hooks";

const LINKS = [
  ["Research", "#research"],
  ["Vehicles", "#vehicles"],
  ["Team", "#team"],
  ["News", "#news"],
  ["Students", "#students"],
  ["Contact", "#contact"],
] as const;

/**
 * Sticky nav: transparent over the hero sequence, gains a blurred dark
 * background + hairline bottom border once the page content (#after-hero)
 * approaches the viewport.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const mode = useHeroMode();

  useEffect(() => {
    // Static (mobile / reduced-motion) hero is regular scrollable content —
    // solidify the nav as soon as the opening frame is left, so links and
    // wordmark never sit transparent over body copy.
    if (mode === "static") {
      const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.5);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    // Full mode: stay transparent for the whole pinned sequence, solidify
    // once the post-hero content (#after-hero) reaches the viewport.
    const sentinel = document.getElementById("after-hero");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setSolid(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { rootMargin: "0px 0px 0px 0px", threshold: 0 }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [mode]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-hairline bg-carbon/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <a href="#top" className="group flex items-baseline gap-3">
          <span className="text-lg font-bold tracking-tight text-ink">CAVAS</span>
          {/* UB blue — small-dose brand accent */}
          <span className="hidden font-mono text-[10px] uppercase tracking-eyebrow text-[#7EB3E8] sm:block">
            University at Buffalo
          </span>
          <span className="block h-px w-0 bg-ub transition-all duration-500 group-hover:w-6" aria-hidden="true" />
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="link-glow font-mono text-[11px] uppercase tracking-eyebrow text-dim hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* mobile toggle */}
        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`block h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-hairline bg-carbon/95 px-6 py-4 backdrop-blur-md md:hidden">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                className="block py-3 font-mono text-xs uppercase tracking-eyebrow text-dim hover:text-ink"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
