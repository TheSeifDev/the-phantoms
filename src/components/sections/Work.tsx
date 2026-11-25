"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent } from "react";
import { ArrowRight, ArrowUpRight, GripHorizontal } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { TLink } from "@/components/layout/PageTransition";
import { Label, ProjectCover } from "@/components/ui";
import { projects, type Project, type WorkType } from "@/data/projects";

const clientProjects = projects.filter((project) => !project.flagship);

function projectHref(project: Project) {
  return project.flagship ? `/flagship/${project.slug}` : `/work/${project.slug}`;
}

function MetaChips({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.57rem] font-semibold uppercase tracking-[0.12em] text-muted">
      {[project.types.join(" / "), project.year, project.stack[0]].map((value, index) => (
        <span key={value} className="inline-flex items-center gap-2">
          {index > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-red/70" />}
          {value}
        </span>
      ))}
    </div>
  );
}

function WorkCard({ project, index }: { project: Project; index: number }) {
  return (
    <TLink
      href={projectHref(project)}
      draggable={false}
      data-work-project
      data-cursor="OPEN"
      className="group block w-[min(82vw,25rem)] shrink-0 snap-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red sm:w-[min(48vw,25rem)] lg:w-[min(30vw,25rem)]"
    >
      <article className="overflow-hidden border border-line bg-surface/30 transition-colors duration-500 group-hover:border-white/35">
        <div className="relative aspect-[0.91] overflow-hidden border-b border-line bg-black">
          <div data-work-media className="absolute -inset-y-[4%] inset-x-0">
            <ProjectCover
              p={project}
              fit="top"
              className="transition-transform duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.035]"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
            <span className="mono border border-white/20 bg-black/85 px-2.5 py-1.5 text-[0.55rem] uppercase tracking-[0.14em] text-white">
              Selected / {String(index + 1).padStart(2, "0")}
            </span>
            <span className="max-w-[55%] truncate border border-white/20 bg-black/85 px-2.5 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-white">
              {project.status}
            </span>
          </div>
          <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 grid h-10 w-10 place-items-center border border-white/35 bg-black/85 text-white transition-colors duration-500 group-hover:border-red group-hover:bg-red sm:bottom-4 sm:right-4">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <MetaChips project={project} />
          <div className="mt-4 flex items-start justify-between gap-3">
            <h3 className="font-display min-w-0 text-[clamp(1.65rem,5.5vw,2.55rem)] font-extrabold leading-[0.95] tracking-[-0.065em] transition-colors duration-300 group-hover:text-red">
              {project.title}
            </h3>
            <span className="mono shrink-0 pt-1 text-[0.6rem] text-muted">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <p className="mt-3 max-w-[28rem] text-xs leading-relaxed text-muted sm:text-[0.82rem]">{project.tagline}</p>
        </div>
      </article>
    </TLink>
  );
}

export function Work() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const pointer = useRef({ down: false, dragging: false, x: 0, scroll: 0, pointerId: -1 });
  const pointerHandlers = useRef<{
    move: (event: globalThis.PointerEvent) => void;
    end: (event: globalThis.PointerEvent) => void;
  } | null>(null);
  const suppressClick = useRef(false);

  useGSAP(() => {
    if (prefersReducedMotion() || !root.current) return;

    const section = root.current;
    const intro = Array.from(section.querySelectorAll<HTMLElement>("[data-work-intro]"));
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-work-project]"));

    if (intro.length) {
      gsap.fromTo(
        intro,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        },
      );
    }

    if (cards.length) {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rail.current, start: "top 84%", once: true },
        },
      );
    }

    cards.forEach((card) => {
      const media = card.querySelector<HTMLElement>("[data-work-media]");
      if (!media) return;
      gsap.to(media, {
        yPercent: -3.5,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    });
  }, { scope: root });

  const onDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!rail.current || event.button !== 0 || !event.isPrimary) return;
    pointer.current = { down: true, dragging: false, x: event.clientX, scroll: rail.current.scrollLeft, pointerId: event.pointerId };
    suppressClick.current = false;
    const move = (nativeEvent: globalThis.PointerEvent) => {
      if (!rail.current || !pointer.current.down || nativeEvent.pointerId !== pointer.current.pointerId) return;
      const delta = nativeEvent.clientX - pointer.current.x;
      if (!pointer.current.dragging) {
        if (Math.abs(delta) < 6) return;
        pointer.current.dragging = true;
        rail.current.classList.add("cursor-grabbing");
      }
      rail.current.scrollLeft = pointer.current.scroll - delta * 1.15;
    };
    const end = (nativeEvent: globalThis.PointerEvent) => {
      if (nativeEvent.pointerId !== pointer.current.pointerId) return;
      const dragged = pointer.current.dragging;
      pointer.current.down = false;
      pointer.current.dragging = false;
      rail.current?.classList.remove("cursor-grabbing");
      suppressClick.current = dragged;
      if (dragged) window.setTimeout(() => { suppressClick.current = false; }, 0);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      pointerHandlers.current = null;
    };
    pointerHandlers.current = { move, end };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };
  const onClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  };

  useEffect(() => () => {
    const handlers = pointerHandlers.current;
    if (!handlers) return;
    window.removeEventListener("pointermove", handlers.move);
    window.removeEventListener("pointerup", handlers.end);
    window.removeEventListener("pointercancel", handlers.end);
  }, []);

  return (
    <section ref={root} id="work" data-section="Work" className="grain-s relative overflow-hidden bg-bg py-[clamp(5.5rem,11vw,10rem)]">
      <div className="wrap relative">
        <div className="flex flex-col justify-between gap-9 lg:flex-row lg:items-end lg:gap-12">
          <div className="min-w-0 max-w-4xl">
            <div data-work-intro className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Label>07 — Selected work</Label>
              <span aria-hidden className="h-px w-8 bg-line" />
              <span className="mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">Built with intent · 2025—26</span>
            </div>
            <h2 data-work-intro className="font-display tight mt-6 text-[clamp(3.25rem,11vw,8rem)] font-extrabold leading-[0.83] tracking-[-0.085em]">
              Things we <span className="serif-i block text-red">shipped.</span>
            </h2>
            <div data-work-intro className="mt-6 flex items-center gap-3 sm:mt-7">
              <span className="h-px w-10 bg-red" />
              <p className="ar text-[clamp(1.2rem,2.4vw,1.85rem)] font-semibold">شغلنا بيتكلم.</p>
            </div>
          </div>

          <div data-work-intro className="flex min-w-0 flex-col gap-5 lg:max-w-[19rem] lg:pb-1">
            <p className="max-w-[25rem] text-sm leading-relaxed text-muted lg:text-[0.95rem]">
              Useful products, made for the way people and teams actually work.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
              <span className="mono text-[0.58rem] uppercase tracking-[0.13em] text-muted">
                <span className="text-white">{String(clientProjects.length).padStart(2, "0")}</span> client builds · +2 flagships above
              </span>
              <TLink href="/work" data-cursor="ALL" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:text-red">
                All work <ArrowUpRight size={15} className="text-red transition-transform duration-500 group-hover:rotate-45" />
              </TLink>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={rail}
        onPointerDown={onDown}
        onClickCapture={onClickCapture}
        onDragStartCapture={(event) => event.preventDefault()}
        role="list"
        aria-label="Selected client projects"
        className="no-scrollbar mt-10 flex cursor-grab select-none snap-x snap-mandatory gap-3 overflow-x-auto px-[max(1rem,calc((100vw-1480px)/2+3.2vw))] pb-5 sm:mt-14 sm:gap-5 sm:pb-7"
        style={{ touchAction: "pan-y" }}
      >
        {clientProjects.map((project, index) => <WorkCard key={project.slug} project={project} index={index} />)}
        <TLink
          href="/work"
          draggable={false}
          data-work-project
          data-cursor="ALL"
          className="group flex w-[min(76vw,20rem)] shrink-0 snap-center flex-col justify-between border border-dashed border-line p-5 text-left transition-colors duration-500 hover:border-red/70 sm:p-7"
        >
          <div>
            <span className="mono text-[0.58rem] uppercase tracking-[0.15em] text-muted">The wider archive</span>
            <h3 className="font-display mt-8 text-[clamp(2rem,5.5vw,3rem)] font-extrabold leading-[0.93] tracking-[-0.07em]">
              More work.<br /><span className="serif-i text-red">More to make.</span>
            </h3>
            <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-muted">Four more products, built for real teams and real use.</p>
          </div>
          <span className="mt-10 flex items-center justify-between border-t border-line pt-4 text-xs font-bold uppercase tracking-[0.12em]">
            Explore all projects <ArrowRight size={16} className="text-red transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </TLink>
      </div>
      <div className="wrap mt-1 flex items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-muted sm:mt-2">
        <GripHorizontal size={15} className="text-red" />
        <span>Swipe or drag to browse</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
        <span className="mono">{String(clientProjects.length).padStart(2, "0")} projects</span>
      </div>
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
      <div ref={preview} aria-hidden className={`pointer-events-none fixed left-0 top-0 z-40 hidden w-[min(25vw,22rem)] -translate-y-1/2 overflow-hidden border border-white/20 bg-black p-1.5 transition-[clip-path,opacity] duration-500 md:block ${active ? "opacity-100 [clip-path:inset(0)]" : "opacity-0 [clip-path:inset(50%_0_50%_0)]"}`}>{active && <div className="relative aspect-[4/3] overflow-hidden"><ProjectCover p={active} /><div className="absolute inset-x-3 bottom-3 flex items-center justify-between border border-white/15 bg-black/90 px-3 py-2 text-white"><span className="font-display text-sm font-bold">{active.title}</span><span className="mono text-[0.55rem] uppercase tracking-[0.14em] text-white/60">{active.status}</span></div></div>}</div>
    </div>
  );
}
