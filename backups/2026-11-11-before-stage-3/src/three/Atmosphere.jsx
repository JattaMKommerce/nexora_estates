import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import { invalidateShadows } from './shadows.js';
import { assetPath } from '../lib/paths.js';

/**
 * Daylight from a real sky (Poly Haven "Kloofendal 48d partly cloudy", CC0):
 *   sky_1k.hdr  image-based lighting and reflections
 *   sky_4k.jpg  the visible sky
 * The sky is rotated so its sun sits in the south-west (north is −z), and the shadow-casting
 * directional light is aimed along the same direction, so shadows match the sun in the picture.
 */
export const SKY_HDR = assetPath('assets/hdri/sky_1k.hdr');
export const SKY_JPG = assetPath('assets/hdri/sky_4k.jpg');

/** Sky colour at the horizon (sampled from sky_4k.jpg): fog fades distant ground into it. */
export const HORIZON = '#969baa';

const Y = new THREE.Vector3(0, 1, 0);
const HDRI_SUN = new THREE.Vector3(0.533, 0.749, 0.394).normalize(); // measured in sky_4k.jpg
const TARGET_AZIMUTH = Math.atan2(0.62, -0.62); // from the south-west
export const SKY_ROTATION = Math.atan2(HDRI_SUN.z, HDRI_SUN.x) - TARGET_AZIMUTH;
export const SUN_DIR = HDRI_SUN.clone().applyAxisAngle(Y, SKY_ROTATION);

export function SkyBackground({ intensity = 1 }) {
  const tex = useTexture(SKY_JPG);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    const prev = scene.background;
    scene.background = tex;
    scene.backgroundRotation.set(0, SKY_ROTATION, 0);
    scene.backgroundIntensity = intensity;
    return () => {
      scene.background = prev;
    };
  }, [tex, scene, intensity]);
  return null;
}

/** drei's Environment also writes the background settings, so keep them identical to SkyBackground's. */
export function SkyEnvironment({ intensity = 1, backgroundIntensity = 1 }) {
  return (
    <Environment
      files={SKY_HDR}
      environmentIntensity={intensity}
      environmentRotation={[0, SKY_ROTATION, 0]}
      backgroundRotation={[0, SKY_ROTATION, 0]}
      backgroundIntensity={backgroundIntensity}
    />
  );
}

export function Lighting({ dims, shadowMapSize }) {
  const sun = useRef();
  const target = useMemo(() => new THREE.Object3D(), []);
  const cy = dims.height * 0.42;
  const dist = dims.height + 180;
  const extent = Math.max(55, dims.height * 0.62 + 24);

  useLayoutEffect(() => {
    const light = sun.current;
    if (!light) return;
    target.position.set(0, cy, 0);
    target.updateMatrixWorld();
    light.target = target;
    light.position.set(SUN_DIR.x * dist, cy + SUN_DIR.y * dist, SUN_DIR.z * dist);
    const cam = light.shadow.camera;
    cam.left = -extent;
    cam.right = extent;
    cam.top = extent;
    cam.bottom = -extent;
    cam.near = 1;
    cam.far = dist * 2 + dims.height;
    cam.updateProjectionMatrix();
    light.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    light.shadow.map?.dispose();
    light.shadow.map = null;
    light.shadow.needsUpdate = true;
    invalidateShadows();
  }, [cy, dist, extent, dims.height, shadowMapSize, target]);

  return (
    <>
      <primitive object={target} />
      <hemisphereLight args={['#eef3f8', '#bfb39f', 0.35]} />
      <directionalLight
        ref={sun}
        color="#fff2df"
        intensity={2.4}
        castShadow
        shadow-bias={-0.00025}
        shadow-normalBias={0.04}
        shadow-radius={2.5}
      />
    </>
  );
}
