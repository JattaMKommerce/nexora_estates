import * as THREE from 'three';
import { box, merge } from '../plan/geometry.js';

/**
 * Soft furnishings and ceiling details that dress an apartment, built from its plan:
 *   curtains  for every living room and bedroom on the glazed facade: a heavy drape and a sheer
 *             gathered at each end of the room's glass (the view stays open), on a ceiling track
 *   cove      a dropped ceiling band with a concealed warm light line around the living room
 * Like all furniture here, they are a styling suggestion, not part of the residence.
 */

const CURTAIN_ROOMS = new Set(['living', 'studio', 'bedroom', 'master']);

/** A pleated panel: `width` wide along +x, hanging from y1 down to y0, pleats pushed along ±z. */
function pleated(width, y0, y1, period, depth) {
  const segs = Math.max(4, Math.round(width / 0.025));
  const g = new THREE.PlaneGeometry(width, y1 - y0, segs, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i += 1) {
    const x = p.getX(i) + width / 2;
    p.setZ(i, Math.sin((x / period) * Math.PI * 2) * depth);
  }
  g.translate(width / 2, (y0 + y1) / 2, 0);
  g.computeVertexNormals();
  return g;
}

/** Places a panel built along +x at distance `s` along a wall, `inset` metres inside the glass. */
function place(g, wall, s, inside, inset) {
  const horiz = Math.abs(wall.z1 - wall.z0) < 1e-3;
  if (horiz) {
    g.translate(wall.x0 + s, 0, wall.z0 + inside * inset);
  } else {
    g.rotateY(-Math.PI / 2);
    g.translate(wall.x0 + inside * inset, 0, wall.z0 + s);
  }
  return g;
}

export function buildCurtains(walls, pu, ceil) {
  const drapes = [];
  const sheers = [];
  const tracks = [];
  const cx = (pu.rect.x0 + pu.rect.x1) / 2;
  const cz = (pu.rect.z0 + pu.rect.z1) / 2;
  for (const wl of walls) {
    if (wl.kind !== 'glazing' || wl.unitKey !== pu.key) continue;
    const horiz = Math.abs(wl.z1 - wl.z0) < 1e-3;
    const inside = horiz ? Math.sign(cz - wl.z0) || 1 : Math.sign(cx - wl.x0) || 1;
    const a0 = horiz ? wl.x0 : wl.z0;
    const a1 = horiz ? wl.x1 : wl.z1;
    for (const r of pu.rooms) {
      if (!CURTAIN_ROOMS.has(r.type)) continue;
      const touches = horiz
        ? Math.abs(r.rect.z0 - wl.z0) < 0.3 || Math.abs(r.rect.z1 - wl.z0) < 0.3
        : Math.abs(r.rect.x0 - wl.x0) < 0.3 || Math.abs(r.rect.x1 - wl.x0) < 0.3;
      if (!touches) continue;
      const s0 = Math.max(horiz ? r.rect.x0 : r.rect.z0, a0) - a0 + 0.12;
      const s1 = Math.min(horiz ? r.rect.x1 : r.rect.z1, a1) - a0 - 0.12;
      const len = s1 - s0;
      if (len < 1.2) continue;
      const dw = Math.min(0.42, len * 0.14);
      const sw = Math.min(0.85, len * 0.2);
      const top = ceil - 0.07;
      // drapes gathered at both ends, sheers just inside them
      drapes.push(place(pleated(dw, 0.03, top, 0.13, 0.035), wl, s0, inside, 0.24));
      drapes.push(place(pleated(dw, 0.03, top, 0.13, 0.035), wl, s1 - dw, inside, 0.24));
      sheers.push(place(pleated(sw, 0.02, top, 0.09, 0.022), wl, s0 + dw * 0.6, inside, 0.16));
      sheers.push(place(pleated(sw, 0.02, top, 0.09, 0.022), wl, s1 - dw * 0.6 - sw, inside, 0.16));
      const mid = (s0 + s1) / 2;
      const t = horiz
        ? box(len + 0.1, 0.03, 0.05, wl.x0 + mid, ceil - 0.045, wl.z0 + inside * 0.2)
        : box(0.05, 0.03, len + 0.1, wl.x0 + inside * 0.2, ceil - 0.045, wl.z0 + mid);
      tracks.push(t);
    }
  }
  return { drapes: merge(drapes), sheers: merge(sheers), tracks: merge(tracks) };
}

/** A dropped ceiling band with a concealed light line around the living room (rooms ≥ 12 m²). */
export function buildCove(pu, ceil) {
  const band = [];
  const glow = [];
  for (const r of pu.rooms) {
    if (r.type !== 'living' && r.type !== 'studio') continue;
    const { x0, z0, x1, z1 } = r.rect;
    const w = x1 - x0;
    const d = z1 - z0;
    if (w * d < 12) continue;
    const bw = 0.55;
    const th = 0.14;
    const y = ceil - th / 2;
    band.push(box(w, th, bw, (x0 + x1) / 2, y, z0 + bw / 2));
    band.push(box(w, th, bw, (x0 + x1) / 2, y, z1 - bw / 2));
    band.push(box(bw, th, d - bw * 2, x0 + bw / 2, y, (z0 + z1) / 2));
    band.push(box(bw, th, d - bw * 2, x1 - bw / 2, y, (z0 + z1) / 2));
    const gy = ceil - th + 0.02;
    glow.push(box(w - bw * 2, 0.025, 0.03, (x0 + x1) / 2, gy, z0 + bw - 0.02));
    glow.push(box(w - bw * 2, 0.025, 0.03, (x0 + x1) / 2, gy, z1 - bw + 0.02));
    glow.push(box(0.03, 0.025, d - bw * 2, x0 + bw - 0.02, gy, (z0 + z1) / 2));
    glow.push(box(0.03, 0.025, d - bw * 2, x1 - bw + 0.02, gy, (z0 + z1) / 2));
  }
  return { band: merge(band), glow: merge(glow) };
}
