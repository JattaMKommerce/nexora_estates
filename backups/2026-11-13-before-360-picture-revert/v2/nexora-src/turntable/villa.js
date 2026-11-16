/**
 * The finished luxury villa: a two-storey modern house on a gated plot, with a stone feature
 * wall, a wood-clad upper pod behind timber louvres, floor-to-ceiling glazing lit from inside,
 * a solar roof, a carport with two cars, a pool with deck, garden lights and mature trees,
 * plus the street, neighbours and countryside around it.
 *
 * Front of the house faces +z (the street). Units are metres; the plot top is y = 0.
 */
import * as THREE from 'three';
import { Batch, box, mulberry32 } from './kit.js';
import { car, bollard, streetLight, lounger, umbrella, planter } from './props.js';

const GROUND = { size: 900, seg: 150, flat: [70, 40], margin: 40, hills: 12, y: -0.35, uvScale: 6, seed: 3 };

/** Simplified neighbouring villa (massing, glazing, garden wall) centred at (x, z). */
function neighbour(B, U, x, z, ry, glows, variant) {
  B.push(x, 0, z, ry);
  B.add('stone', box(30, 0.35, 26, U.stone), 0, -0.35, 0);
  B.add('lawn', box(29.6, 0.02, 25.6, U.lawn), 0, 0, 0);
  for (const [w, d, px, pz] of [[30, 0.3, 0, -12.85], [0.3, 26, -14.85, 0], [0.3, 26, 14.85, 0], [22, 0.3, 4, 12.85]]) {
    B.add('plaster', box(w, 1.0, d, U.plaster), px, 0, pz);
  }
  const w1 = variant ? 13 : 15;
  B.add('plaster', box(w1, 3.4, 10, U.plaster), -2, 0, -4);
  B.add(variant ? 'glassB' : 'glassA', box(w1 - 1.4, 2.9, 0.08, [4, 2.9]), -2, 0.25, 1.03);
  B.add('plaster', box(w1 + 0.8, 0.35, 11, U.plaster), -2, 3.4, -3.8);
  B.add(variant ? 'wood' : 'plasterWarm', box(9, 3.1, 8.5, variant ? U.wood : U.plaster), variant ? -4 : 0, 3.75, -4.6);
  B.add(variant ? 'glassA' : 'glassB', box(7.6, 2.6, 0.08, [4, 2.6]), variant ? -4 : 0, 4.0, -0.32);
  B.add('roof', box(9.8, 0.3, 9.3), variant ? -4 : 0, 6.85, -4.6);
  B.add('water', box(8, 0.02, 3.4), 6.5, 0.026, 7);
  B.add('coping', box(8.8, 0.06, 0.4), 6.5, 0, 8.9);
  B.add('coping', box(8.8, 0.06, 0.4), 6.5, 0, 5.1);
  glows.push(B.pt(-6, 0.8, 13.2), B.pt(2, 0.8, 13.2), B.pt(10, 0.8, 13.2));
  B.pop();
}

export function buildVilla(kit) {
  const { mats } = kit;
  const U = kit.uv;
  const B = new Batch();
  const glows = [];
  const bright = [];
  const trees = [];
  const rnd = mulberry32(42);

  /* plot -------------------------------------------------------------------------------- */
  B.add('stone', box(36, 0.35, 30, U.stone), 0, -0.35, 0);
  B.add('lawn', box(35.4, 0.02, 29.4, U.lawn), 0, 0, 0);
  const wallH = 1.05;
  const wall = (w, d, x, z) => {
    B.add('plaster', box(w, wallH, d, U.plaster), x, 0, z);
    B.add('coping', box(w + 0.08, 0.06, d + 0.08), x, wallH, z);
  };
  wall(36, 0.3, 0, -14.85);
  wall(0.3, 30, -17.85, 0);
  wall(0.3, 30, 17.85, 0);
  wall(4.4, 0.3, -15.8, 14.85);
  wall(3.5, 0.3, -5.6, 14.85);
  wall(20, 0.3, 8, 14.85);
  for (const px of [-13.5, -7.6, -3.75, -2.0]) B.add('stone', box(0.6, 1.7, 0.6, U.stone), px, 0, 14.85);
  for (let i = 0; i < 9; i += 1) B.add('metal', box(5.5, 0.07, 0.05), -10.55, 0.18 + i * 0.17, 14.85);
  for (let i = 0; i < 8; i += 1) B.add('metal', box(1.15, 0.07, 0.05), -2.9, 0.18 + i * 0.17, 14.85);
  // wall washers along the street side
  for (const lx of [-16, -9, -1, 4, 9, 14]) glows.push([lx, 0.85, 15.15]);

  // driveway (paving) to the carport, and the apron to the street
  B.add('paving', box(6.6, 0.04, 14.2, U.paving), -10.55, 0, 7.75);
  B.add('paving', box(6.6, 0.39, 3.2, U.paving), -10.55, -0.35, 16.6);
  // stepping stones to the door, and the terrace in front of the living room
  for (let i = 0; i < 8; i += 1) B.add('paving', box(1.5, 0.06, 0.7, U.paving), -2.9, 0, 13.7 - i * 1.25);
  B.add('paving', box(14.6, 0.05, 2.3, U.paving), 2.0, 0, 3.75);

  /* house: ground floor ---------------------------------------------------------------- */
  B.add('plaster', box(14.2, 3.5, 12.4, U.plaster), 1.9, 0, -3.8);
  B.add('glassA', box(13.2, 3.0, 0.08, [4, 3.0]), 2.2, 0.22, 2.44);
  for (let i = 0; i < 6; i += 1) B.add('metal', box(0.07, 3.0, 0.12), -4.3 + i * 2.62, 0.22, 2.5);
  B.add('glassB', box(0.08, 3.0, 9.6, [4, 3.0]), 9.03, 0.22, -3.6);
  for (let i = 0; i < 4; i += 1) B.add('metal', box(0.12, 3.0, 0.07), 9.06, 0.22, -8.3 + i * 3.1);
  B.add('plaster', box(15.4, 0.42, 13.8, U.plaster), 1.9, 3.5, -3.3);
  // garden side (back) windows on both floors, and a back terrace
  B.add('glassB', box(9.0, 2.6, 0.08, [4, 2.6]), 3.0, 0.4, -10.03);
  for (let i = 0; i < 4; i += 1) B.add('metal', box(0.07, 2.6, 0.12), -1.4 + i * 2.95, 0.4, -10.08);
  B.add('glassA', box(5.6, 2.4, 0.08, [4, 2.4]), -1.6, 4.3, -10.03);
  B.add('glassB', box(3.2, 2.2, 0.08, [4, 2.2]), 5.1, 4.4, -11.03);
  B.add('paving', box(11, 0.05, 2.4, U.paving), 2.6, 0, -11.4);
  // soffit downlights under the overhang
  for (let i = 0; i < 6; i += 1) bright.push([-3.6 + i * 2.6, 3.42, 3.2]);

  // stone feature wall through both floors
  B.add('stone', box(0.7, 7.95, 14.2, U.stone), -5.55, 0, -3.3);

  // carport with two cars
  B.add('plaster', box(7.4, 0.36, 8.8, U.plaster), -9.6, 3.0, -0.2);
  B.add('plaster', box(7.0, 3.0, 0.3, U.plaster), -9.4, 0, -4.45);
  B.add('metal', box(0.18, 3.0, 0.18), -13.0, 0, 3.8);
  B.add('metal', box(0.18, 3.0, 0.18), -13.0, 0, -4.1);
  glows.push(...car(B, -8.0, 0.3, 0, 'paintWhite', 0.04, true), ...car(B, -11.1, 0.0, 0, 'paintDark', 0.04));
  bright.push([-8.2, 2.95, 0.5], [-11.1, 2.95, 0.5], [-8.2, 2.95, -2.6], [-11.1, 2.95, -2.6]);

  /* house: first floor ----------------------------------------------------------------- */
  B.add('plaster', box(7.6, 3.3, 10.6, U.plaster), -1.4, 3.92, -4.7);
  B.add('glassB', box(7.3, 2.85, 0.08, [4, 2.85]), -1.4, 4.12, 0.6);
  for (let i = 0; i < 4; i += 1) B.add('metal', box(0.07, 2.85, 0.12), -5.0 + i * 2.43, 4.12, 0.66);
  // wood-clad pod behind vertical louvres
  B.add('wood', box(5.6, 3.3, 11.0, U.wood), 5.1, 3.92, -4.5);
  B.add('glassA', box(5.3, 2.8, 0.06, [4, 2.8]), 5.1, 4.15, 1.08);
  for (let i = 0; i < 17; i += 1) B.add('wood', box(0.08, 3.1, 0.22), 2.45 + i * 0.33, 4.0, 1.25);
  // balcony on the ground-floor roof
  B.add('deck', box(7.6, 0.05, 2.7, U.deck), -1.4, 3.92, 1.95);
  B.add('railing', box(7.6, 1.0, 0.04), -1.4, 3.92, 3.32);
  B.add('metal', box(7.6, 0.05, 0.07), -1.4, 4.92, 3.32);
  // roof slab, membrane, stair block, solar array
  B.add('plaster', box(14.2, 0.42, 12.4, U.plaster), 1.3, 7.22, -4.2);
  B.add('roof', box(13.6, 0.04, 11.8), 1.3, 7.64, -4.2);
  B.add('plaster', box(3.0, 2.2, 3.2, U.plaster), -3.4, 7.64, -8.1);
  for (let r = 0; r < 2; r += 1) {
    for (let i = 0; i < 6; i += 1) {
      B.add('solar', box(1.05, 0.05, 1.7), 0.6 + i * 1.15, 7.95, -7.6 + r * 2.2, 0, 1, -0.17);
      B.add('metal', box(0.06, 0.3, 0.06), 0.6 + i * 1.15, 7.68, -7.0 + r * 2.2);
    }
  }
  bright.push([-1.4, 7.0, 2.0], [3.0, 7.0, 2.0]);

  /* pool, deck, loungers ---------------------------------------------------------------- */
  B.add('water', box(11.4, 0.02, 4.4), 6.8, 0.026, 8.5);
  B.add('coping', box(12.2, 0.08, 0.4), 6.8, 0, 6.1);
  B.add('coping', box(12.2, 0.08, 0.4), 6.8, 0, 10.9);
  B.add('coping', box(0.4, 0.08, 5.2), 0.9, 0, 8.5);
  B.add('coping', box(0.4, 0.08, 5.2), 12.7, 0, 8.5);
  B.add('deck', box(15.9, 0.06, 1.0, U.deck), 6.8, 0, 5.4);
  B.add('deck', box(4.2, 0.06, 7.2, U.deck), 15.0, 0, 8.6);
  B.add('deck', box(1.3, 0.06, 5.4, U.deck), 0.05, 0, 8.5);
  for (const lz of [6.7, 8.5, 10.3]) lounger(B, 15.0, lz, -Math.PI / 2, 0.06);
  umbrella(B, 15.6, 12.1, 0.06, 1.5);
  for (const px of [3.5, 6.8, 10.1]) glows.push([px, 0.05, 8.5]);

  /* garden ------------------------------------------------------------------------------- */
  for (const bz of [2.5, 6.5, 10.5]) {
    glows.push(bollard(B, -13.9, bz), bollard(B, -7.2, bz));
  }
  for (const bz of [6.2, 9.8, 13.0]) glows.push(bollard(B, -4.1, bz));
  for (const [px, pz] of [[-1.6, 3.3], [-4.0, 3.3]]) planter(B, px, pz, 0, 0.45);

  trees.push(
    { species: 'rain', x: -13.5, z: -11, s: 0.95 },
    { species: 'rain', x: 13.5, z: -11.5, s: 1.0 },
    { species: 'oval', x: 15.5, z: 1.8, s: 0.9 },
    { species: 'oval', x: -15.5, z: 11.2, s: 0.85 },
    { species: 'young', x: 0.6, z: 12.8, s: 0.95 },
    { species: 'young', x: 16.0, z: 13.0, s: 0.9 },
    { species: 'young', x: -15.8, z: -3.0, s: 1.0 }
  );
  const shrub = (x, z, s = 1) => trees.push({ species: 'shrub', x, z, s: s * (0.8 + rnd() * 0.5), ry: rnd() * 6 });
  for (let x = -1.2; x < 17; x += 1.6) shrub(x, 13.7);
  for (let z = -13.5; z < 13; z += 1.7) { shrub(-16.7, z); shrub(16.7, z); }
  for (let x = -16; x < 17; x += 1.7) shrub(x, -13.7);
  for (const [px, pz] of [[-1.6, 3.3], [-4.0, 3.3]]) shrub(px, pz, 0.6);
  for (let x = -4; x < 9; x += 1.4) shrub(x, -10.9, 0.9);
  for (let z = -9.5; z < 2; z += 1.5) shrub(9.9, z, 0.85);

  /* street, neighbours, countryside ------------------------------------------------------ */
  B.add('asphalt', box(600, 0.06, 9, U.asphalt), 0, -0.35, 21.6);
  B.add('paving', box(600, 0.16, 2.2, U.paving), 0, -0.35, 16.0);
  B.add('paving', box(600, 0.16, 2.2, U.paving), 0, -0.35, 27.2);
  for (let x = -110; x <= 110; x += 22) glows.push(streetLight(B, x, 27.6, Math.PI, -0.19));
  for (let x = -118; x <= 118; x += 11) {
    if (Math.abs(x + 10.5) < 5) continue;
    trees.push({ species: 'young', x: x + 2, z: 16.2 + (x % 2 ? 0.2 : -0.2), y: -0.19, s: 0.85 + rnd() * 0.2 });
    trees.push({ species: 'young', x: x + 7, z: 27.4, y: -0.19, s: 0.85 + rnd() * 0.2 });
  }
  neighbour(B, U, -40, 0, 0, glows, 0);
  neighbour(B, U, 40, 0, 0, glows, 1);
  neighbour(B, U, -24, 45, Math.PI, glows, 1);
  neighbour(B, U, 24, 45, Math.PI, glows, 0);
  for (const nx of [-40, 40]) {
    trees.push({ species: 'rain', x: nx - 11, z: -9, s: 0.9 }, { species: 'oval', x: nx + 12, z: -10, s: 0.85 }, { species: 'young', x: nx + 11, z: 9, s: 0.9 });
  }

  // countryside: trees on the hills, kept off the plots and the street
  const far = [];
  const free = (x, z) => !(Math.abs(x) < 58 && z > -18 && z < 60) && !(z > 13 && z < 31);
  let tries = 0;
  while (far.length < 420 && tries < 6000) {
    tries += 1;
    const a = rnd() * Math.PI * 2;
    const r = 30 + Math.pow(rnd(), 0.7) * 280;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r - 10;
    if (!free(x, z)) continue;
    const clump = 1 + Math.floor(rnd() * 3);
    for (let k = 0; k < clump; k += 1) {
      const tx = x + (rnd() - 0.5) * 9;
      const tz = z + (rnd() - 0.5) * 9;
      far.push({ species: rnd() > 0.45 ? 'rain' : 'oval', x: tx, z: tz, y: kit.groundY(tx, tz, GROUND) - 0.1, s: 0.75 + rnd() * 0.5, ry: rnd() * 6, hue: (rnd() - 0.5) * 0.04, light: (rnd() - 0.5) * 0.08 });
    }
  }

  /* assemble ----------------------------------------------------------------------------- */
  const group = new THREE.Group();
  group.add(B.build(mats, { noShadow: ['water', 'railing', 'lampHead', 'glassA', 'glassB', 'lawn', 'asphalt'] }));
  group.add(kit.ground(GROUND));
  const near = trees.map((t) => ({ y: 0, ry: rnd() * 6, hue: (rnd() - 0.5) * 0.03, light: (rnd() - 0.5) * 0.06, ...t }));
  group.add(kit.forest(near, 'near'));
  group.add(kit.forest(far, 'far', { cast: true }));
  group.add(kit.glow(glows, 1.5, 0xffd49a, 0.9));
  group.add(kit.glow(bright, 2.2, 0xffe2b8, 0.75));

  return {
    group,
    view: { target: new THREE.Vector3(1.5, 2.0, 1.0), radius: 54, elevation: 28, fov: 32, period: 42, start: 0.07 },
    shadow: { size: 48, center: new THREE.Vector3(0, 0, 0) },
    fog: 0.0042,
    anchors: {
      villa: new THREE.Vector3(1.5, 8.5, -3),
      pool: new THREE.Vector3(6.8, 0.5, 8.5),
      carport: new THREE.Vector3(-9.6, 3.5, 0)
    }
  };
}
