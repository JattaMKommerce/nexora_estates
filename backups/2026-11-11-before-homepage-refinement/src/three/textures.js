import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { assetPath } from '../lib/paths.js';

/**
 * PBR texture sets (CC0, Poly Haven; see public/assets/CREDITS.md). Each set has
 *   diff.jpg  base colour (sRGB)
 *   nor.jpg   normal map (OpenGL convention)
 *   arm.jpg   R = ambient occlusion, G = roughness, B = metalness
 * Textures are shared through drei's loader cache, so every material that uses a set reuses the
 * same GPU upload. Geometry carries world-scale UVs, so repeat stays at 1.
 */
export const TEX = {
  laminate: 'laminate_floor_02',
  herringbone: 'herringbone_parquet',
  marble: 'marble_01',
  terrazzo: 'terrazzo_tiles',
  linen: 'rough_linen',
  cotton: 'cotton_jersey',
  velvet: 'velour_velvet',
  oak: 'oak_veneer_01',
  walnut: 'black_walnut_veneer_01',
  concrete: 'concrete_wall_008',
  paving: 'rectangular_paving',
  pavement: 'concrete_pavement',
  asphalt: 'asphalt_02',
  grass: 'grass_ground',
  woodfloor: 'wood_floor',
  plaster: 'plastered_wall_04',
  wallTiles: 'long_white_tiles'
};

/** Foliage atlas (two leaf-cluster cells, RGBA) and bark, composed from Poly Haven CC0 textures. */
export const FOLIAGE_URL = assetPath('assets/tex/foliage/leaves.webp');
export const BARK_URLS = { map: assetPath('assets/tex/bark/diff.jpg'), normalMap: assetPath('assets/tex/bark/nor.jpg') };

const url = (key, map) => assetPath(`assets/tex/${TEX[key]}/${map}.jpg`);

export function pbrUrls(keys) {
  const out = {};
  for (const k of keys) {
    out[`${k}.map`] = url(k, 'diff');
    out[`${k}.normalMap`] = url(k, 'nor');
    out[`${k}.arm`] = url(k, 'arm');
  }
  return out;
}

export function preloadPbr(keys) {
  useTexture.preload(Object.values(pbrUrls(keys)));
}

/** Suspends until loaded. Returns { key: { map, normalMap, roughnessMap, aoMap } }, stable across renders. */
export function usePbr(keys) {
  const sigKeys = keys.join('|');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const urls = useMemo(() => pbrUrls(keys), [sigKeys]);
  const tex = useTexture(urls);
  // drei hands back a fresh wrapper object each render; key the result on the textures themselves
  const sig = keys.map((k) => `${tex[`${k}.map`].uuid}${tex[`${k}.normalMap`].uuid}${tex[`${k}.arm`].uuid}`).join('|');
  return useMemo(() => {
    const out = {};
    for (const k of keys) {
      const map = tex[`${k}.map`];
      const normalMap = tex[`${k}.normalMap`];
      const arm = tex[`${k}.arm`];
      for (const t of [map, normalMap, arm]) {
        if (t.wrapS !== THREE.RepeatWrapping || t.anisotropy !== 8) {
          t.wrapS = THREE.RepeatWrapping;
          t.wrapT = THREE.RepeatWrapping;
          t.anisotropy = 8;
          t.needsUpdate = true;
        }
      }
      if (map.colorSpace !== THREE.SRGBColorSpace) {
        map.colorSpace = THREE.SRGBColorSpace;
        map.needsUpdate = true;
      }
      out[k] = { map, normalMap, roughnessMap: arm, aoMap: arm };
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
}

/**
 * Patches a material so its textures are projected from world position (top faces use x/z,
 * walls use x/y or z/y) at `scale` metres per tile. Lets one texture cover boxes of any size
 * (slabs, kerbs, instanced city blocks) without stretching.
 */
export function worldMapped(material, scale = 2, { roofUV = null } = {}) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWorldTile = { value: scale };
    const roof = roofUV ? `if (wn.y > 0.5) w = vec2(${roofUV[0].toFixed(4)}, ${roofUV[1].toFixed(4)});` : '';
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWorldTile;')
      .replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
        {
          vec4 wp = vec4(position, 1.0);
          vec3 wn = normal;
          #ifdef USE_INSTANCING
            wp = instanceMatrix * wp;
            wn = mat3(instanceMatrix) * wn;
          #endif
          wp = modelMatrix * wp;
          wn = normalize(mat3(modelMatrix) * wn);
          vec2 w = abs(wn.y) > 0.5 ? wp.xz : (abs(wn.x) > 0.5 ? vec2(wp.z, wp.y) : wp.xy);
          w /= uWorldTile;
          ${roof}
          #ifdef USE_MAP
            vMapUv = w;
          #endif
          #ifdef USE_NORMALMAP
            vNormalMapUv = w;
          #endif
          #ifdef USE_ROUGHNESSMAP
            vRoughnessMapUv = w;
          #endif
          #ifdef USE_AOMAP
            vAoMapUv = w;
          #endif
        }`
      );
  };
  material.customProgramCacheKey = () => `world-${scale}-${roofUV ? roofUV.join(',') : ''}`;
  return material;
}

/** Standard PBR material from a texture set. */
export function pbrMaterial(set, { color = '#ffffff', roughness = 1, normalScale = 1, aoIntensity = 0.8, metalness = 0, envMapIntensity = 1, ...rest } = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    map: set.map,
    normalMap: set.normalMap,
    normalScale: new THREE.Vector2(normalScale, normalScale),
    roughnessMap: set.roughnessMap,
    roughness,
    aoMap: set.aoMap,
    aoMapIntensity: aoIntensity,
    metalness,
    envMapIntensity,
    ...rest
  });
}
