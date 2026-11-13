import { bedroomsOf } from '../plan/layout.js';
import { DataError } from './errors.js';
import { fetchJson } from './fetchJson.js';

export { DataError };

/**
 * Turns one property's data file (`properties/<slug>/property.json`) into the model the site and
 * the 3D experience render. Where files come from is decided in source.js.
 *
 * Relative asset paths in the file (logo, floor-plan images, panoramas, gallery, brochure) resolve
 * against the folder that holds that property.json, so each property's files stay together.
 *
 * Nothing here invents inventory. Modes:
 *   "live"       real data: availability, areas and prices exactly as listed
 *   "demo"       sample data for demonstrations; the UI labels it as a demo everywhere
 *   "prototype"  geometry only: no units, prices or availability are shown
 * Missing fields stay missing (the UI shows "Not provided"), never estimated.
 *
 * This module has no browser globals, so the build can import it (scripts/static-site.mjs).
 */

export const DATA_FILE = 'property.json';
const MAX_FLOORS = 120;
const MAX_UNITS_PER_FLOOR_GEOMETRY = 12;

const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : typeof v === 'number' ? String(v) : null);
const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const int = (v) => {
  const n = num(v);
  return n !== null && Number.isInteger(n) ? n : null;
};
const pos = (v) => {
  const n = num(v);
  return n !== null && n > 0 ? n : null;
};
const strList = (v) => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);
const slug = (v) =>
  String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const typeKey = (t) => String(t || '').toUpperCase().replace(/[\s_-]+/g, '');

/**
 * Load a property. `location` is { slug, url } from source.js: the URL of its property.json.
 * The model's `slug` is the folder name, used for the property's pages.
 */
export async function fetchProperty(location, { signal, timeout = 12000 } = {}) {
  if (!location?.url) {
    throw new DataError(location?.slug ? `There is no property called “${location.slug}” on this site.` : 'No property was named.', 'NOT_FOUND');
  }
  const label = location.slug ? `properties/${location.slug}/${DATA_FILE}` : DATA_FILE;
  const raw = await fetchJson(location.url, {
    label,
    notFound: location.slug ? `There is no property called “${location.slug}” on this site.` : `${label} is missing from this site.`,
    signal,
    timeout
  });
  const model = toPropertyModel(raw, new URL('./', location.url));
  model.slug = location.slug || null;
  return model;
}

function modeOf(raw) {
  const m = str(raw.mode)?.toLowerCase();
  if (m === 'live' || m === 'demo' || m === 'prototype') return m;
  if (raw.prototype === false) return 'live';
  return 'prototype';
}

/** Resolve a relative asset path against the property folder; only http(s) results are allowed. */
function asset(base, v) {
  const s = str(v);
  if (!s) return null;
  try {
    const u = new URL(s, base);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}

function externalUrl(v) {
  const s = str(v);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch {
    return null;
  }
}

const HEX = /^#[0-9a-f]{6}$/i;

export function toPropertyModel(raw, base) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new DataError(`${DATA_FILE} must contain a JSON object.`, 'INVALID');
  }
  const mode = modeOf(raw);
  const withUnits = mode !== 'prototype';
  const project = raw.project && typeof raw.project === 'object' ? raw.project : {};
  const brand = raw.brand && typeof raw.brand === 'object' ? raw.brand : {};
  const name = str(project.name) || (mode === 'prototype' ? 'Prototype Residence' : 'Residence');

  const unitTypes = {};
  if (raw.unitTypes && typeof raw.unitTypes === 'object') {
    for (const [k, v] of Object.entries(raw.unitTypes)) {
      if (!v || typeof v !== 'object') continue;
      unitTypes[typeKey(k)] = {
        label: str(v.label),
        floorPlan: asset(base, v.floorPlan),
        tour: str(v.tour),
        interior: asset(base, v.interior)
      };
    }
  }

  const tours = {};
  if (raw.tours && typeof raw.tours === 'object') {
    for (const [id, t] of Object.entries(raw.tours)) {
      const scenes = (Array.isArray(t?.scenes) ? t.scenes : [])
        .map((s, i) => ({
          id: str(s?.id) || `scene-${i + 1}`,
          name: str(s?.name) || `View ${i + 1}`,
          image: asset(base, s?.image),
          yaw: num(s?.yaw) ?? 0,
          hotspots: (Array.isArray(s?.hotspots) ? s.hotspots : [])
            .map((h) => ({ to: str(h?.to), yaw: num(h?.yaw) ?? 0, pitch: num(h?.pitch) ?? -8, label: str(h?.label) }))
            .filter((h) => h.to)
        }))
        .filter((s) => s.image);
      if (scenes.length) {
        tours[id] = { id, title: str(t.title) || 'Virtual tour', sample: Boolean(t.sample), credit: str(t.credit), scenes };
      }
    }
  }

  const seenTowers = new Set();
  const seenUnits = new Set();
  const towers = (Array.isArray(raw.towers) ? raw.towers : [])
    .filter((t) => t && typeof t === 'object')
    .map((t, i) => {
      const tower = buildTower(t, i, withUnits, { unitTypes, tours, base, seenUnits });
      while (seenTowers.has(tower.id)) tower.id = `${tower.id}-${i + 1}`;
      seenTowers.add(tower.id);
      return tower;
    })
    .filter((t) => t.levels.length > 0);

  return {
    id: slug(name) || 'property',
    slug: null,
    name,
    type: str(project.type),
    stage: toStage(project.stage),
    fictional: project.fictional === true,
    location: str(project.location),
    city: str(project.city),
    developer: str(project.developer),
    rera: str(project.rera),
    possession: str(project.possession),
    brand: {
      name: str(brand.name) || '',
      logo: asset(base, brand.logo) || '',
      accent: HEX.test(str(brand.accent) || '') ? brand.accent : null
    },
    mode,
    source: mode === 'live' ? 'data' : mode, // kept for older components
    asOf: withUnits ? str(raw.availabilityAsOf) : null,
    currency: (str(raw.currency) || 'INR').toUpperCase(),
    areaUnit: str(raw.areaUnit) === 'sqm' ? 'sqm' : 'sqft',
    unitTypes,
    tours,
    towers,
    marketing: toMarketing(raw.marketing, base),
    listing: {
      listed: raw.listing?.listed !== false,
      featured: int(raw.listing?.featured)
    }
  };
}

/** Project stage for listings. Anything else is left empty rather than guessed. */
const STAGES = { upcoming: 'upcoming', newlaunch: 'upcoming', underconstruction: 'under-construction', ongoing: 'under-construction', ready: 'ready', readytomove: 'ready', completed: 'ready' };
function toStage(v) {
  const s = String(v || '').toLowerCase().replace(/[\s_-]+/g, '');
  return STAGES[s] || null;
}

/** Marketing content for the property's website. Every field is optional. */
function toMarketing(m, base) {
  const o = m && typeof m === 'object' ? m : {};
  const hero = o.hero && typeof o.hero === 'object' ? o.hero : {};
  return {
    tagline: str(o.tagline),
    description: str(o.description),
    highlights: strList(o.highlights),
    amenities: strList(o.amenities),
    hero: {
      poster: asset(base, hero.poster),
      posterMobile: asset(base, hero.posterMobile), // optional portrait version for phones
      video: asset(base, hero.video),
      credit: str(hero.credit)
    },
    gallery: (Array.isArray(o.gallery) ? o.gallery : [])
      .map((g) => ({
        src: asset(base, typeof g === 'string' ? g : g?.src),
        caption: str(g?.caption),
        // "photo" (a photograph of the real property) or "render" (illustrative, labelled as such)
        kind: str(g?.kind) === 'photo' ? 'photo' : 'render'
      }))
      .filter((g) => g.src),
    brochure: asset(base, o.brochure),
    location: {
      address: str(o.location?.address),
      lat: num(o.location?.lat),
      lng: num(o.location?.lng),
      sample: o.location?.sample === true
    }
  };
}

function parseLevels(v) {
  if (v === 'all' || v === '*') return () => true;
  if (Array.isArray(v)) {
    const set = new Set(v.map(int).filter((n) => n !== null));
    return (n) => set.has(n);
  }
  const s = str(v);
  if (!s) return () => false;
  const parts = s.split(',').map((p) => p.trim());
  return (n) =>
    parts.some((p) => {
      const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) return n >= Number(m[1]) && n <= Number(m[2]);
      return Number(p) === n;
    });
}

function buildTower(t, i, withUnits, ctx) {
  const name = str(t.name) || `Tower ${i + 1}`;
  const id = str(t.id) ? slug(t.id) || `tower-${i + 1}` : slug(name) || `tower-${i + 1}`;
  const units = withUnits ? (Array.isArray(t.units) ? t.units : []).map((u) => toUnit(u, id, ctx)).filter(Boolean) : [];
  const placed = units.filter((u) => u.floor !== null && u.floor >= 0);
  const maxUnitFloor = placed.reduce((m, u) => Math.max(m, u.floor), 0);
  const top = Math.min(MAX_FLOORS, Math.max(int(t.floors) || 0, maxUnitFloor));
  const hasGroundUnits = placed.some((u) => u.floor === 0);
  const plans = (Array.isArray(t.floorPlans) ? t.floorPlans : [])
    .map((p) => ({ match: parseLevels(p?.levels), image: asset(ctx.base, p?.image), label: str(p?.label) }))
    .filter((p) => p.image);

  const levels = [];
  for (let n = hasGroundUnits ? 0 : 1; n <= top; n += 1) {
    const onLevel = placed.filter((u) => u.floor === n).sort(byUnitNumber);
    const plan = plans.find((p) => p.match(n));
    levels.push({
      number: n,
      units: onLevel,
      counts: withUnits ? countStatuses(onLevel) : null,
      planImage: plan ? { src: plan.image, label: plan.label } : null
    });
  }

  const unplaced = units.length - placed.length;
  if (unplaced > 0) console.warn(`[${DATA_FILE}] ${name}: ${unplaced} unit(s) have no valid "floor" and are not shown.`);

  const busiest = levels.reduce((m, l) => Math.max(m, l.units.length), 0);
  return {
    id,
    name,
    levels,
    unitsPerFloor: Math.max(1, Math.min(MAX_UNITS_PER_FLOOR_GEOMETRY, int(t.unitsPerFloor) || busiest || 4)),
    defaultBedrooms: bedroomsOf(t.defaultType) ?? 2,
    hasLobby: !hasGroundUnits,
    unplacedUnits: unplaced,
    totals: withUnits ? countStatuses(placed) : null
  };
}

function toUnit(u, towerId, ctx) {
  if (!u || typeof u !== 'object') return null;
  const number = str(u.number);
  const type = str(u.type);
  const tk = typeKey(type);
  const ut = ctx.unitTypes[tk] || {};
  let id = str(u.id) || `${towerId}-${number || 'unit'}`;
  while (ctx.seenUnits.has(id)) id = `${id}-x`;
  ctx.seenUnits.add(id);
  const tourId = str(u.tour) || ut.tour || null;
  return {
    id,
    number: number || '',
    type,
    typeKey: tk,
    typeLabel: ut.label || typeLabel(type),
    bedrooms: bedroomsOf(type),
    floor: int(u.floor),
    carpet: pos(u.carpetSqft ?? u.carpetArea),
    builtUp: pos(u.builtUpSqft ?? u.builtUpArea),
    superBuiltUp: pos(u.superSqft ?? u.superBuiltUpArea),
    price: pos(u.price),
    status: toStatus(u.status),
    facing: str(u.facing),
    tour: tourId && ctx.tours[tourId] ? tourId : null,
    virtualTourUrl: externalUrl(u.virtualTourUrl),
    floorPlan: asset(ctx.base, u.floorPlan) || ut.floorPlan || null,
    interior: ut.interior || null
  };
}

export function typeLabel(t) {
  if (!t) return null;
  const s = String(t).trim();
  const m = s.match(/^(\d)\s*([a-z]+)$/i);
  return m ? `${m[1]} ${m[2].toUpperCase()}` : s;
}

export function toStatus(v) {
  const s = String(v || '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
  if (s === 'available') return 'available';
  if (s === 'hold' || s === 'onhold' || s === 'reserved') return 'hold';
  if (s === 'booked') return 'booked';
  if (s === 'sold') return 'sold';
  return 'unknown';
}

function countStatuses(list) {
  const c = { total: list.length, available: 0, hold: 0, booked: 0, sold: 0 };
  for (const u of list) if (u.status in c && u.status !== 'total') c[u.status] += 1;
  return c;
}

function byUnitNumber(a, b) {
  return String(a.number).localeCompare(String(b.number), undefined, { numeric: true });
}
