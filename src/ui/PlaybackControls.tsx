import { EyeOff, Pause, Play, RotateCcw, Settings2 } from 'lucide-react';
import { useObservatory } from '../app/context';
import { IconButton } from './IconButton';

interface PlaybackControlsProps {
  settingsOpen: boolean;
  onSettings: () => void;
}

export function PlaybackControls({ settingsOpen, onSettings }: PlaybackControlsProps) {
  const { settings, update, commands } = useObservatory();
  return (
    <nav className="playback surface" aria-label="Scene controls">
      <button
        className="play-button"
        aria-label={settings.paused ? 'Play animation' : 'Pause animation'}
        aria-pressed={!settings.paused}
        onClick={() => commands.togglePause()}
      >
        {settings.paused ? <Play size={17} /> : <Pause size={17} />}
        <span>{settings.paused ? 'Play' : 'Pause'}</span>
      </button>
      <span className="toolbar-divider" />
      <IconButton label="Reset view" onClick={() => commands.resetView()}>
        <RotateCcw size={18} />
      </IconButton>
      <IconButton label="Scene settings" aria-expanded={settingsOpen} onClick={onSettings}>
        <Settings2 size={18} />
      </IconButton>
      <IconButton label="Hide interface" onClick={() => update({ hidden: true })}>
        <EyeOff size={18} />
      </IconButton>
    </nav>
  );
}
