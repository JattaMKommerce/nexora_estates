import * as THREE from 'three';

// ------------------------------------------------ 1. Curated Fine Art Collections Data (Shutabug Masterpieces)
export const COLLECTIONS = [
  {
    id: 'lagos-love',
    title: 'From Lagos, with love',
    subtitle: 'Contemporary Solar Pigments & Nostalgia · Mayowa Alabi',
    desc: 'An exploration of urban rhythm, coastal twilight reflections, and early music television iconography celebrating Black and African diaspora culture.',
    outerItems: [
      { id: 'sb_01', title: 'Before the day i die', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_01.webp', ratio: 1.38 },
      { id: 'sb_02', title: 'Check up on it', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_02.webp', ratio: 1.38 },
      { id: 'sb_03', title: 'Crank Dat', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_03.webp', ratio: 1.40 },
      { id: 'sb_04', title: 'Do you remember the time?', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_04.webp', ratio: 1.39 },
      { id: 'sb_05', title: 'Heyah!', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_05.webp', ratio: 1.38 },
      { id: 'sb_06', title: 'I’ve got 5 passports i’m never going to jail', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_06.webp', ratio: 1.38 },
      { id: 'sb_07', title: 'Intl’ Playas Anthem', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_07.webp', ratio: 1.39 }
    ],
    innerItems: [
      { id: 'sb_08', title: 'O', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_08.webp', ratio: 1.37 },
      { id: 'p01', title: 'Lagos Sun & Indigo', artist: 'Nexora Atelier Collection', category: 'From Lagos, with love', image: '/paintings/p01.jpg', ratio: 0.8 },
      { id: 'sb_09', title: '‏  (كورة)', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_09.webp', ratio: 0.72 },
      { id: 'sb_10', title: 'Al-Maghrib', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_10.webp', ratio: 0.73 },
      { id: 'sb_11', title: 'bɔɔlbɔ', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_11.webp', ratio: 0.73 },
      { id: 'sb_12', title: 'Burkina Faso', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_12.webp', ratio: 0.73 },
      { id: 'sb_13', title: 'Cabo Verde', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_13.webp', ratio: 0.73 },
      { id: 'sb_14', title: 'Cameroun', artist: 'Mayowa Alabi', category: 'From Lagos, with love', image: '/paintings/sb_14.webp', ratio: 0.73 }
    ]
  },
  {
    id: 'blck-bourgie',
    title: 'BLCK & Bourgie',
    subtitle: 'Regal Figurative Portraits & Gold Tones',
    desc: 'Intimate, majestic portraiture celebrating identity, cultural lineage, and quiet elegance with rich black velour and shimmering gold leaf accents.',
    outerItems: [
      { id: 'sb_15', title: 'Côte d’Ivoire', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_15.webp', ratio: 0.72 },
      { id: 'sb_16', title: 'Dzayer', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_16.webp', ratio: 0.73 },
      { id: 'sb_17', title: 'Ojude Oba', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_17.webp', ratio: 0.73 },
      { id: 'sb_18', title: 'Abiamo Ode Orun', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_18.webp', ratio: 0.56 },
      { id: 'sb_19', title: 'Bam', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_19.webp', ratio: 1.38 },
      { id: 'sb_20', title: 'Blood of Jesus', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_20.webp', ratio: 1.38 },
      { id: 'sb_21', title: 'Fire Drill', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_21.webp', ratio: 1.38 }
    ],
    innerItems: [
      { id: 'p02', title: 'Terra Incognita', artist: 'Atelier Alabi Tribute', category: 'BLCK & Bourgie', image: '/paintings/p02.jpg', ratio: 0.8 },
      { id: 'sb_22', title: 'Friday Night', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_22.webp', ratio: 0.73 },
      { id: 'sb_23', title: 'Go Slow', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_23.webp', ratio: 0.75 },
      { id: 'sb_24', title: 'Isale Eko', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_24.webp', ratio: 0.60 },
      { id: 'sb_25', title: 'Friday in the City', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_25.webp', ratio: 0.73 },
      { id: 'sb_26', title: 'Rye Lane', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_26.webp', ratio: 1.38 },
      { id: 'sb_27', title: 'Boy n da Hood', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_27.webp', ratio: 0.73 },
      { id: 'sb_28', title: 'Odyssey', artist: 'Mayowa Alabi', category: 'BLCK & Bourgie', image: '/paintings/sb_28.webp', ratio: 1.38 }
    ]
  },
  {
    id: 'dnce-carnaval',
    title: 'DNCE & Carnaval',
    subtitle: 'Kinetic Movement & Festival Chromatics',
    desc: 'Dynamic compositions capturing the electric pulse of festival parades, celebratory dances, and nocturnal street masquerades across Lagos and the diaspora.',
    outerItems: [
      { id: 'sb_29', title: 'Sunday Freestyle', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_29.webp', ratio: 0.73 },
      { id: 'sb_30', title: 'Let it all Work out', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_30.webp', ratio: 1.38 },
      { id: 'sb_31', title: 'Match week 1', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_31.webp', ratio: 1.38 },
      { id: 'sb_32', title: 'Rye Lane High', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_32.webp', ratio: 1.37 },
      { id: 'sb_33', title: 'The Gardner', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_33.webp', ratio: 0.72 },
      { id: 'sb_34', title: 'These Streets Are our Own', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_34.webp', ratio: 1.38 },
      { id: 'sb_35', title: 'Dap of Champions', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_35.webp', ratio: 0.73 }
    ],
    innerItems: [
      { id: 'p03', title: 'Emerald Horizon & Gold', artist: 'Heritage Series', category: 'DNCE & Carnaval', image: '/paintings/p03.jpg', ratio: 0.8 },
      { id: 'sb_36', title: 'Suffering from success', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_36.webp', ratio: 0.73 },
      { id: 'sb_37', title: 'Case 022', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_37.webp', ratio: 0.73 },
      { id: 'sb_38', title: 'Case 023', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_38.webp', ratio: 0.73 },
      { id: 'sb_39', title: 'Case 024', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_39.webp', ratio: 0.73 },
      { id: 'sb_40', title: 'Case 025', artist: 'Mayowa Alabi', category: 'DNCE & Carnaval', image: '/paintings/sb_40.webp', ratio: 0.73 },
      { id: 'p04', title: 'Symphony of Vanguard', artist: 'Modern Diaspora Study', category: 'DNCE & Carnaval', image: '/paintings/p04.jpg', ratio: 0.8 },
      { id: 'p05', title: 'The Golden Passage', artist: 'Kinetic Expressionism', category: 'DNCE & Carnaval', image: '/paintings/p05.jpg', ratio: 0.8 }
    ]
  },
  {
    id: 'adumadan-heritage',
    title: 'Adumadan & Heritage',
    subtitle: 'Sculptural Mineral Pigments & Modern Ancestry',
    desc: 'Geometric planes, deep terracotta ochres, and basalt textures blending ancient West African sculpture with contemporary digital museum art.',
    outerItems: [
      { id: 'sb_41', title: 'Case 027', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_41.webp', ratio: 0.73 },
      { id: 'sb_42', title: 'Case 028', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_42.webp', ratio: 0.73 },
      { id: 'sb_43', title: 'Case 001', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_43.webp', ratio: 0.73 },
      { id: 'sb_44', title: 'Case 002', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_44.webp', ratio: 0.73 },
      { id: 'sb_45', title: 'BSHP', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_45.webp', ratio: 0.73 },
      { id: 'sb_46', title: 'Catty', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_46.webp', ratio: 0.73 },
      { id: 'sb_47', title: 'Day Walker', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_47.webp', ratio: 0.73 }
    ],
    innerItems: [
      { id: 'p06', title: 'Cobalt Odyssey', artist: 'Maritime Contemporary', category: 'Adumadan & Heritage', image: '/paintings/p06.jpg', ratio: 0.8 },
      { id: 'sb_48', title: 'Electric', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_48.webp', ratio: 0.73 },
      { id: 'sb_49', title: 'Invincible', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_49.webp', ratio: 0.73 },
      { id: 'sb_50', title: 'Lightening', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_50.webp', ratio: 0.73 },
      { id: 'sb_51', title: 'pUNk', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_51.webp', ratio: 0.73 },
      { id: 'sb_52', title: 'Samurai', artist: 'Mayowa Alabi', category: 'Adumadan & Heritage', image: '/paintings/sb_52.webp', ratio: 0.73 },
      { id: 'p07', title: 'Ochre & Basalt', artist: 'Architectural Elements', category: 'Adumadan & Heritage', image: '/paintings/p07.jpg', ratio: 0.8 },
      { id: 'p08', title: 'Elysian Pulse', artist: 'Crown Collection', category: 'Adumadan & Heritage', image: '/paintings/p08.jpg', ratio: 0.8 }
    ]
  }
];

// Enrich item specs & description
COLLECTIONS.forEach(col => {
  [...col.outerItems, ...col.innerItems].forEach(item => {
    item.collectionTitle = col.title;
    item.desc = item.desc || `${item.title} — a fine art digital painting from the celebrated ${col.title} series by ${item.artist}. Features premium museum-grade color pigments, deep tactile textures, and architectural framing.`;
    item.specs = item.specs || [
      { label: 'Medium', value: 'Original Fine Art Digital Painting' },
      { label: 'Artist', value: item.artist },
      { label: 'Collection', value: col.title },
      { label: 'Aspect Ratio', value: item.ratio > 1 ? 'Landscape (16:10)' : 'Portrait (3:4)' }
    ];
    item.ctaUrl = item.ctaUrl || 'http://localhost:5174/';
  });
});

// Flat array for 2D catalogue list view
export const ALL_ITEMS = COLLECTIONS.flatMap(col => [
  ...col.outerItems,
  ...col.innerItems
]);

// ------------------------------------------------ 2. Build 32 Stations Around Full 360° Circle
// 4 collections × 8 stations = 32 stations. Every single degree is filled!
const NUM_STATIONS = 32;
const ANGLE_STEP = (Math.PI * 2) / NUM_STATIONS; // Exact full 360-degree closure!
const OUTER_RADIUS = 11.97;
const INNER_RADIUS = 7.43;
const ROTUNDA_TRACK_R = 9.7; // Walking track between outer and inner walls

const STATIONS = [];
COLLECTIONS.forEach((col, colIdx) => {
  // Station 0 of collection: Collection Plaque on Outer Wall, Painting on Inner Wall
  STATIONS.push({
    stationIdx: STATIONS.length,
    collectionIdx: colIdx,
    collection: col,
    outer: { kind: 'plaque', title: col.title, subtitle: `${col.outerItems.length + col.innerItems.length} Artworks`, desc: col.subtitle },
    inner: col.innerItems[0]
  });

  // Stations 1 to 7: Fine Art Painting on Outer Wall, Painting on Inner Wall
  for (let s = 0; s < 7; s++) {
    STATIONS.push({
      stationIdx: STATIONS.length,
      collectionIdx: colIdx,
      collection: col,
      outer: { kind: 'artwork', item: col.outerItems[s] },
      inner: col.innerItems[s + 1]
    });
  }
});

// ------------------------------------------------ 3. Three.js Scene Initialization
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const BG_COLOR = 0x11151f; // Deep dark museum environment (Shutabug)
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.Fog(BG_COLOR, 8, 25);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 60);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';

// ------------------------------------------------ 4. Architectural Geometry & Wall Surfaces
// Circular Floor Ring Geometry [7.2, 12.2, 160]
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x2a2a2e,
  roughness: 0.65,
  metalness: 0.1,
  toneMapped: false
});
const floorMesh = new THREE.Mesh(new THREE.RingGeometry(7.2, 12.2, 160), floorMat);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.set(0, 0, 0);
scene.add(floorMesh);

// Outer Curved Cylindrical Wall: Radius 12.0, Height 3.6
const outerWallMat = new THREE.MeshStandardMaterial({
  color: 0xe9e7e1,
  roughness: 0.76,
  metalness: 0.02,
  side: THREE.BackSide,
  toneMapped: false
});
const outerWall = new THREE.Mesh(new THREE.CylinderGeometry(12.0, 12.0, 3.6, 160, 1, true), outerWallMat);
outerWall.position.set(0, 1.8, 0);
scene.add(outerWall);

// Inner Curved Cylindrical Wall: Radius 7.4, Height 3.6 (with distance opacity fading)
const innerWallMat = new THREE.MeshStandardMaterial({
  color: 0xe2e0da,
  roughness: 0.76,
  metalness: 0.02,
  side: THREE.FrontSide,
  transparent: true,
  opacity: 1.0,
  toneMapped: false
});
const innerWall = new THREE.Mesh(new THREE.CylinderGeometry(7.4, 7.4, 3.6, 120, 1, true), innerWallMat);
innerWall.position.set(0, 1.8, 0);
scene.add(innerWall);

// ------------------------------------------------ 5. Lighting & Radial Glow Materials
const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x11151f, 0.7);
scene.add(hemiLight);

const centerLight = new THREE.PointLight(0xfff6ec, 1.4, 35);
centerLight.position.set(0, 2.0, 0);
scene.add(centerLight);

// Glow generator
function createGlowTexture(colorStart, colorMid, colorEnd) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, colorStart);
  grad.addColorStop(0.35, colorMid);
  grad.addColorStop(1, colorEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const poolGlowTex = createGlowTexture('rgba(255, 232, 194, 0.45)', 'rgba(255, 220, 160, 0.22)', 'rgba(255, 210, 140, 0)');
const poolMat = new THREE.MeshBasicMaterial({
  color: 0xffe8c2,
  map: poolGlowTex,
  transparent: true,
  opacity: 0.16,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  toneMapped: false
});

const lampGlowTex = createGlowTexture('rgba(255, 241, 214, 0.85)', 'rgba(255, 235, 195, 0.4)', 'rgba(255, 220, 160, 0)');
const innerLampMat = new THREE.MeshBasicMaterial({
  color: 0xfff1d6,
  map: lampGlowTex,
  transparent: true,
  opacity: 0.55,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  toneMapped: false
});

// ------------------------------------------------ 6. Canvas Texture Placards & Collection Plaques
function createPlacardTexture(artist, title, meta) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#f7f6f2';
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = '#e2dfd9';
  ctx.lineWidth = 3;
  ctx.strokeRect(3, 3, 506, 250);

  ctx.fillStyle = '#1a1a1a';
  ctx.textBaseline = 'top';

  const clampText = (str, maxW) => {
    let t = str;
    while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -1);
    return t === str ? t : `${t.trimEnd()}…`;
  };

  // Artist
  ctx.font = '600 24px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(clampText(artist, 450), 30, 32);

  // Artwork Title (Italic Serif)
  ctx.font = 'italic 400 32px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(clampText(title, 450), 30, 78);

  // Metadata
  ctx.font = '600 18px ui-monospace, Menlo, Consolas, monospace';
  ctx.globalAlpha = 0.65;
  ctx.fillText(clampText(meta.toUpperCase(), 450), 30, 185);
  ctx.globalAlpha = 1.0;

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function createPlaqueTexture(title, subtitle) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 640;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#efede7';
  ctx.fillRect(0, 0, 512, 640);
  ctx.strokeStyle = '#dcd8cf';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 504, 632);

  ctx.fillStyle = '#1a1a1a';
  ctx.textBaseline = 'top';

  // Section badge
  ctx.font = '700 16px ui-monospace, Menlo, Consolas, monospace';
  ctx.letterSpacing = '3px';
  ctx.fillStyle = '#b38200';
  ctx.fillText('COLLECTION EXHIBIT', 45, 60);

  // Title
  ctx.fillStyle = '#1a1a1a';
  ctx.font = '400 46px "Cormorant Garamond", Georgia, serif';
  const words = title.toUpperCase().split(' ');
  let line = '';
  let y = 120;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > 420 && line) {
      ctx.fillText(line, 45, y);
      y += 54;
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, 45, y);

  // Subtitle
  y += 65;
  ctx.font = '600 20px ui-monospace, Menlo, monospace';
  ctx.globalAlpha = 0.6;
  ctx.fillText(subtitle.toUpperCase(), 45, y);
  ctx.globalAlpha = 1.0;

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

// ------------------------------------------------ 7. Mount All 32 Stations Around 360° Cylinder
const interactiveObjects = [];
const spotlights = [];

STATIONS.forEach((station, i) => {
  const angle = i * ANGLE_STEP;
  const stationGroup = new THREE.Group();

  // ---------------- Outer Wall Station (Facing Inward)
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

  if (station.outer.kind === 'plaque') {
    // Collection Plaque
    const plaqueTex = createPlaqueTexture(station.outer.title, station.outer.subtitle);
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: plaqueTex,
      roughness: 0.45,
      metalness: 0.05,
      toneMapped: false
    });
    const plaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.44), plaqueMat);
    plaqueMesh.position.set(0, 1.55, 0.03);
    plaqueMesh.userData = {
      isPlaque: true,
      title: station.outer.title,
      subtitle: station.outer.subtitle,
      desc: station.outer.desc,
      stationIdx: i
    };
    outerGroup.add(plaqueMesh);
    interactiveObjects.push(plaqueMesh);
  } else {
    // Outer Wall Fine Art Painting
    const item = station.outer.item;
    const ratio = THREE.MathUtils.clamp(item.ratio || 1.0, 0.65, 1.78);
    const pW = 1.45 * ratio;
    const pH = 1.45;

    const tex = textureLoader.load(item.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;

    const artMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.35,
      metalness: 0.04,
      toneMapped: false
    });
    const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW, pH), artMat);
    artMesh.position.set(0, 1.6, 0.03);
    artMesh.userData = { isArtwork: true, item, stationIdx: i, wallSide: 'outer' };
    outerGroup.add(artMesh);
    interactiveObjects.push(artMesh);

    // Slim museum frame
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x14161c });
    const frameMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW + 0.06, pH + 0.06), frameMat);
    frameMesh.position.set(0, 1.6, 0.015);
    outerGroup.add(frameMesh);

    // Placard Card
    const placardTex = createPlacardTexture(item.artist, item.title, item.category);
    const placardMat = new THREE.MeshStandardMaterial({ map: placardTex, roughness: 0.6, toneMapped: false });
    const placardMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.28), placardMat);
    placardMesh.position.set(-pW / 2 + 0.28, 1.6 - pH / 2 - 0.22, 0.03);
    outerGroup.add(placardMesh);
  }

  // SpotLight on Outer Station
  const spot = new THREE.SpotLight(0xfff1dc, 3.8);
  spot.position.set(
    (OUTER_RADIUS - 2.2) * Math.sin(angle),
    3.4,
    (OUTER_RADIUS - 2.2) * Math.cos(angle)
  );
  const targetObj = new THREE.Object3D();
  targetObj.position.set(outerX, 1.6, outerZ);
  scene.add(targetObj);
  spot.target = targetObj;
  spot.angle = 0.65;
  spot.penumbra = 0.85;
  spot.decay = 1.2;
  spot.distance = 16;
  scene.add(spot);
  spotlights.push(spot);

  stationGroup.add(outerGroup);

  // ---------------- Inner Wall Station (Facing Outward)
  if (station.inner) {
    const item = station.inner;
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

    const ratio = THREE.MathUtils.clamp(item.ratio || 1.0, 0.65, 1.78);
    const wLimit = 2.5 / 12 * 14.8 - 0.7; // ~2.38
    const iHeight = Math.min(1.305, wLimit / ratio);
    const iWidth = iHeight * ratio;

    const tex = textureLoader.load(item.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;

    const artMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.35,
      metalness: 0.04,
      toneMapped: false
    });
    const artMesh = new THREE.Mesh(new THREE.PlaneGeometry(iWidth, iHeight), artMat);
    artMesh.position.set(0, 1.6, 0.03);
    artMesh.userData = { isArtwork: true, item, stationIdx: i, wallSide: 'inner' };
    innerGroup.add(artMesh);
    interactiveObjects.push(artMesh);

    // Slim frame
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x14161c });
    const frameMesh = new THREE.Mesh(new THREE.PlaneGeometry(iWidth + 0.06, iHeight + 0.06), frameMat);
    frameMesh.position.set(0, 1.6, 0.015);
    innerGroup.add(frameMesh);

    // Museum Label Card
    const placardTex = createPlacardTexture(item.artist, item.title, item.category);
    const placardMat = new THREE.MeshStandardMaterial({ map: placardTex, roughness: 0.6, toneMapped: false });
    const placardMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.28), placardMat);
    placardMesh.position.set(-iWidth / 2 + 0.28, 1.6 - iHeight / 2 - 0.22, 0.03);
    innerGroup.add(placardMesh);

    stationGroup.add(innerGroup);
  }

  scene.add(stationGroup);
});

// ------------------------------------------------ 8. State, Controls & Camera Engine
const walkState = {
  angle: 0.0,
  targetAngle: 0.0,
  velocity: 0,
  lastMoved: performance.now()
};

const entranceState = {
  phase: 'wait', // 'wait' -> 'run' -> 'done'
  startTime: performance.now(),
  fromAngle: -5.0,
  toAngle: 0.0,
  durationMs: 5000
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

const pointer = new THREE.Vector2();
const mouseParallax = { x: 0, y: 0 };
let isPointerDown = false;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerLastX = 0;
let pointerTimestamp = 0;
let pointerVelocity = 0;
let hasDragged = false;

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

// Initial camera at entrance threshold
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

// Update UI cues
function updateWalkHint() {
  if (isInspecting) {
    if (hintLine1) hintLine1.textContent = 'Click the painting to open it';
    if (hintLine2) hintLine2.textContent = 'Esc or click away to step back';
    walkHint?.classList.add('is-lit');
  } else {
    if (hintLine1) hintLine1.textContent = 'Scroll or drag to walk round';
    if (hintLine2) hintLine2.textContent = 'Click a painting to look closer';
    walkHint?.classList.remove('is-lit');
  }
}

function updateCaption(colIdx, item) {
  if (colIdx !== currentCollectionIdx || item) {
    currentCollectionIdx = colIdx;
    const col = COLLECTIONS[colIdx] || COLLECTIONS[0];
    if (roomTitle) {
      roomTitle.textContent = item ? item.title : col.title;
    }
    if (roomMore) {
      roomMore.textContent = item ? 'VIEW PAINTING DETAILS →' : 'ENTER THE COLLECTION →';
    }
  }
}

// ------------------------------------------------ 9. Zoom-In / Inspection Actions
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
  targetLookAt.y -= 0.12;

  updateWalkHint();
  if (cursorTipPill) cursorTipPill.textContent = 'OPEN THE EXHIBIT';

  const item = mesh.userData.item;
  if (item) {
    activeExhibit = item;
    const colIdx = mesh.userData.stationIdx !== undefined ? STATIONS[mesh.userData.stationIdx].collectionIdx : 0;
    updateCaption(colIdx, item);
  }
}

function stepBack() {
  if (!isInspecting && !drawer.classList.contains('is-open')) return;
  inspectedMesh = null;
  isInspecting = false;
  closeDrawer();
  updateWalkHint();
  if (cursorTipPill) cursorTipPill.textContent = 'LOOK CLOSER';
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

drawerClose?.addEventListener('click', closeDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);

// ------------------------------------------------ 10. User Controls (Wheel, Drag, Keyboard)
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    stepBack();
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (isInspecting) stepBack();
    walkState.targetAngle += 2 * ANGLE_STEP;
    walkState.lastMoved = performance.now();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (isInspecting) stepBack();
    walkState.targetAngle -= 2 * ANGLE_STEP;
    walkState.lastMoved = performance.now();
  }
});

window.addEventListener('wheel', (e) => {
  if (drawer.classList.contains('is-open')) return;
  e.preventDefault();
  if (isInspecting) {
    stepBack();
    return;
  }
  if (entranceState.phase === 'wait') {
    entranceState.phase = 'run';
    entranceState.startTime = performance.now();
  }

  const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
  const clampedDelta = Math.max(-120, Math.min(120, delta));
  walkState.targetAngle += 0.0009 * clampedDelta;
  walkState.lastMoved = performance.now();
}, { passive: false });

window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.gallery-nav') || e.target.closest('.drawer') || e.target.closest('.view-toggle') || e.target.closest('.room-nav')) return;

  isPointerDown = true;
  hasDragged = false;
  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  pointerLastX = e.clientX;
  pointerTimestamp = performance.now();
  pointerVelocity = 0;

  if (entranceState.phase === 'wait') {
    entranceState.phase = 'run';
    entranceState.startTime = performance.now();
  }
});

window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  mouseParallax.x = pointer.x;
  mouseParallax.y = pointer.y;

  if (cursorTip) {
    cursorTip.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  }

  if (isPointerDown && !drawer.classList.contains('is-open')) {
    const deltaX = e.clientX - pointerLastX;
    const totalDist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
    if (totalDist > 4) {
      hasDragged = true;
      if (isInspecting) stepBack();
    }

    walkState.targetAngle -= 0.0022 * deltaX;
    walkState.lastMoved = performance.now();

    const dt = Math.max(1, performance.now() - pointerTimestamp);
    pointerVelocity = 0.6 * pointerVelocity + (deltaX / dt) * 0.4;
    pointerTimestamp = performance.now();
    pointerLastX = e.clientX;
  }

  // Hover raycasting
  if (!isPointerDown && !isInspecting && !drawer.classList.contains('is-open')) {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactiveObjects, false);

    if (hits.length > 0) {
      const mesh = hits[0].object;
      if (hoveredMesh !== mesh) {
        if (hoveredMesh) {
          const oldSpot = spotlights[hoveredMesh.userData.stationIdx];
          if (oldSpot) oldSpot.intensity = 3.8;
        }
        hoveredMesh = mesh;
        container.style.cursor = 'pointer';
        cursorTip?.classList.add('is-on');

        if (cursorTipPill) {
          cursorTipPill.textContent = mesh.userData.isPlaque ? 'VIEW COLLECTION' : 'LOOK CLOSER';
        }

        const spot = spotlights[mesh.userData.stationIdx];
        if (spot) spot.intensity = 5.4;
      }
    } else {
      if (hoveredMesh) {
        const spot = spotlights[hoveredMesh.userData.stationIdx];
        if (spot) spot.intensity = 3.8;
        hoveredMesh = null;
        container.style.cursor = 'grab';
        cursorTip?.classList.remove('is-on');
      }
    }
  }
});

window.addEventListener('pointerup', () => {
  if (!isPointerDown) return;
  isPointerDown = false;

  if (hasDragged && Math.abs(pointerVelocity) > 0.05) {
    const clampedV = Math.max(-3, Math.min(3, pointerVelocity));
    walkState.targetAngle -= 220 * clampedV * 0.0022;
    walkState.lastMoved = performance.now();
  }
});

window.addEventListener('click', (e) => {
  if (hasDragged) return;
  if (e.target.closest('.gallery-nav') || e.target.closest('.drawer') || e.target.closest('.view-toggle') || e.target.closest('.room-nav') || e.target.closest('#room-caption')) return;

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactiveObjects, false);

  if (hits.length > 0) {
    const mesh = hits[0].object;
    if (isInspecting) {
      if (inspectedMesh === mesh) {
        if (mesh.userData.isArtwork) {
          openInspector(mesh.userData.item);
        } else if (mesh.userData.isPlaque) {
          walkState.targetAngle = mesh.userData.stationIdx * ANGLE_STEP;
          stepBack();
        }
      } else {
        lookCloserAt(mesh);
      }
    } else {
      lookCloserAt(mesh);
    }
  } else {
    if (isInspecting) stepBack();
  }
});

// Collection round navigation buttons
prevBtn?.addEventListener('click', () => {
  stepBack();
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
  let currentTargetStation = Math.round(walkState.targetAngle / ANGLE_STEP);
  let col = STATIONS[THREE.MathUtils.euclideanModulo(currentTargetStation, NUM_STATIONS)].collectionIdx;
  do {
    currentTargetStation += 1;
  } while (STATIONS[THREE.MathUtils.euclideanModulo(currentTargetStation, NUM_STATIONS)].collectionIdx === col);
  walkState.targetAngle = currentTargetStation * ANGLE_STEP;
  walkState.lastMoved = performance.now();
});

// View mode switcher
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

// ------------------------------------------------ 11. Render Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsedTime = clock.getElapsedTime();
  const now = performance.now();

  // Entrance walk-in animation (Shutabug Style)
  if (entranceState.phase === 'wait') {
    if (now - entranceState.startTime > 800) {
      entranceState.phase = 'run';
      entranceState.startTime = now;
    }
  } else if (entranceState.phase === 'run') {
    const elapsed = now - entranceState.startTime;
    const progress = Math.min(1.0, elapsed / entranceState.durationMs);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    walkState.angle = entranceState.fromAngle + (entranceState.toAngle - entranceState.fromAngle) * easeProgress;

    if (progress >= 1.0) {
      entranceState.phase = 'done';
      walkState.targetAngle = entranceState.toAngle;
      walkState.lastMoved = now;
    }
  } else {
    // Subtle idle drift
    if (!isPointerDown && !isInspecting && !drawer.classList.contains('is-open')) {
      if (now - walkState.lastMoved > 2500) {
        walkState.targetAngle += 0.0075 * delta;
      }
    }
    walkState.angle += (walkState.targetAngle - walkState.angle) * Math.min(1.0, 2.4 * delta);
  }

  // Camera positioning
  if (isInspecting && inspectedMesh) {
    currentEye.lerp(targetEye, Math.min(1.0, 4.0 * delta));
    currentLookAt.lerp(targetLookAt, Math.min(1.0, 4.0 * delta));
  } else {
    const a = walkState.angle;
    const lookAngle = a + 0.32 + 0.22 * mouseParallax.x;

    const eyeY = 1.55 + 0.012 * Math.sin(1.4 * elapsedTime);
    const lookY = 1.5 + 0.22 * mouseParallax.y;

    targetEye.set(
      ROTUNDA_TRACK_R * Math.sin(a),
      eyeY,
      ROTUNDA_TRACK_R * Math.cos(a)
    );
    targetLookAt.set(
      ROTUNDA_TRACK_R * Math.sin(lookAngle),
      lookY,
      ROTUNDA_TRACK_R * Math.cos(lookAngle)
    );

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
      const lerpSpeed = entranceState.phase === 'run' ? 2.5 : 3.5;
      currentEye.lerp(targetEye, Math.min(1.0, lerpSpeed * delta));
      currentLookAt.lerp(targetLookAt, Math.min(1.0, lerpSpeed * delta));
    }
  }

  camera.position.copy(currentEye);
  camera.lookAt(currentLookAt);

  // Inner wall distance fade
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
      updateCaption(activeStation.collectionIdx, activeStation.outer.item || null);
    }
  }

  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
