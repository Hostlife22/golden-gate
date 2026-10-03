import { createContext, useContext } from 'react';
import type { Runtime } from './runtime';
import type { Settings } from './settings';

export interface ObservatoryCommands {
  togglePause: () => void;
  resetView: () => void;
  toggleInterface: () => void;
}

export interface AppState {
  settings: Settings;
  runtime: Runtime;
  update: (patch: Partial<Settings>) => void;
  ready: () => void;
  loaded: boolean;
  commands: ObservatoryCommands;
}

export const AppContext = createContext<AppState | null>(null);

export function useObservatory() {
  const value = useContext(AppContext);
  if (!value) throw new Error('Observatory provider missing');
  return value;
}
