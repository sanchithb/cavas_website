import Reveal from "./Reveal";
import VehicleViewer from "./VehicleViewer";

type Vehicle = {
  kind: "mkz" | "olli";
  eyebrow: string;
  name: string;
  lede: string;
  body: string;
  specs: [string, string][];
  videoNote: string;
  flip?: boolean;
};

const VEHICLES: Vehicle[] = [
  {
    kind: "mkz",
    eyebrow: "PLATFORM / 01",
    name: "Lincoln MKZ",
    lede: "The street-legal research platform.",
    body:
      "A production Lincoln MKZ retrofitted by the lab with an onboard computer and a full sensor suite — LiDAR, GPS, camera, and CAN-bus vehicle control. It runs Tier IV's open-source Autoware self-driving stack on ROS and also supports Apollo. The team built its HD maps from the vehicle's own LiDAR: a point-cloud map via NDT mapping and matching, refined with NTRIP-corrected GPS, and a hand-built vector map of lanes, stop signs, traffic lights, and crosswalks.",
    specs: [
      ["PLATFORM", "LINCOLN MKZ"],
      ["COMPUTE", "ONBOARD COMPUTER"],
      ["STACK", "AUTOWARE (TIER IV) / ROS"],
      ["ALT STACK", "APOLLO"],
      ["SENSING", "LIDAR · GPS · CAMERA"],
      ["CONTROL", "CAN-BUS DRIVE-BY-WIRE"],
      ["MAPPING", "NDT POINT CLOUD + VECTOR MAP"],
      ["GPS", "NTRIP-CORRECTED"],
      ["SPONSORS", "WEST HERR · MONRO · NSF"],
    ],
    videoNote: "MKZ demo video",
  },
  {
    kind: "olli",
    eyebrow: "PLATFORM / 02",
    name: "Olli",
    lede: "An 8-passenger shuttle with no pedals and no wheel.",
    body:
      "Olli is a self-driving, all-electric shuttle built by Local Motors in Arizona — co-created, with a 3D-printed body, assembled outside a traditional factory. It senses 360° through LiDAR, radar, and cameras against an onboard digital map. Drive is fly-by-wire: a Driving Steward commands steering and braking through joystick input. Air-ride auto-leveling suspension, powered doors, seatbelts, and climate control carry one steward and up to eight passengers.",
    specs: [
      ["BUILDER", "LOCAL MOTORS (AZ)"],
      ["BODY", "3D-PRINTED · CO-CREATED"],
      ["DRIVE", "ALL-ELECTRIC · FLY-BY-WIRE"],
      ["CONTROL", "DRIVING STEWARD · JOYSTICK"],
      ["SENSING", "360° LIDAR · RADAR · CAMERA"],
      ["CAPACITY", "1 STEWARD + 8 PASSENGERS"],
      ["SUSPENSION", "AIR-RIDE AUTO-LEVELING"],
      ["FUNDING", "NYSERDA · NYSDOT · UB"],
    ],
    videoNote: "Olli demo video",
    flip: true,
  },
];

function SpecSheet({ specs }: { specs: [string, string][] }) {
  return (
    <dl className="border-b border-hairline">
      {specs.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-6 border-t border-hairline py-2 font-mono text-xs tracking-wider">
          <dt className="text-dim">{k}</dt>
          <dd className="text-right text-ink/90">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* VIDEO EMBED SLOT ---------------------------------------------------------
 * Replace this placeholder with a real embed from the CAVAS YouTube channel:
 * <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="..."
 *         allowFullScreen loading="lazy" className="h-full w-full" />
 * ------------------------------------------------------------------------ */
function VideoSlot({ note }: { note: string }) {
  return (
    <div className="relative mt-8 flex aspect-video items-center justify-center border border-hairline bg-white/[0.02]">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-dim">
          ▸ VIDEO — {note}
        </p>
        <p className="mt-2 font-mono text-[10px] text-dim/60">
          [ placeholder — swap in CAVAS YouTube embed ]
        </p>
      </div>
    </div>
  );
}

export default function VehicleSection() {
  return (
    <section id="vehicles" aria-labelledby="vehicles-title" className="border-t border-hairline">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">Instrumented Vehicles</p>
          <h2 id="vehicles-title" className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">
            The fleet.
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-28">
          {VEHICLES.map((v) => (
            <Reveal key={v.kind}>
              <article
                aria-label={v.name}
                className={`grid items-center gap-12 lg:grid-cols-2 ${v.flip ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <VehicleViewer kind={v.kind} />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-eyebrow text-dim">{v.eyebrow}</p>
                  <h3 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">{v.name}</h3>
                  <p className="mt-2 text-lg text-lidar/90">{v.lede}</p>
                  <p className="mt-5 text-sm leading-relaxed text-dim">{v.body}</p>
                  <div className="mt-8">
                    <SpecSheet specs={v.specs} />
                  </div>
                  <VideoSlot note={v.videoNote} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
