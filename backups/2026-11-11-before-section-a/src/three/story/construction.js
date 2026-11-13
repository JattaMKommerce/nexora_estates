import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { FLOOR_H, PLAZA_H, SLAB_T, box, merge } from '../towerGeometry.js';
import { PLAN } from '../../plan/layout.js';

/**
 * Construction pieces for the homepage's build sequence. Like the tower itself, they are an
 * illustrative design (a generic concrete frame, foundations and tower crane), not the project's
 * engineering or construction method.
 *
 * Frame module m stands on floor m's level: the columns and core walls of that storey and the slab
 * they carry (the floor of the next storey). Its base is at y = 0.
 */
export function buildFrameModule(dims) {
  const { width: W, depth: D } = dims;
  const h = FLOOR_H - SLAB_T;
  const parts = [];
  const cs = 0.5;
  const ix = W / 2 - 0.55;
  const iz = D / 2 - 0.55;
  const nx = Math.max(3, Math.round((W - 1.1) / 6.5));
  const nz = Math.max(2, Math.round((D - 1.1) / 6.5));
  for (let i = 0; i <= nx; i += 1) {
    const x = -ix + (2 * ix * i) / nx;
    parts.push(box(cs, h, cs, x, h / 2, iz), box(cs, h, cs, x, h / 2, -iz));
  }
  for (let j = 1; j < nz; j += 1) {
    const z = -iz + (2 * iz * j) / nz;
    parts.push(box(cs, h, cs, ix, h / 2, z), box(cs, h, cs, -ix, h / 2, z));
  }
  // lift and stair core (from the illustrative plan: between the corridor and the south facade)
  const plateD = dims.plate.D;
  const c0 = PLAN.corridor / 2;
  const c1 = plateD / 2 - 0.4;
  const cw = PLAN.coreW;
  const t = 0.3;
  parts.push(box(cw, h, t, 0, h / 2, c0 + t / 2), box(cw, h, t, 0, h / 2, c1 - t / 2));
  parts.push(box(t, h, c1 - c0, -cw / 2 + t / 2, h / 2, (c0 + c1) / 2), box(t, h, c1 - c0, cw / 2 - t / 2, h / 2, (c0 + c1) / 2));
  parts.push(box(t, h, c1 - c0 - 2 * t, -cw / 2 + 2.1, h / 2, (c0 + c1) / 2));
  // the slab this storey carries
  parts.push(box(W + 0.6, SLAB_T, D + 0.6, 0, FLOOR_H - SLAB_T / 2, 0));
  return merge(parts);
}

/** Bored piles under the footprint and the raft that caps them (the raft's top sits just under the plaza). */
export function buildFoundation(dims) {
  const { outerW, depth: D } = dims;
  const W = outerW;
  const pile = new THREE.CylinderGeometry(0.42, 0.42, 6, 10);
  pile.translate(0, -3, 0); // top at y = 0
  const spots = [];
  const sx = Math.max(3, Math.round(W / 4.6));
  const sz = Math.max(3, Math.round(D / 4.6));
  for (let i = 0; i <= sx; i += 1) {
    for (let j = 0; j <= sz; j += 1) {
      const x = -W / 2 + 1.2 + ((W - 2.4) * i) / sx;
      const z = -D / 2 + 1.2 + ((D - 2.4) * j) / sz;
      spots.push({ x, z, d: (i + j * 0.6) / (sx + sz * 0.6) });
    }
  }
  const raftH = 1.2;
  const raft = box(W + 3, raftH, D + 3, 0, PLAZA_H - 0.03 - raftH / 2, 0);
  return { pile, raft, spots };
}

/** Safety screen wrapped around the top storeys of the frame (an open box, unit height). */
export function buildNet(dims) {
  const W = dims.width + 1.4;
  const D = dims.depth + 1.4;
  const faces = [
    [W, 0, D / 2, 0],
    [W, 0, -D / 2, Math.PI],
    [D, W / 2, 0, Math.PI / 2],
    [D, -W / 2, 0, -Math.PI / 2]
  ].map(([len, x, z, r]) => {
    const g = new THREE.PlaneGeometry(len, 1);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i += 1) uv.setX(i, (uv.getX(i) * len) / 1.5);
    g.rotateY(r);
    g.translate(x, 0.5, z);
    return g;
  });
  return merge(faces);
}

/* ------------------------------------------------------------------ crane */

/** Lattice (chords and X-bracing) as an alpha mask: one bay per texture repeat. */
export function latticeTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.strokeStyle = '#ffffff';
  ctx.lineCap = 'square';
  ctx.lineWidth = 7;
  ctx.strokeRect(3, 3, 58, 58);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(4, 4);
  ctx.lineTo(60, 60);
  ctx.moveTo(60, 4);
  ctx.lineTo(4, 60);
  ctx.stroke();
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** Safety mesh: a fine dark grid. */
export function netTexture() {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 32, 3);
  ctx.fillRect(0, 0, 3, 32);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 3);
  return t;
}

/** A box whose lattice repeats every ~2 m along its long axis (x). */
function latticeBox(L, h, d) {
  const g = new THREE.BoxGeometry(L, h, d);
  const uv = g.attributes.uv;
  // faces 2–5 (±y, ±z) run along x: repeat the bay along u
  for (let f = 2; f < 6; f += 1) {
    for (let k = 0; k < 4; k += 1) {
      const i = f * 4 + k;
      uv.setX(i, (uv.getX(i) * L) / 2);
    }
  }
  return g;
}

/**
 * Tower crane, built at the origin with the mast's foot at y = 0 and the slewing unit at y = 0
 * of its own group (the caller places the head at the mast's height). Jib along +x.
 */
export function buildCrane(jibLength) {
  const mast = new THREE.BoxGeometry(1.8, 2, 1.8);
  mast.translate(0, 1, 0);
  const jib = latticeBox(jibLength, 1.4, 1.5);
  jib.translate(jibLength / 2 + 1.2, 1.6, 0);
  const counter = latticeBox(13, 1.1, 1.6);
  counter.translate(-6.5 - 1.2, 1.5, 0);
  const apex = new THREE.BoxGeometry(1.5, 5.5, 1.5);
  apex.translate(0, 2.75 + 1.2, 0);
  const lattice = mergeGeometries([jib, counter, apex], false);
  [jib, counter, apex].forEach((g) => g.dispose());

  const yellow = merge([box(2.8, 0.9, 2.8, 0, 0.45, 0), box(0.5, 0.35, 1.2, jibLength * 0.55, 0.8, 0)]);
  const cab = box(1.9, 2.1, 2.2, 1.4, 0.1, 1.9);
  const weights = merge([0, 1, 2].map((k) => box(0.62, 1.7, 2.3, -11.4 - k * 0.66, 0.7, 0)));
  // pendant ties from the apex to the jib and counter-jib, and the hook's cable
  const tie = (a, b, r = 0.035) => {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const g = new THREE.CylinderGeometry(r, r, len, 5);
    g.translate(0, len / 2, 0);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()));
    g.translate(a.x, a.y, a.z);
    return g;
  };
  const top = new THREE.Vector3(0, 6.9, 0);
  const steel = merge([
    tie(top, new THREE.Vector3(jibLength * 0.45, 2.3, 0)),
    tie(top, new THREE.Vector3(jibLength * 0.85, 2.3, 0)),
    tie(top, new THREE.Vector3(-12.5, 2.0, 0)),
    tie(new THREE.Vector3(jibLength * 0.55, 0.8, 0), new THREE.Vector3(jibLength * 0.55, -16, 0), 0.025),
    box(0.7, 0.9, 0.5, jibLength * 0.55, -16.4, 0)
  ]);
  const pad = box(5.5, 1, 5.5, 0, 0.5, 0);
  return { mast, lattice, yellow, cab, weights, steel, pad };
}
