/**
 * The homepage story: chapters, the construction sequence and the camera's stops. Shared by the
 * website (captions, progress, navigation) and the 3D engine (what to draw), so both always agree.
 * Plain data and maths: no three.js here.
 *
 * One 3D view is pinned while these chapters scroll past. Their lengths are relative weights (in
 * viewport heights at their designed pace); the page measures progress in pixels, so the mapping
 * holds on phones whose viewport height changes as the address bar moves.
 *   hero          the finished building, centred (after the opening)
 *   rise          scrolling takes it down to the ground, then builds it storey by storey
 *   architecture  the facade, balconies, crown and arrival, view by view
 *   floors        floors open one by one, with their availability
 *   inside        a home, room by room
 *   amenities     the grounds and what the project lists among its amenities
 * Every value is a pure function of the scroll position, so scrolling back plays it backwards.
 */

export const CHAPTERS = ['hero', 'rise', 'architecture', 'floors', 'inside', 'amenities'];

export const CHAPTER_VH = {
  wide: { hero: 80, rise: 480, architecture: 300, floors: 320, inside: 340, amenities: 190 },
  compact: { hero: 60, rise: 380, architecture: 240, floors: 260, inside: 280, amenities: 160 }
};

export const CHAPTER_LABEL = {
  hero: 'The residence',
  rise: 'Construction',
  architecture: 'Architecture',
  floors: 'Floor by floor',
  inside: 'Inside',
  amenities: 'Amenities'
};

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const smooth = (t) => t * t * (3 - 2 * t);
export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);

/** Total of the chapters' lengths (vh): the pinned scroll distance at its designed pace. */
export function pinnedVh(compact) {
  const c = CHAPTER_VH[compact ? 'compact' : 'wide'];
  return CHAPTERS.reduce((n, k) => n + c[k], 0);
}

/** Where each chapter starts, as a fraction (0–1) of the pinned scroll distance. */
export function chapterStarts(compact) {
  const c = CHAPTER_VH[compact ? 'compact' : 'wide'];
  const total = pinnedVh(compact);
  let at = 0;
  const out = {};
  for (const k of CHAPTERS) {
    out[k] = at / total;
    at += c[k];
  }
  return out;
}

/** Chapter and progress within it (0–1) for an overall progress through the story (0–1). */
export function chapterAt(f, compact) {
  const c = CHAPTER_VH[compact ? 'compact' : 'wide'];
  const total = pinnedVh(compact);
  if (f >= 1) return { chapter: 'after', progress: 1 };
  let at = 0;
  const x = Math.max(0, f) * total;
  for (const k of CHAPTERS) {
    if (x < at + c[k]) return { chapter: k, progress: clamp01((x - at) / c[k]) };
    at += c[k];
  }
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
 * The construction chapter: first the finished building is taken down storey by storey to the
 * ground (a short "rewind"), then it is built again. Returns the build progress (0–1) and whether
 * the rewind is under way.
 */
export const REWIND = [0, 0.12];
export const REBUILD = [0.15, 0.96];
export function riseBuild(progress, reduced) {
  if (progress < REWIND[1]) return { b: reduced ? 0 : 1 - smoother(clamp01(progress / REWIND[1])), rewinding: true };
  const b = sub(progress, REBUILD);
  return { b: reduced ? stepped(b) : b, rewinding: false };
}

/** Build progress (0–1) for a chapter and the progress through it. */
export function buildFor(chapter, progress, { reduced }) {
  if (chapter === 'rise') return riseBuild(progress, reduced).b;
  return 1;
}

const STEP_ENDS = [0.09, 0.18, 0.18 + 0.68 / 3, 0.18 + (0.68 * 2) / 3, 0.86, 0.91, 1];
function stepped(b) {
  for (const e of STEP_ENDS) if (b <= e + 1e-6) return e;
  return 1;
}

/* ------------------------------------------------- stops within a chapter */

/**
 * A chapter divided into `n` stops: each stop holds, then the camera moves on to the next.
 * Returns the stop being moved from and to, the move's progress, and the stop to name.
 */
export function stopsAt(progress, n, hold = 0.45) {
  if (n <= 1) return { from: 0, to: 0, t: 0, index: 0 };
  const x = clamp01(progress) * (n - 1);
  const i = Math.min(n - 2, Math.floor(x));
  const f = x - i;
  const move = f < hold ? 0 : smoother((f - hold) / (1 - hold));
  return { from: i, to: i + 1, t: x >= n - 1 ? 1 : move, index: f < hold + (1 - hold) / 2 ? i : i + 1 };
}

export const VIEWS = ['facade', 'balconies', 'crown', 'arrival'];
export const AMENITY_VIEWS = ['feature', 'grounds'];

/** Floors the "floor by floor" chapter opens: low, middle and high, always including the featured one. */
export function floorStops(count, featured) {
  if (count <= 0) return [];
  const pick = [0.12, 0.38, 0.88].map((f) => Math.min(count - 1, Math.max(0, Math.round(count * f))));
  if (featured !== null && featured !== undefined) pick.push(featured);
  return [...new Set(pick)].sort((a, b) => a - b);
}

/* --------------------------------------------------------------- opening */

/**
 * The opening, played once per browser session (a stand-in for the Stage 6 film, and its fallback):
 * aerial approach, the street, up the facade, then it settles on the hero view of the finished
 * building. "short" (later visits) is a gentle push-in to the same view. Times in seconds.
 */
export const OPENING = {
  full: { shots: [0, 3.2, 6.2, 8.8], end: 11.4 },
  short: { shots: [0], end: 2.6 }
};

/** Title cues the page shows over the opening. */
export function openingCue(t, variant) {
  if (variant !== 'full') return 'hero';
  const s = OPENING.full.shots;
  if (t < s[1]) return 'name';
  if (t < s[2]) return 'tagline';
  if (t < s[3]) return 'specs';
  return 'hero';
}

export const OPENING_SEEN_KEY = 'restate:opening-seen';
