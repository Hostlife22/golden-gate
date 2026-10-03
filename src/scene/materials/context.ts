import { createContext, useContext, useEffect, useMemo } from 'react';
import type { MeshStandardMaterial } from 'three';
export type Surface = 'terrain' | 'rock' | 'asphalt' | 'concrete' | 'paint' | 'facade' | 'foliage';
export type Library = Record<Surface, MeshStandardMaterial>;
export const MaterialContext = createContext<Library | null>(null);
export function useMaterials() {
  const value = useContext(MaterialContext);
  if (!value) throw new Error('MaterialLibrary is missing');
  return value;
}
export function useSurfaceTint(source: MeshStandardMaterial, color: string) {
  const material = useMemo(() => {
    const copy = source.clone();
    copy.color.set(color);
    copy.onBeforeCompile = source.onBeforeCompile;
    copy.customProgramCacheKey = source.customProgramCacheKey;
    return copy;
  }, [source, color]);
  useEffect(() => () => material.dispose(), [material]);
  return material;
}
