"use client";

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Label } from "@/components/ui";
import { processSteps } from "@/data/site";

const tickHeights = [18, 32, 12, 44, 24, 64, 28, 15, 52, 22, 38, 74, 26, 16, 46, 30, 60, 20, 36, 14, 54, 26, 42, 68, 18, 34, 22, 50, 30, 78, 18, 40, 24, 58, 16, 32, 48, 20, 70, 28, 38, 14, 56, 24, 44, 18, 64, 26, 36, 52, 20, 72, 16, 42, 30, 58, 22, 34, 66, 18, 46, 28, 54, 20, 76, 14, 40, 24, 62, 30, 48, 18, 36, 56, 22, 68, 16, 44];

export function Process() {
  const root = useRef<HTMLElement>(null);
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
      if (node && scrollViewport) {
        scrollViewport.scrollTo({ left: node.offsetLeft - scrollViewport.clientWidth * 0.08, behavior: "smooth" });
      }
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

  useGSAP(
    () => {
      const section = root.current;
      const scrollViewport = viewport.current;
      const timelineTrack = track.current;
      if (!section || !scrollViewport || !timelineTrack) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (prefersReducedMotion()) return;
        const horizontal = gsap.to(timelineTrack, {
          x: () => -(timelineTrack.scrollWidth - scrollViewport.clientWidth),
          ease: "none",
          scrollTrigger: {
            id: "process-horizontal",
            trigger: section,
            pin: true,
            scrub: 0.85,
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
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const current = root.current?.querySelector<HTMLElement>(`[data-timeline-step="${active}"] [data-reveal]`);
      if (!current) return;
      gsap.fromTo(current, { opacity: 0.35, y: 16 }, { opacity: 1, y: 0, duration: 0.65, ease: "expo.out" });
      gsap.fromTo(current.querySelectorAll("[data-reveal-item]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, delay: 0.08, ease: "power3.out" });
    },
    { scope: root, dependencies: [active] },
  );

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
    <section ref={root} id="process" data-section="Process" className="grain-s relative overflow-hidden bg-bg py-[clamp(5rem,10vw,9rem)]">
      <div className="wrap">
        <div className="mb-12 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <Label>How we work</Label>
            <h2 className="font-display tight mt-6 max-w-3xl text-[clamp(3.2rem,8vw,7.8rem)] font-extrabold">
              From idea to <span className="serif-i glow-red">launch</span>.
            </h2>
            <p className="ar mt-4 text-lg font-semibold text-muted sm:text-xl">من الفكرة للإطلاق.</p>
          </div>
          <div className="flex items-center justify-between gap-6 md:flex-col md:items-end md:gap-4">
            <div className="mono text-[0.67rem] uppercase tracking-[0.2em] text-muted">
              STEP <span className="text-fg">0{active + 1}</span> / 0{processSteps.length}
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous process step" onClick={() => selectStep(active - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-red hover:text-red">
                <ArrowLeft size={16} />
              </button>
              <button type="button" aria-label="Next process step" onClick={() => selectStep(active + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-red hover:text-red">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 h-px w-full overflow-hidden bg-line">
          <div className="h-full origin-left bg-red shadow-[0_0_18px_rgba(255,36,24,.9)] transition-[width] duration-700" style={{ width: `${((active + 1) / processSteps.length) * 100}%` }} />
        </div>

        <div
          ref={viewport}
          onPointerDown={beginDrag}
          onPointerMove={drag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="no-scrollbar edge-fade-x -mx-[clamp(1rem,3.2vw,3rem)] cursor-grab overflow-x-auto overscroll-x-contain px-[clamp(1rem,3.2vw,3rem)] active:cursor-grabbing md:cursor-grab md:overflow-hidden"
        >
          <div ref={track} className="flex min-w-max touch-pan-x will-change-transform">
            {processSteps.map((step, index) => {
              const isActive = active === index;
              return (
                <button
                  key={step.n}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  type="button"
                  data-timeline-step={index}
                  onClick={() => selectStep(index)}
                  onMouseEnter={() => selectStep(index)}
                  onFocus={() => selectStep(index)}
                  className={`group relative w-[82vw] max-w-[31rem] shrink-0 snap-center px-5 text-left transition-opacity duration-500 first:pl-0 md:w-[28rem] md:px-8 lg:w-[31rem] ${isActive ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
                >
                  {index > 0 && <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />}
                  <span aria-hidden className={`absolute bottom-0 left-0 top-0 w-px origin-bottom transition-all duration-700 ${isActive ? "bg-red shadow-[0_0_20px_2px_rgba(255,36,24,.85)]" : "scale-y-0 bg-transparent"}`} />
                  <span className="block pb-7">
                    <span className={`font-display block text-[clamp(5.8rem,13vw,11rem)] font-extralight leading-[0.75] tracking-[-0.1em] transition-all duration-700 ${isActive ? "glow-text text-fg" : "text-muted"}`}>{step.n}</span>
                    <span className={`mt-5 block font-display text-2xl font-bold tracking-[-0.045em] transition-colors duration-500 ${isActive ? "text-fg" : "text-muted"}`}>{step.title}</span>
                    <span className="ar mt-1 block text-base font-semibold text-muted">{step.ar}</span>
                  </span>

                  <div className={`overflow-hidden transition-[max-height,opacity] duration-700 ${isActive ? "max-h-[31rem] opacity-100" : "max-h-0 opacity-0"}`} data-reveal>
                    <p data-reveal-item className="max-w-sm border-t border-line pt-5 text-sm leading-relaxed text-muted">{step.line}</p>
                    <div data-reveal-item className="mt-5 flex flex-wrap gap-2">
                      {step.out.map((deliverable) => <span key={deliverable} className="chip !normal-case !tracking-normal">{deliverable}</span>)}
                    </div>
                    <div data-reveal-item className="edge-glow mt-7 overflow-hidden rounded-[1.4rem] border border-line bg-card p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={step.image} alt={`${step.title} phase`} draggable={false} className="h-44 w-full object-cover transition-transform duration-1000 group-hover:scale-105 sm:h-52" style={{ clipPath: isActive ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)" }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden border-y border-line py-4" aria-hidden>
          <div className="flex h-20 min-w-[48rem] items-end justify-between gap-1 opacity-80">
            {tickHeights.map((height, index) => {
              const normalized = (index / (tickHeights.length - 1)) * (processSteps.length - 1);
              const proximity = Math.max(0, 1 - Math.abs(normalized - active) * 1.6);
              return <span key={index} className={`w-px shrink-0 origin-bottom transition-all duration-700 ${proximity > 0.15 ? "bg-red shadow-[0_0_10px_rgba(255,36,24,.8)]" : "bg-muted/40"} ${index % 7 === 0 ? "animate-[float-y_4s_ease-in-out_infinite]" : ""}`} style={{ height: `${height + proximity * 18}px`, opacity: 0.25 + proximity * 0.75 }} />;
            })}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg to-transparent" />
        </div>
      </div>
    </section>
  );
}
