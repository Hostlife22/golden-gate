import { useMemo } from 'react';
import { BufferGeometry, Color, Float32BufferAttribute } from 'three';
import { LANDMARKS } from '../../data/geography';
import { seeded } from '../../simulation/math';
import { Instances } from '../Instances';
import type { Instance } from '../Instances';
import { isLand, shoreDistance, terrainHeight } from './height';
export function Terrain() {
  const geometry = useMemo(() => {
    const coordinates = (lo: number, hi: number, nearLo: number, nearHi: number) => {
      const values: number[] = [];
      for (let v = lo; v <= hi; v += v >= nearLo && v < nearHi ? 4.5 : 24) values.push(v);
      return values;
    };
    const xs = coordinates(-1150, 1650, -420, 430),
      zs = coordinates(-1480, 1420, -380, 460),
      positions: number[] = [],
      indices: number[] = [];
    for (const z of zs) for (const x of xs) positions.push(x, 0, z);
    for (let j = 0; j < zs.length - 1; j++)
      for (let i = 0; i < xs.length - 1; i++) {
        const a = j * xs.length + i,
          b = a + 1,
          c = a + xs.length,
          d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    const p = g.attributes.position,
      colors = new Float32Array(p.count * 3),
      grass = new Color('#6b7650'),
      rock = new Color('#928b73'),
      dry = new Color('#8c8b60'),
      tint = new Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i),
        d = shoreDistance(x, z),
        h = terrainHeight(x, z, d);
      p.setY(i, h);
      const patch =
        (Math.sin(x * 0.055 + z * 0.033) + Math.cos(x * 0.039 - z * 0.076)) * 0.14 + 0.35;
      tint
        .copy(grass)
        .lerp(dry, patch)
        .lerp(rock, 1 - Math.min(1, d / 7));
      if (h < 0) tint.copy(rock);
      colors.set([tint.r, tint.g, tint.b], i * 3);
    }
    g.setAttribute('color', new Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  const { trees, rocks } = useMemo(() => {
    const random = seeded(1937),
      trees: Instance[] = [],
      rocks: Instance[] = [];
    for (let i = 0; i < 3500; i++) {
      const x = random() * 800 - 460,
        z = random() * 560 - 280;
      if (!isLand(x, z)) continue;
      const y = terrainHeight(x, z),
        d = shoreDistance(x, z);
      if (y < 1 || d < 2) continue;
      if (z > 100 && x > 120) continue;
      if (z < -60 && random() > 0.26) continue;
      if (Math.abs(x) < 24 && Math.abs(z) < 155) continue;
      const size = 0.35 + random() * 0.7;
      trees.push({
        position: [x, y + size * 0.8, z],
        scale: [size * 0.54, size * 1.8, size * 0.55],
        rotation: [0, random() * 6.28, 0],
        color: random() > 0.5 ? '#374d37' : '#4a583b',
      });
      if (trees.length > 850) break;
    }
    for (let i = 0; i < 1400; i++) {
      const x = random() * 620 - 380,
        z = random() * 430 - 220;
      if (!isLand(x, z)) continue;
      const d = shoreDistance(x, z);
      if (d > 7) continue;
      const size = 0.4 + random() * 1.5,
        y = terrainHeight(x, z, d);
      rocks.push({
        position: [x, y - 0.18, z],
        scale: [size, size * 0.5, size * 0.8],
        rotation: [random() * 0.4, random() * 6, random() * 0.4],
      });
    }
    return { trees, rocks };
  }, []);
  const fort = LANDMARKS.fortPoint,
    alcatraz = LANDMARKS.alcatraz;
  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={1} />
      </mesh>
      <Instances items={trees} color="#3f5036" shape="cone" />
      <Instances items={rocks} color="#888575" />
      <Instances
        items={[
          { position: [fort[0], 1.1, fort[1]], scale: [6.0, 2.1, 4.5] },
          { position: [alcatraz[0], 4.4, alcatraz[1]], scale: [10.5, 2, 4.5] },
          { position: [alcatraz[0] - 9, 4.8, alcatraz[1] + 2], scale: [0.9, 3.5, 0.9] },
        ]}
        color="#b8b09c"
      />
    </group>
  );
}
