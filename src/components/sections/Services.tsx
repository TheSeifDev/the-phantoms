"use client";
import { useRef } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Button, Fade, Label, Reveal } from "@/components/ui";
import { HexOutline } from "@/components/ui/Hex";
import { services } from "@/data/projects";

/* tiny UI mock-ups, one per service */
function WebMock() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d11] shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="mono ml-3 flex-1 rounded-md bg-white/5 px-3 py-1 text-[0.62rem] text-white/50">yourbrand.com</span>
      </div>
      <div className="relative p-5">
        <div className="h-3 w-24 rounded bg-white/15" />
        <div className="mt-4 h-8 w-4/5 rounded bg-white/90" />
        <div className="mt-2 h-8 w-3/5 rounded bg-white/35" />
        <div className="mt-5 flex gap-2">
          <span className="h-8 w-24 rounded-full bg-red" />
          <span className="h-8 w-20 rounded-full border border-white/20" />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-white/[0.06] p-2">
              <div className="h-full rounded-lg bg-gradient-to-br from-red/40 to-transparent" style={{ opacity: 0.4 + i * 0.25 }} />
            </div>
          ))}
        </div>
        <HexOutline size={90} className="absolute -right-4 top-6 text-red/50" />
      </div>
    </div>
  );
}
function AppMock() {
  return (
    <div className="mx-auto w-[11.5rem] rounded-[2rem] border border-white/15 bg-[#0d0d11] p-2 shadow-2xl">
      <div className="rounded-[1.5rem] bg-[#15151a] p-3.5">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/15" />
        <div className="flex items-center gap-2">
          <span className="hex h-8 w-8 bg-red" />
          <div className="space-y-1">
            <div className="h-2 w-16 rounded bg-white/70" />
            <div className="h-1.5 w-10 rounded bg-white/25" />
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-red p-3">
          <div className="h-2 w-12 rounded bg-white/70" />
          <div className="mt-2 h-6 w-20 rounded bg-white" />
          <div className="mt-3 flex items-end gap-1">
            {[40, 70, 50, 90, 60, 80].map((h, i) => (
              <span key={i} className="w-full rounded-sm bg-white/70" style={{ height: h / 4 }} />
            ))}
          </div>
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="mt-2 flex items-center gap-2 rounded-xl bg-white/[0.05] p-2">
            <span className="h-6 w-6 rounded-lg bg-white/15" />
            <div className="h-1.5 flex-1 rounded bg-white/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
function SaasMock() {
  return (
    <div className="grid w-full grid-cols-[3.2rem_1fr] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d11] shadow-2xl">
      <div className="flex flex-col items-center gap-3 border-r border-white/10 py-4">
        <span className="hex h-6 w-6 bg-red" />
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-5 w-5 rounded-md ${i === 0 ? "bg-white/70" : "bg-white/15"}`} />
        ))}
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {["MRR", "Users", "Uptime"].map((k, i) => (
            <div key={k} className="rounded-xl bg-white/[0.05] p-2.5">
              <div className="mono text-[0.55rem] uppercase text-white/45">{k}</div>
              <div className="font-display mt-1 text-lg font-extrabold">{["$48k", "2.9k", "99.9%"][i]}</div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 300 100" className="mt-3 h-24 w-full">
          <defs>
            <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ff2418" stopOpacity=".5" />
              <stop offset="1" stopColor="#ff2418" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 80 C40 70 50 40 90 50 S150 80 190 40 S260 20 300 10 L300 100 L0 100Z" fill="url(#sg)" />
          <path d="M0 80 C40 70 50 40 90 50 S150 80 190 40 S260 20 300 10" fill="none" stroke="#ff2418" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
const mocks = [WebMock, AppMock, SaasMock];

export function Services({ heading = true }: { heading?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-scard]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (next) {
          gsap.to(card, {
            scale: 0.93,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 80%", end: "top 14%", scrub: true },
          });
        }
        // mock parallax inside
        gsap.fromTo(
          card.querySelector("[data-mock]"),
          { y: 60, rotate: i % 2 ? 4 : -4 },
          { y: -30, rotate: 0, ease: "none", scrollTrigger: { trigger: card, start: "top 90%", end: "bottom 20%", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" data-section="Services" className="inv relative rounded-[2.5rem] sec-pad sm:rounded-[4rem]">
      <div className="wrap">
        {heading && (
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Label>What we build</Label>
              <Reveal as="h2" className="font-display tight mt-6 text-[clamp(2.6rem,6.4vw,5.8rem)] font-extrabold">
                Web. Apps. <span className="serif-i text-red">SaaS.</span>
              </Reveal>
              <p className="ar mt-3 text-xl font-semibold">بنبني اللي بيشتغل — وبيتحب.</p>
            </div>
            <Fade className="max-w-sm text-[0.95rem] leading-relaxed muted">
              Three ways to work with us. One team that designs, engineers and ships all of them.
            </Fade>
          </div>
        )}

        <div className="relative">
          {services.map((s, i) => {
            const Mock = mocks[i];
            return (
              <article
                key={s.n}
                data-scard
                data-spot
                className="sticky mb-6 overflow-hidden rounded-[2.2rem] bg-[#0a0a0c] p-7 text-white will-change-transform sm:p-10 lg:mb-10"
                style={{ top: `${6 + i * 1.6}rem` }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-20 -top-24 h-96 w-96 rounded-full opacity-50 blur-3xl"
                  style={{ background: `radial-gradient(circle, ${s.hue[0]}66, transparent 65%)` }}
                />
                <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <div className="mono flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.18em] text-white/50">
                      <span className="text-red">{s.n}</span>
                      <span className="h-px w-10 bg-white/20" />
                      {s.stack.join(" · ")}
                    </div>
                    <h3 className="font-display tight mt-5 text-[clamp(3.4rem,9vw,8rem)] font-extrabold">{s.title}</h3>
                    <p className="ar mt-1 text-xl font-semibold text-white/80">{s.ar}</p>
                    <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/60">{s.line}</p>
                    <ul className="mt-6 grid max-w-lg gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {s.items.map((it) => (
                        <li key={it} className="flex items-start gap-2.5 text-sm text-white/80">
                          <Check size={15} className="mt-0.5 shrink-0 text-red" />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button href="/contact" variant="red" cursor="START">
                        Start a {s.title === "Apps" ? "app" : s.title.toLowerCase()} project
                      </Button>
                    </div>
                  </div>
                  <div data-mock className="relative mx-auto w-full max-w-md">
                    <Mock />
                    <span className="mono absolute -bottom-3 -right-2 inline-flex items-center gap-1 rounded-full bg-red px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-wider text-white">
                      {s.title} <ArrowUpRight size={11} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
