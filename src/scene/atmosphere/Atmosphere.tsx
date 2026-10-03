import { blendWeather, createWeatherState } from '../../simulation/weather';
import { RENDER_QUALITY } from '../../config/rendering';
import { FRAME_PRIORITY } from '../framePriorities';
import { CoastalFog } from './CoastalFog';
import { createDaylightSky, SkyEnvironment } from './skyEnvironment';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { DirectionalLight, FogExp2, HemisphereLight } from 'three';
import { useObservatory } from '../../app/context';

export function Atmosphere() {
  const { runtime, settings } = useObservatory(),
    { scene, gl } = useThree(),
    light = useRef<DirectionalLight>(null),
    ambient = useRef<HemisphereLight>(null);
  const target = useMemo(() => createWeatherState(settings.weather), [settings.weather]);
  const fog = useMemo(() => new FogExp2('#d5c7b4', 0.0008), []);
  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);
  const sky = useMemo(createDaylightSky, []);
  const environment = useMemo(() => new SkyEnvironment(gl), [gl]);
  useEffect(
    () => () => {
      scene.environment = null;
      environment.dispose();
      sky.material.dispose();
      sky.geometry.dispose();
    },
    [scene, environment, sky],
  );
  useFrame((_, delta) => {
    const w = runtime.weather,
      alpha = 1 - Math.exp(-Math.min(delta, 1) * 2.0);
    blendWeather(w, target, delta);
    fog.color.copy(w.haze);
    fog.density = w.fog * settings.fog;
    gl.toneMappingExposure = w.exposure;
    if (light.current) {
      light.current.position.copy(w.sunPosition);
      light.current.color.copy(w.sun);
      light.current.intensity = w.intensity;
    }
    if (ambient.current) {
      ambient.current.color.copy(w.sky);
      ambient.current.intensity = w.ambient * 0.58;
    }
    const u = sky.material.uniforms;
    u.sunPosition.value.copy(w.sunPosition);
    u.time.value = runtime.clock.time;
    const turbulence = settings.weather === 'fog' ? 16 : settings.weather === 'golden' ? 5.5 : 3.3;
    u.turbidity.value += (turbulence - u.turbidity.value) * alpha;
    u.cloudCoverage.value +=
      ((settings.weather === 'fog' ? 0.74 : 0.36) - u.cloudCoverage.value) * alpha;
    scene.environmentIntensity = w.ambient * 0.12;
    const settled = Math.abs(w.sunPosition.y - target.sunPosition.y) < 2;
    scene.environment = environment.update(sky, settings.weather, delta, settled);
  }, FRAME_PRIORITY.atmosphere);
  return (
    <>
      <hemisphereLight ref={ambient} args={['#b7c7ca', '#565947', 1.4]} />
      <directionalLight
        ref={light}
        castShadow
        shadow-mapSize={[
          RENDER_QUALITY[settings.quality].shadowMapSize,
          RENDER_QUALITY[settings.quality].shadowMapSize,
        ]}
        shadow-camera-left={-160}
        shadow-camera-right={160}
        shadow-camera-top={160}
        shadow-camera-bottom={-160}
        shadow-camera-near={1}
        shadow-camera-far={900}
        shadow-bias={-0.0002}
        shadow-normalBias={0.08}
      />
      <primitive object={sky} dispose={null} />
      <CoastalFog />
    </>
  );
}
