import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { BARK_URLS, FOLIAGE_URL, pbrMaterial } from '../textures.js';
import { SUN_DIR } from '../Atmosphere.jsx';
import { generateCity } from './layout.js';
import { createBlockMaterial, createFacadeMaterial, createLawnMaterial, createRoadMaterial } from './materials.js';
import { SPECIES, canopyGeometry, createFoliageMaterial, trunkGeometry } from './vegetation.js';

const noRaycast = () => null;
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const tmpC = new THREE.Color();

/** Unit box with its base at y = 0. */
export function unitBox() {
  const g = new THREE.BoxGeometry(1, 1, 1);
  g.translate(0, 0.5, 0);
  return g;
}

/**
 * Instanced copies of one geometry. items: { x, y?, z, w, h, d, rot? } (scale and placement), with
 * optional per-instance colour (items[i].tone as [r, g, b] in sRGB) and per-instance attributes.
 */
export function Instances({ items, geometry, material, castShadow = false, receiveShadow = false, colors = false, frustum = true }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    items.forEach((it, i) => {
      tmpP.set(it.x, it.y || 0, it.z);
      tmpS.set(it.w, it.h, it.d ?? it.w);
      tmpQ.setFromEuler(tmpE.set(0, it.rot || 0, 0));
      tmpM.compose(tmpP, tmpQ, tmpS);
      mesh.setMatrixAt(i, tmpM);
      if (colors && it.tone) mesh.setColorAt(i, tmpC.setRGB(it.tone[0], it.tone[1], it.tone[2], THREE.SRGBColorSpace));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    mesh.computeBoundingBox?.();
  }, [items, geometry, material, colors]);
  if (!items.length || !geometry) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, items.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled={frustum}
      raycast={noRaycast}
    />
  );
}

/** Buildings with procedural facades; aInfo per instance (type, seed, storey, ground storey). */
function Buildings({ items, material, castShadow }) {
  const geometry = useMemo(() => {
    const g = unitBox();
    const info = new Float32Array(items.length * 4);
    items.forEach((b, i) => info.set([b.type, b.seed, b.fh, b.gh], i * 4));
    g.setAttribute('aInfo', new THREE.InstancedBufferAttribute(info, 4));
    return g;
  }, [items]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <Instances items={items} geometry={geometry} material={material} castShadow={castShadow} receiveShadow colors />;
}

/** Shared foliage and bark materials (one draw call per species and detail level). */
export function useVegetationMaterials() {
  const atlas = useTexture(FOLIAGE_URL);
  const bark = useTexture(BARK_URLS);
  const camera = useThree((s) => s.camera);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSunView: { value: new THREE.Vector3() } }), []);
  const mats = useMemo(() => {
    atlas.colorSpace = THREE.SRGBColorSpace;
    atlas.anisotropy = 4;
    atlas.needsUpdate = true;
    for (const t of [bark.map, bark.normalMap]) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.needsUpdate = true;
    }
    bark.map.colorSpace = THREE.SRGBColorSpace;
    return {
      foliage: createFoliageMaterial(atlas, uniforms),
      bark: new THREE.MeshStandardMaterial({ map: bark.map, normalMap: bark.normalMap, color: '#c9c0b4', roughness: 0.95 })
    };
  }, [atlas, bark, uniforms]);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uSunView.value.copy(SUN_DIR).transformDirection(camera.matrixWorldInverse);
  });
  return mats;
}

const TINTS = [
  [0.86, 1.0, 0.78],
  [0.78, 0.92, 0.7],
  [0.95, 1.0, 0.8],
  [0.72, 0.86, 0.66],
  [0.9, 0.98, 0.74]
];

/** Trees of every species, split into near (full) and far (light) versions by distance. */
export function Trees({ items, mats, nearRadius = 340, shadows = true }) {
  const groups = useMemo(() => {
    const out = {};
    for (const t of items) {
      const lod = Math.hypot(t.x, t.z) < nearRadius ? 'near' : 'far';
      const key = `${t.sp}|${lod}`;
      if (!out[key]) out[key] = { sp: t.sp, lod, list: [] };
      const tint = TINTS[Math.floor(t.tint * TINTS.length) % TINTS.length];
      out[key].list.push({ x: t.x, y: t.y || 0, z: t.z, w: t.s, h: t.s, d: t.s, rot: t.rot, tone: tint });
    }
    return Object.values(out);
  }, [items, nearRadius]);
  const geoms = useMemo(() => {
    const g = {};
    for (const grp of groups) {
      const key = `${grp.sp}|${grp.lod}`;
      g[key] = { canopy: canopyGeometry(SPECIES[grp.sp], grp.lod, 3), trunk: trunkGeometry(SPECIES[grp.sp], grp.lod, 3) };
    }
    return g;
  }, [groups]);
  useEffect(
    () => () => {
      for (const v of Object.values(geoms)) {
        v.canopy.dispose();
        v.trunk?.dispose();
      }
    },
    [geoms]
  );
  return (
    <>
      {groups.map((grp) => {
        const key = `${grp.sp}|${grp.lod}`;
        const near = grp.lod === 'near';
        return (
          <group key={key}>
            <Instances items={grp.list} geometry={geoms[key].canopy} material={mats.foliage} castShadow={shadows && near} receiveShadow={near} colors />
            {geoms[key].trunk && <Instances items={grp.list} geometry={geoms[key].trunk} material={mats.bark} castShadow={shadows && near} />}
          </group>
        );
      })}
    </>
  );
}

function lampGeometry() {
  const parts = [];
  const base = new THREE.CylinderGeometry(0.16, 0.2, 0.7, 10);
  base.translate(0, 0.35, 0);
  const pole = new THREE.CylinderGeometry(0.06, 0.09, 8.6, 8);
  pole.translate(0, 4.3, 0);
  const arm = new THREE.BoxGeometry(0.07, 0.07, 1.7);
  arm.translate(0, 8.55, -0.8);
  const head = new THREE.BoxGeometry(0.34, 0.1, 0.72);
  head.translate(0, 8.5, -1.75);
  parts.push(base, pole, arm, head);
  const g = mergeGeometries(parts, false);
  parts.forEach((p) => p.dispose());
  return g;
}

export function City({ site, quality, pbr, towerH, vegetation }) {
  const radius = quality.low ? 620 : 900;
  const farRadius = quality.low ? 1700 : 2600;
  const city = useMemo(
    () => generateCity(site, { radius, farRadius, density: quality.contextDensity ?? 0.9, towerH }),
    [site, radius, farRadius, quality.contextDensity, towerH]
  );
  const mats = useMemo(
    () => ({
      road: createRoadMaterial(pbr.asphalt, site),
      block: createBlockMaterial(pbr.pavement),
      lawn: createLawnMaterial(pbr.grass),
      path: pbrMaterial(pbr.paving, { color: '#d6d0c6', aoIntensity: 0.6 }),
      facade: createFacadeMaterial({ detail: true }),
      facadeFar: createFacadeMaterial({ detail: false }),
      tank: new THREE.MeshStandardMaterial({ color: '#1f2225', roughness: 0.55 }),
      roof: new THREE.MeshStandardMaterial({ color: '#b9b5ae', roughness: 0.9 }),
      lamp: new THREE.MeshStandardMaterial({ color: '#3a3d41', roughness: 0.45, metalness: 0.7 })
    }),
    [pbr, site]
  );
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  const geo = useMemo(() => {
    const tank = new THREE.CylinderGeometry(0.5, 0.5, 1, 14);
    tank.translate(0, 0.5, 0);
    const ground = new THREE.PlaneGeometry(16000, 16000);
    ground.rotateX(-Math.PI / 2);
    return { box: unitBox(), tank, lamp: lampGeometry(), ground };
  }, []);
  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo]);

  const pathItems = useMemo(() => city.paths.map((p) => ({ ...p })), [city]);
  const lampItems = useMemo(() => city.lamps.map((l) => ({ x: l.x, y: 0.16, z: l.z, w: 1, h: 1, d: 1, rot: l.rot })), [city]);
  const siteFreeBlocks = city.blocks;

  return (
    <group>
      <mesh geometry={geo.ground} material={mats.road} receiveShadow raycast={noRaycast} />
      <Instances items={siteFreeBlocks} geometry={geo.box} material={mats.block} receiveShadow />
      <Instances items={city.lawns} geometry={geo.box} material={mats.lawn} receiveShadow />
      <Instances items={pathItems} geometry={geo.box} material={mats.path} receiveShadow />
      <Buildings items={city.near} material={mats.facade} castShadow />
      <Buildings items={city.far} material={mats.facadeFar} castShadow={false} />
      <Instances items={city.roofBoxes} geometry={geo.box} material={mats.roof} castShadow receiveShadow />
      <Instances items={city.tanks} geometry={geo.tank} material={mats.tank} castShadow />
      <Instances items={lampItems} geometry={geo.lamp} material={mats.lamp} castShadow />
      {vegetation && <Trees items={city.trees} mats={vegetation} nearRadius={quality.low ? 190 : 250} />}
    </group>
  );
}
