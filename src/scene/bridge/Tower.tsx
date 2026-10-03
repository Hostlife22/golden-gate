import { useMemo } from 'react';
import { PALETTE } from '../../data/bridge';
import { Instances } from '../Instances';
import { createTowerLayout } from './towerLayout';
import { DistanceDetail } from '../DistanceDetail';
import { useMaterials } from '../materials/context';

interface TowerProps {
  z: number;
}

export function Tower({ z }: TowerProps) {
  const materials = useMaterials();
  const { steel, accents, concrete, rivets } = useMemo(() => createTowerLayout(z), [z]);
  return (
    <group>
      <Instances
        items={concrete}
        color="#ddd6c1"
        material={materials.concrete}
        shape="beveled"
        castShadow
      />
      <Instances
        items={steel}
        color={PALETTE.orange}
        material={materials.paint}
        shape="beveled"
        castShadow
      />
      <DistanceDetail distance={380}>
        <Instances items={accents} color={PALETTE.orangeLight} material={materials.paint} />
      </DistanceDetail>
      <DistanceDetail distance={130}>
        <Instances
          items={rivets}
          color={PALETTE.orangeLight}
          shape="sphere"
          material={materials.paint}
        />
      </DistanceDetail>
    </group>
  );
}
