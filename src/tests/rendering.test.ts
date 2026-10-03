import { describe, expect, it, vi } from 'vitest';
import {
  Color,
  MeshStandardMaterial,
  NoColorSpace,
  PerspectiveCamera,
  RepeatWrapping,
  SRGBColorSpace,
  Texture,
  WebGLRenderTarget,
} from 'three';
import { createMaterialResources, createTintedMaterial } from '../scene/materials/resources';
import { PlanarReflection } from '../scene/water/PlanarReflection';
import type { ReflectionRenderer } from '../scene/water/PlanarReflection';
import { blendWeather, createWeatherState } from '../simulation/weather';

describe('material resource ownership', () => {
  it('configures and disposes owned clones without changing cached loader textures', () => {
    const originals = Array.from({ length: 12 }, () => new Texture());
    const originalDisposals = originals.map((texture) => vi.spyOn(texture, 'dispose'));
    const resources = createMaterialResources(originals, 4);
    const cloneDisposals = resources.textures.map((texture) => vi.spyOn(texture, 'dispose'));
    const materialDisposals = Object.values(resources.materials).map((material) =>
      vi.spyOn(material, 'dispose'),
    );

    resources.textures.forEach((texture, index) => {
      expect(texture).not.toBe(originals[index]);
      expect(texture.colorSpace).toBe(index % 3 === 0 ? SRGBColorSpace : NoColorSpace);
      expect(texture.wrapS).toBe(RepeatWrapping);
      expect(texture.wrapT).toBe(RepeatWrapping);
      expect(texture.anisotropy).toBe(4);
      expect(originals[index].colorSpace).toBe(NoColorSpace);
      expect(originals[index].anisotropy).toBe(1);
    });
    resources.dispose();
    cloneDisposals.forEach((dispose) => expect(dispose).toHaveBeenCalledOnce());
    materialDisposals.forEach((dispose) => expect(dispose).toHaveBeenCalledOnce());
    originalDisposals.forEach((dispose) => expect(dispose).not.toHaveBeenCalled());
    originals.forEach((texture) => texture.dispose());
  });

  it('keeps shader customization on tint clones and leaves the shared material intact', () => {
    const source = new MeshStandardMaterial({ color: '#ffffff' });
    source.customProgramCacheKey = () => 'custom-surface';
    source.onBeforeCompile = vi.fn();
    const tint = createTintedMaterial(source, '#334455');
    const sourceDisposal = vi.spyOn(source, 'dispose');

    expect(tint.color.getHexString()).toBe('334455');
    expect(source.color.getHexString()).toBe('ffffff');
    expect(tint.onBeforeCompile).toBe(source.onBeforeCompile);
    expect(tint.customProgramCacheKey).toBe(source.customProgramCacheKey);
    tint.dispose();
    expect(sourceDisposal).not.toHaveBeenCalled();
    source.dispose();
  });
});

describe('offscreen render isolation', () => {
  it('restores the renderer target, color and alpha if the reflection pass throws', () => {
    const previousTarget = new WebGLRenderTarget(16, 16);
    let target: Parameters<ReflectionRenderer['setRenderTarget']>[0] = previousTarget;
    const color = new Color('#123456');
    const initialColor = color.clone();
    let alpha = 0.7;
    const renderer: ReflectionRenderer = {
      getRenderTarget: () => previousTarget,
      getClearAlpha: () => alpha,
      getClearColor: (output) => output.copy(color),
      setRenderTarget: (next) => {
        target = next;
      },
      setClearColor: (next, nextAlpha = 1) => {
        color.set(next);
        alpha = nextAlpha;
      },
      render: () => {
        throw new Error('Simulated render failure');
      },
    };
    const reflection = new PlanarReflection(384);
    const camera = new PerspectiveCamera(43, 1.44, 0.08, 4500);
    camera.position.set(-145, 53, 148);
    camera.lookAt(0, 9, -6);
    camera.updateMatrixWorld();
    const originalPosition = camera.position.clone();

    try {
      expect(() => reflection.render(renderer, camera)).toThrow('Simulated render failure');
      expect(target).toBe(previousTarget);
      expect(color.equals(initialColor)).toBe(true);
      expect(alpha).toBe(0.7);
      expect(camera.position.equals(originalPosition)).toBe(true);
      expect(reflection.matrix.elements.every(Number.isFinite)).toBe(true);
    } finally {
      reflection.dispose();
      previousTarget.dispose();
    }
  });
});

describe('weather transitions', () => {
  it('continues from the current interpolated state when a transition is interrupted', () => {
    const current = createWeatherState('golden');
    const clear = createWeatherState('clear');
    const fog = createWeatherState('fog');
    blendWeather(current, clear, 0.25);
    const expectedSun = current.sunPosition.clone().lerp(fog.sunPosition, 1 - Math.exp(-0.5));
    const fogSun = fog.sunPosition.clone();

    blendWeather(current, fog, 0.25);
    expect(current.sunPosition.equals(expectedSun)).toBe(true);
    expect(fog.sunPosition.equals(fogSun)).toBe(true);
    expect(current.lowFog).toBeGreaterThan(clear.lowFog);
    expect(current.lowFog).toBeLessThan(fog.lowFog);
  });

  it('bounds a stalled frame and mutates the existing buffers instead of replacing them', () => {
    const stalled = createWeatherState('golden');
    const bounded = createWeatherState('golden');
    const target = createWeatherState('fog');
    const sun = stalled.sunPosition;
    const water = stalled.water;

    blendWeather(stalled, target, 300);
    blendWeather(bounded, target, 1);
    expect(stalled.sunPosition.equals(bounded.sunPosition)).toBe(true);
    expect(stalled.water.equals(bounded.water)).toBe(true);
    expect(stalled.sunPosition).toBe(sun);
    expect(stalled.water).toBe(water);
    expect(stalled.sunPosition.toArray().every(Number.isFinite)).toBe(true);
  });
});
