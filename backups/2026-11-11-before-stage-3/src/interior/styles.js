import * as THREE from 'three';
import { pbrMaterial } from '../three/textures.js';

export { STYLES, STYLE_TEX, styleById } from './styleData.js';

/** Fabric textures need a finer repeat on 0–1 UV furniture geometry; clones share the image. */
function repeated(set, r) {
  const c = (t) => {
    const x = t.clone();
    x.repeat.set(r, r);
    x.needsUpdate = true;
    return x;
  };
  return { map: c(set.map), normalMap: c(set.normalMap), roughnessMap: c(set.roughnessMap), aoMap: c(set.aoMap) };
}

export function createInteriorMaterials(style, pbr) {
  const clones = [];
  const rep = (key, r) => {
    const set = repeated(pbr[key], r);
    clones.push(...Object.values(set));
    return set;
  };
  const floor = (spec) => pbrMaterial(pbr[spec[0]], { color: spec[1], aoIntensity: 0.6 });
  // Fabric photos carry their own colour (blue linen, red velvet); keep only their weave and sheen.
  const fabric = (key, color, r) => {
    const set = rep(key, r);
    return new THREE.MeshStandardMaterial({
      color,
      normalMap: set.normalMap,
      normalScale: new THREE.Vector2(0.7, 0.7),
      roughnessMap: set.roughnessMap,
      roughness: 1,
      aoMap: set.aoMap,
      aoMapIntensity: 0.6
    });
  };
  const std = (color, roughness = 0.6, metalness = 0, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

  const m = {
    floorLiving: floor(style.floor.living),
    floorBedroom: floor(style.floor.bedroom),
    floorWet: floor(style.floor.wet),
    deck: floor(style.floor.deck),
    wall: std(style.wall, 0.94),
    wetWall: pbrMaterial(pbr[style.floor.wet[0]], { color: style.floor.wet[1], aoIntensity: 0.4 }),
    ceiling: std('#f7f6f3', 0.92),
    skirting: std(style.cabinet, 0.6),
    fabric: fabric(style.fabric[0], style.fabric[1], 3),
    fabric2: fabric(style.fabric2[0], style.fabric2[1], 3),
    wood: pbrMaterial(rep(style.wood[0], 1.5), { color: style.wood[1], aoIntensity: 0.5 }),
    rug: fabric(style.rug[0], style.rug[1], 4),
    counter: style.counter[0] ? pbrMaterial(rep(style.counter[0], 1), { color: style.counter[1], roughness: 0.35 }) : std(style.counter[1], 0.3),
    cabinet: std(style.cabinet, 0.55),
    dark: std(style.dark, 0.45, 0.2),
    metal: std(style.metal, 0.3, 0.9, { envMapIntensity: 1.2 }),
    ceramic: std('#f8f8f6', 0.12, 0, { envMapIntensity: 0.8 }),
    bedding: std(style.bedding, 0.95),
    throw: std(style.throw, 0.95),
    steel: std('#c9cdd1', 0.28, 0.85, { envMapIntensity: 1 }),
    screen: std('#0b0c0e', 0.12, 0.3, { envMapIntensity: 0.6 }),
    mirror: std('#d9dde0', 0.04, 1, { envMapIntensity: 0.7 }),
    shade: std('#fff4e2', 0.9, 0, { emissive: '#ffd9a6', emissiveIntensity: 0.6, side: THREE.DoubleSide }),
    bulb: new THREE.MeshBasicMaterial({ color: '#fff3dd', toneMapped: false }),
    frame: std('#2a2c2f', 0.4, 0.6),
    door: style.id === 'luxe' ? std('#4a3626', 0.5) : std('#efebe4', 0.55),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#eef4f6',
      roughness: 0.02,
      metalness: 0,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide
    }),
    showerGlass: new THREE.MeshPhysicalMaterial({
      color: '#e8f1f2',
      roughness: 0.05,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  };
  m.dispose = () => {
    Object.values(m).forEach((x) => x?.isMaterial && x.dispose());
    clones.forEach((t) => t.dispose());
  };
  return m;
}
