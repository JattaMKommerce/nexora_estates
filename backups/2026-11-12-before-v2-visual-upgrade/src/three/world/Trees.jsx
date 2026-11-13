import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import { forestDensity, terrainHeight, rng } from './geo.js';
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
    const t = (v.y - minY) / (maxY - minY);
    const shade = 0.5 + 0.5 * Math.pow(t, 0.9);
    colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = shade;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  g.translate(0, -0.25, 0);
  return g;
}

const PALETTE = ['#a5944f', '#968645', '#b09f5b', '#8b7d3f', '#a99a56', '#9b8b48', '#bba966'].map((c) => new THREE.Color(c));

export default function Trees() {
  const shapes = useMemo(() => [foamTree(3), foamTree(11, { blobs: 4 }), foamTree(29, { blobs: 6 })], []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 }), []);
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
      const s = 3.6 + r() * 3.6 + (f > 0.7 ? 1.2 : 0);
      out[n % 3].push({ x, z, y: h, s, sy: 0.85 + r() * 0.35, rot: r() * Math.PI * 2, c: PALETTE[Math.floor(r() * PALETTE.length)] });
      n++;
    }
    return out;
  }, []);

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
  const lush = useMemo(() => new THREE.Color(0.82, 1.04, 0.74), []);
  useFrame(() => {
    material.color.copy(dry).lerp(lush, W.green * 0.85);
  });

  return (
    <group>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} ref={(el) => (refs.current[i] = el)} />
      ))}
    </group>
  );
}
