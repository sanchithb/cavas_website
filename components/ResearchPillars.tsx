import Reveal from "./Reveal";
import Stat from "./Stat";

/** Looping line-art icons — CSS dash-march animation, static under reduced motion. */
function SimIcon() {
  return (
    <svg viewBox="0 0 64 64" className="icon-anim h-12 w-12" fill="none" stroke="#5EEAD4" strokeWidth="1.2" aria-hidden="true">
      <rect x="8" y="12" width="48" height="30" rx="2" />
      <polyline points="14,34 24,24 34,30 44,18 50,22" />
      <line x1="24" y1="50" x2="40" y2="50" />
      <line x1="32" y1="42" x2="32" y2="50" />
    </svg>
  );
}
function VehicleIcon() {
  return (
    <svg viewBox="0 0 64 64" className="icon-anim h-12 w-12" fill="none" stroke="#5EEAD4" strokeWidth="1.2" aria-hidden="true">
      <path d="M10 40 L14 30 Q16 26 22 26 L40 26 Q46 26 50 32 L54 40 L54 44 L10 44 Z" />
      <circle cx="20" cy="44" r="5" />
      <circle cx="44" cy="44" r="5" />
      <rect x="28" y="16" width="8" height="6" rx="1" />
      <path d="M22 12 Q32 6 42 12" />
    </svg>
  );
}
function RsuIcon() {
  return (
    <svg viewBox="0 0 64 64" className="icon-anim h-12 w-12" fill="none" stroke="#5EEAD4" strokeWidth="1.2" aria-hidden="true">
      <line x1="32" y1="56" x2="32" y2="20" />
      <rect x="27" y="12" width="10" height="8" rx="1" />
      <path d="M20 14 Q14 22 20 30" />
      <path d="M44 14 Q50 22 44 30" />
      <path d="M14 8 Q4 20 14 34" />
      <path d="M50 8 Q60 20 50 34" />
    </svg>
  );
}

const PILLARS = [
  {
    icon: <SimIcon />,
    code: "01 / SIMULATION — DIGITAL TWIN",
    title: "Simulation, three layers deep",
    body: "Multiple driving simulators put humans and hardware in the loop against a CARLA-based digital twin of the lab's own vehicles and streets. A microscopic agent-based traffic simulator models the street; a network simulator reproduces realistic wireless V2X communication between all of it — so severe weather and edge-case traffic can be rehearsed in software before the physical fleet rolls.",
  },
  {
    icon: <VehicleIcon />,
    code: "02 / INSTRUMENTED VEHICLES",
    title: "Two vehicles, fully wired",
    body: "The Olli shuttle and the Lincoln MKZ research platform carry LiDAR, GPS, cameras, and CAN-bus control — real vehicles generating real data, ready for algorithms the simulators have already vetted.",
  },
  {
    icon: <RsuIcon />,
    code: "03 / INSTRUMENTED ENVIRONMENT",
    title: "A street that senses back",
    body: "Roadside sensors and roadside units (RSUs) instrument the environment itself, closing the V2X loop between infrastructure and vehicle — the connected half of connected-and-autonomous.",
  },
];

export default function ResearchPillars() {
  return (
    <section id="research" aria-labelledby="research-title" className="relative border-t border-hairline bg-panel">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">iCAVE2 — The Instrument</p>
          <h2 id="research-title" className="mt-4 max-w-3xl text-4xl font-medium tracking-tight md:text-5xl">
            Between the simulator and the street.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-dim">
            iCAVE2 is a 5-in-1 instrument for evaluating connected and autonomous
            vehicles — safer and cheaper than road testing, more realistic than a
            simulator. It exists to answer what-if questions about safety and
            efficiency, including rare events like severe weather, before anything
            reaches a public road.
          </p>
        </Reveal>

        {/* oversized numerals */}
        <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4">
          <Reveal><Stat value={5} suffix="-in-1" label="Integrated instrument" /></Reveal>
          <Reveal delay={80}><Stat value={2} label="Instrumented vehicles" /></Reveal>
          <Reveal delay={160}><Stat value={8} label="Passengers aboard Olli" /></Reveal>
          <Reveal delay={240}><Stat value={360} suffix="°" label="Sensor coverage" /></Reveal>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden border border-hairline bg-white/[0.06] md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.code} delay={i * 100} className="bg-panel">
              <div className="h-full p-8 transition-colors duration-500 hover:bg-white/[0.02]">
                {p.icon}
                <p className="mt-6 font-mono text-[11px] uppercase tracking-eyebrow text-dim">{p.code}</p>
                <h3 className="mt-3 text-xl font-medium tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dim">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
