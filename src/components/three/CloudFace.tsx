"use client";

import { RafiqFace } from "@/components/rafiq";

export type FaceState = "idle" | "listening" | "thinking" | "happy";

export interface CloudFaceProps {
  state?: FaceState;
  className?: string;
  interactive?: boolean;
}

/**
 * Legacy Flagship-facing API for RAFIQ. The real product face now owns both the SVG-first
 * fallback and the shader enhancement; this adapter only preserves old imports and state names.
 */
export default function CloudFace({ state = "idle", className = "", interactive = true }: CloudFaceProps) {
  return <RafiqFace state={state} className={className} interactive={interactive} />;
}
