"use client";

import { useRef, useState, type ReactNode } from "react";
import { Activity, ArrowLeft, ArrowRight, Check, Code2, MousePointer2, Sparkles, TrendingUp } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Button, Label, Reveal } from "@/components/ui";
import { services } from "@/data/projects";

type ServiceKey = "Web" | "App" | "SaaS";

function WebMock() {
  return (
    <div data-service-mock className="relative overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#101014] shadow-[0_30px_90px_rgba(0,0,0,.45)]">
      <div className="service-assemble flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff2418]" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="mono ml-3 flex-1 rounded-md bg-white/[0.06] px-3 py-1.5 text-[0.58rem] text-white/45">phantoms.studio / launch</span>
      </div>
      <div className="relative min-h-[clamp(15rem,32vh,19rem)] overflow-hidden p-5 sm:p-7">
        <div className="aura -right-20 -top-24 h-56 w-56 opacity-50" />
        <div className="service-assemble relative flex items-center justify-between text-[0.57rem] font-bold uppercase tracking-[0.18em] text-white/45">
          <span className="flex items-center gap-2"><span className="h-5 w-5 rounded-md bg-[#ff2418] shadow-[0_0_20px_rgba(255,36,24,.55)]" />PHANTOMS</span>
          <span className="hidden gap-4 sm:flex"><i>Work</i><i>Services</i><i>Contact</i></span>
          <span className="h-6 w-14 rounded-full border border-white/20" />
        </div>
        <div className="service-assemble mt-8 max-w-[22rem] sm:mt-12">
          <div className="h-2.5 w-20 rounded-full bg-[#ff2418]/70 shadow-[0_0_18px_rgba(255,36,24,.45)]" />
          <div className="mt-4 h-8 w-full rounded-lg bg-white/90 sm:h-9" />
          <div className="mt-2 h-8 w-[78%] rounded-lg bg-white/25 sm:h-9" />
          <p className="mono mt-4 max-w-xs text-[0.56rem] leading-relaxed text-white/40 sm:mt-5">A product surface that makes the next move feel obvious.</p>
          <div className="mt-5 flex gap-2 sm:mt-6"><span className="h-8 w-24 rounded-full bg-[#ff2418] shadow-[0_0_25px_rgba(255,36,24,.4)]" /><span className="h-8 w-20 rounded-full border border-white/20" /></div>
        </div>
        <div className="service-assemble absolute bottom-7 right-6 flex w-[42%] gap-2 sm:right-8">
          {["w-1/2", "w-1/3", "w-1/4"].map((width, index) => <span key={width} className={`h-16 rounded-xl bg-gradient-to-br ${index === 0 ? "from-[#ff2418]/70" : "from-white/20"} to-transparent sm:h-20 ${width}`} />)}
        </div>
        <MousePointer2 className="service-assemble absolute bottom-10 right-[35%] rotate-[-18deg] text-[#ff2418] drop-shadow-[0_0_10px_rgba(255,36,24,.8)]" size={20} />
      </div>
    </div>
  );
}

function AppMock() {
  return (
    <div data-service-mock className="relative mx-auto w-[clamp(11.5rem,22vw,15rem)] rounded-[2.35rem] border border-white/20 bg-[#0c0c10] p-2 shadow-[0_30px_90px_rgba(0,0,0,.6)]">
      <div className="service-assemble absolute -inset-5 -z-10 rounded-[3rem] bg-[#ff5e26]/20 blur-2xl" />
      <div className="overflow-hidden rounded-[1.85rem] bg-[#17171d] p-3.5">
        <div className="service-assemble mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/20" />
        <div className="service-assemble flex items-center justify-between"><span className="h-8 w-8 rounded-xl bg-[#ff5e26] shadow-[0_0_20px_rgba(255,94,38,.45)]" /><span className="h-2 w-12 rounded-full bg-white/25" /></div>
        <div className="service-assemble mt-5 rounded-[1.35rem] bg-gradient-to-br from-[#ff5e26] to-[#b50000] p-4 shadow-[0_12px_30px_rgba(255,36,24,.2)]">
          <div className="h-2 w-14 rounded-full bg-white/70" /><div className="mt-3 h-7 w-24 rounded-lg bg-white/90" />
          <div className="mt-4 flex h-12 items-end gap-1">{[28, 40, 24, 46, 34, 52, 42].map((height, index) => <span key={index} className="w-full rounded-t-sm bg-white/65" style={{ height }} />)}</div>
        </div>
        <div className="service-assemble mt-4 flex items-center justify-between"><span className="h-2 w-20 rounded-full bg-white/35" /><span className="h-5 w-5 rounded-full bg-white/15" /></div>
        {["Today’s focus", "Offline queue", "Team pulse"].map((label, index) => <div key={label} className="service-assemble mt-2 flex items-center gap-2 rounded-xl bg-white/[0.05] p-2.5"><span className={`h-7 w-7 rounded-lg ${index === 1 ? "bg-[#ff5e26]/35" : "bg-white/10"}`} /><span className="flex-1"><span className="block h-1.5 w-20 rounded-full bg-white/25" /><span className="mt-1.5 block h-1 w-12 rounded-full bg-white/10" /></span></div>)}
      </div>
    </div>
  );
}

function SaasMock() {
  return (
    <div data-service-mock className="relative overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#101014] shadow-[0_30px_90px_rgba(0,0,0,.45)]">
      <div className="service-assemble grid min-h-[clamp(15rem,32vh,19rem)] grid-cols-[3.4rem_1fr]">
        <aside className="flex flex-col items-center gap-4 border-r border-white/10 py-5"><span className="h-7 w-7 rounded-lg bg-[#d4001a] shadow-[0_0_22px_rgba(212,0,26,.55)]" />{[0, 1, 2, 3, 4].map((item) => <span key={item} className={`h-6 w-6 rounded-lg ${item === 0 ? "bg-white/80" : "bg-white/[0.08]"}`} />)}</aside>
        <div className="relative p-5 sm:p-7">
          <div className="aura -right-20 -top-24 h-60 w-60 opacity-45" />
          <div className="service-assemble flex items-center justify-between"><div><div className="h-2 w-20 rounded-full bg-white/35" /><div className="mt-2 h-5 w-36 rounded bg-white/85" /></div><span className="h-8 w-8 rounded-full bg-white/10" /></div>
          <div className="service-assemble mt-6 grid grid-cols-3 gap-2">{[["MRR", "$48k"], ["Users", "2.9k"], ["Uptime", "99.9%"]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.08] bg-white/[0.045] p-3"><div className="mono text-[0.5rem] uppercase tracking-wider text-white/40">{label}</div><div className="service-kpi font-display mt-2 text-xl font-extrabold text-white">{value}</div></div>)}</div>
          <div className="service-assemble mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
            <div className="mb-2 flex justify-between"><span className="mono text-[0.52rem] uppercase tracking-wider text-white/40">Activation trend</span><TrendingUp size={14} className="text-[#d4001a]" /></div>
            <div className="relative h-20 overflow-hidden sm:h-24"><div className="absolute inset-x-0 bottom-0 h-px bg-white/10" /><svg viewBox="0 0 300 100" className="h-full w-full" aria-hidden><defs><linearGradient id="serviceChart" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d4001a" stopOpacity=".55" /><stop offset="1" stopColor="#d4001a" stopOpacity="0" /></linearGradient></defs><path d="M0 80 C40 70 50 40 90 50 S150 80 190 40 S260 20 300 10 L300 100 L0 100Z" fill="url(#serviceChart)" /><path className="service-chart" d="M0 80 C40 70 50 40 90 50 S150 80 190 40 S260 20 300 10" fill="none" stroke="#d4001a" strokeWidth="2.5" /></svg></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mocks: Record<ServiceKey, () => ReactNode> = { Web: WebMock, App: AppMock, SaaS: SaasMock };
const serviceHref = (key: ServiceKey) => `/contact?type=${key === "App" ? "app" : key.toLowerCase()}`;

function ServiceCopy({ index, mobile = false }: { index: number; mobile?: boolean }) {
  const service = services[index];
  return (
    <div className={mobile ? "" : "max-w-md"}>
      <div className="mono flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-white/45"><span className="text-[#ff2418]">{service.n}</span><span className="h-px w-8 bg-white/20" />{service.stack.join(" · ")}</div>
      <h3 className="font-display tight mt-4 text-[clamp(3rem,7vw,6.2rem)] font-extrabold text-white">{service.title}</h3>
      <p className="ar mt-2 text-base font-semibold text-white/70">{service.ar}</p>
      <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-[0.92rem]">{service.line}</p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {service.items.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm text-white/75"><Check size={15} className="mt-0.5 shrink-0 text-[#ff2418]" />{item}</li>)}
      </ul>
      <div className="mt-6"><Button href={serviceHref(service.key as ServiceKey)} variant="red">Start a {service.title === "Apps" ? "app" : service.title.toLowerCase()} project</Button></div>
    </div>
  );
}

export function Services({ heading = true }: { heading?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const selectService = (index: number) => {
    const next = Math.max(0, Math.min(services.length - 1, index));
    activeRef.current = next;
    setActive(next);
  };

  useGSAP(() => {
    const pinShell = shell.current;
    if (!pinShell) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const trigger = ScrollTrigger.create({
        id: "services-pin",
        trigger: pinShell,
        pin: pinShell,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.25}`,
        scrub: prefersReducedMotion() ? false : 0.75,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(services.length - 1, Math.floor(self.progress * services.length));
          if (next !== activeRef.current) {
            activeRef.current = next;
            setActive(next);
          }
        },
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, { scope: root });

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const activeStage = stage.current?.querySelector<HTMLElement>("[data-service-active]");
    if (!activeStage) return;
    const assembly = activeStage.querySelectorAll(".service-assemble");
    const timeline = gsap.timeline();
    timeline.fromTo(activeStage, { opacity: 0, y: -18, scale: 0.97, rotateX: -4 }, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.7, ease: "expo.out" });
    timeline.fromTo(assembly, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.055, ease: "power3.out" }, "-=0.42");
    timeline.fromTo(activeStage.querySelectorAll(".service-kpi"), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.08 }, "-=0.3");
    const chart = activeStage.querySelector<SVGPathElement>(".service-chart");
    if (chart) {
      const length = chart.getTotalLength();
      gsap.set(chart, { strokeDasharray: length, strokeDashoffset: length });
      timeline.to(chart, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" }, "-=0.25");
    }
  }, { scope: root, dependencies: [active] });

  return (
    <section ref={root} id="services" data-section="Services" className="grain-s relative overflow-hidden bg-[#09090c] text-white">
      <div aria-hidden className="aura left-[8%] top-[12%] h-[28rem] w-[28rem] opacity-35" />
      <div aria-hidden className="aura bottom-[-10rem] right-[-8rem] h-[34rem] w-[34rem] opacity-20" />

      {heading && (
        <div className="wrap relative py-[clamp(4.5rem,9vw,7rem)]">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <Label className="text-white/45">04 — What we build</Label>
              <Reveal as="h2" className="font-display tight mt-5 max-w-4xl text-[clamp(3.2rem,7vw,6.8rem)] font-extrabold text-white">Web. Apps. <span className="serif-i glow-red">SaaS.</span></Reveal>
              <p className="ar mt-3 text-lg font-semibold text-white/55">بنبني اللي بيشتغل — وبيتحب.</p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/45">Three ways to work with us. One team that designs, engineers and ships all of them.</p>
          </div>
        </div>
      )}

      <div ref={shell} className="relative hidden h-[100svh] overflow-hidden pt-[clamp(5.5rem,9vh,6.5rem)] pb-[clamp(1rem,3vh,2rem)] md:block">
        <div className="wrap flex h-full items-center">
          <div className="flex max-h-full min-h-0 w-full flex-col justify-center gap-[clamp(.75rem,2vh,1.4rem)]">
            <div className="flex items-center justify-between gap-6 border-y border-white/10 py-3">
              <div className="flex items-center gap-1">{services.map((service, index) => <button key={service.key} type="button" data-service-tab onClick={() => selectService(index)} className={`group flex items-center gap-2 rounded-full px-3 py-1.5 text-left transition-all ${active === index ? "bg-white text-[#09090c]" : "text-white/45 hover:text-white"}`}><span className="mono text-[0.56rem]">{service.n}</span><span className="font-display text-base font-bold tracking-[-0.04em]">{service.title}</span></button>)}</div>
              <div className="hidden items-center gap-3 text-white/35 sm:flex"><Code2 size={14} /><span className="mono text-[0.58rem] uppercase tracking-[0.18em]">Product systems / {String(active + 1).padStart(2, "0")}</span></div>
            </div>

            <div className="grid min-h-0 items-center gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(20rem,1fr)] lg:gap-12">
              <div key={active} className="relative" data-service-active-copy><ServiceCopy index={active} /></div>
              <div ref={stage} data-tilt="6" className="relative min-h-0 perspective-[900px]"><div className="absolute left-1/2 top-1/2 h-[clamp(13rem,32vh,18rem)] w-[clamp(13rem,32vh,18rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff2418]/20 blur-[80px]" /><div key={active} data-service-active className="edge-glow relative mx-auto max-w-[39rem] rounded-[1.7rem] p-px"><div className="rounded-[1.7rem] bg-[#0c0c10] p-2 sm:p-3">{(() => { const Mock = mocks[services[active].key as ServiceKey]; return <Mock />; })()}</div></div><div className="mono absolute -bottom-4 right-2 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.16em] text-white/55 backdrop-blur-xl"><Activity size={12} className="text-[#ff2418]" />Live interface / {services[active].title}</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap space-y-5 py-8 md:hidden">
        {services.map((service, index) => { const Mock = mocks[service.key as ServiceKey]; return <article key={service.key} className="glow-card overflow-hidden rounded-[1.8rem] border-white/10 bg-white/[0.035] p-5"><div className="mb-5 flex items-center justify-between"><span className="mono text-[0.6rem] uppercase tracking-[0.18em] text-white/45">{service.n} / {service.key}</span><Sparkles size={15} className="text-[#ff2418]" /></div><div className="mb-6"><Mock /></div><ServiceCopy index={index} mobile /></article>; })}
      </div>

      <div className="wrap flex items-center justify-between border-t border-white/10 py-5 text-white/35 md:hidden"><button type="button" onClick={() => selectService(active - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15"><ArrowLeft size={15} /></button><span className="mono text-[0.6rem] uppercase tracking-[0.18em]">Swipe / choose a lane</span><button type="button" onClick={() => selectService(active + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15"><ArrowRight size={15} /></button></div>
    </section>
  );
}
