import { IcosahedronGeometry, Vector3 } from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
export function rockGeometry() {
  const geometry = new IcosahedronGeometry(1, 1);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i),
      z = p.getZ(i);
    const radius = 0.9 + 0.13 * Math.sin(x * 8 + z * 3) * Math.cos(y * 6 - x * 4);
    p.setXYZ(i, x * radius, y * radius, z * radius);
  }
  geometry.computeVertexNormals();
  return geometry;
}
export function crownGeometry() {
  const lobes = [
    [0, 0.22, 0, 0.85],
    [-0.48, -0.05, 0.18, 0.63],
    [0.45, 0, -0.12, 0.68],
    [0.12, -0.34, 0.35, 0.54],
  ];
  const parts = lobes.map(([x, y, z, scale]) => {
    const g = new IcosahedronGeometry(scale, 0),
      p = g.attributes.position;
    const n = new Vector3();
    for (let i = 0; i < p.count; i++) {
      n.fromBufferAttribute(p, i);
      n.multiplyScalar(1 + 0.12 * Math.sin(n.x * 17 + n.y * 11 + n.z * 7));
      p.setXYZ(i, n.x, n.y, n.z);
    }
    g.translate(x, y, z);
    return g;
  });
  const merged = mergeGeometries(parts);
  parts.forEach((part) => part.dispose());
  const smooth = mergeVertices(merged);
  merged.dispose();
  smooth.computeVertexNormals();
  return smooth;
}
