import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Team, Squads } from "@/components/sections/Team";
import { CTA } from "@/components/sections/CTA";
import { TLink } from "@/components/layout/PageTransition";
import { memoryPhotos, teamPhotos } from "@/lib/media";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the 35 engineers, designers and researchers behind Phantoms.",
};

export default function TeamPage() {
  const memories = memoryPhotos();
  return (
    <>
      <PageHero label="Team / 35" title={<>The people <span className="serif-i text-red">behind</span> the standard.</>} ar="ناس بتبني بجد.">
        Six focused tracks, one founder, and 35 people who turn difficult product questions into things that ship.
      </PageHero>
      <Team photos={teamPhotos()} heading={false} />
      <Squads />
      <section className="pb-24">
        <div className="wrap">
          <div className="group relative overflow-hidden rounded-[2rem] border border-line bg-card p-6 sm:p-9">
            <div aria-hidden className="aura -right-24 -top-32 h-80 w-80 opacity-25" />
            <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
              <div><span className="label">A little more human</span><h2 className="font-display tight mt-5 max-w-[10ch] text-[clamp(2.5rem,5vw,5rem)] font-extrabold">The frames between <span className="serif-i text-red">releases.</span></h2><p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{memories.length ? `${memories.length} memories from the rooms and nights behind the work.` : "A growing archive of the rooms and nights behind the work."}</p></div>
              <TLink href="/memories" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-fg transition hover:text-red">Open memories <ArrowUpRight size={17} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></TLink>
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
