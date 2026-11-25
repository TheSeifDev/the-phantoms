import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { OmniStage } from "@/components/sections/OmniStage";
import { CTA } from "@/components/sections/CTA";
import { Fade, Label } from "@/components/ui";
import { getProject } from "@/data/projects";

export const metadata: Metadata = {
  title: "OMNI",
  description: "OMNI — microbots inspired by Big Hero 6. A swarm of small units, one control layer, simulated in the browser.",
};

const layers = [
  { n: "01", t: "Swarm", d: "Thousands of identical hex units, each with a position, a target and a neighbourhood." },
  { n: "02", t: "Formation engine", d: "Scatter, wave and sphere are just target fields — switch fields and the swarm re-flows." },
  { n: "03", t: "Control protocol", d: "The same MQTT messages drive the simulator today and the ESP32 hardware tomorrow." },
  { n: "04", t: "Observability", d: "Every unit is inspectable: state, signal, battery — before a single motor is soldered." },
];

export default function OmniPage() {
  const p = getProject("omni")!;
  return (
    <>
      <PageHero label="Flagship 02" title={<>OMNI<span className="text-red">.</span></>} ar="سرب واحد، عقل واحد.">
        {p.summary}
      </PageHero>
      <OmniStage />
      <section className="py-24 sm:py-32">
        <div className="wrap">
          <Label>Architecture</Label>
          <h2 className="font-display tight mt-6 max-w-3xl text-[clamp(2.4rem,6vw,5.4rem)] font-extrabold">
            One protocol. <span className="serif-i text-red">Two</span> worlds.
          </h2>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {layers.map((l, i) => (
              <Fade key={l.n} delay={i * 0.08} y={30}>
                <div className="h-full rounded-[1.6rem] border border-line bg-surface p-6 transition-colors hover:border-red">
                  <span className="font-display text-sm font-bold text-red">{l.n}</span>
                  <h3 className="font-display mt-3 text-2xl font-extrabold tracking-[-0.04em]">{l.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{l.d}</p>
                </div>
              </Fade>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
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
