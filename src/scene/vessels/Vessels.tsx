import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  ExtrudeGeometry,
  Group,
  ShaderMaterial,
  Shape,
} from 'three';
import { useObservatory } from '../../app/state';
import { VESSELS, vesselAt } from '../../simulation/routes';
import type { VesselRoute } from '../../simulation/routes';
import { Instances } from '../Instances';
import { useMaterials } from '../materials/context';
function Wake({ route }: { route: VesselRoute }) {
  const { runtime, settings } = useObservatory();
  const point = useMemo(() => ({ x: 0, z: 0, heading: 0 }), []);
  const { geometry, material } = useMemo(() => {
    const count = 30,
      positions = new Float32Array(count * 4 * 3),
      uv = new Float32Array(count * 4 * 2),
      indices: number[] = [];
    for (let i = 0; i < count; i++)
      for (let arm = 0; arm < 2; arm++)
        for (let edge = 0; edge < 2; edge++) {
          const n = i * 4 + arm * 2 + edge;
          uv[n * 2] = edge;
          uv[n * 2 + 1] = i / (count - 1);
          if (i < count - 1 && edge === 0) {
            indices.push(n, n + 1, n + 4, n + 1, n + 5, n + 4);
          }
        }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      uniforms: { uTime: { value: 0 }, uStrength: { value: 1 } },
      vertexShader:
        'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:
        'uniform float uTime,uStrength; varying vec2 vUv; void main(){float a=sin(vUv.x*3.14159)*pow(1.0-vUv.y,1.7)*(0.7+0.3*sin(vUv.y*95.0-uTime*2.0));gl_FragColor=vec4(0.78,0.86,0.83,a*0.22*uStrength);}',
    });
    return { geometry, material, positions };
  }, []);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  useFrame(() => {
    const attr = geometry.attributes.position;
    for (let i = 0; i < 30; i++) {
      const age = (i / 29) * 17,
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
function Vessel({ route }: { route: VesselRoute }) {
  const materials = useMaterials();
  const point = useMemo(() => ({ x: 0, z: 0, heading: 0 }), []);
  const ref = useRef<Group>(null),
    { runtime } = useObservatory();
  const cargo = route.type === 'cargo',
    sail = route.type === 'sail',
    length = route.length,
    width = length * (cargo ? 0.18 : 0.27);
  const hull = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-length / 2, -width * 0.42);
    shape.quadraticCurveTo(-length * 0.45, -width / 2, -length * 0.32, -width / 2);
    shape.lineTo(length * 0.22, -width / 2);
    shape.quadraticCurveTo(length * 0.44, -width * 0.45, length / 2, 0);
    shape.quadraticCurveTo(length * 0.44, width * 0.45, length * 0.22, width / 2);
    shape.lineTo(-length * 0.32, width / 2);
    shape.quadraticCurveTo(-length * 0.45, width / 2, -length / 2, width * 0.42);
    shape.closePath();
    return new ExtrudeGeometry(shape, {
      depth: cargo ? 0.65 : 0.26,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.045,
      bevelSegments: 2,
      curveSegments: 12,
    });
  }, [length, width, cargo]);
  const sailGeometry = useMemo(() => {
    const positions: number[] = [],
      indices: number[] = [],
      rows = 12,
      cols = 6;
    for (let j = 0; j <= rows; j++)
      for (let i = 0; i <= cols; i++) {
        const u = i / cols,
          v = j / rows;
        positions.push(
          0.72 * u * (1 - v),
          0.34 + 1.6 * v,
          0.12 * Math.sin(u * Math.PI) * Math.sin(v * Math.PI),
        );
      }
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const a = j * (cols + 1) + i,
          b = a + 1,
          c = a + cols + 1;
        indices.push(a, c, b, b, c, c + 1);
      }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(
    () => () => {
      hull.dispose();
      sailGeometry.dispose();
    },
    [hull, sailGeometry],
  );
  const boxes = useMemo(
    () =>
      cargo
        ? Array.from({ length: 20 }, (_, i) => ({
            position: [
              ((i % 5) - 1.5) * 1.5,
              0.65,
              Math.floor(i / 5) * 0.4 - width * 0.36,
            ] as const,
            scale: [1.35, 0.6, 0.37] as const,
            color: ['#904d38', '#bdab7c', '#65787b', '#536f62'][i % 4],
          }))
        : [],
    [cargo, width],
  );
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
        <mesh
          geometry={hull}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, cargo ? -0.4 : -0.12, 0]}
        >
          <meshStandardMaterial
            color={cargo ? '#33454a' : '#e0ddd1'}
            roughness={0.64}
            side={DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[length * 0.77, 0.23, width * 0.8]} />
          <meshStandardMaterial color={cargo ? '#4c5551' : '#e5e2d9'} />
        </mesh>
        {cargo ? (
          <>
            <Instances items={boxes} color="#886753" material={materials.paint} shape="beveled" />
            <mesh position={[-length * 0.36, 0.85, 0]}>
              <boxGeometry args={[1.4, 1.6, width * 0.8]} />
              <meshStandardMaterial color="#e1d8bc" />
            </mesh>
            <Instances
              items={[-1, 1].flatMap((side) =>
                Array.from({ length: 6 }, (_, i) => ({
                  position: [-length * 0.36 + 0.5 - i * 0.2, 1.42, side * width * 0.405] as const,
                  scale: [0.14, 0.16, 0.015] as const,
                })),
              )}
              color="#344d58"
              roughness={0.22}
            />
            <mesh position={[-length * 0.4, 1.87, 0]}>
              <boxGeometry args={[0.35, 0.7, 0.3]} />
              <meshStandardMaterial color="#6e7770" />
            </mesh>
          </>
        ) : sail ? (
          <>
            <mesh position={[0, 1.15, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 2.1, 6]} />
              <meshStandardMaterial color="#a6aaa0" />
            </mesh>
            <mesh geometry={sailGeometry}>
              <meshStandardMaterial color="#f2ead9" roughness={0.98} side={DoubleSide} />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[-0.1, 0.36, 0]}>
              <boxGeometry args={[length * 0.6, 0.5, width * 0.73]} />
              <meshStandardMaterial color="#e4e0d0" />
            </mesh>
            <mesh position={[0.1, 0.54, 0]}>
              <boxGeometry args={[length * 0.55, 0.16, width * 0.77]} />
              <meshStandardMaterial color="#344d56" />
            </mesh>
            <Instances
              items={[-1, 1].flatMap((side) =>
                Array.from({ length: 10 }, (_, i) => ({
                  position: [
                    -length * 0.29 + i * length * 0.057,
                    0.42,
                    side * width * 0.375,
                  ] as const,
                  scale: [length * 0.042, 0.16, 0.012] as const,
                })),
              )}
              color="#203b49"
              roughness={0.18}
            />
          </>
        )}
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
