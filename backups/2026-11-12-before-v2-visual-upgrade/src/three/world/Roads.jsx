import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ROADS, ROAD_W, rng } from './geo.js';
import { mat } from '../materials.js';

/** A road as a raised strip of card with edges, following its smoothed deck height (bridges included). */
function ribbon(track, width, lift = 0.35, depth = 1.4) {
  const pts = track.pts;
  const n = pts.length;
  const top = [];
  const left = [];
  const right = [];
  const t = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    t.set(b.x - a.x, 0, b.z - a.z).normalize();
    const nx = -t.z;
    const nz = t.x;
    const y = track.h[i] + lift;
    const L = [pts[i].x + nx * width * 0.5, y, pts[i].z + nz * width * 0.5];
    const R = [pts[i].x - nx * width * 0.5, y, pts[i].z - nz * width * 0.5];
    top.push(L, R);
    left.push(L, [L[0], y - depth, L[2]]);
    right.push([R[0], y - depth, R[2]], R);
  }
  const strip = (arr) => {
    const pos = new Float32Array(arr.length * 3);
    arr.forEach((p, i) => pos.set(p, i * 3));
    const idx = [];
    for (let i = 0; i < n - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setIndex(idx);
    return g;
  };
  const g = mergeGeometries([strip(top), strip(left), strip(right)]);
  g.computeVertexNormals();
  return g;
}

function carGeometry() {
  const body = new THREE.BoxGeometry(4.4, 1.1, 1.9);
  body.translate(0, 0.75, 0);
  const cab = new THREE.BoxGeometry(2.3, 0.8, 1.7);
  cab.translate(-0.2, 1.65, 0);
  return mergeGeometries([body, cab]);
}

const TRAFFIC = [
  { road: 'main', n: 14, speed: 13 },
  { road: 'town', n: 6, speed: 10 },
  { road: 'ridge', n: 3, speed: 9 }
];

export default function Roads() {
  const geos = useMemo(() => Object.entries(ROADS).map(([name, t]) => ribbon(t, ROAD_W[name])), []);
  const cars = useMemo(() => {
    const r = rng(5);
    const list = [];
    for (const lane of TRAFFIC)
      for (let i = 0; i < lane.n; i++)
        list.push({ road: lane.road, u: r(), dir: r() > 0.5 ? 1 : -1, speed: lane.speed * (0.8 + r() * 0.4) });
    const m = new THREE.InstancedMesh(carGeometry(), mat.vehicle(), list.length);
    m.castShadow = false; // too small to matter, and they move every frame
    m.receiveShadow = true;
    m.frustumCulled = false;
    return { list, mesh: m };
  }, []);
  const o = useMemo(() => new THREE.Object3D(), []);
  const ref = useRef();

  useFrame((_, dt) => {
    const { list, mesh } = cars;
    list.forEach((c, i) => {
      const t = ROADS[c.road];
      c.u = (c.u + ((c.dir * c.speed * Math.min(dt, 0.05)) / t.len) + 1) % 1;
      const k = Math.min(t.pts.length - 2, Math.floor(c.u * (t.pts.length - 1)));
      const a = t.pts[k];
      const b = t.pts[k + 1];
      const f = c.u * (t.pts.length - 1) - k;
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz) || 1;
      const nx = -dz / len;
      const nz = dx / len;
      const lane = c.dir * 2.4;
      o.position.set(a.x + dx * f + nx * lane, t.h[k] + (t.h[k + 1] - t.h[k]) * f + 0.35, a.z + dz * f + nz * lane);
      o.rotation.set(0, Math.atan2(-dz, dx) + (c.dir < 0 ? Math.PI : 0), 0);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} material={mat.road()} receiveShadow castShadow />
      ))}
      <primitive object={cars.mesh} ref={ref} />
    </group>
  );
}
