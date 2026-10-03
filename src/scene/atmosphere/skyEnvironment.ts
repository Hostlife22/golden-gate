import { PMREMGenerator, Scene } from 'three';
import type { WebGLRenderer, WebGLRenderTarget } from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import type { WeatherId } from '../../data/presets';

function createSkyDome(scale: number) {
  const dome = new Sky();
  dome.scale.setScalar(scale);
  dome.material.fragmentShader = dome.material.fragmentShader.replace(
    'gl_FragColor = vec4( texColor, 1.0 );',
    'gl_FragColor = vec4( texColor * 0.25, 1.0 );',
  );
  return dome;
}

export function createDaylightSky() {
  const dome = createSkyDome(3900);
  dome.renderOrder = -10;
  dome.material.uniforms.rayleigh.value = 2.4;
  dome.material.uniforms.mieCoefficient.value = 0.004;
  dome.material.uniforms.cloudScale.value = 0.00012;
  dome.material.uniforms.cloudSpeed.value = 0.000008;
  dome.material.uniforms.cloudCoverage.value = 0.36;
  dome.material.uniforms.cloudDensity.value = 0.32;
  return dome;
}

/** Owns the PMREM capture and refreshes only after a weather transition settles. */
export class SkyEnvironment {
  private readonly generator: PMREMGenerator;
  private readonly source = new Scene();
  private readonly dome = createSkyDome(100);
  private target: WebGLRenderTarget | null = null;
  private elapsed = 10;
  private weather: WeatherId | null = null;

  constructor(renderer: WebGLRenderer) {
    this.generator = new PMREMGenerator(renderer);
    this.dome.material.uniforms.showSunDisc.value = 0;
    this.source.add(this.dome);
  }

  update(sky: Sky, weather: WeatherId, delta: number, settled: boolean) {
    this.elapsed += delta;
    if (!this.target || (this.weather !== weather && settled && this.elapsed > 1.5)) {
      for (const name of [
        'sunPosition',
        'turbidity',
        'rayleigh',
        'mieCoefficient',
        'cloudCoverage',
        'cloudScale',
        'cloudDensity',
      ]) {
        const value = sky.material.uniforms[name].value;
        const uniform = this.dome.material.uniforms[name];
        if (uniform.value?.copy) uniform.value.copy(value);
        else uniform.value = value;
      }
      const next = this.generator.fromScene(this.source, 0.04, 0.1, 220, { size: 128 });
      this.target?.dispose();
      this.target = next;
      this.elapsed = 0;
      this.weather = weather;
    }
    return this.target.texture;
  }

  dispose() {
    this.target?.dispose();
    this.generator.dispose();
    this.dome.material.dispose();
    this.dome.geometry.dispose();
  }
}
