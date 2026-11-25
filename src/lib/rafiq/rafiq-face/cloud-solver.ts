/**
 * Build-time solver for RAFIQ's soft, inflated cloud body (from the original Grokbots silhouette).
 *
 * The outline (SVG, y-down) is flipped to y-up object space. Because the outline is star-shaped
 * from its centroid, a clean polar mesh is used: rings are packed toward the silhouette so the
 * rounded edge stays smooth. Heights come from a Poisson solve (Δu = −1, u = 0 on the outline),
 * which inflates the cloud like a balloon — lobes stay round and notches blend softly.
 *
 * This is deliberately NOT imported by the app: the solve costs ~0.35 s on a fast CPU and over a
 * second on a phone. `pnpm gen:cloud` runs it once and writes `cloud-field.ts`; the browser only
 * assembles the mesh from that data (`cloud-mesh.ts`). Re-run `pnpm gen:cloud` after changing
 * `cloudPath` or any constant here — `pnpm test:cloud` fails if the stored field is stale.
 */
import { cloudPath } from "../rafiq-avatar";
import type { CloudField } from "./cloud-mesh";

export const ANGLES = 200;
export const RINGS = 30;
const GRID = 1.5;
type P = [number, number];

/** Minimal parser for the M/C/L/Z subset used by the exported cloud path. */
export function parseOutline(d: string, samplesPerCurve = 8): P[] {
  const tokens = d.match(/[MLCZ]|-?\d*\.?\d+(?:e-?\d+)?/gi) ?? [];
  const out: P[] = [];
  let i = 0;
  let cur: P = [0, 0];
  let command = "";
  const num = () => parseFloat(tokens[i++]);
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[MLCZ]$/i.test(t)) { command = t.toUpperCase(); i++; if (command === "Z") continue; }
    if (command === "M" || command === "L") {
      cur = [num(), num()];
      out.push(cur);
      if (command === "M") command = "L";
    } else if (command === "C") {
      const p1: P = [num(), num()], p2: P = [num(), num()], p3: P = [num(), num()];
      for (let k = 1; k <= samplesPerCurve; k++) {
        const u = k / samplesPerCurve, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, e = u ** 3;
        out.push([a * cur[0] + b * p1[0] + c * p2[0] + e * p3[0], a * cur[1] + b * p1[1] + c * p2[1] + e * p3[1]]);
      }
      cur = p3;
    } else {
      i++;
    }
  }
  // Flip to y-up and drop a duplicated closing point.
  const flipped = out.map(([x, y]) => [x, -y] as P);
  const [fx, fy] = flipped[0], [lx, ly] = flipped[flipped.length - 1];
  if (Math.hypot(fx - lx, fy - ly) < 1e-6) flipped.pop();
  return flipped;
}

function centroidOf(poly: P[]) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length];
    const c = x0 * y1 - x1 * y0;
    a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c;
  }
  a /= 2;
  return { x: cx / (6 * a), y: cy / (6 * a) };
}

/** Distance along a ray from `o` in direction `d` to the outline (star-shaped → one hit). */
function rayHit(poly: P[], ox: number, oy: number, dx: number, dy: number) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
    const ex = bx - ax, ey = by - ay;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const t = ((ax - ox) * ey - (ay - oy) * ex) / den;
    const u = ((ax - ox) * dy - (ay - oy) * dx) / den;
    if (t > 0 && u >= 0 && u <= 1 && t < best) best = t;
  }
  return best;
}

function inside(poly: P[], x: number, y: number) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

/** Normalised Poisson field φ ∈ [0, 1] on a regular grid covering the outline. */
function poisson(poly: P[]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of poly) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  minX -= GRID * 2; minY -= GRID * 2; maxX += GRID * 2; maxY += GRID * 2;
  const w = Math.ceil((maxX - minX) / GRID) + 1, h = Math.ceil((maxY - minY) / GRID) + 1;
  const mask = new Uint8Array(w * h);
  const u = new Float32Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) mask[j * w + i] = inside(poly, minX + i * GRID, minY + j * GRID) ? 1 : 0;
  const rhs = GRID * GRID, omega = 1.92;
  for (let it = 0; it < 420; it++) {
    for (let j = 1; j < h - 1; j++) {
      for (let i = 1; i < w - 1; i++) {
        const k = j * w + i;
        if (!mask[k]) continue;
        const next = (u[k - 1] + u[k + 1] + u[k - w] + u[k + w] + rhs) * 0.25;
        u[k] += omega * (next - u[k]);
      }
    }
  }
  let max = 0;
  for (let k = 0; k < u.length; k++) max = Math.max(max, u[k]);
  for (let k = 0; k < u.length; k++) u[k] = mask[k] ? u[k] / max : 0;
  const sample = (x: number, y: number) => {
    const fx = (x - minX) / GRID, fy = (y - minY) / GRID;
    const i = Math.min(w - 2, Math.max(0, Math.floor(fx))), j = Math.min(h - 2, Math.max(0, Math.floor(fy)));
    const tx = fx - i, ty = fy - j, k = j * w + i;
    return (u[k] * (1 - tx) + u[k + 1] * tx) * (1 - ty) + (u[k + w] * (1 - tx) + u[k + w + 1] * tx) * ty;
  };
  return sample;
}

/** Solves the inflation field: per-ray silhouette radius and √φ for every interior vertex. */
export function solveCloudField(): CloudField {
  const poly = parseOutline(cloudPath);
  const c = centroidOf(poly);
  const phi = poisson(poly);
  let bottom = Infinity, top = -Infinity;
  for (const [, y] of poly) { bottom = Math.min(bottom, y); top = Math.max(top, y); }

  const rings: number[] = [];
  for (let k = 1; k <= RINGS; k++) rings.push(Math.sin((k / RINGS) * Math.PI * 0.5));
  const radii = new Float64Array(ANGLES);
  for (let a = 0; a < ANGLES; a++) {
    const t = (a / ANGLES) * Math.PI * 2;
    radii[a] = rayHit(poly, c.x, c.y, Math.cos(t), Math.sin(t));
  }

  const perSide = 1 + (RINGS - 1) * ANGLES;
  const edgeBlend = GRID * 4;
  // Near the outline φ is extended linearly along each ray so the silhouette stays exact and smooth.
  const heights = new Float64Array(perSide);
  heights[0] = Math.max(0, phi(c.x, c.y));
  for (let a = 0; a < ANGLES; a++) {
    const t = (a / ANGLES) * Math.PI * 2, dx = Math.cos(t), dy = Math.sin(t), R = radii[a];
    // Reference point on this ray, safely inside the grid-resolved interior.
    const sRef = Math.max(0.05, 1 - edgeBlend / R);
    const phiRef = Math.max(1e-4, phi(c.x + dx * sRef * R, c.y + dy * sRef * R));
    for (let k = 0; k < RINGS - 1; k++) {
      const s = rings[k];
      const x = c.x + dx * s * R, y = c.y + dy * s * R;
      heights[1 + k * ANGLES + a] = s <= sRef ? Math.max(0, phi(x, y)) : phiRef * ((1 - s) * R) / ((1 - sRef) * R);
    }
  }
  const lift = new Float32Array(perSide);
  for (let i = 0; i < perSide; i++) lift[i] = Math.sqrt(Math.min(1, Math.max(0, heights[i])));
  return { angles: ANGLES, rings: RINGS, centroid: c, bottom, top, radius: Float32Array.from(radii), lift };
}
