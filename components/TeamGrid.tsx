import Image from "next/image";
import Reveal from "./Reveal";

/* TEAM ROSTER --------------------------------------------------------------
 * Placeholder roles only — replace with the real roster from
 * ubwp.buffalo.edu/cavas/team before launch.
 *
 * ADDING PHOTOS:
 *   1. Drop the image into  public/team/  (e.g. public/team/jane-doe.jpg).
 *      Square or near-square crops look best; ~600×600px is plenty.
 *   2. Fill in `name` and `photo` on the entry:
 *        { name: "Jane Doe", role: "PhD Researcher", tag: "PERCEPTION",
 *          initials: "JD", photo: "/team/jane-doe.jpg" }
 *   Entries without `photo` automatically fall back to the initials tile,
 *   so you can add photos one member at a time.
 * ------------------------------------------------------------------------ */
type Member = {
  role: string;
  tag: string;
  initials: string;
  name?: string; // shown as the card title when present
  photo?: string; // path under /public, e.g. "/team/jane-doe.jpg"
};

const TEAM: Member[] = [
  { name: "Dr. Chunming Qiao", role: "Faculty Advisor"},
  { role: "Co-Principal Investigator", tag: "FACULTY", initials: "CO" },
  { role: "PhD Researcher", tag: "PERCEPTION", initials: "01" },
  { role: "PhD Researcher", tag: "V2X NETWORKS", initials: "02" },
  { role: "PhD Researcher", tag: "SIMULATION", initials: "03" },
  { role: "MS Researcher", tag: "HD MAPPING", initials: "04" },
  { role: "MS Researcher", tag: "CONTROLS", initials: "05" },
  { role: "Undergraduate Researcher", tag: "INSTRUMENTATION", initials: "06" },
];

export default function TeamGrid() {
  return (
    <section id="team" aria-labelledby="team-title" className="border-t border-hairline bg-panel">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">Team</p>
          <h2 id="team-title" className="mt-4 text-4xl font-medium tracking-tight md:text-5xl">
            The people behind the platforms.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-dim">
            Faculty and student researchers across perception, networking,
            simulation, and vehicle systems.
            {/* ← swap placeholder cards below for the real roster */}
          </p>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {TEAM.map((m, i) => (
            <li key={i}>
              <Reveal delay={(i % 4) * 70}>
                <div className="group relative border border-hairline bg-carbon p-6 transition-colors duration-500 hover:border-lidar/40">
                  {/* glow edge on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true"
                    style={{ boxShadow: "inset 0 0 24px rgba(94,234,212,0.06)" }} />
                  <div className="relative aspect-square overflow-hidden border border-hairline bg-white/[0.02]">
                    {m.photo ? (
                      // Duotone-ish treatment keeps photos inside the site's
                      // visual system: grayscale at rest, full color on hover.
                      <Image
                        src={m.photo}
                        alt={`Portrait of ${m.name ?? m.role}`}
                        fill
                        sizes="(min-width: 768px) 25vw, 50vw"
                        className="object-cover grayscale opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-mono text-2xl text-dim/50">
                        {m.initials}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-ink">{m.name ?? m.role}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-eyebrow text-dim group-hover:text-lidar/80">
                    {m.name ? `${m.role} · ${m.tag}` : m.tag}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
