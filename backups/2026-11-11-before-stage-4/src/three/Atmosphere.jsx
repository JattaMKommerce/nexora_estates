import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
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

/** Haze colour at the horizon: the sky dome fades into it and the fog fades distant ground into it. */
export const HORIZON = '#b4bdc8';
/** Aerial haze: exponential fog density, tuned so the city dissolves into the horizon by ~3 km. */
export const HAZE = 0.00052;

const Y = new THREE.Vector3(0, 1, 0);
const HDRI_SUN = new THREE.Vector3(0.533, 0.749, 0.394).normalize(); // measured in sky_4k.jpg
const TARGET_AZIMUTH = Math.atan2(0.62, -0.62); // from the south-west
export const SKY_ROTATION = Math.atan2(HDRI_SUN.z, HDRI_SUN.x) - TARGET_AZIMUTH;
export const SUN_DIR = HDRI_SUN.clone().applyAxisAngle(Y, SKY_ROTATION);

/**
 * The visible sky: a dome showing the panorama (rotated exactly as the lighting is, so the sun you
 * see matches the shadows), fading into a bright haze just above the horizon. Below the horizon is
 * haze too, the same colour as the fog, so the city dissolves into the distance without a seam.
 */
export function SkyBackground({ intensity = 1 }) {
  const tex = useTexture(SKY_JPG);
  const mesh = useRef();
  const material = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = false; // mip selection breaks at the panorama's seam; the sky is smooth anyway
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    const rot = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationY(-SKY_ROTATION));
    return new THREE.ShaderMaterial({
      uniforms: {
        uSky: { value: tex },
        uRot: { value: rot },
        uHaze: { value: new THREE.Color(HORIZON) },
        uIntensity: { value: intensity }
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
          vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = p.xyww; // on the far plane
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uSky;
        uniform mat3 uRot;
        uniform vec3 uHaze;
        uniform float uIntensity;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          vec3 r = uRot * d;
          vec2 uv = vec2(atan(r.z, r.x) * 0.15915494 + 0.5, asin(clamp(r.y, -1.0, 1.0)) * 0.31830989 + 0.5);
          vec3 sky = texture2D(uSky, uv).rgb * uIntensity;
          float h = smoothstep(-0.02, 0.17, d.y);
          gl_FragColor = vec4(mix(uHaze, sky, h * h * (3.0 - 2.0 * h)), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    });
  }, [tex, intensity]);
  useEffect(() => () => material.dispose(), [material]);
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 64, 32), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      scale={4000}
      frustumCulled={false}
      renderOrder={-1000}
      raycast={() => null}
      onBeforeRender={(renderer, scene, camera) => {
        // the sky stays centred on whichever camera is rendering (including reflection probes)
        mesh.current.position.copy(camera.position);
        mesh.current.updateMatrixWorld();
      }}
    />
  );
}

/** Brightest the sky light may be (the sun disc in the HDR is ~60 000): see useSkyLight. */
const SUN_CAP = 3.2;
/** Radiance of sunlit ground, replacing the HDR's mirrored lower hemisphere. */
const GROUND = [0.2, 0.19, 0.17];

/**
 * The sky HDR as image-based light, with the sun disc clamped out. The directional light is the sun
 * (with shadows); if the HDR kept its sun too, every surface would receive unshadowed sunlight from
 * the environment and shadows would all but vanish. What remains is the blue sky and cloud light
 * that fills shadows softly, as outdoors.
 */
export function useSkyLight() {
  const tex = useLoader(HDRLoader, SKY_HDR);
  return useMemo(() => {
    if (!tex.userData.sunClamped) {
      const d = tex.image.data;
      const half = d instanceof Uint16Array;
      const get = (i) => (half ? THREE.DataUtils.fromHalfFloat(d[i]) : d[i]);
      const set = (i, v) => {
        d[i] = half ? THREE.DataUtils.toHalfFloat(v) : v;
      };
      const { width: W, height: H } = tex.image;
      for (let i = 0; i < d.length; i += 4) {
        let r = get(i);
        let g = get(i + 1);
        let b = get(i + 2);
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (l > SUN_CAP) {
          const k = SUN_CAP / l;
          r *= k;
          g *= k;
          b *= k;
        }
        // Below the horizon this "pure sky" HDR mirrors the sky; real light from below is the
        // sunlit ground, much darker and warmer (otherwise balcony soffits glow like the sky).
        const row = Math.floor(i / 4 / W);
        const t = Math.min(1, Math.max(0, (row - H / 2) / (H * 0.035)));
        if (t > 0) {
          r += (GROUND[0] - r) * t;
          g += (GROUND[1] - g) * t;
          b += (GROUND[2] - b) * t;
        }
        set(i, r);
        set(i + 1, g);
        set(i + 2, b);
      }
      tex.userData.sunClamped = true;
      tex.needsUpdate = true;
    }
    tex.mapping = THREE.EquirectangularReflectionMapping;
    return tex;
  }, [tex]);
}

/** Image-based light from the sky (the visible sky is SkyBackground's dome). */
export function SkyEnvironment({ intensity = 1 }) {
  const map = useSkyLight();
  return <Environment map={map} environmentIntensity={intensity} environmentRotation={[0, SKY_ROTATION, 0]} />;
}

/**
 * Sun and sky fill. The sun's shadow map covers the development and the streets around it
 * (`extent` metres either side of the tower), so neighbouring buildings and trees cast and receive
 * shadows too. It is rendered only when something moves (see shadows.js).
 */
export function Lighting({ dims, shadowMapSize, extent: wide = 0, intensity = 2.9 }) {
  const sun = useRef();
  const target = useMemo(() => new THREE.Object3D(), []);
  const cy = dims.height * 0.3;
  const dist = Math.max(dims.height, wide) + 220;
  const extent = Math.max(55, dims.height * 0.62 + 24, wide);

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
      <hemisphereLight args={['#eaf0f7', '#b9ad98', 0.22]} />
      <directionalLight
        ref={sun}
        color="#fff0da"
        intensity={intensity}
        castShadow
        shadow-bias={-0.0002}
        shadow-normalBias={0.05}
        shadow-radius={2}
      />
    </>
  );
}
