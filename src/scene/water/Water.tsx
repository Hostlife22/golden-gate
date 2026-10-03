import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Color,
  HalfFloatType,
  Matrix4,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector3,
  Vector4,
  WebGLRenderTarget,
} from 'three';
import { useObservatory } from '../../app/state';
import { BRIDGE_ANGLE, HALF_SPAN } from '../../data/bridge';
import { reflectionScene } from './reflection';
import { waterFragment, waterVertex } from './shaders';
import { coastalField } from './coastalField';
export function Water() {
  const { runtime, settings } = useObservatory(),
    { gl, camera } = useThree();
  const coast = useMemo(coastalField, []);
  useEffect(() => () => coast.texture.dispose(), [coast]);
  const resources = useMemo(() => {
    const size = settings.quality === 'high' ? 768 : 384;
    const target = new WebGLRenderTarget(size, size, { type: HalfFloatType }),
      reflection = reflectionScene(),
      mirror = new PerspectiveCamera();
    const matrix = new Matrix4(),
      plane = new Plane(new Vector3(0, 1, 0), 0),
      clip = new Vector4(),
      q = new Vector4(),
      look = new Vector3(),
      direction = new Vector3();
    const uniforms = UniformsUtils.merge([
      UniformsLib.fog,
      {
        uTime: { value: 0 },
        uWater: { value: new Color() },
        uSky: { value: new Color() },
        uSun: { value: new Color() },
        uSunDirection: { value: new Vector3() },
        uReflection: { value: null },
        uCoast: { value: null },
        uCoastBounds: { value: coast.bounds },
        uReflectionMatrix: { value: matrix },
        uBridgeAngle: { value: BRIDGE_ANGLE },
        uHalfSpan: { value: HALF_SPAN },
      },
    ]);
    uniforms.uCoast.value = coast.texture;
    uniforms.uReflection.value = target.texture;
    uniforms.uReflectionMatrix.value = matrix;
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: waterVertex,
      fragmentShader: waterFragment,
      fog: true,
    });
    const geometry = new PlaneGeometry(8000, 8000, 112, 112);
    return {
      target,
      reflection,
      mirror,
      matrix,
      plane,
      clip,
      q,
      look,
      direction,
      material,
      geometry,
    };
  }, [settings.quality, coast]);
  useEffect(
    () => () => {
      resources.target.dispose();
      resources.reflection.dispose();
      resources.material.dispose();
      resources.geometry.dispose();
    },
    [resources],
  );
  useFrame(() => {
    const r = resources,
      w = runtime.weather,
      u = r.material.uniforms;
    u.uTime.value = runtime.clock.time;
    u.uWater.value.copy(w.water);
    u.uSky.value.copy(w.sky);
    u.uSun.value.copy(w.sun);
    u.uSunDirection.value.copy(w.sunPosition).normalize();
    if (!(camera instanceof PerspectiveCamera)) return;
    const mirror = r.mirror;
    mirror.position.copy(camera.position);
    mirror.position.y *= -1;
    camera.getWorldDirection(r.direction);
    r.look.copy(camera.position).add(r.direction);
    r.look.y *= -1;
    mirror.up.set(0, -1, 0);
    mirror.lookAt(r.look);
    mirror.near = camera.near;
    mirror.far = camera.far;
    mirror.projectionMatrix.copy(camera.projectionMatrix);
    mirror.updateMatrixWorld();
    r.matrix
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(mirror.projectionMatrix)
      .multiply(mirror.matrixWorldInverse);
    r.plane.normal.set(0, 1, 0);
    r.plane.constant = 0;
    r.plane.applyMatrix4(mirror.matrixWorldInverse);
    r.clip.set(r.plane.normal.x, r.plane.normal.y, r.plane.normal.z, r.plane.constant);
    const p = mirror.projectionMatrix.elements;
    r.q.set(
      (Math.sign(r.clip.x) + p[8]) / p[0],
      (Math.sign(r.clip.y) + p[9]) / p[5],
      -1,
      (1 + p[10]) / p[14],
    );
    r.clip.multiplyScalar(2 / r.clip.dot(r.q));
    p[2] = r.clip.x;
    p[6] = r.clip.y;
    p[10] = r.clip.z + 1;
    p[14] = r.clip.w;
    (r.reflection.scene.background as Color).copy(w.sky);
    const previous = gl.getRenderTarget();
    gl.setRenderTarget(r.target);
    gl.render(r.reflection.scene, mirror);
    gl.setRenderTarget(previous);
  }, -2);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      geometry={resources.geometry}
      material={resources.material}
    />
  );
}
