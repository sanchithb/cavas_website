import Nav from "@/components/Nav";
import Hero from "@/components/hero/Hero";
import ResearchPillars from "@/components/ResearchPillars";
import VehicleSection from "@/components/VehicleSection";
import TeamGrid from "@/components/TeamGrid";
import NewsRail from "@/components/NewsRail";
import PartnersStrip from "@/components/PartnersStrip";
import StudentCTA from "@/components/StudentCTA";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <>
      <a
        href="#after-hero"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-carbon focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-lidar"
      >
        Skip intro sequence
      </a>
      <Nav />
      <main>
        <Hero />
        {/* Sentinel: the nav solidifies once this content approaches. */}
        <div id="after-hero">
          <ResearchPillars />
          <VehicleSection />
          <TeamGrid />
          <NewsRail />
          <PartnersStrip />
          <StudentCTA />
        </div>
      </main>
      <ContactFooter />
    </>
  );
}
