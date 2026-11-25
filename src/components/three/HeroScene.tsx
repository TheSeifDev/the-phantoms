"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Hero background: a handful of glossy hex prisms with thin glowing red edges,
 * reflecting a studio environment. Pointer + scroll parallax, nothing busy.
 */
const SPOTS: [number, number, number, number][] = [
  // nx, ny (screen space -1..1), z, size
  [-0.88, 0.5, -1.0, 1.15],
  [-0.66, -0.72, 0.5, 0.55],
  [0.9, 0.58, -0.5, 0.9],
  [0.74, -0.48, 0.8, 1.2],
  [-0.97, -0.12, 1.4, 0.4],
  [0.46, 0.9, 0.2, 0.42],
  [-0.3, -0.98, -0.8, 0.62],
  [0.98, 0.0, -2.0, 0.5],
];

export default function HeroScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const key = new THREE.DirectionalLight(0xff3a28, 2.2);
    key.position.set(4, 5, 6);
    scene.add(key);

    const bodyGeo = new THREE.CylinderGeometry(1, 1, 0.34, 6);
    const edgeGeo = new THREE.EdgesGeometry(bodyGeo, 20);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x15151a,
      metalness: 0.85,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.1,
    });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xff2a1a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });

    const group = new THREE.Group();
    scene.add(group);
    const items: { g: THREE.Group; base: THREE.Vector2; z: number; s: number; spin: THREE.Vector3; ph: number }[] = [];
    SPOTS.slice(0, small ? 5 : SPOTS.length).forEach(([nx, ny, z, s], i) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(bodyGeo, bodyMat));
      g.add(new THREE.LineSegments(edgeGeo, edgeMat));
      g.scale.setScalar(s);
      g.rotation.set(1.05 + i * 0.12, 0.2 * i, 0.3 * i);
      group.add(g);
      items.push({
        g,
        base: new THREE.Vector2(nx, ny),
        z,
        s,
        spin: new THREE.Vector3(0.05 + (i % 3) * 0.03, 0.12 - (i % 2) * 0.05, 0.04),
        ph: i * 1.7,
      });
    });

    let aspect = 1;
    const place = () => {
      const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.position.z - 0);
      const w = h * aspect;
      items.forEach((it) => it.g.position.set(it.base.x * (w / 2), it.base.y * (h / 2), it.z));
    };
    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      place();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const mouse = new THREE.Vector2();
    const smooth = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      mouse.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([x]) => (visible = x.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      smooth.lerp(mouse, 0.05);
      const sy = window.scrollY / window.innerHeight;
      items.forEach((it) => {
        if (!reduce) {
          it.g.rotation.x += it.spin.x * 0.012;
          it.g.rotation.y += it.spin.y * 0.012;
        }
        it.g.position.y += (Math.sin(t * 0.6 + it.ph) * 0.0022) * (1 + it.s);
        it.g.position.z = it.z + sy * (1.5 + it.s) * 1.2;
      });
      camera.position.x = smooth.x * 0.6;
      camera.position.y = smooth.y * 0.35 - sy * 0.8;
      camera.lookAt(0, -sy * 0.5, 0);
      edgeMat.opacity = 0.75 + Math.sin(t * 1.6) * 0.18;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      bodyGeo.dispose();
      edgeGeo.dispose();
      bodyMat.dispose();
      edgeMat.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={`absolute inset-0 ${className}`} aria-hidden />;
}
