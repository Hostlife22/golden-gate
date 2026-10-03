export type RenderQuality = 'balanced' | 'high';

interface QualityProfile {
  maxDpr: number;
  terrainSpacing: number;
  shadowMapSize: number;
  reflectionSize: number;
  materialProjection: number;
}

export const RENDER_QUALITY: Record<RenderQuality, Readonly<QualityProfile>> = {
  balanced: {
    maxDpr: 1.25,
    terrainSpacing: 2.6,
    shadowMapSize: 1024,
    reflectionSize: 384,
    materialProjection: 0,
  },
  high: {
    maxDpr: 1.75,
    terrainSpacing: 1.7,
    shadowMapSize: 2048,
    reflectionSize: 768,
    materialProjection: 1,
  },
};
