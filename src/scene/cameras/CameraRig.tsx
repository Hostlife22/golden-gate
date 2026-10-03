import { FRAME_PRIORITY } from '../framePriorities';
import { useEffect, useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useObservatory } from '../../app/context';
import { getCameraPreset } from '../../data/presets';
import { bridgeToWorld, smoothstep, worldToBridge } from '../../simulation/math';
import { terrainHeight } from '../terrain/height';

interface Flight {
  elapsed: number;
  duration: number;
  position: Vector3;
  target: Vector3;
  endPosition: Vector3;
  endTarget: Vector3;
  fov: number;
  endFov: number;
}

export function CameraRig() {
  const { settings, runtime, update } = useObservatory(),
    { camera, gl, size } = useThree(),
    controls = useRef<OrbitControlsImpl>(null),
    flight = useRef<Flight | null>(null);
  const deltaPosition = useMemo(() => new Vector3(), []);
  const portrait = size.width / size.height < 0.8;
  useEffect(() => {
    if (settings.camera === 'free') {
      flight.current = null;
      runtime.cameraFlying = false;
      return;
    }
    const p = getCameraPreset(settings.camera);
    if (!(camera instanceof PerspectiveCamera) || !controls.current) return;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.01 : 2.5;
    flight.current = {
      elapsed: 0,
      duration,
      position: camera.position.clone(),
      target: controls.current.target.clone(),
      endPosition: new Vector3(
        ...(portrait && settings.camera === 'hero' ? ([-105, 59, 195] as const) : p.position),
      ),
      endTarget: new Vector3(...p.target),
      fov: camera.fov,
      endFov: portrait && settings.camera === 'hero' ? 52 : p.fov,
    };
    runtime.cameraFlying = true;
  }, [settings.camera, settings.reset, camera, runtime, portrait]);
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    c.listenToKeyEvents(gl.domElement);
    return () => c.stopListenToKeyEvents();
  }, [gl]);
  useFrame((_, delta) => {
    const c = controls.current;
    if (!c || !(camera instanceof PerspectiveCamera)) return;
    const f = flight.current;
    if (f) {
      f.elapsed += Math.min(delta, 1);
      const raw = Math.min(1, f.elapsed / f.duration),
        t = smoothstep(raw);
      camera.position.lerpVectors(f.position, f.endPosition, t);
      camera.position.y +=
        Math.sin(raw * Math.PI) * Math.min(55, f.position.distanceTo(f.endPosition) * 0.16);
      c.target.lerpVectors(f.target, f.endTarget, t);
      camera.fov = f.fov + (f.endFov - f.fov) * t;
      camera.updateProjectionMatrix();
      c.update();
      if (raw === 1) {
        flight.current = null;
        runtime.cameraFlying = false;
      }
    }
    const minimum = Math.max(0.9, terrainHeight(camera.position.x, camera.position.z) + 1.3);
    camera.position.y = Math.max(camera.position.y, minimum);
    const [x, z] = worldToBridge(camera.position.x, camera.position.z);
    if (Math.abs(Math.abs(z) - 64) < 2.3 && Math.abs(x) < 2.4 && camera.position.y < 23.4) {
      const p = bridgeToWorld(x < 0 ? -2.8 : 2.8, camera.position.y, z);
      camera.position.set(...p);
    }
    // Keep dolly gestures from putting the eye inside the roadway or anchorage.
    if (Math.abs(x) < 1.55 && Math.abs(z) < 137 && Math.abs(camera.position.y - 7.3) < 0.85)
      camera.position.y = 8.3;
    deltaPosition.copy(camera.position).sub(c.target);
    const compass = document.getElementById('compass-needle');
    if (compass)
      compass.style.transform = `rotate(${(Math.atan2(deltaPosition.x, deltaPosition.z) * 180) / Math.PI}deg)`;
  }, FRAME_PRIORITY.camera);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.075}
      minDistance={2.5}
      maxDistance={1800}
      maxPolarAngle={Math.PI * 0.68}
      zoomSpeed={0.65}
      rotateSpeed={0.6}
      target={[0, 7, -5]}
      onStart={() => {
        flight.current = null;
        runtime.cameraFlying = false;
        if (settings.camera !== 'free') update({ camera: 'free' });
      }}
    />
  );
}
