import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { Bloom, BrightnessContrast, EffectComposer, N8AO, SMAA, TiltShift2, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import Director from './Director.jsx';
import Terrain from './world/Terrain.jsx';
import Trees from './world/Trees.jsx';
import Roads from './world/Roads.jsx';
import Context from './world/Context.jsx';
import Development from './dev/Development.jsx';
import Holo from './holo/Holo.jsx';
import Corridor from './hero/Corridor.jsx';
import { quality } from '../core/quality.js';
import { ui, useUI } from '../core/bus.js';
import { W } from '../core/world.js';

/** The fixed full-screen 3D view behind the page. */
const LOOK = {
  model: { bg: '#c9cba5', fog: ['#c3c79a', 760, 2400], env: 0.7, near: 2, far: 6000 },
  corridor: { bg: '#0a0807', fog: null, env: 0.12, near: 0.05, far: 160 }
};

function SetLook() {
  const set = useUI((s) => s.set);
  const { scene, camera } = useThree();
  useEffect(() => {
    const l = LOOK[set];
    scene.background = new THREE.Color(l.bg);
    scene.fog = l.fog ? new THREE.Fog(l.fog[0], l.fog[1], l.fog[2]) : null;
    scene.environmentIntensity = l.env;
    camera.near = l.near;
    camera.far = l.far;
    camera.updateProjectionMatrix();
  }, [set, scene, camera]);
  return null;
}

/**
 * The sun never moves, so the shadow map is only redrawn while something is being built (the
 * build clock changes) and every few frames for the cranes and vehicles — not sixty times a second.
 */
function ShadowPacer() {
  const { gl } = useThree();
  const last = useRef({ B: -1, n: 0 });
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);
  useFrame(() => {
    const l = last.current;
    l.n++;
    if (W.B !== l.B || l.n % quality.shadowEvery === 0) {
      l.B = W.B;
      gl.shadowMap.needsUpdate = true;
    }
  });
  return null;
}

/**
 * A soft gradient sky for the views that reach the horizon: pale blue overhead fading into a warm
 * haze that matches the fog, with a gentle glow toward the sun.
 */
function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTop: { value: new THREE.Color('#b8ccd2') },
          uMid: { value: new THREE.Color('#d9ddc8') },
          uHorizon: { value: new THREE.Color('#c8cb9f') },
          uSun: { value: new THREE.Vector3(-430, 470, 300).normalize() }
        },
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 uTop, uMid, uHorizon, uSun; varying vec3 vDir;
          void main(){
            float h = clamp(vDir.y, -0.2, 1.0);
            vec3 c = mix(uHorizon, uMid, smoothstep(0.0, 0.18, h));
            c = mix(c, uTop, smoothstep(0.18, 0.75, h));
            float s = pow(max(dot(normalize(vDir), uSun), 0.0), 6.0);
            c += vec3(1.0, 0.86, 0.62) * s * 0.18;
            gl_FragColor = vec4(c, 1.0);
          }`,
        side: THREE.BackSide,
        depthWrite: false,
        fog: false
      }),
    []
  );
  return (
    <mesh material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[4200, 32, 16]} />
    </mesh>
  );
}

/**
 * Late-afternoon light, balanced for a calm, natural picture: a warm sun with long soft shadows,
 * and a cool blue sky fill so the shadows read cool against the warm lit surfaces.
 */
function ModelLight({ active, ref }) {
  const sun = useRef();
  useEffect(() => {
    const l = sun.current;
    if (!l) return;
    const c = l.shadow.camera;
    c.left = -420;
    c.right = 420;
    c.top = 420;
    c.bottom = -420;
    c.near = 50;
    c.far = 1600;
    c.updateProjectionMatrix();
    l.shadow.mapSize.set(quality.shadow, quality.shadow);
    l.shadow.bias = -0.00035;
    l.shadow.normalBias = 0.9;
    l.shadow.radius = 4;
    l.target.position.set(0, 0, 0);
    l.target.updateMatrixWorld();
  }, []);
  return (
    <group ref={ref} visible={active}>
      <directionalLight ref={sun} position={[-430, 470, 300]} intensity={2.9} color="#ffe1ad" castShadow />
      <hemisphereLight args={['#eef0dc', '#5f7434', 0.78]} />
    </group>
  );
}

function Effects({ set }) {
  if (set === 'corridor')
    return (
      <EffectComposer multisampling={0} enableNormalPass={false} key="corridor">
        {quality.ao && (
          <N8AO aoRadius={0.8} distanceFalloff={0.6} intensity={2.2} aoSamples={quality.aoSamples} denoiseSamples={quality.aoDenoise} halfRes={false} quality={quality.aoQuality} />
        )}
        <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={0.85} radius={0.75} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.25} darkness={0.62} />
        <SMAA />
      </EffectComposer>
    );
  return (
    <EffectComposer multisampling={0} enableNormalPass={false} key="model">
      {quality.ao && (
        <N8AO
          aoRadius={7}
          distanceFalloff={2.2}
          intensity={2.4}
          color="#3b3527"
          aoSamples={quality.aoSamples}
          denoiseSamples={quality.aoDenoise}
          halfRes={false} // N8AO's half-resolution path breaks on three r187
          quality={quality.aoQuality}
        />
      )}
      <Bloom mipmapBlur luminanceThreshold={0.92} luminanceSmoothing={0.25} intensity={0.42} radius={0.65} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <BrightnessContrast brightness={-0.015} contrast={0.07} />
      {!quality.low && <TiltShift2 blur={0.24} taper={0.48} start={[0, 0.5]} end={[1, 0.5]} samples={quality.tiltSamples} />}
      <Vignette offset={0.22} darkness={0.62} />
      <SMAA />
    </EffectComposer>
  );
}

/**
 * Compile every shader before the visitor enters, so nothing stalls on first sight. Each set is
 * compiled on its own, with its own lights and fog, because those are part of every shader.
 */
function Warmup({ sets, onReady }) {
  const { gl, scene, camera } = useThree();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const { model, corridor, light } = sets;
    const t0 = performance.now();
    const keep = { m: model.current.visible, c: corridor.current.visible, l: light.current.visible, fog: scene.fog };
    const pass = (name) => {
      const l = LOOK[name];
      model.current.visible = name === 'model';
      light.current.visible = name === 'model';
      corridor.current.visible = name === 'corridor';
      scene.fog = l.fog ? new THREE.Fog(l.fog[0], l.fog[1], l.fog[2]) : null;
      try {
        gl.compile(scene, camera);
      } catch (e) {
        console.warn('warm-up compile failed', e);
      }
    };
    pass('model');
    pass('corridor');
    model.current.visible = keep.m;
    corridor.current.visible = keep.c;
    light.current.visible = keep.l;
    scene.fog = keep.fog;
    if (import.meta.env.DEV) console.info(`[v2] shaders compiled in ${Math.round(performance.now() - t0)} ms`);
    requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
  }, [gl, scene, camera, onReady, sets]);
  return null;
}

function Sets({ project, onReady }) {
  const set = useUI((s) => s.set);
  const model = useRef();
  const corridor = useRef();
  const light = useRef();
  const sets = useMemo(() => ({ model, corridor, light }), []);
  return (
    <>
      <group ref={model} visible={set === 'model'}>
        <SkyDome />
        <Terrain />
        <Trees />
        <Roads />
        <Context />
        <Development project={project} />
        <Holo project={project} />
      </group>
      <group ref={corridor} visible={set === 'corridor'}>
        <Corridor />
      </group>
      <ModelLight ref={light} active={set === 'model'} />
      <ShadowPacer />
      <Warmup sets={sets} onReady={onReady} />
    </>
  );
}

export default function Stage({ project, onReady }) {
  const covered = useUI((s) => s.covered);
  const set = useUI((s) => s.set);
  const [dpr, setDpr] = useState(quality.dpr);
  const env = useMemo(
    () => (
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer form="rect" intensity={2.0} color="#fff4e2" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#b9d3ea" position={[0, 4, -9]} scale={[22, 8, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ffe7c9" position={[-8, 2, 4]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#d9e6f2" position={[8, 2, -4]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#c8a878" position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} />
      </Environment>
    ),
    []
  );
  return (
    <Canvas
      className="stage"
      shadows
      dpr={dpr}
      frameloop={covered ? 'never' : 'always'}
      camera={{ fov: 48, near: 0.05, far: 160, position: [6000, 1.6, 3] }}
      gl={{ antialias: false, powerPreference: 'high-performance', toneMapping: THREE.NoToneMapping, stencil: false }}
      onCreated={(state) => {
        if (import.meta.env.DEV) window.__r3f = state;
        state.gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          ui.set({ contextLost: true });
        });
      }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(1, +(d - 0.25).toFixed(2)))}
        onIncline={() => setDpr((d) => Math.min(quality.dpr, +(d + 0.15).toFixed(2)))}
      />
      <SetLook />
      <Director />
      {env}
      <Suspense fallback={null}>
        <Sets project={project} onReady={onReady} />
      </Suspense>
      <Effects set={set} />
    </Canvas>
  );
}

export { useFrame };
