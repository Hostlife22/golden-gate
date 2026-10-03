import { ANCHOR, BRIDGE, BRIDGE_ANGLE, HALF_SPAN } from '../data/bridge';
import type { Point2, Point3 } from '../data/geography';

export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function smoothstep(t: number) {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}

export function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Continuous deterministic value noise; no random state or frame allocations. */
function coordinateHash(a: number, b: number) {
  const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

export function noise2(x: number, z: number) {
  const ix = Math.floor(x),
    iz = Math.floor(z),
    fx = smoothstep(x - ix),
    fz = smoothstep(z - iz);
  const a = coordinateHash(ix, iz) * (1 - fx) + coordinateHash(ix + 1, iz) * fx;
  const b = coordinateHash(ix, iz + 1) * (1 - fx) + coordinateHash(ix + 1, iz + 1) * fx;
  return a * (1 - fz) + b * fz;
}

export function terrainNoise(x: number, z: number) {
  return (
    (noise2(x, z) - 0.5) * 0.6 +
    (noise2(x * 2.1 + 17, z * 2.1 + 31) - 0.5) * 0.28 +
    (noise2(x * 4.3, z * 4.3) - 0.5) * 0.12
  );
}

export function cableHeight(z: number): number {
  const a = Math.abs(z);
  if (a <= HALF_SPAN)
    return BRIDGE.cableLow + (BRIDGE.cableTop - BRIDGE.cableLow) * (a / HALF_SPAN) ** 2;
  const t = clamp((a - HALF_SPAN) / BRIDGE.sideSpan, 0, 1);
  return BRIDGE.cableTop * (1 - t) + BRIDGE.anchorY * t - 3.8 * Math.sin(t * Math.PI);
}

export function deckHeight(z: number) {
  return BRIDGE.deckY - 0.17 * clamp(Math.abs(z) / ANCHOR, 0, 1) ** 2;
}

export function roadCenter(z: number) {
  const d = Math.max(0, Math.abs(z) - ANCHOR);
  return z > 0 ? -0.0016 * d * d : 0.003 * d * d;
}

export function bridgeToWorld(x: number, y: number, z: number): Point3 {
  return [
    x * Math.cos(BRIDGE_ANGLE) - z * Math.sin(BRIDGE_ANGLE),
    y,
    x * Math.sin(BRIDGE_ANGLE) + z * Math.cos(BRIDGE_ANGLE),
  ];
}

export function worldToBridge(x: number, z: number): Point2 {
  return [
    x * Math.cos(BRIDGE_ANGLE) + z * Math.sin(BRIDGE_ANGLE),
    -x * Math.sin(BRIDGE_ANGLE) + z * Math.cos(BRIDGE_ANGLE),
  ];
}

export function pointInPolygon(x: number, z: number, polygon: readonly Point2[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i],
      b = polygon[j];
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0])
      inside = !inside;
  }
  return inside;
}

export function pointSegmentDistance(x: number, z: number, a: Point2, b: Point2) {
  const dx = b[0] - a[0],
    dz = b[1] - a[1];
  const t = clamp(((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz || 1), 0, 1);
  return Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t);
}
