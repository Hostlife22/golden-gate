import { useMemo } from 'react';
import { ANCHOR, BRIDGE_ANGLE, HALF_SPAN, PALETTE } from '../../data/bridge';
import { Instances } from '../Instances';
import type { Instance } from '../Instances';
import { createDeckLayout } from './deckLayout';
import { Tower } from './Tower';
import { Cables } from './Cables';
import { useMaterials } from '../materials/context';

export function Bridge() {
  const materials = useMaterials();
  const parts = useMemo(createDeckLayout, []);
  return (
    <group rotation={[0, -BRIDGE_ANGLE, 0]}>
      <Tower z={-HALF_SPAN} />
      <Tower z={HALF_SPAN} />
      <Cables />
      <Instances items={parts.road} color="#c4c7c3" material={materials.asphalt} />
      <Instances items={parts.truss} color={PALETTE.orange} material={materials.paint} castShadow />
      <Instances items={parts.walk} color="#d0cbbd" material={materials.concrete} />
      <Instances items={parts.rails} color={PALETTE.rail} material={materials.paint} />
      <Instances items={parts.markings} color="#e5e1c8" />
      <Instances items={parts.lamps} color={PALETTE.orangeDark} material={materials.paint} />
      <Instances items={parts.supports} color={PALETTE.orange} material={materials.paint} />
      <Instances
        items={[-ANCHOR, ANCHOR].flatMap((z): Instance[] => [
          { position: [0, 0.8, z], scale: [5.6, 2.4, 4.2] },
          ...[-1, 1].map((side): Instance => ({
            position: [side * 2.1, 3.8, z],
            scale: [1.5, 9, 4],
          })),
        ])}
        color="#d9d2be"
        material={materials.concrete}
        shape="beveled"
        castShadow
      />
    </group>
  );
}
