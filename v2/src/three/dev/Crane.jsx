import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mat } from '../materials.js';
import { W, ramp, sstep } from '../../core/world.js';
import { FH, PODIUM } from './layout.js';
import { SCHEDULE } from './schedule.js';

/**
 * A tower crane beside each tower. It is erected after the foundations, climbs with the floors
 * (staying ~14 m above the newest slab), slews slowly while it works, and is dismantled once the
 * towers are complete.
 */
const SEG = 3; // mast section height
const box = (w, h, d, x, y, z) => {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g.toNonIndexed();
};

function mastSection() {
  const s = 1.9;
  const parts = [];
  for (const x of [-s / 2, s / 2]) for (const z of [-s / 2, s / 2]) parts.push(box(0.22, SEG, 0.22, x, SEG / 2, z));
  // diagonal braces on each face
  const brace = (rx, rz, x, z, rotY) => {
    const g = new THREE.BoxGeometry(0.1, Math.hypot(SEG, s), 0.1);
    g.rotateZ(Math.atan2(s, SEG) * rx);
    g.rotateY(rotY);
    g.translate(x, SEG / 2, z);
    return g.toNonIndexed();
  };
  parts.push(brace(1, 0, 0, s / 2, 0), brace(-1, 0, 0, -s / 2, 0), brace(1, 0, s / 2, 0, Math.PI / 2), brace(-1, 0, -s / 2, 0, Math.PI / 2));
  parts.push(box(s, 0.12, 0.12, 0, SEG - 0.06, s / 2), box(s, 0.12, 0.12, 0, SEG - 0.06, -s / 2));
  return mergeGeometries(parts);
}

function topAssembly() {
  const parts = [];
  // slewing ring and cab
  parts.push(box(2.6, 1.4, 2.6, 0, 0.7, 0));
  parts.push(box(1.6, 1.6, 1.8, 1.4, 1.9, 1.3));
  // jib (triangular lattice approximated): two bottom chords, one top chord, ties
  const L = 46;
  parts.push(box(L, 0.18, 0.18, L / 2, 1.5, 0.55), box(L, 0.18, 0.18, L / 2, 1.5, -0.55), box(L, 0.16, 0.16, L / 2, 2.6, 0));
  for (let x = 1.5; x < L; x += 2.3) {
    const g = new THREE.BoxGeometry(0.08, 1.35, 0.08);
    g.rotateZ(((x / 2.3) % 2 < 1 ? 1 : -1) * 0.7);
    g.translate(x, 2.05, 0);
    parts.push(g.toNonIndexed());
  }
  // counter-jib with counterweights
  parts.push(box(14, 0.3, 1.4, -7, 1.5, 0), box(3.4, 2.2, 1.9, -12, 0.6, 0));
  // A-frame and pendants
  parts.push(box(0.3, 6, 0.3, 0, 4.4, 0.6), box(0.3, 6, 0.3, 0, 4.4, -0.6));
  const tie = (len, ang, x) => {
    const g = new THREE.BoxGeometry(len, 0.06, 0.06);
    g.rotateZ(ang);
    g.translate(x, 0, 0);
    return g.toNonIndexed();
  };
  const t1 = tie(26, -0.19, 13);
  t1.translate(0, 4.9, 0);
  const t2 = tie(13.5, 0.36, -6.7);
  t2.translate(0, 4.9, 0);
  parts.push(t1, t2);
  return mergeGeometries(parts);
}

export default function Crane({ x, z, floors, window: [b0, b1], up = SCHEDULE.cranesUp, down = SCHEDULE.cranesDown, phase = 0, yaw0 = 0 }) {
  const mast = useMemo(() => {
    const sec = mastSection();
    const count = Math.ceil((PODIUM.h + floors * FH + 30) / SEG) + 2;
    const parts = [];
    for (let i = 0; i < count; i++) parts.push(sec.clone().translate(0, i * SEG, 0));
    const g = mergeGeometries(parts);
    g.userData.perSeg = sec.attributes.position.count;
    return g;
  }, [floors]);
  const top = useMemo(() => topAssembly(), []);
  const hookGeo = useMemo(() => mergeGeometries([box(0.05, 1, 0.05, 0, -0.5, 0), box(0.9, 0.6, 0.6, 0, -1.1, 0)]), []);
  const mastRef = useRef();
  const topRef = useRef();
  const hookRef = useRef();
  const group = useRef();

  useFrame((state) => {
    const B = W.B;
    const erect = sstep(B, up[0], up[1]);
    const gone = sstep(B, down[0], down[1]);
    const builtTop = PODIUM.h + ramp(B, b0, b1) * floors * FH;
    const target = Math.max(22, builtTop + 14);
    const h = target * erect * (1 - gone);
    const visible = h > 0.6;
    group.current.visible = visible;
    if (!visible) return;
    const segs = Math.max(1, Math.ceil(h / SEG));
    mastRef.current.geometry.setDrawRange(0, segs * mast.userData.perSeg);
    const topY = segs * SEG;
    const working = B > up[1] && B < down[0];
    const t = state.clock.elapsedTime;
    topRef.current.position.y = topY;
    topRef.current.rotation.y = yaw0 + (working ? Math.sin(t * 0.13 + phase) * 1.1 + B * 9 : 0);
    topRef.current.visible = erect > 0.85 && gone < 0.15;
    const trolley = 14 + 16 * (0.5 + 0.5 * Math.sin(t * 0.21 + phase * 2));
    const drop = 6 + 10 * (0.5 + 0.5 * Math.sin(t * 0.17 + phase));
    hookRef.current.position.set(trolley, 1.4, 0);
    hookRef.current.scale.set(1, 1, 1);
    hookRef.current.children[0].scale.y = drop;
    hookRef.current.children[0].position.y = -drop / 2;
    hookRef.current.children[1].position.y = -drop;
  });

  return (
    <group ref={group} position={[x, 0, z]}>
      <mesh ref={mastRef} geometry={mast} material={mat.plaster()} castShadow />
      <group ref={topRef}>
        <mesh geometry={top} material={mat.plaster()} castShadow />
        <group ref={hookRef}>
          <mesh material={mat.dark()}>
            <boxGeometry args={[0.05, 1, 0.05]} />
          </mesh>
          <mesh geometry={hookGeo} material={mat.dark()} />
        </group>
      </group>
    </group>
  );
}
