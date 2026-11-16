/**
 * Shared building blocks for the 360° models: textures and materials, world-scaled boxes,
 * a batcher that merges static parts into one mesh per material, leaf-card trees, lamp glows,
 * terrain and a dusk sky used for reflections.
 *
 * Units are metres. Textures are Poly Haven CC0 (see public/nexora/3d/CREDITS.md).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* value noise, for terrain and colour variation */
function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
export function noise2(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, y, oct = 4) {
  let s = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < oct; i += 1) {
    s += amp * noise2(x * f, y * f);
    f *= 2.03;
    amp *= 0.5;
  }
  return s;
}

/**
 * Box with its base on y = 0 (centred in x and z). With uv = [su, sv], each face's UVs are scaled
 * to its size in metres divided by su / sv, so textures keep their real-world size on any box.
 */
export function box(w, h, d, uv = null) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(0, h / 2, 0);
  if (uv) {
    const [su, sv] = uv;
    const a = g.attributes.uv;
    // face order: +x, -x, +y, -y, +z, -z (4 vertices each)
    const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f += 1) {
      for (let k = 0; k < 4; k += 1) {
        const i = f * 4 + k;
        a.setXY(i, (a.getX(i) * dims[f][0]) / su, (a.getY(i) * dims[f][1]) / sv);
      }
    }
  }
  return g;
}

/** Collects transformed parts per material and merges each group into a single mesh. */
export class Batch {
  constructor() {
    this.parts = new Map();
    this.m = new THREE.Matrix4();
    this.q = new THREE.Quaternion();
    this.e = new THREE.Euler();
    this.v = new THREE.Vector3();
    this.s = new THREE.Vector3();
    this.stack = [new THREE.Matrix4()];
  }

  /** Parts added until pop() are placed relative to (x, y, z) turned by ry. */
  push(x, y, z, ry = 0) {
    const m = new THREE.Matrix4().makeRotationY(ry).setPosition(x, y, z);
    this.stack.push(this.stack[this.stack.length - 1].clone().multiply(m));
    return this;
  }

  pop() {
    if (this.stack.length > 1) this.stack.pop();
    return this;
  }

  /** A local point in world coordinates (for lamp glows). */
  pt(x, y, z) {
    const v = new THREE.Vector3(x, y, z).applyMatrix4(this.stack[this.stack.length - 1]);
    return [v.x, v.y, v.z];
  }

  /** add(key, geometry, x, y, z, rotY = 0, scale = 1 | [sx, sy, sz], rotX = 0, rotZ = 0) */
  add(key, geo, x = 0, y = 0, z = 0, ry = 0, sc = 1, rx = 0, rz = 0) {
    this.e.set(rx, ry, rz);
    this.q.setFromEuler(this.e);
    if (Array.isArray(sc)) this.s.set(sc[0], sc[1], sc[2]);
    else this.s.set(sc, sc, sc);
    this.m.compose(this.v.set(x, y, z), this.q, this.s);
    this.m.premultiply(this.stack[this.stack.length - 1]);
    const g = geo.clone().applyMatrix4(this.m);
    for (const name of Object.keys(g.attributes)) {
      if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
    }
    if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()]);
    if (!this.parts.has(key)) this.parts.set(key, []);
    this.parts.get(key).push(g);
    return this;
  }

  build(mats, { noShadow = [], noReceive = [] } = {}) {
    const group = new THREE.Group();
    for (const [key, list] of this.parts) {
      const geo = mergeGeometries(list, false);
      list.forEach((g) => g.dispose());
      const mesh = new THREE.Mesh(geo, mats[key]);
      mesh.castShadow = !noShadow.includes(key);
      mesh.receiveShadow = !noReceive.includes(key);
      mesh.name = key;
      group.add(mesh);
    }
    this.parts.clear();
    return group;
  }
}

/** Instanced copies of one geometry from a list of {x, y, z, ry, s} placements. */
export function instanced(geo, mat, items, { cast = true, receive = true, colors = null } = {}) {
  const mesh = new THREE.InstancedMesh(geo, mat, items.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const v = new THREE.Vector3();
  const s = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  items.forEach((it, i) => {
    q.setFromAxisAngle(up, it.ry || 0);
    const sc = it.s || 1;
    if (Array.isArray(sc)) s.set(sc[0], sc[1], sc[2]);
    else s.set(sc, sc, sc);
    m.compose(v.set(it.x, it.y || 0, it.z), q, s);
    mesh.setMatrixAt(i, m);
    if (colors) mesh.setColorAt(i, colors(it, i));
  });
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  mesh.computeBoundingSphere();
  return mesh;
}

/* ------------------------------------------------------------------------------------------ */
/* Canvas textures                                                                             */

function canvasTex(w, h, draw, { srgb = true, repeat = true } = {}) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/**
 * A lit room seen through glass, for the emissive map of windows: warm ceiling glow, a floor,
 * furniture silhouettes and the odd lamp. One repeat covers 4 m of facade, floor to ceiling.
 */
function interiorTexture(seed) {
  const rnd = mulberry32(seed);
  return canvasTex(512, 256, (g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#ffe3b0');
    grad.addColorStop(0.18, '#f6b56a');
    grad.addColorStop(0.62, '#b8692f');
    grad.addColorStop(0.78, '#5e3418');
    grad.addColorStop(1, '#2b170b');
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    // cove light strip under the ceiling
    g.fillStyle = 'rgba(255,240,205,0.85)';
    g.fillRect(0, 6, w, 7);
    // rooms: some brighter, some dimmer
    for (let x = 0; x < w; x += 128) {
      const k = 0.35 + rnd() * 0.65;
      g.fillStyle = `rgba(20,10,4,${(1 - k) * 0.7})`;
      g.fillRect(x, 0, 128, h);
      // pendant / lamp glow
      if (rnd() > 0.35) {
        const lx = x + 20 + rnd() * 88;
        const rg = g.createRadialGradient(lx, h * 0.42, 2, lx, h * 0.42, 60);
        rg.addColorStop(0, 'rgba(255,236,190,0.95)');
        rg.addColorStop(1, 'rgba(255,200,120,0)');
        g.fillStyle = rg;
        g.fillRect(lx - 60, h * 0.42 - 60, 120, 120);
      }
      // furniture silhouettes
      g.fillStyle = 'rgba(38,22,12,0.85)';
      const n = 1 + Math.floor(rnd() * 3);
      for (let i = 0; i < n; i += 1) {
        const fw = 18 + rnd() * 46;
        const fh = 14 + rnd() * 40;
        g.fillRect(x + rnd() * (128 - fw), h - 34 - fh, fw, fh);
      }
      // plant
      if (rnd() > 0.5) {
        g.fillStyle = 'rgba(30,40,18,0.9)';
        g.beginPath();
        g.ellipse(x + 10 + rnd() * 100, h - 70, 12, 30, 0, 0, Math.PI * 2);
        g.fill();
      }
      // partition
      g.fillStyle = 'rgba(25,14,7,0.55)';
      g.fillRect(x, 0, 3, h);
    }
  });
}

function glowTexture() {
  return canvasTex(64, 64, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.18, 'rgba(255,236,200,0.7)');
    r.addColorStop(0.45, 'rgba(255,196,120,0.18)');
    r.addColorStop(1, 'rgba(255,180,100,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, w, w);
  }, { repeat: false });
}

function solarTexture() {
  return canvasTex(128, 256, (g, w, h) => {
    g.fillStyle = '#1b2a48';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(190,210,240,0.35)';
    g.lineWidth = 2;
    for (let x = 0; x <= w; x += w / 4) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y <= h; y += h / 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = '#c9ccd2';
    g.lineWidth = 6;
    g.strokeRect(0, 0, w, h);
  }, { repeat: false });
}

function waterNormal() {
  const rnd = mulberry32(7);
  return canvasTex(256, 256, (g, w, h) => {
    const img = g.createImageData(w, h);
    const hgt = (x, y) => {
      let s = 0;
      for (let i = 0; i < 5; i += 1) {
        const fx = (i + 1) * 2;
        s += Math.sin(((x + rnd.k[i] * w) / w) * Math.PI * 2 * fx + Math.cos((y / h) * Math.PI * 2 * (i + 1)) * 1.7) / (i + 1);
      }
      return s;
    };
    rnd.k = [0, 1, 2, 3, 4].map(() => rnd());
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const dx = hgt(x + 1, y) - hgt(x - 1, y);
        const dy = hgt(x, y + 1) - hgt(x, y - 1);
        const i = (y * w + x) * 4;
        img.data[i] = 128 + dx * 40;
        img.data[i + 1] = 128 + dy * 40;
        img.data[i + 2] = 255;
        img.data[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
  }, { srgb: false });
}

/** Lawn stripes / court lines etc. are drawn per model; this is a plain court surface. */
export function courtTexture(kind) {
  return canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = kind === 'tennis' ? '#3f7d57' : '#b4583e';
    g.fillRect(0, 0, w, h);
    g.fillStyle = kind === 'tennis' ? '#2f6a47' : '#9c4a33';
    g.fillRect(w * 0.12, h * 0.08, w * 0.76, h * 0.84);
    g.strokeStyle = 'rgba(255,255,255,0.9)';
    g.lineWidth = 4;
    g.strokeRect(w * 0.12, h * 0.08, w * 0.76, h * 0.84);
    g.beginPath();
    g.moveTo(w * 0.12, h / 2);
    g.lineTo(w * 0.88, h / 2);
    g.stroke();
    g.beginPath();
    g.moveTo(w / 2, h * 0.27);
    g.lineTo(w / 2, h * 0.73);
    g.stroke();
    g.strokeRect(w * 0.12, h * 0.27, w * 0.76, h * 0.46);
  }, { repeat: false });
}

/* ------------------------------------------------------------------------------------------ */
/* Trees: crossed leaf cards around a crown, instanced (from the Stage 3 city, CC0 leaf atlas)  */

export const SPECIES = {
  rain: { radii: [4.8, 2.9, 4.8], cy: 7.3, trunkH: 5.6, trunkR: 0.3, branches: 5, cards: 64, card: 2.9, cell: 0 },
  oval: { radii: [2.8, 4.1, 2.8], cy: 6.6, trunkH: 4.0, trunkR: 0.2, branches: 4, cards: 50, card: 2.35, cell: 1 },
  young: { radii: [2.1, 2.3, 2.1], cy: 4.9, trunkH: 3.4, trunkR: 0.13, branches: 3, cards: 32, card: 1.9, cell: 0 },
  shrub: { radii: [0.95, 0.7, 0.95], cy: 0.62, trunkH: 0, trunkR: 0, branches: 0, cards: 18, card: 1.05, cell: 1 }
};
const UP = new THREE.Vector3(0, 1, 0);

export function canopyGeometry(sp, lod = 'near', seed = 1) {
  const rnd = mulberry32(seed * 7919 + (lod === 'near' ? 1 : 2));
  const n = lod === 'near' ? sp.cards : Math.max(8, Math.round(sp.cards * 0.3));
  const cardSize = sp.card * (lod === 'near' ? 1 : 1.6);
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
    const corners = [[-1, -1, u0, 0], [1, -1, u0 + 0.5, 0], [1, 1, u0 + 0.5, 1], [-1, 1, u0, 1]];
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

/* ------------------------------------------------------------------------------------------ */

/** Sun and sky for this scene: a low, warm late-afternoon sun. */
export const SUN_DIR = new THREE.Vector3(-0.62, 0.42, -0.66).normalize();

/** A dusk sky rendered into an environment map, for reflections in glass, water and paint. */
function duskEnvironment(renderer) {
  const scene = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { uSun: { value: SUN_DIR.clone() } },
    vertexShader: 'varying vec3 vDir; void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      varying vec3 vDir;
      uniform vec3 uSun;
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 top = vec3(0.26, 0.40, 0.72);
        vec3 hor = vec3(1.05, 0.74, 0.48);
        vec3 gnd = vec3(0.20, 0.21, 0.14);
        vec3 c = h > 0.0 ? mix(hor, top, pow(clamp(h, 0.0, 1.0), 0.5)) : mix(hor * 0.55, gnd, pow(clamp(-h, 0.0, 1.0), 0.35));
        float s = max(dot(d, normalize(uSun)), 0.0);
        c += vec3(1.0, 0.78, 0.5) * pow(s, 90.0) * 9.0 + vec3(1.0, 0.62, 0.32) * pow(s, 5.0) * 0.55;
        gl_FragColor = vec4(c, 1.0);
      }`
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 24), mat));
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(scene, 0.03);
  pm.dispose();
  mat.dispose();
  return rt.texture;
}

/**
 * createKit(renderer, base) -> { mats, uv, tex, ready, trees, glow, ground, ... }
 * `ready` resolves when every texture has loaded (or failed), so the first frame is complete.
 */
export function createKit(renderer, base) {
  const manager = new THREE.LoadingManager();
  let resolveReady;
  const ready = new Promise((r) => { resolveReady = r; });
  let pending = 0;
  const loader = new THREE.TextureLoader(manager);
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const load = (name, srgb = true) => {
    pending += 1;
    const t = loader.load(base + name, () => { pending -= 1; if (!pending) resolveReady(); }, undefined, () => { pending -= 1; if (!pending) resolveReady(); });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.anisotropy = maxAniso;
    return t;
  };

  const tex = {
    grass: load('grass.jpg'),
    plaster: load('plaster.jpg'),
    oak: load('oak.jpg'),
    paving: load('paving.jpg'),
    stone: load('stone.jpg'),
    asphalt: load('asphalt.jpg'),
    bark: load('bark.jpg'),
    leaves: load('leaves.webp'),
    interiorA: interiorTexture(11),
    interiorB: interiorTexture(23),
    glow: glowTexture(),
    solar: solarTexture(),
    water: waterNormal()
  };
  tex.leaves.wrapS = tex.leaves.wrapT = THREE.ClampToEdgeWrapping;

  // metres per texture repeat, used with box(..., uv)
  const uv = {
    plaster: [3.5, 3.5],
    stone: [2.6, 2.6],
    wood: [1.6, 3.2],
    deck: [2.4, 2.4],
    paving: [2.6, 2.6],
    asphalt: [7, 7],
    lawn: [5, 5]
  };

  const std = (o) => new THREE.MeshStandardMaterial(o);
  const glass = (map, extra = {}) => {
    const m = std({ color: 0x0b1015, roughness: 0.07, metalness: 0, envMapIntensity: 1.5, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 1.05, ...extra });
    // instanced glass: per-instance colour dims or brightens the lit rooms
    m.onBeforeCompile = (s) => {
      s.fragmentShader = s.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        #ifdef USE_INSTANCING_COLOR
          totalEmissiveRadiance *= vColor;
        #endif`);
    };
    m.customProgramCacheKey = () => 'nx-glass';
    return m;
  };

  const foliage = std({ map: tex.leaves, alphaTest: 0.42, side: THREE.DoubleSide, vertexColors: true, roughness: 0.85, metalness: 0, envMapIntensity: 0.55, color: 0xd7e3b4 });
  foliage.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader
      .replace('#include <normal_fragment_begin>', `#include <normal_fragment_begin>
        #ifdef DOUBLE_SIDED
          normal *= faceDirection;
        #endif`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * vec3(0.5, 0.42, 0.2) * 0.22;`);
  };
  foliage.customProgramCacheKey = () => 'nx-foliage';

  // colours are linear multipliers on the photo textures (values above 1 lift dark scans to the
  // real-world brightness of white plaster, sandstone paving and sunlit lawn)
  const lin = (r, g, b) => new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace);
  const mats = {
    plaster: std({ map: tex.plaster, color: 0xf7f3ec, roughness: 0.92 }),
    plasterWarm: std({ map: tex.plaster, color: 0xeee2cd, roughness: 0.92 }),
    plasterGrey: std({ map: tex.plaster, color: 0x8f8a83, roughness: 0.9 }),
    stone: std({ map: tex.stone, color: lin(1.75, 1.62, 1.5), roughness: 0.95 }),
    wood: std({ map: tex.oak, color: lin(1.05, 0.86, 0.7), roughness: 0.6 }),
    deck: std({ map: tex.oak, color: lin(0.78, 0.6, 0.48), roughness: 0.78 }),
    metal: std({ color: 0x2c2723, roughness: 0.45, metalness: 0.55 }),
    roof: std({ color: 0x6b6863, roughness: 0.88 }),
    coping: std({ map: tex.plaster, color: 0xffffff, roughness: 0.7 }),
    paving: std({ map: tex.paving, color: lin(2.3, 2.45, 2.65), roughness: 0.9 }),
    asphalt: std({ map: tex.asphalt, color: lin(0.95, 0.95, 0.98), roughness: 0.96 }),
    kerb: std({ color: 0xd8d1c4, roughness: 0.9 }),
    lawn: std({ map: tex.grass, color: lin(1.15, 2.2, 0.85), roughness: 1 }),
    hedge: std({ map: tex.grass, color: lin(0.55, 1.15, 0.42), roughness: 1 }),
    glassA: glass(tex.interiorA),
    glassB: glass(tex.interiorB),
    glassDark: std({ color: 0x0e1418, roughness: 0.05, metalness: 0.1, envMapIntensity: 1.6 }),
    railing: std({ color: 0x9fb8c2, roughness: 0.05, metalness: 0, envMapIntensity: 1.4, transparent: true, opacity: 0.32, depthWrite: false }),
    solar: std({ map: tex.solar, color: 0xffffff, roughness: 0.22, metalness: 0.35, envMapIntensity: 1.4 }),
    water: std({ color: 0x1b9fc1, roughness: 0.04, metalness: 0, emissive: 0x0d6d86, emissiveIntensity: 0.55, envMapIntensity: 1.7, normalMap: tex.water, normalScale: new THREE.Vector2(0.25, 0.25) }),
    lake: std({ color: 0x2d5d63, roughness: 0.05, metalness: 0, envMapIntensity: 1.5, normalMap: tex.water, normalScale: new THREE.Vector2(0.15, 0.15) }),
    paintWhite: std({ color: 0xe9e8e4, roughness: 0.28, metalness: 0.35, envMapIntensity: 1.2 }),
    paintDark: std({ color: 0x30343a, roughness: 0.3, metalness: 0.5, envMapIntensity: 1.2 }),
    paintRed: std({ color: 0x7b1e22, roughness: 0.3, metalness: 0.45, envMapIntensity: 1.2 }),
    tyre: std({ color: 0x161616, roughness: 0.9 }),
    lampHead: new THREE.MeshBasicMaterial({ color: 0xffe2b0 }),
    fabric: std({ color: 0xf2ebdf, roughness: 0.95 }),
    bark: std({ map: tex.bark, color: 0xb9ad9c, roughness: 0.95 }),
    foliage,
    soil: std({ color: 0x6d5a43, roughness: 1 })
  };

  // tree geometries, built once per species and level of detail
  const treeGeo = {};
  const tree = (species, lod = 'near') => {
    const key = species + lod;
    if (!treeGeo[key]) {
      const sp = SPECIES[species];
      treeGeo[key] = { canopy: canopyGeometry(sp, lod, species.length * 13), trunk: trunkGeometry(sp, lod, species.length * 5) };
    }
    return treeGeo[key];
  };

  /** One instanced canopy (+ trunk) mesh per species for a list of {x, y, z, s, ry, species}. */
  const forest = (items, lod = 'near', { cast = true } = {}) => {
    const g = new THREE.Group();
    const bySpecies = {};
    items.forEach((it) => { (bySpecies[it.species] = bySpecies[it.species] || []).push(it); });
    Object.entries(bySpecies).forEach(([species, list]) => {
      const t = tree(species, lod);
      const tint = (it) => new THREE.Color().setHSL(0.2 + (it.hue || 0), 0.25, 0.5 + (it.light || 0)).multiplyScalar(1.6);
      g.add(instanced(t.canopy, mats.foliage, list, { cast, receive: true, colors: tint }));
      if (t.trunk) g.add(instanced(t.trunk, mats.bark, list, { cast, receive: false }));
    });
    return g;
  };

  /** Additive glow sprites (one draw call) for lamps and lit windows. */
  const glow = (points, size, color = 0xffd9a0, opacity = 1) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
    const m = new THREE.PointsMaterial({
      map: tex.glow, size, color, transparent: true, opacity, depthWrite: false,
      blending: THREE.AdditiveBlending, sizeAttenuation: true, toneMapped: false
    });
    const p = new THREE.Points(g, m);
    p.renderOrder = 5;
    return p;
  };

  /**
   * Terrain around a site: flat inside `flat` (half-extent [x, z]), rolling outside, with
   * large-scale colour variation so the grass texture does not visibly repeat.
   */
  const ground = ({ size = 1600, seg = 160, flat = [40, 40], margin = 30, hills = 18, y = 0, uvScale = 6, seed = 1 }) => {
    const g = new THREE.PlaneGeometry(size, size, seg, seg);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    const uvA = g.attributes.uv;
    const col = [];
    const c = new THREE.Color();
    for (let i = 0; i < p.count; i += 1) {
      const x = p.getX(i);
      const z = p.getZ(i);
      const dx = Math.max(0, Math.abs(x) - flat[0]);
      const dz = Math.max(0, Math.abs(z) - flat[1]);
      const dist = Math.hypot(dx, dz);
      const k = THREE.MathUtils.smoothstep(dist, margin * 0.2, margin * 3);
      const n = fbm(x * 0.006 + seed, z * 0.006 - seed, 4);
      p.setY(i, y + k * (n - 0.35) * hills * 2 + k * dist * 0.02);
      uvA.setXY(i, x / uvScale, z / uvScale);
      const v = fbm(x * 0.02 + 9, z * 0.02 + 3, 3);
      const dry = THREE.MathUtils.smoothstep(fbm(x * 0.004 - 4, z * 0.004 + 7, 3), 0.55, 0.75);
      c.setRGB(0.78 + v * 0.35, 0.86 + v * 0.25, 0.62 + v * 0.18);
      c.lerp(new THREE.Color(1.05, 0.92, 0.66), dry * 0.45);
      // farmland patchwork beyond the site: fields in slightly different crops
      const fx = Math.floor((x * 0.8 + z * 0.6) / 70);
      const fz = Math.floor((-x * 0.6 + z * 0.8) / 48);
      const f = FIELDS[Math.floor(hash2(fx * 1.7 + seed, fz * 2.3) * FIELDS.length)];
      const fk = THREE.MathUtils.smoothstep(dist, margin * 0.5, margin * 2) * 0.85;
      c.r *= 1 + (f[0] - 1) * fk;
      c.g *= 1 + (f[1] - 1) * fk;
      c.b *= 1 + (f[2] - 1) * fk;
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    const m = std({ map: tex.grass, color: new THREE.Color().setRGB(1.0, 1.75, 0.72, THREE.LinearSRGBColorSpace), roughness: 1, vertexColors: true });
    const mesh = new THREE.Mesh(g, m);
    mesh.receiveShadow = true;
    mesh.name = 'ground';
    return mesh;
  };

  const FIELDS = [[1, 1, 1], [1.18, 1.05, 0.72], [0.82, 0.92, 0.8], [1.3, 1.08, 0.62], [0.95, 1.08, 0.9], [1.12, 0.98, 0.78]];

/** Height of `ground()` at (x, z) for the same options, to plant trees on the hills. */
  const groundY = (x, z, { flat = [40, 40], margin = 30, hills = 18, y = 0, seed = 1 }) => {
    const dx = Math.max(0, Math.abs(x) - flat[0]);
    const dz = Math.max(0, Math.abs(z) - flat[1]);
    const dist = Math.hypot(dx, dz);
    const k = THREE.MathUtils.smoothstep(dist, margin * 0.2, margin * 3);
    const n = fbm(x * 0.006 + seed, z * 0.006 - seed, 4);
    return y + k * (n - 0.35) * hills * 2 + k * dist * 0.02;
  };

  return {
    tex, mats, uv, ready, forest, glow, ground, groundY,
    environment: duskEnvironment(renderer),
    interiorMats: [mats.glassA, mats.glassB]
  };
}
