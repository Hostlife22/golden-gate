import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import { useObservatory } from '../../app/context';
import { RENDER_QUALITY } from '../../config/rendering';
import { FRAME_PRIORITY } from '../framePriorities';
import { coastalField } from './coastalField';
import { createWaterResources } from './resources';

export function Water() {
  const { runtime, settings } = useObservatory();
  const { gl, camera, scene } = useThree();
  const coast = useMemo(coastalField, []);
  useEffect(() => () => coast.texture.dispose(), [coast]);
  const quality = RENDER_QUALITY[settings.quality];
  const resources = useMemo(
    () => createWaterResources(coast, quality.reflectionSize),
    [coast, quality],
  );
  useEffect(() => () => resources.dispose(), [resources]);
  useFrame(() => {
    const w = runtime.weather;
    const u = resources.material.uniforms;
    u.uTime.value = runtime.clock.time;
    u.uEnvironment.value = scene.environment;
    u.uWater.value.copy(w.water);
    u.uSky.value.copy(w.sky);
    u.uSun.value.copy(w.sun);
    u.uSunDirection.value.copy(w.sunPosition).normalize();
    if (camera instanceof PerspectiveCamera) resources.reflection.render(gl, camera);
  }, FRAME_PRIORITY.reflection);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={resources.geometry}
      material={resources.material}
    />
  );
}
