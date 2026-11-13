import { useSyncExternalStore } from 'react';

/**
 * Two kinds of shared state:
 * - `live`: values that change every frame (the story clock, the scroll position, the pointer). Read
 *   them in animation loops; they never trigger React renders.
 * - `ui`: values that change rarely (the active phase, the open board, the menu). Components
 *   subscribe with useUI(selector); the selector must return a primitive or a stable reference.
 */
export const live = {
  S: 0, // story clock, damped (what the 3D shows)
  St: 0, // story clock the scroll position asks for
  dt: 0.016,
  time: 0,
  vw: typeof window !== 'undefined' ? window.innerWidth : 1280,
  vh: typeof window !== 'undefined' ? window.innerHeight : 800,
  scrollY: 0,
  win: null, // a live window into the 3D on a white page: { key, block, rect }
  pointer: { x: 0, y: 0 },
  orbit: { yaw: 0 }, // drag-to-turn on the tour overview (radians, limited)
  snapNext: false, // set S = St on the next frame (jumps from the menu)
  reduced: typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
};

export function createStore(initial) {
  let state = initial;
  const subs = new Set();
  return {
    get: () => state,
    set(patch) {
      const next = typeof patch === 'function' ? patch(state) : patch;
      let changed = false;
      for (const k in next) {
        if (state[k] !== next[k]) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      state = { ...state, ...next };
      subs.forEach((f) => f());
    },
    subscribe(f) {
      subs.add(f);
      return () => subs.delete(f);
    }
  };
}

export const ui = createStore({
  progress: 0, // loading, 0–1
  ready: false, // everything loaded and compiled
  entered: false, // the visitor pressed "Enter site"
  section: 'start',
  phase: 0,
  beat: null,
  set: 'corridor', // which 3D set is on screen: 'corridor' | 'model'
  covered: false, // a solid white page covers the whole screen (the 3D can pause)
  menu: false,
  board: null, // open hotspot: { beat, index }
  contact: false,
  deep: null, // open deep-dive id
  tourLoc: null, // open tour location id
  blocks: '' // "key:index" of the active block on a white page with a live window
});

export function useUI(selector) {
  return useSyncExternalStore(ui.subscribe, () => selector(ui.get()));
}

const frameFns = new Set();
/** Run fn(live) every animation frame, after the story clock has been updated. */
export function onFrame(fn) {
  frameFns.add(fn);
  return () => frameFns.delete(fn);
}
export function emitFrame() {
  for (const f of frameFns) f(live);
}
