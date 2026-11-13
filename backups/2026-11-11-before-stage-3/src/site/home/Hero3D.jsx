import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '../../router.jsx';
import { propertyPath } from '../../routes.js';
import { mediaUrl } from '../../lib/paths.js';
import { cls } from '../../lib/format.js';
import { isCoarsePointer } from '../../lib/env.js';
import { dataNotice, specLine, STAGE_LABEL } from '../labels.js';
import { IconArrow, IconExpand, IconPlay } from '../icons.jsx';

// The same 3D engine as /experience/<slug>, loaded after the page itself.
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

/**
 * Whether the hero's 3D view fills the screen. Opening it adds one history entry, so the browser's
 * Back button closes it; the page underneath keeps its scroll position.
 * Commands ({ id, n, slug }) ask the scene to open a particular view (see ExperienceApp).
 */
export function useImmersive() {
  const [immersive, setImmersive] = useState(false);
  const [command, setCommand] = useState(null);
  const pushed = useRef(false);

  const open = useCallback((id = null, slug = null) => {
    if (!pushed.current) {
      window.history.pushState({ ...(window.history.state || {}), restate3d: true }, '');
      pushed.current = true;
    }
    setImmersive(true);
    if (id) setCommand((c) => ({ id, slug, n: (c?.n || 0) + 1 }));
  }, []);

  const close = useCallback(() => {
    if (pushed.current && window.history.state?.restate3d) {
      window.history.back(); // the popstate below finishes closing
      return;
    }
    pushed.current = false;
    setImmersive(false);
  }, []);

  useEffect(() => {
    // Reloaded or restored on the 3D entry: start as the preview.
    if (window.history.state?.restate3d) window.history.replaceState({ ...window.history.state, restate3d: false }, '');
    const onPop = () => {
      if (window.history.state?.restate3d) return;
      pushed.current = false;
      setImmersive(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('xp-immersive', immersive);
    return () => root.classList.remove('xp-immersive');
  }, [immersive]);

  return { immersive, command, open, close };
}

const UNAVAILABLE = {
  'no-webgl': 'This browser can’t show 3D graphics, so a still image is shown instead.',
  failed: 'The 3D view couldn’t start on this device, so a still image is shown instead.',
  lost: 'The 3D view was interrupted by the browser. Reload the page to bring it back.',
  'data-error': 'This property’s details couldn’t be loaded, so it can’t be shown in 3D right now.',
  'no-towers': 'This property has no towers to show in 3D yet.'
};

/**
 * The homepage hero: the live 3D building of the featured property, with the website around it.
 * Preview: the building turns slowly behind the page's text; floors can be pointed at, and the page
 * scrolls as usual. Choosing a floor, "Explore in 3D" or "Guided tour" opens the same scene in place,
 * full screen, with every control of the experience.
 */
export function Hero3D({ properties, slug, onSlug, stage, loading }) {
  const p = properties.find((x) => x.slug === slug) || null;
  const index = properties.findIndex((x) => x.slug === slug);
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  const [scene, setScene] = useState({ slug: null, status: 'loading' });
  const status = scene.slug === slug ? scene.status : 'loading';
  const touch = useMemo(isCoarsePointer, []);
  const { immersive, command, open, close } = stage;

  // Rendering pauses while the hero is scrolled out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Start downloading the 3D code straight away; the poster covers the wait.
  useEffect(() => {
    loadExperience().catch(() => {});
  }, []);

  const unavailable = UNAVAILABLE[status] || null;
  useEffect(() => {
    if (unavailable && immersive) close();
  }, [unavailable, immersive, close]);

  const onStatus = useCallback((s) => setScene({ slug, status: s }), [slug]);
  const onImmersive = useCallback((on) => (on ? open() : close()), [open, close]);
  const embed = useMemo(
    () => ({ immersive, onImmersive, command, active: visible, onStatus }),
    [immersive, onImmersive, command, visible, onStatus]
  );

  const ready = status === 'ready';
  const poster = mediaUrl(p?.poster);
  const posterMobile = mediaUrl(p?.posterMobile);
  const notice = dataNotice(p);
  const specs = specLine(p);
  const hint = touch ? 'Tap a floor to open it' : 'Drag to turn the building · choose a floor to open it';

  return (
    <section ref={ref} className={cls('h3d tone-night', immersive && 'is-immersive', ready && 'is-ready')} aria-labelledby="h3d-title">
      <div className="h3d__stage">
        {slug && !unavailable && (
          <StageBoundary key={slug} onError={() => setScene({ slug, status: 'failed' })}>
            <Suspense fallback={null}>
              <ExperienceApp key={slug} slug={slug} embed={embed} />
            </Suspense>
          </StageBoundary>
        )}
        <div className={cls('h3d__poster', ready && 'is-hidden')} aria-hidden="true">
          {poster && (
            <picture key={poster}>
              {posterMobile && <source media="(max-width: 760px)" srcSet={posterMobile} />}
              <img src={poster} alt="" decoding="async" fetchPriority="high" />
            </picture>
          )}
          {!ready && !unavailable && (
            <span className="h3d__loading">
              <span className="h3d__loading-line" />
              Preparing the 3D view
            </span>
          )}
        </div>
      </div>

      <div className="h3d__shade" aria-hidden="true" />

      <div className="h3d__content wrap">
        <div className="h3d__copy">
          <p className="kicker">
            {p ? 'Featured development' : 'Immersive 3D property experiences'}
            {properties.length > 1 && index >= 0 && <span className="h3d__count"> · {String(index + 1).padStart(2, '0')} / {String(properties.length).padStart(2, '0')}</span>}
          </p>
          <h2 id="h3d-title" className="h3d__title">
            {p ? p.name : loading ? ' ' : 'Explore homes in 3D'}
          </h2>
          {p?.tagline && <p className="h3d__lede">{p.tagline}</p>}
          {p && (
            <p className="h3d__specs">
              {[p.stage ? STAGE_LABEL[p.stage] : null, ...specs].filter(Boolean).map((s) => (
                <span key={s}>{s}</span>
              ))}
            </p>
          )}
          <div className="actions h3d__actions">
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
          <p className="h3d__note">
            {unavailable ? <strong>{unavailable} </strong> : <span className="h3d__hint">{hint}</span>}
            {notice && <span className="h3d__notice">{notice}</span>}
            {poster && !ready && p?.posterCredit && <span className="h3d__notice">{p.posterCredit}</span>}
          </p>
        </div>

        {properties.length > 1 && (
          <nav className="h3d__switch" aria-label="Featured properties">
            {properties.map((x, i) => (
              <button key={x.slug} type="button" aria-pressed={x.slug === slug} onClick={() => x.slug !== slug && onSlug(x.slug)}>
                <span className="h3d__switch-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="h3d__switch-name">{x.name}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      <button
        type="button"
        className="h3d__scroll"
        onClick={() => document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      >
        <span>Scroll</span>
        <span className="h3d__scroll-line" aria-hidden="true" />
      </button>
    </section>
  );
}
