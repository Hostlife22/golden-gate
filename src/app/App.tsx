import { Component, Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFShadowMap } from 'three';
import { AppContext, createRuntime } from './state';
import type { Settings } from './state';
import { Controls } from '../ui/Controls';
import { BridgeMark } from '../ui/Brand';
const Scene = lazy(() => import('../scene/Scene'));
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function hasWebGL() {
  if (new URLSearchParams(location.search).has('forceFallback')) return false;
  try {
    const canvas = document.createElement('canvas'),
      ctx = canvas.getContext('webgl2');
    if (!ctx) return false;
    ctx.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
export function App() {
  const [settings, setSettings] = useState<Settings>(() => ({
      weather: 'golden',
      camera: 'hero',
      paused: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      fog: 1,
      intensity: 1,
      hidden: false,
      reset: 0,
      quality: 'balanced',
    })),
    runtime = useMemo(createRuntime, []),
    [available] = useState(hasWebGL),
    [failed, setFailed] = useState(false),
    [loaded, setLoaded] = useState(false);
  const update = useCallback(
      (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })),
      [],
    ),
    ready = useCallback(() => setLoaded(true), []),
    fail = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName))
      )
        return;
      if (e.code === 'Space') {
        e.preventDefault();
        setSettings((s) => ({ ...s, paused: !s.paused }));
      } else if (e.key.toLowerCase() === 'r')
        setSettings((s) => ({ ...s, camera: 'hero', reset: s.reset + 1 }));
      else if (e.key.toLowerCase() === 'h') setSettings((s) => ({ ...s, hidden: !s.hidden }));
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  return (
    <AppContext.Provider value={{ settings, runtime, update, ready }}>
      <a className="skip-link" href="#scene">
        Skip to interactive scene
      </a>
      <main className={`observatory ${settings.hidden ? 'interface-hidden' : ''}`}>
        <div
          id="scene"
          className="canvas-wrap"
          tabIndex={0}
          role="region"
          aria-label="Interactive 3D view of the Golden Gate Bridge"
          aria-describedby="scene-description"
        >
          {available && !failed ? (
            <SceneBoundary onError={fail}>
              <Canvas
                shadows
                dpr={[1, settings.quality === 'high' ? 1.75 : 1.25]}
                camera={{ position: [-145, 53, 148], fov: 43, near: 0.08, far: 4500 }}
                gl={{
                  antialias: true,
                  powerPreference: 'high-performance',
                  toneMapping: ACESFilmicToneMapping,
                }}
                onCreated={({ gl }) => {
                  gl.shadowMap.type = PCFShadowMap;
                  gl.domElement.setAttribute(
                    'aria-label',
                    'Golden Gate Bridge, water, moving traffic, ships, and surrounding shores',
                  );
                  gl.domElement.tabIndex = 0;
                  gl.domElement.addEventListener(
                    'webglcontextlost',
                    (e) => {
                      e.preventDefault();
                      fail();
                    },
                    { once: true },
                  );
                }}
                fallback={<Fallback />}
              >
                <Suspense fallback={null}>
                  <Scene />
                </Suspense>
              </Canvas>
            </SceneBoundary>
          ) : (
            <Fallback />
          )}
          {available && !failed && !loaded && (
            <div className="loading-screen" role="status">
              <BridgeMark />
              <span className="eyebrow">Bringing the bay into view</span>
              <div className="loading-line" />
            </div>
          )}
        </div>
        <p id="scene-description" className="sr-only">
          A detailed orange suspension bridge crosses the Golden Gate Strait. Marin's hills rise to
          the north. San Francisco lies to the southeast, and Alcatraz sits farther east in the bay.
          Drag to orbit, scroll or pinch to zoom, Space to pause, R to reset, and H to show
          controls.
        </p>
        <Controls />
      </main>
    </AppContext.Provider>
  );
}
function Fallback() {
  return (
    <div className="webgl-fallback" role="status">
      <div className="fallback-mark">
        <BridgeMark />
      </div>
      <span className="eyebrow">Golden Gate · Bay Observatory</span>
      <h2>
        The bay needs a little
        <br />
        graphics power.
      </h2>
      <p>
        This 3D view requires WebGL 2. Enable hardware acceleration in your browser, or open this
        page in another browser.
      </p>
      <button className="surface" onClick={() => window.location.reload()}>
        Try again
      </button>
      <a href="https://www.goldengate.org/bridge/history-research/statistics-data/">
        Explore the bridge’s story ↗
      </a>
    </div>
  );
}
