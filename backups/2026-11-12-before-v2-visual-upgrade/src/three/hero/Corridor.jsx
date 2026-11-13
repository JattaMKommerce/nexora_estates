import { useMemo } from 'react';
import { useTexture, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { quality } from '../../core/quality.js';

/**
 * The opening set: the residents' corridor of a finished building at dusk. Walnut panelling, deep
 * doors with brass plates, a warm light slot down the ceiling, a glowing skirting line reflected in
 * a polished stone floor, and the glass doors to the garden at the far end, where the camera steps
 * out into daylight.
 */
export const CORRIDOR = { origin: [6000, 0, 0], length: 70, width: 3.8, height: 3.3, end: -64 };
const HW = CORRIDOR.width / 2;
const H = CORRIDOR.height;
const BAY = 8.6;

const tex = (dir) => [`/assets/tex/${dir}/diff.jpg`, `/assets/tex/${dir}/nor.jpg`, `/assets/tex/${dir}/arm.jpg`];

function prep(set, rx, ry, srgbFirst = true) {
  set.forEach((t, i) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.anisotropy = 8;
    if (i === 0 && srgbFirst) t.colorSpace = THREE.SRGBColorSpace;
  });
  return set;
}

export default function Corridor() {
  const walnut = prep(useTexture(tex('black_walnut_veneer_01')), 22, 1.4);
  const marble = prep(useTexture(tex('marble_01')), 2, 36);
  const oak = prep(useTexture(tex('oak_veneer_01')), 1, 2);

  const m = useMemo(() => {
    const [wd, wn, wa] = walnut;
    const [od, on] = oak;
    return {
      wall: new THREE.MeshStandardMaterial({ map: wd, normalMap: wn, roughnessMap: wa, color: '#9b7a62', roughness: 0.75, normalScale: new THREE.Vector2(0.6, 0.6) }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.92 }),
      door: new THREE.MeshStandardMaterial({ map: od, normalMap: on, color: '#8a6a52', roughness: 0.4 }),
      frame: new THREE.MeshStandardMaterial({ color: '#2b2520', roughness: 0.35, metalness: 0.6 }),
      brass: new THREE.MeshStandardMaterial({ color: '#c9a36a', roughness: 0.28, metalness: 1 }),
      groove: new THREE.MeshStandardMaterial({ color: '#1a1512', roughness: 0.9 }),
      slot: new THREE.MeshStandardMaterial({ color: '#000', emissive: '#ffcf96', emissiveIntensity: 5.5, toneMapped: true }),
      cove: new THREE.MeshStandardMaterial({ color: '#000', emissive: '#ffbf80', emissiveIntensity: 2.2 }),
      skirt: new THREE.MeshStandardMaterial({ color: '#000', emissive: '#ffc58f', emissiveIntensity: 3.2 }),
      niche: new THREE.MeshStandardMaterial({ color: '#000', emissive: '#f2d2a6', emissiveIntensity: 1.3 }),
      daylight: new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff6e8').multiplyScalar(7), toneMapped: false }),
      mullion: new THREE.MeshStandardMaterial({ color: '#1d1a17', roughness: 0.4, metalness: 0.5 })
    };
  }, [walnut, oak]);

  const L = CORRIDOR.length;
  const zMid = (CORRIDOR.end + 6) / 2;

  const fixtures = useMemo(() => {
    const doors = [];
    const frames = [];
    const brass = [];
    const sconces = [];
    const grooves = [];
    const niches = [];
    for (let i = 0; i < 7; i++) {
      for (const side of [-1, 1]) {
        const z = -4 - i * BAY - (side > 0 ? BAY / 2 : 0);
        if (z < CORRIDOR.end + 4) continue;
        const x = side * (HW - 0.001);
        const inward = -side;
        // architrave and recessed door
        frames.push(new THREE.BoxGeometry(0.08, 2.72, 1.42).translate(x + inward * 0.03, 1.36, z));
        doors.push(new THREE.BoxGeometry(0.06, 2.5, 1.14).translate(x + inward * 0.06, 1.25, z));
        brass.push(new THREE.BoxGeometry(0.05, 0.34, 0.04).translate(x + inward * 0.11, 1.05, z + 0.42));
        brass.push(new THREE.BoxGeometry(0.02, 0.1, 0.16).translate(x + inward * 0.02, 1.62, z - 0.95));
        sconces.push(new THREE.BoxGeometry(0.03, 1.1, 0.05).translate(x + inward * 0.02, 1.55, z - 1.15));
      }
    }
    for (let z = 5; z > CORRIDOR.end; z -= 1.15)
      for (const side of [-1, 1]) grooves.push(new THREE.BoxGeometry(0.012, H, 0.018).translate(side * (HW - 0.004), H / 2, z));
    return {
      doors: mergeGeometries(doors),
      frames: mergeGeometries(frames),
      brass: mergeGeometries(brass),
      sconces: mergeGeometries(sconces),
      grooves: mergeGeometries(grooves),
      niches: niches.length ? mergeGeometries(niches) : null
    };
  }, []);

  const lights = useMemo(() => {
    const n = quality.corridorLights;
    return Array.from({ length: n }, (_, i) => -2 - (i * (Math.abs(CORRIDOR.end) - 6)) / Math.max(1, n - 1));
  }, []);

  return (
    <group position={CORRIDOR.origin}>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, zMid]}>
        <planeGeometry args={[CORRIDOR.width, L + 4]} />
        {quality.reflector ? (
          <MeshReflectorMaterial
            map={marble[0]}
            normalMap={marble[1]}
            color="#6a5f55"
            roughness={0.32}
            metalness={0.15}
            blur={[260, 70]}
            resolution={quality.reflectorRes}
            mixBlur={0.9}
            mixStrength={2.4}
            mirror={0.7}
            depthScale={0}
            minDepthThreshold={0.9}
            maxDepthThreshold={1}
          />
        ) : (
          <meshStandardMaterial map={marble[0]} color="#6a5f55" roughness={0.22} metalness={0.1} />
        )}
      </mesh>
      {/* ceiling with the light slot and coves */}
      <mesh rotation-x={Math.PI / 2} position={[0, H, zMid]} material={m.ceiling}>
        <planeGeometry args={[CORRIDOR.width, L + 4]} />
      </mesh>
      <mesh position={[0, H - 0.01, zMid]} rotation-x={Math.PI / 2} material={m.slot}>
        <planeGeometry args={[0.14, L + 2]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`cove${s}`} position={[s * (HW - 0.06), H - 0.06, zMid]} rotation-x={Math.PI / 2} material={m.cove}>
          <planeGeometry args={[0.1, L + 2]} />
        </mesh>
      ))}
      {/* walls */}
      {[-1, 1].map((s) => (
        <mesh key={`wall${s}`} position={[s * HW, H / 2, zMid]} rotation-y={-s * (Math.PI / 2)} material={m.wall}>
          <planeGeometry args={[L + 4, H]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`skirt${s}`} position={[s * (HW - 0.02), 0.06, zMid]} rotation-y={-s * (Math.PI / 2)} material={m.skirt}>
          <planeGeometry args={[L + 2, 0.035]} />
        </mesh>
      ))}
      <mesh geometry={fixtures.grooves} material={m.groove} />
      <mesh geometry={fixtures.frames} material={m.frame} />
      <mesh geometry={fixtures.doors} material={m.door} />
      <mesh geometry={fixtures.brass} material={m.brass} />
      <mesh geometry={fixtures.sconces} material={m.cove} />
      {fixtures.niches && <mesh geometry={fixtures.niches} material={m.niche} />}
      {/* the glass doors to the garden */}
      <mesh position={[0, H / 2, CORRIDOR.end]} material={m.daylight}>
        <planeGeometry args={[CORRIDOR.width, H]} />
      </mesh>
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x, H / 2, CORRIDOR.end + 0.05]} material={m.mullion}>
          <boxGeometry args={[0.07, H, 0.08]} />
        </mesh>
      ))}
      <mesh position={[0, 2.5, CORRIDOR.end + 0.05]} material={m.mullion}>
        <boxGeometry args={[CORRIDOR.width, 0.07, 0.08]} />
      </mesh>
      {/* the start of the corridor is closed behind the camera */}
      <mesh position={[0, H / 2, 7]} rotation-y={Math.PI} material={m.wall}>
        <planeGeometry args={[CORRIDOR.width, H]} />
      </mesh>
      {/* light */}
      <hemisphereLight args={['#ffd9b0', '#2a211a', 0.18]} />
      {lights.map((z, i) => (
        <pointLight key={i} position={[0, H - 0.45, z]} color="#ffc489" intensity={13} distance={12} decay={2} />
      ))}
      <pointLight position={[0, 2.2, CORRIDOR.end + 3]} color="#fff3e2" intensity={40} distance={18} decay={2} />
    </group>
  );
}
