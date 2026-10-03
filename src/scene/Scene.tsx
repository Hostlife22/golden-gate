import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useObservatory } from '../app/state';
import { Bridge } from './bridge/Bridge';
import { Terrain } from './terrain/Terrain';
import { City } from './city/City';
import { Water } from './water/Water';
import { Atmosphere } from './atmosphere/Atmosphere';
import { Traffic } from './traffic/Traffic';
import { Vessels } from './vessels/Vessels';
import { CameraRig } from './cameras/CameraRig';
import { MaterialLibrary } from './materials/MaterialLibrary';
export default function Scene() {
  const { settings, runtime, ready } = useObservatory(),
    { gl, camera } = useThree();
  useEffect(() => {
    ready();
  }, [ready]);
  useEffect(() => {
    const visible = () => {
      runtime.clock.hidden = document.hidden;
    };
    document.addEventListener('visibilitychange', visible);
    visible();
    const enabled = new URLSearchParams(location.search).has('diagnostics');
    if (enabled)
      window.__observatory = () => ({
        time: runtime.clock.time,
        activityTime: runtime.clock.activityTime,
        paused: runtime.clock.paused,
        hidden: runtime.clock.hidden,
        camera: camera.position.toArray(),
        cameraFlying: runtime.cameraFlying,
        weather: {
          fog: runtime.weather.fog,
          lowFog: runtime.weather.lowFog,
          sun: runtime.weather.sunPosition.toArray(),
        },
        metrics: { ...runtime.metrics, samples: [...runtime.metrics.samples] },
      });
    return () => {
      document.removeEventListener('visibilitychange', visible);
      delete window.__observatory;
    };
  }, [runtime, camera]);
  useFrame((_, delta) => {
    runtime.clock.paused = settings.paused;
    runtime.clock.advance(delta, settings.intensity);
    const m = runtime.metrics;
    m.frames++;
    m.totalMs += delta * 1000;
    m.maxMs = Math.max(m.maxMs, delta * 1000);
    if (m.frames > 40) {
      if (m.samples.length === 600) m.samples.shift();
      m.samples.push(delta * 1000);
    }
    m.drawCalls = gl.info.render.calls;
    m.triangles = gl.info.render.triangles;
  }, -100);
  return (
    <MaterialLibrary>
      <Atmosphere />
      <Terrain />
      <City />
      <Bridge />
      <Water />
      <Traffic />
      <Vessels />
      <CameraRig />
    </MaterialLibrary>
  );
}
