import type { CameraId, WeatherId } from '../data/presets';
import type { RenderQuality } from '../config/rendering';

export interface Settings {
  weather: WeatherId;
  camera: CameraId;
  paused: boolean;
  fog: number;
  intensity: number;
  hidden: boolean;
  reset: number;
  quality: RenderQuality;
}

export function createInitialSettings(reducedMotion: boolean): Settings {
  return {
    weather: 'golden',
    camera: 'hero',
    paused: reducedMotion,
    fog: 1,
    intensity: 1,
    hidden: false,
    reset: 0,
    quality: 'balanced',
  };
}
