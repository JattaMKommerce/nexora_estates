import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PLOT, GATE, PAD_Y, PODIUM, PARKING, inset } from './layout.js';
import { at, SCHEDULE } from './schedule.js';
import { mat } from '../materials.js';
import { rng } from '../world/geo.js';
import { W, sstep, ramp } from '../../core/world.js';

/**
 * The small things that make the model read as real: a construction hoarding and site cabins while
 * it is being built, and visitor parking with parked cars and hedge planters on the podium once it
 * is finished.
 */
const box = (w, h, d, x = 0, y = 0, z = 0) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);

/** Edge segments of a polygon, about `step` metres long, leaving the gate open. */
function segments(points, step) {
  const out = [];
  for (let i = 0; i < points.length; i++) {
    const [ax, az] = points[i];
    const [bx, bz] = points[(i + 1) % points.length];
    const len = Math.hypot(bx - ax, bz - az);
    const pieces = Math.max(1, Math.round(len / step));
    for (let k = 0; k < pieces; k++) {
      const t0 = k / pieces;
      const t1 = (k + 1) / pieces;
      const x0 = ax + (bx - ax) * t0;
      const z0 = az + (bz - az) * t0;
      const x1 = ax + (bx - ax) * t1;
      const z1 = az + (bz - az) * t1;
      const mx = (x0 + x1) / 2;
      const mz = (z0 + z1) / 2;
      if (Math.abs(mx - GATE.x) < GATE.w / 2 + 3 && mz > 48) continue;
      out.push({ x: mx, z: mz, len: Math.hypot(x1 - x0, z1 - z0) + 0.1, yaw: Math.atan2(-(z1 - z0), x1 - x0) });
    }
  }
  return out;
}

function Hoarding() {
  const segs = useMemo(() => segments(inset(PLOT, 1.4), 6), []);
  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(box(1, 2.6, 0.16, 0, 1.3, 0), mat.screen(), segs.length);
    m.castShadow = true;
    m.receiveShadow = true;
    m.frustumCulled = false;
    return m;
  }, [segs]);
  const o = useMemo(() => new THREE.Object3D(), []);
  const last = useRef(-1);
  useFrame(() => {
    const B = W.B;
    if (B === last.current) return;
    last.current = B;
    const up = ramp(B, SCHEDULE.hoarding[0], SCHEDULE.hoarding[1]) * segs.length;
    const off = sstep(B, SCHEDULE.hoardingOff[0], SCHEDULE.hoardingOff[1]);
    segs.forEach((s, i) => {
      const k = Math.min(1, Math.max(0, up - i)) * (1 - off);
      o.position.set(s.x, PAD_Y, s.z);
      o.rotation.set(0, s.yaw, 0);
      o.scale.set(s.len, Math.max(0.001, k), 1);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = up > 0.01 && off < 0.999;
  });
  return <primitive object={mesh} />;
}

const CABINS = [
  { x: 55, z: 43.5, y: 0, c: '#eeebe4' },
  { x: 61.5, z: 43.5, y: 0, c: '#a9bccb' },
  { x: 55, z: 43.5, y: 2.65, c: '#e3d6bb' },
  { x: 58, z: 47, y: 0, c: '#eeebe4' },
  { x: 64.5, z: 47, y: 0, c: '#eeebe4' }
];
function Cabins() {
  const mesh = useMemo(() => {
    const geo = mergeGeometries([box(6, 2.5, 2.4, 0, 1.25, 0), box(6.3, 0.15, 2.6, 0, 2.55, 0)]);
    const m = new THREE.InstancedMesh(geo, mat.vehicle(), CABINS.length);
    const o = new THREE.Object3D();
    CABINS.forEach((c, i) => {
      o.position.set(c.x, PAD_Y + c.y, c.z);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, new THREE.Color(c.c));
    });
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }, []);
  const g = useRef();
  useFrame(() => {
    const k = sstep(W.B, SCHEDULE.cabins[0], SCHEDULE.cabins[0] + 0.03) * (1 - sstep(W.B, SCHEDULE.cabins[1] - 0.03, SCHEDULE.cabins[1]));
    g.current.visible = k > 0.01;
    g.current.scale.set(1, Math.max(0.01, k), 1);
  });
  return (
    <group ref={g}>
      <primitive object={mesh} />
    </group>
  );
}

const CAR_COLORS = ['#f2f0ea', '#e6e6e3', '#c9ccce', '#f2f0ea', '#a7b3bd', '#d9cdb5', '#8f9aa3', '#efeee9', '#b9bfb5', '#cfb9a6'].map(
  (c) => new THREE.Color(c)
);
export function carGeometry() {
  const body = new THREE.BoxGeometry(4.4, 1.0, 1.9).translate(0, 0.7, 0);
  const cab = new THREE.BoxGeometry(2.4, 0.75, 1.72).translate(-0.25, 1.55, 0);
  return mergeGeometries([body, cab]);
}

function Parking() {
  const { x0, x1, z0, z1, bay } = PARKING;
  const base = useMemo(() => box(x1 - x0, 0.12, z1 - z0, (x0 + x1) / 2, PAD_Y + 0.06, (z0 + z1) / 2), [x0, x1, z0, z1]);
  const lines = useMemo(() => {
    const parts = [];
    for (let x = x0; x <= x1 + 0.01; x += bay) parts.push(box(0.14, 0.02, z1 - z0 - 0.6, x, PAD_Y + 0.13, (z0 + z1) / 2 + 0.3));
    return mergeGeometries(parts);
  }, [x0, x1, z0, z1, bay]);
  const cars = useMemo(() => {
    const r = rng(23);
    const list = [];
    for (let x = x0 + bay / 2; x < x1; x += bay) if (r() < 0.68) list.push({ x: x + (r() - 0.5) * 0.25, c: CAR_COLORS[Math.floor(r() * CAR_COLORS.length)], back: r() < 0.5 });
    const m = new THREE.InstancedMesh(carGeometry(), mat.vehicle(), list.length);
    const o = new THREE.Object3D();
    list.forEach((c, i) => {
      o.position.set(c.x, PAD_Y + 0.12, (z0 + z1) / 2 + 0.2);
      o.rotation.set(0, c.back ? Math.PI / 2 : -Math.PI / 2, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, c.c);
    });
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }, [x0, x1, z0, z1, bay]);
  const lineMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#f7f5ef' }), []);
  const g = useRef();
  const carsRef = useRef();
  useFrame(() => {
    const k = at(W.B, 'parking');
    g.current.visible = k > 0.01;
    // the bays are marked first, then the cars arrive
    carsRef.current.visible = k > 0.6;
  });
  return (
    <group ref={g}>
      <mesh geometry={base} material={mat.asphalt()} receiveShadow />
      <mesh geometry={lines} material={lineMat} />
      <group ref={carsRef}>
        <primitive object={cars} />
      </group>
    </group>
  );
}

/** Hedge planters along the podium deck's edges. */
function DeckHedges() {
  const geo = useMemo(() => {
    const { x0, x1, z0, z1, h } = PODIUM;
    const y = h + 0.45;
    const parts = [
      box(x1 - x0 - 3, 0.9, 1.1, (x0 + x1) / 2, y, z0 + 1.4),
      box(x1 - x0 - 3, 0.9, 1.1, (x0 + x1) / 2, y, z1 - 1.4),
      box(1.1, 0.9, z1 - z0 - 3, x0 + 1.4, y, (z0 + z1) / 2),
      box(1.1, 0.9, z1 - z0 - 3, x1 - 1.4, y, (z0 + z1) / 2)
    ];
    return mergeGeometries(parts);
  }, []);
  const g = useRef();
  useFrame(() => {
    const k = at(W.B, 'lawns');
    g.current.visible = k > 0.01;
    g.current.scale.set(1, Math.max(0.01, k), 1);
  });
  return (
    <group ref={g} position-y={PODIUM.h}>
      <mesh geometry={geo} position-y={-PODIUM.h} material={mat.hedge()} castShadow receiveShadow />
    </group>
  );
}

export default function Details() {
  return (
    <group>
      <Hoarding />
      <Cabins />
      <Parking />
      <DeckHedges />
    </group>
  );
}
