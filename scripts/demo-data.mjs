/**
 * Generates the clearly labelled, FICTIONAL demo properties shipped with the site:
 *
 *   public/properties/meridian-residences/property.json   two towers, 2–4 BHK, under construction
 *   public/properties/linden-park/property.json            three mid-rise towers, 1–2 BHK, new launch
 *   public/properties/halcyon-heights/property.json        one 30-floor tower, 3–4 BHK, ready to move
 *
 *   node scripts/demo-data.mjs
 *
 * None of these projects exists. Every name, unit, area, price, status and amenity is SAMPLE data
 * ("mode": "demo", "project.fictional": true), and the site labels it as such everywhere. For a real
 * client, add a folder with their real data and "mode": "live".
 * Facing is derived from the same illustrative layout the site draws, so the two agree.
 * The output is deterministic (seeded), so re-running it produces the same files.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bedroomsOf, buildFloorPlan, plateFor } from '../src/plan/layout.js';

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Sales profile: how far through selling the project is (lower floors sell first). */
const PROFILES = {
  // under construction, part sold (the original demo's distribution, unchanged)
  selling: (r, low) => (r < 0.12 + low * 0.22 ? 'sold' : r < 0.3 + low * 0.3 ? 'booked' : r < 0.38 + low * 0.3 ? 'hold' : 'available'),
  // new launch: mostly available
  launch: (r, low) => (r < 0.04 + low * 0.08 ? 'booked' : r < 0.12 + low * 0.12 ? 'hold' : 'available'),
  // ready to move: mostly sold
  ready: (r, low) => (r < 0.58 + low * 0.25 ? 'sold' : r < 0.74 + low * 0.18 ? 'booked' : r < 0.8 + low * 0.12 ? 'hold' : 'available')
};

const SAMPLE_TOUR = {
  'sample-tour': {
    title: 'Sample 360° tour',
    sample: true,
    credit: 'Sample panoramas from Poly Haven (CC0). They are not photographs of this property.',
    scenes: [
      { id: 'living', name: 'Living room', image: '../../assets/pano/living.jpg', yaw: -20, hotspots: [{ to: 'bedroom', yaw: -172, pitch: -4 }] },
      {
        id: 'bedroom',
        name: 'Bedroom',
        image: '../../assets/pano/bedroom.jpg',
        yaw: 10,
        hotspots: [
          { to: 'bathroom', yaw: 150, pitch: -6 },
          { to: 'living', yaw: -145, pitch: -6 }
        ]
      },
      { id: 'bathroom', name: 'Bathroom', image: '../../assets/pano/bathroom.jpg', yaw: 15, hotspots: [{ to: 'bedroom', yaw: 20, pitch: -6 }] }
    ]
  }
};

const PROPERTIES = [
  {
    slug: 'meridian-residences',
    featured: 1,
    project: {
      name: 'The Meridian Residences',
      type: 'Residential apartments',
      stage: 'under-construction',
      location: 'Sample location',
      city: 'Demo city',
      developer: 'Sample developer',
      possession: 'December 2028 (sample)'
    },
    marketing: {
      tagline: 'Two towers of light-filled homes around a landscaped podium.',
      description:
        'A fictional project used to demonstrate the platform. Two residential towers of 22 and 18 floors hold 2, 3 and 4 BHK homes around a landscaped podium with a reflecting pool. Every figure on this page is sample data.',
      highlights: ['Two towers, 22 and 18 floors', '2, 3 and 4 BHK homes', 'Corner homes open to two sides', 'Landscaped podium with a reflecting pool'],
      amenities: ['Landscaped podium garden', 'Reflecting pool', 'Double-height entrance lobby', 'Clubhouse', 'Fitness studio', 'Children’s play area']
    },
    areas: {
      '2BHK': { carpet: 845, builtUp: 940, super: 1235 },
      '3BHK': { carpet: 1265, builtUp: 1410, super: 1840 },
      '4BHK': { carpet: 1720, builtUp: 1915, super: 2490 }
    },
    profile: 'selling',
    towers: [
      { id: 'tower-a', name: 'Tower A', prefix: 'A', floors: 22, mix: ['3BHK', '3BHK', '2BHK', '2BHK'], rate: 9800, seed: 7 },
      { id: 'tower-b', name: 'Tower B', prefix: 'B', floors: 18, mix: ['4BHK', '4BHK', '3BHK', '3BHK'], rate: 11200, seed: 19 }
    ]
  },
  {
    slug: 'linden-park',
    featured: 3,
    project: {
      name: 'Linden Park',
      type: 'Residential apartments',
      stage: 'upcoming',
      location: 'Sample district',
      city: 'Demo city',
      developer: 'Sample developer',
      possession: 'June 2030 (sample)'
    },
    marketing: {
      tagline: 'Compact 1 and 2 BHK homes in three mid-rise towers.',
      description:
        'A fictional new launch used to demonstrate the platform. Three 14-floor towers of efficient 1 and 2 BHK homes, planned for first-time buyers. Every figure on this page is sample data.',
      highlights: ['Three towers of 14 floors', 'Efficient 1 and 2 BHK homes', 'Six homes per floor', 'New launch: most homes still available'],
      amenities: ['Central garden', 'Co-working lounge', 'Children’s play area', 'Covered parking', 'Multipurpose hall']
    },
    areas: {
      '1BHK': { carpet: 455, builtUp: 520, super: 690 },
      '2BHK': { carpet: 640, builtUp: 735, super: 960 }
    },
    profile: 'launch',
    towers: [
      { id: 'tower-a', name: 'Tower A', prefix: 'A', floors: 14, mix: ['1BHK', '1BHK', '1BHK', '1BHK', '2BHK', '2BHK'], rate: 6400, seed: 31 },
      { id: 'tower-b', name: 'Tower B', prefix: 'B', floors: 14, mix: ['1BHK', '1BHK', '1BHK', '1BHK', '2BHK', '2BHK'], rate: 6400, seed: 37 },
      { id: 'tower-c', name: 'Tower C', prefix: 'C', floors: 14, mix: ['1BHK', '1BHK', '1BHK', '1BHK', '2BHK', '2BHK'], rate: 6550, seed: 41 }
    ]
  },
  {
    slug: 'halcyon-heights',
    featured: 2,
    project: {
      name: 'Halcyon Heights',
      type: 'Luxury residences',
      stage: 'ready',
      location: 'Sample waterfront',
      city: 'Demo city',
      developer: 'Sample developer',
      possession: 'Ready to move (sample)'
    },
    marketing: {
      tagline: 'A single 30-floor tower of 3 and 4 BHK sky residences.',
      description:
        'A fictional, completed project used to demonstrate the platform. One slender tower of 30 floors with three homes per floor: two 4 BHK residences and one 3 BHK. Every figure on this page is sample data.',
      highlights: ['One tower, 30 floors', 'Three homes per floor', '3 and 4 BHK sky residences', 'Ready to move'],
      amenities: ['Rooftop lounge', 'Lap pool', 'Concierge', 'Spa', 'Private dining room']
    },
    areas: {
      '3BHK': { carpet: 1780, builtUp: 1990, super: 2560 },
      '4BHK': { carpet: 2420, builtUp: 2700, super: 3450 }
    },
    profile: 'ready',
    towers: [{ id: 'tower-1', name: 'Tower', prefix: 'H', floors: 30, mix: ['4BHK', '4BHK', '3BHK'], rate: 16500, seed: 53 }]
  }
];

const LABELS = { '1BHK': '1 BHK', '2BHK': '2 BHK', '3BHK': '3 BHK', '4BHK': '4 BHK' };

function makeTower(t, def) {
  const rnd = mulberry32(t.seed);
  const levelsForPlate = [{ units: t.mix.map((type) => ({ type, bedrooms: bedroomsOf(type) })) }];
  const plate = plateFor({ levels: levelsForPlate, unitsPerFloor: t.mix.length, defaultBedrooms: 2 });
  const plan = buildFloorPlan(
    plate,
    t.mix.map((type) => ({ unit: null, bedrooms: bedroomsOf(type) }))
  );
  const status = PROFILES[def.profile];
  const units = [];
  for (let floor = 1; floor <= t.floors; floor += 1) {
    t.mix.forEach((type, i) => {
      const a = def.areas[type];
      const facing = plan.units[i].facing;
      const corner = facing.includes('-');
      const k = corner ? 1.02 : 1;
      const superSqft = Math.round(a.super * k);
      const premium = (corner ? 150 : 0) + (facing.startsWith('North') ? 100 : 0);
      const rate = t.rate + 45 * Math.max(0, floor - 2) + premium;
      units.push({
        number: `${t.prefix}-${floor}${String(i + 1).padStart(2, '0')}`,
        floor,
        type,
        status: status(rnd(), 1 - floor / t.floors),
        carpetSqft: Math.round(a.carpet * k),
        builtUpSqft: Math.round(a.builtUp * k),
        superSqft,
        price: Math.round((superSqft * rate) / 10000) * 10000,
        facing
      });
    });
  }
  return { id: t.id, name: t.name, floors: t.floors, unitsPerFloor: t.mix.length, units };
}

for (const def of PROPERTIES) {
  const towers = def.towers.map((t) => makeTower(t, def));
  const data = {
    _note:
      'FICTIONAL DEMO PROJECT. This project does not exist. Every name, unit, area, price, status and amenity in this file is sample data used to demonstrate the site, and the UI labels it as such. For a real project use real data and set "mode" to "live". See README.md.',
    mode: 'demo',
    brand: { name: 'Restate', logo: '', accent: '#c9a46a' },
    project: { ...def.project, fictional: true },
    listing: { listed: true, featured: def.featured },
    marketing: {
      ...def.marketing,
      // poster.jpg: a still of this project's own 3D view (the homepage hero framing), captured from the
      // site. It is illustrative, like the model, and is labelled with this credit wherever it is shown.
      hero: { poster: 'poster.jpg', posterMobile: 'poster-mobile.jpg', video: null, credit: 'Illustrative 3D view · fictional project' },
      gallery: [],
      brochure: null,
      location: { address: null, lat: null, lng: null }
    },
    availabilityAsOf: '2026-11-10',
    currency: 'INR',
    areaUnit: 'sqft',
    unitTypes: Object.fromEntries(Object.keys(def.areas).map((k) => [k, { label: LABELS[k], tour: 'sample-tour' }])),
    tours: SAMPLE_TOUR,
    towers
  };
  const dir = fileURLToPath(new URL(`../public/properties/${def.slug}/`, import.meta.url));
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}property.json`, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`wrote properties/${def.slug}/property.json: ${towers.reduce((s, t) => s + t.units.length, 0)} sample units`);
  for (const t of towers) {
    const c = {};
    t.units.forEach((u) => (c[u.status] = (c[u.status] || 0) + 1));
    console.log(`  ${t.name}: ${JSON.stringify(c)}`);
  }
}
