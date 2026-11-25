import { ArrowUpRight, Check, Clock3, Layers3, UsersRound } from "lucide-react";
import { Button, Label, Reveal } from "@/components/ui";
import { services } from "@/data/projects";

const details = {
  Web: {
    promise: "Make the first click feel inevitable.",
    deliverables: ["Positioning and page architecture", "Responsive UI system with motion", "CMS, forms and analytics handoff", "SEO, accessibility and performance pass"],
    timeline: "4–8 weeks depending on surface area",
    fit: "Teams launching a brand, campaign, platform or content-heavy site.",
    visual: "from-red/25 via-red/5 to-transparent",
    accent: "bg-red",
  },
  App: {
    promise: "Put the product in people’s hands.",
    deliverables: ["User flows and interaction prototypes", "React Native or Electron build", "Offline states and sync strategy", "Store-ready QA and release support"],
    timeline: "8–14 weeks for a focused first release",
    fit: "Founders and operators who need a mobile or desktop workflow that survives real life.",
    visual: "from-orange-500/25 via-red/5 to-transparent",
    accent: "bg-orange-400",
  },
  SaaS: {
    promise: "Turn a repeatable workflow into a product.",
    deliverables: ["Multi-tenant product architecture", "Auth, roles and operational dashboards", "Billing-ready data and API boundaries", "AI, integrations and observability foundations"],
    timeline: "10–18 weeks for an MVP with a durable core",
    fit: "Product teams building a B2B tool, internal platform or AI-enabled service.",
    visual: "from-rose-700/30 via-red/5 to-transparent",
    accent: "bg-rose-700",
  },
} as const;

const engagements = [
  { title: "Fixed-scope project", note: "A defined brief, milestones and handoff. Best when the outcome is clear and you want a focused delivery team.", icon: Layers3 },
  { title: "Dedicated squad", note: "A small product pod that stays close to your team across design, engineering and iteration as priorities evolve.", icon: UsersRound },
  { title: "MVP sprint", note: "A compressed path from a sharp hypothesis to a tested, clickable first release — without pretending the unknowns do not exist.", icon: Clock3 },
];

const compactProcess = [
  ["01", "Frame", "Align on the audience, the constraint and the smallest useful outcome."],
  ["02", "Shape", "Turn the brief into flows, architecture and a visual direction you can react to."],
  ["03", "Ship", "Build in visible increments with a weekly rhythm and direct access to the team."],
  ["04", "Compound", "Launch, measure and keep improving the parts that create momentum."],
];

function ServiceVisual({ index, title, accent, visual }: { index: string; title: string; accent: string; visual: string }) {
  return (
    <div className={`relative min-h-[22rem] overflow-hidden rounded-[2.2rem] border border-line bg-gradient-to-br ${visual} p-5 shadow-[0_25px_80px_rgba(255,36,24,.08)] sm:min-h-[28rem] sm:p-8`}>
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-red/10 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between"><span className="mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">Offer / {index}</span><span className={`h-3 w-3 rounded-full ${accent} shadow-[0_0_18px_rgba(255,36,24,.7)]`} /></div>
        <div>
          <div className="mb-8 flex items-end gap-2 sm:mb-12"><span className="font-display text-[clamp(5rem,14vw,10rem)] font-extralight leading-[.7] tracking-[-.12em] text-fg/90">{index}</span><span className="mono pb-2 text-xs uppercase tracking-[.18em] text-muted">service lane</span></div>
          <div className="rounded-[1.4rem] border border-line bg-bg/55 p-4 backdrop-blur-xl sm:p-5"><div className="flex items-center justify-between"><span className="font-display text-xl font-bold">{title}</span><ArrowUpRight size={18} className="text-red" /></div><div className="mt-4 h-1.5 w-2/3 rounded-full bg-fg/70" /><div className="mt-2 h-1.5 w-1/2 rounded-full bg-muted/40" /><div className="mt-6 flex gap-2"><span className="h-8 flex-1 rounded-lg bg-red/80" /><span className="h-8 w-1/4 rounded-lg bg-fg/10" /><span className="h-8 w-1/5 rounded-lg bg-fg/10" /></div></div>
        </div>
      </div>
    </div>
  );
}

export function ServicesPageContent() {
  return (
    <div className="relative overflow-hidden pb-8">
      <div aria-hidden className="aura right-[-14rem] top-[18%] h-[34rem] w-[34rem] opacity-15" />
      <div className="wrap relative">
        <div className="mb-14 flex flex-col justify-between gap-5 border-y border-line py-5 sm:mb-20 sm:flex-row sm:items-end"><div><Label>Choose your lane</Label><p className="mt-3 max-w-md text-sm leading-relaxed text-muted">Every engagement is shaped around a real outcome, a clear owner and enough room to make the product good.</p></div><span className="mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">01 / 03 offers</span></div>

        <div className="space-y-20 sm:space-y-28">
          {services.map((service, index) => {
            const info = details[service.key as keyof typeof details];
            const reverse = index % 2 === 1;
            return (
              <article key={service.key} className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
                <div className={reverse ? "lg:order-2 lg:sticky lg:top-28" : "lg:sticky lg:top-28"}><ServiceVisual index={service.n} title={service.title} accent={info.accent} visual={info.visual} /></div>
                <div className={reverse ? "lg:order-1" : ""}>
                  <div className="mono text-[0.66rem] uppercase tracking-[0.18em] text-red">{service.n} / {service.stack.join(" · ")}</div>
                  <Reveal as="h2" className="font-display tight mt-4 text-[clamp(3rem,6vw,6.5rem)] font-extrabold">{service.title}</Reveal>
                  <p className="ar mt-2 text-xl font-semibold text-muted">{service.ar}</p>
                  <p className="mt-6 max-w-xl text-xl leading-relaxed text-fg/80">{info.promise}</p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">{service.line}</p>
                  <div className="mt-9 rounded-[1.5rem] border border-line bg-card/60 p-5 sm:p-6"><h3 className="font-display text-lg font-bold">What you get</h3><ul className="mt-4 grid gap-3">{info.deliverables.map((item) => <li key={item} className="flex items-start gap-3 text-sm text-muted"><Check size={16} className="mt-0.5 shrink-0 text-red" />{item}</li>)}</ul></div>
                  <dl className="mt-6 grid gap-4 border-y border-line py-5 sm:grid-cols-2"><div><dt className="mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">Typical timeline</dt><dd className="mt-2 text-sm font-semibold">{info.timeline}</dd></div><div><dt className="mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">Who it’s for</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{info.fit}</dd></div></dl>
                  <div className="mt-7 flex flex-wrap items-center gap-4"><Button href={`/contact?type=${service.key === "App" ? "app" : service.key.toLowerCase()}`} variant="red">Talk about {service.title}</Button><span className="mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">No bloated handoff</span></div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-24 border-t border-line pt-14 sm:mt-36 sm:pt-20"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><Label>Engagement models</Label><h2 className="font-display tight mt-5 max-w-md text-[clamp(2.8rem,5vw,5rem)] font-extrabold">Choose the <span className="serif-i glow-red">shape</span> of the work.</h2></div><div className="grid gap-4 sm:grid-cols-3">{engagements.map(({ title, note, icon: Icon }) => <article key={title} className="glow-card rounded-[1.5rem] p-5"><Icon size={20} className="text-red" /><h3 className="mt-10 font-display text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{note}</p></article>)}</div></div></section>

        <section className="mt-24 border-t border-line pt-14 sm:mt-36 sm:pt-20"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><Label>Our rhythm</Label><h2 className="font-display tight mt-5 max-w-md text-[clamp(2.8rem,5vw,5rem)] font-extrabold">Small steps. <span className="serif-i glow-red">Visible</span> progress.</h2></div><ol className="border-l border-line">{compactProcess.map(([n, title, note]) => <li key={n} className="relative border-b border-line py-5 pl-7 first:pt-0 last:border-b-0"><span className="glow-dot absolute -left-[5px] top-7 h-2 w-2 first:top-1" /><span className="mono text-[0.62rem] text-red">{n}</span><h3 className="mt-1 font-display text-xl font-bold">{title}</h3><p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{note}</p></li>)}</ol></div></section>
      </div>
    </div>
  );
}
