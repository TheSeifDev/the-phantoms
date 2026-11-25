import { gsap } from "@/lib/gsap";

let busy = false;
export const hexWaveBusy = () => busy;

type Opts = {
  /** screen point the wave spreads from */
  origin: { x: number; y: number };
  /** colour the tiles settle on while covering the screen (the page colour of the destination) */
  cover: string;
  /** runs when the screen is fully covered (swap theme / push route) */
  onCovered: () => void;
  /** when the destination is ready, resolve this to start uncovering (route changes). default: immediate */
  ready?: () => Promise<void>;
  onDone?: () => void;
};

/** Hexagon-block wave: red hexes flood from `origin`, settle on the destination colour, swap, then dissolve. */
export function hexWave({ origin, cover, onCovered, ready, onDone }: Opts) {
  if (busy) return false;
  busy = true;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const s = vw < 700 ? 46 : 74;
  const w = Math.sqrt(3) * s;
  const rowH = 1.5 * s;
  const wrap = document.createElement("div");
  wrap.setAttribute("aria-hidden", "true");
  wrap.style.cssText = "position:fixed;inset:0;z-index:130;pointer-events:all;overflow:hidden";
  const tiles: { el: HTMLDivElement; d: number }[] = [];
  const rows = Math.ceil(vh / rowH) + 2;
  const cols = Math.ceil(vw / w) + 2;
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const x = col * w + (row % 2 ? w / 2 : 0);
      const y = row * rowH;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${x - w / 2}px;top:${y - s}px;width:${w + 1.5}px;height:${2 * s + 1.5}px;background:#ff2418;clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);transform:scale(0);will-change:transform`;
      wrap.appendChild(el);
      tiles.push({ el, d: Math.hypot(x - origin.x, y - origin.y) });
    }
  }
  document.body.appendChild(wrap);
  const maxD = Math.max(...tiles.map((t) => t.d));
  const spread = 0.62;
  const cleanup = () => {
    wrap.remove();
    busy = false;
    onDone?.();
  };
  const out = () => {
    const tl = gsap.timeline({ onComplete: cleanup });
    tiles.forEach(({ el, d }) => tl.to(el, { scale: 0, rotate: 30, duration: 0.42, ease: "power3.in" }, (d / maxD) * 0.5));
  };
  const tl = gsap.timeline();
  tiles.forEach(({ el, d }) => {
    const k = (d / maxD) * spread;
    tl.to(el, { scale: 1.02, duration: 0.34, ease: "power3.out" }, k);
    tl.to(el, { backgroundColor: cover, duration: 0.4, ease: "power1.inOut" }, k + 0.12);
  });
  tl.call(
    () => {
      onCovered();
      const go = () => setTimeout(out, 120);
      if (ready) {
        let fired = false;
        const fire = () => !fired && ((fired = true), go());
        ready().then(fire, fire);
        setTimeout(fire, 4500); // never get stuck
      } else go();
    },
    [],
    spread + 0.5,
  );
  return true;
}
