import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { FH, PODIUM } from './layout.js';
import { mat } from '../materials.js';
import { W, ramp } from '../../core/world.js';

/**
 * One residential tower, built floor by floor from the project data.
 *
 * The architecture: a softly rounded floor plate (a superellipse) wrapped in floor-to-ceiling glass
 * behind slim champagne-bronze fins. Every floor's balcony edge swells and recedes in a wave whose
 * crest drifts a little from one floor to the next, so the white slab edges ripple across the
 * facade; glass balustrades with bronze rails line them. At the top, tall bronze fins rise past
 * the roof as a lantern crown around a roof garden and pergola.
 *
 * The build: everything is merged per material, and every vertex knows its floor. A shader rises
 * each floor in sequence (the slab is cast in raw concrete, with its columns), and the glazing,
 * fins and balconies follow a few floors behind, the slab edges turning ivory as they are finished.
 * Run the build clock backwards and it dismantles in the same order.
 */
export const PLATE = { n: 3.6, inset: 1.4 }; // superellipse exponent; facade line inside the tower's footprint
const SEG = 112;
const SLAB = 0.34;

/** Points of a superellipse (semi-axes a, b), counter-clockwise from +x, as [x, z]. */
export function superellipse(a, b, n = PLATE.n, count = SEG, offset = () => 0) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const d = offset(t, i);
    pts.push([(a + d) * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), (b + d) * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)]);
  }
  return pts;
}

/** The facade line of a tower (local coordinates). */
export function facadeLine(spec) {
  return superellipse(spec.w / 2 - PLATE.inset, spec.d / 2 - PLATE.inset);
}

/** The balcony edge of floor i: a wave of depth 0.6–2.4 m whose crests drift round the tower. */
function balconyLine(spec, i, phase) {
  return superellipse(spec.w / 2 - PLATE.inset, spec.d / 2 - PLATE.inset, PLATE.n, SEG, (t) => {
    const s = 0.5 + 0.5 * Math.sin(3 * t + i * 0.42 + phase);
    return 0.45 + 2.4 * s * s * (3 - 2 * s);
  });
}

export function shapeOf(points) {
  return new THREE.Shape(points.map(([x, z]) => new THREE.Vector2(x, -z)));
}

/** A vertical band following a closed outline, from y0 to y1 (sides only). */
function band(points, y0, y1) {
  const n = points.length;
  const pos = [];
  const uv = [];
  const idx = [];
  for (let i = 0; i <= n; i++) {
    const [x, z] = points[i % n];
    pos.push(x, y0, z, x, y1, z);
    uv.push(i / n, 0, i / n, 1);
  }
  for (let i = 0; i < n; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); // outward-facing
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Fins standing on an outline, about every `step` metres, facing outwards. */
function fins(points, y0, h, step, w = 0.09, depth = 0.34) {
  const out = [];
  const n = points.length;
  let acc = step;
  for (let i = 0; i < n; i++) {
    const [ax, az] = points[i];
    const [bx, bz] = points[(i + 1) % n];
    const len = Math.hypot(bx - ax, bz - az);
    acc += len;
    if (acc < step) continue;
    acc = 0;
    const yaw = Math.atan2(-(bz - az), bx - ax);
    const g = new THREE.BoxGeometry(depth, h, w);
    g.rotateY(yaw + Math.PI / 2);
    // stand it just outside the outline, along the outward normal
    const nx = (bz - az) / len;
    const nz = -(bx - ax) / len;
    g.translate(ax + nx * depth * 0.5, y0 + h / 2, az + nz * depth * 0.5);
    out.push(g.toNonIndexed());
  }
  return out;
}

function tag(g, floor) {
  let geo = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(geo.attributes)) if (!['position', 'normal', 'uv'].includes(k)) geo.deleteAttribute(k);
  const count = geo.attributes.position.count;
  if (!geo.attributes.uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(count * 2), 2));
  if (!geo.attributes.normal) geo.computeVertexNormals();
  geo.setAttribute('aFloor', new THREE.Float32BufferAttribute(new Float32Array(count).fill(floor), 1));
  return geo;
}

/**
 * Teach a material the floor-by-floor build: floors above uBuild collapse to nothing; the floor
 * being built rises from its slab. With `tint`, unfinished floors (above uFinish) show raw concrete.
 */
function buildable(material, { tint = null, base = 0 } = {}) {
  const u = {
    uBuild: { value: 0 },
    uFinish: { value: 0 },
    uFH: { value: FH },
    uBase: { value: base },
    uConcrete: { value: new THREE.Color(tint || '#000000') }
  };
  const vert = (s) =>
    s.replace('#include <common>', '#include <common>\nattribute float aFloor;\nuniform float uBuild, uFH, uBase;\nvarying float vFloor;').replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      vFloor = aFloor;
      {
        float age = uBuild - aFloor;
        float k = clamp(age, 0.0, 1.0);
        float y0 = uBase + aFloor * uFH;
        transformed.y = y0 + (transformed.y - y0) * k;
        if (age <= 0.0) transformed = vec3(0.0);
      }`
    );
  material.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    s.vertexShader = vert(s.vertexShader);
    if (tint) {
      s.fragmentShader = s.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vFloor;\nuniform float uFinish;\nuniform vec3 uConcrete;')
        .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(uConcrete, diffuseColor.rgb, step(vFloor + 0.5, uFinish));');
    }
  };
  material.customProgramCacheKey = () => `build-${tint ? 't' : 'p'}`;
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  depth.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    s.vertexShader = vert(s.vertexShader);
  };
  depth.customProgramCacheKey = () => 'build-depth';
  return { material, depth, u };
}

const makeMats = () => ({
  slab: new THREE.MeshStandardMaterial({ color: '#f5f0e6', roughness: 0.72 }),
  concrete: new THREE.MeshStandardMaterial({ color: '#c8c3b9', roughness: 0.92 }),
  glass: new THREE.MeshStandardMaterial({
    color: '#8db1c6',
    roughness: 0.06,
    metalness: 0.3,
    envMapIntensity: 1.9,
    emissive: '#ffd7a8',
    emissiveIntensity: 0.06
  }),
  rail: new THREE.MeshStandardMaterial({ color: '#d6c29f', roughness: 0.4, metalness: 0.35 }),
  balustrade: new THREE.MeshStandardMaterial({
    color: '#e4f2f1',
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
    side: THREE.DoubleSide,
    envMapIntensity: 1.3
  })
});

/**
 * spec: { x, z, w, d, floors } · window: [b0, b1] the part of the build clock in which this
 * tower's structure rises (the facade follows ~3 floors behind and finishes slightly later).
 */
export default function Tower({ spec, window: [b0, b1], phase = 0 }) {
  const N = spec.floors;
  const parts = useMemo(() => {
    const face = facadeLine(spec);
    const geo = { slab: [], concrete: [], glass: [], rail: [], balustrade: [] };
    const gh = FH - SLAB;
    const glassBand = band(face, SLAB, FH);
    const finSet = mergeGeometries(fins(face, SLAB, gh, 2.7, 0.07, 0.24));
    const colSet = mergeGeometries(
      face
        .filter((_, i) => i % 14 === 0)
        .map(([x, z]) => new THREE.BoxGeometry(0.7, gh, 0.7).translate(x * 0.95, SLAB + gh / 2, z * 0.95).toNonIndexed())
    );
    for (let i = 0; i <= N; i++) {
      const y = PODIUM.h + i * FH;
      // the slab with its balcony edge (the roof slab is the last one)
      const edge = balconyLine(spec, i, phase);
      const slab = new THREE.ExtrudeGeometry(shapeOf(edge), { depth: SLAB, bevelEnabled: false, curveSegments: 1 });
      slab.rotateX(-Math.PI / 2);
      slab.translate(0, y, 0);
      geo.slab.push(tag(slab, i));
      if (i === N) break;
      geo.concrete.push(tag(colSet.clone().translate(0, y, 0), i));
      geo.glass.push(tag(glassBand.clone().translate(0, y, 0), i));
      geo.rail.push(tag(finSet.clone().translate(0, y, 0), i));
      // balustrade glass and its bronze handrail, set just inside the balcony edge
      const inner = edge.map(([x, z]) => [x * 0.993, z * 0.99]);
      geo.balustrade.push(tag(band(inner, SLAB, SLAB + 1.05).translate(0, y, 0), i));
      geo.rail.push(tag(band(inner, SLAB + 1.02, SLAB + 1.1).translate(0, y, 0), i));
    }
    // the lantern crown: tall fins round the roof, bronze rings at their tops, a roof garden and pergola
    const roofY = PODIUM.h + N * FH + SLAB;
    const a = spec.w / 2 - PLATE.inset;
    const b = spec.d / 2 - PLATE.inset;
    const crownLine = superellipse(a - 0.3, b - 0.3);
    const crown = mergeGeometries([
      ...fins(crownLine, roofY, 4.4, 1.9, 0.12, 0.45),
      band(crownLine, roofY + 4.0, roofY + 4.4).toNonIndexed(),
      band(superellipse(a + 0.2, b + 0.2), roofY + 4.0, roofY + 4.4).toNonIndexed()
    ]);
    const roofGarden = new THREE.ExtrudeGeometry(shapeOf(superellipse(a - 2.2, b - 2.2)), { depth: 0.45, bevelEnabled: false });
    roofGarden.rotateX(-Math.PI / 2);
    roofGarden.translate(0, roofY, 0);
    const pergola = mergeGeometries([
      ...Array.from({ length: 9 }, (_, k) => new THREE.BoxGeometry(0.18, 0.22, 7).translate(-6 + k * 1.5, roofY + 3.2, 0).toNonIndexed()),
      ...[-6, 6].flatMap((x) => [-3.2, 3.2].map((z) => new THREE.BoxGeometry(0.25, 3.2, 0.25).translate(x, roofY + 1.6, z).toNonIndexed()))
    ]);

    const m = makeMats();
    const make = (key, material, opts) => {
      const bl = buildable(material, { base: PODIUM.h, ...opts });
      const mesh = new THREE.Mesh(mergeGeometries(geo[key]), bl.material);
      mesh.customDepthMaterial = bl.depth;
      mesh.castShadow = key !== 'balustrade';
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      return { mesh, u: bl.u };
    };
    const crownMesh = new THREE.Mesh(crown, m.rail);
    crownMesh.castShadow = true;
    const gardenMesh = new THREE.Mesh(roofGarden, mat.lawn());
    gardenMesh.receiveShadow = true;
    const pergolaMesh = new THREE.Mesh(pergola, mat.deck());
    pergolaMesh.castShadow = true;
    const top = new THREE.Group();
    top.add(crownMesh, gardenMesh, pergolaMesh);
    // the lift core, rising a little ahead of the floors
    const core = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 6).translate(0, 0.5, 0), m.concrete);
    core.castShadow = true;
    return {
      slab: make('slab', m.slab, { tint: '#c8c3b9' }),
      concrete: make('concrete', m.concrete),
      glass: make('glass', m.glass),
      rail: make('rail', m.rail),
      balustrade: make('balustrade', m.balustrade),
      top,
      core,
      roofY
    };
  }, [spec, N, phase]);

  useFrame(() => {
    const B = W.B;
    // structure: floors 0..N-1 (fractional), then the roof slab N
    const f = ramp(B, b0, b1) * (N + 1);
    // facade: follows three floors behind, then catches up
    const fEnd = b1 + (b1 - b0) * 0.12;
    const fc = Math.max(0, ramp(B, b0 + (b1 - b0) * (3 / N), fEnd) * (N + 0.6));
    parts.slab.u.uBuild.value = f;
    parts.slab.u.uFinish.value = fc;
    parts.concrete.u.uBuild.value = Math.min(f, N);
    parts.glass.u.uBuild.value = fc;
    parts.rail.u.uBuild.value = fc - 0.4;
    parts.balustrade.u.uBuild.value = fc - 0.6;
    // the core leads the floors a little
    const coreH = Math.min(N * FH, (f / (N + 1)) * N * FH + (f > 0 ? 3.5 : 0));
    parts.core.visible = B > b0 - 0.02 && coreH > 0.05 && fc < N;
    parts.core.position.y = PODIUM.h - 0.2;
    parts.core.scale.y = Math.max(0.01, coreH + 0.2);
    // the crown, once the facade has reached the top
    const c = ramp(fc, N - 0.2, N + 0.6);
    parts.top.visible = c > 0.001;
    parts.top.position.y = parts.roofY * (1 - Math.max(0.01, c));
    parts.top.scale.set(1, Math.max(0.01, c), 1);
  });

  return (
    <group position={[spec.x, 0, spec.z]}>
      <primitive object={parts.concrete.mesh} />
      <primitive object={parts.slab.mesh} />
      <primitive object={parts.glass.mesh} />
      <primitive object={parts.rail.mesh} />
      <primitive object={parts.balustrade.mesh} />
      <primitive object={parts.core} />
      <primitive object={parts.top} />
    </group>
  );
}
