import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mat } from '../materials.js';
import { W, sstep } from '../../core/world.js';
import { groundAt } from './schedule.js';

/** Small white site vehicles that arrive with the grading, work through construction and leave at the end. */
const box = (w, h, d, x, y, z) => {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g.toNonIndexed();
};
const cyl = (r, l, x, y, z) => {
  const g = new THREE.CylinderGeometry(r, r, l, 14);
  g.rotateZ(Math.PI / 2);
  g.translate(x, y, z);
  return g.toNonIndexed();
};

const SHAPES = {
  truck: () => mergeGeometries([box(2.4, 2.2, 2.4, 3.1, 1.6, 0), box(5.2, 1.7, 2.5, -0.9, 1.75, 0), box(8.4, 0.5, 2.2, 0.4, 0.55, 0)]),
  mixer: () => mergeGeometries([box(2.3, 2.2, 2.4, 3.2, 1.6, 0), cyl(1.25, 4.6, -0.6, 2.3, 0), box(8.2, 0.5, 2.2, 0.4, 0.55, 0)]),
  digger: () =>
    mergeGeometries([
      box(4.2, 0.9, 3.0, 0, 0.45, 0),
      box(3.6, 1.6, 2.6, -0.2, 1.7, 0),
      box(1.4, 1.4, 1.2, 0.8, 3.0, 0.6),
      (() => {
        const g = new THREE.BoxGeometry(5.2, 0.45, 0.45);
        g.rotateZ(0.55);
        g.translate(3.4, 3.4, 0);
        return g.toNonIndexed();
      })(),
      (() => {
        const g = new THREE.BoxGeometry(3.6, 0.4, 0.4);
        g.rotateZ(-1.0);
        g.translate(6.4, 3.0, 0);
        return g.toNonIndexed();
      })(),
      box(1.1, 0.9, 1.3, 7.3, 1.3, 0)
    ])
};

const FLEET = [
  { shape: 'digger', path: [[-40, -24], [-10, -30], [20, -22]], speed: 0.05, from: 0.06, to: 0.22 },
  { shape: 'digger', path: [[30, -40], [50, -12], [10, -8]], speed: 0.04, from: 0.08, to: 0.22 },
  { shape: 'truck', path: [[36, 60], [36, 12], [-40, 6], [20, 8]], speed: 0.03, from: 0.04, to: 0.9 },
  { shape: 'truck', path: [[36, 60], [40, 14], [62, 12], [30, 6], [-20, 4], [36, 20]], speed: 0.025, from: 0.05, to: 0.82 },
  { shape: 'mixer', path: [[36, 58], [36, 6], [-30, 4], [30, 10]], speed: 0.028, from: 0.16, to: 0.78 },
  { shape: 'mixer', path: [[45, 13], [68, 13], [60, 8], [40, 6]], speed: 0.022, from: 0.2, to: 0.74 },
  { shape: 'truck', path: [[-60, 6], [0, 6], [30, 12], [-30, 8]], speed: 0.03, from: 0.55, to: 0.95 }
];

export default function Vehicles() {
  const items = useMemo(
    () =>
      FLEET.map((v, i) => ({
        ...v,
        geo: SHAPES[v.shape](),
        curve: new THREE.CatmullRomCurve3(v.path.map(([x, z]) => new THREE.Vector3(x, 0, z)), true, 'centripetal'),
        phase: i * 0.37
      })),
    []
  );
  const refs = useRef([]);
  const p = useMemo(() => new THREE.Vector3(), []);
  const t = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const B = W.B;
    const time = state.clock.elapsedTime;
    items.forEach((v, i) => {
      const m = refs.current[i];
      if (!m) return;
      const k = sstep(B, v.from, v.from + 0.03) * (1 - sstep(B, v.to - 0.03, v.to));
      m.visible = k > 0.02;
      if (!m.visible) return;
      const u = (time * v.speed + v.phase + B * 3) % 1;
      v.curve.getPointAt(u, p);
      v.curve.getTangentAt(u, t);
      m.position.set(p.x, groundAt(p.x, p.z, B), p.z);
      m.rotation.y = Math.atan2(-t.z, t.x);
      m.scale.setScalar(k);
    });
  });

  return (
    <group>
      {items.map((v, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} geometry={v.geo} material={mat.vehicle()} castShadow receiveShadow />
      ))}
    </group>
  );
}
