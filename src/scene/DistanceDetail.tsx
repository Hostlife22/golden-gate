import { FRAME_PRIORITY } from './framePriorities';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface DistanceDetailProps {
  distance: number;
  children: ReactNode;
}

/** Distance LOD for fine repeating parts, without React updates in the frame loop. */
export function DistanceDetail({ distance, children }: DistanceDetailProps) {
  const ref = useRef<Group>(null);
  useFrame(({ camera }) => {
    if (ref.current) ref.current.visible = camera.position.lengthSq() < distance * distance;
  }, FRAME_PRIORITY.detail);
  return <group ref={ref}>{children}</group>;
}
