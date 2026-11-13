import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, N8AO, SMAA, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { towerDims } from './towerGeometry.js';
import { EXTERIOR_TEX, createMaterials, disposeMaterials } from './materials.js';
import { HORIZON, Lighting, SkyBackground, SkyEnvironment } from './Atmosphere.jsx';
import { Podium, Site } from './Site.jsx';
import { Tower } from './Tower.jsx';
import { CameraRig, ViewOffset } from './CameraRig.jsx';
import { ShadowManager } from './shadows.js';
import { usePbr } from './textures.js';

const InteriorScene = lazy(() => import('../interior/InteriorScene.jsx'));
const PanoramaScene = lazy(() => import('../panorama/PanoramaScene.jsx'));

/**
 * Lazy-loaded 3D stage. One WebGL context hosts three scenes:
 *   building / floor  → the tower, its site and the cut-away floor
 *   interior          → one apartment at full height
 *   tour              → a 360° panorama
 * Post-processing (ambient occlusion, tone mapping, SMAA) runs for the two 3D scenes; panoramas
 * are photographs and are shown untouched.
 */
export default function Experience(props) {
  const { quality, onContextLost, view, active = true } = props;
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, quality.dpr[1]));

  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      frameloop={active ? 'always' : 'never'} // paused while an embedded scene is scrolled out of view
      camera={{ fov: 35, near: 0.5, far: 6000, position: [-320, 260, 420] }}
      gl={{ antialias: !quality.fx, powerPreference: 'high-performance', toneMapping: quality.fx ? THREE.NoToneMapping : THREE.NeutralToneMapping, stencil: false }}
      onCreated={(state) => {
        const { gl } = state;
        if (import.meta.env.DEV) window.__r3f = state; // dev-only debugging handle
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onContextLost?.();
        });
      }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(1, d - 0.4))}
        onIncline={() => setDpr((d) => Math.min(quality.dpr[1], d + 0.2))}
        onFallback={() => setDpr(1)}
      />
      <Suspense fallback={null}>
        {view === 'interior' && props.interior ? (
          <InteriorScene
            key={`${props.interior.plan ? 'p' : ''}${props.interior.unitKey}`}
            {...props.interior}
            reducedMotion={props.reducedMotion}
            quality={quality}
            onReady={() => props.onViewReady?.('interior')}
            onUserStart={props.onUserStart}
          />
        ) : view === 'tour' && props.tour ? (
          <PanoramaScene {...props.tour} reducedMotion={props.reducedMotion} onReady={() => props.onViewReady?.('tour')} />
        ) : (
          <ExteriorScene {...props} />
        )}
      </Suspense>
      {view !== 'tour' && quality.fx && <Effects interior={view === 'interior'} quality={quality} />}
    </Canvas>
  );
}

function Effects({ interior, quality }) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO
        aoRadius={interior ? 0.6 : 3.4}
        distanceFalloff={interior ? 0.5 : 1.4}
        intensity={interior ? 2.4 : 2.1}
        aoSamples={quality.low ? 8 : 16}
        denoiseSamples={quality.low ? 4 : 8}
        halfRes={false} // N8AO's half-resolution path breaks on three r187 render targets
        quality={quality.low ? 'performance' : 'medium'}
      />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <SMAA />
    </EffectComposer>
  );
}

function ExteriorScene({
  tower,
  source,
  selectedIndex,
  hoveredIndex,
  onHover,
  onSelect,
  intro,
  onIntroDone,
  onSkipIntro,
  resetToken,
  skipToken,
  autoRotate,
  onUserStart,
  reducedMotion,
  quality,
  inset,
  onReady,
  plan,
  unitProps,
  focus,
  orbit = DEFAULT_ORBIT
}) {
  // Rebuild geometry only when the shape changes, not on every data refresh.
  const shapeKey = `${tower.id}|${tower.levels.length}|${tower.unitsPerFloor}|${tower.hasLobby}|${tower.levels.map((l) => l.units.length).join(',')}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dims = useMemo(() => towerDims(tower), [shapeKey]);
  const pbr = usePbr(EXTERIOR_TEX);
  const mats = useMemo(() => createMaterials(pbr), [pbr]);
  useEffect(() => () => disposeMaterials(mats), [mats]);

  const fogNear = Math.max(220, dims.height * 2.4);
  const fogFar = fogNear + 1300;

  return (
    <>
      <SkyBackground />
      <SkyEnvironment intensity={1.05} />
      <fog attach="fog" args={[HORIZON, fogNear, fogFar]} />
      <Lighting dims={dims} shadowMapSize={quality.shadowMapSize} />
      <Site dims={dims} mats={mats} density={quality.contextDensity} />
      <Podium dims={dims} mats={mats} />
      <Tower
        key={tower.id}
        tower={tower}
        dims={dims}
        mats={mats}
        source={source}
        selectedIndex={selectedIndex}
        hoveredIndex={hoveredIndex}
        onHover={onHover}
        onSelect={onSelect}
        reducedMotion={reducedMotion}
        plan={plan}
        unitProps={unitProps}
      />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.075}
        rotateSpeed={0.55}
        zoomSpeed={0.75}
        panSpeed={0.6}
        screenSpacePanning
        autoRotate={autoRotate}
        autoRotateSpeed={0.4}
        enableZoom={orbit.zoom}
        enablePan={orbit.pan}
        enableRotate={orbit.rotate}
        onStart={onUserStart}
      />
      <TouchAction scroll={orbit.touchScroll} />
      <CameraRig
        dims={dims}
        towerKey={tower.id}
        selectedIndex={selectedIndex}
        intro={intro}
        onIntroDone={onIntroDone}
        onSkipIntro={onSkipIntro}
        resetToken={resetToken}
        skipToken={skipToken}
        reducedMotion={reducedMotion}
        inset={inset}
        focus={focus}
      />
      <ViewOffset x={inset.x} y={inset.y} reducedMotion={reducedMotion} />
      <ShadowManager />
      <ReadySignal onReady={onReady} />
    </>
  );
}

const DEFAULT_ORBIT = { zoom: true, pan: true, rotate: true, touchScroll: false };

/**
 * OrbitControls claims every touch on the canvas (touch-action: none). In the homepage preview a
 * vertical swipe must scroll the page instead; taps still reach the floors.
 */
function TouchAction({ scroll }) {
  const gl = useThree((s) => s.gl);
  const controls = useThree((s) => s.controls);
  useEffect(() => {
    gl.domElement.style.touchAction = scroll ? 'pan-y' : 'none';
  }, [gl, controls, scroll]);
  return null;
}

function ReadySignal({ onReady }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(() => onReady?.());
  });
  return null;
}
