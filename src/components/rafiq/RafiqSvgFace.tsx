"use client";

import { useEffect, useId, useRef } from "react";
import { cloudPath } from "@/lib/rafiq/rafiq-avatar";
import type { FaceStateId } from "@/lib/rafiq/content";
import { createFaceDriver, joinRafiqFrames, type FaceDriver } from "@/lib/rafiq/rafiq-face/driver";
import type { EyeFrame } from "@/lib/rafiq/rafiq-face/behavior";

interface RafiqSvgFaceProps {
  state?: FaceStateId;
  className?: string;
  interactive?: boolean;
  label?: string;
}

const RAD = 180 / Math.PI;

/** Eye transform in SVG space (y-down) from a model eye (y-up). */
function eyeTransform(eye: EyeFrame) {
  return `translate(${eye.x.toFixed(2)} ${(-eye.y).toFixed(2)}) rotate(${(-eye.angle * RAD).toFixed(2)}) scale(${eye.widthScale.toFixed(3)} ${Math.max(0.04, eye.heightScale).toFixed(3)})`;
}

/**
 * SVG rendering of RAFIQ used for server rendering and when WebGL is unavailable.
 * Same silhouette, eyes and behaviour model as the 3D renderer; no mouth.
 */
export default function RafiqSvgFace({
  state = "idle",
  className = "",
  interactive = true,
  label = "RAFIQ — blue cloud companion",
}: RafiqSvgFaceProps) {
  const id = useId().replace(/:/g, "");
  const root = useRef<SVGSVGElement>(null);
  const body = useRef<SVGGElement>(null);
  const glow = useRef<SVGCircleElement>(null);
  const pills = [useRef<SVGRectElement>(null), useRef<SVGRectElement>(null)];
  const arcs = [useRef<SVGPathElement>(null), useRef<SVGPathElement>(null)];
  const eyes = [useRef<SVGGElement>(null), useRef<SVGGElement>(null)];
  const driverRef = useRef<FaceDriver | null>(null);
  const stateRef = useRef(state);
  const interactiveRef = useRef(interactive);

  useEffect(() => { stateRef.current = state; driverRef.current?.setState(state); }, [state]);
  useEffect(() => { interactiveRef.current = interactive; driverRef.current?.setInteractive(interactive); }, [interactive]);

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const driver = createFaceDriver(stateRef.current, interactiveRef.current);
    driverRef.current = driver;
    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) driver.settle();
    }, { rootMargin: "80px" });
    observer.observe(svg);
    const leave = joinRafiqFrames((_, deltaMs) => {
      if (!visible || document.hidden) return;
      const rect = svg.getBoundingClientRect();
      if (!rect.width) return;
      const frame = driver.step(Math.min(deltaMs / 1000, 0.064), rect);
      const f = frame.body;
      const squashOrigin = 89;
      body.current?.setAttribute(
        "transform",
        `translate(${(f.offsetX + f.leanX * 0.5).toFixed(2)} ${(-f.offsetY).toFixed(2)}) ` +
          `translate(0 ${squashOrigin}) rotate(${(-f.roll * RAD).toFixed(2)}) ` +
          `skewX(${(-f.leanX * 0.35).toFixed(2)}) scale(${(f.scaleX * Math.cos(f.yaw * 0.6)).toFixed(4)} ${(f.scaleY * Math.cos(f.pitch * 0.6)).toFixed(4)}) translate(0 ${-squashOrigin})`,
      );
      glow.current?.setAttribute("opacity", Math.min(1, f.glow * 3).toFixed(3));
      frame.eyes.forEach((eye, i) => {
        eyes[i].current?.setAttribute("transform", eyeTransform(eye));
        const pill = pills[i].current;
        if (pill) {
          const height = (eye.halfLength + eye.radius) * 2;
          pill.setAttribute("x", (-eye.radius).toFixed(2));
          pill.setAttribute("y", (-height / 2).toFixed(2));
          pill.setAttribute("width", (eye.radius * 2).toFixed(2));
          pill.setAttribute("height", height.toFixed(2));
          pill.setAttribute("rx", eye.radius.toFixed(2));
          pill.setAttribute("opacity", (1 - eye.happy).toFixed(3));
        }
        arcs[i].current?.setAttribute("opacity", eye.happy.toFixed(3));
      });
    });
    return () => {
      leave();
      observer.disconnect();
      driver.dispose();
      driverRef.current = null;
    };
    // Refs are stable for the component lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const greet = () => driverRef.current?.greet();
  const restingEyes: Array<[number, number]> = [[-22, -8], [22, -8.6]];

  return (
    <svg
      ref={root}
      viewBox="-125 -125 250 250"
      className={`overflow-visible select-none ${interactive ? "cursor-pointer" : ""} ${className}`}
      role={interactive ? "button" : "img"}
      tabIndex={interactive ? 0 : undefined}
      focusable={interactive ? "true" : "false"}
      aria-label={interactive ? `${label}. Say hello to RAFIQ.` : label}
      onClick={greet}
      onKeyDown={(event) => {
        if (!interactive || !["Enter", " "].includes(event.key)) return;
        event.preventDefault();
        if (!event.repeat) greet();
      }}
      data-rafiq-avatar
      data-renderer="svg"
      data-state={state}
    >
      <title>{label}</title>
      <defs>
        <linearGradient id={`${id}-body`} x1="-70" y1="-80" x2="70" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c8e4ff" />
          <stop offset="38%" stopColor="#62abff" />
          <stop offset="72%" stopColor="#2f7cf3" />
          <stop offset="100%" stopColor="#1b4fcf" />
        </linearGradient>
        <radialGradient id={`${id}-sheen`} cx="-38" cy="-42" r="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-aura`}>
          <stop offset="40%" stopColor="#4f8ef7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle ref={glow} cx="0" cy="4" r="124" fill={`url(#${id}-aura)`} opacity="0.45" pointerEvents="none" />
      <ellipse cx="-2" cy="108" rx="70" ry="9" fill="#0d1f5c" opacity="0.1" />
      <g ref={body}>
        <path d={cloudPath} fill={`url(#${id}-body)`} />
        <path d={cloudPath} fill={`url(#${id}-sheen)`} />
        {restingEyes.map(([x, y], i) => (
          <g key={i} ref={eyes[i]} transform={`translate(${x} ${y})`}>
            <rect ref={pills[i]} x={-6.2} y={-17.2} width={12.4} height={34.4} rx={6.2} fill="#0c1431" />
            <path
              ref={arcs[i]}
              d="M -10.4 -6.2 A 12 12 0 0 1 10.4 -6.2"
              transform="translate(0 8.4)"
              fill="none"
              stroke="#0c1431"
              strokeWidth={8.4}
              strokeLinecap="round"
              opacity={0}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
