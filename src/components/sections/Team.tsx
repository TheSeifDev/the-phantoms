"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Fade, Label, Marquee, Reveal, RotatingBadge, Button } from "@/components/ui";
import { members, squads, type Member } from "@/data/projects";

/* ───────── Single member card (glow, Artfolio-style) ───────── */
export function MemberCard({ m, photo }: { m: Member; photo?: string }) {
  return (
    <article className="group relative w-[74vw] shrink-0 snap-center sm:w-[19rem]">
      <div
        aria-hidden
        className="absolute -inset-3 rounded-[2.2rem] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: "radial-gradient(60% 60% at 50% 60%, rgba(255,36,24,.55), transparent 70%)" }}
      />
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.8rem] border border-line bg-surface">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={m.name}
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover grayscale transition-all duration-[900ms] group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div
            className="relative h-full w-full"
            style={{
              background:
                "radial-gradient(90% 60% at 50% 105%, rgba(255,36,24,.55) 0%, transparent 65%), linear-gradient(180deg, #17171c 0%, #0b0b0e 100%)",
            }}
          >
            <div className="grid-lines absolute inset-0 opacity-50" />
            <span className="jp absolute inset-0 grid place-items-center text-[9rem] leading-none text-white/[0.12] transition-all duration-700 group-hover:scale-110 group-hover:text-red/70">
              {m.kanji}
            </span>
            <div className="absolute left-5 top-5 h-9 w-9 rounded-full border border-white/20" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          {m.squad}
        </div>
        {m.lead && (
          <div className="absolute right-4 top-4 rounded-full bg-red px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white">
            Lead
          </div>
        )}
        <div className="absolute inset-x-5 bottom-5 text-white">
          <h3 className="font-display text-2xl font-extrabold tracking-[-0.035em]">{m.name}</h3>
          <div className="mt-0.5 text-xs font-semibold text-white/70">{m.role}</div>
          {m.link && (
            <a
              href={m.link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/80 hover:text-red"
            >
              {m.linkLabel} <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ───────── Team carousel ───────── */
export function Team({ photos, heading = true }: { photos: Record<string, string>; heading?: boolean }) {
  const scroller = useRef<HTMLDivElement>(null);
  const by = (dir: number) => scroller.current?.scrollBy({ left: dir * 330, behavior: "smooth" });

  return (
    <section id="team" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,36,24,.28), transparent 62%)" }}
      />
      <div className="wrap relative">
        {heading && (
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label>The team · 仲間</Label>
              <Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.8rem,8vw,7.5rem)] font-extrabold">
                Meet the <span className="serif-i text-red">Phantoms</span>.
              </Reveal>
            </div>
            <Fade className="flex items-center gap-3">
              <button
                aria-label="Previous"
                onClick={() => by(-1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors hover:border-red hover:bg-red hover:text-white"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                aria-label="Next"
                onClick={() => by(1)}
                className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors hover:border-red hover:bg-red hover:text-white"
              >
                <ArrowRight size={18} />
              </button>
            </Fade>
          </div>
        )}
      </div>

      <div
        ref={scroller}
        className="no-scrollbar relative mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        {members.map((m) => (
          <MemberCard key={m.slug} m={m} photo={photos[m.slug]} />
        ))}
        <div className="grid w-[74vw] shrink-0 snap-center place-items-center sm:w-[19rem]">
          <div className="text-center">
            <RotatingBadge text="Join us · Join us · Join us · " size={150}>
              <span className="jp text-3xl text-red">幻</span>
            </RotatingBadge>
            <p className="mt-6 text-sm text-muted">Squads are growing.</p>
            <div className="mt-4">
              <Button href="/contact" variant="ghost">
                Join the team
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* squads */}
      <div className="wrap relative mt-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {squads.map((s, i) => (
            <Fade key={s.name} delay={i * 0.05} y={24}>
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-red">
                <span className="jp absolute -right-1 -top-2 text-5xl text-fg/[0.07] transition-colors group-hover:text-red/40">
                  {s.jp}
                </span>
                <div className="font-display relative text-lg font-bold tracking-tight">{s.name}</div>
                <div className="relative mt-1 text-xs text-muted">{s.note}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Memories: old-team photo rows ───────── */
const sigils = ["記", "憶", "夢", "絆", "始", "光", "旅", "友"];

export function Memories({ photos }: { photos: string[] }) {
  const tile = (src: string | null, i: number) => (
    <div
      key={i}
      className="relative h-44 w-64 shrink-0 overflow-hidden rounded-[1.4rem] border border-line bg-surface sm:h-56 sm:w-80"
      style={{ transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="Phantoms memory" loading="lazy" draggable={false} className="h-full w-full object-cover" />
      ) : (
        <div
          className="relative h-full w-full"
          style={{
            background: `radial-gradient(80% 80% at ${20 + (i * 17) % 60}% 100%, rgba(255,36,24,${0.25 + (i % 3) * 0.12}) 0%, transparent 70%), linear-gradient(160deg, #1b1b21, #0b0b0e)`,
          }}
        >
          <span className="jp absolute inset-0 grid place-items-center text-7xl text-white/15">{sigils[i % sigils.length]}</span>
          <span className="absolute bottom-3 left-4 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/50">
            Phantoms · memory {String(i + 1).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
  const base = photos.length ? photos : Array.from<null>({ length: 8 }).fill(null);
  const rowA = base.map((s, i) => tile(s, i));
  const rowB = [...base].reverse().map((s, i) => tile(s, i + 3));

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="wrap">
        <div className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Label>Memories · 記録</Label>
            <Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.6rem,7vw,6.6rem)] font-extrabold">
              Where it <span className="serif-i text-red">started</span>.
            </Reveal>
          </div>
          <Fade>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Long nights, whiteboards, first deployments. The people who built the first version of
              Phantoms — still part of the story.
            </p>
            <p className="ar mt-2 text-lg">ناس بدأت معانا، وحكايتهم لسه معانا.</p>
          </Fade>
        </div>
      </div>
      <div className="mt-14 space-y-4">
        <Marquee items={rowA} duration={70} separator={<span className="w-2" />} />
        <Marquee items={rowB} duration={80} reverse separator={<span className="w-2" />} />
      </div>
    </section>
  );
}
