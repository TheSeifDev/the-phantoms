export type RafiqPointerKind = "mouse" | "touch" | "pen";
export type RafiqPointer = {
  x: number;
  y: number;
  active: boolean;
  movedAt: number;
  /** When the last touch was lifted (ms, performance.now). Touch gaze lingers briefly after it. */
  releasedAt: number;
  kind: RafiqPointerKind;
};

const pointer: RafiqPointer = { x: 0, y: 0, active: false, movedAt: 0, releasedAt: -1e9, kind: "mouse" };
/** How long RAFIQ keeps looking at the last touch point after the finger lifts. */
export const TOUCH_LINGER_MS = 1400;
let subscribers = 0;
let detach: (() => void) | undefined;
let activeTouchId: number | null = null;

function setPointer(event: PointerEvent, kind: RafiqPointerKind) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
  pointer.movedAt = performance.now();
  pointer.kind = kind;
}

/** One passive viewport listener shared by all mascot instances. No React state. */
export function subscribeRafiqPointer() {
  subscribers += 1;
  if (subscribers === 1) {
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        if (activeTouchId === event.pointerId && event.isPrimary) setPointer(event, "touch");
        return;
      }
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        setPointer(event, event.pointerType);
      }
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        if (activeTouchId === null && event.isPrimary) {
          activeTouchId = event.pointerId;
          setPointer(event, "touch");
        }
        return;
      }
      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        setPointer(event, event.pointerType);
      }
    };
    const release = (event: PointerEvent) => {
      if (event.pointerType === "touch" && activeTouchId === event.pointerId) {
        activeTouchId = null;
        pointer.active = false;
        pointer.releasedAt = performance.now();
      }
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget && pointer.kind !== "touch") resetRafiqPointer();
    };
    const blur = () => resetRafiqPointer();
    const visibility = () => { if (document.hidden) resetRafiqPointer(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", visibility);
    detach = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
      resetRafiqPointer();
    };
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    subscribers -= 1;
    if (subscribers === 0) { detach?.(); detach = undefined; }
  };
}

export function getRafiqPointer(): Readonly<RafiqPointer> { return pointer; }

/** True while a mouse/pen is over the page, a finger is down, or a touch was just lifted. */
export function isRafiqPointerTracking(now = performance.now()) {
  return pointer.active || (pointer.kind === "touch" && now - pointer.releasedAt < TOUCH_LINGER_MS);
}

export function resetRafiqPointer() {
  activeTouchId = null;
  pointer.x = 0;
  pointer.y = 0;
  pointer.active = false;
  pointer.movedAt = 0;
  pointer.releasedAt = -1e9;
  pointer.kind = "mouse";
}
