import Reveal from "./Reveal";

const NAV = [
  ["Research", "#research"],
  ["Vehicles", "#vehicles"],
  ["Team", "#team"],
  ["News", "#news"],
  ["Students", "#students"],
] as const;

export default function ContactFooter() {
  return (
    <footer id="contact" aria-label="Contact and site footer" className="border-t border-hairline bg-panel">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-24 md:px-10 md:pt-32">
        <div className="grid gap-14 md:grid-cols-3">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-lidar/90">Contact</p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">CAVAS</h2>
            <p className="mt-1 text-sm text-dim">
              Connected and Autonomous Vehicle
              <br />
              Applications and Systems
            </p>
            {/* CONTACT DETAILS — placeholders. Replace with the lab's current
                office/mailing address and contact email before launch. */}
            <address className="mt-6 font-mono text-xs not-italic leading-loose text-dim">
              School of Engineering and Applied Sciences
              <br />
              University at Buffalo, North Campus
              <br />
              Buffalo, NY 14260
              <br />
              <span className="text-dim/60">[ contact email — add before launch ]</span>
            </address>
          </Reveal>

          <Reveal delay={100}>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-dim">Index</p>
            <ul className="mt-4 space-y-3">
              {NAV.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="link-glow text-sm text-dim hover:text-ink">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-dim">Elsewhere</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://ubwp.buffalo.edu/cavas/"
                  className="link-glow text-sm text-dim hover:text-ink"
                  rel="noopener noreferrer"
                >
                  Lab site — ubwp.buffalo.edu/cavas
                </a>
              </li>
              <li>
                {/* Replace # with the real CAVAS YouTube channel URL */}
                <a href="#" className="link-glow text-sm text-dim hover:text-ink">
                  YouTube — project demos
                </a>
              </li>
              <li>
                <a
                  href="https://www.buffalo.edu/"
                  className="link-glow text-sm text-dim hover:text-ink"
                  rel="noopener noreferrer"
                >
                  University at Buffalo
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-hairline pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-dim/60">
            © {new Date().getFullYear()} CAVAS · University at Buffalo
          </p>
          {/* UB blue — final quiet brand note */}
          <p className="font-mono text-[10px] uppercase tracking-eyebrow text-[#7EB3E8]">
            LAT 43.0008° N · LON 78.7890° W
          </p>
        </div>
      </div>
    </footer>
  );
}
