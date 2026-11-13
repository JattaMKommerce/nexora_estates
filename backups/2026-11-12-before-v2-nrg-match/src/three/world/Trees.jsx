import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import { forestDensity, terrainHeight, rng, ORCHARDS, ROADS, ROAD_W, WATER_Y } from './geo.js';
import { makeFoamMaterial } from '../materials.js';
import { W } from '../../core/world.js';
import { quality } from '../../core/quality.js';

/**
 * Model-railway foam trees: a few lumpy balls clustered together, smooth-shaded, darker underneath.
 * Thousands of them in one draw call per shape.
 */
const perlin = new ImprovedNoise();

export function foamTree(seed, { blobs = 5, detail = 1 } = {}) {
  const r = rng(seed);
  const parts = [];
  for (let i = 0; i < blobs; i++) {
    const s = i === 0 ? 1 : 0.55 + r() * 0.4;
    const g = new THREE.IcosahedronGeometry(s, detail);
    const a = r() * Math.PI * 2;
    const rad = i === 0 ? 0 : 0.45 + r() * 0.35;
    g.translate(Math.cos(a) * rad, (i === 0 ? 1.05 : 0.75 + r() * 0.75) * 1.0, Math.sin(a) * rad);
    parts.push(g);
  }
  let g = mergeGeometries(parts);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g, 1e-3);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  const colors = new Float32Array(p.count * 3);
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < p.count; i++) {
    minY = Math.min(minY, p.getY(i));
    maxY = Math.max(maxY, p.getY(i));
  }
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = perlin.noise(v.x * 1.9 + seed, v.y * 1.9, v.z * 1.9) * 0.16;
    v.multiplyScalar(1 + n);
    p.setXYZ(i, v.x, v.y, v.z);
    // clamped: the bump above can push a vertex past the original extremes (a negative base would give NaN)
    const t = Math.min(1, Math.max(0, (v.y - minY) / (maxY - minY)));
    const shade = 0.52 + 0.53 * Math.pow(t, 0.75);
    colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = shade;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  g.translate(0, -0.25, 0);
  return g;
}

// light, fresh khaki-sage foam: harmonious with the sand and the sage meadows
const PALETTE = ['#b2b06a', '#a6a862', '#bdb974', '#9ca05c', '#c3bd78', '#aaa866', '#b8b770', '#a0a95f'].map((c) => new THREE.Color(c));
const ORCHARD = ['#9fae5f', '#a7b465', '#98a95b'].map((c) => new THREE.Color(c));

export default function Trees() {
  const shapes = useMemo(() => [foamTree(3), foamTree(11, { blobs: 4 }), foamTree(29, { blobs: 6 })], []);
  const material = useMemo(() => makeFoamMaterial(), []);
  const refs = useRef([]);

  const placements = useMemo(() => {
    const r = rng(77);
    const out = [[], [], []];
    const want = quality.trees;
    const extent = 980;
    const step = 7;
    const cand = [];
    for (let x = -extent; x <= extent; x += step)
      for (let z = -extent; z <= extent; z += step) cand.push([x + (r() - 0.5) * step * 0.9, z + (r() - 0.5) * step * 0.9]);
    // shuffle so thinning stays even
    for (let i = cand.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [cand[i], cand[j]] = [cand[j], cand[i]];
    }
    let n = 0;
    for (const [x, z] of cand) {
      if (n >= want) break;
      // cheap reject before the height lookup
      const far = Math.hypot(x, z);
      if (far < 112) continue;
      const h = terrainHeight(x, z);
      const f = forestDensity(x, z, h);
      const keep = far > 700 ? f * 0.6 : f;
      if (r() > keep * keep * 1.5) continue;
      // mostly mid-sized trees, some small shrubs at the edges of the woods, a few big ones inside
      const k = r();
      const s = k < 0.22 ? 1.8 + r() * 1.4 : 3.4 + r() * 3.2 + (f > 0.7 && k > 0.8 ? 2.2 : 0);
      out[n % 3].push({ x, z, y: h, s, sy: 0.82 + r() * 0.4, rot: r() * Math.PI * 2, c: PALETTE[Math.floor(r() * PALETTE.length)] });
      n++;
    }
    return out;
  }, []);

  // orchards: small round trees in straight rows
  const orchard = useMemo(() => {
    const r = rng(303);
    const list = [];
    const sets = quality.low ? ORCHARDS.slice(0, 2) : ORCHARDS;
    for (const o of sets) {
      const c = Math.cos(o.rot);
      const sn = Math.sin(o.rot);
      for (let a = -o.w / 2 + 4; a <= o.w / 2 - 4; a += 7.5)
        for (let b = -o.d / 2 + 4; b <= o.d / 2 - 4; b += 8.5) {
          const x = o.x + a * c - b * sn;
          const z = o.z + a * sn + b * c;
          const h = terrainHeight(x, z);
          if (h < WATER_Y + 1.5) continue;
          if (Object.entries(ROADS).some(([nm, t]) => t.nearest(x, z).d < ROAD_W[nm] / 2 + 5)) continue;
          if (r() < 0.06) continue; // a few gaps, like a real orchard
          list.push({ x, z, y: h, s: 2.2 + r() * 0.6, rot: r() * 6.28, c: ORCHARD[Math.floor(r() * ORCHARD.length)] });
        }
    }
    const m = new THREE.InstancedMesh(foamTree(91, { blobs: 3 }), material, list.length);
    const ob = new THREE.Object3D();
    list.forEach((t, i) => {
      ob.position.set(t.x, t.y, t.z);
      ob.rotation.set(0, t.rot, 0);
      ob.scale.set(t.s, t.s * 0.95, t.s);
      ob.updateMatrix();
      m.setMatrixAt(i, ob.matrix);
      m.setColorAt(i, t.c);
    });
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }, [material]);

  const meshes = useMemo(
    () =>
      placements.map((list, k) => {
        const m = new THREE.InstancedMesh(shapes[k], material, list.length);
        const o = new THREE.Object3D();
        const c = new THREE.Color();
        list.forEach((t, i) => {
          o.position.set(t.x, t.y, t.z);
          o.rotation.set(0, t.rot, 0);
          o.scale.set(t.s, t.s * t.sy, t.s);
          o.updateMatrix();
          m.setMatrixAt(i, o.matrix);
          c.copy(t.c).offsetHSL(0, 0, (Math.random() - 0.5) * 0.03);
          m.setColorAt(i, c);
        });
        m.castShadow = true;
        m.receiveShadow = true;
        m.frustumCulled = false;
        return m;
      }),
    [placements, shapes, material]
  );

  // the landscape greens as the project matures
  const dry = useMemo(() => new THREE.Color(1, 1, 1), []);
  const lush = useMemo(() => new THREE.Color(0.86, 1.0, 0.84), []);
  useFrame(() => {
    material.color.copy(dry).lerp(lush, W.green * 0.85);
  });

  return (
    <group>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} ref={(el) => (refs.current[i] = el)} />
      ))}
      <primitive object={orchard} />
    </group>
  );
}
