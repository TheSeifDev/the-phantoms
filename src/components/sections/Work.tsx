"use client";

import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "@/components/layout/PageTransition";
import { Label, ProjectCover } from "@/components/ui";
import { projects, type Project, type WorkType } from "@/data/projects";

function projectHref(p: Project) {
  return p.flagship ? `/flagship/${p.slug}` : `/work/${p.slug}`;
}

function Chips({ p, dark = false }: { p: Project; dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {p.types.map((type) => (
        <span
          key={type}
          className={`rounded-full border px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.13em] ${
            dark ? "border-white/20 bg-black/35 text-white" : "border-line bg-bg/40 text-muted"
          }`}
        >
          {type}
        </span>
      ))}
    </div>
  );
}

function FeaturedCard({ p, index }: { p: Project; index: number }) {
  return (
    <TLink
      href={projectHref(p)}
      data-spot
      data-tilt="4"
      data-cursor="VIEW"
      className="group glow-card relative min-h-[15rem] overflow-hidden rounded-[1.8rem] p-1 sm:min-h-[19rem]"
    >
      <div className="relative h-full min-h-[14.5rem] overflow-hidden rounded-[1.55rem] bg-black sm:min-h-[18.5rem]">
        <ProjectCover p={p} className="transition duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between sm:inset-x-5 sm:top-5">
          <span className="mono rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[0.62rem] text-white/80 backdrop-blur">0{index + 1} / FLAGSHIP</span>
          <ArrowUpRight className="text-white transition duration-500 group-hover:rotate-45" size={19} />
        </div>
        <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
          <Chips p={p} dark />
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-[clamp(1.7rem,4vw,3.1rem)] font-extrabold leading-none tracking-[-0.06em] text-white">{p.title}</h3>
              <p className="mt-2 max-w-[29rem] text-xs leading-relaxed text-white/65 sm:text-sm">{p.tagline}</p>
            </div>
            <span className="hidden rounded-full border border-white/20 px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-white/70 sm:block">{p.year}</span>
          </div>
        </div>
      </div>
    </TLink>
  );
}

export function Work() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const previewX = useRef<((value: number) => void) | null>(null);
  const previewY = useRef<((value: number) => void) | null>(null);
  const previewR = useRef<((value: number) => void) | null>(null);
  const lastX = useRef(0);
  const [active, setActive] = useState<Project | null>(null);

  useGSAP(
    () => {
      if (!preview.current || prefersReducedMotion()) return;
      previewX.current = gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3.out" });
      previewY.current = gsap.quickTo(preview.current, "y", { duration: 0.65, ease: "power3.out" });
      previewR.current = gsap.quickTo(preview.current, "rotation", { duration: 0.7, ease: "power3.out" });
      gsap.fromTo(
        "[data-work-row]",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.85, ease: "expo.out", stagger: 0.07, scrollTrigger: { trigger: root.current, start: "top 76%", once: true } },
      );
      gsap.to("[data-work-list]", {
        y: 36,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    },
    { scope: root },
  );

  const showPreview = (p: Project, e: React.PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(hover: none)").matches) return;
    setActive(p);
    const x = e.clientX + 30;
    const y = e.clientY - 145;
    previewX.current?.(x);
    previewY.current?.(y);
    previewR.current?.(Math.max(-6, Math.min(6, (e.clientX - lastX.current) * 0.12)));
    lastX.current = e.clientX;
  };

  const flagships = projects.filter((p) => p.flagship).slice(0, 2);

  return (
    <section ref={root} id="work" data-section="Work" className="grain-s relative overflow-hidden bg-bg py-[clamp(5.5rem,11vw,10rem)]">
      <div className="aura -right-40 top-[24%] h-[28rem] w-[28rem] opacity-30" />
      <div className="wrap relative">
        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <Label>Selected work</Label>
            <h2 className="font-display tight mt-6 max-w-[10ch] text-[clamp(3.3rem,8vw,7.5rem)] font-extrabold">
              Things we <span className="serif-i text-red glow-red">shipped</span>.
            </h2>
            <p className="ar mt-5 text-[clamp(1.25rem,2.4vw,2rem)] font-semibold">شغلنا بيتكلم.</p>
          </div>
          <div className="flex items-end justify-between gap-8 lg:pb-2">
            <span className="mono text-xs uppercase tracking-[0.15em] text-muted">06 projects · 2025—26</span>
            <TLink href="/work" data-cursor="ALL" className="group link-u inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">
              All work <ArrowUpRight size={16} className="text-red transition-transform duration-500 group-hover:rotate-45" />
            </TLink>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:mt-16">
          {flagships.map((p, i) => <FeaturedCard key={p.slug} p={p} index={i} />)}
        </div>

        <div data-work-list className="relative mt-16 sm:mt-24">
          <div className="mb-3 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.16em] text-muted">
            <span>Index / shipped</span>
            <span className="mono">Hover to preview</span>
          </div>
          <div className="border-t border-line">
            {projects.map((p, i) => (
              <TLink
                key={p.slug}
                href={projectHref(p)}
                data-work-row
                data-cursor="VIEW"
                onPointerEnter={(e) => showPreview(p, e)}
                onPointerMove={(e) => showPreview(p, e)}
                onPointerLeave={() => setActive(null)}
                className="group relative flex min-h-[8.6rem] items-center gap-4 border-b border-line py-5 transition-[border-color] duration-500 hover:border-red/70 sm:min-h-[10.5rem] sm:gap-6 sm:py-6 lg:gap-8"
              >
                <span className="mono w-8 shrink-0 text-xs text-muted transition-colors duration-500 group-hover:text-red sm:w-12">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h3 className="font-display text-[clamp(2.35rem,6.7vw,6.8rem)] font-extrabold leading-[0.86] tracking-[-0.07em] transition-all duration-500 group-hover:text-red group-hover:drop-shadow-[0_0_24px_rgba(255,36,24,.35)]">{p.title}</h3>
                    {p.flagship && <span className="glow-red rounded-full border border-red/40 px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-red">Flagship</span>}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.62rem] uppercase tracking-[0.12em] text-muted">
                    <span>{p.types.join(" / ")}</span><span className="h-1 w-1 rounded-full bg-red/70" /><span>{p.year}</span>
                  </div>
                  <div className="mt-2 hidden max-w-xl text-sm text-muted transition-colors group-hover:text-fg sm:block">{p.tagline}</div>
                  <div className="mt-3 block sm:hidden"><ProjectCover p={p} className="h-24 rounded-xl object-cover" /></div>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-500 group-hover:rotate-45 group-hover:border-red group-hover:bg-red group-hover:text-white sm:h-14 sm:w-14">
                  <ArrowUpRight size={19} />
                </span>
              </TLink>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={preview}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden w-[min(25vw,20rem)] -translate-y-1/2 overflow-hidden rounded-[1.3rem] border border-white/20 bg-black p-1.5 shadow-[0_24px_80px_rgba(0,0,0,.5)] transition-[clip-path,opacity] duration-500 md:block ${active ? "opacity-100 [clip-path:inset(0_round_1.3rem)]" : "opacity-0 [clip-path:inset(50%_0_50%_0_round_1.3rem)]"}`}
      >
        {active && (
          <div key={active.slug} className="relative aspect-[4/3] overflow-hidden rounded-[1rem] animate-[fadeUp_.55s_ease-out]">
            <ProjectCover p={active} />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-white backdrop-blur">
              <span className="font-display text-sm font-bold">{active.title}</span>
              <span className="mono text-[0.56rem] uppercase tracking-[0.14em] text-white/65">{active.types[0]}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const filters: ("All" | WorkType)[] = ["All", "Web", "App", "SaaS"];
const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];

export function WorkGrid() {
  const [filter, setFilter] = useState<"All" | WorkType>("All");
  const grid = useRef<HTMLDivElement>(null);
  const list = projects.filter((p) => filter === "All" || p.types.includes(filter));

  useGSAP(
    () => {
      if (!grid.current || prefersReducedMotion()) return;
      gsap.fromTo(grid.current.children, { opacity: 0, y: 28, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "expo.out", stagger: 0.06 });
    },
    { scope: grid, dependencies: [filter] },
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4" role="tablist" aria-label="Filter projects">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button key={item} role="tab" aria-selected={filter === item} data-active={filter === item} className="chip" onClick={() => setFilter(item)}>
              {item === "App" ? "Apps" : item}<span className="opacity-50">{item === "All" ? projects.length : projects.filter((p) => p.types.includes(item)).length}</span>
            </button>
          ))}
        </div>
        <span className="mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">{String(list.length).padStart(2, "0")} in view</span>
      </div>
      <div ref={grid} className="mt-8 grid gap-3 lg:grid-cols-12">
        {list.map((p, i) => (
          <TLink key={p.slug} href={projectHref(p)} data-spot data-tilt="5" data-cursor="VIEW" className={`group glow-card relative flex min-h-[25rem] flex-col overflow-hidden rounded-[2rem] p-1 ${spans[i % spans.length]}`}>
            <div className="relative flex-1 overflow-hidden rounded-[1.7rem] bg-black">
              <ProjectCover p={p} className="transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
              <div className="absolute inset-x-5 top-5 flex items-center justify-between"><Chips p={p} dark /><ArrowUpRight size={18} className="text-white transition-transform duration-500 group-hover:rotate-45" /></div>
              <div className="absolute inset-x-5 bottom-5"><span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-white/65">{p.year} · {p.status}</span><h3 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.06em] text-white sm:text-4xl">{p.title}</h3><p className="mt-1 max-w-md text-sm text-white/65">{p.tagline}</p></div>
            </div>
          </TLink>
        ))}
      </div>
    </div>
  );
}
