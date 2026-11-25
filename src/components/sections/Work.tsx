"use client";

import { useRef, useState, type PointerEvent } from "react";
import { ArrowRight, ArrowUpRight, GripHorizontal } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "@/components/layout/PageTransition";
import { Fade, Label, ProjectCover, Reveal } from "@/components/ui";
import { projects, type Project, type WorkType } from "@/data/projects";

const clientProjects = projects.filter((project) => !project.flagship);

function projectHref(project: Project) {
  return project.flagship ? `/flagship/${project.slug}` : `/work/${project.slug}`;
}

function MetaChips({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {[project.types[0], project.year, project.stack[0]].map((value) => (
        <span key={value} className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[0.57rem] font-bold uppercase tracking-[0.13em] text-white/75 backdrop-blur">{value}</span>
      ))}
    </div>
  );
}

function BrowserCard({ project, index }: { project: Project; index: number }) {
  return (
    <TLink href={projectHref(project)} data-cursor="OPEN" className="group block w-[min(78vw,28rem)] shrink-0 snap-center sm:w-[min(48vw,28rem)] lg:w-[min(30vw,28rem)]">
      <div className="relative rounded-[2rem] border border-line bg-surface p-2 shadow-[0_28px_75px_-42px_rgba(255,36,24,.45)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-2">
        <div className="relative overflow-hidden rounded-[1.55rem] bg-[#0b0b0e]">
          <div className="relative z-10 flex h-9 items-center gap-1.5 border-b border-white/10 bg-[#17171c] px-4">
            <span className="h-2 w-2 rounded-full bg-[#ff5a52]" /><span className="h-2 w-2 rounded-full bg-[#f2b84b]" /><span className="h-2 w-2 rounded-full bg-[#2bc96f]" />
            <span className="mono ml-3 flex-1 truncate rounded-md bg-white/[.06] px-3 py-1 text-[0.52rem] text-white/35">{project.slug}.product</span>
          </div>
          <div className="relative h-[24rem] overflow-hidden sm:h-[27rem]">
            <ProjectCover p={project} fit="top" className="origin-top transition-transform duration-[1600ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-[13%] group-hover:scale-[1.02]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white/70"><span>Live surface</span><span className="opacity-60">Hover to scroll</span></div>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-5 sm:px-3">
          <div><span className="mono text-[0.6rem] text-red">0{index + 1}</span><h3 className="font-display mt-1 text-[clamp(1.7rem,3vw,2.7rem)] font-extrabold leading-none tracking-[-0.06em]">{project.title}</h3><p className="mt-2 max-w-[19rem] text-xs leading-relaxed text-muted">{project.tagline}</p></div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-red group-hover:bg-red group-hover:text-white"><ArrowUpRight size={17} /></span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5 px-2 sm:px-3"><MetaChips project={project} /></div>
    </TLink>
  );
}

export function Work() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const pointer = useRef({ down: false, x: 0, scroll: 0 });

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo("[data-work-card]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.85, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 76%", once: true } });
  }, { scope: root });

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!rail.current) return;
    pointer.current = { down: true, x: event.clientX, scroll: rail.current.scrollLeft };
    rail.current.setPointerCapture(event.pointerId);
    rail.current.classList.add("cursor-grabbing");
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!rail.current || !pointer.current.down) return;
    rail.current.scrollLeft = pointer.current.scroll - (event.clientX - pointer.current.x) * 1.15;
  };
  const onUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!rail.current) return;
    pointer.current.down = false;
    rail.current.releasePointerCapture?.(event.pointerId);
    rail.current.classList.remove("cursor-grabbing");
  };

  return (
    <section ref={root} id="work" data-section="Work" className="grain-s relative overflow-hidden bg-bg py-[clamp(5.5rem,11vw,10rem)]">
      <div className="aura -right-48 top-[28%] h-[30rem] w-[30rem] opacity-20" />
      <div className="wrap relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div><Label>07 — Selected work</Label><Reveal as="h2" className="font-display tight mt-6 max-w-[9ch] text-[clamp(3.3rem,8vw,7.7rem)] font-extrabold">Things we <span className="serif-i text-red glow-red">shipped.</span></Reveal><p className="ar mt-5 text-[clamp(1.25rem,2.4vw,2rem)] font-semibold">شغلنا بيتكلم.</p></div>
          <div className="flex items-center justify-between gap-6 lg:pb-2"><span className="mono text-[0.62rem] uppercase tracking-[0.15em] text-muted">{clientProjects.length} client builds · +2 flagships above</span><TLink href="/work" data-cursor="ALL" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">All work <ArrowUpRight size={16} className="text-red transition-transform duration-500 group-hover:rotate-45" /></TLink></div>
        </div>
      </div>

      <div ref={rail} data-work-card onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} className="no-scrollbar mt-12 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1rem,calc((100vw-1480px)/2+3.2vw))] pb-7 sm:mt-16 sm:gap-6">
        {clientProjects.map((project, index) => <BrowserCard key={project.slug} project={project} index={index} />)}
        <div className="flex w-[min(70vw,18rem)] shrink-0 snap-center flex-col items-center justify-center rounded-[2rem] border border-dashed border-line text-center text-muted sm:w-[min(28vw,18rem)]"><GripHorizontal size={23} className="mb-4 text-red" /><span className="mono text-[0.63rem] uppercase tracking-[0.16em]">Drag the archive</span><span className="mt-2 max-w-[10rem] text-sm leading-relaxed">Four other products, built for real teams and real use.</span></div>
      </div>
      <div className="wrap mt-3 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.16em] text-muted"><span className="h-px w-10 bg-red" /><span>Swipe / drag to browse</span><ArrowRight size={14} className="text-red" /></div>
    </section>
  );
}

const filters: ("All" | WorkType)[] = ["All", "Web", "App", "SaaS"];

export function WorkGrid() {
  const [filter, setFilter] = useState<"All" | WorkType>("All");
  const [active, setActive] = useState<Project | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const previewX = useRef<((value: number) => void) | null>(null);
  const previewY = useRef<((value: number) => void) | null>(null);
  const list = projects.filter((project) => filter === "All" || project.types.includes(filter));

  useGSAP(() => {
    if (preview.current && !prefersReducedMotion()) {
      previewX.current = gsap.quickTo(preview.current, "x", { duration: 0.45, ease: "power3.out" });
      previewY.current = gsap.quickTo(preview.current, "y", { duration: 0.55, ease: "power3.out" });
    }
    if (grid.current && !prefersReducedMotion()) gsap.fromTo(grid.current.children, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.65, ease: "expo.out", stagger: 0.05 });
  }, { scope: grid, dependencies: [filter] });

  const movePreview = (project: Project, event: PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(hover: none)").matches) return;
    setActive(project);
    previewX.current?.(event.clientX + 26);
    previewY.current?.(event.clientY - 160);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-line py-4" role="tablist" aria-label="Filter projects"><div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} data-active={filter === item} className="chip" onClick={() => setFilter(item)}>{item === "App" ? "Apps" : item}<span className="opacity-50">{item === "All" ? projects.length : projects.filter((project) => project.types.includes(item)).length}</span></button>)}</div><span className="mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">{String(list.length).padStart(2, "0")} in archive</span></div>
      <div ref={grid} className="mt-8 border-t border-line">
        {list.map((project, index) => <TLink key={project.slug} href={projectHref(project)} data-cursor="VIEW" onPointerEnter={(event) => movePreview(project, event)} onPointerMove={(event) => movePreview(project, event)} onPointerLeave={() => setActive(null)} className="group relative flex min-h-[8.4rem] items-center gap-4 border-b border-line py-5 transition-colors duration-500 hover:border-red/70 sm:min-h-[10.5rem] sm:gap-8 sm:py-6">
          <span className="mono w-8 shrink-0 text-xs text-muted transition-colors group-hover:text-red sm:w-12">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h3 className="font-display text-[clamp(2.25rem,6.5vw,6.8rem)] font-extrabold leading-[0.86] tracking-[-0.07em] transition-colors group-hover:text-red">{project.title}</h3>{project.flagship && <span className="rounded-full border border-red/40 px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-red">Flagship</span>}</div><div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.61rem] uppercase tracking-[0.12em] text-muted"><span>{project.types.join(" / ")}</span><span className="h-1 w-1 rounded-full bg-red/70" /><span>{project.year}</span><span className="hidden sm:inline">{project.status}</span></div><p className="mt-2 hidden max-w-xl text-sm text-muted sm:block">{project.tagline}</p><div className="mt-3 block sm:hidden"><ProjectCover p={project} className="h-24 rounded-xl object-cover" /></div></div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-500 group-hover:rotate-45 group-hover:border-red group-hover:bg-red group-hover:text-white sm:h-14 sm:w-14"><ArrowUpRight size={18} /></span>
        </TLink>)}
      </div>
      <div ref={preview} aria-hidden className={`pointer-events-none fixed left-0 top-0 z-40 hidden w-[min(25vw,22rem)] -translate-y-1/2 overflow-hidden rounded-[1.4rem] border border-white/20 bg-black p-1.5 shadow-[0_24px_80px_rgba(0,0,0,.5)] transition-[clip-path,opacity] duration-500 md:block ${active ? "opacity-100 [clip-path:inset(0_round_1.4rem)]" : "opacity-0 [clip-path:inset(50%_0_50%_0_round_1.4rem)]"}`}>{active && <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem]"><ProjectCover p={active} /><div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full border border-white/15 bg-black/50 px-3 py-2 text-white backdrop-blur"><span className="font-display text-sm font-bold">{active.title}</span><span className="mono text-[0.55rem] uppercase tracking-[0.14em] text-white/60">{active.status}</span></div></div>}</div>
    </div>
  );
}
