import { MeshStandardMaterial } from 'three';
import type { Texture } from 'three';
import type { Surface } from './context';
import { surfaceDeclarations } from './shaders';

export function createSurfaceMaterial(
  kind: Surface,
  textures: Texture[],
  quality: { value: number },
) {
  const material = new MeshStandardMaterial({
    color: '#ffffff',
    roughness: kind === 'paint' ? 0.58 : 0.9,
    metalness: kind === 'paint' ? 0.08 : 0,
    vertexColors: kind === 'terrain',
  });
  const textured = ['terrain', 'rock', 'asphalt', 'concrete'].includes(kind);
  const offset = kind === 'terrain' ? 0 : kind === 'rock' ? 3 : kind === 'asphalt' ? 6 : 9;
  const scale =
    kind === 'terrain' ? 1 / 6.0 : kind === 'rock' ? 1 / 9 : kind === 'asphalt' ? 1 / 0.3 : 1 / 0.4;
  material.customProgramCacheKey = () => `observatory-surface-v1-${kind}`;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSurfaceScale = { value: scale };
    shader.uniforms.uTriplanarQuality = quality;
    for (const [key, texture] of Object.entries({
      uAlbedo: textures[offset],
      uSurfaceNormal: textures[offset + 1],
      uSurfaceRough: textures[offset + 2],
      uRockAlbedo: textures[3],
      uRockNormal: textures[4],
      uRockRough: textures[5],
    }))
      shader.uniforms[key] = { value: texture };
    shader.vertexShader = `varying vec3 vSurfacePosition;\n${shader.vertexShader}`.replace(
      '#include <project_vertex>',
      `#include <project_vertex>
       vec4 surfacePosition=vec4(transformed,1.0);
       #ifdef USE_INSTANCING
         surfacePosition=instanceMatrix*surfacePosition;
       #endif
       vSurfacePosition=(modelMatrix*surfacePosition).xyz;`,
    );
    shader.fragmentShader = surfaceDeclarations + shader.fragmentShader;
    const setup = `vec3 surfaceN=inverseTransformDirection(normal,viewMatrix);
      vec3 surfaceW=projectionWeights(surfaceN);
      vec3 surfaceP=vSurfacePosition*uSurfaceScale;
      float rockMix=${kind === 'terrain' ? 'smoothstep(0.15,0.55,1.0-abs(surfaceN.y))' : '0.0'};
      float windowMask=0.0;`;
    const albedo = textured
      ? `vec3 texel=surfaceSample(uAlbedo,surfaceP,surfaceW);
      ${kind === 'terrain' ? 'texel=mix(texel,surfaceSample(uRockAlbedo,vSurfacePosition/9.0,surfaceW),rockMix);' : ''}
      ${kind === 'terrain' ? 'texel=mix(texel,surfaceSample(uAlbedo,surfaceP*0.731+vec3(2.34,0.0,7.13),surfaceW),0.42);' : ''}
      ${kind === 'terrain' ? 'texel=mix(texel,vec3(0.13,0.145,0.073),smoothstep(220.0,650.0,length(cameraPosition-vSurfacePosition))*0.65);' : ''}
      diffuseColor.rgb*=texel;
      diffuseColor.rgb*=mix(0.85,1.16,surfaceNoise(vSurfacePosition*0.13));
      ${kind === 'concrete' ? 'diffuseColor.rgb*=mix(0.55,1.0,smoothstep(0.0,1.5,vSurfacePosition.y));' : ''}`
      : kind === 'facade'
        ? `
      float horizontal=abs(surfaceN.x)>abs(surfaceN.z)?vSurfacePosition.z:vSurfacePosition.x;
      vec2 cell=fract(vec2(horizontal/0.24,vSurfacePosition.y/0.32));
      windowMask=(1.0-step(0.3,abs(surfaceN.y)))*smoothstep(0.18,0.23,cell.x)*(1.0-smoothstep(0.67,0.72,cell.x))*smoothstep(0.23,0.28,cell.y)*(1.0-smoothstep(0.72,0.77,cell.y));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.09,0.15,0.17),windowMask*0.85);
      diffuseColor.rgb*=mix(0.78,1.0,smoothstep(0.0,0.2,cell.y));
      diffuseColor.rgb*=mix(1.0,0.38,smoothstep(0.5,0.8,abs(surfaceN.y)));`
        : kind === 'foliage'
          ? `diffuseColor.rgb*=mix(0.65,1.3,surfaceNoise(vSurfacePosition*14.0));`
          : `diffuseColor.rgb*=mix(0.94,1.06,surfaceNoise(vSurfacePosition*39.0));`;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_maps>',
      `#include <normal_fragment_maps>\n${setup}\n${
        textured
          ? `
      vec3 textureN=surfaceNormal(uSurfaceNormal,surfaceP,surfaceN,surfaceW);
      ${kind === 'terrain' ? 'textureN=normalize(mix(textureN,surfaceNormal(uRockNormal,vSurfacePosition/9.0,surfaceN,surfaceW),rockMix));' : ''}
      normal=normalize(mat3(viewMatrix)*normalize(mix(surfaceN,textureN,${kind === 'terrain' ? '0.20 * (1.0-smoothstep(30.0,180.0,length(cameraPosition-vSurfacePosition)))' : kind === 'rock' ? '0.4' : '0.20'})));`
          : ''
      }`,
    );
    // Surface normals are available after the standard map/roughness chunks.
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <lights_physical_fragment>',
      `${albedo}
      ${textured ? `roughnessFactor=clamp(surfaceSample(uSurfaceRough,surfaceP,surfaceW).r,0.48,1.0);` : kind === 'facade' ? 'roughnessFactor=mix(0.88,0.32,windowMask);' : ''}
      #include <lights_physical_fragment>`,
    );
  };
  return material;
}
