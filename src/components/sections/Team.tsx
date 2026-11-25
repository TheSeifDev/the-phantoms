"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Link2, Mail } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Fade, Reveal } from "@/components/ui";
import { HexAvatar, HexOutline } from "@/components/ui/Hex";
import { members, squads } from "@/data/projects";
import { site } from "@/data/site";

/** Artfolio-style glass-card carousel: centre card glows, sides recede in 3D. */
export function Team({ photos = {}, heading = true }: { photos?: Record<string, string>; heading?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const cards = useRef<HTMLElement[]>([]);
  const idxRef = useRef(0);
  const N = members.length;

  const layout = useCallback((instant = false) => {
    const cw = window.innerWidth < 640 ? 272 : 322;
    cards.current.forEach((c, i) => {
      if (!c) return;
      const d = i - idxRef.current;
      const a = Math.abs(d);
      gsap.to(c, {
        x: d * cw * 0.84 + Math.sign(d) * (a ? cw * 0.18 : 0),
        scale: a === 0 ? 1 : Math.max(0.58, 0.88 - (a - 1) * 0.12),
        rotateY: -d * 9,
        opacity: a === 0 ? 1 : Math.max(0, 0.62 - (a - 1) * 0.26),
        zIndex: 20 - a,
        filter: a === 0 ? "blur(0px)" : `blur(${Math.min(a, 3) * 0.8}px)`,
        duration: instant || prefersReducedMotion() ? 0 : 0.95,
        ease: "expo.out",
        overwrite: "auto",
      });
    });
  }, []);

  const go = useCallback(
    (to: number) => {
      const n = Math.max(0, Math.min(N - 1, to));
      idxRef.current = n;
      setIdx(n);
      layout();
    },
    [N, layout],
  );

  useEffect(() => {
    layout(true);
    const on = () => layout(true);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, [layout]);

  // drag / swipe + keyboard
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let sx = 0;
    let down = false;
    let moved = false;
    const pd = (e: PointerEvent) => {
      down = true;
      moved = false;
      sx = e.clientX;
    };
    const pm = (e: PointerEvent) => {
      if (down && Math.abs(e.clientX - sx) > 6) moved = true;
    };
    const pu = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 50) go(idxRef.current + (dx < 0 ? 1 : -1));
    };
    const click = (e: Event) => {
      if (moved) e.stopPropagation();
    };
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    el.addEventListener("click", click, true);
    const key = (e: KeyboardEvent) => {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight || r.bottom < 0) return;
      if (e.key === "ArrowRight") go(idxRef.current + 1);
      if (e.key === "ArrowLeft") go(idxRef.current - 1);
    };
    window.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
      el.removeEventListener("click", click, true);
      window.removeEventListener("keydown", key);
    };
  }, [go]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-tstage]", {
        y: 120,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-tstage]", start: "top 88%", once: true },
      });
      gsap.to("[data-tglow]", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="team" data-section="Team" className="relative overflow-hidden sec-pad">
      <div data-tglow aria-hidden className="blob-glow left-1/2 top-[34%] h-[30rem] w-[44rem] -translate-x-1/2" style={{ background: "radial-gradient(closest-side, rgba(255,36,24,.20), transparent)" }} />
      <div className="wrap relative">
        {heading && (
          <div className="mx-auto max-w-3xl text-center">
            <span className="mono inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.18em] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-red" /> Our team
            </span>
            <Reveal as="h2" className="font-display tight mt-7 text-[clamp(2.4rem,6vw,5.4rem)] font-bold [line-height:1]">
              We have the best <span className="serif-i text-fg/45">builders</span> in this world
            </Reveal>
            <Fade delay={0.2}>
              <p className="ar mt-4 text-xl font-semibold">ناس بتبني بجد.</p>
            </Fade>
          </div>
        )}

        <div data-tstage className="relative mx-auto mt-14 h-[31rem] max-w-6xl select-none [perspective:1400px] sm:h-[33rem]" ref={stage}>
          {members.map((m, i) => {
            const photo = photos[m.slug];
            const center = i === idx;
            return (
              <article
                key={m.slug}
                ref={(el) => {
                  if (el) cards.current[i] = el;
                }}
                onClick={() => !center && go(i)}
                className={`absolute left-1/2 top-0 -ml-[136px] w-[272px] sm:-ml-[161px] sm:w-[322px] ${center ? "" : "cursor-pointer"}`}
                style={{ transformStyle: "preserve-3d" }}
                data-cursor={center ? undefined : "VIEW"}
              >
                <div
                  className={`relative overflow-hidden rounded-[2rem] border p-6 backdrop-blur-xl transition-[box-shadow,border-color] duration-700 ${
                    center
                      ? "border-red/60 shadow-[0_0_90px_-12px_rgba(255,36,24,.55),inset_0_1px_0_rgba(255,255,255,.12)]"
                      : "border-line"
                  }`}
                  style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--surface) 92%, transparent), color-mix(in srgb, var(--bg) 80%, transparent))" }}
                >
                  <div aria-hidden className="absolute inset-x-0 top-0 h-40" style={{ background: center ? "radial-gradient(60% 100% at 50% 0%, rgba(255,36,24,.28), transparent)" : "radial-gradient(60% 100% at 50% 0%, rgba(255,255,255,.06), transparent)" }} />
                  <div aria-hidden className="absolute -bottom-12 -right-10 text-fg/[0.06]">
                    <HexOutline size={190} />
                  </div>
                  {/* social buttons */}
                  <div className="relative flex gap-2">
                    {[
                      { icon: Link2, href: m.link ?? site.github, label: "Link" },
                      { icon: Mail, href: `mailto:${site.email}`, label: "Email" },
                    ].map(({ icon: Ic, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        aria-label={`${m.name} — ${label}`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg/40 text-fg/80 transition-colors hover:border-red hover:bg-red hover:text-white"
                      >
                        <Ic size={14} />
                      </a>
                    ))}
                    {m.lead && <span className="mono ml-auto self-center rounded-full bg-red px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-wider text-white">Lead</span>}
                  </div>

                  <div className="relative mt-3 flex flex-col items-center text-center">
                    <div className={`relative ${center ? "drop-shadow-[0_0_28px_rgba(255,36,24,.55)]" : ""}`}>
                      <HexAvatar src={photo} name={m.name} size={108} tone={m.lead ? "red" : "dark"} />
                    </div>
                    <h3 className="font-display mt-5 text-[1.6rem] font-extrabold leading-none tracking-[-0.05em]">{m.name}</h3>
                    <div className="mono mt-1.5 text-[0.72rem] text-muted">{m.handle}</div>
                    <p className="mt-4 min-h-[4.2rem] text-[0.82rem] leading-relaxed text-muted">{m.bio}</p>
                    <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                      <span className="rounded-full border border-line bg-bg/40 px-3 py-1.5 text-[0.65rem] font-bold">{m.role}</span>
                      <span className="rounded-full border border-red/40 bg-red/10 px-3 py-1.5 text-[0.65rem] font-bold text-red">{m.squad}</span>
                    </div>
                    {m.placeholder && <div className="mono mt-4 text-[0.58rem] uppercase tracking-[0.16em] text-muted/70">Photo coming soon</div>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Previous member"
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors hover:border-red hover:bg-red hover:text-white disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-fg"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-1.5">
            {members.map((m, i) => (
              <button
                key={m.slug}
                type="button"
                aria-label={`Show ${m.name}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === idx ? "w-8 bg-red" : "w-1.5 bg-fg/25 hover:bg-fg/50"}`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next member"
            onClick={() => go(idx + 1)}
            disabled={idx === N - 1}
            className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors hover:border-red hover:bg-red hover:text-white disabled:opacity-30 disabled:hover:border-line disabled:hover:bg-transparent disabled:hover:text-fg"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

/** Squad cards (used on /team) */
export function Squads() {
  return (
    <section data-section="Squads" className="relative pb-24">
      <div className="wrap">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {squads.map((s, i) => {
            return (
              <Fade key={s.name} delay={i * 0.05} y={30}>
                <div data-spot data-tilt="3" className="card group relative h-full overflow-hidden p-7">
                  <div aria-hidden className="absolute -right-8 -top-8 text-red/25 transition-transform duration-700 group-hover:rotate-[30deg] group-hover:scale-110">
                    <HexOutline size={130} />
                  </div>
                  <div className="mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">Squad 0{i + 1}</div>
                  <h3 className="font-display mt-8 text-4xl font-extrabold tracking-[-0.06em]">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted">{s.note}</p>
                </div>
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
