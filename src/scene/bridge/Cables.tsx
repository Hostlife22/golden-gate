import { useEffect, useMemo } from 'react';
import { CatmullRomCurve3, TubeGeometry } from 'three';
import { BRIDGE, ANCHOR, HALF_SPAN, PALETTE } from '../../data/bridge';
import { Instances } from '../Instances';
import { DistanceDetail } from '../DistanceDetail';
import { cablePoints, suspenderData } from './geometry';

export function Cables() {
  const cables = useMemo(
    () =>
      [-1, 1].flatMap((side) =>
        [
          [-ANCHOR, -HALF_SPAN],
          [-HALF_SPAN, HALF_SPAN],
          [HALF_SPAN, ANCHOR],
        ].map(
          ([a, b]) =>
            new TubeGeometry(
              new CatmullRomCurve3(cablePoints((side * BRIDGE.width) / 2, a, b, 96)),
              128,
              BRIDGE.cableRadius,
              8,
              false,
            ),
        ),
      ),
    [],
  );
  useEffect(() => () => cables.forEach((geometry) => geometry.dispose()), [cables]);
  const suspenders = useMemo(suspenderData, []);
  return (
    <group>
      {cables.map((geometry, i) => (
        <mesh key={i} geometry={geometry} castShadow>
          <meshStandardMaterial color={PALETTE.orangeLight} roughness={0.72} />
        </mesh>
      ))}
      <DistanceDetail distance={480}>
        <Instances items={suspenders} color={PALETTE.orangeLight} shape="cylinder" />
      </DistanceDetail>
    </group>
  );
}
