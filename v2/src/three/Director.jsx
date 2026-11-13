import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { live, ui } from '../core/bus.js';
import { W, updateWorld, ramp, CUT } from '../core/world.js';
import { LOBBY } from './hero/Lobby.jsx';
import { WINDOW_POSES, TOUR } from '../content.js';
import { project as projectAnchor } from './anchors.js';

/**
 * Moves the camera. In the corridor it walks toward the glass doors; over the model it follows one
 * smooth spline through a keyframe per story beat (so scrolling between beats plays like a film and
 * reverses exactly). A live window on a white page, or a stop on the virtual tour, takes over with
 * its own framing.
 */
const MODEL_KEYS = {
  1.42: { p: [640, 560, 820], t: [60, 10, 60], fov: 30 }, // just out of the doors: high above the valley
  2: { p: [40, 400, 470], t: [-45, 0, -26], fov: 31 }, // the site visit
  3: { p: [178, 196, 236], t: [-4, 0, -14], fov: 30 }, // construction begins
  4: { p: [232, 128, 248], t: [0, 32, -14], fov: 30 }, // the towers rise
  4.5: { p: [70, 175, 360], t: [0, 30, -12], fov: 29 }, // sweeping round the front
  5: { p: [-212, 112, 284], t: [4, 36, -12], fov: 28 }, // ready to live: the finished view
  6: { p: [-150, 112, 205], t: [-6, 40, -18], fov: 28 }, // homes for sale
  6.5: { p: [60, 190, 360], t: [2, 22, -6], fov: 28 },
  7: { p: [290, 215, 330], t: [4, 14, -2], fov: 27 } // the tour overview
};

function buildPath() {
  const keys = Object.keys(MODEL_KEYS)
    .map(Number)
    .sort((a, b) => a - b);
  const pos = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...MODEL_KEYS[k].p)), false, 'centripetal');
  const tgt = new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...MODEL_KEYS[k].t)), false, 'centripetal');
  /** S → curve parameter: the keys are unevenly spaced in S, the curve's parameter is per key. */
  const param = (S) => {
    if (S <= keys[0]) return 0;
    for (let i = 0; i < keys.length - 1; i++)
      if (S <= keys[i + 1]) return (i + (S - keys[i]) / (keys[i + 1] - keys[i])) / (keys.length - 1);
    return 1;
  };
  const fovAt = (S) => {
    if (S <= keys[0]) return MODEL_KEYS[keys[0]].fov;
    for (let i = 0; i < keys.length - 1; i++)
      if (S <= keys[i + 1]) {
        const f = (S - keys[i]) / (keys[i + 1] - keys[i]);
        return MODEL_KEYS[keys[i]].fov + (MODEL_KEYS[keys[i + 1]].fov - MODEL_KEYS[keys[i]].fov) * f;
      }
    return MODEL_KEYS[keys[keys.length - 1]].fov;
  };
  return { keys, pos, tgt, param, fovAt };
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
      const [ox, , oz] = LOBBY.origin;
      // one steady walk down the gallery to the garden doors (slower at the start, while you read)
      const w = Math.pow(ramp(S, 0, CUT), 1.15);
      const z = oz + LOBBY.startZ - w * (LOBBY.startZ - (LOBBY.end + 2.4));
      const idle = Math.sin(state.clock.elapsedTime * 0.35) * 0.06;
      tmp.p.set(ox + LOBBY.walkX + live.pointer.x * 0.08, 1.66 + Math.sin(S * 7) * 0.01, z + idle);
      tmp.t.set(ox + LOBBY.walkX * 0.4 + live.pointer.x * 0.35, 2.05 - live.pointer.y * 0.15, z - 14);
      tmp.fov = 52;
    } else {
      const u = path.param(S);
      path.pos.getPoint(u, tmp.p);
      path.tgt.getPoint(u, tmp.t);
      tmp.fov = path.fovAt(S);
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
    if (W.set === 'model' && S >= 6.6 && !over && ui.get().beat === 'tour') {
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
