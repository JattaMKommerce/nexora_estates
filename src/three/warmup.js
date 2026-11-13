import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { invalidateShadows } from './shadows.js';

/**
 * Compiles every material in the scene once it has settled (lights, environment and reflections in
 * place), including those of objects that are hidden for now (the construction sequence, the other
 * view of each tower) or out of view (the other rooms of a home), so nothing has to compile in the
 * middle of a scroll or a camera move. Uses the browser's parallel shader compilation where
 * available, so the page stays responsive. Then keeps the compiled programs (see `pinPrograms`).
 * Used by the building and by the interior.
 */
export function ShaderWarmup({ onDone }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const frames = useRef(0);
  const done = useRef(false);
  const finish = useRef(onDone);
  finish.current = onDone;
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current < 9) return; // after the reflection probes and shadow map
    done.current = true;
    const hidden = [];
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    let pending;
    try {
      pending = gl.compileAsync ? gl.compileAsync(scene, camera) : Promise.resolve(gl.compile(scene, camera));
    } catch {
      pending = Promise.resolve();
    } finally {
      hidden.forEach((o) => {
        o.visible = false;
      });
    }
    Promise.resolve(pending)
      .catch(() => {})
      .then(() => {
        // one tiny off-screen frame with everything shown compiles the shadow-pass variants too
        const shown = [];
        scene.traverse((o) => {
          if (!o.visible) {
            shown.push(o);
            o.visible = true;
          }
        });
        const rt = new THREE.WebGLRenderTarget(16, 16);
        const prev = gl.getRenderTarget();
        try {
          gl.shadowMap.needsUpdate = true;
          gl.setRenderTarget(rt);
          gl.render(scene, camera);
        } catch {
          /* not essential */
        } finally {
          gl.setRenderTarget(prev);
          rt.dispose();
          shown.forEach((o) => {
            o.visible = false;
          });
          invalidateShadows();
        }
        pinPrograms(gl);
        finish.current?.();
      });
  });
  return null;
}

/**
 * Keeps every compiled shader program for the life of the page. three.js destroys a program as soon
 * as no material uses it, so each swap between the building and a home (one view is unmounted while
 * the other shows) would compile the same shaders again: a stall of up to a second, mid-scroll.
 * The set is small and bounded (one program per kind of material and lighting), so keeping it costs
 * little. (`usedTimes` is three's own reference count; one extra reference means "never release".)
 */
export function pinPrograms(gl) {
  for (const p of gl.info?.programs || []) {
    if (p.__pinned || typeof p.usedTimes !== 'number') continue;
    p.__pinned = true;
    p.usedTimes += 1;
  }
}
