import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { CTA } from "@/components/sections/CTA";
import { Compare, FAQ } from "@/components/sections/Extras";

export const metadata: Metadata = {
  title: "Services",
  description: "Web, mobile apps and SaaS — designed, engineered and launched by one team.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero label="Services" title={<>What we <span className="serif-i text-red">build</span></>} ar="مواقع، تطبيقات، وأنظمة SaaS.">
        One team for design, engineering and launch. Pick a lane — or combine them.
      </PageHero>
      <Services heading={false} />
      <Compare />
      <Process />
      <FAQ />
      <CTA />
    </>
  );
}
