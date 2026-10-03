import { ObservatoryProvider } from './ObservatoryProvider';
import { useObservatory } from './context';
import { SceneViewport } from './SceneViewport';
import { Controls } from '../ui/Controls';

export function App() {
  return (
    <ObservatoryProvider>
      <Observatory />
    </ObservatoryProvider>
  );
}

function Observatory() {
  const { settings } = useObservatory();
  return (
    <>
      <a className="skip-link" href="#scene">
        Skip to interactive scene
      </a>
      <main className={`observatory ${settings.hidden ? 'interface-hidden' : ''}`}>
        <SceneViewport />
        <p id="scene-description" className="sr-only">
          A detailed orange suspension bridge crosses the Golden Gate Strait. Marin's hills rise to
          the north. San Francisco lies to the southeast, and Alcatraz sits farther east in the bay.
          Drag to orbit, scroll or pinch to zoom, Space to pause, R to reset, and H to show
          controls.
        </p>

        <Controls />
      </main>
    </>
  );
}
