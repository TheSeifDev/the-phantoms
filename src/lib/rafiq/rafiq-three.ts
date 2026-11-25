import * as THREE from "three";
import type { FaceStateId } from "./content";
import { buildCloudMesh } from "./rafiq-face/geometry";
import { createFaceDriver, joinRafiqFrames } from "./rafiq-face/driver";
import type { FaceFrame } from "./rafiq-face/behavior";

export interface RafiqThreeDebug {
  state: FaceStateId;
  gaze: { x: number; y: number };
  eyes: Array<{ x: number; y: number; angle: number; heightScale: number; widthScale: number; happy: number }>;
  rotation: { x: number; y: number; z: number };
  visible: boolean;
  reduced: boolean;
  tracking: boolean;
  frames: number;
  drawCalls: number;
  greeting: number;
  near: number;
  speech: number;
  blink: number;
}
export type RafiqCanvas = HTMLCanvasElement & { __rafiq?: RafiqThreeDebug };
export interface RafiqScene {
  setState: (state: FaceStateId) => void;
  setInteractive: (interactive: boolean) => void;
  setVisible: (visible: boolean) => void;
  greet: () => void;
  dispose: () => void;
}
export interface RafiqSceneOptions {
  /** Accept a software WebGL implementation (QA/headless only — real users get the SVG face). */
  allowSoftware?: boolean;
}

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uWobble;
uniform vec2 uScale;
uniform vec2 uLean;
uniform float uBottom;
uniform float uHeight;
varying vec3 vRest;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec3 p = position;
  vRest = p;
  // Soft organic breathing of the surface along its normal.
  float w = sin(uTime * 1.3 + p.x * 0.045 + p.y * 0.035) * 0.6 + sin(uTime * 0.85 - p.x * 0.03 + p.y * 0.05) * 0.4;
  p += normal * w * uWobble * 1.5;
  // Squash and stretch anchored at the base; the top leans toward the pointer.
  float h = clamp((p.y - uBottom) / uHeight, 0.0, 1.0);
  p.y = uBottom + (p.y - uBottom) * uScale.y;
  p.x *= uScale.x;
  p.x += uLean.x * h * h;
  p.y += uLean.y * h * h * 0.5;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const FRAGMENT = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uMid;
uniform vec3 uLow;
uniform vec3 uDeep;
uniform vec3 uRim;
uniform vec3 uEye;
uniform vec3 uLight;
uniform vec4 uEyeA;
uniform vec4 uEyeA2;
uniform vec4 uEyeB;
uniform vec4 uEyeB2;
varying vec3 vRest;
varying vec3 vNormal;
varying vec3 vView;

float capsule(vec2 q, float halfLength, float radius) {
  q.y = max(abs(q.y) - halfLength, 0.0);
  return length(q) - radius;
}
// Upper arc (a soft "∩" crescent) — iq's sdArc with rounded ends.
float arc(vec2 p, float aperture, float ra, float rb) {
  vec2 sc = vec2(sin(aperture), cos(aperture));
  p.x = abs(p.x);
  return ((sc.y * p.x > sc.x * p.y) ? length(p - sc * ra) : abs(length(p) - ra)) - rb;
}
float eyeField(vec2 p, vec4 a, vec4 b) {
  vec2 d = p - a.xy;
  float c = cos(b.x), s = sin(b.x);
  vec2 q = vec2(c * d.x + s * d.y, -s * d.x + c * d.y);
  q.x /= max(b.y, 0.2);
  q.y /= max(b.z, 0.04);
  float pill = capsule(q, a.z, a.w);
  float crescent = arc(q - vec2(0.0, -a.w * 1.35), 1.05, a.w * 1.95, a.w * 0.68);
  return mix(pill, crescent, b.w) * min(max(b.z, 0.04), 1.0);
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(-vView);
  vec3 l = normalize(uLight);
  // Light sky blue at the top-left melting into saturated cobalt at the base.
  float t = clamp((vRest.y * 0.85 - vRest.x * 0.45 + 95.0) / 185.0, 0.0, 1.0);
  vec3 base = mix(uDeep, uLow, smoothstep(0.0, 0.32, t));
  base = mix(base, uMid, smoothstep(0.28, 0.64, t));
  base = mix(base, uTop, smoothstep(0.6, 1.0, t));
  float diffuse = clamp((dot(n, l) + 0.6) / 1.6, 0.0, 1.0);
  vec3 col = base * (0.6 + 0.52 * diffuse);
  col *= mix(0.86, 1.0, smoothstep(-92.0, -30.0, vRest.y));
  float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.6);
  col += uRim * fresnel * 0.34;
  vec3 hv = normalize(l + v);
  float nh = max(dot(n, hv), 0.0);
  float spec = pow(nh, 44.0) * 0.3 + pow(nh, 7.0) * 0.05;
  col += spec;

  // Two dark capsule eyes painted onto the front surface (they deform with the body).
  float front = smoothstep(4.0, 10.0, vRest.z);
  float d = min(eyeField(vRest.xy, uEyeA, uEyeA2), eyeField(vRest.xy, uEyeB, uEyeB2));
  float aa = max(fwidth(d), 0.02) * 0.9;
  float eye = (1.0 - smoothstep(-aa, aa, d)) * front;
  float socket = (1.0 - smoothstep(0.0, 3.2, d)) * front * 0.12;
  col *= 1.0 - socket;
  vec3 eyeCol = uEye * (0.9 + 0.2 * diffuse) + pow(nh, 60.0) * 0.55 + fresnel * 0.04;
  col = mix(col, eyeCol, eye);
  gl_FragColor = vec4(col, 1.0);
}`;

const GLOW_VERTEX = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }";
const GLOW_FRAGMENT = /* glsl */ `
varying vec2 vUv; uniform float uIntensity; uniform vec3 uTint;
void main(){ float d = length(vUv - 0.5) * 2.0; float a = exp(-d * d * 3.6) * (1.0 - smoothstep(0.72, 1.0, d)); gl_FragColor = vec4(uTint, a * uIntensity); }`;
const SHADOW_FRAGMENT = /* glsl */ `
varying vec2 vUv; uniform float uIntensity;
void main(){ float d = length((vUv - 0.5) * 2.0); gl_FragColor = vec4(0.05, 0.12, 0.36, exp(-d * d * 4.5) * (1.0 - smoothstep(0.6, 1.0, d)) * uIntensity); }`;

/** RAFIQ in real 3D: an inflated cloud body, painted dark eyes, no mouth. */
export function createRafiqScene(
  canvas: RafiqCanvas,
  initialState: FaceStateId,
  initiallyInteractive: boolean,
  onContextLost: () => void,
  options: RafiqSceneOptions = {},
): RafiqScene {
  // Phones and tablets pay per pixel and per frame: render at most 1.5× density and 30 fps.
  // MSAA stays on — tile-based mobile GPUs resolve it on-chip almost for free, and without it
  // the silhouette visibly stair-steps. Desktops keep 1.75× and the display's full frame rate.
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const density = window.devicePixelRatio || 1;
  const minFrameMs = touch ? 1000 / 30 : 0;
  const context = canvas.getContext("webgl2", {
    alpha: true, antialias: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: !options.allowSoftware,
  });
  if (!context) throw new Error("WebGL unavailable; use the interactive SVG face.");
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true }); }
  catch (error) { context.getExtension("WEBGL_lose_context")?.loseContext(); throw error; }

  const cleanups: Array<() => void> = [];
  const resources = new Set<THREE.BufferGeometry | THREE.Material>();
  const own = <T extends THREE.BufferGeometry | THREE.Material>(value: T): T => { resources.add(value); return value; };
  let disposed = false;
  const cleanup = () => {
    cleanups.splice(0).reverse().forEach((release) => release());
    resources.forEach((resource) => resource.dispose());
    resources.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    delete canvas.__rafiq;
  };

  try {
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(density, touch ? 1.5 : 1.75));
    renderer.toneMapping = THREE.NoToneMapping;
    const scene = new THREE.Scene();
    const FOV = 18;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 3000);
    const baseDistance = 125 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));

    const cloud = buildCloudMesh();
    const geometry = own(new THREE.BufferGeometry());
    geometry.setAttribute("position", new THREE.BufferAttribute(cloud.positions, 3));
    geometry.setIndex(new THREE.BufferAttribute(cloud.indices, 1));
    geometry.computeVertexNormals();
    // Shader colours are written as display (sRGB) values directly.
    const srgb = (hex: string) => { const c = new THREE.Color(); c.setHex(parseInt(hex.slice(1), 16), THREE.LinearSRGBColorSpace); return c; };
    const uniforms = {
      uTime: { value: 0 },
      uWobble: { value: 0.5 },
      uScale: { value: new THREE.Vector2(1, 1) },
      uLean: { value: new THREE.Vector2(0, 0) },
      uBottom: { value: cloud.bottom },
      uHeight: { value: cloud.top - cloud.bottom },
      uTop: { value: srgb("#c8e4ff") },
      uMid: { value: srgb("#62abff") },
      uLow: { value: srgb("#2f7cf3") },
      uDeep: { value: srgb("#1b4fcf") },
      uRim: { value: srgb("#d9eeff") },
      uEye: { value: srgb("#0c1431") },
      uLight: { value: new THREE.Vector3(-0.45, 0.62, 0.65) },
      uEyeA: { value: new THREE.Vector4() },
      uEyeA2: { value: new THREE.Vector4() },
      uEyeB: { value: new THREE.Vector4() },
      uEyeB2: { value: new THREE.Vector4() },
    };
    const material = own(new THREE.ShaderMaterial({ uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT }));
    const body = new THREE.Mesh(geometry, material);
    const rig = new THREE.Group();
    rig.rotation.order = "YXZ";
    rig.add(body);
    scene.add(rig);

    const glowMaterial = own(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uIntensity: { value: 0.16 }, uTint: { value: srgb("#4f8ef7") } },
      vertexShader: GLOW_VERTEX, fragmentShader: GLOW_FRAGMENT,
    }));
    const glow = new THREE.Mesh(own(new THREE.PlaneGeometry(250, 250)), glowMaterial);
    glow.position.set(0, -4, -70);
    glow.renderOrder = -2;
    scene.add(glow);
    const shadowMaterial = own(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uIntensity: { value: 0.12 } },
      vertexShader: GLOW_VERTEX, fragmentShader: SHADOW_FRAGMENT,
    }));
    const shadow = new THREE.Mesh(own(new THREE.PlaneGeometry(150, 22)), shadowMaterial);
    shadow.position.set(-2, -108, -40);
    shadow.renderOrder = -1;
    scene.add(shadow);

    const driver = createFaceDriver(initialState, initiallyInteractive);
    cleanups.push(() => driver.dispose());
    let state = initialState;
    let visible = true;
    let tabVisible = !document.hidden;
    let dirty = true;
    let lastSignature = "";
    const debug: RafiqThreeDebug = {
      state, gaze: { x: 0, y: 0 }, eyes: [], rotation: { x: 0, y: 0, z: 0 }, visible, reduced: driver.status.reduced,
      tracking: false, frames: 0, drawCalls: 0, greeting: 0, near: 0, speech: 0, blink: 1,
    };
    canvas.__rafiq = debug;

    const resize = () => {
      if (disposed) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      const aspect = rect.width / rect.height;
      camera.aspect = aspect;
      // Keep the full 250-unit frame visible whatever the aspect ratio.
      camera.position.set(0, 0, aspect < 1 ? baseDistance / aspect : baseDistance);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      dirty = true;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    cleanups.push(() => resizeObserver.disconnect());
    resize();

    const onVisibility = () => { tabVisible = !document.hidden; if (!tabVisible) driver.settle(); };
    const onLost = (event: Event) => { event.preventDefault(); if (!disposed) onContextLost(); };
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);
    cleanups.push(() => {
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
    });

    const apply = (frame: FaceFrame, time: number) => {
      const [a, b] = frame.eyes;
      uniforms.uEyeA.value.set(a.x, a.y, a.halfLength, a.radius);
      uniforms.uEyeA2.value.set(a.angle, a.widthScale, a.heightScale, a.happy);
      uniforms.uEyeB.value.set(b.x, b.y, b.halfLength, b.radius);
      uniforms.uEyeB2.value.set(b.angle, b.widthScale, b.heightScale, b.happy);
      const f = frame.body;
      rig.rotation.set(f.pitch, f.yaw, f.roll);
      rig.position.set(f.offsetX, f.offsetY, 0);
      uniforms.uScale.value.set(f.scaleX, f.scaleY);
      uniforms.uLean.value.set(f.leanX, f.leanY);
      uniforms.uWobble.value = f.wobble;
      uniforms.uTime.value = time;
      // Cursor-reactive key light: the highlight drifts with RAFIQ's attention.
      uniforms.uLight.value.set(-0.45 + frame.gaze.x * 0.22, 0.62 + frame.gaze.y * 0.16, 0.65);
      glowMaterial.uniforms.uIntensity.value = f.glow;
      glow.position.x = f.offsetX * 0.6 + f.leanX * 0.4;
      glow.position.y = -4 + f.offsetY * 0.6;
      shadow.scale.x = 1 - f.offsetY * 0.012;
      shadowMaterial.uniforms.uIntensity.value = 0.12 - f.offsetY * 0.004;
    };

    let pendingMs = 0;
    const leaveFrames = joinRafiqFrames((time, deltaMs) => {
      if (disposed || !visible || !tabVisible) { pendingMs = 0; return; }
      // Frame cap (touch devices): accumulate ticks so motion speed stays exact at 30 fps.
      pendingMs += deltaMs;
      if (pendingMs < minFrameMs - 4) return;
      const stepMs = pendingMs;
      pendingMs = 0;
      try {
        renderFrame(time, stepMs);
      } catch (error) {
        // A broken frame (driver/GPU error) hands RAFIQ over to the SVG renderer.
        console.error("[RAFIQ] WebGL frame failed; switching to the SVG face.", error);
        if (!disposed) onContextLost();
      }
    });
    function renderFrame(time: number, deltaMs: number) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const frame = driver.step(Math.min(deltaMs / 1000, 0.064), rect);
      apply(frame, time);
      const status = driver.status;
      // Under reduced motion only render when something visibly changed.
      const signature = status.reduced
        ? `${frame.gaze.x.toFixed(3)},${frame.gaze.y.toFixed(3)},${frame.eyes[0].heightScale.toFixed(3)},${frame.eyes[0].happy.toFixed(3)},${frame.eyes[0].halfLength.toFixed(2)}`
        : "";
      if (dirty || !status.reduced || signature !== lastSignature) {
        renderer.render(scene, camera);
        debug.frames += 1;
        dirty = false;
        lastSignature = signature;
      }
      debug.state = state;
      debug.gaze.x = frame.gaze.x; debug.gaze.y = frame.gaze.y;
      debug.eyes = frame.eyes.map((e) => ({ x: e.x, y: e.y, angle: e.angle, heightScale: e.heightScale, widthScale: e.widthScale, happy: e.happy }));
      debug.rotation.x = rig.rotation.x; debug.rotation.y = rig.rotation.y; debug.rotation.z = rig.rotation.z;
      debug.reduced = status.reduced; debug.tracking = status.tracking; debug.near = status.near;
      debug.greeting = status.greet; debug.speech = status.speech; debug.blink = frame.blink;
      debug.drawCalls = renderer.info.render.calls;
    }
    cleanups.push(leaveFrames);

    return {
      setState(next) { state = next; driver.setState(next); debug.state = next; dirty = true; },
      setInteractive(value) { driver.setInteractive(value); },
      setVisible(value) { visible = value; debug.visible = value; if (!value) driver.settle(); else dirty = true; },
      greet() { if (visible && tabVisible) driver.greet(); },
      dispose() {
        if (disposed) return;
        disposed = true;
        cleanup();
      },
    };
  } catch (error) {
    disposed = true;
    cleanup();
    throw error;
  }
}
