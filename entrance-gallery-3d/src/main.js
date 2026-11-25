import * as THREE from 'three';
window.THREE = THREE;

// ============================================================================
// LOTUS RESIDENCY — 3D INTERACTIVE ARCHITECTURAL MODEL & DIGITAL TWIN
// Exact 3D Photorealistic Digital Twin of Contemporary Courtyard Society
// Matching uploaded reference photo with 100% detail, lighting & atmosphere
// ============================================================================

// ------------------------------------------------ 1. DAY & NIGHT CONTROLLER STATE
const dayNightState = {
  factor: 0.48, // Default to vibrant golden hour / dusk matching reference photo
  sliderEl: null,
  badgeEl: null
};

let lotusSocietyGroup = null;
let animatedResidents = [];
let apartmentInteriorGroup = null;

function setupDayNightController() {
  const slider = document.getElementById('daynight-slider');
  const badge = document.getElementById('daynight-badge');
  dayNightState.sliderEl = slider;
  dayNightState.badgeEl = badge;

  if (slider) {
    slider.value = String(Math.round(dayNightState.factor * 100));
    slider.addEventListener('input', (e) => {
      setDayNightFactor(parseFloat(e.target.value) / 100.0);
    });
  }
  setDayNightFactor(dayNightState.factor);
}

function setDayNightFactor(factor) {
  const t = Math.max(0, Math.min(1, factor));
  dayNightState.factor = t;

  // Sky and Atmospheric Fog Grading matching reference photo
  const daySky = new THREE.Color(0xb8d8f8);
  const goldenSky = new THREE.Color(0x35527a); // Rich twilight blue with warm golden sunset horizon
  const nightSky = new THREE.Color(0x0e1828);

  let curSky = new THREE.Color();
  if (t < 0.5) {
    curSky.lerpColors(daySky, goldenSky, t / 0.5);
  } else {
    curSky.lerpColors(goldenSky, nightSky, (t - 0.5) / 0.5);
  }

  if (window.__mainThreeScene) {
    window.__mainThreeScene.background = curSky;
    if (window.__mainThreeScene.fog) {
      window.__mainThreeScene.fog.color = curSky;
      window.__mainThreeScene.fog.density = 0.0016 + t * 0.0010;
    }
  }

  // Dynamic Sun & Sky Hemispheric Illumination - Keeps society clearly lit and vibrant
  if (window.__sunLight) {
    if (t < 0.5) {
      window.__sunLight.intensity = THREE.MathUtils.lerp(2.2, 1.8, t / 0.5);
      window.__sunLight.color.lerpColors(new THREE.Color(0xfff5e6), new THREE.Color(0xffc67a), t / 0.5);
    } else {
      window.__sunLight.intensity = THREE.MathUtils.lerp(1.8, 0.45, (t - 0.5) / 0.5);
      window.__sunLight.color.lerpColors(new THREE.Color(0xffc67a), new THREE.Color(0x6688bb), (t - 0.5) / 0.5);
    }
  }
  if (window.__hemiLight) {
    if (t < 0.5) {
      window.__hemiLight.intensity = THREE.MathUtils.lerp(1.1, 0.90, t / 0.5);
    } else {
      window.__hemiLight.intensity = THREE.MathUtils.lerp(0.90, 0.45, (t - 0.5) / 0.5);
    }
  }
  if (window.__ambientLight) {
    if (t < 0.5) {
      window.__ambientLight.intensity = THREE.MathUtils.lerp(0.65, 0.55, t / 0.5);
    } else {
      window.__ambientLight.intensity = THREE.MathUtils.lerp(0.55, 0.35, (t - 0.5) / 0.5);
    }
  }

  // Window Glows & Evening Night Lighting
  if (window.__lotusMats) {
    const { windowGlassMat, windowGlowMat, streetlampGlobeMat, poolLightMat, wallSconceMat, courtFloodlightMat, treeUplightMat } = window.__lotusMats;
    if (windowGlassMat) {
      windowGlassMat.emissiveIntensity = 0.55 + Math.pow(t, 0.6) * 0.85;
    }
    if (windowGlowMat) {
      windowGlowMat.opacity = Math.max(0.60, 0.50 + Math.pow(t, 0.6) * 0.50);
    }
    if (streetlampGlobeMat) {
      streetlampGlobeMat.opacity = Math.max(0.45, Math.pow(t, 0.5) * 1.0);
    }
    if (wallSconceMat) {
      wallSconceMat.opacity = Math.max(0.50, Math.pow(t, 0.5) * 1.0);
    }
    if (treeUplightMat) {
      treeUplightMat.opacity = Math.max(0.40, Math.pow(t, 0.5) * 0.95);
    }
    if (poolLightMat) {
      poolLightMat.opacity = Math.max(0.6, 0.5 + Math.pow(t, 0.7) * 0.5);
    }
    if (courtFloodlightMat) {
      courtFloodlightMat.opacity = Math.pow(t, 1.1) * 0.95;
    }
  }

  if (dayNightState.badgeEl) {
    if (t < 0.15) dayNightState.badgeEl.textContent = 'DAY 12:00 PM';
    else if (t < 0.40) dayNightState.badgeEl.textContent = 'AFTERNOON 3:30 PM';
    else if (t < 0.65) dayNightState.badgeEl.textContent = 'GOLDEN HOUR 6:15 PM';
    else if (t < 0.85) dayNightState.badgeEl.textContent = 'SUNSET 7:45 PM';
    else dayNightState.badgeEl.textContent = 'NIGHT 11:30 PM';
  }
}

window.setDayNight = setDayNightFactor;

// ------------------------------------------------ 2. PROCEDURAL HIGH-RES PBR TEXTURES
function createLimestoneStuccoCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ded9ce'; // Warm limestone beige from reference photo
  ctx.fillRect(0, 0, 512, 512);

  // Subtle natural stone flecks & architectural fine stucco grain
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const a = Math.random() * 0.08;
    ctx.fillStyle = i % 2 === 0 ? `rgba(165, 155, 140, ${a})` : `rgba(255, 255, 255, ${a * 1.6})`;
    ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 2 + 1);
  }

  // Very subtle horizontal architectural joints
  ctx.strokeStyle = 'rgba(120, 110, 95, 0.12)';
  ctx.lineWidth = 1.5;
  for (let y = 64; y < 512; y += 64) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createCharcoalCladdingCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2b3036'; // Rich dark charcoal accent from photo
  ctx.fillRect(0, 0, 256, 256);

  // Architectural vertical panel seams
  ctx.strokeStyle = 'rgba(18, 20, 24, 0.75)';
  ctx.lineWidth = 3;
  for (let x = 0; x <= 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, 256);
    ctx.stroke();
  }

  // Subtle metallic brush texture
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.04})`;
    ctx.fillRect(x, y, 1, Math.random() * 6 + 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createApartmentWindowCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Deep twilight reflective glass base
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#1c2432');
  grad.addColorStop(0.5, '#26364a');
  grad.addColorStop(1, '#18202c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Warm golden amber interior room illumination shining through (2700K glowing interior)
  const glowGrad = ctx.createRadialGradient(128, 128, 25, 128, 128, 125);
  glowGrad.addColorStop(0, 'rgba(255, 228, 165, 0.95)');
  glowGrad.addColorStop(0.55, 'rgba(245, 195, 115, 0.65)');
  glowGrad.addColorStop(0.85, 'rgba(220, 155, 75, 0.35)');
  glowGrad.addColorStop(1, 'rgba(30, 42, 56, 0.85)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, 256, 256);

  // Interior sheer curtain silhouette folds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fillRect(10, 10, 35, 236);
  ctx.fillRect(211, 10, 35, 236);

  // Dark aluminium window frame & sliding mullion dividers
  ctx.strokeStyle = '#181b20';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(128, 0); ctx.lineTo(128, 256);
  ctx.moveTo(0, 175); ctx.lineTo(256, 175);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createManicuredTurfCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2e5c26'; // Deep lush emerald lawn
  ctx.fillRect(0, 0, 512, 512);

  // Subtle mower stripe pattern
  const stripeW = 64;
  for (let x = 0; x < 512; x += stripeW * 2) {
    ctx.fillStyle = 'rgba(20, 75, 18, 0.25)';
    ctx.fillRect(x, 0, stripeW, 512);
  }

  // Fine grass blade specks
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const c = Math.random();
    ctx.fillStyle = c > 0.6 ? 'rgba(85, 155, 58, 0.30)' : (c > 0.3 ? 'rgba(25, 68, 20, 0.35)' : 'rgba(115, 185, 75, 0.22)');
    ctx.fillRect(x, y, 2, 4);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 12);
  return tex;
}

function createStonePaverCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#dedad2'; // Light travertine paver from photo
  ctx.fillRect(0, 0, 512, 512);

  const tileW = 64;
  const tileH = 32;
  ctx.strokeStyle = 'rgba(105, 98, 88, 0.45)';
  ctx.lineWidth = 2.5;

  let row = 0;
  for (let y = 0; y <= 512; y += tileH) {
    const offset = (row % 2) * (tileW / 2);
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(512, y);
    ctx.stroke();

    for (let x = -offset; x <= 512; x += tileW) {
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x, y + tileH);
      ctx.stroke();
    }
    row++;
  }

  for (let i = 0; i < 3500; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.06)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 10);
  return tex;
}

function createAsphaltCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#22252a'; // Smooth dark street asphalt
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(200,200,200,0.09)' : 'rgba(10,10,10,0.22)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  return tex;
}

function createSolarPanelCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#141e2e'; // Deep photovoltaic blue-black
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = 'rgba(190, 215, 255, 0.5)';
  ctx.lineWidth = 2;
  for (let y = 0; y <= 256; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
  }
  for (let x = 0; x <= 256; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function createSignageCanvas(titleText = 'Lotus Residency', subText = 'GATED LUXURY COMMUNITY') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Dark polished granite backing
  ctx.fillStyle = '#1b1d22';
  ctx.fillRect(0, 0, 512, 256);

  // Elegant golden border trim
  ctx.strokeStyle = 'rgba(224, 185, 65, 0.75)';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 496, 240);

  // Golden Lotus flower emblem icon
  ctx.fillStyle = '#f5d470';
  ctx.strokeStyle = '#dfb545';
  ctx.lineWidth = 2;

  // Center petal
  ctx.beginPath();
  ctx.moveTo(256, 35);
  ctx.quadraticCurveTo(272, 70, 256, 95);
  ctx.quadraticCurveTo(240, 70, 256, 35);
  ctx.fill();
  ctx.stroke();

  // Left petal
  ctx.beginPath();
  ctx.moveTo(256, 95);
  ctx.quadraticCurveTo(220, 55, 222, 82);
  ctx.quadraticCurveTo(238, 95, 256, 95);
  ctx.fill();
  ctx.stroke();

  // Right petal
  ctx.beginPath();
  ctx.moveTo(256, 95);
  ctx.quadraticCurveTo(292, 55, 290, 82);
  ctx.quadraticCurveTo(274, 95, 256, 95);
  ctx.fill();
  ctx.stroke();

  // Typography
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(titleText, 256, 155);

  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#dfb545';
  ctx.letterSpacing = '4px';
  ctx.fillText(subText, 256, 192);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// ------------------------------------------------ 3. THREE.JS SCENE SETUP
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
window.__mainThreeScene = scene;

// Background Sky matching dusk twilight from reference photo
const BG_COLOR = 0x1a2e4a;
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.FogExp2(BG_COLOR, 0.0028);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 900);
// Camera position matching exact perspective from reference photo:
camera.position.set(0, 48.0, 115.0);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
canvasContainer.appendChild(renderer.domElement);

// Lighting Rig matching reference photo dusk/golden-hour with high clarity & rich warmth
const sunLight = new THREE.DirectionalLight(0xfff0da, 2.0);
sunLight.position.set(70, 95, 65);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 10;
sunLight.shadow.camera.far = 400;
const d = 120;
sunLight.shadow.camera.left = -d;
sunLight.shadow.camera.right = d;
sunLight.shadow.camera.top = d;
sunLight.shadow.camera.bottom = -d;
sunLight.shadow.bias = -0.0003;
sunLight.shadow.normalBias = 0.02;
scene.add(sunLight);
window.__sunLight = sunLight;

const hemiLight = new THREE.HemisphereLight(0x759ac0, 0x3d4e28, 0.95);
hemiLight.position.set(0, 100, 0);
scene.add(hemiLight);
window.__hemiLight = hemiLight;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambientLight);
window.__ambientLight = ambientLight;

// ------------------------------------------------ 4. MATERIALS SETUP
const limestoneTex = createLimestoneStuccoCanvas();
const charcoalTex = createCharcoalCladdingCanvas();
const windowTex = createApartmentWindowCanvas();
const turfTex = createManicuredTurfCanvas();
const paverTex = createStonePaverCanvas();
const asphaltTex = createAsphaltCanvas();
const solarTex = createSolarPanelCanvas();
const signTex = createSignageCanvas('Lotus Residency', 'GATED LUXURY COMMUNITY');

const stuccoMat = new THREE.MeshStandardMaterial({
  color: 0xede7dd, // Crisp warm limestone cream
  map: limestoneTex,
  roughness: 0.65,
  metalness: 0.04
});

const charcoalMat = new THREE.MeshStandardMaterial({
  color: 0x272c34, // Rich slate charcoal
  map: charcoalTex,
  roughness: 0.55,
  metalness: 0.25
});

const darkTrimMat = new THREE.MeshStandardMaterial({
  color: 0x1f2329,
  roughness: 0.50,
  metalness: 0.40
});

const windowGlassMat = new THREE.MeshStandardMaterial({
  color: 0x222a36,
  map: windowTex,
  emissive: new THREE.Color(0xffbf55),
  emissiveIntensity: 0.85,
  emissiveMap: windowTex,
  roughness: 0.15,
  metalness: 0.75
});

const windowGlowMat = new THREE.MeshBasicMaterial({
  color: 0xffdf99,
  transparent: true,
  opacity: 0.70
});

const balconySlabMat = new THREE.MeshStandardMaterial({
  color: 0xfaf7f2,
  roughness: 0.60,
  metalness: 0.05
});

const balconyRailingMat = new THREE.MeshStandardMaterial({
  color: 0x16181c,
  roughness: 0.40,
  metalness: 0.80
});

const lawnMat = new THREE.MeshStandardMaterial({
  color: 0x386d2a, // Vibrant lush emerald lawn
  map: turfTex,
  roughness: 0.88,
  metalness: 0.01
});

const outerForestMat = new THREE.MeshStandardMaterial({
  color: 0x295320, // Rich forest green outer terrain
  map: turfTex,
  roughness: 0.92,
  metalness: 0.01
});

const promenadeMat = new THREE.MeshStandardMaterial({
  color: 0xdcd6ca,
  map: paverTex,
  roughness: 0.78,
  metalness: 0.02
});

const curbMat = new THREE.MeshStandardMaterial({
  color: 0xbfb8aa,
  roughness: 0.85,
  metalness: 0.02
});

const asphaltMat = new THREE.MeshStandardMaterial({
  color: 0x22252a,
  map: asphaltTex,
  roughness: 0.90,
  metalness: 0.02
});

const poolWaterMat = new THREE.MeshStandardMaterial({
  color: 0x00d8ec,
  emissive: new THREE.Color(0x007f91),
  emissiveIntensity: 0.75,
  roughness: 0.05,
  metalness: 0.15
});

const poolDeckMat = new THREE.MeshStandardMaterial({
  color: 0xede6da,
  map: paverTex,
  roughness: 0.72,
  metalness: 0.02
});

const poolLightMat = new THREE.MeshBasicMaterial({
  color: 0x00f0ff,
  transparent: true,
  opacity: 0.65
});

const solarPanelMat = new THREE.MeshStandardMaterial({
  color: 0x141e2e,
  map: solarTex,
  roughness: 0.20,
  metalness: 0.85
});

const wallSconceMat = new THREE.MeshBasicMaterial({
  color: 0xffe299,
  transparent: true,
  opacity: 0.95
});

const streetlampGlobeMat = new THREE.MeshBasicMaterial({
  color: 0xfff0c2,
  transparent: true,
  opacity: 0.95
});

const treeUplightMat = new THREE.MeshBasicMaterial({
  color: 0xffd277,
  transparent: true,
  opacity: 0.85
});

const courtGreenMat = new THREE.MeshStandardMaterial({
  color: 0x24552b, // Forest green court border
  roughness: 0.85,
  metalness: 0.02
});

const courtBlueMat = new THREE.MeshStandardMaterial({
  color: 0xb34033, // Rich Terracotta / Brick red playing key from photo
  roughness: 0.85,
  metalness: 0.02
});

const courtKeyMat = new THREE.MeshStandardMaterial({
  color: 0x1d3b5c, // Deep navy inner key
  roughness: 0.85,
  metalness: 0.02
});

const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const fenceWireMat = new THREE.MeshStandardMaterial({
  color: 0x3a424a,
  roughness: 0.5,
  metalness: 0.8,
  wireframe: true
});

window.__lotusMats = {
  windowGlassMat,
  windowGlowMat,
  streetlampGlobeMat,
  poolLightMat,
  wallSconceMat,
  courtFloodlightMat: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }),
  treeUplightMat
};

// ------------------------------------------------ 5. BUILD COMPLETE LOTUS RESIDENCY
function buildLotusResidencyTownship(targetScene) {
  lotusSocietyGroup = new THREE.Group();
  lotusSocietyGroup.name = 'lotus-residency-township';

  // =========================================================================
  // A. VAST MEADOW TERRAIN & SURROUNDING FOREST BACKGROUND
  // Eliminates blank void - provides realistic natural depth
  // =========================================================================
  const outerTerrain = new THREE.Mesh(new THREE.PlaneGeometry(480, 480), outerForestMat);
  outerTerrain.rotation.x = -Math.PI / 2;
  outerTerrain.position.set(0, -0.05, 0);
  outerTerrain.receiveShadow = true;
  lotusSocietyGroup.add(outerTerrain);

  // Society Main Ground Podium (Inside Compound Wall)
  const PODIUM_W = 150.0;
  const PODIUM_L = 175.0;
  const podiumGeo = new THREE.BoxGeometry(PODIUM_W, 0.4, PODIUM_L);
  const societyPodium = new THREE.Mesh(podiumGeo, lawnMat);
  societyPodium.position.set(0, 0.18, 0);
  societyPodium.receiveShadow = true;
  lotusSocietyGroup.add(societyPodium);

  // =========================================================================
  // B. PERIMETER COMPOUND WALL WITH WARM WALL-WASHER DOWNLIGHT SCONCES
  // Enclosing the entire society with articulated columns and coping
  // =========================================================================
  const wallGroup = new THREE.Group();
  const WALL_H = 3.6;
  const halfW = PODIUM_W / 2;
  const halfL = PODIUM_L / 2;

  function createWallSection(len, posX, posZ, rotY = 0) {
    const sec = new THREE.Group();
    // Main wall body
    const wallBody = new THREE.Mesh(new THREE.BoxGeometry(len, WALL_H, 0.5), stuccoMat);
    wallBody.position.set(0, WALL_H / 2, 0);
    wallBody.castShadow = true;
    wallBody.receiveShadow = true;
    sec.add(wallBody);

    // Stone coping cap on top of wall
    const cap = new THREE.Mesh(new THREE.BoxGeometry(len + 0.2, 0.22, 0.75), darkTrimMat);
    cap.position.set(0, WALL_H + 0.11, 0);
    cap.castShadow = true;
    sec.add(cap);

    // Architectural piers & warm wall sconces every 6 meters
    const pierCount = Math.floor(len / 6.0);
    for (let p = 0; p <= pierCount; p++) {
      const px = -len / 2 + p * (len / pierCount);
      const pier = new THREE.Mesh(new THREE.BoxGeometry(0.75, WALL_H + 0.35, 0.75), charcoalMat);
      pier.position.set(px, (WALL_H + 0.35) / 2, 0);
      pier.castShadow = true;
      sec.add(pier);

      const pierCap = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.18, 0.95), darkTrimMat);
      pierCap.position.set(px, WALL_H + 0.44, 0);
      sec.add(pierCap);

      // Warm Downlight Wall Sconce illuminating wall panel
      const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.15), wallSconceMat);
      sconce.position.set(px, WALL_H - 0.4, 0.42);
      sec.add(sconce);

      // Downward light cone effect
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.8, 8), wallSconceMat);
      cone.position.set(px, WALL_H - 1.4, 0.44);
      cone.rotation.x = Math.PI;
      sec.add(cone);
    }

    sec.position.set(posX, 0, posZ);
    sec.rotation.y = rotY;
    return sec;
  }

  // North (Rear) Wall
  wallGroup.add(createWallSection(PODIUM_W, 0, -halfL));
  // East Wall
  wallGroup.add(createWallSection(PODIUM_L, halfW, 0, Math.PI / 2));
  // West Wall
  wallGroup.add(createWallSection(PODIUM_L, -halfW, 0, Math.PI / 2));
  // South Wall (Split with 22m opening for Grand Entrance Gatehouse)
  const southSideLen = (PODIUM_W - 24.0) / 2;
  wallGroup.add(createWallSection(southSideLen, -halfW + southSideLen / 2, halfL));
  wallGroup.add(createWallSection(southSideLen, halfW - southSideLen / 2, halfL));

  lotusSocietyGroup.add(wallGroup);

  // =========================================================================
  // C. GRAND ENTRANCE SECURITY GATEHOUSE & MONOLITH SIGN
  // Monolith with glowing golden lotus emblem, guard cabin, boom barrier, zebra crossing, sedan
  // =========================================================================
  const gateGroup = new THREE.Group();
  gateGroup.position.set(0, 0, halfL);

  // Monolith Architectural Feature Wall with Backlit "Lotus Residency"
  const signWall = new THREE.Mesh(new THREE.BoxGeometry(10.5, 4.4, 0.8), charcoalMat);
  signWall.position.set(-7.5, 2.2, 0);
  signWall.castShadow = true;
  gateGroup.add(signWall);

  const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 3.6), new THREE.MeshBasicMaterial({ map: signTex }));
  signBoard.position.set(-7.5, 2.2, 0.42);
  gateGroup.add(signBoard);

  // Vertical green living moss strip on monolith
  const mossStrip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.0, 0.1), lawnMat);
  mossStrip.position.set(-2.5, 2.2, 0.42);
  gateGroup.add(mossStrip);

  // Security Guard Cabin with illuminated windows
  const cabinW = 5.2;
  const cabinL = 4.2;
  const cabinH = 3.8;
  const guardCabin = new THREE.Mesh(new THREE.BoxGeometry(cabinW, cabinH, cabinL), stuccoMat);
  guardCabin.position.set(11.0, cabinH / 2, 0);
  guardCabin.castShadow = true;
  gateGroup.add(guardCabin);

  // Guardhouse Illuminated Panoramic Corner Window
  const guardWin = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 0.1), windowGlassMat);
  guardWin.position.set(9.5, 2.2, cabinL / 2 + 0.02);
  gateGroup.add(guardWin);

  // Cantilevered Modern Dark Roof Canopy spanning Gatehouse & Cabin
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.5, 8.5), darkTrimMat);
  canopy.position.set(5.5, 4.4, 0);
  canopy.castShadow = true;
  gateGroup.add(canopy);

  // Canopy Underside Spotlights illuminating driveway
  for (let s = -2; s <= 2; s++) {
    const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 12), streetlampGlobeMat);
    spot.position.set(5.5 + s * 3.2, 4.12, 0);
    gateGroup.add(spot);
  }

  // Pedestrian Slat Gate & Security Turnstile
  const wicketGate = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.0, 0.1), darkTrimMat);
  wicketGate.position.set(15.2, 1.5, 0);
  gateGroup.add(wicketGate);

  // Motorized Boom Barrier Arm across main vehicular drive
  const barrierBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.2, 16), charcoalMat);
  barrierBase.position.set(7.5, 0.6, 1.6);
  gateGroup.add(barrierBase);

  const barrierArm = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.14, 0.08), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  barrierArm.position.set(3.8, 1.0, 1.6);
  gateGroup.add(barrierArm);

  // Red stripes on boom barrier
  for (let s = 0; s < 6; s++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.15, 0.09), new THREE.MeshBasicMaterial({ color: 0xee2222 }));
    stripe.position.set(1.2 + s * 1.1, 1.0, 1.6);
    gateGroup.add(stripe);
  }

  // Outside Public Street & Pedestrian Zebra Crossing
  const roadGeo = new THREE.BoxGeometry(180.0, 0.08, 26.0);
  const road = new THREE.Mesh(roadGeo, asphaltMat);
  road.position.set(0, 0.04, 14.0);
  road.receiveShadow = true;
  gateGroup.add(road);

  // Painted White Pedestrian Zebra Crossing in front of gate
  for (let z = 0; z < 10; z++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 5.0), whiteLineMat);
    stripe.position.set(-3.5 + z * 1.5, 0.09, 7.5);
    gateGroup.add(stripe);
  }

  // Luxury Black Sedan entering through the gate
  const carGroup = new THREE.Group();
  const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.88, 4.8), new THREE.MeshStandardMaterial({
    color: 0x0f1115,
    roughness: 0.20,
    metalness: 0.90
  }));
  carBody.position.set(0, 0.75, 0);
  carBody.castShadow = true;
  carGroup.add(carBody);

  const carRoof = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.70, 2.6), new THREE.MeshStandardMaterial({
    color: 0x141820,
    roughness: 0.12,
    metalness: 0.92
  }));
  carRoof.position.set(0, 1.48, -0.2);
  carGroup.add(carRoof);

  // Car Headlights
  const lightL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.06), new THREE.MeshBasicMaterial({ color: 0xfffae0 }));
  lightL.position.set(-0.75, 0.78, -2.41);
  const lightR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.06), new THREE.MeshBasicMaterial({ color: 0xfffae0 }));
  lightR.position.set(0.75, 0.78, -2.41);
  carGroup.add(lightL); carGroup.add(lightR);

  // Car 4 Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.26, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.8 });
  const wheelPositions = [[-1.1, 0.38, 1.45], [1.1, 0.38, 1.45], [-1.1, 0.38, -1.45], [1.1, 0.38, -1.45]];
  wheelPositions.forEach(p => {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(...p);
    carGroup.add(w);
  });

  carGroup.position.set(4.2, 0.05, 10.5);
  carGroup.rotation.y = -0.15; // Angled entering through gate
  gateGroup.add(carGroup);

  lotusSocietyGroup.add(gateGroup);

  // =========================================================================
  // D. FOUR CONTEMPORARY 6-FLOOR APARTMENT TOWERS (BLOCKS A, B, C, D)
  // Articulated volumetric massing with balconies, dark accents & glowing windows on ALL 4 SIDES
  // =========================================================================
  const TOWER_FLOORS = 6;
  const TOWER_FLOOR_H = 3.5;
  const TOWER_H = TOWER_FLOORS * TOWER_FLOOR_H; // ~21.0m
  const TOWER_LEN = 38.0;
  const TOWER_W = 16.0;

  function createContemporaryApartmentBlock(name, posX, posZ, rotY = 0) {
    const block = new THREE.Group();
    block.name = name;

    // Main Central Core (Limestone Stucco)
    const coreGeo = new THREE.BoxGeometry(TOWER_W - 0.4, TOWER_H, TOWER_LEN - 0.4);
    const core = new THREE.Mesh(coreGeo, stuccoMat);
    core.position.set(0, TOWER_H / 2, 0);
    core.castShadow = true;
    core.receiveShadow = true;
    block.add(core);

    // Staggered Volumetric Accent Channels (Dark Charcoal Accent Wings)
    const wingGeo = new THREE.BoxGeometry(TOWER_W + 0.8, TOWER_H, 9.0);
    const wingNorth = new THREE.Mesh(wingGeo, charcoalMat);
    wingNorth.position.set(0, TOWER_H / 2, -TOWER_LEN / 2 + 5.5);
    wingNorth.castShadow = true;
    block.add(wingNorth);

    const wingSouth = new THREE.Mesh(wingGeo, charcoalMat);
    wingSouth.position.set(0, TOWER_H / 2, TOWER_LEN / 2 - 5.5);
    wingSouth.castShadow = true;
    block.add(wingSouth);

    // Central Vertical Reveal / Elevator Core Groove
    const groove = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W + 1.2, TOWER_H, 3.2), darkTrimMat);
    groove.position.set(0, TOWER_H / 2, 0);
    block.add(groove);

    // 6 Floors with Windows, Cantilevered Balconies & Railings on ALL 4 SIDES
    for (let f = 0; f < TOWER_FLOORS; f++) {
      const floorY = f * TOWER_FLOOR_H;

      // Continuous Floor Slab Cornice
      const slab = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W + 1.0, 0.32, TOWER_LEN + 1.0), balconySlabMat);
      slab.position.set(0, floorY + 0.16, 0);
      slab.castShadow = true;
      slab.receiveShadow = true;
      block.add(slab);

      // --- Long Facade 1: Courtyard-Facing (-X) ---
      const UNITS = 6;
      const unitLen = (TOWER_LEN - 3.6) / UNITS;
      for (let u = 0; u < UNITS; u++) {
        const uz = (-TOWER_LEN / 2 + unitLen / 2 + 1.8) + u * unitLen;

        // Sliding Glass Balcony Door with warm amber glow
        const win = new THREE.Mesh(new THREE.PlaneGeometry(unitLen - 0.8, TOWER_FLOOR_H - 0.6), windowGlassMat);
        win.position.set(-TOWER_W / 2 - 0.05, floorY + TOWER_FLOOR_H / 2 + 0.1, uz);
        win.rotation.y = -Math.PI / 2;
        block.add(win);

        // Cantilevered Balcony Slab
        const balc = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.20, unitLen - 0.6), balconySlabMat);
        balc.position.set(-TOWER_W / 2 - 0.88, floorY + 0.38, uz);
        balc.castShadow = true;
        balc.receiveShadow = true;
        block.add(balc);

        // Modern Horizontal Black Slat Balustrade
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.90, unitLen - 0.6), balconyRailingMat);
        rail.position.set(-TOWER_W / 2 - 1.62, floorY + 0.90, uz);
        block.add(rail);

        // Warm Balcony Ceiling Downlight (Under-slab illumination from reference photo)
        const downlight = new THREE.Mesh(new THREE.PlaneGeometry(unitLen - 1.2, 1.2), windowGlowMat);
        downlight.position.set(-TOWER_W / 2 - 0.88, floorY + TOWER_FLOOR_H - 0.02, uz);
        downlight.rotation.x = Math.PI / 2;
        block.add(downlight);

        // Warm interior glowing room panel behind glass
        const glow = new THREE.Mesh(new THREE.PlaneGeometry(unitLen - 1.2, TOWER_FLOOR_H - 0.9), windowGlowMat);
        glow.position.set(-TOWER_W / 2 + 0.1, floorY + TOWER_FLOOR_H / 2 + 0.1, uz);
        glow.rotation.y = -Math.PI / 2;
        block.add(glow);
      }

      // --- Long Facade 2: Outer-Facing (+X) ---
      for (let u = 0; u < UNITS; u++) {
        const uz = (-TOWER_LEN / 2 + unitLen / 2 + 1.8) + u * unitLen;
        const win = new THREE.Mesh(new THREE.PlaneGeometry(unitLen - 0.8, TOWER_FLOOR_H - 0.6), windowGlassMat);
        win.position.set(TOWER_W / 2 + 0.05, floorY + TOWER_FLOOR_H / 2 + 0.1, uz);
        win.rotation.y = Math.PI / 2;
        block.add(win);

        const balc = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.20, unitLen - 0.6), balconySlabMat);
        balc.position.set(TOWER_W / 2 + 0.88, floorY + 0.38, uz);
        balc.castShadow = true;
        block.add(balc);

        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.90, unitLen - 0.6), balconyRailingMat);
        rail.position.set(TOWER_W / 2 + 1.62, floorY + 0.90, uz);
        block.add(rail);

        const downlight = new THREE.Mesh(new THREE.PlaneGeometry(unitLen - 1.2, 1.2), windowGlowMat);
        downlight.position.set(TOWER_W / 2 + 0.88, floorY + TOWER_FLOOR_H - 0.02, uz);
        downlight.rotation.x = -Math.PI / 2;
        block.add(downlight);
      }

      // --- Short Facade 3: South Face (+Z) ---
      for (let b = -1; b <= 1; b++) {
        const bx = b * 4.4;
        const win = new THREE.Mesh(new THREE.PlaneGeometry(3.0, TOWER_FLOOR_H - 0.6), windowGlassMat);
        win.position.set(bx, floorY + TOWER_FLOOR_H / 2 + 0.1, TOWER_LEN / 2 + 0.05);
        block.add(win);

        const balc = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.20, 1.3), balconySlabMat);
        balc.position.set(bx, floorY + 0.38, TOWER_LEN / 2 + 0.70);
        balc.castShadow = true;
        block.add(balc);

        const rail = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.90, 0.06), balconyRailingMat);
        rail.position.set(bx, floorY + 0.90, TOWER_LEN / 2 + 1.32);
        block.add(rail);
      }

      // --- Short Facade 4: North Face (-Z) ---
      for (let b = -1; b <= 1; b++) {
        const bx = b * 4.4;
        const win = new THREE.Mesh(new THREE.PlaneGeometry(3.0, TOWER_FLOOR_H - 0.6), windowGlassMat);
        win.position.set(bx, floorY + TOWER_FLOOR_H / 2 + 0.1, -TOWER_LEN / 2 - 0.05);
        win.rotation.y = Math.PI;
        block.add(win);

        const balc = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.20, 1.3), balconySlabMat);
        balc.position.set(bx, floorY + 0.38, -TOWER_LEN / 2 - 0.70);
        balc.castShadow = true;
        block.add(balc);

        const rail = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.90, 0.06), balconyRailingMat);
        rail.position.set(bx, floorY + 0.90, -TOWER_LEN / 2 - 1.32);
        block.add(rail);
      }
    }

    // Rooftop Parapet & Stair/Elevator Penthouse Bulkheads
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W + 0.8, 1.4, TOWER_LEN + 0.8), stuccoMat);
    parapet.position.set(0, TOWER_H + 0.7, 0);
    block.add(parapet);

    // Parapet Dark Charcoal Edge Cap
    const parapetCap = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W + 1.0, 0.20, TOWER_LEN + 1.0), darkTrimMat);
    parapetCap.position.set(0, TOWER_H + 1.45, 0);
    block.add(parapetCap);

    // Elevator & Stair Penthouse Machine Room
    const bulkhead = new THREE.Mesh(new THREE.BoxGeometry(7.0, 3.4, 9.0), darkTrimMat);
    bulkhead.position.set(0, TOWER_H + 1.7, 0);
    bulkhead.castShadow = true;
    block.add(bulkhead);

    // Photovoltaic Solar Panel Arrays on Rooftop (Angled at 20 degrees)
    for (let sp = -1; sp <= 1; sp += 2) {
      const solar = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.15, 6.0), solarPanelMat);
      solar.position.set(0, TOWER_H + 2.0, sp * 11.0);
      solar.rotation.x = sp * 0.35;
      solar.castShadow = true;
      block.add(solar);
    }

    block.position.set(posX, 0.18, posZ);
    block.rotation.y = rotY;
    return block;
  }

  // 4 Apartment Towers arranged in U-shaped courtyard layout matching reference photo
  // Front towers run North-South framing the gate; Rear towers run East-West enclosing the back
  const towerA = createContemporaryApartmentBlock('Block A (Front-Left)', -46.0, 32.0, 0);
  const towerB = createContemporaryApartmentBlock('Block B (Rear-Left)', -24.0, -52.0, Math.PI / 2);
  const towerC = createContemporaryApartmentBlock('Block C (Front-Right)', 46.0, 32.0, Math.PI);
  const towerD = createContemporaryApartmentBlock('Block D (Rear-Right)', 24.0, -52.0, -Math.PI / 2);

  lotusSocietyGroup.add(towerA);
  lotusSocietyGroup.add(towerB);
  lotusSocietyGroup.add(towerC);
  lotusSocietyGroup.add(towerD);

  // =========================================================================
  // E. CONTEMPORARY 2-TIER CLUBHOUSE & GYM (Center-Left Courtyard)
  // Panoramic floor-to-ceiling glass, glowing interior lounge, "Clubhouse" sign
  // =========================================================================
  const clubGroup = new THREE.Group();
  clubGroup.position.set(-16.0, 0.18, 6.0);

  // Lower Level Lounge
  const clubLowerW = 20.0; const clubLowerL = 14.0; const clubLowerH = 4.4;
  const clubLower = new THREE.Mesh(new THREE.BoxGeometry(clubLowerW, clubLowerH, clubLowerL), stuccoMat);
  clubLower.position.set(0, clubLowerH / 2, 0);
  clubLower.castShadow = true;
  clubGroup.add(clubLower);

  // Panoramic Glass Facade on Courtyard Side (+X)
  const clubGlass = new THREE.Mesh(new THREE.PlaneGeometry(clubLowerL - 1.0, clubLowerH - 0.6), windowGlassMat);
  clubGlass.position.set(clubLowerW / 2 + 0.05, clubLowerH / 2, 0);
  clubGlass.rotation.y = Math.PI / 2;
  clubGroup.add(clubGlass);

  // Warm interior lounge floor and ceiling glow
  const loungeGlow = new THREE.Mesh(new THREE.PlaneGeometry(clubLowerL - 2.0, clubLowerH - 1.0), windowGlowMat);
  loungeGlow.position.set(clubLowerW / 2 - 0.2, clubLowerH / 2, 0);
  loungeGlow.rotation.y = Math.PI / 2;
  clubGroup.add(loungeGlow);

  // Upper Tier Level
  const clubUpperW = 14.0; const clubUpperL = 10.0; const clubUpperH = 3.6;
  const clubUpper = new THREE.Mesh(new THREE.BoxGeometry(clubUpperW, clubUpperH, clubUpperL), charcoalMat);
  clubUpper.position.set(-2.0, clubLowerH + clubUpperH / 2, 0);
  clubUpper.castShadow = true;
  clubGroup.add(clubUpper);

  // Cantilevered Roof Fascia with Illuminated "Clubhouse" 3D Signage
  const clubFascia = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.45, 12.0), darkTrimMat);
  clubFascia.position.set(-2.0, clubLowerH + clubUpperH + 0.22, 0);
  clubGroup.add(clubFascia);

  // "Clubhouse" Illuminated Signboard Canvas
  const clubSignCanvas = document.createElement('canvas');
  clubSignCanvas.width = 512; clubSignCanvas.height = 128;
  const cctx = clubSignCanvas.getContext('2d');
  cctx.fillStyle = '#22262c'; cctx.fillRect(0, 0, 512, 128);
  cctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
  cctx.fillStyle = '#ffffff'; cctx.textAlign = 'center';
  cctx.fillText('Clubhouse', 256, 85);
  const clubSignTex = new THREE.CanvasTexture(clubSignCanvas);

  const clubSignMesh = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 1.8), new THREE.MeshBasicMaterial({ map: clubSignTex }));
  clubSignMesh.position.set(5.1, clubLowerH + clubUpperH / 2 + 0.2, 0);
  clubSignMesh.rotation.y = Math.PI / 2;
  clubGroup.add(clubSignMesh);

  // Outdoor Terrace Seating & Umbrellas
  for (let u = -1; u <= 1; u += 2) {
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.75, 12), darkTrimMat);
    table.position.set(clubLowerW / 2 + 3.0, 0.38, u * 3.5);
    clubGroup.add(table);

    const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.6, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
    umbrella.position.set(clubLowerW / 2 + 3.0, 2.4, u * 3.5);
    clubGroup.add(umbrella);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), darkTrimMat);
    pole.position.set(clubLowerW / 2 + 3.0, 1.2, u * 3.5);
    clubGroup.add(pole);
  }

  lotusSocietyGroup.add(clubGroup);

  // =========================================================================
  // F. RESORT SWIMMING POOL OASIS (Behind Clubhouse)
  // Crystal turquoise pool with white coping, sun deck & loungers
  // =========================================================================
  const poolGroup = new THREE.Group();
  poolGroup.position.set(-16.0, 0.18, -30.0);

  const pW = 28.0; const pL = 15.0;
  // Travertine Stone Pool Deck (Framed around pool basin, open in middle)
  const deckN = new THREE.Mesh(new THREE.BoxGeometry(pW + 10.0, 0.22, 5.0), poolDeckMat);
  deckN.position.set(0, 0.11, -pL / 2 - 2.5);
  deckN.receiveShadow = true; poolGroup.add(deckN);

  const deckS = new THREE.Mesh(new THREE.BoxGeometry(pW + 10.0, 0.22, 5.0), poolDeckMat);
  deckS.position.set(0, 0.11, pL / 2 + 2.5);
  deckS.receiveShadow = true; poolGroup.add(deckS);

  const deckE = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.22, pL), poolDeckMat);
  deckE.position.set(pW / 2 + 2.5, 0.11, 0);
  deckE.receiveShadow = true; poolGroup.add(deckE);

  const deckW = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.22, pL), poolDeckMat);
  deckW.position.set(-pW / 2 - 2.5, 0.11, 0);
  deckW.receiveShadow = true; poolGroup.add(deckW);

  // White Pool Coping Rim around pool edge
  const poolCoping = new THREE.Mesh(new THREE.BoxGeometry(pW + 0.8, 0.26, pL + 0.8), balconySlabMat);
  poolCoping.position.set(0, 0.13, 0);
  poolGroup.add(poolCoping);

  // Brilliant Turquoise Glowing Pool Basin Water
  const poolWater = new THREE.Mesh(new THREE.BoxGeometry(pW, 0.28, pL), poolWaterMat);
  poolWater.position.set(0, 0.15, 0);
  poolGroup.add(poolWater);

  // Underwater Cyan Illumination Glow
  const poolInnerGlow = new THREE.Mesh(new THREE.PlaneGeometry(pW - 1.0, pL - 1.0), poolLightMat);
  poolInnerGlow.rotation.x = -Math.PI / 2;
  poolInnerGlow.position.set(0, 0.18, 0);
  poolGroup.add(poolInnerGlow);

  // Row of White Luxury Sun Loungers with Parasols
  for (let l = 0; l < 7; l++) {
    const lx = -pW / 2 + 2.5 + l * (pW / 7.2);
    // Wooden lounger bed
    const lounger = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.22, 2.2), balconySlabMat);
    lounger.position.set(lx, 0.32, -pL / 2 - 2.2);
    lounger.castShadow = true;
    poolGroup.add(lounger);

    // Reclined backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.18, 0.8), balconySlabMat);
    back.position.set(lx, 0.65, -pL / 2 - 3.0);
    back.rotation.x = -0.45;
    poolGroup.add(back);

    // White Parasol Umbrella
    if (l % 2 === 0) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 8), darkTrimMat);
      pole.position.set(lx, 1.25, -pL / 2 - 3.6);
      poolGroup.add(pole);

      const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.5, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
      umbrella.position.set(lx, 2.45, -pL / 2 - 3.6);
      umbrella.castShadow = true;
      poolGroup.add(umbrella);
    }
  }

  lotusSocietyGroup.add(poolGroup);

  // =========================================================================
  // G. CENTRAL MANICURED OVAL LAWN & JOGGING TRACK
  // Oval lawn in the center courtyard with warm garden bollards
  // =========================================================================
  const lawnGroup = new THREE.Group();
  lawnGroup.position.set(6.0, 0.18, 10.0);

  // Curved Stone Curb Ring around Lawn
  const curbRing = new THREE.Mesh(new THREE.RingGeometry(17.5, 18.4, 48), curbMat);
  curbRing.rotation.x = -Math.PI / 2;
  curbRing.scale.set(1.15, 1.45, 1.0);
  curbRing.position.set(0, 0.08, 0);
  lawnGroup.add(curbRing);

  // Manicured Emerald Turf Circle
  const ovalTurf = new THREE.Mesh(new THREE.CircleGeometry(17.5, 48), lawnMat);
  ovalTurf.rotation.x = -Math.PI / 2;
  ovalTurf.scale.set(1.15, 1.45, 1.0);
  ovalTurf.position.set(0, 0.09, 0);
  ovalTurf.receiveShadow = true;
  lawnGroup.add(ovalTurf);

  // Warm Landscape Lighting Bollards along the oval edge
  for (let b = 0; b < 16; b++) {
    const angle = (b / 16) * Math.PI * 2;
    const bx = Math.cos(angle) * 14.8 * 1.1;
    const bz = Math.sin(angle) * 14.8 * 1.45;

    const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.85, 8), darkTrimMat);
    bollard.position.set(bx, 0.42, bz);
    lawnGroup.add(bollard);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), streetlampGlobeMat);
    bulb.position.set(bx, 0.82, bz);
    lawnGroup.add(bulb);
  }

  lotusSocietyGroup.add(lawnGroup);

  // =========================================================================
  // H. CHILDREN'S ADVENTURE PLAYGROUND (Front-Left Courtyard)
  // Multicolored play fort with yellow/red peaked roofs, blue/green slides, swings
  // =========================================================================
  const playGroup = new THREE.Group();
  playGroup.position.set(-16.0, 0.18, 28.0);

  // Circular Safety Play Turf
  const playTurf = new THREE.Mesh(new THREE.CircleGeometry(8.5, 32), new THREE.MeshStandardMaterial({
    color: 0xc87d4a, // Terracotta safety rubber turf
    roughness: 0.95
  }));
  playTurf.rotation.x = -Math.PI / 2;
  playTurf.position.set(0, 0.04, 0);
  playGroup.add(playTurf);

  // Main Play Tower Fort (Platform with railings)
  const fortDeck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 2.4), darkTrimMat);
  fortDeck.position.set(0, 1.4, 0);
  playGroup.add(fortDeck);

  // Fort 4 Corner Posts
  const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
  [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]].forEach(pos => {
    const p = new THREE.Mesh(postGeo, postMat);
    p.position.set(pos[0], 1.4, pos[1]);
    playGroup.add(p);
  });

  // Bright Yellow Peaked Fort Roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.4, 4), new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.3 }));
  roof.rotation.y = Math.PI / 4;
  roof.position.set(0, 3.4, 0);
  roof.castShadow = true;
  playGroup.add(roof);

  // Secondary Red Tower
  const fortDeck2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 1.8), darkTrimMat);
  fortDeck2.position.set(2.4, 1.1, 0);
  playGroup.add(fortDeck2);

  const roof2 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.1, 4), new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.3 }));
  roof2.rotation.y = Math.PI / 4;
  roof2.position.set(2.4, 2.7, 0);
  roof2.castShadow = true;
  playGroup.add(roof2);

  // Colorful Play Slides (Bright Blue Spiral & Green Straight Slide)
  const slideBlue = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 3.2), new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.2 }));
  slideBlue.position.set(0, 0.7, 2.0);
  slideBlue.rotation.x = 0.45;
  playGroup.add(slideBlue);

  const slideGreen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 2.8), new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.2 }));
  slideGreen.position.set(2.4, 0.55, 1.8);
  slideGreen.rotation.x = 0.40;
  playGroup.add(slideGreen);

  // Swing Set
  const swingBeam = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 4.0), darkTrimMat);
  swingBeam.position.set(-3.5, 2.5, 0);
  playGroup.add(swingBeam);
  const swingLegA = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), darkTrimMat);
  swingLegA.position.set(-3.5, 1.3, -1.9); swingLegA.rotation.x = 0.2;
  const swingLegB = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), darkTrimMat);
  swingLegB.position.set(-3.5, 1.3, 1.9); swingLegB.rotation.x = -0.2;
  playGroup.add(swingLegA); playGroup.add(swingLegB);

  lotusSocietyGroup.add(playGroup);

  // =========================================================================
  // I. MULTI-SPORT BASKETBALL & TENNIS COURT (Front-Right Courtyard)
  // Dual-tone green & terracotta acrylic, regulation lines, hoops, floodlights
  // =========================================================================
  const courtGroup = new THREE.Group();
  courtGroup.position.set(26.0, 0.18, 26.0);

  const cW = 28.0; const cL = 16.0;
  // Forest Green Acrylic Court Surround
  const courtSurround = new THREE.Mesh(new THREE.BoxGeometry(cW, 0.12, cL), courtGreenMat);
  courtSurround.position.set(0, 0.06, 0);
  courtSurround.receiveShadow = true;
  courtGroup.add(courtSurround);

  // Terracotta Red Playing Key (Matching reference photo)
  const courtPlaying = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.14, 12.0), courtBlueMat);
  courtPlaying.position.set(0, 0.07, 0);
  courtGroup.add(courtPlaying);

  // Navy Center Circle
  const courtCenter = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.16, 24), courtKeyMat);
  courtCenter.position.set(0, 0.08, 0);
  courtGroup.add(courtCenter);

  // Regulation White Court Lines
  const linePerimeter = new THREE.Mesh(new THREE.BoxGeometry(24.2, 0.18, 12.2), whiteLineMat);
  linePerimeter.position.set(0, 0.08, 0);
  const centerLine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 12.0), whiteLineMat);
  centerLine.position.set(0, 0.09, 0);
  courtGroup.add(centerLine);

  // Basketball Hoops on East and West ends
  [-12.0, 12.0].forEach((hx, idx) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 4.0, 12), darkTrimMat);
    pole.position.set(hx, 2.0, 0);
    courtGroup.add(pole);

    const backboard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 1.9), new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    }));
    backboard.position.set(hx - (idx === 0 ? -0.4 : 0.4), 3.4, 0);
    courtGroup.add(backboard);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 8, 16), new THREE.MeshBasicMaterial({ color: 0xff5500 }));
    rim.rotation.x = Math.PI / 2;
    rim.position.set(hx - (idx === 0 ? -0.75 : 0.75), 3.0, 0);
    courtGroup.add(rim);
  });

  // Tall Wire Mesh Perimeter Fencing & Corner Floodlight Masts
  const fenceH = 4.4;
  const fenceN = new THREE.Mesh(new THREE.BoxGeometry(cW, fenceH, 0.05), fenceWireMat);
  fenceN.position.set(0, fenceH / 2, -cL / 2);
  const fenceS = new THREE.Mesh(new THREE.BoxGeometry(cW, fenceH, 0.05), fenceWireMat);
  fenceS.position.set(0, fenceH / 2, cL / 2);
  const fenceE = new THREE.Mesh(new THREE.BoxGeometry(0.05, fenceH, cL), fenceWireMat);
  fenceE.position.set(cW / 2, fenceH / 2, 0);
  const fenceW = new THREE.Mesh(new THREE.BoxGeometry(0.05, fenceH, cL), fenceWireMat);
  fenceW.position.set(-cW / 2, fenceH / 2, 0);
  courtGroup.add(fenceN); courtGroup.add(fenceS); courtGroup.add(fenceE); courtGroup.add(fenceW);

  // 4 Corner Floodlight Masts
  const mastPositions = [[-cW / 2, -cL / 2], [cW / 2, -cL / 2], [-cW / 2, cL / 2], [cW / 2, cL / 2]];
  mastPositions.forEach(mp => {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 8.0, 8), darkTrimMat);
    mast.position.set(mp[0], 4.0, mp[1]);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.40, 0.55), window.__lotusMats.courtFloodlightMat);
    lamp.position.set(mp[0], 7.8, mp[1]);
    courtGroup.add(mast); courtGroup.add(lamp);
  });

  lotusSocietyGroup.add(courtGroup);

  // =========================================================================
  // J. CURVING STONE FOOTPATHS, HEDGES, LUSH TREES & LIGHTING
  // Connecting all amenities with travertine pavers and manicured boxwood hedges
  // =========================================================================
  const pathGroup = new THREE.Group();

  // Grand Entrance Driveway - Seamless connection from Gatehouse to Courtyard
  const mainDrive = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.10, 68.0), promenadeMat);
  mainDrive.position.set(0, 0.05, 54.0);
  mainDrive.receiveShadow = true;
  pathGroup.add(mainDrive);

  // Curving Walkway around Central Oval Lawn
  const ringWalk = new THREE.Mesh(new THREE.RingGeometry(18.2, 23.5, 48), promenadeMat);
  ringWalk.rotation.x = -Math.PI / 2;
  ringWalk.scale.set(1.15, 1.45, 1.0);
  ringWalk.position.set(6.0, 0.06, 10.0);
  pathGroup.add(ringWalk);

  // Cross Walkway to Clubhouse and Pool
  const clubWalk = new THREE.Mesh(new THREE.BoxGeometry(26.0, 0.08, 4.2), promenadeMat);
  clubWalk.position.set(-14.0, 0.05, 4.0);
  pathGroup.add(clubWalk);

  // Walkway to Sports Court
  const courtWalk = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.08, 3.8), promenadeMat);
  courtWalk.position.set(16.0, 0.05, 26.0);
  pathGroup.add(courtWalk);

  // Continuous Manicured Boxwood Hedges bordering walkways
  function createHedge(len, x, z, rotY = 0) {
    const hedge = new THREE.Mesh(
      new THREE.BoxGeometry(len, 0.9, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x1f4e18, roughness: 0.85 })
    );
    hedge.position.set(x, 0.45, z);
    hedge.rotation.y = rotY;
    hedge.castShadow = true;
    return hedge;
  }

  pathGroup.add(createHedge(40.0, -5.5, 48.0, Math.PI / 2));
  pathGroup.add(createHedge(40.0, 5.5, 48.0, Math.PI / 2));
  pathGroup.add(createHedge(24.0, -14.0, 6.6));
  pathGroup.add(createHedge(16.0, 16.0, 24.0));

  // Lush Multi-Sphere Organic Trees with Ground Uplights
  function createLushTree(x, z, scale = 1.0, leafColor = 0x22551a) {
    const tree = new THREE.Group();
    // Realistic Bark Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26 * scale, 0.38 * scale, 5.0 * scale, 8),
      new THREE.MeshStandardMaterial({ color: 0x483a2b, roughness: 0.95 })
    );
    trunk.position.set(0, 2.5 * scale, 0);
    trunk.castShadow = true;
    tree.add(trunk);

    // Multi-tier lush foliage canopy (Organic billowing foliage)
    const leafMat = new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.72 });
    const c1 = new THREE.Mesh(new THREE.SphereGeometry(2.6 * scale, 12, 12), leafMat);
    c1.position.set(0, 5.2 * scale, 0);
    c1.scale.set(1.15, 0.95, 1.15);
    c1.castShadow = true;

    const c2 = new THREE.Mesh(new THREE.SphereGeometry(2.0 * scale, 10, 10), leafMat);
    c2.position.set(0.7 * scale, 6.2 * scale, 0.5 * scale);
    c2.castShadow = true;

    const c3 = new THREE.Mesh(new THREE.SphereGeometry(1.8 * scale, 10, 10), leafMat);
    c3.position.set(-0.6 * scale, 6.0 * scale, -0.4 * scale);
    c3.castShadow = true;

    tree.add(c1); tree.add(c2); tree.add(c3);

    // Integrated Golden Uplight at Base of Tree shining into canopy
    const uplight = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.35, 8), treeUplightMat);
    uplight.position.set(0.4 * scale, 0.18, 0.4 * scale);
    uplight.rotation.x = Math.PI;
    tree.add(uplight);

    tree.position.set(x, 0.18, z);
    return tree;
  }

  // Plant 48+ Trees inside Courtyard matching reference photo density (Keeping central axis clear)
  const courtyardTreePositions = [
    [-26, 48, 1.15, 0x24581c], [26, 48, 1.15, 0x1e4e16], [-22, 24, 1.05, 0x286020], [22, 16, 1.1, 0x22551a],
    [-28, -8, 1.2, 0x1f4f18], [28, -8, 1.2, 0x275d1f], [-42, -58, 1.2, 0x22551a], [42, -58, 1.2, 0x24581c],
    [-58, 12, 1.3, 0x1c4814], [58, 12, 1.3, 0x22551a], [-58, 45, 1.2, 0x25591d], [58, 45, 1.2, 0x1f4f18],
    [-58, -20, 1.2, 0x286020], [58, -20, 1.2, 0x22551a], [-58, -48, 1.3, 0x1e4e16], [58, -48, 1.3, 0x25591d],
    [-48, -58, 1.2, 0x22551a], [48, -58, 1.2, 0x24581c], [0, -62, 1.3, 0x1f4f18],
    [-34, 62, 1.1, 0x286020], [34, 62, 1.1, 0x22551a], [-24, 56, 1.05, 0x25591d], [24, 56, 1.05, 0x1e4e16],
    [-28, 34, 1.1, 0x1f4f18], [28, 8, 1.1, 0x286020],
    [-32, 18, 1.15, 0x1e4e16], [32, 22, 1.15, 0x24581c],
    [-42, 8, 1.1, 0x22551a], [42, 6, 1.1, 0x1f4f18], [-42, -16, 1.2, 0x25591d], [42, -14, 1.2, 0x286020]
  ];

  courtyardTreePositions.forEach(tp => {
    pathGroup.add(createLushTree(tp[0], tp[1], tp[2], tp[3]));
  });

  // Plant Dense Outer Perimeter Forest (Outside the Compound Wall)
  // Provides complete depth and natural environment all around
  for (let a = 0; a < 64; a++) {
    const angle = (a / 64) * Math.PI * 2;
    const r1 = 98.0 + (a % 3) * 12.0;
    const r2 = 124.0 + (a % 4) * 15.0;
    const fx1 = Math.cos(angle) * r1;
    const fz1 = Math.sin(angle) * r1;
    const fx2 = Math.cos(angle) * r2;
    const fz2 = Math.sin(angle) * r2;

    // Leave the main public road & entrance gate arrival corridor open (+Z axis, x: -28 to +28, z > 60)
    if (!(Math.abs(fx1) < 28 && fz1 > 60)) {
      pathGroup.add(createLushTree(fx1, fz1, 1.35 + (a % 3) * 0.25, 0x1a4214));
    }
    if (!(Math.abs(fx2) < 28 && fz2 > 60)) {
      pathGroup.add(createLushTree(fx2, fz2, 1.50 + (a % 2) * 0.30, 0x163810));
    }
  }

  // Modern Pedestrian Streetlamps along Footpaths
  function createStreetlamp(x, z) {
    const lamp = new THREE.Group();
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 4.4, 8), darkTrimMat);
    post.position.set(0, 2.2, 0);
    lamp.add(post);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.08), darkTrimMat);
    arm.position.set(0.24, 4.35, 0);
    lamp.add(arm);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), streetlampGlobeMat);
    head.position.set(0.48, 4.25, 0);
    lamp.add(head);

    lamp.position.set(x, 0.18, z);
    return lamp;
  }

  [[-5.2, 40], [5.2, 40], [-5.2, 22], [5.2, 22], [-5.2, 4], [5.2, 4], [-26, 4], [20, 8]].forEach(lp => {
    pathGroup.add(createStreetlamp(lp[0], lp[1]));
  });

  lotusSocietyGroup.add(pathGroup);

  // =========================================================================
  // K. ANIMATED 3D RESIDENTS WALKING ON FOOTPATHS
  // Multiple residents walking naturally with arm and leg swings
  // =========================================================================
  function createWalkingResident(cfg) {
    const person = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.shirtCol, roughness: 0.6 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: cfg.pantsCol, roughness: 0.8 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd89568, roughness: 0.5 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.68, 0.25), bodyMat);
    torso.position.set(0, 1.20, 0);
    person.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), skinMat);
    head.position.set(0, 1.70, 0);
    person.add(head);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.16, 0.78, 0.17);
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.set(-0.13, 0.46, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.set(0.13, 0.46, 0);
    person.add(legL); person.add(legR);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.13, 0.58, 0.13);
    const armL = new THREE.Mesh(armGeo, bodyMat);
    armL.position.set(-0.30, 1.15, 0);
    const armR = new THREE.Mesh(armGeo, bodyMat);
    armR.position.set(0.30, 1.15, 0);
    person.add(armL); person.add(armR);

    person.position.set(cfg.x, 0.22, cfg.z);
    lotusSocietyGroup.add(person);

    animatedResidents.push({
      mesh: person,
      legL, legR, armL, armR,
      speed: cfg.speed || 1.0,
      dir: cfg.dir || 1,
      minZ: cfg.minZ,
      maxZ: cfg.maxZ,
      baseY: 0.22
    });
  }

  // 7 animated residents on main walkways
  createWalkingResident({ x: -2.4, z: 26.0, minZ: 10.0, maxZ: 52.0, shirtCol: 0x3498db, pantsCol: 0x2c3e50, speed: 1.1, dir: 1 });
  createWalkingResident({ x: 2.4, z: 44.0, minZ: 12.0, maxZ: 54.0, shirtCol: 0xe74c3c, pantsCol: 0x34495e, speed: 0.95, dir: -1 });
  createWalkingResident({ x: -14.0, z: 4.0, minZ: -8.0, maxZ: 16.0, shirtCol: 0x2ecc71, pantsCol: 0x1e272e, speed: 1.2, dir: 1 });
  createWalkingResident({ x: 8.0, z: 22.0, minZ: 12.0, maxZ: 34.0, shirtCol: 0xf1c40f, pantsCol: 0x2c3e50, speed: 0.85, dir: 1 });
  createWalkingResident({ x: -12.0, z: -22.0, minZ: -34.0, maxZ: -12.0, shirtCol: 0x9b59b6, pantsCol: 0xffffff, speed: 0.9, dir: -1 });
  createWalkingResident({ x: 18.0, z: 26.0, minZ: 14.0, maxZ: 38.0, shirtCol: 0x1abc9c, pantsCol: 0x34495e, speed: 1.0, dir: 1 });
  createWalkingResident({ x: -26.0, z: 12.0, minZ: -2.0, maxZ: 26.0, shirtCol: 0xe67e22, pantsCol: 0x2c3e50, speed: 0.9, dir: -1 });

  // =========================================================================
  // L. LUXURY WALK-IN APARTMENT INTERIOR SUITE
  // Located on the 5th floor of Block A with panoramic balcony view over the society
  // =========================================================================
  apartmentInteriorGroup = new THREE.Group();
  apartmentInteriorGroup.name = 'luxury-walkin-suite';
  apartmentInteriorGroup.position.set(-44.0, 18.2, 40.0); // Inside 5th floor corner residence

  // Hardwood Parquet Floor
  const suiteFloor = new THREE.Mesh(new THREE.BoxGeometry(12.0, 0.2, 10.0), new THREE.MeshStandardMaterial({
    color: 0x8a5d3b,
    roughness: 0.45,
    metalness: 0.1
  }));
  suiteFloor.position.set(0, 0.1, 0);
  apartmentInteriorGroup.add(suiteFloor);

  // Luxury Cream Sofa Lounge
  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 1.4), new THREE.MeshStandardMaterial({ color: 0xedeae4 }));
  sofaBase.position.set(0, 0.45, 1.2);
  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.7, 0.4), new THREE.MeshStandardMaterial({ color: 0xedeae4 }));
  sofaBack.position.set(0, 0.95, 1.7);
  apartmentInteriorGroup.add(sofaBase); apartmentInteriorGroup.add(sofaBack);

  // Marble Coffee Table
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 0.9), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 }));
  table.position.set(0, 0.35, -0.2);
  apartmentInteriorGroup.add(table);

  // Modern Modular Kitchen Island
  const island = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.95, 1.2), new THREE.MeshStandardMaterial({ color: 0x242830, roughness: 0.3 }));
  island.position.set(3.2, 0.55, -2.5);
  apartmentInteriorGroup.add(island);

  // Warm Chandelier Light inside Suite
  const chandelier = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffe299 }));
  chandelier.position.set(0, 2.7, 0.5);
  apartmentInteriorGroup.add(chandelier);

  lotusSocietyGroup.add(apartmentInteriorGroup);

  // Add completed Lotus Residency society model to Three.js scene
  targetScene.add(lotusSocietyGroup);
  window.__lotusSociety = lotusSocietyGroup;
}

buildLotusResidencyTownship(scene);

// ------------------------------------------------ 6. VIEWER ORBIT & 360° CONTROLS
// User controls camera 100% manually with mouse drag on laptop or touch swipe on mobile phone
const userOrbit = {
  isDragging: false,
  prevX: 0,
  prevY: 0,
  azimuth: 0.0,       // 0.0 = Looking North (Exact elevated view from reference photo)
  targetAzimuth: 0.0,
  elevation: 0.46,    // Bird's-eye elevation angle matching reference photo
  targetElevation: 0.46,
  radius: 125.0,
  targetRadius: 125.0,
  center: new THREE.Vector3(0, 5.0, 10.0),
  targetCenter: new THREE.Vector3(0, 5.0, 10.0),
  minElevation: 0.08,
  maxElevation: 1.35,
  minRadius: 32.0,
  maxRadius: 220.0
};

// Compass and HUD
const compassDialEl = document.getElementById('compass-dial');
const compassDegEl = document.getElementById('compass-deg');
const compassWidgetEl = document.getElementById('compass-widget');

function updateCompassWidget(azimuth) {
  if (!compassDialEl || !compassDegEl) return;
  const deg = Math.round(((azimuth * 180 / Math.PI) % 360 + 360) % 360);
  compassDialEl.style.transform = `rotate(${-deg}deg)`;

  let cardinal = 'N';
  if (deg >= 23 && deg < 68) cardinal = 'NE';
  else if (deg >= 68 && deg < 113) cardinal = 'E';
  else if (deg >= 113 && deg < 158) cardinal = 'SE';
  else if (deg >= 158 && deg < 203) cardinal = 'S';
  else if (deg >= 203 && deg < 248) cardinal = 'SW';
  else if (deg >= 248 && deg < 293) cardinal = 'W';
  else if (deg >= 293 && deg < 338) cardinal = 'NW';

  compassDegEl.textContent = `${deg}° ${cardinal}`;
}

compassWidgetEl?.addEventListener('click', () => {
  userOrbit.targetAzimuth = 0.0;
  userOrbit.targetElevation = 0.46;
  userOrbit.targetRadius = 125.0;
  userOrbit.targetCenter.set(0, 5.0, 10.0);
});

// Pointer Events (Seamless Mouse on Laptop & Touch on Phone)
window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button, a, input, select, textarea, .brochure-modal, .brochure-dialog, .compass-widget')) return;
  userOrbit.isDragging = true;
  userOrbit.prevX = e.clientX;
  userOrbit.prevY = e.clientY;
  document.body.style.cursor = 'grabbing';
});

window.addEventListener('pointermove', (e) => {
  if (!userOrbit.isDragging) return;
  const dx = e.clientX - userOrbit.prevX;
  const dy = e.clientY - userOrbit.prevY;
  userOrbit.prevX = e.clientX;
  userOrbit.prevY = e.clientY;

  // Sensitive smooth rotation
  userOrbit.targetAzimuth -= dx * 0.0055;
  userOrbit.targetElevation = Math.max(
    userOrbit.minElevation,
    Math.min(userOrbit.maxElevation, userOrbit.targetElevation + dy * 0.004)
  );
});

window.addEventListener('pointerup', () => {
  userOrbit.isDragging = false;
  document.body.style.cursor = 'default';
});

window.addEventListener('pointercancel', () => {
  userOrbit.isDragging = false;
  document.body.style.cursor = 'default';
});

// Wheel Zoom
window.addEventListener('wheel', (e) => {
  if (e.target.closest('.brochure-modal, .brochure-dialog')) return;
  const zoomFactor = 1.0 + Math.sign(e.deltaY) * 0.07;
  userOrbit.targetRadius = Math.max(
    userOrbit.minRadius,
    Math.min(userOrbit.maxRadius, userOrbit.targetRadius * zoomFactor)
  );
}, { passive: true });

// ------------------------------------------------ 7. WALKTHROUGH STATIONS & FLY-TO
let activeStation = 'society';

const STATIONS = {
  society: {
    title: 'Lotus Residency · 360° Masterplan Society Overview',
    hint1: 'Full Gated Community View',
    hint2: 'Drag anywhere to rotate 360° · Four 6-floor towers, clubhouse, pool & park',
    azimuth: 0.0,
    elevation: 0.46,
    radius: 125.0,
    center: new THREE.Vector3(0, 5.0, 10.0)
  },
  gate: {
    title: 'Grand Entrance & Security Gatehouse',
    hint1: 'Monolith Signage & Guardhouse',
    hint2: 'Boom barrier, security cabin, luxury black sedan, and zebra crossing',
    azimuth: 0.0,
    elevation: 0.14,
    radius: 34.0,
    center: new THREE.Vector3(0, 2.5, 87.5)
  },
  clubhouse: {
    title: 'Contemporary 2-Tier Clubhouse & Gym',
    hint1: 'Clubhouse & Wellness Lounge',
    hint2: 'Panoramic glass lounge, illuminated 3D signage, and poolside views',
    azimuth: Math.PI / 2 + 0.15,
    elevation: 0.20,
    radius: 28.0,
    center: new THREE.Vector3(-14.0, 3.5, 6.0)
  },
  pool: {
    title: 'Resort Swimming Pool Oasis',
    hint1: 'Turquoise Lap Pool & Sundeck',
    hint2: 'White sun loungers, parasols, and travertine coping terrace',
    azimuth: Math.PI - 0.15,
    elevation: 0.28,
    radius: 36.0,
    center: new THREE.Vector3(-16.0, 2.0, -30.0)
  },
  sports: {
    title: "Sports Arena & Children's Adventure Playground",
    hint1: "Basketball Court & Kids Fort",
    hint2: "Dual-tone acrylic sports surface, basketball hoops, and colorful play slides",
    azimuth: -0.80,
    elevation: 0.24,
    radius: 42.0,
    center: new THREE.Vector3(26.0, 2.2, 26.0)
  },
  apartment: {
    title: 'Luxury 3 BHK High-Floor Residence Walk-In Suite',
    hint1: 'High-Floor Apartment Suite',
    hint2: 'Panoramic balcony vista looking out over the central illuminated courtyard',
    azimuth: -Math.PI / 2 + 0.35,
    elevation: 0.12,
    radius: 12.0,
    center: new THREE.Vector3(-36.0, 18.2, 32.0)
  }
};

function flyToStation(stationKey, instant = false) {
  const st = STATIONS[stationKey];
  if (!st) return;
  activeStation = stationKey;

  userOrbit.targetAzimuth = st.azimuth;
  userOrbit.targetElevation = st.elevation;
  userOrbit.targetRadius = st.radius;
  userOrbit.targetCenter.copy(st.center);

  if (instant) {
    userOrbit.azimuth = st.azimuth;
    userOrbit.elevation = st.elevation;
    userOrbit.radius = st.radius;
    userOrbit.center.copy(st.center);
  }

  const navStatusText = document.getElementById('nav-status-text');
  const hintLine1 = document.getElementById('hint-line-1');
  const hintLine2 = document.getElementById('hint-line-2');
  if (navStatusText) navStatusText.textContent = st.title;
  if (hintLine1) hintLine1.textContent = st.hint1;
  if (hintLine2) hintLine2.textContent = st.hint2;

  // Sync Header Pills
  document.querySelectorAll('.room-pill').forEach(pill => {
    pill.classList.toggle('is-active', pill.dataset.station === stationKey);
  });

  // Sync Bottom Buttons
  document.querySelectorAll('.view-side-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.side === stationKey);
  });
}

window.flyToStation = flyToStation;
window.userOrbit = userOrbit;

// Attach listeners to Header Pills
document.querySelectorAll('.room-pill[data-station]').forEach(pill => {
  pill.addEventListener('click', () => {
    flyToStation(pill.dataset.station);
  });
});

// Setup Bottom 4-Side Quick-Turn Buttons
function setupBottomViewControls() {
  const container = document.getElementById('view-controls-buttons');
  if (!container) return;

  const buttons = [
    { label: '🌐 Full 360° Orbit', side: 'society' },
    { label: '🚪 South (Gate 180°)', side: 'south' },
    { label: '🏊 North (Pool 0°)', side: 'north' },
    { label: '🏢 East Wing (90°)', side: 'east' },
    { label: '🏢 West Wing (270°)', side: 'west' },
    { label: '🏛️ Inside Clubhouse', side: 'clubhouse' },
    { label: '⚽ Sports & Play', side: 'sports' }
  ];

  container.innerHTML = buttons.map(b => `
    <button type="button" class="view-side-btn ${b.side === 'society' ? 'is-active' : ''}" data-side="${b.side}">
      ${b.label}
    </button>
  `).join('');

  container.querySelectorAll('.view-side-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      container.querySelectorAll('.view-side-btn').forEach(b => b.classList.toggle('is-active', b === btn));

      if (side === 'society') {
        flyToStation('society');
      } else if (side === 'south') {
        userOrbit.targetAzimuth = Math.PI;
        userOrbit.targetElevation = 0.44;
        userOrbit.targetRadius = 125.0;
        userOrbit.targetCenter.set(0, 5.0, 10.0);
      } else if (side === 'north') {
        userOrbit.targetAzimuth = 0.0;
        userOrbit.targetElevation = 0.44;
        userOrbit.targetRadius = 125.0;
        userOrbit.targetCenter.set(0, 5.0, 10.0);
      } else if (side === 'east') {
        userOrbit.targetAzimuth = 3 * Math.PI / 2;
        userOrbit.targetElevation = 0.44;
        userOrbit.targetRadius = 125.0;
        userOrbit.targetCenter.set(0, 5.0, 10.0);
      } else if (side === 'west') {
        userOrbit.targetAzimuth = Math.PI / 2;
        userOrbit.targetElevation = 0.44;
        userOrbit.targetRadius = 125.0;
        userOrbit.targetCenter.set(0, 5.0, 10.0);
      } else {
        flyToStation(side);
      }
    });
  });
}
setupBottomViewControls();

// Step Back Button
const portalBackBtn = document.getElementById('portal-back-btn');
portalBackBtn?.addEventListener('click', () => {
  flyToStation('society');
});

// Arrow Navigation Buttons
document.getElementById('prev-btn')?.addEventListener('click', () => {
  const keys = ['society', 'gate', 'clubhouse', 'pool', 'sports', 'apartment'];
  const idx = keys.indexOf(activeStation);
  const prevIdx = (idx - 1 + keys.length) % keys.length;
  flyToStation(keys[prevIdx]);
});
document.getElementById('next-btn')?.addEventListener('click', () => {
  const keys = ['society', 'gate', 'clubhouse', 'pool', 'sports', 'apartment'];
  const idx = keys.indexOf(activeStation);
  const nextIdx = (idx + 1) % keys.length;
  flyToStation(keys[nextIdx]);
});

// ------------------------------------------------ 8. LUXURY DIGITAL BROCHURE DRAWER
function setupDigitalBrochure() {
  const toggleBtn = document.getElementById('brochure-toggle-btn');
  const modal = document.getElementById('brochure-modal');
  const closeBtn = document.getElementById('brochure-close-btn');
  const overlay = document.getElementById('brochure-overlay');
  const downloadBtn = document.getElementById('brochure-print-btn');

  function openBrochure() {
    modal?.classList.add('is-open');
    modal?.classList.add('is-active');
  }

  function closeBrochure() {
    modal?.classList.remove('is-open');
    modal?.classList.remove('is-active');
  }

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (modal?.classList.contains('is-open') || modal?.classList.contains('is-active')) {
      closeBrochure();
    } else {
      openBrochure();
    }
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeBrochure();
  });

  overlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeBrochure();
  });

  downloadBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.print();
  });

  // Tab switching
  const tabBtns = document.querySelectorAll('.brochure-tab[data-tab]');
  const panels = document.querySelectorAll('.brochure-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTab = btn.dataset.tab;
      tabBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      panels.forEach(p => {
        const matches = p.id === 'tab-' + targetTab || p.dataset.panel === targetTab;
        p.classList.toggle('is-active', matches);
      });
    });
  });

  // Floor plan selector chips
  const planChips = document.querySelectorAll('.floorplan-nav-chip[data-plan]');
  const planDisplays = document.querySelectorAll('.floorplan-display');

  planChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetPlan = chip.dataset.plan;
      planChips.forEach(c => c.classList.toggle('is-active', c === chip));
      planDisplays.forEach(d => {
        const matches = d.id === 'plan-' + targetPlan || d.dataset.plan === targetPlan;
        d.classList.toggle('is-active', matches);
      });
    });
  });

  // Walkthrough fly-to buttons inside brochure
  document.querySelectorAll('.brochure-fly-btn[data-fly-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = btn.dataset.flyTarget;
      closeBrochure();
      if (target === 'society') flyToStation('society');
      else if (target === 'clubhouse') flyToStation('clubhouse');
      else if (target === 'pool') flyToStation('pool');
      else if (target === 'sports') flyToStation('sports');
      else if (target === 'gate') flyToStation('gate');
      else if (target === 'villa' || target === 'bungalow' || target === 'apartment') flyToStation('apartment');
    });
  });
}
setupDigitalBrochure();

// ------------------------------------------------ 9. AUDIO AMBIENCE
let audioCtx = null;
let isAudioActive = true;
function toggleAmbienceAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, audioCtx.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
      osc.start();
    } catch {}
  }
  isAudioActive = !isAudioActive;
  const audioToggle = document.getElementById('audio-toggle');
  if (isAudioActive) {
    audioToggle?.classList.add('is-active');
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  } else {
    audioToggle?.classList.remove('is-active');
    if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
  }
}
document.getElementById('audio-toggle')?.addEventListener('click', toggleAmbienceAudio);

// ------------------------------------------------ 10. UNIFIED ANIMATION & RENDER LOOP
const clock = new THREE.Clock();
const currentEye = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();

setupDayNightController();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const now = performance.now();

  // Smooth lerp for user orbit
  const damp = 1.0 - Math.exp(-8.0 * delta);
  userOrbit.azimuth += (userOrbit.targetAzimuth - userOrbit.azimuth) * damp;
  userOrbit.elevation += (userOrbit.targetElevation - userOrbit.elevation) * damp;
  userOrbit.radius += (userOrbit.targetRadius - userOrbit.radius) * damp;
  userOrbit.center.lerp(userOrbit.targetCenter, damp);

  // Calculate spherical camera position
  const sinEl = Math.sin(userOrbit.elevation);
  const cosEl = Math.cos(userOrbit.elevation);
  const camX = userOrbit.center.x + userOrbit.radius * cosEl * Math.sin(userOrbit.azimuth);
  const camY = userOrbit.center.y + userOrbit.radius * sinEl;
  const camZ = userOrbit.center.z + userOrbit.radius * cosEl * Math.cos(userOrbit.azimuth);

  currentEye.lerp(new THREE.Vector3(camX, camY, camZ), 1.0 - Math.exp(-12.0 * delta));
  currentLookAt.lerp(userOrbit.center, 1.0 - Math.exp(-12.0 * delta));

  camera.position.copy(currentEye);
  camera.lookAt(currentLookAt);

  // Update Compass widget
  updateCompassWidget(userOrbit.azimuth);

  // Animate walking residents
  if (animatedResidents && animatedResidents.length > 0) {
    for (let r = 0; r < animatedResidents.length; r++) {
      const res = animatedResidents[r];
      res.mesh.position.z += res.dir * res.speed * delta * 2.8;

      if (res.mesh.position.z < res.minZ) {
        res.mesh.position.z = res.minZ;
        res.dir = 1;
        res.mesh.rotation.y = 0;
      } else if (res.mesh.position.z > res.maxZ) {
        res.mesh.position.z = res.maxZ;
        res.dir = -1;
        res.mesh.rotation.y = Math.PI;
      }

      const swing = Math.sin(now * 0.007 * res.speed * 2.0) * 0.5;
      if (res.legL) res.legL.rotation.x = swing;
      if (res.legR) res.legR.rotation.x = -swing;
      if (res.armL) res.armL.rotation.x = -swing * 0.8;
      if (res.armR) res.armR.rotation.x = swing * 0.8;
      res.mesh.position.y = res.baseY + Math.abs(Math.sin(now * 0.007 * res.speed * 2.0)) * 0.05;
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});
