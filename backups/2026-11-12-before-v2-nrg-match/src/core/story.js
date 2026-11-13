/**
 * The page is one long scroll. The 3D model behind it follows a single "story clock" S:
 *
 *   0 – 2.9   hero: walking down the corridor of a finished residence
 *   ~3        the camera steps out into daylight above the finished development
 *   3.3 – 3.9 the development rewinds to bare land
 *   4 – 8     Phase 1, site evaluation (holograms on the land)
 *   8 → 9     (behind the white Phase 2 page)
 *   9 – 12    Phase 3, construction: the towers rise floor by floor
 *   12 → 13   (behind the white Phase 4 page)
 *   13 – 14   Phase 5, ready to live
 *   15        the virtual tour
 *
 * Sections come in two kinds:
 * - stage: a transparent stretch of page; scrolling moves S from stop to stop. Each stop can hold
 *   (S stays still while you read) and snap (the page settles there).
 * - page: a white page that slides over the 3D. While it covers the screen, S moves from S[0] to
 *   S[1] (during the element marked data-cover, or the whole page).
 *
 * Lengths are in % of the viewport height.
 */
export const SECTIONS = [
  { id: 'start', kind: 'page', phase: 0, S: [0, 0] },
  {
    id: 'hero',
    kind: 'stage',
    phase: 0,
    nav: 'light',
    stops: [{ S: 0 }, { S: 1 }, { S: 2, hold: 80, snap: true, beat: 'hero-build' }],
    legs: [115, 125],
    ease: ['lin', 'out']
  },
  {
    id: 'p1',
    kind: 'stage',
    phase: 1,
    stops: [
      { S: 2 },
      { S: 4, hold: 80, snap: true, beat: 'p1-intro' },
      { S: 5, hold: 95, snap: true, beat: 'p1-a' },
      { S: 6, hold: 95, snap: true, beat: 'p1-b' },
      { S: 7, hold: 95, snap: true, beat: 'p1-c' },
      { S: 8, hold: 80, snap: true, beat: 'p1-exit' }
    ],
    legs: [260, 130, 130, 130, 125],
    ease: ['lin', 'io', 'io', 'io', 'io']
  },
  { id: 'p2', kind: 'page', phase: 2, S: [8, 9] },
  {
    id: 'p3',
    kind: 'stage',
    phase: 3,
    stops: [
      { S: 9, hold: 80, snap: true, beat: 'p3-intro' },
      { S: 10, hold: 95, snap: true, beat: 'p3-a' },
      { S: 11, hold: 95, snap: true, beat: 'p3-b' },
      { S: 12, hold: 80, snap: true, beat: 'p3-exit' }
    ],
    legs: [170, 300, 150],
    ease: ['io', 'lin', 'io']
  },
  { id: 'p4', kind: 'page', phase: 4, S: [12, 13] },
  {
    id: 'p5',
    kind: 'stage',
    phase: 5,
    stops: [
      { S: 13, hold: 80, snap: true, beat: 'p5-intro' },
      { S: 14, hold: 95, snap: true, beat: 'p5-a' }
    ],
    legs: [150],
    ease: ['io']
  },
  { id: 'tourIntro', kind: 'page', phase: 6, S: [14, 15] },
  {
    id: 'tour',
    kind: 'stage',
    phase: 6,
    stops: [{ S: 15, hold: 60, snap: true, beat: 'tour' }],
    legs: [],
    ease: []
  },
  { id: 'end', kind: 'page', phase: 6, S: [15, 15] }
];

export const PHASES = [
  { n: 1, id: 'p1', label: 'Site Evaluation' },
  { n: 2, id: 'p2', label: 'Design + Approvals' },
  { n: 3, id: 'p3', label: 'Construction' },
  { n: 4, id: 'p4', label: 'Fit-Out + Handover' },
  { n: 5, id: 'p5', label: 'Ready to Live' },
  { n: 6, id: 'tourIntro', label: 'Virtual Tour' }
];

export const sectionById = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
