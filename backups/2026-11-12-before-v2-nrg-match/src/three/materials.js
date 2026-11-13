import * as THREE from 'three';
import { quality } from '../core/quality.js';

const bumpFoam = quality.tier === 'high';

/**
 * The look of an architect's presentation model: matte plaster buildings, a sand-coloured landscape
 * with contour lines, foam trees, acrylic glass and resin water, and cyan holograms for the
 * planning layers.
 */
export const COLORS = {
  plaster: '#f4f1ea',
  plasterShade: '#e6e1d7',
  pad: '#e8e4da',
  sand: '#ddd0aa',
  sandLow: '#cfc096',
  meadow: '#c6c795',
  sandLine: '#a9966f',
  dug: '#c9b08a',
  lawn: '#a9ba7a',
  lawnDeep: '#93a96a',
  water: '#86c4c2',
  pool: '#86d2d6',
  glass: '#a3bccb',
  road: '#cbc6bb',
  holo: '#3fdcff',
  holoDeep: '#13b6e6',
  ghost: '#ffffff',
  accent: '#f5c518'
};

const cache = new Map();
function once(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

export const mat = {
  plaster: () => once('plaster', () => new THREE.MeshStandardMaterial({ color: COLORS.plaster, roughness: 0.88, metalness: 0 })),
  plasterShade: () => once('plasterShade', () => new THREE.MeshStandardMaterial({ color: COLORS.plasterShade, roughness: 0.9 })),
  pad: () => once('pad', () => new THREE.MeshStandardMaterial({ color: COLORS.pad, roughness: 0.95 })),
  dug: () => once('dug', () => new THREE.MeshStandardMaterial({ color: COLORS.dug, roughness: 1, side: THREE.BackSide })),
  lawn: () => once('lawn', () => new THREE.MeshStandardMaterial({ color: COLORS.lawn, roughness: 1 })),
  hedge: () => once('hedge', () => new THREE.MeshStandardMaterial({ color: COLORS.lawnDeep, roughness: 1 })),
  deck: () => once('deck', () => new THREE.MeshStandardMaterial({ color: '#d9c3a0', roughness: 0.8 })),
  glass: () =>
    once(
      'glass',
      () => new THREE.MeshStandardMaterial({ color: COLORS.glass, roughness: 0.07, metalness: 0.3, envMapIntensity: 1.7 })
    ),
  pool: () =>
    once('pool', () => new THREE.MeshStandardMaterial({ color: COLORS.pool, roughness: 0.05, metalness: 0.05, envMapIntensity: 1.5 })),
  road: () => once('road', () => makeRoadMaterial(false)),
  roadMain: () => once('roadMain', () => makeRoadMaterial(true)),
  asphalt: () => once('asphalt', () => new THREE.MeshStandardMaterial({ color: '#c3beb3', roughness: 0.92 })),
  vehicle: () => once('vehicle', () => new THREE.MeshStandardMaterial({ color: '#f6f3ec', roughness: 0.6 })),
  screen: () => once('screen', () => new THREE.MeshStandardMaterial({ color: '#e8e3d9', roughness: 0.85 })),
  dark: () => once('dark', () => new THREE.MeshStandardMaterial({ color: '#8b8579', roughness: 0.9 }))
};

/** Road card: warm grey with crisp white edge lines (and a dashed centre line on the main road). */
function makeRoadMaterial(centre) {
  const m = new THREE.MeshStandardMaterial({ color: COLORS.road, roughness: 0.88, side: THREE.DoubleSide });
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 roadUv;\nvarying vec2 vRoad;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRoad = roadUv;');
    s.fragmentShader = s.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vRoad;')
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        if (vRoad.x >= 0.0) {
          float w = max(fwidth(vRoad.x), 1e-4);
          float e = 1.0 - smoothstep(0.0, w * 1.4, abs(vRoad.x - 0.075) - 0.018);
          e = max(e, 1.0 - smoothstep(0.0, w * 1.4, abs(vRoad.x - 0.925) - 0.018));
          ${centre ? 'e = max(e, (1.0 - smoothstep(0.0, w * 1.4, abs(vRoad.x - 0.5) - 0.012)) * step(0.55, fract(vRoad.y / 7.0)) * 0.8);' : ''}
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.97, 0.96, 0.93), e * 0.9);
        } else {
          diffuseColor.rgb *= 0.93; // the card's cut edge
        }`
      );
  };
  m.customProgramCacheKey = () => `road-${centre ? 'c' : 'p'}`;
  return m;
}

/* ------------------------------------------------------------------ terrain ---- */

/** A small tileable random texture; bilinear filtering turns it into smooth value noise for the grain. */
function grainTexture() {
  const n = 128;
  const data = new Uint8Array(n * n * 4);
  let a = 12345;
  for (let i = 0; i < n * n; i++) {
    a = (a * 1103515245 + 12345) & 0x7fffffff;
    const v = (a >> 8) & 255;
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  }
  const t = new THREE.DataTexture(data, n, n, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

/**
 * The landscape: warm sand with soft sage meadows in the valleys and along the water, contour lines
 * that darken whatever lies beneath them, a teal riverbed under the water, greening as the project
 * matures, and the cyan scan ring and grid of the planning phase.
 */
export function makeTerrainMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: COLORS.sand, roughness: 0.96, metalness: 0 });
  const uniforms = {
    uGreen: { value: 0 },
    uScanR: { value: 0 },
    uScanI: { value: 0 },
    uGrid: { value: 0 },
    uPit: { value: 0 },
    uPitRect: { value: new THREE.Vector4(0, 0, 0, 0) },
    uSand: { value: new THREE.Color(COLORS.sand) },
    uSandLow: { value: new THREE.Color(COLORS.sandLow) },
    uMeadow: { value: new THREE.Color(COLORS.meadow) },
    uGreenCol: { value: new THREE.Color('#b6c592') },
    uGreenDeep: { value: new THREE.Color('#9db37f') },
    uBed: { value: new THREE.Color('#7fb3a8') },
    uHolo: { value: new THREE.Color(COLORS.holo) },
    uGrain: { value: grainTexture() }
  };
  m.userData.uniforms = uniforms;
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vW;\nattribute vec4 tvar;\nvarying vec4 vVar;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvVar = tvar;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vW;
        varying vec4 vVar; // large-scale variation, computed once per vertex: big, mid, patches, greening mask
        uniform float uGreen, uScanR, uScanI, uGrid, uPit;
        uniform vec4 uPitRect;
        uniform vec3 uSand, uSandLow, uMeadow, uGreenCol, uGreenDeep, uBed, uHolo;
        uniform sampler2D uGrain;
        float contour(float h, float step, float w){ float q = (h + 0.37) / step; float d = abs(fract(q - 0.5) - 0.5) / max(fwidth(q), 1e-4); return 1.0 - smoothstep(0.0, w, d); }`
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        if (uPit > 0.5 && vW.x > uPitRect.x && vW.x < uPitRect.y && vW.z > uPitRect.z && vW.z < uPitRect.w) discard;
        {
          float h = vW.y;
          float big = vVar.x;
          float mid = vVar.y;
          vec3 c = mix(uSandLow, uSand, clamp(smoothstep(-2.0, 30.0, h) * 0.6 + big * 0.4, 0.0, 1.0));
          // natural sage meadows in the valleys, along the water and in soft patches
          float wet = 1.0 - smoothstep(-4.0, 7.0, h);
          float patchy = smoothstep(0.5, 0.82, vVar.z);
          c = mix(c, uMeadow, clamp(patchy * 0.55 + wet * 0.55, 0.0, 0.7) * (0.75 + mid * 0.25));
          // the landscape greens as the project matures
          float gm = smoothstep(0.2, 0.7, vVar.w) * 0.4 + 0.6;
          c = mix(c, mix(uGreenCol, uGreenDeep, mid), uGreen * gm * 0.92);
          // the riverbed under the water
          c = mix(c, uBed, 1.0 - smoothstep(-9.5, -5.3, h));
          float grain = texture2D(uGrain, vW.xz * 0.0125).r * 0.05 + texture2D(uGrain, vW.xz * 0.0015 + 0.37).r * 0.06 - 0.055;
          c *= 1.0 + grain;
          float l1 = contour(h, 2.5, 1.2);
          float l2 = contour(h, 12.5, 1.8);
          c *= 1.0 - clamp(l1 * 0.2 + l2 * 0.3, 0.0, 0.4) * smoothstep(-5.5, -4.5, h);
          diffuseColor.rgb = c;
        }`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        {
          float d = length(vW.xz - vec2(0.0, 0.0));
          float ring = exp(-pow((d - uScanR) / 7.0, 2.0)) * uScanI;
          vec2 g = abs(fract(vW.xz / 12.0 - 0.5) - 0.5) / max(fwidth(vW.xz / 12.0), vec2(1e-4));
          float grid = (1.0 - smoothstep(0.0, 1.2, min(g.x, g.y))) * uGrid * (1.0 - smoothstep(110.0, 300.0, d));
          totalEmissiveRadiance += uHolo * (ring * 1.6 + grid * 0.22);
        }`
      );
  };
  m.customProgramCacheKey = () => 'terrain-v3';
  return m;
}

/* ------------------------------------------------------------------- foliage ---- */

/**
 * Foam-tree surface: vertex colours shade each tree darker underneath, and a fine procedural bump
 * in world space breaks every blob into the lumpy, crumbly look of model-making foam.
 */
export function makeFoamMaterial() {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 });
  // the fine bump costs a lot of fill rate on integrated graphics: only on strong GPUs
  if (!bumpFoam) return m;
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vFW;').replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      {
        vec4 fw = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          fw = instanceMatrix * fw;
        #endif
        vFW = (modelMatrix * fw).xyz;
      }`
    );
    s.fragmentShader = s.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vFW;').replace(
      '#include <normal_fragment_maps>',
      `#include <normal_fragment_maps>
      {
        vec3 q = vFW * 1.25;
        vec3 g = vec3(
          sin(q.y * 2.3 + q.z * 1.7) + 0.55 * sin(q.x * 5.1 - q.y * 3.9),
          sin(q.z * 2.1 + q.x * 1.9) + 0.55 * sin(q.y * 4.7 + q.z * 5.3),
          sin(q.x * 2.7 + q.y * 1.3) + 0.55 * sin(q.z * 4.3 - q.x * 5.7));
        normal = normalize(normal + mat3(viewMatrix) * g * 0.26);
      }`
    );
  };
  m.customProgramCacheKey = () => 'foam-v1';
  return m;
}

/* ---------------------------------------------------------------- holograms ---- */

const holoVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vW;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 p = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      p = instanceMatrix * p;
      n = mat3(instanceMatrix) * n;
    #endif
    vec4 w = modelMatrix * p;
    vW = w.xyz;
    vec4 mv = viewMatrix * w;
    vV = -mv.xyz;
    vN = normalize(mat3(viewMatrix) * mat3(modelMatrix) * n);
    gl_Position = projectionMatrix * mv;
  }
`;
const holoFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity, uTime, uBands, uFill, uFres;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vW;
  varying vec2 vUv;
  void main() {
    float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
    float fres = pow(f, 2.2) * uFres;
    float bands = uBands > 0.0 ? smoothstep(0.86, 1.0, fract(vW.y / uBands)) : 0.0;
    float scan = smoothstep(0.92, 1.0, fract(vW.y * 0.025 - uTime * 0.18)) * 0.6;
    float a = uFill + fres * 0.75 + bands * 0.55 + scan * 0.4;
    gl_FragColor = vec4(uColor * (0.85 + fres * 1.2 + bands + scan), a * uOpacity);
  }
`;

/** A see-through hologram surface: fresnel edges, floor bands every `bands` metres, a slow scan line. */
export function makeHoloMaterial({ color = COLORS.holo, intensity = 1.25, bands = 0, fill = 0.22, fres = 1, additive = false, side = THREE.DoubleSide } = {}) {
  const c = new THREE.Color(color).multiplyScalar(intensity);
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: c },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uBands: { value: bands },
      uFill: { value: fill },
      uFres: { value: fres }
    },
    vertexShader: holoVert,
    fragmentShader: holoFrag,
    transparent: true,
    depthWrite: false,
    side,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    toneMapped: false
  });
}

const flowFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity, uTime, uLen, uDash, uDraw;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vW;
  void main() {
    if (vUv.x > uDraw) discard;
    float s = vUv.x * uLen;
    float dash = smoothstep(0.35, 0.5, fract(s / uDash - uTime * 0.6)) * (1.0 - smoothstep(0.85, 1.0, fract(s / uDash - uTime * 0.6)));
    float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
    gl_FragColor = vec4(uColor * (1.0 + dash * 1.4), (0.45 + dash * 0.55 + f * 0.2) * uOpacity);
  }
`;

/** A pipe or cable that draws itself on (uDraw 0→1) with pulses flowing along it. */
export function makeFlowMaterial({ color = COLORS.holo, length = 100, dash = 14, intensity = 1.3 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color).multiplyScalar(intensity) },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uLen: { value: length },
      uDash: { value: dash },
      uDraw: { value: 1 }
    },
    vertexShader: holoVert,
    fragmentShader: flowFrag,
    transparent: true,
    depthWrite: false,
    toneMapped: false
  });
}

const gridFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity, uTime, uCell;
  varying vec3 vW;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec2 q = vW.xz / uCell;
    vec2 g = abs(fract(q - 0.5) - 0.5) / max(fwidth(q), vec2(1e-4));
    float line = 1.0 - smoothstep(0.0, 1.3, min(g.x, g.y));
    float pulse = 0.5 + 0.5 * sin(uTime * 1.6 - length(vW.xz) * 0.05);
    gl_FragColor = vec4(uColor, (0.16 + line * 0.55 + pulse * 0.06) * uOpacity);
  }
`;

/** A flat translucent fill with a measuring grid (plot area). */
export function makeGridMaterial({ color = COLORS.holo, cell = 6, intensity = 1.2 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color).multiplyScalar(intensity) },
      uOpacity: { value: 0 },
      uTime: { value: 0 },
      uCell: { value: cell }
    },
    vertexShader: holoVert,
    fragmentShader: gridFrag,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
}

export function makeLineMaterial(color = COLORS.holo, intensity = 1.4) {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color).multiplyScalar(intensity),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false
  });
}

/** Set a hologram material's visibility (0–1) and time; hides its mesh when fully off. */
export function setHolo(material, mesh, opacity, time) {
  if (material.uniforms) {
    material.uniforms.uOpacity.value = opacity;
    if (material.uniforms.uTime) material.uniforms.uTime.value = time;
  } else material.opacity = opacity;
  if (mesh) mesh.visible = opacity > 0.003;
}
