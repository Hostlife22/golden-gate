import { seeded, terrainNoise } from '../../simulation/math';
import type { Instance } from '../Instances';
import { isLand, shoreDistance, terrainHeight } from './height';

export function createVegetation() {
  const random = seeded(1937),
    trees: Instance[] = [],
    trunks: Instance[] = [],
    shrubs: Instance[] = [],
    rocks: Instance[] = [];
  for (let i = 0; i < 10500; i++) {
    const x = random() * 800 - 460,
      z = random() * 560 - 280;
    if (!isLand(x, z)) continue;
    const y = terrainHeight(x, z),
      d = shoreDistance(x, z);
    if (y < 1 || d < 2) continue;
    if (z > 100 && x > 120) continue;
    const forest = terrainNoise(x * 0.023 + 15, z * 0.023 + 35);
    if (forest < (z < -60 ? 0.1 : -0.08)) continue;
    if (Math.abs(x) < 24 && Math.abs(z) < 155) continue;
    const size = 0.65 + random() * 0.7;
    trees.push({
      position: [x, y + size * 1.55, z],
      scale: [size * 0.68, size * 0.77, size * 0.67],
      rotation: [0, random() * 6.28, 0],
      color: random() > 0.5 ? '#40513b' : '#596342',
    });
    trunks.push({
      position: [x, y + size * 0.7, z],
      scale: [0.035 + size * 0.025, size * 1.4, 0.035 + size * 0.025],
    });
    if (trees.length >= 1150) break;
  }
  for (let i = 0; i < 1400; i++) {
    const x = random() * 620 - 380,
      z = random() * 430 - 220;
    if (!isLand(x, z)) continue;
    const d = shoreDistance(x, z);
    if (d > 7) continue;
    const size = 0.32 + random() * 1.5,
      y = terrainHeight(x, z, d);
    rocks.push({
      position: [x, y + size * 0.14, z],
      scale: [size, size * (0.36 + random() * 0.4), size * 0.75],
      rotation: [random() * 0.4, random() * 6, random() * 0.4],
    });
  }
  for (let i = 0; i < 2400; i++) {
    const x = random() * 530 - 360,
      z = random() * 360 - 250;
    if (!isLand(x, z) || shoreDistance(x, z) < 2 || (Math.abs(x) < 24 && Math.abs(z) < 155))
      continue;
    const size = 0.12 + random() * 0.22;
    shrubs.push({
      position: [x, terrainHeight(x, z) + size * 0.3, z],
      scale: [size * 1.5, size * 0.55, size],
      color: random() > 0.5 ? '#74754e' : '#606a46',
    });
  }
  return { trees, trunks, rocks, shrubs };
}
