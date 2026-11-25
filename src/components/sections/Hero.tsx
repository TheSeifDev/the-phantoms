"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { Draggable } from "gsap/Draggable";
import { ArrowUpRight, Check, GitBranch, Rocket, Sparkles } from "lucide-react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useReady } from "@/lib/ready";
import { CLOUD_PATH } from "@/lib/cloudPath";
import { Button } from "@/components/ui";
import { ScrollMarquee } from "@/components/ui/ScrollMarquee";
import { CursorTag, HexAvatar, HexOutline } from "@/components/ui/Hex";
import { HeroScene } from "@/components/three/lazy";
import { marqueeTech } from "@/data/site";

if (typeof window !== "undefined") gsap.registerPlugin(Draggable);

/** floating, parallaxing, draggable card shell */
function Float({
  depth,
  className,
  rot = 0,
  delay = 0,
  children,
}: {
  depth: number;
  className: string;
  rot?: number;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <div data-scroll={depth} className={`absolute z-20 hidden xl:block ${className}`}>
      <div data-mouse={depth}>
        <div className="float-y" style={{ animationDelay: `${delay}s`, animationDuration: `${5 + delay}s` }}>
          <div data-card data-rot={rot} data-cursor="DRAG" className="cursor-grab opacity-0 active:cursor-grabbing">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const glass =
  "rounded-2xl border border-line bg-surface/80 backdrop-blur-xl shadow-[0_24px_60px_-24px_rgba(0,0,0,.6)]";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);
  const ready = useReady();

  // mouse parallax + scroll drift + draggable (set up once)
  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const mouse = gsap.utils.toArray<HTMLElement>("[data-mouse]", el);
      const setters = mouse.map((m) => {
        const d = parseFloat(m.dataset.mouse || "1");
        return { d, x: gsap.quickTo(m, "x", { duration: 1.2, ease: "power3" }), y: gsap.quickTo(m, "y", { duration: 1.2, ease: "power3" }) };
      });
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s) => {
          s.x(-nx * 42 * s.d);
          s.y(-ny * 30 * s.d);
        });
      };
      window.addEventListener("pointermove", move, { passive: true });

      gsap.utils.toArray<HTMLElement>("[data-scroll]", el).forEach((n) => {
        gsap.to(n, {
          y: -parseFloat(n.dataset.scroll || "1") * 220,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      });
      gsap.to("[data-hero-copy]", {
        y: -90,
        opacity: 0.0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "30% top", end: "bottom 20%", scrub: true },
      });

      const drags = gsap.utils.toArray<HTMLElement>("[data-card]", el).map((c) =>
        Draggable.create(c, {
          type: "x,y",
          onRelease() {
            gsap.to(c, { x: 0, y: 0, duration: 1.4, ease: "elastic.out(1,0.5)" });
          },
        })[0],
      );
      return () => {
        window.removeEventListener("pointermove", move);
        drags.forEach((d) => d.kill());
      };
    },
    { scope: root },
  );

  // entrance (after the loader)
  useGSAP(
    () => {
      const el = root.current;
      const title = h1.current;
      if (!el || !title) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
      cards.forEach((c) => gsap.set(c, { rotation: parseFloat(c.dataset.rot || "0") }));
      if (prefersReducedMotion()) {
        gsap.set([title, ...cards, "[data-in]"], { opacity: 1 });
        return;
      }
      if (!ready) return;
      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(title, { opacity: 1 });
            return gsap.from(self.lines, { yPercent: 118, duration: 1.3, ease: "expo.out", stagger: 0.11 });
          },
        });
      });
      gsap.fromTo("[data-in]", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: 0.5 });
      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.55, y: 60 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "back.out(1.5)", stagger: 0.12, delay: 0.7 },
      );
      gsap.fromTo("[data-glow]", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 2, ease: "power2.out", stagger: 0.2 });
      return () => split?.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  // tiny fake multiplayer cursors wander
  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const cs = root.current.querySelectorAll<HTMLElement>("[data-wander]");
    const tws = Array.from(cs).map((c, i) =>
      gsap.to(c, { x: i % 2 ? -26 : 30, y: i % 2 ? 22 : -18, duration: 3.2 + i, ease: "sine.inOut", yoyo: true, repeat: -1 }),
    );
    return () => tws.forEach((t) => t.kill());
  }, []);

  return (
    <section ref={root} data-section="Intro" id="top" className="relative isolate overflow-hidden">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div data-glow className="blob-glow left-1/2 top-[-12%] h-[34rem] w-[60rem] -translate-x-1/2 opacity-0" style={{ background: "radial-gradient(closest-side, rgba(255,36,24,.34), transparent)" }} />
        <div data-glow className="blob-glow -right-[8%] top-[28%] h-[28rem] w-[28rem] opacity-0" style={{ background: "radial-gradient(closest-side, rgba(255,150,40,.22), transparent)" }} />
        <div data-glow className="blob-glow -left-[10%] top-[40%] h-[30rem] w-[30rem] opacity-0" style={{ background: "radial-gradient(closest-side, rgba(255,36,24,.16), transparent)" }} />
        <HeroScene />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_42%,var(--bg),transparent_75%)] opacity-90" />
      </div>

      {/* floating cards (desktop) */}
      <Float depth={0.9} rot={-4} delay={0} className="left-[2.2%] top-[27%] w-[15.5rem] 2xl:left-[5%]">
        <div className={`${glass} p-4`}>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#e6eeff]">
              <svg viewBox="-100 -100 200 200" className="h-8 w-8">
                <path d={CLOUD_PATH} fill="#3b82f6" />
                <rect x="-26" y="-18" width="12" height="30" rx="6" fill="#0b1020" />
                <rect x="14" y="-18" width="12" height="30" rx="6" fill="#0b1020" />
              </svg>
            </span>
            <div>
              <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">Flagship 01</div>
              <div className="font-display text-lg font-extrabold leading-none tracking-[-0.04em]">RAFIQ</div>
            </div>
            <span className="ml-auto rounded-full bg-[#2bd96b]/15 px-2 py-0.5 text-[0.6rem] font-bold text-[#2bd96b]">LIVE</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[0.7rem] text-muted">
            <span>Local-first AI companion</span>
            <span className="mono text-fg">82%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-fg/10">
            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#3b82f6] to-[#7aa8ff]" />
          </div>
        </div>
      </Float>

      <Float depth={1.5} rot={0} delay={1.2} className="left-[7%] top-[63%] 2xl:left-[10%]">
        <div className="flex items-center gap-2.5 rounded-full bg-fg py-1.5 pl-1.5 pr-5 text-bg shadow-[0_20px_50px_-20px_rgba(0,0,0,.7)]">
          <HexAvatar name="Seif Ayman" size={38} tone="red" />
          <div className="leading-tight">
            <div className="text-[0.8rem] font-extrabold">Seif Ayman</div>
            <div className="text-[0.62rem] font-semibold opacity-60">Founder & Tech Lead</div>
          </div>
        </div>
        <span data-wander className="absolute -right-5 -top-7 block">
          <CursorTag name="Seif" />
        </span>
      </Float>

      <Float depth={0.7} rot={3} delay={0.6} className="right-[2.2%] top-[24%] w-[15.5rem] 2xl:right-[5%]">
        <div className={`${glass} p-4`}>
          <div className="flex items-center justify-between">
            <div className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted">PHANTOMS Ops</div>
            <GitBranch size={14} className="text-red" />
          </div>
          <div className="font-display mt-2 text-4xl font-extrabold leading-none tracking-[-0.06em]">
            35<span className="text-red">+</span> <span className="text-base font-bold text-muted">members</span>
          </div>
          <div className="mt-3 flex items-end gap-[3px]">
            {[30, 52, 38, 64, 48, 76, 58, 90, 70, 100].map((h, i) => (
              <span key={i} className="w-full rounded-sm bg-red/80" style={{ height: `${h * 0.34}px`, opacity: 0.35 + h / 160 }} />
            ))}
          </div>
          <div className="mt-3 flex -space-x-2">
            {["AE", "SA", "MK", "NH"].map((n, i) => (
              <HexAvatar key={n} name={n} size={26} tone={i % 2 ? "dark" : "red"} className="ring-2 ring-surface" />
            ))}
          </div>
        </div>
      </Float>

      {/* tilted deploy card – overlaps the headline like the reference */}
      <Float depth={1.15} rot={7} delay={0.3} className="right-[12%] top-[49%] 2xl:right-[17%]">
        <div className="w-[13.5rem] rounded-2xl bg-red p-4 text-white shadow-[0_30px_70px_-20px_rgba(255,36,24,.65)]">
          <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] opacity-80">
            <Rocket size={13} /> Deploy · production
          </div>
          <div className="font-display mt-2 text-xl font-extrabold leading-tight tracking-[-0.04em]">Shipped to Vercel</div>
          <div className="mono mt-3 space-y-1 text-[0.66rem] opacity-90">
            <div className="flex items-center gap-2"><Check size={12} /> build passed · 38s</div>
            <div className="flex items-center gap-2"><Check size={12} /> lighthouse 100</div>
          </div>
        </div>
      </Float>

      <Float depth={1.6} rot={-2} delay={0.9} className="right-[6%] top-[70%] 2xl:right-[10%]">
        <div className="flex items-center gap-2.5 rounded-full bg-red px-5 py-2.5 text-white shadow-[0_20px_50px_-20px_rgba(255,36,24,.7)]">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-white" /></span>
          <div className="leading-tight">
            <div className="text-[0.8rem] font-extrabold">Booking Q1 projects</div>
            <div className="text-[0.62rem] font-semibold opacity-80">2 slots left · reply in 24h</div>
          </div>
        </div>
      </Float>
      <Float depth={0.5} rot={2} delay={1.5} className="left-[24%] top-[84%] 2xl:left-[28%]">
        <div className={`${glass} flex items-center gap-2 px-3.5 py-2 text-[0.72rem] font-bold`}>
          <Sparkles size={13} className="text-red" /> Web · Apps · SaaS
        </div>
      </Float>

      {/* copy */}
      <div data-hero-copy className="wrap relative flex min-h-[100svh] flex-col items-center justify-center pb-40 pt-32 text-center">
        <a
          data-in
          href="#flagship"
          className="mono group mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 py-1.5 pl-2 pr-4 text-[0.7rem] uppercase tracking-[0.1em] opacity-0 backdrop-blur-xl transition-colors hover:border-red"
        >
          <span className="rounded-full bg-red px-2 py-0.5 text-[0.62rem] font-bold text-white">NEW</span>
          RAFIQ &amp; OMNI — our flagships
          <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        <h1
          ref={h1}
          className="font-display tight max-w-[18ch] text-[clamp(2.7rem,6.3vw,6.6rem)] font-extrabold opacity-0 [line-height:0.95]"
        >
          <span className="block">We turn ideas into</span>
          <span className="block text-fg/35">websites, apps &amp; SaaS</span>
          <span className="block">
            people <span className="serif-i glow-red pr-[0.08em]">love to use.</span>
          </span>
        </h1>

        <p data-in className="ar mt-6 text-[clamp(1.15rem,2vw,1.6rem)] font-semibold opacity-0">
          عندك فكرة؟ إحنا نبنيها.
        </p>
        <p data-in className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted opacity-0">
          Phantoms is a 35-member product team from Alexandria — design, engineering and AI under one roof.
        </p>

        <div data-in className="mt-9 flex flex-wrap items-center justify-center gap-3 opacity-0">
          <Button href="/work" variant="light" cursor="VIEW">
            View our work
          </Button>
          <Button href="/contact" variant="red" cursor="START">
            Start a project
          </Button>
        </div>
      </div>

      {/* tech strip */}
      <div data-in className="absolute inset-x-0 bottom-0 border-t border-line bg-bg/60 py-5 opacity-0 backdrop-blur-md">
        <div className="wrap flex items-center gap-8">
          <span className="label hidden shrink-0 sm:inline-flex">Our stack</span>
          <ScrollMarquee speed={50} className="edge-fade-x flex-1">
            {marqueeTech.map((t) => (
              <span key={t} className="font-display flex items-center text-lg font-bold tracking-[-0.03em] text-fg/55">
                {t}
                <HexOutline size={14} className="mx-7 text-red" width={1.4} />
              </span>
            ))}
          </ScrollMarquee>
        </div>
      </div>
    </section>
  );
}
