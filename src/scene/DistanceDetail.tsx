import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

/** Distance LOD for fine repeating parts, without React updates in the frame loop. */
export function DistanceDetail({ distance, children }: { distance: number; children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame(({ camera }) => {
    if (ref.current) ref.current.visible = camera.position.lengthSq() < distance * distance;
  }, -5);
  return <group ref={ref}>{children}</group>;
}
