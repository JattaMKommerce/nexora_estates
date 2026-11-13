/**
 * Section A of the home page: a short film rendered from the 3D model (see FilmDirector.jsx and
 * scripts/render-section-a.mjs), played by scrolling. Shared by the renderer and the page, so the
 * captions always match the pictures. Plain data: no three.js here.
 *
 * t runs from 0 to 1 over the film:
 *   rise     the exterior is built from the ground up
 *   fitout   the homes are fitted out and lit, from the top floor down
 *   ascent   from the entrance at street level, up the facade to the roof
 *   view     the view from the top, all the way round
 */
export const FILM_CHAPTERS = [
  { id: 'rise', from: 0, to: 0.4, kicker: 'Construction', title: 'Built from the ground up', text: 'Foundations, then storey by storey to the crown.' },
  { id: 'fitout', from: 0.4, to: 0.62, kicker: 'Interiors', title: 'Finished from the top floor down', text: 'Every home fitted out and lit, floor by floor.' },
  { id: 'ascent', from: 0.62, to: 0.84, kicker: 'Arrival', title: 'From the entrance to the sky', text: 'Up the facade, from the drop-off to the roof.' },
  { id: 'view', from: 0.84, to: 1, kicker: 'The view', title: 'The view from the top', text: 'All the way round, from above the roof.' }
];

export function filmChapterAt(t) {
  return FILM_CHAPTERS.find((c) => t < c.to) || FILM_CHAPTERS[FILM_CHAPTERS.length - 1];
}

/** Where Section A's frames are, and the manifest the renderer writes next to them. */
export const filmBase = (slug) => `assets/section-a/${slug}/`;
