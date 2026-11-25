"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Hero background — a restrained hexagonal tunnel. Concentric flat frames stream towards the
 * camera (speed reacts to scroll) and turn gently with pointer movement. No glow textures or bloom.
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
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x9a302b,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    });
    const rings: { core: THREE.Mesh; g: THREE.Group; z: number; k: number }[] = [];
    const tunnel = new THREE.Group();
    scene.add(tunnel);
    for (let i = 0; i < RINGS; i++) {
      const g = new THREE.Group();
      const core = new THREE.Mesh(coreGeo, coreMat.clone());
      g.add(core);
      g.scale.setScalar(R);
      g.position.z = 4 - i * GAP;
      tunnel.add(g);
      rings.push({ core, g, z: 4 - i * GAP, k: i });
    }

    let renderStatic: (() => void) | null = null;
    let aspect = 1;
    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      aspect = w / h;
      camera.aspect = aspect;
      // keep the hex tunnel framed on tall (mobile) viewports
      camera.fov = aspect < 0.8 ? 72 : 50;
      camera.updateProjectionMatrix();
      renderStatic?.();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const mouse = new THREE.Vector2();
    const smooth = new THREE.Vector2();
    const onMove = (e: PointerEvent) => mouse.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    let visible = true;
    const io = new IntersectionObserver(([x]) => (visible = x.isIntersecting));
    io.observe(el);

    const root = document.documentElement;
    let lightMode = false;
    const applyMode = () => {
      const l = root.classList.contains("light");
      if (l === lightMode) return;
      lightMode = l;
      rings.forEach((r) => {
        const material = r.core.material as THREE.MeshBasicMaterial;
        material.color.set(l ? 0x8f2a22 : 0x9a302b);
        material.needsUpdate = true;
      });
    };
    applyMode();

    const themeObserver = new MutationObserver(() => {
      const wasLight = lightMode;
      applyMode();
      if (reduce && wasLight !== lightMode) renderStatic?.();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });

    const drawStatic = () => {
      applyMode();
      const strength = lightMode ? 0.3 : 0.28;
      rings.forEach((r) => {
        r.g.position.z = r.z;
        r.g.rotation.z = (r.z / LEN) * 0.9;
        const depth = Math.min(1, Math.max(0, (4.6 - r.z) / LEN));
        const nearFade = Math.min(1, (4.6 - r.z) / 5);
        const far = Math.pow(1 - depth, 0.8);
        const wave = 0.55 + 0.45 * Math.sin(-r.k * 0.5);
        (r.core.material as THREE.MeshBasicMaterial).opacity = (0.38 + 0.08 * wave) * far * nearFade * strength;
      });
      tunnel.rotation.z = 0;
      camera.position.set(0, 0, 6);
      camera.lookAt(0, 0, -20);
      renderer.render(scene, camera);
    };
    renderStatic = drawStatic;

    let raf = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let lastY = window.scrollY;
    let boost = 0;
    const loop = () => {
      if (reduce) {
        drawStatic();
        return;
      }
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!visible || document.hidden) return;
      applyMode();
      elapsed += dt;
      const t = elapsed;
      const y = window.scrollY;
      boost += (Math.min(Math.abs(y - lastY) * 0.06, 14) - boost) * 0.08;
      lastY = y;
      smooth.lerp(mouse, 0.025);
      const speed = 0.9 + boost * 0.5;
      const strength = lightMode ? 0.3 : 0.28;
      rings.forEach((r) => {
        r.z += speed * dt;
        if (r.z > 4.6) r.z -= LEN;
        r.g.position.z = r.z;
        r.g.rotation.z = (r.z / LEN) * 0.9 + t * 0.025;
        const depth = Math.min(1, Math.max(0, (4.6 - r.z) / LEN)); // 0 near → 1 far
        const nearFade = Math.min(1, (4.6 - r.z) / 5);
        const far = Math.pow(1 - depth, 0.8);
        const wave = 0.55 + 0.45 * Math.sin(t * 0.6 - r.k * 0.5);
        (r.core.material as THREE.MeshBasicMaterial).opacity = (0.38 + 0.08 * wave) * far * nearFade * strength;
      });
      tunnel.rotation.z = smooth.x * -0.08;
      camera.position.x = smooth.x * 0.7;
      camera.position.y = smooth.y * 0.45;
      camera.lookAt(smooth.x * -0.6, smooth.y * -0.35, -20);
      renderer.render(scene, camera);
    };
    if (reduce) drawStatic();
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      if (!reduce) window.removeEventListener("pointermove", onMove);
      coreGeo.dispose();
      coreMat.dispose();
      rings.forEach((r) => (r.core.material as THREE.Material).dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={`absolute inset-0 ${className}`} aria-hidden />;
}
