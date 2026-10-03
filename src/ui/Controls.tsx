import { useEffect, useRef, useState } from 'react';
import {
  Aperture,
  ArrowDownLeft,
  Check,
  ChevronDown,
  CloudFog,
  EyeOff,
  Info,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sun,
  Sunset,
  X,
} from 'lucide-react';
import { useObservatory } from '../app/state';
import { CAMERAS, WEATHER } from '../data/presets';
import type { WeatherId } from '../data/presets';
import { IconButton } from './IconButton';
import { BridgeMark } from './Brand';
const weatherIcons = { clear: Sun, golden: Sunset, fog: CloudFog };
export function Controls() {
  const { settings, update } = useObservatory(),
    [views, setViews] = useState(false),
    [panel, setPanel] = useState<'settings' | 'about' | null>(null);
  const current = CAMERAS.find((c) => c.id === settings.camera)!,
    panelRef = useRef<HTMLElement>(null),
    previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!panel) return;
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanel(null);
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>('button,a,input,select');
      if (!nodes?.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('keydown', key);
      previousFocus.current?.focus();
    };
  }, [panel]);
  useEffect(() => {
    if (!views) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViews(false);
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [views]);
  if (settings.hidden)
    return (
      <button className="restore-ui surface" onClick={() => update({ hidden: false })}>
        <Aperture size={17} /> Show controls <kbd>H</kbd>
      </button>
    );
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#scene" aria-label="Golden Gate Bay Observatory">
          <span className="brand-mark">
            <BridgeMark />
          </span>
          <span>
            <h1>
              Golden Gate<span className="brand-dot">.</span>
            </h1>
            <span className="eyebrow">Bay Observatory</span>
          </span>
        </a>
        <div className="header-location">
          <span className="status-dot" /> San Francisco, California{' '}
          <span className="separator">/</span>{' '}
          <span className="coordinates">37°49′ N · 122°28′ W</span>
        </div>
        <button className="about-button" onClick={() => setPanel('about')}>
          About this place <Info size={15} />
        </button>
      </header>
      <div className="scene-copy">
        <div className="eyebrow">
          <span className="red-line" /> An exploration in three dimensions
        </div>
        <h2>
          A bridge.
          <br />A world between shores.
        </h2>
        <p>At the meeting of the Pacific and the Bay.</p>
      </div>
      <section className="weather-control surface" aria-label="Light and weather">
        <span className="eyebrow weather-label">Atmosphere</span>
        <div className="weather-options">
          {(Object.keys(WEATHER) as WeatherId[]).map((id) => {
            const Icon = weatherIcons[id];
            return (
              <button
                key={id}
                aria-pressed={settings.weather === id}
                onClick={() => update({ weather: id })}
              >
                <Icon size={16} />
                <span>{WEATHER[id].name}</span>
              </button>
            );
          })}
        </div>
      </section>
      <div className="view-control">
        <span className="eyebrow view-caption">Your perspective</span>
        <div className="view-wrap">
          <button
            className="view-trigger surface"
            aria-expanded={views}
            aria-controls="view-list"
            onClick={() => setViews(!views)}
          >
            <Aperture size={20} />
            <span>
              {current.name}
              <small>{current.description}</small>
            </span>
            <ChevronDown size={17} className={views ? 'rotated' : ''} />
          </button>
          {views && (
            <>
              <button
                className="dismiss-views"
                tabIndex={-1}
                aria-label="Close perspectives"
                onClick={() => setViews(false)}
              />
              <div className="view-menu surface" id="view-list" aria-label="Choose a perspective">
                {CAMERAS.map((p, i) => (
                  <button
                    key={p.id}
                    aria-pressed={settings.camera === p.id}
                    onClick={() => {
                      update({ camera: p.id });
                      setViews(false);
                    }}
                  >
                    <span className="view-index">0{i + 1}</span>
                    <span>{p.name}</span>
                    {settings.camera === p.id ? <Check size={15} /> : <ArrowDownLeft size={15} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <nav className="playback surface" aria-label="Scene controls">
        <button
          className="play-button"
          aria-label={settings.paused ? 'Play animation' : 'Pause animation'}
          aria-pressed={!settings.paused}
          onClick={() => update({ paused: !settings.paused })}
        >
          {settings.paused ? <Play size={17} /> : <Pause size={17} />}
          <span>{settings.paused ? 'Play' : 'Pause'}</span>
        </button>
        <span className="toolbar-divider" />
        <IconButton
          label="Reset view"
          onClick={() => update({ camera: 'hero', reset: settings.reset + 1 })}
        >
          <RotateCcw size={18} />
        </IconButton>
        <IconButton
          label="Scene settings"
          aria-expanded={panel === 'settings'}
          onClick={() => setPanel(panel === 'settings' ? null : 'settings')}
        >
          <Settings2 size={18} />
        </IconButton>
        <IconButton label="Hide interface" onClick={() => update({ hidden: true })}>
          <EyeOff size={18} />
        </IconButton>
      </nav>
      <aside className="scene-compass" aria-label="Compass, true north">
        <div className="compass-circle">
          <span>N</span>
          <svg id="compass-needle" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 6 26 28 20 24 14 28Z" fill="currentColor" />
            <path d="M20 6v18" stroke="var(--paper)" strokeWidth="0.8" />
          </svg>
          <b>W</b>
          <em>E</em>
        </div>
        <span className="eyebrow">The Golden Gate Strait</span>
      </aside>
      <footer className="scene-footer">
        <div className="bridge-facts">
          <span>
            <b>1,280</b> m main span
          </span>
          <span>
            <b>227</b> m towers
          </span>
          <span>
            Since <b>1937</b>
          </span>
        </div>
        <div className="gesture-help">
          Drag to orbit <span>·</span> Scroll to explore <span>·</span> <kbd>Space</kbd>{' '}
          {settings.paused ? 'play' : 'pause'}
        </div>
        <span className="live-state">
          <i className={settings.paused ? 'paused' : ''} />
          {settings.paused ? 'Time stands still' : 'The bay is moving'}
        </span>
      </footer>
      <p className="sr-only" aria-live="polite">
        {WEATHER[settings.weather].name}. {current.name}.{' '}
        {settings.paused ? 'Animation paused.' : 'Animation playing.'}
      </p>
      {panel && (
        <div className="panel-backdrop" onClick={() => setPanel(null)}>
          <section
            ref={panelRef}
            className="detail-panel surface"
            role="dialog"
            aria-modal="true"
            aria-labelledby="panel-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-heading">
              <span className="eyebrow">Bay Observatory</span>
              <IconButton label="Close panel" onClick={() => setPanel(null)}>
                <X size={18} />
              </IconButton>
            </div>
            <h2 id="panel-title">
              {panel === 'settings' ? 'Make it your moment.' : 'An icon, in perspective.'}
            </h2>
            {panel === 'settings' ? (
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
                  onChange={(e) =>
                    update({ quality: e.target.value === 'high' ? 'high' : 'balanced' })
                  }
                >
                  <option value="balanced">Balanced</option>
                  <option value="high">High</option>
                </select>
                <p className="panel-note">
                  Higher quality adds detail to materials, shorelines and reflections.
                </p>
              </>
            ) : (
              <>
                <p>
                  Two shores, two towers, and 1,280 metres of open water. Explore a procedural
                  interpretation of the Golden Gate Bridge, Marin Headlands, and San Francisco Bay.
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
                  Bridge dimensions follow the Golden Gate Bridge District. Coastlines use Natural
                  Earth; bridge alignment uses OpenStreetMap. Terrain, buildings, and traffic are
                  illustrative; the traffic is a fixed three-lane flow in each direction. This is an
                  observatory, not a navigation tool.
                </p>
                <div className="source-links">
                  <a
                    href="https://www.goldengate.org/bridge/history-research/statistics-data/design-construction-stats/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Bridge District ↗
                  </a>
                  <a
                    href="https://www.nps.gov/goga/planyourvisit/maps.htm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    NPS maps ↗
                  </a>
                  <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">
                    Natural Earth ↗
                  </a>
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                  >
                    © OpenStreetMap contributors ↗
                  </a>
                  <a
                    href="https://github.com/Hostlife22/golden-gate"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source & study ↗
                  </a>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
