import Image from "next/image";
import Reveal from "./Reveal";

/* TEAM ROSTER --------------------------------------------------------------
 * Placeholder roles only — replace with the real roster from
 * ubwp.buffalo.edu/cavas/team before launch.
 *
 * The roster is split into three groups — Faculty, PhD, Students — each
 * rendered as a horizontally-scrollable row of cards. Add as many members
 * to a group as you like; the row scrolls sideways when they overflow.
 *
 * ADDING PHOTOS:
 *   1. Drop the image into  public/team/  (e.g. public/team/jane-doe.jpg).
 *      Square or near-square crops look best; ~600×600px is plenty.
 *   2. Fill in `name`, `secondary`, `initials`, and `photo` on the entry:
 *        { name: "Jane Doe", secondary: "PhD Researcher",
 *          initials: "JD", photo: "/team/jane-doe.jpg" }
 *   Entries without `photo` automatically fall back to the initials tile,
 *   so you can add photos one member at a time.
 * ------------------------------------------------------------------------ */
type Member = {
  name: string; // card title
  secondary: string; // secondary line under the name
  initials: string; // shown when there is no photo
  photo?: string; // path under /public, e.g. "/team/jane-doe.jpg"
};

type Group = {
  title: string;
  members: Member[];
};

const GROUPS: Group[] = [
  {
    title: "Faculty",
    members: [
      { name: "Dr. Chunming Qiao", secondary: "Co-PI", initials: "CQ", photo: "https://ubwp.buffalo.edu/cavas/wp-content/uploads/sites/105/2018/11/qiao1.jpg" },
      { name: "Adel Sadek", secondary: "Co-PI", initials: "AS", photo: "https://ubwp.buffalo.edu/cavas/wp-content/uploads/sites/105/2018/11/adel.jpg" },
      { name: "Chaozhe He", secondary: "Co-PI", initials: "CH", photo: "https://engineering.buffalo.edu/content/shared/engineering/mechanical-aerospace/profiles/he-chaozhe/jcr:content/profileinfo.img.280.280.z.q65.jpg/1783959443234.jpg" },
    ],
  },
  {
    title: "PhD",
    members: [
      { name: "Steven Korzelius", secondary: "Researcher", initials: "SK", photo: "https://ubwp.buffalo.edu/cavas/wp-content/uploads/sites/105/2019/08/smk.jpg" },
      { name: "Oakley Thomas", secondary: "Researcher", initials: "OT" },
      { name: "Shri Harsha Adapala Thirumala", secondary: "Researcher", initials: "HT" },
    ],
  },
  {
    title: "Students",
    members: [
      { name: "Anurag Hruday", secondary: "Digital Twin", initials: "AH", photo: "https://media.licdn.com/dms/image/v2/D4E03AQEiliMl_dXsYA/profile-displayphoto-shrink_800_800/B4EZcSEFTHHYAc-/0/1748354750054?e=1786579200&v=beta&t=YOjgqEzqEQSHwkkCJqL0NHtf-TyVPgatRRfYZQxqoCk" },
      { name: "Bharadwaj Gutha", secondary: "Autoware", initials: "BG", photo: "https://media.licdn.com/dms/image/v2/D5603AQEOICx2Mp-3pg/profile-displayphoto-crop_800_800/B56ZnRSjXEHAAI-/0/1760152927762?e=1786579200&v=beta&t=fa8sEG4Gvy5p4q5oNO90FGIpiwscBSJ5SWqu2c1nAws" },
      { name: "Rama Sai Rahul Gedela", secondary: "Digital Twin", initials: "RR", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxYGeU3YIkm-8zH92gIvrh4Zf4Av3bBvAN9mV4bBCjag&s=10" },
      { name: "M V N S H Praneeth", secondary: "Olli", initials: "P", photo: "https://media.licdn.com/dms/image/v2/D4E03AQHZvO_CsFj-qA/profile-displayphoto-crop_800_800/B4EZvKRgG1JcAI-/0/1768625145582?e=1786579200&v=beta&t=IMTGwHYbN2n5SXcYMO3Cpxc2TkDHouO4i0WTviqQTU4" },
      { name: "Bhargav Hegde", secondary: "CV2x", initials: "BH", photo: "https://media.licdn.com/dms/image/v2/C5603AQG6RJdB2vDphg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1610105616335?e=1786579200&v=beta&t=MVfx7iNxw_YYjmBsRLyYFPvbv7ScM1ytK9cUAO1UGcw" },
      { name: "Haosong Xiao", secondary: "CV2x", initials: "HX" },
      { name: "Harshit Agrawal", secondary: "", initials: "HA", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOaPV8yreFXRI6CxFwl90cHXGadwBrfHHVEUIi-dFtWg&s=10" },
      { name: "Sanchith Boddavaram Anand", secondary: "Autoware", initials: "SBA", photo: "https://media.licdn.com/dms/image/v2/D5603AQE_kMtjRwT8KQ/profile-displayphoto-crop_800_800/B56ZmWk9OtG4AM-/0/1759167900295?e=1786579200&v=beta&t=iHd-R5YtiLh7FQlfq-2S9fhRdoh1umNqerRB92eLAGY" },
      { name: "Mohammed Maqsood Ahmed", secondary: "Digital Twin", initials: "MMA", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj7-dhyU_woXpUKLAEsRmucAKs7QMR7Z4LCTYw51GTlg&s=10" },
      { name: "Rupesh Chowdary", secondary: "CV2X", initials: "RSP", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ7PlOV69rRetSnB8xMCTVh7kGmiJuKcOZkSF1Ftui5g&s=10" },
      { name: "Raunak Pandey", secondary: "CV2X", initials: "RP", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJWl7bzVYPf8M3bIYPaxPH5WNB__1Otd99FGD_CitPdA&s=10" }
    ],
  },
  {
    title: "Past members",
    members: [
      { name: "Harsha Meka", secondary: "Adastec", initials: "", photo: "https://media.licdn.com/dms/image/v2/D4E03AQGCZr7wl6i89A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709264388827?e=1786579200&v=beta&t=KvhUR2SHYfMyPMOgMR3sVIzJu6eW2YWJ-YU8O0AcSYg" },
    ],
  }
];

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="group relative w-52 shrink-0 border border-hairline bg-carbon p-6 transition-colors duration-500 hover:border-lidar/40">
      {/* glow edge on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
        style={{ boxShadow: "inset 0 0 24px rgba(94,234,212,0.06)" }}
      />
      <div className="relative aspect-square overflow-hidden border border-hairline bg-white/[0.02]">
        {m.photo ? (
          // Duotone-ish treatment keeps photos inside the site's
          // visual system: grayscale at rest, full color on hover.
          <Image
            src={m.photo}
            alt={`Portrait of ${m.name}`}
            fill
            sizes="208px"
            className="object-cover grayscale opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-2xl text-dim/50">
            {m.initials}
          </div>
        )}
      </div>
      <h3 className="mt-4 text-sm font-medium text-ink">{m.name}</h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-eyebrow text-dim group-hover:text-lidar/80">
        {m.secondary}
      </p>
    </div>
  );
}

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

        <div className="mt-14 space-y-12">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <Reveal>
                <h3 className="font-mono text-[11px] uppercase tracking-eyebrow text-dim">
                  {group.title}
                </h3>
              </Reveal>
              {/* Horizontal scroll row — same snap-scroll rail as the
                  "Field notes" news section (see NewsRail.tsx). */}
              <ul className="rail -mx-6 mt-5 flex snap-x gap-4 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10">
                {group.members.map((m, i) => (
                  <li key={i} className="flex-none snap-start">
                    <Reveal delay={(i % 4) * 70}>
                      <MemberCard m={m} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
