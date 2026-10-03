import { Vector3 } from 'three';
import { BRIDGE, ANCHOR } from '../../data/bridge';
import { cableHeight, deckHeight } from '../../simulation/math';
import type { Instance } from '../Instances';
import type { Point3 } from '../../data/geography';

export function beam(a: Point3, b: Point3, thickness: number): Instance {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    dz = b[2] - a[2];
  return {
    position: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2],
    scale: [thickness, Math.hypot(dx, dy, dz), thickness],
    rotation: [Math.atan2(dz, dy), 0, -Math.atan2(dx, Math.hypot(dy, dz))],
  };
}

export function cablePoints(x: number, z0: number, z1: number, steps: number) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const z = z0 + ((z1 - z0) * i) / steps;
    return new Vector3(x, cableHeight(z), z);
  });
}

export function suspenderData(): Instance[] {
  const data: Instance[] = [];
  for (let z = -ANCHOR + BRIDGE.suspenderSpacing; z < ANCHOR; z += BRIDGE.suspenderSpacing) {
    for (const x of [-BRIDGE.width / 2, BRIDGE.width / 2]) {
      const low = deckHeight(z) - 0.2,
        high = cableHeight(z);
      if (high <= low) continue;
      for (const offset of [-0.035, 0.035])
        data.push({
          position: [x, (low + high) / 2, z + offset],
          scale: [0.009, high - low, 0.009],
        });
    }
  }
  return data;
}
