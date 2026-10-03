import { describe, expect, it } from 'vitest';
import { ANCHOR, BRIDGE, HALF_SPAN } from '../data/bridge';
import { LANDMARKS, project } from '../data/geography';
import { beam, suspenderData } from '../scene/bridge/geometry';
import { isLand } from '../scene/terrain/height';
import { SimulationClock } from '../simulation/clock';
import {
  bridgeToWorld,
  cableHeight,
  deckHeight,
  seeded,
  smoothstep,
  worldToBridge,
} from '../simulation/math';
import { VEHICLE_COUNT, TRAFFIC_LENGTH, VESSELS, vehicleAt, vesselAt } from '../simulation/routes';
describe('verified bridge and attached cables', () => {
  it('preserves metric dimensions and cable end constraints', () => {
    expect(BRIDGE.mainSpan * 10).toBe(1280);
    expect(BRIDGE.towerHeight * 10).toBe(227);
    expect(cableHeight(0)).toBe(BRIDGE.cableLow);
    for (const z of [-HALF_SPAN, HALF_SPAN]) expect(cableHeight(z)).toBe(BRIDGE.cableTop);
    for (const z of [-ANCHOR, ANCHOR]) expect(cableHeight(z)).toBeCloseTo(BRIDGE.anchorY);
    for (let z = -ANCHOR; z < ANCHOR; z += 0.1) {
      expect(cableHeight(z)).toBeGreaterThan(deckHeight(z));
      expect(Math.abs(cableHeight(z + 0.1) - cableHeight(z))).toBeLessThan(0.09);
    }
  });
  it('puts the lower suspender ends on the deck and upper ends on the same cable', () => {
    for (const s of suspenderData()) {
      const z = s.position[2],
        centerZ =
          Math.round((z + ANCHOR) / BRIDGE.suspenderSpacing) * BRIDGE.suspenderSpacing - ANCHOR;
      expect(s.position[1] - s.scale[1] / 2).toBeCloseTo(deckHeight(centerZ) - 0.2, 3);
      expect(s.position[1] + s.scale[1] / 2).toBeCloseTo(cableHeight(centerZ), 3);
      expect(s.position[1] - s.scale[1] / 2).toBeLessThan(deckHeight(centerZ));
      expect(s.position[1] - s.scale[1] / 2).toBeGreaterThan(BRIDGE.undersideY);
      expect(s.scale[1]).toBeGreaterThan(0);
      expect(s.position.every(Number.isFinite)).toBe(true);
    }
  });
  it('has finite diagonal transforms and inverse coordinates', () => {
    for (const end of [
      [1, 2, 3],
      [-7, 0, 8],
      [0, 0, 0],
    ] as const) {
      expect(beam([0, 0, 0], end, 0.1).rotation?.every(Number.isFinite)).toBe(true);
      const w = bridgeToWorld(end[0], end[1], end[2]);
      const local = worldToBridge(w[0], w[2]);
      expect(local[0]).toBeCloseTo(end[0]);
      expect(local[1]).toBeCloseTo(end[2]);
    }
    expect(project(-122.4785, 37.8199)).toEqual([0, -0]);
    expect(LANDMARKS.alcatraz[0]).toBeGreaterThan(450);
    expect(LANDMARKS.salesforce[1]).toBeGreaterThan(300);
  });
});
describe('one deterministic simulation', () => {
  it('freezes all times on pause and hidden tabs, clamps resume delta', () => {
    const c = new SimulationClock();
    c.advance(0.02, 2);
    expect(c.time).toBe(0.02);
    expect(c.activityTime).toBe(0.04);
    c.paused = true;
    c.advance(30, 1);
    expect(c.time).toBe(0.02);
    c.paused = false;
    c.hidden = true;
    c.advance(300, 1);
    expect(c.activityTime).toBe(0.04);
    c.hidden = false;
    c.advance(60, 1);
    expect(c.time).toBeCloseTo(0.07);
    c.advance(-1, 1);
    expect(c.time).toBeCloseTo(0.07);
  });
  it('keeps stable lanes and vehicle spacing over wraps', () => {
    for (const time of [0, 5, 92, 181, 500, 1e6]) {
      const vehicles = Array.from({ length: VEHICLE_COUNT }, (_, i) => vehicleAt(i, time));
      for (let lane = 0; lane < 6; lane++) {
        const zs = vehicles
          .filter((_, i) => i % 6 === lane)
          .map((p) => p.z)
          .sort((a, b) => a - b);
        for (let i = 0; i < zs.length; i++)
          expect(
            (zs[(i + 1) % zs.length] - zs[i] + TRAFFIC_LENGTH) % TRAFFIC_LENGTH,
          ).toBeGreaterThan(1.2);
      }
      expect(vehicles.every((p) => Object.values(p).every(Number.isFinite))).toBe(true);
    }
  });
  it('keeps complete vessel footprints in open water, clear of both piers and other routes', () => {
    for (let t = 0; t < 1000; t += 2) {
      const positions = VESSELS.map((r) => vesselAt(r, t));
      VESSELS.forEach((r, i) => {
        const p = positions[i];
        for (const xoff of [-r.length / 2, 0, r.length / 2])
          for (const zoff of [-r.length * 0.14, r.length * 0.14])
            expect(isLand(p.x + xoff, p.z + zoff), `${r.id}: ${p.x}, ${p.z}`).toBe(false);
        const local = worldToBridge(p.x, p.z);
        for (const z of [-64, 64])
          expect(Math.hypot(local[0], local[1] - z)).toBeGreaterThan(r.length / 2 + 3);
        for (let j = i + 1; j < positions.length; j++)
          expect(Math.hypot(p.x - positions[j].x, p.z - positions[j].z)).toBeGreaterThan(
            (r.length + VESSELS[j].length) / 2 + 2,
          );
      });
    }
  });
  it('generates reproducible geometry and bounded continuous interpolation', () => {
    const a = seeded(1937),
      b = seeded(1937);
    for (let i = 0; i < 500; i++) expect(a()).toBe(b());
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
    for (let t = 0; t < 1; t += 0.01)
      expect(smoothstep(t + 0.01) - smoothstep(t)).toBeLessThan(0.016);
  });
});
