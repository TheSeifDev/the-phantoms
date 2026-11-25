/**
 * RAFIQ behaviour model — pure, renderer-agnostic and deterministic (inject `random` for tests).
 *
 * RAFIQ has NO mouth, nose or other facial features. Personality lives in two dark capsule eyes,
 * the cloud body and how both move. Coordinates are the cloud's object space: units of the
 * original 250×250 Grokbots viewBox, origin at the centre, **y up**.
 */

export type FaceState = "idle" | "listening" | "thinking" | "speaking" | "happy" | "alert";

export interface FaceInput {
  state: FaceState;
  /** Direction to the pointer from the character centre, each axis in [-1, 1], y up. */
  gaze: { x: number; y: number };
  /** True while a real pointer (mouse/pen/active touch) is being followed. */
  tracking: boolean;
  /** 0 far → 1 pointer right on the character. */
  near: number;
  /** Speech beat 0..1 from the TTS boundary events (SPEAKING only). */
  speech: number;
  /** Greeting impulse 0..1 (click / Enter on the character). */
  greet: number;
  reduced: boolean;
}

export interface EyeFrame {
  x: number;
  y: number;
  halfLength: number;
  radius: number;
  /** Radians, counter-clockwise (y-up space). */
  angle: number;
  widthScale: number;
  /** Includes blink openness. */
  heightScale: number;
  /** 0 capsule → 1 soft crescent "∩". */
  happy: number;
}

export interface BodyFrame {
  yaw: number;
  pitch: number;
  roll: number;
  leanX: number;
  leanY: number;
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
  wobble: number;
  glow: number;
}

export interface FaceFrame {
  eyes: [EyeFrame, EyeFrame];
  body: BodyFrame;
  gaze: { x: number; y: number };
  blink: number;
}

interface StateProfile {
  halfLength: number;
  radius: number;
  separation: number;
  eyeY: number;
  heightScale: number;
  happy: number;
  gazeGain: number;
  bodyGain: number;
  leanGain: number;
  float: number;
  floatSpeed: number;
  wobble: number;
  glow: number;
  glowPulse: number;
  glowSpeed: number;
  blinkMin: number;
  blinkMax: number;
  stiffness: number;
  /** A preferred look direction blended with the pointer (thinking glances up and aside). */
  bias: { x: number; y: number; weight: number };
}

export const STATE_PROFILES: Readonly<Record<FaceState, Readonly<StateProfile>>> = {
  idle: {
    halfLength: 11, radius: 6.2, separation: 22, eyeY: 8, heightScale: 1, happy: 0,
    gazeGain: 1, bodyGain: 1, leanGain: 1, float: 2.6, floatSpeed: 1.25, wobble: 0.5,
    glow: 0.16, glowPulse: 0.02, glowSpeed: 1.2, blinkMin: 2.6, blinkMax: 5.6, stiffness: 70,
    bias: { x: 0, y: 0, weight: 0 },
  },
  listening: {
    halfLength: 13, radius: 6.6, separation: 20.5, eyeY: 9, heightScale: 1.04, happy: 0,
    gazeGain: 1.12, bodyGain: 1.2, leanGain: 1.7, float: 1.7, floatSpeed: 1.05, wobble: 0.35,
    glow: 0.26, glowPulse: 0.07, glowSpeed: 1.6, blinkMin: 4, blinkMax: 8, stiffness: 95,
    bias: { x: 0, y: 0, weight: 0 },
  },
  thinking: {
    halfLength: 9.6, radius: 6, separation: 22, eyeY: 9.5, heightScale: 0.8, happy: 0,
    gazeGain: 0.45, bodyGain: 0.55, leanGain: 0.5, float: 1.5, floatSpeed: 0.8, wobble: 0.45,
    glow: 0.14, glowPulse: 0.05, glowSpeed: 0.9, blinkMin: 3, blinkMax: 6, stiffness: 42,
    bias: { x: 0.62, y: 0.72, weight: 0.68 },
  },
  speaking: {
    halfLength: 11.5, radius: 6.3, separation: 22, eyeY: 8, heightScale: 1, happy: 0,
    gazeGain: 0.85, bodyGain: 0.9, leanGain: 1, float: 1.9, floatSpeed: 1.4, wobble: 0.45,
    glow: 0.2, glowPulse: 0, glowSpeed: 1, blinkMin: 2.5, blinkMax: 5, stiffness: 80,
    bias: { x: 0, y: 0, weight: 0 },
  },
  happy: {
    halfLength: 10.5, radius: 6.2, separation: 23, eyeY: 11, heightScale: 1, happy: 1,
    gazeGain: 0.7, bodyGain: 0.8, leanGain: 0.8, float: 3, floatSpeed: 1.9, wobble: 0.6,
    glow: 0.24, glowPulse: 0.04, glowSpeed: 1.2, blinkMin: 4, blinkMax: 8, stiffness: 70,
    bias: { x: 0, y: 0, weight: 0 },
  },
  alert: {
    halfLength: 14.5, radius: 6.9, separation: 23.5, eyeY: 9, heightScale: 1.06, happy: 0,
    gazeGain: 1.15, bodyGain: 0.6, leanGain: 0.6, float: 0.5, floatSpeed: 0.8, wobble: 0.15,
    glow: 0.3, glowPulse: 0.11, glowSpeed: 2.2, blinkMin: 6, blinkMax: 10, stiffness: 120,
    bias: { x: 0, y: 0, weight: 0 },
  },
};

/** Eye travel across the face for a full-strength look, in object units. */
export const GAZE_SHIFT = { x: 15, y: 11 } as const;
/** Maximum eye tilt toward the pointer (radians, ≈17°). */
export const MAX_TILT = 0.3;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Frame-rate independent exponential approach. */
export function approach(current: number, target: number, dt: number, rate: number) {
  return target + (current - target) * Math.exp(-rate * Math.max(0, dt));
}

/**
 * Convert a pointer position into a soft, saturating look direction. Works anywhere in the
 * viewport: far pointers saturate smoothly toward length 1, the centre maps to 0.
 */
export function gazeFromPointer(dx: number, dyUp: number, size: number) {
  const s = Math.max(120, size) * 0.85;
  const len = Math.hypot(dx, dyUp);
  if (!len) return { x: 0, y: 0 };
  const m = len / Math.sqrt(len * len + s * s);
  return { x: (dx / len) * m * 1.08, y: (dyUp / len) * m * 1.08 };
}

type Scalars = Omit<StateProfile, "bias">;
const SCALAR_KEYS = Object.keys(STATE_PROFILES.idle).filter((k) => k !== "bias") as Array<keyof Scalars>;

export class RafiqFaceModel {
  private p: Scalars;
  private gaze = { x: 0, y: 0, vx: 0, vy: 0 };
  private bias = { x: 0, y: 0, weight: 0 };
  private wander = { x: 0, y: 0, next: 0 };
  private blinkStart = -1;
  private nextBlink: number;
  private doubleBlink = false;
  private time = 0;
  private near = 0;
  private speech = 0;
  private body = { yaw: 0, pitch: 0, roll: 0, leanX: 0, leanY: 0 };

  constructor(state: FaceState = "idle", private readonly random: () => number = Math.random) {
    this.p = { ...STATE_PROFILES[state] };
    this.bias = { ...STATE_PROFILES[state].bias };
    this.nextBlink = 1.6 + this.random() * 2.4;
  }

  update(dt: number, input: FaceInput): FaceFrame {
    const step = clamp(dt, 0, 0.1);
    this.time += step;
    const t = this.time;
    const target = STATE_PROFILES[input.state];
    const reduced = input.reduced;

    // State transitions are fluid: every scalar eases toward the new profile.
    const blendRate = reduced ? 14 : 6;
    for (const key of SCALAR_KEYS) this.p[key] = approach(this.p[key], target[key], step, blendRate);
    this.bias.x = approach(this.bias.x, target.bias.x, step, 4);
    this.bias.y = approach(this.bias.y, target.bias.y, step, 4);
    this.bias.weight = approach(this.bias.weight, target.bias.weight, step, 4);
    this.near = approach(this.near, input.tracking ? clamp(input.near, 0, 1) : 0, step, 5);
    this.speech = approach(this.speech, input.state === "speaking" ? clamp(input.speech, 0, 1) : 0, step, 18);

    // Where to look: the pointer, or a quiet idle wander when nobody is pointing.
    let lookX = 0;
    let lookY = 0;
    if (input.tracking) {
      lookX = clamp(input.gaze.x, -1, 1) * this.p.gazeGain;
      lookY = clamp(input.gaze.y, -1, 1) * this.p.gazeGain;
    } else if (!reduced) {
      if (t >= this.wander.next) {
        const rest = this.random() < 0.35;
        this.wander.x = rest ? 0 : (this.random() - 0.5) * 0.7;
        this.wander.y = rest ? 0 : (this.random() - 0.4) * 0.45;
        this.wander.next = t + 2.2 + this.random() * 3.2;
      }
      lookX = this.wander.x;
      lookY = this.wander.y;
    }
    if (this.bias.weight > 0.001) {
      const drift = reduced ? 0 : Math.sin(t * 0.9) * 0.12;
      lookX = lookX * (1 - this.bias.weight) + (this.bias.x + drift) * this.bias.weight;
      lookY = lookY * (1 - this.bias.weight) + (this.bias.y + drift * 0.5) * this.bias.weight;
    }
    lookX = clamp(lookX, -1.15, 1.15);
    lookY = clamp(lookY, -1.15, 1.15);

    if (reduced) {
      this.gaze.x = approach(this.gaze.x, lookX, step, 10);
      this.gaze.y = approach(this.gaze.y, lookY, step, 10);
      this.gaze.vx = 0;
      this.gaze.vy = 0;
    } else {
      // Slightly under-damped spring: organic settle with a whisper of overshoot.
      const k = this.p.stiffness;
      const c = 2 * Math.sqrt(k) * 0.8;
      this.gaze.vx += (k * (lookX - this.gaze.x) - c * this.gaze.vx) * step;
      this.gaze.vy += (k * (lookY - this.gaze.y) - c * this.gaze.vy) * step;
      this.gaze.x += this.gaze.vx * step;
      this.gaze.y += this.gaze.vy * step;
    }
    const gx = this.gaze.x;
    const gy = this.gaze.y;

    // Blinking (never under reduced motion).
    let open = 1;
    if (!reduced) {
      if (this.blinkStart < 0 && t >= this.nextBlink) {
        this.blinkStart = t;
        this.doubleBlink = this.random() < 0.16;
      }
      if (this.blinkStart >= 0) {
        const age = t - this.blinkStart;
        const length = this.doubleBlink ? 0.42 : 0.2;
        if (age < length) {
          const phase = this.doubleBlink ? (age % 0.21) / 0.21 : age / 0.2;
          open = 1 - Math.sin(Math.PI * clamp(phase, 0, 1)) * 0.93;
        } else {
          this.blinkStart = -1;
          this.nextBlink = t + this.p.blinkMin + this.random() * (this.p.blinkMax - this.p.blinkMin);
        }
      }
    }

    const speech = this.speech;
    const greet = clamp(input.greet, 0, 1);
    const happy = clamp(Math.max(this.p.happy, greet * 0.9), 0, 1);
    const focus = this.near * 0.12;
    const separation = this.p.separation * (1 - 0.1 * Math.abs(gx)) * (1 - focus);
    const halfLength = this.p.halfLength + speech * 1.1 + this.near * 0.6;
    const heightBase = this.p.heightScale * (1 - 0.1 * Math.max(0, -gy)) * (1 - speech * 0.2) * open;

    const eye = (side: -1 | 1): EyeFrame => {
      const toward = Math.max(0, side * gx);
      const away = Math.max(0, -side * gx);
      const asym = reduced ? 0 : Math.sin(t * 0.7 + side) * 0.012;
      return {
        x: side * separation + gx * GAZE_SHIFT.x,
        y: this.p.eyeY + gy * GAZE_SHIFT.y + (side === 1 ? 0.6 : 0),
        halfLength,
        radius: this.p.radius,
        angle: -gx * MAX_TILT + side * gy * 0.045 + asym,
        widthScale: 1 - 0.18 * toward + 0.04 * away,
        heightScale: heightBase,
        happy,
      };
    };

    // Body: turns toward the pointer, leans in, floats and breathes.
    const motion = reduced ? 0 : 1;
    const bodyRate = reduced ? 12 : 5.5;
    this.body.yaw = approach(this.body.yaw, motion * gx * 0.34 * this.p.bodyGain, step, bodyRate);
    this.body.pitch = approach(this.body.pitch, motion * -gy * 0.24 * this.p.bodyGain, step, bodyRate);
    const thinkingRoll = Math.sin(t * 0.7) * 0.035 * this.bias.weight;
    this.body.roll = approach(this.body.roll, motion * (-gx * 0.05 + thinkingRoll), step, bodyRate);
    this.body.leanX = approach(this.body.leanX, motion * gx * 6 * this.p.leanGain, step, bodyRate);
    this.body.leanY = approach(this.body.leanY, motion * gy * 3 * this.p.leanGain, step, bodyRate);
    const float = Math.sin(t * this.p.floatSpeed) * this.p.float;
    const happyLift = this.p.happy * (2 + Math.max(0, Math.sin(t * 2.1)) * 1.4);
    const breath = Math.sin(t * 1.55) * 0.006;
    const glowPulse = Math.sin(t * this.p.glowSpeed * Math.PI) * this.p.glowPulse;

    return {
      eyes: [eye(-1), eye(1)],
      body: {
        yaw: this.body.yaw,
        pitch: this.body.pitch,
        roll: this.body.roll,
        leanX: this.body.leanX,
        leanY: this.body.leanY,
        offsetX: motion * gx * 3,
        offsetY: motion * (float + happyLift + speech * 1.6 + greet * 4),
        scaleX: 1 + motion * (breath + this.near * 0.03 + greet * 0.03),
        scaleY: 1 + motion * (-breath * 0.6 + this.near * 0.03 + speech * 0.022 - greet * 0.015),
        wobble: motion * this.p.wobble,
        glow: Math.max(0.03, this.p.glow + this.near * 0.1 + greet * 0.08 + speech * 0.08 + (reduced ? 0 : glowPulse)),
      },
      gaze: { x: gx, y: gy },
      blink: open,
    };
  }
}
