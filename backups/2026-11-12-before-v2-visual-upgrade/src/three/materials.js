import * as THREE from 'three';

/**
 * The look of an architect's presentation model: matte plaster buildings, a sand-coloured landscape
 * with contour lines, foam trees, acrylic glass and resin water, and cyan holograms for the
 * planning layers.
 */
export const COLORS = {
  plaster: '#f3f0e9',
  plasterShade: '#e7e2d8',
  pad: '#e9e4d9',
  sand: '#d7c49d',
  sandLine: '#a48a5c',
  dug: '#c4a978',
  lawn: '#b3bd73',
  lawnDeep: '#9fae62',
  water: '#7cc9c2',
  pool: '#77d2d4',
  glass: '#b7c6ca',
  road: '#e9e5dc',
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
  plaster: () => once('plaster', () => new THREE.MeshStandardMaterial({ color: COLORS.plaster, roughness: 0.9, metalness: 0 })),
  plasterShade: () => once('plasterShade', () => new THREE.MeshStandardMaterial({ color: COLORS.plasterShade, roughness: 0.92 })),
  pad: () => once('pad', () => new THREE.MeshStandardMaterial({ color: COLORS.pad, roughness: 0.96 })),
  dug: () => once('dug', () => new THREE.MeshStandardMaterial({ color: COLORS.dug, roughness: 1, side: THREE.BackSide })),
  lawn: () => once('lawn', () => new THREE.MeshStandardMaterial({ color: COLORS.lawn, roughness: 1 })),
  deck: () => once('deck', () => new THREE.MeshStandardMaterial({ color: '#dcc8a2', roughness: 0.85 })),
  glass: () =>
    once('glass', () => new THREE.MeshStandardMaterial({ color: COLORS.glass, roughness: 0.14, metalness: 0.15, envMapIntensity: 1.3 })),
  pool: () =>
    once('pool', () => new THREE.MeshStandardMaterial({ color: COLORS.pool, roughness: 0.06, metalness: 0.05, envMapIntensity: 1.4 })),
  road: () => once('road', () => new THREE.MeshStandardMaterial({ color: COLORS.road, roughness: 0.9, side: THREE.DoubleSide })),
  vehicle: () => once('vehicle', () => new THREE.MeshStandardMaterial({ color: '#f6f3ec', roughness: 0.7 })),
  dark: () => once('dark', () => new THREE.MeshStandardMaterial({ color: '#8b8579', roughness: 0.9 }))
};

/* ------------------------------------------------------------------ terrain ---- */

/** Sand with contour lines, a little grain, greening as the landscape matures, and the cyan scan ring. */
export function makeTerrainMaterial() {
  const m = new THREE.MeshStandardMaterial({ color: COLORS.sand, roughness: 0.97, metalness: 0 });
  const uniforms = {
    uGreen: { value: 0 },
    uScanR: { value: 0 },
    uScanI: { value: 0 },
    uGrid: { value: 0 },
    uPit: { value: 0 },
    uPitRect: { value: new THREE.Vector4(0, 0, 0, 0) },
    uSand: { value: new THREE.Color(COLORS.sand) },
    uSandLow: { value: new THREE.Color('#c8b088') },
    uGreenCol: { value: new THREE.Color('#b3b872') },
    uLine: { value: new THREE.Color(COLORS.sandLine) },
    uHolo: { value: new THREE.Color(COLORS.holo) }
  };
  m.userData.uniforms = uniforms;
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vW;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vW;
        uniform float uGreen, uScanR, uScanI, uGrid, uPit;
        uniform vec4 uPitRect;
        uniform vec3 uSand, uSandLow, uGreenCol, uLine, uHolo;
        float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
        float contour(float h, float step, float w){ float q = (h + 0.37) / step; float d = abs(fract(q - 0.5) - 0.5) / max(fwidth(q), 1e-4); return 1.0 - smoothstep(0.0, w, d); }`
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        if (uPit > 0.5 && vW.x > uPitRect.x && vW.x < uPitRect.y && vW.z > uPitRect.z && vW.z < uPitRect.w) discard;
        {
          float h = vW.y;
          float big = vnoise(vW.xz * 0.006);
          vec3 sand = mix(uSandLow, uSand, smoothstep(-4.0, 22.0, h) * 0.75 + big * 0.25);
          float gm = smoothstep(0.25, 0.75, vnoise(vW.xz * 0.004 + 7.0)) * 0.55 + 0.45;
          sand = mix(sand, uGreenCol, uGreen * gm * 0.85);
          float grain = vnoise(vW.xz * 1.7) * 0.06 + vnoise(vW.xz * 0.21) * 0.07 - 0.065;
          sand *= 1.0 + grain;
          float l1 = contour(h, 2.5, 1.5);
          float l2 = contour(h, 12.5, 2.2);
          sand = mix(sand, uLine * (1.0 + grain), clamp(l1 * 0.5 + l2 * 0.65, 0.0, 0.75));
          diffuseColor.rgb = sand;
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
  m.customProgramCacheKey = () => 'terrain-v1';
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
