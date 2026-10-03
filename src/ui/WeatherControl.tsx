import { CloudFog, Sun, Sunset } from 'lucide-react';
import { useObservatory } from '../app/context';
import { WEATHER } from '../data/presets';
import type { WeatherId } from '../data/presets';

const weatherIcons = { clear: Sun, golden: Sunset, fog: CloudFog };

export function WeatherControl() {
  const { settings, update } = useObservatory();
  return (
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
  );
}
