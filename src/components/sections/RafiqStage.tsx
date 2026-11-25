"use client";

import { useRef, useState } from "react";
import { Activity, Bell, HeartPulse, Mic, ShieldCheck, WifiOff } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { RafiqFace } from "@/components/rafiq";
import { faceStates, type FaceStateId } from "@/lib/rafiq/content";

const glass = "border border-white/75 bg-white/65 shadow-[0_22px_70px_-30px_rgba(27,84,255,.38)] backdrop-blur-2xl";

/** The RAFIQ light-world demo used by the home teaser and the flagship page. */
export function RafiqStage() {
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<FaceStateId>("listening");
  const active = faceStates.find((item) => item.id === state) ?? faceStates[0];

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-rafiq-float]");
    const tweens = cards.map((card, index) => gsap.to(card, {
      y: index % 2 ? 10 : -10,
      x: index % 2 ? -5 : 5,
      duration: 3.8 + index * 0.45,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    }));
    return () => tweens.forEach((tween) => tween.kill());
  }, { scope: root });

  return (
    <div ref={root} className="relative mx-auto min-h-[35rem] w-full max-w-[42rem] sm:min-h-[39rem]" aria-label="RAFIQ interactive product preview">
      <div aria-hidden className="absolute left-1/2 top-1/2 size-[min(34rem,88vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8bb7ff]/25 blur-[80px]" />
      <div aria-hidden className="absolute bottom-[9%] left-1/2 h-8 w-[54%] -translate-x-1/2 rounded-full bg-[#173c9e]/15 blur-2xl" />

      <div data-rafiq-float className={`${glass} absolute left-0 top-[11%] z-20 w-[11.8rem] rounded-[1.35rem] rounded-bl-md p-3.5 sm:left-[2%]`}>
        <div className="flex items-center gap-2 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[#1b54ff]"><Mic size={12} /> {active.label}</div>
        <p className="ar mt-2 text-[0.9rem] font-semibold leading-relaxed text-[#07102d]">{state === "alert" ? "أنا طالب مساعدة." : state === "happy" ? "حبيت الكلام ده!" : "أنا هنا، سامعك."}</p>
      </div>

      <div data-rafiq-float className={`${glass} absolute right-0 top-[19%] z-20 flex w-[13.7rem] items-center gap-3 rounded-[1.35rem] p-3.5 sm:right-[1%]`}>
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#e8f0ff] text-[#1b54ff]"><Bell size={17} /></span>
        <div><div className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[#07102d]/45">Reminder</div><div className="ar mt-1 text-[0.78rem] font-bold text-[#07102d]">معاد الدوا · ٦:٠٠ م</div></div>
      </div>

      <div className="absolute inset-x-[10%] top-[4%] flex justify-between text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#07102d]/45">
        <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#2bd96b]" /> local companion</span>
        <span>01 / 06</span>
      </div>

      <RafiqFace state={state} className="absolute inset-[8%] z-10" label={`RAFIQ cloud companion — ${active.label.toLowerCase()}`} />

      <div data-rafiq-float className="absolute bottom-[15%] left-0 z-20 flex items-center gap-2 rounded-full bg-[#07102d] px-4 py-2.5 text-[0.65rem] font-bold text-white shadow-[0_18px_45px_-18px_rgba(7,16,45,.65)] sm:left-[2%]"><WifiOff size={13} className="text-[#8cb8ff]" /> Offline mode · on</div>

      <div data-rafiq-float className={`${glass} absolute bottom-[8%] right-0 z-20 w-[13.4rem] rounded-[1.35rem] p-3.5 sm:right-[1%]`}>
        <div className="flex items-center gap-2 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[#07102d]/45"><Activity size={12} /> Care circle</div>
        <div className="mt-2 flex items-center gap-2 text-[0.78rem] font-bold text-[#07102d]"><HeartPulse size={15} className="text-[#20b967]" /> مريم updated Mama&apos;s care plan</div>
      </div>

      <div className="absolute inset-x-0 bottom-[-0.3rem] z-30 rounded-[1.4rem] border border-[#d6e2f8] bg-white/78 p-2 shadow-[0_20px_55px_-32px_rgba(10,52,201,.45)] backdrop-blur-xl sm:bottom-[-0.6rem] sm:p-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5" role="tablist" aria-label="Preview RAFIQ face states">
          {faceStates.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={item.id === state} onClick={() => setState(item.id)} className={`shrink-0 rounded-full px-3 py-2 text-[0.58rem] font-bold uppercase tracking-[0.12em] transition ${item.id === state ? "bg-[#1b54ff] text-white shadow-[0_9px_22px_-12px_#1b54ff]" : "text-[#07102d]/55 hover:bg-[#e9f0ff] hover:text-[#07102d]"}`}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 px-2 text-[0.66rem] text-[#07102d]/55"><ShieldCheck size={13} className="text-[#1b54ff]" /> {active.body}</div>
      </div>
    </div>
  );
}
