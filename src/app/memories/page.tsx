import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Memories } from "@/components/sections/Memories";
import { CTA } from "@/components/sections/CTA";
import { memoryPhotos } from "@/lib/media";

export const metadata: Metadata = {
  title: "Memories",
  description: "The people and moments that got Phantoms here.",
};

export default function MemoriesPage() {
  return (
    <>
      <PageHero label="Memories" title={<>Moments we <span className="serif-i text-red">made</span></>} ar="ذكريات الفريق.">
        The people and nights that got Phantoms here.
      </PageHero>
      <Memories photos={memoryPhotos()} heading={false} full />
      <CTA />
    </>
  );
}
