import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Flagship } from "@/components/sections/Flagship";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Team } from "@/components/sections/Team";
import { Memories } from "@/components/sections/Memories";
import { CTA } from "@/components/sections/CTA";
import { memoryPhotos, teamPhotos } from "@/lib/media";

export default function Home() {
  return (
    <div className="home-refined">
      <Hero />
      <About />
      <Flagship />
      <Services />
      <Work />
      <Process />
      <Team photos={teamPhotos()} />
      <Memories photos={memoryPhotos()} />
      <CTA />
    </div>
  );
}
