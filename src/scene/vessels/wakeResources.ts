import { BufferGeometry, DoubleSide, Float32BufferAttribute, ShaderMaterial } from 'three';

export const WAKE_SEGMENTS = 30;

export const WAKE_MAX_AGE = 17;

export function createWakeResources() {
  const count = WAKE_SEGMENTS,
    positions = new Float32Array(count * 4 * 3),
    uv = new Float32Array(count * 4 * 2),
    indices: number[] = [];
  for (let i = 0; i < count; i++)
    for (let arm = 0; arm < 2; arm++)
      for (let edge = 0; edge < 2; edge++) {
        const n = i * 4 + arm * 2 + edge;
        uv[n * 2] = edge;
        uv[n * 2 + 1] = i / (count - 1);
        if (i < count - 1 && edge === 0) {
          indices.push(n, n + 1, n + 4, n + 1, n + 5, n + 4);
        }
      }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: { uTime: { value: 0 }, uStrength: { value: 1 } },
    vertexShader:
      'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:
      'uniform float uTime,uStrength; varying vec2 vUv; void main(){float a=sin(vUv.x*3.14159)*pow(1.0-vUv.y,1.7)*(0.7+0.3*sin(vUv.y*95.0-uTime*2.0));gl_FragColor=vec4(0.78,0.86,0.83,a*0.22*uStrength);}',
  });
  return { geometry, material, positions };
}
