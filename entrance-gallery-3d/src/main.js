import * as THREE from 'three';
window.THREE = THREE;

// ------------------------------------------------ Day & Night Linear Gradient Controller State
const dayNightState = {
  factor: 0.0, // 0.0 = Day, 0.5 = Sunset, 1.0 = Night
  sliderEl: null,
  badgeEl: null
};

let buildingWindowGlowMat = null;
let twinBuildingsGroup = null;
let gatedTownshipGroup = null;
let animatedResidents = [];
let fireplaceFlameMesh = null;

function setupDayNightController() {
  const slider = document.getElementById('daynight-slider');
  const badge = document.getElementById('daynight-badge');
  dayNightState.sliderEl = slider;
  dayNightState.badgeEl = badge;

  if (slider) {
    slider.addEventListener('input', (e) => {
      setDayNightFactor(parseFloat(e.target.value) / 100.0);
    });
  }
}

function setupRoomNavigation() {
  const pills = document.querySelectorAll('.room-pill');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetP = parseFloat(pill.dataset.progress);
      if (!isNaN(targetP)) {
        journey.targetProgress = targetP;
      }
    });
  });
}

function updateActiveRoomPill(p) {
  const pills = document.querySelectorAll('.room-pill');
  if (!pills.length) return;

  let activeIndex = 0;
  if (p >= 0.80) activeIndex = 4; // Master Bedroom
  else if (p >= 0.70) activeIndex = 3; // Modular Kitchen
  else if (p >= 0.60) activeIndex = 2; // Living Room
  else if (p >= 0.30) activeIndex = 1; // Gated Society 360°
  else activeIndex = 0; // Art Gallery Entrance

  pills.forEach((pill, idx) => {
    if (idx === activeIndex) pill.classList.add('is-active');
    else pill.classList.remove('is-active');
  });
}

function setDayNightFactor(factor) {
  dayNightState.factor = Math.max(0.0, Math.min(1.0, factor));
  const t = dayNightState.factor;

  // Sync Three.js Scene Sky Background & Atmospheric Fog
  if (window.__mainThreeScene) {
    const sc = window.__mainThreeScene;
    const skyDay = new THREE.Color(0xd6e5f3);
    const skySunset = new THREE.Color(0xdf9468);
    const skyNight = new THREE.Color(0x090d14);

    const curSky = new THREE.Color();
    if (t < 0.5) curSky.lerpColors(skyDay, skySunset, t / 0.5);
    else curSky.lerpColors(skySunset, skyNight, (t - 0.5) / 0.5);
    sc.background = curSky;
    if (sc.fog) sc.fog.color.copy(curSky);
  }

  if (nomadiic && nomadiic.postUniforms) {
    const u = nomadiic.postUniforms;
    if (u.uNight) u.uNight.value = t;
    if (u.uWarm) u.uWarm.value = (1 - t) * 0.22 + Math.sin(t * Math.PI) * 0.42 - t * 0.32;
    if (u.uSat) u.uSat.value = 1.15 + Math.sin(t * Math.PI) * 0.15 - t * 0.15;
    if (u.toneMappingExposure) u.toneMappingExposure.value = THREE.MathUtils.lerp(1.15, 0.85, t);
  }

  if (window.__bldgMats) {
    const {
      marbleMat, slabMat, shadowMat, glassMat, roofMat,
      promenadeMat, curbMat, grassMat, woodSlatMat, villaWallMat,
      lampGlobeMat, courtFloodlightMat, gymInteriorLightMat, villaInteriorLightMat
    } = window.__bldgMats;

    // Classical limestone & marble color grading across time of day:
    if (marbleMat) {
      if (t < 0.5) {
        marbleMat.color.lerpColors(new THREE.Color(0xf0ede6), new THREE.Color(0xebd5be), t / 0.5);
      } else {
        marbleMat.color.lerpColors(new THREE.Color(0xebd5be), new THREE.Color(0x323c4d), (t - 0.5) / 0.5);
      }
    }
    if (slabMat) {
      if (t < 0.5) {
        slabMat.color.lerpColors(new THREE.Color(0xf8f6f0), new THREE.Color(0xf2e0ce), t / 0.5);
      } else {
        slabMat.color.lerpColors(new THREE.Color(0xf2e0ce), new THREE.Color(0x424e63), (t - 0.5) / 0.5);
      }
    }
    if (shadowMat) {
      if (t < 0.5) {
        shadowMat.color.lerpColors(new THREE.Color(0xdad5c8), new THREE.Color(0xccb8a0), t / 0.5);
      } else {
        shadowMat.color.lerpColors(new THREE.Color(0xccb8a0), new THREE.Color(0x242c38), (t - 0.5) / 0.5);
      }
    }
    if (roofMat) {
      if (t < 0.5) {
        roofMat.color.lerpColors(new THREE.Color(0xe6e1d6), new THREE.Color(0xd8c2ad), t / 0.5);
      } else {
        roofMat.color.lerpColors(new THREE.Color(0xd8c2ad), new THREE.Color(0x2a3340), (t - 0.5) / 0.5);
      }
    }
    // High-rise windows: Day tinted glass (0x1c293a) -> Sunset bronze (0x9a5e2d) -> Night illuminated warm gold (0xffd580)
    if (glassMat) {
      if (t < 0.5) {
        glassMat.color.lerpColors(new THREE.Color(0x1c293a), new THREE.Color(0x9a5e2d), t / 0.5);
      } else {
        glassMat.color.lerpColors(new THREE.Color(0x9a5e2d), new THREE.Color(0xffd580), (t - 0.5) / 0.5);
      }
    }
    // Ground & architecture materials
    if (promenadeMat) {
      if (t < 0.5) promenadeMat.color.lerpColors(new THREE.Color(0xdcd6ca), new THREE.Color(0xd4beaa), t / 0.5);
      else promenadeMat.color.lerpColors(new THREE.Color(0xd4beaa), new THREE.Color(0x303642), (t - 0.5) / 0.5);
    }
    if (curbMat) {
      if (t < 0.5) curbMat.color.lerpColors(new THREE.Color(0xbeb7a8), new THREE.Color(0xb5a08d), t / 0.5);
      else curbMat.color.lerpColors(new THREE.Color(0xb5a08d), new THREE.Color(0x222730), (t - 0.5) / 0.5);
    }
    if (grassMat) {
      if (t < 0.5) grassMat.color.lerpColors(new THREE.Color(0x385e30), new THREE.Color(0x4a5a2a), t / 0.5);
      else grassMat.color.lerpColors(new THREE.Color(0x4a5a2a), new THREE.Color(0x132115), (t - 0.5) / 0.5);
    }
    if (woodSlatMat) {
      if (t < 0.5) woodSlatMat.color.lerpColors(new THREE.Color(0x93663b), new THREE.Color(0xb57c48), t / 0.5);
      else woodSlatMat.color.lerpColors(new THREE.Color(0xb57c48), new THREE.Color(0x3b2816), (t - 0.5) / 0.5);
    }
    if (villaWallMat) {
      if (t < 0.5) villaWallMat.color.lerpColors(new THREE.Color(0xf6f5f0), new THREE.Color(0xeee4d8), t / 0.5);
      else villaWallMat.color.lerpColors(new THREE.Color(0xeee4d8), new THREE.Color(0x3c4350), (t - 0.5) / 0.5);
    }

    // Pool water lighting: Crystal turquoise by day -> Illuminated night pool with glowing underwater lights!
    if (window.__bldgMats.poolWaterMat) {
      if (t < 0.5) window.__bldgMats.poolWaterMat.color.lerpColors(new THREE.Color(0x25a9bf), new THREE.Color(0x1b7e91), t / 0.5);
      else window.__bldgMats.poolWaterMat.color.lerpColors(new THREE.Color(0x1b7e91), new THREE.Color(0x0e5a6e), (t - 0.5) / 0.5);
    }
    if (window.__bldgMats.kidsPoolWaterMat) {
      if (t < 0.5) window.__bldgMats.kidsPoolWaterMat.color.lerpColors(new THREE.Color(0x4dd0e1), new THREE.Color(0x2bb0c2), t / 0.5);
      else window.__bldgMats.kidsPoolWaterMat.color.lerpColors(new THREE.Color(0x2bb0c2), new THREE.Color(0x14606e), (t - 0.5) / 0.5);
    }

    // Dynamic Evening & Night Lighting Glows
    if (lampGlobeMat) {
      lampGlobeMat.opacity = Math.max(0.35, Math.pow(t, 0.75) * 1.0);
    }
    if (courtFloodlightMat) {
      courtFloodlightMat.opacity = Math.pow(t, 1.4) * 0.95;
    }
    if (gymInteriorLightMat) {
      gymInteriorLightMat.opacity = 0.45 + t * 0.55;
    }
    if (villaInteriorLightMat) {
      villaInteriorLightMat.opacity = 0.35 + Math.pow(t, 0.8) * 0.65;
    }
  }

  // Sync Walk-In Bungalow Interior Lighting across day & night
  if (window.__bungalowMats) {
    const { wallMat, oakFloorMat, porcelainFloorMat, carpetMat, ledGlowMat } = window.__bungalowMats;
    if (wallMat) {
      if (t < 0.5) wallMat.color.lerpColors(new THREE.Color(0xf5f3ee), new THREE.Color(0xecdecb), t / 0.5);
      else wallMat.color.lerpColors(new THREE.Color(0xecdecb), new THREE.Color(0x384152), (t - 0.5) / 0.5);
    }
    if (oakFloorMat) {
      if (t < 0.5) oakFloorMat.color.lerpColors(new THREE.Color(0xd8c8a8), new THREE.Color(0xc9b28b), t / 0.5);
      else oakFloorMat.color.lerpColors(new THREE.Color(0xc9b28b), new THREE.Color(0x33281b), (t - 0.5) / 0.5);
    }
    if (porcelainFloorMat) {
      if (t < 0.5) porcelainFloorMat.color.lerpColors(new THREE.Color(0xece9e3), new THREE.Color(0xe2d6c5), t / 0.5);
      else porcelainFloorMat.color.lerpColors(new THREE.Color(0xe2d6c5), new THREE.Color(0x2f3745), (t - 0.5) / 0.5);
    }
    if (carpetMat) {
      if (t < 0.5) carpetMat.color.lerpColors(new THREE.Color(0xd5cebe), new THREE.Color(0xccbda7), t / 0.5);
      else carpetMat.color.lerpColors(new THREE.Color(0xccbda7), new THREE.Color(0x262f3a), (t - 0.5) / 0.5);
    }
    if (ledGlowMat) {
      ledGlowMat.opacity = 0.45 + t * 0.55;
    }
  }

  if (dayNightState.badgeEl) {
    if (t < 0.15) {
      dayNightState.badgeEl.textContent = 'DAY 12:00 PM';
    } else if (t < 0.40) {
      dayNightState.badgeEl.textContent = 'AFTERNOON 3:30 PM';
    } else if (t < 0.65) {
      dayNightState.badgeEl.textContent = 'GOLDEN HOUR 6:15 PM';
    } else if (t < 0.85) {
      dayNightState.badgeEl.textContent = 'SUNSET 7:45 PM';
    } else {
      dayNightState.badgeEl.textContent = 'NIGHT 11:30 PM';
    }
  }

  if (dayNightState.sliderEl) {
    dayNightState.sliderEl.value = String(Math.round(t * 100));
  }
}

window.setDayNight = setDayNightFactor;

// ------------------------------------------------ FULL GATED TOWNSHIP, SPORTS AMENITIES & WALK-IN BUNGALOW
function setupGatedTownshipAndBungalow(targetScene) {
  const scene = targetScene?.scene || targetScene || window.__mainThreeScene;
  if (!scene) return;

  // 1. Flatten old colonnades and old center structure to ground plinth level (Y = 0.05)
  // This opens up a clean, wide 52m community park for towers, footpaths, courts, gym, and bungalow
  const palaceMesh = scene.children.find(c => c.isMesh && c.geometry?.attributes?.position?.count > 50000);
  if (palaceMesh && palaceMesh.geometry) {
    palaceMesh.frustumCulled = false;
    const pos = palaceMesh.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      if (Math.abs(x) <= 38.0 && z >= -25.0 && z <= 82.0 && y > 0.4) {
        pos.setY(i, 0.05);
      }
    }
    pos.needsUpdate = true;
    palaceMesh.geometry.computeBoundingBox();
    palaceMesh.geometry.computeBoundingSphere();
  }

  // 2. Comprehensive Material System for Gated Township & Bungalow
  const marbleMat = new THREE.MeshBasicMaterial({ color: 0xf0ede6 });
  const slabMat = new THREE.MeshBasicMaterial({ color: 0xf8f6f0 });
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0xdad5c8 });
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x1c293a });
  const roofMat = new THREE.MeshBasicMaterial({ color: 0xe6e1d6 });

  // Community grounds & landscape materials
  const promenadeMat = new THREE.MeshBasicMaterial({ color: 0xdcd6ca });
  const curbMat = new THREE.MeshBasicMaterial({ color: 0xbeb7a8 });
  const grassMat = new THREE.MeshBasicMaterial({ color: 0x385e30 });
  const woodSlatMat = new THREE.MeshBasicMaterial({ color: 0x93663b });
  const villaWallMat = new THREE.MeshBasicMaterial({ color: 0xf6f5f0 });
  const blackMetalMat = new THREE.MeshBasicMaterial({ color: 0x1a1d21 });
  const clearGlassMat = new THREE.MeshBasicMaterial({ color: 0x223548, transparent: true, opacity: 0.45 });

  // Lighting & Night glow materials
  const lampGlobeMat = new THREE.MeshBasicMaterial({ color: 0xffe89e, transparent: true, opacity: 0.5 });
  const courtFloodlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
  const gymInteriorLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const villaInteriorLightMat = new THREE.MeshBasicMaterial({ color: 0xffdf99, transparent: true, opacity: 0.45 });
  const fireplaceFlameMat = new THREE.MeshBasicMaterial({ color: 0xff9922 });

  // Sports courts & pool materials
  const poolWaterMat = new THREE.MeshBasicMaterial({ color: 0x00bcd4, transparent: true, opacity: 0.88 });
  const kidsPoolWaterMat = new THREE.MeshBasicMaterial({ color: 0x2cd5eb, transparent: true, opacity: 0.88 });
  const poolBasinFloorMat = new THREE.MeshBasicMaterial({ color: 0x005570 });
  const poolDeckMat = new THREE.MeshBasicMaterial({ color: 0xeee7dc });
  const bballCourtMat = new THREE.MeshBasicMaterial({ color: 0x1b3b6f }); // Navy blue
  const bballKeyMat = new THREE.MeshBasicMaterial({ color: 0xbd5a3a }); // Terracotta
  const tennisCourtMat = new THREE.MeshBasicMaterial({ color: 0x277949 }); // Emerald green
  const tennisSurroundMat = new THREE.MeshBasicMaterial({ color: 0x172944 }); // Navy surround
  const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const netMeshMat = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.7 });
  const hoopRimMat = new THREE.MeshBasicMaterial({ color: 0xff5500 });
  const hoopBackboardMat = new THREE.MeshBasicMaterial({ color: 0xe6f2ff, transparent: true, opacity: 0.65 });

  // Villa Interior Furnishing materials
  const oakFloorMat = new THREE.MeshBasicMaterial({ color: 0xd5c4a1 });
  const kitchenTileMat = new THREE.MeshBasicMaterial({ color: 0xeae7e1 });
  const carpetMat = new THREE.MeshBasicMaterial({ color: 0xd2cbbf });
  const sofaMat = new THREE.MeshBasicMaterial({ color: 0xede8e1 });
  const cushionMat = new THREE.MeshBasicMaterial({ color: 0xc47242 });
  const marbleIslandMat = new THREE.MeshBasicMaterial({ color: 0xf8f6f0 });
  const darkCabinetMat = new THREE.MeshBasicMaterial({ color: 0x23272e });
  const blackMarbleTvWallMat = new THREE.MeshBasicMaterial({ color: 0x151619 });
  const brassMetalMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
  const bedLinenMat = new THREE.MeshBasicMaterial({ color: 0xfafafa });
  const headboardMat = new THREE.MeshBasicMaterial({ color: 0x8c7c6e });

  window.__bldgMats = {
    marbleMat, slabMat, shadowMat, glassMat, roofMat,
    promenadeMat, curbMat, grassMat, woodSlatMat, villaWallMat,
    lampGlobeMat, courtFloodlightMat, gymInteriorLightMat, villaInteriorLightMat,
    poolWaterMat, kidsPoolWaterMat, poolDeckMat
  };

  gatedTownshipGroup = new THREE.Group();
  gatedTownshipGroup.name = 'nexora-gated-township-society';

  // =========================================================================
  // 1. FOUR 15-FLOOR NEOCLASSICAL RESIDENTIAL TOWERS (TOWERS A, B, C, D)
  // Distance: 96m East-to-West, 70m North-to-South (Zero Congestion, Grand Central Park)
  // =========================================================================
  const FLOORS = 15;
  const FLOOR_H = 2.85;
  const TOTAL_H = FLOORS * FLOOR_H; // ~42.75m
  const UNITS_PER_FLOOR = 10;
  const BLDG_LEN = 48.0;
  const BLDG_W = 10.5;
  const UNIT_W = BLDG_LEN / UNITS_PER_FLOOR;

  function create15FloorTower(name, centerX, centerZ, rotY = 0) {
    const group = new THREE.Group();
    group.name = name;
    const sign = centerX < 0 ? -1 : 1;

    // Building Main Core Body
    const coreGeo = new THREE.BoxGeometry(BLDG_W - 0.6, TOTAL_H, BLDG_LEN - 0.6);
    const core = new THREE.Mesh(coreGeo, shadowMat);
    core.position.set(0, TOTAL_H / 2, 0);
    group.add(core);

    const facadeX = -sign * (BLDG_W / 2 + 0.08);
    const frontZ = BLDG_LEN / 2 + 0.08;

    // Build 15 Equal Floors
    for (let f = 0; f < FLOORS; f++) {
      const floorY = f * FLOOR_H;

      // Horizontal Floor Cornice Slab
      const slabGeo = new THREE.BoxGeometry(BLDG_W + 0.6, 0.36, BLDG_LEN + 0.6);
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, floorY + 0.18, 0);
      group.add(slab);

      // Floor decorative molding band
      const bandGeo = new THREE.BoxGeometry(BLDG_W + 0.8, 0.14, BLDG_LEN + 0.8);
      const band = new THREE.Mesh(bandGeo, slabMat);
      band.position.set(0, floorY + 0.35, 0);
      group.add(band);

      // --- Community Promenade-Facing Elevation (10 Equal Units) ---
      for (let u = 0; u < UNITS_PER_FLOOR; u++) {
        const unitZ = (-BLDG_LEN / 2 + UNIT_W / 2) + u * UNIT_W;

        if (f === 0) {
          // Ground Floor Monumental Colonnade
          const colGeo = new THREE.CylinderGeometry(0.32, 0.32, FLOOR_H - 0.45, 16);
          const col = new THREE.Mesh(colGeo, marbleMat);
          col.position.set(facadeX - sign * 0.25, floorY + FLOOR_H / 2 + 0.2, unitZ - UNIT_W / 2);
          group.add(col);

          if (u === UNITS_PER_FLOOR - 1) {
            const endCol = new THREE.Mesh(colGeo, marbleMat);
            endCol.position.set(facadeX - sign * 0.25, floorY + FLOOR_H / 2 + 0.2, unitZ + UNIT_W / 2);
            group.add(endCol);
          }
        } else {
          // Floors 2 to 15: Clean Equal Units with Windows, Balconies, and Classical Pilasters
          const winGeo = new THREE.PlaneGeometry(UNIT_W - 1.2, FLOOR_H - 0.75);
          const win = new THREE.Mesh(winGeo, glassMat);
          win.position.set(facadeX, floorY + FLOOR_H / 2 + 0.2, unitZ);
          win.rotation.y = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
          group.add(win);

          // Cantilevered Balcony Slab
          const balcSlabGeo = new THREE.BoxGeometry(1.2, 0.18, UNIT_W - 1.0);
          const balcSlab = new THREE.Mesh(balcSlabGeo, slabMat);
          balcSlab.position.set(facadeX - sign * 0.6, floorY + 0.45, unitZ);
          group.add(balcSlab);

          // Balcony Classical Railing
          const railGeo = new THREE.BoxGeometry(0.08, 0.82, UNIT_W - 1.0);
          const rail = new THREE.Mesh(railGeo, slabMat);
          rail.position.set(facadeX - sign * 1.16, floorY + 0.95, unitZ);
          group.add(rail);

          // Classical Fluted Pilasters between each unit
          const pilasterGeo = new THREE.CylinderGeometry(0.22, 0.22, FLOOR_H - 0.45, 16);
          const pilaster = new THREE.Mesh(pilasterGeo, marbleMat);
          pilaster.position.set(facadeX - sign * 0.15, floorY + FLOOR_H / 2 + 0.2, unitZ - UNIT_W / 2);
          group.add(pilaster);

          if (u === UNITS_PER_FLOOR - 1) {
            const endPilaster = new THREE.Mesh(pilasterGeo, marbleMat);
            endPilaster.position.set(facadeX - sign * 0.15, floorY + FLOOR_H / 2 + 0.2, unitZ + UNIT_W / 2);
            group.add(endPilaster);
          }
        }
      }

      // --- Front-Facing Elevation (3 Equal Bays facing Arrival View) ---
      const FRONT_BAYS = 3;
      const BAY_W = (BLDG_W - 1.0) / FRONT_BAYS;
      const bayOffsets = [-BAY_W, 0, BAY_W];

      if (f === 0) {
        for (let b = 0; b <= FRONT_BAYS; b++) {
          const colX = -(BLDG_W - 1.0) / 2 + b * BAY_W;
          const colGeo = new THREE.CylinderGeometry(0.32, 0.32, FLOOR_H - 0.45, 16);
          const col = new THREE.Mesh(colGeo, marbleMat);
          col.position.set(colX, floorY + FLOOR_H / 2 + 0.2, frontZ + 0.35);
          group.add(col);
        }
      } else {
        for (let b = 0; b < FRONT_BAYS; b++) {
          const bayX = bayOffsets[b];
          const isCenter = b === 1;

          const winW = isCenter ? 2.5 : 2.1;
          const winGeo = new THREE.PlaneGeometry(winW, FLOOR_H - 0.75);
          const win = new THREE.Mesh(winGeo, glassMat);
          win.position.set(bayX, floorY + FLOOR_H / 2 + 0.2, frontZ);
          group.add(win);

          const balcW = isCenter ? 2.7 : 2.3;
          const balcSlabGeo = new THREE.BoxGeometry(balcW, 0.18, 1.0);
          const balcSlab = new THREE.Mesh(balcSlabGeo, slabMat);
          balcSlab.position.set(bayX, floorY + 0.45, frontZ + 0.5);
          group.add(balcSlab);

          const railGeo = new THREE.BoxGeometry(balcW, 0.82, 0.08);
          const rail = new THREE.Mesh(railGeo, slabMat);
          rail.position.set(bayX, floorY + 0.95, frontZ + 0.96);
          group.add(rail);
        }

        for (let p = 0; p <= FRONT_BAYS; p++) {
          const px = -(BLDG_W - 1.0) / 2 + p * BAY_W;
          const pilGeo = new THREE.CylinderGeometry(0.20, 0.20, FLOOR_H - 0.45, 16);
          const pil = new THREE.Mesh(pilGeo, marbleMat);
          pil.position.set(px, floorY + FLOOR_H / 2 + 0.2, frontZ + 0.08);
          group.add(pil);
        }
      }
    }

    // Floor 15 Rooftop Entablature & Classical Pediment Temple Roof
    const crownGeo = new THREE.BoxGeometry(BLDG_W + 1.2, 0.8, BLDG_LEN + 1.2);
    const crown = new THREE.Mesh(crownGeo, slabMat);
    crown.position.set(0, TOTAL_H + 0.4, 0);
    group.add(crown);

    const halfW = (BLDG_W + 1.0) / 2;
    const pedH = 3.2;
    const pedShape = new THREE.Shape();
    pedShape.moveTo(-halfW, 0);
    pedShape.lineTo(0, pedH);
    pedShape.lineTo(halfW, 0);
    pedShape.closePath();

    const extrudeSettings = {
      depth: BLDG_LEN + 1.0,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.3,
      bevelThickness: 0.3
    };
    const pedGeo = new THREE.ExtrudeGeometry(pedShape, extrudeSettings);
    const pedRoof = new THREE.Mesh(pedGeo, roofMat);
    pedRoof.position.set(0, TOTAL_H + 0.8, -(BLDG_LEN + 1.0) / 2);
    group.add(pedRoof);

    const tympanumGeo = new THREE.BoxGeometry(BLDG_W + 0.8, 0.2, 0.4);
    const tympanum = new THREE.Mesh(tympanumGeo, marbleMat);
    tympanum.position.set(0, TOTAL_H + 0.9, frontZ + 0.2);
    group.add(tympanum);

    group.position.set(centerX, 0, centerZ);
    group.rotation.y = rotY;

    group.traverse(obj => {
      if (obj.isMesh) obj.frustumCulled = false;
    });

    return group;
  }

  // Four 15-Floor Towers positioned in quadrants (Spacious 96m width central park!)
  const towerA = create15FloorTower('Tower A', 48.0, 35.0, 0); // East Wing (South)
  const towerB = create15FloorTower('Tower B', 48.0, -35.0, 0); // East Wing (North)
  const towerC = create15FloorTower('Tower C', -48.0, -35.0, Math.PI); // West Wing (North)
  const towerD = create15FloorTower('Tower D', -48.0, 35.0, Math.PI); // West Wing (South)
  gatedTownshipGroup.add(towerA);
  gatedTownshipGroup.add(towerB);
  gatedTownshipGroup.add(towerC);
  gatedTownshipGroup.add(towerD);

  // =========================================================================
  // 2. NORTH RESORT OASIS: MAIN OLYMPIC LAP POOL & KIDS SPLASH POOL
  // =========================================================================
  const poolOasis = new THREE.Group();
  poolOasis.name = 'north-pool-oasis';

  // Travertine Pool Terrace Deck (Width 52m, Length 30m)
  const deckGeo = new THREE.BoxGeometry(52.0, 0.12, 30.0);
  const deck = new THREE.Mesh(deckGeo, poolDeckMat);
  deck.position.set(0, 0.06, -38.0);
  poolOasis.add(deck);

  // Helper to create a rectangular hollow coping/rim around a pool (leaves water clear & visible!)
  function createPoolCopingRim(cx, cz, innerW, innerD, rimWidth, rimHeight, yCenter, mat) {
    const rimGroup = new THREE.Group();
    const halfW = innerW / 2;
    const halfD = innerD / 2;
    const halfRim = rimWidth / 2;

    // North border
    const nGeo = new THREE.BoxGeometry(innerW + 2 * rimWidth, rimHeight, rimWidth);
    const nMesh = new THREE.Mesh(nGeo, mat);
    nMesh.position.set(cx, yCenter, cz - halfD - halfRim);
    rimGroup.add(nMesh);

    // South border
    const sGeo = new THREE.BoxGeometry(innerW + 2 * rimWidth, rimHeight, rimWidth);
    const sMesh = new THREE.Mesh(sGeo, mat);
    sMesh.position.set(cx, yCenter, cz + halfD + halfRim);
    rimGroup.add(sMesh);

    // West border
    const wGeo = new THREE.BoxGeometry(rimWidth, rimHeight, innerD);
    const wMesh = new THREE.Mesh(wGeo, mat);
    wMesh.position.set(cx - halfW - halfRim, yCenter, cz);
    rimGroup.add(wMesh);

    // East border
    const eGeo = new THREE.BoxGeometry(rimWidth, rimHeight, innerD);
    const eMesh = new THREE.Mesh(eGeo, mat);
    eMesh.position.set(cx + halfW + halfRim, yCenter, cz);
    rimGroup.add(eMesh);

    return rimGroup;
  }

  // --- Main Olympic Lap Pool (28m x 12m, Depth 1.8m) ---
  // Perimeter limestone coping edge
  poolOasis.add(createPoolCopingRim(4.0, -38.0, 28.0, 12.0, 0.8, 0.28, 0.16, slabMat));

  // Deep Lagoon Blue Pool Floor Basin
  const mainFloorGeo = new THREE.PlaneGeometry(28.0, 12.0);
  const mainFloor = new THREE.Mesh(mainFloorGeo, poolBasinFloorMat);
  mainFloor.rotation.x = -Math.PI / 2;
  mainFloor.position.set(4.0, 0.05, -38.0);
  poolOasis.add(mainFloor);

  // Sparkling Crystal Blue Pool Water Plane
  const mainWaterGeo = new THREE.PlaneGeometry(28.0, 12.0);
  const mainWater = new THREE.Mesh(mainWaterGeo, poolWaterMat);
  mainWater.rotation.x = -Math.PI / 2;
  mainWater.position.set(4.0, 0.22, -38.0);
  poolOasis.add(mainWater);

  // 5 Black Olympic Swim Lane Lines on pool floor
  for (let l = 0; l < 5; l++) {
    const laneZ = -43.0 + l * 2.5;
    const laneGeo = new THREE.BoxGeometry(26.0, 0.02, 0.25);
    const lane = new THREE.Mesh(laneGeo, new THREE.MeshBasicMaterial({ color: 0x002838 }));
    lane.position.set(4.0, 0.06, laneZ);
    poolOasis.add(lane);

    // 4 Floating competition lane float lines
    if (l < 4) {
      const ropeGeo = new THREE.CylinderGeometry(0.04, 0.04, 26.0, 8);
      const ropeMat = new THREE.MeshBasicMaterial({ color: l % 2 === 0 ? 0xff3b30 : 0x007aff });
      const rope = new THREE.Mesh(ropeGeo, ropeMat);
      rope.rotation.z = Math.PI / 2;
      rope.position.set(4.0, 0.25, -41.75 + l * 2.5);
      poolOasis.add(rope);
    }
  }

  // Stainless Steel Pool Corner Grab Ladders
  function createPoolLadder(lx, lz) {
    const lad = new THREE.Group();
    const railMat = new THREE.MeshBasicMaterial({ color: 0xe0e6ed });
    const rL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 8), railMat);
    rL.position.set(-0.24, 0.45, 0);
    const rR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.85, 8), railMat);
    rR.position.set(0.24, 0.45, 0);
    lad.add(rL); lad.add(rR);
    for (let s = 1; s <= 3; s++) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.02, 0.04), railMat);
      st.position.set(0, s * 0.20, 0);
      lad.add(st);
    }
    lad.position.set(lx, 0.15, lz);
    return lad;
  }
  poolOasis.add(createPoolLadder(4.0 - 13.5, -38.0 - 4.5));
  poolOasis.add(createPoolLadder(4.0 - 13.5, -38.0 + 4.5));
  poolOasis.add(createPoolLadder(4.0 + 13.5, -38.0 - 4.5));
  poolOasis.add(createPoolLadder(4.0 + 13.5, -38.0 + 4.5));

  // --- Kids Splash Pool (12m x 9m, Shallow 0.45m) ---
  // Perimeter coping rim
  poolOasis.add(createPoolCopingRim(-18.0, -38.0, 12.0, 9.0, 0.6, 0.24, 0.14, slabMat));

  // Cyan Shallow Basin Floor
  const kidsFloorGeo = new THREE.PlaneGeometry(12.0, 9.0);
  const kidsFloor = new THREE.Mesh(kidsFloorGeo, poolBasinFloorMat);
  kidsFloor.rotation.x = -Math.PI / 2;
  kidsFloor.position.set(-18.0, 0.05, -38.0);
  poolOasis.add(kidsFloor);

  // Vibrant Turquoise Splash Water
  const kidsWaterGeo = new THREE.PlaneGeometry(12.0, 9.0);
  const kidsWater = new THREE.Mesh(kidsWaterGeo, kidsPoolWaterMat);
  kidsWater.rotation.x = -Math.PI / 2;
  kidsWater.position.set(-18.0, 0.19, -38.0);
  poolOasis.add(kidsWater);

  // 3 Arched Rainbow Water Fountain Jets over Kids Pool
  for (let f = 0; f < 3; f++) {
    const jetArc = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.04, 8, 24, Math.PI), new THREE.MeshBasicMaterial({ color: 0x8fe5ff, transparent: true, opacity: 0.85 }));
    jetArc.position.set(-18.0, 0.3, -41.0 + f * 3.0);
    jetArc.rotation.z = Math.PI;
    jetArc.rotation.y = Math.PI / 2;
    poolOasis.add(jetArc);
  }

  // Safety Glass Railing around Kids Pool
  const glassRailGeo = new THREE.BoxGeometry(12.6, 0.85, 0.06);
  const glassRailN = new THREE.Mesh(glassRailGeo, clearGlassMat);
  glassRailN.position.set(-18.0, 0.72, -43.0);
  const glassRailS = new THREE.Mesh(glassRailGeo, clearGlassMat);
  glassRailS.position.set(-18.0, 0.72, -33.0);
  poolOasis.add(glassRailN);
  poolOasis.add(glassRailS);

  // Luxury Poolside Cabanas (4 Private Cabanas)
  for (let c = 0; c < 4; c++) {
    const cx = -8.0 + c * 8.0;
    const cabanaGroup = new THREE.Group();
    for (let cp = 0; cp < 4; cp++) {
      const px = (cp % 2 === 0 ? -1.6 : 1.6);
      const pz = (cp < 2 ? -1.6 : 1.6);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.8, 0.12), woodSlatMat);
      post.position.set(px, 1.4, pz);
      cabanaGroup.add(post);
    }
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 3.6), new THREE.MeshBasicMaterial({ color: 0xf5f3ee }));
    canopy.position.set(0, 2.8, 0);
    cabanaGroup.add(canopy);
    const daybed = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.38, 2.4), new THREE.MeshBasicMaterial({ color: 0xeeece6 }));
    daybed.position.set(0, 0.25, 0);
    cabanaGroup.add(daybed);

    cabanaGroup.position.set(cx, 0.08, -50.0);
    poolOasis.add(cabanaGroup);
  }

  // Designer Sun Loungers with Parasols along Poolside
  for (let s = 0; s < 10; s++) {
    const sx = -8.0 + (s % 5) * 6.0;
    const sz = s < 5 ? -30.5 : -45.5;
    const lounger = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.24, 2.2), new THREE.MeshBasicMaterial({ color: 0xded8cc }));
    lounger.position.set(sx, 0.2, sz);
    lounger.rotation.y = s < 5 ? 0 : Math.PI;
    poolOasis.add(lounger);

    if (s % 2 === 0) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.6, 8), blackMetalMat);
      pole.position.set(sx + 1.2, 1.3, sz);
      const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.65, 8), new THREE.MeshBasicMaterial({ color: 0xf4eedb }));
      canopy.position.set(sx + 1.2, 2.6, sz);
      poolOasis.add(pole);
      poolOasis.add(canopy);
    }
  }

  gatedTownshipGroup.add(poolOasis);

  // =========================================================================
  // 2. GATED SOCIETY GROUNDS: FOOTPATHS, STREETLAMPS, PALMS & GATEHOUSE
  // =========================================================================
  const groundsGroup = new THREE.Group();

  // Grand Estate Community Green Lawn (260m x 260m, spacious and uncongested)
  const estateLawnGeo = new THREE.PlaneGeometry(260.0, 260.0);
  const estateLawn = new THREE.Mesh(estateLawnGeo, grassMat);
  estateLawn.rotation.x = -Math.PI / 2;
  estateLawn.position.set(0, 0.01, 15.0);
  groundsGroup.add(estateLawn);

  // Wide Central Paved Promenade (Z = 100 to Z = 20)
  const promLen = 82.0;
  const promW = 6.0;
  const promGeo = new THREE.BoxGeometry(promW, 0.08, promLen);
  const promenade = new THREE.Mesh(promGeo, promenadeMat);
  promenade.position.set(0, 0.06, 59.0);
  groundsGroup.add(promenade);

  // Stone Curbs along Central Promenade
  const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, promLen), curbMat);
  curbL.position.set(-promW / 2 - 0.12, 0.10, 59.0);
  const curbR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, promLen), curbMat);
  curbR.position.set(promW / 2 + 0.12, 0.10, 59.0);
  groundsGroup.add(curbL);
  groundsGroup.add(curbR);

  // Branching Footpath to Left Courts (X = -3 to -18, Z = 55)
  const branchLeftGeo = new THREE.BoxGeometry(16.0, 0.08, 3.2);
  const branchLeft = new THREE.Mesh(branchLeftGeo, promenadeMat);
  branchLeft.position.set(-11.0, 0.06, 55.0);
  groundsGroup.add(branchLeft);

  // Branching Footpath to Tennis Court (X = -3 to -18, Z = 26)
  const branchTennis = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.08, 3.2), promenadeMat);
  branchTennis.position.set(-11.0, 0.06, 26.0);
  groundsGroup.add(branchTennis);

  // Branching Footpath to Right Gym Pavilion (X = 3 to 18, Z = 40)
  const branchRightGeo = new THREE.BoxGeometry(16.0, 0.08, 3.4);
  const branchRight = new THREE.Mesh(branchRightGeo, promenadeMat);
  branchRight.position.set(11.0, 0.06, 40.0);
  groundsGroup.add(branchRight);

  // Modern Pedestrian Streetlamps along Footpaths
  function createStreetlamp(x, z) {
    const lampGroup = new THREE.Group();
    // Post
    const postGeo = new THREE.CylinderGeometry(0.07, 0.09, 3.6, 12);
    const post = new THREE.Mesh(postGeo, blackMetalMat);
    post.position.set(0, 1.8, 0);
    lampGroup.add(post);

    // Arm & Head
    const armGeo = new THREE.BoxGeometry(0.42, 0.06, 0.06);
    const arm = new THREE.Mesh(armGeo, blackMetalMat);
    arm.position.set(0.18, 3.55, 0);
    lampGroup.add(arm);

    // Glowing Frosted Globe
    const globeGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const globe = new THREE.Mesh(globeGeo, lampGlobeMat);
    globe.position.set(0.36, 3.42, 0);
    lampGroup.add(globe);

    lampGroup.position.set(x, 0, z);
    return lampGroup;
  }

  // Place lamps every 14 meters along promenade and paths
  const lampZs = [24, 38, 52, 66, 80, 94];
  lampZs.forEach(z => {
    groundsGroup.add(createStreetlamp(-3.6, z));
    groundsGroup.add(createStreetlamp(3.6, z));
  });

  // Royal Palm Trees lining the community park
  function createPalmTree(x, z, scale = 1.0) {
    const palm = new THREE.Group();
    // Curved trunk
    const trunkGeo = new THREE.CylinderGeometry(0.24 * scale, 0.38 * scale, 6.5 * scale, 10);
    const trunkMat = new THREE.MeshBasicMaterial({ color: 0x5a4a3a });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 3.25 * scale, 0);
    trunk.rotation.z = (Math.random() - 0.5) * 0.08;
    palm.add(trunk);

    // Fronds (10 radiating arched leaves)
    const frondMat = new THREE.MeshBasicMaterial({ color: 0x2e5c24 });
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const frondGeo = new THREE.BoxGeometry(0.3 * scale, 0.06 * scale, 2.8 * scale);
      const frond = new THREE.Mesh(frondGeo, frondMat);
      frond.position.set(
        Math.sin(angle) * 1.3 * scale,
        (6.5 - 0.25) * scale,
        Math.cos(angle) * 1.3 * scale
      );
      frond.rotation.y = angle;
      frond.rotation.x = 0.45;
      palm.add(frond);
    }

    palm.position.set(x, 0, z);
    return palm;
  }

  // Plant palms on both sides of promenade
  groundsGroup.add(createPalmTree(-5.8, 30, 1.1));
  groundsGroup.add(createPalmTree(5.8, 30, 1.1));
  groundsGroup.add(createPalmTree(-5.8, 58, 1.15));
  groundsGroup.add(createPalmTree(5.8, 58, 1.15));
  groundsGroup.add(createPalmTree(-5.8, 86, 1.2));
  groundsGroup.add(createPalmTree(5.8, 86, 1.2));

  // Gated Society Security Entrance & Gatehouse (Z = 96.0)
  const gatehouseGroup = new THREE.Group();
  // Guardhouse pavilion
  const ghGeo = new THREE.BoxGeometry(4.2, 3.2, 4.0);
  const gh = new THREE.Mesh(ghGeo, villaWallMat);
  gh.position.set(8.5, 1.6, 96.0);
  gatehouseGroup.add(gh);

  const ghRoof = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.25, 4.6), blackMetalMat);
  ghRoof.position.set(8.5, 3.32, 96.0);
  gatehouseGroup.add(ghRoof);

  // Security window
  const ghWin = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.4), lampGlobeMat);
  ghWin.position.set(6.38, 1.8, 96.0);
  ghWin.rotation.y = -Math.PI / 2;
  gatehouseGroup.add(ghWin);

  // Monumental Entry Gate Pillars
  const pillarGeo = new THREE.BoxGeometry(1.4, 4.2, 1.4);
  const pL = new THREE.Mesh(pillarGeo, marbleMat);
  pL.position.set(-4.2, 2.1, 96.0);
  const pR = new THREE.Mesh(pillarGeo, marbleMat);
  pR.position.set(4.2, 2.1, 96.0);
  gatehouseGroup.add(pL);
  gatehouseGroup.add(pR);

  // Welcome Arch Community Sign
  const signGeo = new THREE.BoxGeometry(8.6, 0.85, 0.3);
  const archSign = new THREE.Mesh(signGeo, blackMetalMat);
  archSign.position.set(0, 4.4, 96.0);
  gatehouseGroup.add(archSign);

  // Automatic Boom Barrier (White/Red arm)
  const barrierArm = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.12, 0.12), new THREE.MeshBasicMaterial({ color: 0xff3b30 }));
  barrierArm.position.set(0, 1.05, 96.0);
  gatehouseGroup.add(barrierArm);

  groundsGroup.add(gatehouseGroup);
  gatedTownshipGroup.add(groundsGroup);

  // =========================================================================
  // 3. BASKETBALL COURT (X = -18.0, Z = 55.0)
  // =========================================================================
  const bballGroup = new THREE.Group();
  const bbW = 15.0;
  const bbL = 26.0;

  // Outer terracotta border
  const bballOuter = new THREE.Mesh(new THREE.BoxGeometry(bbW + 2.0, 0.08, bbL + 2.0), bballKeyMat);
  bballOuter.position.set(-18.0, 0.05, 55.0);
  bballGroup.add(bballOuter);

  // NBA Navy Blue inner playing field
  const bballCourt = new THREE.Mesh(new THREE.BoxGeometry(bbW, 0.10, bbL), bballCourtMat);
  bballCourt.position.set(-18.0, 0.07, 55.0);
  bballGroup.add(bballCourt);

  // Terracotta Key areas (north & south)
  const keyN = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.12, 5.8), bballKeyMat);
  keyN.position.set(-18.0, 0.08, 55.0 - bbL / 2 + 2.9);
  const keyS = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.12, 5.8), bballKeyMat);
  keyS.position.set(-18.0, 0.08, 55.0 + bbL / 2 - 2.9);
  bballGroup.add(keyN);
  bballGroup.add(keyS);

  // White Regulation Line Markings
  const midLine = new THREE.Mesh(new THREE.BoxGeometry(bbW, 0.12, 0.12), whiteLineMat);
  midLine.position.set(-18.0, 0.09, 55.0);
  bballGroup.add(midLine);

  const centerCircle = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.74, 32), whiteLineMat);
  centerCircle.position.set(-18.0, 0.09, 55.0);
  centerCircle.rotation.x = -Math.PI / 2;
  bballGroup.add(centerCircle);

  // 2 Basketball Hoops
  function createBasketballHoop(zEnd, isNorth) {
    const hoop = new THREE.Group();
    // Stanchion Post
    const stanchion = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 3.8, 12), blackMetalMat);
    stanchion.position.set(0, 1.9, 0);
    hoop.add(stanchion);

    // Cantilever Arm
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.4), blackMetalMat);
    arm.position.set(0, 3.4, isNorth ? 0.7 : -0.7);
    hoop.add(arm);

    // Clear Acrylic Backboard
    const bbBoard = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.06), hoopBackboardMat);
    bbBoard.position.set(0, 3.4, isNorth ? 1.4 : -1.4);
    hoop.add(bbBoard);

    // Orange Rim
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.03, 8, 24), hoopRimMat);
    rim.position.set(0, 3.05, isNorth ? 1.7 : -1.7);
    rim.rotation.x = Math.PI / 2;
    hoop.add(rim);

    // White Net
    const netGeo = new THREE.CylinderGeometry(0.28, 0.12, 0.45, 12, 1, true);
    const net = new THREE.Mesh(netGeo, whiteLineMat);
    net.position.set(0, 2.82, isNorth ? 1.7 : -1.7);
    hoop.add(net);

    hoop.position.set(-18.0, 0, zEnd);
    return hoop;
  }

  bballGroup.add(createBasketballHoop(55.0 - bbL / 2 - 0.4, true));
  bballGroup.add(createBasketballHoop(55.0 + bbL / 2 + 0.4, false));

  // Floodlight pole
  const bballLight = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 9.5, 12), blackMetalMat);
  bballLight.position.set(-18.0 - bbW / 2 - 1.0, 4.75, 55.0);
  const bballLightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 2.2), courtFloodlightMat);
  bballLightPanel.position.set(-18.0 - bbW / 2 - 0.8, 9.2, 55.0);
  bballGroup.add(bballLight);
  bballGroup.add(bballLightPanel);

  gatedTownshipGroup.add(bballGroup);

  // =========================================================================
  // 4. TENNIS COURT (X = -18.0, Z = 24.0)
  // =========================================================================
  const tennisGroup = new THREE.Group();
  const tcW = 16.0;
  const tcL = 28.0;

  // Navy Surround
  const tennisOuter = new THREE.Mesh(new THREE.BoxGeometry(tcW + 2.0, 0.08, tcL + 2.0), tennisSurroundMat);
  tennisOuter.position.set(-18.0, 0.05, 24.0);
  tennisGroup.add(tennisOuter);

  // Emerald Green Inner Court
  const tennisInner = new THREE.Mesh(new THREE.BoxGeometry(tcW, 0.10, tcL), tennisCourtMat);
  tennisInner.position.set(-18.0, 0.07, 24.0);
  tennisGroup.add(tennisInner);

  // White Boundary & Service Lines
  const tBaselineN = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.12, 0.12), whiteLineMat);
  tBaselineN.position.set(-18.0, 0.09, 24.0 - tcL / 2 + 1.2);
  const tBaselineS = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.12, 0.12), whiteLineMat);
  tBaselineS.position.set(-18.0, 0.09, 24.0 + tcL / 2 - 1.2);
  tennisGroup.add(tBaselineN);
  tennisGroup.add(tBaselineS);

  // Regulation Center Tennis Net
  const netMesh = new THREE.Mesh(new THREE.PlaneGeometry(12.8, 1.05), netMeshMat);
  netMesh.position.set(-18.0, 0.55, 24.0);
  tennisGroup.add(netMesh);

  // White top strap
  const netTop = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.08, 0.06), whiteLineMat);
  netTop.position.set(-18.0, 1.06, 24.0);
  tennisGroup.add(netTop);

  // Green Net Posts
  const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12), new THREE.MeshBasicMaterial({ color: 0x1a4a2a }));
  postL.position.set(-18.0 - 6.4, 0.6, 24.0);
  const postR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 12), new THREE.MeshBasicMaterial({ color: 0x1a4a2a }));
  postR.position.set(-18.0 + 6.4, 0.6, 24.0);
  tennisGroup.add(postL);
  tennisGroup.add(postR);

  // Court Floodlight
  const tennisLight = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 9.5, 12), blackMetalMat);
  tennisLight.position.set(-18.0 - tcW / 2 - 1.0, 4.75, 24.0);
  const tennisLightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 2.2), courtFloodlightMat);
  tennisLightPanel.position.set(-18.0 - tcW / 2 - 0.8, 9.2, 24.0);
  tennisGroup.add(tennisLight);
  tennisGroup.add(tennisLightPanel);

  gatedTownshipGroup.add(tennisGroup);

  // =========================================================================
  // 5. CORNER GLASS GYM & HEALTH CLUB PAVILION (X = +18.0, Z = 40.0)
  // =========================================================================
  const gymGroup = new THREE.Group();
  const gymW = 14.0;
  const gymL = 18.0;
  const gymH = 4.2;

  // Charcoal rubber sports floor
  const gymFloor = new THREE.Mesh(new THREE.BoxGeometry(gymW, 0.12, gymL), new THREE.MeshBasicMaterial({ color: 0x22252a }));
  gymFloor.position.set(18.0, 0.06, 40.0);
  gymGroup.add(gymFloor);

  // Architectural Roof Slab with Recessed White LED Light Panels
  const gymRoof = new THREE.Mesh(new THREE.BoxGeometry(gymW + 1.2, 0.4, gymL + 1.2), villaWallMat);
  gymRoof.position.set(18.0, gymH + 0.2, 40.0);
  gymGroup.add(gymRoof);

  // Luminous interior ceiling
  const gymCeiling = new THREE.Mesh(new THREE.PlaneGeometry(gymW - 1.0, gymL - 1.0), gymInteriorLightMat);
  gymCeiling.position.set(18.0, gymH - 0.02, 40.0);
  gymCeiling.rotation.x = Math.PI / 2;
  gymGroup.add(gymCeiling);

  // Panoramic Floor-to-Ceiling Glass Curtain Walls
  const glassFront = new THREE.Mesh(new THREE.PlaneGeometry(gymW, gymH), clearGlassMat);
  glassFront.position.set(18.0, gymH / 2 + 0.06, 40.0 + gymL / 2);
  gymGroup.add(glassFront);

  const glassWest = new THREE.Mesh(new THREE.PlaneGeometry(gymL, gymH), clearGlassMat);
  glassWest.position.set(18.0 - gymW / 2, gymH / 2 + 0.06, 40.0);
  glassWest.rotation.y = Math.PI / 2;
  gymGroup.add(glassWest);

  const glassNorth = new THREE.Mesh(new THREE.PlaneGeometry(gymW, gymH), clearGlassMat);
  glassNorth.position.set(18.0, gymH / 2 + 0.06, 40.0 - gymL / 2);
  gymGroup.add(glassNorth);

  // Bronze architectural mullion pillars
  for (let m = 0; m <= 4; m++) {
    const mx = 18.0 - gymW / 2 + m * (gymW / 4);
    const mPillar = new THREE.Mesh(new THREE.BoxGeometry(0.18, gymH, 0.18), blackMetalMat);
    mPillar.position.set(mx, gymH / 2 + 0.06, 40.0 + gymL / 2);
    gymGroup.add(mPillar);
  }

  // Modern Treadmills (Row of 3 along glass wall)
  function createTreadmill(tx, tz) {
    const tm = new THREE.Group();
    // Deck
    const deck = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.22, 2.1), new THREE.MeshBasicMaterial({ color: 0x15171a }));
    deck.position.set(0, 0.16, 0);
    tm.add(deck);

    // Handrails & Console
    const railL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.25, 8), new THREE.MeshBasicMaterial({ color: 0xc8cdd5 }));
    railL.position.set(-0.4, 0.8, -0.6);
    const railR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.25, 8), new THREE.MeshBasicMaterial({ color: 0xc8cdd5 }));
    railR.position.set(0.4, 0.8, -0.6);
    tm.add(railL);
    tm.add(railR);

    // Glowing Console LCD Screen
    const consoleScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.65, 0.38), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    consoleScreen.position.set(0, 1.4, -0.65);
    consoleScreen.rotation.x = -0.3;
    tm.add(consoleScreen);

    tm.position.set(tx, 0, tz);
    return tm;
  }

  gymGroup.add(createTreadmill(14.5, 42.0));
  gymGroup.add(createTreadmill(16.5, 42.0));
  gymGroup.add(createTreadmill(18.5, 42.0));

  // Olympic Weight Bench & Barbell
  const bench = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 1.5), new THREE.MeshBasicMaterial({ color: 0x1f232b }));
  bench.position.set(16.0, 0.25, 36.5);
  gymGroup.add(bench);

  const barbell = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.1, 10), new THREE.MeshBasicMaterial({ color: 0xcccccc }));
  barbell.position.set(16.0, 1.15, 36.5);
  barbell.rotation.z = Math.PI / 2;
  gymGroup.add(barbell);

  // Chrome Weight Plates
  const plateL = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16), new THREE.MeshBasicMaterial({ color: 0x222222 }));
  plateL.position.set(15.2, 1.15, 36.5);
  plateL.rotation.z = Math.PI / 2;
  const plateR = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16), new THREE.MeshBasicMaterial({ color: 0x222222 }));
  plateR.position.set(16.8, 1.15, 36.5);
  plateR.rotation.z = Math.PI / 2;
  gymGroup.add(plateL);
  gymGroup.add(plateR);

  // 3-Tier Dumbbell Rack
  const rack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.6), blackMetalMat);
  rack.position.set(22.0, 0.5, 36.5);
  gymGroup.add(rack);

  // Glowing Neon Sign inside gym
  const gymNeon = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.7, 0.1), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
  gymNeon.position.set(18.0, 3.2, 32.5);
  gymGroup.add(gymNeon);

  gatedTownshipGroup.add(gymGroup);

  // =========================================================================
  // 6. ANIMATED RESIDENTS / PEOPLE MOVING
  // =========================================================================
  animatedResidents = [];

  function createStylizedResident({ x, y = 0, z, shirtCol, pantsCol, hairCol = 0x2b1d0c, speed = 1.0, minZ = 20, maxZ = 90, dir = -1 }) {
    const person = new THREE.Group();
    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.38, 0.52, 0.22);
    const torso = new THREE.Mesh(torsoGeo, new THREE.MeshBasicMaterial({ color: shirtCol }));
    torso.position.set(0, 0.98, 0);
    person.add(torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const head = new THREE.Mesh(headGeo, new THREE.MeshBasicMaterial({ color: 0xe8beac }));
    head.position.set(0, 1.38, 0);
    person.add(head);

    // Hair
    const hairGeo = new THREE.SphereGeometry(0.15, 12, 12);
    const hair = new THREE.Mesh(hairGeo, new THREE.MeshBasicMaterial({ color: hairCol }));
    hair.position.set(0, 1.44, -0.02);
    person.add(hair);

    // Left Leg
    const legGeo = new THREE.BoxGeometry(0.12, 0.62, 0.13);
    const legL = new THREE.Mesh(legGeo, new THREE.MeshBasicMaterial({ color: pantsCol }));
    legL.position.set(-0.10, 0.38, 0);
    person.add(legL);

    // Right Leg
    const legR = new THREE.Mesh(legGeo, new THREE.MeshBasicMaterial({ color: pantsCol }));
    legR.position.set(0.10, 0.38, 0);
    person.add(legR);

    // Left Arm
    const armGeo = new THREE.BoxGeometry(0.10, 0.52, 0.10);
    const armL = new THREE.Mesh(armGeo, new THREE.MeshBasicMaterial({ color: shirtCol }));
    armL.position.set(-0.25, 0.96, 0);
    person.add(armL);

    // Right Arm
    const armR = new THREE.Mesh(armGeo, new THREE.MeshBasicMaterial({ color: shirtCol }));
    armR.position.set(0.25, 0.96, 0);
    person.add(armR);

    person.position.set(x, y, z);
    gatedTownshipGroup.add(person);

    const residentData = {
      mesh: person,
      legL, legR, armL, armR,
      baseY: y,
      speed, minZ, maxZ, dir,
      freq: 4.8 * speed
    };
    animatedResidents.push(residentData);
    return person;
  }

  // Resident 1 & 2: Couple strolling along the central promenade
  createStylizedResident({ x: -1.0, z: 75.0, shirtCol: 0xff6b6b, pantsCol: 0x2d3436, speed: 0.9, minZ: 25, maxZ: 85, dir: -1 });
  createStylizedResident({ x: -0.4, z: 74.8, shirtCol: 0x48dbfb, pantsCol: 0xf5f6fa, speed: 0.9, minZ: 25, maxZ: 85, dir: -1 });

  // Resident 3: Jogger running along the path
  createStylizedResident({ x: 1.4, z: 35.0, shirtCol: 0x1dd1a1, pantsCol: 0x222f3e, speed: 2.2, minZ: 22, maxZ: 88, dir: 1 });

  // Resident 4: Walking towards the gym pavilion
  createStylizedResident({ x: 9.5, z: 40.0, shirtCol: 0xfeca57, pantsCol: 0x576574, speed: 0.8, minZ: 32, maxZ: 50, dir: 1 });

  // Resident 5: Basketball player near the hoop
  createStylizedResident({ x: -18.0, z: 52.0, shirtCol: 0xff9f43, pantsCol: 0x0abde3, speed: 0.5, minZ: 50, maxZ: 56, dir: 1 });

  // Resident 6 & 7: Tennis players rallying on court
  createStylizedResident({ x: -18.0, z: 16.5, shirtCol: 0xee5253, pantsCol: 0xffffff, speed: 0.7, minZ: 15, maxZ: 18, dir: 1 });
  createStylizedResident({ x: -18.0, z: 31.5, shirtCol: 0x10ac84, pantsCol: 0xffffff, speed: 0.7, minZ: 30, maxZ: 33, dir: -1 });

  // Resident 8: Gym member running on treadmill
  createStylizedResident({ x: 14.5, z: 42.0, shirtCol: 0x5f27cd, pantsCol: 0x341f97, speed: 1.6, minZ: 41.8, maxZ: 42.2, dir: 1 });

  // =========================================================================
  // 7. CENTERPIECE: COMPLETE WALK-IN LUXURY BUNGALOW VILLA (X = 0, Z = -16 to +20)
  // =========================================================================
  const villaGroup = new THREE.Group();
  const vW = 16.0;
  const vL = 36.0;
  const vH = 6.4; // Double-height modern luxury ceiling

  // Modern Cantilevered Roof Slab
  const roofMain = new THREE.Mesh(new THREE.BoxGeometry(vW + 2.0, 0.42, vL + 2.0), villaWallMat);
  roofMain.position.set(0, vH + 0.21, 2.0);
  villaGroup.add(roofMain);

  // Warm Teak Fascia Trim around roof
  const fascia = new THREE.Mesh(new THREE.BoxGeometry(vW + 2.2, 0.18, vL + 2.2), woodSlatMat);
  fascia.position.set(0, vH + 0.4, 2.0);
  villaGroup.add(fascia);

  // Architectural Exterior Wall Panels (White Stucco & Teak Louver Screens)
  const wallEast = new THREE.Mesh(new THREE.BoxGeometry(0.3, vH, vL), villaWallMat);
  wallEast.position.set(vW / 2, vH / 2, 2.0);
  const wallWest = new THREE.Mesh(new THREE.BoxGeometry(0.3, vH, vL), villaWallMat);
  wallWest.position.set(-vW / 2, vH / 2, 2.0);
  villaGroup.add(wallEast);
  villaGroup.add(wallWest);

  // Vertical Teak Louver Screens flanking front entrance
  for (let s = 0; s < 8; s++) {
    const louverL = new THREE.Mesh(new THREE.BoxGeometry(0.08, vH - 0.4, 0.22), woodSlatMat);
    louverL.position.set(-vW / 2 + 1.2 + s * 0.45, vH / 2, 19.8);
    const louverR = new THREE.Mesh(new THREE.BoxGeometry(0.08, vH - 0.4, 0.22), woodSlatMat);
    louverR.position.set(vW / 2 - 1.2 - s * 0.45, vH / 2, 19.8);
    villaGroup.add(louverL);
    villaGroup.add(louverR);
  }

  // Front Panoramic Glass Pivot Entrance Doors (Z = 20.0)
  const frontGlassDoor = new THREE.Mesh(new THREE.PlaneGeometry(5.2, vH - 0.8), clearGlassMat);
  frontGlassDoor.position.set(0, vH / 2 - 0.2, 20.0);
  villaGroup.add(frontGlassDoor);

  // Front Reflecting Water Pond & Stepping Stones
  const pondGeo = new THREE.BoxGeometry(vW + 1.0, 0.2, 6.0);
  const pond = new THREE.Mesh(pondGeo, new THREE.MeshBasicMaterial({ color: 0x1a3348 }));
  pond.position.set(0, 0.05, 22.0);
  villaGroup.add(pond);

  // Floating Stone Stepping Stones over water
  for (let st = 0; st < 3; st++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 1.4), villaWallMat);
    step.position.set(0, 0.16, 20.2 + st * 1.8);
    villaGroup.add(step);
  }

  // -------------------------------------------------------------------------
  // ROOM 1: GRAND LIVING ROOM (Z = 16.0 to 6.0)
  // -------------------------------------------------------------------------
  const lrGroup = new THREE.Group();
  // Herringbone Oak Floor
  const lrFloor = new THREE.Mesh(new THREE.BoxGeometry(vW - 0.4, 0.08, 10.0), oakFloorMat);
  lrFloor.position.set(0, 0.04, 11.0);
  lrGroup.add(lrFloor);

  // Plush Designer Geometric Area Rug
  const lrRug = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.04, 6.8), carpetMat);
  lrRug.position.set(0, 0.09, 11.0);
  lrGroup.add(lrRug);

  // Italian L-Shaped Sectional Sofa (Cream Bouclé)
  const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.75, 1.4), sofaMat);
  sofaMain.position.set(0.6, 0.46, 12.8);
  const sofaChaise = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 3.2), sofaMat);
  sofaChaise.position.set(-1.3, 0.46, 10.5);
  lrGroup.add(sofaMain);
  lrGroup.add(sofaChaise);

  // Accent Throw Cushions
  const cush1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.2), cushionMat);
  cush1.position.set(-1.0, 0.88, 12.8);
  const cush2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.2), cushionMat);
  cush2.position.set(2.2, 0.88, 12.8);
  lrGroup.add(cush1);
  lrGroup.add(cush2);

  // Calacatta Marble & Walnut Dual Coffee Table
  const ctMarble = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.38, 1.2), marbleIslandMat);
  ctMarble.position.set(0.5, 0.28, 10.4);
  const ctWood = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 1.2), woodSlatMat);
  ctWood.position.set(-1.1, 0.25, 10.2);
  lrGroup.add(ctMarble);
  lrGroup.add(ctWood);

  // Feature Media & Fireplace Wall (Nero Marquina Black Marble)
  const tvWall = new THREE.Mesh(new THREE.BoxGeometry(7.2, vH - 0.4, 0.35), blackMarbleTvWallMat);
  tvWall.position.set(0, vH / 2, 6.2);
  lrGroup.add(tvWall);

  // Wall-mounted 85" Ultra-Slim OLED TV
  const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.0), new THREE.MeshBasicMaterial({ color: 0x050608 }));
  tvScreen.position.set(0, 3.6, 6.4);
  lrGroup.add(tvScreen);

  // Built-in Linear Electric Fireplace (Warm Glowing Flame)
  fireplaceFlameMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.55), fireplaceFlameMat);
  fireplaceFlameMesh.position.set(0, 1.35, 6.4);
  lrGroup.add(fireplaceFlameMesh);

  // Contemporary Suspended Double-Ring Brass Chandelier
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 8, 32), brassMetalMat);
  ring1.position.set(0, 4.8, 11.0);
  ring1.rotation.x = Math.PI / 2;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 8, 32), brassMetalMat);
  ring2.position.set(0, 4.4, 11.0);
  ring2.rotation.x = Math.PI / 2;
  lrGroup.add(ring1);
  lrGroup.add(ring2);

  // Fluted Planter with Indoor Ficus Tree
  const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 0.85, 16), villaWallMat);
  planter.position.set(-5.5, 0.45, 8.5);
  const ficusTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.2, 8), woodSlatMat);
  ficusTrunk.position.set(-5.5, 1.5, 8.5);
  const ficusFoliage = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), grassMat);
  ficusFoliage.position.set(-5.5, 2.5, 8.5);
  lrGroup.add(planter);
  lrGroup.add(ficusTrunk);
  lrGroup.add(ficusFoliage);

  villaGroup.add(lrGroup);

  // -------------------------------------------------------------------------
  // ROOM 2: GOURMET MODULAR KITCHEN & DINING ISLAND (Z = 6.0 to -4.0)
  // -------------------------------------------------------------------------
  const kitchenGroup = new THREE.Group();
  // Large Format Porcelain Floor
  const kFloor = new THREE.Mesh(new THREE.BoxGeometry(vW - 0.4, 0.08, 10.0), kitchenTileMat);
  kFloor.position.set(0, 0.04, 1.0);
  kitchenGroup.add(kFloor);

  // 4.2m Waterfall Calacatta Gold Marble Island
  const islandTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.95, 1.5), marbleIslandMat);
  islandTop.position.set(0, 0.52, 1.0);
  kitchenGroup.add(islandTop);

  // Black Ceramic Induction Cooktop
  const cooktop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.7), blackMetalMat);
  cooktop.position.set(-1.1, 1.02, 1.0);
  kitchenGroup.add(cooktop);

  // Undermount Sink & Brass Gooseneck Faucet
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 0.6), new THREE.MeshBasicMaterial({ color: 0x333333 }));
  sink.position.set(1.1, 1.01, 1.0);
  const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), brassMetalMat);
  faucet.position.set(1.1, 1.25, 1.3);
  kitchenGroup.add(sink);
  kitchenGroup.add(faucet);

  // 3 Contemporary Bar Stools
  for (let bs = 0; bs < 3; bs++) {
    const stoolX = -1.2 + bs * 1.2;
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.68, 16), darkCabinetMat);
    stool.position.set(stoolX, 0.38, 2.1);
    const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 16), cushionMat);
    cushion.position.set(stoolX, 0.75, 2.1);
    kitchenGroup.add(stool);
    kitchenGroup.add(cushion);
  }

  // Matte Charcoal Modular Back Cabinetry Wall
  const cabWall = new THREE.Mesh(new THREE.BoxGeometry(vW - 1.2, 3.2, 0.8), darkCabinetMat);
  cabWall.position.set(0, 1.6, -3.4);
  kitchenGroup.add(cabWall);

  // Warm LED Under-Cabinet Cove Lighting
  const coveLight = new THREE.Mesh(new THREE.BoxGeometry(vW - 1.4, 0.06, 0.4), villaInteriorLightMat);
  coveLight.position.set(0, 3.22, -3.2);
  kitchenGroup.add(coveLight);

  // Built-in Double Stainless Ovens
  const ovens = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 0.1), new THREE.MeshBasicMaterial({ color: 0x444444 }));
  ovens.position.set(3.8, 1.6, -2.95);
  kitchenGroup.add(ovens);

  // Integrated Smoked Glass Wine Cooler
  const wineCooler = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.6), clearGlassMat);
  wineCooler.position.set(-3.8, 1.6, -2.95);
  kitchenGroup.add(wineCooler);

  // Trio of Brass Cylinder Pendant Lights
  for (let p = 0; p < 3; p++) {
    const px = -1.2 + p * 1.2;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.0, 6), blackMetalMat);
    cord.position.set(px, 3.8, 1.0);
    const pendant = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 12), brassMetalMat);
    pendant.position.set(px, 2.7, 1.0);
    kitchenGroup.add(cord);
    kitchenGroup.add(pendant);
  }

  villaGroup.add(kitchenGroup);

  // -------------------------------------------------------------------------
  // ROOM 3: MASTER BEDROOM SUITE (Z = -4.0 to -14.0)
  // -------------------------------------------------------------------------
  const bedGroup = new THREE.Group();
  // Deep Plush Neutral Carpet
  const bCarpet = new THREE.Mesh(new THREE.BoxGeometry(vW - 0.4, 0.08, 10.0), carpetMat);
  bCarpet.position.set(0, 0.04, -9.0);
  bedGroup.add(bCarpet);

  // King-Size Platform Bed
  const bedBase = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.45, 3.8), woodSlatMat);
  bedBase.position.set(0, 0.26, -9.5);
  bedGroup.add(bedBase);

  // Crisp White Mattress & Duvet
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.45, 3.4), bedLinenMat);
  mattress.position.set(0, 0.62, -9.3);
  bedGroup.add(mattress);

  // Folded Charcoal Throw Blanket
  const throwB = new THREE.Mesh(new THREE.BoxGeometry(3.04, 0.08, 1.2), darkCabinetMat);
  throwB.position.set(0, 0.88, -8.2);
  bedGroup.add(throwB);

  // Vertical Fluted Upholstered Headboard
  const hb = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 0.28), headboardMat);
  hb.position.set(0, 1.2, -11.2);
  bedGroup.add(hb);

  // Slatted Oak Accent Wall behind bed
  const slattedWall = new THREE.Mesh(new THREE.BoxGeometry(7.5, vH - 0.4, 0.15), woodSlatMat);
  slattedWall.position.set(0, vH / 2, -11.4);
  bedGroup.add(slattedWall);

  // Floating Walnut Bedside Tables
  const ntL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 0.65), woodSlatMat);
  ntL.position.set(-2.2, 0.45, -10.8);
  const ntR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 0.65), woodSlatMat);
  ntR.position.set(2.2, 0.45, -10.8);
  bedGroup.add(ntL);
  bedGroup.add(ntR);

  // Modern Bedside Touch Lamps
  const lampL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.48, 12), lampGlobeMat);
  lampL.position.set(-2.2, 0.88, -10.8);
  const lampR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.48, 12), lampGlobeMat);
  lampR.position.set(2.2, 0.88, -10.8);
  bedGroup.add(lampL);
  bedGroup.add(lampR);

  // Walk-In Wardrobe with Smoked Glass Doors
  const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 1.2), clearGlassMat);
  wardrobe.position.set(-5.6, 1.45, -8.5);
  bedGroup.add(wardrobe);

  // Rear Panoramic Glass Sliding Doors opening to Garden Terrace
  const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(6.4, vH - 0.8), clearGlassMat);
  rearGlass.position.set(0, vH / 2 - 0.2, -13.9);
  bedGroup.add(rearGlass);

  villaGroup.add(bedGroup);
  gatedTownshipGroup.add(villaGroup);

  // Add the entire completed Gated Township Society & Bungalow to the 3D scene!
  scene.add(gatedTownshipGroup);
  window.__gatedTownship = gatedTownshipGroup;
}

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
const portalBackText = document.getElementById('portal-back-text');
const audioToggle = document.getElementById('audio-toggle');
const navStatusText = document.getElementById('nav-status-text');

// ------------------------------------------------ 4. Three.js Rotunda Gallery Scene (60-120 FPS)
const scene = new THREE.Scene();
window.__mainThreeScene = scene;
const BG_COLOR = 0xd6e5f3;
scene.background = new THREE.Color(BG_COLOR);
scene.fog = new THREE.FogExp2(BG_COLOR, 0.0035);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 500);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
canvasContainer.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';

// Rotunda Master Group (3D Art Gallery Entrance)
const rotundaGroup = new THREE.Group();
rotundaGroup.name = 'art-gallery-rotunda';

// Architectural Surfaces (Pure MeshBasicMaterial = Zero Dynamic Light Overhead)
const floorMat = new THREE.MeshBasicMaterial({ color: 0x222327 });
const floorMesh = new THREE.Mesh(new THREE.RingGeometry(7.2, 12.2, 120), floorMat);
floorMesh.rotation.x = -Math.PI / 2;
rotundaGroup.add(floorMesh);

// Center Court Floor Disc
const centerCourtFloor = new THREE.Mesh(
  new THREE.CircleGeometry(7.3, 64),
  new THREE.MeshBasicMaterial({ color: 0x181a20 })
);
centerCourtFloor.rotation.x = -Math.PI / 2;
rotundaGroup.add(centerCourtFloor);

// Outer Curved Wall
const outerWallMat = new THREE.MeshBasicMaterial({ color: 0xeae8e2, side: THREE.BackSide });
const outerWall = new THREE.Mesh(new THREE.CylinderGeometry(12.0, 12.0, 3.8, 120, 1, true), outerWallMat);
outerWall.position.set(0, 1.9, 0);
rotundaGroup.add(outerWall);

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
rotundaGroup.add(innerWall);

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
rotundaGroup.add(floorGlowMesh);

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
rotundaGroup.add(outerWallLampGlow);

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
rotundaGroup.add(innerWallLampGlow);

// ------------------------------------------------ 5. CENTRAL CLASSICAL TEMPLE DOORWAY PORTAL
const centerPortalGroup = new THREE.Group();
centerPortalGroup.position.set(0, 0, 7.35);
rotundaGroup.add(centerPortalGroup);

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
  rotundaGroup.add(outerPainting);

  if (i !== 0) {
    const innerPainting = createPaintingMesh(station.innerItem, false, stationAngle);
    rotundaGroup.add(innerPainting);
  }
}

scene.add(rotundaGroup);
window.__rotundaGroup = rotundaGroup;

// ------------------------------------------------ WALK-IN BUNGALOW INTERIOR ROOMS IN THREE.JS SCENE
function buildWalkInBungalowRooms(targetScene) {
  const bungalowGroup = new THREE.Group();
  bungalowGroup.name = 'bungalow-walk-in-interior';

  // Materials
  const oakFloorMat = new THREE.MeshBasicMaterial({ color: 0xd8c8a8 });
  const porcelainFloorMat = new THREE.MeshBasicMaterial({ color: 0xece9e3 });
  const carpetMat = new THREE.MeshBasicMaterial({ color: 0xd5cebe });
  const wallMat = new THREE.MeshBasicMaterial({ color: 0xf5f3ee, side: THREE.BackSide });
  const baseboardMat = new THREE.MeshBasicMaterial({ color: 0x22252c });
  const blackMarbleMat = new THREE.MeshBasicMaterial({ color: 0x141518 });
  const calacattaMat = new THREE.MeshBasicMaterial({ color: 0xfbf9f4 });
  const charcoalWoodMat = new THREE.MeshBasicMaterial({ color: 0x22252c });
  const warmTeakMat = new THREE.MeshBasicMaterial({ color: 0x93663b });
  const sofaFabricMat = new THREE.MeshBasicMaterial({ color: 0xeee9e2 });
  const terracottaMat = new THREE.MeshBasicMaterial({ color: 0xc47242 });
  const brassMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
  const bedLinenMat = new THREE.MeshBasicMaterial({ color: 0xfcfcfc });
  const headboardMat = new THREE.MeshBasicMaterial({ color: 0x8c7c6e });
  const windowGlassMat = new THREE.MeshBasicMaterial({ color: 0x203548, transparent: true, opacity: 0.55 });
  const smokedGlassMat = new THREE.MeshBasicMaterial({ color: 0x161e28, transparent: true, opacity: 0.65 });
  const ledGlowMat = new THREE.MeshBasicMaterial({ color: 0xffdf99, transparent: true, opacity: 0.65 });
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff9922 });
  const gardenGreenMat = new THREE.MeshBasicMaterial({ color: 0x254d1f });
  const artTerracottaMat = new THREE.MeshBasicMaterial({ color: 0xba6838 });
  const artOchreMat = new THREE.MeshBasicMaterial({ color: 0xd49b42 });

  window.__bungalowMats = {
    wallMat, oakFloorMat, porcelainFloorMat, carpetMat, ledGlowMat, flameMat, blackMarbleMat, warmTeakMat
  };

  // Helper for architectural perimeter trims (Baseboards & Cove)
  function addRoomArchitecturalShell(group, centerZ) {
    // Room Enclosure (Width 16m, Length 14m, Height 5.0m)
    const enclGeo = new THREE.BoxGeometry(16.0, 5.0, 14.0);
    const enclosure = new THREE.Mesh(enclGeo, wallMat);
    enclosure.position.set(0, 2.5, centerZ);
    group.add(enclosure);

    // Dark charcoal baseboards along perimeter
    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(15.8, 0.14, 0.04), baseboardMat);
    bbBack.position.set(0, 0.07, centerZ - 6.9);
    const bbFront = new THREE.Mesh(new THREE.BoxGeometry(15.8, 0.14, 0.04), baseboardMat);
    bbFront.position.set(0, 0.07, centerZ + 6.9);
    group.add(bbBack);
    group.add(bbFront);

    // Warm perimeter ceiling cove light
    const cove = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.08, 13.6), ledGlowMat);
    cove.position.set(0, 4.92, centerZ);
    group.add(cove);

    // Floor-to-ceiling panoramic glass window wall on left side overlooking society greenery
    const winWall = new THREE.Mesh(new THREE.PlaneGeometry(10.0, 3.8), windowGlassMat);
    winWall.position.set(-7.9, 2.3, centerZ);
    winWall.rotation.y = Math.PI / 2;
    group.add(winWall);

    for (let m = 0; m <= 4; m++) {
      const mull = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.8, 0.08), charcoalWoodMat);
      mull.position.set(-7.88, 2.3, centerZ - 5.0 + m * 2.5);
      group.add(mull);
    }

    // Lush garden landscaping visible through glass
    for (let g = 0; g < 3; g++) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(1.3, 10, 10), gardenGreenMat);
      bush.position.set(-9.4, 1.4, centerZ - 4.0 + g * 4.0);
      group.add(bush);
    }
  }

  // =========================================================================
  // ROOM 1: GRAND LIVING ROOM (Center at Z = -60.0)
  // =========================================================================
  const lr = new THREE.Group();
  addRoomArchitecturalShell(lr, -60.0);

  // Herringbone Oak Floor
  const lrFloor = new THREE.Mesh(new THREE.BoxGeometry(15.9, 0.08, 13.9), oakFloorMat);
  lrFloor.position.set(0, 0.04, -60.0);
  lr.add(lrFloor);

  // Designer Area Rug
  const rug = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.04, 7.5), carpetMat);
  rug.position.set(0, 0.08, -59.5);
  lr.add(rug);

  // Italian L-Shaped Sectional Sofa (Cream Bouclé)
  const sofaMain = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.82, 1.5), sofaFabricMat);
  sofaMain.position.set(0.6, 0.45, -57.5);
  const sofaChaise = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.82, 3.4), sofaFabricMat);
  sofaChaise.position.set(-1.35, 0.45, -59.8);
  lr.add(sofaMain);
  lr.add(sofaChaise);

  // Accent Throw Pillows
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.22), terracottaMat);
  p1.position.set(-1.1, 0.9, -57.5);
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.22), terracottaMat);
  p2.position.set(2.4, 0.9, -57.5);
  lr.add(p1);
  lr.add(p2);

  // Designer Terracotta Accent Armchair
  const chairBase = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.42, 1.15), terracottaMat);
  chairBase.position.set(3.8, 0.32, -59.5);
  chairBase.rotation.y = -0.38;
  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.72, 0.24), terracottaMat);
  chairBack.position.set(4.0, 0.72, -60.0);
  chairBack.rotation.y = -0.38;
  lr.add(chairBase);
  lr.add(chairBack);

  // Slim Brass Floor Lamp
  const flPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.3, 8), brassMat);
  flPole.position.set(5.1, 1.15, -61.2);
  const flShade = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.36, 0.42, 16), ledGlowMat);
  flShade.position.set(5.1, 2.15, -61.2);
  lr.add(flPole);
  lr.add(flShade);

  // Dual Calacatta Marble & Walnut Coffee Table
  const tableMarble = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.38, 1.2), calacattaMat);
  tableMarble.position.set(0.6, 0.27, -60.5);
  const tableWood = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 1.2), warmTeakMat);
  tableWood.position.set(-1.2, 0.24, -60.8);
  lr.add(tableMarble);
  lr.add(tableWood);

  // Decorative Bowl & Books on Coffee Table
  const decBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.12, 0.10, 16), brassMat);
  decBowl.position.set(0.6, 0.50, -60.5);
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 0.25), terracottaMat);
  book.position.set(-1.1, 0.43, -60.7);
  lr.add(decBowl);
  lr.add(book);

  // Full-Height Nero Marquina Black Marble Media Feature Wall
  const mediaWall = new THREE.Mesh(new THREE.BoxGeometry(8.2, 4.6, 0.35), blackMarbleMat);
  mediaWall.position.set(0, 2.3, -66.8);
  lr.add(mediaWall);

  // 85" Ultra-Slim OLED TV Screen
  const tv = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.1), new THREE.MeshBasicMaterial({ color: 0x06070a }));
  tv.position.set(0, 2.9, -66.6);
  lr.add(tv);

  // Built-in Linear Electric Fireplace (Warm Glowing Flame)
  const fireplace = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.55), flameMat);
  fireplace.position.set(0, 1.05, -66.6);
  lr.add(fireplace);

  // Curated Fine Art Frame on Wall
  const art1Frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 1.8), brassMat);
  art1Frame.position.set(7.9, 2.6, -60.0);
  const art1Canvas = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 1.6), artTerracottaMat);
  art1Canvas.position.set(7.88, 2.6, -60.0);
  lr.add(art1Frame);
  lr.add(art1Canvas);

  // Contemporary Double-Ring Brass Chandelier
  const chRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.04, 8, 32), brassMat);
  chRing1.position.set(0, 3.9, -60.0);
  chRing1.rotation.x = Math.PI / 2;
  const chRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.04, 8, 32), brassMat);
  chRing2.position.set(0, 3.5, -60.0);
  chRing2.rotation.x = Math.PI / 2;
  lr.add(chRing1);
  lr.add(chRing2);

  // Ficus Plant in Ceramic Pot
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.9, 16), calacattaMat);
  pot.position.set(-6.2, 0.45, -64.0);
  const plant = new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 12), new THREE.MeshBasicMaterial({ color: 0x2e5c24 }));
  plant.position.set(-6.2, 2.2, -64.0);
  lr.add(pot);
  lr.add(plant);

  bungalowGroup.add(lr);

  // =========================================================================
  // ROOM 2: GOURMET MODULAR KITCHEN & DINING (Center at Z = -40.0)
  // =========================================================================
  const kitchen = new THREE.Group();
  addRoomArchitecturalShell(kitchen, -40.0);

  // Porcelain Tile Floor
  const kFloor = new THREE.Mesh(new THREE.BoxGeometry(15.9, 0.08, 13.9), porcelainFloorMat);
  kFloor.position.set(0, 0.04, -40.0);
  kitchen.add(kFloor);

  // 4.2m Waterfall Calacatta Gold Marble Island
  const island = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.95, 1.6), calacattaMat);
  island.position.set(0, 0.52, -40.0);
  kitchen.add(island);

  // Black Ceramic Induction Cooktop
  const cooktop = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.04, 0.75), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  cooktop.position.set(-1.1, 1.02, -40.0);
  kitchen.add(cooktop);

  // Undermount Sink with Brass Faucet
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.65), new THREE.MeshBasicMaterial({ color: 0x222222 }));
  sink.position.set(1.1, 1.01, -40.0);
  const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.48, 8), brassMat);
  faucet.position.set(1.1, 1.25, -39.7);
  kitchen.add(sink);
  kitchen.add(faucet);

  // Contemporary Bar Stools with Footrests
  for (let bs = 0; bs < 3; bs++) {
    const sx = -1.2 + bs * 1.2;
    const stoolLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.68, 16), charcoalWoodMat);
    stoolLegs.position.set(sx, 0.38, -38.8);
    const footrest = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.02, 6, 16), brassMat);
    footrest.position.set(sx, 0.25, -38.8);
    footrest.rotation.x = Math.PI / 2;
    const stoolCushion = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 16), terracottaMat);
    stoolCushion.position.set(sx, 0.75, -38.8);
    kitchen.add(stoolLegs);
    kitchen.add(footrest);
    kitchen.add(stoolCushion);
  }

  // Fruit Bowl & Wine Bottle on Marble Island
  const fruitBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.16, 0.12, 16), brassMat);
  fruitBowl.position.set(0.0, 1.05, -40.0);
  const wineBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.38, 10), new THREE.MeshBasicMaterial({ color: 0x1b3820 }));
  wineBottle.position.set(-0.35, 1.18, -40.0);
  kitchen.add(fruitBowl);
  kitchen.add(wineBottle);

  // Matte Charcoal Modular Back Cabinetry Wall
  const cabWall = new THREE.Mesh(new THREE.BoxGeometry(14.0, 3.4, 0.8), charcoalWoodMat);
  cabWall.position.set(0, 1.7, -46.5);
  kitchen.add(cabWall);

  // Warm LED Under-Cabinet Cove Lighting
  const cove = new THREE.Mesh(new THREE.BoxGeometry(13.8, 0.06, 0.4), ledGlowMat);
  cove.position.set(0, 3.42, -46.3);
  kitchen.add(cove);

  // Built-in Double Ovens
  const ovens = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.7, 0.1), new THREE.MeshBasicMaterial({ color: 0x484848 }));
  ovens.position.set(4.2, 1.7, -46.05);
  kitchen.add(ovens);

  // Integrated Glass Wine Cooler with Illuminated Bottles
  const wine = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.7), smokedGlassMat);
  wine.position.set(-4.2, 1.7, -46.05);
  const wineLight = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.05), ledGlowMat);
  wineLight.position.set(-4.2, 1.7, -46.1);
  kitchen.add(wine);
  kitchen.add(wineLight);

  // Trio of Brass Cylinder Pendant Lights
  for (let p = 0; p < 3; p++) {
    const px = -1.2 + p * 1.2;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.8, 6), charcoalWoodMat);
    cord.position.set(px, 3.7, -40.0);
    const pend = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 12), brassMat);
    pend.position.set(px, 2.7, -40.0);
    const bulbGlow = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), ledGlowMat);
    bulbGlow.position.set(px, 2.45, -40.0);
    kitchen.add(cord);
    kitchen.add(pend);
    kitchen.add(bulbGlow);
  }

  // Framed Culinary Art Canvas
  const art2Frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 2.4), brassMat);
  art2Frame.position.set(7.9, 2.6, -40.0);
  const art2Canvas = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.6, 2.2), artOchreMat);
  art2Canvas.position.set(7.88, 2.6, -40.0);
  kitchen.add(art2Frame);
  kitchen.add(art2Canvas);

  bungalowGroup.add(kitchen);

  // =========================================================================
  // ROOM 3: MASTER BEDROOM SUITE (Center at Z = -20.0)
  // =========================================================================
  const bedroom = new THREE.Group();
  addRoomArchitecturalShell(bedroom, -20.0);

  // Deep Plush Neutral Carpet
  const bCarpet = new THREE.Mesh(new THREE.BoxGeometry(15.9, 0.08, 13.9), carpetMat);
  bCarpet.position.set(0, 0.04, -20.0);
  bedroom.add(bCarpet);

  // King-Size Platform Bed Frame
  const bedBase = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.45, 3.8), warmTeakMat);
  bedBase.position.set(0, 0.26, -20.0);
  bedroom.add(bedBase);

  // Crisp White Mattress & Duvet
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.45, 3.4), bedLinenMat);
  mattress.position.set(0, 0.62, -19.8);
  bedroom.add(mattress);

  // Folded Charcoal Throw Blanket
  const throwB = new THREE.Mesh(new THREE.BoxGeometry(3.14, 0.08, 1.2), charcoalWoodMat);
  throwB.position.set(0, 0.88, -18.7);
  bedroom.add(throwB);

  // Cozy Upholstered Bedroom Bench at Foot of Bed
  const bench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.44, 0.8), sofaFabricMat);
  bench.position.set(0, 0.26, -17.5);
  const benchLegs = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 0.6), brassMat);
  benchLegs.position.set(0, 0.11, -17.5);
  bedroom.add(bench);
  bedroom.add(benchLegs);

  // Vertical Fluted Upholstered Headboard
  const hb = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.9, 0.28), headboardMat);
  hb.position.set(0, 1.25, -21.8);
  bedroom.add(hb);

  // Slatted Oak Accent Wall behind bed
  const slattedWall = new THREE.Mesh(new THREE.BoxGeometry(8.0, 4.6, 0.15), warmTeakMat);
  slattedWall.position.set(0, 2.3, -26.8);
  bedroom.add(slattedWall);

  // Framed Master Art Piece above Headboard
  const art3Frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.08), brassMat);
  art3Frame.position.set(0, 3.2, -26.7);
  const art3Canvas = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 0.06), artTerracottaMat);
  art3Canvas.position.set(0, 3.2, -26.68);
  bedroom.add(art3Frame);
  bedroom.add(art3Canvas);

  // Floating Walnut Bedside Tables
  const ntL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 0.65), warmTeakMat);
  ntL.position.set(-2.3, 0.45, -21.4);
  const ntR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 0.65), warmTeakMat);
  ntR.position.set(2.3, 0.45, -21.4);
  bedroom.add(ntL);
  bedroom.add(ntR);

  // Modern Bedside Pendant Lamps
  const lampL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.48, 12), ledGlowMat);
  lampL.position.set(-2.3, 0.88, -21.4);
  const lampR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.48, 12), ledGlowMat);
  lampR.position.set(2.3, 0.88, -21.4);
  bedroom.add(lampL);
  bedroom.add(lampR);

  // Walk-In Wardrobe with Smoked Glass Doors & Backlit Shelves
  const wardrobe = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.2, 1.2), smokedGlassMat);
  wardrobe.position.set(-5.8, 1.65, -19.5);
  bedroom.add(wardrobe);

  // Sliding Glass Doors opening toward Rotunda Terrace
  const terraceDoor = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 4.2), windowGlassMat);
  terraceDoor.position.set(0, 2.1, -13.1);
  bedroom.add(terraceDoor);

  bungalowGroup.add(bedroom);

  targetScene.add(bungalowGroup);
  window.__bungalowInterior = bungalowGroup;
}

buildWalkInBungalowRooms(scene);

// ------------------------------------------------ 3D SPATIAL LANDMARKS & FLOATING PINS
const SPATIAL_LANDMARKS = [
  {
    id: 'tower-a',
    title: 'Tower A',
    subtitle: '15 Floors · East Wing',
    icon: '🏢',
    pos: new THREE.Vector3(48.0, 42.0, 35.0),
    viewCamPos: new THREE.Vector3(76.0, 32.0, 58.0),
    viewLookAt: new THREE.Vector3(48.0, 20.0, 35.0)
  },
  {
    id: 'tower-b',
    title: 'Tower B',
    subtitle: '15 Floors · East Wing',
    icon: '🏢',
    pos: new THREE.Vector3(48.0, 42.0, -35.0),
    viewCamPos: new THREE.Vector3(76.0, 32.0, -12.0),
    viewLookAt: new THREE.Vector3(48.0, 20.0, -35.0)
  },
  {
    id: 'tower-c',
    title: 'Tower C',
    subtitle: '15 Floors · West Wing',
    icon: '🏢',
    pos: new THREE.Vector3(-48.0, 42.0, -35.0),
    viewCamPos: new THREE.Vector3(-76.0, 32.0, -12.0),
    viewLookAt: new THREE.Vector3(-48.0, 20.0, -35.0)
  },
  {
    id: 'tower-d',
    title: 'Tower D',
    subtitle: '15 Floors · West Wing',
    icon: '🏢',
    pos: new THREE.Vector3(-48.0, 42.0, 35.0),
    viewCamPos: new THREE.Vector3(-76.0, 32.0, 58.0),
    viewLookAt: new THREE.Vector3(-48.0, 20.0, 35.0)
  },
  {
    id: 'olympic-pool',
    title: 'Olympic Lap Pool',
    subtitle: '28m Resort Pool & Cabanas',
    icon: '🏊',
    pos: new THREE.Vector3(4.0, 2.8, -38.0),
    viewCamPos: new THREE.Vector3(4.0, 20.0, -15.0),
    viewLookAt: new THREE.Vector3(4.0, 0.5, -38.0)
  },
  {
    id: 'kids-pool',
    title: 'Kids Splash Pool',
    subtitle: 'Shallow Jet Waterpark',
    icon: '💦',
    pos: new THREE.Vector3(-18.0, 2.5, -38.0),
    viewCamPos: new THREE.Vector3(-18.0, 16.0, -18.0),
    viewLookAt: new THREE.Vector3(-18.0, 0.5, -38.0)
  },
  {
    id: 'central-villa',
    title: 'Central Luxury Bungalow',
    subtitle: 'Walk-In Designer Villa',
    icon: '🏡',
    pos: new THREE.Vector3(0, 8.0, 2.0),
    viewCamPos: new THREE.Vector3(0, 14.0, 32.0),
    viewLookAt: new THREE.Vector3(0, 3.5, 2.0)
  },
  {
    id: 'tennis-court',
    title: 'Grand Slam Tennis Court',
    subtitle: 'US Open Acrylic Surface',
    icon: '🎾',
    pos: new THREE.Vector3(-18.0, 3.2, 24.0),
    viewCamPos: new THREE.Vector3(-18.0, 18.0, 48.0),
    viewLookAt: new THREE.Vector3(-18.0, 0.5, 24.0)
  },
  {
    id: 'basketball-court',
    title: 'NBA Basketball Court',
    subtitle: 'Regulation Hoops & Lighting',
    icon: '🏀',
    pos: new THREE.Vector3(-18.0, 3.2, 55.0),
    viewCamPos: new THREE.Vector3(-18.0, 18.0, 80.0),
    viewLookAt: new THREE.Vector3(-18.0, 0.5, 55.0)
  },
  {
    id: 'glass-gym',
    title: 'Vitality Glass Gym',
    subtitle: 'Wellness & Fitness Club',
    icon: '🏋️',
    pos: new THREE.Vector3(18.0, 5.5, 40.0),
    viewCamPos: new THREE.Vector3(28.0, 14.0, 60.0),
    viewLookAt: new THREE.Vector3(18.0, 2.5, 40.0)
  },
  {
    id: 'gatehouse',
    title: 'Grand Gatehouse',
    subtitle: '24/7 Monitored Access',
    icon: '🛡️',
    pos: new THREE.Vector3(0, 5.8, 96.0),
    viewCamPos: new THREE.Vector3(0, 16.0, 118.0),
    viewLookAt: new THREE.Vector3(0, 3.0, 96.0)
  }
];

let spatialPinElements = [];
const spatialLabelsLayer = document.getElementById('spatial-labels-layer');
let areLabelsEnabled = true;

function createSpatialPinElements() {
  if (!spatialLabelsLayer) return;
  spatialLabelsLayer.innerHTML = '';
  spatialPinElements = [];

  SPATIAL_LANDMARKS.forEach((lm) => {
    const pin = document.createElement('div');
    pin.className = 'spatial-pin';
    pin.setAttribute('data-id', lm.id);
    pin.innerHTML = `
      <div class="spatial-pin__badge">
        <span class="spatial-pin__icon">${lm.icon}</span>
        <div style="display:flex; flex-direction:column; line-height:1.15;">
          <span class="spatial-pin__title">${lm.title}</span>
          <span class="spatial-pin__sub">${lm.subtitle}</span>
        </div>
      </div>
      <div class="spatial-pin__stem"></div>
      <div class="spatial-pin__dot"></div>
    `;

    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      flyToLandmark(lm);
    });

    spatialLabelsLayer.appendChild(pin);
    spatialPinElements.push({ el: pin, landmark: lm });
  });
}

function updateSpatialPins(cam, width, height) {
  if (!areLabelsEnabled || !spatialLabelsLayer || journey.progress < 0.32 || journey.progress >= 0.65) {
    if (spatialLabelsLayer && !spatialLabelsLayer.classList.contains('is-hidden')) {
      spatialLabelsLayer.classList.add('is-hidden');
    }
    return;
  }
  spatialLabelsLayer.classList.remove('is-hidden');

  const halfW = width / 2;
  const halfH = height / 2;
  const tempV = new THREE.Vector3();

  for (let i = 0; i < spatialPinElements.length; i++) {
    const item = spatialPinElements[i];
    tempV.copy(item.landmark.pos);
    tempV.project(cam);

    // Behind camera check
    if (tempV.z > 1.0) {
      item.el.style.opacity = '0';
      item.el.style.pointerEvents = 'none';
      continue;
    }

    const screenX = (tempV.x * halfW) + halfW;
    const screenY = -(tempV.y * halfH) + halfH;

    // Margin bounds check
    if (screenX < 30 || screenX > width - 30 || screenY < 70 || screenY > height - 60) {
      item.el.style.opacity = '0';
      item.el.style.pointerEvents = 'none';
      continue;
    }

    item.el.style.opacity = '1';
    item.el.style.pointerEvents = 'auto';
    item.el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -100%)`;
  }
}

// ------------------------------------------------ 4-SIDE PANORAMIC CONTROLS
const societyViewState = {
  mode: 'auto', // 'auto' | 'south' | 'east' | 'north' | 'west' | 'landmark'
  orbitAngle: 0.0,
  targetLandmark: null
};

function setupSocietyViewControls() {
  const buttons = document.querySelectorAll('.view-side-btn[data-side]');
  const toggleLabelsBtn = document.getElementById('toggle-labels-btn');
  const toggleLabelsText = document.getElementById('toggle-labels-text');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      societyViewState.mode = side;
      societyViewState.targetLandmark = null;
    });
  });

  if (toggleLabelsBtn) {
    toggleLabelsBtn.addEventListener('click', () => {
      areLabelsEnabled = !areLabelsEnabled;
      if (areLabelsEnabled) {
        toggleLabelsBtn.classList.add('is-active');
        if (toggleLabelsText) toggleLabelsText.textContent = 'Labels On';
      } else {
        toggleLabelsBtn.classList.remove('is-active');
        if (toggleLabelsText) toggleLabelsText.textContent = 'Labels Off';
      }
    });
  }
}

function flyToLandmark(lm) {
  societyViewState.mode = 'landmark';
  societyViewState.targetLandmark = lm;
  const buttons = document.querySelectorAll('.view-side-btn[data-side]');
  buttons.forEach(b => b.classList.remove('is-active'));
}

// Initialize Full Gated Township Society, Amenities & Bungalow directly in Three.js scene!
setupGatedTownshipAndBungalow(scene);
createSpatialPinElements();
setupSocietyViewControls();
setupDayNightController();
setupRoomNavigation();

// Initial State: Art Gallery Entrance is active!
if (rotundaGroup) rotundaGroup.visible = true;
if (gatedTownshipGroup) gatedTownshipGroup.visible = false;
if (window.__bungalowInterior) window.__bungalowInterior.visible = false;
canvasContainer.style.opacity = '1';
canvasContainer.style.pointerEvents = 'auto';
palaceContainer.style.opacity = '0';
palaceContainer.style.pointerEvents = 'none';

// ------------------------------------------------ 7. UNIFIED CONTINUOUS JOURNEY CONTROLLER
// Master Journey Progress:
// 0.00 -> 0.28 : Art Gallery Entrance (Rotunda Exhibition Wall, 64 Paintings)
// 0.28 -> 0.35 : Classical Temple Portal Transition out into the Gated Society
// 0.35 -> 0.65 : Full Gated Society 360° Panoramic Tour (All 4 Sides, Floating Labels)
// 0.65 -> 1.00 : Walk-In Central Luxury Bungalow Interior (Living Room, Kitchen, Bedroom)
const journey = {
  progress: 0.0,
  targetProgress: 0.0,
  activeMode: 'rotunda'
};

// Support direct URL coordinate query (?p=0.35, etc.)
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
  // Nomadiic Palace is fully replaced by the Native Three.js Art Gallery Entrance & Gated Township
  return;
}

// initNomadiicStage();

// ------------------------------------------------ 8. FLUID SCROLL SYSTEM (WHEEL, TOUCH, ARROWS)
function handleJourneyDelta(rawDelta) {
  if (drawer.classList.contains('is-open') || listView.classList.contains('is-visible')) return;

  const clampedDelta = Math.max(-100, Math.min(100, rawDelta));
  // Scroll sensitivity: 0.00045
  journey.targetProgress += clampedDelta * 0.00045;
  journey.targetProgress = Math.max(0.0, Math.min(1.0, journey.targetProgress));
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
  if (journey.targetProgress >= 0.65) {
    journey.targetProgress = Math.max(0.38, journey.targetProgress - 0.10);
  } else if (journey.targetProgress >= 0.30) {
    journey.targetProgress = 0.00;
  } else {
    journey.targetProgress = Math.max(0.0, journey.targetProgress - (ANGLE_STEP / (Math.PI * 2 / 0.28)));
  }
});

nextBtn?.addEventListener('click', () => {
  if (journey.targetProgress < 0.28) {
    journey.targetProgress = Math.min(0.38, journey.targetProgress + (ANGLE_STEP / (Math.PI * 2 / 0.28)));
  } else if (journey.targetProgress < 0.65) {
    journey.targetProgress = 0.68;
  } else {
    journey.targetProgress = Math.min(1.0, journey.targetProgress + 0.10);
  }
});

// Portal Back Button: Steps back out
portalBackBtn?.addEventListener('click', () => {
  if (journey.progress >= 0.65) {
    // From Bungalow Interior back to Gated Society 360°
    journey.targetProgress = 0.38;
  } else if (journey.progress >= 0.28) {
    // From Gated Society 360° back to Art Gallery Entrance
    journey.targetProgress = 0.00;
  } else {
    journey.targetProgress = 0.00;
  }
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
  if (drawer.classList.contains('is-open') || pointer.x === -999 || journey.progress >= 0.28) {
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
          ? 'WALK OUT TO GATED SOCIETY 360°'
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
  if (e.target.closest('.gallery-nav') || e.target.closest('.drawer') || e.target.closest('.view-toggle') || e.target.closest('.room-nav') || e.target.closest('.portal-back-wrap') || e.target.closest('.society-view-controls') || e.target.closest('.spatial-pin') || e.target.closest('.awwwards-ribbon')) return;

  if (hoveredMesh) {
    if (hoveredMesh.userData.isCenterPortal) {
      // Step out through portal into Gated Society 360°!
      journey.targetProgress = 0.38;
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

  // Animate moving residents along the society footpaths
  if (animatedResidents && animatedResidents.length > 0) {
    for (let r = 0; r < animatedResidents.length; r++) {
      const res = animatedResidents[r];
      res.mesh.position.z += res.dir * res.speed * delta * 2.5;

      if (res.mesh.position.z < res.minZ) {
        res.mesh.position.z = res.minZ;
        res.dir = 1;
        res.mesh.rotation.y = 0;
      } else if (res.mesh.position.z > res.maxZ) {
        res.mesh.position.z = res.maxZ;
        res.dir = -1;
        res.mesh.rotation.y = Math.PI;
      }

      // Walking stride swing & body bounce
      const swing = Math.sin(now * 0.006 * res.speed * 2.0) * 0.5;
      if (res.legL) res.legL.rotation.x = swing;
      if (res.legR) res.legR.rotation.x = -swing;
      if (res.armL) res.armL.rotation.x = -swing * 0.8;
      if (res.armR) res.armR.rotation.x = swing * 0.8;
      res.mesh.position.y = res.baseY + Math.abs(Math.sin(now * 0.006 * res.speed * 2.0)) * 0.06;
    }
  }

  // Animate living room fireplace flame flicker
  if (fireplaceFlameMesh) {
    const flicker = 0.9 + 0.22 * Math.sin(now * 0.02) + 0.12 * Math.cos(now * 0.045);
    fireplaceFlameMesh.scale.y = flicker;
  }

  // Update active room pill in the top header
  updateActiveRoomPill(journey.progress);

  // Stage Management & Cross-fade
  const societyControlsEl = document.getElementById('society-view-controls');

  if (journey.progress < 0.28) {
    // Stage 1: 3D Art Gallery Entrance (Rotunda Track, 64 Paintings)
    journey.activeMode = 'rotunda';
    canvasContainer.style.opacity = '1';
    canvasContainer.style.pointerEvents = 'auto';
    palaceContainer.style.opacity = '0';
    palaceContainer.style.pointerEvents = 'none';

    if (rotundaGroup) rotundaGroup.visible = true;
    if (gatedTownshipGroup) gatedTownshipGroup.visible = false;
    if (window.__bungalowInterior) window.__bungalowInterior.visible = false;

    portalBackWrap?.classList.remove('is-visible');
    societyControlsEl?.classList.remove('is-visible');
    if (spatialLabelsLayer) spatialLabelsLayer.classList.add('is-hidden');

    if (waypointHud) waypointHud.style.opacity = '1';
    if (viewToggle) viewToggle.style.opacity = '1';
    if (helpTapLink) helpTapLink.style.opacity = '0';
    if (hintLine1) hintLine1.textContent = '360° Art Gallery Entrance · Scroll to walk curated rotunda';
    if (hintLine2) hintLine2.textContent = 'Click any painting to inspect · Scroll forward to exit to Gated Society';

    // Walk around the 360° rotunda wall
    const rotundaRot = (journey.progress / 0.28) * (Math.PI * 2);
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
      if (navStatusText) navStatusText.textContent = `Art Gallery Entrance · Station ${stationIndex + 1} of 32: ${item.title}`;
    }

    // Inner wall distance fade
    const camDist = Math.hypot(currentEye.x, currentEye.z);
    const innerWallOpacity = THREE.MathUtils.smoothstep(camDist, 7.4 + 0.2, 7.4 + 1.8);
    innerWallMat.opacity = innerWallOpacity;
    innerLampMat.opacity = 0.55 * innerWallOpacity;

    // Throttled raycasting hover check
    checkHover(now);

  } else if (journey.progress < 0.35) {
    // Stage 2: Grand Classical Portal Transition
    journey.activeMode = 'portal-transition';
    canvasContainer.style.opacity = '1';
    canvasContainer.style.pointerEvents = 'auto';
    palaceContainer.style.opacity = '0';
    palaceContainer.style.pointerEvents = 'none';

    const t = (journey.progress - 0.28) / 0.07;
    if (t < 0.5) {
      if (rotundaGroup) rotundaGroup.visible = true;
      if (gatedTownshipGroup) gatedTownshipGroup.visible = false;
    } else {
      if (rotundaGroup) rotundaGroup.visible = false;
      if (gatedTownshipGroup) gatedTownshipGroup.visible = true;
    }

    portalBackWrap?.classList.add('is-visible');
    if (portalBackText) portalBackText.textContent = '← STEP BACK INTO ART GALLERY';
    societyControlsEl?.classList.remove('is-visible');
    if (spatialLabelsLayer) spatialLabelsLayer.classList.add('is-hidden');

    if (hudKicker) hudKicker.textContent = 'ESTATE PORTAL';
    if (hudTitle) hudTitle.textContent = 'Stepping Out to Nexora Gated Society';
    if (hudSubtitle) hudSubtitle.textContent = 'Transitioning from the rotunda art gallery to the luxury community grounds';
    if (navStatusText) navStatusText.textContent = 'Exiting Art Gallery · Entering Gated Society 360°';
    if (hintLine1) hintLine1.textContent = 'Stepping through classical temple portal...';
    if (hintLine2) hintLine2.textContent = 'Scroll forward to view the 360° gated society';

    // Camera glides through doorway forward
    const pCamPos = new THREE.Vector3(
      0,
      THREE.MathUtils.lerp(1.7, 24.0, t),
      THREE.MathUtils.lerp(7.0, 96.0, t)
    );
    const pLookAt = new THREE.Vector3(0, THREE.MathUtils.lerp(1.5, 6.0, t), THREE.MathUtils.lerp(15.0, 10.0, t));
    const damp = 1 - Math.exp(-7.0 * delta);
    currentEye.lerp(pCamPos, damp);
    currentLookAt.lerp(pLookAt, damp);

  } else if (journey.progress < 0.65) {
    // Stage 3: Full Gated Society 360° Panoramic Tour (View from All 4 Sides + Floating Pins)
    journey.activeMode = 'society';
    canvasContainer.style.opacity = '1';
    canvasContainer.style.pointerEvents = 'auto';
    palaceContainer.style.opacity = '0';
    palaceContainer.style.pointerEvents = 'none';

    if (rotundaGroup) rotundaGroup.visible = false;
    if (gatedTownshipGroup) gatedTownshipGroup.visible = true;
    if (window.__bungalowInterior) window.__bungalowInterior.visible = false;

    portalBackWrap?.classList.add('is-visible');
    if (portalBackText) portalBackText.textContent = '← STEP BACK INTO ART GALLERY';
    societyControlsEl?.classList.add('is-visible');

    // In society 360° tour, hide center text HUD so 4-side buttons and scene are completely clear
    if (waypointHud) waypointHud.style.opacity = '0';
    if (viewToggle) viewToggle.style.opacity = '0';
    if (helpTapLink) helpTapLink.style.opacity = '1';
    if (navStatusText) navStatusText.textContent = 'Gated Society 360° · Towers A-D, Pools, Courts, Gym & Villa';
    if (hintLine1) hintLine1.textContent = 'View society from all 4 sides · Click landmark pins to inspect';
    if (hintLine2) hintLine2.textContent = 'Scroll forward or click room pills to walk into central luxury bungalow';

    // Update 3D projected spatial pins
    updateSpatialPins(camera, window.innerWidth, window.innerHeight);

    // 4-Side Camera Orientation & 360° Auto Orbit
    const damp = 1 - Math.exp(-4.5 * delta);
    if (societyViewState.mode === 'auto') {
      societyViewState.orbitAngle += delta * 0.12; // smooth 360° continuous rotation
      const r = 96.0;
      const targetCam = new THREE.Vector3(
        Math.sin(societyViewState.orbitAngle) * r,
        34.0,
        Math.cos(societyViewState.orbitAngle) * r
      );
      currentEye.lerp(targetCam, damp);
      currentLookAt.lerp(new THREE.Vector3(0, 6.0, 5.0), damp);
    } else if (societyViewState.mode === 'south') {
      currentEye.lerp(new THREE.Vector3(0, 22.0, 96.0), damp);
      currentLookAt.lerp(new THREE.Vector3(0, 4.0, 10.0), damp);
    } else if (societyViewState.mode === 'east') {
      currentEye.lerp(new THREE.Vector3(-14.0, 18.0, 0.0), damp);
      currentLookAt.lerp(new THREE.Vector3(48.0, 16.0, 0.0), damp);
    } else if (societyViewState.mode === 'north') {
      currentEye.lerp(new THREE.Vector3(-2.0, 14.0, -16.0), damp);
      currentLookAt.lerp(new THREE.Vector3(-4.0, 1.2, -38.0), damp);
    } else if (societyViewState.mode === 'west') {
      currentEye.lerp(new THREE.Vector3(14.0, 18.0, 0.0), damp);
      currentLookAt.lerp(new THREE.Vector3(-48.0, 16.0, 0.0), damp);
    } else if (societyViewState.mode === 'landmark' && societyViewState.targetLandmark) {
      currentEye.lerp(societyViewState.targetLandmark.viewCamPos, damp);
      currentLookAt.lerp(societyViewState.targetLandmark.viewLookAt, damp);
    }

  } else {
    // Stage 4: Walk-In Central Luxury Bungalow Interior
    journey.activeMode = 'bungalow';
    canvasContainer.style.opacity = '1';
    canvasContainer.style.pointerEvents = 'auto';
    palaceContainer.style.opacity = '0';
    palaceContainer.style.pointerEvents = 'none';

    if (rotundaGroup) rotundaGroup.visible = false;
    if (gatedTownshipGroup) gatedTownshipGroup.visible = true;
    if (window.__bungalowInterior) window.__bungalowInterior.visible = false;

    portalBackWrap?.classList.add('is-visible');
    if (portalBackText) portalBackText.textContent = '← WALK OUT TO GATED SOCIETY 360°';
    societyControlsEl?.classList.remove('is-visible');
    if (spatialLabelsLayer) spatialLabelsLayer.classList.add('is-hidden');

    if (waypointHud) waypointHud.style.opacity = '1';
    if (viewToggle) viewToggle.style.opacity = '0';
    if (helpTapLink) helpTapLink.style.opacity = '0';
    if (hintLine1) hintLine1.textContent = 'Inside Central Luxury Bungalow Villa';
    if (hintLine2) hintLine2.textContent = 'Scroll forward or click room pills to walk through rooms';

    const damp = 1 - Math.exp(-7.5 * delta);
    const roomCamPos = new THREE.Vector3();
    const roomLookAt = new THREE.Vector3();

    if (journey.progress < 0.75) {
      // Living Room (p = 0.65 to 0.75)
      const t = (journey.progress - 0.65) / 0.10;
      roomCamPos.set(1.5, 1.65, 14.8 - t * 4.2);
      roomLookAt.set(-0.2, 1.35, 9.6);
      if (hudKicker) hudKicker.textContent = 'CENTRAL LUXURY BUNGALOW';
      if (hudTitle) hudTitle.textContent = 'Grand Living Room & Fireplace Lounge';
      if (hudSubtitle) hudSubtitle.textContent = 'Italian sectional lounge, marble coffee table & Nero Marquina fireplace';
      if (navStatusText) navStatusText.textContent = 'Bungalow Room 1 of 3: Grand Living Room & Fireplace';
    } else if (journey.progress < 0.85) {
      // Modular Kitchen (p = 0.75 to 0.85)
      const t = (journey.progress - 0.75) / 0.10;
      roomCamPos.set(Math.sin(t * Math.PI) * 0.8, 1.75, 5.0 - t * 4.5);
      roomLookAt.set(0, 1.45, -2.0);
      if (hudKicker) hudKicker.textContent = 'CENTRAL LUXURY BUNGALOW';
      if (hudTitle) hudTitle.textContent = 'Gourmet Modular Kitchen & Dining';
      if (hudSubtitle) hudSubtitle.textContent = '4.2m waterfall Calacatta gold marble island, modular cabinetry & wine cooler';
      if (navStatusText) navStatusText.textContent = 'Bungalow Room 2 of 3: Gourmet Modular Kitchen';
    } else {
      // Master Bedroom (p = 0.85 to 1.00)
      const t = (journey.progress - 0.85) / 0.15;
      roomCamPos.set(Math.sin(t * Math.PI) * 0.8, 1.75, -5.0 - t * 4.5);
      roomLookAt.set(0, 1.45, -11.0);
      if (hudKicker) hudKicker.textContent = 'CENTRAL LUXURY BUNGALOW';
      if (hudTitle) hudTitle.textContent = 'Master Bedroom Suite & Walk-In Wardrobe';
      if (hudSubtitle) hudSubtitle.textContent = 'King platform bed, vertical fluted headboard & designer wardrobe';
      if (navStatusText) navStatusText.textContent = 'Bungalow Room 3 of 3: Master Bedroom Suite';
    }

    currentEye.lerp(roomCamPos, damp);
    currentLookAt.lerp(roomLookAt, damp);
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
