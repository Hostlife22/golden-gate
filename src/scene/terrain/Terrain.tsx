import { useEffect, useMemo } from 'react';
import { BufferGeometry, Color, Float32BufferAttribute } from 'three';
import { LANDMARKS } from '../../data/geography';
import { seeded, terrainNoise } from '../../simulation/math';
import { Instances } from '../Instances';
import type { Instance } from '../Instances';
import { isLand, shoreDistance, terrainHeight } from './height';
import { useObservatory } from '../../app/state';
import { useMaterials } from '../materials/context';
export function Terrain() {
  const { settings } = useObservatory(),
    materials = useMaterials();
  const geometry = useMemo(() => {
    const coordinates = (lo: number, hi: number, nearLo: number, nearHi: number) => {
      const values: number[] = [];
      for (
        let v = lo;
        v <= hi;
        v += v >= nearLo && v < nearHi ? (settings.quality === 'high' ? 1.7 : 2.6) : 20
      )
        values.push(v);
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
      grass = new Color('#d8d2b8'),
      rock = new Color('#c0b69d'),
      dry = new Color('#c8c3a9'),
      tint = new Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i),
        d = shoreDistance(x, z),
        h = terrainHeight(x, z, d);
      p.setY(i, h);
      const patch = 0.5 + terrainNoise(x * 0.023, z * 0.023);
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
  }, [settings.quality]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const { trees, trunks, rocks, shrubs } = useMemo(() => {
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
  }, []);
  const fort = LANDMARKS.fortPoint,
    alcatraz = LANDMARKS.alcatraz;
  return (
    <group>
      <mesh geometry={geometry} material={materials.terrain} receiveShadow />
      <Instances items={trunks} color="#76624b" shape="cylinder" />
      <Instances
        items={trees}
        color="#4b583b"
        shape="foliage"
        material={materials.foliage}
        castShadow
      />
      <Instances items={shrubs} color="#69704b" shape="foliage" material={materials.foliage} />
      <Instances items={rocks} color="#d2c8b6" shape="rock" material={materials.rock} castShadow />
      <Instances
        items={[
          { position: [fort[0], 1.1, fort[1]], scale: [6.0, 2.1, 4.5] },
          { position: [alcatraz[0], 4.4, alcatraz[1]], scale: [10.5, 2, 4.5] },
          { position: [alcatraz[0] - 9, 4.8, alcatraz[1] + 2], scale: [0.9, 3.5, 0.9] },
        ]}
        color="#b8b09c"
        material={materials.concrete}
      />
    </group>
  );
}
