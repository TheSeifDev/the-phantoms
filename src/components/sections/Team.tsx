"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Fade, Label } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { TLink } from "@/components/layout/PageTransition";
import { members, squads } from "@/data/projects";
import { FounderSpotlight, TeamWall } from "@/components/sections/TeamWall";

export function Team({ photos = {}, heading = true }: { photos?: Record<string, string>; heading?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [activeTrack, setActiveTrack] = useState(squads[0]?.name ?? "Web");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const activeSquad = squads.find((squad) => squad.name === activeTrack) ?? squads[0];
  const trackMembers = members.filter((member) => member.squad === activeTrack);
  const focusedMember = trackMembers.find((member) => member.slug === selectedSlug) ?? trackMembers[0];
  const trackIndex = Math.max(0, squads.findIndex((squad) => squad.name === activeTrack));

  useGSAP(() => {
    if (prefersReducedMotion() || !root.current) return;
    gsap.fromTo(
      "[data-team-intro]",
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
      },
    );
  }, { scope: root });

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const rows = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-team-member-row]") ?? []);
    const focus = root.current?.querySelector<HTMLElement>("[data-team-focus]");
    if (rows.length) {
      gsap.fromTo(rows, { autoAlpha: 0, y: 12 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        ease: "power2.out",
        stagger: 0.035,
        clearProps: "transform",
      });
    }
    if (focus) {
      gsap.fromTo(focus, { autoAlpha: 0, x: -10 }, {
        autoAlpha: 1,
        x: 0,
        duration: 0.42,
        ease: "power2.out",
        clearProps: "transform",
      });
    }
  }, { scope: root, dependencies: [activeTrack, focusedMember?.slug], revertOnUpdate: true });

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
    <section ref={root} id="team" data-section="Team" className="relative isolate overflow-hidden border-b border-line bg-bg pb-[clamp(3.5rem,8vw,7rem)] pt-[clamp(6rem,11vw,9.5rem)]">
      <div className="wrap relative">
        <header className="grid gap-9 lg:grid-cols-[minmax(0,1.55fr)_minmax(15rem,0.45fr)] lg:items-end">
          <div data-team-intro>
            <Label>03 — Team</Label>
            <h2 className="font-display tight mt-7 max-w-[12ch] text-[clamp(3.4rem,8.2vw,8.5rem)] font-extrabold">
              35 minds.<br /><span className="serif-i text-red">One</span> standard.
            </h2>
            <p className="ar mt-6 text-lg font-semibold text-muted">٣٥ عقل، فريق واحد.</p>
          </div>
          <div data-team-intro className="border-l border-line pl-5 lg:mb-2 lg:pl-7">
            <p className="max-w-sm text-sm leading-relaxed text-muted sm:text-base">A collective of specialists, moving through six focused tracks. Every contributor carries an identity; the work carries one standard.</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-4">
              <div><span className="mono block text-[0.55rem] uppercase tracking-[0.18em] text-muted">Identities</span><span className="font-display mt-1 block text-2xl font-bold tracking-[-0.06em]">35</span></div>
              <div><span className="mono block text-[0.55rem] uppercase tracking-[0.18em] text-muted">Tracks</span><span className="font-display mt-1 block text-2xl font-bold tracking-[-0.06em]">06</span></div>
              <div><span className="mono block text-[0.55rem] uppercase tracking-[0.18em] text-muted">Range</span><span className="mono mt-2 block text-[0.74rem] text-red">PH-001 — PH-035</span></div>
            </div>
          </div>
        </header>

        <div className="mt-[clamp(2.75rem,6vw,5rem)] grid border-y border-line lg:grid-cols-[minmax(15rem,0.56fr)_minmax(0,1.44fr)]">
          <nav aria-label="Choose a team track" className="border-b border-line lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-5">
              <span className="mono text-[0.58rem] uppercase tracking-[0.2em] text-muted">Track selector</span>
              <span className="mono text-[0.58rem] text-muted">{String(squads.length).padStart(2, "0")} lanes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:block">
              {squads.map((squad, index) => {
                const count = members.filter((member) => member.squad === squad.name).length;
                const active = squad.name === activeTrack;
                return (
                  <button
                    key={squad.name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveTrack(squad.name)}
                    onFocus={() => setActiveTrack(squad.name)}
                    className={`group relative flex min-h-[5rem] w-full items-center justify-between gap-3 border-b border-r border-line px-4 py-3 text-left transition-colors duration-300 last:border-b-0 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red sm:px-5 lg:min-h-[5.7rem] lg:border-r-0 lg:py-4 ${active ? "bg-surface text-fg" : "text-muted hover:bg-surface/55 hover:text-fg"}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className={`mono text-[0.56rem] ${active ? "text-red" : "text-muted"}`}>{String(index + 1).padStart(2, "0")}</span>
                      <span className="min-w-0">
                        <span className="font-display block truncate text-lg font-bold tracking-[-0.045em] sm:text-xl">{squad.name}</span>
                        <span className="mt-0.5 hidden text-[0.65rem] text-muted lg:block">{squad.note}</span>
                      </span>
                    </span>
                    <span className={`mono shrink-0 text-[0.62rem] ${active ? "text-red" : "text-muted"}`}>{String(count).padStart(2, "0")}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="min-w-0">
            <div className="grid border-b border-line lg:grid-cols-[minmax(13rem,0.68fr)_minmax(0,1.32fr)]">
              {focusedMember && (
                <div key={focusedMember.slug} data-team-focus className="flex min-h-[18rem] flex-col justify-between border-b border-line p-5 sm:p-7 lg:border-b-0 lg:border-r">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="mono text-[0.56rem] uppercase tracking-[0.2em] text-red">Selected identity</span>
                      <p className="font-display mt-5 text-[clamp(2.1rem,4.3vw,4.4rem)] font-extrabold leading-[0.88] tracking-[-0.08em]">
                        {focusedMember.lead ? <>Seif<br />Ayman</> : <>Phan-<br />tom</>}
                      </p>
                    </div>
                    <span aria-hidden="true" className="mono border border-line px-2 py-1 text-[0.55rem] text-muted">ID</span>
                  </div>
                  <div className="mt-8 border-t border-line pt-4">
                    <span className="mono text-[0.75rem] tracking-[0.14em] text-red">{focusedMember.id}</span>
                    <p className="mt-2 text-sm font-semibold">{focusedMember.role}</p>
                    {focusedMember.lead && (
                      <TLink href={`/team/${focusedMember.slug}`} className="group mt-4 inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-muted transition-colors hover:text-red">
                        Founder profile <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </TLink>
                    )}
                  </div>
                </div>
              )}

              <div className="min-w-0 p-5 sm:p-7">
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
                  <div>
                    <span className="mono text-[0.56rem] uppercase tracking-[0.2em] text-red">Track {String(trackIndex + 1).padStart(2, "0")} / {String(squads.length).padStart(2, "0")}</span>
                    <h3 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.065em] sm:text-4xl">{activeTrack}</h3>
                  </div>
                  <span className="mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">{String(trackMembers.length).padStart(2, "0")} identities</span>
                </div>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">{activeSquad?.note}. Select an identity to bring their role into focus.</p>

                <div className="mt-5" aria-label={`${activeTrack} team members`}>
                  {trackMembers.map((member, index) => {
                    const selected = member.slug === focusedMember?.slug;
                    return (
                      <button
                        key={member.slug}
                        type="button"
                        data-team-member-row
                        aria-pressed={selected}
                        onClick={() => setSelectedSlug(member.slug)}
                        className={`group grid w-full grid-cols-[4.6rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-3.5 text-left transition-colors duration-300 last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:grid-cols-[5.2rem_minmax(0,1fr)_auto] sm:gap-4 ${selected ? "text-fg" : "text-muted hover:text-fg"}`}
                      >
                        <span className={`mono text-[0.62rem] tracking-[0.08em] ${selected ? "text-red" : "text-muted"}`}>{member.id}</span>
                        <span className="min-w-0">
                          <span className="font-display block truncate text-base font-bold tracking-[-0.035em] sm:text-lg">{member.lead ? member.name : "Phantom"}</span>
                          <span className="mt-0.5 block truncate text-[0.68rem] text-muted">{member.role}</span>
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="mono hidden text-[0.52rem] uppercase tracking-[0.16em] text-muted sm:inline">{String(index + 1).padStart(2, "0")}</span>
                          <ArrowUpRight aria-hidden="true" size={15} className={`transition-transform duration-300 ${selected ? "translate-x-0.5 -translate-y-0.5 text-red" : "text-muted group-hover:translate-x-0.5 group-hover:-translate-y-0.5"}`} />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <span className="mono text-[0.56rem] uppercase tracking-[0.2em] text-muted">Team / end of section</span>
          <span className="mono text-[0.56rem] uppercase tracking-[0.16em] text-muted">PH-001 — PH-035 <span className="px-1 text-red">/</span> 06 tracks</span>
        </div>
      </div>
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
