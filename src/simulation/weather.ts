import { Color, Vector3 } from 'three';
import { WEATHER } from '../data/presets';
import type { WeatherId } from '../data/presets';

export type WeatherState = ReturnType<typeof createWeatherState>;

const COLOR_FIELDS = ['sky', 'haze', 'water', 'sun'] as const;

const NUMBER_FIELDS = ['intensity', 'ambient', 'exposure', 'fog', 'lowFog'] as const;

export function createWeatherState(id: WeatherId) {
  const preset = WEATHER[id];
  return {
    sky: new Color(preset.sky),
    haze: new Color(preset.haze),
    water: new Color(preset.water),
    sun: new Color(preset.sun),
    sunPosition: new Vector3(...preset.sunPosition),
    intensity: preset.intensity,
    ambient: preset.ambient,
    exposure: preset.exposure,
    fog: preset.fog,
    lowFog: preset.lowFog,
  };
}

/** Weather follows wall-clock delta so a paused scene remains adjustable. */
export function blendWeather(current: WeatherState, target: WeatherState, delta: number) {
  const alpha = 1 - Math.exp(-Math.min(delta, 1) * 2);
  for (const key of COLOR_FIELDS) current[key].lerp(target[key], alpha);
  current.sunPosition.lerp(target.sunPosition, alpha);
  for (const key of NUMBER_FIELDS) current[key] += (target[key] - current[key]) * alpha;
}
