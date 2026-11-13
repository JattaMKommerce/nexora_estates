import * as THREE from 'three';
import { HASH, ROOM } from '../glsl.js';
import { pbrMaterial } from '../textures.js';
import { PITCH, ROAD, SIDEWALK } from './layout.js';

/**
 * Materials for the city around the development. All are standard PBR materials (so they take the
 * sun, sky light, shadows and fog like everything else) with small shader patches:
 *   road      asphalt with lane markings, zebra crossings and stop lines drawn from the street grid
 *   block     kerb stones, pavement slabs and the paved plots behind them, from each block's size
 *   lawn      grass with large-scale colour variation so it never tiles visibly
 *   facade    procedural buildings: windows with frames and rooms behind them, slab bands,
 *             balconies, shopfronts or stilt parking at street level, roofs with parapets
 */

/**
 * Planar UVs for a texture set from the position in the city's own space (the development's
 * coordinates), plus that position as a varying. The city moves as a whole when the visitor switches
 * towers, so textures and markings stay attached to it.
 */
function worldPatch(shader, scale) {
  shader.uniforms.uTile = { value: scale };
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nuniform float uTile;\nvarying vec3 vW;')
    .replace(
      '#include <uv_vertex>',
      `#include <uv_vertex>
      {
        vec4 wp = vec4(position, 1.0);
        #ifdef USE_INSTANCING
          wp = instanceMatrix * wp;
        #endif
        vW = wp.xyz;
        vec2 w = wp.xz / uTile;
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
}

export function createRoadMaterial(set, site) {
  const m = pbrMaterial(set, { color: '#8e8d8b', aoIntensity: 0.5 });
  const uniforms = { uGrid: { value: new THREE.Vector4(site.sx, site.sz, PITCH, ROAD) } };
  m.userData.uniforms = uniforms;
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    worldPatch(shader, 7);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform vec4 uGrid;
        varying vec3 vW;
        ${HASH}
        // signed distance from the nearest road centre line along one axis
        float roadOff(float c, float s) {
          float a = abs(c) - (s + uGrid.w * 0.5);
          return a - floor(a / uGrid.z + 0.5) * uGrid.z;
        }`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        float paint = 0.0;
        float wear = 0.0;
        {
          vec2 p = vW.xz; // development coordinates
          float dz = roadOff(p.y, uGrid.y); // across an east–west road
          float dx = roadOff(p.x, uGrid.x); // across a north–south road
          float hw = uGrid.w * 0.5;
          bool ew = abs(dz) < hw;
          bool ns = abs(dx) < hw;
          float lw = 0.075;
          if (ew && !ns) {
            float along = abs(dx) - hw;
            if (along > 6.5) {
              if (abs(dz) < lw) paint = step(0.5, fract(p.x / 7.0)); // centre line
              if (abs(abs(dz) - hw * 0.5) < lw * 0.8) paint = step(0.62, fract(p.x / 6.0)); // lane lines
              if (abs(abs(dz) - (hw - 0.55)) < lw) paint = 1.0; // edge lines
            } else if (along > 1.0 && along < 5.2 && abs(dz) < hw - 0.9) {
              paint = step(0.5, fract(dz / 1.1)); // zebra crossing
            } else if (along > 5.6 && along < 6.0 && abs(dz) < hw - 0.6) {
              paint = 1.0; // stop line
            }
            wear = smoothstep(1.6, 0.0, abs(abs(dz) - hw * 0.27)) + smoothstep(1.6, 0.0, abs(abs(dz) - hw * 0.73));
          } else if (ns && !ew) {
            float along = abs(dz) - hw;
            if (along > 6.5) {
              if (abs(dx) < lw) paint = step(0.5, fract(p.y / 7.0));
              if (abs(abs(dx) - hw * 0.5) < lw * 0.8) paint = step(0.62, fract(p.y / 6.0));
              if (abs(abs(dx) - (hw - 0.55)) < lw) paint = 1.0;
            } else if (along > 1.0 && along < 5.2 && abs(dx) < hw - 0.9) {
              paint = step(0.5, fract(dx / 1.1));
            } else if (along > 5.6 && along < 6.0 && abs(dx) < hw - 0.6) {
              paint = 1.0;
            }
            wear = smoothstep(1.6, 0.0, abs(abs(dx) - hw * 0.27)) + smoothstep(1.6, 0.0, abs(abs(dx) - hw * 0.73));
          }
          float grain = fbm2(p * 0.9);
          paint *= smoothstep(0.15, 0.5, grain + 0.2); // worn paint
          float patchy = fbm2(p * 0.035);
          diffuseColor.rgb *= mix(0.86, 1.1, patchy) * (1.0 - 0.1 * wear);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.86, 0.85, 0.82), paint * 0.85);
        }`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.62, paint);
        roughnessFactor *= 1.0 - 0.12 * wear;`
      );
  };
  m.customProgramCacheKey = () => 'city-road';
  return m;
}

/** Kerb (instanced boxes): a stone kerb, pavement slabs, and the paved plot behind them. */
export function createBlockMaterial(set) {
  const m = pbrMaterial(set, { color: '#c9c6c1', aoIntensity: 0.6 });
  m.onBeforeCompile = (shader) => {
    worldPatch(shader, 2.4);
    shader.uniforms.uWalk = { value: SIDEWALK };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBL;\nvarying vec3 vBS;\nvarying vec3 vBN;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          vec3 sz = vec3(1.0);
          #ifdef USE_INSTANCING
            sz = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
          #endif
          vBL = position * sz;
          vBS = sz;
          vBN = normal;
        }`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nuniform float uWalk;\nvarying vec3 vBL;\nvarying vec3 vBS;\nvarying vec3 vBN;\nvarying vec3 vW;\n${HASH}`)
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        float kerb = 0.0;
        {
          float edge = min(vBS.x * 0.5 - abs(vBL.x), vBS.z * 0.5 - abs(vBL.z));
          if (vBN.y < 0.5) kerb = 1.0;
          else if (edge < 0.32) kerb = 1.0;
          if (kerb > 0.5) {
            diffuseColor.rgb = vec3(0.74, 0.72, 0.68) * (0.9 + 0.1 * vnoise(vW.xz * 3.0 + vW.y));
          } else if (edge > uWalk) {
            // plot behind the pavement: greyer paving, with green patches seen from afar
            diffuseColor.rgb *= vec3(0.84, 0.85, 0.86) * (0.92 + 0.12 * fbm2(vW.xz * 0.05));
            float green = smoothstep(0.5, 0.62, fbm2(vW.xz * 0.025 + 3.0));
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.2, 0.27, 0.12), green * 0.85);
          } else {
            diffuseColor.rgb *= 0.95 + 0.1 * fbm2(vW.xz * 0.08);
            diffuseColor.rgb *= mix(0.9, 1.0, smoothstep(0.3, 0.8, edge)); // grime along the kerb
          }
        }`
      )
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.78, kerb);');
  };
  m.customProgramCacheKey = () => 'city-block';
  return m;
}

/** Any texture set laid flat in the city's own coordinates (paving, decking, plazas). */
export function createPlanarMaterial(set, { color = '#ffffff', scale = 2.5, key = 'planar', ...rest } = {}) {
  const m = pbrMaterial(set, { color, aoIntensity: 0.6, ...rest });
  m.onBeforeCompile = (shader) => {
    worldPatch(shader, scale);
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vW;');
  };
  m.customProgramCacheKey = () => `city-planar-${key}-${scale}`;
  return m;
}

/** Grass with slow colour variation (dry patches, richer green) so large lawns don't tile. */
export function createLawnMaterial(set, { color = '#9fb07a', scale = 3.2 } = {}) {
  const m = pbrMaterial(set, { color, aoIntensity: 0.8, normalScale: 1.2 });
  m.onBeforeCompile = (shader) => {
    worldPatch(shader, scale);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vW;\n${HASH}`)
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        {
          float n = fbm2(vW.xz * 0.045);
          float n2 = vnoise(vW.xz * 0.6);
          diffuseColor.rgb *= mix(vec3(1.08, 1.02, 0.84), vec3(0.82, 0.96, 0.8), n) * (0.94 + 0.12 * n2);
        }`
      );
  };
  m.customProgramCacheKey = () => `city-lawn-${scale}`;
  return m;
}

/**
 * Procedural building facades. Each instance carries aInfo = (type, seed, storey height, ground
 * storey height); its colour is the wall tone. Types:
 *   0  housing with punched, framed windows, slab bands, sunshades, AC units and recessed balconies
 *   3  modern housing with continuous balcony slabs, glass balustrades and glazing set back in shade
 *   1  offices with ribbon glazing     2  glass towers with curtain walls
 * Housing stands on open stilt parking; offices have shopfronts at street level.
 */
export function createFacadeMaterial({ detail = true } = {}) {
  const m = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, metalness: 0, envMapIntensity: 1 });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute vec4 aInfo;
        varying vec3 vBL;
        varying vec3 vBS;
        varying vec3 vBN;
        varying vec4 vInfo;
        varying vec3 vCamB;`
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          mat4 mM = modelMatrix;
          vec3 sz = vec3(1.0);
          #ifdef USE_INSTANCING
            mM = modelMatrix * instanceMatrix;
            sz = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
          #endif
          vBL = position * sz;
          vBS = sz;
          vBN = normal;
          vInfo = aInfo;
          vCamB = (inverse(mM) * vec4(cameraPosition, 1.0)).xyz * sz;
        }`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vBL;
        varying vec3 vBS;
        varying vec3 vBN;
        varying vec4 vInfo;
        varying vec3 vCamB;
        ${HASH}
        ${ROOM}`
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float fMetal = 0.0;
        float fRough = 0.86;
        vec3 fRoom = vec3(0.0);
        {
          vec3 tone = diffuseColor.rgb;
          float type = vInfo.x;
          float seed = vInfo.y;
          float fh = vInfo.z;
          float gh = vInfo.w;
          bool housing = type < 0.5 || type > 2.5;
          vec3 nL = normalize(vBN);
          vec3 albedo = tone;
          if (nL.y > 0.5) {
            float edge = min(vBS.x * 0.5 - abs(vBL.x), vBS.z * 0.5 - abs(vBL.z));
            albedo = mix(vec3(0.42, 0.42, 0.41), vec3(0.56, 0.55, 0.52), fbm2(vBL.xz * 0.25 + seed * 31.0));
            if (edge < 0.32) albedo = tone * 0.96;          // parapet coping
            else if (edge < 0.7) albedo *= 0.58;            // parapet shadow
            fRough = 0.92;
          } else if (nL.y < -0.5) {
            albedo = tone * 0.45;
          } else {
            vec3 tL = vec3(nL.z, 0.0, -nL.x);
            float faceW = abs(dot(vBS, tL));
            float u = dot(vBL, tL) + faceW * 0.5;
            float v = vBL.y;
            float face = nL.x * 1.7 + nL.z * 3.1;
            vec3 rd = normalize(vBL - vCamB);
            vec3 r = vec3(dot(rd, tL), rd.y, -dot(rd, nL));
            float fres = 0.04 + 0.96 * pow(1.0 - clamp(dot(-rd, nL), 0.0, 1.0), 5.0);
            float grime = fbm2(vec2(u * 0.09 + seed * 17.0, v * 0.035));
            float streak = vnoise(vec2(u * 1.3 + seed * 5.0, v * 0.05));
            albedo = tone * (0.9 + 0.14 * grime) * (0.96 + 0.06 * streak);
            float win = 0.0;      // 1 vision glass with a room, 2 spandrel glass
            float rail = 0.0;     // glass balustrade in front of the glass
            vec2 rp = vec2(0.0);
            vec3 rsz = vec3(1.0);
            vec3 rs = vec3(0.5);
            float level = 0.38;
            if (v < gh) {
              if (housing) {
                // stilt parking under housing: open and in deep shade, with columns
                float bx = mod(u + 1.0, 5.6);
                if (bx > 0.55 && v < gh - 0.32) albedo = vec3(0.06, 0.06, 0.065) * mix(0.6, 1.5, v / gh);
              } else {
                // shopfronts with a fascia band
                float bay = 6.2;
                float bi = floor(u / bay);
                float bx = u - bi * bay;
                if (v > gh - 1.0 && v < gh - 0.25) {
                  albedo = mix(tone * 0.55, vec3(0.2, 0.21, 0.22), step(0.5, h21(vec2(bi, seed))));
                } else if (bx > 0.3 && v > 0.2 && v < gh - 1.05) {
                  win = 1.0;
                  rp = vec2(bx - 0.3, v - 0.2);
                  rsz = vec3(bay - 0.3, gh - 1.25, 9.0);
                  rs = h23(vec2(bi + face * 11.0, seed * 91.0));
                  level = 0.65;
                } else {
                  albedo = vec3(0.16, 0.16, 0.17);
                }
              }
            } else {
              float fv = v - gh;
              float fi = floor(fv / fh);
              float fy = fv - fi * fh;
              if (v > vBS.y - 1.1) {
                albedo = tone * 0.98; // parapet
              } else if (type > 2.5) {
                // modern housing: balcony slabs, a glass balustrade, glazing set back in shade
                float nb = max(1.0, floor(faceW / 6.5));
                float bw = faceW / nb;
                float bi = floor(u / bw);
                float bx = u - bi * bw;
                if (fy < 0.3) {
                  albedo = tone * 1.08;
                } else if (bx < 0.4) {
                  albedo = tone * 0.9; // dividing wall between balconies
                } else {
                  win = 1.0;
                  rp = vec2(bx - 0.4, fy - 0.3);
                  rsz = vec3(bw - 0.4, fh - 0.3, 4.5);
                  rs = h23(vec2(bi + face * 13.0, fi + seed * 41.0));
                  level = 0.3 * mix(0.6, 1.0, smoothstep(0.3, fh, fy));
                  rail = step(fy, 1.32);
                }
              } else if (type < 0.5) {
                float nb = max(1.0, floor(faceW / 3.6));
                float bw = faceW / nb;
                float bi = floor(u / bw);
                float bx = u - bi * bw;
                vec3 col = h23(vec2(bi + face * 37.0, seed * 113.0)); // per vertical stack of bays
                vec3 cell = h23(vec2(bi + face * 37.0 + fi * 0.37, seed * 57.0 + fi));
                bool balcony = col.x < 0.22;
                if (fy < 0.22) albedo = tone * 1.07; // slab band
                else if (fy < 0.5) albedo *= mix(0.7, 1.0, (fy - 0.22) / 0.28); // shade under it
                if (balcony && bx > bw * 0.08 && bx < bw * 0.92 && fy > 0.22) {
                  albedo = tone * 0.48 * mix(0.75, 1.0, fy / fh);
                  if (fy > 1.0 && fy < 1.06) albedo = vec3(0.22);
                  if (bx > bw * 0.25 && bx < bw * 0.75 && fy > 0.3 && fy < 2.45) {
                    win = 1.0;
                    rp = vec2(bx - bw * 0.25, fy - 0.3);
                    rsz = vec3(bw * 0.5, 2.15, 4.2);
                    rs = cell;
                    level = 0.22;
                  }
                } else {
                  float ww = bw * mix(0.5, 0.74, col.y);
                  float wl = (bw - ww) * 0.5;
                  float sill = 0.86;
                  float wh = 1.5;
                  if (bx > wl && bx < bw - wl && fy > sill && fy < sill + wh) {
                    float lx = bx - wl;
                    float fx = min(lx, ww - lx);
                    float fyy = min(fy - sill, sill + wh - fy);
                    float split = abs(lx - ww * (col.z > 0.5 ? 0.5 : 0.36));
                    vec3 frame = col.z > 0.4 ? vec3(0.86, 0.86, 0.84) : vec3(0.2, 0.2, 0.21);
                    if (min(fx, fyy) < 0.06 || split < 0.03) {
                      albedo = frame;
                      fRough = 0.5;
                    } else {
                      win = 1.0;
                      rp = vec2(lx - 0.06, fy - sill - 0.06);
                      rsz = vec3(ww - 0.12, wh - 0.12, 4.0);
                      rs = cell;
                    }
                  } else if (fy > sill + wh && fy < sill + wh + 0.12 && bx > wl - 0.2 && bx < bw - wl + 0.2) {
                    albedo = tone * 1.05; // sunshade over the window
                  } else if (fy > sill + wh + 0.12 && fy < sill + wh + 0.4 && bx > wl - 0.2 && bx < bw - wl + 0.2) {
                    albedo *= 0.82; // its shadow
                  } else if (cell.y < 0.22 && fy > 0.3 && fy < 0.82 && bx > wl + 0.1 && bx < wl + 0.95) {
                    // an air-conditioner's outdoor unit under the window
                    albedo = vec3(0.78, 0.78, 0.76) * (0.75 + 0.25 * step(0.5, fract(fy * 22.0)));
                  } else if (fy < sill && fy > sill - 0.4 && bx > wl && bx < bw - wl) {
                    albedo *= 0.93; // rain streaks under the sill
                  }
                }
              } else if (type < 1.5) {
                // offices: cladding spandrels and continuous glazing with mullions
                float bw = 1.5;
                float bx = mod(u, bw);
                if (fy > 0.95 && fy < fh - 0.5) {
                  if (bx < 0.07) {
                    albedo = vec3(0.2, 0.2, 0.21);
                    fRough = 0.45;
                  } else {
                    win = 1.0;
                    float ri = floor(u / (bw * 3.0));
                    rp = vec2(mod(u, bw * 3.0), fy - 0.95);
                    rsz = vec3(bw * 3.0, fh - 1.45, 7.0);
                    rs = h23(vec2(ri + face * 19.0, fi + seed * 71.0));
                    level = 0.4;
                  }
                } else if (fy > fh - 0.5) {
                  albedo = tone * 0.92;
                }
              } else {
                // curtain wall: vision glass with mullions, darker spandrel glass at each slab
                float bw = 1.5;
                float bx = mod(u, bw);
                if (bx < 0.06 || abs(fy - 0.75) < 0.035) {
                  albedo = vec3(0.17, 0.18, 0.19);
                  fRough = 0.4;
                  fMetal = 0.6;
                } else if (fy < 0.75) {
                  win = 2.0;
                } else {
                  win = 1.0;
                  float ri = floor(u / (bw * 2.0));
                  rp = vec2(mod(u, bw * 2.0), fy - 0.75);
                  rsz = vec3(bw * 2.0, fh - 0.75, 6.5);
                  rs = h23(vec2(ri + face * 23.0, fi + seed * 77.0));
                  level = 0.34;
                }
              }
            }
            if (win > 0.5) {
              bool curtainWall = type > 1.5 && type < 2.5;
              albedo = curtainWall ? tone * 0.55 : vec3(0.05, 0.058, 0.064);
              fMetal = curtainWall ? 0.75 : 0.12;
              fRough = 0.05;
              ${
                detail
                  ? 'if (win < 1.5) fRoom = roomInterior(rp, r, rsz, rs, level * mix(0.6, 1.3, rs.z)) * (1.0 - fres) * (curtainWall ? 0.45 : 0.85);'
                  : 'if (win < 1.5) fRoom = vec3(0.24, 0.22, 0.2) * level * mix(0.4, 1.4, rs.z) * (1.0 - fres);'
              }
              if (rail > 0.5) {
                albedo = mix(albedo, vec3(0.42, 0.5, 0.5), 0.5);
                fRoom *= 0.55;
              }
            }
            albedo *= mix(0.74, 1.0, smoothstep(0.0, 5.0, v)); // ground grime
          }
          diffuseColor.rgb = albedo;
        }`
      )
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = fRough;')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = fMetal;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += fRoom;');
  };
  m.customProgramCacheKey = () => `city-facade-${detail ? 1 : 0}`;
  return m;
}
