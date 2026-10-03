import { lazy, Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFShadowMap } from 'three';
import { RENDER_QUALITY } from '../config/rendering';
import { BridgeMark } from '../ui/Brand';
import { WebGLFallback } from '../ui/WebGLFallback';
import { useObservatory } from './context';
import { SceneBoundary } from './SceneBoundary';
import { hasWebGL } from './webgl';

const Scene = lazy(() => import('../scene/Scene'));

export function SceneViewport() {
  const { settings, loaded } = useObservatory();
  const [available] = useState(hasWebGL);
  const [failed, setFailed] = useState(false);
  const fail = useCallback(() => setFailed(true), []);
  return (
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
            dpr={[1, RENDER_QUALITY[settings.quality].maxDpr]}
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
            fallback={<WebGLFallback />}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </SceneBoundary>
      ) : (
        <WebGLFallback />
      )}
      {available && !failed && !loaded && (
        <div className="loading-screen" role="status">
          <BridgeMark />
          <span className="eyebrow">Bringing the bay into view</span>
          <div className="loading-line" />
        </div>
      )}
    </div>
  );
}
