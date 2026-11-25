import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TheMark } from "@/components/sections/TheMark";
import { Team } from "@/components/sections/Team";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Flagship } from "@/components/sections/Flagship";
import { Work } from "@/components/sections/Work";
import { Memories } from "@/components/sections/Memories";
import { CTA } from "@/components/sections/CTA";
import { SideIndex } from "@/components/ui/SideIndex";
import { memoryPhotos, teamPhotos } from "@/lib/media";

const index = [
  { id: "s-about", n: "01", label: "About" },
  { id: "s-mark", n: "02", label: "The mark" },
  { id: "s-team", n: "03", label: "Team" },
  { id: "s-services", n: "04", label: "What we build" },
  { id: "s-process", n: "05", label: "How we work" },
  { id: "s-flagship", n: "06", label: "Products" },
  { id: "s-work", n: "07", label: "Work" },
  { id: "s-memories", n: "08", label: "Memories" },
  { id: "s-contact", n: "09", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <SideIndex items={index} />
      <Hero />
      <div id="s-about"><About /></div>
      <div id="s-mark"><TheMark /></div>
      <div id="s-team"><Team photos={teamPhotos()} /></div>
      <div id="s-services"><Services /></div>
      <div id="s-process"><Process /></div>
      <div id="s-flagship"><Flagship /></div>
      <div id="s-work"><Work /></div>
      <div id="s-memories"><Memories photos={memoryPhotos()} /></div>
      <div id="s-contact"><CTA /></div>
    </>
  );
}
