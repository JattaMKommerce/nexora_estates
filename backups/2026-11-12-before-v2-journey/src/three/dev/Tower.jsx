import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FH, PODIUM } from './layout.js';
import { mat } from '../materials.js';
import { W, ramp } from '../../core/world.js';

/**
 * One residential tower, built floor by floor from the project data. Each floor rises in sequence:
 * its slab is cast, the columns grow up to the next level, and the glazing, fins and balcony
 * parapets follow a few floors behind, panel by panel. Run the build clock backwards and it
 * dismantles in the same order.
 */
const box = (w, h, d, x = 0, y = 0, z = 0) => {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
};

export function towerGeometries(w, d) {
  const hw = w / 2;
  const hd = d / 2;
  // slab with corner balconies, one floor
  const slab = mergeGeometries([
    box(w + 0.6, 0.38, d + 0.6, 0, 0.19, 0),
    box(9, 0.34, 2.4, -hw + 4.5, 0.17, hd + 1.5),
    box(9, 0.34, 2.4, hw - 4.5, 0.17, hd + 1.5),
    box(9, 0.34, 2.4, -hw + 4.5, 0.17, -hd - 1.5),
    box(9, 0.34, 2.4, hw - 4.5, 0.17, -hd - 1.5),
    box(2.4, 0.34, 7, hw + 1.5, 0.17, 0),
    box(2.4, 0.34, 7, -hw - 1.5, 0.17, 0)
  ]);
  // structural columns of one storey (unit height, scaled per floor)
  const cols = [];
  for (const cx of [-hw + 0.6, -hw / 3, hw / 3, hw - 0.6]) for (const cz of [-hd + 0.6, hd - 0.6]) cols.push(box(0.75, 1, 0.75, cx, 0.5, cz));
  for (const cz of [-hd / 3, hd / 3]) for (const cx of [-hw + 0.6, hw - 0.6]) cols.push(box(0.75, 1, 0.75, cx, 0.5, cz));
  const columns = mergeGeometries(cols);
  // glazing (one storey)
  const glass = box(w - 0.9, FH - 0.38, d - 0.9, 0, 0.38 + (FH - 0.38) / 2, 0);
  // vertical fins on the four faces + balcony parapets (one storey)
  const fins = [];
  const fh = FH - 0.38;
  for (let x = -hw + 1.6; x <= hw - 1.5; x += 2.35) {
    fins.push(box(0.22, fh, 0.55, x, 0.38 + fh / 2, hd - 0.2));
    fins.push(box(0.22, fh, 0.55, x, 0.38 + fh / 2, -hd + 0.2));
  }
  for (let z = -hd + 1.6; z <= hd - 1.5; z += 2.35) {
    fins.push(box(0.55, fh, 0.22, hw - 0.2, 0.38 + fh / 2, z));
    fins.push(box(0.55, fh, 0.22, -hw + 0.2, 0.38 + fh / 2, z));
  }
  const par = 1.05;
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      fins.push(box(9, par, 0.14, sx * (hw - 4.5), 0.38 + par / 2, sz * (hd + 2.65)));
      fins.push(box(0.14, par, 2.4, sx * (hw - 0.05) + sx * 0, 0.38 + par / 2, sz * (hd + 1.5)));
    }
  for (const sx of [-1, 1]) fins.push(box(0.14, par, 7, sx * (hw + 2.65), 0.38 + par / 2, 0));
  const finGeo = mergeGeometries(fins);
  return { slab, columns, glass, fins: finGeo };
}

function instanced(geo, material, count, cast = true) {
  const m = new THREE.InstancedMesh(geo, material, Math.max(1, count));
  m.castShadow = cast;
  m.receiveShadow = true;
  m.count = 0;
  m.frustumCulled = false;
  return m;
}

/**
 * spec: { x, z, w, d, floors, top, crown } · window: [b0, b1] the part of the build clock in which
 * this tower's structure rises (the facade follows ~3 floors behind and finishes slightly later).
 */
export default function Tower({ spec, window: [b0, b1] }) {
  const N = spec.floors;
  const parts = useMemo(() => {
    const g = towerGeometries(spec.w, spec.d);
    const slab = instanced(g.slab, mat.plaster(), N + 1);
    const cols = instanced(g.columns, mat.plasterShade(), N);
    const glass = instanced(g.glass, mat.glass(), N, false);
    const fins = instanced(g.fins, mat.plaster(), N);
    const o = new THREE.Object3D();
    const place = (m, i, sy = 1, sx = 1) => {
      o.position.set(0, PODIUM.h + i * FH, 0);
      o.scale.set(sx, sy, 1);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    };
    for (let i = 0; i <= N; i++) place(slab, i);
    // the core, roof plant and crown
    const core = new THREE.Mesh(box(9, 1, 7, 0, 0.5, 0), mat.plasterShade());
    core.castShadow = true;
    const crownGeo = mergeGeometries([
      box(spec.w + 0.6, 1.2, 0.3, 0, 0.6, spec.d / 2 + 0.15),
      box(spec.w + 0.6, 1.2, 0.3, 0, 0.6, -spec.d / 2 - 0.15),
      box(0.3, 1.2, spec.d + 0.6, spec.w / 2 + 0.15, 0.6, 0),
      box(0.3, 1.2, spec.d + 0.6, -spec.w / 2 - 0.15, 0.6, 0),
      box(10, 4.2, 8, -3, 2.1, -2),
      box(5, 2.4, 4, 8, 1.2, 3),
      box(14, 0.3, 9, 3, 4.6, 2),
      ...[-3, 3, 9].flatMap((x) => [box(0.3, 4.4, 0.3, x, 2.2, -2), box(0.3, 4.4, 0.3, x, 2.2, 6)])
    ]);
    const crown = new THREE.Mesh(crownGeo, mat.plaster());
    crown.castShadow = true;
    crown.receiveShadow = true;
    // the climbing screen that wraps the top two storeys while the structure rises
    const sw = spec.w + 2.2;
    const sd = spec.d + 2.2;
    const sh = FH * 2 + 1.2;
    const screen = new THREE.Mesh(
      mergeGeometries([
        box(sw, sh, 0.3, 0, sh / 2, sd / 2),
        box(sw, sh, 0.3, 0, sh / 2, -sd / 2),
        box(0.3, sh, sd, sw / 2, sh / 2, 0),
        box(0.3, sh, sd, -sw / 2, sh / 2, 0),
        ...[0.25, 0.5, 0.75].flatMap((t) => [box(sw + 0.2, 0.18, 0.4, 0, sh * t, sd / 2), box(sw + 0.2, 0.18, 0.4, 0, sh * t, -sd / 2)])
      ]),
      mat.screen()
    );
    screen.castShadow = true;
    screen.receiveShadow = true;
    // a roof garden inside the parapet
    const garden = new THREE.Mesh(box(spec.w - 3, 0.4, spec.d - 3, 0, 0.2, 0), mat.lawn());
    garden.receiveShadow = true;
    return { slab, cols, glass, fins, core, crown, screen, garden, o };
  }, [spec.w, spec.d, N]);

  const last = useMemo(() => ({ B: -1 }), []);
  const m4 = useMemo(() => new THREE.Matrix4(), []);
  const s4 = useMemo(() => new THREE.Matrix4(), []);

  useFrame(() => {
    const B = W.B;
    if (B === last.B) return;
    last.B = B;
    const { slab, cols, glass, fins, core, crown, screen, garden } = parts;
    // structure: floors 0..N (fractional); slab i is cast, then the columns of storey i grow
    const f = ramp(B, b0, b1) * N;
    const built = Math.floor(f);
    const part = f - built;
    slab.count = Math.min(N, built + (part > 0 ? 1 : 0)) + (f >= N ? 1 : 0);
    cols.count = Math.min(N, built + (part > 0 ? 1 : 0));
    for (let i = 0; i < cols.count; i++) {
      const k = i < built ? 1 : Math.max(0.02, part);
      m4.makeTranslation(0, PODIUM.h + i * FH + 0.38, 0).multiply(s4.makeScale(1, (FH - 0.38) * k, 1));
      cols.setMatrixAt(i, m4);
    }
    cols.instanceMatrix.needsUpdate = true;
    // facade: follows three floors behind, then catches up; the newest storey's panels close in sideways
    const fEnd = b1 + (b1 - b0) * 0.12;
    const fc = Math.max(0, Math.min(N, ramp(B, b0 + (b1 - b0) * (3 / N), fEnd) * N));
    const cb = Math.floor(fc);
    const cp = fc - cb;
    glass.count = Math.min(N, cb + (cp > 0 ? 1 : 0));
    fins.count = glass.count;
    for (let i = 0; i < glass.count; i++) {
      const k = i < cb ? 1 : Math.max(0.02, cp);
      m4.makeTranslation(0, PODIUM.h + i * FH, 0).multiply(s4.makeScale(k, 1, 1));
      glass.setMatrixAt(i, m4);
      fins.setMatrixAt(i, m4);
    }
    glass.instanceMatrix.needsUpdate = true;
    fins.instanceMatrix.needsUpdate = true;
    // the core leads the floors a little
    const coreH = Math.min(N * FH + 3, f * FH + (f > 0 ? 3.5 : 0));
    core.visible = B > b0 - 0.02 && coreH > 0.05;
    core.position.y = PODIUM.h - 0.2;
    core.scale.y = Math.max(0.01, coreH + 0.2);
    // crown once topped out
    const c = ramp(B, b1, b1 + 0.035);
    crown.visible = c > 0;
    crown.position.y = PODIUM.h + N * FH + 0.38;
    crown.scale.set(1, Math.max(0.01, c), 1);
    garden.visible = c > 0.6;
    garden.position.y = PODIUM.h + N * FH + 0.38;
    // the screen climbs with the newest floors and is taken down once the tower tops out
    const sOn = f > 1.2 && f < N - 0.05;
    screen.visible = sOn;
    if (sOn) screen.position.y = PODIUM.h + Math.max(0, Math.min(N - 2, f - 1.6)) * FH;
  });

  return (
    <group position={[spec.x, 0, spec.z]}>
      <primitive object={parts.slab} />
      <primitive object={parts.cols} />
      <primitive object={parts.glass} />
      <primitive object={parts.fins} />
      <primitive object={parts.core} />
      <primitive object={parts.crown} />
      <primitive object={parts.screen} />
      <primitive object={parts.garden} />
    </group>
  );
}
