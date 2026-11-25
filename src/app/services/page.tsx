import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesPageContent } from "@/components/sections/ServicesPageContent";
import { Compare, FAQ } from "@/components/sections/Extras";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Services",
  description: "Web, mobile apps and SaaS — designed, engineered and launched by one team.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero label="Services" title={<>Build the <span className="serif-i text-red">next</span> thing.</>} ar="مواقع، تطبيقات، وأنظمة SaaS.">
        A focused product team for the moment when a good idea needs a sharp shape, a dependable build and a way to move into the world.
      </PageHero>
      <ServicesPageContent />
      <Compare />
      <FAQ />
      <CTA />
    </>
  );
}
