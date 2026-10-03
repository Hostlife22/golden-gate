import { useMemo } from 'react';
import { CatmullRomCurve3, TubeGeometry } from 'three';
import { BRIDGE, ANCHOR, BRIDGE_ANGLE, HALF_SPAN, PALETTE } from '../../data/bridge';
import { deckHeight, roadCenter } from '../../simulation/math';
import { Instances } from '../Instances';
import type { Instance } from '../Instances';
import { beam, cablePoints, suspenderData } from './geometry';
import { DistanceDetail } from '../DistanceDetail';
function Tower({ z }: { z: number }) {
  const { steel, accents, concrete } = useMemo(() => {
    const steel: Instance[] = [],
      accents: Instance[] = [];
    const levels = [1.1, 7.4, 11.2, 14.9, 18.3, 21.6, 22.7].map(
      (y) => (y * BRIDGE.towerHeight) / 22.7,
    );
    for (const side of [-1, 1]) {
      for (let i = 0; i < levels.length - 1; i++) {
        const bottom = levels[i],
          top = levels[i + 1],
          width = 1.0 - i * 0.07;
        const x = side * (1.66 - i * 0.04);
        const depth = 1.6 - i * 0.13;
        steel.push({
          position: [x, (bottom + top) / 2, z],
          scale: [width, top - bottom, 1.6 - i * 0.13],
        });
        // Fluted plates on both faces of the Art Deco tower shafts.
        for (const face of [-1, 1])
          for (const rib of [-0.34, -0.11, 0.11, 0.34]) {
            accents.push({
              position: [x + width * rib, (bottom + top) / 2, z + face * (depth / 2 + 0.025)],
              scale: [0.052, top - bottom - 0.12, 0.065],
              color: PALETTE.orangeLight,
            });
          }
        for (const offset of [-1, 1])
          accents.push({
            position: [x + offset * width * 0.41, (bottom + top) / 2, z + 0.76 - i * 0.064],
            scale: [0.055, top - bottom, 0.05],
            color: PALETTE.orangeLight,
          });
        accents.push({
          position: [x, top - 0.06, z],
          scale: [width + 0.055, 0.11, 1.64 - i * 0.13],
          color: PALETTE.orangeDark,
        });
      }
    }
    for (const y of [7.15, 10.8, 14.55, 18.05, 21.1].map((y) => (y * BRIDGE.towerHeight) / 22.7)) {
      steel.push({ position: [0, y, z], scale: [3.1, y === 7.15 ? 0.95 : 0.57, 1.02] });
      accents.push({
        position: [0, y - 0.28, z],
        scale: [3.0, 0.08, 1.1],
        color: PALETTE.orangeDark,
      });
      // Small stepped corbels soften the portal corners.
      for (const side of [-1, 1])
        steel.push({ position: [side * 1.1, y - 0.36, z], scale: [0.35, 0.26, 1.0] });
      for (const side of [-1, 1])
        for (const face of [-1, 1])
          accents.push({
            position: [side * 1.13, y, z + face * 0.55],
            scale: [0.27, 0.66, 0.055],
            color: PALETTE.orangeDark,
          });
    }
    return {
      steel,
      accents,
      concrete: [{ position: [0, 0.35, z] as const, scale: [5.3, 1.5, 3.1] as const }],
    };
  }, [z]);
  return (
    <group>
      <Instances items={concrete} color={PALETTE.concrete} castShadow />
      <Instances items={steel} color={PALETTE.orange} castShadow />
      <DistanceDetail distance={380}>
        <Instances items={accents} color={PALETTE.orangeLight} />
      </DistanceDetail>
    </group>
  );
}
function Cables() {
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
  return (
    <group>
      {cables.map((geometry, i) => (
        <mesh key={i} geometry={geometry} castShadow>
          <meshStandardMaterial color={PALETTE.orangeLight} roughness={0.72} />
        </mesh>
      ))}
      <DistanceDetail distance={480}>
        <Instances
          items={useMemo(suspenderData, [])}
          color={PALETTE.orangeLight}
          shape="cylinder"
        />
      </DistanceDetail>
    </group>
  );
}
export function Bridge() {
  const parts = useMemo(() => {
    const road: Instance[] = [],
      truss: Instance[] = [],
      walk: Instance[] = [],
      rails: Instance[] = [],
      markings: Instance[] = [],
      lamps: Instance[] = [],
      supports: Instance[] = [];
    for (let z = -136; z < 137; z += 1.524) {
      const x = roadCenter(z),
        y = deckHeight(z);
      road.push({ position: [x, y - 0.1, z], scale: [BRIDGE.roadWidth, 0.2, 1.53] });
      truss.push({ position: [x, y - 0.51, z], scale: [BRIDGE.width, 0.09, 0.11] });
      for (const side of [-1, 1]) {
        const sx = x + side * (BRIDGE.width / 2);
        walk.push({ position: [x + side * 1.16, y - 0.07, z], scale: [0.3, 0.16, 1.53] });
        rails.push({ position: [sx, y + 0.16, z], scale: [0.037, 0.035, 1.54] });
        rails.push({ position: [sx, y + 0.08, z], scale: [0.024, 0.025, 1.54] });
        rails.push({ position: [sx, y + 0.11, z], scale: [0.024, 0.3, 0.024] });
        for (const h of [-0.2, -0.78])
          truss.push({ position: [sx, y + h, z], scale: [0.08, 0.08, 1.55] });
        truss.push(beam([sx, y - 0.75, z - 0.75], [sx, y - 0.24, z + 0.75], 0.044));
        truss.push(beam([sx, y - 0.24, z - 0.75], [sx, y - 0.75, z + 0.75], 0.035));
      }
      for (const laneX of [-0.62, -0.31, 0, 0.31, 0.62])
        markings.push({
          position: [x + laneX, y + 0.006, z],
          scale: [0.012, 0.005, laneX === 0 ? 1.53 : 0.65],
          color: laneX === 0 ? '#d5b86c' : '#d2d3c8',
        });
    }
    for (let z = -130; z < 132; z += 13)
      for (const side of [-1, 1]) {
        const x = roadCenter(z) + side * 1.0,
          y = deckHeight(z);
        lamps.push({ position: [x, y + 0.37, z], scale: [0.025, 0.75, 0.025] });
        lamps.push({ position: [x - side * 0.12, y + 0.74, z], scale: [0.26, 0.025, 0.035] });
      }
    for (const z of [-128, -115, -102, 102, 113, 125, 135])
      for (const x of [-1, 1])
        supports.push({ position: [roadCenter(z) + x, 3.6, z], scale: [0.28, 6.7, 0.4] });
    return { road, truss, walk, rails, markings, lamps, supports };
  }, []);
  return (
    <group rotation={[0, -BRIDGE_ANGLE, 0]}>
      <Tower z={-HALF_SPAN} />
      <Tower z={HALF_SPAN} />
      <Cables />
      <Instances items={parts.road} color={PALETTE.road} />
      <Instances items={parts.truss} color={PALETTE.orange} castShadow />
      <Instances items={parts.walk} color={PALETTE.sidewalk} />
      <Instances items={parts.rails} color={PALETTE.rail} />
      <Instances items={parts.markings} color="#e5e1c8" />
      <Instances items={parts.lamps} color={PALETTE.orangeDark} />
      <Instances items={parts.supports} color={PALETTE.orange} />
      <Instances
        items={[-ANCHOR, ANCHOR].flatMap((z): Instance[] => [
          { position: [0, 0.8, z], scale: [5.6, 2.4, 4.2] },
          ...[-1, 1].map((side): Instance => ({
            position: [side * 2.1, 3.8, z],
            scale: [1.5, 9, 4],
          })),
        ])}
        color={PALETTE.concrete}
        castShadow
      />
    </group>
  );
}
