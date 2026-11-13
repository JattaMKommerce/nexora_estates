import * as THREE from 'three';

/**
 * The development's site plan, in metres around the terrace centre (x east, z south). Towers take
 * their floors and homes from the project data; this file fixes where things stand.
 */
export const PLOT = [
  [-84, -56],
  [76, -64],
  [90, 30],
  [44, 64],
  [-80, 58]
];
export const GATE = { x: 36, z: 63, w: 14 };
export const PAD_Y = 0.6; // top of the graded pad

export const PIT = { x0: -66, x1: 64, z0: -48, z1: -2, depth: 5 }; // floor stays above the water table (y -5)
export const PODIUM = { x0: -64, x1: 62, z0: -46, z1: -4, h: 5.4 };
export const FH = 3.3; // floor-to-floor height
export const TOWER_SLOTS = [
  { x: -35, z: -26, w: 30, d: 20 },
  { x: 33, z: -28, w: 30, d: 20 }
];
export const CLUB = { x: 62, z: 29, w: 26, d: 15, floors: 2, fh: 4.2 };
export const PLAY = { x: -50, z: 32, w: 26, d: 18 };
export const POOL = { x: -2, z: -15, w: 24, d: 7 }; // reflecting pool on the podium deck
export const LAWNS_DECK = [
  { x: -1, z: -31, w: 30, d: 22 },
  { x: -1, z: -8, w: 44, d: 6 },
  { x: -55, z: -9, w: 14, d: 8 },
  { x: 56, z: -10, w: 10, d: 8 }
];
export const LAWNS_GROUND = [
  { x: -16, z: 34, w: 36, d: 26 },
  { x: -66, z: 50, w: 22, d: 10 },
  { x: 76, z: -14, w: 10, d: 30 },
  { x: 8, z: 54, w: 46, d: 6 }
];
/** Visitor parking along the arrival court: a strip of bays (x0..x1 at z0..z1). */
export const PARKING = { x0: -60, x1: 24, z0: 12.5, z1: 18, bay: 2.7 };

export const DRIVE = [
  { x: 36, z: 36, w: 9, d: 52 }, // gate → arrival court
  { x: -4, z: 6, w: 128, d: 10 }, // arrival court along the podium front
  { x: 56, z: 13, w: 30, d: 8 } // lay-by at the clubhouse
];

/** A THREE.Shape in plan (shape y = -z, so rotateX(-PI/2) puts it back on the ground). */
export function planShape(points, holes = []) {
  const s = new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
  for (const h of holes) s.holes.push(new THREE.Path(h.map(([x, z]) => new THREE.Vector2(x, -z))));
  return s;
}

export function rectPoints(x0, z0, x1, z1) {
  return [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1]
  ];
}

/** Offset a convex polygon inwards by d metres (setback line). */
export function inset(points, d) {
  const n = points.length;
  // signed area tells the winding
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [x1, z1] = points[i];
    const [x2, z2] = points[(i + 1) % n];
    area += x1 * z2 - x2 * z1;
  }
  const sgn = area > 0 ? 1 : -1;
  const lines = points.map((p, i) => {
    const q = points[(i + 1) % n];
    const dx = q[0] - p[0];
    const dz = q[1] - p[1];
    const len = Math.hypot(dx, dz);
    const nx = (-dz / len) * sgn;
    const nz = (dx / len) * sgn;
    return { p: [p[0] + nx * d, p[1] + nz * d], d: [dx, dz] };
  });
  return lines.map((l, i) => {
    const m = lines[(i + n - 1) % n];
    // intersect m and l
    const [x1, z1] = m.p;
    const [dx1, dz1] = m.d;
    const [x2, z2] = l.p;
    const [dx2, dz2] = l.d;
    const den = dx1 * dz2 - dz1 * dx2;
    const t = ((x2 - x1) * dz2 - (z2 - z1) * dx2) / den;
    return [x1 + dx1 * t, z1 + dz1 * t];
  });
}

/** Tower placements from the project data (up to two in this plan). */
export function towerSpecs(project) {
  return (project?.towers || []).slice(0, TOWER_SLOTS.length).map((t, i) => {
    const slot = TOWER_SLOTS[i];
    const top = PODIUM.h + t.floors * FH;
    return { ...t, ...slot, top, crown: top + 4.2 };
  });
}
