import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Bell, Brain, HeartHandshake, LockKeyhole, MessageCircle, ShieldAlert, WifiOff } from "lucide-react";
import { RafiqStage } from "@/components/sections/RafiqStage";
import { CTA } from "@/components/sections/CTA";
import { getProject } from "@/data/projects";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "RAFIQ",
  description: "RAFIQ — a local-first Arabic AI companion for people living with memory loss.",
};

const capabilities = [
  { n: "01", icon: HeartHandshake, title: "Companionship", ar: "رفقة هادية", body: "A patient Arabic voice that keeps one question at a time, repeats without annoyance and never makes anyone feel small for forgetting." },
  { n: "02", icon: Brain, title: "Approved memory support", ar: "ذاكرة بموافقتك", body: "Families add names, relationships, routines and favourite places. RAFIQ recalls what is approved and says when it does not know." },
  { n: "03", icon: Bell, title: "Daily care & reminders", ar: "تذكير في وقته", body: "Medication, appointments and routines arrive softly on time. Every delivery is logged, never confused with confirmation." },
  { n: "04", icon: MessageCircle, title: "Caregiver connectivity", ar: "العيلة قريبة", body: "A companion app and dashboard give family and caregivers one accurate picture of reminders, events and service status." },
  { n: "05", icon: ShieldAlert, title: "User-triggered SOS", ar: "زر للمساعدة", body: "One press starts a defined contact workflow. RAFIQ reports every attempt honestly and never claims help has arrived." },
];

const pipeline = [
  ["Wake word", "on-device", "A dedicated phrase starts a session."],
  ["Listen", "on-device", "Voice activity waits for the sentence to finish."],
  ["Understand", "local model", "Arabic speech becomes intent."],
  ["Recall", "local database", "Only relevant approved context is retrieved."],
  ["Answer", "local model", "A short, calm Arabic reply is spoken."],
  ["Sync", "encrypted", "Events and changes reach the caregiver app."],
];

const scenes = [
  { src: "/rafiq/scene-home.jpg", label: "At home", title: "A familiar presence in the room", className: "aspect-[1.35]" },
  { src: "/rafiq/scene-caregiver.jpg", label: "For caregivers", title: "One view for everyone who cares", className: "aspect-[.8]" },
  { src: "/rafiq/scene-visor.jpg", label: "The interface", title: "Attention without a screen full of noise", className: "aspect-[.8]" },
];

export default function RafiqPage() {
  const project = getProject("rafiq");
  if (!project) return null;

  return (
    <main className="overflow-hidden bg-[#fbfcff] text-[#070b1d]">
      <section id="rafiq-hero" data-section="RAFIQ" className="relative isolate overflow-hidden bg-[radial-gradient(70%_65%_at_80%_10%,#d9e7ff_0%,transparent_65%),linear-gradient(180deg,#fbfcff_0%,#edf4ff_100%)] pb-24 pt-32 sm:pb-32 sm:pt-44">
        <div aria-hidden className="absolute -left-32 top-32 size-80 rounded-full bg-[#b9d4ff]/25 blur-[90px]" />
        <div className="wrap relative grid items-center gap-10 lg:grid-cols-[.92fr_1.08fr] lg:gap-0">
          <div className="relative z-10 max-w-[38rem]">
            <div className="flex flex-wrap items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.18em] text-[#19346d]/60"><span className="rounded-full border border-[#19346d]/15 bg-white/55 px-3 py-1.5">Phantoms / flagship 01</span><span className="rounded-full bg-[#d9f7e5] px-3 py-1.5 text-[#11814a]">Live prototype</span></div>
            <h1 className="font-display tight mt-8 text-[clamp(4.4rem,13vw,10.5rem)] font-extrabold tracking-[-.075em]">RAFIQ<span className="text-[#1b54ff]">.</span></h1>
            <p className="ar mt-5 text-[clamp(1.45rem,3vw,2.5rem)] font-semibold leading-tight text-[#123b9e]">رفيقك اللي بيفتكر معاك.</p>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#18254b]/72 sm:text-lg">{project.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={site.rafiqUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-3 rounded-full bg-[#07102d] pl-5 pr-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_35px_-18px_rgba(7,16,45,.7)] transition hover:bg-[#1b54ff]">Visit the live product <span className="grid size-9 place-items-center rounded-full bg-[#1b54ff] transition group-hover:rotate-45"><ArrowUpRight size={16} /></span></a>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#19346d]/12 bg-white/55 px-4 py-3 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#19346d]/65"><LockKeyhole size={14} className="text-[#1b54ff]" /> local-first</span>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-[#19346d]/45"><ArrowDown size={15} className="animate-bounce" /> Meet the companion</div>
          </div>
          <RafiqStage />
        </div>
      </section>

      <section id="what-rafiq-does" data-section="What RAFIQ does" className="relative bg-[#f0f4fa] py-24 sm:py-32">
        <div className="wrap">
          <div className="max-w-3xl"><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#1b54ff]">01 — What RAFIQ does</p><h2 className="font-display tight mt-6 text-[clamp(2.8rem,6.6vw,6.4rem)] font-extrabold tracking-[-.06em]">Technology that feels <span className="font-serif italic font-normal text-[#1b54ff]">human.</span></h2><p className="mt-6 max-w-xl text-base leading-relaxed text-[#18254b]/65">RAFIQ is not a dashboard with a voice attached. It is a calm, local-first companion designed around dignity, memory and the people who show up every day.</p></div>
          <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => <article key={item.n} className="group rounded-[1.7rem] border border-[#cfdcf1] bg-white/72 p-6 shadow-[0_24px_60px_-44px_rgba(27,84,255,.55)] transition hover:-translate-y-1 hover:border-[#8db2ff] sm:p-7"><div className="flex items-start justify-between"><span className="text-[0.65rem] font-bold tracking-[0.16em] text-[#1b54ff]">{item.n}</span><item.icon size={22} strokeWidth={1.6} className="text-[#1b54ff] transition group-hover:scale-110" /></div><h3 className="font-display mt-10 text-2xl font-bold tracking-[-.04em]">{item.title}</h3><p className="ar mt-1 text-base font-semibold text-[#1b54ff]">{item.ar}</p><p className="mt-4 text-sm leading-relaxed text-[#18254b]/62">{item.body}</p></article>)}
          </div>
        </div>
      </section>

      <section id="local-first" data-section="Local-first" className="relative bg-[#0b1230] py-24 text-white sm:py-32">
        <div aria-hidden className="absolute right-[-10%] top-[-20%] size-[32rem] rounded-full bg-[#1b54ff]/25 blur-[120px]" />
        <div className="wrap relative grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#8cb8ff]">02 — How it works</p><h2 className="font-display tight mt-6 max-w-xl text-[clamp(2.8rem,6vw,5.8rem)] font-extrabold tracking-[-.06em]">The useful parts stay <span className="font-serif italic font-normal text-[#8cb8ff]">at home.</span></h2><p className="mt-6 max-w-md text-base leading-relaxed text-white/58">Conversation, memory and reminders continue when the connection drops. Optional services degrade clearly instead of pretending nothing happened.</p><div className="mt-8 flex flex-wrap gap-2"><span className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-[0.64rem] font-bold uppercase tracking-[0.12em]">No cloud dependency</span><span className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-[0.64rem] font-bold uppercase tracking-[0.12em]">Approved context</span><span className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-[0.64rem] font-bold uppercase tracking-[0.12em]">Clear status</span></div></div>
          <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[.06] p-3 sm:p-5"><div className="grid gap-2 sm:grid-cols-2">{pipeline.map(([name, tag, detail], index) => <div key={name} className="relative rounded-[1.25rem] border border-white/10 bg-white/[.06] p-5"><span className="text-[0.6rem] font-bold tracking-[0.16em] text-[#8cb8ff]">0{index + 1}</span><h3 className="mt-8 font-display text-xl font-bold">{name}</h3><span className="mt-2 inline-block rounded-full bg-[#1b54ff]/25 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[#b8d3ff]">{tag}</span><p className="mt-4 text-sm leading-relaxed text-white/52">{detail}</p>{index < pipeline.length - 1 && <span aria-hidden className="absolute -bottom-3 left-1/2 z-10 hidden size-5 -translate-x-1/2 rotate-45 border-b border-r border-white/15 bg-[#111b46] sm:block" />}</div>)}</div></div>
        </div>
      </section>

      <section id="scenes" data-section="RAFIQ in the world" className="bg-[#fbfcff] py-24 sm:py-32"><div className="wrap"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#1b54ff]">03 — Designed for real days</p><h2 className="font-display tight mt-5 max-w-3xl text-[clamp(2.7rem,6vw,5.5rem)] font-extrabold tracking-[-.06em]">A companion, not another <span className="font-serif italic font-normal text-[#1b54ff]">screen.</span></h2></div><p className="max-w-sm text-sm leading-relaxed text-[#18254b]/60">The face, the voice and the care circle are one system — simple enough to live with, specific enough to trust.</p></div><div className="mt-14 grid gap-3 md:grid-cols-[1.25fr_.75fr_.75fr]">{scenes.map((scene) => <figure key={scene.src} className={`group relative overflow-hidden rounded-[1.7rem] border border-[#d6e2f8] bg-[#e9f0ff] ${scene.className}`}><img src={scene.src} alt={scene.title} className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#07102d]/75 via-transparent to-transparent" /><figcaption className="absolute inset-x-0 bottom-0 p-5 text-white"><span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#b8d3ff]">{scene.label}</span><h3 className="mt-2 max-w-[16rem] font-display text-xl font-bold leading-tight">{scene.title}</h3></figcaption></figure>)}</div></div></section>

      <section id="stack" data-section="The build" className="bg-[#e9f0ff] py-20 sm:py-28"><div className="wrap grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#1b54ff]">04 — The build</p><h2 className="font-display tight mt-5 text-[clamp(2.6rem,5.5vw,5rem)] font-extrabold tracking-[-.06em]">Built by <span className="font-serif italic font-normal text-[#1b54ff]">Phantoms.</span></h2><p className="mt-5 max-w-md text-sm leading-relaxed text-[#18254b]/65">Product, AI, full-stack, mobile and brand — one team shaping the experience from the first voice prompt to the caregiver dashboard.</p></div><div className="flex flex-wrap gap-2">{project.stack.map((tech) => <span key={tech} className="rounded-full border border-[#b9ccef] bg-white/70 px-4 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#19346d]">{tech}</span>)}</div></div></section>

      <section id="rafiq-cta" data-section="See RAFIQ" className="bg-[#fbfcff] py-24 sm:py-32"><div className="wrap"><div className="relative overflow-hidden rounded-[2.3rem] bg-[#dce9ff] p-7 sm:p-12"><div aria-hidden className="absolute -right-20 -top-28 size-80 rounded-full bg-[#7ba9ff]/35 blur-[70px]" /><div className="relative max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#19346d]"><WifiOff size={13} className="text-[#1b54ff]" /> Local-first prototype</span><h2 className="font-display tight mt-7 text-[clamp(2.8rem,6vw,6rem)] font-extrabold tracking-[-.06em]">See the companion <span className="font-serif italic font-normal text-[#1b54ff]">in motion.</span></h2><p className="mt-5 max-w-lg text-base leading-relaxed text-[#18254b]/65">Explore the live RAFIQ product and meet the cloud that inspired this flagship.</p><a href={site.rafiqUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1b54ff] px-5 py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#0a34c9]">Visit the live product <ArrowUpRight size={16} /></a></div></div></div></section>

      <CTA />
    </main>
  );
}
