"use client";

import { useEffect, useRef, useState } from "react";

export type HeroMode = "full" | "static" | undefined;

/**
 * Decides between the full pinned WebGL scroll sequence and the static
 * fallback. Static when: prefers-reduced-motion, small viewport, or a
 * coarse-only pointer (the scrubbed 3D sequence is a deliberate
 * desktop experience; mobile gets lighter scroll-fade sections).
 * Returns undefined until mounted so SSR markup stays neutral.
 */
export function useHeroMode(): HeroMode {
  const [mode, setMode] = useState<HeroMode>(undefined);
  useEffect(() => {
    const decide = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.matchMedia("(max-width: 1023px)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches;
      setMode(reduced || small || coarse ? "static" : "full");
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, []);
  return mode;
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** True while the element is (near) the viewport. Used to pause render loops. */
export function useInViewport<T extends Element>(
  rootMargin = "0px"
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
}
