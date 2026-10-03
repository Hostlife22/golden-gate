import { seeded } from '../../simulation/math';
import type { Instance } from '../Instances';
import { isLand, shoreDistance, terrainHeight } from '../terrain/height';

export function createCityLayout() {
  const random = seeded(94129),
    buildings: Instance[] = [],
    roads: Instance[] = [],
    roof: Instance[] = [],
    equipment: Instance[] = [];
  const tones = ['#dfd8c5', '#bebcae', '#b9c1ba', '#d8c0a8', '#c9ccbf', '#c7b6a7'];
  // Smaller terraced residential footprints with courtyards and continuous streets.
  for (let x = 83; x < 375; x += 9.4)
    for (let z = 140; z < 485; z += 10) {
      if (!isLand(x, z) || shoreDistance(x, z) < 7) continue;
      for (let row = 0; row < 2; row++)
        for (let house = 0; house < 4; house++) {
          const bx = x + house * 1.75,
            bz = z + row * 4.1;
          if (!isLand(bx, bz) || shoreDistance(bx, bz) < 3) continue;
          const h = (3 + Math.floor(random() * 3)) * 0.32,
            y = terrainHeight(bx, bz),
            w = 1.45 + random() * 0.16;
          buildings.push({
            position: [bx, y + h / 2, bz],
            scale: [w, h, 3.0],
            color: tones[Math.floor(random() * tones.length)],
          });
          roof.push({
            position: [bx, y + h + 0.025, bz],
            scale: [w + 0.04, 0.055, 3.04],
            color: random() > 0.35 ? '#767c78' : '#9c8c77',
          });
          if (random() > 0.65)
            equipment.push({
              position: [bx + 0.2, y + h + 0.09, bz + 0.7],
              scale: [0.24, 0.14, 0.35],
            });
        }
      roads.push({
        position: [x - 1.4, terrainHeight(x - 1.4, z + 2) + 0.025, z + 2],
        scale: [1.6, 0.045, 10.2],
      });
      roads.push({
        position: [x + 3, terrainHeight(x + 3, z - 1.6) + 0.03, z - 1.6],
        scale: [9.5, 0.045, 1.5],
      });
    }
  // Downtown massing is centered on the actual financial district, away from the bridge.
  for (let x = 385; x < 770; x += 13.5)
    for (let z = 148; z < 525; z += 14) {
      if (!isLand(x, z) || shoreDistance(x, z) < 7) continue;
      const center = Math.exp(-((x - 685) ** 2 + (z - 320) ** 2) / 18000);
      for (let i = 0; i < 2; i++) {
        const bx = x + i * 5.2,
          bz = z + random() * 1.6,
          h = 1.2 + random() * 1.6 + center * (2 + random() * 14),
          y = terrainHeight(bx, bz),
          w = 3 + random() * 1.1,
          d = 6.3 + random() * 1.5;
        buildings.push({
          position: [bx, y + h / 2, bz],
          scale: [w, h, d],
          color: tones[Math.floor(random() * tones.length)],
        });
        roof.push({
          position: [bx, y + h + 0.06, bz],
          scale: [w + 0.08, 0.12, d + 0.08],
          color: '#a5a59a',
        });
        if (center > 0.3)
          equipment.push({ position: [bx, y + h + 0.4, bz], scale: [w * 0.6, 0.65, d * 0.4] });
      }
      roads.push({
        position: [x - 2.0, terrainHeight(x - 2.0, z) + 0.03, z],
        scale: [1.5, 0.04, 14],
      });
    }
  // Distant blocks vary in subdivision and coverage rather than forming a tiled slab field.
  for (let z = 535; z < 1350; z += 21)
    for (let x = -115; x < 735; x += 19) {
      if (!isLand(x, z) || shoreDistance(x, z) < 15) continue;
      if ((z < 665 && x < 220 && random() < 0.32) || random() < 0.08) continue;
      for (let part = 0; part < 3; part++) {
        const bx = x + (part % 2) * 7.0 + random() * 0.7,
          bz = z + Math.floor(part / 2) * 8.5;
        const h = 0.65 + random() * 0.9,
          w = 5.0 + random() * 1.8,
          d = 6 + random() * 1.5;
        if (!isLand(bx, bz) || shoreDistance(bx, bz) < 7) continue;
        const y = terrainHeight(bx, bz);
        buildings.push({
          position: [bx, y + h / 2, bz],
          scale: [w, h, d],
          color: random() > 0.5 ? '#b6b7a9' : '#c1bbab',
        });
      }
    }
  return { buildings, roads, roof, equipment };
}
