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
      <PageHero label="Work · 作品" title={<>Selected <span className="serif-i text-red">work</span></>} ar="شغلنا بيتكلم." kanji="作">
        Products we designed, engineered and launched. Filter by what you&apos;re planning to build.
      </PageHero>
      <section className="pb-10">
        <div className="wrap">
          <WorkGrid />
        </div>
      </section>
      <CTA />
    </>
  );
}
