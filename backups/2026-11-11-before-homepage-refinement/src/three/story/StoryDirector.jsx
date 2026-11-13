import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OPENING, PHASE, buildFor, clamp01, openingBuild, smooth, smoother, sub, viewAt } from '../../story/script.js';
import { ROAD } from '../city/layout.js';
import { invalidateShadows } from '../shadows.js';

/**
 * Directs the homepage story inside the 3D scene. The page writes where the visitor is
 * (`story.current`: chapter and progress from the scroll position, and the opening's state); every
 * frame this turns it into a camera pose, the build progress and the image offset, smoothed so that
 * scrolling feels continuous and runs backwards exactly. It never animates on its own except the
 * opening, which plays once on a clock.
 *
 * While the visitor explores in full screen (`active` false) it lets go: the building is complete
 * and the usual camera rig takes over.
 */

const V = () => new THREE.Vector3();
const lerp = THREE.MathUtils.lerp;

function fitRadius(fovDeg, aspect, halfH, halfW) {
  const vf = THREE.MathUtils.degToRad(fovDeg) / 2;
  const hf = Math.atan(Math.tan(vf) * aspect);
  return Math.max(halfH / Math.tan(vf), halfW / Math.tan(hf));
}

const sph = (out, target, r, theta, phi) => out.setFromSphericalCoords(r, phi, theta).add(target);

/** Poses for one tower: { pos, target, fov } builders, in tower coordinates (the tower at the origin). */
function makePoses(ctx) {
  const { H, W, D, top, outerD, compact, aspect, roadZ } = ctx;
  const fovB = compact ? 44 : 35;
  const effAspect = compact ? aspect : aspect * 0.78; // the captions take the left of the screen
  const buildTarget = new THREE.Vector3(0, H * (compact ? 0.5 : 0.47), 0);
  const rBuild = fitRadius(fovB, effAspect, H * 0.56 + 6, Math.max(W, D) * 0.74 + 9) * (compact ? 1.3 : 1.1);

  const build = (u, out) => {
    out.target.copy(buildTarget);
    sph(out.pos, buildTarget, rBuild, lerp(0.98, 0.56, u), lerp(1.3, 1.38, u));
    out.fov = fovB;
    return out;
  };

  const k = compact ? 1.3 : 1;
  const views = [
    // the facade, three-quarters
    { target: [0, H * 0.56, D / 2], pos: [W * 0.62 * k, H * 0.52, D / 2 + (40 + W * 0.2) * k], fov: compact ? 40 : 30 },
    // balconies and fins, close, looking up the corner
    { target: [W * 0.4, H * 0.66, D / 2 + 1], pos: [W / 2 + 13 * k, H * 0.5, D / 2 + 17 * k], fov: compact ? 50 : 42 },
    // the crown against the sky
    { target: [0, top + 1.5, 0], pos: [W * 0.45 + 16 * k, top + 14, D / 2 + 42 * k], fov: compact ? 42 : 32 },
    // arrival: the lobby and drop-off from the drive
    { target: [0, 7, D / 2], pos: [11 * (compact ? 0.6 : 1), 1.9, outerD / 2 + 11.5], fov: compact ? 62 : 52 },
    // the setting: the development in its neighbourhood
    { setting: true, fov: compact ? 44 : 35 }
  ];
  const settingTarget = new THREE.Vector3(0, H * 0.3, 0);
  const view = (i, out) => {
    const v = views[i];
    if (v.setting) {
      out.target.copy(settingTarget);
      sph(out.pos, settingTarget, H * (compact ? 2.9 : 2.3) + 60, 0.62, 1.12);
    } else {
      out.target.set(...v.target);
      out.pos.set(...v.pos);
    }
    out.fov = v.fov;
    return out;
  };

  // the opening's shots
  const fovA = compact ? 46 : 34;
  const aTarget = new THREE.Vector3(0, H * 0.32, 0);
  const shotA = (u, out) => {
    const e = smooth(u);
    out.target.copy(aTarget);
    sph(out.pos, aTarget, lerp(3.6, 2.3, e) * H * (compact ? 1.25 : 1), lerp(-0.75, 0.15, e), lerp(0.78, 1.02, e));
    out.fov = fovA;
    return out;
  };
  const shotB = (u, out) => {
    const e = smooth(u);
    out.pos.set(lerp(72, 16, e), lerp(3.2, 4.6, e), roadZ);
    out.target.set(0, H * lerp(0.42, 0.6, e), 0);
    out.fov = lerp(compact ? 58 : 46, compact ? 52 : 40, e);
    return out;
  };
  const shotC = (u, out) => {
    const e = smooth(u);
    out.pos.set(lerp(W * 0.7, W * 0.95, e) * (compact ? 1.15 : 1), lerp(9, H * 0.88, e), D / 2 + lerp(15, 24, e) * (compact ? 1.2 : 1));
    out.target.set(0, lerp(H * 0.4, top + 2, e), lerp(D / 2, 0, e));
    out.fov = lerp(compact ? 54 : 42, compact ? 50 : 38, e);
    return out;
  };
  return { build, view, shotA, shotB, shotC };
}

const pose = () => ({ pos: V(), target: V(), fov: 35 });

function mix(a, b, t, out) {
  out.pos.lerpVectors(a.pos, b.pos, t);
  out.target.lerpVectors(a.target, b.target, t);
  out.fov = lerp(a.fov, b.fov, t);
  return out;
}

export function StoryDirector({ story, active, state, dims, dev, entry, reducedMotion, onEvent }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const size = useThree((s) => s.size);
  const cur = useRef(null);
  const tmp = useRef({ a: pose(), b: pose(), c: pose(), want: pose() });
  const clock = useRef({ n: -1, t0: 0 });
  const offset = useRef({ x: 0, y: 0 });
  const shadow = useRef({ b: -1, frames: 0, settle: 0 });
  const was = useRef(active);
  const events = useRef(onEvent);
  events.current = onEvent;

  const compact = Boolean(story.current?.compact);
  const ctx = {
    H: dims.height,
    W: dims.width,
    D: dims.depth,
    top: dims.top,
    outerD: dims.outerD,
    compact,
    aspect: size.width / Math.max(1, size.height),
    roadZ: dev.sz + ROAD / 2 - entry.z
  };
  const poses = useRef(null);
  poses.current = makePoses(ctx);

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
    let bTarget;
    let direct = false;
    let offsetOn = true;
    const op = s.opening || { state: 'idle' };
    if (op.state === 'play' && !reduced) {
      if (clock.current.n !== op.n) {
        clock.current = { n: op.n, t0: now };
        events.current?.({ type: 'opening-start', variant: op.variant });
      }
      const variant = op.variant === 'short' ? 'short' : 'full';
      const o = OPENING[variant];
      const t = now - clock.current.t0;
      bTarget = openingBuild(t, variant);
      direct = true;
      if (variant === 'full') {
        const [s0, s1, s2, s3, s4] = o.shots;
        if (t < s1) {
          P.shotA((t - s0) / (s1 - s0), want);
          offsetOn = false;
        } else if (t < s2) {
          P.shotB((t - s1) / (s2 - s1), want);
          offsetOn = false;
        } else if (t < s3) {
          P.shotC((t - s2) / (s3 - s2), want);
          offsetOn = false;
        } else if (t < s4) {
          P.shotC(1, T.a);
          P.build(0, T.b);
          mix(T.a, T.b, smoother(clamp01((t - s3) / (s4 - s3))), want);
        } else {
          P.build(0, want);
          want.pos.sub(want.target).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.03 * clamp01((t - s4) / 3)).add(want.target);
        }
      } else {
        P.build(0, want);
      }
      if (t >= o.end) {
        op.state = 'done';
        events.current?.({ type: 'opening-end', variant });
      }
    } else {
      const sc = s.scroll || { chapter: 'intro', progress: 0 };
      bTarget = buildFor(sc.chapter, sc.progress, { openingDone: op.state === 'done', reduced });
      if (sc.chapter === 'intro') {
        P.build(0, want);
      } else if (sc.chapter === 'rise') {
        P.build(reduced ? 0.5 : sc.progress, want);
      } else {
        const v = viewAt(sc.chapter === 'after' ? 1 : sc.progress);
        if (reduced) P.view(v.index, want);
        else mix(P.view(v.from, T.a), P.view(v.to, T.b), v.t, want);
      }
    }

    // ---- smoothing (none for the opening, which is already a film-like move)
    if (!cur.current) {
      cur.current = { pos: want.pos.clone(), target: want.target.clone(), fov: want.fov, b: bTarget };
    }
    const c = cur.current;
    if (enteringFromFull) {
      c.pos.copy(camera.position);
      c.target.copy(controls.target);
      c.fov = camera.fov;
    }
    const k = direct || reduced ? 1 : 1 - Math.exp(-dt * 4.2);
    const kb = direct || reduced ? 1 : 1 - Math.exp(-dt * 5.5);
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

    // ---- image offset: room for the captions (left on wide screens, below on phones)
    const wantX = offsetOn ? s.offset?.x || 0 : 0;
    const wantY = offsetOn ? s.offset?.y || 0 : 0;
    const ko = reduced ? 1 : 1 - Math.exp(-dt * 3);
    offset.current.x = lerp(offset.current.x, wantX, ko);
    offset.current.y = lerp(offset.current.y, wantY, ko);
    const { width, height } = size;
    if (Math.abs(offset.current.x) < 0.5 && Math.abs(offset.current.y) < 0.5) camera.clearViewOffset();
    else camera.setViewOffset(width, height, -offset.current.x, offset.current.y, width, height);

    // ---- the build, and shadows that follow it (re-rendered every other frame while it moves)
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
      // once more after the build stops: everything that follows it (trees, cranes) has caught up
      sh.settle -= 1;
      if (sh.settle === 0) invalidateShadows();
    }
  });

  return null;
}
