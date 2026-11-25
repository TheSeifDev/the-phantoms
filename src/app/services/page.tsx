import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { CTA, Compare, FAQ } from "@/components/sections/CTA";
import { Fade } from "@/components/ui";
import { services } from "@/data/projects";

export const metadata: Metadata = {
  title: "Services",
  description: "Web, mobile apps and SaaS — designed, engineered and launched by one team.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero label="Services · 技" title={<>What we <span className="serif-i text-red">build</span></>} ar="مواقع، تطبيقات، وأنظمة SaaS." kanji="技">
        One team for design, engineering and launch. Pick a lane — or combine them.
      </PageHero>
      <Services bare />

      <section className="py-10">
        <div className="wrap space-y-4">
          {services.map((s) => (
            <Fade key={s.key}>
              <div id={s.key.toLowerCase()} className="scroll-mt-28 grid gap-8 rounded-[2rem] border border-line bg-surface p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <span className="font-display text-sm font-bold text-red">{s.n}</span>
                  <h3 className="font-display mt-2 text-5xl font-extrabold tracking-[-0.045em]">{s.title}</h3>
                  <p className="ar mt-1 text-xl text-muted">{s.ar}</p>
                  <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{s.line}</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {s.items.map((i) => (
                    <li key={i} className="flex items-start gap-3 rounded-2xl border border-line p-4 text-sm font-medium">
                      <Check size={16} className="mt-0.5 shrink-0 text-red" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <Compare />
      <Process />
      <FAQ />
      <CTA />
    </>
  );
}
