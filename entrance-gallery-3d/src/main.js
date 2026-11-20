import * as THREE from 'three';

// ------------------------------------------------ 8 Fine Art Paintings on Entrance Passage
export const PASSAGE_PAINTINGS = [
  {
    id: 'p01',
    num: '01',
    title: 'Lagos Sun & Indigo',
    artist: 'Nexora Contemporary Collection',
    image: '/paintings/p01.jpg',
    wall: 'left',
    z: -20.5
  },
  {
    id: 'p02',
    num: '02',
    title: 'Terra Incognita',
    artist: 'Atelier Alabi Tribute',
    image: '/paintings/p02.jpg',
    wall: 'left',
    z: -15.5
  },
  {
    id: 'p03',
    num: '03',
    title: 'Emerald Horizon & Gold',
    artist: 'Heritage Series',
    image: '/paintings/p03.jpg',
    wall: 'left',
    z: -10.5
  },
  {
    id: 'p04',
    num: '04',
    title: 'Symphony of the Vanguard',
    artist: 'Modern Diaspora Study',
    image: '/paintings/p04.jpg',
    wall: 'left',
    z: -5.5
  },
  {
    id: 'p05',
    num: '05',
    title: 'The Golden Passage',
    artist: 'Kinetic Expressionism',
    image: '/paintings/p05.jpg',
    wall: 'right',
    z: -20.5
  },
  {
    id: 'p06',
    num: '06',
    title: 'Cobalt Odyssey',
    artist: 'Maritime Contemporary',
    image: '/paintings/p06.jpg',
    wall: 'right',
    z: -15.5
  },
  {
    id: 'p07',
    num: '07',
    title: 'Ochre & Basalt',
    artist: 'Architectural Elements',
    image: '/paintings/p07.jpg',
    wall: 'right',
    z: -10.5
  },
  {
    id: 'p08',
    num: '08',
    title: 'Elysian Pulse',
    artist: 'Crown Collection',
    image: '/paintings/p08.jpg',
    wall: 'right',
    z: -5.5
  }
];

// ------------------------------------------------ Architectural Entrance Exhibits Data (Rotunda)
export const BASE_EXHIBITS = [
  {
    id: 'meridian',
    num: '01',
    title: 'The Meridian Spire',
    subtitle: 'Twin Glass & Bronze High-Rise · 48 Floors',
    tag: 'Flagship Tower',
    image: '/images/01_meridian.jpg',
    desc: 'The architectural centerpiece of the development: twin towers clad in high-performance solar glazing and anodized architectural bronze, joined by an iconic sky bridge at level 32.',
    specs: [
      { label: 'Height', value: '184 Meters / 48 Storeys' },
      { label: 'Units', value: '142 Luxury Residences' },
      { label: 'Structural Core', value: 'BIM Post-Tensioned Raft' },
      { label: 'Architect', value: 'Nexora Studio' }
    ],
    ctaUrl: 'http://localhost:5174/?property=meridian-residences'
  },
  {
    id: 'lobby',
    num: '02',
    title: 'Double-Height Grand Lobby',
    subtitle: '28-Foot Travertine Vestibule & Virtual Concierge',
    tag: 'Arrival Experience',
    image: '/images/02_lobby.jpg',
    desc: 'Stepping into the building, visitors enter a magnificent 28-foot tall lobby clad in Italian silver vein-cut travertine, illuminated by warm recessed architectural linear fixtures with the Hannah AI virtual receptionist.',
    specs: [
      { label: 'Ceiling Height', value: '8.5m / 28 Feet' },
      { label: 'Finish', value: 'Silver Travertine & Brushed Brass' },
      { label: 'Reception', value: 'Hannah AI Interactive Concierge' },
      { label: 'Access', value: 'High-Speed Destination Elevators' }
    ],
    ctaUrl: 'http://localhost:5174/?welcome'
  },
  {
    id: 'bim-twin',
    num: '03',
    title: 'Digital Twin BIM Core',
    subtitle: 'Real-Time Structural & IoT Sensor Telemetry',
    tag: 'Platform Innovation',
    image: '/images/03_bim_twin.jpg',
    desc: 'The building is paired with a live 3D digital twin model. From foundation excavation to MEP services and structural strain sensors, every component is monitored in real-time.',
    specs: [
      { label: 'Twin Resolution', value: 'LOD 400 Parametric Mesh' },
      { label: 'Sensor Nodes', value: '1,200+ IoT Telemetry Points' },
      { label: 'Simulation', value: 'Thermal, Energy & Wind Dynamics' },
      { label: 'Platform', value: 'Nexora Digital Twin Cloud' }
    ],
    ctaUrl: 'http://localhost:5174/'
  },
  {
    id: 'halcyon',
    num: '04',
    title: 'Halcyon Cascading Terraces',
    subtitle: 'Stepped Biophilic Sky Gardens & Duplexes',
    tag: 'Residential Tower',
    image: '/images/04_halcyon.jpg',
    desc: 'An innovative sculpted residential form featuring staggered cantilevered garden terraces that bring private landscaped courtyards to high-altitude luxury suites.',
    specs: [
      { label: 'Height', value: '36 Storeys' },
      { label: 'Terrace Area', value: 'Up to 850 sq.ft per residence' },
      { label: 'Landscape', value: 'Indigenous Biophilic Microclimates' },
      { label: 'Orientation', value: 'Solar-Optimized South-West' }
    ],
    ctaUrl: 'http://localhost:5174/?property=halcyon-heights'
  },
  {
    id: 'facade',
    num: '05',
    title: 'Architectural Glazing & Facade',
    subtitle: 'Triple-Glazed Acoustically Decoupled Curtain Wall',
    tag: 'Engineering Detail',
    image: '/images/05_facade.jpg',
    desc: 'Engineered for exceptional acoustic silence and low-carbon thermal insulation. Floor-to-ceiling glass reveals uninterrupted 360-degree skyline and horizon views.',
    specs: [
      { label: 'U-Value', value: '0.78 W/m²K Low-E Glazing' },
      { label: 'Sound Isolation', value: '46 dB Acoustic Damping' },
      { label: 'Mullions', value: 'Concealed Structural Anodized' },
      { label: 'Shading', value: 'Dynamic Automated Louvers' }
    ],
    ctaUrl: 'http://localhost:5174/'
  },
  {
    id: 'floor-plan',
    num: '06',
    title: 'The Sky Villa Penthouse Plan',
    subtitle: '6,400 Sq.Ft Duplex Layout with Private Pool',
    tag: 'Floor Plan Exhibit',
    image: '/images/06_floor_plan.jpg',
    desc: 'The premier residence layout occupying the upper two floors. Features a 22-foot double-height living pavilion, private plunge pool, 4 en-suite bedrooms, and dedicated staff quarters.',
    specs: [
      { label: 'Total Area', value: '6,400 Sq.Ft / 595 m²' },
      { label: 'Bedrooms', value: '4 En-Suite + Service Suite' },
      { label: 'Private Amenities', value: 'Plunge Pool & Sky Terrace' },
      { label: 'Ceilings', value: 'Double-Height 6.8m' }
    ],
    ctaUrl: 'http://localhost:5174/'
  },
  {
    id: 'linden',
    num: '07',
    title: 'Linden Park Residences',
    subtitle: 'Boutique Contemporary Heritage Living',
    tag: 'Estate Collection',
    image: '/images/07_linden.jpg',
    desc: 'A collection of low-density garden villas and private boutique residences set against lush botanical woodlands, combining artisanal masonry with modern minimalism.',
    specs: [
      { label: 'Typology', value: '4-Storey Boutique Mansions' },
      { label: 'Privacy', value: '2 Residences Per Floor' },
      { label: 'Gardens', value: 'Private Ground-Floor Groves' },
      { label: 'Status', value: 'Pre-Construction Booking' }
    ],
    ctaUrl: 'http://localhost:5174/?property=linden-park'
  },
  {
    id: 'completion',
    num: '08',
    title: 'The Horizon Sky Club',
    subtitle: 'Cantilevered Pool & 360° Panorama Observatory',
    tag: 'Completed Masterpiece',
    image: '/images/08_completion.jpg',
    desc: 'Suspended 150 meters above ground, the Sky Club crowns the twin building with a heated glass-bottom infinity pool, private cigar and wine cellar, and private event dining suite.',
    specs: [
      { label: 'Elevation', value: 'Level 42 / 150m Above Ground' },
      { label: 'Amenities', value: 'Heated Infinity Pool & Club Spa' },
      { label: 'View Angle', value: 'Unobstructed 360° Horizon' },
      { label: 'Access', value: 'Private Resident Keycard' }
    ],
    ctaUrl: 'http://localhost:5174/'
  }
];

// Seamless circular carousel of 16 stations for the 3D rotunda
export const EXHIBITS = [...BASE_EXHIBITS, ...BASE_EXHIBITS.map(e => ({ ...e, id: `${e.id}-b` }))];

// ------------------------------------------------ 3D Scene Initialization
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Deep dark museum environment
scene.background = new THREE.Color(0x11151f);
scene.fog = new THREE.Fog(0x11151f, 32, 75);

const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 120);
// Start camera inside the entrance art passage
camera.position.set(0, 0.1, -22.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// ------------------------------------------------ Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1a202c, 0.85);
scene.add(hemiLight);

// Soft central rotunda fill light
const centerFill = new THREE.PointLight(0xfff6ec, 1.8, 45);
centerFill.position.set(0, 2.0, 0);
scene.add(centerFill);

// ------------------------------------------------ Spotlight Halo Texture Generator
function createSpotlightHaloTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(256, 140, 10, 256, 256, 256);
  grad.addColorStop(0, 'rgba(255, 238, 205, 0.85)');
  grad.addColorStop(0.35, 'rgba(255, 222, 165, 0.45)');
  grad.addColorStop(0.65, 'rgba(255, 210, 140, 0.15)');
  grad.addColorStop(1, 'rgba(255, 210, 140, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  return new THREE.CanvasTexture(c);
}
const haloTexture = createSpotlightHaloTexture();

// ------------------------------------------------ SECTION 1: Grand Entrance Art Passage
const passageGroup = new THREE.Group();
scene.add(passageGroup);

const PASSAGE_LEN = 24.0;
const PASSAGE_W = 6.4;
const PASSAGE_H = 5.4;
const PASSAGE_MID_Z = -13.0;

// 1. Passage Left Wall
const wallMat = new THREE.MeshStandardMaterial({
  color: 0x161a24,
  roughness: 0.76,
  metalness: 0.08
});
const pLeftWall = new THREE.Mesh(new THREE.PlaneGeometry(PASSAGE_LEN, PASSAGE_H), wallMat);
pLeftWall.position.set(-PASSAGE_W / 2, 0.2, PASSAGE_MID_Z);
pLeftWall.rotation.y = Math.PI / 2;
passageGroup.add(pLeftWall);

// 2. Passage Right Wall
const pRightWall = new THREE.Mesh(new THREE.PlaneGeometry(PASSAGE_LEN, PASSAGE_H), wallMat);
pRightWall.position.set(PASSAGE_W / 2, 0.2, PASSAGE_MID_Z);
pRightWall.rotation.y = -Math.PI / 2;
passageGroup.add(pRightWall);

// 3. Passage Polished Dark Floor
const pFloorMat = new THREE.MeshStandardMaterial({
  color: 0x090c12,
  roughness: 0.26,
  metalness: 0.4
});
const pFloor = new THREE.Mesh(new THREE.PlaneGeometry(PASSAGE_W, PASSAGE_LEN), pFloorMat);
pFloor.position.set(0, -2.5, PASSAGE_MID_Z);
pFloor.rotation.x = -Math.PI / 2;
passageGroup.add(pFloor);

// 4. Passage Ceiling & Architectural Recessed Linear Light
const pCeilMat = new THREE.MeshStandardMaterial({ color: 0x10131a, roughness: 0.9 });
const pCeil = new THREE.Mesh(new THREE.PlaneGeometry(PASSAGE_W, PASSAGE_LEN), pCeilMat);
pCeil.position.set(0, 2.9, PASSAGE_MID_Z);
pCeil.rotation.x = Math.PI / 2;
passageGroup.add(pCeil);

// Linear ceiling warm LED runner
const ledStripMat = new THREE.MeshBasicMaterial({ color: 0xfff3da });
const ledStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.24, PASSAGE_LEN), ledStripMat);
ledStrip.position.set(0, 2.88, PASSAGE_MID_Z);
ledStrip.rotation.x = Math.PI / 2;
passageGroup.add(ledStrip);

// Floor edge ambient gold guides
const edgeMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
const leftEdge = new THREE.Mesh(new THREE.PlaneGeometry(0.06, PASSAGE_LEN), edgeMat);
leftEdge.position.set(-PASSAGE_W / 2 + 0.04, -2.48, PASSAGE_MID_Z);
leftEdge.rotation.x = -Math.PI / 2;
passageGroup.add(leftEdge);

const rightEdge = new THREE.Mesh(new THREE.PlaneGeometry(0.06, PASSAGE_LEN), edgeMat);
rightEdge.position.set(PASSAGE_W / 2 - 0.04, -2.48, PASSAGE_MID_Z);
rightEdge.rotation.x = -Math.PI / 2;
passageGroup.add(rightEdge);

// Passage Entry Portal Arch (at z = -25.0)
const archMat = new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.4, metalness: 0.3 });
const entryArchTop = new THREE.Mesh(new THREE.BoxGeometry(PASSAGE_W + 0.4, 0.4, 0.3), archMat);
entryArchTop.position.set(0, 2.9, -25.0);
passageGroup.add(entryArchTop);

// Passage Threshold Portal Arch into Rotunda (at z = -1.0)
const rotundaPortalTop = new THREE.Mesh(new THREE.BoxGeometry(PASSAGE_W + 0.4, 0.4, 0.3), archMat);
rotundaPortalTop.position.set(0, 2.9, -1.0);
passageGroup.add(rotundaPortalTop);

// Passage Placard Generator (non-clickable museum labels)
function createPassagePlacardTexture(num, title, artist) {
  const c = document.createElement('canvas');
  c.width = 480;
  c.height = 140;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#141822';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = '#2b3445';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, c.width - 4, c.height - 4);

  ctx.fillStyle = '#ffd200';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText(`ENTRANCE GALLERY · CANVAS ${num}`, 22, 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 24px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(title, 22, 78);

  ctx.fillStyle = '#8e96a5';
  ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(artist, 22, 114);

  const t = new THREE.CanvasTexture(c);
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

// Mount the 8 Fine Art Paintings in Passage (NOT Clickable!)
PASSAGE_PAINTINGS.forEach((item) => {
  const group = new THREE.Group();
  const isLeft = item.wall === 'left';
  const x = isLeft ? -PASSAGE_W / 2 + 0.05 : PASSAGE_W / 2 - 0.05;
  const rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;

  group.position.set(x, 0.35, item.z);
  group.rotation.y = rotY;

  // Canvas Artwork
  const pW = 1.9;
  const pH = 2.4;
  const tex = textureLoader.load(item.image);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;

  const canvasMat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.35,
    metalness: 0.05
  });
  const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW, pH), canvasMat);
  canvasMesh.position.y = 0.35;
  group.add(canvasMesh);

  // Floating Dark Anodized Frame
  const frameMat = new THREE.MeshBasicMaterial({ color: 0x0a0c10 });
  const frameMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW + 0.12, pH + 0.12), frameMat);
  frameMesh.position.set(0, 0.35, -0.01);
  group.add(frameMesh);

  // Warm Spotlight Halo on wall above painting
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 2.4),
    new THREE.MeshBasicMaterial({
      map: haloTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  halo.position.set(0, 1.8, -0.005);
  group.add(halo);

  // Placard underneath
  const placardTex = createPassagePlacardTexture(item.num, item.title, item.artist);
  const placardMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.42),
    new THREE.MeshStandardMaterial({ map: placardTex, roughness: 0.5 })
  );
  placardMesh.position.set(0, -1.2, 0);
  group.add(placardMesh);

  passageGroup.add(group);

  // SpotLight mounted on ceiling shining down on painting
  const spot = new THREE.SpotLight(0xfff1dc, 3.2);
  const spotX = isLeft ? -PASSAGE_W / 2 + 1.6 : PASSAGE_W / 2 - 1.6;
  spot.position.set(spotX, 2.6, item.z);
  const target = new THREE.Object3D();
  target.position.set(x, 0.35, item.z);
  passageGroup.add(target);
  spot.target = target;
  spot.angle = 0.65;
  spot.penumbra = 0.85;
  spot.decay = 1.3;
  spot.distance = 12;
  passageGroup.add(spot);
});

// ------------------------------------------------ SECTION 2: Master Rotunda (Shutabug Style)
const rotunda = new THREE.Group();
scene.add(rotunda);

const RADIUS = 22.0;
const HEIGHT = 8.6;

// Curved Cylindrical Wall
const wallGeo = new THREE.CylinderGeometry(RADIUS, RADIUS, HEIGHT, 160, 1, true);
const wallMatRotunda = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.82,
  metalness: 0.02,
  side: THREE.BackSide
});
const wall = new THREE.Mesh(wallGeo, wallMatRotunda);
rotunda.add(wall);

// Rotunda Floor
const floorGeo = new THREE.CircleGeometry(RADIUS + 6.0, 64);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x0a0d14,
  roughness: 0.32,
  metalness: 0.45,
  side: THREE.FrontSide
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -HEIGHT / 2;
rotunda.add(floor);

// Rotunda Placard Generator
function createRotundaPlacardTexture(num, title, subtitle) {
  const c = document.createElement('canvas');
  c.width = 720;
  c.height = 240;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = '#e2dfd9';
  ctx.lineWidth = 3;
  ctx.strokeRect(3, 3, c.width - 6, c.height - 6);

  ctx.fillStyle = '#c89d00';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(`EXHIBIT ${num}`, 32, 52);

  ctx.fillStyle = '#181b22';
  ctx.font = '600 34px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(title, 32, 116);

  ctx.fillStyle = '#6b7280';
  ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(subtitle, 32, 168);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CLICK TO INSPECT ARCHITECTURE →', 32, 212);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

const exhibitMeshes = [];
const spotlights = [];
const N = EXHIBITS.length;
const angleStep = (Math.PI * 2) / N;

EXHIBITS.forEach((item, i) => {
  const angle = i * angleStep;
  const exhibitGroup = new THREE.Group();

  const wallDist = RADIUS - 0.08;
  const x = wallDist * Math.sin(angle);
  const z = wallDist * Math.cos(angle);
  exhibitGroup.position.set(x, 0, z);
  exhibitGroup.rotation.y = angle + Math.PI;

  const frameW = 3.0;
  const frameH = 2.2;
  const frameGeo = new THREE.PlaneGeometry(frameW, frameH);

  const texture = textureLoader.load(item.image);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  const frameMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.28,
    metalness: 0.05
  });

  const frameMesh = new THREE.Mesh(frameGeo, frameMat);
  frameMesh.position.y = 0.55;
  frameMesh.userData = { index: i, exhibit: item };
  exhibitGroup.add(frameMesh);
  exhibitMeshes.push(frameMesh);

  // Thin Dark Frame Border
  const backGeo = new THREE.PlaneGeometry(frameW + 0.12, frameH + 0.12);
  const backMat = new THREE.MeshBasicMaterial({ color: 0x181c26 });
  const backMesh = new THREE.Mesh(backGeo, backMat);
  backMesh.position.set(0, 0.55, -0.012);
  exhibitGroup.add(backMesh);

  // Placard Below
  const placardW = 2.4;
  const placardH = 0.82;
  const placardGeo = new THREE.PlaneGeometry(placardW, placardH);
  const placardTex = createRotundaPlacardTexture(item.num, item.title, item.subtitle);
  const placardMat = new THREE.MeshStandardMaterial({
    map: placardTex,
    roughness: 0.5,
    metalness: 0.0
  });
  const placardMesh = new THREE.Mesh(placardGeo, placardMat);
  placardMesh.position.set(0, -1.25, 0);
  placardMesh.userData = { index: i, exhibit: item };
  exhibitGroup.add(placardMesh);
  exhibitMeshes.push(placardMesh);

  // Spotlight Halo on wall
  const haloGeo = new THREE.PlaneGeometry(4.8, 3.2);
  const haloMat = new THREE.MeshBasicMaterial({
    map: haloTexture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.position.set(0, 2.15, -0.005);
  exhibitGroup.add(haloMesh);

  rotunda.add(exhibitGroup);

  // Dedicated Spotlight
  const spot = new THREE.SpotLight(0xfff1dc, 4.2);
  const lightR = RADIUS - 2.5;
  const lx = lightR * Math.sin(angle);
  const lz = lightR * Math.cos(angle);
  spot.position.set(lx, HEIGHT / 2 - 0.2, lz);

  const targetObj = new THREE.Object3D();
  targetObj.position.set(x, 0.35, z);
  rotunda.add(targetObj);
  spot.target = targetObj;

  spot.angle = 0.65;
  spot.penumbra = 0.9;
  spot.decay = 1.2;
  spot.distance = 22;

  rotunda.add(spot);
  spotlights.push(spot);
});

// ------------------------------------------------ State & Camera Controls
let currentAppMode = 'passage'; // 'passage' | 'rotunda'
let currentRotY = 0;
let targetRotY = 0;
let isDragging = false;
let startPointerX = 0;
let lastPointerX = 0;
let velocityX = 0;
let hasUserInteracted = false;

// Mouse parallax
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

// Inspection camera state
let isInspecting = false;
let activeExhibit = null;
const cameraTargetPos = new THREE.Vector3(0, 0.1, -22.5);
const cameraLookAtTarget = new THREE.Vector3(0, 0.1, 0.0);
const currentLookAt = new THREE.Vector3(0, 0.1, 0.0);

// UI Elements
const dragCue = document.getElementById('drag-cue');
const cueIcon = document.getElementById('cue-icon');
const cueText = document.getElementById('cue-text');
const navStatusText = document.getElementById('nav-status-text');
const navModeSub = document.getElementById('nav-mode-sub');
const navWalkBtn = document.getElementById('nav-walk-btn');
const walkHud = document.getElementById('walk-hud');
const walkHudBtn = document.getElementById('walk-hud-btn');
const walkHudLabel = document.getElementById('walk-hud-label');
const walkHudArrow = document.getElementById('walk-hud-arrow');

function updateModeUI() {
  if (currentAppMode === 'passage') {
    if (navStatusText) navStatusText.textContent = 'Entrance Art Passage';
    if (navModeSub) navModeSub.textContent = '3D Walkway Passage';
    if (navWalkBtn) navWalkBtn.innerHTML = `<span>WALK TO ROTUNDA</span><svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    if (walkHudLabel) walkHudLabel.textContent = 'WALK INTO ROTUNDA';
    if (walkHudArrow) walkHudArrow.textContent = '→';
    if (cueIcon) cueIcon.textContent = '↑';
    if (cueText) cueText.textContent = 'SCROLL OR CLICK TO WALK DOWN 3D ART PASSAGE';
    container.style.cursor = 'default';
  } else {
    if (navStatusText) navStatusText.textContent = 'Curved Exhibition Rotunda';
    if (navModeSub) navModeSub.textContent = '360° Architectural Pavilion';
    if (navWalkBtn) navWalkBtn.innerHTML = `<svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>RETURN TO PASSAGE</span>`;
    if (walkHudLabel) walkHudLabel.textContent = '← RETURN TO ENTRANCE PASSAGE';
    if (walkHudArrow) walkHudArrow.textContent = '';
    if (cueIcon) cueIcon.textContent = '↔';
    if (cueText) cueText.textContent = 'DRAG TO ROTATE ROTUNDA · CLICK TO INSPECT ARCHITECTURE';
    container.style.cursor = 'grab';
  }
}

export function enterRotundaMode() {
  currentAppMode = 'rotunda';
  cameraTargetPos.set(0, 0, 0);
  cameraLookAtTarget.set(0, 0.35, 22.0);
  updateModeUI();
}

export function enterPassageMode() {
  currentAppMode = 'passage';
  closeDrawer();
  cameraTargetPos.set(0, 0.1, -22.5);
  cameraLookAtTarget.set(0, 0.1, 0.0);
  updateModeUI();
}

navWalkBtn?.addEventListener('click', () => {
  if (currentAppMode === 'passage') {
    enterRotundaMode();
  } else {
    enterPassageMode();
  }
});

walkHudBtn?.addEventListener('click', () => {
  if (currentAppMode === 'passage') {
    enterRotundaMode();
  } else {
    enterPassageMode();
  }
});

function hideCue() {
  if (!hasUserInteracted) {
    hasUserInteracted = true;
    dragCue?.classList.add('is-hidden');
  }
}

// ------------------------------------------------ Input Handlers
window.addEventListener('pointerdown', (e) => {
  if (isInspecting) return;
  if (e.target.closest('.gallery-nav') || e.target.closest('.view-toggle') || e.target.closest('.drawer') || e.target.closest('.walk-hud')) return;

  isDragging = true;
  startPointerX = e.clientX;
  lastPointerX = e.clientX;
  velocityX = 0;
});

window.addEventListener('pointermove', (e) => {
  mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

  if (currentAppMode === 'rotunda') {
    if (!isDragging || isInspecting) return;
    const deltaX = e.clientX - lastPointerX;
    lastPointerX = e.clientX;
    velocityX = deltaX;
    targetRotY += deltaX * 0.0022;
    hideCue();
  }
});

window.addEventListener('pointerup', () => {
  if (!isDragging) return;
  isDragging = false;
  if (currentAppMode === 'rotunda') {
    targetRotY += velocityX * 0.012;
    velocityX = 0;
  }
});

// Wheel Scroll (walks along passage when in passage mode; rotates rotunda when in rotunda mode)
window.addEventListener('wheel', (e) => {
  if (isInspecting) return;
  hideCue();

  if (currentAppMode === 'passage') {
    const forwardStep = e.deltaY > 0 ? 1.6 : -1.6;
    cameraTargetPos.z = Math.min(0.0, Math.max(-23.0, cameraTargetPos.z + forwardStep));
    if (cameraTargetPos.z >= -1.5) {
      enterRotundaMode();
    }
  } else {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    targetRotY -= delta * 0.0012;
  }
}, { passive: true });

// ------------------------------------------------ Raycasting & Hover / Click
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredMesh = null;

window.addEventListener('pointermove', (e) => {
  if (isInspecting) return;

  // In passage mode, paintings are NOT clickable!
  if (currentAppMode === 'passage') {
    container.style.cursor = 'default';
    return;
  }

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(exhibitMeshes, false);

  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    if (hoveredMesh !== mesh) {
      hoveredMesh = mesh;
      container.style.cursor = 'pointer';
      const idx = mesh.userData.index;
      if (spotlights[idx]) spotlights[idx].intensity = 5.2;
    }
  } else {
    if (hoveredMesh) {
      const idx = hoveredMesh.userData.index;
      if (spotlights[idx]) spotlights[idx].intensity = 4.2;
      hoveredMesh = null;
      container.style.cursor = isDragging ? 'grabbing' : 'grab';
    }
  }
});

// Click Interaction
window.addEventListener('click', (e) => {
  if (isDragging) return;
  if (Math.abs(e.clientX - startPointerX) > 8) return;
  if (e.target.closest('.gallery-nav') || e.target.closest('.view-toggle') || e.target.closest('.drawer') || e.target.closest('.walk-hud')) return;

  // In passage mode: clicking anywhere walks forward towards rotunda
  if (currentAppMode === 'passage') {
    cameraTargetPos.z = Math.min(0.0, cameraTargetPos.z + 5.5);
    if (cameraTargetPos.z >= -2.0) {
      enterRotundaMode();
    }
    return;
  }

  // In rotunda mode: click to inspect
  if (isInspecting) {
    closeDrawer();
    return;
  }

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(exhibitMeshes, false);

  if (intersects.length > 0) {
    const item = intersects[0].object.userData.exhibit;
    const index = intersects[0].object.userData.index;
    openInspection(item, index);
  }
});

// ------------------------------------------------ Drawer & Inspection Logic
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerClose = document.getElementById('drawer-close');
const drawerContent = document.getElementById('drawer-content');

function openInspection(exhibit, index) {
  isInspecting = true;
  activeExhibit = exhibit;
  hideCue();

  drawerContent.innerHTML = `
    <div class="drawer__preview-wrap">
      <img class="drawer__preview-img" src="${exhibit.image}" alt="${exhibit.title}" />
    </div>

    <span class="drawer__tag">${exhibit.tag}</span>

    <div>
      <h2 class="drawer__title">${exhibit.title}</h2>
      <p class="drawer__desc" style="margin-top: 10px;">${exhibit.desc}</p>
    </div>

    <div class="drawer__specs-grid">
      ${exhibit.specs.map(s => `
        <div class="spec-item">
          <span class="spec-item__label">${s.label}</span>
          <span class="spec-item__value">${s.value}</span>
        </div>
      `).join('')}
    </div>

    <a href="${exhibit.ctaUrl}" class="drawer__cta-btn" target="_blank" rel="noopener">
      <span>ENTER 3D DIGITAL TWIN</span>
      <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
        <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  `;

  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  drawerOverlay.classList.add('is-open');

  const targetAngle = -index * angleStep;
  targetRotY = targetAngle;

  cameraTargetPos.set(-1.6, 0.2, 11.2);
}

function closeDrawer() {
  isInspecting = false;
  activeExhibit = null;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  drawerOverlay.classList.remove('is-open');

  if (currentAppMode === 'rotunda') {
    cameraTargetPos.set(0, 0, 0);
    cameraLookAtTarget.set(0, 0.35, 22.0);
  }
}

drawerClose?.addEventListener('click', closeDrawer);
drawerOverlay?.addEventListener('click', closeDrawer);

// ------------------------------------------------ View Mode Toggle (GALLERY vs LIST)
const viewGalleryBtn = document.getElementById('view-gallery-btn');
const viewListBtn = document.getElementById('view-list-btn');
const listView = document.getElementById('list-view');
const listViewGrid = document.getElementById('list-view-grid');

listViewGrid.innerHTML = BASE_EXHIBITS.map((item, i) => `
  <article class="list-card" data-index="${i}">
    <div class="list-card__media">
      <img src="${item.image}" alt="${item.title}" loading="lazy" />
    </div>
    <div class="list-card__body">
      <div class="list-card__num">EXHIBIT ${item.num} · ${item.tag.toUpperCase()}</div>
      <h3 class="list-card__title">${item.title}</h3>
      <p class="list-card__sub">${item.subtitle}</p>
    </div>
  </article>
`).join('');

listViewGrid.querySelectorAll('.list-card').forEach((card) => {
  card.addEventListener('click', () => {
    const idx = Number(card.getAttribute('data-index'));
    setMode('gallery');
    if (currentAppMode === 'passage') {
      enterRotundaMode();
    }
    setTimeout(() => {
      openInspection(BASE_EXHIBITS[idx], idx);
    }, 350);
  });
});

function setMode(mode) {
  if (mode === 'list') {
    viewListBtn.classList.add('is-active');
    viewGalleryBtn.classList.remove('is-active');
    listView.classList.add('is-visible');
    listView.setAttribute('aria-hidden', 'false');
    closeDrawer();
  } else {
    viewGalleryBtn.classList.add('is-active');
    viewListBtn.classList.remove('is-active');
    listView.classList.remove('is-visible');
    listView.setAttribute('aria-hidden', 'true');
  }
}

viewGalleryBtn?.addEventListener('click', () => setMode('gallery'));
viewListBtn?.addEventListener('click', () => setMode('list'));

// ------------------------------------------------ Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ------------------------------------------------ Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  // Smooth rotation damping in rotunda
  if (currentAppMode === 'rotunda') {
    currentRotY += (targetRotY - currentRotY) * (1 - Math.exp(-dt * 9.0));
    rotunda.rotation.y = currentRotY;
  }

  // Smooth mouse parallax
  mouse.x += (mouse.targetX - mouse.x) * 0.05;
  mouse.y += (mouse.targetY - mouse.y) * 0.05;

  // Smooth camera position interpolation
  camera.position.lerp(cameraTargetPos, 0.06);

  // Dynamic Look-At Direction based on mode
  if (currentAppMode === 'passage') {
    // Look straight forward down the passage corridor into the glowing rotunda
    cameraLookAtTarget.set(
      mouse.x * 0.6,
      0.1 + mouse.y * 0.4,
      camera.position.z + 18.0
    );
  } else if (!isInspecting) {
    // In rotunda: face forward into the circular curved wall
    cameraLookAtTarget.set(
      mouse.x * 1.8,
      mouse.y * 1.0,
      22.0
    );
  } else {
    // When inspecting: camera focused slightly left on the inspected piece
    cameraLookAtTarget.set(-1.6, 0.35, 22.0);
  }

  currentLookAt.lerp(cameraLookAtTarget, 0.08);
  camera.lookAt(currentLookAt);

  renderer.render(scene, camera);
}

animate();

// Expose on window for debugging & tests
window.THREE = THREE;
window.__scene = scene;
window.__camera = camera;
window.__renderer = renderer;
window.__rotunda = rotunda;
window.__passageGroup = passageGroup;
window.__exhibitMeshes = exhibitMeshes;
window.__spotlights = spotlights;
window.__enterRotundaMode = enterRotundaMode;
window.__enterPassageMode = enterPassageMode;
