import { BRIDGE, PALETTE } from '../../data/bridge';
import type { Instance } from '../Instances';

export function createTowerLayout(z: number) {
  const steel: Instance[] = [],
    accents: Instance[] = [];
  const rivets: Instance[] = [];
  const levels = [1.1, 7.4, 11.2, 14.9, 18.3, 21.6, 22.7].map(
    (y) => (y * BRIDGE.towerHeight) / 22.7,
  );
  for (const side of [-1, 1]) {
    for (let i = 0; i < levels.length - 1; i++) {
      const bottom = levels[i],
        top = levels[i + 1],
        width = 1.0 - i * 0.07;
      const x = side * (1.66 - i * 0.04);
      const depth = 1.6 - i * 0.13;
      steel.push({
        position: [x, (bottom + top) / 2, z],
        scale: [width, top - bottom, 1.6 - i * 0.13],
      });
      // Fluted plates on both faces of the Art Deco tower shafts.
      for (const face of [-1, 1])
        for (const rib of [-0.34, -0.11, 0.11, 0.34]) {
          accents.push({
            position: [x + width * rib, (bottom + top) / 2, z + face * (depth / 2 + 0.025)],
            scale: [0.052, top - bottom - 0.12, 0.065],
            color: PALETTE.orangeLight,
          });
        }
      for (const offset of [-1, 1])
        accents.push({
          position: [x + offset * width * 0.41, (bottom + top) / 2, z + 0.76 - i * 0.064],
          scale: [0.055, top - bottom, 0.05],
          color: PALETTE.orangeLight,
        });
      accents.push({
        position: [x, top - 0.06, z],
        scale: [width + 0.055, 0.11, 1.64 - i * 0.13],
        color: PALETTE.orangeDark,
      });
      for (const face of [-1, 1])
        for (const dx of [-0.35, 0.35])
          for (let y = bottom + 0.12; y < top - 0.06; y += 0.23)
            rivets.push({
              position: [x + width * dx, y, z + face * (depth / 2 + 0.06)],
              scale: [0.016, 0.016, 0.01],
            });
    }
  }
  for (const y of [7.15, 10.8, 14.55, 18.05, 21.1].map((y) => (y * BRIDGE.towerHeight) / 22.7)) {
    steel.push({ position: [0, y, z], scale: [3.1, y === 7.15 ? 0.95 : 0.57, 1.02] });
    accents.push({
      position: [0, y - 0.28, z],
      scale: [3.0, 0.08, 1.1],
      color: PALETTE.orangeDark,
    });
    // Small stepped corbels soften the portal corners.
    for (const side of [-1, 1])
      steel.push({ position: [side * 1.1, y - 0.36, z], scale: [0.35, 0.26, 1.0] });
    for (const side of [-1, 1])
      for (const face of [-1, 1])
        accents.push({
          position: [side * 1.13, y, z + face * 0.55],
          scale: [0.27, 0.66, 0.055],
          color: PALETTE.orangeDark,
        });
  }
  return {
    steel,
    accents,
    rivets,
    concrete: [{ position: [0, 0.35, z] as const, scale: [5.3, 1.5, 3.1] as const }],
  };
}
