import { NoColorSpace, RepeatWrapping, SRGBColorSpace } from 'three';
import type { MeshStandardMaterial, Texture } from 'three';
import { MATERIAL_MAP_URLS } from './assets';
import { createSurfaceMaterial } from './surfaceMaterial';
import type { Library } from './context';

/** Loader textures belong to the cache; only our configured clones are disposed. */
export function createMaterialResources(originals: Texture[], maxAnisotropy: number) {
  if (originals.length !== MATERIAL_MAP_URLS.length) {
    throw new Error(
      `Expected ${MATERIAL_MAP_URLS.length} material maps, received ${originals.length}`,
    );
  }
  const textures = originals.map((original, index) => {
    const texture = original.clone();
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.anisotropy = Math.min(8, maxAnisotropy);
    texture.colorSpace = index % 3 === 0 ? SRGBColorSpace : NoColorSpace;
    texture.needsUpdate = true;
    return texture;
  });
  const quality = { value: 0 };
  const create = (kind: keyof Library) => createSurfaceMaterial(kind, textures, quality);
  const materials: Library = {
    terrain: create('terrain'),
    rock: create('rock'),
    asphalt: create('asphalt'),
    concrete: create('concrete'),
    paint: create('paint'),
    facade: create('facade'),
    foliage: create('foliage'),
  };
  return {
    textures,
    materials,
    quality,
    dispose() {
      textures.forEach((texture) => texture.dispose());
      Object.values(materials).forEach((material) => material.dispose());
    },
  };
}

export function createTintedMaterial(source: MeshStandardMaterial, color: string) {
  const material = source.clone();
  material.color.set(color);
  // Three.js clone() does not preserve shader customization callbacks.
  material.onBeforeCompile = source.onBeforeCompile;
  material.customProgramCacheKey = source.customProgramCacheKey;
  return material;
}
