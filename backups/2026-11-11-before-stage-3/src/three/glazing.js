import * as THREE from 'three';
import { HASH, ROOM } from './glsl.js';

/**
 * Curtain-wall glass for the tower: coated, slightly reflective double glazing with rooms behind it.
 *
 *  - Reflections: physically based (index of refraction of a coated pane), from the reflection probe
 *    captured around the tower (the real sky and city), plus the sun's highlight.
 *  - Rooms: interior mapping (see glsl.js), lit by daylight, some with lamps on, curtains, blinds.
 *  - Panes: each pane is tilted a fraction of a degree so reflections break up pane by pane, as on a
 *    real facade. A dark spandrel band hides each slab and ceiling void.
 *
 * Geometry must carry `aPane` (x: pane coordinate along the facade, 1 per pane; y: 0 at the slab top,
 * 1 at the next slab) — see towerGeometry.js. Works on plain and instanced meshes.
 */
export function createGlazingMaterial({
  paneW = 1.55, // metres per pane, used to size rooms (two panes per room)
  height = 2.98, // glazing height per storey (slab top to next slab)
  vision = 2.72, // clear room height; above it is the spandrel
  depth = 5.2,
  level = 0.32, // daylight level inside the rooms
  lamps = 1,
  tint = '#a9bcbc',
  roomPanes = 2,
  key = 'tower'
} = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color: '#000000',
    roughness: 0.035,
    metalness: 0,
    ior: 2.0, // ~11 % reflectance at normal incidence: coated low-e glazing
    specularColor: new THREE.Color('#e9f0f0'),
    envMapIntensity: 1
  });
  const uniforms = {
    uGlaze: { value: new THREE.Vector4(paneW, height, vision, depth) },
    uRoomLevel: { value: new THREE.Vector2(level, lamps) },
    uTint: { value: new THREE.Color(tint) },
    uRoomPanes: { value: roomPanes },
    uWarp: { value: 0.012 }
  };
  m.userData.uniforms = uniforms;
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute vec2 aPane;
        varying vec2 vPane;
        varying vec3 vObjPos;
        varying vec3 vObjN;
        varying vec3 vCamObj;
        varying vec3 vOrigin;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          mat4 mM = modelMatrix;
          #ifdef USE_INSTANCING
            mM = modelMatrix * instanceMatrix;
          #endif
          vPane = aPane;
          vObjPos = position;
          vObjN = normal;
          vCamObj = (inverse(mM) * vec4(cameraPosition, 1.0)).xyz;
          vOrigin = mM[3].xyz;
        }`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec4 uGlaze;
        uniform vec2 uRoomLevel;
        uniform vec3 uTint;
        uniform float uRoomPanes;
        uniform float uWarp;
        varying vec2 vPane;
        varying vec3 vObjPos;
        varying vec3 vObjN;
        varying vec3 vCamObj;
        varying vec3 vOrigin;
        ${HASH}
        ${ROOM}`
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        {
          vec3 nO = normalize(vObjN);
          vec3 tO = vec3(nO.z, 0.0, -nO.x);
          float storey = floor(vOrigin.y / 3.3 + 0.5);
          vec3 ph = h23(vec2(floor(vPane.x) + dot(vOrigin.xz, vec2(0.37, 0.71)) + nO.x * 17.0 + nO.z * 31.0, storey));
          vec3 tilt = (tO * (ph.x - 0.5) + vec3(0.0, 1.0, 0.0) * (ph.y - 0.5)) * uWarp;
          normal = normalize(normal + (viewMatrix * vec4(tilt, 0.0)).xyz);
        }`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          vec3 nO = normalize(vObjN);
          vec3 tO = vec3(nO.z, 0.0, -nO.x);
          vec3 rd = normalize(vObjPos - vCamObj);
          float cosT = clamp(dot(-rd, nO), 0.0, 1.0);
          float fres = 0.11 + 0.89 * pow(1.0 - cosT, 5.0);
          float y = vPane.y * uGlaze.y;
          if (y < uGlaze.z) {
            float roomW = uGlaze.x * uRoomPanes;
            float cu = vPane.x / uRoomPanes;
            float ci = floor(cu);
            float storey = floor(vOrigin.y / 3.3 + 0.5);
            vec3 s = h23(vec2(ci + nO.x * 13.0 + nO.z * 29.0 + dot(vOrigin.xz, vec2(0.13, 0.29)), storey * 1.7 + 0.5));
            vec3 r = vec3(dot(rd, tO), rd.y, -dot(rd, nO));
            vec3 size = vec3(roomW, uGlaze.z, uGlaze.w * mix(0.8, 1.2, s.y));
            float lvl = uRoomLevel.x * mix(0.55, 1.25, s.z);
            vec3 room = roomInterior(vec2(fract(cu) * roomW, y), r, size, s, lvl);
            room *= mix(1.0, 1.0 + 0.8 * uRoomLevel.y, step(0.86, s.x)); // a few brightly lit rooms
            totalEmissiveRadiance += room * uTint * (1.0 - fres);
          } else {
            // spandrel: opaque fritted glass in front of the slab and ceiling void
            totalEmissiveRadiance += vec3(0.012, 0.014, 0.015) * (1.0 - fres);
          }
        }`
      );
  };
  m.customProgramCacheKey = () => `glazing-${key}`;
  return m;
}
