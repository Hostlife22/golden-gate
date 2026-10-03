import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Color, InstancedMesh, Object3D } from 'three';
import type { Material } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { crownGeometry, rockGeometry } from './organicGeometry';
import type { Point3 } from '../data/geography';

export interface Instance {
  position: Point3;
  scale: Point3;
  rotation?: Point3;
  color?: string;
}

interface InstancesProps {
  items: Instance[];
  color: string;
  shape?: 'box' | 'cylinder' | 'cone' | 'rock' | 'foliage' | 'beveled' | 'sphere';
  roughness?: number;
  castShadow?: boolean;
  material?: Material;
}

export function Instances({
  items,
  color,
  shape = 'box',
  roughness = 0.85,
  castShadow = false,
  material,
}: InstancesProps) {
  const ref = useRef<InstancedMesh>(null);
  const organic = useMemo(
    () =>
      shape === 'rock'
        ? rockGeometry()
        : shape === 'foliage'
          ? crownGeometry()
          : shape === 'beveled'
            ? new RoundedBoxGeometry(1, 1, 1, 2, 0.035)
            : null,
    [shape],
  );
  useEffect(() => () => organic?.dispose(), [organic]);
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
      mesh.setColorAt(i, tint.set(item.color ?? color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items, color]);
  if (!items.length) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, items.length]}
      castShadow={castShadow}
      receiveShadow
    >
      {organic ? (
        <primitive object={organic} attach="geometry" dispose={null} />
      ) : shape === 'sphere' ? (
        <icosahedronGeometry args={[1, 0]} />
      ) : shape === 'box' ? (
        <boxGeometry />
      ) : shape === 'cylinder' ? (
        <cylinderGeometry args={[1, 1, 1, 8]} />
      ) : (
        <coneGeometry args={[1, 1, 6]} />
      )}
      {material ? (
        <primitive object={material} attach="material" dispose={null} />
      ) : (
        <meshStandardMaterial color="#ffffff" roughness={roughness} />
      )}
    </instancedMesh>
  );
}
