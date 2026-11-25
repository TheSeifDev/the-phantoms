import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGrid } from "@/components/sections/Work";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Work",
  description: "Websites, apps and SaaS products shipped by Phantoms — from RAFIQ and OMNI to ops platforms and learning hubs.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero label="The archive" title={<>Selected <span className="serif-i text-red">work</span>.</>} ar="شغلنا بيتكلم.">
        Products we designed, engineered and launched. A small index of useful things made with care in Alexandria.
      </PageHero>
      <section className="relative overflow-hidden pb-16 sm:pb-24">
        <div className="aura -left-48 top-20 h-96 w-96 opacity-20" />
        <div className="wrap relative"><WorkGrid /></div>
      </section>
      <CTA />
    </>
  );
}
