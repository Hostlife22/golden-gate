import { Color, PlaneGeometry, ShaderMaterial, UniformsLib, UniformsUtils, Vector3 } from 'three';
import { BRIDGE_ANGLE, HALF_SPAN } from '../../data/bridge';
import { PlanarReflection } from './PlanarReflection';
import { waterVertex, waterFragment } from './shaders';
import type { coastalField } from './coastalField';

export function createWaterResources(
  coast: ReturnType<typeof coastalField>,
  reflectionSize: number,
) {
  const reflection = new PlanarReflection(reflectionSize);
  const uniforms = UniformsUtils.merge([
    UniformsLib.fog,
    {
      uTime: { value: 0 },
      uWater: { value: new Color() },
      uSky: { value: new Color() },
      uSun: { value: new Color() },
      uSunDirection: { value: new Vector3() },
      uReflection: { value: null },
      uEnvironment: { value: null },
      uCoast: { value: null },
      uCoastBounds: { value: coast.bounds },
      uReflectionMatrix: { value: reflection.matrix },
      uBridgeAngle: { value: BRIDGE_ANGLE },
      uHalfSpan: { value: HALF_SPAN },
    },
  ]);
  uniforms.uCoast.value = coast.texture;
  uniforms.uReflection.value = reflection.target.texture;
  uniforms.uReflectionMatrix.value = reflection.matrix;
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: waterVertex,
    fragmentShader: waterFragment,
    fog: true,
  });
  const geometry = new PlaneGeometry(8000, 8000, 112, 112);

  return {
    material,
    geometry,
    reflection,
    dispose() {
      reflection.dispose();
      material.dispose();
      geometry.dispose();
    },
  };
}
