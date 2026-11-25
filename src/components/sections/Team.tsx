"use client";

import { Fade, Label, Reveal } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { members, squads } from "@/data/projects";
import { LeadSpotlight, TeamWall } from "@/components/sections/TeamWall";

export function Team({ photos = {}, heading = true }: { photos?: Record<string, string>; heading?: boolean }) {
  return (
    <section id="team" data-section="Team" className="relative overflow-hidden sec-pad">
      <div aria-hidden className="aura left-1/2 top-1/4 h-[28rem] w-[55rem] -translate-x-1/2 opacity-20" />
      <div className="wrap relative">
        {heading ? (
          <>
            <div className="max-w-4xl">
              <Label>Our team</Label>
              <Reveal as="h2" className="font-display tight mt-7 max-w-[13ch] text-[clamp(3rem,7vw,7.2rem)] font-extrabold">35 phantoms. <span className="serif-i text-red">One</span> standard.</Reveal>
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="ar text-xl font-semibold">٣٥ عقل، فريق واحد.</p>
                <div className="flex flex-wrap gap-2"><span className="chip !text-fg">35 members</span><span className="chip !text-fg">6 squads</span><span className="chip !text-fg">2 leads</span></div>
              </div>
            </div>
            <TeamWall photos={photos} showLeadStrip />
          </>
        ) : (
          <>
            <div className="mb-14">
              <div className="mb-7 flex items-end justify-between gap-4"><div><Label>Meet the leads</Label><h2 className="font-display tight mt-5 text-[clamp(2.5rem,5vw,5rem)] font-extrabold">The people <span className="serif-i text-red">setting</span> the pace.</h2></div><span className="mono hidden text-[0.62rem] uppercase tracking-[0.16em] text-muted sm:block">PH-001 / PH-002</span></div>
              <LeadSpotlight photos={photos} />
            </div>
            <TeamWall photos={photos} mode="roster" />
          </>
        )}
      </div>
    </section>
  );
}

export function Squads() {
  return (
    <section id="squads" data-section="Squads" className="relative overflow-hidden pb-24">
      <div className="wrap">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Label>Six squads</Label><h2 className="font-display tight mt-5 text-[clamp(2.5rem,5vw,5rem)] font-extrabold">Different <span className="serif-i text-red">edges.</span> Same standard.</h2></div><p className="max-w-xs text-sm leading-relaxed text-muted">Focused teams, shared context, and enough range to take a product all the way out.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{squads.map((squad, index) => { const count = members.filter((member) => member.squad === squad.name).length; return <Fade key={squad.name} delay={index * 0.04} y={24}><article data-spot className="glow-card group relative h-full overflow-hidden rounded-[1.6rem] p-6 sm:p-7"><div aria-hidden className="absolute -right-10 -top-10 text-red/20 transition duration-700 group-hover:rotate-20 group-hover:text-red/45"><HexOutline size={150} /></div><div className="relative flex h-full min-h-[13rem] flex-col justify-between"><div className="flex items-center justify-between"><span className="mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">Squad 0{index + 1}</span><span className="mono text-[0.7rem] text-red">{String(count).padStart(2, "0")} people</span></div><div><h3 className="font-display text-3xl font-extrabold tracking-[-0.07em] sm:text-4xl">{squad.name}</h3><p className="mt-2 max-w-[20ch] text-sm text-muted">{squad.note}</p></div></div></article></Fade>; })}</div>
      </div>
    </section>
  );
}
