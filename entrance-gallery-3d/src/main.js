import * as THREE from 'three';

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

// ------------------------------------------------ 3. High-Performance Three.js Scene Setup (60-120 FPS)
const scene = new THREE.Scene();
const BG_COLOR = 0x11151f;
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.Fog(BG_COLOR, 9, 36);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 70);

const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

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
// In Three.js cylinder geometry: thetaStart = PI/2 + 0.4, thetaLength = 2*PI - 0.8
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

// ------------------------------------------------ 4. CENTRAL CLASSICAL TEMPLE DOORWAY PORTAL
// Positioned at the inner opening at (0, 0, 7.35) facing the Station 0 corridor
const centerPortalGroup = new THREE.Group();
centerPortalGroup.position.set(0, 0, 7.35);
scene.add(centerPortalGroup);

// Marble Stylobate (Double-tier base steps)
const marbleMat = new THREE.MeshBasicMaterial({ color: 0xeeebe3 });
const darkWoodMat = new THREE.MeshBasicMaterial({ color: 0x3d271d });
const brassMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });

const stepLower = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 1.6), marbleMat);
stepLower.position.set(0, 0.09, 0);
centerPortalGroup.add(stepLower);

const stepUpper = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.18, 1.3), marbleMat);
stepUpper.position.set(0, 0.27, 0);
centerPortalGroup.add(stepUpper);

// Classical Fluted Columns (Left & Right)
function createClassicalColumn(xPos) {
  const colGroup = new THREE.Group();
  colGroup.position.set(xPos, 0.36, 0);

  // Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.72), marbleMat);
  plinth.position.y = 0.08;
  colGroup.add(plinth);

  // Torus Base
  const torus = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.37, 0.14, 24), marbleMat);
  torus.position.y = 0.23;
  colGroup.add(torus);

  // Shaft (Classical Fluted Cylinder)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 3.2, 24), marbleMat);
  shaft.position.y = 1.83;
  colGroup.add(shaft);

  // Capital (Abacus & Echinus)
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

// Classical Entablature (Architrave & Cornice)
const architrave = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.32, 0.65), marbleMat);
architrave.position.set(0, 4.22, 0);
centerPortalGroup.add(architrave);

const cornice = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.22, 0.78), marbleMat);
cornice.position.set(0, 4.49, 0);
centerPortalGroup.add(cornice);

// Triangular Pediment Gable Roof
const pedimentGeom = new THREE.CylinderGeometry(0.01, 2.3, 0.9, 3);
pedimentGeom.rotateY(Math.PI / 6);
const pediment = new THREE.Mesh(pedimentGeom, marbleMat);
pediment.position.set(0, 5.04, 0);
centerPortalGroup.add(pediment);

// Central Gold Medallion Relief
const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 24), brassMat);
medallion.rotation.x = Math.PI / 2;
medallion.position.set(0, 4.88, 0.28);
centerPortalGroup.add(medallion);

// Doorway Frame
const doorFrameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.4, 0.22), marbleMat);
doorFrameLeft.position.set(-1.24, 2.06, 0);
centerPortalGroup.add(doorFrameLeft);

const doorFrameRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.4, 0.22), marbleMat);
doorFrameRight.position.set(1.24, 2.06, 0);
centerPortalGroup.add(doorFrameRight);

const doorFrameTop = new THREE.Mesh(new THREE.BoxGeometry(2.66, 0.18, 0.22), marbleMat);
doorFrameTop.position.set(0, 3.76, 0);
centerPortalGroup.add(doorFrameTop);

// Open Double Doors (Pivoted open inwards)
const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(1.12, 3.3, 0.08), darkWoodMat);
leftDoor.position.set(-1.15, 2.01, -0.45);
leftDoor.rotation.y = Math.PI * 0.32;
centerPortalGroup.add(leftDoor);

const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(1.12, 3.3, 0.08), darkWoodMat);
rightDoor.position.set(1.15, 2.01, -0.45);
rightDoor.rotation.y = -Math.PI * 0.32;
centerPortalGroup.add(rightDoor);

// PORTAL VISTA: The Reflecting Pool & Temple from Nomadiic Horse
const poolVistaTexture = textureLoader.load('/textures/reflecting_pool.jpg');
poolVistaTexture.colorSpace = THREE.SRGBColorSpace;

const portalVistaMat = new THREE.MeshBasicMaterial({
  map: poolVistaTexture,
  side: THREE.DoubleSide
});
const portalVistaMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.36, 3.34), portalVistaMat);
portalVistaMesh.position.set(0, 2.03, -0.05);
centerPortalGroup.add(portalVistaMesh);

// Glowing Doorway Threshold
const thresholdGlowMat = new THREE.MeshBasicMaterial({
  color: 0xffd200,
  map: poolGlowTex,
  transparent: true,
  opacity: 0.38,
  depthWrite: false
});
const thresholdGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.0), thresholdGlowMat);
thresholdGlow.rotation.x = -Math.PI / 2;
thresholdGlow.position.set(0, 0.37, 0.6);
centerPortalGroup.add(thresholdGlow);

// Interactive hit mesh for Central Portal
const portalHitMesh = new THREE.Mesh(
  new THREE.BoxGeometry(2.8, 3.8, 0.8),
  new THREE.MeshBasicMaterial({ visible: false })
);
portalHitMesh.position.set(0, 2.0, 0);
portalHitMesh.userData = {
  isCenterPortal: true,
  title: 'Classical Reflecting Pool & Temple Sanctuary',
  desc: 'Step out to the neoclassical reflecting pool, peristyle colonnades, and temple sanctuary.'
};
centerPortalGroup.add(portalHitMesh);

// Outdoor sanctuary vista panorama behind the door (visible when stepping through)
const outdoorSanctuaryMat = new THREE.MeshBasicMaterial({
  map: poolVistaTexture,
  side: THREE.FrontSide
});
const outdoorSanctuary = new THREE.Mesh(new THREE.PlaneGeometry(16.0, 9.0), outdoorSanctuaryMat);
outdoorSanctuary.position.set(0, 4.5, -4.0);
scene.add(outdoorSanctuary);

// Reflecting pool water terrace
const poolWater = new THREE.Mesh(
  new THREE.PlaneGeometry(12.0, 14.0),
  new THREE.MeshBasicMaterial({ color: 0x141e2a })
);
poolWater.rotation.x = -Math.PI / 2;
poolWater.position.set(0, 0.02, 1.0);
scene.add(poolWater);

// ------------------------------------------------ 5. CURATED ARTWORK MESHES ON 360° WALLS
const interactiveObjects = [portalHitMesh];
const artworkMeshes = [];

const sharedFrameGeom = new THREE.BoxGeometry(1, 1, 0.06);
const sharedPlaneGeom = new THREE.PlaneGeometry(1, 1);
const placeholderCanvas = document.createElement('canvas');
placeholderCanvas.width = 128;
placeholderCanvas.height = 128;
const pctx = placeholderCanvas.getContext('2d');
pctx.fillStyle = '#181b24';
pctx.fillRect(0, 0, 128, 128);
const placeholderTex = new THREE.CanvasTexture(placeholderCanvas);

function createArtworkMesh(item, isOuter, stationIdx) {
  const angle = stationIdx * ANGLE_STEP;
  const radius = isOuter ? OUTER_RADIUS : INNER_RADIUS;

  const width = item.ratio > 1 ? 1.6 : 1.15;
  const height = width / item.ratio;

  // Frame
  const frameMat = new THREE.MeshBasicMaterial({ color: 0x14161c });
  const frameMesh = new THREE.Mesh(sharedFrameGeom, frameMat);
  frameMesh.scale.set(width + 0.12, height + 0.12, 1);

  // Artwork Canvas
  const artMat = new THREE.MeshBasicMaterial({
    map: placeholderTex,
    toneMapped: true
  });
  const artMesh = new THREE.Mesh(sharedPlaneGeom, artMat);
  artMesh.scale.set(width, height, 1);
  artMesh.position.z = 0.035;

  const artGroup = new THREE.Group();
  artGroup.add(frameMesh);
  artGroup.add(artMesh);

  artGroup.position.set(
    radius * Math.sin(angle),
    1.85,
    radius * Math.cos(angle)
  );

  // Face inwards toward track for outer wall, outwards for inner wall
  if (isOuter) {
    artGroup.rotation.y = angle + Math.PI;
  } else {
    artGroup.rotation.y = angle;
  }

  // Pure click & hover detection
  artMesh.userData = {
    isArtwork: true,
    item: item,
    stationIdx: stationIdx,
    isOuter: isOuter,
    frameMesh: frameMesh,
    artGroup: artGroup
  };

  interactiveObjects.push(artMesh);
  artworkMeshes.push(artMesh);

  // Lazy load artwork texture
  textureLoader.load(item.image, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    artMat.map = tex;
    artMat.needsUpdate = true;
  });

  return artGroup;
}

// Build 64 artworks (Clean walls: ZERO placards/text below paintings!)
for (let i = 0; i < NUM_STATIONS; i++) {
  const st = STATIONS[i];
  // Outer wall artwork
  scene.add(createArtworkMesh(st.outerItem, true, i));
  // Inner wall artwork (skip station 0 which is the open temple portal)
  if (i !== 0) {
    scene.add(createArtworkMesh(st.innerItem, false, i));
  }
}

// ------------------------------------------------ 6. CAMERA MOTION & INTERACTION STATE
const walkState = {
  angle: -0.20,
  targetAngle: -0.20,
  lastMoved: performance.now()
};

const entranceState = {
  phase: 'wait',
  startTime: performance.now(),
  fromAngle: -1.0,
  toAngle: -0.20,
  durationMs: 2400
};

const currentEye = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();
const targetEye = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const scratchWorldPos = new THREE.Vector3();
const scratchFacingDir = new THREE.Vector3();

let inspectedMesh = null;
let isInspecting = false;
let isPortalActive = false;
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
const portalBackWrap = document.getElementById('portal-back-wrap');
const portalBackBtn = document.getElementById('portal-back-btn');

// Initial camera position at threshold
function setupEntranceThreshold() {
  const a = walkState.angle;
  const c = a + 0.32;
  const entranceR = ROTUNDA_TRACK_R;

  currentEye.set(
    Math.sin(a) * entranceR,
    1.55,
    Math.cos(a) * entranceR
  );
  currentLookAt.set(
    Math.sin(c) * entranceR,
    1.5,
    Math.cos(c) * entranceR
  );
  camera.position.copy(currentEye);
  camera.lookAt(currentLookAt);
}
setupEntranceThreshold();

function updateWalkHint() {
  if (isPortalActive) {
    if (hintLine1) hintLine1.textContent = 'Viewing Neoclassical Reflecting Pool';
    if (hintLine2) hintLine2.textContent = 'Click Step Back or Esc to return to Rotunda';
    walkHint?.classList.add('is-lit');
  } else if (isInspecting) {
    if (hintLine1) hintLine1.textContent = 'Click away or Esc to step back';
    if (hintLine2) hintLine2.textContent = 'Viewing artwork details';
    walkHint?.classList.add('is-lit');
  } else {
    if (hintLine1) hintLine1.textContent = 'Scroll or drag to walk round';
    if (hintLine2) hintLine2.textContent = 'Click any painting or center temple door';
    walkHint?.classList.remove('is-lit');
  }
}

function updateCaption(colIdx, item) {
  if (isPortalActive) {
    if (roomTitle) roomTitle.textContent = 'Reflecting Pool & Temple Colonnade';
    if (roomMore) roomMore.textContent = 'STEP BACK TO ROTUNDA →';
    return;
  }
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

// ------------------------------------------------ 7. ZOOM IN & INSPECTOR DRAWER
function lookCloserAt(mesh) {
  inspectedMesh = mesh;
  isInspecting = true;
  isPortalActive = false;
  portalBackWrap?.classList.remove('is-visible');
  walkState.lastMoved = performance.now();

  mesh.getWorldPosition(scratchWorldPos);
  mesh.getWorldDirection(scratchFacingDir);

  // Stand 2.2m directly facing the artwork at eye level
  targetEye.copy(scratchWorldPos).addScaledVector(scratchFacingDir, 2.2);
  targetEye.y = 1.6;

  targetLookAt.copy(scratchWorldPos);
  targetLookAt.y -= 0.08;

  updateWalkHint();
  if (cursorTipPill) cursorTipPill.textContent = 'VIEWING ARTWORK';

  const item = mesh.userData.item;
  if (item) {
    activeExhibit = item;
    const colIdx = mesh.userData.stationIdx !== undefined ? STATIONS[mesh.userData.stationIdx].collectionIdx : 0;
    updateCaption(colIdx, item);
  }
}

// Step into Central Temple Portal looking out to reflecting pool
function enterCentralPortal() {
  isPortalActive = true;
  isInspecting = false;
  inspectedMesh = null;
  closeDrawer();

  // Position camera standing on terrace looking out across reflecting pool
  targetEye.set(0, 1.65, 7.1);
  targetLookAt.set(0, 1.55, -16.0);

  portalBackWrap?.classList.add('is-visible');
  updateWalkHint();
  updateCaption(0, null);
}

function stepBack() {
  inspectedMesh = null;
  isInspecting = false;
  isPortalActive = false;
  portalBackWrap?.classList.remove('is-visible');
  closeDrawer();
  updateWalkHint();
  if (cursorTipPill) cursorTipPill.textContent = 'CLICK TO VIEW';

  const stationIndex = THREE.MathUtils.euclideanModulo(
    Math.round((walkState.angle + 0.22) / ANGLE_STEP),
    NUM_STATIONS
  );
  const activeStation = STATIONS[stationIndex];
  if (activeStation) {
    updateCaption(activeStation.collectionIdx, activeStation.outerItem);
  }
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
portalBackBtn?.addEventListener('click', stepBack);

roomMore?.addEventListener('click', (e) => {
  e.preventDefault();
  if (isPortalActive) {
    stepBack();
    return;
  }
  if (activeExhibit) {
    openInspector(activeExhibit);
  }
});

// Escape key steps back
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    stepBack();
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (isInspecting || isPortalActive) stepBack();
    if (entranceState.phase !== 'done') entranceState.phase = 'done';
    walkState.targetAngle += 2 * ANGLE_STEP;
    walkState.lastMoved = performance.now();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (isInspecting || isPortalActive) stepBack();
    if (entranceState.phase !== 'done') entranceState.phase = 'done';
    walkState.targetAngle -= 2 * ANGLE_STEP;
    walkState.lastMoved = performance.now();
  }
});

// ------------------------------------------------ 8. FLUID SCROLL & DRAG SYSTEM (60-120 FPS)
window.addEventListener('wheel', (e) => {
  if (drawer.classList.contains('is-open')) return;
  e.preventDefault();

  if (isInspecting || isPortalActive) {
    stepBack();
    return;
  }

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

function highlightObject(mesh) {
  if (mesh.userData.isCenterPortal) {
    pediment.material.color.setHex(0xffd200);
    architrave.material.color.setHex(0xffd200);
    cornice.material.color.setHex(0xffd200);
  } else {
    const frame = mesh.userData.frameMesh;
    if (frame && frame.material) {
      frame.material.color.setHex(0xe5b869);
    }
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
      frame.material.color.setHex(0x14161c);
    }
  }
}

let lastHoverCheck = 0;
function checkHover(now) {
  if (isDraggingCamera || drawer.classList.contains('is-open') || pointer.x === -999) {
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
      container.style.cursor = 'pointer';
      cursorTip?.classList.add('is-on');
      if (cursorTipPill) {
        cursorTipPill.textContent = mesh.userData.isCenterPortal ? 'WALK OUT TO REFLECTING POOL' : 'CLICK TO VIEW';
      }
    }
  } else {
    if (hoveredMesh) {
      unhighlightObject(hoveredMesh);
      hoveredMesh = null;
      container.style.cursor = 'grab';
      cursorTip?.classList.remove('is-on');
    }
  }
}

container.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.gallery-nav') || e.target.closest('.drawer') || e.target.closest('.view-toggle') || e.target.closest('.room-nav') || e.target.closest('.portal-back-wrap')) return;

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

  if (totalMove > 14 && Math.abs(pointerVelocity) > 0.08) {
    const clampedV = Math.max(-2.5, Math.min(2.5, pointerVelocity));
    walkState.targetAngle -= 180 * clampedV * 0.0022;
    walkState.lastMoved = performance.now();
    return;
  }

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
    if (mesh.userData.isCenterPortal) {
      enterCentralPortal();
      return;
    }
    const item = mesh.userData.item;
    if (item) {
      lookCloserAt(mesh);
      openInspector(item);
    }
  } else {
    if (isInspecting || isPortalActive || drawer.classList.contains('is-open')) {
      stepBack();
    }
  }
}

// Navigation arrows
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
        <span class="list-card__num">#${String(idx + 1).padStart(2, '0')}</span>
        <h3 class="list-card__title">${item.title}</h3>
        <p class="list-card__sub">${item.artist} · ${item.category}</p>
      </div>
    </article>
  `).join('');

  listViewGrid.querySelectorAll('.list-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx, 10);
      setViewMode('gallery');
      const mesh = artworkMeshes[idx];
      if (mesh) {
        lookCloserAt(mesh);
        openInspector(mesh.userData.item);
      }
    });
  });
}

// ------------------------------------------------ 9. SILKY SMOOTH 60-120 FPS RENDER LOOP
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsedTime = clock.getElapsedTime();
  const now = performance.now();

  // Gentle water reflection pulse on portal threshold
  thresholdGlowMat.opacity = 0.30 + 0.08 * Math.sin(elapsedTime * 2.2);

  // Entrance walk-in animation
  if (entranceState.phase === 'wait') {
    if (now - entranceState.startTime > 300) {
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
    if (!isDraggingCamera && !isInspecting && !isPortalActive && !drawer.classList.contains('is-open')) {
      if (now - walkState.lastMoved > 3500) {
        walkState.targetAngle += 0.004 * delta;
      }
    }
    const damping = 1 - Math.exp(-8.5 * delta);
    walkState.angle += (walkState.targetAngle - walkState.angle) * damping;
  }

  // Camera positioning
  if (isPortalActive) {
    const portalDamping = 1 - Math.exp(-7.0 * delta);
    currentEye.lerp(targetEye, portalDamping);
    scratchFacingDir.copy(targetLookAt);
    scratchFacingDir.x += 0.3 * mouseParallax.x;
    scratchFacingDir.y += 0.2 * mouseParallax.y;
    currentLookAt.lerp(scratchFacingDir, portalDamping);
  } else if (isInspecting && inspectedMesh) {
    const inspectDamping = 1 - Math.exp(-6.5 * delta);
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

  camera.position.copy(currentEye);
  camera.lookAt(currentLookAt);

  // Inner wall distance fade
  const camDist = Math.hypot(camera.position.x, camera.position.z);
  const innerWallOpacity = THREE.MathUtils.smoothstep(camDist, 7.4 + 0.2, 7.4 + 1.8);
  innerWallMat.opacity = innerWallOpacity;
  innerLampMat.opacity = 0.55 * innerWallOpacity;

  // Update room caption
  if (!isInspecting && !isPortalActive && entranceState.phase !== 'wait') {
    const stationIndex = THREE.MathUtils.euclideanModulo(
      Math.round((walkState.angle + 0.22) / ANGLE_STEP),
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
