import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/**
 * Turns an (illustrative or supplied) plan into merged three.js geometry: one buffer per material,
 * so a whole floor is a handful of draw calls. All UVs are in world metres divided by `tile`, so
 * textures keep a real-world scale whatever the room size.
 */

const EPS = 1e-3;

export function box(w, h, d, x, y, z, tile = 0, rotY = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (tile) {
    const uv = g.attributes.uv;
    const faces = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f += 1) {
      for (let k = 0; k < 4; k += 1) {
        const i = f * 4 + k;
        uv.setXY(i, (uv.getX(i) * faces[f][0]) / tile, (uv.getY(i) * faces[f][1]) / tile);
      }
    }
  }
  if (rotY) g.rotateY(rotY);
  g.translate(x, y, z);
  return g;
}

/** Horizontal rectangle with world-space UVs. */
export function rectFloor(r, y, tile = 1) {
  const w = r.x1 - r.x0;
  const d = r.z1 - r.z0;
  if (w < EPS || d < EPS) return null;
  const g = new THREE.PlaneGeometry(w, d);
  g.rotateX(-Math.PI / 2);
  g.translate((r.x0 + r.x1) / 2, y, (r.z0 + r.z1) / 2);
  const p = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i += 1) uv.setXY(i, p.getX(i) / tile, -p.getZ(i) / tile);
  return g;
}

export function merge(parts) {
  const list = parts.filter(Boolean);
  if (!list.length) return null;
  const indexed = list.every((g) => g.index);
  const norm = indexed ? list : list.map((g) => (g.index ? g.toNonIndexed() : g));
  const out = mergeGeometries(norm, false);
  list.forEach((g) => g.dispose());
  if (!indexed) norm.forEach((g) => g.dispose());
  out.computeBoundingSphere();
  out.computeBoundingBox();
  return out;
}

export function disposeAll(value) {
  if (!value) return;
  if (value.isBufferGeometry) value.dispose();
  else if (Array.isArray(value)) value.forEach(disposeAll);
  else if (typeof value === 'object') Object.values(value).forEach(disposeAll);
}

/* ---------------------------------------------------------------------- walls */

/**
 * @param walls  plan walls (axis-aligned centrelines with openings)
 * @param opts   height: wall height; cut: true for the cut-away floor view (no door/window
 *               heads, dark section caps on top); tile: plaster texture scale
 */
export function buildWalls(walls, { height, cut = false, tile = 1.6, doorHead = 2.1, sill = 0.9, head = 2.35 }) {
  const solid = [];
  const core = [];
  const glass = [];
  const frame = [];
  const doorFrame = [];
  const cap = [];
  const leaves = [];
  const liftDoors = [];

  for (const wl of walls) {
    const horiz = Math.abs(wl.z1 - wl.z0) < EPS;
    const len = horiz ? wl.x1 - wl.x0 : wl.z1 - wl.z0;
    if (len < 0.02) continue;
    const t = wl.t;
    const bucket = wl.kind === 'core' ? core : solid;
    const at = (s) => (horiz ? [wl.x0 + s, wl.z0] : [wl.x0, wl.z0 + s]);

    const piece = (s0, s1, y0, y1, list = bucket, thick = t, withCap = true) => {
      const L = s1 - s0;
      const H = y1 - y0;
      if (L < 0.01 || H < 0.01) return;
      const [cx, cz] = at((s0 + s1) / 2);
      const y = (y0 + y1) / 2;
      list.push(horiz ? box(L, H, thick, cx, y, cz, tile) : box(thick, H, L, cx, y, cz, tile));
      if (cut && withCap && y1 >= height - EPS) {
        cap.push(horiz ? box(L, 0.012, thick + 0.004, cx, y1 + 0.006, cz) : box(thick + 0.004, 0.012, L, cx, y1 + 0.006, cz));
      }
    };
    const pane = (s0, s1, y0, y1) => {
      const L = s1 - s0;
      const H = y1 - y0;
      if (L < 0.02 || H < 0.02) return;
      const [cx, cz] = at((s0 + s1) / 2);
      glass.push(horiz ? box(L, H, 0.016, cx, (y0 + y1) / 2, cz) : box(0.016, H, L, cx, (y0 + y1) / 2, cz));
    };
    const post = (s, y0, y1, w = 0.05, depth = Math.min(0.09, t), list = frame) => {
      const [cx, cz] = at(s);
      list.push(horiz ? box(w, y1 - y0, depth, cx, (y0 + y1) / 2, cz) : box(depth, y1 - y0, w, cx, (y0 + y1) / 2, cz));
    };
    const rail = (s0, s1, y, h = 0.05, depth = Math.min(0.09, t)) => {
      const [cx, cz] = at((s0 + s1) / 2);
      const L = s1 - s0;
      if (L < 0.02) return;
      frame.push(horiz ? box(L, h, depth, cx, y, cz) : box(depth, h, L, cx, y, cz));
    };

    if (wl.kind === 'glazing') {
      // floor-to-ceiling curtain wall: glass, mullions on a ~1.4 m module, sill and head frames
      const top = height;
      pane(0, len, 0.06, top - (cut ? 0 : 0.04));
      rail(0, len, 0.03, 0.06, 0.12);
      if (!cut) rail(0, len, top - 0.02, 0.04, 0.12);
      const k = Math.max(1, Math.round(len / 1.4));
      for (let i = 0; i <= k; i += 1) post((len * i) / k, 0.06, top, i === 0 || i === k ? 0.08 : 0.05, 0.1);
      if (!cut) rail(0, len, Math.min(top - 0.3, 2.45), 0.04, 0.08);
      continue;
    }

    const ops = [...wl.openings].sort((a, b) => a.s0 - b.s0);
    let cursor = 0;
    for (const o of ops) {
      piece(cursor, o.s0, 0, height);
      const s0 = o.s0;
      const s1 = o.s1;
      const w = s1 - s0;
      switch (o.type) {
        case 'door':
        case 'entry': {
          if (!cut) piece(s0, s1, doorHead, height);
          // jambs sit just inside the opening so they never share a face with the wall
          post(s0 + 0.024, 0, doorHead, 0.04, t + 0.02, doorFrame);
          post(s1 - 0.024, 0, doorHead, 0.04, t + 0.02, doorFrame);
          if (!cut) {
            const [cx, cz] = at((s0 + s1) / 2);
            doorFrame.push(horiz ? box(w - 0.01, 0.04, t + 0.02, cx, doorHead - 0.022, cz) : box(t + 0.02, 0.04, w - 0.01, cx, doorHead - 0.022, cz));
          }
          const hingeAtStart = (o.hinge ?? -1) < 0;
          const [hx, hz] = at(hingeAtStart ? s0 + 0.04 : s1 - 0.04);
          const along = horiz ? [1, 0] : [0, 1];
          const closed = hingeAtStart ? along : [-along[0], -along[1]];
          const side = o.side ?? 1;
          const normal = horiz ? [0, side] : [side, 0];
          const a = THREE.MathUtils.degToRad(o.type === 'entry' ? 78 : 86);
          const dir = [closed[0] * Math.cos(a) + normal[0] * Math.sin(a), closed[1] * Math.cos(a) + normal[1] * Math.sin(a)];
          leaves.push({ x: hx, z: hz, rot: Math.atan2(-dir[1], dir[0]), w: w - 0.1, h: doorHead - 0.04, entry: o.type === 'entry' });
          break;
        }
        case 'lift': {
          if (!cut) piece(s0, s1, doorHead, height);
          const [cx, cz] = at((s0 + s1) / 2);
          liftDoors.push(horiz ? box(w, doorHead, 0.06, cx, doorHead / 2, cz) : box(0.06, doorHead, w, cx, doorHead / 2, cz));
          break;
        }
        case 'opening':
          if (!cut) piece(s0, s1, 2.4, height);
          break;
        case 'slider':
          pane(s0, s1, 0.04, doorHead);
          post(s0, 0, doorHead);
          post(s1, 0, doorHead);
          post((s0 + s1) / 2, 0, doorHead, 0.04);
          if (!cut) piece(s0, s1, doorHead, height);
          break;
        case 'window':
        default: {
          const lo = o.high ? 1.45 : sill;
          const hi = Math.min(head, height);
          piece(s0, s1, 0, lo);
          pane(s0, s1, lo, hi);
          post(s0 + 0.025, lo, hi);
          post(s1 - 0.025, lo, hi);
          rail(s0, s1, lo + 0.02, 0.04);
          if (!cut || hi < height - EPS) {
            if (!cut) rail(s0, s1, hi - 0.02, 0.04);
            piece(s0, s1, hi, height);
          }
          break;
        }
      }
      cursor = s1;
    }
    piece(cursor, len, 0, height);
  }

  const leafGeo = leaves.map((l) => {
    const g = box(l.w, l.h, 0.045, l.w / 2, l.h / 2, 0);
    g.rotateY(l.rot);
    g.translate(l.x, 0, l.z);
    return g;
  });

  return {
    solid: merge(solid),
    core: merge(core),
    glass: merge(glass),
    frame: merge(frame),
    doorFrame: merge(doorFrame),
    cap: merge(cap),
    doors: merge(leafGeo),
    liftDoors: merge(liftDoors)
  };
}

/* ---------------------------------------------------------------------- floors */

const FLOOR_OF = { living: 'wood', bedroom: 'wood', master: 'wood', passage: 'wood', studio: 'wood', kitchen: 'tile', bath: 'tile', utility: 'tile', balcony: 'deck' };

export function buildFloors(rooms, { y = 0, tiles = { wood: 1.6, tile: 1.2, deck: 1.4, stone: 2.4, concrete: 3 }, extra = [] } = {}) {
  const groups = { wood: [], tile: [], deck: [], stone: [], concrete: [] };
  for (const r of rooms) {
    const key = FLOOR_OF[r.type] || 'wood';
    groups[key].push(rectFloor(r.rect, y, tiles[key]));
  }
  for (const e of extra) groups[e.mat].push(rectFloor(e.rect, y + (e.dy || 0), tiles[e.mat]));
  const out = {};
  for (const [k, list] of Object.entries(groups)) out[k] = merge(list);
  return out;
}

/** Balcony slab edge + glass balustrade. */
export function buildBalconies(rooms, { y = 0 } = {}) {
  const slab = [];
  const glass = [];
  const rail = [];
  for (const r of rooms) {
    if (r.type !== 'balcony') continue;
    const { x0, z0, x1, z1 } = r.rect;
    const w = x1 - x0;
    const d = z1 - z0;
    slab.push(box(w + 0.1, 0.2, d + 0.05, (x0 + x1) / 2, y - 0.1, (z0 + z1) / 2, 1.4));
    // the edge away from the building is the one farther from the plate centre line
    const outerZ = Math.abs(z0) > Math.abs(z1) ? z0 : z1;
    const h = 1.05;
    glass.push(box(w - 0.04, h - 0.06, 0.014, (x0 + x1) / 2, y + h / 2, outerZ));
    glass.push(box(0.014, h - 0.06, d, x0 + 0.02, y + h / 2, (z0 + z1) / 2));
    glass.push(box(0.014, h - 0.06, d, x1 - 0.02, y + h / 2, (z0 + z1) / 2));
    rail.push(box(w, 0.04, 0.06, (x0 + x1) / 2, y + h, outerZ));
    rail.push(box(0.06, 0.04, d, x0 + 0.02, y + h, (z0 + z1) / 2));
    rail.push(box(0.06, 0.04, d, x1 - 0.02, y + h, (z0 + z1) / 2));
  }
  return { slab: merge(slab), glass: merge(glass), rail: merge(rail) };
}

/** Stair flights drawn as steps, for the core. */
export function buildStair(stair, { height = 2.2 } = {}) {
  const parts = [];
  const w = stair.x1 - stair.x0;
  const d = stair.z1 - stair.z0;
  const flightW = (w - 0.2) / 2;
  const n = 9;
  const run = Math.min(0.28, (d - 1.4) / n);
  for (let f = 0; f < 2; f += 1) {
    const x = stair.x0 + 0.1 + flightW / 2 + f * (flightW + 0.0);
    for (let i = 0; i < n; i += 1) {
      const h = f === 0 ? ((i + 1) * height) / (2 * n) : height / 2 + ((n - i) * height) / (2 * n);
      const z = stair.z0 + 0.6 + i * run + run / 2;
      parts.push(box(flightW - 0.04, Math.max(0.05, Math.min(h, height)), run, x, Math.min(h, height) / 2, z));
    }
  }
  parts.push(box(w - 0.2, height / 2, 1.0, (stair.x0 + stair.x1) / 2, height / 4, stair.z1 - 0.55));
  return merge(parts);
}

/* ------------------------------------------------------------ furniture (low) */

/** Massing-level furniture for the floor view: a few boxes per item, merged per material. */
export function buildFurnitureLow(items, { maxH = 2.15 } = {}) {
  const out = { fabric: [], fabric2: [], leather: [], wood: [], dark: [], white: [], stone: [], green: [], bedding: [], steel: [], rug: [], pot: [] };
  for (const it of items) {
    const parts = lowParts(it);
    for (const [mat, w, h, d, x, y, z] of parts) {
      const hh = Math.min(h, maxH - y + h / 2);
      if (hh <= 0.005) continue;
      const g = box(w, hh, d, x, y - (h - hh) / 2, z);
      g.rotateY(it.rot);
      g.translate(it.x, it.y, it.z);
      out[mat].push(g);
    }
    if (it.kind === 'plant') {
      const g = new THREE.IcosahedronGeometry(Math.min(it.w, it.d) * 0.55, 1);
      g.scale(1, (it.h * 0.75) / (Math.min(it.w, it.d) * 0.55) / 2, 1);
      g.translate(it.x, it.y + it.h * 0.62, it.z);
      out.green.push(g);
    }
  }
  const merged = {};
  for (const [k, list] of Object.entries(out)) merged[k] = merge(list);
  return merged;
}

/** [material, w, h, d, x, y, z] in item space (front faces +z, centre of footprint at 0). */
function lowParts({ kind, w, d, h }) {
  const hw = w / 2;
  const hd = d / 2;
  switch (kind) {
    case 'sofa':
      return [
        ['fabric', w, 0.42, d, 0, 0.21, 0],
        ['fabric', w - 0.3, 0.42, 0.22, 0, 0.62, -hd + 0.11],
        ['fabric', 0.18, 0.2, d, -hw + 0.09, 0.52, 0],
        ['fabric', 0.18, 0.2, d, hw - 0.09, 0.52, 0],
        ['fabric2', w - 0.4, 0.1, d - 0.32, 0, 0.47, 0.05]
      ];
    case 'armchair':
    case 'lounge':
      return [
        ['leather', w, 0.4, d, 0, 0.2, 0],
        ['leather', w, 0.45, 0.16, 0, 0.6, -hd + 0.08]
      ];
    case 'coffeeTable':
      return [['stone', w, 0.04, d, 0, h - 0.02, 0], ['dark', w * 0.4, h - 0.04, d * 0.4, 0, (h - 0.04) / 2, 0]];
    case 'sideTable':
    case 'nightstand':
      return [['wood', w, h, d, 0, h / 2, 0]];
    case 'tvUnit':
      return [['wood', w, h, d, 0, h / 2, 0]];
    case 'tv':
      return [['dark', w, h, d, 0, h / 2, 0]];
    case 'rug':
      return [['rug', w, 0.012, d, 0, 0.006, 0]];
    case 'diningTable':
      return [['wood', w, 0.05, d, 0, h - 0.025, 0], ['dark', 0.08, h - 0.05, d * 0.7, -hw + 0.25, (h - 0.05) / 2, 0], ['dark', 0.08, h - 0.05, d * 0.7, hw - 0.25, (h - 0.05) / 2, 0]];
    case 'diningChair':
      return [['fabric2', w, 0.06, d, 0, 0.46, 0], ['fabric2', w, 0.42, 0.05, 0, 0.7, -hd + 0.03], ['dark', w * 0.8, 0.43, d * 0.8, 0, 0.215, 0]];
    case 'bed':
      return [
        ['wood', w, 0.28, d, 0, 0.14, 0],
        ['white', w - 0.06, 0.22, d - 0.1, 0, 0.39, 0.02],
        ['bedding', w - 0.02, 0.06, d * 0.62, 0, 0.53, hd - d * 0.31],
        ['white', w * 0.4, 0.12, 0.38, -w * 0.22, 0.56, -hd + 0.3],
        ['white', w * 0.4, 0.12, 0.38, w * 0.22, 0.56, -hd + 0.3],
        ['fabric', w + 0.1, 1.05, 0.09, 0, 0.525, -hd - 0.02]
      ];
    case 'wardrobe':
      return [['wood', w, h, d, 0, h / 2, 0]];
    case 'counter':
      return [['white', w, 0.86, d, 0, 0.43, 0], ['stone', w, 0.04, d + 0.02, 0, 0.88, 0.01]];
    case 'fridge':
      return [['steel', w, h, d, 0, h / 2, 0]];
    case 'wc':
      return [['white', w, 0.4, d * 0.8, 0, 0.2, 0.05], ['white', w, 0.35, 0.16, 0, 0.57, -hd + 0.08]];
    case 'vanity':
      return [['wood', w, 0.5, d, 0, 0.6, 0], ['white', w * 0.7, 0.06, d * 0.7, 0, 0.88, 0.02]];
    case 'shower':
      return [['white', w, 0.05, d, 0, 0.025, 0]];
    case 'washer':
      return [['white', w, h, d, 0, h / 2, 0]];
    case 'shelves':
      return [['wood', w, h, d, 0, h / 2, 0]];
    case 'balconySet':
      return [['wood', 0.7, 0.04, 0.7, 0, 0.72, 0], ['dark', 0.05, 0.7, 0.05, 0, 0.35, 0], ['wood', 0.45, 0.45, 0.45, -0.62, 0.225, 0], ['wood', 0.45, 0.45, 0.45, 0.62, 0.225, 0]];
    case 'plant':
      return [['pot', w * 0.6, h * 0.35, d * 0.6, 0, h * 0.175, 0]];
    default:
      return [];
  }
}
