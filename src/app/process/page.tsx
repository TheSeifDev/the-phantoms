import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { FAQ } from "@/components/sections/Extras";
import { CTA } from "@/components/sections/CTA";
import { processSteps } from "@/data/site";

export const metadata: Metadata = {
  title: "How we work",
  description: "Discover, design, build, ship — a four-step process with a deliverable at every stage.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero label="How we work" title={<>Four steps. <span className="serif-i text-red">No</span> surprises.</>} ar="خطوات واضحة من الفكرة للإطلاق.">
        Every engagement follows the same rhythm — so you always know what is done, what is next and what you will get at the end of the week.
      </PageHero>
      <section className="wrap pb-24">
        <ol className="space-y-4">
          {processSteps.map((s, i) => (
            <li key={s.n} data-spot className={`card grid items-center gap-8 overflow-hidden p-5 sm:p-8 lg:grid-cols-12 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl lg:col-span-6">
                <Image src={s.image} alt={s.title} fill sizes="(min-width:1024px) 600px, 100vw" className="object-cover" />
              </div>
              <div className="lg:col-span-6">
                <div className="mono text-[0.72rem] uppercase tracking-[0.2em] text-red">Step {s.n}</div>
                <h2 className="font-display tight mt-3 text-[clamp(2.4rem,5vw,4.4rem)] font-extrabold">{s.title}</h2>
                <p className="ar mt-2 text-lg font-semibold">{s.ar}</p>
                <p className="mt-4 max-w-md text-muted">{s.line}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.out.map((o) => (
                    <li key={o} className="mono rounded-full border border-line px-3 py-1.5 text-[0.7rem]">{o}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <FAQ />
      <CTA />
    </>
  );
}
