"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "@/components/layout/PageTransition";
import { Label, ProjectCover } from "@/components/ui";
import { projects, type Project, type WorkType } from "@/data/projects";

function Chips({ p, dark = true }: { p: Project; dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {p.types.map((t) => (
        <span key={t} className={`rounded-full border px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${dark ? "border-white/20 bg-black/40 text-white" : "border-line"}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

/* ───────── Horizontal pinned showcase (home) ───────── */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const t = track.current;
      if (!t || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 0px)", () => {
        const dist = () => t.scrollWidth - window.innerWidth + 24;
        const tween = gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (s) => {
              if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
              if (count.current) count.current.textContent = String(Math.min(projects.length, Math.floor(s.progress * projects.length) + 1)).padStart(2, "0");
            },
          },
        });
        // image parallax inside each card
        gsap.utils.toArray<HTMLElement>("[data-wimg]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -9 },
            {
              xPercent: 9,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-wcard]").forEach((c) => {
          gsap.from(c, {
            rotate: 4,
            y: 50,
            ease: "none",
            scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 100%", end: "left 55%", scrub: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" data-section="Work" className="relative overflow-hidden bg-bg">
      <div className="relative flex h-[100svh] flex-col justify-center py-20">
        <div aria-hidden className="grid-lines absolute inset-0 opacity-50" />
        <div ref={track} className="relative flex w-max items-center gap-5 pl-[max(1rem,3.2vw)] pr-[10vw] will-change-transform sm:gap-7">
          {/* intro panel */}
          <div className="w-[min(82vw,26rem)] shrink-0 pr-6 sm:pr-10">
            <Label>Selected work</Label>
            <h2 className="font-display tight mt-6 text-[clamp(2.8rem,6vw,5.6rem)] font-extrabold">
              Things we <span className="serif-i text-red">shipped</span>.
            </h2>
            <p className="ar mt-4 text-xl font-semibold">شغلنا بيتكلم.</p>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-muted">
              Keep scrolling — the page moves sideways through six products, from AI companions to ops platforms.
            </p>
            <div className="mono mt-8 flex items-center gap-2 text-xs text-muted">
              Scroll <ArrowRight size={14} className="text-red" />
            </div>
          </div>

          {projects.map((p, i) => (
            <TLink
              key={p.slug}
              href={`/work/${p.slug}`}
              data-wcard
              data-spot
              data-cursor="VIEW"
              className="group relative flex h-[min(62vh,31rem)] w-[min(82vw,34rem)] shrink-0 flex-col overflow-hidden rounded-[2rem] border border-line bg-card"
            >
              <div className="relative flex-1 overflow-hidden">
                <div data-wimg className="absolute inset-y-0 -inset-x-[12%]">
                  <ProjectCover p={p} className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                <div className="absolute left-5 top-5">
                  <Chips p={p} />
                </div>
                <span className="mono absolute right-5 top-5 rounded-full bg-black/50 px-3 py-1 text-[0.65rem] font-bold text-white backdrop-blur">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-end justify-between gap-4 p-6">
                <div>
                  <h3 className="font-display text-3xl font-extrabold tracking-[-0.05em] sm:text-4xl">{p.title}</h3>
                  <p className="mt-1.5 max-w-[22rem] text-sm leading-snug text-muted">{p.tagline}</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red text-white transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </TLink>
          ))}

          {/* end panel */}
          <TLink
            href="/work"
            data-cursor="ALL"
            className="group flex h-[min(62vh,31rem)] w-[min(70vw,22rem)] shrink-0 flex-col justify-between rounded-[2rem] bg-red p-7 text-white"
          >
            <span className="mono text-xs uppercase tracking-[0.16em] opacity-80">Archive</span>
            <div>
              <div className="font-display text-5xl font-extrabold leading-[0.9] tracking-[-0.06em]">All work</div>
              <span className="mt-5 grid h-14 w-14 place-items-center rounded-full bg-white text-red transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={24} />
              </span>
            </div>
          </TLink>
        </div>

        {/* progress */}
        <div className="wrap absolute inset-x-0 bottom-7 flex items-center gap-5">
          <span className="mono text-xs text-muted">
            <span ref={count} className="text-fg">01</span> / {String(projects.length).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-line">
            <div ref={bar} className="h-[2px] origin-left bg-red" style={{ transform: "scaleX(0)" }} />
          </div>
          <span className="mono text-xs text-muted">Work</span>
        </div>
      </div>
    </section>
  );
}

/* ───────── Filterable bento grid (/work) ───────── */
const filters: ("All" | WorkType)[] = ["All", "Web", "App", "SaaS"];
const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];

export function WorkGrid() {
  const [f, setF] = useState<"All" | WorkType>("All");
  const grid = useRef<HTMLDivElement>(null);
  const list = projects.filter((p) => f === "All" || p.types.includes(f));

  useEffect(() => {
    if (prefersReducedMotion() || !grid.current) return;
    gsap.fromTo(grid.current.children, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out", stagger: 0.07 });
  }, [f]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter projects">
        {filters.map((x) => (
          <button key={x} role="tab" aria-selected={f === x} data-active={f === x} className="chip" onClick={() => setF(x)}>
            {x === "App" ? "Apps" : x}
            <span className="opacity-50">{x === "All" ? projects.length : projects.filter((p) => p.types.includes(x)).length}</span>
          </button>
        ))}
      </div>
      <div ref={grid} className="mt-8 grid gap-3 lg:grid-cols-12">
        {list.map((p, i) => (
          <TLink
            key={p.slug}
            href={`/work/${p.slug}`}
            data-spot
            data-cursor="VIEW"
            className={`group relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] border border-line bg-card ${spans[i % spans.length]}`}
          >
            <div className="relative flex-1 overflow-hidden">
              <ProjectCover p={p} className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute left-5 top-5">
                <Chips p={p} />
              </div>
              {p.flagship && <span className="mono absolute right-5 top-5 rounded-full bg-red px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white">Flagship</span>}
            </div>
            <div className="flex items-end justify-between gap-4 p-6">
              <div>
                <div className="mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">{p.year} · {p.status}</div>
                <h3 className="font-display mt-1 text-3xl font-extrabold tracking-[-0.05em]">{p.title}</h3>
                <p className="mt-1 max-w-sm text-sm text-muted">{p.tagline}</p>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-red group-hover:bg-red group-hover:text-white">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </TLink>
        ))}
      </div>
    </div>
  );
}
