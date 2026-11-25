import type { Metadata } from "next";
import { ArrowUpRight, Brain, CloudOff, HeartHandshake, Smartphone } from "lucide-react";
import { RafiqStage } from "@/components/sections/RafiqStage";
import { CTA } from "@/components/sections/CTA";
import { Fade, Reveal } from "@/components/ui";
import { getProject } from "@/data/projects";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "RAFIQ",
  description: "RAFIQ — a local-first Arabic AI companion for people living with memory loss.",
};

const features = [
  { icon: Brain, t: "Speaks Arabic, naturally", d: "Egyptian-dialect aware conversation with local speech and language models.", ar: "بيفهمك وبيرد بالعربي" },
  { icon: CloudOff, t: "Local-first", d: "Conversation, memory and reminders keep working with the internet cut.", ar: "شغال حتى من غير نت" },
  { icon: HeartHandshake, t: "Honest by design", d: "It says what it doesn't know, and an SOS chain never over-promises.", ar: "صادق ومش بيخترع" },
  { icon: Smartphone, t: "Caregiver app", d: "One accurate picture for the family — reminders, logs and alerts.", ar: "تطبيق لأهلك" },
];

export default function RafiqPage() {
  const p = getProject("rafiq")!;
  return (
    <>
      <section
        className="relative overflow-hidden bg-[#eef2ff] pb-28 pt-36 text-[#0b1020] sm:pt-44"
        style={{ backgroundImage: "radial-gradient(70% 60% at 80% 40%, #dbe6ff 0%, transparent 70%), radial-gradient(50% 50% at 10% 90%, #ffe9d5 0%, transparent 70%)" }}
      >
        <div className="wrap grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="label !text-[#0b1020]/60">Flagship 01</span>
            <Reveal immediate as="h1" className="font-display tight mt-7 text-[clamp(4rem,12vw,11rem)] font-extrabold">
              RAFIQ<span className="text-[#2563eb]">.</span>
            </Reveal>
            <p className="ar mt-4 text-[clamp(1.4rem,3vw,2.4rem)] font-semibold">رفيقك اللي بيفتكر معاك.</p>
            <Fade delay={0.3}>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-[#0b1020]/70">{p.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={site.rafiqUrl} target="_blank" rel="noreferrer" className="btn !bg-[#0b1020] !text-white" data-cursor="OPEN">
                  <span>Visit rafiq-tech</span>
                  <span className="btn-icon !bg-[#2563eb] !text-white">
                    <ArrowUpRight size={16} />
                  </span>
                </a>
              </div>
            </Fade>
          </div>
          <RafiqStage />
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="wrap">
          <h2 className="font-display tight max-w-3xl text-[clamp(2.4rem,6vw,5.4rem)] font-extrabold">
            Calm technology for <span className="serif-i text-red">hard</span> days.
          </h2>
          <div className="mt-14 grid gap-3 sm:grid-cols-2">
            {features.map((f, i) => (
              <Fade key={f.t} delay={i * 0.07} y={30}>
                <div data-spot className="card h-full p-7 transition-colors hover:border-[#2563eb]">
                  <f.icon className="text-[#4f8cff]" size={28} strokeWidth={1.6} />
                  <h3 className="font-display mt-6 text-2xl font-extrabold tracking-[-0.04em]">{f.t}</h3>
                  <p className="ar mt-1 text-base text-muted">{f.ar}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.d}</p>
                </div>
              </Fade>
            ))}
          </div>
          <div className="mt-10 grid gap-3 lg:grid-cols-2">
            <div className="card p-7">
              <span className="label">The challenge</span>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.challenge}</p>
            </div>
            <div className="card p-7">
              <span className="label">Our approach</span>
              <p className="mt-4 text-sm leading-relaxed text-muted">{p.solution}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
