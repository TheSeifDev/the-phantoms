import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Team, Squads } from "@/components/sections/Team";
import { PhantomCode } from "@/components/sections/PhantomCode";
import { Memories } from "@/components/sections/Memories";
import { CTA } from "@/components/sections/CTA";
import { memoryPhotos, teamPhotos } from "@/lib/media";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the 35 engineers, designers and researchers behind Phantoms.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero label="Team" title={<>The people <span className="serif-i text-red">behind</span></>} ar="ناس بتبني بجد.">
        Six squads, one standard. Engineers, designers and researchers from Alexandria, building for everywhere.
      </PageHero>
      <Team photos={teamPhotos()} heading={false} />
      <PhantomCode />
      <Squads />
      <Memories photos={memoryPhotos()} />
      <CTA />
    </>
  );
}
