"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero background — a glowing hexagonal tunnel. Concentric hex frames stream towards the
 * camera (speed reacts to scroll), twist slightly, pulse in waves and converge on a red light
 * core. Calm: slow, dim, no foreground objects. Pointer steers the camera.
 */
const hexShape = (r: number, hole: number) => {
  const pts = (k: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3 + Math.PI / 6;
      return new THREE.Vector2(Math.cos(a) * k, Math.sin(a) * k);
    });
  const s = new THREE.Shape(pts(r));
  s.holes.push(new THREE.Path(pts(hole)));
  return s;
};

function glowTexture(kind: "radial" | "beam") {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  if (kind === "radial") {
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, "rgba(255,120,70,1)");
    gr.addColorStop(0.18, "rgba(255,50,30,.7)");
    gr.addColorStop(0.5, "rgba(255,30,20,.18)");
    gr.addColorStop(1, "rgba(255,20,10,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
  } else {
    const gr = g.createLinearGradient(0, 0, 256, 0);
    gr.addColorStop(0, "rgba(255,40,20,0)");
    gr.addColorStop(0.5, "rgba(255,110,60,1)");
    gr.addColorStop(1, "rgba(255,40,20,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export default function HeroScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
    camera.position.set(0, 0, 6);

    /* ── tunnel ── */
    const RINGS = small ? 12 : 18;
    const GAP = 2.5;
    const LEN = RINGS * GAP;
    const R = 5.4;
    const coreGeo = new THREE.ShapeGeometry(hexShape(1, 0.972));
    const haloGeo = new THREE.ShapeGeometry(hexShape(1.05, 0.93));
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xff3a22, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xff1a10, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const rings: { core: THREE.Mesh; halo: THREE.Mesh; g: THREE.Group; z: number; k: number }[] = [];
    const tunnel = new THREE.Group();
    scene.add(tunnel);
    for (let i = 0; i < RINGS; i++) {
      const g = new THREE.Group();
      const core = new THREE.Mesh(coreGeo, coreMat.clone());
      const halo = new THREE.Mesh(haloGeo, haloMat.clone());
      g.add(halo, core);
      g.scale.setScalar(R);
      g.position.z = 4 - i * GAP;
      tunnel.add(g);
      rings.push({ core, halo, g, z: 4 - i * GAP, k: i });
    }
    // light core + beam at the end of the tunnel
    const glowMat = new THREE.SpriteMaterial({ map: glowTexture("radial"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.95 });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(34, 34, 1);
    glow.position.z = -LEN + 4;
    scene.add(glow);
    const beamMat = new THREE.MeshBasicMaterial({ map: glowTexture("beam"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.08 });
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 60), beamMat);
    beam.position.z = -LEN + 6;
    scene.add(beam);

    let aspect = 1;
    const place = () => {
    };
    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      aspect = w / h;
      camera.aspect = aspect;
      // keep the hex tunnel framed on tall (mobile) viewports
      camera.fov = aspect < 0.8 ? 72 : 50;
      camera.updateProjectionMatrix();
      place();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const mouse = new THREE.Vector2();
    const smooth = new THREE.Vector2();
    const onMove = (e: PointerEvent) => mouse.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    window.addEventListener("pointermove", onMove, { passive: true });
    let visible = true;
    const io = new IntersectionObserver(([x]) => (visible = x.isIntersecting));
    io.observe(el);

    const root = document.documentElement;
    let lightMode = false;
    const applyMode = () => {
      const l = root.classList.contains("light");
      if (l === lightMode) return;
      lightMode = l;
      const blend = l ? THREE.NormalBlending : THREE.AdditiveBlending;
      rings.forEach((r) => {
        (r.core.material as THREE.MeshBasicMaterial).blending = blend;
        (r.halo.material as THREE.MeshBasicMaterial).blending = blend;
        (r.core.material as THREE.MeshBasicMaterial).color.set(l ? 0xe5180c : 0xff3a22);
        (r.halo.material as THREE.MeshBasicMaterial).color.set(l ? 0xff5a48 : 0xff1a10);
        (r.core.material as THREE.Material).needsUpdate = true;
        (r.halo.material as THREE.Material).needsUpdate = true;
      });
      glowMat.blending = blend;
      beamMat.blending = blend;
      glowMat.needsUpdate = true;
      beamMat.needsUpdate = true;
    };
    applyMode();

    const clock = new THREE.Clock();
    let raf = 0;
    let lastY = window.scrollY;
    let boost = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      applyMode();
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const y = window.scrollY;
      boost += (Math.min(Math.abs(y - lastY) * 0.06, 14) - boost) * 0.08;
      lastY = y;
      smooth.lerp(mouse, 0.025);
      const speed = reduce ? 0 : 0.9 + boost * 0.5;
      const lm = lightMode ? 0.34 : 0.3;
      rings.forEach((r) => {
        r.z += speed * dt;
        if (r.z > 4.6) r.z -= LEN;
        r.g.position.z = r.z;
        r.g.rotation.z = (r.z / LEN) * 0.9 + t * 0.04;
        const depth = Math.min(1, Math.max(0, (4.6 - r.z) / LEN)); // 0 near → 1 far
        const nearFade = Math.min(1, (4.6 - r.z) / 5);
        const far = Math.pow(1 - depth, 0.8);
        const wave = 0.55 + 0.45 * Math.sin(t * 0.9 - r.k * 0.5);
        (r.core.material as THREE.MeshBasicMaterial).opacity = (0.1 + 0.9 * wave) * far * nearFade * lm;
        (r.halo.material as THREE.MeshBasicMaterial).opacity = (0.06 + 0.2 * wave) * far * nearFade * lm;
      });
      glow.material.opacity = (0.5 + Math.sin(t * 0.8) * 0.06) * (lightMode ? 0.4 : 0.8);
      tunnel.rotation.z = smooth.x * -0.08;
      camera.position.x = smooth.x * 0.7;
      camera.position.y = smooth.y * 0.45;
      camera.lookAt(smooth.x * -0.6, smooth.y * -0.35, -20);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      [coreGeo, haloGeo, beam.geometry].forEach((g) => g.dispose());
      [coreMat, haloMat, glowMat, beamMat].forEach((m) => m.dispose());
      rings.forEach((r) => {
        (r.core.material as THREE.Material).dispose();
        (r.halo.material as THREE.Material).dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={`absolute inset-0 ${className}`} aria-hidden />;
}
