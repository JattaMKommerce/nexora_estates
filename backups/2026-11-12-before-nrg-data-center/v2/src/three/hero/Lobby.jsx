import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useTexture, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { quality } from '../../core/quality.js';
import { foamTree } from '../world/Trees.jsx';

/**
 * The entrance: the residence's double-height arrival gallery on a bright afternoon. Travertine
 * floor, a light-oak slatted wall, floor-to-ceiling glazing to the garden with the sun throwing
 * the window frames across the floor, a skylight, white columns, a stone reception desk under
 * pendant lights, lounge chairs and plants, and glass doors to the garden at the end, where the
 * camera steps out and rises above the site.
 */
export const LOBBY = { origin: [6000, 0, 0], startZ: 4, end: -46, walkX: -0.9 };
const X0 = -6.5; // the oak wall
const X1 = 6.5; // the glazing
const H = 7.2;
const Z0 = 7; // back wall
const Z1 = LOBBY.end; // garden doors
const LEN = Z0 - Z1;
const ZMID = (Z0 + Z1) / 2;

const tex = (dir) => [`/assets/tex/${dir}/diff.jpg`, `/assets/tex/${dir}/nor.jpg`, `/assets/tex/${dir}/arm.jpg`];
const M = (f) => `/assets/models/${f}.glb`;

function prep(set, rx, ry) {
  set.forEach((t, i) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.anisotropy = 8;
    if (i === 0) t.colorSpace = THREE.SRGBColorSpace;
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
  t.anisotropy = 4;
  return t;
}

/** The garden seen through the glass: soft sky, distant hills, trees, a clipped hedge and a lawn. */
function gardenTexture(seed = 1) {
  return canvasTexture(1024, 512, (g, w, h) => {
    let a = seed * 9301 + 49297;
    const rnd = () => ((a = (a * 9301 + 49297) % 233280) / 233280);
    const sky = g.createLinearGradient(0, 0, 0, h * 0.62);
    sky.addColorStop(0, '#a9cbe3');
    sky.addColorStop(0.7, '#dbe9f0');
    sky.addColorStop(1, '#eef1e8');
    g.fillStyle = sky;
    g.fillRect(0, 0, w, h);
    g.filter = 'blur(3px)';
    g.fillStyle = '#b9cdb3';
    g.beginPath();
    g.moveTo(0, h * 0.58);
    for (let x = 0; x <= w; x += 32) g.lineTo(x, h * (0.52 + 0.05 * Math.sin(x * 0.006 + seed) + 0.02 * Math.sin(x * 0.021)));
    g.lineTo(w, h);
    g.lineTo(0, h);
    g.fill();
    const greens = ['#7fa35a', '#8daf62', '#6f9a52', '#9ab86c', '#86a95c'];
    for (let i = 0; i < 70; i++) {
      const x = rnd() * w;
      const y = h * (0.5 + rnd() * 0.12);
      const r = 18 + rnd() * 46;
      g.fillStyle = greens[Math.floor(rnd() * greens.length)];
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
    g.filter = 'blur(1.5px)';
    g.fillStyle = '#6e9450';
    g.fillRect(0, h * 0.66, w, h * 0.07);
    const lawn = g.createLinearGradient(0, h * 0.72, 0, h);
    lawn.addColorStop(0, '#a7c46e');
    lawn.addColorStop(1, '#93b660');
    g.fillStyle = lawn;
    g.fillRect(0, h * 0.72, w, h * 0.28);
    g.filter = 'none';
  });
}

/** Quiet abstract artwork in the residence's palette. */
function artTexture(seed) {
  const pal = [
    ['#efe8dc', '#93a98a', '#d9a27c', '#45606b', '#e7c98f'],
    ['#ece4d6', '#c98d6c', '#7f9cad', '#d6c08c', '#5d6f5b']
  ][seed % 2];
  return canvasTexture(512, 360, (g, w, h) => {
    let a = seed * 7919 + 17;
    const rnd = () => ((a = (a * 9301 + 49297) % 233280) / 233280);
    g.fillStyle = pal[0];
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 5; i++) {
      g.fillStyle = pal[1 + (i % 4)];
      g.globalAlpha = 0.9;
      g.beginPath();
      if (i % 2) g.arc(w * (0.2 + rnd() * 0.6), h * (0.25 + rnd() * 0.5), h * (0.14 + rnd() * 0.18), 0, Math.PI * 2);
      else g.ellipse(w * (0.2 + rnd() * 0.6), h * (0.3 + rnd() * 0.4), w * (0.12 + rnd() * 0.2), h * (0.06 + rnd() * 0.1), rnd() * 3, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    g.strokeStyle = pal[3];
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(w * 0.08, h * 0.7);
    g.bezierCurveTo(w * 0.35, h * 0.2, w * 0.65, h * 0.95, w * 0.92, h * 0.35);
    g.stroke();
  });
}

/** A furniture model from the asset library, with shadows. */
function Prop({ url, position, rotation = 0, scale = 1 }) {
  const { scene } = useGLTF(url, false, true);
  const obj = useMemo(() => {
    const o = scene.clone(true);
    o.traverse((m) => {
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    return o;
  }, [scene]);
  return <primitive object={obj} position={position} rotation-y={rotation} scale={scale} />;
}

Object.values({
  a: M('mid_century_lounge_chair'),
  b: M('coffee_table_round_01'),
  c: M('potted_plant_01'),
  d: M('potted_plant_02'),
  e: M('potted_plant_04'),
  f: M('modern_arm_chair_01'),
  g: M('modern_coffee_table_01'),
  h: M('modern_ceiling_lamp_01')
}).forEach((u) => useGLTF.preload(u, false, true));

export default function Lobby() {
  const marble = prep(useTexture(tex('marble_01')), 3, 12);
  const oak = prep(useTexture(tex('oak_veneer_01')), 1, 3);
  const plaster = prep(useTexture(tex('plastered_wall_04')), 6, 1);

  const m = useMemo(() => {
    const [od, on, oa] = oak;
    const [pd, pn] = plaster;
    return {
      wall: new THREE.MeshStandardMaterial({ map: pd, normalMap: pn, color: '#f1ebe0', roughness: 0.9, normalScale: new THREE.Vector2(0.3, 0.3) }),
      white: new THREE.MeshStandardMaterial({ color: '#f6f2ea', roughness: 0.85 }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#f4f0e8', roughness: 0.92 }),
      oak: new THREE.MeshStandardMaterial({ map: od, normalMap: on, roughnessMap: oa, color: '#f3ddbd', roughness: 0.6 }),
      bronze: new THREE.MeshStandardMaterial({ color: '#8f7458', roughness: 0.35, metalness: 0.7 }),
      stone: new THREE.MeshStandardMaterial({ map: marble[0], color: '#efe3cf', roughness: 0.4 }),
      rug: new THREE.MeshStandardMaterial({ color: '#d6cbb7', roughness: 1 }),
      rug2: new THREE.MeshStandardMaterial({ color: '#c5ccbb', roughness: 1 }),
      glass: new THREE.MeshStandardMaterial({
        color: '#e6f2f2',
        roughness: 0.04,
        metalness: 0,
        transparent: true,
        opacity: 0.1,
        depthWrite: false,
        envMapIntensity: 1.4
      }),
      sky: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(2.6), toneMapped: true }),
      garden: new THREE.MeshBasicMaterial({ map: gardenTexture(3), color: new THREE.Color(1, 1, 1).multiplyScalar(1.05) }),
      gardenEnd: new THREE.MeshBasicMaterial({ map: gardenTexture(7), color: new THREE.Color(1, 1, 1).multiplyScalar(1.55) }),
      lawn: new THREE.MeshStandardMaterial({ color: '#9fbd68', roughness: 1 }),
      terrace: new THREE.MeshStandardMaterial({ color: '#e4dccd', roughness: 0.8 }),
      hedge: new THREE.MeshStandardMaterial({ color: '#6f9650', roughness: 1 }),
      tree: new THREE.MeshStandardMaterial({ vertexColors: true, color: '#8fb466', roughness: 1 }),
      art: [0, 1].map((i) => new THREE.MeshStandardMaterial({ map: artTexture(i), roughness: 0.9 }))
    };
  }, [oak, plaster, marble]);

  const parts = useMemo(() => {
    const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);
    // oak slats along the left wall
    const slats = [];
    for (let z = Z0 - 0.3; z > Z1 + 0.3; z -= 0.17) slats.push(box(0.07, H - 0.2, 0.06, X0 + 0.09, (H - 0.2) / 2, z));
    // window frames (vertical every 3 m, a transom, a sill) and the end doors' frame
    const frames = [];
    for (let z = Z0; z >= Z1; z -= 3) frames.push(box(0.14, H, 0.09, X1, H / 2, z));
    frames.push(box(0.14, 0.1, LEN, X1, 3.4, ZMID), box(0.2, 0.12, LEN, X1, 0.06, ZMID), box(0.2, 0.25, LEN, X1, H - 0.12, ZMID));
    for (let x = X0; x <= X1; x += 2.6) frames.push(box(0.1, H, 0.14, x, H / 2, Z1));
    frames.push(box(X1 - X0, 0.1, 0.14, 0, 3.4, Z1));
    // ceiling beams across the gallery, and the skylight's reveal
    const beams = [];
    for (let z = Z0 - 2; z > Z1; z -= 4.5) beams.push(box(X1 - X0, 0.5, 0.35, 0, H - 0.25, z));
    // white columns along the glazing
    const cols = [];
    for (let z = Z0 - 4; z > Z1 + 2; z -= 6) cols.push(new THREE.CylinderGeometry(0.26, 0.26, H, 24).translate(X1 - 2.1, H / 2, z));
    // the reception desk: a stone block with an oak top
    const deskStone = box(1.1, 1.05, 4.6, X0 + 3.2, 0.525, -19);
    const deskTop = box(1.3, 0.06, 4.8, X0 + 3.2, 1.08, -19);
    // pendant cables
    const cables = [];
    for (const z of [-17.4, -19, -20.6]) cables.push(new THREE.CylinderGeometry(0.008, 0.008, H - 3.2, 4).translate(X0 + 3.2, 3.2 + (H - 3.2) / 2, z));
    // picture frames
    const artFrames = [box(0.06, 2.1, 3.1, X0 + 0.22, 2.75, -9.5), box(0.06, 2.1, 3.1, X0 + 0.22, 2.75, -31)];
    return {
      slats: mergeGeometries(slats),
      frames: mergeGeometries(frames),
      beams: mergeGeometries(beams),
      cols: mergeGeometries(cols),
      deskStone,
      deskTop: mergeGeometries([deskTop, ...artFrames]),
      cables: mergeGeometries(cables)
    };
  }, []);

  // the garden outside the glazing: a terrace, a lawn, a clipped hedge and a few trees
  const outside = useMemo(() => {
    const trees = [];
    const geo = foamTree(17, { blobs: 7, detail: 3 });
    const list = [
      [17, -4, 4.4],
      [22, -14, 5.2],
      [16.5, -24, 3.8],
      [24, -31, 5.6],
      [18, -40, 4.6],
      [22, -50, 5.0],
      [4, -64, 5.4],
      [-8, -68, 4.8],
      [13, -66, 4.4]
    ];
    const greens = ['#8db262', '#9cbb6a', '#7fa75a', '#a3c070'].map((c) => new THREE.Color(c));
    const mesh = new THREE.InstancedMesh(geo, m.tree, list.length);
    const o = new THREE.Object3D();
    list.forEach(([x, z, s], i) => {
      o.position.set(x, 0, z);
      o.scale.setScalar(s);
      o.rotation.y = i * 1.7;
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      mesh.setColorAt(i, greens[i % greens.length]);
      trees.push(o.matrix.clone());
    });
    mesh.castShadow = true;
    return mesh;
  }, [m.tree]);

  // the sun: from the garden side, low enough to throw the frames across the floor
  const sunTarget = useMemo(() => new THREE.Object3D(), []);
  const sun = useRef();
  useEffect(() => {
    const l = sun.current;
    sunTarget.position.set(0, 0, -20);
    l.target = sunTarget;
    const c = l.shadow.camera;
    c.left = -34;
    c.right = 34;
    c.top = 34;
    c.bottom = -34;
    c.near = 1;
    c.far = 90;
    c.updateProjectionMatrix();
    l.shadow.mapSize.set(2048, 2048);
    l.shadow.bias = -0.0004;
    l.shadow.normalBias = 0.04;
  }, [sunTarget]);

  return (
    <group position={LOBBY.origin}>
      {/* travertine floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, ZMID]} receiveShadow>
        <planeGeometry args={[X1 - X0, LEN]} />
        {quality.reflector ? (
          <MeshReflectorMaterial
            map={marble[0]}
            normalMap={marble[1]}
            color="#efe6d6"
            roughness={0.35}
            metalness={0}
            blur={[700, 260]}
            resolution={quality.reflectorRes}
            mixBlur={1.2}
            mixStrength={0.55}
            mirror={0.3}
            depthScale={0}
            minDepthThreshold={0.9}
            maxDepthThreshold={1}
          />
        ) : (
          <meshStandardMaterial map={marble[0]} color="#efe6d6" roughness={0.3} />
        )}
      </mesh>
      {/* rugs under the seating */}
      <mesh rotation-x={-Math.PI / 2} position={[2.6, 0.01, -11]} material={m.rug} receiveShadow>
        <planeGeometry args={[4.6, 5.4]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[2.6, 0.01, -29]} material={m.rug2} receiveShadow>
        <planeGeometry args={[4.4, 5]} />
      </mesh>
      {/* ceiling, beams and the long skylight */}
      <mesh rotation-x={Math.PI / 2} position={[0, H, ZMID]} material={m.ceiling}>
        <planeGeometry args={[X1 - X0, LEN]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position={[1.2, H - 0.02, ZMID]} material={m.sky}>
        <planeGeometry args={[2.4, LEN - 2]} />
      </mesh>
      <mesh geometry={parts.beams} material={m.white} castShadow receiveShadow />
      {/* walls */}
      <mesh position={[X0, H / 2, ZMID]} rotation-y={Math.PI / 2} material={m.wall} receiveShadow>
        <planeGeometry args={[LEN, H]} />
      </mesh>
      <mesh geometry={parts.slats} material={m.oak} castShadow receiveShadow />
      <mesh position={[0, H / 2, Z0]} rotation-y={Math.PI} material={m.wall}>
        <planeGeometry args={[X1 - X0, H]} />
      </mesh>
      {/* artworks on the oak wall */}
      <mesh position={[X0 + 0.26, 2.75, -9.5]} rotation-y={Math.PI / 2} material={m.art[0]}>
        <planeGeometry args={[3, 2]} />
      </mesh>
      <mesh position={[X0 + 0.26, 2.75, -31]} rotation-y={Math.PI / 2} material={m.art[1]}>
        <planeGeometry args={[3, 2]} />
      </mesh>
      {/* glazing, frames and columns */}
      <mesh geometry={parts.frames} material={m.bronze} castShadow />
      <mesh position={[X1, H / 2, ZMID]} rotation-y={-Math.PI / 2} material={m.glass}>
        <planeGeometry args={[LEN, H]} />
      </mesh>
      <mesh position={[0, H / 2, Z1]} material={m.glass}>
        <planeGeometry args={[X1 - X0, H]} />
      </mesh>
      <mesh geometry={parts.cols} material={m.white} castShadow receiveShadow />
      {/* reception */}
      <mesh geometry={parts.deskStone} material={m.stone} castShadow receiveShadow />
      <mesh geometry={parts.deskTop} material={m.oak} castShadow />
      <mesh geometry={parts.cables} material={m.bronze} />
      {[-17.4, -19, -20.6].map((z) => (
        <Prop key={z} url={M('modern_ceiling_lamp_01')} position={[X0 + 3.2, 3.0, z]} scale={1.3} />
      ))}
      {/* seating, tables and plants */}
      <Prop url={M('mid_century_lounge_chair')} position={[1.4, 0, -10]} rotation={Math.PI / 2 + 0.3} />
      <Prop url={M('mid_century_lounge_chair')} position={[3.9, 0, -12.2]} rotation={-Math.PI / 2 - 0.2} />
      <Prop url={M('coffee_table_round_01')} position={[2.6, 0, -11.1]} />
      <Prop url={M('potted_plant_01')} position={[4.9, 0, -8.2]} scale={1.5} />
      <Prop url={M('modern_arm_chair_01')} position={[1.5, 0, -28.2]} rotation={Math.PI / 2} />
      <Prop url={M('modern_arm_chair_01')} position={[3.8, 0, -29.8]} rotation={-Math.PI / 2} />
      <Prop url={M('modern_coffee_table_01')} position={[2.6, 0, -29]} rotation={Math.PI / 2} />
      <Prop url={M('potted_plant_04')} position={[4.9, 0, -25.5]} scale={1.6} />
      <Prop url={M('potted_plant_02')} position={[X0 + 1.1, 0, -40]} scale={1.5} />
      <Prop url={M('potted_plant_02')} position={[X1 - 1.4, 0, -42.5]} scale={1.5} />
      <Prop url={M('potted_plant_01')} position={[X0 + 1.2, 0, -14.5]} scale={1.3} />
      {/* outside: terrace, lawn, hedge, trees and the view */}
      <mesh rotation-x={-Math.PI / 2} position={[X1 + 4, -0.02, ZMID]} material={m.terrace} receiveShadow>
        <planeGeometry args={[8, LEN + 30]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[30, -0.04, ZMID - 10]} material={m.lawn} receiveShadow>
        <planeGeometry args={[40, LEN + 60]} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.03, Z1 - 16]} material={m.lawn} receiveShadow>
        <planeGeometry args={[60, 32]} />
      </mesh>
      <mesh position={[X1 + 8.5, 0.6, ZMID]} material={m.hedge} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, LEN + 10]} />
      </mesh>
      <primitive object={outside} />
      <mesh position={[38, 9, ZMID - 8]} rotation-y={-Math.PI / 2} material={m.garden}>
        <planeGeometry args={[120, 26]} />
      </mesh>
      <mesh position={[0, 11, Z1 - 34]} material={m.gardenEnd}>
        <planeGeometry args={[110, 30]} />
      </mesh>
      {/* light: soft sky fill, the sun through the glazing, daylight spilling in at the doors */}
      <hemisphereLight args={['#eaf2f8', '#d9c9ae', 1.05]} />
      <directionalLight ref={sun} position={[26, 17, -4]} intensity={3.1} color="#fff1da" castShadow />
      <primitive object={sunTarget} />
      <pointLight position={[0, 3.2, Z1 + 3]} color="#fff8ec" intensity={26} distance={26} decay={2} />
      <pointLight position={[X0 + 3.2, 2.6, -19]} color="#ffe9cf" intensity={6} distance={9} decay={2} />
    </group>
  );
}
