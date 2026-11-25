"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The Phantom sun: ~9k particles on a disc, swirling slowly,
 * repelled by the pointer, dispersing upward as the page scrolls.
 */
export default function HeroScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.z = 6;

    const N = window.innerWidth < 768 ? 5200 : 9000;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    const rad = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // bias to rim + core so it reads as a sun with a corona
      const t = Math.random();
      const r = t < 0.62 ? Math.sqrt(Math.random()) * 1.55 : 1.55 + Math.pow(Math.random(), 2.2) * 1.5;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2 * (r / 3);
      seed[i] = Math.random();
      rad[i] = r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.setAttribute("aRad", new THREE.BufferAttribute(rad, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uScroll: { value: 0 },
      uPixel: { value: renderer.getPixelRatio() },
      uIn: { value: reduce ? 1 : 0 },
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime, uScroll, uPixel, uIn;
        uniform vec2 uMouse;
        attribute float aSeed;
        attribute float aRad;
        varying float vHeat;
        varying float vSeed;
        void main(){
          vec3 p = position;
          float r = aRad;
          // swirl: inner spins faster
          float ang = uTime * (0.16 / (0.45 + r)) * (aSeed > 0.5 ? 1.0 : 0.6);
          float c = cos(ang), s = sin(ang);
          p.xy = mat2(c, -s, s, c) * p.xy;
          // breathing
          p.xy *= 1.0 + 0.025 * sin(uTime * 0.9 + r * 2.0);
          // intro: particles fly in from far
          float inn = smoothstep(0.0, 1.0, clamp(uIn * 1.25 - aSeed * 0.25, 0.0, 1.0));
          p.xy *= mix(2.4 + aSeed * 2.0, 1.0, inn);
          p.z += (1.0 - inn) * 3.0;
          // pointer repel
          vec2 d = p.xy - uMouse;
          float dist = length(d);
          float push = smoothstep(1.35, 0.0, dist);
          p.xy += normalize(d + 0.0001) * push * (0.55 + aSeed * 0.5);
          p.z += push * 0.6;
          // scroll dispersal (rise + scatter)
          p.y += uScroll * (1.4 + aSeed * 3.2);
          p.x += uScroll * (aSeed - 0.5) * 3.0;
          vHeat = 1.0 - smoothstep(0.0, 3.1, r);
          vSeed = aSeed;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (1.6 + aSeed * 2.8 + push * 3.0) * uPixel * (6.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vHeat;
        varying float vSeed;
        void main(){
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if(d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d);
          vec3 deep = vec3(0.70, 0.0, 0.02);
          vec3 red = vec3(1.0, 0.14, 0.09);
          vec3 hot = vec3(1.0, 0.62, 0.45);
          vec3 col = mix(deep, red, smoothstep(0.0, 0.45, vHeat + vSeed * 0.15));
          col = mix(col, hot, smoothstep(0.62, 1.0, vHeat));
          gl_FragColor = vec4(col, a * (0.35 + vHeat * 0.65));
        }
      `,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // faint orbit ring
    const ringGeo = new THREE.RingGeometry(3.28, 3.295, 160);
    const ring = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({ color: 0xff2418, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    );
    scene.add(ring);

    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // push the sun right on wide screens, center on narrow
      const wide = w > 900;
      points.position.x = ring.position.x = wide ? Math.min(2.5, w / 560) : 0;
      points.position.y = ring.position.y = wide ? 0 : 0.9;
      const s = wide ? 1 : Math.min(1, w / 520);
      points.scale.setScalar(s);
      ring.scale.setScalar(s);
      camera.updateProjectionMatrix();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const mouse = new THREE.Vector2(99, 99);
    const target = new THREE.Vector2(99, 99);
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      // project onto z=0 plane
      const vFov = (camera.fov * Math.PI) / 180;
      const h = 2 * Math.tan(vFov / 2) * camera.position.z;
      const w = h * camera.aspect;
      target.set(nx * (w / 2) - points.position.x, ny * (h / 2) - points.position.y);
      target.divideScalar(points.scale.x);
    };
    const onLeave = () => target.set(99, 99);
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(el);

    let raf = 0;
    const clock = new THREE.Clock();
    let intro = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const dt = clock.getDelta();
      uniforms.uTime.value += dt;
      if (intro < 1 && !reduce) {
        if (window.__phantomsReady) intro = Math.min(1, intro + dt / 2.4);
        uniforms.uIn.value = 1 - Math.pow(1 - intro, 3);
      }
      mouse.lerp(target, 0.09);
      uniforms.uMouse.value.copy(mouse);
      const sc = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
      uniforms.uScroll.value += (sc - uniforms.uScroll.value) * 0.08;
      points.rotation.y = Math.sin(uniforms.uTime.value * 0.2) * 0.12 + mouse.x * 0.01;
      ring.rotation.z = uniforms.uTime.value * 0.03;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      geo.dispose();
      mat.dispose();
      ringGeo.dispose();
      (ring.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={`absolute inset-0 ${className}`} aria-hidden />;
}
