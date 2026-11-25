"use client";

import dynamic from "next/dynamic";

export const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });
export const SwarmScene = dynamic(() => import("@/components/three/SwarmScene"), { ssr: false });
