import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { makeHoloMaterial, makeFlowMaterial, makeGridMaterial, makeLineMaterial, setHolo, COLORS } from '../materials.js';
import { PLOT, PODIUM, CLUB, PLAY, POOL, LAWNS_GROUND, DRIVE, FH, planShape, inset, towerSpecs, rectPoints } from '../dev/layout.js';
import { ROADS, terrainHeight, LANDMARKS } from '../world/geo.js';
import { W } from '../../core/world.js';

/**
 * Planning layers drawn over the model as holograms: cyan for analysis (plot, utilities, zoning,
 * sun and surroundings, available homes) and white for the proposed master plan.
 */
export const SETBACK = 8;
export const HEIGHT_LIMIT = 84;
export const WATER_LINE = [
  [-262, -12],
  [-215, -6],
  [-160, -10],
  [-112, -14],
  [-84, -14]
];
export const POWER_LINE = [
  [132, -96],
  [112, -84],
  [92, -70],
  [76, -62]
];
export const SUN_ARC = (a) => new THREE.Vector3(205 * Math.cos(a), 14 + 150 * Math.sin(a), 30 + 80 * Math.sin(a));
export const VIEW_APEX = [-35, 64, -26];
export const ENV_RING = { x: -228, z: 46, r: 32 };

function polyPath(points, y, closed = true) {
  const path = new THREE.CurvePath();
  const v = points.map(([x, z]) => new THREE.Vector3(x, typeof y === 'function' ? y(x, z) : y, z));
  for (let i = 0; i < v.length - (closed ? 0 : 1); i++) path.add(new THREE.LineCurve3(v[i], v[(i + 1) % v.length]));
  return path;
}
function groundCurve(points, lift) {
  const pts = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i];
    const [bx, bz] = points[i + 1];
    const n = Math.ceil(Math.hypot(bx - ax, bz - az) / 6);
    for (let k = 0; k < n; k++) {
      const x = ax + ((bx - ax) * k) / n;
      const z = az + ((bz - az) * k) / n;
      pts.push(new THREE.Vector3(x, Math.max(terrainHeight(x, z), -4.4) + lift, z));
    }
  }
  const [lx, lz] = points[points.length - 1];
  pts.push(new THREE.Vector3(lx, Math.max(terrainHeight(lx, lz), -4.4) + lift, lz));
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.2);
}

function useHoloLayer(key, materials, meshes, extra) {
  useFrame((state) => {
    const k = W.holo[key];
    const t = state.clock.elapsedTime;
    materials.forEach((m, i) => setHolo(m, meshes[i]?.current, k, t));
    extra?.(k, t);
  });
}

/* ------------------------------------------------------------- plot boundary ---- */
function Boundary() {
  const tube = useMemo(() => {
    const p = polyPath(PLOT, 1.0);
    return { geo: new THREE.TubeGeometry(p, 260, 0.55, 6, true), len: p.getLength() };
  }, []);
  const flow = useMemo(() => makeFlowMaterial({ length: tube.len, dash: 9 }), [tube]);
  const fillGeo = useMemo(() => {
    const g = new THREE.ShapeGeometry(planShape(PLOT));
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.35, 0);
    return g;
  }, []);
  const grid = useMemo(() => makeGridMaterial({ cell: 10, color: '#bff3fa', intensity: 1.05 }), []);
  const posts = useMemo(() => mergeGeometries(PLOT.map(([x, z]) => new THREE.CylinderGeometry(0.5, 0.5, 16, 8).translate(x, 8, z))), []);
  const postMat = useMemo(() => makeHoloMaterial({ fill: 0.6, intensity: 1.5 }), []);
  const a = useRef();
  const b = useRef();
  const c = useRef();
  useHoloLayer('boundary', [flow, grid, postMat], [a, b, c], (k) => {
    flow.uniforms.uDraw.value = Math.min(1, k * 1.15);
  });
  return (
    <group>
      <mesh ref={a} geometry={tube.geo} material={flow} renderOrder={3} />
      <mesh ref={b} geometry={fillGeo} material={grid} renderOrder={2} />
      <mesh ref={c} geometry={posts} material={postMat} renderOrder={3} />
    </group>
  );
}

/* ----------------------------------------------------------------- utilities ---- */
function Utilities() {
  const lines = useMemo(() => {
    const water = groundCurve(WATER_LINE, 1.4);
    const power = groundCurve(POWER_LINE, 1.2);
    const acc = ROADS.access;
    const accessCurve = new THREE.CatmullRomCurve3(acc.pts.map((p, i) => new THREE.Vector3(p.x, acc.h[i] + 0.9, p.z)));
    return [
      { geo: new THREE.TubeGeometry(water, 120, 1.1, 8), len: water.getLength(), color: '#5fd6ff' },
      { geo: new THREE.TubeGeometry(power, 60, 1.0, 8), len: power.getLength(), color: COLORS.holo },
      { geo: new THREE.TubeGeometry(accessCurve, 40, 1.6, 8), len: accessCurve.getLength(), color: COLORS.holo }
    ];
  }, []);
  const mats = useMemo(() => lines.map((l) => makeFlowMaterial({ length: l.len, dash: 10, color: l.color })), [lines]);
  const beacons = useMemo(() => {
    const pts = [WATER_LINE[0], POWER_LINE[0], [ROADS.access.pts[0].x, ROADS.access.pts[0].z]];
    return mergeGeometries(pts.map(([x, z]) => new THREE.CylinderGeometry(1.4, 1.4, 34, 12, 1, true).translate(x, Math.max(terrainHeight(x, z), -4.4) + 17, z)));
  }, []);
  const beaconMat = useMemo(() => makeHoloMaterial({ fill: 0.35, intensity: 1.4 }), []);
  const refs = [useRef(), useRef(), useRef(), useRef()];
  useHoloLayer('util', [...mats, beaconMat], refs, (k) => {
    mats.forEach((m) => (m.uniforms.uDraw.value = Math.min(1, k * 1.2)));
  });
  return (
    <group>
      {lines.map((l, i) => (
        <mesh key={i} ref={refs[i]} geometry={l.geo} material={mats[i]} renderOrder={3} />
      ))}
      <mesh ref={refs[3]} geometry={beacons} material={beaconMat} renderOrder={3} />
    </group>
  );
}

/* ------------------------------------------------------- zoning envelope ---- */
function Envelope() {
  const inner = useMemo(() => inset(PLOT, SETBACK), []);
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(planShape(inner), { depth: HEIGHT_LIMIT, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    return g;
  }, [inner]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 25), [geo]);
  const body = useMemo(() => makeHoloMaterial({ bands: FH * 3, fill: 0.025, fres: 0.35, intensity: 1.3, side: THREE.FrontSide }), []);
  const edgeMat = useMemo(() => makeLineMaterial(COLORS.holo, 1.6), []);
  const setbackTube = useMemo(() => {
    const p = polyPath(inner, 0.9);
    return { geo: new THREE.TubeGeometry(p, 200, 0.4, 5, true), len: p.getLength() };
  }, [inner]);
  const dash = useMemo(() => makeFlowMaterial({ length: setbackTube.len, dash: 6 }), [setbackTube]);
  const a = useRef();
  const b = useRef();
  const c = useRef();
  const g = useRef();
  useHoloLayer('env', [body, edgeMat, dash], [a, b, c], (k) => {
    // the envelope rises out of the ground
    g.current.scale.y = Math.max(0.001, Math.min(1, k * 1.25));
    dash.uniforms.uDraw.value = Math.min(1, k * 1.4);
  });
  return (
    <group>
      <group ref={g}>
        <mesh ref={a} geometry={geo} material={body} renderOrder={4} />
        <lineSegments ref={b} geometry={edges} material={edgeMat} renderOrder={5} />
      </group>
      <mesh ref={c} geometry={setbackTube.geo} material={dash} renderOrder={3} />
    </group>
  );
}

/* ------------------------------------------- sun, views, neighbourhood ---- */
function Surroundings() {
  const arc = useMemo(() => {
    const pts = Array.from({ length: 64 }, (_, i) => SUN_ARC((i / 63) * Math.PI));
    const c = new THREE.CatmullRomCurve3(pts);
    return { geo: new THREE.TubeGeometry(c, 160, 1.3, 8), len: c.getLength() };
  }, []);
  const arcMat = useMemo(() => makeFlowMaterial({ length: arc.len, dash: 16, color: COLORS.holo, intensity: 1.5 }), [arc]);
  const sunMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffe9a8').multiplyScalar(3), transparent: true, toneMapped: false }), []);
  const fans = useMemo(() => {
    const A = new THREE.Vector3(...VIEW_APEX);
    const tri = (p, q) => {
      const g = new THREE.BufferGeometry().setFromPoints([A, new THREE.Vector3(...p), new THREE.Vector3(...q)]);
      g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1], 2));
      g.computeVertexNormals();
      return g;
    };
    return mergeGeometries([tri([-330, 6, -170], [-330, 6, 150]), tri([-160, 40, -460], [140, 50, -470])]);
  }, []);
  const fanMat = useMemo(() => makeHoloMaterial({ fill: 0.1, intensity: 1.1 }), []);
  const beams = useMemo(
    () =>
      mergeGeometries(
        [LANDMARKS.school, LANDMARKS.station, LANDMARKS.market].map((l) =>
          new THREE.CylinderGeometry(2.6, 2.6, 70, 14, 1, true).translate(l.x, terrainHeight(l.x, l.z) + 35, l.z)
        )
      ),
    []
  );
  const beamMat = useMemo(() => makeHoloMaterial({ fill: 0.4, intensity: 1.4 }), []);
  const rings = useMemo(
    () =>
      mergeGeometries(
        [LANDMARKS.school, LANDMARKS.station, LANDMARKS.market].map((l) =>
          new THREE.RingGeometry(16, 19, 48).rotateX(-Math.PI / 2).translate(l.x, terrainHeight(l.x, l.z) + 1.2, l.z)
        )
      ),
    []
  );
  const ringMat = useMemo(() => makeHoloMaterial({ fill: 0.75, intensity: 1.4 }), []);
  const env = useMemo(() => {
    const pts = Array.from({ length: 72 }, (_, i) => {
      const a = (i / 72) * Math.PI * 2;
      const x = ENV_RING.x + Math.cos(a) * ENV_RING.r;
      const z = ENV_RING.z + Math.sin(a) * ENV_RING.r;
      return new THREE.Vector3(x, Math.max(terrainHeight(x, z), -4.6) + 1.2, z);
    });
    const c = new THREE.CatmullRomCurve3(pts, true);
    return { geo: new THREE.TubeGeometry(c, 140, 1.1, 6, true), len: c.getLength() };
  }, []);
  const envMat = useMemo(() => makeFlowMaterial({ length: env.len, dash: 7, color: '#59f0b0', intensity: 1.4 }), [env]);
  const sun = useRef();
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef()];
  useHoloLayer('sun', [arcMat, fanMat, beamMat, ringMat, envMat], refs, (k, t) => {
    arcMat.uniforms.uDraw.value = Math.min(1, k * 1.2);
    const a = ((t * 0.09) % 1) * Math.PI;
    sun.current.position.copy(SUN_ARC(a));
    sun.current.visible = k > 0.05;
    sun.current.scale.setScalar(k);
    sunMat.opacity = k;
    const s = 1 + ((t * 0.5) % 1) * 0.6;
    refs[3].current.scale.set(1, 1, 1);
    ringMat.uniforms.uOpacity.value = k * (1.3 - s * 0.6);
  });
  return (
    <group>
      <mesh ref={refs[0]} geometry={arc.geo} material={arcMat} renderOrder={3} />
      <mesh ref={sun} material={sunMat}>
        <sphereGeometry args={[5, 24, 16]} />
      </mesh>
      <mesh ref={refs[1]} geometry={fans} material={fanMat} renderOrder={2} />
      <mesh ref={refs[2]} geometry={beams} material={beamMat} renderOrder={3} />
      <mesh ref={refs[3]} geometry={rings} material={ringMat} renderOrder={3} />
      <mesh ref={refs[4]} geometry={env.geo} material={envMat} renderOrder={3} />
    </group>
  );
}

/* ------------------------------------------------- the proposed master plan ---- */
function Ghost({ specs }) {
  const geo = useMemo(() => {
    const parts = specs.map((t) => new THREE.BoxGeometry(t.w, t.crown, t.d).translate(t.x, t.crown / 2, t.z));
    const pw = PODIUM.x1 - PODIUM.x0;
    const pd = PODIUM.z1 - PODIUM.z0;
    parts.push(new THREE.BoxGeometry(pw, PODIUM.h, pd).translate((PODIUM.x0 + PODIUM.x1) / 2, PODIUM.h / 2, (PODIUM.z0 + PODIUM.z1) / 2));
    const ch = CLUB.floors * CLUB.fh + 0.6;
    parts.push(new THREE.BoxGeometry(CLUB.w, ch, CLUB.d).translate(CLUB.x, ch / 2, CLUB.z));
    return mergeGeometries(parts);
  }, [specs]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 25), [geo]);
  const plan = useMemo(() => {
    const rects = [
      ...LAWNS_GROUND.map((l) => [l.x - l.w / 2, l.z - l.d / 2, l.x + l.w / 2, l.z + l.d / 2]),
      ...DRIVE.map((r) => [r.x - r.w / 2, r.z - r.d / 2, r.x + r.w / 2, r.z + r.d / 2]),
      [PLAY.x - PLAY.w / 2, PLAY.z - PLAY.d / 2, PLAY.x + PLAY.w / 2, PLAY.z + PLAY.d / 2],
      [POOL.x - POOL.w / 2, POOL.z - POOL.d / 2, POOL.x + POOL.w / 2, POOL.z + POOL.d / 2]
    ];
    const pts = [];
    for (const [x0, z0, x1, z1] of rects) {
      const r = rectPoints(x0, z0, x1, z1);
      const y = 0.5;
      for (let i = 0; i < 4; i++) {
        const [ax, az] = r[i];
        const [bx, bz] = r[(i + 1) % 4];
        pts.push(new THREE.Vector3(ax, y, az), new THREE.Vector3(bx, y, bz));
      }
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  const body = useMemo(() => makeHoloMaterial({ color: COLORS.ghost, intensity: 1.05, bands: FH, fill: 0.16, side: THREE.FrontSide }), []);
  const edgeMat = useMemo(() => makeLineMaterial('#ffffff', 1.5), []);
  const planMat = useMemo(() => makeLineMaterial('#ffffff', 1.3), []);
  const g = useRef();
  const refs = [useRef(), useRef(), useRef()];
  useHoloLayer('ghost', [body, edgeMat, planMat], refs, (k) => {
    g.current.scale.y = Math.max(0.001, Math.min(1, k * 1.2));
  });
  return (
    <group>
      <group ref={g}>
        <mesh ref={refs[0]} geometry={geo} material={body} renderOrder={4} />
        <lineSegments ref={refs[1]} geometry={edges} material={edgeMat} renderOrder={5} />
      </group>
      <lineSegments ref={refs[2]} geometry={plan} material={planMat} renderOrder={5} />
    </group>
  );
}

/* ------------------------------ the planned buildings, in cyan glass (phase 1) ---- */
function Plan({ specs }) {
  const geo = useMemo(() => {
    const parts = specs.map((t) => new THREE.BoxGeometry(t.w, t.crown, t.d).translate(t.x, t.crown / 2, t.z));
    const pw = PODIUM.x1 - PODIUM.x0;
    const pd = PODIUM.z1 - PODIUM.z0;
    parts.push(new THREE.BoxGeometry(pw, PODIUM.h, pd).translate((PODIUM.x0 + PODIUM.x1) / 2, PODIUM.h / 2, (PODIUM.z0 + PODIUM.z1) / 2));
    const ch = CLUB.floors * CLUB.fh + 0.6;
    parts.push(new THREE.BoxGeometry(CLUB.w, ch, CLUB.d).translate(CLUB.x, ch / 2, CLUB.z));
    return mergeGeometries(parts);
  }, [specs]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 25), [geo]);
  const body = useMemo(() => makeHoloMaterial({ bands: FH, fill: 0.3, fres: 1.1, intensity: 1.15, side: THREE.FrontSide }), []);
  const edgeMat = useMemo(() => makeLineMaterial('#d8fbff', 1.4), []);
  const g = useRef();
  const refs = [useRef(), useRef()];
  useHoloLayer('plan', [body, edgeMat], refs, (k) => {
    // the buildings grow up out of the plot
    g.current.scale.y = Math.max(0.001, Math.min(1, k * 1.15));
  });
  return (
    <group ref={g}>
      <mesh ref={refs[0]} geometry={geo} material={body} renderOrder={4} />
      <lineSegments ref={refs[1]} geometry={edges} material={edgeMat} renderOrder={5} />
    </group>
  );
}

/* --------------------------------------------- available homes (live data) ---- */
const QUAD = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1]
];
function Units({ specs }) {
  const mesh = useMemo(() => {
    const items = [];
    for (const t of specs)
      for (let f = 1; f <= t.floors; f++)
        for (let u = 0; u < t.unitsPerFloor; u++) if (t.statusAt[`${f}:${u}`] === 'available') items.push({ t, f, u });
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const m = new THREE.InstancedMesh(geo, makeHoloMaterial({ fill: 0.42, intensity: 1.35, additive: false }), Math.max(1, items.length));
    const o = new THREE.Object3D();
    items.forEach(({ t, f, u }, i) => {
      const [sx, sz] = QUAD[u % 4];
      o.position.set(t.x + (sx * t.w) / 4, PODIUM.h + (f - 1) * FH + FH / 2 + 0.2, t.z + (sz * t.d) / 4);
      o.scale.set(t.w / 2 + 0.55, FH - 0.55, t.d / 2 + 0.55);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.count = items.length;
    m.frustumCulled = false;
    return m;
  }, [specs]);
  useFrame((state) => {
    // the glow breathes gently so it reads as live
    const k = W.holo.units * (0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 2.2));
    setHolo(mesh.material, mesh, k, state.clock.elapsedTime);
  });
  return <primitive object={mesh} renderOrder={6} />;
}

export default function Holo({ project }) {
  const specs = useMemo(() => towerSpecs(project), [project]);
  return (
    <group>
      <Boundary />
      <Utilities />
      <Envelope />
      <Surroundings />
      <Ghost specs={specs} />
      <Plan specs={specs} />
      <Units specs={specs} />
    </group>
  );
}
