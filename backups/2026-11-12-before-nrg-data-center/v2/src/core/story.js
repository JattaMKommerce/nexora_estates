/**
 * The page is one scroll. The 3D follows a single "story clock" S that moves continuously with the
 * scroll position (never in jumps), so every chapter plays like a film and reverses exactly:
 *
 *   0 – 1.4   the entrance: walking through the residence's daylit arrival gallery
 *   1.4 – 2   out through the garden doors; the camera rises and reveals the site
 *             (from the top of the page, one scroll movement plays all of this)
 *   2         chapter 1, the site visit: land, roads, boundary and utilities
 *   2 – 3     site preparation: grading, excavation, cranes
 *   3 – 4     the towers rise floor by floor, the facade following
 *   4 – 5     landscape, amenities and roads complete; the camera sweeps to the finished view
 *   5 – 6     homes still for sale light up
 *   6 – 7     into the interactive tour
 * After the tour, white pages explain the design-and-approvals and handover steps in detail.
 *
 * Sections:
 * - stage: a stretch of page that moves S from stop to stop. A stop with a hold keeps S still for a
 *   moment (its hotspots stay up while you read); when scrolling pauses between stops, the page
 *   glides on to the next stop in the direction you were going.
 * - page: a white page that slides over the 3D and scrolls normally.
 *
 * Lengths are in % of the viewport height; short on purpose, so a few scroll movements play the
 * whole journey.
 */
export const SECTIONS = [
  { id: 'start', kind: 'page', phase: 0, S: [0, 0] },
  {
    id: 'hero',
    kind: 'stage',
    phase: 0,
    nav: 'light',
    stops: [{ S: 0 }, { S: 1 }],
    legs: [120],
    ease: ['lin']
  },
  {
    id: 'p1',
    kind: 'stage',
    phase: 1,
    stops: [{ S: 1 }, { S: 2, hold: 35, snap: true, beat: 'p1' }],
    legs: [110],
    ease: ['io']
  },
  {
    id: 'p3',
    kind: 'stage',
    phase: 2,
    stops: [
      { S: 2 },
      { S: 3, hold: 30, snap: true, beat: 'p3-a' },
      { S: 4, hold: 35, snap: true, beat: 'p3-b' }
    ],
    legs: [85, 110],
    ease: ['io', 'lin']
  },
  {
    id: 'p5',
    kind: 'stage',
    phase: 3,
    stops: [
      { S: 4 },
      { S: 5, hold: 35, snap: true, beat: 'p5' },
      { S: 6, hold: 35, snap: true, beat: 'p5-a' }
    ],
    legs: [95, 60],
    ease: ['io', 'io']
  },
  {
    id: 'tour',
    kind: 'stage',
    phase: 4,
    stops: [{ S: 6 }, { S: 7, hold: 40, snap: true, beat: 'tour' }],
    legs: [65],
    ease: ['io']
  },
  { id: 'p2', kind: 'page', phase: 5, S: [7, 7] },
  { id: 'p4', kind: 'page', phase: 6, S: [7, 7] },
  { id: 'end', kind: 'page', phase: 6, S: [7, 7] }
];

/** The menu, in page order. */
export const PHASES = [
  { n: 1, id: 'p1', label: 'Site Visit' },
  { n: 2, id: 'p3', label: 'Construction' },
  { n: 3, id: 'p5', label: 'Ready to Live' },
  { n: 4, id: 'tour', label: 'Virtual Tour' },
  { n: 5, id: 'p2', label: 'Design + Approvals' },
  { n: 6, id: 'p4', label: 'Fit-Out + Handover' }
];

export const sectionById = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
