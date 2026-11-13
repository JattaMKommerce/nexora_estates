import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { plateFor } from '../plan/layout.js';

/**
 * Procedural architecture for a contemporary residential tower.
 *
 * This is an illustrative design, NOT an architectural model of any real building: the plate is
 * sized to fit the illustrative floor plans (src/plan/layout.js), the floor count comes from the
 * data file, and the facade (floor-to-ceiling glazing, slim aluminium mullions with bronze fins on a
 * rhythm, pale clad slab edges, staggered glass balconies) is a generic design. Swap in GLB assets
 * per project when architects supply them (see README).
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
/** Clear room height above the slab; the glass above it is the spandrel. */
export const VISION_H = 2.72;
export const PANE_W = 1.55;

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
    plate,
    // footprint including slab edges and balconies, for site planning
    outerW: width + SLAB_OVERHANG * 2,
    outerD: depth + 2 * (SLAB_OVERHANG + BALCONY_DEPTH)
  };
}

export const levelBaseY = (dims, index) => dims.base + index * FLOOR_H;

/* ------------------------------------------------------------------ helpers */

export function box(w, h, d, x = 0, y = 0, z = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

export function merge(parts) {
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

const modulesFor = (len) => Math.max(4, Math.round(len / PANE_W));

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

/** The four faces of a rectangular glass line, each with its pane count. */
function faces(gw, gd) {
  return [
    { len: gw, k: modulesFor(gw), rot: 0, x: 0, z: gd / 2, nx: 0, nz: 1 },
    { len: gd, k: modulesFor(gd), rot: Math.PI / 2, x: gw / 2, z: 0, nx: 1, nz: 0 },
    { len: gw, k: modulesFor(gw), rot: Math.PI, x: 0, z: -gd / 2, nx: 0, nz: -1 },
    { len: gd, k: modulesFor(gd), rot: -Math.PI / 2, x: -gw / 2, z: 0, nx: -1, nz: 0 }
  ];
}

/* ------------------------------------------------------------- typical floor */

/**
 * Glazing as four planes. aPane.x counts panes along the facade (whole numbers at the mullions),
 * aPane.y runs 0 → 1 from the slab top to the next slab: the glazing shader builds rooms from it.
 */
export function glassEnvelope(gw, gd, h, y0) {
  let u0 = 0;
  const parts = faces(gw, gd).map((f) => {
    const g = new THREE.PlaneGeometry(f.len, h);
    const uv = g.attributes.uv;
    const pane = new Float32Array(uv.count * 2);
    for (let i = 0; i < uv.count; i += 1) {
      pane[i * 2] = u0 + uv.getX(i) * f.k;
      pane[i * 2 + 1] = uv.getY(i);
    }
    g.setAttribute('aPane', new THREE.BufferAttribute(pane, 2));
    g.rotateY(f.rot);
    g.translate(f.x, y0 + h / 2, f.z);
    u0 += f.k + 7; // offset so neighbouring faces don't share room patterns
    return g;
  });
  return merge(parts);
}

/** Tints a part for the shared metal material: bronze fins (1) or darker graphite mullions (< 1). */
function tinted(g, k) {
  const n = g.attributes.position.count;
  const c = new Float32Array(n * 3).fill(k);
  g.setAttribute('color', new THREE.BufferAttribute(c, 3));
  return g;
}

/** Slim graphite mullions at every pane joint, deeper bronze fins every second joint, corner posts and a transom. */
function frameParts(gw, gd, h, y0) {
  const parts = [];
  const y = y0 + h / 2;
  for (const f of faces(gw, gd)) {
    const tx = f.nz; // direction along the face (matches the glass's aPane.x)
    const tz = -f.nx;
    for (let j = 1; j < f.k; j += 1) {
      const s = -f.len / 2 + (f.len * j) / f.k;
      const deep = j % 2 === 0;
      const t = deep ? 0.07 : 0.05;
      const d = deep ? 0.36 : 0.1;
      const px = f.x + tx * s + f.nx * (d / 2);
      const pz = f.z + tz * s + f.nz * (d / 2);
      const g = f.nz !== 0 ? box(t, h, d, px, y, pz) : box(d, h, t, px, y, pz);
      parts.push(tinted(g, deep ? 1 : 0.42));
    }
  }
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) parts.push(tinted(box(0.26, h, 0.26, sx * (gw / 2 + 0.06), y, sz * (gd / 2 + 0.06)), 1));
  }
  // transom at the head of the vision glass
  const ty = y0 + VISION_H;
  parts.push(tinted(box(gw + 0.1, 0.06, 0.09, 0, ty, gd / 2 + 0.04), 0.42));
  parts.push(tinted(box(gw + 0.1, 0.06, 0.09, 0, ty, -gd / 2 - 0.04), 0.42));
  parts.push(tinted(box(0.09, 0.06, gd + 0.1, gw / 2 + 0.04, ty, 0), 0.42));
  parts.push(tinted(box(0.09, 0.06, gd + 0.1, -gw / 2 - 0.04, ty, 0), 0.42));
  return parts;
}

/** Cantilevered balconies on the long faces; two variants alternate floor by floor for a staggered rhythm. */
function balconyParts(W, D, variant) {
  const slabs = [];
  const glass = [];
  const rails = [];
  const bays = Math.max(2, Math.round(W / 9));
  const bayW = W / bays;
  const bw = bayW * 0.58;
  const rh = 1.08;
  for (const side of [1, -1]) {
    for (let i = 0; i < bays; i += 1) {
      const shift = (variant === 0 ? -1 : 1) * side * bayW * 0.17;
      const cx = -W / 2 + bayW * (i + 0.5) + shift;
      const cz = side * (D / 2 + SLAB_OVERHANG + BALCONY_DEPTH / 2);
      const edgeZ = cz + side * (BALCONY_DEPTH / 2 - 0.06);
      const st = SLAB_T * 0.85;
      slabs.push(box(bw, st, BALCONY_DEPTH, cx, st / 2, cz));
      // a slim upstand along the slab edge, then frameless glass and a bronze handrail
      slabs.push(box(bw, 0.1, 0.12, cx, st + 0.05, edgeZ));
      const gy = st + 0.1 + (rh - 0.14) / 2;
      glass.push(box(bw - 0.12, rh - 0.14, 0.02, cx, gy, edgeZ));
      glass.push(box(0.02, rh - 0.14, BALCONY_DEPTH - 0.1, cx - bw / 2 + 0.05, gy, cz - side * 0.02));
      glass.push(box(0.02, rh - 0.14, BALCONY_DEPTH - 0.1, cx + bw / 2 - 0.05, gy, cz - side * 0.02));
      const ry = st + rh;
      rails.push(tinted(box(bw - 0.04, 0.045, 0.06, cx, ry, edgeZ), 1));
      rails.push(tinted(box(0.05, 0.045, BALCONY_DEPTH - 0.08, cx - bw / 2 + 0.05, ry, cz - side * 0.02), 1));
      rails.push(tinted(box(0.05, 0.045, BALCONY_DEPTH - 0.08, cx + bw / 2 - 0.05, ry, cz - side * 0.02), 1));
    }
  }
  return { slabs, glass, rails };
}

export function buildFloorGeometries(dims) {
  const { width: W, depth: D } = dims;
  const gw = W - 2 * GLASS_INSET;
  const gd = D - 2 * GLASS_INSET;
  const gh = FLOOR_H - SLAB_T;
  const variants = [0, 1].map((v) => balconyParts(W, D, v));
  const slab = () => box(W + SLAB_OVERHANG * 2, SLAB_T, D + SLAB_OVERHANG * 2, 0, SLAB_T / 2, 0);
  return {
    concrete: variants.map((b) => merge([slab(), ...b.slabs])),
    metal: variants.map((b) => merge([...frameParts(gw, gd, gh, SLAB_T), ...b.rails])),
    rail: variants.map((b) => merge(b.glass)),
    glass: glassEnvelope(gw, gd, gh, SLAB_T),
    slab: slab(),
    // Picking volume: covers slab edges and balconies so hover never flickers between floors.
    hit: box(W + 0.9, FLOOR_H, D + 2 * (SLAB_OVERHANG + BALCONY_DEPTH) + 0.2, 0, FLOOR_H / 2, 0),
    ghostBox: box(W + 0.6, FLOOR_H - 0.08, D + 0.6, 0, FLOOR_H / 2, 0),
    hoverBox: box(W + 1.0, FLOOR_H + 0.02, D + 1.0, 0, FLOOR_H / 2, 0),
    outline: edges(W + 0.7, FLOOR_H - 0.06, D + 0.7, FLOOR_H / 2)
  };
}

/* --------------------------------------------------------------------- crown */

/**
 * Roof: slab, a parapet, a plant room and a screen of slender bronze fins around the top storey,
 * with a slim warm light line under the screen's cap.
 */
export function buildCrownGeometries(dims) {
  const { width: W, depth: D } = dims;
  const roofT = 0.45;
  const finH = CROWN_H - roofT;
  const fins = [];
  const kf = Math.max(10, Math.round(W / 1.1));
  const ks = Math.max(6, Math.round(D / 1.1));
  for (let j = 0; j <= kf; j += 1) {
    const x = -W / 2 + (W * j) / kf;
    fins.push(box(0.07, finH, 0.36, x, roofT + finH / 2, D / 2));
    fins.push(box(0.07, finH, 0.36, x, roofT + finH / 2, -D / 2));
  }
  for (let j = 1; j < ks; j += 1) {
    const z = -D / 2 + (D * j) / ks;
    fins.push(box(0.36, finH, 0.07, W / 2, roofT + finH / 2, z));
    fins.push(box(0.36, finH, 0.07, -W / 2, roofT + finH / 2, z));
  }
  const capY = CROWN_H - 0.14;
  fins.push(box(W + 0.62, 0.28, 0.62, 0, capY, D / 2));
  fins.push(box(W + 0.62, 0.28, 0.62, 0, capY, -D / 2));
  fins.push(box(0.62, 0.28, D, W / 2, capY, 0));
  fins.push(box(0.62, 0.28, D, -W / 2, capY, 0));

  return {
    concrete: merge([
      box(W + SLAB_OVERHANG * 2, roofT, D + SLAB_OVERHANG * 2, 0, roofT / 2, 0),
      box(W * 0.46, 3.1, D * 0.5, 0, roofT + 1.55, 0),
      box(W * 0.2, 1.2, D * 0.22, W * 0.22, roofT + 0.6, -D * 0.12)
    ]),
    metal: merge(fins.map((g) => tinted(g, 1))),
    band: merge([
      box(W - 0.2, 0.05, 0.05, 0, capY - 0.2, D / 2 - 0.18),
      box(W - 0.2, 0.05, 0.05, 0, capY - 0.2, -D / 2 + 0.18),
      box(0.05, 0.05, D - 0.2, W / 2 - 0.18, capY - 0.2, 0),
      box(0.05, 0.05, D - 0.2, -W / 2 + 0.18, capY - 0.2, 0)
    ]),
    ghost: box(W + 0.6, CROWN_H, D + 0.6, 0, CROWN_H / 2, 0),
    outline: edges(W + 0.7, CROWN_H, D + 0.7, CROWN_H / 2)
  };
}

/* --------------------------------------------------------------------- lobby */

/**
 * Double-height entrance lobby (when the ground storey has no homes): set-back glazing with slim
 * mullions, corner piers, the transfer slab above, and a drop-off canopy on two slender columns.
 */
export function buildLobbyGeometries(dims) {
  const { width: W, depth: D } = dims;
  const inset = 1.6;
  const gw = W - inset * 2;
  const gd = D - inset * 2;
  const gh = LOBBY_H - 0.4;
  const frames = [];
  for (const f of faces(gw, gd)) {
    const k = Math.max(2, Math.round(f.k / 2));
    for (let j = 1; j < k; j += 1) {
      const s = -f.len / 2 + (f.len * j) / k;
      const px = f.x + f.nz * s + f.nx * 0.06;
      const pz = f.z - f.nx * s + f.nz * 0.06;
      frames.push(f.nz !== 0 ? box(0.07, gh, 0.12, px, gh / 2, pz) : box(0.12, gh, 0.07, px, gh / 2, pz));
    }
    // a transom at door height
    frames.push(f.nz !== 0 ? box(f.len, 0.08, 0.1, f.x, 3.0, f.z + f.nz * 0.05) : box(0.1, 0.08, f.len, f.x + f.nx * 0.05, 3.0, f.z));
  }
  const piers = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) piers.push(box(1, LOBBY_H, 1, sx * (W / 2 - 0.5), LOBBY_H / 2, sz * (D / 2 - 0.5)));
  const cw = Math.min(14, W * 0.42);
  const reach = 7.5;
  const canopy = [box(cw, 0.36, reach, 0, 4.6, D / 2 + reach / 2 - 0.4)];
  const columns = [-1, 1].map((s) => {
    const g = new THREE.CylinderGeometry(0.14, 0.14, 4.42, 12);
    g.translate(s * (cw / 2 - 0.6), 2.21, D / 2 + reach - 1.0);
    return g;
  });
  const lights = [];
  for (let i = 0; i < 4; i += 1) lights.push(box(cw - 1.2, 0.03, 0.12, 0, 4.41, D / 2 + 0.8 + i * 1.7));
  return {
    glass: glassEnvelope(gw, gd, gh, 0),
    frame: merge(frames),
    slab: merge([...piers, box(W + 0.6, 0.4, D + 0.6, 0, LOBBY_H - 0.2, 0), ...canopy]),
    columns: merge(columns),
    lights: merge(lights)
  };
}
