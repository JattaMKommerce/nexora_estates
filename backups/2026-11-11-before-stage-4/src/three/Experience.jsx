import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, N8AO, SMAA, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { levelBaseY, towerDims } from './towerGeometry.js';
import { EXTERIOR_TEX, createMaterials, disposeMaterials } from './materials.js';
import { HAZE, HORIZON, Lighting, SkyBackground, SkyEnvironment } from './Atmosphere.jsx';
import { Tower } from './Tower.jsx';
import { City, useVegetationMaterials } from './city/City.jsx';
import { layoutDevelopment } from './city/layout.js';
import { createLawnMaterial, createPlanarMaterial } from './city/materials.js';
import { ProjectSite, SiblingTower, TowerBase, WorldShift, siteFeatures } from './Development.jsx';
import { useReflectionProbe } from './Reflections.jsx';
import { ViewCapture, getView } from './viewCapture.js';
import { worldMapped, pbrMaterial } from './textures.js';
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
  const { quality, onContextLost, view, active = true, windowView } = props;
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, quality.dpr[1]));

  // Opening a residence straight from the building (guided tour, homepage journey): keep the
  // exterior for the few frames it takes to capture the view from its windows, then step inside.
  const [, setCaptured] = useState(0);
  const [gaveUp, setGaveUp] = useState(null);
  const viewKey = windowView?.key || null;
  const wantView = view === 'interior' && Boolean(props.interior) && Boolean(viewKey) && !getView(viewKey);
  useEffect(() => {
    if (!wantView) return undefined;
    const t = setTimeout(() => setGaveUp(viewKey), 1500);
    return () => clearTimeout(t);
  }, [wantView, viewKey]);
  const holdExterior = wantView && gaveUp !== viewKey;

  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      frameloop={active ? 'always' : 'never'} // paused while an embedded scene is scrolled out of view
      camera={{ fov: 35, near: 0.5, far: 9000, position: [-320, 260, 420] }}
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
        {view === 'interior' && props.interior && !holdExterior ? (
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
          <ExteriorScene {...props} onViewCaptured={() => setCaptured((n) => n + 1)} />
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
  towers,
  amenities,
  onTower,
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
  windowView,
  onViewCaptured,
  orbit = DEFAULT_ORBIT
}) {
  // Rebuild geometry only when the shape changes, not on every data refresh.
  const shapeKey = `${tower.id}|${tower.levels.length}|${tower.unitsPerFloor}|${tower.hasLobby}|${tower.levels.map((l) => l.units.length).join(',')}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dims = useMemo(() => towerDims(tower), [shapeKey]);
  const all = towers?.length ? towers : [tower];
  const devKey = all.map((t) => `${t.id}:${t.levels.length}:${t.unitsPerFloor}:${t.hasLobby}:${t.levels.map((l) => l.units.length).join(',')}`).join('|');
  // The development's site plan (illustrative): every tower in one site block.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dev = useMemo(() => layoutDevelopment(all.map((t) => ({ id: t.id, dims: towerDims(t) }))), [devKey]);
  const active = dev.towers.find((t) => t.id === tower.id) || dev.towers[0];
  const tallest = useMemo(() => Math.max(...dev.towers.map((t) => t.dims.height)), [dev]);
  const features = useMemo(() => siteFeatures(amenities), [amenities]);

  const pbr = usePbr(EXTERIOR_TEX);
  const mats = useMemo(() => createMaterials(pbr), [pbr]);
  useEffect(() => () => disposeMaterials(mats), [mats]);
  const siteMats = useMemo(
    () => ({
      lawn: createLawnMaterial(pbr.grass, { color: '#93a96c', scale: 2.6 }),
      plaza: createPlanarMaterial(pbr.paving, { color: '#e2dcd2', scale: 3.2, key: 'plaza' }),
      drive: createPlanarMaterial(pbr.pavement, { color: '#9d9890', scale: 2.2, key: 'drive' }),
      deck: createPlanarMaterial(pbr.laminate, { color: '#c49a72', scale: 2.4, key: 'deck', roughness: 0.8 }),
      wall: worldMapped(pbrMaterial(pbr.concrete, { color: '#d8d2c7', normalScale: 0.6 }), 2)
    }),
    [pbr]
  );
  useEffect(() => () => Object.values(siteMats).forEach((m) => m.dispose()), [siteMats]);
  const vegetation = useVegetationMaterials();

  // Reflections: captured once the world has settled around the active tower.
  const [probeToken, setProbeToken] = useState(0);
  const activeRef = useRef();
  const probeSize = quality.low ? 128 : 256;
  const towerEnv = useReflectionProbe({ position: [0, dims.height * 0.42, 0], size: probeSize, hide: [activeRef], token: probeToken });
  const waterEnv = useReflectionProbe({ position: [0, 2.2, dims.outerD / 2 + 26], size: quality.low ? 64 : 128, token: probeToken });
  useEffect(() => {
    if (!towerEnv) return;
    for (const m of [mats.glass, mats.lobbyGlass, mats.rail]) {
      m.envMap = towerEnv;
      m.needsUpdate = true;
    }
  }, [towerEnv, mats]);

  const offset = useMemo(() => [-active.x, 0, -active.z], [active]);
  const shadowExtent = quality.low ? 150 : 200;

  return (
    <>
      <SkyBackground intensity={1.08} />
      <SkyEnvironment intensity={1.15} />
      <fogExp2 attach="fog" args={[HORIZON, HAZE]} />
      <Lighting dims={dims} shadowMapSize={quality.shadowMapSize} extent={shadowExtent} intensity={3.4} />
      <WorldShift offset={offset} reducedMotion={reducedMotion} onSettled={() => setProbeToken((n) => n + 1)}>
        <City site={dev} quality={quality} pbr={pbr} towerH={tallest} vegetation={vegetation} />
        <ProjectSite dev={dev} mats={mats} siteMats={siteMats} vegetation={vegetation} features={features} waterEnv={waterEnv} />
        {dev.towers
          .filter((t) => t.id !== active.id)
          .map((t) => (
            <SiblingTower key={t.id} entry={t} mats={mats} name={all.find((x) => x.id === t.id)?.name || 'Tower'} onSelect={onTower} />
          ))}
        <group position={[active.x, 0, active.z]}>
          <TowerBase dims={dims} mats={mats} />
          <group ref={activeRef}>
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
          </group>
        </group>
      </WorldShift>
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
      <ViewCapture
        target={windowView ? { key: windowView.key, position: [windowView.x, levelBaseY(dims, windowView.index) + 1.6, windowView.z] } : null}
        hide={[activeRef]}
        size={quality.low ? 256 : 512}
        onCaptured={onViewCaptured}
      />
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
