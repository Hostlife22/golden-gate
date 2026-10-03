import {
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  Scene,
  TubeGeometry,
  CatmullRomCurve3,
} from 'three';
import { ANCHOR, BRIDGE, BRIDGE_ANGLE, HALF_SPAN, PALETTE } from '../../data/bridge';
import { cablePoints } from '../bridge/geometry';
/** A dedicated, bounded reflection scene: no second city/vegetation render. */
export function reflectionScene() {
  const scene = new Scene(),
    group = new Group(),
    box = new BoxGeometry(),
    material = new MeshBasicMaterial({ color: PALETTE.orange }),
    road = new MeshBasicMaterial({ color: PALETTE.road }),
    concrete = new MeshBasicMaterial({ color: PALETTE.concrete });
  scene.background = new Color('#b7c7ca');
  group.rotation.y = -BRIDGE_ANGLE;
  scene.add(group);
  function part(
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
    mat = material,
  ) {
    const m = new Mesh(box, mat);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    group.add(m);
  }
  part(0, BRIDGE.deckY - 0.1, 0, BRIDGE.width, 0.18, ANCHOR * 2, road);
  for (const x of [-BRIDGE.width / 2, BRIDGE.width / 2])
    for (const y of [BRIDGE.deckY - 0.2, BRIDGE.undersideY]) part(x, y, 0, 0.08, 0.08, ANCHOR * 2);
  for (const z of [-HALF_SPAN, HALF_SPAN]) {
    for (const x of [-1.55, 1.55]) part(x, 11.8, z, 0.85, 21.8, 1.35);
    for (const y of [7.15, 10.8, 14.55, 18.05, 21.1]) part(0, y, z, 3.1, 0.57, 1.0);
    part(0, 0.4, z, 5.3, 1.4, 3.1, concrete);
  }
  for (const x of [-BRIDGE.width / 2, BRIDGE.width / 2]) {
    for (const [a, b] of [
      [-ANCHOR, -HALF_SPAN],
      [-HALF_SPAN, HALF_SPAN],
      [HALF_SPAN, ANCHOR],
    ])
      group.add(
        new Mesh(
          new TubeGeometry(
            new CatmullRomCurve3(cablePoints(x, a, b, 64)),
            64,
            BRIDGE.cableRadius,
            5,
          ),
          material,
        ),
      );
  }
  return {
    scene,
    dispose: () => {
      box.dispose();
      material.dispose();
      concrete.dispose();
      road.dispose();
      scene.traverse((o) => {
        if (o instanceof Mesh && o.geometry !== box) o.geometry.dispose();
      });
    },
  };
}
