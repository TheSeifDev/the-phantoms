"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * OMNI swarm — instanced hex "microbots" that morph between
 * scatter → wave sheet → sphere. `progress` (0..1) is read from a ref
 * so the pinned scroll can drive it without re-rendering React.
 */
export default function SwarmScene({
  progress,
  className = "",
}: {
  progress?: { current: number };
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.2, 9.5);
    camera.lookAt(0, 0, 0);

    const N = window.innerWidth < 768 ? 900 : 2200;
    const geo = new THREE.CylinderGeometry(0.075, 0.075, 0.04, 6);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x16161a,
      metalness: 0.85,
      roughness: 0.28,
      emissive: 0xff1a10,
      emissiveIntensity: 0.06,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.PointLight(0xff2418, 60, 30);
    key.position.set(3, 3, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 28, 30);
    rim.position.set(-5, 2, -3);
    scene.add(rim);

    // pre-compute the three formations
    const scatter = new Float32Array(N * 3);
    const wave = new Float32Array(N * 3);
    const sphere = new Float32Array(N * 3);
    const cols = Math.ceil(Math.sqrt(N * 1.8));
    const rows = Math.ceil(N / cols);
    for (let i = 0; i < N; i++) {
      scatter[i * 3] = (Math.random() - 0.5) * 18;
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 9;
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const cx = i % cols;
      const cy = Math.floor(i / cols);
      wave[i * 3] = (cx / cols - 0.5) * 15;
      wave[i * 3 + 1] = 0;
      wave[i * 3 + 2] = (cy / rows - 0.5) * 8;
      // fibonacci sphere
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const th = Math.PI * (1 + Math.sqrt(5)) * k;
      const R = 2.8;
      sphere[i * 3] = Math.cos(th) * Math.sin(phi) * R;
      sphere[i * 3 + 1] = Math.cos(phi) * R;
      sphere[i * 3 + 2] = Math.sin(th) * Math.sin(phi) * R;
    }
    const cur = new Float32Array(scatter);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const sc = new THREE.Vector3();
    const p = new THREE.Vector3();

    const layout = () => {
      renderer.setSize(el.clientWidth, el.clientHeight, false);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const mouse = new THREE.Vector2(0, 0);
    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -(((ev.clientY - r.top) / r.height) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([x]) => (visible = x.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      const prog = reduce ? 0.6 : progress ? progress.current : (Math.sin(t * 0.18) + 1) / 2;
      // 0 → scatter, .5 → wave, 1 → sphere
      const toWave = THREE.MathUtils.smoothstep(prog, 0, 0.5);
      const toSphere = THREE.MathUtils.smoothstep(prog, 0.5, 1);

      for (let i = 0; i < N; i++) {
        const ix = i * 3;
        let tx = THREE.MathUtils.lerp(scatter[ix], wave[ix], toWave);
        let ty = THREE.MathUtils.lerp(scatter[ix + 1], wave[ix + 1], toWave);
        let tz = THREE.MathUtils.lerp(scatter[ix + 2], wave[ix + 2], toWave);
        // wave ripple (only meaningful when waved)
        const rip = Math.sin(wave[ix] * 0.9 + t * 1.4) * 0.55 + Math.cos(wave[ix + 2] * 1.1 + t * 1.1) * 0.35;
        ty += rip * toWave * (1 - toSphere);
        tx = THREE.MathUtils.lerp(tx, sphere[ix], toSphere);
        ty = THREE.MathUtils.lerp(ty, sphere[ix + 1], toSphere);
        tz = THREE.MathUtils.lerp(tz, sphere[ix + 2], toSphere);
        // idle drift on scatter
        const drift = (1 - toWave) * 0.35;
        tx += Math.sin(t * 0.6 + i) * drift;
        ty += Math.cos(t * 0.5 + i * 1.3) * drift;

        cur[ix] += (tx - cur[ix]) * 0.07;
        cur[ix + 1] += (ty - cur[ix + 1]) * 0.07;
        cur[ix + 2] += (tz - cur[ix + 2]) * 0.07;

        p.set(cur[ix], cur[ix + 1], cur[ix + 2]);
        e.set(t * 0.2 + i * 0.01, Math.atan2(p.x, p.z) + (1 - toSphere) * 0.4, i * 0.37);
        q.setFromEuler(e);
        const s = 0.85 + 0.35 * toSphere + 0.2 * Math.sin(i + t);
        sc.set(s, s, s);
        m.compose(p, q, sc);
        mesh.setMatrixAt(i, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.rotation.y = t * 0.08 + mouse.x * 0.35 * (0.4 + toSphere);
      mesh.rotation.x = -mouse.y * 0.18;
      mat.emissiveIntensity = 0.06 + toSphere * 0.12 + Math.sin(t * 2) * 0.02;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      mesh.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress]);

  return <div ref={host} className={`absolute inset-0 ${className}`} aria-hidden />;
}
