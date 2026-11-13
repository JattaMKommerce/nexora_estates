import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from '../../router.jsx';
import { propertyPath } from '../../routes.js';
import { mediaUrl } from '../../lib/paths.js';
import { cls } from '../../lib/format.js';
import { usePrefersReducedMotion } from '../../lib/env.js';
import { dataNotice, specLine, STAGE_LABEL } from '../labels.js';
import { IconArrow, IconExpand, IconPlay } from '../icons.jsx';
import { STYLES } from '../../interior/styleData.js';
import {
  AMENITY_VIEWS,
  CHAPTERS,
  CHAPTER_LABEL,
  OPENING_SEEN_KEY,
  STAGES,
  VIEWS,
  chapterAt,
  chapterStarts,
  floorStops,
  floorThirds,
  openingCue,
  pinnedVh,
  riseBuild,
  stageAt,
  stopsAt
} from '../../story/script.js';

const loadExperience = () => import('../../experience/ExperienceApp.jsx');
const ExperienceApp = lazy(loadExperience);

/** A failed download of the 3D code leaves the poster in place instead of breaking the page. */
class StageBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    this.props.onError?.(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const UNAVAILABLE = {
  'no-webgl': 'This browser can’t show 3D graphics, so a still image is shown instead.',
  failed: 'The 3D view couldn’t start on this device, so a still image is shown instead.',
  lost: 'The 3D view was interrupted by the browser. Reload the page to bring it back.',
  'data-error': 'This property’s details couldn’t be loaded, so it can’t be shown in 3D right now.',
  'no-towers': 'This property has no towers to show in 3D yet.'
};

const COMPACT_QUERY = '(max-width: 760px)';
const isCompact = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(COMPACT_QUERY).matches);
const seen = () => {
  try {
    return window.sessionStorage.getItem(OPENING_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};
const markSeen = () => {
  try {
    window.sessionStorage.setItem(OPENING_SEEN_KEY, '1');
  } catch {
    /* private mode: the opening simply plays again next time */
  }
};

const VIEW_TITLE = { facade: 'The facade', balconies: 'Balconies and fins', crown: 'The crown', arrival: 'Arrival' };
const STAGE_SHORT = { foundation: 'Foundations', podium: 'Podium', lower: 'Lower floors', middle: 'Middle floors', upper: 'Upper floors', crown: 'Crown', landscape: 'Grounds' };
const ROOM_ORDER = ['living', 'studio', 'kitchen', 'master', 'bedroom', 'balcony'];
// the cover over a swap between the building and an interior (ms): time for it to close (its CSS
// fade is 0.32 s), the least it stays closed once the scene has swapped, how long to wait for the
// scene to start loading the new view, and the most it stays closed whatever happens
const COVER_CLOSE = 360;
const SWAP_MIN_HOLD = 250;
const SWAP_NO_LOAD = 900;
const SWAP_MAX_HOLD = 3200;

/** Caption copy for each construction stage, from the property's own data where it has any. */
function riseCopy(project, stage) {
  const towers = project?.towers || [];
  const tallest = towers.reduce((a, t) => (!a || t.levels.length > a.levels.length ? t : a), null);
  const maxFloors = tallest?.levels.length || 0;
  const live = project && project.mode !== 'prototype';
  const thirds = floorThirds(Math.max(1, maxFloors));
  const range = (a, b) => {
    const from = tallest?.levels[a]?.number;
    const to = tallest?.levels[Math.max(a, b - 1)]?.number;
    return from === undefined ? null : from === to ? `Level ${from}` : `Levels ${from}–${to}`;
  };
  const homesIn = (a, b) => (live ? towers.reduce((n, t) => n + t.levels.slice(a, b).reduce((m, l) => m + l.units.length, 0), 0) : 0);
  const floorsCopy = (key, fallback) => {
    const [a, b] = thirds[key];
    const homes = homesIn(a, b);
    return {
      title: range(a, b) || fallback,
      text: homes
        ? `${homes} homes across these levels${towers.length > 1 ? ` of the ${towers.length} towers` : ''}.`
        : 'Each storey rises on the one below, its facade following close behind.'
    };
  };
  const lobby = towers.some((t) => t.hasLobby);
  const amenities = project?.marketing?.amenities || [];
  switch (stage) {
    case 'rewind':
      return { title: 'From the ground up', text: 'First, back to the empty site. Then every storey rises again, in sequence.' };
    case 'foundation':
      return { title: 'Foundations', text: 'Below ground, the foundations take the weight of every floor above.' };
    case 'podium':
      return { title: lobby ? 'The entrance' : 'The base', text: lobby ? 'The entrance lobby rises first, with its drop-off canopy.' : 'Homes begin at ground level.' };
    case 'lower':
      return floorsCopy('lower', 'The lower floors');
    case 'middle':
      return floorsCopy('middle', 'The middle floors');
    case 'upper':
      return floorsCopy('upper', 'The upper floors');
    case 'crown':
      return { title: 'The crown', text: 'The roof and its screen complete the silhouette.' };
    default:
      return { title: 'The grounds', text: amenities.length ? amenities.slice(0, 3).join(' · ') : 'Gardens and paving complete the site.' };
  }
}

/** The water or garden the amenities chapter looks at first, named as the property's data names it. */
function featureName(amenities) {
  const text = (amenities || []).join(' | ').toLowerCase();
  if (/lap pool|swimming pool|infinity pool/.test(text)) return 'The pool';
  if (/reflecting pool|water feature/.test(text)) return 'The reflecting pool';
  if (/garden/.test(text)) return 'The garden';
  return 'The grounds';
}

/**
 * The homepage story: one live 3D scene pinned while the page scrolls through its chapters (see
 * story/script.js). The building is the centre of every frame; the text sits around it.
 *   hero → construction (taken down, then built storey by storey) → architecture → floor by floor
 *   → inside a home → amenities; then the page continues (portfolio, enquiry).
 * The opening plays once per browser session. "Explore in 3D" opens the same scene full screen,
 * in context (that floor, that home), and Back returns to the same place in the story.
 */
export function Story({ properties, slug, onSlug, stage, loading, skipTo = '#portfolio', hold = false }) {
  const p = properties.find((x) => x.slug === slug) || null;
  const index = properties.findIndex((x) => x.slug === slug);
  const reduced = usePrefersReducedMotion();
  const [compact, setCompact] = useState(isCompact);
  const container = useRef(null);
  const stageEl = useRef(null);
  const [visible, setVisible] = useState(true);
  const [scene, setScene] = useState({ slug: null, status: 'loading' });
  const status = scene.slug === slug ? scene.status : 'loading';
  const ready = status === 'ready';
  const unavailable = UNAVAILABLE[status] || null;
  const [info, setInfo] = useState(null); // { project, featured } from the scene
  const proj = info && info.project.slug === slug ? info.project : null;
  const featured = proj ? info.featured : null;
  const { immersive, command, open, close } = stage;

  // what the page shows: React state changes only when a chapter, stage or stop changes
  const [chapter, setChapter] = useState('hero');
  const [overall, setOverall] = useState(0);
  const [riseStage, setRiseStage] = useState('rewind');
  const [level, setLevel] = useState(-1);
  const [stop, setStop] = useState(0);
  const [style, setStyle] = useState('warm');
  const [cue, setCue] = useState('poster'); // poster | name | tagline | specs | hero
  const [target, setTarget] = useState({ view: 'exterior', floor: null, room: null, style: 'warm' });
  const [fading, setFading] = useState(false);

  const story = useRef({
    scroll: { chapter: 'hero', progress: 0 },
    opening: { state: 'idle', variant: 'full', n: 0 },
    reduced,
    compact,
    offset: { x: 0, y: 0 }
  });

  // `hold`: another section is loading first (Section A's film); the 3D waits until it is released
  // or the visitor comes within a screen or so of the story, showing its poster meanwhile
  const [near, setNear] = useState(false);
  const sceneOn = !hold || near;
  useEffect(() => {
    if (sceneOn) return undefined;
    const el = container.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '150% 0px 150% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [sceneOn]);
  useEffect(() => {
    if (sceneOn) loadExperience().catch(() => {});
  }, [sceneOn]);

  useEffect(() => {
    const mq = window.matchMedia?.(COMPACT_QUERY);
    if (!mq) return undefined;
    const on = () => setCompact(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // keep the story's settings current (the scene reads them every frame); on phones the image is
  // raised a little so the building clears the caption sheet
  const setOffset = useCallback(() => {
    const s = story.current;
    s.offset = s.compact ? { x: 0, y: Math.round(window.innerHeight * 0.1) } : { x: 0, y: 0 };
  }, []);
  useLayoutEffect(() => {
    story.current.reduced = reduced;
    story.current.compact = compact;
    setOffset();
  }, [reduced, compact, setOffset]);
  useEffect(() => {
    window.addEventListener('resize', setOffset);
    return () => window.removeEventListener('resize', setOffset);
  }, [setOffset]);

  // rendering pauses while the story is scrolled out of view
  useEffect(() => {
    const el = container.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const towers = proj?.towers || [];
  const maxFloors = towers.length ? Math.max(1, ...towers.map((t) => t.levels.length)) : 20;
  const stops = useMemo(() => (featured ? floorStops(featured.levels.length, featured.floorIndex) : []), [featured]);
  const rooms = useMemo(() => {
    if (!featured) return [];
    const picked = [];
    for (const type of ROOM_ORDER) {
      const r = featured.rooms.find((x) => x.type === type && !picked.includes(x));
      if (r && !(type === 'bedroom' && picked.some((x) => x.type === 'master'))) picked.push(r);
    }
    return picked.slice(0, 4);
  }, [featured]);
  const steps = useMemo(() => [{ id: null, name: 'The whole home' }, ...rooms], [rooms]);

  const latest = useRef({});
  latest.current = { maxFloors, reduced, compact, stops, steps, style };

  // ---- the target view for the scene. A change between the building and an interior is applied
  // after a short pause (so a fast scroll straight through doesn't rebuild the scene back and forth)
  // and under a cover: the cover first closes completely, then the scene swaps (the heavy part:
  // the window view, textures and shaders of the new view), and the cover opens once the 3D scene
  // reports the new view ready (or after a time limit), so no stall is ever seen mid-fade. Floor
  // and room changes apply at once.
  const pendingTarget = useRef(null);
  const targetTimer = useRef(0);
  const swap = useRef(null); // { timers: [], since, busy } while the cover is closed for a swap
  const currentTarget = useRef(target);
  currentTarget.current = target;
  const endSwap = useCallback(() => {
    const s = swap.current;
    if (!s) return;
    s.timers.forEach(clearTimeout);
    swap.current = null;
    setFading(false);
  }, []);
  const liftCover = useCallback(() => {
    const s = swap.current;
    if (!s || !s.since) return;
    const wait = SWAP_MIN_HOLD - (performance.now() - s.since);
    if (wait > 0) s.timers.push(setTimeout(endSwap, wait));
    else endSwap();
  }, [endSwap]);
  const beginSwap = useCallback(
    (t) => {
      swap.current?.timers.forEach(clearTimeout);
      const s = { timers: [], since: 0, busy: false, target: t };
      swap.current = s;
      setFading(true);
      s.timers.push(
        setTimeout(() => {
          setTarget(s.target); // the latest position in the new view (scrolling continues meanwhile)
          s.since = performance.now();
          // the scene says when the new view is ready (onViewLoading); if it never starts loading
          // (nothing to swap) or takes too long, open the cover anyway
          s.timers.push(setTimeout(() => !s.busy && liftCover(), SWAP_NO_LOAD));
          s.timers.push(setTimeout(endSwap, SWAP_MAX_HOLD));
        }, COVER_CLOSE)
      );
    },
    [endSwap, liftCover]
  );
  const onViewLoading = useCallback(
    (busy) => {
      const s = swap.current;
      if (!s || !s.since) return;
      if (busy) s.busy = true;
      else if (s.busy) liftCover();
    },
    [liftCover]
  );
  const requestTarget = useCallback(
    (t) => {
      // during a swap, compare with where the swap is going, not with what is still on screen
      const s = swap.current;
      const cur = s ? s.target : currentTarget.current;
      const same = cur.view === t.view && cur.floor === t.floor && cur.room === t.room && cur.style === t.style;
      if (same || cur.view === t.view) {
        clearTimeout(targetTimer.current);
        pendingTarget.current = null;
        if (!same) {
          if (s) s.target = t;
          if (!s || s.since) setTarget(t); // (before the swap applies, it takes s.target)
        }
        return;
      }
      const key = `${t.view}|${t.floor}|${t.room}|${t.style}`;
      if (pendingTarget.current === key) return;
      pendingTarget.current = key;
      clearTimeout(targetTimer.current);
      targetTimer.current = setTimeout(() => {
        pendingTarget.current = null;
        beginSwap(t);
      }, 260);
    },
    [beginSwap]
  );
  useEffect(
    () => () => {
      clearTimeout(targetTimer.current);
      swap.current?.timers.forEach(clearTimeout);
    },
    []
  );

  // ---- scroll → chapter and progress, measured in pixels (phones' changing viewport heights and
  // the CSS's svh units can't put the page and the scene out of step)
  const measure = useCallback(() => {
    const el = container.current;
    const st = stageEl.current;
    if (!el || !st) return;
    const s = story.current;
    const L = latest.current;
    const len = el.offsetHeight - st.offsetHeight;
    const into = -el.getBoundingClientRect().top;
    const f = len > 0 ? Math.max(0, into / len) : 0;
    const c = chapterAt(f, L.compact);
    s.scroll = c;
    setChapter(c.chapter);
    setOverall(Math.min(1, f));
    let t = { view: 'exterior', floor: null, room: null, style: L.style };
    if (c.chapter === 'rise') {
      const r = riseBuild(c.progress, L.reduced);
      const stg = r.rewinding && !L.reduced ? { stage: 'rewind', level: -1 } : stageAt(r.b, L.maxFloors);
      setRiseStage(stg.stage);
      setLevel(stg.level);
    } else if (c.chapter === 'architecture') {
      setStop(stopsAt(c.progress, VIEWS.length).index);
    } else if (c.chapter === 'floors') {
      const k = stopsAt(c.progress, Math.max(1, L.stops.length)).index;
      setStop(k);
      t = { ...t, floor: L.stops.length ? L.stops[k] : null };
    } else if (c.chapter === 'inside') {
      const k = stopsAt(c.progress, L.steps.length).index;
      setStop(k);
      t = { view: 'interior', floor: null, room: L.steps[k]?.id ?? null, style: L.style };
    } else if (c.chapter === 'amenities' || c.chapter === 'after') {
      setStop(stopsAt(c.chapter === 'after' ? 1 : c.progress, AMENITY_VIEWS.length).index);
    }
    requestTarget(t);
    // scrolling during the opening skips it
    if (into > 40 && s.opening.state === 'play') {
      s.opening.state = 'done';
      markSeen();
      setCue('hero');
    }
    if (into > 40 && s.opening.state === 'idle') s.opening.state = 'done';
  }, [requestTarget]);
  useEffect(() => {
    let frame = 0;
    const on = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [measure, compact, stops, steps]);

  // a new interior style applies straight away
  useEffect(() => {
    if (target.view === 'interior' && target.style !== style) setTarget((t) => ({ ...t, style }));
  }, [style, target.view, target.style]);

  // ---- the opening: plays once the scene is ready, at the top of the page
  const playOpening = useCallback((variant) => {
    const s = story.current;
    s.opening = { state: 'play', variant, n: s.opening.n + 1 };
    setCue(variant === 'full' ? 'name' : 'hero');
  }, []);
  useEffect(() => {
    if (!ready) return;
    const s = story.current;
    if (reduced) {
      s.opening.state = 'none';
      setCue('hero');
      return;
    }
    if (s.opening.state !== 'idle') return;
    // (only when the story is the top of what is on screen: below Section A it starts on its hero)
    const atTop = container.current ? Math.abs(container.current.getBoundingClientRect().top) < 4 : true;
    if (!atTop) {
      s.opening.state = 'done';
      setCue('hero');
      return;
    }
    playOpening(seen() ? 'short' : 'full');
  }, [ready, reduced, playOpening]);

  // a different property starts its story again (with the short opening)
  useEffect(() => {
    const s = story.current;
    s.opening = { state: 'idle', variant: 'short', n: s.opening.n };
    setCue('poster');
  }, [slug]);

  const clockRef = useRef({ t0: 0, variant: 'full', timer: 0 });
  const onStoryEvent = useCallback((e) => {
    const c = clockRef.current;
    if (e.type === 'opening-start') {
      clearInterval(c.timer);
      c.t0 = performance.now();
      c.variant = e.variant;
      if (e.variant === 'full') c.timer = setInterval(() => setCue(openingCue((performance.now() - c.t0) / 1000, c.variant)), 120);
    } else if (e.type === 'opening-end') {
      clearInterval(c.timer);
      markSeen();
      setCue('hero');
    }
  }, []);
  useEffect(() => () => clearInterval(clockRef.current.timer), []);

  const skip = useCallback(() => {
    const s = story.current;
    if (s.opening.state === 'play') s.opening.state = 'done';
    clearInterval(clockRef.current.timer);
    markSeen();
    setCue('hero');
  }, []);
  const replay = useCallback(() => {
    const el = container.current;
    window.scrollTo({ top: el ? window.scrollY + el.getBoundingClientRect().top : 0, behavior: 'auto' });
    playOpening('full');
  }, [playOpening]);

  // ---- navigation: jump to a chapter, or past the story
  const goTo = useCallback(
    (key) => {
      const el = container.current;
      const st = stageEl.current;
      if (!el || !st) return;
      const top = window.scrollY + el.getBoundingClientRect().top;
      const len = el.offsetHeight - st.offsetHeight;
      const starts = chapterStarts(latest.current.compact);
      const lead = key === 'hero' ? 0 : 0.012; // a little into the chapter, where its first view is settled
      window.scrollTo({ top: top + len * Math.min(1, starts[key] + lead), behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced]
  );
  const skipStory = useCallback(() => {
    const el = document.querySelector(skipTo);
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [skipTo, reduced]);

  // ---- the scene
  useEffect(() => {
    if (unavailable && immersive) close();
  }, [unavailable, immersive, close]);
  const onStatus = useCallback((st) => setScene({ slug, status: st }), [slug]);
  const onImmersive = useCallback((on) => (on ? open() : close()), [open, close]);
  const onProject = useCallback((project, feat) => setInfo({ project, featured: feat }), []);
  const embed = useMemo(
    () => ({ immersive, onImmersive, command, active: visible, onStatus, story, onStoryEvent, onProject, onViewLoading, storyTarget: target }),
    [immersive, onImmersive, command, visible, onStatus, onStoryEvent, onProject, onViewLoading, target]
  );

  // ---- copy
  const poster = mediaUrl(p?.poster);
  const posterMobile = mediaUrl(p?.posterMobile);
  const notice = dataNotice(p);
  const specs = specLine(p);
  const stageLabel = p?.stage ? STAGE_LABEL[p.stage] : null;
  const openingOn = ['name', 'tagline', 'specs'].includes(cue) && chapter === 'hero';
  const heroOn = chapter === 'hero' && !openingOn;
  const rise = riseCopy(proj, riseStage);
  const stageIndex = STAGES.indexOf(riseStage);
  const tallest = towers.reduce((a, t) => (!a || t.levels.length > a.levels.length ? t : a), null);
  const levelLabel = level >= 0 && tallest?.levels[level] ? tallest.levels[level].number : null;
  const archStop = Math.min(stop, VIEWS.length - 1);
  const highlight = p?.highlights?.[archStop] || proj?.marketing?.highlights?.[archStop] || null;
  const floorIndex = chapter === 'floors' && stops.length ? stops[Math.min(stop, stops.length - 1)] : null;
  const floorInfo = floorIndex !== null && featured ? featured.levels[floorIndex] : null;
  const live = Boolean(proj && proj.mode !== 'prototype');
  const step = steps[Math.min(stop, steps.length - 1)] || steps[0];
  const unit = featured?.unit || null;
  const amenities = proj?.marketing?.amenities || [];
  const disabled = Boolean(unavailable) || !slug;
  const storyOn = !unavailable;
  const n2 = (v) => String(v).padStart(2, '0');

  return (
    <section
      ref={container}
      id="story"
      className={cls('story tone-night', immersive && 'is-immersive', ready && 'is-ready', compact && 'is-compact', `at-${chapter}`, fading && 'is-fading')}
      style={{ '--story-vh': storyOn ? pinnedVh(compact) : 0 }}
      aria-labelledby="story-title"
    >
      <div ref={stageEl} className="story__stage">
        <div className="story__scene">
          {slug && !unavailable && sceneOn && (
            <StageBoundary key={slug} onError={() => setScene({ slug, status: 'failed' })}>
              <Suspense fallback={null}>
                <ExperienceApp key={slug} slug={slug} embed={embed} />
              </Suspense>
            </StageBoundary>
          )}
          <div className={cls('story__poster', ready && 'is-hidden')} aria-hidden="true">
            {poster && (
              <picture key={poster}>
                {posterMobile && <source media={COMPACT_QUERY} srcSet={posterMobile} />}
                <img src={poster} alt="" decoding="async" fetchPriority="high" />
              </picture>
            )}
            {!ready && !unavailable && (
              <span className="story__loading">
                <span className="story__loading-line" />
                Preparing the 3D view
              </span>
            )}
          </div>
          <div className="story__fade" aria-hidden="true" />
        </div>

        <div className={cls('story__shade', `shade-${chapter}`, openingOn && 'shade-opening')} aria-hidden="true" />

        {/* ---- opening titles */}
        <div className={cls('story__opening', openingOn && 'is-on')} inert={!openingOn}>
          <p className="kicker">
            Featured development
            {properties.length > 1 && index >= 0 && <span className="story__count"> · {n2(index + 1)} / {n2(properties.length)}</span>}
          </p>
          <p className="story__cinema" key={cue}>
            {cue === 'tagline' ? p?.tagline || p?.name : cue === 'specs' ? [stageLabel, ...specs].filter(Boolean).join('  ·  ') : p?.name}
          </p>
        </div>
        <div className={cls('story__opening-actions', openingOn && 'is-on')} inert={!openingOn}>
          <button
            type="button"
            className="button button--primary"
            onClick={() => {
              skip(); // returning from full screen lands on the hero, not mid-opening
              open('explore', slug);
            }}
            disabled={disabled}
          >
            <IconExpand />
            Explore property
          </button>
          <button type="button" className="story__skip" onClick={skip}>
            Skip intro
          </button>
        </div>

        {/* ---- hero: the residence, centred, with the text either side */}
        <div className={cls('story__panel story__hero', heroOn && 'is-on')} inert={!heroOn}>
          <div className="story__hero-copy">
            <p className="kicker">
              {p ? 'Featured development' : 'Immersive 3D property experiences'}
              {properties.length > 1 && index >= 0 && <span className="story__count"> · {n2(index + 1)} / {n2(properties.length)}</span>}
            </p>
            <h2 id="story-title" className="story__title">
              {p ? p.name : loading ? ' ' : 'Explore homes in 3D'}
            </h2>
            {p?.tagline && <p className="story__lede">{p.tagline}</p>}
            {p && (
              <p className="story__specs">
                {[stageLabel, ...specs].filter(Boolean).map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </p>
            )}
            <div className="actions story__actions">
              <button type="button" className="button button--primary" onClick={() => open('explore', slug)} disabled={disabled}>
                <IconExpand />
                Explore in 3D
              </button>
              <button type="button" className="button" onClick={() => open('tour', slug)} disabled={disabled}>
                <IconPlay />
                Guided tour
              </button>
            </div>
            <p className="story__note">
              {unavailable ? <strong>{unavailable}</strong> : null}
              {notice && <span className="story__notice">{notice}</span>}
              {p && (
                <Link className="story__replay" to={propertyPath(p.slug)}>
                  Property page
                </Link>
              )}
              {ready && !reduced && (
                <button type="button" className="story__replay" onClick={replay}>
                  Replay the intro
                </button>
              )}
            </p>
          </div>
          {properties.length > 1 && (
            <nav className="story__switch" aria-label="Featured properties">
              {properties.map((x, i) => (
                <button key={x.slug} type="button" aria-pressed={x.slug === slug} onClick={() => x.slug !== slug && onSlug(x.slug)}>
                  <span className="story__switch-n">{n2(i + 1)}</span>
                  <span className="story__switch-name">{x.name}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
        {storyOn && (
          <button type="button" className={cls('story__cue', heroOn && cue !== 'poster' && 'is-on')} onClick={() => goTo('rise')} tabIndex={heroOn ? 0 : -1}>
            <span>{reduced ? 'Scroll to explore, stage by stage' : 'Scroll to explore'}</span>
            <span className="story__cue-line" aria-hidden="true" />
          </button>
        )}

        {/* ---- construction */}
        <div className={cls('story__panel story__caption', chapter === 'rise' && 'is-on')} inert={chapter !== 'rise'}>
          <p className="kicker">Construction · illustrative sequence</p>
          <h3 className="story__stage-title" key={riseStage + rise.title}>
            {rise.title}
          </h3>
          <p className="story__stage-text">{rise.text}</p>
          {levelLabel !== null && ['lower', 'middle', 'upper'].includes(riseStage) && (
            <p className="story__counter">
              <span className="story__counter-n">{levelLabel}</span>
              <span className="story__counter-of">level of {tallest.levels[tallest.levels.length - 1].number}</span>
            </p>
          )}
          <ol className="story__steps" aria-label="Construction stages">
            {STAGES.map((st, i) => (
              <li key={st} className={cls(i < stageIndex && 'is-done', i === stageIndex && 'is-now')}>
                {STAGE_SHORT[st]}
              </li>
            ))}
          </ol>
        </div>

        {/* ---- architecture */}
        <div className={cls('story__panel story__caption', chapter === 'architecture' && 'is-on')} inert={chapter !== 'architecture'}>
          <p className="kicker">
            Architecture · illustrative design <span className="story__count">· {n2(archStop + 1)} / {n2(VIEWS.length)}</span>
          </p>
          <h3 className="story__stage-title" key={`a${archStop}`}>
            {VIEW_TITLE[VIEWS[archStop]]}
          </h3>
          {highlight && (
            <p className="story__highlight">
              <span className="story__highlight-label">Project highlight</span>
              {highlight}
            </p>
          )}
          <button type="button" className="button story__explore" onClick={() => open('explore', slug)} disabled={disabled}>
            <IconExpand />
            Explore in 3D
          </button>
        </div>

        {/* ---- floor by floor */}
        <div className={cls('story__panel story__caption', chapter === 'floors' && 'is-on')} inert={chapter !== 'floors'}>
          <p className="kicker">
            Floor by floor{stops.length > 1 && <span className="story__count"> · {n2(Math.min(stop, stops.length - 1) + 1)} / {n2(stops.length)}</span>}
          </p>
          <h3 className="story__stage-title" key={`f${floorIndex}`}>
            {floorInfo ? `Level ${floorInfo.number}` : 'Every floor, opened'}
          </h3>
          <p className="story__stage-text">
            {floorInfo
              ? live && floorInfo.counts
                ? `${floorInfo.counts.available} of ${floorInfo.counts.total} homes available on this level.`
                : `${floorInfo.units} homes on this level. Layouts are illustrative.`
              : 'The floors above lift away to show each level’s homes, coloured by availability.'}
          </p>
          {live && (
            <p className="story__legend" aria-hidden="true">
              <span className="is-available">Available</span>
              <span className="is-hold">On hold</span>
              <span className="is-booked">Booked</span>
            </p>
          )}
          <button
            type="button"
            className="button story__explore"
            onClick={() => open('floor', slug, floorIndex !== null ? { floor: floorIndex } : null)}
            disabled={disabled}
          >
            <IconExpand />
            Explore this floor
          </button>
        </div>

        {/* ---- inside */}
        <div className={cls('story__panel story__caption', chapter === 'inside' && 'is-on')} inert={chapter !== 'inside'}>
          <p className="kicker">
            Inside{steps.length > 1 && <span className="story__count"> · {n2(Math.min(stop, steps.length - 1) + 1)} / {n2(steps.length)}</span>}
          </p>
          <h3 className="story__stage-title" key={`i${stop}`}>
            {step?.name || 'The whole home'}
          </h3>
          <p className="story__stage-text">
            {[
              unit?.number ? `Home ${unit.number}` : null,
              unit?.typeLabel || (featured?.bedrooms ? `${featured.bedrooms} BHK` : null),
              featured && featured.floorIndex !== null && featured.levels[featured.floorIndex] ? `Level ${featured.levels[featured.floorIndex].number}` : null
            ]
              .filter(Boolean)
              .join(' · ') || 'One home, room by room.'}
          </p>
          <div className="story__styles" role="group" aria-label="Interior style">
            {STYLES.map((x) => (
              <button key={x.id} type="button" aria-pressed={style === x.id} onClick={() => setStyle(x.id)}>
                <span className="story__swatch" aria-hidden="true">
                  {x.swatch.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
                {x.name}
              </button>
            ))}
          </div>
          <p className="story__fine">Illustrative interior: the layout, furniture and finishes are a styling suggestion.</p>
          <button type="button" className="button story__explore" onClick={() => open('interior', slug)} disabled={disabled}>
            <IconExpand />
            Explore this home
          </button>
        </div>

        {/* ---- amenities */}
        <div
          className={cls('story__panel story__caption story__amenities', (chapter === 'amenities' || chapter === 'after') && 'is-on')}
          inert={chapter !== 'amenities' && chapter !== 'after'}
        >
          <p className="kicker">Amenities &amp; lifestyle</p>
          <h3 className="story__stage-title" key={`m${stop}`}>
            {stop === 0 ? featureName(amenities) : 'The grounds'}
          </h3>
          {amenities.length ? (
            <ul className="story__amenity-list">
              {amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          ) : (
            <p className="story__stage-text">This project hasn’t listed its amenities yet.</p>
          )}
          <p className="story__fine">Amenities as listed by the project. The 3D landscape is illustrative.</p>
        </div>

        {/* ---- chapter navigation: always a way forward, back, or out */}
        {storyOn && (
          <nav className={cls('story__rail', !openingOn && chapter !== 'after' && 'is-on')} aria-label="Story chapters">
            <ol>
              {CHAPTERS.map((k) => (
                <li key={k}>
                  <button type="button" aria-current={chapter === k ? 'step' : undefined} onClick={() => goTo(k)}>
                    <span className="story__rail-dot" aria-hidden="true" />
                    <span className="story__rail-label">{CHAPTER_LABEL[k]}</span>
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" className="story__rail-skip" onClick={skipStory}>
              Skip to properties <IconArrow />
            </button>
            <span className="story__rail-progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${overall})` }} />
            </span>
          </nav>
        )}
      </div>
    </section>
  );
}
