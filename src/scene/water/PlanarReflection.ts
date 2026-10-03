import {
  Color,
  HalfFloatType,
  Matrix4,
  PerspectiveCamera,
  Plane,
  Vector3,
  Vector4,
  WebGLRenderTarget,
} from 'three';
import type { WebGLRenderer } from 'three';
import { reflectionScene } from './reflection';

export type ReflectionRenderer = Pick<
  WebGLRenderer,
  | 'getRenderTarget'
  | 'getClearAlpha'
  | 'getClearColor'
  | 'setRenderTarget'
  | 'setClearColor'
  | 'render'
>;

/** Owns the proxy target, projection and allocation-free mirrored camera scratch space. */
export class PlanarReflection {
  readonly target: WebGLRenderTarget;
  readonly matrix = new Matrix4();
  private readonly proxy = reflectionScene();
  private readonly mirror = new PerspectiveCamera();
  private readonly plane = new Plane(new Vector3(0, 1, 0), 0);
  private readonly clip = new Vector4();
  private readonly q = new Vector4();
  private readonly look = new Vector3();
  private readonly direction = new Vector3();
  private readonly clearColor = new Color();

  constructor(size: number) {
    this.target = new WebGLRenderTarget(size, size, { type: HalfFloatType });
  }

  render(renderer: ReflectionRenderer, camera: PerspectiveCamera) {
    const mirror = this.mirror;
    mirror.position.copy(camera.position);
    mirror.position.y *= -1;
    camera.getWorldDirection(this.direction);
    this.look.copy(camera.position).add(this.direction);
    this.look.y *= -1;
    mirror.up.set(0, -1, 0);
    mirror.lookAt(this.look);
    mirror.near = camera.near;
    mirror.far = camera.far;
    mirror.projectionMatrix.copy(camera.projectionMatrix);
    mirror.updateMatrixWorld();
    this.matrix
      .set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1)
      .multiply(mirror.projectionMatrix)
      .multiply(mirror.matrixWorldInverse);
    this.plane.normal.set(0, 1, 0);
    this.plane.constant = 0;
    this.plane.applyMatrix4(mirror.matrixWorldInverse);
    this.clip.set(
      this.plane.normal.x,
      this.plane.normal.y,
      this.plane.normal.z,
      this.plane.constant,
    );
    const p = mirror.projectionMatrix.elements;
    this.q.set(
      (Math.sign(this.clip.x) + p[8]) / p[0],
      (Math.sign(this.clip.y) + p[9]) / p[5],
      -1,
      (1 + p[10]) / p[14],
    );
    this.clip.multiplyScalar(2 / this.clip.dot(this.q));
    p[2] = this.clip.x;
    p[6] = this.clip.y;
    p[10] = this.clip.z + 1;
    p[14] = this.clip.w;
    const previous = renderer.getRenderTarget();
    const alpha = renderer.getClearAlpha();
    renderer.getClearColor(this.clearColor);
    try {
      renderer.setRenderTarget(this.target);
      renderer.setClearColor(0x000000, 0);
      renderer.render(this.proxy.scene, mirror);
    } finally {
      renderer.setRenderTarget(previous);
      renderer.setClearColor(this.clearColor, alpha);
    }
  }

  dispose() {
    this.target.dispose();
    this.proxy.dispose();
  }
}
