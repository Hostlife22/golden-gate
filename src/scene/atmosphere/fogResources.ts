import { Color, DoubleSide, ShaderMaterial } from 'three';
import { seeded } from '../../simulation/math';

export function createFogBanks() {
  const r = seeded(43);
  const banks = Array.from({ length: 28 }, (_, i) => ({
    x: (i % 7) * 72 - 260,
    z: Math.floor(i / 7) * 63 - 125,
    y: 3.0 + r() * 4.4,
    scale: [110 + r() * 70, 5 + r() * 4] as const,
  }));
  // Higher channel banks reach the low midpoint cables while tower crowns stay above them.
  banks.push(
    { x: 0, z: -25, y: 7.6, scale: [160, 9] },
    { x: -8, z: 20, y: 7.1, scale: [190, 9] },
    { x: 8, z: 65, y: 6.8, scale: [150, 8] },
  );
  return banks;
}

export function createFogMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uDensity: { value: 0.1 },
      uColor: { value: new Color('#bdced0') },
    },
    vertexShader:
      'varying vec2 vUv;varying vec3 vWorld;void main(){vUv=uv;vWorld=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader: `uniform float uTime,uDensity;uniform vec3 uColor;varying vec2 vUv;varying vec3 vWorld;void main(){vec2 p=(vUv-0.5)*2.0;float mask=exp(-dot(p*vec2(1.7,1.8),p*vec2(1.7,1.8)))*(1.0-smoothstep(0.6,1.0,abs(p.x)))*(1.0-smoothstep(0.6,1.0,abs(p.y)));float noise=0.62+0.18*sin(vWorld.x*0.07+vWorld.z*0.08+uTime*0.05)+0.12*sin(vWorld.x*0.15-vWorld.z*0.035-uTime*0.09);float height=1.0-smoothstep(8.0,15.0,vWorld.y);gl_FragColor=vec4(uColor,mask*noise*height*uDensity*0.7);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`,
  });
}
