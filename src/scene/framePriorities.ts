/** Negative priorities preserve R3F automatic rendering while ordering scene updates. */
export const FRAME_PRIORITY = {
  simulation: -100,
  atmosphere: -90,
  camera: -10,
  detail: -5,
  reflection: -2,
} as const;
