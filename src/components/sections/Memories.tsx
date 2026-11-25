"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Draggable } from "gsap/Draggable";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Fade, Label, Reveal } from "@/components/ui";
import { Logo } from "@/components/ui/Brand";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable);

const CAPTIONS = ["Night shift · 2025", "First demo", "RAFIQ v0.1", "Hackathon", "Team photo", "Alexandria"];
const ROTATIONS = [-5, 3.5, -2.5, 5, -3, 2];
const POSITIONS = [
  "left-[4%] top-[8%] sm:left-[4%] sm:top-[12%]",
  "left-[36%] top-[1%] sm:left-[31%] sm:top-[2%]",
  "left-[57%] top-[18%] sm:left-[58%] sm:top-[17%]",
  "left-[13%] top-[52%] sm:left-[17%] sm:top-[51%]",
  "left-[43%] top-[44%] sm:left-[42%] sm:top-[47%]",
  "left-[68%] top-[61%] sm:left-[73%] sm:top-[58%]",
];
const WIDTHS = ["sm:w-[17rem]", "sm:w-[16rem]", "sm:w-[18rem]", "sm:w-[15rem]", "sm:w-[17rem]", "sm:w-[15.5rem]"];

type Frame = { src?: string; index: number };

function MemoryFrame({ frame, onOpen, frameRef }: { frame: Frame; onOpen: (index: number) => void; frameRef: (node: HTMLElement | null) => void }) {
  const rotation = ROTATIONS[frame.index];
  const style = { transform: `rotate(${rotation}deg)`, zIndex: frame.index + 1, ["--depth" as string]: `${(frame.index % 3) + 1}` } as CSSProperties;
  return (
    <article ref={frameRef} data-memory-frame data-memory-depth={frame.index % 3 + 1} style={style} className={`group relative w-[calc(50vw-1.35rem)] shrink-0 cursor-grab select-none rounded-[0.35rem] bg-[#eee9df] p-2 pb-9 text-ink shadow-[0_22px_50px_-20px_rgba(0,0,0,.75)] transition-shadow duration-500 hover:z-30 hover:shadow-[0_28px_70px_-18px_rgba(255,36,24,.42)] active:cursor-grabbing sm:absolute ${POSITIONS[frame.index]} ${WIDTHS[frame.index]}`}>
      <span aria-hidden className="absolute -top-2 left-[16%] h-5 w-20 rotate-[-5deg] bg-red/55 shadow-sm backdrop-blur-sm" />
      <button type="button" disabled={!frame.src} onClick={(event) => { const node = event.currentTarget.closest<HTMLElement>("[data-memory-frame]"); if (frame.src && !node?.dataset.dragged) onOpen(frame.index); }} className="relative block aspect-[1.12] w-full overflow-hidden rounded-[0.18rem] bg-[#0c0c10] text-left" aria-label={frame.src ? "Open memory photo" : "Memory placeholder"}>
        {frame.src ? <img src={frame.src} alt="Phantoms memory" draggable={false} className="h-full w-full object-cover grayscale-[0.08] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" /> : <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_25%_15%,#4b1717,transparent_55%),linear-gradient(145deg,#17171e,#08080a)]"><div className="absolute inset-0 grid place-items-center"><Logo size={64} className="opacity-40 grayscale brightness-200" /></div><div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" /></div>}
      </button>
      <div className="mt-2 flex items-center justify-between gap-2 px-1"><span className="serif-i text-[1.15rem] leading-none">{CAPTIONS[frame.index]}</span><span className="mono text-[0.48rem] uppercase tracking-[0.15em] text-ink/45">PH / 0{frame.index + 1}</span></div>
      {frame.index === 2 && <span className="absolute -right-4 top-[28%] rotate-12 rounded-full bg-red px-2.5 py-1 text-[0.53rem] font-bold uppercase tracking-[0.16em] text-white shadow-lg">keep this</span>}
    </article>
  );
}

export function Memories({ photos = [], full = false, heading = true }: { photos?: string[]; full?: boolean; heading?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<HTMLElement[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();
  const frames = useMemo<Frame[]>(() => Array.from({ length: 6 }, (_, index) => ({ src: photos[index], index })), [photos]);
  const realPhotos = photos.slice(0, 6);

  useEffect(() => {
    if (open === null) return;
    lenis.get()?.stop();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
      if (event.key === "ArrowRight" && realPhotos.length) setOpen((value) => value === null ? null : (value + 1) % realPhotos.length);
      if (event.key === "ArrowLeft" && realPhotos.length) setOpen((value) => value === null ? null : (value - 1 + realPhotos.length) % realPhotos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); lenis.get()?.start(); };
  }, [open, realPhotos.length, lenis]);

  useEffect(() => {
    if (!stage.current) return;
    const instances = frameRefs.current.filter(Boolean).flatMap((frame) => Draggable.create(frame, { type: "x,y", bounds: stage.current!, edgeResistance: 0.78, onDragStart: () => frame.dataset.dragged = "true", onDragEnd: () => window.setTimeout(() => delete frame.dataset.dragged, 60) }));
    return () => instances.forEach((instance) => instance.kill());
  }, [frames]);

  useGSAP(() => {
    const nodes = gsap.utils.toArray<HTMLElement>("[data-memory-frame]");
    if (prefersReducedMotion()) { gsap.set(nodes, { opacity: 1 }); return; }
    gsap.fromTo(nodes, { opacity: 0, y: -90, rotate: (index) => ROTATIONS[index] - 8 }, { opacity: 1, y: 0, rotate: (index) => ROTATIONS[index], duration: 1.15, ease: "bounce.out", stagger: 0.1, scrollTrigger: { trigger: stage.current, start: "top 84%", once: true } });
    nodes.forEach((node, index) => gsap.to(node, { y: -(index % 3 + 1) * 18, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }));
  }, { scope: root });

  return (
    <section ref={root} id="memories" data-section="Memories" className={`grain-s relative overflow-hidden ${full ? "pb-24 pt-4" : "sec-pad"}`}>
      {heading && <div className="wrap mb-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Label>Memories</Label><Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.8rem,6vw,6rem)] font-extrabold">Moments we <span className="serif-i text-red">made</span> together.</Reveal><p className="ar mt-3 text-xl font-semibold">ذكريات الفريق.</p></div><Fade className="max-w-sm text-sm leading-relaxed text-muted">The people and nights that got Phantoms here. Drag a frame, tap a real photo.</Fade></div></div>}
      <div ref={stage} className="relative mx-auto grid min-h-[40rem] max-w-6xl grid-cols-2 items-start gap-x-3 gap-y-8 px-4 py-8 sm:block sm:h-[38rem] sm:min-h-0 sm:px-8 sm:py-0">
        <div aria-hidden className="aura left-1/2 top-1/2 h-[28rem] w-[60%] -translate-x-1/2 -translate-y-1/2 opacity-25" />
        {frames.map((frame) => <MemoryFrame key={frame.index} frame={frame} onOpen={setOpen} frameRef={(node) => { if (node) frameRefs.current[frame.index] = node; }} />)}
      </div>
      {open !== null && realPhotos.length > 0 && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl" role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && setOpen(null)}><img src={realPhotos[open % realPhotos.length]} alt="Phantoms memory" className="max-h-[86vh] max-w-[92vw] rounded-[1.5rem] object-contain shadow-[0_0_80px_-20px_rgba(255,36,24,.5)]" onClick={(event) => event.stopPropagation()} /><button type="button" aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-red" onClick={() => setOpen(null)}><X size={18} /></button>{realPhotos.length > 1 && <><button type="button" aria-label="Previous" className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-red" onClick={() => setOpen((open - 1 + realPhotos.length) % realPhotos.length)}><ChevronLeft size={20} /></button><button type="button" aria-label="Next" className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-red" onClick={() => setOpen((open + 1) % realPhotos.length)}><ChevronRight size={20} /></button></>}</div>}
    </section>
  );
}
