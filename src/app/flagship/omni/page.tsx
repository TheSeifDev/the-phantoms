import type { Metadata } from "next";
import { ArrowUpRight, Cpu, Radio, Route, Sparkles } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { OmniStage } from "@/components/sections/OmniStage";
import { Fade, Label } from "@/components/ui";
import { getProject } from "@/data/projects";

export const metadata: Metadata = {
  title: "OMNI / Swarm control",
  description: "OMNI is a browser-simulated swarm control layer for ESP32 microbots, coordinated through MQTT.",
};

const layers = [
  { icon: Cpu, n: "01", title: "ESP32 units", body: "Small, identical hardware units receive movement and formation instructions through the same control layer." },
  { icon: Radio, n: "02", title: "MQTT backbone", body: "Lightweight messages keep the simulator and embedded prototypes aligned around one observable protocol." },
  { icon: Route, n: "03", title: "Swarm control", body: "A formation engine turns targets into collective movement: scatter, wave, sphere and the behaviours between them." },
  { icon: Sparkles, n: "04", title: "Browser lab", body: "Three.js makes the system visible before the physical swarm exists, so behaviour can be tested early." },
];

const roadmap = ["Simulator and formation engine", "Shared MQTT message contract", "ESP32 unit prototype", "Coordinated physical swarm"];

export default function OmniPage() {
  const project = getProject("omni")!;
  return (
    <>
      <section className="relative overflow-hidden bg-[#07070a] pb-20 pt-32 text-white sm:pb-28 sm:pt-40">
        <div className="aura -right-40 top-10 h-[30rem] w-[30rem] opacity-35" />
        <div className="wrap relative"><div className="flex flex-wrap items-center justify-between gap-4"><Label className="!text-white/55">Flagship 02 / robotics systems</Label><span className="mono text-[0.62rem] uppercase tracking-[0.16em] text-white/40">{project.status}</span></div><h1 className="font-display tight mt-8 max-w-[8ch] text-[clamp(4.5rem,14vw,13rem)] font-extrabold tracking-[-0.09em]">OMNI<span className="text-red">.</span></h1><p className="ar mt-5 text-[clamp(1.3rem,3vw,2.2rem)] font-semibold text-white/70">سرب واحد، عقل واحد.</p><p className="mt-6 max-w-xl text-base leading-relaxed text-white/55">{project.summary}</p></div>
      </section>
      <OmniStage />

      <section className="relative overflow-hidden py-20 sm:py-32"><div className="wrap"><div className="max-w-3xl"><Label>How it works</Label><h2 className="font-display tight mt-6 text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold">One message. <span className="serif-i text-red">Many</span> bodies.</h2><p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">OMNI keeps the visible simulation and the future hardware pointed at the same problem: making collective movement legible, testable and controllable.</p></div><div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{layers.map((layer, index) => <Fade key={layer.n} delay={index * 0.07} y={28}><article className="card h-full p-6"><layer.icon size={23} className="text-red" strokeWidth={1.7} /><span className="mono mt-8 block text-xs text-muted">{layer.n}</span><h3 className="font-display mt-3 text-2xl font-extrabold tracking-[-0.04em]">{layer.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{layer.body}</p></article></Fade>)}</div><div className="mt-8 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="chip">{item}</span>)}</div></div></section>

      <section className="bg-[#0b0b0e] py-20 text-white sm:py-32"><div className="wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><Label className="!text-white/55">Roadmap</Label><h2 className="font-display tight mt-6 max-w-[8ch] text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold">From <span className="serif-i text-red">screen</span> to swarm.</h2></div><div className="border-t border-white/15">{roadmap.map((item, index) => <div key={item} className="flex items-center gap-5 border-b border-white/15 py-5"><span className="mono text-xs text-red">0{index + 1}</span><span className="text-base font-medium text-white/75">{item}</span><span className="ml-auto h-2 w-2 rounded-full bg-red shadow-[0_0_12px_rgba(255,36,24,.8)]" /></div>)}</div></div></section>

      <section className="relative overflow-hidden py-20 sm:py-28"><div className="wrap flex flex-col justify-between gap-8 rounded-[2rem] border border-red/25 bg-red/[.06] p-7 sm:p-12 md:flex-row md:items-end"><div><Label>Build the next control layer</Label><h2 className="font-display tight mt-5 max-w-[10ch] text-[clamp(2.8rem,6vw,5.8rem)] font-extrabold">Make complex things <span className="serif-i text-red">visible.</span></h2></div><a href="mailto:the.phantoms.dev@gmail.com?subject=OMNI%20systems" className="btn btn-red shrink-0"><span>Talk systems</span><span className="btn-icon"><ArrowUpRight size={16} /></span></a></div></section>
      <CTA />
    </>
  );
}
