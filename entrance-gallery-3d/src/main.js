import * as THREE from 'three';

async function getMountNomadiic() {
  if (window.__mountNomadiicPromise) return await window.__mountNomadiicPromise;
  try {
    const scriptPath = '/nomadiic-rt.js';
    const mod = await import(/* @vite-ignore */ scriptPath);
    return mod.mount;
  } catch (err) {
    console.error('[getMountNomadiic]', err);
    return null;
  }
}

// ============================================================================
// 1. CURATED FINE ART PAINTINGS DATA (INCLUDING FEATURED ACROPOLIS CLASSICAL MUSE)
// ============================================================================
const RAW_METADATA = [
  // Station 0: Featured Acropolis Classical Muse (from user upload)
  {
    id: 'sb_01',
    title: 'Acropolis Classical Muse',
    artist: 'Classical Heritage',
    category: 'Parthenon Classical Sanctuary',
    image: '/paintings/greek_acropolis.jpg',
    ratio: 1.0,
    desc: 'Portrait of the Acropolis Classical Muse standing before the ancient Parthenon and Grecian colonnade sanctuary ruins. Rendered in natural Mediterranean sunlight with classical stone craftsmanship and timeless heritage elegance.',
    specs: [
      { label: 'Medium', value: 'Classical Fine Art Realism' },
      { label: 'Location', value: 'Acropolis of Athens' },
      { label: 'Architectural Style', value: 'Parthenon & Temple Sanctuary' },
      { label: 'Framing', value: 'Museum Gilded Walnut Frame' }
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
  { id: 'parthenon-muse', title: 'Classical Sanctuary & Muse', desc: 'Ancient Mediterranean marble, temple peristyle colonnades, and timeless classical fine art.' },
  { id: 'blck-bourgie', title: 'BLCK & Bourgie', desc: 'Regal figurative portraits, gold leaf accents, and quiet cultural elegance.' },
  { id: 'dnce-carnaval', title: 'DNCE & Carnaval', desc: 'Celebratory carnival parades, kinetic rhythm, and nocturnal masquerades.' },
  { id: 'adumadan-heritage', title: 'Adumadan & Heritage', desc: 'Sculptural West African mineral pigments and modern ancestral portraits.' }
];

// Enrich items with metadata
export const ALL_ITEMS = RAW_METADATA.map((raw, idx) => {
  if (idx === 0) {
    return {
      ...raw,
      image: '/paintings/greek_acropolis.jpg'
    };
  }
  const filename = `/paintings/sb_${String(idx + 1).padStart(2, '0')}.webp`;
  return {
    ...raw,
    image: filename,
    desc: `${raw.title} — original fine art painting from the ${raw.category} series by ${raw.artist}. Rendered with museum-grade pigments, tactile brushwork, and architectural framing.`,
    specs: [
      { label: 'Medium', value: 'Original Fine Art Painting' },
      { label: 'Artist', value: raw.artist },
      { label: 'Series', value: raw.category },
      { label: 'Aspect Ratio', value: raw.ratio > 1 ? 'Landscape (16:10)' : 'Portrait (3:4)' }
    ],
    ctaUrl: 'http://localhost:5174/'
  };
});

// ------------------------------------------------ 2. 32 Continuous Stations Across Full 360°
const NUM_STATIONS = 32;
const ANGLE_STEP = (Math.PI * 2) / NUM_STATIONS;
const OUTER_RADIUS = 11.97;
const INNER_RADIUS = 7.43;
const ROTUNDA_TRACK_R = 9.7; // Walking track radius

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

// ------------------------------------------------ 3. DOM Elements
const palaceContainer = document.getElementById('palace-container');
const canvasContainer = document.getElementById('canvas-container');
const cursorTip = document.getElementById('cursor-tip');
const cursorTipPill = document.getElementById('cursor-tip-pill');
const waypointHud = document.getElementById('waypoint-hud');
const hudKicker = document.getElementById('hud-kicker');
const hudTitle = document.getElementById('hud-title');
const hudSubtitle = document.getElementById('hud-subtitle');
const walkHint = document.getElementById('walk-hint');
const hintLine1 = document.getElementById('hint-line-1');
const hintLine2 = document.getElementById('hint-line-2');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const viewToggle = document.getElementById('view-toggle');
const viewGalleryBtn = document.getElementById('view-gallery-btn');
const viewListBtn = document.getElementById('view-list-btn');
const helpTapLink = document.getElementById('help-tap-link');
const listView = document.getElementById('list-view');
const listViewGrid = document.getElementById('list-view-grid');
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerClose = document.getElementById('drawer-close');
const drawerContent = document.getElementById('drawer-content');
const portalBackWrap = document.getElementById('portal-back-wrap');
const portalBackBtn = document.getElementById('portal-back-btn');
const audioToggle = document.getElementById('audio-toggle');
const navStatusText = document.getElementById('nav-status-text');

// ------------------------------------------------ 4. Three.js Rotunda Gallery Scene (60-120 FPS)
const scene = new THREE.Scene();
const BG_COLOR = 0x11151f;
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.Fog(BG_COLOR, 9, 36);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 70);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
canvasContainer.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';

// Architectural Surfaces (Pure MeshBasicMaterial = Zero Dynamic Light Overhead)
const floorMat = new THREE.MeshBasicMaterial({ color: 0x222327 });
const floorMesh = new THREE.Mesh(new THREE.RingGeometry(7.2, 12.2, 120), floorMat);
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

// Center Court Floor Disc
const centerCourtFloor = new THREE.Mesh(
  new THREE.CircleGeometry(7.3, 64),
  new THREE.MeshBasicMaterial({ color: 0x181a20 })
);
centerCourtFloor.rotation.x = -Math.PI / 2;
scene.add(centerCourtFloor);

// Outer Curved Wall
const outerWallMat = new THREE.MeshBasicMaterial({ color: 0xeae8e2, side: THREE.BackSide });
const outerWall = new THREE.Mesh(new THREE.CylinderGeometry(12.0, 12.0, 3.8, 120, 1, true), outerWallMat);
outerWall.position.set(0, 1.9, 0);
scene.add(outerWall);

// Inner Curved Wall with opening centered at Station 0 (+Z axis)
const innerWallMat = new THREE.MeshBasicMaterial({
  color: 0xdfdcd5,
  side: THREE.FrontSide,
  transparent: true,
  opacity: 1.0
});
const innerWall = new THREE.Mesh(
  new THREE.CylinderGeometry(7.4, 7.4, 3.8, 96, 1, true, Math.PI / 2 + 0.4, Math.PI * 2 - 0.8),
  innerWallMat
);
innerWall.position.set(0, 1.9, 0);
scene.add(innerWall);

// Radial Glow Textures for Museum Atmosphere (0 Dynamic Lights)
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
  depthWrite: false
});
const floorGlowMesh = new THREE.Mesh(new THREE.RingGeometry(7.5, 11.9, 64), poolMat);
floorGlowMesh.rotation.x = -Math.PI / 2;
floorGlowMesh.position.y = 0.01;
scene.add(floorGlowMesh);

const lampGlowTex = createGlowTexture('rgba(255, 241, 214, 0.8)', 'rgba(255, 232, 190, 0.35)', 'rgba(255, 220, 160, 0)');
const outerLampMat = new THREE.MeshBasicMaterial({
  map: lampGlowTex,
  transparent: true,
  opacity: 0.55,
  side: THREE.BackSide,
  depthWrite: false
});
const outerWallLampGlow = new THREE.Mesh(new THREE.CylinderGeometry(11.94, 11.94, 1.2, 96, 1, true), outerLampMat);
outerWallLampGlow.position.set(0, 2.7, 0);
scene.add(outerWallLampGlow);

const innerLampMat = new THREE.MeshBasicMaterial({
  map: lampGlowTex,
  transparent: true,
  opacity: 0.55,
  side: THREE.FrontSide,
  depthWrite: false
});
const innerWallLampGlow = new THREE.Mesh(
  new THREE.CylinderGeometry(7.43, 7.43, 1.2, 80, 1, true, Math.PI / 2 + 0.4, Math.PI * 2 - 0.8),
  innerLampMat
);
innerWallLampGlow.position.set(0, 2.7, 0);
scene.add(innerWallLampGlow);

// ------------------------------------------------ 5. CENTRAL CLASSICAL TEMPLE DOORWAY PORTAL
const centerPortalGroup = new THREE.Group();
centerPortalGroup.position.set(0, 0, 7.35);
scene.add(centerPortalGroup);

const marbleMat = new THREE.MeshBasicMaterial({ color: 0xeeebe3 });
const brassMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });

const stepLower = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 1.6), marbleMat);
stepLower.position.set(0, 0.09, 0);
centerPortalGroup.add(stepLower);

const stepUpper = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.18, 1.3), marbleMat);
stepUpper.position.set(0, 0.27, 0);
centerPortalGroup.add(stepUpper);

function createClassicalColumn(xPos) {
  const colGroup = new THREE.Group();
  colGroup.position.set(xPos, 0.36, 0);
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.72), marbleMat);
  plinth.position.y = 0.08;
  colGroup.add(plinth);
  const torus = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.37, 0.14, 24), marbleMat);
  torus.position.y = 0.23;
  colGroup.add(torus);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 3.2, 24), marbleMat);
  shaft.position.y = 1.83;
  colGroup.add(shaft);
  const echinus = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.16, 24), marbleMat);
  echinus.position.y = 3.51;
  colGroup.add(echinus);
  const abacus = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.72), marbleMat);
  abacus.position.y = 3.67;
  colGroup.add(abacus);
  return colGroup;
}

const leftColumn = createClassicalColumn(-1.65);
const rightColumn = createClassicalColumn(1.65);
centerPortalGroup.add(leftColumn);
centerPortalGroup.add(rightColumn);

const architrave = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.32, 0.65), marbleMat);
architrave.position.set(0, 4.22, 0);
centerPortalGroup.add(architrave);

const cornice = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.22, 0.78), marbleMat);
cornice.position.set(0, 4.49, 0);
centerPortalGroup.add(cornice);

const pedimentGeom = new THREE.CylinderGeometry(0.01, 2.3, 0.9, 3);
pedimentGeom.rotateY(Math.PI / 6);
const pediment = new THREE.Mesh(pedimentGeom, marbleMat);
pediment.position.set(0, 5.04, 0);
centerPortalGroup.add(pediment);

const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 24), brassMat);
medallion.rotation.x = Math.PI / 2;
medallion.position.set(0, 4.88, 0.28);
centerPortalGroup.add(medallion);

const doorFrameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.4, 0.22), marbleMat);
doorFrameLeft.position.set(-1.24, 2.06, 0);
centerPortalGroup.add(doorFrameLeft);

const doorFrameRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.4, 0.22), marbleMat);
doorFrameRight.position.set(1.24, 2.06, 0);
centerPortalGroup.add(doorFrameRight);

const doorFrameTop = new THREE.Mesh(new THREE.BoxGeometry(2.66, 0.18, 0.22), marbleMat);
doorFrameTop.position.set(0, 3.76, 0);
centerPortalGroup.add(doorFrameTop);

// Central Portal Threshold Mesh (Clickable to walk back outside)
const portalMeshMat = new THREE.MeshBasicMaterial({ color: 0x0c1019, transparent: true, opacity: 0.1 });
const centerPortalClickMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 3.2), portalMeshMat);
centerPortalClickMesh.position.set(0, 2.0, 0.05);
centerPortalClickMesh.userData = { isCenterPortal: true };
centerPortalGroup.add(centerPortalClickMesh);

const thresholdGlowMat = new THREE.MeshBasicMaterial({
  color: 0xffbe82,
  transparent: true,
  opacity: 0.35,
  depthWrite: false
});
const thresholdGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.2), thresholdGlowMat);
thresholdGlow.rotation.x = -Math.PI / 2;
thresholdGlow.position.set(0, 0.37, 0);
centerPortalGroup.add(thresholdGlow);

// ------------------------------------------------ 6. PAINTINGS ARCHITECTURE (64 PAINTINGS)
const interactiveObjects = [centerPortalClickMesh];
const frameColorMat = new THREE.MeshBasicMaterial({ color: 0x14161c });
const museGoldFrameMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });

function createPaintingMesh(item, isOuter, stationAngle) {
  const isFeaturedMuse = item.id === 'sb_01';
  let width, height;
  if (isFeaturedMuse) {
    width = 2.4;
    height = 2.4;
  } else if (item.ratio > 1) {
    width = 2.25;
    height = width / item.ratio;
  } else {
    height = 2.2;
    width = height * item.ratio;
  }

  const mat = new THREE.MeshBasicMaterial({ color: 0x2a2e3b });
  const geom = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(geom, mat);

  textureLoader.load(
    item.image,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      mat.map = tex;
      mat.color.setHex(0xffffff);
      mat.needsUpdate = true;
    },
    undefined,
    () => {
      mat.color.setHex(0x3a4055);
    }
  );

  const frameDepth = 0.08;
  const frameBorder = isFeaturedMuse ? 0.09 : 0.05;
  const frameGeom = new THREE.BoxGeometry(width + frameBorder * 2, height + frameBorder * 2, frameDepth);
  const frameMesh = new THREE.Mesh(frameGeom, isFeaturedMuse ? museGoldFrameMat : frameColorMat);
  frameMesh.position.z = -frameDepth / 2 - 0.005;
  mesh.add(frameMesh);

  mesh.userData = {
    isPainting: true,
    item,
    isOuter,
    frameMesh
  };

  const group = new THREE.Group();
  const radius = isOuter ? OUTER_RADIUS - 0.06 : INNER_RADIUS + 0.06;
  const yPos = 1.95;

  group.position.set(
    radius * Math.sin(stationAngle),
    yPos,
    radius * Math.cos(stationAngle)
  );

  const facingAngle = isOuter ? stationAngle + Math.PI : stationAngle;
  group.rotation.y = facingAngle;
  group.add(mesh);

  interactiveObjects.push(mesh);
  return group;
}

// Populate all 32 stations with 64 paintings
for (let i = 0; i < NUM_STATIONS; i++) {
  const stationAngle = i * ANGLE_STEP;
  const station = STATIONS[i];

  const outerPainting = createPaintingMesh(station.outerItem, true, stationAngle);
  scene.add(outerPainting);

  if (i !== 0) {
    const innerPainting = createPaintingMesh(station.innerItem, false, stationAngle);
    scene.add(innerPainting);
  }
}

// ------------------------------------------------ 7. UNIFIED CONTINUOUS JOURNEY CONTROLLER
// Master Journey Progress:
// 0.00 -> 0.12 : Reflecting Pool with lightning & fountain (Screenshot 1)
// 0.12 -> 0.26 : Colonnade Passage Hallway with columns & sconces (Screenshot 2)
// 0.26 -> 0.40 : Mithraki Coffee Machine Showroom with terracotta reflection floor (Screenshot 3)
// 0.40 -> 1.00+: Stepping through the doorway into the 3D Curved Exhibition Rotunda Wall!
const journey = {
  progress: 0.0,
  targetProgress: 0.0,
  activeMode: 'palace' // 'palace' | 'rotunda'
};

// Support direct URL coordinate query (?p=0.30, etc.)
const urlParams = new URLSearchParams(window.location.search);
const pParam = urlParams.get('p');
if (pParam !== null) {
  const pVal = parseFloat(pParam);
  if (!isNaN(pVal)) {
    journey.progress = pVal;
    journey.targetProgress = pVal;
  }
}

// Expose globals for inspection & testing
window.__journey = journey;
window.setJourneyProgress = (val) => {
  journey.targetProgress = val;
  journey.progress = val;
};

const walkState = {
  angle: 0.0,
  targetAngle: 0.0,
  lastMoved: performance.now()
};

let nomadiic = null;
window.__nomadiic = () => nomadiic;

async function initNomadiicStage() {
  try {
    const mountNomadiic = await getMountNomadiic();
    if (!mountNomadiic) {
      console.warn('[Nomadiic] mount function not available');
      return;
    }

    nomadiic = await mountNomadiic(palaceContainer, {
      exposure: 1.15,
      intro: 'none',
      base: 'https://aniketh-ani.github.io/nomadiic-cdn/palace/assets/',
      debug: true
    });

    // Preload Mithraki showroom slice immediately
    if (nomadiic && nomadiic.loadSlice) {
      await nomadiic.loadSlice(0);
    }

    // Set camera to initial journey progress
    const initProg = 0.037 + (journey.progress / 0.38) * (0.38 - 0.037);
    if (nomadiic && nomadiic.setProgressImmediate) {
      nomadiic.setProgressImmediate(initProg);
    }

    if (journey.progress < 0.38) {
      canvasContainer.style.opacity = '0';
      canvasContainer.style.pointerEvents = 'none';
      palaceContainer.style.opacity = '1';
      palaceContainer.style.pointerEvents = 'auto';
    }
  } catch (err) {
    console.warn('[Nomadiic Mount]', err);
  }
}

initNomadiicStage();

// ------------------------------------------------ 8. FLUID SCROLL SYSTEM (WHEEL, TOUCH, ARROWS)
function handleJourneyDelta(rawDelta) {
  if (drawer.classList.contains('is-open') || listView.classList.contains('is-visible')) return;

  const clampedDelta = Math.max(-100, Math.min(100, rawDelta));
  // Scroll sensitivity: 0.00045
  journey.targetProgress += clampedDelta * 0.00045;
  journey.targetProgress = Math.max(0.0, journey.targetProgress);
  walkState.lastMoved = performance.now();
}

window.addEventListener('wheel', (e) => {
  if (drawer.classList.contains('is-open')) return;
  e.preventDefault();

  const rawDelta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  const normalizedDelta = e.deltaMode === 1 ? rawDelta * 18 : rawDelta;
  handleJourneyDelta(normalizedDelta);
}, { passive: false });

let touchStartY = null;
window.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (touchStartY === null || !e.touches || !e.touches[0]) return;
  const currentY = e.touches[0].clientY;
  const delta = touchStartY - currentY;
  touchStartY = currentY;
  handleJourneyDelta(delta * 1.5);
}, { passive: true });

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeListView();
    return;
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    handleJourneyDelta(60);
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    handleJourneyDelta(-60);
  }
});

// Arrow Navigation Buttons (Prev / Next)
prevBtn?.addEventListener('click', () => {
  if (journey.targetProgress < 0.40) {
    journey.targetProgress = Math.max(0.0, journey.targetProgress - 0.12);
  } else {
    journey.targetProgress = Math.max(0.40, journey.targetProgress - (ANGLE_STEP / 10.0));
  }
});

nextBtn?.addEventListener('click', () => {
  if (journey.targetProgress < 0.40) {
    journey.targetProgress = Math.min(0.40, journey.targetProgress + 0.12);
  } else {
    journey.targetProgress += (ANGLE_STEP / 10.0);
  }
});

// Portal Back Button: Steps back out to Mithraki Showroom
portalBackBtn?.addEventListener('click', () => {
  journey.targetProgress = 0.30;
});

// ------------------------------------------------ 9. RAYCASTING, HOVER & INSPECTION DRAWER
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-999, -999);
let hoveredMesh = null;
let isInspecting = false;
let inspectedMesh = null;

const currentEye = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();
const targetEye = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();

window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  if (cursorTip) {
    cursorTip.style.transform = `translate3d(${e.clientX + 16}px, ${e.clientY + 16}px, 0)`;
  }
});

function highlightObject(mesh) {
  if (mesh.userData.isCenterPortal) {
    pediment.material.color.setHex(0xffd200);
    architrave.material.color.setHex(0xffd200);
    cornice.material.color.setHex(0xffd200);
  } else {
    const frame = mesh.userData.frameMesh;
    if (frame && frame.material) frame.material.color.setHex(0xe5b869);
  }
}

function unhighlightObject(mesh) {
  if (mesh.userData.isCenterPortal) {
    pediment.material.color.setHex(0xeeebe3);
    architrave.material.color.setHex(0xeeebe3);
    cornice.material.color.setHex(0xeeebe3);
  } else {
    const frame = mesh.userData.frameMesh;
    if (frame && frame.material) {
      frame.material.color.setHex(mesh.userData.item?.id === 'sb_01' ? 0xd4af37 : 0x14161c);
    }
  }
}

let lastHoverCheck = 0;
function checkHover(now) {
  if (drawer.classList.contains('is-open') || pointer.x === -999 || journey.progress < 0.38) {
    if (hoveredMesh) {
      unhighlightObject(hoveredMesh);
      hoveredMesh = null;
    }
    cursorTip?.classList.remove('is-on');
    return;
  }

  if (now - lastHoverCheck < 32) return;
  lastHoverCheck = now;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactiveObjects, false);

  if (hits.length > 0) {
    const mesh = hits[0].object;
    if (hoveredMesh !== mesh) {
      if (hoveredMesh) unhighlightObject(hoveredMesh);
      hoveredMesh = mesh;
      highlightObject(hoveredMesh);
      canvasContainer.style.cursor = 'pointer';
      cursorTip?.classList.add('is-on');
      if (cursorTipPill) {
        cursorTipPill.textContent = mesh.userData.isCenterPortal
          ? 'WALK OUT TO MITHRAKI SHOWROOM & POOL'
          : 'CLICK TO VIEW';
      }
    }
  } else {
    if (hoveredMesh) {
      unhighlightObject(hoveredMesh);
      hoveredMesh = null;
      canvasContainer.style.cursor = 'grab';
      cursorTip?.classList.remove('is-on');
    }
  }
}

// Click / Pointerdown handler
canvasContainer.addEventListener('pointerup', (e) => {
  if (e.target.closest('.gallery-nav') || e.target.closest('.drawer') || e.target.closest('.view-toggle') || e.target.closest('.room-nav') || e.target.closest('.portal-back-wrap') || e.target.closest('.awwwards-ribbon')) return;

  if (hoveredMesh) {
    if (hoveredMesh.userData.isCenterPortal) {
      // Step out to Mithraki Room
      journey.targetProgress = 0.30;
    } else if (hoveredMesh.userData.isPainting) {
      inspectPainting(hoveredMesh);
    }
  }
});

function inspectPainting(mesh) {
  isInspecting = true;
  inspectedMesh = mesh;
  openDrawer(mesh.userData.item);
}

function openDrawer(item) {
  if (!drawer || !drawerContent) return;

  drawerContent.innerHTML = `
    <div class="drawer__media">
      <img src="${item.image}" alt="${item.title}" loading="lazy" />
    </div>
    <span class="drawer__tag">${item.category}</span>
    <h3 class="drawer__title">${item.title}</h3>
    <p class="drawer__desc">${item.desc}</p>
    <div class="drawer__specs-grid">
      ${item.specs.map(s => `
        <div class="spec-item">
          <span class="spec-item__label">${s.label}</span>
          <span class="spec-item__value">${s.value}</span>
        </div>
      `).join('')}
    </div>
    <a href="${item.ctaUrl}" class="drawer__cta-btn" target="_blank" rel="noopener">
      EXPLORE IN 3D TWIN PLATFORM ↗
    </a>
  `;

  drawer.classList.add('is-open');
  drawerOverlay?.classList.add('is-open');
}

function closeDrawer() {
  drawer?.classList.remove('is-open');
  drawerOverlay?.classList.remove('is-open');
  isInspecting = false;
  inspectedMesh = null;
}

drawerClose?.addEventListener('click', closeDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);

// ------------------------------------------------ 10. CATALOGUE LIST VIEW
function renderListView() {
  if (!listViewGrid) return;
  listViewGrid.innerHTML = ALL_ITEMS.map((item, idx) => `
    <div class="list-card" data-idx="${idx}">
      <div class="list-card__media">
        <img src="${item.image}" alt="${item.title}" loading="lazy" />
      </div>
      <div class="list-card__body">
        <span class="list-card__num">${String(idx + 1).padStart(2, '0')} · ${item.category}</span>
        <h3 class="list-card__title">${item.title}</h3>
        <p class="list-card__sub">${item.artist}</p>
      </div>
    </div>
  `).join('');

  listViewGrid.querySelectorAll('.list-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx, 10);
      const item = ALL_ITEMS[idx];
      closeListView();
      // Jump to Rotunda Wall and open drawer
      journey.targetProgress = 0.40 + (idx % NUM_STATIONS) * (ANGLE_STEP / 10.0);
      openDrawer(item);
    });
  });
}

function openListView() {
  listView?.classList.add('is-visible');
  viewListBtn?.classList.add('is-active');
  viewGalleryBtn?.classList.remove('is-active');
  renderListView();
}

function closeListView() {
  listView?.classList.remove('is-visible');
  viewGalleryBtn?.classList.add('is-active');
  viewListBtn?.classList.remove('is-active');
}

viewListBtn?.addEventListener('click', openListView);
viewGalleryBtn?.addEventListener('click', closeListView);

// ------------------------------------------------ 11. AUDIO AMBIENCE SYNTHESIZER
let audioCtx = null;
let isAudioActive = true;
let ambientOsc = null;

function toggleAmbienceAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, audioCtx.currentTime); // Soft A2 tone

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      ambientOsc = osc;
    } catch {}
  }

  isAudioActive = !isAudioActive;
  if (isAudioActive) {
    audioToggle?.classList.add('is-active');
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  } else {
    audioToggle?.classList.remove('is-active');
    if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
  }
}

audioToggle?.addEventListener('click', toggleAmbienceAudio);

// ------------------------------------------------ 12. UNIFIED RENDER & ANIMATION LOOP (60-120 FPS)
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsedTime = clock.getElapsedTime();
  const now = performance.now();

  // Smooth lerp for journeyProgress
  const journeyDamping = 1 - Math.exp(-6.5 * delta);
  journey.progress += (journey.targetProgress - journey.progress) * journeyDamping;

  // Stage Management & Cross-fade
  if (journey.progress < 0.38) {
    // Stage 1: Nomadiic Horse Palace Walk
    journey.activeMode = 'palace';
    palaceContainer.style.opacity = '1';
    canvasContainer.style.opacity = '0';
    canvasContainer.style.pointerEvents = 'none';
    palaceContainer.style.pointerEvents = 'auto';
    portalBackWrap?.classList.remove('is-visible');

    // In palace mode, 3D text is rendered by WebGL in the scene, so 2D rotunda HUD is hidden
    if (waypointHud) waypointHud.style.opacity = '0';
    if (viewToggle) viewToggle.style.opacity = '0';
    if (helpTapLink) helpTapLink.style.opacity = '1';
    if (hintLine1) hintLine1.textContent = 'Scroll forward to walk through palace';
    if (hintLine2) hintLine2.textContent = '';

    // Map journey.progress [0.0, 0.38] -> Nomadiic camera progress:
    // 0.0 -> 0.037 (Reflecting Pool)
    // 0.15 -> 0.141 (Passage with columns)
    // 0.30 -> 0.300 (Mithraki Showroom)
    // 0.38 -> 0.380 (Doorway threshold)
    const nomadiicProgress = 0.037 + (journey.progress / 0.38) * (0.38 - 0.037);
    if (nomadiic) {
      if (typeof nomadiic.setProgressImmediate === 'function') {
        nomadiic.setProgressImmediate(nomadiicProgress);
      } else {
        nomadiic.progress = nomadiicProgress;
      }
    }

    // Dynamic Top Header Nav Status
    if (journey.progress < 0.12) {
      if (navStatusText) navStatusText.textContent = 'Station 1: Outdoor Reflecting Pool & Parthenon Sanctuary';
    } else if (journey.progress < 0.25) {
      if (navStatusText) navStatusText.textContent = 'Station 2: Classical Peristyle Colonnade Passage';
    } else {
      if (navStatusText) navStatusText.textContent = 'Station 3: Mithraki Coffee Machine Showroom';
    }
  } else if (journey.progress < 0.42) {
    // Transition Phase: Stepping through the temple doorway into the Rotunda Wall
    const blend = (journey.progress - 0.38) / 0.04;
    palaceContainer.style.opacity = String(Math.max(0, 1 - blend));
    canvasContainer.style.opacity = String(Math.min(1, blend));
    canvasContainer.style.pointerEvents = blend > 0.5 ? 'auto' : 'none';
    palaceContainer.style.pointerEvents = blend <= 0.5 ? 'auto' : 'none';

    if (waypointHud) waypointHud.style.opacity = String(blend);
    if (viewToggle) viewToggle.style.opacity = String(blend);
    if (helpTapLink) helpTapLink.style.opacity = String(1 - blend);

    if (nomadiic) {
      const transP = 0.38 + blend * 0.02;
      if (typeof nomadiic.setProgressImmediate === 'function') {
        nomadiic.setProgressImmediate(transP);
      } else {
        nomadiic.progress = transP;
      }
    }

    if (hudKicker) hudKicker.textContent = 'STEPPING INTO THE ROTUNDA GALLERY';
    if (hudTitle) hudTitle.textContent = 'Entering the 360° Curved Exhibition Wall';
    if (hudSubtitle) hudSubtitle.textContent = '64 fine art paintings & Acropolis classical muse';
    if (navStatusText) navStatusText.textContent = 'Threshold: Entering Curved Exhibition Rotunda';
  } else {
    // Stage 2: 3D Curved Exhibition Rotunda Wall
    journey.activeMode = 'rotunda';
    palaceContainer.style.opacity = '0';
    canvasContainer.style.opacity = '1';
    canvasContainer.style.pointerEvents = 'auto';
    palaceContainer.style.pointerEvents = 'none';
    portalBackWrap?.classList.add('is-visible');

    if (waypointHud) waypointHud.style.opacity = '1';
    if (viewToggle) viewToggle.style.opacity = '1';
    if (helpTapLink) helpTapLink.style.opacity = '0';
    if (hintLine1) hintLine1.textContent = 'Scroll or drag to walk 360° rotunda wall';
    if (hintLine2) hintLine2.textContent = 'Click any painting to inspect closer';

    // Walk around the 360° wall
    const rotundaRot = (journey.progress - 0.42) * 10.0;
    walkState.targetAngle = rotundaRot;
    const damping = 1 - Math.exp(-8.5 * delta);
    walkState.angle += (walkState.targetAngle - walkState.angle) * damping;

    // Update camera around the track
    if (isInspecting && inspectedMesh) {
      const inspectDamping = 1 - Math.exp(-6.5 * delta);
      currentEye.lerp(targetEye, inspectDamping);
      currentLookAt.lerp(targetLookAt, inspectDamping);
    } else {
      const a = walkState.angle;
      const lookAngle = a + 0.32;
      const eyeY = 1.55 + 0.008 * Math.sin(1.1 * elapsedTime);
      const lookY = 1.5;

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

    // Active station & dynamic captions
    const stationIndex = THREE.MathUtils.euclideanModulo(
      Math.round((walkState.angle + 0.22) / ANGLE_STEP),
      NUM_STATIONS
    );
    const activeStation = STATIONS[stationIndex];
    if (activeStation) {
      const item = activeStation.outerItem;
      if (hudKicker) hudKicker.textContent = `EXHIBITION ROTUNDA · ${activeStation.collection.title.toUpperCase()}`;
      if (hudTitle) hudTitle.textContent = item.title;
      if (hudSubtitle) hudSubtitle.textContent = `${item.artist} · Click painting to view museum details`;
      if (navStatusText) navStatusText.textContent = `Station ${stationIndex + 1} of 32: ${item.title}`;
    }
  }

  // Camera update
  camera.position.copy(currentEye);
  camera.lookAt(currentLookAt);

  // Inner wall distance fade
  const camDist = Math.hypot(camera.position.x, camera.position.z);
  const innerWallOpacity = THREE.MathUtils.smoothstep(camDist, 7.4 + 0.2, 7.4 + 1.8);
  innerWallMat.opacity = innerWallOpacity;
  innerLampMat.opacity = 0.55 * innerWallOpacity;

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
