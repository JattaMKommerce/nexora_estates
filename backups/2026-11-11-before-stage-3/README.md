# Restate: property website and immersive 3D experience

A static website for selling homes, built with React, Three.js (React Three Fiber, drei, postprocessing) and GSAP. It has no backend and no database. Every page reads JSON files, and each property has its own folder.

"Restate" is a temporary brand name. All company details live in `public/site.json`, so they can be changed without touching code.

## Pages

| Route | Page |
|---|---|
| `/` | Home page. Its first section is the **live 3D building** of a featured project (see below) |
| `/properties` | All projects |
| `/properties/<slug>` | One project's website: overview, configurations, towers, amenities |
| `/experience/<slug>` | The full-screen 3D experience for that project |
| `/experience/prototype` | The built-in illustrative tower, with no inventory |
| `/projects` | Projects grouped by stage: new launch, under construction, ready to move |
| `/locations`, `/virtual-tours` | Projects by city; links into each 3D experience |
| `/about`, `/contact` | Company pages, filled from `site.json` |
| `/saas`, `/book-a-demo` | The platform for developers |
| `/login`, `/dashboard` | Reserved. They say plainly that accounts are not available in this static version |
| `/privacy`, `/terms` | Legal pages, marked "Draft · needs legal review" |

### The 3D building on the home page

The home page opens on the same 3D engine as `/experience/<slug>`, running inside the page:

- **Preview.** The featured project's building turns slowly behind the page's text. Visitors can drag it, point at floors (the rail shows availability per floor) and switch towers. The mouse wheel and vertical swipes still scroll the page. Visitors can also switch between the featured projects.
- **Immersive.** Choosing a floor, "Explore in 3D", "Guided tour", a step of "The 3D experience" section, or "View in 3D" on a card opens the same scene full screen, in place, with every control. "Back to website", Escape or the browser's Back button returns to the page where the visitor left it.
- **While loading, or without WebGL,** the project's poster (a still of its own 3D view) is shown; the hero is never blank. Rendering pauses while the hero is scrolled out of view.

`/experience/<slug>` remains the direct, shareable full-screen link (and what the other pages' "View in 3D" opens). Moving between it and the website is a full page load; the experience's styles are scoped to its root (`.app`), so the two never affect each other. Pages other than the home page do not download three.js.

The 3D experience follows **tower → floor → residence → floor plan → interior → 360° tour**, with a guided tour that plays on a visitor's first visit. All Phase 1 and Phase 2 features are unchanged.

- **Building:** a daylight scene with a real sky, reflections, shadows, ambient occlusion and a surrounding city. Visitors orbit and zoom, hover a floor to see its availability, and filter by configuration or "available only".
- **Floor:** the selected level opens as a cut-away model. Each residence is tinted by status, and each one can be hovered and selected.
- **Residence:** unit number, configuration, carpet, built-up and super built-up areas, price, floor, facing and status. Missing fields say "Not provided".
- **Floor plans:** the whole floor or one residence. Drawings supplied by the developer are shown first.
- **Interior:** furnished, at full height, with three recommended interiors and a view for each room.
- **360° tour:** panoramas with drag-to-look, zoom and room hotspots.

The brand mark in the 3D view leads back to that project's website.

```bash
npm install                  # once
npm run dev                  # http://localhost:5173
npm run build                # static site in dist/
npm run preview              # serve dist/ at http://localhost:4173
node scripts/demo-data.mjs   # regenerate the three fictional demo properties
```

## Hosting: every route works on refresh

`npm run build` writes a real HTML file for every route and every property: `dist/properties/<slug>/index.html`, `dist/experience/<slug>/index.html`, `dist/saas/index.html` and so on. Each file carries its own page title. A direct visit or a refresh therefore works on any static host, without rewrite rules. A `dist/404.html` is written too, for hosts that serve it for unknown addresses; the site then shows its own "page not found" page.

To publish, upload the contents of `dist/`. The site is built for the root of a domain. For a sub-folder, build with the folder name:

```bash
BASE_PATH=/homes/ npm run build    # site served at https://example.com/homes/
```

A property folder added after a build is not in the listings until the next build. The listings come from a catalogue generated at build time.

## URL parameters (3D experience)

| Parameter | Effect |
|---|---|
| `tower`, `floor`, `unit` | Deep link, for example `/experience/meridian-residences?tower=tower-a&floor=12&unit=A-1203`. |
| `tour=1` / `tour=0` | Forces or suppresses the automatic guided tour. By default it plays once per visitor per property. |
| `fx=0` | Switches off post-processing on very weak devices. |

Links from before the website existed, such as `/?property=<slug>&floor=…` or `/?prototype=1`, are forwarded to `/experience/…` with the same settings. A link without `property` opens `defaultProperty` from `site.json`.

## Folders: one per property (SaaS)

```
public/
  site.json                          company, contact, social links, form endpoint
  properties/
    <slug>/property.json             one project: towers, units, plans, tours, marketing
    <slug>/poster.jpg                its image for the home page hero and the cards (marketing.hero.poster)
    <slug>/…                         that project's logo, plans, panoramas, images, brochure
  media/experience/                  stills of the 3D experience used on the home page
  assets/                            shared sky, textures, models, sample panoramas
```

- The folder name is the slug used in the URLs. It may contain only `a-z`, `0-9` and `-`, and `prototype` is reserved.
- Relative paths in a property file resolve against its own folder, so properties never share or overwrite each other's files.
- `properties/index.json` (the catalogue behind listings, cards and the map) is **generated** from the property files: by the dev server on request, and by the build into `dist/`. Do not write it by hand.

### `site.json`

```jsonc
{
  "brand":   { "name": "Restate", "tagline": "…", "logo": null, "accent": "#c9a46a" },
  "company": { "legalName": null, "email": null, "phone": null, "address": null, "hours": null },
  "social":  [{ "label": "Instagram", "url": "https://…" }],
  "forms":   { "endpoint": null },           // where forms are POSTed; null = not connected
  "defaultProperty": "meridian-residences"   // opened by old root links to the 3D view
}
```

A value left `null` shows as "to be added" on the site; nothing is made up.

## Forms

The enquiry, site-visit and demo forms (built in later stages) post to `forms.endpoint`. While it is `null`, every form says that it is not connected and does not pretend to send. A message counts as sent only when the server confirms it.

## Future backend

The site is ready for an independent Node.js backend with builder accounts and a dashboard. All reads go through `src/data/source.js`, so moving from files to an API changes that one file. Suggested public endpoints, returning the same JSON shapes as today's files:

| Today (static file) | Future public API |
|---|---|
| `site.json` | `GET /api/public/site` (resolved per tenant, for example by domain) |
| `properties/index.json` | `GET /api/public/properties` (published properties only) |
| `properties/<slug>/property.json` | `GET /api/public/properties/<slug>` |
| `forms.endpoint` | `POST /api/public/enquiries` (validates and stores; returns an id) |

Private data (accounts, drafts, enquiries, anything not on the public pages) belongs behind authenticated endpoints, kept separate per builder, and never in these public reads.

## Data file

Three **fictional demo** properties ship with the site: The Meridian Residences, Linden Park and Halcyon Heights. Every name, unit, price, status and amenity in them is sample data ("mode": "demo", "project.fictional": true), and the site labels them as such everywhere.

```jsonc
{
  "mode": "live",                      // "live" | "demo" | "prototype" (geometry only)
  "brand": { "name": "Brand", "logo": "logo.svg", "accent": "#c9a46a" },
  "project": { "name": "…", "location": "…", "city": "…", "developer": "…", "possession": "…", "rera": "…",
               "type": "Residential apartments",
               "stage": "under-construction",    // "upcoming" | "under-construction" | "ready"
               "fictional": false },             // true only for made-up demo projects
  "listing": { "listed": true, "featured": 1 },  // shown in listings; order on the home page
  "marketing": {                                 // the property website; every field optional
    "tagline": "…", "description": "…", "highlights": ["…"], "amenities": ["…"],
    "hero": { "poster": "hero.jpg", "video": "film.mp4" },
    "gallery": [{ "src": "photos/1.jpg", "caption": "…", "kind": "photo" }],   // or "render"
    "brochure": "brochure.pdf",
    "location": { "address": "…", "lat": 12.97, "lng": 77.59 }
  },
  "availabilityAsOf": "2026-11-10",
  "currency": "INR",                   // INR prices are shown in lakh / crore
  "areaUnit": "sqft",                  // or "sqm"
  "unitTypes": {
    "3BHK": { "label": "3 BHK", "floorPlan": "plans/3bhk.jpg", "tour": "tour-3bhk", "interior": "models/3bhk.glb" }
  },
  "tours": {
    "tour-3bhk": {
      "title": "3 BHK show apartment",
      "scenes": [
        { "id": "living", "name": "Living room", "image": "pano/living.jpg", "yaw": 0,
          "hotspots": [{ "to": "bedroom", "yaw": 120, "pitch": -5 }] }
      ]
    }
  },
  "towers": [
    {
      "id": "tower-a", "name": "Tower A", "floors": 22, "unitsPerFloor": 4,
      "floorPlans": [{ "levels": "2-20", "image": "plans/typical.jpg", "label": "Typical floor" }],
      "units": [
        { "number": "A-1203", "floor": 12, "type": "3BHK", "status": "available",
          "carpetSqft": 1265, "builtUpSqft": 1410, "superSqft": 1840, "price": 19500000,
          "facing": "North-East", "tour": "tour-3bhk",
          "virtualTourUrl": "https://…", "floorPlan": "plans/a-1203.jpg" }
      ]
    }
  ]
}
```

- `status` is one of `available`, `hold`, `booked` or `sold`. `type` is free text; a bedroom count such as `2BHK` or `3 Bed` drives the illustrative layout.
- Optional unit fields stay empty when missing. Nothing is estimated.
- Panoramas are 2:1 equirectangular JPGs, 6000 px wide or more. `yaw` is in degrees from the image centre (positive is to the right) and `pitch` is positive upwards.
- `virtualTourUrl` (for example Matterport) opens in a new tab.
- A residence without a tour shows "No 360° tour" rather than a substitute.

### Connecting other systems

The data file is the integration point. Any system can export `properties/<slug>/property.json` on a schedule, or a future backend can serve it (see "Future backend"). Only the public listing fields above are needed.

## What is illustrative

Unless the developer supplies drawings and models, the tower massing, the floor layouts, the interiors and the furniture are **generated** (`src/plan/layout.js`, `src/plan/furnish.js`). The site labels them as illustrative ("Illustrative layout", "Illustrative interior", "not an architectural drawing"). Supplied files take precedence:

- `towers[].floorPlans[].image` and `unitTypes[].floorPlan` / `units[].floorPlan` are shown as "supplied" plan tabs.
- `unitTypes[].interior` (a GLB file) replaces the generated interior.
- `tours` replace the "No 360° tour" state.

The posters of the demo projects (`properties/<slug>/poster.jpg`) and the home page stills (`media/experience/*.jpg`) are screenshots of the site's own 3D view, so they are as illustrative as the model and are captioned that way ("Illustrative 3D view · fictional project"). They were captured with a headless browser and must be re-captured whenever the 3D scene changes (Stage 3). A real project should supply its own photographs or renders.

## Assets

`public/assets/` holds the sky, textures, models and sample panoramas. They are all CC0 from Poly Haven; see [public/assets/CREDITS.md](public/assets/CREDITS.md). Textures are 1K, and models use WebP textures and meshopt compression. The sample panoramas are labelled in the tour as "not this property".

## Code map

| Path | Contents |
|---|---|
| `src/main.jsx`, `src/Root.jsx` | entry point; chooses the website or the 3D experience; forwards old links |
| `src/routes.js`, `src/router.jsx` | the route table (shared with the build) and a small History-API router |
| `src/site/` | the website: layout, pages, property cards, the design system (`site.css`) |
| `src/site/home/Hero3D.jsx` | the home page's live 3D hero: preview, immersive mode, poster, history (Back closes it) |
| `src/experience/` | the 3D application (`ExperienceApp.jsx`: full screen, or embedded with `embed`) and its interface (`ui/`) |
| `src/data/` | data access (`source.js`), the property, site and catalogue models, the built-in prototype |
| `src/plan/` | illustrative floor-plan generator, furniture placement, plan → 3D geometry |
| `src/three/` | exterior scene: tower, site, sky and lighting, camera, cut-away floor |
| `src/interior/` | apartment interior, furniture, interior styles, room viewpoints |
| `src/panorama/` | 360° viewer |
| `scripts/static-site.mjs` | build plugin: generates the catalogue and one HTML file per route |
| `scripts/demo-data.mjs` | generates the three fictional demo properties |
| `docs/screenshots/` | screenshots of each view |
