import { Aperture, ArrowDownLeft, Check, ChevronDown } from 'lucide-react';
import { useObservatory } from '../app/context';
import { CAMERAS, getCameraPreset } from '../data/presets';

interface PerspectiveControlProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function PerspectiveControl({ open, onToggle, onClose }: PerspectiveControlProps) {
  const { settings, update } = useObservatory();
  const current = getCameraPreset(settings.camera);
  return (
    <div className="view-control">
      <span className="eyebrow view-caption">Your perspective</span>
      <div className="view-wrap">
        <button
          className="view-trigger surface"
          aria-expanded={open}
          aria-controls="view-list"
          onClick={onToggle}
        >
          <Aperture size={20} />
          <span>
            {current.name}
            <small>{current.description}</small>
          </span>
          <ChevronDown size={17} className={open ? 'rotated' : ''} />
        </button>
        {open && (
          <>
            <button
              className="dismiss-views"
              tabIndex={-1}
              aria-label="Close perspectives"
              onClick={() => onClose()}
            />
            <div className="view-menu surface" id="view-list" aria-label="Choose a perspective">
              {CAMERAS.map((p, i) => (
                <button
                  key={p.id}
                  aria-pressed={settings.camera === p.id}
                  onClick={() => {
                    update({ camera: p.id });
                    onClose();
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
  );
}
