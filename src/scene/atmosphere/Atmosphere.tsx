import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Color,
  DirectionalLight,
  DoubleSide,
  FogExp2,
  Group,
  HemisphereLight,
  ShaderMaterial,
  Scene,
  PMREMGenerator,
} from 'three';
import { useObservatory } from '../../app/state';
import { WEATHER } from '../../data/presets';
import { Sky } from 'three/addons/objects/Sky.js';
import type { WebGLRenderTarget } from 'three';
import { seeded } from '../../simulation/math';
export function Atmosphere() {
  const { runtime, settings } = useObservatory(),
    { scene, gl } = useThree(),
    light = useRef<DirectionalLight>(null),
    ambient = useRef<HemisphereLight>(null);
  const target = useMemo(() => {
    const w = WEATHER[settings.weather];
    return {
      ...w,
      sky: new Color(w.sky),
      haze: new Color(w.haze),
      water: new Color(w.water),
      sun: new Color(w.sun),
    };
  }, [settings.weather]);
  const fog = useMemo(() => new FogExp2('#d5c7b4', 0.0008), []);
  useEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);
  const sky = useMemo(() => {
    const dome = new Sky();
    dome.scale.setScalar(3900);
    dome.material.fragmentShader = dome.material.fragmentShader.replace(
      'gl_FragColor = vec4( texColor, 1.0 );',
      'gl_FragColor = vec4( texColor * 0.25, 1.0 );',
    );
    dome.renderOrder = -10;
    dome.material.uniforms.rayleigh.value = 2.4;
    dome.material.uniforms.mieCoefficient.value = 0.004;
    dome.material.uniforms.cloudScale.value = 0.00012;
    dome.material.uniforms.cloudSpeed.value = 0.000008;
    dome.material.uniforms.cloudCoverage.value = 0.36;
    dome.material.uniforms.cloudDensity.value = 0.32;
    return dome;
  }, []);
  const environment = useMemo(() => {
    const generator = new PMREMGenerator(gl),
      source = new Scene(),
      dome = new Sky();
    dome.scale.setScalar(100);
    dome.material.fragmentShader = dome.material.fragmentShader.replace(
      'gl_FragColor = vec4( texColor, 1.0 );',
      'gl_FragColor = vec4( texColor * 0.25, 1.0 );',
    );
    dome.material.uniforms.showSunDisc.value = 0;
    source.add(dome);
    return {
      generator,
      source,
      dome,
      target: null as WebGLRenderTarget | null,
      elapsed: 10,
      weather: '',
    };
  }, [gl]);
  useEffect(
    () => () => {
      scene.environment = null;
      environment.target?.dispose();
      environment.generator.dispose();
      environment.dome.material.dispose();
      environment.dome.geometry.dispose();
      sky.material.dispose();
      sky.geometry.dispose();
    },
    [scene, environment, sky],
  );
  useFrame((_, delta) => {
    const w = runtime.weather,
      alpha = 1 - Math.exp(-Math.min(delta, 1) * 2.0);
    w.sky.lerp(target.sky, alpha);
    w.haze.lerp(target.haze, alpha);
    w.water.lerp(target.water, alpha);
    w.sun.lerp(target.sun, alpha);
    w.sunPosition.x += (target.sunPosition[0] - w.sunPosition.x) * alpha;
    w.sunPosition.y += (target.sunPosition[1] - w.sunPosition.y) * alpha;
    w.sunPosition.z += (target.sunPosition[2] - w.sunPosition.z) * alpha;
    for (const key of ['intensity', 'ambient', 'exposure', 'fog', 'lowFog'] as const)
      w[key] += (target[key] - w[key]) * alpha;
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
    environment.elapsed += delta;
    const settling = Math.abs(w.sunPosition.y - target.sunPosition[1]) < 2;
    if (
      !environment.target ||
      (environment.weather !== settings.weather && settling && environment.elapsed > 1.5)
    ) {
      for (const name of [
        'sunPosition',
        'turbidity',
        'rayleigh',
        'mieCoefficient',
        'cloudCoverage',
        'cloudScale',
        'cloudDensity',
      ]) {
        const value = u[name].value;
        if (environment.dome.material.uniforms[name].value?.copy)
          environment.dome.material.uniforms[name].value.copy(value);
        else environment.dome.material.uniforms[name].value = value;
      }
      const next = environment.generator.fromScene(environment.source, 0.04, 0.1, 220, {
        size: 128,
      });
      scene.environment = next.texture;
      environment.target?.dispose();
      environment.target = next;
      environment.elapsed = 0;
      environment.weather = settings.weather;
    }
  }, -90);
  return (
    <>
      <hemisphereLight ref={ambient} args={['#b7c7ca', '#565947', 1.4]} />
      <directionalLight
        ref={light}
        castShadow
        shadow-mapSize={[
          settings.quality === 'high' ? 2048 : 1024,
          settings.quality === 'high' ? 2048 : 1024,
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
function CoastalFog() {
  const { runtime, settings } = useObservatory(),
    group = useRef<Group>(null);
  const patches = useMemo(() => {
    const r = seeded(43);
    const banks = Array.from({ length: 28 }, (_, i) => ({
      x: (i % 7) * 72 - 260,
      z: Math.floor(i / 7) * 63 - 125,
      y: 3.0 + r() * 4.4,
      scale: [110 + r() * 70, 5 + r() * 4] as const,
    }));
    // Higher channel banks reach the low midpoint cables while tower crowns stay above them.
    banks.push(
      { x: 0, z: -25, y: 7.6, scale: [160, 9] },
      { x: -8, z: 20, y: 7.1, scale: [190, 9] },
      { x: 8, z: 65, y: 6.8, scale: [150, 8] },
    );
    return banks;
  }, []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uDensity: { value: 0.1 },
          uColor: { value: new Color('#bdced0') },
        },
        vertexShader:
          'varying vec2 vUv;varying vec3 vWorld;void main(){vUv=uv;vWorld=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: `uniform float uTime,uDensity;uniform vec3 uColor;varying vec2 vUv;varying vec3 vWorld;void main(){vec2 p=(vUv-0.5)*2.0;float mask=exp(-dot(p*vec2(1.7,1.8),p*vec2(1.7,1.8)))*(1.0-smoothstep(0.6,1.0,abs(p.x)))*(1.0-smoothstep(0.6,1.0,abs(p.y)));float noise=0.62+0.18*sin(vWorld.x*0.07+vWorld.z*0.08+uTime*0.05)+0.12*sin(vWorld.x*0.15-vWorld.z*0.035-uTime*0.09);float height=1.0-smoothstep(8.0,15.0,vWorld.y);gl_FragColor=vec4(uColor,mask*noise*height*uDensity*0.7);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`,
      }),
    [],
  );
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
