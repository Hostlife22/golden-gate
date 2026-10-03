import { useCallback, useEffect, useState } from 'react';
import { Aperture } from 'lucide-react';
import { useObservatory } from '../app/context';
import { WEATHER, getCameraPreset } from '../data/presets';
import { SceneHeader, SceneIntroduction, SceneCompass, SceneFooter } from './SceneChrome';
import { WeatherControl } from './WeatherControl';
import { PerspectiveControl } from './PerspectiveControl';
import { PlaybackControls } from './PlaybackControls';
import { ScenePanels } from './ScenePanels';
import type { ScenePanel } from './ScenePanels';

export function Controls() {
  const { settings, update } = useObservatory();
  const [views, setViews] = useState(false);
  const closeViews = useCallback(() => setViews(false), []);
  const [panel, setPanel] = useState<ScenePanel | null>(null);
  const closePanel = useCallback(() => setPanel(null), []);
  useEffect(() => {
    if (!views) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeViews();
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [views, closeViews]);
  if (settings.hidden)
    return (
      <button className="restore-ui surface" onClick={() => update({ hidden: false })}>
        <Aperture size={17} /> Show controls <kbd>H</kbd>
      </button>
    );
  return (
    <>
      <SceneHeader onAbout={() => setPanel('about')} />
      <SceneIntroduction />
      <WeatherControl />
      <PerspectiveControl open={views} onToggle={() => setViews(!views)} onClose={closeViews} />
      <PlaybackControls
        settingsOpen={panel === 'settings'}
        onSettings={() => setPanel(panel === 'settings' ? null : 'settings')}
      />
      <SceneCompass />
      <SceneFooter />
      <p className="sr-only" aria-live="polite">
        {WEATHER[settings.weather].name}. {getCameraPreset(settings.camera).name}.{' '}
        {settings.paused ? 'Animation paused.' : 'Animation playing.'}
      </p>
      {panel && <ScenePanels panel={panel} onClose={closePanel} />}
    </>
  );
}
