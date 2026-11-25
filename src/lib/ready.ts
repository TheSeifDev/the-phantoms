"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __phantomsReady?: boolean;
  }
}

export const signalReady = () => {
  window.__phantomsReady = true;
  window.dispatchEvent(new Event("phantoms:ready"));
};

/** true once the preloader has finished (or was skipped) */
export function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.__phantomsReady) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener("phantoms:ready", on, { once: true });
    return () => window.removeEventListener("phantoms:ready", on);
  }, []);
  return ready;
}
