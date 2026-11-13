/**
 * BUILT-IN PROTOTYPE SCENE: illustrative geometry only.
 *
 * Shown at /experience/prototype (or with `?prototype=1`), or when someone chooses "View prototype tower" after the data file
 * could not be loaded. It deliberately contains NO units, prices or availability: every level has
 * `counts: null`, and the UI labels the scene as a prototype in the header badge, intro, floor
 * tags, floor panel and footer. Floors still show the illustrative layout so the plan and interior
 * views can be explored.
 */
export function createPrototypeProject() {
  const floors = 24;
  return {
    id: 'prototype',
    slug: null,
    name: 'Prototype Residence',
    location: null,
    city: null,
    developer: null,
    rera: null,
    possession: null,
    brand: { name: '', logo: '', accent: null },
    mode: 'prototype',
    source: 'prototype',
    asOf: null,
    currency: 'INR',
    areaUnit: 'sqft',
    unitTypes: {},
    tours: {},
    towers: [
      {
        id: 'prototype-tower',
        name: 'Prototype Tower',
        unitsPerFloor: 4,
        defaultBedrooms: 3,
        hasLobby: true,
        unplacedUnits: 0,
        totals: null,
        levels: Array.from({ length: floors }, (_, i) => ({ number: i + 1, units: [], counts: null, planImage: null }))
      }
    ]
  };
}
