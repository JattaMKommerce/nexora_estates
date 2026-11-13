/**
 * The homepage story: chapters, the construction sequence and the architectural views. Shared by
 * the website (captions, progress) and the 3D engine (what to draw), so both always agree.
 * Plain data and maths: no three.js here.
 *
 * The page pins one 3D view while these chapters scroll past (lengths in viewport heights):
 *   intro         the opening, then the empty site ("Scroll to watch it rise")
 *   rise          scrolling builds the development: foundations → podium → floors → crown → landscape
 *   architecture  the camera visits the finished building, view by view
 * Every value is a pure function of the scroll position, so scrolling back plays it backwards.
 */

export const CHAPTER_VH = {
  wide: { intro: 70, rise: 460, architecture: 420 },
  compact: { intro: 55, rise: 360, architecture: 320 }
};

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const smooth = (t) => t * t * (3 - 2 * t);
export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

/** Total scrolling (vh) while the 3D view is pinned. */
export function pinnedVh(compact) {
  const c = CHAPTER_VH[compact ? 'compact' : 'wide'];
  return c.intro + c.rise + c.architecture;
}

/** Chapter and progress (0–1) for a distance scrolled into the story, in viewport heights. */
export function chapterAt(vh, compact) {
  const c = CHAPTER_VH[compact ? 'compact' : 'wide'];
  if (vh < c.intro) return { chapter: 'intro', progress: clamp01(vh / c.intro) };
  if (vh < c.intro + c.rise) return { chapter: 'rise', progress: clamp01((vh - c.intro) / c.rise) };
  if (vh < c.intro + c.rise + c.architecture) return { chapter: 'architecture', progress: clamp01((vh - c.intro - c.rise) / c.architecture) };
  return { chapter: 'after', progress: 1 };
}

/* ---------------------------------------------------------- construction */

/** Phases of the build, as fractions of the whole (0 = empty site, 1 = finished and landscaped). */
export const PHASE = {
  foundation: [0, 0.09],
  podium: [0.09, 0.18],
  floors: [0.18, 0.86],
  crown: [0.86, 0.91],
  crane: [0.88, 0.95], // the cranes are dismantled
  landscape: [0.9, 1]
};

export const sub = (b, [a, z]) => clamp01((b - a) / (z - a));

/** How many floors the concrete frame leads the facade by. */
export const leadFor = (floors) => Math.max(2, Math.min(4, Math.round(floors * 0.15)));

/**
 * The two construction fronts, in floors from the bottom (fractional while a floor is rising):
 * S the concrete frame, F the facade (glass, cladding, balconies), a few floors behind.
 * `maxFloors` is the development's tallest tower, so every tower's floors rise in step.
 * Fraw continues past the top so a shorter tower's crown can follow its last floor.
 */
export function fronts(b, maxFloors) {
  const lead = leadFor(maxFloors);
  const t = sub(b, PHASE.floors);
  const s = (maxFloors + lead) * t;
  return { S: Math.min(maxFloors, s), F: Math.max(0, Math.min(maxFloors, s - lead)), Fraw: s - lead, lead };
}

/** Stages named in the captions, in order. */
export const STAGES = ['foundation', 'podium', 'lower', 'middle', 'upper', 'crown', 'landscape'];

/** Which stage the build is in, and the frame's current level (0-based, for "Level 12 of 22"). */
export function stageAt(b, maxFloors) {
  if (b < PHASE.foundation[1]) return { stage: 'foundation', level: -1 };
  if (b < PHASE.podium[1]) return { stage: 'podium', level: -1 };
  if (b < PHASE.floors[1]) {
    const { S } = fronts(b, maxFloors);
    const level = Math.min(maxFloors - 1, Math.floor(S));
    const third = S / maxFloors;
    return { stage: third < 1 / 3 ? 'lower' : third < 2 / 3 ? 'middle' : 'upper', level };
  }
  if (b < PHASE.crown[1]) return { stage: 'crown', level: maxFloors - 1 };
  return { stage: 'landscape', level: maxFloors - 1 };
}

/** The floors (0-based, end exclusive) that each of the three floor stages covers. */
export function floorThirds(maxFloors) {
  const a = Math.ceil(maxFloors / 3);
  const b = Math.ceil((maxFloors * 2) / 3);
  return { lower: [0, a], middle: [a, b], upper: [b, maxFloors] };
}

/**
 * Build progress (0–1) for the page's position. `openingDone`: the opening has ended on the empty
 * site; before that (or with reduced motion, which has no opening) the intro shows the finished
 * building. With reduced motion the build moves in whole stages rather than continuously.
 */
export function buildFor(chapter, progress, { openingDone, reduced }) {
  if (chapter === 'intro') return openingDone && !reduced ? 0 : 1;
  if (chapter === 'rise') {
    const b = clamp01(progress / 0.96); // a short hold on the finished building at the end
    return reduced ? stepped(b) : b;
  }
  return 1;
}

const STEP_ENDS = [0.09, 0.18, 0.18 + 0.68 / 3, 0.18 + (0.68 * 2) / 3, 0.86, 0.91, 1];
function stepped(b) {
  for (const e of STEP_ENDS) if (b <= e + 1e-6) return e;
  return 1;
}

/* ---------------------------------------------------------- architecture */

export const VIEWS = ['facade', 'balconies', 'crown', 'arrival', 'setting'];

/** Which view, and how far along the move to the next one (holds on each view, then moves). */
export function viewAt(progress) {
  const n = VIEWS.length;
  const x = clamp01(progress) * (n - 1);
  const i = Math.min(n - 2, Math.floor(x));
  const f = x - i;
  const hold = 0.42; // first part of each step holds the view
  const move = f < hold ? 0 : smoother((f - hold) / (1 - hold));
  return { from: i, to: i + 1, t: x >= n - 1 ? 1 : move, index: f < hold + (1 - hold) / 2 ? i : i + 1 };
}

/* --------------------------------------------------------------- opening */

/**
 * The opening, played once per browser session (a stand-in for the Stage 6 film, and its fallback).
 * Times in seconds. "short" (later visits) holds the finished building, then takes it down.
 */
export const OPENING = {
  full: { shots: [0, 3.4, 6.6, 9.4, 11.6], dissolve: [11.6, 14.0], end: 14.4 },
  short: { shots: [0], dissolve: [1.2, 3.4], end: 3.8 }
};

/** Build progress during the opening: finished, then taken down floor by floor ("rewound"). */
export function openingBuild(t, variant) {
  const o = OPENING[variant] || OPENING.full;
  return 1 - smooth(clamp01((t - o.dissolve[0]) / (o.dissolve[1] - o.dissolve[0])));
}

/** Title cues the page shows over the opening. */
export function openingCue(t, variant) {
  if (variant !== 'full') return t < OPENING.short.dissolve[0] ? 'name' : 'rewind';
  const s = OPENING.full.shots;
  if (t < s[1]) return 'name';
  if (t < s[2]) return 'tagline';
  if (t < s[3]) return 'specs';
  if (t < OPENING.full.dissolve[0]) return 'name';
  return 'rewind';
}

export const OPENING_SEEN_KEY = 'restate:opening-seen';
