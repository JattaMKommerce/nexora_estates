import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { PHASE, clamp01, fronts, smooth, smoother, sub } from '../../story/script.js';
import { FILM_CHAPTERS } from '../../story/film.js';
import { CROWN_H, FLOOR_H } from '../towerGeometry.js';
import { invalidateShadows } from '../shadows.js';

/**
 * Directs Section A's film (src/story/film.js) for the renderer: `film.current.t` (0–1) sets the
 * camera, the build and the fit-out exactly, with no smoothing over time, so every frame can be
 * rendered on its own and played back by scrolling. When a frame has settled (shadows re-rendered),
 * `film.current.done` is set to its t.
 *
 *   rise    the development is built (the same sequence as the home page story), the camera
 *           rising with it on a slow arc
 *   fitout  the homes behind the glass go from bare concrete to fitted out and lit, from the top
 *           storey down; the glass reflects less meanwhile, so the rooms read
 *   ascent  down to the entrance at eye level, then straight up the facade to above the roof
 *   view    a full turn from above the roof terrace, looking out over the city
 */

const lerp = THREE.MathUtils.lerp;
const THETA = -0.3; // the hero bearing: from the south-south-west, both faces in sun
const span = (t, [a, z]) => clamp01((t - a) / (z - a));
const CH = Object.fromEntries(FILM_CHAPTERS.map((c) => [c.id, [c.from, c.to]]));

function pose() {
  return { pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 30 };
}
function mixPose(a, b, k, out) {
  out.pos.lerpVectors(a.pos, b.pos, k);
  out.target.lerpVectors(a.target, b.target, k);
  out.fov = lerp(a.fov, b.fov, k);
  return out;
}
function orbit(out, target, r, theta, rise) {
  const phi = Math.acos(THREE.MathUtils.clamp(rise / r, -0.95, 0.95));
  out.target.copy(target);
  out.pos.setFromSphericalCoords(r, phi, theta).add(target);
  return out;
}
function fitRadius(fovDeg, aspect, halfH, halfW) {
  const vf = THREE.MathUtils.degToRad(fovDeg) / 2;
  const hf = Math.atan(Math.tan(vf) * aspect);
  return Math.max(halfH / Math.tan(vf), halfW / Math.tan(hf));
}

export function FilmDirector({ film, state, dims, mats, maxFloors, site }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const size = useThree((s) => s.size);
  const last = useRef(null);
  const frames = useRef(0);
  const P = useRef({ a: pose(), b: pose(), c: pose(), out: pose() });

  useFrame(() => {
    const f = film.current?.film;
    if (!f) return;
    if (controls) controls.enabled = false;
    if (f.t === last.current) {
      // let the shadow map and the frame settle before saying it is done
      frames.current += 1;
      if (frames.current >= 4 && f.done !== f.t) f.done = f.t;
      return;
    }
    last.current = f.t;
    frames.current = 0;
    f.done = null;

    const aspect = size.width / Math.max(1, size.height);
    const portrait = aspect < 0.9;
    const t = clamp01(f.t);
    const { a, b, c, out } = P.current;
    const H = dims.height;
    const W = dims.width;
    const D = dims.depth;
    const sp = Math.max(W, D);
    const front = dims.outerD / 2;
    const telefov = portrait ? 38 : 28;
    const T = new THREE.Vector3();

    const standing = (bb) => {
      if (bb < PHASE.podium[0]) return 3;
      if (bb < PHASE.floors[0]) return 3 + (dims.base - 3) * sub(bb, PHASE.podium);
      const { S } = fronts(bb, maxFloors);
      return dims.base + Math.min(S, dims.floors) * FLOOR_H + sub(bb, PHASE.crown) * CROWN_H;
    };
    // the construction view (and, at bb = 1, the finished building)
    const build = (bb, o) => {
      const h = Math.max(standing(bb), H * 0.36);
      T.set(0, h * 0.48, 0);
      let r = fitRadius(telefov, aspect, h * 0.58 + 4, sp * 0.7 + 8) * (portrait ? 1.04 : 1);
      // at first the whole plot in its streets, closing in on the tower as it rises
      const kSite = 1 - smooth(clamp01(bb / 0.45));
      if (kSite > 0) {
        T.lerp(new THREE.Vector3(site.x * 0.5, 4, site.z * 0.5), kSite);
        r = lerp(r, fitRadius(telefov, aspect, site.sz * 0.5, site.sx * (portrait ? 0.42 : 0.9)), kSite);
      }
      // while the building is low, a gentle aerial (the plot reads as a plot), easing down to the
      // hero's height as it tops out
      const rise = h * 0.42 + 8;
      orbit(o, T, r, THETA + 0.55 * (1 - smooth(bb)), lerp(Math.max(rise, r * (portrait ? 0.4 : 0.36)), rise, smooth(sub(bb, [0.55, 1]))));
      o.fov = telefov;
      return o;
    };
    // close to the facade, level with the storeys being finished (y), so the rooms read as rooms
    const lo = dims.base + 7;
    const hi = dims.top - 5;
    const facade = (y, o) => {
      T.set(0, THREE.MathUtils.clamp(y, lo, hi), 0);
      orbit(o, T, fitRadius(telefov, aspect, 13, portrait ? sp * 0.4 : sp * 0.62 + 4), THETA + 0.16, 3);
      o.fov = telefov;
      return o;
    };
    // at the entrance, at eye level on the drop-off drive (clear of trees), looking at the lobby
    const entrance = (o) => {
      o.pos.set(THREE.MathUtils.clamp(portrait ? -9 : -15, site.drive.x0 + 2, site.drive.x1 - 2), 1.7, site.drive.z + 1.5);
      o.target.set(0, 6.4, front);
      o.fov = portrait ? 56 : 44;
      return o;
    };
    // above the roof's front edge, looking over the terrace
    const crest = (o) => {
      o.pos.set(0, dims.top + CROWN_H + 3.2, front + 11);
      o.target.set(0, dims.top + CROWN_H + 1, -D * 4); // out over the roof, to the city beyond
      o.fov = portrait ? 60 : 48;
      return o;
    };

    let b1 = 1;
    let fit = -1e4; // every home fitted (the default)
    let lit = 0.3;
    let glassEnv = 1.25;

    if (t < CH.rise[1]) {
      const u = span(t, CH.rise);
      b1 = u;
      build(b1, out);
      fit = 1e4; // under construction: bare shells behind the glass
      lit = 0;
    } else if (t < CH.fitout[1]) {
      const u = span(t, CH.fitout);
      fit = lerp(dims.top + 2, dims.base - 2.5, smooth(span(u, [0.18, 0.95])));
      // in to the top storeys, then down the facade with the storeys being finished
      mixPose(build(1, a), facade(fit - 1.5, b), smoother(clamp01(u / 0.22)), out);
      lit = 0.42;
      glassEnv = lerp(1.25, 0.72, smooth(clamp01(u / 0.16)));
    } else if (t < CH.ascent[1]) {
      const u = span(t, CH.ascent);
      glassEnv = lerp(0.72, 1.05, smooth(u));
      if (u < 0.28) {
        // to the street: across at height first (over the trees), then down onto the drive
        const k = u / 0.28;
        facade(lo, a);
        entrance(b);
        const kh = smoother(clamp01(k / 0.7));
        const kv = smoother(clamp01((k - 0.3) / 0.7));
        out.pos.set(lerp(a.pos.x, b.pos.x, kh), lerp(a.pos.y, b.pos.y, kv), lerp(a.pos.z, b.pos.z, kh));
        out.target.lerpVectors(a.target, b.target, smoother(k));
        out.fov = lerp(a.fov, b.fov, smoother(k));
      } else {
        // straight up the facade, then over the crown
        const k = smoother(span(u, [0.28, 1]));
        entrance(a);
        crest(c);
        out.pos.set(lerp(a.pos.x, c.pos.x, smooth(k)), lerp(a.pos.y, c.pos.y, k), lerp(a.pos.z, c.pos.z, smooth(k)));
        // look at the facade just above the camera, turning to look across the roof at the top
        const ty = lerp(a.target.y, out.pos.y + 3, smooth(clamp01(k / 0.2)));
        out.target.set(0, lerp(ty, c.target.y, smoother(span(k, [0.72, 1]))), lerp(front, c.target.z, smoother(span(k, [0.72, 1]))));
        out.fov = lerp(a.fov, c.fov, smooth(k));
      }
    } else {
      // a full turn from above the middle of the roof, looking slightly down over the city
      const u = span(t, CH.view);
      crest(a);
      const k0 = smoother(clamp01(u / 0.16));
      const eye = new THREE.Vector3(0, dims.top + CROWN_H + 3.6, 0);
      out.pos.lerpVectors(a.pos, eye, k0);
      const yaw = Math.PI * 2 * smooth(span(u, [0.06, 1])); // starts looking north, across the roof
      const dir = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const look = out.pos.clone().addScaledVector(dir, 120);
      look.y = out.pos.y - 120 * Math.tan(THREE.MathUtils.degToRad(7));
      out.target.lerpVectors(a.target, look, k0);
      out.fov = lerp(a.fov, portrait ? 66 : 54, k0);
    }

    state.b = b1;
    state.growth = sub(b1, PHASE.landscape);
    const g = mats.glass.userData.uniforms?.uFit;
    if (g) {
      g.value.x = fit;
      g.value.z = lit;
    }
    mats.glass.envMapIntensity = glassEnv;

    camera.position.copy(out.pos);
    controls?.target.copy(out.target);
    camera.lookAt(out.target);
    camera.fov = out.fov;
    camera.near = 0.3;
    camera.updateProjectionMatrix();
    camera.clearViewOffset();
    invalidateShadows();
  });

  return null;
}
