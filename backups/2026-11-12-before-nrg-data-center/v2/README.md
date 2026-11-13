# v2 — Build Your Residence

A second, separate version of the homepage, modelled on the phase-by-phase story of
business.nrg.com/campaigns/build-your-data-center, retold for a residential project. The original
site (`src/`) is unchanged, and the two run side by side for comparison:

| | Command | Address |
|---|---|---|
| Original site | `npm run dev` | http://localhost:5173 |
| v2 | `npm run dev:v2` | http://localhost:5174 |

`npm run build:v2` writes a static build to `dist-v2/`.

## The story

One scroll over a live 3D model in the look of a crafted architectural model. The 3D follows the
scroll position continuously, and when scrolling pauses between two chapters the page glides on to
the next one, so a few scroll movements play the whole journey (and scrolling up reverses it):

1. **Entrance** (as in the reference): loading screen with Enter Site, then the start page with the
   3D in a window below.
2. **Scroll 1**: through the residence's daylit arrival gallery and out of the garden doors; the
   camera rises over the valley and settles on **the site visit** (land, roads, plot boundary,
   utilities, the planned towers in cyan glass).
3. **Scroll 2**: site preparation: grading, excavation, cranes.
4. **Scroll 3**: the towers rise floor by floor; glazing, balconies and the crown follow.
5. **Scroll 4**: the finished development: landscape, pool, clubhouse, parking, tree-lined roads.
6. Then the homes still for sale light up, and the interactive tour.
7. After the tour, white pages: Design + Approvals, Fit-Out + Handover, and the end.

## Data

The model is built from the same project file as the original site
(`public/properties/<slug>/property.json`): towers, floors, homes per floor, home types and each
home's status. Open another project with `?project=<slug>`. Company name and the enquiry form
endpoint come from `public/site.json`; with no endpoint, the form says it is not connected.

## Where things are

- `src/core/story.js`: the sections and the story clock S (what scrolling does)
- `src/core/world.js`: what the 3D shows at each S (build clock, hologram layers)
- `src/content.js`: all the words, hotspot positions, tour stops and live-window camera framings
- `src/three/`: the scene (`world/` land, roads, trees, town; `dev/` the development and its
  construction; `holo/` the holograms; `hero/` the corridor; `Director.jsx` the camera)
- `src/ui/`: the overlays, white pages and dialogs

## Quality profiles

Chosen automatically: `high` (Apple silicon and discrete graphics), `mid` (integrated laptop graphics
such as Intel Iris: lighter ambient occlusion, fewer trees), `low` (phones: their own layout and
a lighter scene). Force one with `?q=high`, `?q=mid` or `?q=low`. The shadow map only redraws while
something is being built.
