export type Point2 = readonly [number, number];

export type Point3 = readonly [number, number, number];

export const ORIGIN = { lat: 37.8199, lon: -122.4785 };

export const METRES_PER_UNIT = 10;

export function project(lon: number, lat: number): Point2 {
  return [
    ((lon - ORIGIN.lon) * 111320 * Math.cos((ORIGIN.lat * Math.PI) / 180)) / 10,
    (-(lat - ORIGIN.lat) * 111320) / 10,
  ];
}

export const LANDMARKS = {
  alcatraz: project(-122.423, 37.8267),
  salesforce: project(-122.3965, 37.7898),
  transamerica: project(-122.403, 37.7952),
  fortPoint: project(-122.477, 37.8106),
  angelIsland: project(-122.4326, 37.8615),
};
