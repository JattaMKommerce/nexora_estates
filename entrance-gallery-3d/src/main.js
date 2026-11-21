import * as THREE from 'three';
import { mount as mountPalace } from './nomadiic-rt.js';

// ============================================================================
// 1. CURATED FINE ART PAINTINGS DATA (INCLUDING FEATURED ACROPOLIS MUSE)
// ============================================================================
const RAW_METADATA = [
  // Station 0: Featured Acropolis Classical Muse (from user request)
  {
    id: 'sb_01',
    title: 'Acropolis Classical Muse',
    artist: 'Classical Heritage',
    category: 'Acropolis & Parthenon Series',
    image: '/paintings/greek_acropolis.jpg',
    ratio: 1.0,
    desc: 'Portrait of the classical muse standing before the Parthenon and ancient temple ruins. Rendered in natural Mediterranean sunlight with historical stone architecture.',
    specs: [
      { label: 'Medium', value: 'Classical Realism' },
      { label: 'Location', value: 'Acropolis, Athens' },
      { label: 'Series', value: 'Parthenon & Temple Sanctuary' },
      { label: 'Aspect Ratio', value: 'Square (1:1)' }
    ],
    ctaUrl: 'http://localhost:5174/'
  },

  // Collection 1: From Lagos, with love (Stations 1-7)
  { id: 'sb_02', title: 'Check up on it', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 1.38 },
  { id: 'sb_03', title: 'Crank Dat', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 1.40 },
  { id: 'sb_04', title: 'Do you remember the time?', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 1.39 },
  { id: 'sb_05', title: 'Heyah!', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 1.38 },
  { id: 'sb_06', title: 'I’ve got 5 passports i’m never going to jail', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 1.38 },
  { id: 'sb_07', title: 'Intl’ Playas Anthem', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 1.39 },
  { id: 'sb_08', title: 'O', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 1.37 },

  { id: 'sb_09', title: '‏  (كورة)', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 0.72 },
  { id: 'sb_10', title: 'Al-Maghrib', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 0.73 },
  { id: 'sb_11', title: 'bɔɔlbɔ', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 0.73 },
  { id: 'sb_12', title: 'Burkina Faso', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 0.73 },
  { id: 'sb_13', title: 'Cabo Verde', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 0.73 },
  { id: 'sb_14', title: 'Cameroun', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 0.73 },
  { id: 'sb_15', title: 'Côte d’Ivoire', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 0.72 },
  { id: 'sb_16', title: 'Dzayer', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 0.73 },

  // Collection 2: BLCK & Bourgie (Stations 8-15)
  { id: 'sb_17', title: 'Ojude Oba', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 0.73 },
  { id: 'sb_18', title: 'Abiamo Ode Orun', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 0.56 },
  { id: 'sb_19', title: 'Bam', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 1.38 },
  { id: 'sb_20', title: 'Blood of Jesus', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 1.38 },
  { id: 'sb_21', title: 'Fire Drill', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 1.38 },
  { id: 'sb_22', title: 'Friday Night', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 0.73 },
  { id: 'sb_23', title: 'Go Slow', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 0.75 },
  { id: 'sb_24', title: 'Isale Eko', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 0.60 },

  { id: 'sb_25', title: 'Friday in the City', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 0.73 },
  { id: 'sb_26', title: 'Rye Lane', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 1.38 },
  { id: 'sb_27', title: 'Boy n da Hood', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 0.73 },
  { id: 'sb_28', title: 'Odyssey', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 1.38 },
  { id: 'sb_29', title: 'Sunday Freestyle', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 0.73 },
  { id: 'sb_30', title: 'Let it all Work out', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 1.38 },
  { id: 'sb_31', title: 'Match week 1', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 1.38 },
  { id: 'sb_32', title: 'Rye Lane High', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', ratio: 1.37 },

  // Collection 3: DNCE & Carnaval (Stations 16-23)
  { id: 'sb_33', title: 'The Gardner', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.72 },
  { id: 'sb_34', title: 'These Streets Are our Own', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 1.38 },
  { id: 'sb_35', title: 'Dap of Champions', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_36', title: 'Suffering from success', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_37', title: 'Case 022', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_38', title: 'Case 023', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_39', title: 'Case 024', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_40', title: 'Case 025', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },

  { id: 'sb_41', title: 'Case 027', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_42', title: 'Case 028', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_43', title: 'Case 001', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_44', title: 'Case 002', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_45', title: 'BSHP', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_46', title: 'Catty', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_47', title: 'Day Walker', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },
  { id: 'sb_48', title: 'Electric', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', ratio: 0.73 },

  // Collection 4: Adumadan & Heritage (Stations 24-31)
  { id: 'sb_49', title: 'Invincible', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },
  { id: 'sb_50', title: 'Lightening', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },
  { id: 'sb_51', title: 'pUNk', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },
  { id: 'sb_52', title: 'Samurai', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },
  { id: 'sb_53', title: 'Carnaval Parade', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },
  { id: 'sb_54', title: 'Dutty Wyne', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.72 },
  { id: 'sb_55', title: 'Faaji', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },
  { id: 'sb_56', title: 'Life of the Party', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },

  { id: 'sb_57', title: 'Nottin’ Hill', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.72 },
  { id: 'sb_58', title: 'Princesa', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.72 },
  { id: 'sb_59', title: 'Riddim', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 1.38 },
  { id: 'sb_60', title: 'Last Night Dance', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.72 },
  { id: 'sb_61', title: 'Mumsy', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.72 },
  { id: 'sb_62', title: 'Abiamo', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },
  { id: 'sb_63', title: 'Iya', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 },
  { id: 'sb_64', title: 'Iya ‘Beji', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', ratio: 0.73 }
];

export const COLLECTIONS_INFO = [
  { id: 'acropolis-parthenon', title: 'Acropolis & Classical Heritage', desc: 'Ancient stone temple architecture and Mediterranean light.' },
  { id: 'lagos-love', title: 'From Lagos, with love', desc: 'Solar hues, coastal twilight, and music television nostalgia by Mayowa Alabi.' },
  { id: 'blck-bourgie', title: 'BLCK & Bourgie', desc: 'Regal figurative portraits, gold leaf accents, and quiet cultural elegance.' },
  { id: 'dnce-carnaval', title: 'DNCE & Carnaval', desc: 'Celebratory carnival parades, kinetic rhythm, and nocturnal masquerades.' },
  { id: 'adumadan-heritage', title: 'Adumadan & Heritage', desc: 'Sculptural West African mineral pigments and modern ancestral portraits.' }
];

export const ALL_ITEMS = RAW_METADATA.map((raw, idx) => {
  const image = raw.image || `/paintings/sb_${String(idx + 1).padStart(2, '0')}.webp`;
  return {
    ...raw,
    image,
    desc: raw.desc || `${raw.title} — original fine art painting from the ${raw.category} collection by ${raw.artist}. Rendered with museum-grade color pigments, deep tactile textures, and architectural framing.`,
    specs: raw.specs || [
      { label: 'Medium', value: 'Original Fine Art Digital Painting' },
      { label: 'Artist', value: raw.artist },
      { label: 'Series', value: raw.category },
      { label: 'Aspect Ratio', value: raw.ratio > 1 ? 'Landscape (16:10)' : 'Portrait (3:4)' }
    ],
    ctaUrl: 'http://localhost:5174/'
  };
});

const NUM_STATIONS = 32;
const ANGLE_STEP = (Math.PI * 2) / NUM_STATIONS;
const OUTER_RADIUS = 11.97;
const INNER_RADIUS = 7.43;
const ROTUNDA_TRACK_R = 9.7;

const STATIONS = [];
for (let i = 0; i < NUM_STATIONS; i++) {
  const colIdx = Math.floor(i / 8);
  STATIONS.push({
    stationIdx: i,
    collectionIdx: colIdx,
    collection: COLLECTIONS_INFO[colIdx] || COLLECTIONS_INFO[0],
    outerItem: ALL_ITEMS[i],
    innerItem: ALL_ITEMS[i + 32]
  });
}

// ============================================================================
// 2. DOM ELEMENT REFERENCES
// ============================================================================
const palaceContainer = document.getElementById('palace-container');
const canvasContainer = document.getElementById('canvas-container');
const navSubTitle = document.getElementById('nav-sub-title');

// Rotunda UI References
const cursorTip = document.getElementById('cursor-tip');
const cursorTipPill = document.getElementById('cursor-tip-pill');
const roomCaption = document.getElementById('room-caption');
const roomTitle = document.getElementById('room-title');
const roomMore = document.getElementById('room-more');
const walkHint = document.getElementById('walk-hint');
const hintLine1 = document.getElementById('hint-line-1');
const hintLine2 = document.getElementById('hint-line-2');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const viewToggle = document.getElementById('view-toggle');
const viewGalleryBtn = document.getElementById('view-gallery-btn');
const viewListBtn = document.getElementById('view-list-btn');
const roomNav = document.getElementById('room-nav');
const listView = document.getElementById('list-view');
const listViewGrid = document.getElementById('list-view-grid');
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerClose = document.getElementById('drawer-close');
const drawerContent = document.getElementById('drawer-content');

// ============================================================================
// 3. MOUNT PALACE SCENE (NOMADIIC HORSE - STARTING AT POOL)
// ============================================================================
let palaceInstance = null;
const Fs = 0.12946; // Exact waypoint at Reflecting Pool (Screenshot 1)
const PALACE_DOOR_PROGRESS = 0.612; // Progress inside showroom at doorway (Screenshot 3)

function initPalace() {
  if (!palaceContainer) return;
  palaceInstance = mountPalace(palaceContainer, {
    exposure: 1.15,
    intro: 'storm',
    base: 'https://aniketh-ani.github.io/nomadiic-cdn/palace/assets/'
  });
  window.__palace = palaceInstance;
}
initPalace();

// ============================================================================
// 4. CURVED ROTUNDA GALLERY SCENE (SHUTABUG - 60-120 FPS PURE BASIC MATERIAL)
// ============================================================================
const rotundaScene = new THREE.Scene();
const BG_COLOR = 0x11151f;
rotundaScene.background = new THREE.Color(BG_COLOR);
rotundaScene.fog = new THREE.Fog(BG_COLOR, 8, 26);

const rotundaCamera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 60);

const rotundaRenderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
rotundaRenderer.setSize(window.innerWidth, window.innerHeight);
rotundaRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
rotundaRenderer.toneMapping = THREE.ACESFilmicToneMapping;
rotundaRenderer.toneMappingExposure = 1.05;
rotundaRenderer.outputColorSpace = THREE.SRGBColorSpace;
canvasContainer.appendChild(rotundaRenderer.domElement);

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';

// Architectural Surfaces
const floorMat = new THREE.MeshBasicMaterial({ color: 0x222327 });
const floorMesh = new THREE.Mesh(new THREE.RingGeometry(7.2, 12.2, 120), floorMat);
floorMesh.rotation.x = -Math.PI / 2;
rotundaScene.add(floorMesh);

const outerWallMat = new THREE.MeshBasicMaterial({ color: 0xeae8e2, side: THREE.BackSide });
const outerWall = new THREE.Mesh(new THREE.CylinderGeometry(12.0, 12.0, 3.6, 120, 1, true), outerWallMat);
outerWall.position.set(0, 1.8, 0);
rotundaScene.add(outerWall);

const innerWallMat = new THREE.MeshBasicMaterial({ color: 0xdfdcd5, side: THREE.FrontSide, transparent: true, opacity: 1.0 });
const innerWall = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 7.4, 3.6, 96, 1, true), innerWallMat);
innerWall.position.set(0, 1.8, 0);
rotundaScene.add(innerWall);

// Radial Glow Textures for Museum Atmosphere (0 GPU Light Overhead)
function createGlowTexture(colorStart, colorMid, colorEnd) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, colorStart);
  grad.addColorStop(0.38, colorMid);
  grad.addColorStop(1, colorEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const poolGlowTex = createGlowTexture('rgba(255, 235, 195, 0.42)', 'rgba(255, 220, 160, 0.18)', 'rgba(255, 210, 140, 0)');
const poolMat = new THREE.MeshBasicMaterial({
  color: 0xffe8c2,
  map: poolGlowTex,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const lampGlowTex = createGlowTexture('rgba(255, 241, 214, 0.8)', 'rgba(255, 232, 190, 0.35)', 'rgba(255, 220, 160, 0)');
const innerLampMat = new THREE.MeshBasicMaterial({
  color: 0xfff1d6,
  map: lampGlowTex,
  transparent: true,
  opacity: 0.55,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const outerGlowTex = createGlowTexture('rgba(255, 248, 230, 0.45)', 'rgba(255, 235, 200, 0.15)', 'rgba(255, 225, 175, 0)');
const outerLampMat = new THREE.MeshBasicMaterial({
  color: 0xfff4e0,
  map: outerGlowTex,
  transparent: true,
  opacity: 0.28,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

// Mount All 64 Paintings on Outer & Inner Walls (Zero placards below!)
const interactiveObjects = [];

STATIONS.forEach((station, i) => {
  const angle = i * ANGLE_STEP;
  const stationGroup = new THREE.Group();

  // Outer Wall Painting
  const outerX = OUTER_RADIUS * Math.sin(angle);
  const outerZ = OUTER_RADIUS * Math.cos(angle);
  const outerRotY = angle + Math.PI;

  const outerGroup = new THREE.Group();
  outerGroup.position.set(outerX, 0, outerZ);
  outerGroup.rotation.y = outerRotY;

  const poolMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), poolMat);
  poolMesh.rotation.x = -Math.PI / 2;
  poolMesh.position.set(0, 0.02, 1.1);
  outerGroup.add(poolMesh);

  const outerBeamMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 3.0), outerLampMat);
  outerBeamMesh.position.set(0, 1.85, 0.008);
  outerGroup.add(outerBeamMesh);

  const item = station.outerItem;
  const ratio = THREE.MathUtils.clamp(item.ratio || 1.0, 0.65, 1.78);
  const pW = 1.45 * ratio;
  const pH = 1.45;

  const tex = textureLoader.load(item.image);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;

  const frameMat = new THREE.MeshBasicMaterial({ color: 0x14161c, side: THREE.DoubleSide });
  const frameMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW + 0.08, pH + 0.08), frameMat);
  frameMesh.position.set(0, 1.6, 0.015);
  outerGroup.add(frameMesh);

  const artMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
  const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW, pH), artMat);
  artMesh.position.set(0, 1.6, 0.03);

  const metaData = { isArtwork: true, item, stationIdx: i, wallSide: 'outer', frameMesh, artMesh };
  artMesh.userData = metaData;
  frameMesh.userData = metaData;

  outerGroup.add(artMesh);
  interactiveObjects.push(artMesh);
  interactiveObjects.push(frameMesh);

  stationGroup.add(outerGroup);

  // Inner Wall Painting
  const innerItem = station.innerItem;
  const innerX = INNER_RADIUS * Math.sin(angle);
  const innerZ = INNER_RADIUS * Math.cos(angle);
  const innerRotY = angle;

  const innerGroup = new THREE.Group();
  innerGroup.position.set(innerX, 0, innerZ);
  innerGroup.rotation.y = innerRotY;

  const lampMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.8), innerLampMat);
  lampMesh.position.set(0, 1.8, 0.01);
  innerGroup.add(lampMesh);

  const iRatio = THREE.MathUtils.clamp(innerItem.ratio || 1.0, 0.65, 1.78);
  const wLimit = 2.5 / 12 * 14.8 - 0.7;
  const iHeight = Math.min(1.305, wLimit / iRatio);
  const iWidth = iHeight * iRatio;

  const iTex = textureLoader.load(innerItem.image);
  iTex.colorSpace = THREE.SRGBColorSpace;
  iTex.generateMipmaps = true;
  iTex.minFilter = THREE.LinearMipmapLinearFilter;

  const iFrameMat = new THREE.MeshBasicMaterial({ color: 0x14161c, side: THREE.DoubleSide });
  const iFrameMesh = new THREE.Mesh(new THREE.PlaneGeometry(iWidth + 0.08, iHeight + 0.08), iFrameMat);
  iFrameMesh.position.set(0, 1.6, 0.015);
  innerGroup.add(iFrameMesh);

  const iArtMat = new THREE.MeshBasicMaterial({ map: iTex, side: THREE.DoubleSide });
  const iArtMesh = new THREE.Mesh(new THREE.PlaneGeometry(iWidth, iHeight), iArtMat);
  iArtMesh.position.set(0, 1.6, 0.03);

  const iMetaData = { isArtwork: true, item: innerItem, stationIdx: i, wallSide: 'inner', frameMesh: iFrameMesh, artMesh: iArtMesh };
  iArtMesh.userData = iMetaData;
  iFrameMesh.userData = iMetaData;

  innerGroup.add(iArtMesh);
  interactiveObjects.push(iArtMesh);
  interactiveObjects.push(iFrameMesh);

  stationGroup.add(innerGroup);
  rotundaScene.add(stationGroup);
});

// Rotunda Camera Tracking State
const walkState = {
  angle: 0.0,
  targetAngle: 0.0,
  lastMoved: performance.now()
};

const currentEye = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();
const targetEye = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const scratchWorldPos = new THREE.Vector3();
const scratchFacingDir = new THREE.Vector3();

let inspectedMesh = null;
let isInspecting = false;
let activeExhibit = null;

const pointer = new THREE.Vector2(-999, -999);
const mouseParallax = { x: 0, y: 0 };
const raycaster = new THREE.Raycaster();
let hoveredMesh = null;
let currentCollectionIdx = 0;

function updateCaption(colIdx, item) {
  if (colIdx !== currentCollectionIdx || item) {
    currentCollectionIdx = colIdx;
    const col = COLLECTIONS_INFO[colIdx] || COLLECTIONS_INFO[0];
    if (roomTitle) roomTitle.textContent = item ? item.title : col.title;
    if (roomMore) roomMore.textContent = item ? 'VIEW PAINTING DETAILS →' : 'EXPLORE COLLECTION →';
  }
}

function lookCloserAt(mesh) {
  inspectedMesh = mesh;
  isInspecting = true;
  walkState.lastMoved = performance.now();

  mesh.getWorldPosition(scratchWorldPos);
  mesh.getWorldDirection(scratchFacingDir);

  targetEye.copy(scratchWorldPos).addScaledVector(scratchFacingDir, 2.2);
  targetEye.y = 1.6;

  targetLookAt.copy(scratchWorldPos);
  targetLookAt.y -= 0.1;

  if (hintLine1) hintLine1.textContent = 'Click away or Esc to step back';
  if (hintLine2) hintLine2.textContent = 'Viewing artwork details';
  walkHint?.classList.add('is-lit');
  if (cursorTipPill) cursorTipPill.textContent = 'VIEWING ARTWORK';

  const item = mesh.userData.item;
  if (item) {
    activeExhibit = item;
    const colIdx = mesh.userData.stationIdx !== undefined ? STATIONS[mesh.userData.stationIdx].collectionIdx : 0;
    updateCaption(colIdx, item);
  }
}

function stepBack() {
  inspectedMesh = null;
  isInspecting = false;
  closeDrawer();
  if (hintLine1) hintLine1.textContent = 'Scroll to walk round circular wall';
  if (hintLine2) hintLine2.textContent = 'Click any painting to look closer';
  walkHint?.classList.remove('is-lit');
  if (cursorTipPill) cursorTipPill.textContent = 'CLICK TO VIEW';
}

function openInspector(exhibit) {
  if (!exhibit) return;
  activeExhibit = exhibit;

  drawerContent.innerHTML = `
    <div class="drawer__preview-wrap">
      <img class="drawer__preview-img" src="${exhibit.image}" alt="${exhibit.title}" />
    </div>

    <span class="drawer__tag">${exhibit.category || 'Fine Art Painting'}</span>

    <div>
      <h2 class="drawer__title">${exhibit.title}</h2>
      <p class="drawer__desc" style="margin-top: 10px;">${exhibit.desc}</p>
    </div>

    <div class="drawer__specs-grid">
      ${(exhibit.specs || []).map(s => `
        <div class="spec-item">
          <span class="spec-item__label">${s.label}</span>
          <span class="spec-item__value">${s.value}</span>
        </div>
      `).join('')}
    </div>

    <a href="${exhibit.ctaUrl || 'http://localhost:5174/'}" class="drawer__cta-btn" target="_blank" rel="noopener">
      <span>ENTER 3D DIGITAL TWIN</span>
      <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
        <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  `;

  drawerOverlay?.classList.add('is-open');
  drawer?.classList.add('is-open');
}

function closeDrawer() {
  drawerOverlay?.classList.remove('is-open');
  drawer?.classList.remove('is-open');
}

drawerClose?.addEventListener('click', stepBack);
drawerOverlay?.addEventListener('click', stepBack);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    stepBack();
  }
});

function highlightArtwork(mesh) {
  const frame = mesh.userData.frameMesh;
  if (frame && frame.material) {
    frame.material.color.setHex(0xe5b869);
  }
}

function unhighlightArtwork(mesh) {
  const frame = mesh.userData.frameMesh;
  if (frame && frame.material) {
    frame.material.color.setHex(0x14161c);
  }
}

let lastHoverCheck = 0;
function checkHover(now) {
  if (isInspecting || drawer.classList.contains('is-open') || pointer.x === -999) {
    if (hoveredMesh) {
      unhighlightArtwork(hoveredMesh);
      hoveredMesh = null;
    }
    cursorTip?.classList.remove('is-on');
    return;
  }

  if (now - lastHoverCheck < 32) return;
  lastHoverCheck = now;

  raycaster.setFromCamera(pointer, rotundaCamera);
  const hits = raycaster.intersectObjects(interactiveObjects, false);

  if (hits.length > 0) {
    const mesh = hits[0].object;
    if (hoveredMesh !== mesh) {
      if (hoveredMesh) unhighlightArtwork(hoveredMesh);
      hoveredMesh = mesh;
      highlightArtwork(hoveredMesh);
      canvasContainer.style.cursor = 'pointer';
      cursorTip?.classList.add('is-on');
      if (cursorTipPill) cursorTipPill.textContent = 'CLICK TO VIEW';
    }
  } else {
    if (hoveredMesh) {
      unhighlightArtwork(hoveredMesh);
      hoveredMesh = null;
      canvasContainer.style.cursor = 'grab';
      cursorTip?.classList.remove('is-on');
    }
  }
}

function handleDirectArtworkClick(clientX, clientY) {
  pointer.x = (clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, rotundaCamera);

  const hits = raycaster.intersectObjects(interactiveObjects, false);
  if (hits.length > 0) {
    const mesh = hits[0].object;
    const item = mesh.userData.item;
    if (item) {
      lookCloserAt(mesh);
      openInspector(item);
    }
  } else {
    if (isInspecting || drawer.classList.contains('is-open')) {
      stepBack();
    }
  }
}

// Rotunda Navigation & List View
prevBtn?.addEventListener('click', () => {
  stepBack();
  masterScroll = Math.max(DOOR_THRESHOLD, masterScroll - 300);
});

nextBtn?.addEventListener('click', () => {
  stepBack();
  masterScroll += 300;
});

function setViewMode(mode) {
  if (mode === 'list') {
    viewGalleryBtn?.classList.remove('is-active');
    viewListBtn?.classList.add('is-active');
    renderListView();
    listView?.classList.add('is-visible');
    roomCaption?.classList.add('is-hidden');
  } else {
    viewListBtn?.classList.remove('is-active');
    viewGalleryBtn?.classList.add('is-active');
    listView?.classList.remove('is-visible');
    roomCaption?.classList.remove('is-hidden');
  }
}

viewGalleryBtn?.addEventListener('click', () => setViewMode('gallery'));
viewListBtn?.addEventListener('click', () => setViewMode('list'));

function renderListView() {
  if (!listViewGrid) return;
  listViewGrid.innerHTML = ALL_ITEMS.map((item, idx) => `
    <article class="list-card" data-idx="${idx}">
      <div class="list-card__media">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
      </div>
      <div class="list-card__body">
        <div class="list-card__num">${item.category || 'FINE ART'}</div>
        <h3 class="list-card__title">${item.title}</h3>
        <p class="list-card__sub">${item.artist}</p>
      </div>
    </article>
  `).join('');

  listViewGrid.querySelectorAll('.list-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx, 10);
      const exhibit = ALL_ITEMS[idx];
      if (exhibit) openInspector(exhibit);
    });
  });
}

// Window resize
window.addEventListener('resize', () => {
  rotundaCamera.aspect = window.innerWidth / window.innerHeight;
  rotundaCamera.updateProjectionMatrix();
  rotundaRenderer.setSize(window.innerWidth, window.innerHeight);
  rotundaRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});

// ============================================================================
// 5. UNIFIED CONTINUOUS SCROLL CONTROLLER (POOL -> PASSAGE -> ROTUNDA WALL)
// ============================================================================
// The user starts at the Reflecting Pool (masterScroll = 0).
// Scrolling walks along the pool, down the colonnade passage, through the doorway,
// and CONTINUES directly into the curved 360° rotunda wall of clickable paintings!
// NO SEPARATE PARTS. ONE CONTINUOUS SCROLL!

let masterScroll = 0.0;
let targetMasterScroll = 0.0;
const DOOR_THRESHOLD = 1200.0; // Point where the camera passes through the temple doorway

window.addEventListener('wheel', (e) => {
  if (drawer.classList.contains('is-open')) return;
  e.preventDefault();

  if (isInspecting) {
    stepBack();
    return;
  }

  const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  const normalizedDelta = e.deltaMode === 1 ? rawDelta * 20 : rawDelta;
  const clampedDelta = Math.max(-80, Math.min(80, normalizedDelta));

  targetMasterScroll = Math.max(0, targetMasterScroll + clampedDelta * 1.8);
}, { passive: false });

// Pointer Dragging for Mobile / Touch / Mouse Drag
let pointerDownX = 0;
let pointerDownY = 0;
let pointerDownTime = 0;
let isDragging = false;
let pointerLastY = 0;
let pointerLastX = 0;

window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.gallery-nav') || e.target.closest('.drawer') || e.target.closest('.view-toggle') || e.target.closest('.room-nav')) return;

  pointerDownX = e.clientX;
  pointerDownY = e.clientY;
  pointerDownTime = performance.now();
  isDragging = true;
  pointerLastY = e.clientY;
  pointerLastX = e.clientX;
});

window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  mouseParallax.x = pointer.x;
  mouseParallax.y = pointer.y;

  if (cursorTip) {
    cursorTip.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }

  if (isDragging && !drawer.classList.contains('is-open')) {
    const deltaY = e.clientY - pointerLastY;
    const deltaX = e.clientX - pointerLastX;

    // In rotunda, horizontal drag walks round; in palace, vertical drag walks forward
    if (masterScroll >= DOOR_THRESHOLD) {
      targetMasterScroll = Math.max(0, targetMasterScroll - deltaX * 2.5);
    } else {
      targetMasterScroll = Math.max(0, targetMasterScroll - deltaY * 2.5);
    }

    pointerLastY = e.clientY;
    pointerLastX = e.clientX;
  }
});

window.addEventListener('pointerup', (e) => {
  const totalMove = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
  const duration = performance.now() - pointerDownTime;
  isDragging = false;

  // If clicked inside Rotunda wall area without drag:
  if (masterScroll >= DOOR_THRESHOLD && totalMove < 12 && duration < 600) {
    handleDirectArtworkClick(e.clientX, e.clientY);
  }
});

// Master Unified Animation Loop (60-120 FPS)
const masterClock = new THREE.Clock();

function unifiedAnimationLoop() {
  requestAnimationFrame(unifiedAnimationLoop);

  const delta = Math.min(masterClock.getDelta(), 0.05);
  const elapsedTime = masterClock.getElapsedTime();
  const now = performance.now();

  // Butter-smooth frame-rate independent inertia damping on master scroll
  const damping = 1 - Math.exp(-9.0 * delta);
  masterScroll += (targetMasterScroll - masterScroll) * damping;

  // ---------------- PART 1: Classical Temple Passage (0 <= masterScroll <= DOOR_THRESHOLD)
  if (masterScroll < DOOR_THRESHOLD + 200) {
    // Map masterScroll (0 -> DOOR_THRESHOLD) to Nomadiic Horse progress (Fs -> PALACE_DOOR_PROGRESS)
    const t = Math.min(1.0, masterScroll / DOOR_THRESHOLD);
    const palaceTargetProgress = Fs + t * (PALACE_DOOR_PROGRESS - Fs);

    if (palaceInstance) {
      palaceInstance.progress = palaceTargetProgress;
    }

    // Smooth visual cross-fade through the doorway (between 85% and 100% of DOOR_THRESHOLD)
    const fadeOutT = THREE.MathUtils.smoothstep(masterScroll, DOOR_THRESHOLD - 180, DOOR_THRESHOLD + 40);
    const palaceOpacity = 1.0 - fadeOutT;
    const rotundaOpacity = fadeOutT;

    if (palaceContainer) {
      palaceContainer.style.opacity = palaceOpacity;
      palaceContainer.style.pointerEvents = palaceOpacity > 0.4 ? 'auto' : 'none';
    }

    if (canvasContainer) {
      canvasContainer.style.opacity = rotundaOpacity;
      canvasContainer.style.pointerEvents = rotundaOpacity > 0.4 ? 'auto' : 'none';
    }

    if (masterScroll < DOOR_THRESHOLD - 100) {
      if (navSubTitle) navSubTitle.textContent = 'Classical Temple Passage & Reflecting Pool';
      if (hintLine1) hintLine1.textContent = 'Scroll to walk along the pool and down the passage';
      if (hintLine2) hintLine2.textContent = 'Continues directly through the doorway into the 3D gallery';
      roomCaption?.classList.add('is-hidden');
      roomNav?.classList.add('is-hidden');
      viewToggle?.classList.add('is-hidden');
    }
  }

  // ---------------- PART 2: Curved Rotunda Wall of Clickable Paintings (masterScroll >= DOOR_THRESHOLD)
  if (masterScroll >= DOOR_THRESHOLD - 100) {
    if (navSubTitle) navSubTitle.textContent = 'Curved 3D Rotunda Exhibition Wall';
    if (!isInspecting) {
      if (hintLine1) hintLine1.textContent = 'Scroll to walk round circular wall';
      if (hintLine2) hintLine2.textContent = 'Click any painting to look closer';
      roomCaption?.classList.remove('is-hidden');
      roomNav?.classList.remove('is-hidden');
      viewToggle?.classList.remove('is-hidden');
    }

    // Continuous rotational walking around the curved wall
    const rotundaScrollOffset = Math.max(0, masterScroll - DOOR_THRESHOLD);
    walkState.targetAngle = rotundaScrollOffset * 0.0035;

    const angleDamping = 1 - Math.exp(-8.5 * delta);
    walkState.angle += (walkState.targetAngle - walkState.angle) * angleDamping;

    // Camera positioning in Rotunda
    if (isInspecting && inspectedMesh) {
      const inspectDamping = 1 - Math.exp(-6.0 * delta);
      currentEye.lerp(targetEye, inspectDamping);
      currentLookAt.lerp(targetLookAt, inspectDamping);
    } else {
      const a = walkState.angle;
      const lookAngle = a + 0.32 + 0.14 * mouseParallax.x;

      const eyeY = 1.55 + 0.008 * Math.sin(1.1 * elapsedTime);
      const lookY = 1.5 + 0.14 * mouseParallax.y;

      currentEye.set(
        ROTUNDA_TRACK_R * Math.sin(a),
        eyeY,
        ROTUNDA_TRACK_R * Math.cos(a)
      );
      currentLookAt.set(
        ROTUNDA_TRACK_R * Math.sin(lookAngle),
        lookY,
        ROTUNDA_TRACK_R * Math.cos(lookAngle)
      );
    }

    rotundaCamera.position.copy(currentEye);
    rotundaCamera.lookAt(currentLookAt);

    // Inner wall distance fade
    const camDist = Math.hypot(rotundaCamera.position.x, rotundaCamera.position.z);
    const innerWallOpacity = THREE.MathUtils.smoothstep(camDist, 7.4 + 0.2, 7.4 + 1.8);
    innerWallMat.opacity = innerWallOpacity;
    innerLampMat.opacity = 0.55 * innerWallOpacity;

    // Update active painting caption
    if (!isInspecting) {
      const stationIndex = THREE.MathUtils.euclideanModulo(
        Math.round((walkState.angle + 0.25) / ANGLE_STEP),
        NUM_STATIONS
      );
      const activeStation = STATIONS[stationIndex];
      if (activeStation) {
        updateCaption(activeStation.collectionIdx, activeStation.outerItem);
      }
    }

    checkHover(now);
    rotundaRenderer.render(rotundaScene, rotundaCamera);
  }
}

unifiedAnimationLoop();
