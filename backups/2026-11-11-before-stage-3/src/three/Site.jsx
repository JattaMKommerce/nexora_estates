import { useLayoutEffect, useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { mulberry32 } from '../lib/random.js';
import { LOBBY_H, PLAZA_H, PLINTH_H } from './towerGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { worldMapped } from './textures.js';

/**
 * Generic urban context: asphalt streets, paved blocks, small parks and neighbouring buildings
 * with a windowed facade at real floor-to-floor scale. Deterministic, and deliberately quieter in
 * tone than the tower so the project stays the subject.
 */
function generateContext(dims, density) {
  const rnd = mulberry32(1337);
  const ROAD = 18;
  const BLOCK = Math.max(70, dims.width + 40, dims.depth + 50);
  const P = BLOCK + ROAD;
  const R = 6;
  const maxH = Math.max(24, dims.height * 0.62);
  const blocks = [];
  const lawns = [];
  const buildings = [];
  const trees = [];
  const addTree = (x, z, sc = 1) => trees.push({ x, z, s: sc * (0.8 + rnd() * 0.5), r: rnd() * Math.PI * 2 });

  for (let gx = -R; gx <= R; gx += 1) {
    for (let gz = -R; gz <= R; gz += 1) {
      const cx = gx * P;
      const cz = gz * P;
      const dist = Math.hypot(cx, cz);
      if (dist > R * P) continue;
      blocks.push({ x: cx, z: cz, w: BLOCK, h: 0.16, d: BLOCK });
      // street trees along the kerbs of the nearer blocks
      if (dist < 2.7 * P) {
        const e = BLOCK / 2 - 2.6;
        const n = Math.floor(BLOCK / 11);
        for (let k = 0; k <= n; k += 1) {
          const t = -e + (2 * e * k) / n;
          for (const [tx, tz] of [[t, -e], [t, e], [-e, t], [e, t]]) if (rnd() < 0.82) addTree(cx + tx, cz + tz);
        }
      }
      if (gx === 0 && gz === 0) {
        lawns.push({ x: cx, z: cz, w: BLOCK - 8, h: 0.2, d: BLOCK - 8 });
        continue; // the project site
      }
      if (rnd() > density) {
        lawns.push({ x: cx, z: cz, w: BLOCK - 10, h: 0.22, d: BLOCK - 10 });
        if (dist < 4 * P) {
          // a small park
          for (let k = 0; k < 14; k += 1) addTree(cx + (rnd() - 0.5) * (BLOCK - 22), cz + (rnd() - 0.5) * (BLOCK - 22), 1.2);
        }
        continue;
      }
      const near = dist < 2.2 * P;
      const count = 1 + Math.floor(rnd() * 3);
      for (let j = 0; j < count; j += 1) {
        const w = 16 + rnd() * 22;
        const d = 14 + rnd() * 20;
        const floors = Math.round((8 + Math.pow(rnd(), 2.2) * maxH * (near ? 0.55 : 1)) / 3.3);
        buildings.push({
          x: cx + (rnd() - 0.5) * (BLOCK - w - 8) * 0.9,
          z: cz + (rnd() - 0.5) * (BLOCK - d - 8) * 0.9,
          y: 0.16,
          w,
          h: Math.max(3, floors) * 3.3,
          d,
          r: rnd() < 0.2 ? (rnd() < 0.5 ? 0.5 : -0.35) * Math.PI * 0.5 : 0,
          tone: Math.floor(rnd() * TONES.length),
          glass: rnd() < 0.3
        });
      }
    }
  }
  return { blocks, lawns, buildings, trees };
}

const TONES = ['#cfcac2', '#c2bdb4', '#b4b9be', '#cbc2b4', '#adb3b9', '#bdb19f'];
const GLASS_TONES = ['#9fb3c1', '#a7b6bd', '#8fa3b3', '#b3bfc4', '#9aa9b0', '#a3aeb8'];

/** 3.3 m × 3.3 m facade module: two windows per module (or a curtain-wall grid), one storey high. */
function facadeTextures(kind = 'punched') {
  const S = 128;
  const make = (paint) => {
    const c = document.createElement('canvas');
    c.width = S;
    c.height = S;
    paint(c.getContext('2d'));
    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
    return t;
  };
  const win = (ctx, color) => {
    ctx.fillStyle = color;
    if (kind === 'curtain') {
      ctx.fillRect(3, 14, 58, 110);
      ctx.fillRect(67, 14, 58, 110);
    } else {
      for (const x of [8, 72]) ctx.fillRect(x, 26, 48, 84);
    }
  };
  const map = make((ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = '#dcdcdc';
    ctx.fillRect(0, 0, S, 10);
    win(ctx, kind === 'curtain' ? '#9aa6ae' : '#6b747c');
    ctx.fillStyle = '#7d7d7d'; // roof swatch (sampled by roofUV)
    ctx.fillRect(0, 0, 6, 6);
  });
  map.colorSpace = THREE.SRGBColorSpace;
  const rough = make((ctx) => {
    ctx.fillStyle = '#d9d9d9';
    ctx.fillRect(0, 0, S, S);
    win(ctx, '#141414');
  });
  const metal = make((ctx) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, S, S);
    win(ctx, kind === 'curtain' ? '#e6e6e6' : '#b4b4b4');
    ctx.fillRect(0, 0, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 6, 6);
  });
  return { map, rough, metal };
}

function InstancedBoxes({ items, material, castShadow = false, receiveShadow = false, colors = null }) {
  const ref = useRef();
  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const c = new THREE.Color();
    items.forEach((it, i) => {
      p.set(it.x, it.y || 0, it.z);
      s.set(it.w, it.h, it.d);
      q.setFromEuler(e.set(0, it.r || 0, 0));
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
      if (colors) mesh.setColorAt(i, c.set(colors[it.tone ?? 0]));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items, colors, material, geometry]);

  if (!items.length) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, items.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      raycast={() => null}
    />
  );
}

function facadeMaterial(kind) {
  const t = facadeTextures(kind);
  const m = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    map: t.map,
    roughnessMap: t.rough,
    metalnessMap: t.metal,
    roughness: 1,
    metalness: 1,
    envMapIntensity: 1
  });
  worldMapped(m, 3.3, { roofUV: [0.015, 0.985] });
  return { m, t };
}

/** Light street trees: an instanced trunk plus a lumpy, leaf-textured canopy (two draw calls in total). */
function Trees({ items, mats }) {
  const geo = useMemo(() => {
    const trunk = new THREE.CylinderGeometry(0.16, 0.24, 3.2, 7);
    trunk.translate(0, 1.6, 0);
    const parts = [];
    const lobes = [
      [0, 4.6, 0, 2.1],
      [0.9, 4.1, 0.4, 1.6],
      [-0.8, 4.3, -0.5, 1.7],
      [0.2, 5.4, -0.3, 1.5],
      [-0.4, 3.8, 0.8, 1.4]
    ];
    for (const [x, y, z, r] of lobes) {
      const g = new THREE.IcosahedronGeometry(r, 1);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i += 1) {
        const vx = p.getX(i);
        const vy = p.getY(i);
        const vz = p.getZ(i);
        const n = 1 + 0.16 * Math.sin(vx * 3.1 + vz * 2.3) * Math.cos(vy * 2.7 + vx);
        p.setXYZ(i, vx * n + x, vy * n * 0.85 + y, vz * n + z);
      }
      g.computeVertexNormals();
      parts.push(g);
    }
    const canopy = mergeGeometries(parts.map((g) => g.toNonIndexed()));
    parts.forEach((g) => g.dispose());
    return { trunk, canopy };
  }, []);
  useEffect(() => () => {
    geo.trunk.dispose();
    geo.canopy.dispose();
  }, [geo]);
  const list = useMemo(() => items.map((t) => ({ x: t.x, y: 0.16, z: t.z, w: t.s, h: t.s, d: t.s, r: t.r })), [items]);
  return (
    <>
      <InstancedMesh items={list} geometry={geo.trunk} material={mats.trunk} castShadow />
      <InstancedMesh items={list} geometry={geo.canopy} material={mats.foliage} castShadow receiveShadow />
    </>
  );
}

function InstancedMesh({ items, geometry, material, castShadow = false, receiveShadow = false }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    items.forEach((it, i) => {
      p.set(it.x, it.y || 0, it.z);
      s.set(it.w, it.h, it.d);
      q.setFromEuler(e.set(0, it.r || 0, 0));
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items, material, geometry]);
  if (!items.length) return null;
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow={castShadow} receiveShadow={receiveShadow} raycast={() => null} />;
}

export function Site({ dims, mats, density }) {
  const ctx = useMemo(() => generateContext(dims, density), [dims, density]);
  const facade = useMemo(() => ({ punched: facadeMaterial('punched'), curtain: facadeMaterial('curtain') }), []);
  useEffect(
    () => () => {
      for (const f of Object.values(facade)) {
        f.m.dispose();
        Object.values(f.t).forEach((t) => t.dispose());
      }
    },
    [facade]
  );
  const masonry = useMemo(() => ctx.buildings.filter((b) => !b.glass), [ctx]);
  const glassy = useMemo(() => ctx.buildings.filter((b) => b.glass), [ctx]);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} material={mats.ground} receiveShadow raycast={() => null}>
        <circleGeometry args={[1800, 64]} />
      </mesh>
      <InstancedBoxes items={ctx.blocks} material={mats.block} receiveShadow />
      <InstancedBoxes items={ctx.lawns} material={mats.lawn} receiveShadow />
      <InstancedBoxes items={masonry} material={facade.punched.m} castShadow receiveShadow colors={TONES} />
      <InstancedBoxes items={glassy} material={facade.curtain.m} castShadow receiveShadow colors={GLASS_TONES} />
      <Trees items={ctx.trees} mats={mats} />
    </group>
  );
}

/** Plaza, reflecting pool, planting and the double-height lobby (or a stone plinth when level 0 is residential). */
export function Podium({ dims, mats }) {
  const { width: W, depth: D, hasLobby } = dims;
  const noRay = () => null;
  const piers = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) piers.push([sx * (W / 2 - 0.5), sz * (D / 2 - 0.5)]);
  const hedges = [
    [-(W / 2 + 9), 0, 1.4, D + 16],
    [W / 2 + 9, 0, 1.4, D + 16],
    [-(W * 0.31 + 5), D / 2 + 13, 1.2, 9],
    [W * 0.31 + 5, D / 2 + 13, 1.2, 9]
  ];
  const lawns = [
    [-(W / 2 + 6.2), 0, 4.2, D + 14],
    [W / 2 + 6.2, 0, 4.2, D + 14]
  ];
  const plazaTrees = useMemo(() => {
    const t = [];
    for (const sx of [-1, 1]) {
      for (let k = 0; k < 4; k += 1) t.push({ x: sx * (W / 2 + 6.2), z: -D / 2 - 4 + k * ((D + 12) / 3), s: 1.05 + (k % 2) * 0.15, r: k * 1.7 });
    }
    return t;
  }, [W, D]);

  return (
    <group>
      <mesh position={[0, PLAZA_H / 2, 4]} material={mats.plaza} receiveShadow raycast={noRay}>
        <boxGeometry args={[W + 30, PLAZA_H, D + 42]} />
      </mesh>
      {lawns.map(([x, z, w, d], i) => (
        <mesh key={`l${i}`} position={[x, PLAZA_H + 0.04, z]} material={mats.lawn} receiveShadow raycast={noRay}>
          <boxGeometry args={[w, 0.08, d]} />
        </mesh>
      ))}

      <mesh position={[0, PLAZA_H + 0.06, D / 2 + 13]} material={mats.coping} receiveShadow raycast={noRay}>
        <boxGeometry args={[W * 0.62 + 0.8, 0.12, 9.8]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, PLAZA_H + 0.13, D / 2 + 13]} material={mats.water} raycast={noRay}>
        <planeGeometry args={[W * 0.62, 9]} />
      </mesh>

      <group position={[0, PLAZA_H - 0.16, 0]}>
        <Trees items={plazaTrees} mats={mats} />
      </group>
      {hedges.map(([x, z, w, d], i) => (
        <mesh key={i} position={[x, PLAZA_H + 0.45, z]} material={mats.hedge} castShadow receiveShadow raycast={noRay}>
          <boxGeometry args={[w, 0.9, d]} />
        </mesh>
      ))}

      {hasLobby ? (
        <group position={[0, PLAZA_H, 0]}>
          <mesh position={[0, (LOBBY_H - 0.4) / 2, 0]} material={mats.lobbyGlass} castShadow receiveShadow raycast={noRay}>
            <boxGeometry args={[W - 1.6, LOBBY_H - 0.4, D - 1.6]} />
          </mesh>
          {piers.map(([x, z], i) => (
            <mesh key={i} position={[x, LOBBY_H / 2, z]} material={mats.concrete} castShadow receiveShadow raycast={noRay}>
              <boxGeometry args={[1, LOBBY_H, 1]} />
            </mesh>
          ))}
          <mesh position={[0, LOBBY_H - 0.2, 0]} material={mats.concrete} castShadow receiveShadow raycast={noRay}>
            <boxGeometry args={[W + 0.6, 0.4, D + 0.6]} />
          </mesh>
          <mesh position={[0, 4.4, D / 2 + 3.2]} material={mats.concrete} castShadow receiveShadow raycast={noRay}>
            <boxGeometry args={[W * 0.42, 0.32, 6.4]} />
          </mesh>
          <mesh position={[0, 4.22, D / 2 + 3.2]} material={mats.warmLight} raycast={noRay}>
            <boxGeometry args={[W * 0.36, 0.04, 0.18]} />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, PLAZA_H + PLINTH_H / 2, 0]} material={mats.coping} castShadow receiveShadow raycast={noRay}>
          <boxGeometry args={[W + 0.6, PLINTH_H, D + 0.6]} />
        </mesh>
      )}
    </group>
  );
}
