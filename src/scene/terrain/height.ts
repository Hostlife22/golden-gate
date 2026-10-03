import coastline from '../../../public/assets/coastline.json';
import { project, LANDMARKS } from '../../data/geography';
import type { Point2 } from '../../data/geography';
import {
  pointInPolygon,
  pointSegmentDistance,
  smoothstep,
  worldToBridge,
  terrainNoise,
} from '../../simulation/math';

export const LAND_POLYGONS: Point2[][] = coastline.rings.map((ring) =>
  ring.map((p) => project(p[0], p[1])),
);

// Natural Earth omits small Alcatraz. This schematic perimeter retains its real location and scale.
LAND_POLYGONS.push(
  [
    [-16, -5],
    [-8, -12],
    [6, -11],
    [17, 1],
    [12, 7],
    [-7, 8],
  ].map(([x, z]) => [LANDMARKS.alcatraz[0] + x, LANDMARKS.alcatraz[1] + z]),
);

export function isLand(x: number, z: number) {
  return LAND_POLYGONS.some((p) => pointInPolygon(x, z, p));
}

export function shoreDistance(x: number, z: number) {
  let dist = 1e5;
  for (const polygon of LAND_POLYGONS)
    for (let i = 0; i < polygon.length; i++)
      dist = Math.min(
        dist,
        pointSegmentDistance(x, z, polygon[i], polygon[(i + 1) % polygon.length]),
      );
  return dist;
}

function hill(x: number, z: number, cx: number, cz: number, r: number, h: number) {
  return h * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (r * r));
}

export function terrainHeight(x: number, z: number, distance?: number): number {
  if (!isLand(x, z)) return -1.8;
  const d = distance ?? shoreDistance(x, z),
    coast = smoothstep(d / (z < -60 ? 5.5 : 8.0));
  let h: number;
  if (z < -60) {
    h =
      hill(x, z, -90, -155, 83, 23) +
      hill(x, z, -260, -230, 150, 21) +
      hill(x, z, -360, -100, 85, 12) +
      hill(x, z, 95, -360, 125, 22);
    h += terrainNoise(x * 0.034, z * 0.034) * 9;
    h += terrainNoise(x * 0.15, z * 0.15) * 1.8;
  } else {
    h =
      hill(x, z, -50, 200, 90, 10.4) +
      hill(x, z, 185, 330, 100, 9.8) +
      hill(x, z, 480, 260, 63, 11) +
      hill(x, z, 370, 490, 130, 18);
    h += terrainNoise(x * 0.045, z * 0.045) * 2.0;
  }
  const a = LANDMARKS.alcatraz;
  if (Math.hypot(x - a[0], z - a[1]) < 24) h = 3.5;
  const island = LANDMARKS.angelIsland;
  if (Math.hypot(x - island[0], z - island[1]) < 150) h = hill(x, z, island[0], island[1], 80, 23);
  h = Math.max(1.0, h) * coast + 0.1;
  const [bx, bz] = worldToBridge(x, z);
  if (Math.abs(bz) > 97 && Math.abs(bz) < 147 && Math.abs(bx) < 5) h = Math.min(h, 6.95);
  return h;
}
