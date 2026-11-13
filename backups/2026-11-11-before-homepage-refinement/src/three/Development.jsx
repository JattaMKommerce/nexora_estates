import { Fragment, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { PLAZA_H, PLINTH_H, buildCrownGeometries, buildFloorGeometries, buildLobbyGeometries, disposeGeometries, levelBaseY } from './towerGeometry.js';
import { KERB_H, SIDEWALK } from './city/layout.js';
import { Instances, Trees, unitBox } from './city/City.jsx';
import { invalidateShadows } from './shadows.js';
import { mulberry32 } from '../lib/random.js';

const noRay = () => null;

/**
 * The world moves, not the camera: the active tower always sits at the origin (every camera move,
 * floor view and plan is built around it). Switching towers slides the whole development and city
 * so the newly chosen tower glides into place while the camera re-frames.
 */
export function WorldShift({ offset, reducedMotion, onSettled, children }) {
  const ref = useRef();
  const first = useRef(true);
  const settled = useRef(onSettled);
  settled.current = onSettled;
  const [ox, , oz] = offset;
  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return undefined;
    if (first.current || reducedMotion) {
      first.current = false;
      g.position.set(ox, 0, oz);
      invalidateShadows();
      settled.current?.();
      return undefined;
    }
    const t = gsap.to(g.position, {
      x: ox,
      z: oz,
      duration: 1.6,
      ease: 'power3.inOut',
      onUpdate: invalidateShadows,
      onComplete: () => {
        invalidateShadows();
        settled.current?.();
      }
    });
    return () => t.kill();
  }, [ox, oz, reducedMotion]);
  return <group ref={ref}>{children}</group>;
}

/** Build progress at which the development counts as finished (the interactive model takes over). */
export const COMPLETE = 0.9995;

/**
 * Shows its children only while the development is complete (`show="complete"`) or only while it
 * is being built (`show="building"`), following `state.b` frame by frame. Without a state (no
 * homepage story) the development is always complete.
 */
export function BuildGate({ state, show, children }) {
  const ref = useRef();
  const isComplete = () => !state || state.b >= COMPLETE;
  useFrame(() => {
    if (ref.current) ref.current.visible = show === 'complete' ? isComplete() : !isComplete();
  });
  return (
    <group ref={ref} visible={show === 'complete' ? isComplete() : !isComplete()}>
      {children}
    </group>
  );
}

/** Double-height glazed lobby with a drop-off canopy, or a stone plinth when homes start at ground level. */
export function TowerBase({ dims, mats }) {
  const geo = useMemo(() => (dims.hasLobby ? buildLobbyGeometries(dims) : null), [dims]);
  useEffect(() => () => disposeGeometries(geo), [geo]);
  if (!geo) {
    return (
      <mesh position={[0, PLAZA_H + PLINTH_H / 2, 0]} material={mats.cladding} castShadow receiveShadow raycast={noRay}>
        <boxGeometry args={[dims.width + 0.6, PLINTH_H, dims.depth + 0.6]} />
      </mesh>
    );
  }
  return (
    <group position={[0, PLAZA_H, 0]}>
      <mesh geometry={geo.glass} material={mats.lobbyGlass} receiveShadow raycast={noRay} />
      <mesh geometry={geo.frame} material={mats.graphite} castShadow raycast={noRay} />
      <mesh geometry={geo.slab} material={mats.cladding} castShadow receiveShadow raycast={noRay} />
      <mesh geometry={geo.columns} material={mats.bronze} castShadow raycast={noRay} />
      <mesh geometry={geo.lights} material={mats.warmLight} raycast={noRay} />
    </group>
  );
}

/** Crown: roof, plant-room screen and its light line. */
export function CrownMeshes({ geoms, mats }) {
  return (
    <>
      <mesh geometry={geoms.concrete} material={mats.cladding} castShadow receiveShadow raycast={noRay} />
      <mesh geometry={geoms.metal} material={mats.crownFins} castShadow receiveShadow raycast={noRay} />
      <mesh geometry={geoms.band} material={mats.crownLight} raycast={noRay} />
    </>
  );
}

/**
 * Another tower of the same development, drawn at full detail with one instanced draw call per
 * material. Choosing it switches the experience to that tower.
 */
export const SiblingTower = memo(function SiblingTower({ entry, mats, name, onSelect }) {
  const { dims } = entry;
  const geoms = useMemo(() => buildFloorGeometries(dims), [dims]);
  const crown = useMemo(() => buildCrownGeometries(dims), [dims]);
  useEffect(() => () => disposeGeometries(geoms), [geoms]);
  useEffect(() => () => disposeGeometries(crown), [crown]);
  const floors = useMemo(
    () => Array.from({ length: dims.floors }, (_, i) => ({ x: 0, y: levelBaseY(dims, i), z: 0, w: 1, h: 1, d: 1, v: i % 2 })),
    [dims]
  );
  const byVariant = useMemo(() => [floors.filter((f) => f.v === 0), floors.filter((f) => f.v === 1)], [floors]);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!hover) return undefined;
    document.body.style.cursor = 'pointer';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hover]);

  return (
    <group position={[entry.x, 0, entry.z]}>
      <TowerBase dims={dims} mats={mats} />
      {[0, 1].map((v) => (
        <Fragment key={v}>
          <Instances items={byVariant[v]} geometry={geoms.concrete[v]} material={mats.cladding} castShadow receiveShadow />
          <Instances items={byVariant[v]} geometry={geoms.metal[v]} material={mats.metal} castShadow receiveShadow />
          <Instances items={byVariant[v]} geometry={geoms.rail[v]} material={mats.rail} />
        </Fragment>
      ))}
      <Instances items={floors} geometry={geoms.glass} material={mats.glass} receiveShadow />
      <group position={[0, dims.top, 0]}>
        <CrownMeshes geoms={crown} mats={mats} />
      </group>
      {onSelect && (
        <mesh
          visible={false}
          position={[0, dims.height / 2, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
          }}
          onPointerOut={() => setHover(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (e.delta > 6) return;
            setHover(false);
            onSelect(entry.id);
          }}
        >
          <boxGeometry args={[dims.outerW + 1, dims.height, dims.outerD + 1]} />
        </mesh>
      )}
      {hover && (
        <Html position={[dims.width / 2 + 0.5, dims.height * 0.62, dims.depth / 2 + 0.5]} pointerEvents="none" zIndexRange={[30, 0]}>
          <div className="floor-tag">
            <span className="floor-tag__line" aria-hidden="true" />
            <span className="floor-tag__body">
              <strong>{name}</strong>
              <span>Select to explore this tower</span>
            </span>
          </div>
        </Html>
      )}
    </group>
  );
});

/* ------------------------------------------------------------------ the site */

const inRect = (x, z, r, m = 0) => x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;
const rect = (cx, cz, w, d) => ({ x0: cx - w / 2, x1: cx + w / 2, z0: cz - d / 2, z1: cz + d / 2 });
const toBox = (r, y, h) => ({ x: (r.x0 + r.x1) / 2, z: (r.z0 + r.z1) / 2, w: r.x1 - r.x0, d: r.z1 - r.z0, y, h });

/** Which outdoor features to draw, from the amenities listed in the property's data (nothing invented). */
export function siteFeatures(amenities = []) {
  const text = amenities.join(' | ').toLowerCase();
  return {
    reflectingPool: /reflecting pool|water feature|water body/.test(text),
    lapPool: /lap pool|swimming pool|infinity pool/.test(text),
    garden: /garden/.test(text)
  };
}

/** Planning of the site block: plazas, drives, gardens, water, boundary, trees and hedges. */
function planSite(dev, features) {
  const rnd = mulberry32(97);
  const r = (a, b) => a + (b - a) * rnd();
  const inset = SIDEWALK + 0.4;
  const inner = { x0: -dev.sx + inset, x1: dev.sx - inset, z0: -dev.sz + inset, z1: dev.sz - inset };
  const plazas = dev.towers.map((t) => rect(t.x, t.z, t.dims.outerW + 16, t.dims.outerD + 16));
  const frontEdge = Math.max(...plazas.map((p) => p.z1));
  const backEdge = Math.min(...plazas.map((p) => p.z0));
  const driveW = 7;
  const gateX = inner.x0 + 12;
  const cross = { x0: gateX - driveW / 2, x1: Math.max(...plazas.map((p) => p.x1)) - 4, z0: frontEdge, z1: frontEdge + driveW };
  const gateDrive = { x0: gateX - driveW / 2, x1: gateX + driveW / 2, z0: cross.z1, z1: inner.z1 + 0.4 };
  const drives = [cross, gateDrive];
  const water = [];
  const decks = [];
  const rings = [];
  const front = { x0: gateX + driveW / 2 + 3, x1: inner.x1 - 3, z0: cross.z1 + 3, z1: inner.z1 - 4 };
  const back = { x0: inner.x0 + 4, x1: inner.x1 - 4, z0: inner.z0 + 4, z1: backEdge - 3 };
  if (features.reflectingPool && front.z1 - front.z0 > 10) {
    const cx = (front.x0 + front.x1) / 2;
    const cz = (front.z0 + front.z1) / 2;
    water.push({ kind: 'reflect', ...rect(cx, cz, Math.min(48, (front.x1 - front.x0) * 0.62), Math.min(8, (front.z1 - front.z0) * 0.4)) });
  }
  if (features.lapPool && back.z1 - back.z0 > 14) {
    const cx = (back.x0 + back.x1) / 2;
    const cz = (back.z0 + back.z1) / 2;
    decks.push(rect(cx, cz, 34, 13));
    water.push({ kind: 'lap', ...rect(cx, cz, 25, 5.5) });
  }
  if (features.garden && back.z1 - back.z0 > 18 && !features.lapPool) {
    const cx = (back.x0 + back.x1) / 2;
    const cz = (back.z0 + back.z1) / 2;
    const rad = Math.min(13, (back.z1 - back.z0) / 2 - 3);
    rings.push({ x: cx, z: cz, r0: rad - 2.2, r1: rad });
  }
  const blocked = [...plazas, ...drives, ...water.map((w) => ({ x0: w.x0 - 2, x1: w.x1 + 2, z0: w.z0 - 2, z1: w.z1 + 2 })), ...decks];

  const trees = [];
  const shrubs = [];
  const free = (x, z, m) => inRect(x, z, inner, -m) && !blocked.some((b) => inRect(x, z, b, m));
  // trees along the boundary, inside the wall
  const step = 10;
  for (const [ax, az, len, alongX] of [
    [0, inner.z0 + 3.2, inner.x1 - inner.x0, true],
    [0, inner.z1 - 3.2, inner.x1 - inner.x0, true],
    [inner.x0 + 3.2, 0, inner.z1 - inner.z0, false],
    [inner.x1 - 3.2, 0, inner.z1 - inner.z0, false]
  ]) {
    const n = Math.floor((len - 6) / step);
    for (let i = 0; i <= n; i += 1) {
      const t = -((n * step) / 2) + i * step;
      const x = alongX ? ax + t : ax;
      const z = alongX ? az : az + t;
      if (free(x, z, 2.5)) trees.push({ x, z, y: KERB_H + 0.12, sp: i % 3 === 0 ? 'oval' : 'rain', s: r(0.72, 0.9), rot: r(0, 6.28), tint: rnd() });
    }
  }
  // feature trees in the gardens
  for (let i = 0; i < 60 && trees.length < 90; i += 1) {
    const x = r(inner.x0 + 8, inner.x1 - 8);
    const z = r(inner.z0 + 8, inner.z1 - 8);
    if (free(x, z, 6) && !trees.some((t) => Math.hypot(t.x - x, t.z - z) < 9)) {
      trees.push({ x, z, y: KERB_H + 0.12, sp: rnd() < 0.6 ? 'rain' : 'oval', s: r(0.8, 1.05), rot: r(0, 6.28), tint: rnd() });
    }
  }
  for (const g of rings) {
    for (let k = 0; k < 8; k += 1) {
      const a = (k / 8) * Math.PI * 2;
      trees.push({ x: g.x + Math.cos(a) * (g.r1 + 3.5), z: g.z + Math.sin(a) * (g.r1 + 3.5), y: KERB_H + 0.12, sp: 'oval', s: 0.75, rot: a, tint: rnd() });
    }
  }
  // hedges: inside the boundary wall, along the drives and in front of each plaza
  const hedge = (x0, z0, x1, z1, gap = 1.25, y = KERB_H + 0.12) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.floor(len / gap));
    for (let i = 0; i <= n; i += 1) {
      const x = x0 + ((x1 - x0) * i) / n;
      const z = z0 + ((z1 - z0) * i) / n;
      if (!drives.some((d) => inRect(x, z, d, 0.6))) shrubs.push({ x, z, y, sp: 'shrub', s: r(0.85, 1.2), rot: r(0, 6.28), tint: rnd() });
    }
  };
  const hi = 1.0;
  hedge(inner.x0 + hi, inner.z0 + hi, inner.x1 - hi, inner.z0 + hi);
  hedge(inner.x0 + hi, inner.z1 - hi, inner.x1 - hi, inner.z1 - hi);
  hedge(inner.x0 + hi, inner.z0 + hi, inner.x0 + hi, inner.z1 - hi);
  hedge(inner.x1 - hi, inner.z0 + hi, inner.x1 - hi, inner.z1 - hi);
  hedge(cross.x0 + 2, cross.z1 + 1.1, cross.x1, cross.z1 + 1.1);
  hedge(gateDrive.x1 + 1.1, gateDrive.z0 + 1, gateDrive.x1 + 1.1, gateDrive.z1 - 2);
  hedge(gateDrive.x0 - 1.1, gateDrive.z0 + 1, gateDrive.x0 - 1.1, gateDrive.z1 - 2);
  for (const w of water) {
    hedge(w.x0 - 2.2, w.z0 - 2.2, w.x1 + 2.2, w.z0 - 2.2, 1.3);
    hedge(w.x0 - 2.2, w.z1 + 2.2, w.x1 + 2.2, w.z1 + 2.2, 1.3);
  }
  for (const p of plazas) {
    hedge(p.x0 + 1, p.z0 + 1, p.x0 + 1, p.z1 - 4, 1.3, PLAZA_H);
    hedge(p.x1 - 1, p.z0 + 1, p.x1 - 1, p.z1 - 4, 1.3, PLAZA_H);
  }
  return { inner, plazas, drives, water, decks, rings, trees, shrubs, gateX, driveW };
}

/** Steel railing texture: one vertical bar per repeat, with top and bottom rails (alpha-tested). */
function railingTexture() {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(13, 0, 6, 64);
  ctx.fillRect(0, 0, 32, 5);
  ctx.fillRect(0, 56, 32, 5);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

function boundaryGeometry(inner, gateX, gateW) {
  const walls = [];
  const rails = [];
  const piers = [];
  const wallH = 0.85;
  const railH = 0.95;
  const y0 = KERB_H;
  const seg = (x0, z0, x1, z1) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    if (len < 0.5) return;
    const alongX = Math.abs(z1 - z0) < 1e-3;
    const cx = (x0 + x1) / 2;
    const cz = (z0 + z1) / 2;
    const w = new THREE.BoxGeometry(alongX ? len : 0.32, wallH, alongX ? 0.32 : len);
    w.translate(cx, y0 + wallH / 2, cz);
    walls.push(w);
    const p = new THREE.PlaneGeometry(len, railH);
    const uv = p.attributes.uv;
    for (let i = 0; i < uv.count; i += 1) uv.setX(i, (uv.getX(i) * len) / 0.14);
    if (!alongX) p.rotateY(Math.PI / 2);
    p.translate(cx, y0 + wallH + railH / 2, cz);
    rails.push(p);
    const n = Math.max(1, Math.round(len / 3));
    for (let i = 0; i <= n; i += 1) {
      const t = i / n;
      const g = new THREE.BoxGeometry(0.42, wallH + railH + 0.12, 0.42);
      g.translate(x0 + (x1 - x0) * t, y0 + (wallH + railH + 0.12) / 2, z0 + (z1 - z0) * t);
      piers.push(g);
    }
  };
  const { x0, x1, z0, z1 } = inner;
  seg(x0, z0, x1, z0);
  seg(x0, z0, x0, z1);
  seg(x1, z0, x1, z1);
  seg(x0, z1, gateX - gateW / 2, z1);
  seg(gateX + gateW / 2, z1, x1, z1);
  for (const s of [-1, 1]) {
    const g = new THREE.BoxGeometry(0.9, 2.6, 0.9);
    g.translate(gateX + s * (gateW / 2 + 0.45), y0 + 1.3, z1);
    piers.push(g);
  }
  const merged = (list) => {
    if (!list.length) return null;
    const out = mergeGeometries(list, false);
    list.forEach((g) => g.dispose());
    return out;
  };
  return { walls: merged(walls), rails: merged(rails), piers: merged(piers) };
}

/** Animated ripples on the water's surface normal. */
function waterMaterial({ color, opacity = 1, envMap = null, uniforms }) {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.03,
    metalness: 0,
    ior: 1.33,
    envMapIntensity: 1.1,
    transparent: opacity < 1,
    opacity,
    envMap
  });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWp;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvWp = (modelMatrix * vec4(position, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nvarying vec3 vWp;')
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        {
          vec2 p = vWp.xz;
          float t = uTime;
          vec2 g = vec2(cos(p.x * 1.7 + t * 0.9) + cos(p.x * 0.6 - p.y * 1.3 + t * 0.7) * 0.6, sin(p.y * 2.1 - t * 0.8) + sin(p.x * 1.1 + p.y * 0.7 + t * 1.1) * 0.5);
          normal = normalize(normal + (viewMatrix * vec4(g.x * 0.012, 0.0, g.y * 0.012, 0.0)).xyz);
        }`
      );
  };
  m.customProgramCacheKey = () => `water-${opacity < 1 ? 't' : 'o'}`;
  return m;
}

export function ProjectSite({ dev, mats, siteMats, vegetation, features, waterEnv = null, growth = null }) {
  // Homepage story: until the landscaping phase the site is bare, compacted earth; then lawns,
  // paving and water rise into place and the trees and hedges grow.
  const ground = useRef();
  const earth = useRef();
  const lastG = useRef(-1);
  useFrame(() => {
    if (!growth) return;
    const g = growth.growth;
    if (g === lastG.current) return;
    lastG.current = g;
    const e = Math.min(1, g / 0.35);
    if (ground.current) ground.current.position.y = -0.62 * (1 - e * e * (3 - 2 * e));
    if (earth.current) earth.current.visible = g < 0.999;
  });
  const grow = useMemo(() => (growth ? { state: growth } : null), [growth]);
  const plan = useMemo(() => planSite(dev, features), [dev, features]);
  const boxGeo = useMemo(unitBox, []);
  useEffect(() => () => boxGeo.dispose(), [boxGeo]);
  const boundary = useMemo(() => boundaryGeometry(plan.inner, plan.gateX, plan.driveW + 1.5), [plan]);
  useEffect(() => () => Object.values(boundary).forEach((g) => g?.dispose()), [boundary]);

  const railMat = useMemo(() => {
    const tex = railingTexture();
    return new THREE.MeshStandardMaterial({ color: '#2c2e31', roughness: 0.45, metalness: 0.6, alphaMap: tex, alphaTest: 0.5, side: THREE.DoubleSide });
  }, []);
  useEffect(() => () => {
    railMat.alphaMap?.dispose();
    railMat.dispose();
  }, [railMat]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((s) => {
    uniforms.uTime.value = s.clock.elapsedTime;
  });
  const water = useMemo(
    () => ({
      reflect: waterMaterial({ color: '#0b1d20', envMap: waterEnv, uniforms }),
      lap: waterMaterial({ color: '#5fb8c2', opacity: 0.82, envMap: waterEnv, uniforms }),
      basin: new THREE.MeshStandardMaterial({ color: '#8fc9cf', roughness: 0.4 })
    }),
    [waterEnv, uniforms]
  );
  useEffect(() => () => Object.values(water).forEach((m) => m.dispose()), [water]);

  const items = useMemo(() => {
    const lawnY = KERB_H;
    const lawn = [toBox(plan.inner, lawnY, 0.12)];
    const plazas = plan.plazas.map((p) => toBox(p, lawnY, PLAZA_H - lawnY));
    const drives = plan.drives.map((d) => toBox(d, lawnY, 0.15));
    const copings = plan.water.map((w) => toBox({ x0: w.x0 - 0.7, x1: w.x1 + 0.7, z0: w.z0 - 0.7, z1: w.z1 + 0.7 }, lawnY, w.kind === 'lap' ? 0.3 : 0.42));
    const decks = plan.decks.map((d) => toBox(d, lawnY, 0.26));
    return { lawn, plazas, drives, copings, decks };
  }, [plan]);

  const ringGeo = useMemo(() => {
    if (!plan.rings.length) return null;
    const g = plan.rings[0];
    const geo = new THREE.RingGeometry(g.r0, g.r1, 64);
    geo.rotateX(-Math.PI / 2);
    geo.translate(g.x, KERB_H + 0.135, g.z);
    return geo;
  }, [plan]);
  useEffect(() => () => ringGeo?.dispose(), [ringGeo]);

  const earthBox = useMemo(() => toBox(plan.inner, KERB_H, 0.06), [plan]);
  return (
    <group>
      {growth && (
        <mesh ref={earth} position={[earthBox.x, earthBox.y + 0.03, earthBox.z]} material={siteMats.earth} receiveShadow raycast={noRay}>
          <boxGeometry args={[earthBox.w, 0.06, earthBox.d]} />
        </mesh>
      )}
      <group ref={ground}>
      <Instances items={items.lawn} geometry={boxGeo} material={siteMats.lawn} receiveShadow />
      <Instances items={items.plazas} geometry={boxGeo} material={siteMats.plaza} receiveShadow />
      <Instances items={items.drives} geometry={boxGeo} material={siteMats.drive} receiveShadow />
      <Instances items={items.copings} geometry={boxGeo} material={mats.cladding} receiveShadow castShadow />
      <Instances items={items.decks} geometry={boxGeo} material={siteMats.deck} receiveShadow />
      {ringGeo && <mesh geometry={ringGeo} material={siteMats.plaza} receiveShadow raycast={noRay} />}
      {plan.water.map((w, i) => {
        const cx = (w.x0 + w.x1) / 2;
        const cz = (w.z0 + w.z1) / 2;
        const lap = w.kind === 'lap';
        const top = KERB_H + (lap ? 0.27 : 0.38);
        return (
          <group key={i}>
            {lap && (
              <mesh position={[cx, top - 0.02, cz]} rotation-x={-Math.PI / 2} material={water.basin} raycast={noRay}>
                <planeGeometry args={[w.x1 - w.x0, w.z1 - w.z0]} />
              </mesh>
            )}
            <mesh position={[cx, top + 0.01, cz]} rotation-x={-Math.PI / 2} material={lap ? water.lap : water.reflect} receiveShadow raycast={noRay}>
              <planeGeometry args={[w.x1 - w.x0, w.z1 - w.z0]} />
            </mesh>
          </group>
        );
      })}
      </group>
      {boundary && (
        <>
          <mesh geometry={boundary.walls} material={siteMats.wall} castShadow receiveShadow raycast={noRay} />
          <mesh geometry={boundary.piers} material={siteMats.wall} castShadow receiveShadow raycast={noRay} />
          <mesh geometry={boundary.rails} material={railMat} castShadow raycast={noRay} />
        </>
      )}
      {vegetation && <Trees items={plan.trees} mats={vegetation} nearRadius={1e6} grow={grow} />}
      {vegetation && <Trees items={plan.shrubs} mats={vegetation} nearRadius={1e6} grow={grow} />}
    </group>
  );
}
