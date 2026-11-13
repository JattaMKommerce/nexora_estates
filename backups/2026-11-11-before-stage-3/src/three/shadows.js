import { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

/**
 * The sun and buildings are static, so the shadow map only needs re-rendering while floors move.
 * Anything that moves or swaps shadow casters calls invalidateShadows().
 */
let dirty = true;
export const invalidateShadows = () => {
  dirty = true;
};

export function ShadowManager() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    dirty = true;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);
  useFrame(() => {
    if (dirty) {
      gl.shadowMap.needsUpdate = true;
      dirty = false;
    }
  });
  return null;
}
