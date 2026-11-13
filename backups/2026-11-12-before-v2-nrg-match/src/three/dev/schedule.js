import { sstep } from '../../core/world.js';
import { PIT, PAD_Y } from './layout.js';

/**
 * The construction schedule on the build clock B (0–1). One place for every step's timing, so the
 * buildings, cranes, vehicles and captions stay in step.
 */
export const SCHEDULE = {
  grade: [0.0, 0.08],
  dig: [0.08, 0.17],
  basement: [0.17, 0.24],
  podiumColumns: [0.24, 0.3],
  podiumDeck: [0.29, 0.34],
  towerA: [0.28, 0.7],
  towerB: [0.31, 0.66],
  podiumWalls: [0.5, 0.6],
  club: [0.45, 0.62],
  wall: [0.52, 0.7],
  drive: [0.6, 0.7],
  lawns: [0.62, 0.78],
  play: [0.74, 0.82],
  planting: [0.66, 0.86],
  pool: [0.8, 0.84],
  hoarding: [0.015, 0.06],
  hoardingOff: [0.6, 0.66],
  cabins: [0.03, 0.88],
  parking: [0.66, 0.74],
  cranesUp: [0.11, 0.16],
  cranesDown: [0.84, 0.94]
};

export const at = (B, key) => sstep(B, SCHEDULE[key][0], SCHEDULE[key][1]);

/** Depth of the open excavation below the pad top (0 before digging and once the basement is in). */
export function pitFloorY(B) {
  if (B < SCHEDULE.basement[0]) return PAD_Y - PIT.depth * at(B, 'dig');
  return PAD_Y - PIT.depth * (1 - at(B, 'basement'));
}

/** Ground level for vehicles at (x, z) at build clock B. */
export function groundAt(x, z, B) {
  if (x > PIT.x0 && x < PIT.x1 && z > PIT.z0 && z < PIT.z1 && B > SCHEDULE.dig[0]) return pitFloorY(B);
  return PAD_Y;
}
