import { useCallback, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { FLOOR_H, SELECT_RISE, levelBaseY } from './towerGeometry.js';

const spherical = new THREE.Spherical();
const offsetV = new THREE.Vector3();
const clampV = new THREE.Vector3();
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Distance at which a box of the given half-extents fills the view for this fov/aspect. */
function fitRadius(fovDeg, aspect, halfH, halfW) {
  const vf = THREE.MathUtils.degToRad(fovDeg) / 2;
  const hf = Math.atan(Math.tan(vf) * aspect);
  return Math.max(halfH / Math.tan(vf), halfW / Math.tan(hf));
}

/**
 * Owns every camera move. GSAP tweens spherical coordinates (radius / polar / azimuth) around a
 * moving target, so flights arc around the tower instead of cutting through it. OrbitControls are
 * disabled during a flight and re-armed (with leftover damping momentum cleared) afterwards.
 */
export function CameraRig({
  paused = false, // the homepage story is directing the camera (see story/StoryDirector.jsx)
  dims,
  towerKey,
  selectedIndex,
  intro,
  onIntroDone,
  onSkipIntro,
  resetToken,
  skipToken,
  reducedMotion,
  inset,
  focus = null
}) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  const tween = useRef(null);
  const flying = useRef(false);
  const introRunning = useRef(false);
  const placed = useRef(false);
  const prevSel = useRef(undefined);
  const bounds = useRef(null);
  const latest = useRef({});
  latest.current = { intro, onIntroDone, onSkipIntro, selectedIndex, focus, paused };
  const focusKey = focus ? `${focus.x.toFixed(2)},${focus.z.toFixed(2)}` : '';
  const prevFocus = useRef(focusKey);

  const effW = Math.max(240, size.width - Math.abs(inset.x) * 2);
  const effH = Math.max(240, size.height - Math.abs(inset.y) * 2);
  const aspect = effW / effH;

  const overviewPose = () => {
    // inset.zoom (> 1) frames the building from further away: the homepage preview, where it shares
    // the screen with the page's text.
    const r =
      fitRadius(camera.fov, aspect, dims.height * 0.55 + 4, Math.max(dims.width, dims.depth) * 0.72 + 10) * 1.05 * (inset.zoom || 1);
    return { target: [0, dims.height * 0.47, 0], radius: r, theta: 0.72, phi: 1.36 };
  };

  const floorPose = (index, theta) => {
    const y = levelBaseY(dims, index) + SELECT_RISE + FLOOR_H * 0.3;
    const f = latest.current.focus;
    if (f) {
      const span = Math.max(f.w || 12, f.d || 10) * 0.5 + 3;
      const rf = Math.max(fitRadius(camera.fov, aspect, span, span), 20);
      return { target: [f.x, y - 0.6, f.z], radius: rf, theta, phi: 0.78 };
    }
    const r = Math.max(
      fitRadius(camera.fov, aspect, dims.depth * 0.5 + 5, dims.width * 0.5 + 5),
      Math.max(dims.width, dims.depth) + 14
    );
    return { target: [0, y, 0], radius: r, theta, phi: 0.98 };
  };

  const current = () => {
    const t = controls.target;
    offsetV.copy(camera.position).sub(t);
    spherical.setFromVector3(offsetV);
    return { target: [t.x, t.y, t.z], radius: spherical.radius, theta: spherical.theta, phi: spherical.phi };
  };

  const apply = (p) => {
    controls.target.set(p.tx, p.ty, p.tz);
    camera.position.setFromSphericalCoords(p.radius, p.phi, p.theta).add(controls.target);
    camera.lookAt(controls.target);
  };

  const setLimits = (mode, pose) => {
    const [, ty] = pose.target;
    if (mode === 'floor') {
      controls.minDistance = 6;
      controls.maxDistance = pose.radius * 2.2;
      controls.minPolarAngle = 0.15;
      controls.maxPolarAngle = 1.48;
      bounds.current = {
        min: [-dims.width / 2, ty - 5, -dims.depth / 2],
        max: [dims.width / 2, ty + 6, dims.depth / 2]
      };
    } else {
      const half = Math.max(dims.width, dims.depth) * 0.6;
      controls.minDistance = 18;
      controls.maxDistance = pose.radius * 2.4;
      controls.minPolarAngle = 0.12;
      controls.maxPolarAngle = Math.PI / 2 - 0.035;
      bounds.current = { min: [-half, 3, -half], max: [half, dims.height, half] };
    }
  };

  const fly = (to, { duration = 1.8, ease = 'power3.inOut', from = null, mode = 'building', onComplete } = {}) => {
    if (!controls) return;
    tween.current?.kill();
    const start = from || current();
    const dTheta = Math.atan2(Math.sin(to.theta - start.theta), Math.cos(to.theta - start.theta));
    const p = {
      tx: start.target[0],
      ty: start.target[1],
      tz: start.target[2],
      radius: start.radius,
      theta: start.theta,
      phi: start.phi
    };
    const end = {
      tx: to.target[0],
      ty: to.target[1],
      tz: to.target[2],
      radius: to.radius,
      theta: start.theta + dTheta,
      phi: to.phi
    };
    const finish = () => {
      flying.current = false;
      setLimits(mode, to);
      const damping = controls.enableDamping;
      controls.enableDamping = false; // flush leftover momentum from before the flight
      controls.update();
      controls.enableDamping = damping;
      apply(end);
      controls.enabled = true;
      controls.update();
      onComplete?.();
    };
    if (reducedMotion || duration <= 0) {
      apply(end);
      finish();
      return;
    }
    flying.current = true;
    controls.enabled = false;
    apply(p);
    tween.current = gsap.to(p, { ...end, duration, ease, onUpdate: () => apply(p), onComplete: finish });
  };

  const endIntro = useCallback(() => {
    if (!introRunning.current) return;
    introRunning.current = false;
    latest.current.onIntroDone?.();
  }, []);

  // Initial placement, cinematic opening, and re-framing when the tower changes.
  useEffect(() => {
    if (!controls || latest.current.paused) return;
    const ov = overviewPose();
    const sel = latest.current.selectedIndex;
    if (!placed.current && latest.current.intro && !reducedMotion) {
      introRunning.current = true;
      const start = { target: [0, dims.height * 0.62, 0], radius: ov.radius * 2.3, theta: ov.theta - 1.6, phi: 0.6 };
      fly(ov, { from: start, duration: 5.2, ease: 'power2.inOut', mode: 'building', onComplete: endIntro });
    } else if (sel === null || sel === undefined) {
      fly(ov, { duration: placed.current ? 1.6 : 0, mode: 'building' });
    } else {
      fly(floorPose(sel, ov.theta), { duration: placed.current ? 1.6 : 0, mode: 'floor' });
    }
    placed.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, towerKey]);

  // Floor selected / cleared.
  useEffect(() => {
    if (!controls || latest.current.paused) return;
    if (prevSel.current === undefined) {
      prevSel.current = selectedIndex;
      return;
    }
    if (prevSel.current === selectedIndex) return;
    prevSel.current = selectedIndex;
    endIntro();
    if (selectedIndex === null || selectedIndex === undefined) {
      fly(overviewPose(), { duration: 1.7, mode: 'building' });
    } else {
      fly(floorPose(selectedIndex, current().theta), { duration: 1.6, mode: 'floor' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, selectedIndex]);

  // Apartment focused / released on the selected floor.
  useEffect(() => {
    if (!controls || prevFocus.current === focusKey || latest.current.paused) return;
    prevFocus.current = focusKey;
    const sel = latest.current.selectedIndex;
    if (sel === null || sel === undefined) return;
    fly(floorPose(sel, current().theta), { duration: 1.3, mode: 'floor' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, focusKey]);

  // "Recenter" button (and the re-framing when the homepage story hands over to full screen).
  useEffect(() => {
    if (!controls || !resetToken || latest.current.paused) return;
    const sel = latest.current.selectedIndex;
    if (sel === null || sel === undefined) fly(overviewPose(), { duration: 1.4, mode: 'building' });
    else fly(floorPose(sel, current().theta), { duration: 1.2, mode: 'floor' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetToken]);

  // "Skip intro" (button, or any pointer/wheel on the canvas during the opening).
  useEffect(() => {
    if (!controls || !skipToken || !introRunning.current) return;
    introRunning.current = false;
    fly(overviewPose(), {
      duration: 1.1,
      ease: 'power2.out',
      mode: 'building',
      onComplete: () => latest.current.onIntroDone?.()
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipToken]);

  useEffect(() => {
    const el = gl.domElement;
    const onInput = () => {
      if (introRunning.current) latest.current.onSkipIntro?.();
    };
    el.addEventListener('pointerdown', onInput);
    el.addEventListener('wheel', onInput, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', onInput);
      el.removeEventListener('wheel', onInput);
    };
  }, [gl]);

  useEffect(() => () => tween.current?.kill(), []);

  useEffect(() => {
    if (!paused) return;
    tween.current?.kill();
    flying.current = false;
  }, [paused]);

  // Keep panning near the building so it can't be lost off-screen.
  useFrame(() => {
    if (!controls || flying.current || !bounds.current || latest.current.paused) return;
    const t = controls.target;
    const { min, max } = bounds.current;
    clampV.set(clamp(t.x, min[0], max[0]), clamp(t.y, min[1], max[1]), clamp(t.z, min[2], max[2]));
    if (!clampV.equals(t)) {
      offsetV.copy(clampV).sub(t);
      t.copy(clampV);
      camera.position.add(offsetV);
    }
  });

  return null;
}

/**
 * Shifts the rendered image (not the camera) so the building stays centred in the space left free by
 * the floor panel / bottom sheet. x > 0 moves the picture right, y > 0 moves it up (pixels).
 */
export function ViewOffset({ x = 0, y = 0, reducedMotion, disabled = false }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const cur = useRef({ x: 0, y: 0 });

  const applyOffset = useCallback(() => {
    const { width, height } = size;
    if (Math.abs(cur.current.x) < 0.5 && Math.abs(cur.current.y) < 0.5) camera.clearViewOffset();
    else camera.setViewOffset(width, height, -cur.current.x, cur.current.y, width, height);
  }, [camera, size]);

  useEffect(() => {
    // the homepage story sets the offset itself; on taking over again, start from where it left it
    if (disabled) return undefined;
    if (camera.view?.enabled) {
      cur.current.x = -camera.view.offsetX;
      cur.current.y = camera.view.offsetY;
    }
    applyOffset();
    const t = gsap.to(cur.current, {
      x,
      y,
      duration: reducedMotion ? 0 : 1.0,
      ease: 'power3.inOut',
      onUpdate: applyOffset,
      onComplete: applyOffset
    });
    return () => t.kill();
  }, [x, y, reducedMotion, applyOffset, disabled, camera]);

  useEffect(() => () => camera.clearViewOffset(), [camera]);
  return null;
}
