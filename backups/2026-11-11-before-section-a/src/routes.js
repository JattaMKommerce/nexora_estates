import { isSlug, PROTOTYPE_SLUG } from './data/slug.js';

/**
 * Every page of the site, in one table shared by:
 *  - the browser router (src/router.jsx), and
 *  - the build (scripts/static-site.mjs), which writes an HTML file for each route, and for each
 *    property slug, so a direct visit or a browser refresh works on any static host.
 *
 * app          "site" (the website) or "experience" (the full-screen 3D application).
 * title        page title (the brand name is appended); property routes use the property name.
 * redirect     the page forwards to another route.
 * noindex      kept out of search engines (account and placeholder pages).
 *
 * Keep this file free of JSX and browser globals: Node imports it at build time.
 */
export const ROUTES = [
  {
    id: 'home',
    path: '/',
    app: 'site',
    title: null,
    description: 'Explore new homes in realistic 3D: choose a tower, a floor and a residence, see the floor plan and walk through the interior.'
  },
  { id: 'properties', path: '/properties', app: 'site', title: 'Properties', description: 'Residences across every project, with live availability, floor plans and 3D tours.' },
  { id: 'property', path: '/properties/:slug', app: 'site', title: 'Property', description: null },
  { id: 'projects', path: '/projects', app: 'site', title: 'Projects', description: 'Developments by stage: new launches, under construction and ready to move.' },
  { id: 'locations', path: '/locations', app: 'site', title: 'Locations', description: 'Where each project is, on the map.' },
  { id: 'virtual-tours', path: '/virtual-tours', app: 'site', title: 'Virtual tours', description: 'Step into each project in 3D and in 360°.' },
  { id: 'experience', path: '/experience/:slug', app: 'experience', title: '3D experience', description: null },
  { id: 'experience-index', path: '/experience', app: 'site', redirect: '/virtual-tours', title: 'Virtual tours', description: null },
  { id: 'about', path: '/about', app: 'site', title: 'About us', description: null },
  { id: 'contact', path: '/contact', app: 'site', title: 'Contact', description: null },
  { id: 'saas', path: '/saas', app: 'site', title: 'For developers', description: 'Immersive 3D sales websites for real-estate developers and builders.' },
  { id: 'book-a-demo', path: '/book-a-demo', app: 'site', title: 'Book a demo', description: 'See the platform with your own project.' },
  { id: 'login', path: '/login', app: 'site', title: 'Builder login', description: null, noindex: true },
  { id: 'dashboard', path: '/dashboard', app: 'site', title: 'Builder dashboard', description: null, noindex: true },
  { id: 'privacy', path: '/privacy', app: 'site', title: 'Privacy policy', description: null },
  { id: 'terms', path: '/terms', app: 'site', title: 'Terms and conditions', description: null }
];

export const NOT_FOUND = { id: 'not-found', path: null, app: 'site', title: 'Page not found', noindex: true };

const byId = Object.fromEntries(ROUTES.map((r) => [r.id, r]));
export const routeById = (id) => byId[id] || null;

/** "/About/" → "/about"; "/x/index.html" → "/x"; "" → "/". Query and hash are not part of it. */
export function normalizePath(pathname) {
  let p = String(pathname || '/');
  try {
    p = decodeURIComponent(p);
  } catch {
    /* keep it as written */
  }
  p = p.replace(/\/index\.html$/i, '/').replace(/\/{2,}/g, '/');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p.toLowerCase() || '/';
}

/** { route, params } for a normalised path, or null. Dynamic segments must be valid slugs. */
export function matchRoute(path) {
  const parts = path === '/' ? [] : path.slice(1).split('/');
  for (const route of ROUTES) {
    const pattern = route.path === '/' ? [] : route.path.slice(1).split('/');
    if (pattern.length !== parts.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < pattern.length && ok; i += 1) {
      if (pattern[i].startsWith(':')) {
        if (isSlug(parts[i])) params[pattern[i].slice(1)] = parts[i];
        else ok = false;
      } else if (pattern[i] !== parts[i]) ok = false;
    }
    if (ok) return { route, params };
  }
  return null;
}

/** buildPath('property', { slug: 'x' }) → "/properties/x" */
export function buildPath(id, params = {}) {
  const route = byId[id];
  if (!route) throw new Error(`Unknown route "${id}"`);
  return route.path.replace(/:([a-z]+)/g, (_, k) => {
    if (!isSlug(params[k])) throw new Error(`Route "${id}" needs a valid "${k}"`);
    return params[k];
  });
}

export const propertyPath = (slug) => buildPath('property', { slug });
export const experiencePath = (slug) => buildPath('experience', { slug });
export const prototypePath = () => experiencePath(PROTOTYPE_SLUG);

/**
 * Every concrete path the build must write an HTML file for: the fixed routes, then one page per
 * property for each dynamic route, and the prototype experience.
 */
export function concretePaths(slugs) {
  const out = [];
  for (const route of ROUTES) {
    if (!route.path.includes(':')) {
      out.push({ path: route.path, route, params: {} });
      continue;
    }
    const list = route.id === 'experience' ? [...slugs, PROTOTYPE_SLUG] : slugs;
    for (const slug of list) out.push({ path: route.path.replace(':slug', slug), route, params: { slug } });
  }
  return out;
}
