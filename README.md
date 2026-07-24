# CAVAS — Lab Website

Cinematic single-page site for **CAVAS** (Connected and Autonomous Vehicle
Applications and Systems), University at Buffalo.

Built with **Next.js 14 (App Router) + TypeScript**, **React Three Fiber**
for the WebGL point-cloud/wireframe scenes, **GSAP ScrollTrigger** for the
pinned scroll-scrubbed hero sequence, and **Tailwind CSS** with a small
custom token set (`tailwind.config.ts`).

## Run

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
```

## Architecture

| Path | Purpose |
| --- | --- |
| `components/hero/Hero.tsx` | Mode switch: full WebGL sequence vs. static fallback |
| `components/hero/Hero3DSequence.tsx` | Pinned 7-beat scroll sequence (GSAP + canvas + HTML copy panels) |
| `components/hero/HeroScene.tsx` | R3F scene: particle morph → LiDAR → MKZ → Olli → RSU intersection → digital-twin collapse into a sim-rig monitor |
| `components/hero/HeroStatic.tsx` | Mobile / `prefers-reduced-motion` experience (scroll-fades, SVG line art) |
| `lib/hero-geometry.ts` | All procedural wireframe geometry + point-cloud samplers (single visual system) |
| `components/ResearchPillars.tsx` | iCAVE2 5-in-1 breakdown + stats |
| `components/VehicleSection.tsx` | MKZ + Olli detail sections with telemetry spec sheets |
| `components/VehicleViewer.tsx` | Small auto-rotating wireframe showpieces (lazy, pause off-screen) |
| `components/TeamGrid.tsx` / `NewsRail.tsx` / `PartnersStrip.tsx` / `StudentCTA.tsx` / `ContactFooter.tsx` | Post-hero sections |

## Content the CAVAS team must swap in (search for "placeholder")

- **Team roster** — `components/TeamGrid.tsx` (generic roles only; add real names/photos)
- **News dates & links** — `components/NewsRail.tsx` (`DATE TBD` entries)
- **YouTube embeds** — `components/VehicleSection.tsx` (`VideoSlot`), footer YouTube link
- **Contact email / office address** — `components/ContactFooter.tsx`

## Performance / accessibility notes

- Hero point budget: ~5.2k points in a single `Points` buffer; render loops
  pause via IntersectionObserver when canvases leave the viewport.
- `prefers-reduced-motion` and small/coarse-pointer devices get the static
  hero — no pinning, no WebGL scrubbing.
- Fonts: Space Grotesk (display) + JetBrains Mono (telemetry) via
  `next/font`; swap in a licensed grotesk via `next/font/local` if desired.
