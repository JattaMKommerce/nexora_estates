import { SECTIONS, sectionById } from './story.js';
import { live, ui, emitFrame } from './bus.js';

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

/** Scroll to a section. Far jumps (menu) cut through a quick fade instead of fast-forwarding the film. */
export function goToSection(id, { smooth = true } = {}) {
  const sec = sectionById[id];
  const target = sec?.kind === 'stage' ? firstSnapOf(id)?.y ?? sectionTop(id) : sectionTop(id);
  const far = Math.abs(target - window.scrollY) > window.innerHeight * 4;
  if (!smooth || far || live.reduced) {
    const veil = document.querySelector('.veil');
    veil?.classList.add('is-on');
    setTimeout(
      () => {
        window.scrollTo({ top: target, behavior: 'instant' });
        live.snapNext = true;
        setTimeout(() => veil?.classList.remove('is-on'), 80);
      },
      veil ? 380 : 0
    );
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
}
export function goToY(y) {
  window.scrollTo({ top: y, behavior: live.reduced ? 'instant' : 'smooth' });
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
    const k = Math.abs(live.St - live.S) > 1.2 ? 2.6 : 3.2;
    live.S += (live.St - live.S) * (1 - Math.exp(-dt * k));
    if (Math.abs(live.St - live.S) < 1e-4) live.S = live.St;
  }

  const c = y + live.vh * 0.25; // the section under the upper quarter of the screen
  let cur = rects[0];
  for (const r of rects) if (c >= r.top) cur = r;
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
    set: live.S < 2.93 ? 'corridor' : 'model', // decided here so it is right even while the 3D is paused
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
      goS(S) {
        window.scrollTo({ top: scrollForS(S), behavior: 'instant' });
        live.snapNext = true;
      },
      goBeat(b) {
        const s = snapFor(b);
        if (s) window.scrollTo({ top: s.y, behavior: 'instant' });
        live.snapNext = true;
      }
    };
  }
}

export { clamp };
