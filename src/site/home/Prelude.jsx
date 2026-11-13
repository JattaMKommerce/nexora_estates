import { useCallback, useEffect, useRef, useState } from 'react';
import { assetPath } from '../../lib/paths.js';
import { cls } from '../../lib/format.js';
import { usePrefersReducedMotion } from '../../lib/env.js';
import { FILM_CHAPTERS, filmBase, filmChapterAt } from '../../story/film.js';

/**
 * Section A of the home page. Two cards, the architect's drawing and the empty site, slide together
 * and open into one view; scrolling then plays a film rendered from the project's 3D model (see
 * src/story/film.js and scripts/render-section-a.mjs): the building rising, its homes fitted out
 * from the top floor down, the entrance and the climb up the facade, and the view from the top.
 *
 * The film is a sequence of still frames drawn on one canvas, chosen by the scroll position (so it
 * plays backwards just as smoothly) and cross-faded between neighbours. Frames load coarse to fine,
 * those nearest the visitor first. Without frames for this project the section isn't shown.
 *
 * onState('ready' | 'primed' | 'none'): the film is showing / its first pass of frames has loaded /
 * there is no film for this project.
 */

const MERGE = [0.025, 0.1]; // the cards slide together (fraction of the section's scroll)
const EXPAND = [0.095, 0.17]; // the merged card opens to the whole screen
const FILM = [0.165, 0.995]; // then the film plays
const LENGTH = { wide: 640, compact: 520 }; // pinned scroll distance, in viewport heights
const COMPACT = '(max-width: 760px)';
const PORTRAIT = '(max-aspect-ratio: 9/10)';
const CONCURRENCY = 6;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const span = (t, [a, z]) => clamp01((t - a) / (z - a));
const smooth = (t) => t * t * (3 - 2 * t);
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, k) => a + (b - a) * k;
const mq = (q) => typeof window !== 'undefined' && Boolean(window.matchMedia?.(q).matches);

export function Prelude({ slug, name, onState }) {
  const reduced = usePrefersReducedMotion();
  const container = useRef(null);
  const stageEl = useRef(null);
  const canvas = useRef(null);
  const film = useRef(null);
  const frameWrap = useRef(null);
  const shadow = useRef(null);
  const planCard = useRef(null);
  const [manifest, setManifest] = useState(null);
  const [state, setState] = useState('loading'); // loading | ready | none
  const [compact, setCompact] = useState(() => mq(COMPACT));
  const [portrait, setPortrait] = useState(() => mq(PORTRAIT));
  const [chapter, setChapter] = useState(FILM_CHAPTERS[0].id);
  const [phase, setPhase] = useState('cards'); // cards | film
  const [waiting, setWaiting] = useState(false);
  const report = useRef(onState);
  report.current = onState;

  // ---- the manifest (which frames exist, and the film time of each)
  useEffect(() => {
    if (!slug) return undefined;
    let gone = false;
    setState('loading');
    fetch(assetPath(`${filmBase(slug)}manifest.json`), { cache: 'no-cache' })
      .then((r) => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null))
      .catch(() => null)
      .then((m) => {
        if (gone) return;
        const ok = m && m.frames?.wide?.count && m.frames?.tall?.count;
        setManifest(ok ? m : null);
        setState(ok ? 'ready' : 'none');
      });
    return () => {
      gone = true;
    };
  }, [slug]);
  useEffect(() => {
    if (state !== 'loading') report.current?.(state);
  }, [state]);

  useEffect(() => {
    const a = window.matchMedia?.(COMPACT);
    const b = window.matchMedia?.(PORTRAIT);
    if (!a || !b) return undefined;
    const on = () => {
      setCompact(a.matches);
      setPortrait(b.matches);
    };
    a.addEventListener('change', on);
    b.addEventListener('change', on);
    return () => {
      a.removeEventListener('change', on);
      b.removeEventListener('change', on);
    };
  }, []);

  const variant = portrait ? 'tall' : 'wide';
  const set = manifest?.frames?.[variant] || null;
  const base = slug ? assetPath(filmBase(slug)) : '';
  const frameUrl = useCallback((i) => `${base}${variant}/${String(i).padStart(4, '0')}.webp`, [base, variant]);
  const drawing = manifest ? `${base}${manifest.drawing?.[compact ? 'wide' : 'tall']?.src || 'drawing-tall.webp'}` : null;

  // ---- frames: loaded coarse to fine, those nearest the visitor first
  const frames = useRef({ imgs: [], loaded: [], order: [], next: 0, busy: 0, want: 0, firstPass: 0, primed: false });
  const draw = useRef(() => {});
  useEffect(() => {
    if (!set) return undefined;
    const n = set.count;
    const F = { imgs: new Array(n), loaded: new Uint8Array(n), order: [], next: 0, busy: 0, want: 0, firstPass: 0, primed: false };
    const seen = new Set();
    for (const step of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < n; i += step) if (!seen.has(i)) (seen.add(i), F.order.push(i));
      if (step === 8) F.firstPass = F.order.length; // the first pass: one frame in eight
    }
    if (!seen.has(n - 1)) F.order.splice(1, 0, n - 1);
    frames.current = F;
    let done = 0;
    let gone = false;
    const pick = () => {
      // first the frames around where the visitor is, then the next in the coarse-to-fine order
      for (let d = 0; d <= 6; d++) {
        for (const i of [F.want + d, F.want - d]) if (i >= 0 && i < n && !F.imgs[i]) return i;
      }
      while (F.next < F.order.length && F.imgs[F.order[F.next]]) F.next += 1;
      return F.next < F.order.length ? F.order[F.next] : -1;
    };
    const pump = () => {
      while (!gone && F.busy < CONCURRENCY) {
        const i = pick();
        if (i < 0) return;
        const img = new Image();
        img.decoding = 'async';
        if (i === 0) img.fetchPriority = 'high';
        F.imgs[i] = img;
        F.busy += 1;
        img.onload = img.onerror = () => {
          F.busy -= 1;
          if (gone) return;
          if (img.naturalWidth) F.loaded[i] = 1;
          done += 1;
          if (!F.primed && F.order.slice(0, F.firstPass).every((k) => F.loaded[k] || (F.imgs[k] && F.imgs[k].complete))) {
            F.primed = true;
            report.current?.('primed');
          }
          draw.current();
          pump();
        };
        img.src = frameUrl(i);
      }
    };
    F.pump = pump;
    pump();
    return () => {
      gone = true;
      F.imgs.forEach((img) => img && (img.onload = img.onerror = null));
    };
  }, [set, frameUrl]);

  // ---- scroll → cards, film time and captions
  const view = useRef({ p: 0, t: 0, W: 0, H: 0, drawn: '', moving: false, idle: 0 });
  const layout = useCallback(() => {
    const el = container.current;
    const st = stageEl.current;
    if (!el || !st) return;
    const W = st.clientWidth;
    const H = st.clientHeight;
    const len = el.offsetHeight - st.offsetHeight;
    const p = len > 0 ? clamp01(-el.getBoundingClientRect().top / len) : 0;
    const v = view.current;
    v.p = p;
    v.W = W;
    v.H = H;

    // the two cards, side by side (stacked on phones), slide into one and open to the full screen
    const narrow = W <= 760;
    const gap = narrow ? 14 : 28;
    let cw;
    let ch;
    let left;
    let right;
    let centre;
    if (narrow) {
      cw = W - 40;
      ch = Math.min((H * 0.54 - gap) / 2, cw * 0.82);
      const top = H * 0.3;
      left = { x: 20, y: top, w: cw, h: ch };
      right = { x: 20, y: top + ch + gap, w: cw, h: ch };
      centre = { x: 20, y: top + (ch + gap) / 2, w: cw, h: ch };
    } else {
      cw = Math.min(W * 0.36, 560, (H * 0.64) / 1.14);
      ch = cw * 1.14;
      const y = H * 0.6 - ch / 2;
      left = { x: W / 2 - gap / 2 - cw, y, w: cw, h: ch };
      right = { x: W / 2 + gap / 2, y, w: cw, h: ch };
      centre = { x: W / 2 - cw / 2, y, w: cw, h: ch };
    }
    const m = smoother(span(p, MERGE));
    const e = smoother(span(p, EXPAND));
    const mix = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k) });
    const plan = mix(left, centre, m);
    const site = mix(mix(right, centre, m), { x: 0, y: 0, w: W, h: H }, e);
    const radius = lerp(narrow ? 14 : 20, 0, e);

    st.style.setProperty('--intro', String(1 - smooth(span(p, [0.012, 0.075]))));
    st.style.setProperty('--labels', String(1 - smooth(span(m, [0, 0.5]))));
    if (planCard.current) {
      planCard.current.style.transform = `translate3d(${plan.x}px, ${plan.y}px, 0)`;
      planCard.current.style.width = `${plan.w}px`;
      planCard.current.style.height = `${plan.h}px`;
      planCard.current.style.opacity = String(1 - smooth(span(m, [0.55, 1])));
    }
    if (film.current) {
      // the film always covers the screen; scaled into the card (cover) and clipped to it
      const s = Math.max(site.w / W, site.h / H);
      const cx = site.x + site.w / 2;
      const cy = site.y + site.h / 2;
      film.current.style.clipPath = `inset(${site.y}px ${W - site.x - site.w}px ${H - site.y - site.h}px ${site.x}px round ${radius}px)`;
      // a portrait frame in a wide card: show its upper part (the streets around the site), not
      // the middle of the plot
      const lift = narrow && H > W ? (1 - e) * 0.24 * H * s : 0;
      if (frameWrap.current) frameWrap.current.style.transform = `translate3d(${cx - W / 2}px, ${cy - H / 2 + lift}px, 0) scale(${s})`;
    }
    if (shadow.current) {
      shadow.current.style.transform = `translate3d(${site.x}px, ${site.y}px, 0)`;
      shadow.current.style.width = `${site.w}px`;
      shadow.current.style.height = `${site.h}px`;
      shadow.current.style.borderRadius = `${radius}px`;
      shadow.current.style.opacity = String(1 - e);
    }
    st.style.setProperty('--site-x', `${site.x}px`);
    st.style.setProperty('--site-y', `${site.y}px`);
    st.style.setProperty('--site-w', `${site.w}px`);

    // the film
    const t = span(p, FILM);
    v.t = t;
    setPhase(e >= 0.999 ? 'film' : 'cards');
    setChapter(filmChapterAt(t).id);
    st.style.setProperty('--film-t', String(t));
    for (const c of FILM_CHAPTERS) st.style.setProperty(`--ch-${c.id}`, String(span(t, [c.from, c.to])));
    draw.current();
  }, []);

  // draw the frame for the current film time, cross-fading to the next
  draw.current = () => {
    const cv = canvas.current;
    const F = frames.current;
    const v = view.current;
    if (!cv || !set || !F.imgs.length || !v.W) return;
    const times = set.times;
    const n = set.count;
    // film time → fractional frame index (frames are spaced unevenly; see the renderer)
    let lo = 0;
    let hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (times[mid] <= v.t) lo = mid;
      else hi = mid;
    }
    const f = lo + clamp01((v.t - times[lo]) / Math.max(1e-6, times[hi] - times[lo]));
    // while scrolling, a brief cross-fade between neighbouring frames keeps the motion smooth; at
    // rest the nearest frame is shown on its own, so a still picture is always crisp
    const i0 = v.moving ? Math.floor(f) : Math.round(f);
    F.want = Math.round(f);
    F.pump?.();
    const near = (i) => {
      for (let d = 0; d < n; d++) {
        if (i - d >= 0 && F.loaded[i - d]) return i - d;
        if (i + d < n && F.loaded[i + d]) return i + d;
      }
      return -1;
    };
    const a = near(i0);
    if (a < 0) return;
    // a brief cross-fade halfway between two frames: smooth when scrolling slowly, and a still
    // is almost always one crisp frame (a long blend would show as a double exposure)
    const b = v.moving && !reduced && i0 + 1 < n && F.loaded[i0 + 1] && a === i0 ? i0 + 1 : -1;
    const k = b >= 0 ? smooth(clamp01((f - i0 - 0.38) / 0.24)) : 0;
    setWaiting(Math.abs(a - f) > 6);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(v.W * dpr);
    const h = Math.round(v.H * dpr);
    const key = `${a}|${b}|${k.toFixed(3)}|${w}|${h}`;
    if (key === v.drawn) return;
    v.drawn = key;
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
    }
    const ctx = cv.getContext('2d');
    const paint = (img, alpha) => {
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };
    ctx.imageSmoothingQuality = 'high';
    paint(F.imgs[a], 1);
    if (b >= 0 && k > 0.004) paint(F.imgs[b], k);
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    if (state !== 'ready') return undefined;
    let raf = 0;
    const v = view.current;
    const on = () => {
      v.moving = true;
      clearTimeout(v.idle);
      v.idle = setTimeout(() => {
        v.moving = false;
        draw.current();
      }, 140);
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        layout();
      });
    };
    layout();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(v.idle);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [state, layout, set]);

  // the site header takes its light style while this section is under it
  useEffect(() => {
    if (state !== 'ready') return undefined;
    const root = document.documentElement;
    const on = () => {
      const el = container.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 60) root.dataset.head = 'light';
      else delete root.dataset.head;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => {
      window.removeEventListener('scroll', on);
      delete root.dataset.head;
    };
  }, [state]);

  const skip = useCallback(() => {
    const el = container.current;
    if (!el) return;
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().bottom - (stageEl.current?.offsetHeight || 0) + 2, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  if (state === 'none' || !slug) return null;
  const current = FILM_CHAPTERS.find((c) => c.id === chapter) || FILM_CHAPTERS[0];

  return (
    <section
      ref={container}
      className={cls('prelude', `is-${phase}`, compact && 'is-compact')}
      style={{ '--prelude-len': LENGTH[compact ? 'compact' : 'wide'] }}
      aria-labelledby="prelude-title"
    >
      <div ref={stageEl} className="prelude__stage">
        <header className="prelude__intro">
          {name && <p className="prelude__kicker">{name}</p>}
          <h2 id="prelude-title" className="prelude__title">
            From a drawing to a home
          </h2>
          <p className="prelude__lede">Scroll, and watch it built.</p>
        </header>

        <div ref={shadow} className="prelude__shadow" aria-hidden="true" />
        <div ref={film} className="prelude__film">
          <div ref={frameWrap} className="prelude__frame">
            {set && <img className="prelude__first" src={frameUrl(0)} alt="" fetchPriority="high" decoding="async" aria-hidden="true" />}
            <canvas ref={canvas} className="prelude__canvas" role="img" aria-label={`${current.title}: an illustrative view rendered from the 3D model`} />
          </div>
        </div>
        <span className="prelude__label prelude__label--site" aria-hidden="true">
          The site
        </span>
        <figure ref={planCard} className="prelude__plan" aria-label="The architect's drawing: front elevation and typical floor plan (illustrative)">
          {drawing && <img src={drawing} alt="" decoding="async" />}
          <figcaption className="prelude__label">The drawing</figcaption>
        </figure>

        <div className="prelude__cue" aria-hidden="true">
          <span>Scroll</span>
        </div>

        <div className="prelude__captions" aria-live="polite">
          {FILM_CHAPTERS.map((c, i) => (
            <div key={c.id} className={cls('prelude__caption', c.id === chapter && 'is-on')} aria-hidden={c.id !== chapter}>
              <p className="prelude__step">
                <span>{String(i + 1).padStart(2, '0')}</span> {c.kicker}
              </p>
              <h3 className="prelude__caption-title">{c.title}</h3>
              <p className="prelude__caption-text">{c.text}</p>
            </div>
          ))}
        </div>

        <nav className="prelude__progress" aria-label="Film chapters">
          <ol>
            {FILM_CHAPTERS.map((c) => (
              <li key={c.id} className={cls(c.id === chapter && 'is-on')}>
                <span className="prelude__bar">
                  <span style={{ transform: `scaleX(var(--ch-${c.id}, 0))` }} />
                </span>
                <span className="prelude__bar-label">{c.kicker}</span>
              </li>
            ))}
          </ol>
          <button type="button" className="prelude__skip" onClick={skip}>
            Skip<span className="prelude__skip-more"> to the 3D tour</span>
          </button>
        </nav>

        {waiting && <p className="prelude__wait">Loading the film…</p>}
        <p className="prelude__note">Illustrative visualisation rendered from the 3D model, not the project's construction schedule, finishes or surroundings.</p>
      </div>
    </section>
  );
}
