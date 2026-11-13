import { mulberry32 } from '../../lib/random.js';

/**
 * Site plan and surrounding city. Everything here is ILLUSTRATIVE and deterministic: the city is a
 * generic grid of streets, blocks, parks and buildings, sized in real metres, and it is not a model
 * of any real place. The development's towers are laid out in one site block; their positions are
 * a plausible arrangement, not the developer's site plan.
 */

export const ROAD = 20; // kerb to kerb
export const SIDEWALK = 4.2;
export const KERB_H = 0.16;
export const BLOCK = 88;
export const PITCH = BLOCK + ROAD;

/**
 * Towers in a row along x (facing +z, the street front), staggered when there are several, inside a
 * site block sized to fit them with gardens, a drop-off and a boundary.
 * @param list [{ id, dims }]
 */
export function layoutDevelopment(list) {
  const n = list.length;
  const gap = 26;
  const widths = list.map((t) => t.dims.outerW);
  const total = widths.reduce((a, b) => a + b, 0) + gap * Math.max(0, n - 1);
  const maxD = Math.max(...list.map((t) => t.dims.outerD), 20);
  let x = -total / 2;
  const towers = list.map((t, i) => {
    const w = widths[i];
    const cx = x + w / 2;
    x += w + gap;
    const stagger = n === 1 ? 0 : n === 2 ? (i === 0 ? 4 : -4) : i % 2 ? -8 : 4;
    return { id: t.id, dims: t.dims, x: cx, z: stagger - 6 };
  });
  const sx = Math.max(BLOCK / 2, total / 2 + 30);
  const sz = Math.max(BLOCK / 2 + 6, maxD / 2 + 50);
  return { towers, sx, sz };
}

const RES_TONES = ['#ddd6cb', '#cfc5b6', '#e4ddd2', '#c9bfb1', '#d9c8b2', '#c4beb5', '#d4c2aa', '#c8c8c3', '#e0d2bf', '#bdb4a7', '#d6b9a0', '#b9bcb8'];
const OFFICE_TONES = ['#c2bfb8', '#b1b3b4', '#cfc9bf', '#b9b0a3', '#a7a9a8', '#8f8f8d'];
const GLASS_TONES = ['#8a979c', '#7e8a8e', '#97a2a4', '#788387', '#a0a8a6', '#8c8f8a'];

/** Hex → [r, g, b] in 0..1 (sRGB). */
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/**
 * @param site     { sx, sz } half-sizes of the development's site block
 * @param opts     { radius (detailed city), farRadius (simple skyline ring), density, towerH }
 */
export function generateCity(site, { radius = 900, farRadius = 2600, density = 0.9, towerH = 90 } = {}) {
  const rnd = mulberry32(4211);
  const r = (a, b) => a + (b - a) * rnd();
  const pick = (list) => list[Math.floor(rnd() * list.length) % list.length];

  const blocks = [];
  const lawns = [];
  const paths = [];
  const near = [];
  const far = [];
  const tanks = [];
  const roofBoxes = [];
  const trees = [];
  const lamps = [];

  // block spans along one axis: index 0 is the site's own column / row
  const span = (k, s) => {
    if (k === 0) return [-s, s];
    const a = s + ROAD + (Math.abs(k) - 1) * PITCH;
    return k > 0 ? [a, a + BLOCK] : [-a - BLOCK, -a];
  };
  const kMax = Math.ceil(farRadius / PITCH) + 1;

  const addTree = (x, z, sp, s = 1) => trees.push({ x, z, sp, s: s * r(0.85, 1.15), rot: r(0, Math.PI * 2), tint: r(0, 1) });

  for (let kx = -kMax; kx <= kMax; kx += 1) {
    for (let kz = -kMax; kz <= kMax; kz += 1) {
      const [x0, x1] = span(kx, site.sx);
      const [z0, z1] = span(kz, site.sz);
      const cx = (x0 + x1) / 2;
      const cz = (z0 + z1) / 2;
      const w = x1 - x0;
      const d = z1 - z0;
      const dist = Math.hypot(cx, cz);
      if (dist > farRadius) continue;
      const isSite = kx === 0 && kz === 0;
      const detailed = dist < radius;
      blocks.push({ x: cx, z: cz, w, h: KERB_H, d, y: 0, site: isSite });
      if (isSite) continue;

      const ring = Math.max(Math.abs(kx), Math.abs(kz));
      // street trees and lamps along the kerbs of the nearer blocks
      if (detailed && ring <= 2) {
        const e = SIDEWALK * 0.55;
        const stepT = 11;
        for (const [ax, az, len, alongX] of [
          [cx, z0 + e, w, true],
          [cx, z1 - e, w, true],
          [x0 + e, cz, d, false],
          [x1 - e, cz, d, false]
        ]) {
          const n = Math.floor((len - 8) / stepT);
          for (let i = 0; i <= n; i += 1) {
            const t = -((n * stepT) / 2) + i * stepT;
            if (rnd() < 0.86) addTree(alongX ? ax + t : ax, alongX ? az : az + t, rnd() < 0.7 ? 'young' : 'oval', r(0.85, 1.1));
          }
          const nl = Math.floor((len - 10) / 33);
          for (let i = 0; i <= nl; i += 1) {
            const t = -((nl * 33) / 2) + i * 33 + 5.5;
            const off = 0.75 - e;
            lamps.push({
              x: alongX ? ax + t : ax + (ax < cx ? off : -off),
              z: alongX ? az + (az < cz ? off : -off) : az + t,
              rot: alongX ? (az < cz ? 0 : Math.PI) : ax < cx ? Math.PI / 2 : -Math.PI / 2
            });
          }
        }
      }

      const inX0 = x0 + SIDEWALK + 1.5;
      const inX1 = x1 - SIDEWALK - 1.5;
      const inZ0 = z0 + SIDEWALK + 1.5;
      const inZ1 = z1 - SIDEWALK - 1.5;
      const iw = inX1 - inX0;
      const id = inZ1 - inZ0;

      // parks: a lawn, cross paths and clusters of trees
      const park = (ring === 1 && rnd() < 0.34) || rnd() < (detailed ? 0.14 : 0.09);
      if (park) {
        lawns.push({ x: cx, z: cz, w: iw, h: 0.12, d: id, y: KERB_H });
        if (detailed) {
          paths.push({ x: cx, z: cz, w: iw, h: 0.14, d: 3.2, y: KERB_H });
          paths.push({ x: cx, z: cz, w: 3.2, h: 0.14, d: id, y: KERB_H });
        }
        const count = detailed ? 22 : 9;
        for (let i = 0; i < count; i += 1) {
          const tx = r(inX0 + 4, inX1 - 4);
          const tz = r(inZ0 + 4, inZ1 - 4);
          if (detailed && (Math.abs(tx - cx) < 4 || Math.abs(tz - cz) < 4)) continue;
          addTree(tx, tz, rnd() < 0.55 ? 'rain' : 'oval', r(0.9, 1.3));
        }
        continue;
      }

      // built block: lots, one building (sometimes a podium with a tower) per lot
      const nLx = Math.max(1, Math.round(iw / 40));
      const nLz = Math.max(1, Math.round(id / 40));
      const lw = iw / nLx;
      const ld = id / nLz;
      // keep the immediate neighbours lower so the development reads as the subject
      const capNear = towerH * (ring <= 1 ? 0.42 : ring <= 2 ? 0.58 : ring <= 4 ? 0.82 : 1.1);
      for (let ix = 0; ix < nLx; ix += 1) {
        for (let iz = 0; iz < nLz; iz += 1) {
          const lx = inX0 + lw * (ix + 0.5);
          const lz = inZ0 + ld * (iz + 0.5);
          if (rnd() > density * 0.8) {
            if (detailed) lawns.push({ x: lx, z: lz, w: lw - 3, h: 0.1, d: ld - 3, y: KERB_H });
            continue;
          }
          const roll = rnd();
          // 0 housing with punched windows, 3 modern housing with balcony bands, 1 offices, 2 glass towers
          const type = roll < 0.4 ? 0 : roll < 0.64 ? 3 : roll < 0.86 ? 1 : 2;
          const fh = type === 0 || type === 3 ? 3.1 : type === 1 ? 3.8 : 3.6;
          const gh = type === 0 || type === 3 ? 3.4 : 5.2;
          if (detailed) lawns.push({ x: lx, z: lz, w: lw - 2.5, h: 0.1, d: ld - 2.5, y: KERB_H }); // green setbacks
          const bw = Math.max(14, lw * r(0.55, 0.82));
          const bd = Math.max(13, ld * r(0.55, 0.8));
          const bx = lx + r(-1, 1) * (lw - bw) * 0.3;
          const bz = lz + r(-1, 1) * (ld - bd) * 0.3;
          let floors;
          if (type === 0 || type === 3) floors = Math.round(r(4, 9) + Math.pow(rnd(), 1.6) * 16);
          else if (type === 1) floors = Math.round(r(3, 8) + Math.pow(rnd(), 2) * 8);
          else floors = Math.round(r(10, 16) + Math.pow(rnd(), 1.5) * 18);
          let h = gh + floors * fh;
          if (h > capNear) h = Math.max(gh + 3 * fh, capNear * r(0.7, 1));
          const tone = rgb(type === 0 || type === 3 ? pick(RES_TONES) : type === 1 ? pick(OFFICE_TONES) : pick(GLASS_TONES));
          const seed = rnd();
          const list = detailed ? near : far;
          const podium = type !== 0 && h > 30 && rnd() < 0.55;
          if (podium) {
            const ph = 5.2 + 2 * 3.8;
            list.push({ x: bx, z: bz, w: bw, h: ph, d: bd, y: KERB_H, type: 1, seed, fh: 3.8, gh: 5.2, tone: rgb(pick(OFFICE_TONES)) });
            const tw = bw * r(0.5, 0.7);
            const td = bd * r(0.55, 0.75);
            list.push({ x: bx + r(-1, 1) * (bw - tw) * 0.3, z: bz + r(-1, 1) * (bd - td) * 0.3, w: tw, h: h - ph, d: td, y: KERB_H + ph, type, seed: seed + 0.5, fh, gh: 0, tone });
          } else {
            list.push({ x: bx, z: bz, w: bw, h, d: bd, y: KERB_H, type, seed, fh, gh, tone });
          }
          if (detailed) {
            const top = list[list.length - 1];
            const roofY = top.y + top.h;
            const tw = top.w;
            const td = top.d;
            // lift / stair headroom and plant
            roofBoxes.push({ x: top.x + r(-0.25, 0.25) * tw, z: top.z + r(-0.25, 0.25) * td, w: r(3.5, 6), h: r(2.6, 3.4), d: r(3, 4.5), y: roofY });
            if (type === 0 || type === 3) {
              const nt = 1 + Math.floor(rnd() * 3);
              for (let k = 0; k < nt; k += 1) {
                const dia = r(1.6, 2.2);
                tanks.push({ x: top.x + r(-0.35, 0.35) * tw, z: top.z + r(-0.35, 0.35) * td, w: dia, h: r(1.5, 2), d: dia, y: roofY });
              }
            } else {
              const na = 2 + Math.floor(rnd() * 5);
              for (let k = 0; k < na; k += 1) roofBoxes.push({ x: top.x + r(-0.38, 0.38) * tw, z: top.z + r(-0.38, 0.38) * td, w: r(1.2, 2.4), h: r(0.9, 1.6), d: r(1, 1.8), y: roofY });
            }
            // a few trees in the setbacks
            if (rnd() < 0.7) {
              const nt = 1 + Math.floor(rnd() * 3);
              for (let k = 0; k < nt; k += 1) {
                const side = rnd() < 0.5 ? -1 : 1;
                const tx = bx + side * (bw / 2 + r(3, 5));
                const tz = bz + r(-0.4, 0.4) * bd;
                if (tx > inX0 && tx < inX1) addTree(tx, tz, rnd() < 0.5 ? 'oval' : 'rain', r(0.8, 1.05));
              }
            }
          }
        }
      }
    }
  }
  return { blocks, lawns, paths, near, far, tanks, roofBoxes, trees, lamps };
}
