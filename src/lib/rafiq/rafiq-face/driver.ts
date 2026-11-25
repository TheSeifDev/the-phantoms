/**
 * Shared per-instance driver for both RAFIQ renderers (WebGL and SVG fallback).
 * Reads the global pointer, speech beat and motion preference, owns the behaviour model and
 * produces one FaceFrame per tick. No React state, no per-frame allocations beyond the frame.
 */
import { gsap, reportMotionFailure } from "../gsap";
import { getRafiqPointer, isRafiqPointerTracking, subscribeRafiqPointer } from "../rafiq-pointer";
import { RafiqFaceModel, gazeFromPointer, type FaceFrame, type FaceState } from "./behavior";
import { readRafiqSpeech } from "./speech";

// One GSAP ticker callback dispatches every visible mascot — no per-instance RAF loops.
// Each callback is isolated: the same ticker also drives Lenis and every GSAP animation, so
// one failing mascot is detached instead of throwing out of the shared tick.
const frames = new Set<(time: number, deltaMs: number) => void>();
const tick = (time: number, deltaMs: number) => frames.forEach((frame) => {
  try {
    frame(time, deltaMs);
  } catch (error) {
    frames.delete(frame);
    if (!frames.size) gsap.ticker.remove(tick);
    reportMotionFailure("RAFIQ mascot frame", error);
  }
});
export function joinRafiqFrames(frame: (time: number, deltaMs: number) => void) {
  if (!frames.size) gsap.ticker.add(tick);
  frames.add(frame);
  return () => {
    frames.delete(frame);
    if (!frames.size) gsap.ticker.remove(tick);
  };
}

export interface FaceDriverStatus {
  state: FaceState;
  tracking: boolean;
  near: number;
  greet: number;
  speech: number;
  reduced: boolean;
}

export interface FaceDriver {
  step: (dtSeconds: number, rect: DOMRect) => FaceFrame;
  setState: (state: FaceState) => void;
  setInteractive: (interactive: boolean) => void;
  greet: () => void;
  /** Stop transient motion (greeting) — used when hidden or offscreen. */
  settle: () => void;
  readonly status: Readonly<FaceDriverStatus>;
  dispose: () => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function createFaceDriver(initialState: FaceState, initiallyInteractive: boolean): FaceDriver {
  const model = new RafiqFaceModel(initialState);
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const status: FaceDriverStatus = { state: initialState, tracking: false, near: 0, greet: 0, speech: 0, reduced: media.matches };
  let interactive = initiallyInteractive;
  let greetStart = -1;
  let clock = 0;
  const onMedia = () => { status.reduced = media.matches; };
  media.addEventListener("change", onMedia);
  const releasePointer = subscribeRafiqPointer();

  const greetEnvelope = (now: number) => {
    if (greetStart < 0) return 0;
    const age = (now - greetStart) / 1000;
    if (age < 0.16) return gsap.parseEase("power2.out")(age / 0.16);
    if (age < 0.7) return 1;
    if (age < 1.2) return 1 - gsap.parseEase("power2.inOut")((age - 0.7) / 0.5);
    greetStart = -1;
    return 0;
  };

  return {
    status,
    step(dt, rect) {
      const now = performance.now();
      clock += dt;
      const pointer = getRafiqPointer();
      const tracking = interactive && isRafiqPointerTracking(now) && rect.width > 0;
      let gaze = { x: 0, y: 0 };
      let near = 0;
      if (tracking) {
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dyUp = rect.top + rect.height / 2 - pointer.y;
        gaze = gazeFromPointer(dx, dyUp, rect.width);
        near = clamp(1 - Math.hypot(dx, dyUp) / (rect.width * 0.75), 0, 1);
      }
      let speech = 0;
      if (status.state === "speaking") {
        const real = readRafiqSpeech(now);
        // Without real audio (marketing previews) RAFIQ keeps a calm syllable-like rhythm.
        speech = real.speaking
          ? Math.max(real.beat, 0.14)
          : Math.max(0, Math.sin(clock * 7.4)) ** 2 * (0.55 + 0.45 * Math.sin(clock * 1.9));
      }
      const greet = status.reduced ? 0 : greetEnvelope(now);
      status.tracking = tracking;
      status.near = near;
      status.greet = greet;
      status.speech = speech;
      return model.update(dt, { state: status.state, gaze, tracking, near, speech, greet, reduced: status.reduced });
    },
    setState(state) { status.state = state; },
    setInteractive(value) { interactive = value; if (!value) greetStart = -1; },
    greet() {
      if (!interactive || status.reduced) return;
      const now = performance.now();
      if (greetStart >= 0 && now - greetStart < 1200) return;
      greetStart = now;
    },
    settle() { greetStart = -1; },
    dispose() {
      media.removeEventListener("change", onMedia);
      releasePointer();
    },
  };
}
