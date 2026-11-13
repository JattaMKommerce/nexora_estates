import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Clone, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { clipWall, unitBounds, wallsForUnit } from '../plan/layout.js';
import { furnishUnit } from '../plan/furnish.js';
import { box, buildBalconies, buildWalls, disposeAll, merge, rectFloor } from '../plan/geometry.js';
import { usePbr } from '../three/textures.js';
import { HORIZON, SUN_DIR, SkyBackground, SkyEnvironment, useSkyLight } from '../three/Atmosphere.jsx';
import { ShadowManager, invalidateShadows } from '../three/shadows.js';
import { STYLE_TEX, createInteriorMaterials, styleById } from './styles.js';
import { FurnitureItem } from './Furniture.jsx';
import { buildCove, buildCurtains } from './dressing.js';
import { getView } from '../three/viewCapture.js';
import { useReflectionProbe } from '../three/Reflections.jsx';

export const CEIL = 2.85;
const noRaycast = () => null;
const FLOOR_GROUP = { living: 'living', passage: 'living', studio: 'living', bedroom: 'bedroom', master: 'bedroom', kitchen: 'wet', bath: 'wet', utility: 'wet', balcony: 'deck' };

/**
 * The apartment interior: the same plan as the floor view, built at full height with ceilings,
 * finishes from the chosen interior style, furniture, curtains, daylight through the glazing and
 * warm ceiling lights. `room` = null is the dollhouse overview; a room id switches to an eye-level
 * look-around from that room's viewpoint.
 *
 * Light: the sun (with shadows) and lamps are direct light; everything else comes from a light probe
 * captured inside the apartment, so rooms are brighter by the windows and walls pick up the colour
 * of the floor and furnishings. The windows look out on the view captured from the exterior model
 * at this residence's height (viewCapture.js), or on the sky if there is none.
 */
export default function InteriorScene({ plan, unitKey, views, styleId, room, onReady, reducedMotion, quality, onUserStart, zoomToken, viewKey = null }) {
  const pu = plan.units.find((u) => u.key === unitKey) || plan.units[0];
  const bounds = useMemo(() => unitBounds(pu), [pu]);
  const center = useMemo(() => ({ x: (bounds.x0 + bounds.x1) / 2, z: (bounds.z0 + bounds.z1) / 2 }), [bounds]);
  const supplied = pu.unit?.interior || null;
  const view = viewKey ? getView(viewKey) : null;
  const eyeLevel = room !== null && !supplied;

  // light probe: at the viewpoint in a room, else in the middle of the living room
  const [loaded, setLoaded] = useState(0);
  const ceilingRef = useRef();
  const viewpoint = room ? views.find((v) => v.id === room) : null;
  const living = pu.rooms.find((r) => r.type === 'living' || r.type === 'studio') || pu.rooms[0];
  const probePos = viewpoint
    ? [viewpoint.pos[0] - center.x, viewpoint.pos[1], viewpoint.pos[2] - center.z]
    : [(living.rect.x0 + living.rect.x1) / 2 - center.x, 1.5, (living.rect.z0 + living.rect.z1) / 2 - center.z];
  const skyLight = useSkyLight();
  const probe = useReflectionProbe({
    environment: skyLight,
    position: probePos,
    size: quality.low ? 64 : 128,
    show: [ceilingRef],
    token: `${styleId}|${loaded}|${room}`,
    near: 0.05,
    enabled: !supplied
  });

  useEffect(() => invalidateShadows(), [room, styleId]);

  return (
    <>
      {!eyeLevel ? <color attach="background" args={['#d4d6d7']} /> : view ? <primitive attach="background" object={view} /> : <SkyBackground />}
      {probe ? <Environment map={probe} environmentIntensity={1.0} /> : <SkyEnvironment intensity={0.7} />}
      <hemisphereLight args={['#f6f7f8', '#d3cbbf', probe ? 0.15 : 0.6]} />
      <fog attach="fog" args={[HORIZON, 140, 1200]} />
      <InteriorLights pu={pu} bounds={bounds} center={center} shadowMapSize={quality.low ? 1024 : 2048} />
      <group position={[-center.x, 0, -center.z]}>
        {supplied ? (
          <SuppliedInterior url={supplied} center={center} />
        ) : (
          <Apartment plan={plan} pu={pu} bounds={bounds} styleId={styleId} showCeiling={room !== null} ceilingRef={ceilingRef} onLoaded={() => setLoaded((n) => n + 1)} />
        )}
      </group>
      <InteriorCamera views={supplied ? [] : views} center={center} bounds={bounds} room={supplied ? null : room} reducedMotion={reducedMotion} onUserStart={onUserStart} zoomToken={zoomToken} />
      <ShadowManager />
      <ReadySignal onReady={onReady} />
    </>
  );
}

function Apartment({ plan, pu, bounds, styleId, showCeiling, ceilingRef, onLoaded }) {
  const pbr = usePbr(STYLE_TEX);
  const style = styleById(styleId);
  const m = useMemo(() => createInteriorMaterials(style, pbr), [style, pbr]);
  useEffect(() => () => m.dispose(), [m]);

  const geo = useMemo(() => {
    const pad = { x0: bounds.x0 - 0.25, z0: bounds.z0 - 0.25, x1: bounds.x1 + 0.25, z1: bounds.z1 + 0.25 };
    const walls = wallsForUnit(plan, pu)
      .map((w) => (w.unitKey === pu.key ? w : clipWall(w, pad)))
      .filter(Boolean);
    const floors = { living: [], bedroom: [], wet: [], deck: [] };
    const tile = { living: style.floor.living[2], bedroom: style.floor.bedroom[2], wet: style.floor.wet[2], deck: style.floor.deck[2] };
    const ceiling = [];
    const downlights = [];
    const wetWalls = [];
    const splash = [];
    for (const r of pu.rooms) {
      const g = FLOOR_GROUP[r.type] || 'living';
      floors[g].push(rectFloor(r.rect, 0.004, tile[g]));
      if (r.type === 'balcony') continue;
      ceiling.push(ceilingRect(r.rect, CEIL));
      const { x0, z0, x1, z1 } = r.rect;
      const w = x1 - x0;
      const d = z1 - z0;
      const nx = Math.max(1, Math.round(w / 2.2));
      const nz = Math.max(1, Math.round(d / 2.2));
      if (r.type !== 'passage' || w * d > 3) {
        for (let i = 0; i < nx; i += 1) {
          for (let j = 0; j < nz; j += 1) {
            const g2 = new THREE.CylinderGeometry(0.06, 0.06, 0.01, 20);
            g2.translate(x0 + (w * (i + 0.5)) / nx, CEIL - 0.006, z0 + (d * (j + 0.5)) / nz);
            downlights.push(g2);
          }
        }
      }
      if (r.type === 'bath') {
        const h = CEIL - 0.02;
        // tile three walls (the door wall stays painted)
        const doorSideZ = Math.abs(z0) > Math.abs(z1) ? z0 : z1; // the door opens onto the passage, away from the corridor
        // walls are drawn on their centre lines: the tiles sit on the faces, up to 0.12 m in
        const f0 = 0.05;
        const tt = 0.125 - f0;
        const sides = [
          [x0 + f0 + tt / 2, (z0 + z1) / 2, tt, d - 0.1],
          [x1 - f0 - tt / 2, (z0 + z1) / 2, tt, d - 0.1],
          [(x0 + x1) / 2, doorSideZ === z0 ? z1 - f0 - tt / 2 : z0 + f0 + tt / 2, w - 0.1, tt]
        ];
        for (const [x, z, sx, sz] of sides) wetWalls.push(box(sx, h, sz, x, h / 2, z, style.tiles[2]));
      }
      if (r.type === 'kitchen') {
        const corridorZ = Math.abs(z0) < Math.abs(z1) ? z0 : z1;
        const z = corridorZ === z0 ? z0 + 0.09 : z1 - 0.09;
        splash.push(box(w - 0.1, 0.6, 0.07, (x0 + x1) / 2, 1.22, z, style.tiles[2] * 0.6));
      }
    }
    return {
      walls: buildWalls(walls, { height: CEIL, cut: false, tile: 2 }),
      floors: Object.fromEntries(Object.entries(floors).map(([k, v]) => [k, merge(v)])),
      ceiling: merge(ceiling),
      downlights: merge(downlights),
      wetWalls: merge(wetWalls),
      splash: merge(splash),
      balconies: buildBalconies(pu.rooms, { y: 0.004 }),
      curtains: buildCurtains(walls, pu, CEIL),
      cove: buildCove(pu, CEIL),
      slab: box(bounds.x1 - bounds.x0 + 0.6, 0.3, bounds.z1 - bounds.z0 + 0.6, (bounds.x0 + bounds.x1) / 2, -0.15, (bounds.z0 + bounds.z1) / 2, 2)
    };
  }, [plan, pu, bounds, style]);
  useEffect(() => () => disposeAll(geo), [geo]);

  const items = useMemo(() => furnishUnit(pu).map((it) => (it.kind === 'pendant' ? { ...it, y: CEIL } : it)), [pu]);
  const slabMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#cfcac2', roughness: 0.9 }), []);
  useEffect(() => () => slabMat.dispose(), [slabMat]);

  return (
    <group>
      <mesh geometry={geo.slab} material={slabMat} receiveShadow raycast={noRaycast} />
      {geo.floors.living && <mesh geometry={geo.floors.living} material={m.floorLiving} receiveShadow raycast={noRaycast} />}
      {geo.floors.bedroom && <mesh geometry={geo.floors.bedroom} material={m.floorBedroom} receiveShadow raycast={noRaycast} />}
      {geo.floors.wet && <mesh geometry={geo.floors.wet} material={m.floorWet} receiveShadow raycast={noRaycast} />}
      {geo.floors.deck && <mesh geometry={geo.floors.deck} material={m.deck} receiveShadow raycast={noRaycast} />}
      {geo.walls.solid && <mesh geometry={geo.walls.solid} material={m.wall} castShadow receiveShadow raycast={noRaycast} />}
      {geo.walls.core && <mesh geometry={geo.walls.core} material={m.wall} castShadow receiveShadow raycast={noRaycast} />}
      {geo.walls.frame && <mesh geometry={geo.walls.frame} material={m.frame} castShadow receiveShadow raycast={noRaycast} />}
      {geo.walls.doors && <mesh geometry={geo.walls.doors} material={m.door} castShadow receiveShadow raycast={noRaycast} />}
      {geo.walls.doorFrame && <mesh geometry={geo.walls.doorFrame} material={m.door} castShadow receiveShadow raycast={noRaycast} />}
      {geo.walls.glass && <mesh geometry={geo.walls.glass} material={m.glass} raycast={noRaycast} renderOrder={3} />}
      {geo.wetWalls && <mesh geometry={geo.wetWalls} material={m.wetWall} receiveShadow raycast={noRaycast} />}
      {geo.splash && <mesh geometry={geo.splash} material={m.splash} receiveShadow raycast={noRaycast} />}
      {geo.curtains.drapes && <mesh geometry={geo.curtains.drapes} material={m.drape} castShadow receiveShadow raycast={noRaycast} />}
      {geo.curtains.sheers && <mesh geometry={geo.curtains.sheers} material={m.sheer} raycast={noRaycast} renderOrder={2} />}
      {geo.curtains.tracks && <mesh geometry={geo.curtains.tracks} material={m.track} raycast={noRaycast} />}
      {geo.cove.band && <mesh geometry={geo.cove.band} material={m.ceiling} visible={showCeiling} castShadow={showCeiling} receiveShadow raycast={noRaycast} />}
      {geo.cove.glow && showCeiling && <mesh geometry={geo.cove.glow} material={m.cove} raycast={noRaycast} />}
      {geo.balconies.slab && <mesh geometry={geo.balconies.slab} material={slabMat} castShadow receiveShadow raycast={noRaycast} />}
      {geo.balconies.glass && <mesh geometry={geo.balconies.glass} material={m.glass} raycast={noRaycast} renderOrder={3} />}
      {geo.balconies.rail && <mesh geometry={geo.balconies.rail} material={m.metal} raycast={noRaycast} />}
      {geo.ceiling && <mesh ref={ceilingRef} geometry={geo.ceiling} material={m.ceiling} visible={showCeiling} castShadow={showCeiling} receiveShadow raycast={noRaycast} />}
      {geo.downlights && showCeiling && <mesh geometry={geo.downlights} material={m.bulb} raycast={noRaycast} />}
      <Suspense fallback={null}>
        {items.map((it) => (
          <FurnitureItem key={it.id} item={it} m={m} />
        ))}
        <ShadowRefresh onLoaded={onLoaded} />
      </Suspense>
    </group>
  );
}

/** Re-renders the shadow map (and the light probe) once everything inside the same Suspense boundary has loaded. */
function ShadowRefresh({ onLoaded }) {
  useEffect(() => {
    invalidateShadows();
    onLoaded?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function ceilingRect(r, y) {
  const g = new THREE.PlaneGeometry(r.x1 - r.x0, r.z1 - r.z0);
  g.rotateX(Math.PI / 2);
  g.translate((r.x0 + r.x1) / 2, y, (r.z0 + r.z1) / 2);
  return g;
}

function SuppliedInterior({ url, center }) {
  const { scene } = useGLTF(url, false, true);
  return (
    <group position={[center.x, 0, center.z]}>
      <Clone object={scene} castShadow receiveShadow />
    </group>
  );
}

function InteriorLights({ pu, bounds, center, shadowMapSize }) {
  const sun = useRef();
  const target = useMemo(() => new THREE.Object3D(), []);
  const span = Math.max(bounds.x1 - bounds.x0, bounds.z1 - bounds.z0) / 2 + 4;
  useLayoutEffect(() => {
    const light = sun.current;
    if (!light) return;
    target.position.set(0, 0, 0);
    target.updateMatrixWorld();
    light.target = target;
    light.position.set(SUN_DIR.x * 40, SUN_DIR.y * 40, SUN_DIR.z * 40);
    const cam = light.shadow.camera;
    cam.left = -span;
    cam.right = span;
    cam.top = span;
    cam.bottom = -span;
    cam.near = 1;
    cam.far = 120;
    cam.updateProjectionMatrix();
    light.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    light.shadow.map?.dispose();
    light.shadow.map = null;
    invalidateShadows();
  }, [span, shadowMapSize, target]);

  const roomLights = useMemo(
    () =>
      pu.rooms
        .filter((r) => ['living', 'studio', 'bedroom', 'master', 'kitchen', 'bath'].includes(r.type))
        .map((r) => {
          const area = (r.rect.x1 - r.rect.x0) * (r.rect.z1 - r.rect.z0);
          return {
            id: r.id,
            pos: [(r.rect.x0 + r.rect.x1) / 2 - center.x, 1.95, (r.rect.z0 + r.rect.z1) / 2 - center.z],
            intensity: Math.min(2.1, 0.4 + area * 0.05)
          };
        }),
    [pu, center]
  );

  return (
    <>
      <primitive object={target} />
      <directionalLight ref={sun} color="#fff1dc" intensity={2.8} castShadow shadow-bias={-0.0004} shadow-normalBias={0.025} shadow-radius={3} />
      {roomLights.map((l) => (
        <pointLight key={l.id} position={l.pos} intensity={l.intensity} decay={2} color="#ffe9d2" />
      ))}
    </>
  );
}

/**
 * Overview: orbit the apartment like a dollhouse. Room: eye-level look-around (drag turns the
 * view, wheel / buttons change the field of view). GSAP flies between them.
 */
function InteriorCamera({ views, center, bounds, room, reducedMotion, onUserStart, zoomToken }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const tween = useRef(null);
  const mode = useRef('overview');
  const first = useRef(true);

  const radius = useMemo(() => {
    const span = Math.max(bounds.x1 - bounds.x0, bounds.z1 - bounds.z0);
    const aspect = size.width / Math.max(1, size.height);
    return Math.max(13, (span * 0.62) / Math.tan(THREE.MathUtils.degToRad(40) / 2) / Math.min(1.35, Math.max(0.42, aspect)));
  }, [bounds, size.width, size.height]);

  useLayoutEffect(() => {
    camera.near = 0.05;
    camera.far = 3000;
    camera.fov = 40;
    camera.updateProjectionMatrix();
    return () => {
      camera.near = 0.5;
      camera.far = 9000;
      camera.fov = 35;
      camera.updateProjectionMatrix();
    };
  }, [camera]);

  const configure = (m) => {
    if (!controls) return;
    if (m === 'overview') {
      controls.rotateSpeed = 0.6;
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.minDistance = 4;
      controls.maxDistance = radius * 2.2;
      controls.minPolarAngle = 0.12;
      controls.maxPolarAngle = 1.38;
    } else {
      controls.rotateSpeed = -0.32;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minDistance = 0.001;
      controls.maxDistance = 1;
      controls.minPolarAngle = 0.4;
      controls.maxPolarAngle = 2.5;
    }
  };

  useEffect(() => {
    if (!controls) return undefined;
    const view = room ? views.find((v) => v.id === room) : null;
    let to;
    if (view) {
      const pos = new THREE.Vector3(view.pos[0] - center.x, view.pos[1], view.pos[2] - center.z);
      const look = new THREE.Vector3(view.look[0] - center.x, view.look[1], view.look[2] - center.z);
      to = { pos, look, fov: 64, mode: 'room' };
    } else {
      const cur = new THREE.Vector3().subVectors(camera.position, controls.target);
      const theta = first.current || mode.current === 'room' ? 0.75 : Math.atan2(cur.x, cur.z);
      const phi = 0.82;
      const look = new THREE.Vector3(0, 0.6, 0);
      const pos = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta).add(look);
      to = { pos, look, fov: 40, mode: 'overview' };
    }
    tween.current?.kill();
    const done = () => {
      mode.current = to.mode;
      configure(to.mode);
      if (to.mode === 'room') {
        const dir = new THREE.Vector3().subVectors(to.look, to.pos).normalize();
        controls.target.copy(to.pos).addScaledVector(dir, 0.05);
      } else {
        controls.target.copy(to.look);
      }
      camera.position.copy(to.pos);
      camera.fov = to.fov;
      camera.updateProjectionMatrix();
      controls.enabled = true;
      controls.update();
    };
    if (first.current && !view) {
      // arrive from slightly further out for a gentle "settling" move
      const start = new THREE.Vector3().setFromSphericalCoords(radius * 1.45, 0.62, 0.15).add(to.look);
      camera.position.copy(start);
      controls.target.copy(to.look);
    }
    first.current = false;
    if (reducedMotion) {
      done();
      return undefined;
    }
    const p = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
      tx: controls.target.x,
      ty: controls.target.y,
      tz: controls.target.z,
      fov: camera.fov
    };
    // when leaving a room view the current target sits 5 cm ahead; push it out so the turn is smooth
    if (mode.current === 'room') {
      const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
      p.tx = camera.position.x + dir.x * 3;
      p.ty = camera.position.y + dir.y * 3;
      p.tz = camera.position.z + dir.z * 3;
    }
    controls.enabled = false;
    const apply = () => {
      camera.position.set(p.px, p.py, p.pz);
      controls.target.set(p.tx, p.ty, p.tz);
      camera.fov = p.fov;
      camera.updateProjectionMatrix();
      camera.lookAt(controls.target);
    };
    tween.current = gsap.to(p, {
      px: to.pos.x,
      py: to.pos.y,
      pz: to.pos.z,
      tx: to.look.x,
      ty: to.look.y,
      tz: to.look.z,
      fov: to.fov,
      duration: view && mode.current === 'room' ? 1.4 : 1.9,
      ease: 'power3.inOut',
      onUpdate: apply,
      onComplete: done
    });
    return () => tween.current?.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, room, views, radius]);

  // Field-of-view zoom in room mode (wheel) and from the on-screen buttons.
  useEffect(() => {
    const el = gl.domElement;
    const onWheel = (e) => {
      if (mode.current !== 'room') return;
      e.preventDefault();
      camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.03, 28, 80);
      camera.updateProjectionMatrix();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [gl, camera]);

  useEffect(() => {
    if (!zoomToken?.n) return;
    if (mode.current === 'room') {
      camera.fov = THREE.MathUtils.clamp(camera.fov + zoomToken.delta * 8, 28, 80);
      camera.updateProjectionMatrix();
    } else if (controls) {
      const off = new THREE.Vector3().subVectors(camera.position, controls.target);
      off.multiplyScalar(zoomToken.delta > 0 ? 1.18 : 0.85);
      const len = THREE.MathUtils.clamp(off.length(), controls.minDistance, controls.maxDistance);
      off.setLength(len);
      camera.position.copy(controls.target).add(off);
      controls.update();
    }
  }, [zoomToken, camera, controls]);

  useEffect(() => () => tween.current?.kill(), []);

  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      screenSpacePanning
      onStart={onUserStart}
    />
  );
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
