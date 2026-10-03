import { BridgeMark } from './Brand';

export function WebGLFallback() {
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
