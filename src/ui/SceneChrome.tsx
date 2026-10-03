import { Info } from 'lucide-react';
import { useObservatory } from '../app/context';
import { BridgeMark } from './Brand';

interface SceneHeaderProps {
  onAbout: () => void;
}

export function SceneHeader({ onAbout }: SceneHeaderProps) {
  return (
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
      <button className="about-button" onClick={onAbout}>
        About this place <Info size={15} />
      </button>
    </header>
  );
}

export function SceneIntroduction() {
  return (
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
  );
}

export function SceneCompass() {
  return (
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
  );
}

export function SceneFooter() {
  const { settings } = useObservatory();
  return (
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
  );
}
