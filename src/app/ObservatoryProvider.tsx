import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from './context';
import { createRuntime } from './runtime';
import { createInitialSettings } from './settings';
import type { Settings } from './settings';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

interface ObservatoryProviderProps {
  children: ReactNode;
}

export function ObservatoryProvider({ children }: ObservatoryProviderProps) {
  const [settings, setSettings] = useState(() =>
    createInitialSettings(window.matchMedia('(prefers-reduced-motion: reduce)').matches),
  );
  const [runtime] = useState(createRuntime);
  const [loaded, setLoaded] = useState(false);
  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);
  const ready = useCallback(() => setLoaded(true), []);
  const commands = useMemo(
    () => ({
      togglePause: () => setSettings((current) => ({ ...current, paused: !current.paused })),
      resetView: () =>
        setSettings((current) => ({ ...current, camera: 'hero', reset: current.reset + 1 })),
      toggleInterface: () => setSettings((current) => ({ ...current, hidden: !current.hidden })),
    }),
    [],
  );

  useKeyboardShortcuts(commands);
  const value = useMemo(
    () => ({ settings, runtime, loaded, update, ready, commands }),
    [settings, runtime, loaded, update, ready, commands],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
