import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three';
import type { Texture } from 'three';
import { MaterialContext } from './context';
import type { Library, Surface } from './context';
import { useObservatory } from '../../app/state';

const assets = ['aerial_grass_rock', 'rocky_terrain', 'asphalt_02', 'concrete_layers_02'];
const maps = assets.flatMap((asset) =>
  ['diff', 'nor_gl', 'rough'].map(
    (kind) => `${import.meta.env.BASE_URL}assets/materials/${asset}_${kind}.webp`,
  ),
);
const declarations = /* glsl */ `
  varying vec3 vSurfacePosition;
  uniform sampler2D uAlbedo, uSurfaceNormal, uSurfaceRough;
  uniform sampler2D uRockAlbedo, uRockNormal, uRockRough;
  uniform float uSurfaceScale, uTriplanarQuality;
  float surfaceHash(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
  float surfaceNoise(vec3 p) {
    vec3 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(surfaceHash(i),surfaceHash(i+vec3(1,0,0)),f.x),mix(surfaceHash(i+vec3(0,1,0)),surfaceHash(i+vec3(1,1,0)),f.x),f.y),mix(mix(surfaceHash(i+vec3(0,0,1)),surfaceHash(i+vec3(1,0,1)),f.x),mix(surfaceHash(i+vec3(0,1,1)),surfaceHash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  vec3 projectionWeights(vec3 n) { vec3 w=pow(abs(n),vec3(4.0));return w/max(dot(w,vec3(1.0)),0.001); }
  vec3 surfaceSample(sampler2D tex,vec3 p,vec3 w) {
    if(uTriplanarQuality<0.5) return texture2D(tex,w.y>=max(w.x,w.z)?p.xz:w.x>w.z?p.zy:p.xy).rgb;
    return texture2D(tex,p.zy).rgb*w.x+texture2D(tex,p.xz).rgb*w.y+texture2D(tex,p.xy).rgb*w.z;
  }
  vec3 surfaceNormal(sampler2D tex,vec3 p,vec3 n,vec3 w) {
    if(uTriplanarQuality<0.5) {
      if(w.y>=max(w.x,w.z)){vec3 t=texture2D(tex,p.xz).xyz*2.0-1.0;return normalize(vec3(t.x,t.z*sign(n.y),t.y));}
      if(w.x>w.z){vec3 t=texture2D(tex,p.zy).xyz*2.0-1.0;return normalize(vec3(t.z*sign(n.x),t.y,t.x));}
      vec3 t=texture2D(tex,p.xy).xyz*2.0-1.0;return normalize(vec3(t.x,t.y,t.z*sign(n.z)));
    }
    vec3 x=texture2D(tex,p.zy).xyz*2.0-1.0;
    vec3 y=texture2D(tex,p.xz).xyz*2.0-1.0;
    vec3 z=texture2D(tex,p.xy).xyz*2.0-1.0;
    return normalize(vec3(x.z*sign(n.x),x.y,x.x)*w.x+vec3(y.x,y.z*sign(n.y),y.y)*w.y+vec3(z.x,z.y,z.z*sign(n.z))*w.z);
  }
`;
function surfaceMaterial(kind: Surface, textures: Texture[], quality: { value: number }) {
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
    shader.fragmentShader = declarations + shader.fragmentShader;
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
export function MaterialLibrary({ children }: { children: ReactNode }) {
  const { settings } = useObservatory();
  const originals = useLoader(TextureLoader, maps),
    { gl } = useThree();
  const resources = useMemo(() => {
    const textures = originals.map((original, i) => {
      const texture = original.clone();
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      if (i % 3 === 0) texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    });
    const quality = { value: 0 };
    const materials = Object.fromEntries(
      (['terrain', 'rock', 'asphalt', 'concrete', 'paint', 'facade', 'foliage'] as const).map(
        (kind) => [kind, surfaceMaterial(kind, textures, quality)],
      ),
    ) as Library;
    return { textures, materials, quality };
  }, [originals, gl]);
  useEffect(() => {
    resources.quality.value = settings.quality === 'high' ? 1 : 0;
  }, [resources, settings.quality]);
  useEffect(
    () => () => {
      resources.textures.forEach((texture) => texture.dispose());
      Object.values(resources.materials).forEach((material) => material.dispose());
    },
    [resources],
  );
  return (
    <MaterialContext.Provider value={resources.materials}>{children}</MaterialContext.Provider>
  );
}
