import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useObservatory } from '../../app/context';
import { createFogBanks, createFogMaterial } from './fogResources';

export function CoastalFog() {
  const { runtime, settings } = useObservatory(),
    group = useRef<Group>(null);
  const patches = useMemo(createFogBanks, []);
  const material = useMemo(createFogMaterial, []);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(({ camera }) => {
    material.uniforms.uTime.value = runtime.clock.time;
    material.uniforms.uDensity.value = runtime.weather.lowFog * settings.fog;
    material.uniforms.uColor.value.copy(runtime.weather.haze);
    if (group.current)
      for (const child of group.current.children)
        child.rotation.y = Math.atan2(
          camera.position.x - child.position.x,
          camera.position.z - child.position.z,
        );
  });
  return (
    <group ref={group}>
      {patches.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, p.y, p.z]}
          scale={[p.scale[0], p.scale[1], 1]}
          material={material}
          renderOrder={5}
        >
          <planeGeometry />
        </mesh>
      ))}
    </group>
  );
}
