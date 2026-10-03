import { useLayoutEffect, useRef } from 'react';
import { Color, InstancedMesh, Object3D } from 'three';
import type { Point3 } from '../data/geography';
export interface Instance {
  position: Point3;
  scale: Point3;
  rotation?: Point3;
  color?: string;
}
export function Instances({
  items,
  color,
  shape = 'box',
  roughness = 0.85,
  castShadow = false,
}: {
  items: Instance[];
  color: string;
  shape?: 'box' | 'cylinder' | 'cone';
  roughness?: number;
  castShadow?: boolean;
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D(),
      tint = new Color();
    items.forEach((item, i) => {
      dummy.position.set(...item.position);
      dummy.scale.set(...item.scale);
      dummy.rotation.set(...(item.rotation ?? [0, 0, 0]));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (item.color) mesh.setColorAt(i, tint.set(item.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  if (!items.length) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, items.length]}
      castShadow={castShadow}
      receiveShadow
    >
      {shape === 'box' ? (
        <boxGeometry />
      ) : shape === 'cylinder' ? (
        <cylinderGeometry args={[1, 1, 1, 4]} />
      ) : (
        <coneGeometry args={[1, 1, 6]} />
      )}
      <meshStandardMaterial color={color} roughness={roughness} />
    </instancedMesh>
  );
}
