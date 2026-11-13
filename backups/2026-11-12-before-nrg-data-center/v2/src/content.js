import { above } from './three/world/geo.js';
import { LANDMARKS } from './three/world/geo.js';
import { CLUB, PLAY } from './three/dev/layout.js';
import { ENV_RING } from './three/holo/Holo.jsx';

/**
 * All the words on the site, and where each hotspot sits in the model.
 *
 * Hotspot kinds: 'dev' = a step of developing a residence; 'platform' = what the Restate platform
 * does at that step. Platform features that do not exist yet are marked planned: true and show a
 * "Planned" tag, so the site never claims more than the product does.
 */

export const START = {
  title: ['Homes Shape', 'Our Lives.'],
  text: 'We help developers show the homes they build — from the first survey of the land to the day the keys change hands.'
};

export const HERO = {
  label: 'Explore How We Build',
  intro: {
    highlight: 'Digital twins',
    lines: ['for residential projects with Restate —', 'built to show buyers exactly', 'what they are investing in,', 'at every stage.']
  },
  second: ['From land to launch', 'to handover,', 'Restate powers', 'every step.'],
  build: { title: ['Start', 'Building', 'With Us'], text: 'See a residence come together in five simple phases.' }
};

export const NAV = {
  title: 'Build Your Residence',
  twinLabel: 'What is a digital twin?',
  twinText:
    'A digital twin is a live 3D model of your project, built from its own data: towers, floors, homes and their availability.'
};

/* --------------------------------------------------------------- model phases ---- */

export const BEATS = {
  p1: {
    badge: 'Phase 1',
    title: ['Site', 'Visit'],
    large:
      'Read the land before anything is drawn — road access, water and power, the plot boundary and what may be built on it.',
    nodes: [
      {
        title: 'Road Access',
        kind: 'dev',
        icon: 'road',
        at: [36, 9, 86],
        text: 'Confirm legal and physical access from the main road, wide enough for construction traffic and fire engines.'
      },
      {
        title: 'Water Supply',
        kind: 'dev',
        icon: 'drop',
        at: above(-170, -10, 9),
        text: 'Confirm a reliable municipal or ground-water source, and plan the connection into the site.'
      },
      {
        title: 'Power Connection',
        kind: 'dev',
        icon: 'bolt',
        at: above(LANDMARKS.substation.x, LANDMARKS.substation.z, 16),
        text: 'Check grid capacity near the plot and plan the substation and cable route that will feed the towers.'
      },
      {
        title: 'Boundary Survey',
        kind: 'dev',
        icon: 'boundary',
        at: [-84, 14, -56],
        text: 'A measured survey fixes the plot boundary, its levels and every existing feature on it.'
      },
      {
        title: 'Zoning + Height',
        kind: 'dev',
        icon: 'layers',
        at: [-35, 86, -26],
        text: 'Local rules set the land use, the floor area that may be built (FSI), the setbacks and the height limit — the planned towers are tested against them.'
      },
      {
        title: 'Neighbourhood',
        kind: 'dev',
        icon: 'pin',
        at: above(LANDMARKS.school.x, LANDMARKS.school.z, 24),
        text: 'Schools, transit and daily needs nearby are mapped — for planning, and later for buyers.'
      }
    ]
  },
  'p3-a': {
    badge: 'Phase 2',
    title: ['Construction'],
    summary: 'Mobilise the site, dig the foundations and raise the cranes.',
    nodes: [
      {
        title: 'Site Mobilisation',
        kind: 'dev',
        icon: 'truck',
        at: [58, 7, 45],
        text: 'Crews, equipment and site offices arrive; the plot is levelled, fenced and secured.'
      },
      {
        title: 'Excavation + Foundations',
        kind: 'dev',
        icon: 'dig',
        at: [-4, 3, -26],
        text: 'The basement is dug and the foundations are cast for both towers and the podium.'
      },
      {
        title: 'Tower Cranes',
        kind: 'dev',
        icon: 'crane',
        at: [-44, 30, -41],
        text: 'A crane beside each tower climbs with the structure, lifting materials floor by floor.'
      }
    ]
  },
  'p3-b': {
    summary: 'The towers rise floor by floor; glazing, balconies and the crown follow close behind.',
    nodes: [
      {
        title: 'Structure',
        kind: 'dev',
        icon: 'building',
        at: [-35, 84, -26],
        text: 'Each floor slab is cast in sequence until the towers top out.'
      },
      {
        title: 'Façade + Balconies',
        kind: 'dev',
        icon: 'facade',
        at: [50, 40, -20],
        text: 'Glazing, bronze fins and the flowing balcony edges follow a few floors behind the structure.'
      },
      {
        title: 'Clubhouse',
        kind: 'dev',
        icon: 'home',
        at: [CLUB.x, 14, CLUB.z],
        text: 'Amenities are built alongside the towers, so they are ready at handover.'
      },
      {
        title: 'Progress in 3D',
        kind: 'platform',
        planned: true,
        icon: 'cube',
        at: [-20, 40, -14],
        text: 'Share construction progress with buyers in the same 3D model they chose their home in.'
      }
    ]
  },
  p5: {
    badge: 'Phase 3',
    title: ['Ready', 'to Live'],
    large:
      'The residence is complete — two towers of homes over a landscaped podium, with a clubhouse and pool, gardens, parking and tree-lined roads.'
  },
  'p5-a': {
    summary: 'Keep selling, serving and managing — from one living model.',
    nodes: [
      {
        title: 'Live Availability',
        kind: 'platform',
        icon: 'cube',
        at: [-20, 52, -14],
        text: 'Homes still for sale glow in the model, straight from the project’s inventory data.',
        stat: 'available'
      },
      {
        title: 'Clubhouse + Pool',
        kind: 'dev',
        icon: 'home',
        at: [CLUB.x, 14, CLUB.z],
        text: 'The clubhouse, its pool and the fitness studio become the social heart of the community.'
      },
      {
        title: 'Resident Services',
        kind: 'platform',
        planned: true,
        icon: 'chat',
        at: [-35, 8, -3],
        text: 'Bookings, notices and maintenance requests, tied to each home in the model.'
      },
      {
        title: 'Resale + Rentals',
        kind: 'platform',
        planned: true,
        icon: 'key',
        at: [49, 48, -18],
        text: 'Owners can list a home with its plans and 3D views already in place.'
      }
    ]
  },
  tour: {
    badge: 'Take a tour',
    title: ['Explore Your', 'Residence'],
    small: true
  }
};

/* --------------------------------------------------------- white pages ---- */

export const PHASE2 = {
  badge: 'Behind the build',
  title: ['Design +', 'Approvals'],
  large: 'Before the first floor rises, the design is finalised and approvals are secured, so the project can launch with confidence.',
  approvalsBadge: 'Design + Approvals',
  approvals: [
    { heading: 'Master Plan', text: 'Towers, amenities, open space and circulation are arranged on the plot.' },
    { heading: 'Architecture + Structure', text: 'Floor plans, elevations and the structural system are designed and coordinated.' },
    { heading: 'Building Permit', text: 'The drawings are submitted to the local authority for approval to build within the zoning envelope.' },
    {
      heading: 'Project Registration',
      text: 'The project and its inventory of homes are registered with the real-estate regulator (for example RERA in India) before marketing.'
    },
    { heading: 'Utility + Environmental Clearances', text: 'Water, power, fire-safety and environmental clearances are obtained.' }
  ],
  breakHeading: 'Launch-ready sales tools:',
  toolsBadge: 'Restate platform',
  tools: [
    { heading: '3D Digital Twin', text: 'The whole development, modelled from the project’s data — towers, floors and every home.', img: '/media/experience/building.jpg' },
    { heading: 'Floor-by-Floor Selection', text: 'Buyers pick a tower and a floor, and see which homes are available.', img: '/media/experience/floor.jpg' },
    { heading: 'Home Plans', text: 'Each home opens as a clear, measured floor plan.', img: '/media/experience/plan.jpg' },
    { heading: 'Interior Styles', text: 'Furnished interiors in several styles help buyers picture living there.', img: '/media/experience/interior.jpg' },
    { heading: '360° Tours', text: 'Panoramic tours put buyers inside the rooms and out on the balcony.', img: '/media/experience/tour.jpg' }
  ],
  toolsNote: 'Screens from the Restate 3D experience, shown with a fictional sample project.',
  feature: {
    heading: 'Pre-Launch Sales',
    text: 'Buyers can explore, compare and shortlist homes in 3D before the ground is broken.',
    button: 'See how it works',
    deep: 'prelaunch'
  }
};

/** Live windows into the model on white pages: one framing per block. */
export const WINDOW_POSES = {
  approvals: [
    { cam: { p: [10, 430, 70], t: [0, 0, -2], fov: 26 }, layers: { boundary: 1, ghost: 1 }, B: 0 },
    { cam: { p: [150, 105, 170], t: [-2, 34, -22], fov: 30 }, layers: { ghost: 1 }, B: 0 },
    { cam: { p: [250, 170, 270], t: [0, 32, 0], fov: 30 }, layers: { env: 1, ghost: 1, boundary: 1 }, B: 0 },
    { cam: { p: [-170, 115, 205], t: [0, 40, -22], fov: 29 }, layers: { ghost: 1, units: 1 }, B: 0 },
    { cam: { p: [20, 430, 480], t: [-55, 0, -30], fov: 32 }, layers: { util: 1, boundary: 1 }, B: 0 }
  ]
};

export const PHASE4 = {
  badge: 'Behind the build',
  title: ['Fit-Out +', 'Handover'],
  large: 'Before residents move in, every home is finished, inspected and handed over with its keys.',
  image: '/media/experience/interior.jpg',
  imageAlt: 'A furnished apartment from the Restate 3D experience, seen from above with its roof removed',
  imageNote: 'From the Restate 3D experience · fictional sample project',
  toggles: ['Development', 'Restate platform'],
  rails: [
    [
      { n: '01', heading: 'Interiors + Finishes', text: 'Flooring, joinery, kitchens and bathrooms are installed in every home.' },
      { n: '02', heading: 'Services Commissioned', text: 'Lifts, power, water, fire safety and security systems are tested and switched on.' },
      { n: '03', heading: 'Occupancy Certificate', text: 'The authority inspects the completed buildings and certifies them for occupation.' },
      { n: '04', heading: 'Inspection + Snagging', text: 'Each home is inspected with its buyer, and any defects are put right.' },
      { n: '05', heading: 'Keys + Handover', text: 'Buyers receive their keys, their documents and a guide to the new home.' }
    ],
    [
      { n: '01', heading: 'Live Availability', text: 'Sold, booked and available homes update across the model as the inventory data changes.' },
      { n: '02', heading: 'Buyer Updates', text: 'Fit-out and inspection milestones shared with each buyer.', planned: true },
      { n: '03', heading: 'Digital Handover Pack', text: 'Each home’s plans, finishes and documents, kept with its place in the model.', planned: true },
      { n: '04', heading: 'Resident Onboarding', text: 'A guided first visit to the building and its amenities, in 3D.', planned: true }
    ]
  ],
  feature: {
    heading: 'Digital Handover',
    text: 'After handover, the same model can keep every home’s plans, finishes and documents in one place.',
    button: 'Learn more',
    deep: 'handover',
    planned: true
  }
};

export const TOUR_INTRO = {
  badge: 'Take a tour',
  title: ['Explore Your', 'Residence'],
  large:
    'The residence is complete. Step inside to see how everything comes together — from the homes and amenities to the gardens, the arrival and the neighbourhood.'
};

/** Tour stops: a hotspot on the overview, a camera framing, and two short notes. */
export function tourStops(project) {
  const t = project?.towers || [];
  const towerLine =
    t.length >= 2
      ? `${t[0].name} rises ${t[0].floors} floors and ${t[1].name} ${t[1].floors}, with ${t[0].unitsPerFloor} homes on every floor.`
      : t.length === 1
        ? `${t[0].name} rises ${t[0].floors} floors, with ${t[0].unitsPerFloor} homes on every floor.`
        : 'Residential towers above a landscaped podium.';
  const types = project?.unitTypes?.length ? project.unitTypes.join(', ').replace(/, ([^,]*)$/, ' and $1') : 'a range of';
  return [
    {
      id: 'towers',
      title: 'Towers + Homes',
      at: [-35, 64, -14],
      cam: { p: [-125, 92, 118], t: [-12, 46, -24], fov: 30 },
      blocks: [
        { heading: 'Two Towers', text: towerLine },
        { heading: 'Homes With Light', text: `${types} homes, with corner balconies that open them to two sides.` }
      ]
    },
    {
      id: 'garden',
      title: 'Podium Garden + Pool',
      at: [-2, 8, -16],
      cam: { p: [44, 58, 58], t: [-2, 5, -20], fov: 32 },
      blocks: [
        { heading: 'Podium Garden', text: 'A landscaped garden between the towers, raised above the drive.' },
        { heading: 'Reflecting Pool', text: 'A long, still pool at the heart of the garden.' }
      ]
    },
    {
      id: 'club',
      title: 'Clubhouse + Fitness',
      at: [CLUB.x, 13, CLUB.z],
      cam: { p: [140, 44, 112], t: [60, 6, 26], fov: 30 },
      blocks: [
        { heading: 'Clubhouse', text: 'Lounges and party rooms open onto the lawns.' },
        { heading: 'Fitness Studio', text: 'A daylit studio on the clubhouse’s upper floor.' }
      ]
    },
    {
      id: 'play',
      title: 'Children’s Play',
      at: [PLAY.x, 5, PLAY.z],
      cam: { p: [-118, 38, 104], t: [-48, 1, 30], fov: 30 },
      blocks: [
        { heading: 'Play Area', text: 'A soft-surfaced play garden in view of the lobbies.' },
        { heading: 'Green Edges', text: 'Planting along the boundary shades the paths and the play area.' }
      ]
    },
    {
      id: 'arrival',
      title: 'Arrival + Lobby',
      at: [34, 6, 6],
      cam: { p: [92, 24, 120], t: [26, 4, 0], fov: 30 },
      blocks: [
        { heading: 'Gated Arrival', text: 'One gate from the main road, with a covered drop-off at each tower.' },
        { heading: 'Double-Height Lobby', text: 'Each tower opens with a double-height entrance lobby.' }
      ]
    },
    {
      id: 'neighbourhood',
      title: 'Neighbourhood',
      at: above(LANDMARKS.school.x, LANDMARKS.school.z, 20),
      cam: { p: [560, 250, 690], t: [300, 0, 210], fov: 30 },
      blocks: [
        { heading: 'Daily Needs', text: 'A school, a station and a market within the surrounding town.' },
        { heading: 'Connected', text: 'The main road links the site to the town and across the river.' }
      ]
    }
  ];
}

/** Filled in once the project data has loaded (the camera reads it every frame). */
export const TOUR = [];

export const DEEP = {
  prelaunch: {
    title: 'Pre-Launch Sales',
    paras: [
      'Before construction starts, the Restate experience lets buyers walk through the finished development in 3D: choose a tower and a floor, see which homes are available, open each home’s plan, and look inside furnished interiors in several styles.',
      'Everything comes from the project’s own data file — towers, floors, homes, prices and availability — so the model stays in step with the sales team.',
      'The demo uses a fictional sample project.'
    ]
  },
  handover: {
    title: 'Digital Handover',
    planned: true,
    paras: [
      'Planned: after handover, each home keeps its place in the model, with its plans, finishes and documents attached — useful to owners, facility teams and future buyers.',
      'This is on the roadmap and not part of the product yet.'
    ]
  },
  twin: {
    title: 'What is a digital twin?',
    paras: [NAV.twinText]
  }
};

export const END = {
  title: ['Bring Your Next', 'Project to Life'],
  text: 'Show buyers every phase of your residence, in 3D, from your own project data.',
  note: 'Demo · The Meridian Residences is a fictional project. The 3D model is illustrative.'
};
