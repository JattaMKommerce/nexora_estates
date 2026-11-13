import * as THREE from 'three';
import { TEX_COLS, TEX_ROWS } from './towerGeometry.js';
import { mulberry32 } from '../lib/random.js';
import { pbrMaterial, worldMapped } from './textures.js';

/** Exterior + floor-view texture sets (loaded once, before the scene first renders). */
export const EXTERIOR_TEX = ['concrete', 'paving', 'asphalt', 'grass', 'laminate', 'terrazzo', 'marble'];

/**
 * Curtain-wall panel variation: real glazing never reflects perfectly evenly (coating batches,
 * slight bowing, blinds behind the glass). One texel per glass panel.
 */
function panelCanvas(seed) {
  const c = document.createElement('canvas');
  c.width = TEX_COLS;
  c.height = TEX_ROWS;
  const ctx = c.getContext('2d');
  const rnd = mulberry32(seed);
  for (let y = 0; y < TEX_ROWS; y += 1) {
    for (let x = 0; x < TEX_COLS; x += 1) {
      const r = rnd();
      let v = 0.86 + rnd() * 0.12;
      if (r < 0.14) v = 0.62 + rnd() * 0.14; // blinds / dark rooms
      else if (r < 0.2) v = 1.0;
      const tint = rnd() < 0.5 ? [v, v * 1.01, v * 1.03] : [v * 1.02, v, v * 0.99];
      ctx.fillStyle = `rgb(${Math.min(255, tint[0] * 255) | 0},${Math.min(255, tint[1] * 255) | 0},${Math.min(255, tint[2] * 255) | 0})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

function panelTextures() {
  const bases = [panelCanvas(11), panelCanvas(29)].map((canvas) => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    return t;
  });
  const variants = [];
  for (let i = 0; i < bases.length * TEX_ROWS; i += 1) {
    const t = bases[i % bases.length].clone();
    t.offset.set(((i * 13) % TEX_COLS) / TEX_COLS, Math.floor(i / bases.length) / TEX_ROWS);
    t.needsUpdate = true;
    variants.push(t);
  }
  return { bases, variants };
}

const std = (color, roughness = 0.8, metalness = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

export function createMaterials(pbr) {
  const tex = panelTextures();
  const glass = tex.variants.map(
    (map) =>
      new THREE.MeshStandardMaterial({
        color: '#b9c9d3',
        map,
        metalness: 0.95,
        roughness: 0.04,
        envMapIntensity: 1.15
      })
  );

  const concrete = worldMapped(pbrMaterial(pbr.concrete, { color: '#e9e4dc', aoIntensity: 0.6 }), 3.2);
  const statusFill = (color) =>
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.32, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, toneMapped: false });

  return {
    textures: [...tex.bases, ...tex.variants],
    glass,
    concrete,
    metal: std('#7d6a52', 0.36, 0.85, { envMapIntensity: 1.1 }),
    rail: std('#b8cbd3', 0.05, 0.2, { transparent: true, opacity: 0.28, depthWrite: false, envMapIntensity: 1.3 }),
    clearGlass: new THREE.MeshPhysicalMaterial({
      color: '#e4eef2',
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide
    }),
    ghost: std('#eef3f6', 0.3, 0.05, { transparent: true, opacity: 0.1, depthWrite: false }),
    ghostLine: new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, depthWrite: false }),
    hoverFill: new THREE.MeshBasicMaterial({
      color: '#f3cf94',
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    }),
    hoverLine: new THREE.LineBasicMaterial({ color: '#ffe2b0', transparent: true, opacity: 0.95, toneMapped: false }),
    selectLine: new THREE.LineBasicMaterial({ color: '#f0cf98', transparent: true, opacity: 0.85, toneMapped: false }),
    lobbyGlass: std('#5d717c', 0.05, 0.9, { envMapIntensity: 1.1 }),
    warmLight: new THREE.MeshBasicMaterial({ color: '#ffe4bf', toneMapped: false }),
    plaza: worldMapped(pbrMaterial(pbr.paving, { color: '#d8d2c8', aoIntensity: 0.7 }), 4),
    coping: worldMapped(pbrMaterial(pbr.concrete, { color: '#c9c3b9' }), 3),
    water: std('#2a3a40', 0.02, 0.6, { envMapIntensity: 1.2 }),
    hedge: worldMapped(pbrMaterial(pbr.grass, { color: '#7d8f5c', normalScale: 1.6 }), 1.6),
    lawn: worldMapped(pbrMaterial(pbr.grass, { color: '#a7b483' }), 5),
    foliage: worldMapped(pbrMaterial(pbr.grass, { color: '#a3bb78', normalScale: 2.4, roughness: 1, aoIntensity: 0.7 }), 1.3),
    trunk: std('#5b4a3a', 0.9),
    ground: worldMapped(pbrMaterial(pbr.asphalt, { color: '#a9a8a6' }), 9),
    block: worldMapped(pbrMaterial(pbr.concrete, { color: '#c4c1bb' }), 4),
    context: worldMapped(std('#d8d6d2', 0.55, 0.15, { envMapIntensity: 0.9, map: pbr.concrete.map, normalMap: pbr.concrete.normalMap }), 6),
    // floor-view (cut-away) finishes
    oak: pbrMaterial(pbr.laminate, { color: '#ffffff' }),
    tile: pbrMaterial(pbr.terrazzo, { color: '#ffffff' }),
    stone: pbrMaterial(pbr.marble, { color: '#f2eee8' }),
    deck: pbrMaterial(pbr.concrete, { color: '#cfc8bd' }),
    wall: std('#f3f0ea', 0.92),
    wallCap: std('#2b2d31', 0.9),
    core: std('#bdb8b0', 0.85),
    frame: std('#2f3134', 0.4, 0.6),
    door: std('#b89b78', 0.55),
    liftDoor: std('#a8adb3', 0.25, 0.9, { envMapIntensity: 1.2 }),
    paneGlass: new THREE.MeshPhysicalMaterial({
      color: '#dfeaee',
      roughness: 0.02,
      metalness: 0,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      envMapIntensity: 1.4,
      side: THREE.DoubleSide
    }),
    furniture: {
      fabric: std('#cdbfa9', 0.95),
      fabric2: std('#8f877c', 0.92),
      leather: std('#4e3b2c', 0.55),
      wood: std('#a37c58', 0.62),
      dark: std('#26282b', 0.5, 0.3),
      white: std('#f3f1ec', 0.6),
      stone: std('#ece8e1', 0.25),
      green: std('#56703f', 0.85),
      bedding: std('#e9e1d4', 0.95),
      steel: std('#c6c9cd', 0.3, 0.8),
      rug: std('#bcae99', 1),
      pot: std('#e8e2d8', 0.7)
    },
    status: {
      available: statusFill('#4fb174'),
      hold: statusFill('#e0a23c'),
      booked: statusFill('#9a9aa2'),
      sold: statusFill('#7c7c84'),
      unknown: statusFill('#9a9aa2'),
      none: statusFill('#c9b28b')
    },
    unitHover: new THREE.MeshBasicMaterial({ color: '#ffe0a8', transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false }),
    unitLine: new THREE.LineBasicMaterial({ color: '#ffd89a', toneMapped: false }),
    unitLineSel: new THREE.LineBasicMaterial({ color: '#ffffff', toneMapped: false })
  };
}

export function disposeMaterials(mats) {
  const walk = (m) => {
    if (!m) return;
    if (Array.isArray(m)) m.forEach(walk);
    else if (m.isMaterial || m.isTexture) m.dispose();
    else if (typeof m === 'object') Object.values(m).forEach(walk);
  };
  walk(mats);
}
