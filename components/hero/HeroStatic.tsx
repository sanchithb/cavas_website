"use client";

import Reveal from "@/components/Reveal";
import { LidarSVG, MkzSVG, OlliSVG, SimRigSVG } from "@/components/WireframeSVG";

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-5 border-b border-hairline">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="flex items-baseline justify-between gap-4 border-t border-hairline py-1.5 font-mono text-[11px] tracking-wider"
        >
          <span className="text-dim">{k}</span>
          <span className="text-right text-ink/90">{v}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * The deliberate mobile / prefers-reduced-motion hero: no pinning, no WebGL
 * scrubbing — the same narrative told as elegant scroll-fade sections with
 * SVG line art. Not a squished desktop.
 */
export default function HeroStatic() {
  return (
    <section id="top" aria-label="CAVAS introduction" className="relative bg-carbon">
      <div className="scanlines pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Opening frame */}
      <div className="relative flex min-h-[92svh] flex-col items-center justify-center px-6 text-center">
        <p className="blink-cursor font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">
          INITIALIZING SENSOR ARRAY&nbsp;
        </p>
        <h1 className="mt-8 text-6xl font-bold tracking-tight text-ink sm:text-7xl">
          CAVAS
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/85">
          Connected and Autonomous Vehicle Applications and Systems
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-eyebrow text-[#7EB3E8]">
          University at Buffalo
        </p>
        <span className="mt-12 block h-10 w-px bg-gradient-to-b from-lidar/70 to-transparent" aria-hidden="true" />
      </div>

      {/* Narrative beats as stacked cards */}
      <div className="relative mx-auto flex max-w-xl flex-col gap-20 px-6 pb-28">
        <Reveal>
          <LidarSVG className="mx-auto h-24" />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">
            02 / Perception — HD Mapping
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">
            The world, measured in returns.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-dim">
            CAVAS builds HD maps directly from LiDAR: point-cloud maps via NDT mapping
            and matching, refined with NTRIP-corrected GPS, plus a hand-built vector
            map of lanes, stop signs, traffic lights, and crosswalks.
          </p>
          <Rows
            rows={[
              ["METHOD", "NDT MAPPING / MATCHING"],
              ["CORRECTION", "NTRIP GPS"],
            ]}
          />
        </Reveal>

        <Reveal>
          <MkzSVG className="mx-auto h-32 w-full max-w-sm" />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">
            03 / Instrumented Vehicle
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">Lincoln MKZ.</h2>
          <p className="mt-3 text-sm leading-relaxed text-dim">
            The lab&rsquo;s street-legal research platform, retrofitted with an onboard
            computer, LiDAR, GPS, camera, and CAN-bus control — running Tier IV&rsquo;s
            Autoware on ROS, with Apollo support.
          </p>
          <Rows
            rows={[
              ["STACK", "AUTOWARE / ROS · APOLLO"],
              ["SPONSORS", "WEST HERR · MONRO · NSF"],
            ]}
          />
        </Reveal>

        <Reveal>
          <OlliSVG className="mx-auto h-36 w-full max-w-sm" />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">
            04 / Shared Autonomy
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">Olli.</h2>
          <p className="mt-3 text-sm leading-relaxed text-dim">
            A self-driving, all-electric shuttle by Local Motors — 3D-printed body,
            360° sensing, fly-by-wire joystick control by a Driving Steward. No
            pedals. No wheel.
          </p>
          <Rows
            rows={[
              ["CAPACITY", "1 STEWARD + 8 PASSENGERS"],
              ["FUNDING", "NYSERDA · NYSDOT · UB"],
            ]}
          />
        </Reveal>

        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">
            05 / iCAVE2
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">
            Five instruments. One testbed.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-dim">
            Driving simulators, an agent-based traffic simulator, a wireless network
            simulator, instrumented vehicles, and an instrumented environment of
            roadside sensors and RSUs — safer and cheaper than road testing, more
            realistic than simulation alone.
          </p>
          <Rows
            rows={[
              ["V2X", "RSU ↔ MKZ ↔ OLLI"],
              ["SPAN", "SIMULATION ↔ STREET"],
            ]}
          />
        </Reveal>

        <Reveal>
          <SimRigSVG className="mx-auto h-40 w-full max-w-sm" />
          <p className="mt-6 font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">
            06 / Digital Twin — Simulation
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">
            Every vehicle, mirrored in software.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-dim">
            The MKZ, Olli, and the instrumented street exist twice. In CARLA and the
            lab&rsquo;s simulation tooling they run as a digital twin — drivers and
            hardware in the loop, rare and unsafe scenarios on demand, algorithms
            validated before they touch the physical fleet.
          </p>
          <Rows
            rows={[
              ["ENGINE", "CARLA + SIM TOOLING"],
              ["SYNC", "PHYSICAL ↔ VIRTUAL"],
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}
