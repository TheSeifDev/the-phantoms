"use client";

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Label, Reveal } from "@/components/ui";
import { processSteps } from "@/data/site";

const tickHeights = [18, 32, 12, 44, 24, 64, 28, 15, 52, 22, 38, 74, 26, 16, 46, 30, 60, 20, 36, 14, 54, 26, 42, 68, 18, 34, 22, 50, 30, 78, 18, 40, 24, 58, 16, 32, 48, 20, 70, 28, 38, 14, 56, 24, 44, 18, 64, 26, 36, 52, 20, 72, 16, 42, 30, 58, 22, 34, 66, 18, 46, 28, 54, 20, 76, 14, 40, 24, 62, 30, 48, 18, 36, 56, 22, 68, 16, 44];

export function Process() {
  const root = useRef<HTMLElement>(null);
  const stageShell = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeRef = useRef(0);
  const dragRef = useRef<{ x: number; scroll: number } | null>(null);
  const [active, setActive] = useState(0);

  const selectStep = useCallback((index: number) => {
    const next = Math.max(0, Math.min(processSteps.length - 1, index));
    activeRef.current = next;
    setActive(next);

    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      const node = stepRefs.current[next];
      const scrollViewport = viewport.current;
      if (node && scrollViewport) scrollViewport.scrollTo({ left: node.offsetLeft - scrollViewport.clientWidth * 0.08, behavior: "smooth" });
      return;
    }

    const trigger = ScrollTrigger.getById("process-horizontal");
    if (trigger) {
      const progress = next / Math.max(processSteps.length - 1, 1);
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: "smooth" });
    } else if (track.current && viewport.current) {
      const distance = Math.max(track.current.scrollWidth - viewport.current.clientWidth, 0);
      gsap.to(track.current, { x: -(distance * (next / Math.max(processSteps.length - 1, 1))), duration: 0.8, ease: "expo.out" });
    }
  }, []);

  useGSAP(() => {
    const section = root.current;
    const scrollViewport = viewport.current;
    const timelineTrack = track.current;
    const pinStage = stageShell.current;
    if (!section || !scrollViewport || !timelineTrack || !pinStage) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const horizontal = gsap.to(timelineTrack, {
        x: () => -(timelineTrack.scrollWidth - scrollViewport.clientWidth),
        ease: "none",
        scrollTrigger: {
          id: "process-horizontal",
          trigger: pinStage,
          pin: pinStage,
          scrub: prefersReducedMotion() ? false : 0.85,
          invalidateOnRefresh: true,
          start: "top top",
          end: () => `+=${Math.max(timelineTrack.scrollWidth - scrollViewport.clientWidth, window.innerWidth * 0.8)}`,
          onUpdate: (self) => {
            const next = Math.round(self.progress * (processSteps.length - 1));
            if (next !== activeRef.current) {
              activeRef.current = next;
              setActive(next);
            }
          },
        },
      });
      return () => horizontal.kill();
    });

    const updateMobileActive = () => {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      const center = scrollViewport.scrollLeft + scrollViewport.clientWidth * 0.34;
      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;
      stepRefs.current.forEach((node, index) => {
        if (!node) return;
        const nextDistance = Math.abs(node.offsetLeft + node.offsetWidth / 2 - center);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = index;
        }
      });
      if (nearest !== activeRef.current) {
        activeRef.current = nearest;
        setActive(nearest);
      }
    };

    scrollViewport.addEventListener("scroll", updateMobileActive, { passive: true });
    return () => {
      scrollViewport.removeEventListener("scroll", updateMobileActive);
      mm.revert();
    };
  }, { scope: root });

  useGSAP(() => {
    const activeStep = root.current?.querySelector<HTMLElement>(`[data-timeline-step="${active}"]`);
    const current = activeStep?.querySelector<HTMLElement>("[data-reveal]");
    if (!activeStep || !current || prefersReducedMotion()) return;
    const timeline = gsap.timeline();
    timeline.fromTo(activeStep, { opacity: 0.5, y: -24 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" });
    timeline.fromTo(current, { opacity: 0.25, y: -18, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "expo.out" }, "-=0.38");
    timeline.fromTo(current.querySelectorAll("[data-reveal-item]"), { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, ease: "power3.out" }, "-=0.42");
  }, { scope: root, dependencies: [active] });

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const trigger = ScrollTrigger.getById("process-horizontal");
    if (!trigger) return;
    dragRef.current = { x: event.clientX, scroll: window.scrollY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const trigger = ScrollTrigger.getById("process-horizontal");
    if (!trigger) return;
    const delta = (dragRef.current.x - event.clientX) * 1.25;
    const next = Math.max(trigger.start, Math.min(trigger.end, dragRef.current.scroll + delta));
    window.scrollTo({ top: next });
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current) event.currentTarget.releasePointerCapture?.(event.pointerId);
    dragRef.current = null;
  };

  return (
    <section ref={root} id="process" data-section="Process" className="grain-s relative overflow-hidden bg-bg">
      <div className="wrap relative py-[clamp(4.5rem,9vw,7rem)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Label>05 — How we work</Label>
            <Reveal as="h2" className="font-display tight mt-5 max-w-3xl text-[clamp(3.2rem,7vw,6.6rem)] font-extrabold">From idea to <span className="serif-i glow-red">launch</span>.</Reveal>
            <p className="ar mt-3 text-lg font-semibold text-muted sm:text-xl">من الفكرة للإطلاق.</p>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">A clear path from the first question to a product people can use.</p>
        </div>
      </div>

      <div ref={stageShell} className="relative h-auto overflow-hidden pb-12 md:h-[100svh] md:pt-[clamp(5.5rem,9vh,6.5rem)] md:pb-[clamp(1rem,3vh,2rem)]">
        <div className="wrap flex h-full items-center">
          <div className="flex w-full min-w-0 flex-col justify-center gap-[clamp(.75rem,2vh,1.3rem)]">
            <div className="flex items-center justify-between gap-6">
              <div className="mono text-[0.62rem] uppercase tracking-[0.2em] text-muted">STEP <span className="text-fg">0{active + 1}</span> / 0{processSteps.length}</div>
              <div className="flex gap-2"><button type="button" aria-label="Previous process step" onClick={() => selectStep(active - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-line transition hover:border-red hover:text-red"><ArrowLeft size={14} /></button><button type="button" aria-label="Next process step" onClick={() => selectStep(active + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-line transition hover:border-red hover:text-red"><ArrowRight size={14} /></button></div>
            </div>

            <div className="h-px w-full overflow-hidden bg-line"><div className="h-full origin-left bg-red shadow-[0_0_18px_rgba(255,36,24,.9)] transition-[width] duration-700" style={{ width: `${((active + 1) / processSteps.length) * 100}%` }} /></div>

            <div ref={viewport} onPointerDown={beginDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag} className="no-scrollbar edge-fade-x -mx-[clamp(1rem,3.2vw,3rem)] cursor-grab overflow-x-auto overscroll-x-contain px-[clamp(1rem,3.2vw,3rem)] active:cursor-grabbing md:cursor-grab md:overflow-hidden">
              <div ref={track} className="flex min-w-max touch-pan-x will-change-transform">
                {processSteps.map((step, index) => {
                  const isActive = active === index;
                  return (
                    <button key={step.n} ref={(node) => { stepRefs.current[index] = node; }} type="button" data-timeline-step={index} onClick={() => selectStep(index)} onMouseEnter={() => selectStep(index)} onFocus={() => selectStep(index)} className={`group relative w-[82vw] max-w-[31rem] shrink-0 snap-center px-5 text-left transition-opacity duration-500 first:pl-0 md:w-[28rem] md:px-8 lg:w-[31rem] ${isActive ? "opacity-100" : "opacity-45 hover:opacity-80"}`}>
                      {index > 0 && <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />}
                      <span aria-hidden className={`absolute bottom-0 left-0 top-0 w-px origin-bottom transition-all duration-700 ${isActive ? "bg-red shadow-[0_0_20px_2px_rgba(255,36,24,.85)]" : "scale-y-0 bg-transparent"}`} />
                      <span className="block pb-5"><span className={`font-display block text-[clamp(4.4rem,9vw,7.4rem)] font-extralight leading-[0.75] tracking-[-0.1em] transition-all duration-700 ${isActive ? "glow-text text-fg" : "text-muted"}`}>{step.n}</span><span className={`mt-4 block font-display text-xl font-bold tracking-[-0.045em] transition-colors duration-500 ${isActive ? "text-fg" : "text-muted"}`}>{step.title}</span><span className="ar mt-1 block text-sm font-semibold text-muted">{step.ar}</span></span>
                      <div className={`overflow-hidden transition-[max-height,opacity] duration-700 ${isActive ? "max-h-[clamp(20rem,42vh,31rem)] opacity-100" : "max-h-0 opacity-0"}`} data-reveal>
                        <p data-reveal-item className="max-w-sm border-t border-line pt-4 text-sm leading-relaxed text-muted">{step.line}</p>
                        <div data-reveal-item className="mt-4 flex flex-wrap gap-2">{step.out.map((deliverable) => <span key={deliverable} className="chip !normal-case !tracking-normal">{deliverable}</span>)}</div>
                        <div data-reveal-item className="edge-glow mt-5 overflow-hidden rounded-[1.25rem] border border-line bg-card p-1"><img src={step.image} alt={`${step.title} phase`} draggable={false} className="h-[clamp(7rem,18vh,11rem)] w-full object-cover transition-transform duration-1000 group-hover:scale-105" style={{ clipPath: isActive ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }} /></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden border-y border-line py-2.5" aria-hidden>
              <div className="flex h-[clamp(3.5rem,8vh,5rem)] min-w-[48rem] items-end justify-between gap-1 opacity-80">{tickHeights.map((height, index) => { const normalized = (index / (tickHeights.length - 1)) * (processSteps.length - 1); const proximity = Math.max(0, 1 - Math.abs(normalized - active) * 1.6); return <span key={index} className={`w-px shrink-0 origin-bottom transition-all duration-700 ${proximity > 0.15 ? "bg-red shadow-[0_0_10px_rgba(255,36,24,.8)]" : "bg-muted/40"} ${index % 7 === 0 ? "animate-[float-y_4s_ease-in-out_infinite]" : ""}`} style={{ height: `${height * 0.72 + proximity * 15}px`, opacity: 0.25 + proximity * 0.75 }} />; })}</div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-bg to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
