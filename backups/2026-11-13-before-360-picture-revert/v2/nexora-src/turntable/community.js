/**
 * The finished gated community: a walled site with a main gate and guard house, a ring road and
 * cross streets, villas on landscaped plots, three residential towers, a central clubhouse with a
 * pool, a lake with a fountain, sports courts, the estate office, street trees and lights.
 *
 * The main gate faces +z. Units are metres; the site is 300 x 200 m with its top at y = 0.
 */
import * as THREE from 'three';
import { Batch, box, mulberry32, courtTexture } from './kit.js';
import { car, streetLight, lounger, umbrella } from './props.js';

const GROUND = { size: 3000, seg: 200, flat: [178, 128], margin: 60, hills: 32, y: -0.05, uvScale: 7, seed: 7 };
const ROAD = 9;

const disc = new THREE.CylinderGeometry(1, 1, 1, 56);
disc.translate(0, 0.5, 0);
const cone = new THREE.ConeGeometry(1, 1, 12, 1, true);
cone.translate(0, 0.5, 0);

/** One villa on a 16 x 24 m plot, front (+z) towards its street, mirrored when mx = -1. */
function villa(B, U, x, z, ry, mx, rnd, glows, trees) {
  B.push(x, 0, z, ry);
  const X = (v) => v * mx;
  const glassKey = rnd() > 0.5 ? 'glassA' : 'glassB';
  const upper = ['plaster', 'wood', 'plasterWarm'][Math.floor(rnd() * 3)];
  B.add('lawn', box(15.4, 0.035, 23.4, U.lawn), 0, 0, 0);
  B.add('paving', box(4, 0.05, 8.5, U.paving), X(-5.4), 0, 7.6);
  B.add('hedge', box(9.6, 0.85, 0.7, U.lawn), X(2.6), 0, 11.3);
  // ground floor
  B.add('plaster', box(12, 3.3, 9.5, U.plaster), X(0.5), 0, -1.5);
  B.add(glassKey, box(9.2, 2.8, 0.08, [4, 2.8]), X(1.4), 0.25, 3.27);
  B.add('plaster', box(13.2, 0.36, 10.8, U.plaster), X(0.5), 3.3, -1.2);
  // first floor
  B.add(upper, box(8, 3.0, 8, upper === 'wood' ? U.wood : U.plaster), X(-1.2), 3.66, -2.4);
  B.add(glassKey === 'glassA' ? 'glassB' : 'glassA', box(6.4, 2.5, 0.08, [4, 2.5]), X(-1.2), 3.9, 1.63);
  B.add('roof', box(8.9, 0.3, 8.9), X(-1.2), 6.66, -2.4);
  B.add('coping', box(9.1, 0.12, 9.1), X(-1.2), 6.6, -2.4);
  B.add('railing', box(4.6, 0.95, 0.04), X(3.8), 3.66, 3.9);
  // back garden: a pool for some
  if (rnd() > 0.45) {
    B.add('water', box(6.4, 0.02, 2.8), X(1.5), 0.04, -9.0);
    B.add('coping', box(7.2, 0.06, 0.35), X(1.5), 0, -7.45);
    B.add('coping', box(7.2, 0.06, 0.35), X(1.5), 0, -10.55);
  }
  glows.push(B.pt(X(-3.4), 0.8, 11.6), B.pt(X(-7.4), 0.8, 11.6), B.pt(X(-2.0), 3.25, 3.9));
  if (rnd() > 0.35) glows.push(...car(B, X(-5.4), 6.4, Math.PI * (rnd() > 0.5 ? 1 : 0), ['paintWhite', 'paintDark', 'paintRed', 'paintWhite'][Math.floor(rnd() * 4)], 0.05, rnd() > 0.5));
  trees.push(
    { species: 'young', ...wp(B, X(5.6), 8.6), s: 0.8 + rnd() * 0.25 },
    { species: rnd() > 0.5 ? 'oval' : 'young', ...wp(B, X(-5.8), -9.5), s: 0.7 + rnd() * 0.25 }
  );
  for (let i = 0; i < 4; i += 1) trees.push({ species: 'shrub', ...wp(B, X(-6.6 + i * 1.3), 3.9), s: 0.7 + rnd() * 0.3 });
  B.pop();
}

/** world x/z of a local point in the batch frame */
function wp(B, x, z) {
  const p = B.pt(x, 0, z);
  return { x: p[0], z: p[2] };
}

function tower(B, U, x, z, floors, glows, rnd) {
  B.push(x, 0, z, 0);
  const W = 24;
  const D = 16;
  const fh = 3.1;
  const H = floors * fh;
  B.add('paving', box(W + 12, 0.05, D + 12, U.paving), 0, 0, 0);
  B.add('plaster', box(W, H, D, U.plaster), 0, 0, 0);
  B.add('glassA', box(W - 2, 3.6, D + 0.12, [4, 3.6]), 0, 0.2, 0);
  for (let f = 1; f < floors; f += 1) {
    const y = f * fh;
    B.add(f % 2 ? 'glassB' : 'glassA', box(W + 0.12, 1.9, D + 0.12, [4, 1.9]), 0, y + 0.55, 0);
    for (const sx of [-7.5, 0, 7.5]) {
      for (const side of [1, -1]) {
        B.add('plaster', box(5.6, 0.22, 1.7), sx, y, side * (D / 2 + 0.85));
        B.add('railing', box(5.6, 1.0, 0.04), sx, y + 0.22, side * (D / 2 + 1.68));
      }
    }
  }
  B.add('plasterGrey', box(W + 0.6, 0.6, D + 0.6), 0, H, 0);
  B.add('plaster', box(12, 4.2, 8, U.plaster), 0, H + 0.6, 0);
  B.add('wood', box(12.4, 0.5, 8.4, U.wood), 0, H + 4.8, 0);
  for (let i = 0; i < 6; i += 1) glows.push(B.pt(-W / 2 + 2 + i * 4, H + 0.7, D / 2 + 0.4));
  glows.push(B.pt(-6, 0.6, D / 2 + 6), B.pt(6, 0.6, D / 2 + 6));
  B.pop();
}

export function buildCommunity(kit) {
  const { mats } = kit;
  const U = kit.uv;
  const B = new Batch();
  const glows = [];
  const trees = [];
  const rnd = mulberry32(2026);

  mats.courtTennis = new THREE.MeshStandardMaterial({ map: courtTexture('tennis'), roughness: 0.9 });
  mats.courtBasket = new THREE.MeshStandardMaterial({ map: courtTexture('basket'), roughness: 0.9 });
  mats.spray = new THREE.MeshStandardMaterial({ color: 0xe8f6ff, roughness: 0.2, transparent: true, opacity: 0.5, depthWrite: false, emissive: 0x8fc9e0, emissiveIntensity: 0.4 });

  /* site, wall, gate -------------------------------------------------------------------- */
  B.add('lawn', box(300, 0.03, 200, U.lawn), 0, 0, 0);
  const wallH = 2.2;
  const wall = (w, d, x, z) => {
    B.add('plasterWarm', box(w, wallH, d, U.plaster), x, 0, z);
    B.add('coping', box(w + 0.1, 0.1, d + 0.1), x, wallH, z);
  };
  wall(300, 0.4, 0, -100);
  wall(0.4, 200, -150, 0);
  wall(0.4, 200, 150, 0);
  wall(140, 0.4, -80, 100);
  wall(140, 0.4, 80, 100);
  for (let x = -146; x <= 146; x += 12) {
    if (Math.abs(x) < 12) continue;
    glows.push([x, 1.9, 100.4], [x, 1.9, -100.4]);
  }
  // gate: stone pillars, beam, guard house, barriers
  B.add('stone', box(2.2, 6.4, 2.2, U.stone), -10.2, 0, 100);
  B.add('stone', box(2.2, 6.4, 2.2, U.stone), 10.2, 0, 100);
  B.add('wood', box(23, 1.0, 3.2, U.wood), 0, 6.4, 100);
  B.add('plasterGrey', box(23.6, 0.2, 3.6), 0, 7.4, 100);
  B.add('plaster', box(6, 3.2, 4.4, U.plaster), 15.5, 0, 94.5);
  B.add('glassB', box(6.1, 1.6, 4.5, [4, 1.6]), 15.5, 1.1, 94.5);
  B.add('roof', box(7.2, 0.3, 5.6), 15.5, 3.2, 94.5);
  B.add('metal', box(7.5, 0.12, 0.12), -4.2, 1.0, 98.6);
  B.add('metal', box(7.5, 0.12, 0.12), 4.2, 1.0, 101.4);
  glows.push([-10.2, 6.0, 101.3], [10.2, 6.0, 101.3], [-4, 6.3, 101.7], [4, 6.3, 101.7], [15.5, 3.0, 96.9]);

  /* roads ----------------------------------------------------------------------------------- */
  const road = (w, d, x, z) => B.add('asphalt', box(w, 0.05, d, U.asphalt), x, 0, z);
  road(285, ROAD, 0, 88);
  road(285, ROAD, 0, -88);
  road(ROAD, 185, -138, 0);
  road(ROAD, 185, 138, 0);
  road(276, ROAD, 0, 30);
  road(276, ROAD, 0, -30);
  road(12, 66, 0, 66);
  road(14, 32, 0, 114);
  B.add('asphalt', box(1400, 0.05, 12, U.asphalt), 0, -0.02, 136);
  // roundabout
  B.add('asphalt', disc, 0, 0, 62, 0, [13, 0.06, 13]);
  B.add('kerb', disc, 0, 0, 62, 0, [6.4, 0.25, 6.4]);
  B.add('lawn', disc, 0, 0.25, 62, 0, [6, 0.05, 6]);
  trees.push({ species: 'rain', x: 0, z: 62, y: 0.3, s: 0.9 });

  const lights = [];
  for (let x = -130; x <= 130; x += 26) {
    lights.push(streetLight(B, x, 93.2, Math.PI), streetLight(B, x, -93.2, 0), streetLight(B, x, 35.2, Math.PI), streetLight(B, x, -24.8, Math.PI));
  }
  for (let z = -78; z <= 78; z += 26) lights.push(streetLight(B, -143.2, z, Math.PI / 2), streetLight(B, 143.2, z, -Math.PI / 2));
  for (let x = -600; x <= 600; x += 30) lights.push(streetLight(B, x, 143, Math.PI, -0.02));
  glows.push(...lights);

  // street trees along both sides of every road
  const lineTrees = (x0, z0, x1, z1, step, off) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.floor(len / step);
    const dx = (x1 - x0) / len;
    const dz = (z1 - z0) / len;
    for (let i = 0; i <= n; i += 1) {
      for (const side of [1, -1]) {
        const px = x0 + dx * i * step - dz * off * side;
        const pz = z0 + dz * i * step + dx * off * side;
        if (Math.abs(px) < 16 && pz > 40) continue; // keep the spine and gate open
        trees.push({ species: 'young', x: px, z: pz, s: 0.8 + rnd() * 0.2 });
      }
    }
  };
  lineTrees(-134, 88, 134, 88, 13, 6.2);
  lineTrees(-134, -88, 134, -88, 13, 6.2);
  lineTrees(-138, -82, -138, 82, 13, 6.2);
  lineTrees(138, -82, 138, 82, 13, 6.2);
  lineTrees(-132, 30, 132, 30, 13, 6.2);
  lineTrees(-132, -30, 132, -30, 13, 6.2);

  /* villas ------------------------------------------------------------------------------ */
  const plotsX = [22, 38, 54, 70, 86, 102, 118];
  for (const side of [-1, 1]) {
    plotsX.forEach((px, i) => {
      const x = side * px;
      // front blocks: one row faces the ring road (south), one the cross street (north)
      if (!(side === 1 && i === 0)) villa(B, U, x, 71.5, 0, side * (i % 2 ? 1 : -1), rnd, glows, trees);
      villa(B, U, x, 46.5, Math.PI, side * (i % 2 ? -1 : 1), rnd, glows, trees);
      // back right block
      if (side === 1) {
        villa(B, U, x, -46.5, 0, i % 2 ? 1 : -1, rnd, glows, trees);
        villa(B, U, x, -71.5, Math.PI, i % 2 ? -1 : 1, rnd, glows, trees);
      }
    });
  }

  // estate office (facility management) in place of the first villa by the gate
  B.push(22, 0, 71.5, 0);
  B.add('paving', box(15.4, 0.05, 23.4, U.paving), 0, 0, 0);
  B.add('plaster', box(13, 3.6, 10, U.plaster), 0, 0, -2);
  B.add('glassA', box(12, 3.0, 0.08, [4, 3.0]), 0, 0.3, 3.04);
  B.add('wood', box(14.4, 0.6, 11.4, U.wood), 0, 3.6, -1.6);
  B.add('plasterGrey', box(4, 0.08, 1), 0, 2.6, 4.2);
  glows.push(...[-4, 0, 4].map((lx) => B.pt(lx, 3.5, 4.0)));
  for (let i = 0; i < 4; i += 1) glows.push(...car(B, -5 + i * 3.2, 8.5, Math.PI, i % 2 ? 'paintDark' : 'paintWhite', 0.05));
  B.pop();

  /* towers -------------------------------------------------------------------------------- */
  for (const tx of [-110, -70, -30]) tower(B, U, tx, -59, 14 + (tx === -70 ? 2 : 0), glows, rnd);
  for (const tx of [-130, -90, -50, -10]) trees.push({ species: 'oval', x: tx, z: -45, s: 0.9 }, { species: 'oval', x: tx, z: -75, s: 0.9 });

  /* clubhouse, pool, parking ------------------------------------------------------------- */
  B.add('paving', box(84, 0.05, 44, U.paving), 0, 0, 0);
  B.add('plaster', box(36, 4.2, 16, U.plaster), 0, 0, -9);
  B.add('glassA', box(34, 3.7, 0.08, [4, 3.7]), 0, 0.25, -0.96);
  B.add('glassB', box(0.08, 3.7, 14, [4, 3.7]), 18.04, 0.25, -9);
  B.add('glassB', box(0.08, 3.7, 14, [4, 3.7]), -18.04, 0.25, -9);
  B.add('plaster', box(40, 0.6, 19.5, U.plaster), 0, 4.2, -8.2);
  B.add('wood', box(22, 3.6, 12, U.wood), -4, 4.8, -10);
  B.add('glassB', box(20, 3.0, 0.08, [4, 3.0]), -4, 5.1, -3.96);
  B.add('roof', box(23, 0.4, 13), -4, 8.4, -10);
  for (let i = 0; i < 12; i += 1) B.add('wood', box(0.25, 0.3, 9), 9 + i * 0.75, 7.6, -7);
  for (const px of [8.8, 17.4]) for (const pz of [-11, -3]) B.add('metal', box(0.2, 2.8, 0.2), px, 4.8, pz);
  for (let i = 0; i < 8; i += 1) glows.push([-15 + i * 4.3, 4.1, 0.6]);
  // pool and deck
  B.add('water', box(26, 0.02, 10), 0, 0.055, 12.5);
  B.add('coping', box(27, 0.08, 0.5), 0, 0, 7.25);
  B.add('coping', box(27, 0.08, 0.5), 0, 0, 17.75);
  B.add('coping', box(0.5, 0.08, 11), -13.25, 0, 12.5);
  B.add('coping', box(0.5, 0.08, 11), 13.25, 0, 12.5);
  B.add('deck', box(40, 0.07, 3.6, U.deck), 0, 0, 19.8);
  B.add('deck', box(5, 0.07, 11, U.deck), -16.5, 0, 12.5);
  B.add('deck', box(5, 0.07, 11, U.deck), 16.5, 0, 12.5);
  for (let i = 0; i < 7; i += 1) lounger(B, -12 + i * 4, 19.8, 0, 0.07);
  umbrella(B, -16.5, 12.5, 0.07, 1.8);
  umbrella(B, 16.5, 12.5, 0.07, 1.8);
  for (const px of [-8, 0, 8]) glows.push([px, 0.06, 12.5]);
  for (const [px, pz] of [[-20, 6], [20, 6], [-20, 18], [20, 18], [-24, -18], [24, -18]]) trees.push({ species: 'oval', x: px, z: pz, s: 0.75 });
  // parking
  B.add('asphalt', box(14, 0.06, 34, U.asphalt), 34, 0, -2);
  for (let i = 0; i < 6; i += 1) {
    if (i !== 2) glows.push(...car(B, 30.5, -14 + i * 4.8, Math.PI / 2, ['paintWhite', 'paintDark', 'paintRed'][i % 3], 0.06, i % 2 === 0));
    if (i !== 4) glows.push(...car(B, 37.5, -14 + i * 4.8, -Math.PI / 2, ['paintDark', 'paintWhite', 'paintWhite'][i % 3], 0.06));
  }

  /* lake with fountain ------------------------------------------------------------------ */
  const LX = -92;
  B.add('paving', disc, LX, 0, 0, 0, [36, 0.045, 21.5]);
  B.add('lawn', disc, LX, 0, 0, 0, [33.5, 0.06, 19.2]);
  B.add('stone', disc, LX, 0, 0, 0, [31.2, 0.08, 18.2]);
  B.add('lake', disc, LX, 0, 0, 0, [30, 0.09, 17]);
  B.add('coping', disc, LX, 0.09, 0, 0, [2.6, 0.35, 2.6]);
  B.add('spray', cone, LX, 0.4, 0, 0, [1.1, 5.5, 1.1]);
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    B.add('spray', cone, LX + Math.cos(a) * 1.9, 0.4, Math.sin(a) * 1.9, 0, [0.4, 2.6, 0.4]);
  }
  glows.push([LX, 0.5, 0], [LX + 1.5, 0.5, 1], [LX - 1.5, 0.5, -1]);
  for (let i = 0; i < 18; i += 1) {
    const a = (i / 18) * Math.PI * 2;
    glows.push([LX + Math.cos(a) * 35, 0.7, Math.sin(a) * 20.5]);
    if (i % 2) trees.push({ species: i % 4 === 1 ? 'rain' : 'oval', x: LX + Math.cos(a) * 39, z: Math.sin(a) * 23.5, s: 0.75 + rnd() * 0.25 });
  }

  /* sports courts ---------------------------------------------------------------------- */
  B.add('courtTennis', box(13, 0.06, 26), 74, 0, 0);
  B.add('courtTennis', box(13, 0.06, 26), 89, 0, 0);
  B.add('courtBasket', box(16, 0.06, 28), 110, 0, 0);
  for (const [cx, cz] of [[67, -13], [96, -13], [67, 13], [96, 13], [102, -14], [118, 14]]) {
    B.add('metal', box(0.2, 7, 0.2), cx, 0, cz);
    glows.push([cx, 7, cz]);
  }
  for (const pz of [-22, 22]) for (let px = 64; px <= 124; px += 10) trees.push({ species: 'young', x: px, z: pz, s: 0.8 });

  /* outside the wall ------------------------------------------------------------------------ */
  const far = [];
  const inside = (x, z) => Math.abs(x) < 160 && Math.abs(z) < 110;
  const onRoad = (x, z) => (z > 126 && z < 150) || (Math.abs(x) < 12 && z > 95 && z < 130);
  let tries = 0;
  while (far.length < 900 && tries < 14000) {
    tries += 1;
    const x = (rnd() - 0.5) * 1300;
    const z = (rnd() - 0.5) * 1100;
    if (inside(x, z) || onRoad(x, z)) continue;
    const d = Math.hypot(x / 1.2, z);
    if (d > 640) continue;
    const dense = fbmTrees(x, z);
    if (rnd() > dense) continue;
    const clump = 1 + Math.floor(rnd() * 4);
    for (let k = 0; k < clump; k += 1) {
      const tx = x + (rnd() - 0.5) * 14;
      const tz = z + (rnd() - 0.5) * 14;
      if (inside(tx, tz) || onRoad(tx, tz)) continue;
      far.push({ species: rnd() > 0.4 ? 'rain' : 'oval', x: tx, z: tz, y: kit.groundY(tx, tz, GROUND) - 0.1, s: 0.8 + rnd() * 0.6, ry: rnd() * 6, hue: (rnd() - 0.5) * 0.05, light: (rnd() - 0.5) * 0.1 });
    }
  }
  // a belt of trees just outside the wall
  for (let x = -156; x <= 156; x += 9) {
    for (const z of [-106, 106]) {
      if (z > 0 && Math.abs(x) < 20) continue;
      far.push({ species: rnd() > 0.5 ? 'oval' : 'rain', x: x + (rnd() - 0.5) * 3, z: z + (rnd() - 0.5) * 3, y: 0, s: 0.75 + rnd() * 0.3, ry: rnd() * 6 });
    }
  }
  for (let z = -100; z <= 100; z += 9) {
    for (const x of [-157, 157]) far.push({ species: rnd() > 0.5 ? 'oval' : 'rain', x: x + (rnd() - 0.5) * 3, z, y: 0, s: 0.75 + rnd() * 0.3, ry: rnd() * 6 });
  }

  /* assemble ----------------------------------------------------------------------------- */
  const group = new THREE.Group();
  group.add(B.build(mats, { noShadow: ['water', 'lake', 'railing', 'lampHead', 'spray', 'glassA', 'glassB', 'lawn', 'asphalt', 'paving', 'courtTennis', 'courtBasket'] }));
  group.add(kit.ground(GROUND));
  const near = trees.map((t) => ({ y: 0, ry: rnd() * 6, hue: (rnd() - 0.5) * 0.03, light: (rnd() - 0.5) * 0.06, ...t }));
  group.add(kit.forest(near, 'far'));
  group.add(kit.forest(far, 'far', { cast: false }));
  group.add(kit.glow(glows, 4.2, 0xffd49a, 0.85));

  return {
    group,
    view: { target: new THREE.Vector3(0, 0, 8), radius: 360, elevation: 32, fov: 33, period: 64, start: 0.93 },
    shadow: { size: 215, center: new THREE.Vector3(0, 0, 0) },
    fog: 0.00125,
    anchors: {
      clubhouse: new THREE.Vector3(0, 9.5, -9),
      gate: new THREE.Vector3(0, 8, 100),
      office: new THREE.Vector3(22, 5.5, 69),
      lake: new THREE.Vector3(LX, 2, 0),
      towers: new THREE.Vector3(-70, 52, -59)
    }
  };

  function fbmTrees(x, z) {
    const n = Math.sin(x * 0.011) * Math.cos(z * 0.013) + Math.sin((x + z) * 0.006);
    return 0.25 + 0.55 * (n * 0.25 + 0.5);
  }
}
