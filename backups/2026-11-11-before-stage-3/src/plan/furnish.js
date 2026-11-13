import { PLAN } from './layout.js';

/**
 * Suggested furniture for an apartment of the illustrative plan. Purely a styling suggestion:
 * the UI says furniture and finishes are not part of the residence.
 *
 * Each item: { id, kind, room, x, z, y, rot, w, d, h }. Items are built facing +z (their front)
 * with width along x; `rot` turns them about the vertical axis.
 */
export function furnishUnit(u) {
  const items = [];
  const { su, sv } = u.frame;
  const toPlate = u.toPlate;
  let n = 0;
  const put = (room, kind, cu, cv, fu, fv, w, d, h, extra = {}) => {
    const [x, z] = toPlate(cu, cv);
    const rot = Math.atan2(su * fu, sv * fv);
    items.push({ id: `${u.key}-f${(n += 1)}`, kind, room: room.id, x, z, y: extra.y ?? 0, rot, w, d, h, ...extra });
  };

  for (const r of u.rooms) {
    const { u0, v0, u1, v1 } = r.local;
    const W = u1 - u0;
    const D = v1 - v0;
    const cu = (u0 + u1) / 2;
    const cv = (v0 + v1) / 2;

    switch (r.type) {
      case 'living': {
        const df = PLAN.front + PLAN.passage;
        const vs = Math.min(v1 - 1.35, (df + 0.4 + v1 - 0.8) / 2);
        const sofaW = Math.min(2.5, v1 - df - 1.4);
        put(r, 'sofa', u0 + 0.5, vs, 1, 0, sofaW, 0.95, 0.82);
        put(r, 'rug', u0 + W * 0.46, vs, 1, 0, Math.min(2.6, sofaW + 0.4), Math.min(2.2, W - 1.6), 0.012);
        put(r, 'coffeeTable', u0 + 1.0 + Math.min(0.95, (W - 2.4) / 2), vs, 1, 0, 0.9, 0.9, 0.42);
        put(r, 'sideTable', u0 + 0.32, vs - sofaW / 2 - 0.32, 1, 0, 0.45, 0.45, 0.55);
        put(r, 'tvUnit', u1 - 0.24, vs, -1, 0, Math.min(1.9, sofaW), 0.42, 0.5);
        put(r, 'tv', u1 - 0.06, vs, -1, 0, 1.45, 0.05, 0.82, { y: 1.05 });
        put(r, 'art', u0 + 0.02, vs, 1, 0, 1.0, 0.04, 0.7, { y: 1.3 });
        put(r, 'armchair', u0 + W * 0.62, v1 - 0.85, -0.45, -0.89, 0.8, 0.8, 0.8);
        put(r, 'plant', u1 - 0.42, v1 - 0.42, 0, -1, 0.55, 0.55, 1.3, { variant: 2 });
        // dining
        const dv = Math.max(1.6, PLAN.front * 0.62);
        const du = u0 + W * 0.54;
        put(r, 'diningTable', du, dv, 1, 0, 1.6, 0.9, 0.75);
        for (const s of [-1, 1]) {
          for (const k of [-0.4, 0.4]) put(r, 'diningChair', du + s * 0.72, dv + k, -s, 0, 0.46, 0.5, 0.82);
        }
        put(r, 'pendant', du, dv, 1, 0, 0.4, 0.4, 0.5, { y: 2.2 });
        put(r, 'plant', u0 + 0.4, PLAN.front + 0.5, 1, 0, 0.45, 0.45, 0.9, { variant: 1 });
        break;
      }
      case 'bedroom':
      case 'master': {
        const master = r.type === 'master';
        const bw = master ? 1.85 : 1.6;
        const bl = 2.08;
        const bv = Math.min(v1 - bw / 2 - 0.55, cv + 0.2);
        put(r, 'rug', u1 - 1.35, bv, -1, 0, bw + 0.9, 2.4, 0.012);
        put(r, 'bed', u1 - bl / 2 - 0.03, bv, -1, 0, bw, bl, 1.05, { variant: master ? 1 : 0 });
        for (const s of [-1, 1]) {
          put(r, 'nightstand', u1 - 0.24, bv + s * (bw / 2 + 0.3), -1, 0, 0.45, 0.42, 0.5);
          put(r, 'lamp', u1 - 0.24, bv + s * (bw / 2 + 0.3), -1, 0, 0.26, 0.26, 0.45, { y: 0.5 });
        }
        const wa = u0 + 1.4;
        const wb = u1 - 0.08;
        if (wb - wa > 0.9) put(r, 'wardrobe', (wa + wb) / 2, v0 + 0.32, 0, 1, wb - wa, 0.6, 2.25);
        if (master) put(r, 'lounge', u0 + 0.7, v1 - 0.75, 0.55, -0.83, 0.8, 0.85, 0.85);
        else put(r, 'plant', u0 + 0.38, v1 - 0.38, 0, -1, 0.35, 0.35, 0.45, { variant: 4 });
        break;
      }
      case 'kitchen': {
        const run = W - 0.05;
        put(r, 'counter', u0 + run / 2 + 0.05, v0 + 0.31, 0, 1, run, 0.62, 0.9, { sink: true });
        put(r, 'upper', u0 + run / 2 + 0.05, v0 + 0.18, 0, 1, run - 0.2, 0.35, 0.72, { y: 1.5 });
        const r2a = v0 + 0.62;
        const r2b = v1 - 0.78;
        if (r2b - r2a > 0.6) put(r, 'counter', u1 - 0.31, (r2a + r2b) / 2, -1, 0, r2b - r2a, 0.62, 0.9, { hob: true });
        put(r, 'fridge', u1 - 0.34, v1 - 0.38, -1, 0, 0.72, 0.66, 2.05);
        break;
      }
      case 'bath': {
        const small = W < 1.9;
        put(r, 'wc', u0 + 0.36, v0 + 0.42, 1, 0, 0.4, 0.62, 0.42);
        put(r, 'vanity', u0 + 0.26, Math.min(v1 - 0.9, v0 + 1.75), 1, 0, small ? 0.7 : 0.95, 0.5, 0.86);
        put(r, 'mirror', u0 + 0.02, Math.min(v1 - 0.9, v0 + 1.75), 1, 0, small ? 0.6 : 0.8, 0.03, 0.9, { y: 1.15 });
        if (W > 1.5) put(r, 'shower', u1 - 0.47, v0 + 0.47, 0, 1, 0.9, 0.9, 2.0);
        break;
      }
      case 'utility':
        put(r, 'washer', u0 + 0.36, v0 + 0.36, 0, 1, 0.6, 0.6, 0.85);
        put(r, 'shelves', u1 - 0.22, cv, -1, 0, Math.min(1.6, D - 0.6), 0.4, 1.9);
        break;
      case 'studio': {
        put(r, 'bed', u1 - 1.07, v1 - 1.2, -1, 0, 1.6, 2.05, 1.0);
        put(r, 'sofa', u0 + 0.5, cv, 1, 0, Math.min(2.2, D - 1.2), 0.92, 0.8);
        put(r, 'coffeeTable', u0 + 1.55, cv, 1, 0, 0.8, 0.8, 0.42);
        put(r, 'plant', u0 + 0.4, v1 - 0.4, 0, -1, 0.5, 0.5, 1.2, { variant: 2 });
        break;
      }
      case 'balcony':
        put(r, 'balconySet', cu, cv + 0.05, 0, -1, Math.min(1.6, W - 0.6), 1.1, 0.9);
        put(r, 'plant', u1 - 0.35, v1 - 0.4, 0, -1, 0.5, 0.5, 1.1, { variant: 2 });
        break;
      default:
        break;
    }
  }
  return items;
}
