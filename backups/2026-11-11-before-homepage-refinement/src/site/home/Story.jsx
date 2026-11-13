import { Component, lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from '../../router.jsx';
import { propertyPath } from '../../routes.js';
import { mediaUrl } from '../../lib/paths.js';
import { cls } from '../../lib/format.js';
import { usePrefersReducedMotion } from '../../lib/env.js';
import { dataNotice, specLine, STAGE_LABEL } from '../labels.js';
import { IconArrow, IconExpand, IconPlay } from '../icons.jsx';
import {
  OPENING_SEEN_KEY,
  STAGES,
  VIEWS,
  chapterAt,
  floorThirds,
  openingCue,
  pinnedVh,
  stageAt,
  buildFor,
  viewAt
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
const isCompact = () => typeof window !== 'undefined' && window.matchMedia?.(COMPACT_QUERY).matches;
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

const VIEW_TITLE = { facade: 'The facade', balconies: 'Balconies and fins', crown: 'The crown', arrival: 'Arrival', setting: 'The setting' };

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
      text: homes ? `${homes} homes across these levels${towers.length > 1 ? ` of the ${towers.length} towers` : ''}.` : 'Each storey rises on the one below, its facade following close behind.'
    };
  };
  const lobby = towers.some((t) => t.hasLobby);
  const amenities = project?.marketing?.amenities || [];
  switch (stage) {
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

const STAGE_SHORT = { foundation: 'Foundations', podium: 'Podium', lower: 'Lower', middle: 'Middle', upper: 'Upper', crown: 'Crown', landscape: 'Grounds' };

/**
 * The homepage story: one live 3D scene pinned while the page scrolls past three chapters.
 *   intro          an opening flight over the finished development (once per browser session), which
 *                  then takes the building down to its foundations: "Scroll to watch it rise"
 *   rise           scrolling builds it storey by storey (and scrolling back takes it down again)
 *   architecture   the camera visits the finished building, view by view
 * "Explore in 3D" opens the same scene full screen with every control; Back returns here.
 * Stage 6 replaces the live opening with a pre-rendered film that hands over on the same frame.
 */
export function Story({ properties, slug, onSlug, stage, loading }) {
  const p = properties.find((x) => x.slug === slug) || null;
  const index = properties.findIndex((x) => x.slug === slug);
  const reduced = usePrefersReducedMotion();
  const [compact, setCompact] = useState(isCompact);
  const container = useRef(null);
  const [visible, setVisible] = useState(true);
  const [scene, setScene] = useState({ slug: null, status: 'loading' });
  const status = scene.slug === slug ? scene.status : 'loading';
  const ready = status === 'ready';
  const unavailable = UNAVAILABLE[status] || null;
  const [project, setProject] = useState(null);
  const proj = project && project.slug === slug ? project : null;
  const { immersive, command, open, close } = stage;

  // what the page shows (React state changes only when the chapter, stage or view changes)
  const [chapter, setChapter] = useState('intro');
  const [riseStage, setRiseStage] = useState('foundation');
  const [level, setLevel] = useState(-1);
  const [view, setView] = useState(0);
  const [cue, setCue] = useState('poster'); // poster | name | tagline | specs | rewind | end | still

  const story = useRef({
    scroll: { chapter: 'intro', progress: 0 },
    opening: { state: 'idle', variant: 'full', n: 0 },
    reduced,
    compact,
    offset: { x: 0, y: 0 }
  });

  useEffect(() => {
    loadExperience().catch(() => {});
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.(COMPACT_QUERY);
    if (!mq) return undefined;
    const on = () => setCompact(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // keep the story's settings current (the scene reads them every frame)
  useLayoutEffect(() => {
    const s = story.current;
    s.reduced = reduced;
    s.compact = compact;
    const w = window.innerWidth;
    const h = window.innerHeight;
    s.offset = compact ? { x: 0, y: Math.round(h * 0.11) } : { x: Math.round(Math.min(300, w * 0.16)), y: -Math.round(h * 0.02) };
  }, [reduced, compact]);
  useEffect(() => {
    const onResize = () => {
      const s = story.current;
      s.offset = s.compact ? { x: 0, y: Math.round(window.innerHeight * 0.11) } : { x: Math.round(Math.min(300, window.innerWidth * 0.16)), y: -Math.round(window.innerHeight * 0.02) };
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // rendering pauses while the story is scrolled out of view
  useEffect(() => {
    const el = container.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const maxFloors = useMemo(() => (proj ? Math.max(1, ...proj.towers.map((t) => t.levels.length)) : 20), [proj]);
  const latest = useRef({});
  latest.current = { maxFloors, reduced, compact };

  // ---- scroll → chapter, progress (written for the scene every scroll; React state only on change)
  const measure = useCallback(() => {
    const el = container.current;
    if (!el) return;
    const s = story.current;
    // distance scrolled into the story, in vh (hundredths of the viewport's height)
    const into = (-el.getBoundingClientRect().top / (window.innerHeight || 1)) * 100;
    const c = chapterAt(Math.max(0, into), latest.current.compact);
    s.scroll = c;
    setChapter(c.chapter);
    if (c.chapter === 'rise' || c.chapter === 'intro') {
      const b = buildFor(c.chapter, c.progress, { openingDone: true, reduced: latest.current.reduced });
      const st = c.chapter === 'intro' ? { stage: 'foundation', level: -1 } : stageAt(b, latest.current.maxFloors);
      setRiseStage(st.stage);
      setLevel(st.level);
    }
    if (c.chapter === 'architecture' || c.chapter === 'after') setView(viewAt(c.chapter === 'after' ? 1 : c.progress).index);
    // scrolling during the opening skips it
    if (into > 6 && s.opening.state === 'play') {
      s.opening.state = 'done';
      markSeen();
      setCue('end');
    }
    if (into > 6 && s.opening.state === 'idle') s.opening.state = 'done';
  }, []);
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
  }, [measure, compact]);

  // ---- the opening: plays once the scene is ready, at the top of the page
  const playOpening = useCallback((variant) => {
    const s = story.current;
    s.opening = { state: 'play', variant, n: s.opening.n + 1 };
    setCue('name');
  }, []);
  useEffect(() => {
    if (!ready) return;
    const s = story.current;
    if (reduced) {
      s.opening.state = 'none';
      setCue('still');
      return;
    }
    if (s.opening.state !== 'idle') return;
    const top = container.current ? -container.current.getBoundingClientRect().top < 4 : true;
    if (!top) {
      s.opening.state = 'done';
      setCue('end');
      return;
    }
    playOpening(seen() ? 'short' : 'full');
  }, [ready, reduced, playOpening]);

  // when the property changes, its story starts over (the short opening)
  useEffect(() => {
    const s = story.current;
    s.opening = { state: 'idle', variant: 'short', n: s.opening.n };
    setCue('poster');
    setProject(null);
  }, [slug]);

  const clockRef = useRef({ t0: 0, variant: 'full', timer: 0 });
  const onStoryEvent = useCallback((e) => {
    if (e.type === 'opening-start') {
      const c = clockRef.current;
      clearInterval(c.timer);
      c.t0 = performance.now();
      c.variant = e.variant;
      c.timer = setInterval(() => setCue(openingCue((performance.now() - c.t0) / 1000, c.variant)), 120);
    } else if (e.type === 'opening-end') {
      clearInterval(clockRef.current.timer);
      markSeen();
      setCue('end');
    }
  }, []);
  useEffect(() => () => clearInterval(clockRef.current.timer), []);

  const skip = useCallback(() => {
    const s = story.current;
    if (s.opening.state === 'play') s.opening.state = 'done';
    clearInterval(clockRef.current.timer);
    markSeen();
    setCue('end');
  }, []);
  const replay = useCallback(() => {
    window.scrollTo({ top: container.current ? window.scrollY + container.current.getBoundingClientRect().top : 0, behavior: 'auto' });
    playOpening('full');
  }, [playOpening]);
  const scrollToRise = useCallback(() => {
    const el = container.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    window.scrollTo({ top: top + window.innerHeight * 0.9, behavior: reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  // ---- the scene
  useEffect(() => {
    if (unavailable && immersive) close();
  }, [unavailable, immersive, close]);
  const onStatus = useCallback((st) => setScene({ slug, status: st }), [slug]);
  const onImmersive = useCallback((on) => (on ? open() : close()), [open, close]);
  const onProject = useCallback((pr) => setProject(pr), []);
  const embed = useMemo(
    () => ({ immersive, onImmersive, command, active: visible, onStatus, story, onStoryEvent, onProject }),
    [immersive, onImmersive, command, visible, onStatus, onStoryEvent, onProject]
  );

  const poster = mediaUrl(p?.poster);
  const posterMobile = mediaUrl(p?.posterMobile);
  const notice = dataNotice(p);
  const specs = specLine(p);
  const openingOn = ['name', 'tagline', 'specs', 'rewind'].includes(cue) && chapter === 'intro';
  const introOn = chapter === 'intro' && !openingOn;
  const rise = riseCopy(proj, riseStage);
  const stageIndex = STAGES.indexOf(riseStage);
  const tallest = proj?.towers.reduce((a, t) => (!a || t.levels.length > a.levels.length ? t : a), null);
  const levelLabel = level >= 0 && tallest?.levels[level] ? tallest.levels[level].number : null;
  const viewKey = VIEWS[view];
  const highlight = p?.highlights?.[view] || proj?.marketing?.highlights?.[view] || null;
  const fallbackHeight = unavailable ? '100svh' : undefined;

  return (
    <section
      ref={container}
      className={cls('story tone-night', immersive && 'is-immersive', ready && 'is-ready', compact && 'is-compact', `at-${chapter}`)}
      style={{ '--story-vh': pinnedVh(compact), height: fallbackHeight }}
      aria-labelledby="story-title"
    >
      <div className="story__stage">
        <div className="story__scene">
          {slug && !unavailable && (
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
        </div>

        <div className={cls('story__shade', `shade-${chapter}`, openingOn && 'shade-opening')} aria-hidden="true" />

        {/* ---- opening titles */}
        <div className={cls('story__opening', openingOn && 'is-on')} inert={!openingOn}>
          <p className="kicker">
            Featured development
            {properties.length > 1 && index >= 0 && <span className="story__count"> · {String(index + 1).padStart(2, '0')} / {String(properties.length).padStart(2, '0')}</span>}
          </p>
          <p className="story__cinema" key={cue} aria-live="off">
            {cue === 'tagline' ? p?.tagline || p?.name : cue === 'specs' ? [p?.stage ? STAGE_LABEL[p.stage] : null, ...specs].filter(Boolean).join('  ·  ') : cue === 'rewind' ? 'Now, from the ground up.' : p?.name}
          </p>
        </div>
        <div className={cls('story__opening-actions', openingOn && 'is-on')} inert={!openingOn}>
          <button
            type="button"
            className="button button--primary"
            onClick={() => {
              skip(); // returning from full screen lands on the story, not mid-opening
              open('explore', slug);
            }}
            disabled={!slug || Boolean(unavailable)}
          >
            <IconExpand />
            Explore property
          </button>
          <button type="button" className="story__skip" onClick={skip}>
            Skip intro
          </button>
        </div>

        {/* ---- intro: the project, and the invitation to scroll */}
        <div className={cls('story__panel story__intro', introOn && 'is-on')} inert={!introOn}>
          <p className="kicker">
            {p ? 'Featured development' : 'Immersive 3D property experiences'}
            {properties.length > 1 && index >= 0 && <span className="story__count"> · {String(index + 1).padStart(2, '0')} / {String(properties.length).padStart(2, '0')}</span>}
          </p>
          <h2 id="story-title" className="story__title">
            {p ? p.name : loading ? ' ' : 'Explore homes in 3D'}
          </h2>
          {p?.tagline && <p className="story__lede">{p.tagline}</p>}
          {p && (
            <p className="story__specs">
              {[p.stage ? STAGE_LABEL[p.stage] : null, ...specs].filter(Boolean).map((x) => (
                <span key={x}>{x}</span>
              ))}
            </p>
          )}
          <div className="actions story__actions">
            <button type="button" className="button button--primary" onClick={() => open('explore', slug)} disabled={Boolean(unavailable) || !slug}>
              <IconExpand />
              Explore in 3D
            </button>
            <button type="button" className="button" onClick={() => open('tour', slug)} disabled={Boolean(unavailable) || !slug}>
              <IconPlay />
              Guided tour
            </button>
            {p && (
              <Link className="textlink" to={propertyPath(p.slug)}>
                Property details <IconArrow />
              </Link>
            )}
          </div>
          <p className="story__note">
            {unavailable ? <strong>{unavailable}</strong> : null}
            {notice && <span className="story__notice">{notice}</span>}
            {!ready && p?.posterCredit && <span className="story__notice">{p.posterCredit}</span>}
            {ready && !reduced && (
              <button type="button" className="story__replay" onClick={replay}>
                Replay the intro
              </button>
            )}
          </p>
          {properties.length > 1 && (
            <nav className="story__switch" aria-label="Featured properties">
              {properties.map((x, i) => (
                <button key={x.slug} type="button" aria-pressed={x.slug === slug} onClick={() => x.slug !== slug && onSlug(x.slug)}>
                  <span className="story__switch-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="story__switch-name">{x.name}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
        {!unavailable && (
          <button type="button" className={cls('story__cue', introOn && cue !== 'poster' && 'is-on')} onClick={scrollToRise} tabIndex={introOn ? 0 : -1}>
            <span>{reduced ? 'Scroll to see it built, stage by stage' : 'Scroll to watch it rise'}</span>
            <span className="story__cue-line" aria-hidden="true" />
          </button>
        )}

        {/* ---- rise: the construction sequence */}
        <div className={cls('story__panel story__rise', chapter === 'rise' && 'is-on')} inert={chapter !== 'rise'}>
          <p className="kicker">Construction · illustrative sequence</p>
          <h3 className="story__stage-title" key={riseStage + (rise.title || '')}>
            {rise.title}
          </h3>
          <p className="story__stage-text">{rise.text}</p>
          {levelLabel !== null && ['lower', 'middle', 'upper'].includes(riseStage) && (
            <p className="story__counter" aria-live="off">
              <span className="story__counter-n">{levelLabel}</span>
              <span className="story__counter-of">
                level of {tallest.levels[tallest.levels.length - 1].number}
              </span>
            </p>
          )}
          <ol className="story__steps" aria-label="Construction stages">
            {STAGES.map((st, i) => (
              <li key={st} className={cls(i < stageIndex && 'is-done', i === stageIndex && 'is-now')}>
                {STAGE_SHORT[st]}
              </li>
            ))}
          </ol>
          <button type="button" className="button story__explore" onClick={() => open('explore', slug)} disabled={Boolean(unavailable) || !slug}>
            <IconExpand />
            Explore in 3D
          </button>
        </div>

        {/* ---- architecture: the finished building, view by view */}
        <div className={cls('story__panel story__arch', (chapter === 'architecture' || chapter === 'after') && 'is-on')} inert={chapter !== 'architecture' && chapter !== 'after'}>
          <p className="kicker">
            Architecture · illustrative design <span className="story__count">· {String(view + 1).padStart(2, '0')} / {String(VIEWS.length).padStart(2, '0')}</span>
          </p>
          <h3 className="story__stage-title" key={viewKey}>
            {VIEW_TITLE[viewKey]}
          </h3>
          {highlight && (
            <p className="story__highlight">
              <span className="story__highlight-label">Project highlight</span>
              {highlight}
            </p>
          )}
          <button type="button" className="button story__explore" onClick={() => open('explore', slug)} disabled={Boolean(unavailable) || !slug}>
            <IconExpand />
            Explore in 3D
          </button>
        </div>
      </div>
    </section>
  );
}
