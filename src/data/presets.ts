import type { Point3 } from './geography';
export type WeatherId = 'clear' | 'golden' | 'fog';
export type CameraId = 'hero' | 'panorama' | 'north' | 'south' | 'water' | 'tower' | 'free';
export interface WeatherPreset {
  name: string;
  caption: string;
  sky: string;
  haze: string;
  water: string;
  sun: string;
  sunPosition: Point3;
  intensity: number;
  ambient: number;
  exposure: number;
  fog: number;
  lowFog: number;
}
export const WEATHER: Record<WeatherId, WeatherPreset> = {
  clear: {
    name: 'Clear Day',
    caption: 'A little Pacific blue.',
    sky: '#a6c6d3',
    haze: '#c4d5d5',
    water: '#265861',
    sun: '#fff0d6',
    sunPosition: [-300, 460, 160],
    intensity: 3.2,
    ambient: 1.4,
    exposure: 1.12,
    fog: 0.00065,
    lowFog: 0.08,
  },
  golden: {
    name: 'Golden Hour',
    caption: 'The coast, in a warmer light.',
    sky: '#b7c7ca',
    haze: '#d5c7b4',
    water: '#355b62',
    sun: '#ffd09b',
    sunPosition: [-400, 110, 150],
    intensity: 3.5,
    ambient: 1.3,
    exposure: 1.05,
    fog: 0.0008,
    lowFog: 0.12,
  },
  fog: {
    name: 'Coastal Fog',
    caption: 'Where the ocean meets the air.',
    sky: '#b3c6cb',
    haze: '#bfced0',
    water: '#3b626b',
    sun: '#e9e7da',
    sunPosition: [-280, 330, 100],
    intensity: 1.55,
    ambient: 1.6,
    exposure: 1.05,
    fog: 0.002,
    lowFog: 0.9,
  },
};
export interface CameraPreset {
  id: CameraId;
  name: string;
  description: string;
  position: Point3;
  target: Point3;
  fov: number;
}
export const CAMERAS: CameraPreset[] = [
  {
    id: 'hero',
    name: 'Hero',
    description: 'The gateway to the Pacific',
    position: [-145, 53, 148],
    target: [0, 9, -6],
    fov: 43,
  },
  {
    id: 'panorama',
    name: 'Bay Panorama',
    description: 'One bridge. An entire bay.',
    position: [-410, 295, -325],
    target: [185, 0, 125],
    fov: 47,
  },
  {
    id: 'north',
    name: 'North Overlook',
    description: 'Above the Marin Headlands',
    position: [-62, 41, -115],
    target: [8, 9, 30],
    fov: 49,
  },
  {
    id: 'south',
    name: 'South Shore',
    description: 'From the edge of the Presidio',
    position: [46, 10, 110],
    target: [0, 12, -13],
    fov: 52,
  },
  {
    id: 'water',
    name: 'Waterline',
    description: 'A passage beneath the span',
    position: [-110, 2.3, -18],
    target: [0, 11, 0],
    fov: 56,
  },
  {
    id: 'tower',
    name: 'Tower Detail',
    description: 'An exercise in steel and scale',
    position: [-0.5, 18.8, 83],
    target: [9.5, 16, 62],
    fov: 48,
  },
  {
    id: 'free',
    name: 'Free Orbit',
    description: 'Find your own perspective',
    position: [-145, 53, 148],
    target: [0, 9, -6],
    fov: 43,
  },
];
