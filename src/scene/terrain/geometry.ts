import { BufferGeometry, Color, Float32BufferAttribute } from 'three';
import { terrainNoise } from '../../simulation/math';
import { shoreDistance, terrainHeight } from './height';

export function createTerrainGeometry(nearSpacing: number) {
  const coordinates = (lo: number, hi: number, nearLo: number, nearHi: number) => {
    const values: number[] = [];
    for (let v = lo; v <= hi; v += v >= nearLo && v < nearHi ? nearSpacing : 20) values.push(v);
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
}
