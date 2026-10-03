import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useObservatory } from '../../app/context';
import { vesselAt } from '../../simulation/routes';
import type { VesselRoute } from '../../simulation/routes';
import { createWakeResources, WAKE_SEGMENTS, WAKE_MAX_AGE } from './wakeResources';

interface WakeProps {
  route: VesselRoute;
}

export function Wake({ route }: WakeProps) {
  const { runtime, settings } = useObservatory();
  const point = useMemo(() => ({ x: 0, z: 0, heading: 0 }), []);
  const { geometry, material } = useMemo(createWakeResources, []);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  useFrame(() => {
    const attr = geometry.attributes.position;
    for (let i = 0; i < WAKE_SEGMENTS; i++) {
      const age = (i / (WAKE_SEGMENTS - 1)) * WAKE_MAX_AGE,
        p = vesselAt(route, runtime.clock.activityTime - age, point),
        dx = Math.cos(p.heading),
        dz = -Math.sin(p.heading);
      const width = age * 0.14 + route.length * 0.11;
      for (let arm = 0; arm < 2; arm++)
        for (let edge = 0; edge < 2; edge++) {
          const side = arm === 0 ? -1 : 1,
            w = side * (width + (edge === 0 ? -0.1 : 0.1) * (1 + age * 0.07));
          attr.setXYZ(
            i * 4 + arm * 2 + edge,
            p.x - dx * route.length * 0.48 - dz * w,
            0.045,
            p.z - dz * route.length * 0.48 + dx * w,
          );
        }
    }
    attr.needsUpdate = true;
    material.uniforms.uTime.value = runtime.clock.time;
    material.uniforms.uStrength.value = Math.min(1, settings.intensity);
  });
  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={2} />;
}
