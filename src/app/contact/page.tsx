import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo } from "@/components/sections/ContactInfo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Phantoms — tell us about your idea and we'll reply within one working day.",
};

export default function ContactPage() {
  return (
    <main className="grain-s relative isolate overflow-hidden pb-20 pt-32 sm:pt-40">
      <div aria-hidden className="aura -left-56 top-20 h-[34rem] w-[34rem] opacity-20" />
      <div aria-hidden className="aura -right-64 top-[38%] h-[30rem] w-[30rem] opacity-15" />
      <div className="wrap relative">
        <div className="mb-12 max-w-3xl sm:mb-16">
          <p className="label">Let&apos;s make something useful</p>
          <h1 className="font-display tight mt-7 max-w-[9ch] text-[clamp(4rem,11vw,10rem)] font-extrabold">Let&apos;s <span className="serif-i text-red glow-red">talk.</span></h1>
          <p className="ar mt-6 text-[clamp(1.25rem,2.5vw,2.1rem)] font-semibold">عندك فكرة؟ خلينا نبنيها.</p>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="lg:sticky lg:top-28"><ContactInfo /></div>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
