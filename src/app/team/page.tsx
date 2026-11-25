import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Team, Memories } from "@/components/sections/Team";
import { About } from "@/components/sections/About";
import { CTA } from "@/components/sections/CTA";
import { memoryPhotos, teamPhotos } from "@/lib/media";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the engineers, designers and researchers behind Phantoms.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero label="Team · 仲間" title={<>The people <span className="serif-i text-red">behind</span></>} ar="ناس بتبني بجد." kanji="仲">
        Six squads, one standard. Engineers, designers and researchers from Alexandria.
      </PageHero>
      <Team photos={teamPhotos()} heading={false} />
      <About compact />
      <Memories photos={memoryPhotos()} />
      <CTA />
    </>
  );
}
