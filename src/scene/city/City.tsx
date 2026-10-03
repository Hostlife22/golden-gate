import { useMemo } from 'react';
import { LANDMARKS } from '../../data/geography';
import { seeded } from '../../simulation/math';
import { Instances } from '../Instances';
import type { Instance } from '../Instances';
import { isLand, shoreDistance, terrainHeight } from '../terrain/height';
export function City() {
  const { buildings, roads, roof } = useMemo(() => {
    const random = seeded(94129),
      buildings: Instance[] = [],
      roads: Instance[] = [],
      roof: Instance[] = [];
    for (let gx = 0; gx < 44; gx++)
      for (let gz = 0; gz < 28; gz++) {
        const x = 112 + gx * 14,
          z = 135 + gz * 15;
        if (!isLand(x, z) || shoreDistance(x, z) < 5) continue;
        // Aligned blocks, with alleys and two building footprints per block.
        const downtown = Math.exp(-((x - 690) ** 2 + (z - 315) ** 2) / 10000);
        for (let a = 0; a < 2; a++) {
          const bx = x + a * 5.4,
            bz = z + random() * 0.5,
            w = 3.4 + random(),
            h = 0.8 + random() * 1.7 + downtown * random() * 13;
          const y = terrainHeight(bx, bz);
          buildings.push({
            position: [bx, y + h / 2, bz],
            scale: [w, h, 8 + random() * 2],
            color: ['#b7b5a6', '#c3bca9', '#a8ada7', '#d0c6b4'][Math.floor(random() * 4)],
          });
          if (gx < 13 && gz < 14)
            roof.push({
              position: [bx, y + h + 0.045, bz],
              scale: [w + 0.05, 0.1, 8.7],
              color: '#8c8b7f',
            });
        }
        const y = terrainHeight(x - 3, z) + 0.035;
        roads.push({ position: [x - 3, y, z], scale: [1.6, 0.05, 15] });
        roads.push({
          position: [x + 4, terrainHeight(x + 4, z - 6.8) + 0.045, z - 6.8],
          scale: [14, 0.05, 1.5],
        });
      }
    // Merged distant blocks continue the peninsula rather than ending in a rectangular field.
    for (let z = 560; z < 1350; z += 31)
      for (let x = -115; x < 735; x += 30) {
        if (!isLand(x, z) || shoreDistance(x, z) < 10) continue;
        const h = 0.7 + random() * 1.0;
        buildings.push({
          position: [x, terrainHeight(x, z) + h / 2, z],
          scale: [22 + random() * 3, h, 23 + random() * 3],
          color: random() > 0.5 ? '#a9afa2' : '#b6b6a6',
        });
      }
    // Low, ordered waterfront warehouses. No downtown towers at the bridge.
    for (let i = 0; i < 13; i++) {
      const x = 72 + i * 10,
        z = 129 + i * 0.12;
      if (isLand(x, z))
        buildings.push({
          position: [x, terrainHeight(x, z) + 0.4, z],
          scale: [5, 0.8, 3],
          color: '#c4baa4',
        });
    }
    return { buildings, roads, roof };
  }, []);
  const sf = LANDMARKS.salesforce,
    ta = LANDMARKS.transamerica;
  return (
    <group>
      <Instances items={roads} color="#7b7f78" />
      <Instances items={buildings} color="#bcb8a8" />
      <Instances items={roof} color="#939286" />
      <mesh position={[sf[0], terrainHeight(...sf) + 16.3, sf[1]]}>
        <cylinderGeometry args={[1.85, 2.85, 32.6, 12]} />
        <meshStandardMaterial color="#94a7a6" roughness={0.62} />
      </mesh>
      <mesh position={[ta[0], terrainHeight(...ta) + 13, ta[1]]}>
        <coneGeometry args={[3.4, 26, 4]} />
        <meshStandardMaterial color="#c8c5b5" roughness={0.85} />
      </mesh>
    </group>
  );
}
