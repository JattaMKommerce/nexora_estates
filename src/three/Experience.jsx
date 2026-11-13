import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Bloom, BrightnessContrast, EffectComposer, HueSaturation, N8AO, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { levelBaseY, towerDims } from './towerGeometry.js';
import { EXTERIOR_TEX, createMaterials, disposeMaterials } from './materials.js';
import { HAZE, HORIZON, Lighting, SkyBackground, SkyEnvironment } from './Atmosphere.jsx';
import { Tower } from './Tower.jsx';
import { City, useVegetationMaterials } from './city/City.jsx';
import { layoutDevelopment } from './city/layout.js';
import { createLawnMaterial, createPlanarMaterial } from './city/materials.js';
import { BuildGate, ProjectSite, SiblingTower, TowerBase, WorldShift, amenityFocus, arrivalDrive, siteFeatures } from './Development.jsx';
import { BuildTower } from './story/BuildTower.jsx';
import { StoryDirector } from './story/StoryDirector.jsx';
import { FilmDirector } from './story/FilmDirector.jsx';
import { useReflectionProbe } from './Reflections.jsx';
import { ViewCapture, getView } from './viewCapture.js';
import { worldMapped, pbrMaterial } from './textures.js';
import { CameraRig, ViewOffset } from './CameraRig.jsx';
import { ShadowManager, invalidateShadows } from './shadows.js';
import { ShaderWarmup } from './warmup.js';
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
  const { quality, onContextLost, view, active = true, windowView, render = false, look = 'default' } = props;
  // render mode (Section A's frames): a fixed resolution, never adapted to the frame rate
  const [dpr, setDpr] = useState(() => (render ? quality.dpr[1] : Math.min(window.devicePixelRatio || 1, quality.dpr[1])));

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
      {!render && (
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setDpr((d) => Math.max(1, d - 0.4))}
          onIncline={() => setDpr((d) => Math.min(quality.dpr[1], d + 0.2))}
          onFallback={() => setDpr(1)}
        />
      )}
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
      {view !== 'tour' && quality.fx && <Effects interior={view === 'interior'} quality={quality} look={look} />}
    </Canvas>
  );
}

function Effects({ interior, quality, look }) {
  if (look === 'morning' && !interior) return <MorningEffects quality={quality} />;
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

/**
 * The soft-morning look of Section A's film: gentler contact shadows, a faint bloom on the sky and
 * glass, lifted shadows and lower contrast, slightly muted colour and a light vignette, like a
 * calm architectural photograph rather than a render.
 */
function MorningEffects({ quality }) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO aoRadius={3.2} distanceFalloff={1.4} intensity={1.6} aoSamples={quality.low ? 8 : 24} denoiseSamples={quality.low ? 4 : 12} halfRes={false} quality={quality.low ? 'performance' : 'high'} />
      <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.15} intensity={0.22} radius={0.7} />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <BrightnessContrast brightness={0.015} contrast={-0.07} />
      <HueSaturation saturation={-0.07} />
      <Vignette offset={0.32} darkness={0.32} />
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
  story = null,
  storyMode = false,
  onStoryEvent,
  look = 'default',
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
      // pale, compacted sand on the cleared site (not dark soil): calmer to look at
      earth: createPlanarMaterial(pbr.concrete, { color: '#e6d9c1', scale: 12, key: 'earth', roughness: 1 }),
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
  // the city and development never change, so captures are kept when the story rebuilds the scene
  const towerEnv = useReflectionProbe({ position: [0, dims.height * 0.42, 0], size: probeSize, hide: [activeRef], token: probeToken, cacheKey: `tower|${devKey}|${active.id}|${probeSize}` });
  const waterEnv = useReflectionProbe({ position: [0, 2.2, dims.outerD / 2 + 26], size: quality.low ? 64 : 128, token: probeToken, cacheKey: `water|${devKey}|${active.id}` });
  useEffect(() => {
    if (!towerEnv) return;
    for (const m of [mats.glass, mats.lobbyGlass, mats.rail]) {
      m.envMap = towerEnv;
      m.needsUpdate = true;
    }
  }, [towerEnv, mats]);

  const offset = useMemo(() => [-active.x, 0, -active.z], [active]);
  // Homepage story: the build progress shared by the director (writer) and the build (readers).
  const buildState = useMemo(() => ({ b: 1, growth: 1 }), []);
  const maxFloors = useMemo(() => Math.max(...dev.towers.map((t) => t.dims.floors)), [dev]);
  // where the story's amenities chapter looks, relative to the active tower
  const amenityPts = useMemo(() => {
    const f = amenityFocus(dev, features);
    return { feature: { x: f.feature.x - active.x, z: f.feature.z - active.z }, grounds: { x: f.grounds.x - active.x, z: f.grounds.z - active.z, r: f.grounds.r } };
  }, [dev, features, active]);
  // Section A's film: the site (to frame the empty plot) and the drop-off drive, relative to the active tower
  const filmSite = useMemo(() => {
    const d = arrivalDrive(dev, features);
    return { x: -active.x, z: -active.z, sx: dev.sx, sz: dev.sz, drive: { x0: d.x0 - active.x, x1: d.x1 - active.x, z: (d.z0 + d.z1) / 2 - active.z } };
  }, [dev, features, active]);
  const [warm, setWarm] = useState(false);
  const shadowExtent = quality.low ? 150 : 200;

  return (
    <>
      {look === 'morning' ? (
        // soft morning daylight: a paler sky, more light from it, a gentler, whiter sun with softer
        // shadow edges, and a little more haze
        <>
          <SkyBackground intensity={1.16} />
          <SkyEnvironment intensity={1.42} />
          <fogExp2 attach="fog" args={[MORNING_HAZE_COLOR, HAZE * 1.3]} />
          <Lighting dims={dims} shadowMapSize={quality.shadowMapSize} extent={shadowExtent} intensity={2.5} color="#fff6ea" fill={0.34} softness={4} />
        </>
      ) : (
        <>
          <SkyBackground intensity={1.08} />
          <SkyEnvironment intensity={1.15} />
          <fogExp2 attach="fog" args={[HORIZON, HAZE]} />
          <Lighting dims={dims} shadowMapSize={quality.shadowMapSize} extent={shadowExtent} intensity={3.4} />
        </>
      )}
      <WorldShift offset={offset} reducedMotion={reducedMotion} onSettled={() => setProbeToken((n) => n + 1)}>
        <City site={dev} quality={quality} pbr={pbr} towerH={tallest} vegetation={vegetation} />
        <ProjectSite dev={dev} mats={mats} siteMats={siteMats} vegetation={vegetation} features={features} waterEnv={waterEnv} growth={story ? buildState : null} />
        {dev.towers
          .filter((t) => t.id !== active.id)
          .map((t) => (
            <group key={t.id}>
              <BuildGate state={story ? buildState : null} show="complete">
                <SiblingTower entry={t} mats={mats} name={all.find((x) => x.id === t.id)?.name || 'Tower'} onSelect={storyMode ? null : onTower} />
              </BuildGate>
              {story && (
                <BuildGate state={buildState} show="building">
                  <group position={[t.x, 0, t.z]}>
                    <BuildTower dims={t.dims} mats={mats} state={buildState} maxFloors={maxFloors} envMap={towerEnv} />
                  </group>
                </BuildGate>
              )}
            </group>
          ))}
        <group position={[active.x, 0, active.z]}>
          <BuildGate state={story ? buildState : null} show="complete">
            <TowerBase dims={dims} mats={mats} />
          </BuildGate>
          <group ref={activeRef}>
            {story && (
              <BuildGate state={buildState} show="building">
                <BuildTower dims={dims} mats={mats} state={buildState} maxFloors={maxFloors} envMap={towerEnv} />
              </BuildGate>
            )}
            <BuildGate state={story ? buildState : null} show="complete">
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
            </BuildGate>
          </group>
        </group>
      </WorldShift>
      {story?.current?.film && <FilmDirector film={story} state={buildState} dims={dims} mats={mats} maxFloors={maxFloors} site={filmSite} />}
      {story && !story.current?.film && (
        <StoryDirector
          story={story}
          active={storyMode}
          state={buildState}
          dims={dims}
          dev={dev}
          entry={active}
          maxFloors={maxFloors}
          selectedIndex={selectedIndex}
          feature={amenityPts.feature}
          grounds={amenityPts.grounds}
          reducedMotion={reducedMotion}
          onEvent={onStoryEvent}
        />
      )}
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
        paused={storyMode}
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
      <ViewOffset x={inset.x} y={inset.y} reducedMotion={reducedMotion} disabled={storyMode} />
      <ViewCapture
        target={windowView ? { key: windowView.key, position: [windowView.x, levelBaseY(dims, windowView.index) + 1.6, windowView.z] } : null}
        hide={[activeRef]}
        size={quality.low ? 256 : 512}
        onCaptured={onViewCaptured}
      />
      <ShadowManager />
      <ShaderWarmup onDone={() => setWarm(true)} />
      {warm && <ReadySignal onReady={onReady} />}
    </>
  );
}

const DEFAULT_ORBIT = { zoom: true, pan: true, rotate: true, touchScroll: false };
const MORNING_HAZE_COLOR = '#c6ced6';

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
