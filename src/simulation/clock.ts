export class SimulationClock {
  time = 0;
  activityTime = 0;
  paused = false;
  hidden = false;
  advance(delta: number, intensity: number) {
    if (this.paused || this.hidden) return;
    const dt = Math.max(0, Math.min(delta, 0.05));
    this.time += dt;
    this.activityTime += dt * intensity;
  }
}
