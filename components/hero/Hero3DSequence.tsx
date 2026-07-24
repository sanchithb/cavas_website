"use client";

import { useLayoutEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "./HeroScene";
import { useInViewport } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Beat boundaries on the 0–1 scroll progress of the pinned sequence.
 *  Beats 1–6 are compressed into the first 80%; the final 20% is the
 *  digital-twin beat (world collapses into the sim rig's monitor). */
const BEAT_STARTS = [0, 0.08, 0.224, 0.364, 0.492, 0.652, 0.8];
const BEAT_COUNT = 7;

function DataRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-hairline py-1.5 font-mono text-[11px] tracking-wider">
      <span className="text-dim">{k}</span>
      <span className="text-right text-ink/90">{v}</span>
    </div>
  );
}

function Panel({
  className,
  eyebrow,
  title,
  children,
  rows,
}: {
  className: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  rows: [string, string][];
}) {
  return (
    <div
      className={`hud-panel pointer-events-none absolute z-10 w-[26rem] max-w-[42vw] bg-carbon/55 backdrop-blur-[2px] opacity-0 ${className}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-medium tracking-tight text-ink">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-dim">{children}</p>
      <div className="mt-5 border-b border-hairline">
        {rows.map(([k, v]) => (
          <DataRow key={k} k={k} v={v} />
        ))}
      </div>
    </div>
  );
}

/**
 * The centerpiece: one continuous pinned scroll sequence.
 * A single ScrollTrigger pins this section for ~5.5 viewport heights and
 * feeds its progress to the R3F scene (via ref — no React re-renders) and
 * to a GSAP timeline that fades the HTML copy panels in and out.
 */
export default function Hero3DSequence() {
  const wrapRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const seqRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [ioRef, inView] = useInViewport<HTMLDivElement>("200px");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=650%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            progress.current = self.progress;
            // HUD readouts, updated outside React.
            let beat = 0;
            for (let i = 0; i < BEAT_STARTS.length; i++) {
              if (self.progress >= BEAT_STARTS[i]) beat = i;
            }
            if (seqRef.current) seqRef.current.textContent = `SEQ 0${beat + 1} / 0${BEAT_COUNT}`;
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      const show = (sel: string, at: number) =>
        tl.fromTo(sel, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.04 }, at);
      const hide = (sel: string, at: number) =>
        tl.to(sel, { opacity: 0, y: -18, duration: 0.03 }, at);

      tl.to(".beat-cold", { opacity: 0, duration: 0.04 }, 0.024);
      tl.to(".scroll-hint", { opacity: 0, duration: 0.024 }, 0.008);

      show(".beat-word", 0.108);
      hide(".beat-word", 0.192);

      show(".beat-lidar", 0.252);
      hide(".beat-lidar", 0.348);

      show(".beat-mkz", 0.392);
      hide(".beat-mkz", 0.492);

      show(".beat-olli", 0.536);
      hide(".beat-olli", 0.636);

      show(".beat-icave", 0.688);
      hide(".beat-icave", 0.79);

      // Digital-twin beat: telemetry labels tick on as each rig element
      // finishes drawing, then the copy panel arrives.
      tl.fromTo(".rig-label-display", { opacity: 0 }, { opacity: 1, duration: 0.015 }, 0.885);
      tl.fromTo(".rig-label-steering", { opacity: 0 }, { opacity: 1, duration: 0.015 }, 0.905);
      tl.fromTo(".rig-label-pedals", { opacity: 0 }, { opacity: 1, duration: 0.015 }, 0.925);
      tl.fromTo(".sync-label", { opacity: 0 }, { opacity: 1, duration: 0.015 }, 0.935);
      show(".beat-twin", 0.945);
      tl.to({}, { duration: 0.01 }, 0.99); // pad timeline to exactly 1.0
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      id="top"
      aria-label="CAVAS — sensor-driven introduction"
      className="relative h-screen overflow-hidden bg-carbon"
    >
      {/* WebGL canvas — mounts immediately; render loop pauses off-screen */}
      <div ref={ioRef} className="reticle-cursor absolute inset-0">
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={[1, 1.75]}
          camera={{ fov: 48, near: 0.1, far: 80, position: [0, 0.5, 10.6] }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <HeroScene progressRef={progress} />
        </Canvas>
      </div>

      {/* texture overlays */}
      <div className="scanlines absolute inset-0" aria-hidden="true" />
      <div className="vignette absolute inset-0" aria-hidden="true" />

      {/* persistent HUD chrome */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-20 z-10 flex justify-between px-6 font-mono text-[10px] uppercase tracking-eyebrow text-dim/80 md:px-10"
      >
        {/* UB North Campus coordinates */}
        <span>LAT 43.0008° N · LON 78.7890° W</span>
        <span className="hidden md:block">OUSTER OS2-128 · AUTOWARE / ROS</span>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 right-6 z-10 font-mono text-[10px] tracking-eyebrow text-dim/80 md:right-10"
      >
        <span ref={seqRef}>SEQ 01 / 0{BEAT_COUNT}</span>
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 z-10 h-px w-full origin-left bg-lidar/60"
        ref={barRef}
        style={{ transform: "scaleX(0)" }}
      />

      {/* BEAT 1 — cold open */}
      <div
        aria-hidden="true"
        className="beat-cold pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        <p className="blink-cursor font-mono text-xs uppercase tracking-eyebrow text-lidar/90">
          INITIALIZING SENSOR ARRAY&nbsp;
        </p>
      </div>
      <div className="scroll-hint pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-dim">
          Scroll to begin scan
        </span>
        <span className="block h-8 w-px animate-pulse bg-gradient-to-b from-lidar/80 to-transparent" />
      </div>

      {/* BEAT 2 — wordmark caption (the CAVAS letters are the particles) */}
      <div className="beat-word pointer-events-none absolute inset-x-0 bottom-[22vh] z-10 flex flex-col items-center gap-2 text-center opacity-0">
        <h1 className="max-w-xl px-6 text-sm font-normal leading-relaxed tracking-wide text-ink/90">
          Connected and Autonomous Vehicle Applications and Systems
        </h1>
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-[#7EB3E8]">
          University at Buffalo
        </p>
      </div>

      {/* BEAT 3 — LiDAR / perception & HD mapping */}
      <div className="absolute inset-0 z-10 hidden items-center justify-end px-10 md:flex lg:px-20 pointer-events-none">
        <Panel
          className="beat-lidar relative"
          eyebrow="02 / Perception — HD Mapping"
          title="The world, measured in returns."
          rows={[
            ["SENSOR", "ROOF-MOUNTED LIDAR"],
            ["METHOD", "HD MAPPING & SLAM"],
            ["CORRECTION", "GNSS"],
            ["VECTOR MAP", "LANES · SIGNS · SIGNALS"],
          ]}
        >
          CAVAS builds HD maps directly from LiDAR. Point-cloud maps are generated with
          Normal Distributions Transform (NDT) mapping and matching, refined with
          NTRIP-corrected GPS for higher positional accuracy. A hand-built vector map
          layers in lanes, stop signs, traffic lights, and crosswalks with
          Autoware&rsquo;s vector map tools.
        </Panel>
      </div>

      {/* BEAT 4 — Lincoln MKZ */}
      <div className="absolute inset-0 z-10 hidden items-center justify-start px-10 md:flex lg:px-20 pointer-events-none">
        <Panel
          className="beat-mkz relative"
          eyebrow="03 / Instrumented Vehicle"
          title="Lincoln MKZ."
          rows={[
            ["STACK", "AUTOWARE / ROS · APOLLO"],
            ["CONTROL", "CAN-BUS DRIVE-BY-WIRE"],
            ["SENSING", "LIDAR · GPS · CAMERA"],
            ["SPONSORS", "WEST HERR · MONRO · NSF"],
          ]}
        >
          The lab&rsquo;s street-legal research platform: a Lincoln MKZ retrofitted
          with an onboard computer and a full sensor suite. It runs Tier IV&rsquo;s
          open-source Autoware self-driving stack on ROS.
        </Panel>
      </div>

      {/* BEAT 5 — Olli */}
      <div className="absolute inset-0 z-10 hidden items-center justify-end px-10 md:flex lg:px-20 pointer-events-none">
        <Panel
          className="beat-olli relative"
          eyebrow="04 / Shared Autonomy"
          title="Olli."
          rows={[
            ["CAPACITY", "1 STEWARD + 8 PASSENGERS"],
            ["DRIVE", "ELECTRIC · FLY-BY-WIRE"],
            ["SENSING", "360° LIDAR · RADAR · CAMERA"],
            ["FUNDING", "NYSERDA · NYSDOT · UB"],
          ]}
        >
          A self-driving, all-electric shuttle built by Local Motors — co-created,
          3D-printed body, assembled outside a traditional factory. A Driving Steward
          commands steering and braking by joystick. No pedals. No wheel.
        </Panel>
      </div>

      {/* BEAT 6 — iCAVE2 / connected intersection */}
      <div className="absolute inset-0 z-10 hidden items-end justify-start px-10 pb-24 md:flex lg:px-20 pointer-events-none">
        <Panel
          className="beat-icave relative"
          eyebrow="05 / CV2X"
          title="Connected Vehicles to Any"
          rows={[
            ["V2X", "RSU ↔ MKZ ↔ OLLI"],
            ["SCOPE", "RARE EVENTS · SEVERE WEATHER"],
            ["SPAN", "SIMULATION ↔ STREET"],
          ]}
        >
          The future of autonomous vehicles is vehicles and RSUs filling in each other's gaps and fill in the blind spots.
        </Panel>
      </div>

      {/* BEAT 7 — digital twin: the world collapses into a sim-rig monitor */}
      <div className="absolute inset-0 z-10 hidden items-center justify-start px-10 md:flex lg:px-20 pointer-events-none">
        <Panel
          className="beat-twin relative"
          eyebrow="06 / Digital Twin — Simulation"
          title="Every vehicle, mirrored in software."
          rows={[
            ["ENGINE", "CARLA + SIM TOOLING"],
            ["LOOP", "HUMAN / HARDWARE-IN-THE-LOOP"],
            ["SCENARIOS", "SEVERE WEATHER · EDGE CASES"],
            ["SYNC", "PHYSICAL ↔ VIRTUAL"],
          ]}
        >
          The MKZ, Olli, and the instrumented street exist twice. In CARLA and the
          lab&rsquo;s simulation tooling, the same vehicles, sensors, and intersections
          run as a digital twin, where drivers and hardware sit in the loop, rare and
          unsafe scenarios play out on demand, and autonomy algorithms are validated
          before they ever touch the physical fleet.
        </Panel>
      </div>

      {/* Rig telemetry labels — positioned against the fixed final camera pose */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden font-mono text-[10px] uppercase tracking-eyebrow md:block">
        <span className="rig-label-display absolute text-dim opacity-0" style={{ left: "84%", top: "30%" }}>
          OUTPUT: DISPLAY
        </span>
        <span className="rig-label-steering absolute text-dim opacity-0" style={{ left: "77%", top: "60%" }}>
          INPUT: STEERING
        </span>
        <span className="rig-label-pedals absolute text-dim opacity-0" style={{ left: "76%", top: "76%" }}>
          INPUT: BRAKE / THROTTLE
        </span>
        {/* pulse lives on the inner span — the outer element keeps the
            GSAP-scrubbed opacity (CSS animations would override it) */}
        <span className="sync-label absolute text-lidar/90 opacity-0" style={{ left: "78%", top: "16%" }}>
          <span className="animate-pulse">SYNC: PHYSICAL ↔ VIRTUAL</span>
        </span>
      </div>
    </section>
  );
}
