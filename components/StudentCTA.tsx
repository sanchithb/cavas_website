import Reveal from "./Reveal";

export default function StudentCTA() {
  return (
    <section id="students" aria-labelledby="students-title" className="relative border-t border-hairline">
      <div className="grid-texture absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center md:py-40">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">Students</p>
          <h2 id="students-title" className="mt-5 text-4xl font-medium tracking-tight md:text-6xl">
            Work on vehicles that
            <br />
            drive themselves.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-dim">
            CAVAS takes on PhD, MS, and undergraduate researchers across perception,
            V2X networking, simulation, and vehicle systems. Bring a problem you want
            to measure.
          </p>
          {/* UB blue reserved for this one primary CTA */}
          <a
            href="#contact"
            className="btn-scan mt-10 inline-block border border-ub bg-ub/20 px-10 py-4 font-mono text-xs uppercase tracking-eyebrow text-ink transition-colors duration-500 hover:bg-ub/35"
          >
            Get involved
          </a>
        </Reveal>
      </div>
    </section>
  );
}
