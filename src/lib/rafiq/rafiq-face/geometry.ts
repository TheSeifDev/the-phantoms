/**
 * RAFIQ's soft, inflated cloud body, ready for the WebGL renderer.
 *
 * The inflation field (a Poisson solve over the original Grokbots silhouette) is precomputed by
 * `pnpm gen:cloud` into `cloud-field.ts`; here it is only decoded and assembled, which takes a
 * few milliseconds instead of the ~1 s main-thread freeze the live solve caused on phones.
 * See `cloud-solver.ts` for how the shape is derived. Results are cached per page.
 */
import { CLOUD_FIELD } from "./cloud-field";
import { decodeCloudField, meshFromField, type CloudMesh } from "./cloud-mesh";

export type { CloudMesh } from "./cloud-mesh";
export { FRONT_HEIGHT, BACK_HEIGHT } from "./cloud-mesh";

let cached: CloudMesh | null = null;

export function buildCloudMesh(): CloudMesh {
  if (!cached) cached = meshFromField(decodeCloudField(CLOUD_FIELD));
  return cached;
}
