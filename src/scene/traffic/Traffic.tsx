import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, InstancedMesh, Object3D } from 'three';
import { useObservatory } from '../../app/state';
import { BRIDGE_ANGLE } from '../../data/bridge';
import { VEHICLE_COUNT, vehicleAt } from '../../simulation/routes';
export function Traffic() {
  const { runtime } = useObservatory(),
    body = useRef<InstancedMesh>(null),
    tops = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []),
    tint = useMemo(() => new Color(), []),
    point = useMemo(() => ({ x: 0, y: 0, z: 0, direction: 0, heading: 0 }), []);
  useFrame(() => {
    if (!body.current || !tops.current) return;
    for (let i = 0; i < VEHICLE_COUNT; i++) {
      const p = vehicleAt(i, runtime.clock.activityTime, point),
        bus = i % 17 === 0,
        length = bus ? 0.98 : 0.38 + (i % 3) * 0.025;
      dummy.position.set(p.x, p.y + 0.08, p.z);
      dummy.rotation.set(0, p.heading, 0);
      dummy.scale.set(bus ? 0.24 : 0.17, bus ? 0.22 : 0.11, length);
      dummy.updateMatrix();
      body.current.setMatrixAt(i, dummy.matrix);
      if (runtime.metrics.frames < 3)
        body.current.setColorAt(
          i,
          tint.set(['#e0ddd0', '#385762', '#b07153', '#676b67', '#d3c2a0', '#39434a'][i % 6]),
        );
      dummy.position.y += bus ? 0.05 : 0.075;
      dummy.scale.set(bus ? 0.225 : 0.14, bus ? 0.15 : 0.09, length * 0.52);
      dummy.updateMatrix();
      tops.current.setMatrixAt(i, dummy.matrix);
    }
    body.current.instanceMatrix.needsUpdate = true;
    tops.current.instanceMatrix.needsUpdate = true;
    if (body.current.instanceColor) body.current.instanceColor.needsUpdate = true;
  });
  return (
    <group rotation={[0, -BRIDGE_ANGLE, 0]}>
      <instancedMesh ref={body} args={[undefined, undefined, VEHICLE_COUNT]} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color="white" roughness={0.65} />
      </instancedMesh>
      <instancedMesh ref={tops} args={[undefined, undefined, VEHICLE_COUNT]} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color="#293e43" roughness={0.55} />
      </instancedMesh>
    </group>
  );
}
