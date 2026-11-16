/**
 * Small props shared by the villa and the community: cars, lamps, loungers, umbrellas.
 * Each adds its parts to a Batch (in the batch's current frame) and returns glow points.
 */
import * as THREE from 'three';
import { box } from './kit.js';

const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16).rotateZ(Math.PI / 2);
const roundGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 12);
const coneGeo = new THREE.ConeGeometry(1, 1, 16, 1, true);

/** A saloon / SUV, 4.6 m long along +z, at (x, z) facing ry. */
export function car(B, x, z, ry = 0, paint = 'paintWhite', y = 0, suv = false) {
  B.push(x, y, z, ry);
  const h = suv ? 0.12 : 0;
  B.add(paint, box(1.86, 0.62 + h, 4.6), 0, 0.26, 0);
  B.add(paint, box(1.8, 0.16, 1.3), 0, 0.88 + h, 1.55, 0, 1, -0.22);
  B.add('glassDark', box(1.62, 0.5 + h * 0.5, 2.5), 0, 0.86 + h, -0.3);
  B.add(paint, box(1.58, 0.06, 2.2), 0, 1.36 + h * 1.5, -0.35);
  for (const [wx, wz] of [[-0.86, 1.45], [0.86, 1.45], [-0.86, -1.45], [0.86, -1.45]]) {
    B.add('tyre', wheelGeo, wx, 0.34, wz);
  }
  const lights = [B.pt(-0.6, 0.62, 2.32), B.pt(0.6, 0.62, 2.32)];
  B.pop();
  return lights;
}

/** Garden bollard light; returns its glow point. */
export function bollard(B, x, z, y = 0) {
  B.add('metal', box(0.16, 0.75, 0.16), x, y, z);
  B.add('lampHead', box(0.17, 0.09, 0.17), x, y + 0.66, z);
  return [x, y + 0.72, z];
}

/** Street light, arm towards +z of its frame; returns its glow point. */
export function streetLight(B, x, z, ry = 0, y = 0, height = 6.5) {
  B.push(x, y, z, ry);
  B.add('metal', box(0.16, height, 0.16), 0, 0, 0);
  B.add('metal', box(0.1, 0.1, 1.4), 0, height - 0.15, 0.65);
  B.add('lampHead', box(0.34, 0.08, 0.6), 0, height - 0.24, 1.25);
  const p = B.pt(0, height - 0.32, 1.25);
  B.pop();
  return p;
}

export function lounger(B, x, z, ry = 0, y = 0) {
  B.push(x, y, z, ry);
  B.add('metal', box(0.68, 0.22, 1.95), 0, 0, 0);
  B.add('fabric', box(0.66, 0.1, 1.35), 0, 0.22, -0.3);
  B.add('fabric', box(0.66, 0.1, 0.7), 0, 0.28, 0.62, 0, 1, -0.55);
  B.pop();
}

export function umbrella(B, x, z, y = 0, r = 1.4) {
  B.add('metal', roundGeo, x, y + 1.2, z, 0, [0.06, 2.4, 0.06]);
  B.add('fabric', coneGeo, x, y + 2.42, z, 0, [r, 0.4, r]);
}

/** A round planter with a shrub on top is made by the caller (shrub = tree species). */
export function planter(B, x, z, y = 0, r = 0.5) {
  B.add('plasterGrey', roundGeo, x, y + 0.25, z, 0, [r * 2, 0.5, r * 2]);
}
