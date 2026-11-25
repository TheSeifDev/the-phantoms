"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CLOUD_PATH } from "@/lib/cloudPath";

export type FaceState = "idle" | "listening" | "thinking" | "happy";

/**
 * RAFIQ's face — the same soft blue cloud used on rafiq-tech, rebuilt in 3D:
 * the SVG silhouette is extruded with a deep bevel so it reads like a pillow,
 * lit by a studio environment. Two pill eyes follow the cursor and blink.
 */
export default function CloudFace({
  state = "idle",
  className = "",
}: {
  state?: FaceState;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const stateRef = useRef<FaceState>(state);
  stateRef.current = state;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.03);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    camera.position.set(0, 0.1, 9.5);

    // soft key + blue fill
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-2.5, 4, 5);
    scene.add(key);
    const fill = new THREE.PointLight(0x5b9bff, 18, 14);
    fill.position.set(3, -1.5, 3);
    scene.add(fill);

    // ── cloud body ──
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${CLOUD_PATH}"/></svg>`;
    const data = new SVGLoader().parse(svg);
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const DEPTH = 26;
    const BT = 30; // bevel thickness
    const BS = 24; // bevel size
    let geo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(shapes, {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: BT,
      bevelSize: BS,
      bevelOffset: -BS,
      bevelSegments: 16,
      curveSegments: 40,
    });
    geo.deleteAttribute("normal");
    geo.deleteAttribute("uv");
    geo = mergeVertices(geo, 0.05);
    geo.computeVertexNormals();
    geo.translate(0, 0, -DEPTH / 2);
    geo.scale(1, -1, 1); // svg y is down
    // flipping y inverts winding → flip index order
    const idx = geo.getIndex();
    if (idx) {
      const a = idx.array as Uint16Array | Uint32Array;
      for (let i = 0; i < a.length; i += 3) {
        const t = a[i];
        a[i] = a[i + 2];
        a[i + 2] = t;
      }
      idx.needsUpdate = true;
      geo.computeVertexNormals();
    }
    // vertical blue gradient via vertex colours
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const top = new THREE.Color("#a9ccff");
    const bot = new THREE.Color("#2b69f0");
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp((pos.getY(i) + 95) / 190, 0, 1);
      tmp.copy(bot).lerp(top, Math.pow(t, 0.85));
      col.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

    const mat = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.7,
      clearcoatRoughness: 0.35,
      sheen: 0.6,
      sheenColor: new THREE.Color("#cfe0ff"),
      sheenRoughness: 0.5,
      envMapIntensity: 1.05,
      emissive: new THREE.Color("#1e4fd8"),
      emissiveIntensity: 0.18,
    });
    const body = new THREE.Mesh(geo, mat);
    const S = 0.0125;
    body.scale.setScalar(S);

    // ── eyes ──
    const frontZ = (DEPTH / 2 + BT) * S;
    const eyeGeo = new THREE.CapsuleGeometry(0.075, 0.2, 10, 20);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0b1020, roughness: 0.25, metalness: 0.1 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    const eyes = new THREE.Group();
    eyeL.position.x = -0.34;
    eyeR.position.x = 0.34;
    eyes.add(eyeL, eyeR);
    eyes.position.set(0, 0.02, frontZ + 0.01);

    const face = new THREE.Group();
    face.add(body, eyes);
    const root = new THREE.Group();
    root.add(face);
    scene.add(root);

    // ── floor shadow ──
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const rg = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    rg.addColorStop(0, "rgba(20,40,120,.55)");
    rg.addColorStop(1, "rgba(20,40,120,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(c);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.7),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    );
    shadow.position.set(0, -1.55, 0);
    scene.add(shadow);

    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 0.85 ? 11.5 : 9.5;
      camera.updateProjectionMatrix();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    const mouse = new THREE.Vector2();
    const sm = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.set(
        THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1.6, 1.6),
        THREE.MathUtils.clamp(-(((e.clientY - r.top) / r.height) * 2 - 1), -1.6, 1.6),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let poke = 0;
    const onDown = () => (poke = 1);
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.style.cursor = "pointer";

    let visible = true;
    const io = new IntersectionObserver(([x]) => (visible = x.isIntersecting));
    io.observe(el);

    let nextBlink = 2.2;
    let blink = 0;
    let eyeScaleY = 1;
    let eyeSX = 1;
    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      const st = poke > 0.01 ? "happy" : stateRef.current;
      poke = Math.max(0, poke - 0.012);
      sm.lerp(mouse, 0.07);

      // float + body follow
      const bob = reduce ? 0 : Math.sin(t * 1.25) * 0.07;
      root.position.y = bob + poke * Math.abs(Math.sin(t * 14)) * 0.12;
      face.rotation.y = sm.x * 0.38 + (st === "thinking" ? Math.sin(t * 0.9) * 0.15 : 0);
      face.rotation.x = -sm.y * 0.22;
      face.rotation.z = Math.sin(t * 0.8) * 0.025 + (st === "happy" ? Math.sin(t * 12) * 0.05 * poke : 0);
      const squash = 1 + Math.sin(t * 1.25 + 0.4) * 0.012;
      face.scale.set(1 / squash, squash, 1);
      shadow.scale.setScalar(1 - bob * 1.4);
      (shadow.material as THREE.MeshBasicMaterial).opacity = 0.9 - bob * 2;

      // eyes
      nextBlink -= 0.016;
      if (nextBlink < 0) {
        blink = 1;
        nextBlink = 2.4 + Math.random() * 3;
      }
      blink = Math.max(0, blink - 0.12);
      const blinkK = 1 - Math.sin(blink * Math.PI) * 0.92;
      let targetY = 1;
      let targetX = 1;
      let lookX = sm.x * 0.1;
      let lookY = sm.y * 0.06;
      if (st === "listening") (targetY = 1.18), (targetX = 1.08);
      if (st === "thinking") (lookX = 0.12), (lookY = 0.1), (targetY = 0.85);
      if (st === "happy") (targetY = 0.34), (targetX = 1.25);
      eyeScaleY += (targetY - eyeScaleY) * 0.15;
      eyeSX += (targetX - eyeSX) * 0.15;
      eyeL.scale.set(eyeSX, eyeScaleY * blinkK, 1);
      eyeR.scale.copy(eyeL.scale);
      eyes.position.x += (lookX - eyes.position.x) * 0.12;
      eyes.position.y += (0.02 + lookY - eyes.position.y) * 0.12;
      const happyTilt = st === "happy" ? 0.35 : 0;
      eyeL.rotation.z += (happyTilt - eyeL.rotation.z) * 0.15;
      eyeR.rotation.z += (-happyTilt - eyeR.rotation.z) * 0.15;

      fill.intensity = 18 + (st === "listening" ? Math.sin(t * 5) * 6 + 6 : 0);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      geo.dispose();
      mat.dispose();
      eyeGeo.dispose();
      eyeMat.dispose();
      shadowTex.dispose();
      shadow.geometry.dispose();
      (shadow.material as THREE.Material).dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} ${className}`} aria-label="RAFIQ, the friendly cloud companion" role="img" />;
}
