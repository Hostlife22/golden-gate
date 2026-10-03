import { DataTexture, LinearFilter, RedFormat, UnsignedByteType, Vector4 } from 'three';
import { isLand, shoreDistance } from '../terrain/height';

/** A shoreline proximity field; this is not measured bathymetry. */
export function coastalField() {
  const size = 256,
    bytes = new Uint8Array(size * size),
    bounds = new Vector4(-600, -620, 1700, 2020);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const wx = bounds.x + (x / (size - 1)) * bounds.z,
        wz = bounds.y + (y / (size - 1)) * bounds.w;
      bytes[y * size + x] = isLand(wx, wz)
        ? 0
        : Math.min(255, Math.round((shoreDistance(wx, wz) / 20) * 255));
    }
  const texture = new DataTexture(bytes, size, size, RedFormat, UnsignedByteType);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return { texture, bounds };
}
