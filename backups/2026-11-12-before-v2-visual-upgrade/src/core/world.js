/**
 * Everything the 3D shows, as a function of the story clock S (see story.js). Computed once per
 * frame by the director into W; every scene component reads W in its own frame loop.
 *
 * B is the build clock of the development (0 = bare land, 1 = finished):
 *   0.00–0.08 the site is graded         0.24–0.34 podium structure
 *   0.08–0.17 excavation                 0.28–0.72 tower floors rise (facade follows)
 *   0.17–0.24 basement and foundations   0.45–0.62 clubhouse
 *   0.20–0.26 cranes go up               0.62–0.90 landscape, pool, play area, greening
 *   0.84–0.94 cranes come down           0.88–0.96 the last vehicles leave
 */
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ramp = (s, a, b) => clamp((s - a) / (b - a));
export const sstep = (s, a, b) => {
  const t = ramp(s, a, b);
  return t * t * (3 - 2 * t);
};
export const band = (s, a, b, c, d) => Math.min(sstep(s, a, b), 1 - sstep(s, c, d));
const lerp = (a, b, t) => a + (b - a) * t;

export const W = {
  S: 0,
  set: 'corridor',
  white: 0,
  B: 1,
  green: 1,
  holo: { boundary: 0, util: 0, env: 0, sun: 0, ghost: 0, units: 0, grid: 0 },
  scan: { r: 0, i: 0 },
  override: null // a live window's look, when one is on screen
};

export function buildClock(S) {
  if (S < 3.3) return 1;
  if (S < 4) return 1 - sstep(S, 3.3, 3.95);
  if (S < 9) return 0;
  if (S < 10) return lerp(0, 0.16, ramp(S, 9, 10));
  if (S < 11) return lerp(0.16, 0.8, ramp(S, 10, 11));
  if (S < 12) return lerp(0.8, 1, ramp(S, 11, 11.8));
  return 1;
}

const HOLO_KEYS = ['boundary', 'util', 'env', 'sun', 'ghost', 'units', 'grid'];
const target = { boundary: 0, util: 0, env: 0, sun: 0, ghost: 0, units: 0, grid: 0 };

/** Each hologram layer turns on with a scan ring sweeping out from the site. */
const SCANS = [
  [4.35, 5.0],
  [5.45, 6.0],
  [6.45, 7.0],
  [7.45, 8.0],
  [13.3, 13.95]
];

export function updateWorld(S, dt, win) {
  W.S = S;
  W.set = S < 2.93 ? 'corridor' : 'model';
  W.white = S < 2.93 ? sstep(S, 2.5, 2.92) : 1 - sstep(S, 2.95, 3.4);

  target.boundary = band(S, 4.45, 4.9, 7.55, 7.95);
  target.util = band(S, 4.5, 4.95, 5.45, 5.85);
  target.env = band(S, 5.5, 5.95, 6.45, 6.85);
  target.sun = band(S, 6.5, 6.95, 7.45, 7.85);
  target.ghost = band(S, 7.5, 7.95, 8.6, 8.95);
  target.units = band(S, 13.35, 13.95, 14.4, 14.85);
  target.grid = band(S, 4.4, 4.9, 7.5, 7.95);
  let B = buildClock(S);

  W.override = win || null;
  if (win) {
    for (const k of HOLO_KEYS) target[k] = win.layers?.[k] ?? 0;
    if (win.B != null) B = win.B;
  }
  const k = 1 - Math.exp(-dt * (win ? 5 : 7));
  for (const key of HOLO_KEYS) W.holo[key] += (target[key] - W.holo[key]) * k;
  // the build clock follows S exactly, except when a window asks for a different moment
  W.B = win && win.B != null ? W.B + (B - W.B) * k : B;
  W.green = sstep(W.B, 0.68, 0.95);

  W.scan.i = 0;
  for (const [a, b] of SCANS) {
    if (S > a && S < b) {
      const t = ramp(S, a, b);
      W.scan.r = 30 + t * 620;
      W.scan.i = Math.sin(t * Math.PI);
    }
  }
}
