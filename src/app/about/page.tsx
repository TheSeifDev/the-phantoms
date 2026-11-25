import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { AboutStory } from "@/components/sections/AboutStory";
import { PhantomCode } from "@/components/sections/PhantomCode";
import { AboutMarkBook } from "@/components/sections/AboutMarkBook";
import { WhyClients } from "@/components/sections/WhyClients";
import { CTA } from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Phantoms — a product team from Alexandria building websites, apps and SaaS people trust.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero label="About Phantoms" title={<>Built in the <span className="serif-i text-red">shadows.</span> Felt everywhere.</>} ar="بنشتغل بهدوء، وبنطلع حاجة تفرق.">
        We are a 35-person product team from Alexandria. We design, engineer and launch digital products with the same people in the room from first question to final release.
      </PageHero>
      <AboutStory />
      <PhantomCode />
      <AboutMarkBook />
      <WhyClients />
      <CTA />
    </>
  );
}
