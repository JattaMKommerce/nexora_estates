import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

/**
 * The land the model stands on, in metres (x east, z south, y up). The site sits on a flat terrace
 * at y = 0 in the middle; rolling hills, a river with a lake to the west, a main road along the
 * south, and a town to the south-east surround it. Everything is deterministic, so every visit
 * (and every screenshot) shows the same land.
 */
const perlin = new ImprovedNoise();
export function fbm(x, z, oct = 4, seed = 0) {
  let a = 0.5;
  let f = 1;
  let s = 0;
  for (let i = 0; i < oct; i++) {
    s += a * perlin.noise(x * f, seed + i * 17.31, z * f);
    a *= 0.5;
    f *= 2.03;
  }
  return s;
}

export const SIZE = 2800;
export const WATER_Y = -5;
export const SITE_R = 128;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

/** Points along a curve, every `step` metres, with a spatial hash for nearest-distance queries. */
class Track {
  constructor(points, step = 4, cell = 64) {
    this.curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
    const len = this.curve.getLength();
    const n = Math.max(8, Math.ceil(len / step));
    this.pts = this.curve.getSpacedPoints(n);
    this.len = len;
    this.cell = cell;
    this.grid = new Map();
    this.pts.forEach((p, i) => {
      const k = this.key(p.x, p.z);
      if (!this.grid.has(k)) this.grid.set(k, []);
      this.grid.get(k).push(i);
    });
  }
  key(x, z) {
    return `${Math.floor(x / this.cell)},${Math.floor(z / this.cell)}`;
  }
  /** nearest sample within one cell's reach: { d, i } (d = Infinity when far away) */
  nearest(x, z) {
    const cx = Math.floor(x / this.cell);
    const cz = Math.floor(z / this.cell);
    let best = Infinity;
    let bi = -1;
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++) {
        const list = this.grid.get(`${cx + a},${cz + b}`);
        if (!list) continue;
        for (const i of list) {
          const p = this.pts[i];
          const d = (p.x - x) ** 2 + (p.z - z) ** 2;
          if (d < best) {
            best = d;
            bi = i;
          }
        }
      }
    return { d: Math.sqrt(best), i: bi };
  }
}

export const river = new Track(
  [
    [-1500, -620],
    [-980, -430],
    [-640, -290],
    [-400, -170],
    [-285, -20],
    [-300, 160],
    [-460, 360],
    [-720, 580],
    [-1500, 1000]
  ],
  5,
  80
);
export const LAKE = { x: -350, z: 40, r: 85 };

export const ROADS = {
  main: new Track(
    [
      [1600, 210],
      [900, 165],
      [460, 120],
      [180, 104],
      [0, 106],
      [-170, 118],
      [-340, 170],
      [-600, 250],
      [-1000, 320],
      [-1600, 380]
    ],
    4
  ),
  access: new Track(
    [
      [36, 106],
      [36, 86],
      [36, 62]
    ],
    2
  ),
  town: new Track(
    [
      [460, 120],
      [480, 280],
      [520, 460],
      [600, 720],
      [720, 1200]
    ],
    4
  ),
  ridge: new Track(
    [
      [-170, 118],
      [-120, -140],
      [-60, -300],
      [80, -520],
      [260, -900]
    ],
    4
  )
};
export const ROAD_W = { main: 11, access: 7.5, town: 8, ridge: 6.5 };

/** Hills before roads and the river are cut in. */
export function baseHeight(x, z) {
  let h = 7 + fbm(x * 0.0016, z * 0.0016, 5) * 46;
  h += 34 * Math.exp(-((x - 280) ** 2 + (z + 560) ** 2) / (2 * 280 ** 2));
  h += 26 * Math.exp(-((x + 160) ** 2 + (z + 760) ** 2) / (2 * 320 ** 2));
  h += 14 * Math.exp(-((x - 760) ** 2 + (z - 40) ** 2) / (2 * 260 ** 2));
  h = Math.max(h, 1.5);
  // the site terrace
  const d = Math.hypot(x * 0.95, z * 1.12);
  return lerp(0, h, smooth(SITE_R, SITE_R + 150, d));
}

// road deck heights: the terrain under each road sample, smoothed along the road (and never cut by
// the river, so a road crossing it stays up: a bridge)
for (const [, t] of Object.entries(ROADS)) {
  const raw = t.pts.map((p) => baseHeight(p.x, p.z));
  const win = 14;
  t.h = raw.map((_, i) => {
    let s = 0;
    let n = 0;
    for (let j = i - win; j <= i + win; j++) {
      if (j < 0 || j >= raw.length) continue;
      s += raw[j];
      n++;
    }
    return s / n;
  });
}

export function riverDistance(x, z) {
  const r = river.nearest(x, z).d;
  const l = Math.hypot(x - LAKE.x, z - LAKE.z) - LAKE.r;
  return Math.min(r - 26, l);
}

export function terrainHeight(x, z) {
  let h = baseHeight(x, z);
  for (const [name, t] of Object.entries(ROADS)) {
    const { d, i } = t.nearest(x, z);
    if (i < 0) continue;
    const half = ROAD_W[name] / 2;
    const w = 1 - smooth(half + 1.5, half + 30, d);
    if (w > 0) h = lerp(h, t.h[i] - 0.15, w);
  }
  const rd = riverDistance(x, z);
  const carve = 1 - smooth(0, 58, rd);
  if (carve > 0) h = lerp(h, WATER_Y - 6, carve);
  return h;
}

export function roadHeightAt(name, i) {
  return ROADS[name].h[i];
}

/** Where trees may grow: 0 (never) – 1 (dense woodland). */
export function forestDensity(x, z, h) {
  if (h < WATER_Y + 1.2) return 0;
  const d = Math.hypot(x, z);
  if (d < 112) return 0;
  for (const [name, t] of Object.entries(ROADS)) if (t.nearest(x, z).d < ROAD_W[name] / 2 + 7) return 0;
  if (inTown(x, z) || inOrchard(x, z, 6)) return 0;
  let f = fbm(x * 0.004 + 31, z * 0.004 - 12, 3) * 1.9 + 0.12;
  f += smooth(10, 50, h) * 0.35; // hills are wooded
  const rd = riverDistance(x, z);
  if (rd > 0 && rd < 60) f += 0.35 * (1 - rd / 60); // riverbanks
  if (d < 220) f *= 0.35 + 0.65 * smooth(112, 220, d); // the terrace edge stays open
  return Math.min(1, Math.max(0, f));
}

/** Orchards in neat rows: cultivated land between the woods (x, z centre; w × d; rotation). */
export const ORCHARDS = [
  { x: 305, z: -112, w: 170, d: 100, rot: 0.35 },
  { x: -175, z: -330, w: 150, d: 112, rot: -0.25 },
  { x: -118, z: 305, w: 132, d: 92, rot: 0.12 }
];
export function inOrchard(x, z, pad = 0) {
  return ORCHARDS.some((o) => {
    const c = Math.cos(-o.rot);
    const s = Math.sin(-o.rot);
    const lx = (x - o.x) * c - (z - o.z) * s;
    const lz = (x - o.x) * s + (z - o.z) * c;
    return Math.abs(lx) < o.w / 2 + pad && Math.abs(lz) < o.d / 2 + pad;
  });
}

export const TOWN = [
  { x: 520, z: 330, r: 150 },
  { x: 380, z: 520, r: 120 },
  { x: 640, z: 520, r: 110 },
  { x: 300, z: 250, r: 70 }
];
export function inTown(x, z) {
  return TOWN.some((c) => Math.hypot(x - c.x, z - c.z) < c.r + 12);
}

/** A small seeded random generator (mulberry32). */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Neighbourhood landmarks and the power line (used by the scene, the holograms and the hotspots). */
export const LANDMARKS = {
  school: { x: 330, z: 300 },
  station: { x: 210, z: 132 },
  market: { x: 560, z: 250 },
  substation: { x: 132, z: -96 }
};
export const PYLON_LINE = [
  [1150, -470],
  [930, -420],
  [720, -360],
  [520, -290],
  [340, -215],
  [190, -140],
  [132, -96]
];

/** A point `lift` metres above the ground (or the water) at (x, z). */
export function above(x, z, lift = 0) {
  return [x, Math.max(terrainHeight(x, z), WATER_Y) + lift, z];
}
