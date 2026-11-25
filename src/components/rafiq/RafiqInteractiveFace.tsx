"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { FaceStateId } from "@/lib/rafiq/content";
import type { RafiqScene, RafiqCanvas } from "@/lib/rafiq/rafiq-three";
import { allowSoftwareWebGL, shouldUseRafiq3D, whenPageIdle } from "@/lib/rafiq/rafiq-face/capability";
import RafiqSvgFace from "@/components/rafiq/RafiqSvgFace";

export interface RafiqInteractiveFaceProps {
  state?: FaceStateId;
  className?: string;
  interactive?: boolean;
  label?: string;
}

/** Progressively enhance the same character, not the surrounding website. */
export default function RafiqInteractiveFace({
  state = "idle", className = "", interactive = true,
  label = "RAFIQ — your attentive blue cloud companion",
}: RafiqInteractiveFaceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<RafiqCanvas>(null);
  const sceneRef = useRef<RafiqScene | null>(null);
  const stateRef = useRef(state);
  const interactiveRef = useRef(interactive);
  const [ready, setReady] = useState(false);

  useEffect(() => { stateRef.current = state; sceneRef.current?.setState(state); }, [state]);
  useEffect(() => { interactiveRef.current = interactive; sceneRef.current?.setInteractive(interactive); }, [interactive]);
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    let cancelled = false;
    let started = false;
    let visible = false;
    let cancelIdle: (() => void) | null = null;
    const fail = () => {
      sceneRef.current?.dispose(); sceneRef.current = null;
      if (!cancelled) setReady(false);
    };
    const initialize = async () => {
      if (started || cancelled) return;
      started = true;
      // Weak devices keep the (fully interactive) SVG face and never download Three.js.
      if (!shouldUseRafiq3D()) return;
      try {
        const { createRafiqScene } = await import("@/lib/rafiq/rafiq-three");
        if (cancelled) return;
        sceneRef.current = createRafiqScene(canvas, stateRef.current, interactiveRef.current, fail, { allowSoftware: allowSoftwareWebGL() });
        sceneRef.current?.setVisible(visible);
        setReady(true);
      } catch {
        // SSR content remains a fully interactive SVG if WebGL cannot initialize.
        fail();
      }
    };
    // The SVG face paints with the page; WebGL takes over once the page is loaded and idle,
    // so Three.js never competes with first paint, hydration or the first taps.
    const schedule = () => {
      if (started || cancelled || cancelIdle) return;
      cancelIdle = whenPageIdle(() => {
        cancelIdle = null;
        if (visible) void initialize();
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sceneRef.current?.setVisible(visible);
      if (visible) schedule();
    }, { rootMargin: "100px", threshold: 0.01 });
    observer.observe(root);
    return () => {
      cancelled = true; observer.disconnect(); cancelIdle?.();
      sceneRef.current?.dispose(); sceneRef.current = null;
    };
  }, []);

  const greet = () => { if (ready && interactive) sceneRef.current?.greet(); };
  const keyGreet = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!ready || !interactive || !["Enter", " "].includes(event.key)) return;
    event.preventDefault(); if (!event.repeat) greet();
  };
  return (
    <div
      ref={rootRef}
      className={`relative aspect-square select-none ${interactive ? "cursor-pointer" : ""} ${className}`}
      role={ready ? (interactive ? "button" : "img") : undefined}
      tabIndex={ready && interactive ? 0 : undefined}
      aria-label={ready ? `${label}${interactive ? ". Say hello to RAFIQ." : ""}` : undefined}
      onClick={ready ? greet : undefined}
      onKeyDown={ready ? keyGreet : undefined}
      data-rafiq-avatar
      data-renderer={ready ? "webgl" : "svg"}
      data-face={state === "idle" || state === "listening" ? "attentive" : state}
      data-state={state}
    >
      {!ready && (
        <div className="absolute inset-0">
          <RafiqSvgFace state={state} interactive={interactive} label={label} className="h-full w-full" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 block h-full w-full ${ready ? "visible" : "invisible"}`}
        aria-hidden="true"
        data-rafiq-canvas
      />
    </div>
  );
}
