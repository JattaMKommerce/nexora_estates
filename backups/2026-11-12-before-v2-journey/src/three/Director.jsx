import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { live, ui } from '../core/bus.js';
import { W, updateWorld, sstep, ramp } from '../core/world.js';
import { CORRIDOR } from './hero/Corridor.jsx';
import { WINDOW_POSES, TOUR } from '../content.js';
import { project as projectAnchor } from './anchors.js';

/**
 * Moves the camera. In the corridor it walks toward the glass doors; over the model it follows one
 * smooth spline through a keyframe per story beat (so scrolling between beats plays like a film and
 * reverses exactly). A live window on a white page, or a stop on the virtual tour, takes over with
 * its own framing.
 */
const MODEL_KEYS = {
  3: { p: [300, 205, 345], t: [0, 26, -12], fov: 27 },
  4: { p: [395, 290, 430], t: [-10, 0, -8], fov: 26 },
  5: { p: [10, 420, 470], t: [-55, 0, -30], fov: 31 },
  6: { p: [265, 215, 300], t: [0, 30, 0], fov: 30 },
  7: { p: [560, 430, 700], t: [90, 20, 90], fov: 34 },
  8: { p: [150, 360, 300], t: [0, 18, -10], fov: 27 },
  9: { p: [290, 205, 315], t: [0, 0, 0], fov: 26 },
  10: { p: [185, 118, 205], t: [-4, 0, -16], fov: 28 },
  11: { p: [265, 165, 300], t: [0, 30, -12], fov: 28 },
  12: { p: [330, 210, 360], t: [0, 26, -12], fov: 26 },
  13: { p: [-205, 105, 285], t: [6, 34, -12], fov: 27 },
  14: { p: [-150, 112, 205], t: [-6, 40, -18], fov: 28 },
  15: { p: [290, 215, 330], t: [4, 14, -2], fov: 27 }
};

const PORTRAIT_P1C = new THREE.Vector3(10, 20, -10);

function buildPath() {
  const keys = Object.keys(MODEL_KEYS)
    .map(Number)
    .sort((a, b) => a - b);
  const pos = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...MODEL_KEYS[k].p)), false, 'centripetal');
  const tgt = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...MODEL_KEYS[k].t)), false, 'centripetal');
  return { keys, pos, tgt, first: keys[0], last: keys[keys.length - 1] };
}

export default function Director() {
  const { camera, size, scene } = useThree();
  const path = useMemo(() => buildPath(), []);
  const tmp = useMemo(
    () => ({
      p: new THREE.Vector3(),
      t: new THREE.Vector3(),
      cp: new THREE.Vector3(),
      ct: new THREE.Vector3(),
      op: new THREE.Vector3(),
      ot: new THREE.Vector3(),
      fov: 27,
      blend: 0,
      yaw: 0,
      shift: 0,
      r: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      init: false
    }),
    []
  );

  useFrame((state, dt) => {
    // after the 3D was paused under a white page, cut straight to where the story is now
    if (dt > 0.25) tmp.init = false;
    const S = live.S;
    const win = live.win ? WINDOW_POSES[live.win.key]?.[live.win.block] : null;
    updateWorld(S, Math.min(dt, 0.1), win);

    // where the story wants the camera
    if (W.set === 'corridor') {
      const [ox, , oz] = CORRIDOR.origin;
      const walk = sstep(S, 0, 2) * 0.62 + ramp(S, 2, 2.93) * 0.38;
      const z = oz + 3 - walk * (3 - (CORRIDOR.end + 2.2));
      const sway = Math.sin(S * 2.4) * 0.05;
      const idle = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
      tmp.p.set(ox + sway + live.pointer.x * 0.05, 1.62 + Math.sin(S * 6.5) * 0.012, z + idle);
      tmp.t.set(ox + live.pointer.x * 0.25, 1.56 - live.pointer.y * 0.12, z - 12);
      tmp.fov = 48;
    } else {
      const u = Math.min(1, Math.max(0, (S - path.first) / (path.last - path.first)));
      path.pos.getPoint(u, tmp.p);
      path.tgt.getPoint(u, tmp.t);
      // tall screens: aim at the middle of what the desktop frame shows, so nothing important is cut off at the sides
      if (size.width / Math.max(1, size.height) < 0.85 && S > 6.5 && S < 7.5) tmp.t.lerp(PORTRAIT_P1C, 1 - Math.abs(S - 7) * 2);
      const k0 = Math.floor(S);
      const k1 = Math.min(path.last, k0 + 1);
      const f0 = MODEL_KEYS[Math.max(path.first, Math.min(path.last, k0))]?.fov ?? 27;
      const f1 = MODEL_KEYS[k1]?.fov ?? f0;
      tmp.fov = f0 + (f1 - f0) * (S - k0);
      // a slow drift so the model never looks frozen, and a hint of parallax with the pointer
      const tt = state.clock.elapsedTime;
      tmp.p.x += Math.sin(tt * 0.09) * 3 + live.pointer.x * 4;
      tmp.p.y += Math.sin(tt * 0.07) * 1.5 - live.pointer.y * 3;
    }

    // a live window or a tour stop overrides the framing
    const tourLoc = ui.get().tourLoc;
    const tour = tourLoc ? TOUR.find((t) => t.id === tourLoc) : null;
    const over = win?.cam ? win : tour?.cam ? tour : null;
    const want = over ? 1 : 0;
    tmp.blend += (want - tmp.blend) * (1 - Math.exp(-dt * (over ? 2.6 : 3.4)));
    if (over) {
      tmp.op.set(...over.cam.p);
      tmp.ot.set(...over.cam.t);
    }
    if (W.set === 'model' && S >= 14.6 && !over && ui.get().beat === 'tour') {
      // drag to look around the finished development on the tour overview
      tmp.yaw += (live.orbit.yaw - tmp.yaw) * (1 - Math.exp(-dt * 4));
    } else {
      tmp.yaw += (0 - tmp.yaw) * (1 - Math.exp(-dt * 3));
    }
    if (Math.abs(tmp.yaw) > 1e-4) {
      tmp.r.copy(tmp.p).sub(tmp.t).applyAxisAngle(tmp.up, tmp.yaw);
      tmp.p.copy(tmp.t).add(tmp.r);
    }

    const k = tmp.init ? 1 - Math.exp(-dt * 9) : 1;
    tmp.init = true;
    if (tmp.blend > 0.001) {
      tmp.p.lerp(tmp.op, tmp.blend);
      tmp.t.lerp(tmp.ot, tmp.blend);
      if (over) tmp.fov += ((over.cam.fov ?? 28) - tmp.fov) * tmp.blend;
    }
    // jump straight to the corridor/model when the set changes (behind the white flash)
    const jump = Math.abs(tmp.cp.x - tmp.p.x) > 2000;
    tmp.cp.lerp(tmp.p, jump ? 1 : k);
    tmp.ct.lerp(tmp.t, jump ? 1 : k);
    camera.position.copy(tmp.cp);
    camera.lookAt(tmp.ct);
    let fov = tmp.fov;
    const aspect = size.width / Math.max(1, size.height);
    if (W.set === 'model' && aspect < 1.5) {
      // portrait screens: keep the model's horizontal coverage close to the desktop framing
      const h = Math.tan(THREE.MathUtils.degToRad(fov / 2)) * 1.5;
      const wide = THREE.MathUtils.radToDeg(2 * Math.atan(h / aspect));
      fov = Math.min(60, fov + (wide - fov) * 0.7);
    }
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // centre the picture in a window on a white page, or beside the tour panel
    tmp.shift += ((tour && size.width > 760 ? Math.min(240, size.width * 0.16) : 0) - tmp.shift) * (1 - Math.exp(-dt * 3));
    if (live.win && W.set === 'model') {
      const r = live.win.rect;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - size.width / 2;
      const dy = cy - size.height / 2;
      camera.setViewOffset(size.width, size.height, -dx, -dy, size.width, size.height);
    } else {
      // tall screens: lift the model a little, so less sky and more land frame it
      const lift = W.set === 'model' && aspect < 0.85 ? size.height * 0.1 : 0;
      if (Math.abs(tmp.shift) > 0.5 || lift > 0) camera.setViewOffset(size.width, size.height, -tmp.shift, lift, size.width, size.height);
      else if (camera.view?.enabled) camera.clearViewOffset();
    }

    projectAnchor(camera, size);
    scene.userData.time = state.clock.elapsedTime;
  });

  return null;
}
