import { SECTIONS, sectionById } from './story.js';
import { live, ui, emitFrame } from './bus.js';
import { CUT } from './world.js';

/**
 * The scroll engine: turns the native page scroll into the story clock S (see story.js), keeps S
 * damped so the 3D moves like a film, and works out which section, beat and white-page block is on
 * screen. Native scrolling is kept on purpose (keyboard, trackpad, touch and the scrollbar all
 * work); CSS scroll-snap settles the page on each beat.
 */
const els = {};
const snapEls = {};
let segs = [];
let snaps = [];
let rects = [];
let solids = [];
let windows = [];
let blockGroups = [];
let started = false;

export function registerSection(id, el) {
  if (el) els[id] = el;
}
export function registerSnaps(id, list) {
  if (list) snapEls[id] = list;
}

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
function ease(kind, t) {
  if (kind === 'lin') return t;
  if (kind === 'out') return 1 - (1 - t) * (1 - t);
  return t * t * t * (t * (t * 6 - 15) + 10); // smootherstep
}

function stageLength(sec, i) {
  const next = SECTIONS[i + 1];
  const holds = sec.stops.reduce((s, st) => s + (st.hold || 0), 0);
  const legs = sec.legs.reduce((s, l) => s + l, 0);
  return holds + legs + (next && next.kind === 'page' ? 100 : 0);
}

export function measure() {
  const vh = window.innerHeight;
  live.vh = vh;
  live.vw = window.innerWidth;
  SECTIONS.forEach((sec, i) => {
    const el = els[sec.id];
    if (el && sec.kind === 'stage') el.style.height = `${Math.round((stageLength(sec, i) * vh) / 100)}px`;
  });
  const sy = window.scrollY;
  segs = [];
  snaps = [];
  rects = [];
  SECTIONS.forEach((sec) => {
    const el = els[sec.id];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const top = r.top + sy;
    rects.push({ id: sec.id, sec, top, bottom: r.bottom + sy });
    if (sec.kind === 'stage') {
      let y = top;
      let n = 0;
      sec.stops.forEach((st, i) => {
        const h = ((st.hold || 0) * vh) / 100;
        segs.push({ a: y, b: y + h, s0: st.S, s1: st.S });
        if (st.snap) {
          const sy2 = Math.round(y + h / 2);
          snaps.push({ y: sy2, sec: sec.id, beat: st.beat, S: st.S });
          const m = snapEls[sec.id]?.[n++];
          if (m) m.style.top = `${sy2 - top}px`;
        }
        y += h;
        if (i < sec.legs.length) {
          const L = (sec.legs[i] * vh) / 100;
          segs.push({ a: y, b: y + L, s0: st.S, s1: sec.stops[i + 1].S, ease: sec.ease?.[i] || 'io' });
          y += L;
        }
      });
    } else {
      const c = el.querySelector('[data-cover]') || el;
      const cr = c.getBoundingClientRect();
      const a = cr.top + sy;
      const b = Math.max(a + 1, cr.bottom + sy - vh);
      segs.push({ a, b, s0: sec.S[0], s1: sec.S[1], ease: 'lin' });
    }
  });
  segs.sort((p, q) => p.a - q.a);
  buildStations(vh);
  solids = [...document.querySelectorAll('[data-solid]')];
  windows = [...document.querySelectorAll('[data-window]')];
  blockGroups = [...document.querySelectorAll('[data-blocks]')].map((g) => ({
    key: g.dataset.blocks,
    el: g,
    items: [...g.querySelectorAll('[data-block]')]
  }));
}

export function storyAt(y) {
  let s = segs.length ? segs[0].s0 : 0;
  for (const g of segs) {
    if (y < g.a) break;
    if (y >= g.b) {
      s = g.s1;
      continue;
    }
    return g.s0 + (g.s1 - g.s0) * ease(g.ease, (y - g.a) / Math.max(1, g.b - g.a));
  }
  return s;
}

/** The scroll position where S first reaches `S` (approximately; used by debugging and captures). */
export function scrollForS(S) {
  for (const g of segs) {
    if (g.s1 === g.s0) {
      if (g.s0 === S) return (g.a + g.b) / 2;
      continue;
    }
    const lo = Math.min(g.s0, g.s1);
    const hi = Math.max(g.s0, g.s1);
    if (S >= lo && S <= hi) {
      let a = 0;
      let b = 1;
      for (let i = 0; i < 40; i++) {
        const m = (a + b) / 2;
        const v = g.s0 + (g.s1 - g.s0) * ease(g.ease, m);
        if (v < S) a = m;
        else b = m;
      }
      return g.a + (g.b - g.a) * a;
    }
  }
  return 0;
}

export function snapFor(beat) {
  return snaps.find((s) => s.beat === beat);
}
export function firstSnapOf(sectionId) {
  return snaps.find((s) => s.sec === sectionId);
}
export function sectionTop(sectionId) {
  return rects.find((r) => r.id === sectionId)?.top ?? 0;
}

/* ------------------------------------------------------------- chapters ----
 * Scrolling is the browser's own (wheel, trackpad, touch, keys, scrollbar all work), and the 3D
 * follows the scroll position continuously. Inside the 3D journey only, when scrolling pauses
 * between two chapter stops, the page glides on to the next stop in the direction the visitor was
 * going (or back, if they barely moved), so a few scroll movements play the whole journey and the
 * hotspots of a chapter are always in view when you stop. White pages scroll freely.
 */
let stations = [];
let zone = [0, 0]; // the part of the page where the glide applies
function buildStations(vh) {
  stations = [0, ...snaps.map((s) => Math.round(s.y))].sort((a, b) => a - b);
  zone = stations.length ? [stations[0], stations[stations.length - 1]] : [0, 0];
}

let anim = null;
let lastInput = -1e9;
let lastY = 0;
let lastMove = 0;
let dir = 1;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function tweenTo(y, minDur = 0) {
  const from = window.scrollY;
  const dist = Math.abs(y - from);
  if (dist < 2) return;
  const vh = window.innerHeight;
  // longer moves (the entrance) play a little slower, so the captions on the way can be read
  const dur = live.reduced ? 1 : Math.max(minDur, Math.min(3400, 650 + (dist / vh) * 640));
  anim = { from, to: y, t0: performance.now(), dur };
  live.tweening = true;
}
function stopAnim() {
  anim = null;
  live.tweening = false;
}
function stepAnim(now) {
  if (!anim) return;
  const t = Math.min(1, (now - anim.t0) / anim.dur);
  window.scrollTo(0, anim.from + (anim.to - anim.from) * easeInOut(t));
  lastY = window.scrollY;
  if (t >= 1) stopAnim();
}
function locked() {
  return document.documentElement.classList.contains('is-locked') || document.documentElement.classList.contains('is-locked-tour');
}
function userInput() {
  lastInput = performance.now();
  if (anim) stopAnim(); // the visitor takes over
}

/** Track the direction of travel, and glide to a chapter stop once scrolling has paused. */
function settle(now) {
  const y = window.scrollY;
  if (anim) return;
  if (Math.abs(y - lastY) > 0.5) {
    dir = y > lastY ? 1 : -1;
    lastY = y;
    lastMove = now;
    return;
  }
  if (now - lastMove < 170 || now - lastInput < 170 || locked() || live.hold) return;
  if (y <= zone[0] + 2 || y >= zone[1] - 2) return; // outside the journey: free scrolling
  if (stations.some((st) => Math.abs(st - y) < 3)) return;
  const below = stations.filter((st) => st < y).pop();
  const above = stations.find((st) => st > y);
  if (below === undefined || above === undefined) return;
  const f = (y - below) / Math.max(1, above - below);
  const target = dir > 0 ? (f > 0.08 ? above : below) : f < 0.92 ? below : above;
  tweenTo(target, 600);
}

/** One chapter forward or back (the scroll button, keyboard users who prefer it). */
export function step(d) {
  const y = window.scrollY;
  const t = d > 0 ? stations.find((st) => st > y + 3) : stations.filter((st) => st < y - 3).pop();
  if (t === undefined) return false;
  tweenTo(t);
  return true;
}

/** Go to a section: a short glide when it is near, a quick fade-cut when it is far (menu). */
export function goToSection(id, { smooth = true } = {}) {
  const sec = sectionById[id];
  const target = sec?.kind === 'stage' ? firstSnapOf(id)?.y ?? sectionTop(id) : sectionTop(id);
  const far = Math.abs(target - window.scrollY) > window.innerHeight * 4;
  if (!smooth || far || live.reduced) {
    const veil = document.querySelector('.veil');
    veil?.classList.add('is-on');
    setTimeout(
      () => {
        stopAnim();
        window.scrollTo({ top: target, behavior: 'instant' });
        lastY = target;
        live.snapNext = true;
        setTimeout(() => veil?.classList.remove('is-on'), 80);
      },
      veil ? 380 : 0
    );
  } else {
    tweenTo(target);
  }
}
export function goToY(y) {
  tweenTo(y);
}

function findWindow() {
  for (const el of windows) {
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < live.vh && r.width > 4) {
      const key = el.dataset.window;
      const g = ui.get().blocks;
      const block = g.startsWith(`${key}:`) ? Number(g.split(':')[1]) : 0;
      return { key, block, rect: r };
    }
  }
  return null;
}

function activeBlocks() {
  const mid = live.vh * 0.5;
  for (const g of blockGroups) {
    const r = g.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > live.vh) continue;
    let best = 0;
    let bestD = Infinity;
    g.items.forEach((it, i) => {
      const ir = it.getBoundingClientRect();
      const d = Math.abs(ir.top + ir.height / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return `${g.key}:${best}`;
  }
  return '';
}

let last = 0;
function tick(now) {
  stepAnim(now);
  settle(now);
  const dt = Math.min(0.1, (now - (last || now)) / 1000);
  last = now;
  live.dt = dt;
  live.time += dt;
  const y = window.scrollY;
  live.scrollY = y;
  live.St = storyAt(y);
  if (live.snapNext || live.reduced) {
    live.S = live.St;
    live.snapNext = false;
  } else {
    // damped: a notch of scrolling plays like a short film clip, and stops softly
    const k = live.tweening ? 6 : Math.abs(live.St - live.S) > 1.2 ? 2.6 : 3.2;
    live.S += (live.St - live.S) * (1 - Math.exp(-dt * k));
    if (Math.abs(live.St - live.S) < 1e-4) live.S = live.St;
  }

  // the section the scroll position is in; a white page counts once it covers half the screen
  let cur = rects[0];
  let ci = 0;
  rects.forEach((r, i) => {
    if (y + 1 >= r.top) {
      cur = r;
      ci = i;
    }
  });
  const nx = rects[ci + 1];
  if (nx && nx.sec.kind === 'page' && nx.top < y + live.vh * 0.5) cur = nx;
  let beat = null;
  if (cur?.sec.kind === 'stage') {
    for (const st of cur.sec.stops) if (st.beat && Math.abs(live.S - st.S) < 0.1) beat = st.beat;
  }
  const covered = solids.some((el) => {
    const r = el.getBoundingClientRect();
    return r.top <= 1 && r.bottom >= live.vh - 1;
  });
  const blocks = activeBlocks();
  live.win = findWindow();
  ui.set({
    set: live.S < CUT ? 'corridor' : 'model', // decided here so it is right even while the 3D is paused
    section: cur?.id ?? 'start',
    phase: cur?.sec.phase ?? 0,
    beat,
    covered: covered && !live.win,
    blocks
  });
  emitFrame();
  requestAnimationFrame(tick);
}

export function startScroll() {
  if (started) return;
  started = true;
  measure();
  live.S = live.St = storyAt(window.scrollY);
  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  window.addEventListener('resize', measure);
  for (const ev of ['wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown']) window.addEventListener(ev, userInput, { passive: true });
  window.addEventListener('pointermove', (e) => {
    live.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    live.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  });
  requestAnimationFrame(tick);
  if (import.meta.env.DEV || new URLSearchParams(location.search).has('debug')) {
    window.__v2 = {
      live,
      ui,
      measure,
      storyAt,
      scrollForS,
      snaps: () => snaps,
      stations: () => stations,
      step,
      goS(S) {
        live.hold = true; // debugging: stay exactly here, do not settle on a step
        window.scrollTo({ top: scrollForS(S), behavior: 'instant' });
        live.snapNext = true;
      },
      goBeat(b) {
        live.hold = false;
        const s = snapFor(b);
        if (s) window.scrollTo({ top: s.y, behavior: 'instant' });
        live.snapNext = true;
      }
    };
  }
}

export { clamp };
