import Reveal from "./Reveal";

/* NEWS / VIDEO ITEMS -------------------------------------------------------
 * PLACEHOLDER content derived from the lab's public program — replace the
 * dates and add real links/thumbnails from ubwp.buffalo.edu/cavas (News,
 * YouTube Videos pages) before launch.
 * ------------------------------------------------------------------------ */
const ITEMS = [
  {
    date: "DATE TBD",
    kind: "NEWS",
    title: "Olli begins on-campus operation at UB",
    blurb: "The Local Motors shuttle enters service as a rolling testbed for shared autonomy research.",
  },
  {
    date: "DATE TBD",
    kind: "MILESTONE",
    title: "HD map built from MKZ LiDAR via NDT mapping",
    blurb: "Point-cloud map generation refined with NTRIP-corrected GPS; vector map authored in Autoware tools.",
  },
  {
    date: "DATE TBD",
    kind: "VIDEO",
    title: "Autoware stack demo on the Lincoln MKZ",
    blurb: "Perception, planning, and CAN-bus actuation running end-to-end. Watch on the CAVAS YouTube channel.",
  },
  {
    date: "DATE TBD",
    kind: "NEWS",
    title: "iCAVE2 instrument development",
    blurb: "Integrating driving, traffic, and network simulators with the instrumented fleet and roadside units.",
  },
  {
    date: "DATE TBD",
    kind: "OPENINGS",
    title: "Student research positions",
    blurb: "Openings for PhD, MS, and undergraduate researchers across the lab's project areas.",
  },
];

export default function NewsRail() {
  return (
    <section id="news" aria-labelledby="news-title" className="border-t border-hairline">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">News &amp; Videos</p>
              <h2 id="news-title" className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">
                Field notes.
              </h2>
            </div>
            <p className="hidden font-mono text-[10px] uppercase tracking-eyebrow text-dim md:block" aria-hidden="true">
              Drag / scroll →
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <ul className="rail -mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10">
            {ITEMS.map((item, i) => (
              <li
                key={i}
                className="group w-72 flex-none snap-start border border-hairline bg-panel p-6 transition-colors duration-500 hover:border-lidar/40 md:w-80"
              >
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-eyebrow">
                  <span className="text-dim">{item.date}</span>
                  <span className="text-lidar/80">{item.kind}</span>
                </div>
                <h3 className="mt-5 text-lg font-medium leading-snug tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dim">{item.blurb}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
