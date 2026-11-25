"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * OMNI swarm — small glossy hex "microbots" that morph scatter → wave → sphere.
 * Each bot orients to the formation surface so the shapes read clearly.
 * `progress` (0..1) is read from a ref so scroll can drive it without re-renders.
 */
export default function SwarmScene({
  progress,
  className = "",
  count,
}: {
  progress?: { current: number };
  className?: string;
  count?: number;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;
    const N = count ?? (small ? 520 : 1100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.4, 10.5);
    camera.lookAt(0, 0, 0);

    const rim = new THREE.PointLight(0xff2a1a, 30, 22);
    rim.position.set(4, 2.5, -4);
    scene.add(rim);
    const fillL = new THREE.DirectionalLight(0xffffff, 0.9);
    fillL.position.set(-4, 5, 4);
    scene.add(fillL);

    // hex prism, face pointing +Z
    const geo = new THREE.CylinderGeometry(0.12, 0.12, 0.045, 6);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.15,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    // formations
    const scatter = new Float32Array(N * 3);
    const wave = new Float32Array(N * 3);
    const sphere = new Float32Array(N * 3);
    const qScatter: THREE.Quaternion[] = [];
    const qSphere: THREE.Quaternion[] = [];
    const qWave = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    const cols = Math.round(Math.sqrt(N * 1.75));
    const rows = Math.ceil(N / cols);
    const R = 2.35;
    const zAxis = new THREE.Vector3(0, 0, 1);
    for (let i = 0; i < N; i++) {
      // scatter: loose elongated cloud
      scatter[i * 3] = (Math.random() - 0.5) * 11;
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 6;
      qScatter.push(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28)));
      // wave: sheet
      wave[i * 3] = ((i % cols) / (cols - 1) - 0.5) * 9.6;
      wave[i * 3 + 1] = -0.6;
      wave[i * 3 + 2] = (Math.floor(i / cols) / Math.max(1, rows - 1) - 0.5) * 5.2;
      // sphere: fibonacci, faces outward
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const th = Math.PI * (1 + Math.sqrt(5)) * k;
      const v = new THREE.Vector3(Math.cos(th) * Math.sin(phi), Math.cos(phi), Math.sin(th) * Math.sin(phi));
      sphere[i * 3] = v.x * R;
      sphere[i * 3 + 1] = v.y * R;
      sphere[i * 3 + 2] = v.z * R;
      qSphere.push(new THREE.Quaternion().setFromUnitVectors(zAxis, v));
    }
    const cur = new Float32Array(scatter);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const q2 = new THREE.Quaternion();
    const sc = new THREE.Vector3();
    const p = new THREE.Vector3();
    const base = new THREE.Color(0x24252b);
    const hot = new THREE.Color(0xff2a1a);
    const c = new THREE.Color();

    let fit = 1;
    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fit = Math.min(1, (w / h) / 1.55);
      mesh.scale.setScalar(Math.max(0.55, fit));
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const mouse = new THREE.Vector2();
    const sm = new THREE.Vector2();
    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -(((ev.clientY - r.top) / r.height) * 2 - 1));
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
      const prog = reduce ? 0.9 : progress ? progress.current : (Math.sin(t * 0.22 - 1.2) + 1) / 2;
      const toWave = THREE.MathUtils.smoothstep(prog, 0.05, 0.45);
      const toSphere = THREE.MathUtils.smoothstep(prog, 0.55, 0.95);
      sm.lerp(mouse, 0.06);
      const pulseR = ((t * 1.1) % 3.2) * 1.15; // ring travelling over the sphere

      for (let i = 0; i < N; i++) {
        const ix = i * 3;
        // position
        let tx = THREE.MathUtils.lerp(scatter[ix], wave[ix], toWave);
        let ty = THREE.MathUtils.lerp(scatter[ix + 1], wave[ix + 1], toWave);
        let tz = THREE.MathUtils.lerp(scatter[ix + 2], wave[ix + 2], toWave);
        const rip = Math.sin(wave[ix] * 0.8 + t * 1.5) * 0.4 + Math.cos(wave[ix + 2] * 1.0 + t * 1.2) * 0.3;
        ty += rip * toWave * (1 - toSphere);
        tx = THREE.MathUtils.lerp(tx, sphere[ix], toSphere);
        ty = THREE.MathUtils.lerp(ty, sphere[ix + 1], toSphere);
        tz = THREE.MathUtils.lerp(tz, sphere[ix + 2], toSphere);
        const drift = (1 - toWave) * 0.22;
        tx += Math.sin(t * 0.6 + i) * drift;
        ty += Math.cos(t * 0.5 + i * 1.3) * drift;
        const k = 0.075;
        cur[ix] += (tx - cur[ix]) * k;
        cur[ix + 1] += (ty - cur[ix + 1]) * k;
        cur[ix + 2] += (tz - cur[ix + 2]) * k;
        p.set(cur[ix], cur[ix + 1], cur[ix + 2]);

        // orientation
        q.copy(qScatter[i]);
        q2.setFromAxisAngle(zAxis, t * 0.4 + i);
        q.multiply(q2);
        q.slerp(qWave, toWave);
        q.slerp(qSphere[i], toSphere);

        const s = 0.8 + 0.2 * toWave + 0.12 * toSphere + Math.sin(i * 1.7 + t) * 0.04;
        sc.set(s, s, s);
        m.compose(p, q, sc);
        mesh.setMatrixAt(i, m);

        // colour: graphite with a red pulse travelling through the formation
        const d = Math.hypot(p.x, p.y, p.z);
        const pulse = Math.max(0, 1 - Math.abs(d - pulseR) * 1.6) * (0.25 + toSphere * 0.75);
        const spark = Math.pow(Math.max(0, Math.sin(t * 0.8 + i * 12.9898)), 28) * 0.7;
        c.copy(base).lerp(hot, Math.min(1, pulse * 0.9 + spark));
        mesh.setColorAt(i, c);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.rotation.y = t * 0.1 * (0.3 + toSphere) + sm.x * 0.45;
      mesh.rotation.x = -sm.y * 0.2 + 0.12;
      rim.position.x = 4 + Math.sin(t * 0.7) * 1.5;
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
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress, count]);

  return <div ref={host} className={`absolute inset-0 ${className}`} aria-hidden />;
}
