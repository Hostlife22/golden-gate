import { SceneLifecycle } from './SceneLifecycle';
import { Bridge } from './bridge/Bridge';
import { Terrain } from './terrain/Terrain';
import { City } from './city/City';
import { Water } from './water/Water';
import { Atmosphere } from './atmosphere/Atmosphere';
import { Traffic } from './traffic/Traffic';
import { Vessels } from './vessels/Vessels';
import { CameraRig } from './cameras/CameraRig';
import { MaterialLibrary } from './materials/MaterialLibrary';

export default function Scene() {
  return (
    <MaterialLibrary>
      <SceneLifecycle />
      <Atmosphere />
      <Terrain />
      <City />
      <Bridge />
      <Water />
      <Traffic />
      <Vessels />
      <CameraRig />
    </MaterialLibrary>
  );
}
