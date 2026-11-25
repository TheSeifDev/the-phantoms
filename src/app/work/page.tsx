import type { Metadata } from "next";
import { WorkGrid } from "@/components/sections/Work";
import { PageHero } from "@/components/sections/PageHero";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "Work archive",
  description: "An editorial archive of products, platforms and experiments shipped by Phantoms.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero label="The archive / 06" title={<>Selected <span className="serif-i text-red">work</span>.</>} ar="شغلنا بيتكلم.">
        A filterable record of useful products — from operational tools and learning platforms to the two flagship systems featured on the home page.
      </PageHero>
      <section className="relative overflow-hidden pb-20 sm:pb-28">
        <div className="aura -left-48 top-24 h-96 w-96 opacity-20" />
        <div className="wrap relative"><WorkGrid /></div>
      </section>
      <CTA />
    </>
  );
}
