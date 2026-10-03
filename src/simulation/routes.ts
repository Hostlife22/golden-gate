import { roadCenter, deckHeight } from './math';
import { BRIDGE } from '../data/bridge';
export const VEHICLE_COUNT = 90;
export const TRAFFIC_LENGTH = BRIDGE.totalLength - 2;
export function vehicleAt(
  index: number,
  time: number,
  out = { x: 0, y: 0, z: 0, direction: 0, heading: 0 },
) {
  const lane = index % 6,
    slot = Math.floor(index / 6),
    direction = lane < 3 ? 1 : -1;
  const z =
    ((((slot * 18.2 + time * 1.55 * direction + TRAFFIC_LENGTH / 2) % TRAFFIC_LENGTH) +
      TRAFFIC_LENGTH) %
      TRAFFIC_LENGTH) -
    TRAFFIC_LENGTH / 2;
  out.x = roadCenter(z) + (lane - 2.5) * 0.307;
  out.y = deckHeight(z) + 0.055;
  out.z = z;
  out.direction = direction;
  out.heading = Math.atan2(roadCenter(z + 0.1) - roadCenter(z - 0.1), 0.2);
  return out;
}
export interface VesselRoute {
  id: string;
  type: 'cargo' | 'ferry' | 'sail';
  speed: number;
  offset: number;
  phase: number;
  length: number;
}
export const VESSELS: VesselRoute[] = [
  { id: 'pacific-trader', type: 'cargo', speed: 0.75, offset: 23, phase: 0.7, length: 10.8 },
  { id: 'bay-ferry', type: 'ferry', speed: 1.1, offset: -12, phase: 0.55, length: 3.5 },
  { id: 'coastal-sail', type: 'sail', speed: 0.25, offset: 42, phase: 0.43, length: 1.45 },
];
export function vesselAt(route: VesselRoute, time: number, out = { x: 0, z: 0, heading: 0 }) {
  const x = ((((time * route.speed + route.phase * 640) % 640) + 640) % 640) - 320;
  const z = -0.15 * x + route.offset + Math.sin(x / 160) * 4;
  const dz = -0.15 + Math.cos(x / 160) * 0.025;
  out.x = x;
  out.z = z;
  out.heading = -Math.atan2(dz, 1);
  return out;
}
