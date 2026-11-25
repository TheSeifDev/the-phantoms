"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Fade, Label, Reveal } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { ScrollMarquee } from "@/components/ui/ScrollMarquee";

const TONES = [
  "linear-gradient(145deg,#2a1210,#0e0e12)",
  "linear-gradient(145deg,#1b1b21,#0b0b0e)",
  "linear-gradient(145deg,#3a1411,#120a0b)",
  "linear-gradient(145deg,#22222a,#101014)",
  "linear-gradient(145deg,#2c0f0d,#0b0b0e)",
  "linear-gradient(145deg,#18181d,#0a0a0c)",
];
const TILE = 8;

type Tile = { src?: string; i: number };

function TileView({ t, onOpen }: { t: Tile; onOpen: (i: number) => void }) {
  const size = [15, 12, 17, 13, 16, 12.5][t.i % 6];
  return (
    <button
      type="button"
      disabled={!t.src}
      onClick={() => t.src && onOpen(t.i)}
      data-cursor={t.src ? "OPEN" : undefined}
      aria-label={t.src ? "Open photo" : "Photo placeholder"}
      className="group relative mx-2 shrink-0 overflow-hidden rounded-[1.8rem] border border-line transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:scale-[1.03] sm:mx-3"
      style={{ width: `${size}rem`, height: `${size}rem`, background: TONES[t.i % TONES.length] }}
    >
      {t.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.src} alt="Phantoms memory" loading="lazy" draggable={false} className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
      ) : (
        <>
          <div aria-hidden className="grid-plus absolute inset-0 opacity-50" />
          <HexOutline size={size * 7} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.09] transition-transform duration-1000 group-hover:rotate-[30deg]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.webp" alt="" className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 object-contain opacity-25 transition-opacity duration-500 group-hover:opacity-60" draggable={false} />
        </>
      )}
    </button>
  );
}

export function Memories({ photos = [], full = false, heading = true }: { photos?: string[]; full?: boolean; heading?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);

  // 3 rows; real photos are spread over them, placeholders fill the rest
  const rows = useMemo(() => {
    const total = TILE * 3;
    const list: Tile[] = Array.from({ length: total }, (_, i) => ({ i, src: photos.length ? photos[i % photos.length] : undefined }));
    return [list.slice(0, TILE), list.slice(TILE, TILE * 2), list.slice(TILE * 2)];
  }, [photos]);

  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, photos.length]);

  return (
    <section id="memories" data-section="Memories" className={`relative overflow-hidden ${full ? "pb-24 pt-4" : "sec-pad"}`}>
      {heading && (
        <div className="wrap mb-14">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Label>Memories</Label>
              <Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.6rem,6vw,5.4rem)] font-extrabold">
                Moments we <span className="serif-i text-red">made</span> together.
              </Reveal>
              <p className="ar mt-3 text-xl font-semibold">ذكريات الفريق.</p>
            </div>
            <Fade className="max-w-sm text-[0.95rem] leading-relaxed text-muted">
              The people and nights that got Phantoms here. {photos.length ? "Tap a photo to open it." : "Real photos land here as soon as the team shares them."}
            </Fade>
          </div>
        </div>
      )}

      <div className="relative space-y-4 sm:space-y-6">
        {rows.map((r, i) => (
          <ScrollMarquee key={i} speed={[70, 90, 80][i]} reverse={i === 1}>
            {r.map((t) => (
              <TileView key={t.i} t={t} onOpen={setOpen} />
            ))}
          </ScrollMarquee>
        ))}
        {/* blurred edges */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[14%] backdrop-blur-[10px] [mask-image:linear-gradient(90deg,#000,transparent)]" style={{ background: "linear-gradient(90deg,var(--bg),transparent)" }} />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[14%] backdrop-blur-[10px] [mask-image:linear-gradient(270deg,#000,transparent)]" style={{ background: "linear-gradient(270deg,var(--bg),transparent)" }} />
      </div>

      {open !== null && photos.length > 0 && (
        <div className="fixed inset-0 z-[96] grid place-items-center bg-black/90 p-4 backdrop-blur-md" onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[open % photos.length]} alt="Phantoms memory" className="max-h-[86vh] max-w-[92vw] rounded-3xl object-contain" onClick={(e) => e.stopPropagation()} />
          <button aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-red" onClick={() => setOpen(null)}>
            <X size={18} />
          </button>
          <button aria-label="Previous" className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-red" onClick={(e) => (e.stopPropagation(), setOpen((open - 1 + photos.length) % photos.length))}>
            <ChevronLeft size={20} />
          </button>
          <button aria-label="Next" className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-red" onClick={(e) => (e.stopPropagation(), setOpen((open + 1) % photos.length))}>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
