# Restate: property website and immersive 3D experience

A static website for selling homes, built with React, Three.js (React Three Fiber, drei, postprocessing) and GSAP. It has no backend and no database. Every page reads JSON files, and each property has its own folder.

"Restate" is a temporary brand name. All company details live in `public/site.json`, so they can be changed without touching code.

## Pages

| Route | Page |
|---|---|
| `/` | Home page: Section A (a film of the featured project, played by scrolling), then a scroll-driven story in the **live 3D building**, the portfolio and enquiries (see below) |
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

### Section A: the opening of the home page

The home page opens on calm, light paper tones. Two cards, the architect's drawing (front elevation and
a typical floor plan, drawn from the same dimensions and plan generator as the 3D model) and the empty
site, slide together and open into one full-screen view. Scrolling then plays a short film of the
featured project:

1. **Built from the ground up:** foundations, the podium, then storey by storey to the crown.
2. **Finished from the top floor down:** the homes behind the glass go from bare concrete to fitted
   out and lit, floor by floor, the camera following them down the facade.
3. **From the entrance to the sky:** at eye level on the drop-off drive, then straight up the facade.
4. **The view from the top:** a full turn above the roof, over the surrounding city.

The film is rendered from the project's own 3D model (in a soft-morning look: gentle sun, softer
shadows, lifted shadows, a light colour grade) into still frames, so it looks the same on every device
and never stalls; the page draws the frame for the scroll position on a canvas, cross-fading between
neighbours, so it plays backwards as smoothly as forwards. Frames load a sparse pass first, then fill
in, nearest to the visitor first. "Skip to the 3D tour" passes it. It is illustrative, and says so.

- Frames: `public/assets/section-a/<slug>/` (`wide/` 1600 × 900 and `tall/` 720 × 1280 for portrait
  screens, WebP, plus `drawing-*.webp` and `manifest.json` with each frame's film time).
- To render them again (for example after changing the model or a project's data): run `npm run dev`,
  then `node scripts/render-section-a.mjs --slug <slug>`. The script drives a development-only page
  (`/__render/section-a`, `src/render/RenderSectionA.jsx`, never built into the site) with headless
  Chrome; it needs Chrome and the `puppeteer-core` package, which is not a dependency of this project
  (see the script's header).
- A project without frames simply has no Section A; the page then starts with the 3D story.

### The home page story

After Section A comes a story told in the live 3D scene
(the same engine as `/experience/<slug>`), pinned to the screen while the page scrolls past six
chapters; the building stays centred in a telephoto view throughout:

1. **Opening and hero.** Once per browser session the camera flies over the featured development
   (aerial, street, up the facade) while its name, tagline and figures appear, then settles on the
   hero: the finished building, centred, with the title, the project's status and figures, "Explore
   in 3D", "Guided tour" and the three featured projects to switch between. Later visits in the
   same session get a short push-in; "Replay the intro" plays it again. "Skip intro" and "Explore
   property" are always offered. This live opening stands in for the film planned for Stage 6 and
   stays as its fallback.
2. **Construction.** Scrolling first takes the building down storey by storey ("From the ground
   up"), then builds it again: piles and raft, the podium rising out of the ground, the concrete
   frame storey by storey (with a climbing crane and safety screen) and the facade a few storeys
   behind it, the crown, the cranes taken down, and the gardens growing in. The camera rises with
   the building. Scrolling back plays it backwards exactly.
3. **Architecture.** Facade, balconies, crown and arrival, view by view, each with one of the
   project's highlights.
4. **Floor by floor.** Low, middle and high floors (always including the featured home's) open as
   cut-away models, tinted by availability, with that floor's figures from the data.
5. **Inside.** The featured home as a whole, then room by room in the furnished interior; the
   interior style can be changed.
6. **Amenities.** The project's water or garden feature, then the grounds, beside the amenities
   the project lists.

After the story come the portfolio (every project, with "View in 3D"), the enquiry and site-visit
form (see [Forms](#forms)) and the section for developers.

- **Navigation:** a chapter rail (the progress bar on phones) jumps to any chapter; "Skip to
  properties" passes the story. Scrolling is the page's own (wheel, trackpad, touch, keyboard),
  measured in pixels, so it never locks or traps the page; the 3D view never captures the wheel.
- **Full screen:** "Explore in 3D", "Explore this floor", "Explore this home", "Guided tour" and "View
  in 3D" on a card open the same scene full screen with every control. "Back to website", Escape
  or the browser's Back button return to the same scroll position, and the story picks up where it
  was.
- **Phones** get a layout of their own (portrait framing, captions in a bottom sheet, progress along
  the top, shorter chapters) and a lighter rendering profile.
- **Reduced motion:** no opening; the construction moves in whole stages with no camera movement.
- **While loading, or without WebGL,** the project's poster is shown. Rendering pauses while the
  story is scrolled out of view. Shaders are compiled before the story starts (so scrolling into a
  new chapter does not stall), and the city, site plan and reflections are kept when switching
  projects.
- The construction sequence and the 3D landscape are illustrative: they are not the project's
  schedule, engineering or landscape design, and the page says so.

The Stage 2 hero (`src/site/home/Hero3D.jsx`) is kept for the property pages (Stage 8).

`/experience/<slug>` remains the direct, shareable full-screen link (and what the other pages' "View in 3D" opens). Moving between it and the website is a full page load; the experience's styles are scoped to its root (`.app`), so the two never affect each other. Pages other than the home page do not download three.js.

The 3D experience follows **tower → floor → residence → floor plan → interior → 360° tour**, with a guided tour that plays on a visitor's first visit. All Phase 1 and Phase 2 features are unchanged.

- **Building:** the whole development (every tower of the project) in a daylight city: a real sky fading into haze, sun shadows over the streets, glass that reflects the surroundings and shows rooms behind it, landscaped grounds and neighbouring buildings. Visitors orbit and zoom, hover a floor to see its availability, filter by configuration or "available only", and choose a tower with the tabs or by clicking it.
- **Floor:** the selected level opens as a cut-away model. Each residence is tinted by status, and each one can be hovered and selected.
- **Residence:** unit number, configuration, carpet, built-up and super built-up areas, price, floor, facing and status. Missing fields say "Not provided".
- **Floor plans:** the whole floor or one residence. Drawings supplied by the developer are shown first.
- **Interior:** furnished, at full height, with three recommended interiors and a view for each room. The windows look out on the city as seen from that residence's floor.
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

The forms (the home page's enquiry and site-visit form, contact, demo) post to `forms.endpoint`. While it is `null`, every form says that it is not connected and does not pretend to send. A message counts as sent only when the server confirms it.

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

The surroundings are illustrative too. The city around a development (streets, blocks, parks, neighbouring buildings) is a generic, generated city, not a model of the real location, and the positions of a project's towers on their site are a plausible arrangement, not the developer's site plan (`src/three/city/layout.js`). Outdoor features follow the project's data: a reflecting pool, a lap pool or a central garden appears only when the amenities list names it.

The posters of the demo projects (`properties/<slug>/poster.jpg`) and the home page stills (`media/experience/*.jpg`) are screenshots of the site's own 3D view, so they are as illustrative as the model and are captioned that way ("Illustrative 3D view · fictional project"). They were captured with a headless browser (last after Stage 3) and must be re-captured whenever the 3D scene changes. A real project should supply its own photographs or renders.

## Assets

`public/assets/` holds the sky, textures, models and sample panoramas. They are all CC0 from Poly Haven; see [public/assets/CREDITS.md](public/assets/CREDITS.md). Textures are 1K, and models use WebP textures and meshopt compression. The sample panoramas are labelled in the tour as "not this property". The foliage atlas (`tex/foliage/leaves.webp`) was composed from Poly Haven leaf scans; every tree and shrub in the scene is drawn from it.

### How the 3D scene stays fast

- **Instancing:** each kind of thing (buildings, trees of one species, lamps, kerbs, floors of the other towers) is one draw call, however many there are.
- **Level of detail:** trees beyond ~250 m use a lighter canopy; buildings beyond ~900 m use a simpler facade; the city fades into haze by ~3 km.
- **Procedural facades:** windows, rooms behind the glass, balconies and road markings are drawn by shaders rather than modelled, so they cost no geometry.
- **Rendered once:** the sun's shadows are re-rendered only when something moves (a floor opening). Reflections and the view from a residence's windows are captured once and reused.
- **No compiling mid-scroll:** each view compiles all of its shaders, hidden parts and other rooms included, before it is shown (`src/three/warmup.js`), and compiled shaders are kept for the life of the page, so moving between the building and a home does not compile them again. On the home page, that move happens behind a brief dark cover, which stays closed until the new view is ready.
- **Phones and tablets** get a smaller shadow map, a smaller city, lighter reflections and a lower resolution limit (`detectQuality` in `src/lib/env.js`). Adding `?fx=0` to the address turns off the post-processing (ambient occlusion and anti-aliasing).

## Code map

| Path | Contents |
|---|---|
| `src/main.jsx`, `src/Root.jsx` | entry point; chooses the website or the 3D experience; forwards old links |
| `src/routes.js`, `src/router.jsx` | the route table (shared with the build) and a small History-API router |
| `src/site/` | the website: layout, pages, property cards, the design system (`site.css`) |
| `src/site/home/Story.jsx` | the home page story: pinned 3D view, opening, chapters and captions, chapter rail, phone layout, full-screen hand-over |
| `src/site/home/Enquiry.jsx` | the home page's enquiry and site-visit form |
| `src/site/home/Prelude.jsx`, `src/story/film.js` | Section A: the cards, the film player and its chapters |
| `src/three/story/FilmDirector.jsx`, `src/render/`, `scripts/render-section-a.mjs` | rendering Section A's frames and drawing from the 3D model |
| `src/story/script.js` | the story's chapters, construction phases and views (shared by the page and the 3D scene) |
| `src/three/warmup.js` | shader warm-up for the building and the interior, and keeping compiled shaders between views |
| `src/three/story/` | the story in 3D: `StoryDirector.jsx` (camera and build progress from the scroll), `BuildTower.jsx` (a tower under construction), `construction.js` (frame, foundations, crane) |
| `src/site/home/Hero3D.jsx` | the Stage 2 live 3D hero (preview and immersive modes, history); its `useImmersive` is used by the story |
| `src/experience/` | the 3D application (`ExperienceApp.jsx`: full screen, or embedded with `embed`) and its interface (`ui/`) |
| `src/data/` | data access (`source.js`), the property, site and catalogue models, the built-in prototype |
| `src/plan/` | illustrative floor-plan generator, furniture placement, plan → 3D geometry |
| `src/three/` | exterior scene: tower and its facade (`towerGeometry.js`, `glazing.js`), the development and its grounds (`Development.jsx`), sky, haze and sun (`Atmosphere.jsx`), reflection probes and window views, camera, cut-away floor |
| `src/three/city/` | the illustrative city: street grid and buildings (`layout.js`), facade, road and ground shaders (`materials.js`), trees (`vegetation.js`) |
| `src/interior/` | apartment interior, furniture, curtains and ceiling details (`dressing.js`), interior styles, room viewpoints |
| `src/panorama/` | 360° viewer |
| `scripts/static-site.mjs` | build plugin: generates the catalogue and one HTML file per route |
| `scripts/demo-data.mjs` | generates the three fictional demo properties |
| `docs/screenshots/` | screenshots of each view |
| `backups/` | copies of the code taken before each stage changed it (not built or served) |
# nexora_estates
