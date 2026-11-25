"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "@/components/layout/PageTransition";
import { Button, Fade, Label, ProjectCover, Reveal } from "@/components/ui";
import { projects, type Project, type WorkType } from "@/data/projects";

/* ───────── Home: curved horizontal showcase ───────── */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", t);
        const arc = () => {
          const vw = window.innerWidth;
          cards.forEach((c) => {
            const r = c.getBoundingClientRect();
            const d = (r.left + r.width / 2 - vw / 2) / (vw / 2);
            const a = Math.min(Math.abs(d), 1.4);
            gsap.set(c, { rotate: d * 7, y: a * a * 46, scale: 1 - Math.min(a, 1) * 0.06 });
            const img = c.querySelector<HTMLElement>("[data-img]");
            if (img) img.style.filter = `grayscale(${Math.min(1, a * 1.25)}) brightness(${1 - Math.min(a, 1) * 0.25})`;
          });
        };
        const dist = () => t.scrollWidth - window.innerWidth + window.innerWidth * 0.12;
        gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${dist() * 1.05}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: arc,
            onRefresh: arc,
          },
        });
        arc();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" className="relative overflow-hidden py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0">
      <div className="wrap relative z-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label>Selected work · 作品</Label>
          <Reveal as="h2" className="font-display tight mt-5 text-[clamp(2.6rem,7vw,6.4rem)] font-extrabold">
            Things we&apos;ve <span className="serif-i text-red">shipped</span>.
          </Reveal>
        </div>
        <Fade>
          <Button href="/work" variant="ghost" cursor="ALL">
            All projects
          </Button>
        </Fade>
      </div>

      <div
        ref={track}
        className="no-scrollbar relative mt-12 flex gap-5 overflow-x-auto px-5 pb-10 snap-x snap-mandatory lg:mt-14 lg:w-max lg:snap-none lg:overflow-visible lg:px-[6vw] lg:pb-16 lg:pt-6"
      >
        {projects.map((p, i) => (
          <TLink
            key={p.slug}
            href={p.flagship ? `/flagship/${p.slug}` : `/work/${p.slug}`}
            data-card
            data-cursor="VIEW"
            className="group relative block w-[78vw] shrink-0 snap-center sm:w-[26rem] lg:w-[26vw] lg:max-w-[28rem]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] border border-line bg-surface">
              <div data-img className="h-full w-full transition-transform duration-[1200ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
                <ProjectCover p={p} fit="top" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute left-4 top-4 flex gap-1.5">
                {p.types.map((t) => (
                  <span key={t} className="glass rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white">
                    {t}
                  </span>
                ))}
              </div>
              <span className="jp absolute right-4 top-3 text-3xl text-white/70">{p.kanji}</span>
              <div className="absolute inset-x-5 bottom-5 text-white">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                      {String(i + 1).padStart(2, "0")} · {p.year}
                    </div>
                    <h3 className="font-display mt-1 text-3xl font-extrabold tracking-[-0.04em]">{p.title}</h3>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition-all duration-500 group-hover:rotate-45 group-hover:bg-red group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </div>
            </div>
          </TLink>
        ))}
      </div>

      {/* laser line */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[7%] hidden lg:block">
        <div className="mx-auto h-px w-[86%] bg-gradient-to-r from-transparent via-red to-transparent" />
        <div className="mx-auto -mt-6 h-12 w-[50%] bg-red/30 blur-2xl" />
      </div>
    </section>
  );
}

/* ───────── /work: filterable grid ───────── */
const filters: ("All" | WorkType)[] = ["All", "Web", "App", "SaaS"];

function GridCard({ p, big }: { p: Project; big?: boolean }) {
  return (
    <TLink
      href={p.flagship ? `/flagship/${p.slug}` : `/work/${p.slug}`}
      data-cursor="VIEW"
      className={`group relative block overflow-hidden rounded-[1.8rem] border border-line bg-surface ${big ? "lg:col-span-2" : ""}`}
    >
      <div className={`relative overflow-hidden ${big ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <div className="h-full w-full transition-transform duration-[1200ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]">
          <ProjectCover p={p} fit="top" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
        <span className="jp absolute right-5 top-4 text-4xl text-white/70">{p.kanji}</span>
        {p.flagship && (
          <span className="absolute left-4 top-4 rounded-full bg-red px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white">
            Flagship
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <h3 className="font-display text-2xl font-extrabold tracking-[-0.035em]">{p.title}</h3>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{p.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.types.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
            <span className="chip">{p.year}</span>
          </div>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-red group-hover:bg-red group-hover:text-white">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </TLink>
  );
}

export function WorkGrid() {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const list = projects.filter((p) => f === "All" || p.types.includes(f));
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter work">
        {filters.map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={f === k}
            onClick={() => setF(k)}
            className={`rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
              f === k ? "border-red bg-red text-white" : "border-line text-muted hover:border-fg hover:text-fg"
            }`}
          >
            {k}
            <span className="ml-2 opacity-60">
              {k === "All" ? projects.length : projects.filter((p) => p.types.includes(k)).length}
            </span>
          </button>
        ))}
      </div>
      <div key={f} className="mt-10 grid animate-[fadeup_.7s_cubic-bezier(.16,1,.3,1)] gap-4 lg:grid-cols-3">
        {list.map((p, i) => (
          <GridCard key={p.slug} p={p} big={i === 0 && list.length > 2} />
        ))}
      </div>
      <style>{`@keyframes fadeup{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
