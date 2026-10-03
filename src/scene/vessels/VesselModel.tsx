import { useEffect, useMemo } from 'react';
import { DoubleSide } from 'three';
import type { VesselRoute } from '../../simulation/routes';
import { Instances } from '../Instances';
import { useMaterials } from '../materials/context';
import { createHullGeometry, createSailGeometry } from './geometry';

type VesselModelProps = Pick<VesselRoute, 'type' | 'length'>;

export function VesselModel({ type, length }: VesselModelProps) {
  const materials = useMaterials();
  const cargo = type === 'cargo',
    sail = type === 'sail',
    width = length * (cargo ? 0.18 : 0.27);
  const hull = useMemo(() => createHullGeometry(length, width, cargo), [length, width, cargo]);
  const sailGeometry = useMemo(createSailGeometry, []);
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
  return (
    <>
      <mesh geometry={hull} rotation={[-Math.PI / 2, 0, 0]} position={[0, cargo ? -0.4 : -0.12, 0]}>
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
    </>
  );
}
