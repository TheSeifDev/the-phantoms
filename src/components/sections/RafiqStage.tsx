"use client";
import { useRef, useState } from "react";
import { Activity, Bell, CloudOff, HeartPulse, Mic } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { CloudFace } from "@/components/three/lazy";
import type { FaceState } from "@/components/three/CloudFace";

const states: { k: FaceState; label: string; line: string; ar: string }[] = [
  { k: "idle", label: "Idle", line: "Resting, but always around.", ar: "أنا هنا." },
  { k: "listening", label: "Listening", line: "Eyes wide, taking it all in.", ar: "سامعك." },
  { k: "thinking", label: "Thinking", line: "Looking for the right memory.", ar: "ثانية أفتكر." },
  { k: "happy", label: "Happy", line: "Click the cloud — it loves that.", ar: "حبيت الكلام ده!" },
];

const card = "rounded-2xl bg-white/85 text-[#0b1020] shadow-[0_20px_50px_-20px_rgba(37,99,235,.45)] backdrop-blur-xl ring-1 ring-white";

/** Big interactive RAFIQ face with the same floating UI cards as the RAFIQ site. */
export function RafiqStage() {
  const root = useRef<HTMLDivElement>(null);
  const [s, setS] = useState<FaceState>("idle");
  const cur = states.find((x) => x.k === s)!;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-fl]").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 14 : -14, x: i % 2 ? -6 : 6, duration: 3.4 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mx-auto aspect-[4/4.4] w-full max-w-[34rem] sm:aspect-square">
      <div aria-hidden className="absolute inset-[8%] rounded-full bg-[#7aa8ff]/35 blur-3xl" />
      <CloudFace state={s} className="absolute inset-0" />

      <div data-fl className={`${card} absolute left-[-2%] top-[14%] max-w-[12rem] rounded-bl-md px-4 py-3`}>
        <div className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#2563eb]">
          <Mic size={11} /> {cur.label}
        </div>
        <p className="ar mt-1 text-sm font-semibold">{cur.ar}</p>
      </div>
      <div data-fl className={`${card} absolute right-[-3%] top-[22%] flex items-center gap-2.5 px-3.5 py-3`}>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6eeff] text-[#2563eb]"><Bell size={16} /></span>
        <div>
          <div className="text-[0.62rem] font-bold uppercase tracking-wider text-[#0b1020]/50">Reminder</div>
          <div className="ar text-[0.82rem] font-bold">معاد الدوا · 6:00 م</div>
        </div>
      </div>
      <div data-fl className="absolute bottom-[16%] left-[0%] flex items-center gap-2 rounded-full bg-[#0b1020] px-4 py-2.5 text-[0.7rem] font-bold text-white shadow-2xl">
        <CloudOff size={13} className="text-[#7aa8ff]" /> Offline mode · on
      </div>
      <div data-fl className={`${card} absolute bottom-[10%] right-[0%] px-3.5 py-3`}>
        <div className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#0b1020]/50">
          <Activity size={11} /> System health
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[0.8rem] font-bold">
          <HeartPulse size={14} className="text-[#2bd96b]" /> All local · 100%
        </div>
      </div>

      {/* state switcher */}
      <div className="absolute inset-x-0 -bottom-14 flex flex-wrap justify-center gap-1.5 sm:-bottom-12">
        {states.map((x) => (
          <button
            key={x.k}
            type="button"
            onClick={() => setS(x.k)}
            className={`rounded-full border px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] transition-colors ${
              s === x.k ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-[#0b1020]/15 bg-white/60 text-[#0b1020] hover:border-[#2563eb]"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
    </div>
  );
}
