import { toPropertyModel } from './property.js';
import { isSlug } from './slug.js';

/**
 * The property catalogue (`properties/index.json`): one summary per property folder, used for
 * listings, cards, the map and to know which property pages exist.
 *
 * It is GENERATED from the property files (scripts/static-site.mjs, at build time and live in
 * development), so each property's data has exactly one source: its own property.json.
 * Summaries only use public listing fields.
 */

const CATALOGUE_BASE = 'https://catalogue.invalid/';

/** Summary of one property. Prices and counts come from the units as listed, never estimated. */
export function summarizeProperty(raw, slug) {
  const base = new URL(`properties/${slug}/`, CATALOGUE_BASE);
  const m = toPropertyModel(raw, base);
  // Asset URLs back to site-relative paths ("properties/<slug>/poster.jpg"); external URLs stay.
  const rel = (href) => (href && href.startsWith(CATALOGUE_BASE) ? href.slice(CATALOGUE_BASE.length) : href);

  const units = m.towers.flatMap((t) => t.levels.flatMap((l) => l.units));
  const counts = { total: units.length, available: 0, hold: 0, booked: 0, sold: 0 };
  for (const u of units) if (u.status in counts && u.status !== 'total') counts[u.status] += 1;

  const priced = units.filter((u) => u.price && u.status === 'available');
  const types = new Map();
  for (const u of units) {
    const k = u.typeLabel || u.type;
    if (k && !types.has(k)) types.set(k, u.bedrooms ?? 99);
  }
  const carpets = units.map((u) => u.carpet).filter(Boolean);

  return {
    slug,
    name: m.name,
    mode: m.mode,
    fictional: m.fictional,
    type: m.type,
    stage: m.stage,
    tagline: m.marketing.tagline,
    location: m.location,
    city: m.city,
    developer: m.developer,
    possession: m.possession,
    asOf: m.asOf,
    currency: m.currency,
    areaUnit: m.areaUnit,
    configurations: [...types.entries()].sort((a, b) => a[1] - b[1]).map(([k]) => k),
    // lowest listed price among AVAILABLE units; null when none is listed ("price on request")
    startingPrice: priced.length ? Math.min(...priced.map((u) => u.price)) : null,
    carpetRange: carpets.length ? [Math.min(...carpets), Math.max(...carpets)] : null,
    towers: m.towers.length,
    floors: m.towers.reduce((n, t) => Math.max(n, t.levels.length ? t.levels[t.levels.length - 1].number : 0), 0),
    units: m.mode === 'prototype' ? null : counts,
    hasTour: Object.keys(m.tours).length > 0,
    poster: rel(m.marketing.hero.poster),
    posterMobile: rel(m.marketing.hero.posterMobile),
    posterCredit: m.marketing.hero.credit,
    // map position, only when the file gives one; sample positions stay flagged as samples
    geo:
      m.marketing.location.lat !== null && m.marketing.location.lng !== null
        ? { lat: m.marketing.location.lat, lng: m.marketing.location.lng, sample: m.marketing.location.sample }
        : null,
    listed: m.listing.listed,
    featured: m.listing.featured
  };
}

/** entries: [{ slug, raw }] → the catalogue file's content. */
export function buildCatalogue(entries) {
  const properties = entries
    .map(({ slug, raw }) => summarizeProperty(raw, slug))
    .sort((a, b) => (a.featured ?? 1e9) - (b.featured ?? 1e9) || a.name.localeCompare(b.name));
  return {
    _note: 'Generated from properties/<slug>/property.json at build time. Do not edit by hand.',
    properties
  };
}

/** Browser side: validate what the catalogue file contains. */
export function toCatalogueModel(raw) {
  const list = Array.isArray(raw?.properties) ? raw.properties : [];
  return list
    .filter((p) => p && isSlug(p.slug) && typeof p.name === 'string');
}
