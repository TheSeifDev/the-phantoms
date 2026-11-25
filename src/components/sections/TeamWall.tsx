"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, ShieldCheck, X } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";
import { Fade, Label } from "@/components/ui";
import { ScrollMarquee } from "@/components/ui/ScrollMarquee";
import { HexOutline } from "@/components/ui/Hex";
import { Logo } from "@/components/ui/Brand";
import { TLink } from "@/components/layout/PageTransition";
import { members, squads, type Member } from "@/data/projects";

const TINTS = [
  ["#2c0f12", "#0b0b10"],
  ["#121c29", "#090a0e"],
  ["#25171b", "#0c0a0c"],
  ["#16211f", "#090c0d"],
  ["#211729", "#0a090e"],
  ["#28170e", "#0c0a09"],
];

const UNIFORM_TILE = "h-[13.5rem] w-[10rem] sm:h-[15.5rem] sm:w-[11.5rem]";

function initials(name: string) {
  if (name.startsWith("Phantom ")) return `P${name.slice(-2)}`;
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function tint(member: Member) {
  const n = Number(member.id.slice(-3)) || 1;
  return TINTS[(n - 1) % TINTS.length];
}

export function MemberVisual({
  member,
  src,
  className = "",
  logo = true,
}: {
  member: Member;
  src?: string;
  className?: string;
  logo?: boolean;
}) {
  const colors = tint(member);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(100% 80% at 12% 8%, ${colors[0]}, transparent 66%), linear-gradient(150deg, ${colors[0]}, ${colors[1]})`,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={member.name} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <HexOutline size={280} className="absolute left-1/2 top-1/2 h-[130%] w-auto -translate-x-1/2 -translate-y-1/2 text-white/[0.09]" />
          <span className="font-display absolute inset-0 grid place-items-center pb-10 text-[clamp(2.4rem,4.6vw,4.2rem)] font-extrabold tracking-[-0.08em] text-white/[0.8]">
            {initials(member.name)}
          </span>
          {logo && <Logo size={88} className="absolute bottom-5 right-5 opacity-[0.16] grayscale brightness-200" />}
        </>
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#070709]/75 via-transparent to-[#070709]/10" />
    </div>
  );
}

export function MemberTile({
  member,
  photo,
  onSelect,
  index = 0,
  roster = false,
}: {
  member: Member;
  photo?: string;
  onSelect: (member: Member) => void;
  index?: number;
  roster?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      data-cursor="ID"
      data-wall-card
      data-roster-tile={roster ? "true" : undefined}
      aria-label={`Open Phantom ID for ${member.name}`}
      className={`group relative shrink-0 overflow-hidden rounded-[1.6rem] border border-white/[0.10] bg-card text-left transition-[border-color,box-shadow,transform,filter] duration-700 hover:z-10 hover:-translate-y-1 hover:border-red/80 hover:shadow-[0_0_0_1px_rgba(255,36,24,.45),0_0_42px_-8px_rgba(255,36,24,.72)] ${roster ? "aspect-[0.78] w-full" : UNIFORM_TILE}`}
    >
      <MemberVisual member={member} src={photo} className="absolute inset-0 h-full w-full brightness-[0.68] transition duration-700 group-hover:brightness-100" />
      <span aria-hidden className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.08] transition group-hover:ring-red/50" />
      <span className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
        <span className="block font-display text-[1.05rem] font-bold leading-none tracking-[-0.04em] text-white">{member.name}</span>
        <span className="mt-1 block max-w-[15ch] truncate text-[0.63rem] font-medium text-white/70">{member.role}</span>
        <span className="mono mt-2 block text-[0.58rem] tracking-wide text-red">{member.handle}</span>
      </span>
      {member.lead && <span className="absolute right-3 top-3 rounded-full border border-red/60 bg-red/85 px-2 py-1 text-[0.52rem] font-bold uppercase tracking-[0.16em] text-white">Founder</span>}
    </button>
  );
}

function Barcode() {
  return (
    <div aria-hidden className="flex h-9 items-stretch gap-[2px] opacity-70">
      {[2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2].map((width, index) => (
        <span key={index} className="bg-current" style={{ width }} />
      ))}
    </div>
  );
}

export function PhantomIdModal({ member, photo, onClose }: { member: Member | null; photo?: string; onClose: () => void }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!member) return;
    lenis.get()?.stop();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis.get()?.start();
    };
  }, [member, lenis, onClose]);

  if (!member) return null;
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-xl sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} Phantom ID`}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <article className="edge-glow relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#0e0e12] text-white shadow-[0_30px_120px_-30px_rgba(255,36,24,.65)]">
        <div aria-hidden className="aura -left-24 -top-24 h-72 w-72 opacity-50" />
        <button type="button" onClick={onClose} aria-label="Close Phantom ID" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/25 text-white transition hover:border-red hover:bg-red">
          <X size={17} />
        </button>
        <div className="grid md:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-[20rem] overflow-hidden border-b border-white/10 md:min-h-[34rem] md:border-b-0 md:border-r">
            <MemberVisual member={member} src={photo} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
              <div>
                <div className="mono text-[0.57rem] uppercase tracking-[0.24em] text-white/55">Phantom identity</div>
                <div className="font-display mt-2 text-2xl font-bold tracking-[-0.05em]">{member.name}</div>
              </div>
              <div className="hex-flat grid h-14 w-14 shrink-0 place-items-center border border-red/60 bg-red/15 text-red">
                <span className="mono text-[0.57rem] font-bold">{member.id}</span>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col justify-between p-6 sm:p-9">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="label !text-white/50">Phantom ID card</div>
                  <h2 className="font-display mt-5 max-w-[10ch] text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[0.88] tracking-[-0.08em]">{member.name}</h2>
                </div>
                <Logo size={48} className="opacity-60" />
              </div>
              <p className="mt-6 text-lg font-semibold text-white/90">{member.role}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="mono rounded-full border border-red/50 bg-red/10 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.12em] text-red">{member.squad}</span>
                <span className="mono rounded-full border border-white/15 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.12em] text-white/60">{member.handle}</span>
              </div>
              <p className="mt-8 max-w-md text-sm leading-relaxed text-white/60">{member.bio}</p>
            </div>
            <div className="mt-10 border-t border-white/10 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="mono text-[0.55rem] uppercase tracking-[0.2em] text-white/40">Access / link</div>
                  {member.link ? (
                    <a href={member.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-red">
                      <span className="max-w-[13rem] truncate">{member.linkLabel ?? member.link}</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="mt-2 block text-sm text-white/40">Internal profile</span>
                  )}
                </div>
                <ShieldCheck size={22} className="text-red" />
              </div>
              <div className="mt-5 flex flex-wrap items-end justify-between gap-4 text-white/55">
                <Barcode />
                <div className="flex items-center gap-4">
                  <span className="mono text-[0.55rem] tracking-[0.16em]">{member.id} · ALEXANDRIA</span>
                  <TLink href={`/team/${member.slug}`} onClick={onClose} className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-red transition hover:text-white">
                    View profile <ArrowUpRight size={13} />
                  </TLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export function TeamWall({ photos = {}, mode = "wall" }: { photos?: Record<string, string>; mode?: "wall" | "roster" }) {
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Member | null>(null);
  const [filter, setFilter] = useState("All");
  const filtered = useMemo(() => (filter === "All" ? members : members.filter((member) => member.squad === filter)), [filter]);
  const desktopRows = [members.slice(0, 12), members.slice(12, 24), members.slice(24)];
  const mobileRows = [members.filter((_, index) => index % 2 === 0), members.filter((_, index) => index % 2 === 1)];

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo("[data-wall-card]", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.025, scrollTrigger: { trigger: root.current, start: "top 86%", once: true } });
  }, { scope: root });

  useEffect(() => {
    if (mode !== "roster") return;
    const cards = root.current?.querySelectorAll<HTMLElement>("[data-roster-tile]");
    if (!cards?.length) return;
    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, scale: 1 });
      return;
    }
    gsap.fromTo(cards, { opacity: 0.18, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out", stagger: 0.025, overwrite: true });
  }, [filter, mode]);

  const renderTile = (member: Member, index: number, roster = false) => <MemberTile key={member.slug} member={member} photo={photos[member.slug]} onSelect={setSelected} index={index} roster={roster} />;

  return (
    <div ref={root} className="relative">
      {mode === "wall" ? (
        <div className="edge-fade-x relative mt-10 overflow-hidden py-3 sm:mt-14 sm:py-5">
          <div aria-hidden className="aura left-1/2 top-1/2 h-[28rem] w-[65%] -translate-x-1/2 -translate-y-1/2 opacity-25" />
          <div className="space-y-3 sm:space-y-4">
            {desktopRows.map((row, rowIndex) => (
              <div key={`desktop-${rowIndex}`} className="hidden sm:block">
                <ScrollMarquee speed={[58, 72, 64][rowIndex]} reverse={rowIndex === 1}>
                  {row.map((member, index) => <span key={member.slug} className="mx-1.5 inline-flex sm:mx-2">{renderTile(member, index + rowIndex * 3)}</span>)}
                </ScrollMarquee>
              </div>
            ))}
            {mobileRows.map((row, rowIndex) => (
              <div key={`mobile-${rowIndex}`} className="sm:hidden">
                <ScrollMarquee speed={[54, 68][rowIndex]} reverse={rowIndex === 1}>
                  {row.map((member, index) => <span key={member.slug} className="mx-1">{renderTile(member, index + rowIndex * 3)}</span>)}
                </ScrollMarquee>
              </div>
            ))}
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[14%] bg-gradient-to-r from-bg to-transparent" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[14%] bg-gradient-to-l from-bg to-transparent" />
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex flex-col justify-between gap-5 border-y border-line py-5 sm:flex-row sm:items-center">
            <div><Label>Full roster</Label><p className="mt-2 text-sm text-muted">35 people, six focused tracks.</p></div>
            <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-1">
              {["All", ...squads.map((squad) => squad.name)].map((name) => (
                <button key={name} type="button" className="chip shrink-0" data-active={filter === name} onClick={() => setFilter(name)}>
                  {name}{name !== "All" && <span className="text-red">{members.filter((member) => member.squad === name).length}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((member, index) => renderTile(member, index, true))}</div>
        </div>
      )}
      <PhantomIdModal member={selected} photo={selected ? photos[selected.slug] : undefined} onClose={() => setSelected(null)} />
    </div>
  );
}

export function FounderSpotlight({ photos = {}, onSelect }: { photos?: Record<string, string>; onSelect?: (member: Member) => void }) {
  const founder = members.find((member) => member.lead);
  const [selected, setSelected] = useState<Member | null>(null);
  if (!founder) return null;
  const choose = onSelect ?? setSelected;

  return (
    <>
      <Fade>
        <button type="button" onClick={() => choose(founder)} className="glow-card group relative w-full overflow-hidden rounded-[1.8rem] p-2 text-left">
          <div className="grid min-h-[17rem] overflow-hidden rounded-[1.4rem] bg-surface/70 sm:grid-cols-[0.65fr_1.35fr]">
            <MemberVisual member={founder} src={photos[founder.slug]} className="min-h-[13rem] sm:min-h-[17rem]" />
            <div className="flex flex-col justify-between p-5 sm:p-7">
              <div>
                <div className="mono text-[0.6rem] uppercase tracking-[0.2em] text-red">Founder / {founder.id}</div>
                <h3 className="font-display mt-4 text-3xl font-extrabold leading-[0.9] tracking-[-0.07em] sm:text-4xl">{founder.name}</h3>
                <p className="mt-3 text-sm font-semibold text-fg/80">{founder.role}</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{founder.bio}</p>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="mono text-[0.65rem] text-muted">{founder.handle} · {founder.squad}</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-red text-white transition-transform group-hover:rotate-45"><ArrowUpRight size={16} /></span>
              </div>
            </div>
          </div>
        </button>
      </Fade>
      <PhantomIdModal member={selected} photo={selected ? photos[selected.slug] : undefined} onClose={() => setSelected(null)} />
    </>
  );
}

/** Backward-compatible export for any existing page import. */
export const LeadSpotlight = FounderSpotlight;
