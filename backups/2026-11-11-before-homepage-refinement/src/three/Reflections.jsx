import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * Reflection probe: renders the scene once into a cube map from one point and prefilters it (PMREM)
 * for glossy materials. The tower's glass then reflects the actual sky, streets and neighbouring
 * buildings around it instead of an empty sky, and water reflects the tower above it.
 *
 * Rendering happens once, a few frames after `token` changes (so everything has loaded and the
 * shadow map is ready). Objects in `hide` (refs) are hidden during the capture, so a tower doesn't
 * reflect its own inside; objects in `show` are shown (an apartment's ceiling in the dollhouse view).
 */
export function useReflectionProbe({ position, size = 256, hide = [], show = [], token = 0, enabled = true, near = 0.5, environment }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const [texture, setTexture] = useState(null);
  const pending = useRef(0);
  const current = useRef(null);
  const args = useRef({ position, hide, show, size, near, environment });
  args.current = { position, hide, show, size, near, environment };
  const [px, py, pz] = position;

  useEffect(() => {
    if (enabled) pending.current = 4; // capture after a few frames
  }, [token, enabled, px, py, pz, size]);

  useFrame(() => {
    if (pending.current <= 0) return;
    pending.current -= 1;
    if (pending.current > 0) return;
    const { position: p, hide: h, show: sh, size: s, near: n, environment: envOverride } = args.current;
    const rt = new THREE.WebGLCubeRenderTarget(s, { type: THREE.HalfFloatType });
    const cam = new THREE.CubeCamera(n, 9000, rt);
    cam.position.set(p[0], p[1], p[2]);
    cam.updateMatrixWorld(true);
    const hidden = h.map((r) => r?.current).filter(Boolean);
    const shown = sh.map((r) => r?.current).filter(Boolean);
    hidden.forEach((o) => {
      o.userData.__probeVisible = o.visible;
      o.visible = false;
    });
    shown.forEach((o) => {
      o.userData.__probeVisible = o.visible;
      o.visible = true;
    });
    // a probe must not light itself: capture with the given environment, not the previous probe
    const prevEnv = scene.environment;
    if (envOverride !== undefined) scene.environment = envOverride;
    const prev = gl.getRenderTarget();
    cam.update(gl, scene);
    gl.setRenderTarget(prev);
    scene.environment = prevEnv;
    [...hidden, ...shown].forEach((o) => {
      o.visible = o.userData.__probeVisible;
    });
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromCubemap(rt.texture);
    pmrem.dispose();
    rt.dispose();
    // materials still point at the previous probe until React re-renders: free it a moment later
    const old = current.current;
    if (old) setTimeout(() => old.dispose(), 1500);
    current.current = env;
    setTexture(env.texture);
  });

  useEffect(() => () => current.current?.dispose(), []);
  return texture;
}
