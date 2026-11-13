import { useMemo, useSyncExternalStore } from 'react';
import { matchRoute, normalizePath, NOT_FOUND } from './routes.js';
import { sitePath, stripBase } from './lib/paths.js';

/**
 * A small History-API router (no dependency). Paths are site paths such as "/properties/x";
 * the base folder is added and removed here.
 *
 * /experience/<slug> is a separate document: moving between it and the website is a full page
 * load. (The home page also runs the 3D app, embedded in its hero; its styles are scoped to `.app`.)
 */

const listeners = new Set();
const notify = () => listeners.forEach((l) => l());
if (typeof window !== 'undefined') window.addEventListener('popstate', notify);

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;

export function resolve(pathname) {
  const path = normalizePath(stripBase(pathname));
  const m = matchRoute(path);
  return m ? { path, route: m.route, params: m.params } : { path, route: NOT_FOUND, params: {} };
}

/** The current location: { path, route, params, search, hash }. Re-renders on navigation. */
export function useLocation() {
  const key = useSyncExternalStore(subscribe, snapshot);
  return useMemo(() => {
    const url = new URL(key, window.location.origin);
    return { ...resolve(url.pathname), search: url.search, hash: url.hash };
  }, [key]);
}

/** Site path ("/about", "/properties/x?unit=y") → href including the base folder. */
export const href = (to) => sitePath(to);

function scrollToHash(hash) {
  if (!hash) return false;
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return Boolean(el);
}

/** Go to a site path. Crossing between the website and the 3D experience reloads the page. */
export function navigate(to, { replace = false } = {}) {
  const url = new URL(href(to), window.location.origin);
  const next = resolve(url.pathname);
  const here = resolve(window.location.pathname);
  if (next.route.app !== here.route.app) {
    if (replace) window.location.replace(url.href);
    else window.location.assign(url.href);
    return;
  }
  const same = url.pathname === window.location.pathname && url.search === window.location.search;
  if (replace || same) window.history.replaceState(null, '', url.href);
  else window.history.pushState(null, '', url.href);
  notify();
  if (!scrollToHash(url.hash) && !same) window.scrollTo(0, 0);
  else if (url.hash) requestAnimationFrame(() => scrollToHash(url.hash));
}

/** Rewrite the address without a new history entry or page load (legacy-link redirects). */
export function replaceUrl(to) {
  window.history.replaceState(null, '', new URL(href(to), window.location.origin).href);
  notify();
}

/** <a> for site paths: client-side navigation, unless opened in a new tab or with modifiers. */
export function Link({ to, onClick, target, children, ...rest }) {
  return (
    <a
      href={href(to)}
      target={target}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || (target && target !== '_self')) {
          return;
        }
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
