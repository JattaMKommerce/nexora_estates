import * as THREE from 'three';
import { pbrMaterial, worldMapped } from './textures.js';
import { createGlazingMaterial } from './glazing.js';
import { LOBBY_H } from './towerGeometry.js';

/** Exterior + floor-view texture sets (loaded once, before the scene first renders). */
export const EXTERIOR_TEX = ['concrete', 'paving', 'pavement', 'asphalt', 'grass', 'laminate', 'terrazzo', 'marble'];

const std = (color, roughness = 0.8, metalness = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

export function createMaterials(pbr) {
  // one glazing material for every floor (rooms vary per window in the shader)
  const glass = createGlazingMaterial();
  const concrete = worldMapped(pbrMaterial(pbr.concrete, { color: '#e9e4dc', aoIntensity: 0.6 }), 3.2);
  // pale, finely textured cladding on slab edges and balconies
  const cladding = worldMapped(
    new THREE.MeshStandardMaterial({
      color: '#e7e2da',
      roughness: 0.6,
      normalMap: pbr.concrete.normalMap,
      normalScale: new THREE.Vector2(0.28, 0.28),
      envMapIntensity: 0.9
    }),
    2.4
  );
  const statusFill = (color) =>
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.32, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, toneMapped: false });

  return {
    glass,
    concrete,
    cladding,
    // anodised bronze fins and handrails; mullions are tinted darker through vertex colours
    metal: std('#8f7a62', 0.32, 0.9, { envMapIntensity: 1.15, vertexColors: true }),
    bronze: std('#8f7a62', 0.32, 0.9, { envMapIntensity: 1.15 }),
    // the crown's screen: slender fins in the cladding's pale finish
    crownFins: std('#dcd6cc', 0.5, 0.15, { envMapIntensity: 1, vertexColors: true }),
    graphite: std('#34363a', 0.38, 0.75, { envMapIntensity: 1.1 }),
    // frameless balcony glass, faintly green at the edges
    rail: new THREE.MeshPhysicalMaterial({
      color: '#e6f0ec',
      roughness: 0.02,
      metalness: 0,
      transparent: true,
      opacity: 0.13,
      depthWrite: false,
      envMapIntensity: 1.6
    }),
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
    // double-height lobby: tall, brightly lit "rooms" behind the glass
    lobbyGlass: createGlazingMaterial({ height: LOBBY_H - 0.4, vision: LOBBY_H - 0.4, depth: 11, level: 0.6, lamps: 1.4, roomPanes: 5, key: 'lobby' }),
    warmLight: new THREE.MeshBasicMaterial({ color: '#ffe4bf', toneMapped: false }),
    crownLight: new THREE.MeshStandardMaterial({ color: '#3b3127', emissive: '#ffd9a8', emissiveIntensity: 1.6, roughness: 0.5 }),
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
