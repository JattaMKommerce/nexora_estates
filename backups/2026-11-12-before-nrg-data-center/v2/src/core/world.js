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
  holo: { boundary: 0, util: 0, env: 0, sun: 0, ghost: 0, plan: 0, units: 0, grid: 0 },
  scan: { r: 0, i: 0 },
  override: null // a live window's look, when one is on screen
};

export function buildClock(S) {
  if (S < 2.12) return 0;
  if (S < 3) return lerp(0, 0.24, ramp(S, 2.12, 3)); // grading, excavation, foundations, cranes
  if (S < 4) return lerp(0.24, 0.74, ramp(S, 3, 4)); // the towers rise, the facade follows
  if (S < 4.85) return lerp(0.74, 1, ramp(S, 4, 4.85)); // landscape, amenities, cranes down
  return 1;
}

const HOLO_KEYS = ['boundary', 'util', 'env', 'sun', 'ghost', 'plan', 'units', 'grid'];
const target = { boundary: 0, util: 0, env: 0, sun: 0, ghost: 0, plan: 0, units: 0, grid: 0 };

/** Each hologram layer turns on with a scan ring sweeping out from the site. */
const SCANS = [
  [1.72, 2.25],
  [5.25, 5.85]
];

/** The moment the camera leaves the entrance for the model (behind the daylight flash). */
export const CUT = 1.42;

export function updateWorld(S, dt, win) {
  W.S = S;
  W.set = S < CUT ? 'corridor' : 'model';
  W.white = S < CUT ? sstep(S, 1.18, CUT - 0.01) : 1 - sstep(S, CUT + 0.02, 1.72);

  // the site visit: plot, utilities and the planned buildings appear together, then clear for the works
  target.boundary = band(S, 1.72, 1.98, 2.22, 2.5);
  target.grid = band(S, 1.72, 1.98, 2.22, 2.5) * 0.6;
  target.util = band(S, 1.78, 2.02, 2.2, 2.45);
  target.plan = band(S, 1.82, 2.06, 2.18, 2.42);
  target.env = 0;
  target.sun = 0;
  target.ghost = 0;
  target.units = band(S, 5.3, 5.85, 6.3, 6.75);
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
