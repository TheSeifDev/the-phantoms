"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Fade, Label, Reveal } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { TLink } from "@/components/layout/PageTransition";
import { members, squads, type Member } from "@/data/projects";
import { FounderSpotlight, MemberTile, MemberVisual, PhantomIdModal, TeamWall } from "@/components/sections/TeamWall";

export function Team({ photos = {}, heading = true }: { photos?: Record<string, string>; heading?: boolean }) {
  const [activeTrack, setActiveTrack] = useState(squads[0]?.name ?? "Web");
  const [selected, setSelected] = useState<Member | null>(null);
  const activeSquad = squads.find((squad) => squad.name === activeTrack) ?? squads[0];
  const trackMembers = members.filter((member) => member.squad === activeTrack);
  const founder = members.find((member) => member.lead);

  if (!heading) {
    return (
      <section id="team" data-section="Team" className="relative overflow-hidden pb-20 pt-8 sm:pb-28 sm:pt-12">
        <div className="wrap">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <Label>Founder spotlight</Label>
              <h2 className="font-display tight mt-5 max-w-[14ch] text-[clamp(2.6rem,5vw,5rem)] font-extrabold">The standard starts <span className="serif-i text-red">here.</span></h2>
            </div>
            <span className="mono hidden text-[0.62rem] uppercase tracking-[0.16em] text-muted sm:block">35 / 01 founder</span>
          </div>
          <FounderSpotlight photos={photos} />
          <div className="mt-20 flex items-end justify-between gap-4">
            <div>
              <Label>Every phantom</Label>
              <h2 className="font-display tight mt-5 text-[clamp(2.5rem,5vw,5rem)] font-extrabold">One wall. <span className="serif-i text-red">Many</span> edges.</h2>
            </div>
            <span className="mono hidden text-[0.62rem] uppercase tracking-[0.16em] text-muted sm:block">PH-001 — PH-035</span>
          </div>
          <TeamWall photos={photos} mode="wall" />
          <div className="mt-20 flex items-end justify-between gap-4">
            <div><Label>Find your track</Label><p className="mt-3 max-w-md text-sm leading-relaxed text-muted">Browse the full roster by the way each person makes the work stronger.</p></div>
            <span className="mono hidden text-[0.62rem] uppercase tracking-[0.16em] text-muted sm:block">35 people / 06 tracks</span>
          </div>
          <TeamWall photos={photos} mode="roster" />
        </div>
      </section>
    );
  }

  return (
    <section id="team" data-section="Team" className="grain-s relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36">
      <div aria-hidden className="aura left-[55%] top-[13rem] h-[24rem] w-[38rem] -translate-x-1/2 opacity-20" />
      <div className="wrap relative">
        <div className="max-w-5xl">
          <Label>03 — Team</Label>
          <Reveal as="h2" className="font-display tight mt-7 max-w-[13ch] text-[clamp(3rem,7vw,7.2rem)] font-extrabold">35 phantoms. <span className="serif-i text-red">One</span> standard.</Reveal>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="ar text-xl font-semibold">٣٥ عقل، فريق واحد.</p>
            <div className="flex flex-wrap gap-2">
              <span className="chip !text-fg">35 members</span>
              <span className="chip !text-fg">6 tracks</span>
              <span className="chip !text-fg">1 founder</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 rounded-[2rem] border border-line bg-card/50 p-3 sm:mt-14 sm:grid-cols-[minmax(13rem,0.34fr)_minmax(0,1fr)] sm:gap-4 sm:p-4">
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 sm:block sm:overflow-visible sm:pb-0">
            {squads.map((squad, index) => {
              const count = members.filter((member) => member.squad === squad.name).length;
              const active = squad.name === activeTrack;
              return (
                <button
                  key={squad.name}
                  type="button"
                  aria-pressed={active}
                  onMouseEnter={() => setActiveTrack(squad.name)}
                  onFocus={() => setActiveTrack(squad.name)}
                  onClick={() => setActiveTrack(squad.name)}
                  className={`group min-w-[8.8rem] shrink-0 rounded-[1.35rem] border p-3 text-left transition duration-500 sm:mb-2 sm:block sm:w-full sm:p-4 ${active ? "border-red/70 bg-red text-white shadow-[0_0_34px_-12px_rgba(255,36,24,.9)]" : "border-transparent hover:border-line hover:bg-surface"}`}
                >
                  <span className={`mono block text-[0.58rem] tracking-[0.18em] ${active ? "text-white/65" : "text-muted"}`}>{String(index + 1).padStart(2, "0")} / 06</span>
                  <span className="mt-2 flex items-center justify-between gap-3">
                    <span className="font-display text-lg font-extrabold tracking-[-0.05em] sm:text-2xl">{squad.name}</span>
                    <span className={`mono text-[0.62rem] ${active ? "text-white/75" : "text-red"}`}>{String(count).padStart(2, "0")}</span>
                  </span>
                  <span className={`mt-1 hidden text-[0.68rem] leading-snug sm:block ${active ? "text-white/70" : "text-muted"}`}>{squad.note}</span>
                </button>
              );
            })}
          </div>

          <div className="min-w-0 rounded-[1.55rem] border border-line bg-bg/55 p-4 sm:p-5">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
              <div><span className="mono text-[0.6rem] uppercase tracking-[0.18em] text-red">Track {String(squads.findIndex((squad) => squad.name === activeTrack) + 1).padStart(2, "0")} / 06</span><h3 className="font-display mt-2 text-2xl font-extrabold tracking-[-0.06em] sm:text-3xl">{activeTrack}</h3></div>
              <span className="mono text-[0.6rem] text-muted">{trackMembers.length} members</span>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">{activeSquad?.note}. Hover or choose another track to see the people behind the output.</p>
            <div key={activeTrack} className="mt-5 grid animate-[fadeUp_0.55s_ease_both] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {trackMembers.map((member, index) => <MemberTile key={member.slug} member={member} photo={photos[member.slug]} onSelect={setSelected} index={index} roster />)}
            </div>
          </div>
        </div>

        {founder && (
          <div className="mt-5 flex flex-col gap-4 rounded-[1.6rem] border border-red/35 bg-red/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-4">
              <MemberVisual member={founder} src={photos[founder.slug]} className="h-16 w-16 shrink-0 rounded-[1.15rem]" />
              <div className="min-w-0"><span className="mono text-[0.58rem] uppercase tracking-[0.18em] text-red">Founder / {founder.id}</span><p className="mt-1 truncate font-display text-xl font-extrabold tracking-[-0.05em]">{founder.name}</p><p className="truncate text-xs text-muted">{founder.role} · {founder.handle}</p></div>
            </div>
            <TLink href={`/team/${founder.slug}`} className="group inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-fg transition hover:text-red">View founder profile <ArrowUpRight size={15} className="transition group-hover:rotate-45" /></TLink>
          </div>
        )}
      </div>
      <PhantomIdModal member={selected} photo={selected ? photos[selected.slug] : undefined} onClose={() => setSelected(null)} />
    </section>
  );
}

export function Squads() {
  return (
    <section id="squads" data-section="Squads" className="relative overflow-hidden pb-24">
      <div className="wrap">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><Label>Six tracks</Label><h2 className="font-display tight mt-5 text-[clamp(2.5rem,5vw,5rem)] font-extrabold">Different <span className="serif-i text-red">edges.</span> Same standard.</h2></div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">Focused teams, shared context, and enough range to take a product all the way out.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {squads.map((squad, index) => {
            const count = members.filter((member) => member.squad === squad.name).length;
            return (
              <Fade key={squad.name} delay={index * 0.04} y={24}>
                <article data-spot className="glow-card group relative h-full overflow-hidden rounded-[1.6rem] p-6 sm:p-7">
                  <div aria-hidden className="absolute -right-10 -top-10 text-red/20 transition duration-700 group-hover:rotate-20 group-hover:text-red/45"><HexOutline size={150} /></div>
                  <div className="relative flex h-full min-h-[13rem] flex-col justify-between"><div className="flex items-center justify-between"><span className="mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">Track 0{index + 1}</span><span className="mono text-[0.7rem] text-red">{String(count).padStart(2, "0")} people</span></div><div><h3 className="font-display text-3xl font-extrabold tracking-[-0.07em] sm:text-4xl">{squad.name}</h3><p className="mt-2 max-w-[20ch] text-sm text-muted">{squad.note}</p></div></div>
                </article>
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
