import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TOWN, ROADS, ROAD_W, terrainHeight, rng, LANDMARKS, PYLON_LINE } from './geo.js';
import { mat, COLORS } from '../materials.js';
import { W } from '../../core/world.js';

/** Neighbourhood context: a town of low white blocks, a school, a station, and the power line. */
export { LANDMARKS, PYLON_LINE };

function clearOfRoads(x, z, pad) {
  for (const [name, t] of Object.entries(ROADS)) if (t.nearest(x, z).d < ROAD_W[name] / 2 + pad) return false;
  return true;
}

function townBlocks() {
  const r = rng(41);
  const out = [];
  for (const c of TOWN) {
    const n = Math.round(c.r * 0.34);
    for (let i = 0; i < n * 3 && out.length < 190; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * c.r;
      const x = c.x + Math.cos(a) * d;
      const z = c.z + Math.sin(a) * d;
      const w = 12 + r() * 16;
      const dd = 10 + r() * 12;
      if (!clearOfRoads(x, z, Math.max(w, dd) * 0.6 + 4)) continue;
      if (Object.values(LANDMARKS).some((l) => Math.hypot(l.x - x, l.z - z) < 42)) continue;
      if (out.some((b) => Math.abs(b.x - x) < (b.w + w) * 0.55 + 3 && Math.abs(b.z - z) < (b.d + dd) * 0.55 + 3)) continue;
      const floors = 2 + Math.floor(r() * r() * 6);
      out.push({ x, z, w, d: dd, h: floors * 3.2 + 0.8, rot: Math.round(r() * 3) * (Math.PI / 2) + (r() - 0.5) * 0.15 });
    }
  }
  return out;
}

function pylonGeometry() {
  const parts = [];
  const leg = (x, z) => {
    const g = new THREE.BoxGeometry(0.5, 30, 0.5);
    g.translate(0, 15, 0);
    const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(-z * 0.06, 0, x * 0.06));
    g.applyMatrix4(m);
    g.translate(x * 2.6, 0, z * 2.6);
    return g;
  };
  parts.push(leg(1, 1), leg(-1, 1), leg(1, -1), leg(-1, -1));
  for (const [y, w] of [
    [24, 13],
    [29, 9]
  ]) {
    const arm = new THREE.BoxGeometry(w, 0.6, 0.6);
    arm.translate(0, y, 0);
    parts.push(arm);
  }
  for (let y = 6; y < 28; y += 5.5) {
    const s = 5.2 - y * 0.12;
    const b1 = new THREE.BoxGeometry(s, 0.25, 0.25);
    b1.translate(0, y, s / 2);
    const b2 = b1.clone().translate(0, 0, -s);
    parts.push(b1, b2);
  }
  const top = new THREE.ConeGeometry(0.8, 4, 4);
  top.translate(0, 32, 0);
  parts.push(top);
  return mergeGeometries(parts.map((p) => p.toNonIndexed()));
}

export default function Context() {
  const blocks = useMemo(() => townBlocks(), []);
  const townMesh = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    const m = new THREE.InstancedMesh(g, mat.plaster(), blocks.length);
    const o = new THREE.Object3D();
    blocks.forEach((b, i) => {
      const y = Math.min(
        terrainHeight(b.x - b.w / 2, b.z - b.d / 2),
        terrainHeight(b.x + b.w / 2, b.z + b.d / 2),
        terrainHeight(b.x, b.z)
      );
      o.position.set(b.x, y - 0.5, b.z);
      o.rotation.set(0, b.rot, 0);
      o.scale.set(b.w, b.h + 0.5, b.d);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }, [blocks]);

  const landmarkGeo = useMemo(() => {
    const parts = [];
    const box = (x, z, w, d, h, yaw = 0) => {
      const g = new THREE.BoxGeometry(w, h, d);
      g.translate(0, h / 2, 0);
      g.rotateY(yaw);
      g.translate(x, terrainHeight(x, z) - 0.4, z);
      parts.push(g);
    };
    const s = LANDMARKS.school;
    box(s.x, s.z - 18, 64, 12, 10);
    box(s.x - 26, s.z + 2, 12, 34, 10);
    box(s.x + 26, s.z + 2, 12, 34, 7);
    const st = LANDMARKS.station;
    box(st.x, st.z, 74, 15, 8.5, -0.07);
    box(st.x, st.z, 80, 19, 0.9, -0.07);
    const mk = LANDMARKS.market;
    box(mk.x, mk.z, 46, 30, 7);
    box(mk.x + 30, mk.z + 4, 14, 22, 13);
    return mergeGeometries(parts);
  }, []);

  const field = useMemo(() => {
    const s = LANDMARKS.school;
    return { x: s.x, z: s.z + 40, y: terrainHeight(s.x, s.z + 40) + 0.15 };
  }, []);

  // pylons and cables (white; cyan while the power connection is being studied)
  const pylonMat = useMemo(() => new THREE.MeshStandardMaterial({ color: COLORS.plaster, roughness: 0.85, emissive: '#000000' }), []);
  const wireMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#8a8478', transparent: true, opacity: 0.7 }), []);
  const pylons = useMemo(() => {
    const geo = pylonGeometry();
    const m = new THREE.InstancedMesh(geo, pylonMat, PYLON_LINE.length - 1);
    const o = new THREE.Object3D();
    const tops = [];
    PYLON_LINE.slice(0, -1).forEach(([x, z], i) => {
      const nxt = PYLON_LINE[i + 1];
      const yaw = Math.atan2(-(nxt[1] - z), nxt[0] - x) + Math.PI / 2;
      const y = terrainHeight(x, z);
      o.position.set(x, y - 0.3, z);
      o.rotation.set(0, yaw, 0);
      o.scale.setScalar(1);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      tops.push({ x, z, y, yaw });
    });
    m.castShadow = true;
    // cables: three conductors with a gentle sag, into the substation
    const pts = [];
    const sub = LANDMARKS.substation;
    const ends = [...tops, { x: sub.x, z: sub.z, y: terrainHeight(sub.x, sub.z) - 16, yaw: tops[tops.length - 1].yaw }];
    for (const off of [-6, 0, 6]) {
      for (let i = 0; i < ends.length - 1; i++) {
        const a = ends[i];
        const b = ends[i + 1];
        const ay = a.y + (off === 0 ? 29 : 24);
        const by = b.y + (off === 0 ? 29 : 24);
        const ox = Math.cos(a.yaw) * off;
        const oz = -Math.sin(a.yaw) * off;
        for (let k = 0; k < 12; k++) {
          const t0 = k / 12;
          const t1 = (k + 1) / 12;
          const sag = (t) => -Math.sin(t * Math.PI) * 4;
          pts.push(
            new THREE.Vector3(a.x + (b.x - a.x) * t0 + ox, ay + (by - ay) * t0 + sag(t0), a.z + (b.z - a.z) * t0 + oz),
            new THREE.Vector3(a.x + (b.x - a.x) * t1 + ox, ay + (by - ay) * t1 + sag(t1), a.z + (b.z - a.z) * t1 + oz)
          );
        }
      }
    }
    const wires = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), wireMat);
    return { mesh: m, wires };
  }, [pylonMat, wireMat]);

  const substation = useMemo(() => {
    const s = LANDMARKS.substation;
    const y = terrainHeight(s.x, s.z);
    const parts = [];
    const r = rng(9);
    const pad = new THREE.BoxGeometry(44, 0.6, 32);
    pad.translate(0, 0.3, 0);
    parts.push(pad);
    for (let i = 0; i < 6; i++) {
      const g = new THREE.BoxGeometry(5 + r() * 3, 3 + r() * 3, 4 + r() * 2);
      g.translate(-14 + (i % 3) * 13, 2.5, -7 + Math.floor(i / 3) * 14);
      parts.push(g);
    }
    for (let i = 0; i < 4; i++) {
      const g = new THREE.BoxGeometry(0.4, 9, 0.4);
      g.translate(-16 + i * 10, 4.5, 0);
      parts.push(g);
    }
    const geo = mergeGeometries(parts.map((p) => p.toNonIndexed()));
    geo.translate(s.x, y, s.z);
    return geo;
  }, []);

  const cyan = useMemo(() => new THREE.Color(COLORS.holo), []);
  const white = useMemo(() => new THREE.Color(COLORS.plaster), []);
  const wireGrey = useMemo(() => new THREE.Color('#8a8478'), []);
  useFrame(() => {
    const k = W.holo.util;
    pylonMat.color.copy(white).lerp(cyan, k * 0.85);
    pylonMat.emissive.copy(cyan).multiplyScalar(k * 0.9);
    wireMat.color.copy(wireGrey).lerp(cyan, k);
    wireMat.opacity = 0.7 + k * 0.3;
  });

  return (
    <group>
      <primitive object={townMesh} />
      <mesh geometry={landmarkGeo} material={mat.plaster()} castShadow receiveShadow />
      <mesh position={[field.x, field.y, field.z]} rotation-x={-Math.PI / 2} material={mat.lawn()} receiveShadow>
        <planeGeometry args={[60, 34]} />
      </mesh>
      <primitive object={pylons.mesh} />
      <primitive object={pylons.wires} />
      <mesh geometry={substation} material={pylonMat} castShadow receiveShadow />
    </group>
  );
}
