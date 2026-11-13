import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { mulberry32 } from '../../lib/random.js';

/**
 * Tree and shrub geometry, built once and instanced everywhere.
 *
 * Canopies are made of crossed "cards" textured with photographic leaf clusters (an atlas composed
 * from Poly Haven CC0 leaf scans, see public/assets/CREDITS.md). Their normals are bent outward from
 * the canopy centre so the crown shades as one soft volume, and cards deep inside or under the crown
 * are darkened (baked occlusion in the vertex colour). Each species has a near and a far version
 * (level of detail): the far one uses a third of the cards.
 *
 * Every species is built at scale 1 with its base at y = 0.
 */
export const SPECIES = {
  // broad, spreading shade tree (rain tree / gulmohar habit), fine compound leaves
  rain: { radii: [4.8, 2.9, 4.8], cy: 7.3, trunkH: 5.6, trunkR: 0.3, branches: 5, cards: 64, card: 2.9, cell: 0 },
  // upright, oval crown (ashoka / ficus habit), broad leaves
  oval: { radii: [2.8, 4.1, 2.8], cy: 6.6, trunkH: 4.0, trunkR: 0.2, branches: 4, cards: 50, card: 2.35, cell: 1 },
  // young street tree
  young: { radii: [2.1, 2.3, 2.1], cy: 4.9, trunkH: 3.4, trunkR: 0.13, branches: 3, cards: 32, card: 1.9, cell: 0 },
  // shrub, for hedges and planting beds
  shrub: { radii: [0.95, 0.7, 0.95], cy: 0.62, trunkH: 0, trunkR: 0, branches: 0, cards: 18, card: 1.05, cell: 1 }
};

const UP = new THREE.Vector3(0, 1, 0);

export function canopyGeometry(sp, lod = 'near', seed = 1) {
  const rnd = mulberry32(seed * 7919 + (lod === 'near' ? 1 : 2));
  const n = lod === 'near' ? sp.cards : Math.max(8, Math.round(sp.cards * 0.28));
  const cardSize = sp.card * (lod === 'near' ? 1 : 1.65);
  const [rx, ry, rz] = sp.radii;
  const centre = new THREE.Vector3(0, sp.cy, 0);
  const pos = [];
  const nor = [];
  const uv = [];
  const col = [];
  const idx = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const d = new THREE.Vector3();
  const p = new THREE.Vector3();
  const sph = new THREE.Vector3();
  const u0 = sp.cell * 0.5;
  for (let i = 0; i < n; i += 1) {
    do {
      d.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    } while (d.lengthSq() > 1 || d.lengthSq() < 0.02);
    d.y = d.y * 0.85 + 0.12;
    d.normalize();
    const shell = 0.42 + 0.58 * Math.sqrt(rnd());
    const c = new THREE.Vector3(d.x * rx * shell, sp.cy + d.y * ry * shell, d.z * rz * shell);
    nrm.set(d.x + (rnd() - 0.5) * 1.2, d.y + (rnd() - 0.5) * 1.2 + 0.25, d.z + (rnd() - 0.5) * 1.2).normalize();
    a.crossVectors(nrm, Math.abs(nrm.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : UP).normalize();
    b.crossVectors(nrm, a).normalize();
    const roll = rnd() * Math.PI * 2;
    const ca = Math.cos(roll);
    const sa = Math.sin(roll);
    const ax = a.clone().multiplyScalar(ca).addScaledVector(b, sa);
    const bx = b.clone().multiplyScalar(ca).addScaledVector(a, -sa);
    const s = cardSize * (0.8 + rnd() * 0.45) * 0.5;
    const ao = (0.5 + 0.5 * shell) * (0.72 + 0.28 * (d.y * 0.5 + 0.5));
    const base = pos.length / 3;
    const corners = [
      [-1, -1, u0, 0],
      [1, -1, u0 + 0.5, 0],
      [1, 1, u0 + 0.5, 1],
      [-1, 1, u0, 1]
    ];
    for (const [sx, sy, cu, cv] of corners) {
      p.copy(c).addScaledVector(ax, sx * s).addScaledVector(bx, sy * s);
      pos.push(p.x, p.y, p.z);
      sph.set((p.x - centre.x) / rx, (p.y - centre.y) / ry, (p.z - centre.z) / rz).normalize();
      sph.multiplyScalar(0.78).addScaledVector(nrm, 0.22).normalize();
      nor.push(sph.x, sph.y, sph.z);
      uv.push(cu, cv);
      col.push(ao, ao, ao);
    }
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
}

/** A tapered cylinder between two points, with bark UVs (u around, v along at ~2 m per repeat). */
function limb(from, to, r0, r1, radial = 7) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const g = new THREE.CylinderGeometry(r1, r0, len, radial, 1, true);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i += 1) uv.setY(i, (uv.getY(i) * len) / 2.2);
  g.translate(0, len / 2, 0);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()));
  g.translate(from.x, from.y, from.z);
  return g;
}

export function trunkGeometry(sp, lod = 'near', seed = 1) {
  if (!sp.trunkH) return null;
  const rnd = mulberry32(seed * 104729 + 3);
  const top = new THREE.Vector3(0, sp.trunkH, 0);
  const parts = [limb(new THREE.Vector3(0, -0.1, 0), top, sp.trunkR, sp.trunkR * 0.7, lod === 'near' ? 8 : 5)];
  if (lod === 'near') {
    for (let i = 0; i < sp.branches; i += 1) {
      const ang = (i / sp.branches) * Math.PI * 2 + rnd() * 0.8;
      const start = new THREE.Vector3(0, sp.trunkH * (0.72 + rnd() * 0.28), 0);
      const reach = 0.5 + rnd() * 0.25;
      const end = new THREE.Vector3(Math.cos(ang) * sp.radii[0] * reach, sp.cy + (rnd() - 0.2) * sp.radii[1] * 0.5, Math.sin(ang) * sp.radii[2] * reach);
      parts.push(limb(start, end, sp.trunkR * 0.55, sp.trunkR * 0.18, 5));
    }
  }
  const g = mergeGeometries(parts, false);
  parts.forEach((x) => x.dispose());
  g.computeBoundingSphere();
  return g;
}

/**
 * Foliage material: alpha-tested leaf atlas, both sides lit with the outward canopy normals, a soft
 * sway in the wind, and a little light passing through the leaves when the sun is behind them.
 */
export function createFoliageMaterial(atlas, uniforms) {
  const m = new THREE.MeshStandardMaterial({
    map: atlas,
    alphaTest: 0.42,
    side: THREE.DoubleSide,
    vertexColors: true,
    roughness: 0.82,
    metalness: 0,
    envMapIntensity: 0.75
  });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          float ph = 0.0;
          #ifdef USE_INSTANCING
            ph = instanceMatrix[3].x * 0.21 + instanceMatrix[3].z * 0.17;
          #endif
          float k = smoothstep(1.0, 8.0, position.y);
          transformed.x += sin(uTime * 1.1 + ph + position.y * 0.35) * 0.05 * k;
          transformed.z += cos(uTime * 0.9 + ph * 1.3 + position.x * 0.4) * 0.04 * k;
        }`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uSunView;')
      .replace(
        '#include <normal_fragment_begin>',
        `#include <normal_fragment_begin>
        #ifdef DOUBLE_SIDED
          normal *= faceDirection; // keep the canopy's outward normal on both sides of each card
        #endif`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          vec3 vd = normalize(vViewPosition);
          float back = pow(clamp(dot(-vd, uSunView), 0.0, 1.0), 3.0);
          totalEmissiveRadiance += diffuseColor.rgb * vec3(1.0, 0.95, 0.7) * back * 0.55;
        }`
      );
  };
  m.customProgramCacheKey = () => 'foliage';
  return m;
}
