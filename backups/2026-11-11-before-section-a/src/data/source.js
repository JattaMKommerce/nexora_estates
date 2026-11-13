import { siteUrl } from '../lib/paths.js';
import { fetchJson } from './fetchJson.js';
import { DATA_FILE, fetchProperty } from './property.js';
import { toCatalogueModel } from './catalogue.js';
import { toSiteModel } from './site.js';
import { isSlug } from './slug.js';

/**
 * The one place that knows where data comes from.
 *
 * Today the site is static, and every read is a JSON file:
 *
 *   site settings      /site.json                        company, contact, social, forms
 *   catalogue          /properties/index.json            generated at build time from the folders
 *   one property       /properties/<slug>/property.json  towers, units, plans, tours, marketing
 *
 * A future Node.js backend (multi-tenant, with a builder dashboard) can serve the same shapes from
 * an API. Only this file then changes; pages and the 3D experience keep calling these functions.
 * The suggested public endpoints are listed in README.md ("Future backend").
 * Private data (enquiries, accounts, drafts) never goes through these public reads.
 */

export const DATA_PATHS = {
  site: 'site.json',
  catalogue: 'properties/index.json',
  property: (slug) => `properties/${slug}/${DATA_FILE}`
};

/** { slug, url } for a property's data file; url is null when the slug is not valid. */
export function propertyLocation(slug) {
  return isSlug(slug) ? { slug, url: siteUrl(DATA_PATHS.property(slug)) } : { slug: slug || null, url: null };
}

const cache = new Map();
/** One request per file per page view; a failed request is forgotten so "Try again" refetches. */
function once(key, load) {
  if (!cache.has(key)) {
    const p = load();
    cache.set(key, p);
    p.catch(() => cache.delete(key));
  }
  return cache.get(key);
}

export const loadSite = () =>
  once('site', () => fetchJson(siteUrl(DATA_PATHS.site), { label: DATA_PATHS.site }).then(toSiteModel));

export const loadCatalogue = () =>
  once('catalogue', () => fetchJson(siteUrl(DATA_PATHS.catalogue), { label: DATA_PATHS.catalogue }).then(toCatalogueModel));

export const loadProperty = (slug) => once(`property:${slug}`, () => fetchProperty(propertyLocation(slug)));

export const forget = (key) => cache.delete(key);
