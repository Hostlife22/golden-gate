export interface Snapshot {
  time: number;
  activityTime: number;
  paused: boolean;
  hidden: boolean;
  camera: number[];
  cameraFlying: boolean;
  weather: { fog: number; lowFog: number; sun: number[] };
  metrics: {
    frames: number;
    totalMs: number;
    maxMs: number;
    samples: number[];
    drawCalls: number;
    triangles: number;
  };
}
declare global {
  interface Window {
    __observatory?: () => Snapshot;
  }
}
