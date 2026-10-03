import { useEffect, useMemo } from 'react';
import { LatheGeometry, Vector2 } from 'three';
import { LANDMARKS } from '../../data/geography';
import { Instances } from '../Instances';
import { terrainHeight } from '../terrain/height';
import { createCityLayout } from './layout';
import { useMaterials, useSurfaceTint } from '../materials/context';

export function City() {
  const materials = useMaterials();
  const glass = useSurfaceTint(materials.facade, '#a5b7b9');
  const limestone = useSurfaceTint(materials.facade, '#ded9c7');
  const { buildings, roads, roof, equipment } = useMemo(createCityLayout, []);
  const sf = LANDMARKS.salesforce,
    ta = LANDMARKS.transamerica;
  const crown = useMemo(
    () =>
      new LatheGeometry(
        [
          [0, 0],
          [2.65, 0],
          [2.8, 8],
          [2.72, 23],
          [2.5, 28],
          [2.15, 30],
          [1.5, 31.8],
          [0.7, 32.6],
          [0, 32.6],
        ].map(([r, y]) => new Vector2(r, y)),
        48,
      ),
    [],
  );
  useEffect(() => () => crown.dispose(), [crown]);
  return (
    <group>
      <Instances items={roads} color="#b3b6b1" material={materials.asphalt} />
      <Instances items={buildings} color="#dad5c4" material={materials.facade} />
      <Instances items={roof} color="#91928a" />
      <Instances items={equipment} color="#b7b7ac" />
      <mesh position={[sf[0], terrainHeight(...sf), sf[1]]} geometry={crown} material={glass} />
      <mesh position={[ta[0], terrainHeight(...ta) + 13, ta[1]]} material={limestone}>
        <coneGeometry args={[3.4, 26, 4, 10]} />
      </mesh>
    </group>
  );
}
