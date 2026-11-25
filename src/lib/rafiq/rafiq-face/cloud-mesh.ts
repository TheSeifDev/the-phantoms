/**
 * Turns RAFIQ's precomputed inflation field into the 3D cloud mesh.
 *
 * The expensive part — solving a Poisson equation over the silhouette — runs once at
 * development time (`pnpm gen:cloud`, see `cloud-solver.ts`) and is stored in `cloud-field.ts`.
 * In the browser only this cheap assembly runs: a few loops over ~12k vertices.
 * No imports, no Three.js: safe to load anywhere.
 */
export interface CloudMesh {
  positions: Float32Array;
  /** Rest position (x, y, z) — used by the shader to paint the eyes on the surface. */
  rest: Float32Array;
  indices: Uint32Array;
  bottom: number;
  top: number;
  centroid: { x: number; y: number };
}

/** Everything needed to rebuild the mesh without re-solving the Poisson field. */
export interface CloudField {
  angles: number;
  rings: number;
  centroid: { x: number; y: number };
  bottom: number;
  top: number;
  /** Distance from the centroid to the silhouette, one per angle. */
  radius: Float32Array;
  /** √φ for the centre vertex followed by ring-major interior vertices (φ ∈ [0, 1]). */
  lift: Float32Array;
}

/** Serialized form stored in `cloud-field.ts` (little-endian base64 buffers). */
export interface EncodedCloudField {
  angles: number;
  rings: number;
  centroid: { x: number; y: number };
  bottom: number;
  top: number;
  /** Float32 little-endian, base64. */
  radius: string;
  /** Uint16 little-endian (√φ × 65535), base64. */
  lift: string;
}

export const FRONT_HEIGHT = 34;
export const BACK_HEIGHT = 22;
export const LIFT_SCALE = 65535;

function bytesFromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function decodeCloudField(data: EncodedCloudField): CloudField {
  const radiusBytes = bytesFromBase64(data.radius);
  const liftBytes = bytesFromBase64(data.lift);
  const radiusView = new DataView(radiusBytes.buffer);
  const liftView = new DataView(liftBytes.buffer);
  const radius = new Float32Array(radiusBytes.length / 4);
  for (let i = 0; i < radius.length; i++) radius[i] = radiusView.getFloat32(i * 4, true);
  const lift = new Float32Array(liftBytes.length / 2);
  for (let i = 0; i < lift.length; i++) lift[i] = liftView.getUint16(i * 2, true) / LIFT_SCALE;
  return { angles: data.angles, rings: data.rings, centroid: data.centroid, bottom: data.bottom, top: data.top, radius, lift };
}

export function meshFromField(field: CloudField): CloudMesh {
  const { angles: ANGLES, rings: RINGS, centroid: c, radius, lift } = field;
  // Ring parameters packed toward the silhouette (s = 1) where the profile curves fastest.
  const rings: number[] = [];
  for (let k = 1; k <= RINGS; k++) rings.push(Math.sin((k / RINGS) * Math.PI * 0.5));
  const cos = new Float64Array(ANGLES), sin = new Float64Array(ANGLES);
  for (let a = 0; a < ANGLES; a++) { const t = (a / ANGLES) * Math.PI * 2; cos[a] = Math.cos(t); sin[a] = Math.sin(t); }

  // Front + back share the centre topology; the silhouette ring is shared by both sides.
  const perSide = 1 + (RINGS - 1) * ANGLES; // centre + interior rings (exclusive of silhouette)
  if (lift.length !== perSide || radius.length !== ANGLES) throw new Error("RAFIQ cloud field does not match its topology.");
  const vertexCount = perSide * 2 + ANGLES;
  const positions = new Float32Array(vertexCount * 3);
  const write = (index: number, x: number, y: number, z: number) => {
    positions[index * 3] = x; positions[index * 3 + 1] = y; positions[index * 3 + 2] = z;
  };
  for (let side = 0; side < 2; side++) {
    const base = side * perSide;
    const H = side === 0 ? FRONT_HEIGHT : -BACK_HEIGHT;
    write(base, c.x, c.y, H * lift[0]);
    for (let k = 0; k < RINGS - 1; k++) {
      const s = rings[k];
      for (let a = 0; a < ANGLES; a++) {
        const R = radius[a];
        write(base + 1 + k * ANGLES + a, c.x + cos[a] * s * R, c.y + sin[a] * s * R, H * lift[1 + k * ANGLES + a]);
      }
    }
  }
  const edgeBase = perSide * 2;
  for (let a = 0; a < ANGLES; a++) write(edgeBase + a, c.x + cos[a] * radius[a], c.y + sin[a] * radius[a], 0);

  const indices = new Uint32Array(2 * (ANGLES + (RINGS - 1) * ANGLES * 2) * 3);
  let n = 0;
  for (let side = 0; side < 2; side++) {
    const base = side * perSide;
    const ring = (k: number, a: number) => (k === RINGS - 1 ? edgeBase + (a % ANGLES) : base + 1 + k * ANGLES + (a % ANGLES));
    const tri = side === 0
      ? (i0: number, i1: number, i2: number) => { indices[n++] = i0; indices[n++] = i1; indices[n++] = i2; }
      : (i0: number, i1: number, i2: number) => { indices[n++] = i0; indices[n++] = i2; indices[n++] = i1; };
    for (let a = 0; a < ANGLES; a++) tri(base, ring(0, a), ring(0, a + 1));
    for (let k = 0; k < RINGS - 1; k++) {
      for (let a = 0; a < ANGLES; a++) {
        const i00 = ring(k, a), i01 = ring(k, a + 1), i10 = ring(k + 1, a), i11 = ring(k + 1, a + 1);
        tri(i00, i10, i11);
        tri(i00, i11, i01);
      }
    }
  }
  return { positions, rest: positions.slice(), indices, bottom: field.bottom, top: field.top, centroid: c };
}
