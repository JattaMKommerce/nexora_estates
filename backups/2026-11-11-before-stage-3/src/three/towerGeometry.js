import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { plateFor } from '../plan/layout.js';

/**
 * Procedural massing for a contemporary residential tower.
 *
 * This is an illustrative prototype, NOT an architectural model of any real building: the plate is
 * sized to fit the illustrative floor plans (src/plan/layout.js), the floor count comes from the
 * data file, and the facade (glass curtain wall, bronze fins, staggered balconies) is a generic
 * design. Swap in GLB assets per project when architects supply them (see README).
 *
 * Units are metres. One "typical floor" geometry set is built once and shared by every floor.
 */

export const FLOOR_H = 3.3;
export const SLAB_T = 0.32;
export const PLAZA_H = 0.35;
export const LOBBY_H = 6.6;
export const PLINTH_H = 1.2;
export const CROWN_H = 5.2;
export const SELECT_RISE = 1.4;
export const TEX_COLS = 64;
export const TEX_ROWS = 8;

const BALCONY_DEPTH = 1.6;
const SLAB_OVERHANG = 0.3;
export const GLASS_INSET = 0.15;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function towerDims(tower) {
  const n = tower.unitsPerFloor;
  const plate = plateFor(tower);
  const width = plate.W + 2 * GLASS_INSET;
  const depth = plate.D + 2 * GLASS_INSET;
  const base = PLAZA_H + (tower.hasLobby ? LOBBY_H : PLINTH_H);
  const floors = tower.levels.length;
  const top = base + floors * FLOOR_H;
  const height = top + CROWN_H;
  return {
    width,
    depth,
    base,
    floors,
    top,
    height,
    lift: clamp(height * 0.16, 14, 30),
    hasLobby: tower.hasLobby,
    unitsPerFloor: n,
    plate
  };
}

export const levelBaseY = (dims, index) => dims.base + index * FLOOR_H;

/* ------------------------------------------------------------------ helpers */

function box(w, h, d, x = 0, y = 0, z = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

function merge(parts) {
  const list = parts.filter(Boolean);
  if (list.length === 0) return null;
  const out = mergeGeometries(list, false);
  list.forEach((g) => g.dispose());
  out.computeBoundingBox();
  out.computeBoundingSphere();
  return out;
}

function edges(w, h, d, y) {
  const b = new THREE.BoxGeometry(w, h, d);
  const e = new THREE.EdgesGeometry(b);
  b.dispose();
  e.translate(0, y, 0);
  return e;
}

const modulesFor = (len) => Math.max(4, Math.round(len / 1.55));

export function disposeGeometries(value) {
  if (!value) return;
  if (value.isBufferGeometry) {
    value.dispose();
  } else if (Array.isArray(value)) {
    value.forEach(disposeGeometries);
  } else if (typeof value === 'object') {
    Object.values(value).forEach(disposeGeometries);
  }
}

/* ------------------------------------------------------------- typical floor */

/** Curtain wall as four planes whose UVs index a window-glow texture (one texel per glass panel). */
function glassEnvelope(W, D, h, y0) {
  const gw = W - 2 * GLASS_INSET;
  const gd = D - 2 * GLASS_INSET;
  const faces = [
    { len: gw, k: modulesFor(W), rot: 0, x: 0, z: gd / 2 },
    { len: gd, k: modulesFor(D), rot: Math.PI / 2, x: gw / 2, z: 0 },
    { len: gw, k: modulesFor(W), rot: Math.PI, x: 0, z: -gd / 2 },
    { len: gd, k: modulesFor(D), rot: -Math.PI / 2, x: -gw / 2, z: 0 }
  ];
  let u0 = 0;
  const parts = faces.map((f) => {
    const g = new THREE.PlaneGeometry(f.len, h);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i += 1) {
      uv.setXY(i, (u0 + uv.getX(i) * f.k) / TEX_COLS, (0.04 + uv.getY(i) * 0.92) / TEX_ROWS);
    }
    g.rotateY(f.rot);
    g.translate(f.x, y0 + h / 2, f.z);
    u0 += f.k;
    return g;
  });
  return merge(parts);
}

/** Vertical bronze fins on the panel joints plus corner posts. */
function finParts(W, D, h, y0) {
  const parts = [];
  const t = 0.09;
  const fd = 0.42;
  const gw = W - 2 * GLASS_INSET;
  const gd = D - 2 * GLASS_INSET;
  const kf = modulesFor(W);
  const ks = modulesFor(D);
  const y = y0 + h / 2;
  for (let j = 1; j < kf; j += 1) {
    const x = -gw / 2 + (gw * j) / kf;
    parts.push(box(t, h, fd, x, y, gd / 2 + fd / 2));
    parts.push(box(t, h, fd, x, y, -gd / 2 - fd / 2));
  }
  for (let j = 1; j < ks; j += 1) {
    const z = -gd / 2 + (gd * j) / ks;
    parts.push(box(fd, h, t, gw / 2 + fd / 2, y, z));
    parts.push(box(fd, h, t, -gw / 2 - fd / 2, y, z));
  }
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) parts.push(box(0.38, h, 0.38, sx * (gw / 2 + 0.08), y, sz * (gd / 2 + 0.08)));
  }
  return parts;
}

/** Cantilevered balconies on the long faces; two variants alternate floor by floor for a staggered rhythm. */
function balconyParts(W, D, variant) {
  const slabs = [];
  const rails = [];
  const caps = [];
  const bays = Math.max(2, Math.round(W / 9));
  const bayW = W / bays;
  const bw = bayW * 0.56;
  const rh = 1.05;
  for (const side of [1, -1]) {
    for (let i = 0; i < bays; i += 1) {
      const shift = (variant === 0 ? -1 : 1) * side * bayW * 0.17;
      const cx = -W / 2 + bayW * (i + 0.5) + shift;
      const cz = side * (D / 2 + SLAB_OVERHANG + BALCONY_DEPTH / 2);
      const edgeZ = cz + side * (BALCONY_DEPTH / 2 - 0.03);
      slabs.push(box(bw, SLAB_T * 0.85, BALCONY_DEPTH, cx, (SLAB_T * 0.85) / 2, cz));
      const ry = SLAB_T + rh / 2;
      rails.push(box(bw - 0.06, rh, 0.025, cx, ry, edgeZ));
      rails.push(box(0.025, rh, BALCONY_DEPTH, cx - bw / 2 + 0.03, ry, cz));
      rails.push(box(0.025, rh, BALCONY_DEPTH, cx + bw / 2 - 0.03, ry, cz));
      caps.push(box(bw, 0.05, 0.07, cx, SLAB_T + rh + 0.025, edgeZ));
    }
  }
  return { slabs, rails, caps };
}

export function buildFloorGeometries(dims) {
  const { width: W, depth: D } = dims;
  const gh = FLOOR_H - SLAB_T;
  const variants = [0, 1].map((v) => balconyParts(W, D, v));
  const slab = () => box(W + SLAB_OVERHANG * 2, SLAB_T, D + SLAB_OVERHANG * 2, 0, SLAB_T / 2, 0);
  return {
    concrete: variants.map((b) => merge([slab(), ...b.slabs])),
    metal: variants.map((b) => merge([...finParts(W, D, gh, SLAB_T), ...b.caps])),
    rail: variants.map((b) => merge(b.rails)),
    glass: glassEnvelope(W, D, gh, SLAB_T),
    slab: slab(),
    // Picking volume: covers slab edges and balconies so hover never flickers between floors.
    hit: box(W + 0.9, FLOOR_H, D + 2 * (SLAB_OVERHANG + BALCONY_DEPTH) + 0.2, 0, FLOOR_H / 2, 0),
    ghostBox: box(W + 0.6, FLOOR_H - 0.08, D + 0.6, 0, FLOOR_H / 2, 0),
    hoverBox: box(W + 1.0, FLOOR_H + 0.02, D + 1.0, 0, FLOOR_H / 2, 0),
    outline: edges(W + 0.7, FLOOR_H - 0.06, D + 0.7, FLOOR_H / 2)
  };
}

/* --------------------------------------------------------------------- crown */

export function buildCrownGeometries(dims) {
  const { width: W, depth: D } = dims;
  const roofT = 0.45;
  const finH = CROWN_H - roofT;
  const fins = [];
  const kf = Math.max(8, Math.round(W / 0.9));
  const ks = Math.max(5, Math.round(D / 0.9));
  for (let j = 0; j <= kf; j += 1) {
    const x = -W / 2 + (W * j) / kf;
    fins.push(box(0.12, finH, 0.5, x, roofT + finH / 2, D / 2));
    fins.push(box(0.12, finH, 0.5, x, roofT + finH / 2, -D / 2));
  }
  for (let j = 1; j < ks; j += 1) {
    const z = -D / 2 + (D * j) / ks;
    fins.push(box(0.5, finH, 0.12, W / 2, roofT + finH / 2, z));
    fins.push(box(0.5, finH, 0.12, -W / 2, roofT + finH / 2, z));
  }
  const capY = CROWN_H - 0.16;
  fins.push(box(W + 0.62, 0.32, 0.62, 0, capY, D / 2));
  fins.push(box(W + 0.62, 0.32, 0.62, 0, capY, -D / 2));
  fins.push(box(0.62, 0.32, D, W / 2, capY, 0));
  fins.push(box(0.62, 0.32, D, -W / 2, capY, 0));

  return {
    concrete: merge([
      box(W + SLAB_OVERHANG * 2, roofT, D + SLAB_OVERHANG * 2, 0, roofT / 2, 0),
      box(W * 0.46, 2.6, D * 0.5, 0, roofT + 1.3, 0)
    ]),
    metal: merge(fins),
    band: box(W - 0.5, 0.12, D - 0.5, 0, roofT + 0.08, 0),
    ghost: box(W + 0.6, CROWN_H, D + 0.6, 0, CROWN_H / 2, 0),
    outline: edges(W + 0.7, CROWN_H, D + 0.7, CROWN_H / 2)
  };
}
