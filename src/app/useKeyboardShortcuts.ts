import { useEffect } from 'react';
import type { ObservatoryCommands } from './context';

export function useKeyboardShortcuts(commands: ObservatoryCommands) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName))
      )
        return;

      if (event.code === 'Space') {
        event.preventDefault();
        commands.togglePause();
      } else if (event.key.toLowerCase() === 'r') commands.resetView();
      else if (event.key.toLowerCase() === 'h') commands.toggleInterface();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [commands]);
}
