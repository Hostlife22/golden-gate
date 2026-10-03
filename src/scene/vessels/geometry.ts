import { BufferGeometry, ExtrudeGeometry, Float32BufferAttribute, Shape } from 'three';

export function createHullGeometry(length: number, width: number, cargo: boolean) {
  const shape = new Shape();
  shape.moveTo(-length / 2, -width * 0.42);
  shape.quadraticCurveTo(-length * 0.45, -width / 2, -length * 0.32, -width / 2);
  shape.lineTo(length * 0.22, -width / 2);
  shape.quadraticCurveTo(length * 0.44, -width * 0.45, length / 2, 0);
  shape.quadraticCurveTo(length * 0.44, width * 0.45, length * 0.22, width / 2);
  shape.lineTo(-length * 0.32, width / 2);
  shape.quadraticCurveTo(-length * 0.45, width / 2, -length / 2, width * 0.42);
  shape.closePath();
  return new ExtrudeGeometry(shape, {
    depth: cargo ? 0.65 : 0.26,
    bevelEnabled: true,
    bevelSize: 0.025,
    bevelThickness: 0.045,
    bevelSegments: 2,
    curveSegments: 12,
  });
}

export function createSailGeometry() {
  const positions: number[] = [],
    indices: number[] = [],
    rows = 12,
    cols = 6;
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++) {
      const u = i / cols,
        v = j / rows;
      positions.push(
        0.72 * u * (1 - v),
        0.34 + 1.6 * v,
        0.12 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI),
      );
    }
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i,
        b = a + 1,
        c = a + cols + 1;
      indices.push(a, c, b, b, c, c + 1);
    }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
