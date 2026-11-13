import { lazy, Suspense, useEffect, useState } from 'react';
import { navigate, replaceUrl, useLocation } from './router.jsx';
import { experiencePath } from './routes.js';
import { isSlug, PROTOTYPE_SLUG } from './data/slug.js';
import { loadCatalogue, loadSite } from './data/source.js';

// Two bundles: the website, and the full-screen 3D experience (three.js is only in the second).
const SiteApp = lazy(() => import('./site/SiteApp.jsx'));
const ExperienceApp = lazy(() => import('./experience/ExperienceApp.jsx'));

/**
 * Before the website existed, the 3D experience lived at the site root, with links such as
 * "/?property=x&tower=tower-a&floor=12&unit=A-1203" or "/?prototype=1". Those links still work: they
 * are forwarded to /experience/<slug> with the same tower, floor, unit and tour settings.
 */
const LEGACY_KEYS = ['property', 'prototype', 'tower', 'floor', 'unit', 'tour'];

const isLegacy = (loc) => {
  if (loc.route.id !== 'home' || !loc.search) return false;
  const p = new URLSearchParams(loc.search);
  return LEGACY_KEYS.some((k) => p.has(k));
};

async function defaultSlug() {
  const site = await loadSite().catch(() => null);
  if (site && isSlug(site.defaultProperty)) return site.defaultProperty;
  const list = await loadCatalogue().catch(() => []);
  return list[0]?.slug || PROTOTYPE_SLUG;
}

function useLegacyRedirect(loc) {
  const legacy = isLegacy(loc);
  useEffect(() => {
    if (!legacy) return undefined;
    let live = true;
    const p = new URLSearchParams(loc.search);
    const named = (p.get('property') || '').trim().toLowerCase();
    const proto = p.has('prototype');
    p.delete('property');
    p.delete('prototype');
    const qs = p.toString();
    const go = (slug) => live && replaceUrl(`${experiencePath(slug)}${qs ? `?${qs}` : ''}${loc.hash}`);
    if (proto) go(PROTOTYPE_SLUG);
    else if (isSlug(named)) go(named);
    else defaultSlug().then(go);
    return () => {
      live = false;
    };
  }, [legacy, loc.search, loc.hash]);
  return legacy;
}

/** Shown only while a bundle downloads: the page colour, then a quiet word after a moment. */
function Boot() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 450);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="boot" role="status" aria-live="polite">
      <span className={show ? 'boot__label is-visible' : 'boot__label'}>Loading</span>
    </div>
  );
}

export default function Root() {
  const loc = useLocation();
  const legacy = useLegacyRedirect(loc);
  const redirect = loc.route.redirect || null;

  useEffect(() => {
    if (redirect) navigate(`${redirect}${loc.search}`, { replace: true });
  }, [redirect, loc.search]);

  if (legacy || redirect) return <Boot />;

  if (loc.route.app === 'experience') {
    return (
      <Suspense fallback={<Boot />}>
        <ExperienceApp key={loc.params.slug} slug={loc.params.slug} />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<Boot />}>
      <SiteApp location={loc} />
    </Suspense>
  );
}
