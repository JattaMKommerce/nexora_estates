import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  PLOT,
  GATE,
  PAD_Y,
  PIT,
  PODIUM,
  CLUB,
  PLAY,
  POOL,
  LAWNS_DECK,
  LAWNS_GROUND,
  DRIVE,
  planShape,
  rectPoints,
  inset,
  towerSpecs
} from './layout.js';
import { at, pitFloorY, SCHEDULE } from './schedule.js';
import Tower from './Tower.jsx';
import Crane from './Crane.jsx';
import Vehicles from './Vehicles.jsx';
import { mat, COLORS } from '../materials.js';
import { foamTree } from '../world/Trees.jsx';
import { rng } from '../world/geo.js';
import { W, ramp } from '../../core/world.js';

const box = (w, h, d, x = 0, y = 0, z = 0) => {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
};

/** Pad material: the graded ground spreads out from the gate, with a band of freshly dug earth at its edge. */
function makeRevealMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: COLORS.pad, roughness: 0.96 });
  const u = { uR: { value: 0 }, uC: { value: new THREE.Vector2(GATE.x, GATE.z) }, uDug: { value: new THREE.Color(COLORS.dug) } };
  m.userData.u = u;
  m.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vW2;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW2 = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vW2;\nuniform float uR;\nuniform vec2 uC;\nuniform vec3 uDug;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float dR = length(vW2.xz - uC);
        if (dR > uR) discard;
        diffuseColor.rgb = mix(diffuseColor.rgb, uDug, smoothstep(uR - 10.0, uR - 1.0, dR) * step(uR, 180.0));`
      );
  };
  m.customProgramCacheKey = () => 'pad-reveal';
  return m;
}

function Ground() {
  const padGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(planShape(PLOT, [rectPoints(PIT.x0, PIT.z0, PIT.x1, PIT.z1)]), { depth: PAD_Y, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const padMat = useMemo(() => makeRevealMaterial(), []);
  const cap = useRef();
  const pit = useRef();
  const base = useRef();
  const pw = PIT.x1 - PIT.x0;
  const pd = PIT.z1 - PIT.z0;
  const pcx = (PIT.x0 + PIT.x1) / 2;
  const pcz = (PIT.z0 + PIT.z1) / 2;

  useFrame(() => {
    const B = W.B;
    padMat.userData.u.uR.value = at(B, 'grade') * 185;
    const digging = B > SCHEDULE.dig[0];
    cap.current.visible = !digging && B > 0;
    const floor = pitFloorY(B);
    pit.current.visible = digging && B < SCHEDULE.basement[1] + 0.01;
    const h = Math.max(0.05, PAD_Y - floor);
    pit.current.scale.y = h;
    pit.current.position.y = PAD_Y - h / 2;
    base.current.visible = B > SCHEDULE.basement[0];
    const bh = Math.max(0.05, floor - (PAD_Y - PIT.depth));
    base.current.scale.y = bh;
    base.current.position.y = PAD_Y - PIT.depth + bh / 2;
  });

  return (
    <group>
      <mesh geometry={padGeo} material={padMat} receiveShadow castShadow />
      <mesh ref={cap} position={[pcx, PAD_Y / 2, pcz]} material={padMat} receiveShadow>
        <boxGeometry args={[pw, PAD_Y, pd]} />
      </mesh>
      <mesh ref={pit} position={[pcx, 0, pcz]} material={mat.dug()} receiveShadow>
        <boxGeometry args={[pw, 1, pd]} />
      </mesh>
      <mesh ref={base} position={[pcx, 0, pcz]} material={mat.plasterShade()} receiveShadow castShadow>
        <boxGeometry args={[pw - 0.3, 1, pd - 0.3]} />
      </mesh>
    </group>
  );
}

function Podium({ specs }) {
  const cols = useMemo(() => {
    const pts = [];
    for (let x = PODIUM.x0 + 3; x <= PODIUM.x1 - 3; x += 8.4)
      for (let z = PODIUM.z0 + 3; z <= PODIUM.z1 - 3; z += 8.4) {
        if (specs.some((t) => Math.abs(x - t.x) < t.w / 2 + 1 && Math.abs(z - t.z) < t.d / 2 + 1)) continue;
        pts.push([x, z]);
      }
    const h = PODIUM.h - 0.5 - PAD_Y;
    return mergeGeometries(pts.map(([x, z]) => box(0.8, h, 0.8, x, h / 2, z)));
  }, [specs]);
  const deck = useMemo(() => {
    const w = PODIUM.x1 - PODIUM.x0;
    const d = PODIUM.z1 - PODIUM.z0;
    // the deck, with the towers' footprints left open for their cores
    const holes = specs.map((t) => rectPoints(t.x - t.w / 2 + 0.3, t.z - t.d / 2 + 0.3, t.x + t.w / 2 - 0.3, t.z + t.d / 2 - 0.3));
    const g = new THREE.ExtrudeGeometry(planShape(rectPoints(0, PODIUM.z0, w, PODIUM.z1), holes.map((h) => h.map(([x, z]) => [x - PODIUM.x0, z]))), {
      depth: 0.5,
      bevelEnabled: false
    });
    g.rotateX(-Math.PI / 2);
    return g;
  }, [specs]);
  const walls = useMemo(() => {
    const h = PODIUM.h - 0.5 - PAD_Y;
    const { x0, x1, z0, z1 } = PODIUM;
    const parts = [box(x1 - x0, h, 0.4, (x0 + x1) / 2, h / 2, z0), box(0.4, h, z1 - z0, x0, h / 2, (z0 + z1) / 2), box(0.4, h, z1 - z0, x1, h / 2, (z0 + z1) / 2)];
    // the south front: wall with the two double-height glass lobbies
    const gaps = specs.map((t) => [t.x - 7, t.x + 7]).sort((a, b) => a[0] - b[0]);
    let x = x0;
    for (const [g0, g1] of gaps) {
      if (g0 > x) parts.push(box(g0 - x, h, 0.4, (x + g0) / 2, h / 2, z1));
      x = g1;
    }
    if (x < x1) parts.push(box(x1 - x, h, 0.4, (x + x1) / 2, h / 2, z1));
    // a recessed band and a soffit line give the podium some depth
    parts.push(box(x1 - x0 + 0.6, 0.35, z1 - z0 + 0.6, (x0 + x1) / 2, h + 0.05, (z0 + z1) / 2));
    return mergeGeometries(parts.map((p) => p.toNonIndexed()));
  }, [specs]);
  const lobbies = useMemo(() => {
    const h = PODIUM.h - 0.5 - PAD_Y;
    return mergeGeometries(specs.map((t) => box(14, h, 0.3, t.x, h / 2, PODIUM.z1 - 0.2)));
  }, [specs]);
  const canopies = useMemo(() => mergeGeometries(specs.map((t) => box(16, 0.3, 5, t.x, 4.2, PODIUM.z1 + 2.6))), [specs]);

  const colRef = useRef();
  const deckRef = useRef();
  const wallRef = useRef();
  const glassRef = useRef();
  const canRef = useRef();
  useFrame(() => {
    const B = W.B;
    const c = at(B, 'podiumColumns');
    colRef.current.visible = c > 0.01;
    colRef.current.scale.y = Math.max(0.01, c);
    const d = at(B, 'podiumDeck');
    deckRef.current.visible = d > 0.01;
    deckRef.current.scale.x = Math.max(0.01, d);
    const w = at(B, 'podiumWalls');
    wallRef.current.visible = w > 0.01;
    wallRef.current.scale.y = Math.max(0.01, w);
    glassRef.current.visible = w > 0.6;
    canRef.current.visible = w > 0.95;
  });

  return (
    <group>
      <group ref={colRef} position-y={PAD_Y}>
        <mesh geometry={cols} material={mat.plasterShade()} castShadow receiveShadow />
      </group>
      <group ref={deckRef} position={[PODIUM.x0, PODIUM.h - 0.5, 0]}>
        <mesh geometry={deck} material={mat.plaster()} castShadow receiveShadow />
      </group>
      <group ref={wallRef} position-y={PAD_Y}>
        <mesh geometry={walls} material={mat.plaster()} castShadow receiveShadow />
      </group>
      <mesh ref={glassRef} geometry={lobbies} position-y={PAD_Y} material={mat.glass()} />
      <mesh ref={canRef} geometry={canopies} material={mat.plaster()} castShadow />
    </group>
  );
}

function Clubhouse() {
  const { x, z, w, d, fh } = CLUB;
  const refs = useRef([]);
  const roof = useRef();
  const floors = useMemo(
    () =>
      [0, 1].map((k) => ({
        slab: box(w, 0.4, d, 0, 0.2, 0),
        glass: box(w - 1.2, fh - 0.4, d - 1.2, 0, 0.4 + (fh - 0.4) / 2, 0),
        fins: mergeGeometries(
          Array.from({ length: Math.floor(w / 3) }, (_, i) => box(0.25, fh - 0.4, 0.6, -w / 2 + 1.5 + i * 3, 0.4 + (fh - 0.4) / 2, d / 2 - 0.4).toNonIndexed())
        ),
        y: PAD_Y + k * fh
      })),
    [w, d, fh]
  );
  const roofGeo = useMemo(
    () =>
      mergeGeometries([
        box(w + 4, 0.5, d + 3, 0, 0.25, 0.5).toNonIndexed(),
        ...Array.from({ length: 6 }, (_, i) => box(0.3, 0.3, 9, -w / 2 - 6 + i * 2.2, 0.2 + 3.6, 0).toNonIndexed()),
        box(0.4, 3.6, 0.4, -w / 2 - 6, 1.8 - 3.6 + 3.6, -4).toNonIndexed(),
        box(0.4, 3.6, 0.4, -w / 2 - 6, 1.8, 4).toNonIndexed()
      ]),
    [w, d]
  );
  useFrame(() => {
    const f = ramp(W.B, SCHEDULE.club[0], SCHEDULE.club[1]) * 2.4;
    floors.forEach((fl, k) => {
      const g = refs.current[k];
      if (!g) return;
      const p = Math.min(1, Math.max(0, f - k));
      g.visible = p > 0.01;
      g.scale.y = Math.max(0.01, p);
    });
    const r = Math.min(1, Math.max(0, f - 2) / 0.4);
    roof.current.visible = r > 0.01;
    roof.current.scale.set(1, Math.max(0.01, r), 1);
  });
  return (
    <group position={[x, 0, z]}>
      {floors.map((fl, k) => (
        <group key={k} ref={(el) => (refs.current[k] = el)} position-y={fl.y}>
          <mesh geometry={fl.slab} material={mat.plaster()} castShadow receiveShadow />
          <mesh geometry={fl.glass} material={mat.glass()} />
          <mesh geometry={fl.fins} material={mat.plaster()} castShadow />
        </group>
      ))}
      <group ref={roof} position-y={PAD_Y + 2 * fh}>
        <mesh geometry={roofGeo} material={mat.plaster()} castShadow receiveShadow />
      </group>
    </group>
  );
}

const LUSH = ['#9fb25a', '#93a852', '#a9b964', '#8ea04c', '#b0bd6a'].map((c) => new THREE.Color(c));

function Landscape({ specs }) {
  const lawnDeck = useMemo(() => mergeGeometries(LAWNS_DECK.map((l) => box(l.w, 0.3, l.d, l.x, PODIUM.h + 0.15, l.z))), []);
  const lawnGround = useMemo(() => LAWNS_GROUND.map((l) => ({ ...l, geo: box(l.w, 0.3, l.d, 0, 0.15, 0) })), []);
  const drive = useMemo(() => mergeGeometries(DRIVE.map((r) => box(r.w, 0.14, r.d, r.x, PAD_Y + 0.07, r.z))), []);
  const play = useMemo(
    () =>
      mergeGeometries(
        [
          box(PLAY.w, 0.22, PLAY.d, 0, 0.11, 0),
          box(4, 3, 4, -6, 1.5, -3),
          box(7, 0.3, 1.4, -1.5, 2.2, -3),
          box(0.3, 2.6, 6, 6, 1.3, 2),
          box(3, 2.4, 0.3, 6, 1.2, 5),
          box(5, 1.2, 5, -5, 0.6, 5)
        ].map((g) => g.toNonIndexed())
      ),
    []
  );
  const playMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e8c793', roughness: 0.95 }), []);
  const pool = useMemo(() => ({ rim: box(POOL.w + 2, 0.45, POOL.d + 2, POOL.x, PODIUM.h + 0.22, POOL.z), water: box(POOL.w, 0.3, POOL.d, 0, 0.15, 0) }), []);

  const trees = useMemo(() => {
    const r = rng(19);
    const list = [];
    const edge = inset(PLOT, 5);
    for (let i = 0; i < edge.length; i++) {
      const [ax, az] = edge[i];
      const [bx, bz] = edge[(i + 1) % edge.length];
      const len = Math.hypot(bx - ax, bz - az);
      for (let s = 6; s < len - 4; s += 10 + r() * 4) {
        const x = ax + ((bx - ax) * s) / len;
        const z = az + ((bz - az) * s) / len;
        if (Math.abs(x - GATE.x) < 14 && z > 50) continue;
        if (x > PODIUM.x0 - 2 && x < PODIUM.x1 + 2 && z > PODIUM.z0 - 2 && z < PODIUM.z1 + 2) continue;
        list.push({ x, z, y: PAD_Y + 0.1, s: 2.6 + r() * 1.4 });
      }
    }
    for (const l of LAWNS_GROUND)
      for (let k = 0; k < Math.round((l.w * l.d) / 140); k++)
        list.push({ x: l.x + (r() - 0.5) * l.w * 0.8, z: l.z + (r() - 0.5) * l.d * 0.8, y: PAD_Y + 0.3, s: 2.2 + r() * 1.6 });
    // deck trees around the reflecting pool
    for (const [x, z] of [
      [-16, -36], [-8, -40], [6, -38], [14, -34], [-14, -24], [12, -24], [-20, -9], [16, -8], [-52, -9], [56, -10]
    ])
      list.push({ x, z, y: PODIUM.h + 0.3, s: 2.0 + r() * 1.2 });
    list.forEach((t, i) => {
      t.delay = r() * 0.6;
      t.c = LUSH[i % LUSH.length];
      t.rot = r() * 6.28;
    });
    return list;
  }, []);
  const treeMesh = useMemo(() => {
    const m = new THREE.InstancedMesh(foamTree(51, { blobs: 4 }), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }), trees.length);
    trees.forEach((t, i) => m.setColorAt(i, t.c));
    m.castShadow = true;
    m.receiveShadow = true;
    m.frustumCulled = false;
    return m;
  }, [trees]);

  const deckRef = useRef();
  const groundRefs = useRef([]);
  const driveRef = useRef();
  const playRef = useRef();
  const rimRef = useRef();
  const waterRef = useRef();
  const o = useMemo(() => new THREE.Object3D(), []);
  const last = useMemo(() => ({ B: -1 }), []);
  useFrame(() => {
    const B = W.B;
    const lawns = at(B, 'lawns');
    deckRef.current.visible = lawns > 0.01;
    deckRef.current.scale.set(1, Math.max(0.01, lawns), 1);
    lawnGround.forEach((l, i) => {
      const g = groundRefs.current[i];
      const k = Math.min(1, Math.max(0, lawns * 1.4 - i * 0.12));
      g.visible = k > 0.01;
      g.scale.set(Math.max(0.01, k), 1, Math.max(0.01, k));
    });
    const dr = at(B, 'drive');
    driveRef.current.visible = dr > 0.01;
    driveRef.current.scale.y = Math.max(0.01, dr);
    const pl = at(B, 'play');
    playRef.current.visible = pl > 0.01;
    playRef.current.scale.set(1, Math.max(0.01, pl), 1);
    rimRef.current.visible = lawns > 0.3;
    const pw = at(B, 'pool');
    waterRef.current.visible = pw > 0.01;
    waterRef.current.scale.y = Math.max(0.01, pw);
    if (B !== last.B) {
      last.B = B;
      const grow = ramp(B, SCHEDULE.planting[0], SCHEDULE.planting[1]);
      trees.forEach((t, i) => {
        const k = Math.min(1, Math.max(0, (grow - t.delay * 0.5) / 0.5));
        o.position.set(t.x, t.y, t.z);
        o.rotation.set(0, t.rot, 0);
        o.scale.setScalar(Math.max(0.001, t.s * k));
        o.updateMatrix();
        treeMesh.setMatrixAt(i, o.matrix);
      });
      treeMesh.instanceMatrix.needsUpdate = true;
      treeMesh.visible = grow > 0.001;
    }
  });

  return (
    <group>
      <group ref={deckRef} position-y={PODIUM.h - 0.1}>
        <mesh geometry={lawnDeck} position-y={-PODIUM.h + 0.1} material={mat.lawn()} receiveShadow />
      </group>
      {lawnGround.map((l, i) => (
        <mesh key={i} ref={(el) => (groundRefs.current[i] = el)} geometry={l.geo} position={[l.x, PAD_Y, l.z]} material={mat.lawn()} receiveShadow />
      ))}
      <group ref={driveRef}>
        <mesh geometry={drive} material={mat.plaster()} receiveShadow />
      </group>
      <group ref={playRef} position={[PLAY.x, PAD_Y, PLAY.z]}>
        <mesh geometry={play} material={playMat} castShadow receiveShadow />
      </group>
      <mesh ref={rimRef} geometry={pool.rim} material={mat.deck()} receiveShadow />
      <mesh ref={waterRef} geometry={pool.water} position={[POOL.x, PODIUM.h + 0.3, POOL.z]} material={mat.pool()} />
      <primitive object={treeMesh} />
    </group>
  );
}

function Perimeter() {
  const segs = useMemo(() => {
    const out = [];
    for (let i = 0; i < PLOT.length; i++) {
      const [ax, az] = PLOT[i];
      const [bx, bz] = PLOT[(i + 1) % PLOT.length];
      const len = Math.hypot(bx - ax, bz - az);
      const pieces = Math.ceil(len / 12);
      for (let k = 0; k < pieces; k++) {
        const t0 = k / pieces;
        const t1 = (k + 1) / pieces;
        const x0 = ax + (bx - ax) * t0;
        const z0 = az + (bz - az) * t0;
        const x1 = ax + (bx - ax) * t1;
        const z1 = az + (bz - az) * t1;
        const mx = (x0 + x1) / 2;
        const mz = (z0 + z1) / 2;
        if (Math.abs(mx - GATE.x) < GATE.w / 2 + 4 && mz > 50) continue; // the gate
        out.push({ x: mx, z: mz, len: Math.hypot(x1 - x0, z1 - z0) + 0.3, yaw: Math.atan2(-(z1 - z0), x1 - x0) });
      }
    }
    return out;
  }, []);
  const mesh = useMemo(() => {
    const g = box(1, 1.9, 0.35, 0, 0.95, 0);
    const m = new THREE.InstancedMesh(g, mat.plaster(), segs.length);
    m.castShadow = true;
    m.receiveShadow = true;
    m.frustumCulled = false;
    return m;
  }, [segs]);
  const gate = useRef();
  const o = useMemo(() => new THREE.Object3D(), []);
  const last = useMemo(() => ({ B: -1 }), []);
  useFrame(() => {
    const B = W.B;
    gate.current.visible = at(B, 'drive') > 0.5;
    if (B === last.B) return;
    last.B = B;
    const k = ramp(B, SCHEDULE.wall[0], SCHEDULE.wall[1]) * segs.length;
    segs.forEach((s, i) => {
      const p = Math.min(1, Math.max(0, k - i));
      o.position.set(s.x, PAD_Y, s.z);
      o.rotation.set(0, s.yaw, 0);
      o.scale.set(s.len, Math.max(0.001, p), 1);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.visible = k > 0.01;
  });
  return (
    <group>
      <primitive object={mesh} />
      <group ref={gate} position={[GATE.x + 13, PAD_Y, GATE.z - 6]}>
        <mesh material={mat.plaster()} castShadow receiveShadow position-y={1.8}>
          <boxGeometry args={[7, 3.6, 5]} />
        </mesh>
        <mesh material={mat.plaster()} castShadow position={[-6, 3.8, 0]}>
          <boxGeometry args={[18, 0.35, 6]} />
        </mesh>
      </group>
    </group>
  );
}

export default function Development({ project }) {
  const specs = useMemo(() => towerSpecs(project), [project]);
  const windows = [SCHEDULE.towerA, SCHEDULE.towerB];
  return (
    <group>
      <Ground />
      <Podium specs={specs} />
      {specs.map((s, i) => (
        <Tower key={s.id} spec={s} window={windows[i] || SCHEDULE.towerB} />
      ))}
      {specs.map((s, i) => (
        <Crane
          key={`c-${s.id}`}
          x={s.x + (i ? 9 : -9)}
          z={s.z - s.d / 2 - 5}
          floors={s.floors}
          window={windows[i] || SCHEDULE.towerB}
          phase={i * 2.1}
          yaw0={i ? 2.4 : -0.6}
        />
      ))}
      <Clubhouse />
      <Landscape specs={specs} />
      <Perimeter />
      <Vehicles />
    </group>
  );
}
