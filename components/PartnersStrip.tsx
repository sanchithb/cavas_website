/** Quiet partner strip: wordmarks as text, muted monospace — no fake logos.
 *  Marquee pauses on hover and disables entirely under prefers-reduced-motion
 *  (falls back to a static scrollable row via CSS). */
const PARTNERS = [
  "NSF",
  "CISCO",
  "CMU",
  "SwRI",
  "WEST HERR",
  "MONRO",
  "NYSDOT",
  "NYSERDA",
  "LOCAL MOTORS",
];

export default function PartnersStrip() {
  const row = (ariaHidden: boolean) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex flex-none items-center gap-14 pr-14"
    >
      {PARTNERS.map((p) => (
        <li
          key={p}
          className="whitespace-nowrap font-mono text-xs uppercase tracking-eyebrow text-dim/60 transition-colors duration-500 hover:text-dim"
        >
          {p}
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Partners and sponsors" className="border-t border-hairline bg-panel py-10">
      <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-eyebrow text-dim/50">
        Partners &amp; Sponsors
      </p>
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
