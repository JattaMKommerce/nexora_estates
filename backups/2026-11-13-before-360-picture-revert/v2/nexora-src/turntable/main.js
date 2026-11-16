/**
 * Nexora live 360° view.
 *
 * content.json media of type "turntable" ({ id, type: "turntable", model: "villa" | "community" })
 * get a live 3D model that turns all the way round automatically. The site script creates an
 * empty <div class="media turntable"> for each and shows / hides it like its other media; this
 * module watches those elements and renders into whichever one is showing. A small control
 * switches between the villa and the community and pauses the rotation. On the "Ready to Move In"
 * step, hotspots with an "anchor" follow their place on the turning model.
 *
 * Built with scripts/build-turntable.mjs into public/nexora/turntable.js.
 */
import * as THREE from 'three';
import { createKit, SUN_DIR } from './kit.js';
import { buildVilla } from './villa.js';
import { buildCommunity } from './community.js';

const BASE = '/nexora/3d/';
const HAZE = new THREE.Color('#e0cfac');
const TAU = Math.PI * 2;
const html = document.documentElement;
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let started = false;
let renderer;
let scene;
let camera;
let sun;
let kit;
let canvas;
let chip;
const models = {};
const builders = { villa: buildVilla, community: buildCommunity };
let current = null; // model name on screen
let active = null; // { el, id, def }
let raf = 0;
let last = 0;
let angle = 0;
let speed = 0;
let intro = 1;
let userPaused = false;
let dpr = 1;
let dprCap = 1.5;
const frames = [];
const tmp = new THREE.Vector3();

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) {
    return false;
  }
}

export function init() {
  if (started) return;
  started = true;
  if (!webglAvailable()) return; // the media keeps its plain background; no control is shown
  const phone = window.matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820;
  dprCap = phone ? 1.5 : 1.5;
  dpr = Math.min(window.devicePixelRatio || 1, dprCap);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 0.7s ease-in-out';

  scene = new THREE.Scene();
  scene.background = HAZE.clone();
  scene.fog = new THREE.FogExp2(HAZE.clone(), 0.002);
  camera = new THREE.PerspectiveCamera(33, 16 / 9, 1, 5000);

  kit = createKit(renderer, BASE);
  scene.environment = kit.environment;
  scene.environmentIntensity = 0.6;

  scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x6d7a4a, 0.85));
  sun = new THREE.DirectionalLight(0xffd9ae, 3.1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(phone ? 1024 : 2048, phone ? 1024 : 2048);
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);

  buildChip();
  watchMedia();
  if (/[?&]debug360\b/.test(location.search)) {
    // for visual checks only: ?debug360 lets a test set the model and angle
    window.__nx360 = {
      model: (n) => setModel(n, { introMove: false }),
      angle: (turns) => { angle = turns * TAU; intro = 1; },
      pause: (p) => { userPaused = !!p; updateChip(); },
      info: () => ({ current, dpr, calls: renderer.info.render.calls, tris: renderer.info.render.triangles })
    };
  }
  new ResizeObserver(() => resize()).observe(document.body);
  window.addEventListener('resize', resize);

  // build both models while the visitor reads the first pages, so the 360° view opens at once
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  idle(() => ensureModel('villa'), { timeout: 4000 });
  idle(() => setTimeout(() => ensureModel('community'), 600), { timeout: 6000 });
}

/* models ------------------------------------------------------------------------------------- */

function ensureModel(name) {
  if (!models[name]) {
    const m = builders[name](kit);
    m.group.visible = false;
    scene.add(m.group);
    models[name] = m;
    // compile its shaders now rather than on first view
    const was = current && models[current] ? models[current].group : null;
    if (was) was.visible = false;
    m.group.visible = true;
    try { renderer.compile(scene, camera); } catch (e) { /* compile is an optimisation only */ }
    m.group.visible = false;
    if (was) was.visible = true;
  }
  return models[name];
}

function setModel(name, { introMove = true } = {}) {
  if (!builders[name]) name = 'villa';
  const m = ensureModel(name);
  if (current && models[current]) models[current].group.visible = false;
  current = name;
  m.group.visible = true;
  const v = m.view;
  camera.fov = v.fov;
  camera.updateProjectionMatrix();
  scene.fog.density = m.fog / portraitFit();
  // sun and its shadow frustum around this model
  const s = m.shadow.size;
  sun.position.copy(m.shadow.center).addScaledVector(SUN_DIR, s * 4);
  sun.target.position.copy(m.shadow.center);
  sun.shadow.camera.left = -s;
  sun.shadow.camera.right = s;
  sun.shadow.camera.top = s;
  sun.shadow.camera.bottom = -s;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = s * 9;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = (s / sun.shadow.mapSize.x) * 2.2;
  sun.shadow.camera.updateProjectionMatrix();
  sun.target.updateMatrixWorld();
  renderer.shadowMap.needsUpdate = true;
  angle = v.start * TAU;
  if (introMove) intro = 0;
  updateChip();
}

/* the site's media elements ------------------------------------------------------------------- */

function mediaDef(id) {
  const list = (window.content && window.content.media) || [];
  for (let i = 0; i < list.length; i += 1) if (list[i].id === id) return list[i];
  return { id, model: 'villa' };
}

function watchMedia() {
  const attr = new MutationObserver(update);
  const seen = new WeakSet();
  const scan = () => {
    const wrap = document.getElementById('media');
    if (!wrap) return;
    wrap.querySelectorAll('.media.turntable').forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', mediaDef(el.id).alt || 'Live 360° view');
      attr.observe(el, { attributes: true, attributeFilter: ['class'] });
    });
    update();
  };
  const wrap = document.getElementById('media');
  if (wrap) new MutationObserver(scan).observe(wrap, { childList: true });
  scan();
}

function update() {
  const wrap = document.getElementById('media');
  const shown = wrap ? [...wrap.querySelectorAll('.media.turntable')].filter((el) => !el.classList.contains('hidden')) : [];
  const steady = shown.filter((el) => !el.classList.contains('fadeOut'));
  const el = steady[steady.length - 1] || shown[shown.length - 1] || null;
  if (el) activate(el);
  else deactivate();
}

function activate(el) {
  if (active && active.el === el) return;
  const def = mediaDef(el.id);
  const firstShow = !active;
  active = { el, id: el.id, def };
  el.appendChild(canvas);
  html.classList.add('nx360-on');
  resize();
  const ready = () => {
    if (!active || active.el !== el) return;
    setModel(def.model || 'villa', { introMove: true });
    if (firstShow) speed = 0;
    renderOnce();
    canvas.style.opacity = '1';
    loop();
  };
  canvas.style.opacity = '0';
  kit.ready.then(() => requestAnimationFrame(ready));
}

function deactivate() {
  if (!active) return;
  active = null;
  html.classList.remove('nx360-on');
  canvas.style.opacity = '0';
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

/* rendering ----------------------------------------------------------------------------------- */

function resize() {
  if (!active || !renderer) return;
  const w = active.el.clientWidth || window.innerWidth;
  const h = active.el.clientHeight || window.innerHeight;
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  if (current && models[current]) scene.fog.density = models[current].fog / portraitFit();
}

function nodeHeld() {
  return !!document.querySelector('.exploreScreen__node.active, .exploreScreen__node.nx-anchored:hover');
}

/** Narrow screens see less sideways, so the camera stands further back to keep the model in. */
function portraitFit() {
  return camera.aspect < 1.35 ? Math.pow(1.35 / camera.aspect, 0.62) : 1;
}

function placeCamera() {
  const v = models[current].view;
  const k = 1 - Math.pow(1 - Math.min(1, intro), 3);
  const fit = portraitFit();
  const r = v.radius * fit * (1 + 0.2 * (1 - k));
  const el = THREE.MathUtils.degToRad(v.elevation + 8 * (1 - k));
  const a = angle - 0.5 * (1 - k);
  camera.position.set(
    v.target.x + Math.sin(a) * Math.cos(el) * r,
    v.target.y + Math.sin(el) * r,
    v.target.z + Math.cos(a) * Math.cos(el) * r
  );
  camera.lookAt(v.target);
}

function renderOnce() {
  if (!current) return;
  placeCamera();
  renderer.render(scene, camera);
  syncAnchors();
}

function loop() {
  if (raf || !active) return;
  last = performance.now();
  const tick = (t) => {
    if (!active) { raf = 0; return; }
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    if (!current) return;
    const v = models[current].view;
    const hold = userPaused || nodeHeld();
    speed += ((hold ? 0 : 1) - speed) * (1 - Math.exp(-dt * 2.5));
    angle += (dt * TAU * speed) / (v.period * (reduceMotion ? 2 : 1));
    if (intro < 1) intro = Math.min(1, intro + dt / 2.6);
    kit.tex.water.offset.x += dt * 0.012;
    kit.tex.water.offset.y += dt * 0.007;
    placeCamera();
    renderer.render(scene, camera);
    syncAnchors();
    adapt(dt);
  };
  raf = requestAnimationFrame(tick);
}

/** Keep the frame rate up on weaker graphics by lowering the resolution a little. */
function adapt(dt) {
  frames.push(dt);
  if (frames.length < 90) return;
  const avg = frames.reduce((a, b) => a + b, 0) / frames.length;
  frames.length = 0;
  if (avg > 1 / 32 && dpr > 0.85) {
    dpr = Math.max(0.85, dpr - 0.25);
    resize();
  } else if (avg < 1 / 55 && dpr < Math.min(window.devicePixelRatio || 1, dprCap)) {
    dpr = Math.min(dprCap, dpr + 0.25);
    resize();
  }
}

/** Hotspots with an "anchor" ride on the model: their left/top follow the projected point. */
function syncAnchors() {
  const x = window.experience;
  const ex = x && x.explore;
  if (!active || !ex || !ex.currentPhase || !html.classList.contains('exploring')) return;
  const scr = ex.currentPhase.screens[ex.stepIndex];
  if (!scr || !scr.nodes || (scr.media || ex.currentPhase.media) !== active.id) return;
  const model = models[current];
  const rect = canvas.getBoundingClientRect();
  scr.nodes.forEach((n) => {
    if (!n.anchor || !n.el || !n.el.parentElement) return;
    n.el.classList.add('nx-anchored');
    const a = model && model.anchors[n.anchor];
    if (!a) { n.el.classList.add('nx-anchor-hidden'); return; }
    tmp.copy(a).project(camera);
    const off = tmp.z > 1 || tmp.x < -0.92 || tmp.x > 0.92 || tmp.y < -0.86 || tmp.y > 0.86;
    n.el.classList.toggle('nx-anchor-hidden', off);
    if (off) return;
    const pr = n.el.parentElement.getBoundingClientRect();
    if (!pr.width || !pr.height) return;
    const sx = rect.left + (tmp.x * 0.5 + 0.5) * rect.width;
    const sy = rect.top + (-tmp.y * 0.5 + 0.5) * rect.height;
    n.el.style.left = (((sx - pr.left) / pr.width) * 100).toFixed(3) + '%';
    n.el.style.top = (((sy - pr.top) / pr.height) * 100).toFixed(3) + '%';
  });
}

/* control ------------------------------------------------------------------------------------- */

const ICON_360 = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 1 1-2.5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18.6 2.6 18.3 6.3 14.7 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 14 14" aria-hidden="true"><rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor"/><rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor"/></svg>';
const ICON_PLAY = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 2.2v9.6L12 7z" fill="currentColor"/></svg>';

function buildChip() {
  chip = document.createElement('div');
  chip.className = 'nx360';
  chip.setAttribute('role', 'group');
  chip.setAttribute('aria-label', 'Live 360° view');
  chip.innerHTML =
    '<span class="nx360__badge">' + ICON_360 + '<span>Live 360°</span></span>' +
    '<button type="button" class="nx360__btn" data-model="villa" aria-pressed="false">Villa</button>' +
    '<button type="button" class="nx360__btn" data-model="community" aria-pressed="false">Community</button>' +
    '<button type="button" class="nx360__btn nx360__btn--icon" data-act="pause" aria-label="Pause rotation">' + ICON_PAUSE + '</button>';
  chip.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    e.stopPropagation();
    if (b.dataset.model && b.dataset.model !== current) switchModel(b.dataset.model);
    if (b.dataset.act === 'pause') {
      userPaused = !userPaused;
      updateChip();
    }
  });
  document.body.appendChild(chip);
}

function switchModel(name) {
  canvas.style.opacity = '0';
  setTimeout(() => {
    if (!active) return;
    setModel(name, { introMove: true });
    renderOnce();
    canvas.style.opacity = '1';
  }, 380);
}

function updateChip() {
  if (!chip) return;
  chip.querySelectorAll('[data-model]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.model === current)));
  const p = chip.querySelector('[data-act="pause"]');
  p.innerHTML = userPaused ? ICON_PLAY : ICON_PAUSE;
  p.setAttribute('aria-label', userPaused ? 'Resume rotation' : 'Pause rotation');
  chip.classList.toggle('is-paused', userPaused);
}
