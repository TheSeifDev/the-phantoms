/**
 * Decides whether RAFIQ's WebGL body is worth starting on this device, and when.
 *
 * The SVG face is a complete, interactive RAFIQ, so the 3D renderer is a progressive
 * enhancement: it is skipped on devices that would struggle (Save-Data, 2G, ≤2 GB RAM,
 * ≤2 cores, or a software-only WebGL implementation) and otherwise started only once the page
 * has loaded and the main thread is idle, so it never competes with first paint or input.
 *
 * QA override: localStorage["rafiq:3d"] = "force" (always 3D, even software GL) or "off".
 */
type Preference = "force" | "off" | "auto";
type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function rafiq3DPreference(): Preference {
  try {
    const value = window.localStorage.getItem("rafiq:3d");
    return value === "force" || value === "off" ? value : "auto";
  } catch {
    return "auto";
  }
}

let probed: boolean | null = null;

/** Hardware-accelerated WebGL2 only: a software rasteriser would cost more than the SVG face. */
function acceleratedWebGL2(): boolean {
  if (probed !== null) return probed;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true, powerPreference: "low-power" });
    probed = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    probed = false;
  }
  return probed;
}

export function shouldUseRafiq3D(): boolean {
  if (typeof window === "undefined") return false;
  const preference = rafiq3DPreference();
  if (preference === "force") return true;
  if (preference === "off") return false;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return false;
  if (/(^|-)2g$/.test(nav.connection?.effectiveType ?? "")) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 2) return false;
  return acceleratedWebGL2();
}

/** Software GL is only accepted when QA forces 3D (headless browsers have no GPU). */
export function allowSoftwareWebGL(): boolean {
  return typeof window !== "undefined" && rafiq3DPreference() === "force";
}

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/**
 * Runs `callback` after the load event, a short settle window after it (lets the hero entrance
 * play without a hitch) and then the next idle period. Avatars revealed later in the visit only
 * wait for idle time. Returns a cancel function.
 */
export function whenPageIdle(callback: () => void, { settleMs = 1200, timeoutMs = 2000 } = {}): () => void {
  const win = window as IdleWindow;
  let cancelled = false;
  let timer: number | undefined;
  let idle: number | undefined;
  const fire = () => { if (!cancelled) callback(); };
  const afterSettle = () => {
    if (cancelled) return;
    if (win.requestIdleCallback) idle = win.requestIdleCallback(fire, { timeout: timeoutMs });
    else timer = window.setTimeout(fire, 0);
  };
  const afterLoad = () => {
    if (cancelled) return;
    const navigation = performance.getEntriesByType?.("navigation")[0] as PerformanceNavigationTiming | undefined;
    const loadedAt = navigation?.loadEventEnd || performance.now();
    timer = window.setTimeout(afterSettle, Math.max(0, settleMs - (performance.now() - loadedAt)));
  };
  if (document.readyState === "complete") afterLoad();
  else window.addEventListener("load", afterLoad, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", afterLoad);
    if (timer !== undefined) window.clearTimeout(timer);
    if (idle !== undefined) win.cancelIdleCallback?.(idle);
  };
}
