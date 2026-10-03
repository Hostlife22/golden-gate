const assets = ['aerial_grass_rock', 'rocky_terrain', 'asphalt_02', 'concrete_layers_02'];

export const MATERIAL_MAP_URLS = assets.flatMap((asset) =>
  ['diff', 'nor_gl', 'rough'].map(
    (kind) => `${import.meta.env.BASE_URL}assets/materials/${asset}_${kind}.webp`,
  ),
);
