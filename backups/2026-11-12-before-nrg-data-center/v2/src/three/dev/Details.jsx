import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PLOT, GATE, PAD_Y, PODIUM, PARKING, inset } from './layout.js';
import { at, SCHEDULE } from './schedule.js';
import { mat } from '../materials.js';
import { rng, terrainHeight } from '../world/geo.js';
import { foamTree } from '../world/Trees.jsx';
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
  { x: 61.5, z: 43.5, y: 0, c: '#ddd2bd' },
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

/** Building materials laid out on the pad while the work is on: pipe stacks, precast panels, rebar cages. */
function Materials() {
  const geo = useMemo(() => {
    const parts = [];
    const pipes = (x, z, rows, yaw) => {
      for (let r = 0; r < rows; r++)
        for (let i = 0; i < rows - r; i++) {
          const g = new THREE.CylinderGeometry(0.55, 0.55, 9, 10).rotateZ(Math.PI / 2);
          g.translate(0, 0.55 + r * 0.95, (i - (rows - r - 1) / 2) * 1.12);
          g.rotateY(yaw);
          g.translate(x, PAD_Y, z);
          parts.push(g.toNonIndexed());
        }
    };
    const panels = (x, z, n, yaw) => {
      for (let i = 0; i < n; i++) {
        const g = box(7.5, 0.32, 3.2, 0, 0.16 + i * 0.36, 0).rotateY(yaw + (i % 2) * 0.03).translate(x, PAD_Y, z);
        parts.push(g.toNonIndexed());
      }
    };
    const cage = (x, z, yaw) => {
      const w = 6;
      const d = 1.6;
      const h = 1.6;
      for (let i = 0; i <= 6; i++) parts.push(box(0.08, h, 0.08, -w / 2 + (i * w) / 6, h / 2, -d / 2).rotateY(yaw).translate(x, PAD_Y, z).toNonIndexed());
      for (let i = 0; i <= 6; i++) parts.push(box(0.08, h, 0.08, -w / 2 + (i * w) / 6, h / 2, d / 2).rotateY(yaw).translate(x, PAD_Y, z).toNonIndexed());
      parts.push(box(w, 0.08, 0.08, 0, h, -d / 2).rotateY(yaw).translate(x, PAD_Y, z).toNonIndexed());
      parts.push(box(w, 0.08, 0.08, 0, h, d / 2).rotateY(yaw).translate(x, PAD_Y, z).toNonIndexed());
      parts.push(box(w, 0.08, d, 0, 0.05, 0).rotateY(yaw).translate(x, PAD_Y, z).toNonIndexed());
    };
    pipes(-48, 24, 4, 0.1);
    pipes(-30, 40, 3, -0.2);
    pipes(6, 46, 3, 0.05);
    panels(-56, 40, 6, 0.0);
    panels(-40, 30, 5, 0.3);
    panels(-14, 26, 7, -0.1);
    panels(12, 34, 4, 0.2);
    cage(-22, 44, 0.1);
    cage(-6, 38, -0.15);
    cage(18, 24, 0.4);
    cage(-60, 28, 1.4);
    return mergeGeometries(parts);
  }, []);
  const g = useRef();
  useFrame(() => {
    const k = sstep(W.B, 0.05, 0.09) * (1 - sstep(W.B, 0.56, 0.62));
    g.current.visible = k > 0.01;
    g.current.scale.set(1, Math.max(0.01, k), 1);
  });
  return (
    <group ref={g}>
      <mesh geometry={geo} material={mat.plasterShade()} castShadow receiveShadow />
    </group>
  );
}

/**
 * The finished amenities: a resort pool with a stone deck, loungers and umbrellas in the main
 * garden, a footpath loop with benches, lamp posts along the drives, and a tree-lined boulevard
 * from the main road to the gate. They arrive with the landscape.
 */
function Amenities() {
  const geo = useMemo(() => {
    const deck = [];
    const white = [];
    const bronze = [];
    const canopy = [];
    const path = [];
    // the pool deck (stone) and loungers along its north side
    const P = { x: -14, z: 36, w: 20, d: 8 };
    deck.push(box(P.w + 5, 0.32, P.d + 5, P.x, PAD_Y + 0.16, P.z).toNonIndexed());
    for (let i = 0; i < 7; i++) {
      const x = P.x - P.w / 2 + 1.6 + i * 2.8;
      white.push(box(0.8, 0.28, 2.0, x, PAD_Y + 0.5, P.z - P.d / 2 - 1.5).toNonIndexed());
      white.push(box(0.8, 0.5, 0.18, x, PAD_Y + 0.68, P.z - P.d / 2 - 2.4).toNonIndexed());
    }
    for (const x of [P.x - 7, P.x + 1, P.x + 9]) {
      bronze.push(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 6).translate(x, PAD_Y + 1.6, P.z + P.d / 2 + 1.6).toNonIndexed());
      canopy.push(new THREE.ConeGeometry(1.5, 0.55, 8).translate(x, PAD_Y + 2.95, P.z + P.d / 2 + 1.6).toNonIndexed());
    }
    // a footpath loop around the garden, with benches
    const loop = [];
    for (let i = 0; i <= 48; i++) {
      const t = (i / 48) * Math.PI * 2;
      loop.push([P.x + Math.cos(t) * 17, P.z + Math.sin(t) * 11.5]);
    }
    for (let i = 0; i < loop.length - 1; i++) {
      const [ax, az] = loop[i];
      const [bx, bz] = loop[i + 1];
      const len = Math.hypot(bx - ax, bz - az);
      const g = new THREE.BoxGeometry(len + 0.2, 0.08, 1.6);
      g.rotateY(Math.atan2(-(bz - az), bx - ax));
      g.translate((ax + bx) / 2, PAD_Y + 0.33, (az + bz) / 2);
      path.push(g.toNonIndexed());
      if (i % 8 === 4) white.push(box(1.8, 0.45, 0.6, (ax + bx) / 2, PAD_Y + 0.5, (az + bz) / 2 + (az > P.z ? 1.3 : -1.3)).toNonIndexed());
    }
    // lamp posts along the arrival court and the drive
    const lamp = (x, z) => {
      bronze.push(new THREE.CylinderGeometry(0.07, 0.09, 4.2, 6).translate(x, PAD_Y + 2.1, z).toNonIndexed());
      bronze.push(box(0.9, 0.12, 0.3, x + 0.35, PAD_Y + 4.2, z).toNonIndexed());
    };
    for (let x = -56; x <= 56; x += 14) lamp(x, 11.5);
    for (let z = 20; z <= 58; z += 12) lamp(31, z);
    return {
      deck: mergeGeometries(deck),
      white: mergeGeometries(white),
      bronze: mergeGeometries(bronze),
      canopy: mergeGeometries(canopy),
      path: mergeGeometries(path),
      pool: { ...P }
    };
  }, []);
  const boulevard = useMemo(() => {
    const list = [];
    for (let z = 70; z <= 100; z += 7.5) for (const x of [28, 44]) list.push([x, z]);
    const m = new THREE.InstancedMesh(foamTree(63, { blobs: 6 }), mat.boulevardTree(), list.length);
    const o = new THREE.Object3D();
    list.forEach(([x, z], i) => {
      o.position.set(x, terrainHeight(x, z), z);
      o.scale.setScalar(3.4);
      o.rotation.y = i * 2.1;
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }, []);
  const canopyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f1e7d4', roughness: 0.9 }), []);
  const g = useRef();
  const water = useRef();
  const trees = useRef();
  useFrame(() => {
    const k = at(W.B, 'lawns');
    g.current.visible = k > 0.5;
    water.current.visible = at(W.B, 'pool') > 0.02;
    water.current.scale.y = Math.max(0.01, at(W.B, 'pool'));
    trees.current.visible = at(W.B, 'planting') > 0.2;
  });
  return (
    <group>
      <group ref={g}>
        <mesh geometry={geo.deck} material={mat.deckStone()} receiveShadow castShadow />
        <mesh geometry={geo.path} material={mat.deckStone()} receiveShadow />
        <mesh geometry={geo.white} material={mat.plaster()} castShadow receiveShadow />
        <mesh geometry={geo.bronze} material={mat.bronze()} castShadow />
        <mesh geometry={geo.canopy} material={canopyMat} castShadow />
      </group>
      <mesh ref={water} position={[geo.pool.x, PAD_Y + 0.27, geo.pool.z]} material={mat.pool()}>
        <boxGeometry args={[geo.pool.w, 0.12, geo.pool.d]} />
      </mesh>
      <group ref={trees}>
        <primitive object={boulevard} />
      </group>
    </group>
  );
}

export default function Details() {
  return (
    <group>
      <Amenities />
      <Materials />
      <Hoarding />
      <Cabins />
      <Parking />
      <DeckHedges />
    </group>
  );
}
