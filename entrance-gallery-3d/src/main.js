import * as THREE from 'three';

// ------------------------------------------------ 1. Curated 64 Fine Art Paintings Data
// All images are downloaded locally in /paintings/sb_01.webp through sb_64.webp
const RAW_METADATA = [
  // Collection 1: From Lagos, with love (Stations 0-7)
  { id: 'sb_01', title: 'Before the day i die', artist: 'Mayowa Alabi', category: 'From Lagos, with love', ratio: 1.38 },
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
  { id: 'lagos-love', title: 'From Lagos, with love', desc: 'Solar hues, coastal twilight, and music television nostalgia by Mayowa Alabi.' },
  { id: 'blck-bourgie', title: 'BLCK & Bourgie', desc: 'Regal figurative portraits, gold leaf accents, and quiet cultural elegance.' },
  { id: 'dnce-carnaval', title: 'DNCE & Carnaval', desc: 'Celebratory carnival parades, kinetic rhythm, and nocturnal masquerades.' },
  { id: 'adumadan-heritage', title: 'Adumadan & Heritage', desc: 'Sculptural West African mineral pigments and modern ancestral portraits.' }
];

// Enrich items with metadata
export const ALL_ITEMS = RAW_METADATA.map((raw, idx) => {
  const filename = `/paintings/sb_${String(idx + 1).padStart(2, '0')}.webp`;
  return {
    ...raw,
    image: filename,
    desc: `${raw.title} — original fine art digital painting from the ${raw.category} series by ${raw.artist}. Rendered with museum-grade color pigments, deep tactile textures, and architectural framing.`,
    specs: [
      { label: 'Medium', value: 'Original Fine Art Digital Painting' },
      { label: 'Artist', value: raw.artist },
      { label: 'Series', value: raw.category },
      { label: 'Aspect Ratio', value: raw.ratio > 1 ? 'Landscape (16:10)' : 'Portrait (3:4)' }
    ],
    ctaUrl: 'http://localhost:5174/'
  };
});

// ------------------------------------------------ 2. 32 Continuous Stations Across Full 360°
const NUM_STATIONS = 32;
const ANGLE_STEP = (Math.PI * 2) / NUM_STATIONS; // Full 360° circle
const OUTER_RADIUS = 11.97;
const INNER_RADIUS = 7.43;
const ROTUNDA_TRACK_R = 9.7; // Walking track radius

// Outer stations: 32 items (ALL_ITEMS[0..31])
// Inner stations: 32 items (ALL_ITEMS[32..63])
const STATIONS = [];
for (let i = 0; i < NUM_STATIONS; i++) {
  const colIdx = Math.floor(i / 8);
  STATIONS.push({
    stationIdx: i,
    collectionIdx: colIdx,
    collection: COLLECTIONS_INFO[colIdx],
    outerItem: ALL_ITEMS[i],
    innerItem: ALL_ITEMS[i + 32]
  });
}

// ------------------------------------------------ 3. High-Performance Three.js Scene Setup (60-120 FPS)
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const BG_COLOR = 0x11151f; // Deep dark gallery environment (Shutabug)
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.Fog(BG_COLOR, 8, 26);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 60);

// Hardware-accelerated WebGLRenderer optimized for high framerate
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
// Clamping DPR to 1.5 ensures razor-sharp visuals while saving >50% fill-rate GPU overhead on Retina screens
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';

// ------------------------------------------------ 4. Architectural Geometry (Pure MeshBasicMaterial - Zero GPU Lighting Bottlenecks)
// Floor Ring Geometry [7.2, 12.2, 120]
const floorMat = new THREE.MeshBasicMaterial({
  color: 0x222327
});
const floorMesh = new THREE.Mesh(new THREE.RingGeometry(7.2, 12.2, 120), floorMat);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.set(0, 0, 0);
scene.add(floorMesh);

// Outer Curved Cylindrical Wall: Radius 12.0, Height 3.6
const outerWallMat = new THREE.MeshBasicMaterial({
  color: 0xeae8e2,
  side: THREE.BackSide
});
const outerWall = new THREE.Mesh(new THREE.CylinderGeometry(12.0, 12.0, 3.6, 120, 1, true), outerWallMat);
outerWall.position.set(0, 1.8, 0);
scene.add(outerWall);

// Inner Curved Cylindrical Wall: Radius 7.4, Height 3.6
const innerWallMat = new THREE.MeshBasicMaterial({
  color: 0xdfdcd5,
  side: THREE.FrontSide,
  transparent: true,
  opacity: 1.0
});
const innerWall = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 7.4, 3.6, 96, 1, true), innerWallMat);
innerWall.position.set(0, 1.8, 0);
scene.add(innerWall);

// Soft Warm Atmospheric Radial Glows (Shutabug Technique - Additive Radial Canvases with 0 Lights)
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

// Floor Warm Glow Pool Under Station
const poolGlowTex = createGlowTexture('rgba(255, 235, 195, 0.42)', 'rgba(255, 220, 160, 0.18)', 'rgba(255, 210, 140, 0)');
const poolMat = new THREE.MeshBasicMaterial({
  color: 0xffe8c2,
  map: poolGlowTex,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

// Inner Wall Warm Backlight Glow
const lampGlowTex = createGlowTexture('rgba(255, 241, 214, 0.8)', 'rgba(255, 232, 190, 0.35)', 'rgba(255, 220, 160, 0)');
const innerLampMat = new THREE.MeshBasicMaterial({
  color: 0xfff1d6,
  map: lampGlowTex,
  transparent: true,
  opacity: 0.55,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

// Outer Wall Soft Downward Gallery Beam Glow
const outerGlowTex = createGlowTexture('rgba(255, 248, 230, 0.45)', 'rgba(255, 235, 200, 0.15)', 'rgba(255, 225, 175, 0)');
const outerLampMat = new THREE.MeshBasicMaterial({
  color: 0xfff4e0,
  map: outerGlowTex,
  transparent: true,
  opacity: 0.28,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

// ------------------------------------------------ 5. Mount All 64 Fine Art Paintings (NO TAGS BELOW!)
const interactiveObjects = []; // Meshes clickable for raycasting (both canvas & frame)
const allArtworkMeshes = [];

STATIONS.forEach((station, i) => {
  const angle = i * ANGLE_STEP;
  const stationGroup = new THREE.Group();

  // ---------------- Outer Wall Painting (Facing Inward)
  const outerX = OUTER_RADIUS * Math.sin(angle);
  const outerZ = OUTER_RADIUS * Math.cos(angle);
  const outerRotY = angle + Math.PI;

  const outerGroup = new THREE.Group();
  outerGroup.position.set(outerX, 0, outerZ);
  outerGroup.rotation.y = outerRotY;

  // Floor pool light underneath outer station
  const poolMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), poolMat);
  poolMesh.rotation.x = -Math.PI / 2;
  poolMesh.position.set(0, 0.02, 1.1);
  outerGroup.add(poolMesh);

  // Soft museum beam glow behind painting on outer wall
  const outerBeamMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 3.0), outerLampMat);
  outerBeamMesh.position.set(0, 1.85, 0.008);
  outerGroup.add(outerBeamMesh);

  // Outer Painting
  const item = station.outerItem;
  const ratio = THREE.MathUtils.clamp(item.ratio || 1.0, 0.65, 1.78);
  const pW = 1.45 * ratio;
  const pH = 1.45;

  const tex = textureLoader.load(item.image);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;

  // Slim dark museum frame
  const frameMat = new THREE.MeshBasicMaterial({ color: 0x14161c, side: THREE.DoubleSide });
  const frameMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW + 0.08, pH + 0.08), frameMat);
  frameMesh.position.set(0, 1.6, 0.015);
  outerGroup.add(frameMesh);

  // High quality artwork canvas (MeshBasicMaterial: 100% smooth, full-color reproduction)
  const artMat = new THREE.MeshBasicMaterial({
    map: tex,
    side: THREE.DoubleSide
  });
  const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW, pH), artMat);
  artMesh.position.set(0, 1.6, 0.03);

  const metaData = { isArtwork: true, item, stationIdx: i, wallSide: 'outer', frameMesh, artMesh };
  artMesh.userData = metaData;
  frameMesh.userData = metaData;

  outerGroup.add(artMesh);
  interactiveObjects.push(artMesh);
  interactiveObjects.push(frameMesh);
  allArtworkMeshes.push(artMesh);

  // NOTE: TAG/PLACARD BELOW IS COMPLETELY REMOVED PER USER INSTRUCTION!
  stationGroup.add(outerGroup);

  // ---------------- Inner Wall Painting (Facing Outward)
  const innerItem = station.innerItem;
  const innerX = INNER_RADIUS * Math.sin(angle);
  const innerZ = INNER_RADIUS * Math.cos(angle);
  const innerRotY = angle;

  const innerGroup = new THREE.Group();
  innerGroup.position.set(innerX, 0, innerZ);
  innerGroup.rotation.y = innerRotY;

  // Wall Lamp behind inner painting
  const lampMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.8), innerLampMat);
  lampMesh.position.set(0, 1.8, 0.01);
  innerGroup.add(lampMesh);

  const iRatio = THREE.MathUtils.clamp(innerItem.ratio || 1.0, 0.65, 1.78);
  const wLimit = 2.5 / 12 * 14.8 - 0.7; // ~2.38
  const iHeight = Math.min(1.305, wLimit / iRatio);
  const iWidth = iHeight * iRatio;

  const iTex = textureLoader.load(innerItem.image);
  iTex.colorSpace = THREE.SRGBColorSpace;
  iTex.generateMipmaps = true;
  iTex.minFilter = THREE.LinearMipmapLinearFilter;

  // Slim frame
  const iFrameMat = new THREE.MeshBasicMaterial({ color: 0x14161c, side: THREE.DoubleSide });
  const iFrameMesh = new THREE.Mesh(new THREE.PlaneGeometry(iWidth + 0.08, iHeight + 0.08), iFrameMat);
  iFrameMesh.position.set(0, 1.6, 0.015);
  innerGroup.add(iFrameMesh);

  const iArtMat = new THREE.MeshBasicMaterial({
    map: iTex,
    side: THREE.DoubleSide
  });
  const iArtMesh = new THREE.Mesh(new THREE.PlaneGeometry(iWidth, iHeight), iArtMat);
  iArtMesh.position.set(0, 1.6, 0.03);

  const iMetaData = { isArtwork: true, item: innerItem, stationIdx: i, wallSide: 'inner', frameMesh: iFrameMesh, artMesh: iArtMesh };
  iArtMesh.userData = iMetaData;
  iFrameMesh.userData = iMetaData;

  innerGroup.add(iArtMesh);
  interactiveObjects.push(iArtMesh);
  interactiveObjects.push(iFrameMesh);
  allArtworkMeshes.push(iArtMesh);

  // NOTE: TAG/PLACARD BELOW IS COMPLETELY REMOVED PER USER INSTRUCTION!
  stationGroup.add(innerGroup);
  scene.add(stationGroup);
});

// ------------------------------------------------ 6. Camera Motion & Interaction State
const walkState = {
  angle: 0.0,
  targetAngle: 0.0,
  lastMoved: performance.now()
};

const entranceState = {
  phase: 'wait',
  startTime: performance.now(),
  fromAngle: -4.5,
  toAngle: 0.0,
  durationMs: 3800
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

// UI References
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
const viewGalleryBtn = document.getElementById('view-gallery-btn');
const viewListBtn = document.getElementById('view-list-btn');
const listView = document.getElementById('list-view');
const listViewGrid = document.getElementById('list-view-grid');
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerClose = document.getElementById('drawer-close');
const drawerContent = document.getElementById('drawer-content');

// Initial camera position at threshold
function setupEntranceThreshold() {
  const a = walkState.angle;
  const c = a + 0.32;
  const entranceR = ROTUNDA_TRACK_R / Math.sqrt(10); // ~3.067m
  const entranceAngleOffset = Math.atan(3); // ~1.249 rad

  currentEye.set(
    Math.sin(a - entranceAngleOffset) * entranceR,
    1.55,
    Math.cos(a - entranceAngleOffset) * entranceR
  );
  currentLookAt.set(
    Math.sin(c - entranceAngleOffset) * entranceR,
    1.5,
    Math.cos(c - entranceAngleOffset) * entranceR
  );
  camera.position.copy(currentEye);
  camera.lookAt(currentLookAt);
}
setupEntranceThreshold();

// Update UI hints
function updateWalkHint() {
  if (isInspecting) {
    if (hintLine1) hintLine1.textContent = 'Click away or Esc to step back';
    if (hintLine2) hintLine2.textContent = 'Viewing artwork details';
    walkHint?.classList.add('is-lit');
  } else {
    if (hintLine1) hintLine1.textContent = 'Scroll or drag to walk round';
    if (hintLine2) hintLine2.textContent = 'Click any painting to look closer';
    walkHint?.classList.remove('is-lit');
  }
}

function updateCaption(colIdx, item) {
  if (colIdx !== currentCollectionIdx || item) {
    currentCollectionIdx = colIdx;
    const col = COLLECTIONS_INFO[colIdx] || COLLECTIONS_INFO[0];
    if (roomTitle) {
      roomTitle.textContent = item ? item.title : col.title;
    }
    if (roomMore) {
      roomMore.textContent = item ? 'VIEW PAINTING DETAILS →' : 'EXPLORE COLLECTION →';
    }
  }
}

// ------------------------------------------------ 7. ZOOM IN & INSPECT DRAWER ACTIONS (100% Reliable Click)
function lookCloserAt(mesh) {
  inspectedMesh = mesh;
  isInspecting = true;
  walkState.lastMoved = performance.now();

  mesh.getWorldPosition(scratchWorldPos);
  mesh.getWorldDirection(scratchFacingDir);

  // Stand 2.2m directly facing the artwork at eye level
  targetEye.copy(scratchWorldPos).addScaledVector(scratchFacingDir, 2.2);
  targetEye.y = 1.6;

  targetLookAt.copy(scratchWorldPos);
  targetLookAt.y -= 0.1;

  updateWalkHint();
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
  updateWalkHint();
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

// Escape key steps back
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    stepBack();
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (isInspecting) stepBack();
    if (entranceState.phase !== 'done') entranceState.phase = 'done';
    walkState.targetAngle += 2 * ANGLE_STEP;
    walkState.lastMoved = performance.now();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (isInspecting) stepBack();
    if (entranceState.phase !== 'done') entranceState.phase = 'done';
    walkState.targetAngle -= 2 * ANGLE_STEP;
    walkState.lastMoved = performance.now();
  }
});

// ------------------------------------------------ 8. FLUID, STUTTER-FREE SCROLL & DRAG SYSTEM
// Wheel scroll: Instant cancellation of auto-entrance + smooth normalized delta (NO LAG, NO STICKING!)
window.addEventListener('wheel', (e) => {
  if (drawer.classList.contains('is-open')) return;
  e.preventDefault();

  if (isInspecting) {
    stepBack();
    return;
  }

  // Cancel entrance animation instantly if user touches scroll, giving 100% immediate control!
  if (entranceState.phase !== 'done') {
    entranceState.phase = 'done';
    walkState.targetAngle = walkState.angle;
  }

  const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  const normalizedDelta = e.deltaMode === 1 ? rawDelta * 18 : rawDelta;
  const clampedDelta = Math.max(-80, Math.min(80, normalizedDelta));

  walkState.targetAngle += 0.00085 * clampedDelta;
  walkState.lastMoved = performance.now();
}, { passive: false });

let pointerDownX = 0;
let pointerDownY = 0;
let pointerDownTime = 0;
let isDraggingCamera = false;
let pointerLastX = 0;
let pointerVelocity = 0;
let pointerTimestamp = 0;

// Golden accent on hover for instant feedback with zero lighting cost
function highlightArtwork(mesh) {
  const frame = mesh.userData.frameMesh;
  if (frame && frame.material) {
    frame.material.color.setHex(0xe5b869); // Elegant museum gold frame
  }
}

function unhighlightArtwork(mesh) {
  const frame = mesh.userData.frameMesh;
  if (frame && frame.material) {
    frame.material.color.setHex(0x14161c); // Original deep dark frame
  }
}

// Throttled hover check running inside the animation loop (prevents 120Hz CPU raycasting overload)
let lastHoverCheck = 0;
function checkHover(now) {
  if (isDraggingCamera || drawer.classList.contains('is-open') || pointer.x === -999) {
    if (hoveredMesh) {
      unhighlightArtwork(hoveredMesh);
      hoveredMesh = null;
    }
    cursorTip?.classList.remove('is-on');
    return;
  }

  if (now - lastHoverCheck < 32) return; // ~30 FPS check is imperceptible to eye but saves massive CPU
  lastHoverCheck = now;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactiveObjects, false);

  if (hits.length > 0) {
    const mesh = hits[0].object;
    if (hoveredMesh !== mesh) {
      if (hoveredMesh) unhighlightArtwork(hoveredMesh);
      hoveredMesh = mesh;
      highlightArtwork(hoveredMesh);
      container.style.cursor = 'pointer';
      cursorTip?.classList.add('is-on');
      if (cursorTipPill) cursorTipPill.textContent = 'CLICK TO VIEW';
    }
  } else {
    if (hoveredMesh) {
      unhighlightArtwork(hoveredMesh);
      hoveredMesh = null;
      container.style.cursor = 'grab';
      cursorTip?.classList.remove('is-on');
    }
  }
}

container.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.gallery-nav') || e.target.closest('.drawer') || e.target.closest('.view-toggle') || e.target.closest('.room-nav')) return;

  pointerDownX = e.clientX;
  pointerDownY = e.clientY;
  pointerDownTime = performance.now();
  isDraggingCamera = true;
  pointerLastX = e.clientX;
  pointerTimestamp = performance.now();
  pointerVelocity = 0;

  if (entranceState.phase !== 'done') {
    entranceState.phase = 'done';
    walkState.targetAngle = walkState.angle;
  }
});

container.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  mouseParallax.x = pointer.x;
  mouseParallax.y = pointer.y;

  if (cursorTip) {
    cursorTip.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }

  if (isDraggingCamera && !drawer.classList.contains('is-open')) {
    const deltaX = e.clientX - pointerLastX;
    const totalMove = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);

    if (totalMove > 6) {
      walkState.targetAngle -= 0.0024 * deltaX;
      walkState.lastMoved = performance.now();

      const dt = Math.max(1, performance.now() - pointerTimestamp);
      pointerVelocity = 0.5 * pointerVelocity + (deltaX / dt) * 0.5;
      pointerTimestamp = performance.now();
    }
    pointerLastX = e.clientX;
  }
});

container.addEventListener('pointerup', (e) => {
  const totalMove = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
  const duration = performance.now() - pointerDownTime;
  isDraggingCamera = false;

  // Fling momentum when released with speed
  if (totalMove > 14 && Math.abs(pointerVelocity) > 0.08) {
    const clampedV = Math.max(-2.5, Math.min(2.5, pointerVelocity));
    walkState.targetAngle -= 180 * clampedV * 0.0022;
    walkState.lastMoved = performance.now();
    return;
  }

  // GUARANTEED CLICK TRIGGER:
  // If pointer moved less than 12px within 600ms, it is a deliberate click!
  if (totalMove < 12 && duration < 600) {
    handleDirectArtworkClick(e.clientX, e.clientY);
  }
});

function handleDirectArtworkClick(clientX, clientY) {
  pointer.x = (clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(interactiveObjects, false);
  if (hits.length > 0) {
    const mesh = hits[0].object;
    const item = mesh.userData.item;
    if (item) {
      // 1. Smoothly fly camera to face artwork
      lookCloserAt(mesh);
      // 2. Open inspector drawer with full specs and high-res image
      openInspector(item);
    }
  } else {
    // Clicked floor or background: step back if inspecting
    if (isInspecting || drawer.classList.contains('is-open')) {
      stepBack();
    }
  }
}

// Room navigation buttons (← and →)
prevBtn?.addEventListener('click', () => {
  stepBack();
  if (entranceState.phase !== 'done') entranceState.phase = 'done';
  let currentTargetStation = Math.round(walkState.targetAngle / ANGLE_STEP);
  let col = STATIONS[THREE.MathUtils.euclideanModulo(currentTargetStation, NUM_STATIONS)].collectionIdx;
  do {
    currentTargetStation -= 1;
  } while (STATIONS[THREE.MathUtils.euclideanModulo(currentTargetStation, NUM_STATIONS)].collectionIdx === col);
  walkState.targetAngle = currentTargetStation * ANGLE_STEP;
  walkState.lastMoved = performance.now();
});

nextBtn?.addEventListener('click', () => {
  stepBack();
  if (entranceState.phase !== 'done') entranceState.phase = 'done';
  let currentTargetStation = Math.round(walkState.targetAngle / ANGLE_STEP);
  let col = STATIONS[THREE.MathUtils.euclideanModulo(currentTargetStation, NUM_STATIONS)].collectionIdx;
  do {
    currentTargetStation += 1;
  } while (STATIONS[THREE.MathUtils.euclideanModulo(currentTargetStation, NUM_STATIONS)].collectionIdx === col);
  walkState.targetAngle = currentTargetStation * ANGLE_STEP;
  walkState.lastMoved = performance.now();
});

// View mode switcher (GALLERY | LIST)
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

// ------------------------------------------------ 9. Silky Smooth 60-120 FPS Render Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsedTime = clock.getElapsedTime();
  const now = performance.now();

  // Entrance walk-in animation
  if (entranceState.phase === 'wait') {
    if (now - entranceState.startTime > 500) {
      entranceState.phase = 'run';
      entranceState.startTime = now;
    }
  } else if (entranceState.phase === 'run') {
    const elapsed = now - entranceState.startTime;
    const progress = Math.min(1.0, elapsed / entranceState.durationMs);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    walkState.angle = entranceState.fromAngle + (entranceState.toAngle - entranceState.fromAngle) * easeProgress;
    walkState.targetAngle = walkState.angle;

    if (progress >= 1.0) {
      entranceState.phase = 'done';
      walkState.lastMoved = now;
    }
  } else {
    // Subtle idle drift when not interacting and drawer closed
    if (!isDraggingCamera && !isInspecting && !drawer.classList.contains('is-open')) {
      if (now - walkState.lastMoved > 3000) {
        walkState.targetAngle += 0.005 * delta;
      }
    }
    // Exponential decay damping: butter-smooth, frame-rate independent
    const damping = 1 - Math.exp(-8.5 * delta);
    walkState.angle += (walkState.targetAngle - walkState.angle) * damping;
  }

  // Camera positioning
  if (isInspecting && inspectedMesh) {
    const inspectDamping = 1 - Math.exp(-6.0 * delta);
    currentEye.lerp(targetEye, inspectDamping);
    currentLookAt.lerp(targetLookAt, inspectDamping);
  } else {
    const a = walkState.angle;
    const lookAngle = a + 0.32 + 0.14 * mouseParallax.x;

    const eyeY = 1.55 + 0.008 * Math.sin(1.1 * elapsedTime);
    const lookY = 1.5 + 0.14 * mouseParallax.y;

    if (entranceState.phase === 'wait') {
      const entranceR = ROTUNDA_TRACK_R / Math.sqrt(10);
      const entranceAngleOffset = Math.atan(3);
      currentEye.set(
        Math.sin(a - entranceAngleOffset) * entranceR,
        1.55,
        Math.cos(a - entranceAngleOffset) * entranceR
      );
      currentLookAt.set(
        Math.sin(lookAngle - entranceAngleOffset) * entranceR,
        lookY,
        Math.cos(lookAngle - entranceAngleOffset) * entranceR
      );
    } else {
      // Direct positioning from smoothly damped angle: eliminates sluggish double-lerp
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
  }

  camera.position.copy(currentEye);
  camera.lookAt(currentLookAt);

  // Inner wall distance fade (Shutabug style)
  const camDist = Math.hypot(camera.position.x, camera.position.z);
  const innerWallOpacity = THREE.MathUtils.smoothstep(camDist, 7.4 + 0.2, 7.4 + 1.8);
  innerWallMat.opacity = innerWallOpacity;
  innerLampMat.opacity = 0.55 * innerWallOpacity;

  // Update room caption
  if (!isInspecting && entranceState.phase !== 'wait') {
    const stationIndex = THREE.MathUtils.euclideanModulo(
      Math.round((walkState.angle + 0.25) / ANGLE_STEP),
      NUM_STATIONS
    );
    const activeStation = STATIONS[stationIndex];
    if (activeStation) {
      updateCaption(activeStation.collectionIdx, activeStation.outerItem);
    }
  }

  // Throttled raycasting hover check
  checkHover(now);

  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});
