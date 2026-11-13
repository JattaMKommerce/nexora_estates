import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * The view from a residence's windows. When a residence is selected, the exterior scene (city,
 * development, sky) is rendered once into a cube map from that residence's actual position and
 * height, with its own tower hidden. The interior then shows that cube map outside its windows,
 * so every home looks out on the same streets, towers and skyline as the 3D model, at the right
 * height and orientation. If no view has been captured, the interior falls back to the sky.
 */
const cache = new Map(); // key → WebGLCubeRenderTarget
const MAX = 2;

export const viewKey = (towerId, level, unitKey) => `${towerId}|${level}|${unitKey}`;

export function getView(key) {
  return cache.get(key)?.texture || null;
}

function remember(key, rt) {
  cache.get(key)?.dispose();
  cache.set(key, rt);
  while (cache.size > MAX) {
    const [oldest, value] = cache.entries().next().value;
    value.dispose();
    cache.delete(oldest);
  }
}

/** Captures the view for `target` = { key, position: [x, y, z] } a few frames after it changes. */
export function ViewCapture({ target, hide = [], size = 512, onCaptured }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const pending = useRef(0);
  const latest = useRef(target);
  latest.current = target;
  const key = target?.key || null;

  useEffect(() => {
    if (key && !cache.has(key)) pending.current = 2; // soon: the interior may open right after a residence is chosen
  }, [key]);

  useFrame(() => {
    if (pending.current <= 0) return;
    pending.current -= 1;
    if (pending.current > 0) return;
    const t = latest.current;
    if (!t || cache.has(t.key)) return;
    const rt = new THREE.WebGLCubeRenderTarget(size, { type: THREE.HalfFloatType });
    const cam = new THREE.CubeCamera(1, 9000, rt);
    cam.position.set(t.position[0], t.position[1], t.position[2]);
    cam.updateMatrixWorld(true);
    const hidden = hide.map((r) => r?.current).filter(Boolean);
    hidden.forEach((o) => {
      o.userData.__viewVisible = o.visible;
      o.visible = false;
    });
    const prev = gl.getRenderTarget();
    cam.update(gl, scene);
    gl.setRenderTarget(prev);
    hidden.forEach((o) => {
      o.visible = o.userData.__viewVisible;
    });
    remember(t.key, rt);
    onCaptured?.(t.key);
  });
  return null;
}
