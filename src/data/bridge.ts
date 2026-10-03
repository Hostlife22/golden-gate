/** Metric dimensions from GGB District; scene units are 10 metres. */
const towerHeight = 22.7;

const deckY = towerHeight - 15.2;

export const BRIDGE = {
  mainSpan: 128,
  sideSpan: 34.3,
  totalLength: 273.7,
  towerHeight,
  deckY,
  undersideY: deckY - 0.8,
  width: 2.7,
  roadWidth: 1.9,
  cableRadius: 0.046,
  cableTop: towerHeight - 0.35,
  cableLow: deckY + 2,
  anchorY: deckY + 0.7,
  suspenderSpacing: 1.524,
} as const;

export const HALF_SPAN = BRIDGE.mainSpan / 2;

export const ANCHOR = HALF_SPAN + BRIDGE.sideSpan;

export const BRIDGE_ANGLE = -0.094;

// west of true north; rotation in X/Z plane
export const PALETTE = {
  orange: '#b94e30',
  orangeLight: '#ce6645',
  orangeDark: '#843d2e',
  concrete: '#b6b1a0',
  road: '#525b5d',
  sidewalk: '#a9a89b',
  rail: '#bb6145',
  trees: '#374b34',
  rock: '#817b64',
  grass: '#6c7751',
};
