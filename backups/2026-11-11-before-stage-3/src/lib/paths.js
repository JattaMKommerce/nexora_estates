/**
 * Where the site lives. Vite sets BASE_URL from `base` in vite.config.js: "/" by default, or a
 * sub-folder such as "/homes/" when built with `BASE_PATH=/homes/ npm run build`.
 *
 * Every page URL and every file URL goes through these helpers, because pages are nested
 * (/properties/<slug>, /experience/<slug>): a bare relative path would resolve against the page.
 */
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
export const BASE = env.BASE_URL && env.BASE_URL.startsWith('/') ? env.BASE_URL : '/';

/** "about" or "/about" → "/about" under the base ("/homes/about" in a sub-folder build). */
export const sitePath = (p = '/') => BASE + String(p).replace(/^\/+/, '');

/** A public file (sky, textures, models, data) as a site-absolute path. */
export const assetPath = (p) => sitePath(p);

/** An image or media reference from the data: full URLs stay as they are, site paths get the base. */
export const mediaUrl = (p) => (!p ? null : /^([a-z]+:)?\/\//i.test(p) || p.startsWith('data:') ? p : assetPath(p));

/** Absolute URL for fetch() and new URL(): resolves against the page origin, never the page path. */
export const siteUrl = (p) => new URL(sitePath(p), window.location.origin);

/** "/homes/about/" → "/about" (the route path the router matches). */
export function stripBase(pathname) {
  let p = pathname || '/';
  const base = BASE.replace(/\/$/, '');
  if (base && (p === base || p.startsWith(`${base}/`))) p = p.slice(base.length) || '/';
  return p;
}
