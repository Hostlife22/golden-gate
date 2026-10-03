import { RENDER_QUALITY } from '../../config/rendering';
import { createTerrainGeometry } from './geometry';
import { createVegetation } from './vegetation';
import { useEffect, useMemo } from 'react';
import { LANDMARKS } from '../../data/geography';
import { Instances } from '../Instances';
import { useObservatory } from '../../app/context';
import { useMaterials } from '../materials/context';

export function Terrain() {
  const { settings } = useObservatory(),
    materials = useMaterials();
  const quality = RENDER_QUALITY[settings.quality];
  const geometry = useMemo(() => createTerrainGeometry(quality.terrainSpacing), [quality]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const { trees, trunks, rocks, shrubs } = useMemo(createVegetation, []);
  const fort = LANDMARKS.fortPoint,
    alcatraz = LANDMARKS.alcatraz;
  return (
    <group>
      <mesh geometry={geometry} material={materials.terrain} receiveShadow />
      <Instances items={trunks} color="#76624b" shape="cylinder" />
      <Instances
        items={trees}
        color="#4b583b"
        shape="foliage"
        material={materials.foliage}
        castShadow
      />
      <Instances items={shrubs} color="#69704b" shape="foliage" material={materials.foliage} />
      <Instances items={rocks} color="#d2c8b6" shape="rock" material={materials.rock} castShadow />
      <Instances
        items={[
          { position: [fort[0], 1.1, fort[1]], scale: [6.0, 2.1, 4.5] },
          { position: [alcatraz[0], 4.4, alcatraz[1]], scale: [10.5, 2, 4.5] },
          { position: [alcatraz[0] - 9, 4.8, alcatraz[1] + 2], scale: [0.9, 3.5, 0.9] },
        ]}
        color="#b8b09c"
        material={materials.concrete}
      />
    </group>
  );
}
