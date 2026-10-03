import { createContext, useContext } from 'react';
import { Color, Vector3 } from 'three';
import type { CameraId, WeatherId } from '../data/presets';
import { WEATHER } from '../data/presets';
import { SimulationClock } from '../simulation/clock';
export interface Settings {
  weather: WeatherId;
  camera: CameraId;
  paused: boolean;
  fog: number;
  intensity: number;
  hidden: boolean;
  reset: number;
  quality: 'balanced' | 'high';
}
export function createRuntime() {
  const p = WEATHER.golden;
  return {
    clock: new SimulationClock(),
    weather: {
      sky: new Color(p.sky),
      haze: new Color(p.haze),
      water: new Color(p.water),
      sun: new Color(p.sun),
      sunPosition: new Vector3(...p.sunPosition),
      intensity: p.intensity,
      ambient: p.ambient,
      exposure: p.exposure,
      fog: p.fog,
      lowFog: p.lowFog,
    },
    metrics: {
      frames: 0,
      totalMs: 0,
      maxMs: 0,
      samples: [] as number[],
      drawCalls: 0,
      triangles: 0,
    },
    cameraFlying: false,
  };
}
export type Runtime = ReturnType<typeof createRuntime>;
export interface AppState {
  settings: Settings;
  runtime: Runtime;
  update: (patch: Partial<Settings>) => void;
  ready: () => void;
}
export const AppContext = createContext<AppState | null>(null);
export function useObservatory() {
  const value = useContext(AppContext);
  if (!value) throw new Error('Observatory provider missing');
  return value;
}
