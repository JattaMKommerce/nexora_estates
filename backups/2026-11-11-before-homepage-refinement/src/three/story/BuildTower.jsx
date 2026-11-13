import { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { CROWN_H, FLOOR_H, LOBBY_H, PLAZA_H, PLINTH_H, buildCrownGeometries, buildFloorGeometries, buildLobbyGeometries, disposeGeometries, levelBaseY } from '../towerGeometry.js';
import { PHASE, clamp01, fronts, smooth, sub } from '../../story/script.js';
import { buildCrane, buildFoundation, buildFrameModule, buildNet, latticeTexture, netTexture } from './construction.js';
import { worldMapped } from '../textures.js';

const noRay = () => null;
const M = new THREE.Matrix4();
const P = new THREE.Vector3();
const Q = new THREE.Quaternion();
const S1 = new THREE.Vector3(1, 1, 1);
const S = new THREE.Vector3();

/** A copy of a material that only draws above a horizontal plane (the top of what is already built). */
function clipped(material, plane) {
  const c = material.clone();
  c.onBeforeCompile = material.onBeforeCompile;
  c.customProgramCacheKey = material.customProgramCacheKey;
  c.clippingPlanes = [plane];
  c.clipShadows = true;
  return c;
}

/**
 * Materials for one tower under construction. The rising storey and the crown use clipped copies of
 * the finished materials, so each storey rises out of the top of the building below it rather than
 * passing through it.
 */
function createKit(mats) {
  const finish = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const frame = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const concrete = worldMapped(
    new THREE.MeshStandardMaterial({ color: '#d2cdc4', roughness: 0.9, map: mats.concrete.map, normalMap: mats.concrete.normalMap, roughnessMap: mats.concrete.roughnessMap }),
    3
  );
  const lattice = latticeTexture();
  const net = netTexture();
  const kit = {
    planes: { finish, frame },
    frame: concrete,
    frameClip: clipped(concrete, frame),
    cladding: clipped(mats.cladding, finish),
    glass: clipped(mats.glass, finish),
    metal: clipped(mats.metal, finish),
    rail: clipped(mats.rail, finish),
    crownFins: clipped(mats.crownFins, finish),
    crownLight: clipped(mats.crownLight, finish),
    net: new THREE.MeshStandardMaterial({ color: '#6f8b72', roughness: 1, transparent: true, opacity: 0.45, alphaMap: net, side: THREE.DoubleSide, depthWrite: false }),
    crane: new THREE.MeshStandardMaterial({ color: '#d7a51c', roughness: 0.55, metalness: 0.3, alphaMap: lattice, alphaTest: 0.5, side: THREE.DoubleSide }),
    craneSolid: new THREE.MeshStandardMaterial({ color: '#d7a51c', roughness: 0.5, metalness: 0.3 }),
    cab: new THREE.MeshStandardMaterial({ color: '#e7e5e0', roughness: 0.45 }),
    steel: new THREE.MeshStandardMaterial({ color: '#3b3d40', roughness: 0.5, metalness: 0.6 }),
    ballast: worldMapped(new THREE.MeshStandardMaterial({ color: '#a8a39b', roughness: 0.95, map: mats.concrete.map }), 2),
    textures: [lattice, net]
  };
  return kit;
}

function disposeKit(kit) {
  for (const v of Object.values(kit)) if (v?.isMaterial) v.dispose();
  kit.textures.forEach((t) => t.dispose());
}

const COMPLETE = 0.9995;

/**
 * One tower of the development being built, driven by `state.b` (0 = empty site, 1 = finished):
 * piles and raft, the podium rising out of the ground, then storey by storey the concrete frame
 * (columns, core, slab) rising with a crane and a safety screen at the top, the facade following a
 * few storeys behind, the crown, and finally the crane taken down. Drawn only while the build is
 * incomplete; the finished tower is the interactive one (see Experience.jsx).
 */
export function BuildTower({ dims, mats, state, maxFloors, envMap = null }) {
  const gl = useThree((s) => s.gl);
  const N = dims.floors;
  const geo = useMemo(() => {
    const f = buildFoundation(dims);
    return {
      floors: buildFloorGeometries(dims),
      crown: buildCrownGeometries(dims),
      lobby: dims.hasLobby ? buildLobbyGeometries(dims) : null,
      plinth: dims.hasLobby ? null : new THREE.BoxGeometry(dims.width + 0.6, PLINTH_H, dims.depth + 0.6).translate(0, PLINTH_H / 2, 0),
      frame: buildFrameModule(dims),
      net: buildNet(dims),
      pile: f.pile,
      raft: f.raft,
      spots: f.spots,
      crane: buildCrane(Math.max(dims.width, dims.depth) * 0.85 + 14)
    };
  }, [dims]);
  const spots = geo.spots;
  useEffect(() => () => disposeGeometries(geo), [geo]);
  const kit = useMemo(() => createKit(mats), [mats]);
  useEffect(() => () => disposeKit(kit), [kit]);

  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  // the clipped glass reflects what the finished glass reflects
  useEffect(() => {
    for (const m of [kit.glass, kit.rail]) {
      m.envMap = envMap;
      m.needsUpdate = true;
    }
  }, [kit, envMap]);

  // finished storeys: one instance per storey, ordered bottom-up, drawn as a prefix (count)
  const variants = useMemo(() => [0, 1].map((v) => Array.from({ length: N }, (_, i) => i).filter((i) => i % 2 === v)), [N]);
  const fin = useRef({});
  const frameInst = useRef();
  const piles = useRef();
  const raft = useRef();
  const base = useRef();
  const movingFrame = useRef();
  const movingFinish = useRef();
  const finishMeshes = useRef({});
  const crown = useRef();
  const net = useRef();
  const crane = useRef();
  const craneHead = useRef();
  const mast = useRef();
  const jib = useRef();
  const last = useRef({ b: -1 });
  const mastMax = Math.ceil((dims.height + 14) / 2) + 2;

  useLayoutEffect(() => {
    const set = (mesh, list) => {
      if (!mesh) return;
      list.forEach((i, k) => mesh.setMatrixAt(k, M.makeTranslation(0, levelBaseY(dims, i), 0)));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    };
    for (const v of [0, 1]) for (const key of ['concrete', 'metal', 'rail']) set(fin.current[`${key}${v}`], variants[v]);
    set(fin.current.glass, Array.from({ length: N }, (_, i) => i));
    if (frameInst.current) {
      // bounding volume for the whole height (instances are rewritten every frame)
      frameInst.current.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, dims.height / 2, 0), dims.height);
    }
    const ms = mast.current;
    if (ms) {
      for (let k = 0; k < mastMax; k += 1) ms.setMatrixAt(k, M.makeTranslation(0, k * 2, 0));
      ms.instanceMatrix.needsUpdate = true;
      ms.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, dims.height / 2, 0), dims.height);
    }
    if (piles.current) piles.current.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), Math.max(dims.width, dims.depth) + 8);
    last.current.b = -1;
  }, [dims, variants, N, mastMax]);

  useFrame(() => {
    const b = state.b;
    if (b >= COMPLETE || Math.abs(b - last.current.b) < 1e-5) return;
    last.current.b = b;
    const { S: Sg, F: Fg, Fraw } = fronts(b, maxFloors);
    const sF = Math.min(Sg, N);
    const fF = Math.min(Fg, N);
    const sDone = Math.floor(sF + 1e-6);
    const fDone = Math.floor(fF + 1e-6);

    // foundations: piles rise out of the ground in sequence, then the raft is poured over them
    const pf = sub(b, [0, 0.055]);
    const pour = smooth(sub(b, [0.05, PHASE.foundation[1]]));
    const pl = piles.current;
    if (pl) {
      pl.visible = b < PHASE.podium[0] + 0.02;
      if (pl.visible) {
        spots.forEach((s, k) => {
          const e = smooth(clamp01((pf * 1.5 - s.d) / 0.5));
          const top = -6.2 + (1.6 + 6.2) * e; // stands 1.6 m proud of the ground…
          P.set(s.x, top - (top - (PLAZA_H - 0.1)) * pour, s.z); // …until the raft covers it
          pl.setMatrixAt(k, M.compose(P, Q.identity(), S1));
        });
        pl.instanceMatrix.needsUpdate = true;
      }
    }
    if (raft.current) {
      raft.current.visible = b < 0.97 && pour > 0;
      raft.current.position.y = -1.4 * (1 - pour);
    }

    // podium: rises out of the ground
    if (base.current) {
      const e = smooth(sub(b, PHASE.podium));
      base.current.visible = e > 0;
      base.current.position.y = -(LOBBY_H + 0.6) * (1 - e);
    }

    // finished storeys (facade complete)
    for (const v of [0, 1]) {
      const n = variants[v].filter((i) => i < fDone).length;
      for (const key of ['concrete', 'metal', 'rail']) if (fin.current[`${key}${v}`]) fin.current[`${key}${v}`].count = n;
    }
    if (fin.current.glass) fin.current.glass.count = fDone;

    // bare frame: storeys built but not yet clad (the slab of the one below the facade front stays
    // until the next clad storey covers it); the top storey's slab stays under the crown until it's on
    const crownP = N < maxFloors ? clamp01(Fraw - N) : sub(b, PHASE.crown);
    const fr = frameInst.current;
    if (fr) {
      let k = 0;
      const top = crownP >= 1 ? N - 1 : N;
      for (let m = Math.max(0, fDone - 1); m < Math.min(sDone, top); m += 1) fr.setMatrixAt(k++, M.makeTranslation(0, levelBaseY(dims, m), 0));
      fr.count = k;
      fr.instanceMatrix.needsUpdate = true;
    }

    // the storey of frame now rising (clipped at the top of the frame)
    const mf = movingFrame.current;
    const fracS = sF - sDone;
    if (mf) {
      mf.visible = sDone < N && fracS > 1e-4;
      if (mf.visible) {
        const slot = levelBaseY(dims, sDone);
        mf.position.y = slot - FLOOR_H * (1 - smooth(fracS));
        kit.planes.frame.constant = -slot;
      }
    }

    // the storey of facade now rising (clipped at the top of the clad storeys)
    const mg = movingFinish.current;
    const fracF = fF - fDone;
    if (mg) {
      mg.visible = fDone < N && fracF > 1e-4;
      if (mg.visible) {
        const slot = levelBaseY(dims, fDone);
        mg.position.y = slot - FLOOR_H * (1 - smooth(fracF));
        kit.planes.finish.constant = -slot;
        const v = fDone % 2;
        const fm = finishMeshes.current;
        if (fm.concrete) fm.concrete.geometry = geo.floors.concrete[v];
        if (fm.metal) fm.metal.geometry = geo.floors.metal[v];
        if (fm.rail) fm.rail.geometry = geo.floors.rail[v];
      }
    }

    // crown: rises out of the top once the facade is complete
    const cr = crown.current;
    if (cr) {
      cr.visible = crownP > 1e-4;
      if (cr.visible) {
        cr.position.y = dims.top - CROWN_H * (1 - smooth(crownP));
        kit.planes.finish.constant = -dims.top;
      }
    }

    // safety screen around the top two storeys of the frame
    const frameTop = levelBaseY(dims, 0) + sF * FLOOR_H;
    const nt = net.current;
    if (nt) {
      nt.visible = b > PHASE.floors[0] && sF < N - 0.02 && sF > 0.6;
      const h = 2 * FLOOR_H + 0.9;
      nt.position.y = frameTop - h + 1.0;
      nt.scale.y = h;
    }

    // crane: rises with the podium and climbs with the frame; taken down at the end (jib first,
    // then the mast, section by section)
    const up = smooth(sub(b, [PHASE.podium[0], PHASE.podium[0] + 0.05]));
    const out = sub(b, PHASE.crane);
    const jibOut = smooth(clamp01(out / 0.45));
    const mastOut = smooth(clamp01((out - 0.45) / 0.55));
    const height = Math.max(24, frameTop + 10) * up * (1 - mastOut);
    if (crane.current) crane.current.visible = height > 2;
    if (mast.current) mast.current.count = Math.max(0, Math.min(mastMax, Math.ceil(height / 2)));
    if (craneHead.current) {
      craneHead.current.position.y = Math.ceil(height / 2) * 2;
      craneHead.current.visible = jibOut < 0.98;
    }
    if (jib.current) {
      jib.current.rotation.y = 0.9 + b * 2.6;
      jib.current.scale.x = Math.max(0.02, 1 - jibOut); // the jib comes in towards the mast
    }
  });

  const fm = finishMeshes.current;
  const crownGeo = geo.crown;
  const craneGeo = geo.crane;
  const W = dims.width;
  const D = dims.depth;
  return (
    <group>
      {/* foundations */}
      <instancedMesh ref={piles} args={[geo.pile, kit.frame, spots.length]} castShadow receiveShadow raycast={noRay} frustumCulled={false} />
      <mesh ref={raft} geometry={geo.raft} material={kit.frame} castShadow receiveShadow raycast={noRay} />

      {/* podium */}
      <group ref={base}>
        {geo.lobby ? (
          <group position={[0, PLAZA_H, 0]}>
            <mesh geometry={geo.lobby.glass} material={mats.lobbyGlass} receiveShadow raycast={noRay} />
            <mesh geometry={geo.lobby.frame} material={mats.graphite} castShadow raycast={noRay} />
            <mesh geometry={geo.lobby.slab} material={mats.cladding} castShadow receiveShadow raycast={noRay} />
            <mesh geometry={geo.lobby.columns} material={mats.bronze} castShadow raycast={noRay} />
            <mesh geometry={geo.lobby.lights} material={mats.warmLight} raycast={noRay} />
          </group>
        ) : (
          <mesh position={[0, PLAZA_H, 0]} geometry={geo.plinth} material={mats.cladding} castShadow receiveShadow raycast={noRay} />
        )}
      </group>

      {/* clad storeys */}
      {[0, 1].map((v) => (
        <Fragment key={v}>
          <instancedMesh ref={(m) => (fin.current[`concrete${v}`] = m)} args={[geo.floors.concrete[v], mats.cladding, variants[v].length]} castShadow receiveShadow raycast={noRay} />
          <instancedMesh ref={(m) => (fin.current[`metal${v}`] = m)} args={[geo.floors.metal[v], mats.metal, variants[v].length]} castShadow receiveShadow raycast={noRay} />
          <instancedMesh ref={(m) => (fin.current[`rail${v}`] = m)} args={[geo.floors.rail[v], mats.rail, variants[v].length]} raycast={noRay} />
        </Fragment>
      ))}
      <instancedMesh ref={(m) => (fin.current.glass = m)} args={[geo.floors.glass, mats.glass, N]} receiveShadow raycast={noRay} />

      {/* bare frame */}
      <instancedMesh ref={frameInst} args={[geo.frame, kit.frame, N]} castShadow receiveShadow raycast={noRay} frustumCulled={false} />
      <mesh ref={movingFrame} geometry={geo.frame} material={kit.frameClip} castShadow receiveShadow raycast={noRay} visible={false} />

      {/* the rising clad storey */}
      <group ref={movingFinish} visible={false}>
        <mesh ref={(m) => (fm.concrete = m)} geometry={geo.floors.concrete[0]} material={kit.cladding} castShadow receiveShadow raycast={noRay} />
        <mesh geometry={geo.floors.glass} material={kit.glass} receiveShadow raycast={noRay} />
        <mesh ref={(m) => (fm.metal = m)} geometry={geo.floors.metal[0]} material={kit.metal} castShadow raycast={noRay} />
        <mesh ref={(m) => (fm.rail = m)} geometry={geo.floors.rail[0]} material={kit.rail} raycast={noRay} />
      </group>

      {/* crown */}
      <group ref={crown} visible={false}>
        <mesh geometry={crownGeo.concrete} material={kit.cladding} castShadow receiveShadow raycast={noRay} />
        <mesh geometry={crownGeo.metal} material={kit.crownFins} castShadow receiveShadow raycast={noRay} />
        <mesh geometry={crownGeo.band} material={kit.crownLight} raycast={noRay} />
      </group>

      {/* safety screen */}
      <mesh ref={net} geometry={geo.net} material={kit.net} raycast={noRay} visible={false} renderOrder={2} />

      {/* tower crane, beside the back corner */}
      <group ref={crane} position={[-(W / 2 + 4.6), PLAZA_H, -(D / 2 + 4.2)]} visible={false}>
        <mesh geometry={craneGeo.pad} material={kit.ballast} receiveShadow castShadow raycast={noRay} />
        <instancedMesh ref={mast} args={[craneGeo.mast, kit.crane, mastMax]} castShadow raycast={noRay} frustumCulled={false} />
        <group ref={craneHead}>
          <group ref={jib}>
            <mesh geometry={craneGeo.lattice} material={kit.crane} castShadow raycast={noRay} />
            <mesh geometry={craneGeo.yellow} material={kit.craneSolid} castShadow raycast={noRay} />
            <mesh geometry={craneGeo.cab} material={kit.cab} castShadow raycast={noRay} />
            <mesh geometry={craneGeo.weights} material={kit.ballast} castShadow raycast={noRay} />
            <mesh geometry={craneGeo.steel} material={kit.steel} castShadow raycast={noRay} />
          </group>
        </group>
      </group>
    </group>
  );
}
