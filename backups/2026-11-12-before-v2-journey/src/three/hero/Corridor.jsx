import { useMemo } from 'react';
import { useTexture, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { quality } from '../../core/quality.js';

/**
 * The opening set: the residents' corridor of a finished building at dusk. Satin walnut walls,
 * oak doors in bronze frames, each door washed by its own downlight, framed art under picture
 * lights, a warm light slot down the ceiling, a glowing skirting line, a polished stone floor that
 * softly reflects it all, and the glass doors to a sunlit garden at the far end, where the camera
 * steps out into daylight.
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

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A soft round pool of light (floor). */
const poolTexture = () =>
  canvasTexture(128, 128, (g, w, h) => {
    const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    r.addColorStop(0, 'rgba(255,255,255,1)');
    r.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, w, h);
  });

/** The scallop a downlight throws on a wall: a bright point near the top fanning out downward. */
const scallopTexture = () =>
  canvasTexture(128, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      const t = y / h;
      const spread = 0.08 + Math.pow(t, 0.7) * 0.42;
      const fall = Math.pow(1 - t, 1.6) * (t < 0.04 ? t / 0.04 : 1);
      const grad = g.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(Math.max(0, 0.5 - spread), 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, `rgba(255,255,255,${fall.toFixed(3)})`);
      grad.addColorStop(Math.min(1, 0.5 + spread), 'rgba(255,255,255,0)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, y, w, 1);
    }
  });

/** Quiet abstract artworks in muted, harmonious colours. */
const ART = [
  ['#e9e1d2', '#5f8b8a', '#c98f5c', '#2f3b3f'],
  ['#efe6d6', '#b9643f', '#7d9478', '#e0b867'],
  ['#e6ddcc', '#2e4a5a', '#d2a46e', '#9cb3b0'],
  ['#ece3d3', '#8a6f9b', '#d9a35f', '#4f6b5b'],
  ['#e4dccb', '#cf8b6a', '#486a78', '#e3c98f']
];
const artTexture = (pal, seed) =>
  canvasTexture(256, 340, (g, w, h) => {
    let a = seed * 9301 + 49297;
    const rnd = () => ((a = (a * 9301 + 49297) % 233280) / 233280);
    g.fillStyle = pal[0];
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      g.fillStyle = pal[1 + (i % 3)];
      g.globalAlpha = 0.85;
      if (rnd() < 0.5) {
        g.beginPath();
        g.arc(w * (0.2 + rnd() * 0.6), h * (0.2 + rnd() * 0.6), w * (0.12 + rnd() * 0.22), 0, Math.PI * 2);
        g.fill();
      } else g.fillRect(w * rnd() * 0.6, h * rnd() * 0.7, w * (0.2 + rnd() * 0.4), h * (0.08 + rnd() * 0.3));
    }
    g.globalAlpha = 1;
    g.strokeStyle = pal[3];
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(w * 0.1, h * (0.3 + rnd() * 0.4));
    g.bezierCurveTo(w * 0.4, h * rnd(), w * 0.6, h * rnd(), w * 0.9, h * (0.3 + rnd() * 0.4));
    g.stroke();
  });

/** The view through the glass doors: sky, a band of garden trees, a lit terrace. */
const gardenTexture = () =>
  canvasTexture(256, 256, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#cfe2ef');
    sky.addColorStop(0.5, '#f6efe0');
    sky.addColorStop(0.62, '#e9e4cf');
    sky.addColorStop(1, '#f3ead9');
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(150,170,110,0.55)';
    for (let i = 0; i < 26; i++) {
      g.beginPath();
      g.arc((i / 25) * w + Math.sin(i * 7.1) * 8, h * 0.56 + Math.sin(i * 3.3) * 8, 14 + Math.abs(Math.sin(i * 1.7)) * 16, 0, Math.PI * 2);
      g.fill();
    }
  });

export default function Corridor() {
  const walnut = prep(useTexture(tex('black_walnut_veneer_01')), 22, 1.4);
  const marble = prep(useTexture(tex('marble_01')), 2, 36);
  const oak = prep(useTexture(tex('oak_veneer_01')), 1, 2);

  const m = useMemo(() => {
    const [wd, wn, wa] = walnut;
    const [od, on] = oak;
    const glow = (color, opacity) =>
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: true });
    return {
      wall: new THREE.MeshStandardMaterial({ map: wd, normalMap: wn, roughnessMap: wa, color: '#b48c6d', roughness: 0.62, normalScale: new THREE.Vector2(0.5, 0.5) }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#4a4037', roughness: 0.9 }),
      door: new THREE.MeshStandardMaterial({ map: od, normalMap: on, color: '#a47f60', roughness: 0.36 }),
      frame: new THREE.MeshStandardMaterial({ color: '#6e5842', roughness: 0.3, metalness: 0.75 }),
      brass: new THREE.MeshStandardMaterial({ color: '#d2ac72', roughness: 0.25, metalness: 1 }),
      groove: new THREE.MeshStandardMaterial({ color: '#2a211b', roughness: 0.9 }),
      slot: new THREE.MeshStandardMaterial({ color: '#000', emissive: '#ffd8aa', emissiveIntensity: 3.4 }),
      cove: new THREE.MeshStandardMaterial({ color: '#000', emissive: '#ffc48a', emissiveIntensity: 1.7 }),
      skirt: new THREE.MeshStandardMaterial({ color: '#000', emissive: '#ffc995', emissiveIntensity: 2.6 }),
      downlight: new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff1dc').multiplyScalar(4), toneMapped: false }),
      pool: (() => {
        const p = glow('#ffcf9c', 0.42);
        p.map = poolTexture();
        return p;
      })(),
      scallop: (() => {
        const p = glow('#ffd2a0', 0.55);
        p.map = scallopTexture();
        return p;
      })(),
      daylight: new THREE.MeshBasicMaterial({ map: gardenTexture(), color: new THREE.Color(1, 1, 1).multiplyScalar(4.2), toneMapped: false }),
      mullion: new THREE.MeshStandardMaterial({ color: '#2a2520', roughness: 0.4, metalness: 0.5 }),
      art: ART.map((pal, i) => new THREE.MeshStandardMaterial({ map: artTexture(pal, i + 3), roughness: 0.85 }))
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
    const pools = [];
    const scallops = [];
    const downs = [];
    const arts = [];
    const artFrames = [];
    const artLights = [];
    let artIndex = 0;
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
        // the downlight in front of the door, its scallop on the wall and its pool on the floor
        downs.push(new THREE.CircleGeometry(0.07, 16).rotateX(Math.PI / 2).translate(side * (HW - 0.38), H - 0.005, z));
        scallops.push(new THREE.PlaneGeometry(1.7, 2.9).rotateY(-side * (Math.PI / 2)).translate(x + inward * 0.1, H - 1.5, z));
        pools.push(new THREE.PlaneGeometry(2.2, 2.4).rotateX(-Math.PI / 2).translate(side * (HW - 0.95), 0.012, z));
        // framed art between this door and the next one on the same wall
        const za = z - BAY / 2;
        if (za > CORRIDOR.end + 6 && (i + (side > 0 ? 1 : 0)) % 2 === 0) {
          arts.push({
            geo: new THREE.PlaneGeometry(0.9, 1.2).rotateY(-side * (Math.PI / 2)).translate(x + inward * 0.035, 1.6, za),
            mat: artIndex++ % ART.length
          });
          artFrames.push(new THREE.BoxGeometry(0.04, 1.32, 1.02).translate(x + inward * 0.012, 1.6, za));
          artLights.push(new THREE.BoxGeometry(0.1, 0.05, 0.7).translate(x + inward * 0.12, 2.34, za));
          scallops.push(new THREE.PlaneGeometry(1.2, 1.9).rotateY(-side * (Math.PI / 2)).translate(x + inward * 0.04, 1.62, za));
        }
      }
    }
    for (let z = 5; z > CORRIDOR.end; z -= 1.15)
      for (const side of [-1, 1]) grooves.push(new THREE.BoxGeometry(0.012, H, 0.018).translate(side * (HW - 0.004), H / 2, z));
    return {
      doors: mergeGeometries(doors),
      frames: mergeGeometries([...frames, ...artFrames]),
      brass: mergeGeometries([...brass, ...artLights]),
      sconces: mergeGeometries(sconces),
      grooves: mergeGeometries(grooves),
      pools: mergeGeometries(pools),
      scallops: mergeGeometries(scallops),
      downs: mergeGeometries(downs),
      arts
    };
  }, []);

  const lights = useMemo(() => {
    const n = quality.corridorLights;
    return Array.from({ length: n }, (_, i) => -2 - (i * (Math.abs(CORRIDOR.end) - 6)) / Math.max(1, n - 1));
  }, []);

  return (
    <group position={CORRIDOR.origin}>
      {/* polished stone floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, zMid]}>
        <planeGeometry args={[CORRIDOR.width, L + 4]} />
        {quality.reflector ? (
          <MeshReflectorMaterial
            map={marble[0]}
            normalMap={marble[1]}
            color="#c2b3a1"
            roughness={0.24}
            metalness={0.1}
            blur={[520, 160]}
            resolution={quality.reflectorRes}
            mixBlur={1.1}
            mixStrength={1.45}
            mirror={0.55}
            depthScale={0}
            minDepthThreshold={0.9}
            maxDepthThreshold={1}
          />
        ) : (
          <meshStandardMaterial map={marble[0]} color="#c2b3a1" roughness={0.2} metalness={0.1} />
        )}
      </mesh>
      <mesh geometry={fixtures.pools} material={m.pool} renderOrder={2} />
      {/* ceiling with the light slot, coves and downlights */}
      <mesh rotation-x={Math.PI / 2} position={[0, H, zMid]} material={m.ceiling}>
        <planeGeometry args={[CORRIDOR.width, L + 4]} />
      </mesh>
      <mesh position={[0, H - 0.01, zMid]} rotation-x={Math.PI / 2} material={m.slot}>
        <planeGeometry args={[0.12, L + 2]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`cove${s}`} position={[s * (HW - 0.06), H - 0.06, zMid]} rotation-x={Math.PI / 2} material={m.cove}>
          <planeGeometry args={[0.1, L + 2]} />
        </mesh>
      ))}
      <mesh geometry={fixtures.downs} material={m.downlight} />
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
      {fixtures.arts.map((a, i) => (
        <mesh key={`art${i}`} geometry={a.geo} material={m.art[a.mat]} />
      ))}
      <mesh geometry={fixtures.scallops} material={m.scallop} renderOrder={2} />
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
      <hemisphereLight args={['#ffdcb5', '#3a2c22', 0.28]} />
      {lights.map((z, i) => (
        <pointLight key={i} position={[0, H - 0.45, z]} color="#ffc68e" intensity={13} distance={12} decay={2} />
      ))}
      <pointLight position={[0, 2.2, CORRIDOR.end + 3]} color="#fff3e2" intensity={46} distance={20} decay={2} />
    </group>
  );
}
