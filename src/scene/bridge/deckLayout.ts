import { BRIDGE } from '../../data/bridge';
import { deckHeight, roadCenter } from '../../simulation/math';
import type { Instance } from '../Instances';
import { beam } from './geometry';

export function createDeckLayout() {
  const road: Instance[] = [],
    truss: Instance[] = [],
    walk: Instance[] = [],
    rails: Instance[] = [],
    markings: Instance[] = [],
    lamps: Instance[] = [],
    supports: Instance[] = [];
  for (let z = -136; z < 137; z += 1.524) {
    const x = roadCenter(z),
      y = deckHeight(z);
    road.push({ position: [x, y - 0.1, z], scale: [BRIDGE.roadWidth, 0.2, 1.53] });
    truss.push({ position: [x, y - 0.51, z], scale: [BRIDGE.width, 0.09, 0.11] });
    for (const side of [-1, 1]) {
      const sx = x + side * (BRIDGE.width / 2);
      walk.push({ position: [x + side * 1.16, y - 0.07, z], scale: [0.3, 0.16, 1.53] });
      rails.push({ position: [sx, y + 0.16, z], scale: [0.037, 0.035, 1.54] });
      rails.push({ position: [sx, y + 0.08, z], scale: [0.024, 0.025, 1.54] });
      rails.push({ position: [sx, y + 0.11, z], scale: [0.024, 0.3, 0.024] });
      for (const h of [-0.2, -0.78])
        truss.push({ position: [sx, y + h, z], scale: [0.08, 0.08, 1.55] });
      truss.push(beam([sx, y - 0.75, z - 0.75], [sx, y - 0.24, z + 0.75], 0.044));
      truss.push(beam([sx, y - 0.24, z - 0.75], [sx, y - 0.75, z + 0.75], 0.035));
    }
    for (const laneX of [-0.62, -0.31, 0, 0.31, 0.62])
      markings.push({
        position: [x + laneX, y + 0.006, z],
        scale: [0.012, 0.005, laneX === 0 ? 1.53 : 0.65],
        color: laneX === 0 ? '#d5b86c' : '#d2d3c8',
      });
  }
  for (let z = -130; z < 132; z += 13)
    for (const side of [-1, 1]) {
      const x = roadCenter(z) + side * 1.0,
        y = deckHeight(z);
      lamps.push({ position: [x, y + 0.37, z], scale: [0.025, 0.75, 0.025] });
      lamps.push({ position: [x - side * 0.12, y + 0.74, z], scale: [0.26, 0.025, 0.035] });
    }
  for (const z of [-128, -115, -102, 102, 113, 125, 135])
    for (const x of [-1, 1])
      supports.push({ position: [roadCenter(z) + x, 3.6, z], scale: [0.28, 6.7, 0.4] });
  return { road, truss, walk, rails, markings, lamps, supports };
}
