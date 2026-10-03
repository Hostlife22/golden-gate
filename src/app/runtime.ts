import { createWeatherState } from '../simulation/weather';
import { SimulationClock } from '../simulation/clock';

export type Runtime = ReturnType<typeof createRuntime>;

export function createRuntime() {
  return {
    clock: new SimulationClock(),
    weather: createWeatherState('golden'),
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
