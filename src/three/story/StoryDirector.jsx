import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { AMENITY_VIEWS, OPENING, PHASE, VIEWS, buildFor, clamp01, fronts, smooth, smoother, stopsAt, sub } from '../../story/script.js';
import { CROWN_H, FLOOR_H, SELECT_RISE, levelBaseY } from '../towerGeometry.js';
import { ROAD } from '../city/layout.js';
import { invalidateShadows } from '../shadows.js';

/**
 * Directs the homepage story inside the 3D scene. The page writes where the visitor is
 * (`story.current`: chapter and progress from the scroll position, and the opening's state); every
 * frame this turns it into a camera pose and the build progress, smoothed so scrolling feels
 * continuous and runs backwards exactly. It never animates on its own except the opening, which
 * plays once on a clock.
 *
 * Composition: the featured tower is centred and fills the frame, seen through a long lens (little
 * perspective distortion) from the south-south-west, where both of its visible faces are in sun.
 * During construction the framing follows the building's height, so it stays centred as it rises.
 *
 * While the visitor explores in full screen (`active` false) it lets go: the building is complete
 * and the usual camera rig takes over.
 */

const lerp = THREE.MathUtils.lerp;
const UP = new THREE.Vector3(0, 1, 0);
const HERO_THETA = -0.3; // radians from due south, towards the west

function fitRadius(fovDeg, aspect, halfH, halfW) {
  const vf = THREE.MathUtils.degToRad(fovDeg) / 2;
  const hf = Math.atan(Math.tan(vf) * aspect);
  return Math.max(halfH / Math.tan(vf), halfW / Math.tan(hf));
}

/** Camera on a sphere around `target`, at a given height above it (keeps the view's pitch gentle). */
function orbit(out, target, r, theta, rise) {
  const phi = Math.acos(THREE.MathUtils.clamp(rise / r, -0.95, 0.95));
  out.target.copy(target);
  out.pos.setFromSphericalCoords(r, phi, theta).add(target);
  return out;
}

function makePoses(ctx) {
  const { dims, maxFloors, compact, aspect, roadZ, feature, grounds } = ctx;
  const H = dims.height;
  const W = dims.width;
  const D = dims.depth;
  const span = Math.max(W, D);
  const fov = compact ? 34 : 26;
  const fit = (halfH, halfW) => fitRadius(fov, aspect, halfH, halfW);
  const T = new THREE.Vector3();

  // how tall the tower stands at build progress b (for framing it as it rises)
  const standing = (b) => {
    if (b < PHASE.podium[0]) return 3;
    if (b < PHASE.floors[0]) return 3 + (dims.base - 3) * sub(b, PHASE.podium);
    const { S } = fronts(b, maxFloors);
    const crown = sub(b, PHASE.crown) * CROWN_H;
    return dims.base + Math.min(S, dims.floors) * FLOOR_H + crown;
  };

  /** The construction view, and (at b = 1) the hero view of the finished building. */
  const build = (b, out) => {
    const h = Math.max(standing(b), H * 0.34);
    T.set(0, h * 0.5, 0);
    const r = fit(h * 0.6 + 3, span * 0.72 + 7) * (compact ? 1.04 : 1);
    // A portrait screen stands far back (to fit the tower's width), well into the blocks across
    // the street: while the building is low, look down over them instead of through them, easing
    // back to the hero's height as it tops out.
    const rise = h * 0.42 + 8;
    orbit(out, T, r, HERO_THETA + 0.45 * (1 - b), compact ? lerp(Math.max(rise, r * 0.34), rise, smooth(sub(b, [0.6, 1]))) : rise);
    out.fov = fov;
    return out;
  };

  const floor = (index, out) => {
    T.set(0, levelBaseY(dims, index) + SELECT_RISE + 1.1, 0);
    const r = fit(span * 0.42 + 4, span * 0.6 + 5) * (compact ? 1.1 : 1);
    orbit(out, T, r, HERO_THETA + 0.28, r * 0.52);
    out.fov = fov;
    return out;
  };

  const archAt = (i, out) => {
    const key = VIEWS[i];
    if (key === 'facade') {
      T.set(-W * 0.06, H * 0.6, D / 2);
      orbit(out, T, compact ? 105 : 80, HERO_THETA - 0.12, 2);
      out.fov = compact ? 32 : 28;
    } else if (key === 'balconies') {
      T.set(-W / 2 + 2, H * 0.66, D / 2);
      orbit(out, T, compact ? 50 : 38, HERO_THETA - 0.42, -6);
      out.fov = compact ? 38 : 32;
    } else if (key === 'crown') {
      T.set(0, dims.top + 1.5, 0);
      orbit(out, T, compact ? 95 : 72, HERO_THETA + 0.08, 12);
      out.fov = compact ? 32 : 28;
    } else {
      // arrival: the lobby and drop-off, from the drive
      out.target.set(0, 6.5, D / 2 + 1);
      out.pos.set(-7, 1.8, dims.outerD / 2 + 12);
      out.fov = compact ? 50 : 42;
    }
    return out;
  };

  const amenityAt = (i, out) => {
    if (AMENITY_VIEWS[i] === 'feature') {
      // the water in the foreground, the arrival canopy and the lower floors rising behind it
      // (from the south, square to the water, which the site plan centres in front of the towers)
      T.set(feature.x, 5, feature.z - 7);
      orbit(out, T, compact ? 118 : 94, 0, compact ? 52 : 43);
    } else {
      T.set(grounds.x, 4, grounds.z);
      orbit(out, T, grounds.r * (compact ? 3.1 : 2.4) + 40, HERO_THETA + 0.15, grounds.r * 1.4 + 30);
    }
    out.fov = fov;
    return out;
  };

  // the opening's shots (each keeps the tower centred)
  const shotA = (u, out) => {
    const e = smooth(u);
    T.set(0, H * 0.42, 0);
    out.target.copy(T);
    out.pos.setFromSphericalCoords(lerp(3.3, 2.4, e) * H * (compact ? 1.25 : 1), lerp(0.82, 1.12, e), lerp(HERO_THETA - 1.15, HERO_THETA - 0.35, e)).add(T);
    out.fov = compact ? 36 : 30;
    return out;
  };
  const shotB = (u, out) => {
    const e = smooth(u);
    out.pos.set(lerp(58, 18, e), lerp(3.4, 4.8, e), roadZ);
    out.target.set(0, H * lerp(0.48, 0.58, e), 0);
    out.fov = compact ? 44 : 38;
    return out;
  };
  const shotC = (u, out) => {
    const e = smooth(u);
    out.pos.set(-lerp(W * 0.85, W * 1.05, e) * (compact ? 1.15 : 1), lerp(10, H * 0.82, e), D / 2 + lerp(22, 30, e) * (compact ? 1.2 : 1));
    out.target.set(0, lerp(H * 0.42, dims.top + 2, e), lerp(D / 2, 0, e));
    out.fov = compact ? 40 : 34;
    return out;
  };
  return { build, floor, archAt, amenityAt, shotA, shotB, shotC };
}

const pose = () => ({ pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 30 });

function mix(a, b, t, out) {
  out.pos.lerpVectors(a.pos, b.pos, t);
  out.target.lerpVectors(a.target, b.target, t);
  out.fov = lerp(a.fov, b.fov, t);
  return out;
}

export function StoryDirector({ story, active, state, dims, dev, entry, maxFloors, selectedIndex, feature, grounds, reducedMotion, onEvent }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const size = useThree((s) => s.size);
  const cur = useRef(null);
  const tmp = useRef({ a: pose(), b: pose(), want: pose() });
  const clock = useRef({ n: -1, t0: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const shadow = useRef({ b: -1, frames: 0, settle: 0 });
  const was = useRef(active);
  const events = useRef(onEvent);
  events.current = onEvent;
  const sel = useRef(selectedIndex);
  sel.current = selectedIndex;

  const compact = Boolean(story.current?.compact);
  const poses = useRef(null);
  poses.current = makePoses({
    dims,
    maxFloors,
    compact,
    aspect: size.width / Math.max(1, size.height),
    roadZ: dev.sz + ROAD / 2 - entry.z,
    feature,
    grounds
  });

  useEffect(
    () => () => {
      camera.clearViewOffset();
    },
    [camera]
  );

  useFrame((three, dt) => {
    const s = story.current;
    if (!s) return;
    const now = three.clock.elapsedTime;
    if (!active) {
      if (was.current) {
        was.current = false;
        state.b = 1;
        state.growth = 1;
        invalidateShadows();
      }
      return;
    }
    const enteringFromFull = !was.current;
    was.current = true;
    if (!controls) return;
    controls.enabled = false;
    const P = poses.current;
    const T = tmp.current;
    const want = T.want;
    const reduced = reducedMotion || s.reduced;

    // ---- where the camera and the build should be
    let bTarget = 1;
    let direct = false;
    const op = s.opening || { state: 'idle' };
    if (op.state === 'play' && !reduced) {
      if (clock.current.n !== op.n) {
        clock.current = { n: op.n, t0: now };
        events.current?.({ type: 'opening-start', variant: op.variant });
      }
      const variant = op.variant === 'short' ? 'short' : 'full';
      const o = OPENING[variant];
      const t = now - clock.current.t0;
      direct = true;
      if (variant === 'full') {
        const [, s1, s2, s3] = o.shots;
        if (t < s1) P.shotA(t / s1, want);
        else if (t < s2) P.shotB((t - s1) / (s2 - s1), want);
        else if (t < s3) P.shotC((t - s2) / (s3 - s2), want);
        else mix(P.shotC(1, T.a), P.build(1, T.b), smoother(clamp01((t - s3) / (o.end - s3))), want);
      } else {
        // a gentle push-in to the hero view
        P.build(1, T.b);
        T.a.target.copy(T.b.target);
        T.a.pos.copy(T.b.pos).sub(T.b.target).multiplyScalar(1.22).applyAxisAngle(UP, 0.12).add(T.b.target);
        T.a.fov = T.b.fov;
        mix(T.a, T.b, smoother(clamp01(t / o.end)), want);
      }
      if (t >= o.end) {
        op.state = 'done';
        events.current?.({ type: 'opening-end', variant });
      }
    } else {
      const sc = s.scroll || { chapter: 'hero', progress: 0 };
      bTarget = buildFor(sc.chapter, sc.progress, { reduced });
      if (sc.chapter === 'hero') {
        P.build(1, want);
      } else if (sc.chapter === 'rise') {
        // the camera follows the build (smoothed below), so it frames the building as it rises
        P.build(cur.current ? cur.current.b : bTarget, want);
      } else if (sc.chapter === 'architecture') {
        const v = stopsAt(sc.progress, VIEWS.length);
        if (reduced) P.archAt(v.index, want);
        else mix(P.archAt(v.from, T.a), P.archAt(v.to, T.b), v.t, want);
      } else if (sc.chapter === 'floors' || sc.chapter === 'inside') {
        // the floor the page has opened (inside: the camera waits on the featured floor)
        if (sel.current !== null && sel.current !== undefined) P.floor(sel.current, want);
        else P.build(1, want);
      } else {
        const v = stopsAt(sc.chapter === 'after' ? 1 : sc.progress, AMENITY_VIEWS.length);
        if (reduced) P.amenityAt(v.index, want);
        else mix(P.amenityAt(v.from, T.a), P.amenityAt(v.to, T.b), v.t, want);
      }
    }

    // ---- smoothing (none for the opening, which is already a film-like move)
    if (!cur.current) cur.current = { pos: want.pos.clone(), target: want.target.clone(), fov: want.fov, b: bTarget };
    const c = cur.current;
    if (enteringFromFull) {
      c.pos.copy(camera.position);
      c.target.copy(controls.target);
      c.fov = camera.fov;
    }
    const k = direct || reduced ? 1 : 1 - Math.exp(-dt * 4);
    const kb = direct || reduced ? 1 : 1 - Math.exp(-dt * 5);
    c.pos.lerp(want.pos, k);
    c.target.lerp(want.target, k);
    c.fov = lerp(c.fov, want.fov, k);
    c.b = lerp(c.b, bTarget, kb);
    if (Math.abs(c.b - bTarget) < 1e-4) c.b = bTarget;

    camera.position.copy(c.pos);
    controls.target.copy(c.target);
    camera.lookAt(c.target);
    if (Math.abs(camera.fov - c.fov) > 1e-3) {
      camera.fov = c.fov;
      camera.updateProjectionMatrix();
    }

    // ---- image offset: room for the captions on phones (the building stays centred on wide screens)
    const wantX = s.offset?.x || 0;
    const wantY = s.offset?.y || 0;
    const ko = reduced ? 1 : 1 - Math.exp(-dt * 3);
    offset.current.x = lerp(offset.current.x, wantX, ko);
    offset.current.y = lerp(offset.current.y, wantY, ko);
    const { width, height } = size;
    if (Math.abs(offset.current.x) < 0.5 && Math.abs(offset.current.y) < 0.5) camera.clearViewOffset();
    else camera.setViewOffset(width, height, -offset.current.x, offset.current.y, width, height);

    // ---- the build, and shadows that follow it (re-rendered every other frame while it moves,
    // and once more after it stops, when the trees and cranes have caught up)
    state.b = c.b;
    state.growth = sub(c.b, PHASE.landscape);
    const sh = shadow.current;
    sh.frames += 1;
    if (Math.abs(c.b - sh.b) > 1e-4 && (sh.frames >= 2 || Math.abs(c.b - bTarget) < 1e-4)) {
      sh.b = c.b;
      sh.frames = 0;
      sh.settle = 3;
      invalidateShadows();
    } else if (sh.settle > 0) {
      sh.settle -= 1;
      if (sh.settle === 0) invalidateShadows();
    }
  });

  return null;
}
