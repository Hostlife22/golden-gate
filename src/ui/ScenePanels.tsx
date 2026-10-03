import { useObservatory } from '../app/context';
import { Dialog } from './Dialog';

export type ScenePanel = 'settings' | 'about';

interface ScenePanelsProps {
  panel: ScenePanel;
  onClose: () => void;
}

export function ScenePanels({ panel, onClose }: ScenePanelsProps) {
  return (
    <Dialog
      title={panel === 'settings' ? 'Make it your moment.' : 'An icon, in perspective.'}
      onClose={onClose}
    >
      {panel === 'settings' ? <SettingsPanel /> : <AboutPanel />}
    </Dialog>
  );
}

function SettingsPanel() {
  const { settings, update } = useObservatory();
  return (
    <>
      <p>Small adjustments. A different feeling.</p>
      <label className="range-label" htmlFor="fog-density">
        Coastal haze <span>{Math.round(settings.fog * 100)}%</span>
      </label>
      <input
        id="fog-density"
        type="range"
        min="0.2"
        max="2"
        step="0.05"
        value={settings.fog}
        onChange={(e) => update({ fog: Number(e.target.value) })}
      />
      <label className="range-label" htmlFor="motion-intensity">
        Traffic & vessel speed <span>{Math.round(settings.intensity * 100)}%</span>
      </label>
      <input
        id="motion-intensity"
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={settings.intensity}
        onChange={(e) => update({ intensity: Number(e.target.value) })}
      />
      <label className="range-label" htmlFor="render-quality">
        Render quality
      </label>
      <select
        id="render-quality"
        value={settings.quality}
        onChange={(e) => update({ quality: e.target.value === 'high' ? 'high' : 'balanced' })}
      >
        <option value="balanced">Balanced</option>
        <option value="high">High</option>
      </select>
      <p className="panel-note">
        Higher quality adds detail to materials, shorelines and reflections.
      </p>
    </>
  );
}

function AboutPanel() {
  return (
    <>
      <p>
        Two shores, two towers, and 1,280 metres of open water. Explore a procedural interpretation
        of the Golden Gate Bridge, Marin Headlands, and San Francisco Bay.
      </p>
      <div className="help-grid">
        <kbd>Drag</kbd>
        <span>Orbit the scene</span>
        <kbd>Scroll / pinch</kbd>
        <span>Move closer or farther</span>
        <kbd>Space</kbd>
        <span>Pause every animation</span>
        <kbd>R</kbd>
        <span>Return to the hero view</span>
        <kbd>H</kbd>
        <span>Hide or show the interface</span>
        <kbd>Arrow keys</kbd>
        <span>Pan when the scene is focused</span>
      </div>
      <p className="panel-note">
        Bridge dimensions follow the Golden Gate Bridge District. Coastlines use Natural Earth;
        bridge alignment uses OpenStreetMap. Terrain, buildings, and traffic are illustrative; the
        traffic is a fixed three-lane flow in each direction. This is an observatory, not a
        navigation tool.
      </p>
      <div className="source-links">
        <a
          href="https://www.goldengate.org/bridge/history-research/statistics-data/design-construction-stats/"
          target="_blank"
          rel="noreferrer"
        >
          Bridge District ↗
        </a>
        <a href="https://www.nps.gov/goga/planyourvisit/maps.htm" target="_blank" rel="noreferrer">
          NPS maps ↗
        </a>
        <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">
          Natural Earth ↗
        </a>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          © OpenStreetMap contributors ↗
        </a>
        <a href="https://github.com/Hostlife22/golden-gate" target="_blank" rel="noreferrer">
          Source & study ↗
        </a>
      </div>
    </>
  );
}
