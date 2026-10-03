import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { useObservatory } from '../../app/context';
import { VESSELS, vesselAt } from '../../simulation/routes';
import type { VesselRoute } from '../../simulation/routes';
import { VesselModel } from './VesselModel';
import { Wake } from './Wake';

interface VesselProps {
  route: VesselRoute;
}

function Vessel({ route }: VesselProps) {
  const { runtime } = useObservatory();
  const ref = useRef<Group>(null);
  const point = useMemo(() => ({ x: 0, z: 0, heading: 0 }), []);
  useFrame(() => {
    if (!ref.current) return;
    const p = vesselAt(route, runtime.clock.activityTime, point);
    ref.current.position.set(p.x, Math.sin(runtime.clock.time * 0.7 + route.phase) * 0.018, p.z);
    ref.current.rotation.set(
      Math.sin(runtime.clock.time + route.phase) * 0.006,
      p.heading,
      Math.sin(runtime.clock.time * 0.8) * 0.008,
    );
  });

  return (
    <>
      <group ref={ref}>
        <VesselModel type={route.type} length={route.length} />
      </group>
      <Wake route={route} />
    </>
  );
}

export function Vessels() {
  return (
    <group>
      {VESSELS.map((route) => (
        <Vessel key={route.id} route={route} />
      ))}
    </group>
  );
}
