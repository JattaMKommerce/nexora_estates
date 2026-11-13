/**
 * ILLUSTRATIVE floor-plan generator.
 *
 * When a project supplies no architectural drawings, every floor is laid out with the same simple
 * rules: a double-loaded corridor, a lift/stair core on one side, and apartments whose room mix
 * follows their configuration (1 BHK, 2 BHK …). The result is plausible but generic, and the UI
 * always labels it "Illustrative layout — not an architectural drawing".
 *
 * One plan drives three views so they always agree: the 3D cut-away floor, the 2D plan drawing and
 * the apartment interior. Units are metres; the plate is centred on the origin, x runs along the
 * long facade and z across it. North is −z (up on the 2D plan).
 */

export const PLAN = {
  corridor: 2.0,
  unitDepth: 8.6, // corridor wall → facade
  coreW: 7.6,
  front: 3.0, // service zone along the corridor (kitchen, baths)
  passage: 1.1,
  balconyDepth: 1.6,
  t: { party: 0.2, int: 0.12, ext: 0.22, core: 0.3, glazing: 0.1 }
};

/** Typical frontage (metres along the facade) for each bedroom count. */
const FRONTAGE = { 0: 6.4, 1: 7.6, 2: 10.6, 3: 14.0, 4: 17.4, 5: 20.4 };

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const EPS = 1e-3;

export function bedroomsOf(type) {
  const s = String(type || '').toLowerCase();
  const m = s.match(/(\d+)\s*(bhk|bed|br\b|bedroom|rk)/) || s.match(/^\s*(\d)\s*$/);
  if (m) return clamp(Number(m[1]), 0, 5);
  if (s.includes('studio')) return 0;
  if (s.includes('penthouse')) return 4;
  if (s.includes('duplex') || s.includes('villa')) return 3;
  return null;
}

export const frontage = (bedrooms) => FRONTAGE[bedrooms ?? 2] ?? FRONTAGE[2];

function segmentsFor(W) {
  const half = W / 2;
  const cw = PLAN.coreW;
  // clockwise seen from above (north up): north row left→right, then the core row right→left
  return [
    { id: 'B', len: W, x0: -half, x1: half, dir: 1, row: 'B' },
    { id: 'AR', len: half - cw / 2, x0: cw / 2, x1: half, dir: -1, row: 'A' },
    { id: 'AL', len: half - cw / 2, x0: -half, x1: -cw / 2, dir: -1, row: 'A' }
  ];
}

/** Split the units (in number order) into the three facade segments with the least distortion. */
export function bestPartition(widths, W) {
  const segs = segmentsFor(W);
  const n = widths.length;
  const sum = (a, b) => widths.slice(a, b).reduce((x, y) => x + y, 0);
  let best = null;
  for (let i = 0; i <= n; i += 1) {
    for (let j = i; j <= n; j += 1) {
      const groups = [[0, i], [i, j], [j, n]];
      let cost = 0;
      let maxRatio = 0;
      groups.forEach(([a, b], k) => {
        const len = segs[k].len;
        if (b > a) {
          const ratio = sum(a, b) / len;
          maxRatio = Math.max(maxRatio, ratio);
          cost += len * Math.log(ratio) ** 2 * (ratio > 1 ? 2.5 : 1); // squeezing hurts more than space
        } else {
          cost += len * 0.25;
        }
      });
      if (!best || cost < best.cost - EPS) best = { cost, groups, maxRatio };
    }
  }
  return { ...best, segs };
}

/** Plate size (inside the glass line): the narrowest plate where no apartment is squeezed > 12 %. */
export function plateFor(tower) {
  const D = 2 * PLAN.unitDepth + PLAN.corridor;
  let busiest = null;
  let need = 0;
  for (const level of tower.levels) {
    const widths = level.units.map((u) => frontage(u.bedrooms ?? bedroomsOf(u.type)));
    const sum = widths.reduce((a, b) => a + b, 0);
    if (sum > need) {
      need = sum;
      busiest = widths;
    }
  }
  if (!busiest) {
    busiest = Array.from({ length: tower.unitsPerFloor }, () => frontage(tower.defaultBedrooms ?? 2));
    need = busiest.reduce((a, b) => a + b, 0);
  }
  const base = clamp((need + PLAN.coreW) / 2, 20, 64);
  for (let W = base; W <= 64; W += 0.5) {
    if (bestPartition(busiest, W).maxRatio <= 1.12) return { W, D };
  }
  return { W: base, D };
}

/* ------------------------------------------------------------------------- plan */

/**
 * @param plate   { W, D } from plateFor()
 * @param slots   [{ unit|null, bedrooms }] in unit-number order (placeholders when no data)
 */
export function buildFloorPlan(plate, slots) {
  const { W, D } = plate;
  const C = PLAN.corridor;
  const cw = PLAN.coreW;
  const half = W / 2;
  const widths = slots.map((s) => frontage(s.bedrooms));
  const sum = (a, b) => widths.slice(a, b).reduce((x, y) => x + y, 0);
  const best = bestPartition(widths, W);
  const segs = best.segs;

  const plan = { W, D, C, units: [], walls: [], services: [], rooms: [] };
  const endWindows = { [-1]: [], [1]: [] }; // window requests on the two end facades, by side

  best.groups.forEach(([a, b], k) => {
    const seg = segs[k];
    if (b <= a) {
      plan.services.push(rowRect(seg.row, seg.x0, seg.x1, plate));
      return;
    }
    const scale = seg.len / sum(a, b);
    let cursor = seg.dir > 0 ? seg.x0 : seg.x1;
    for (let i = a; i < b; i += 1) {
      const w = widths[i] * scale;
      const x0 = seg.dir > 0 ? cursor : cursor - w;
      const x1 = x0 + w;
      cursor = seg.dir > 0 ? x1 : x0;
      const unit = buildUnit(plan, plate, slots[i], i, seg.row, x0, x1, endWindows);
      plan.units.push(unit);
      // party wall towards the next unit in the segment
      if (i < b - 1) {
        const xb = seg.dir > 0 ? x1 : x0;
        const [z0, z1] = rowZ(seg.row, plate);
        plan.walls.push({ x0: xb, z0, x1: xb, z1, t: PLAN.t.party, kind: 'party', openings: [] });
      }
    }
  });

  addCoreAndShell(plan, plate, endWindows);
  return plan;
}

function rowZ(row, { D }) {
  return row === 'A' ? [PLAN.corridor / 2, D / 2] : [-D / 2, -PLAN.corridor / 2];
}

function rowRect(row, x0, x1, plate) {
  const [z0, z1] = rowZ(row, plate);
  return { x0, z0, x1, z1 };
}

/* ---------------------------------------------------------------- one apartment */

function buildUnit(plan, plate, slot, index, row, x0, x1, endWindows) {
  const { W } = plate;
  const P = PLAN;
  const w = x1 - x0;
  const d = P.unitDepth;
  const mid = (x0 + x1) / 2;
  // u = 0 at the end nearest the core / plate centre (living room there), u grows outwards.
  const su = mid < 0 ? -1 : 1;
  const sv = row === 'A' ? 1 : -1;
  const ox = su > 0 ? x0 : x1;
  const zc = sv * (P.corridor / 2);
  const farIsEnd = su > 0 ? x1 >= W / 2 - EPS : x0 <= -W / 2 + EPS;
  const nearIsEnd = su > 0 ? x0 <= -W / 2 + EPS : x1 >= W / 2 - EPS;

  const frame = { ox, zc, su, sv, w, d };
  const toPlate = (u, v) => [ox + su * u, zc + sv * v];
  const rectToPlate = (u0, v0, u1, v1) => {
    const [ax, az] = toPlate(u0, v0);
    const [bx, bz] = toPlate(u1, v1);
    return { x0: Math.min(ax, bx), z0: Math.min(az, bz), x1: Math.max(ax, bx), z1: Math.max(az, bz) };
  };

  const key = `u${index}`;
  const bedrooms = slot.bedrooms ?? 2;
  const rooms = [];
  const walls = [];
  const addRoom = (id, type, name, u0, v0, u1, v1, extra = {}) => {
    const r = { id: `${key}-${id}`, key: id, unitKey: key, type, name, local: { u0, v0, u1, v1 }, rect: rectToPlate(u0, v0, u1, v1), ...extra };
    rooms.push(r);
    return r;
  };
  /** Local wall; openings as [s0, s1, type, extra] measured from (u0,v0). */
  const addWall = (u0, v0, u1, v1, kind, openings = []) => {
    const [ax, az] = toPlate(u0, v0);
    const [bx, bz] = toPlate(u1, v1);
    const flip = ax > bx + EPS || az > bz + EPS;
    const len = Math.hypot(bx - ax, bz - az);
    const ops = openings.map(([s0, s1, type, extra = {}]) => {
      const o = flip ? { s0: len - s1, s1: len - s0 } : { s0, s1 };
      // which side of the wall the door swings into, in plate space (+1 = towards +x / +z)
      let side = extra.side;
      if (side !== undefined) {
        const alongU = Math.abs(v1 - v0) < EPS;
        side = alongU ? side * sv : side * su;
      }
      const hinge = extra.hinge !== undefined && flip ? -extra.hinge : extra.hinge;
      return { ...o, type, ...extra, side, hinge };
    });
    walls.push({
      x0: Math.min(ax, bx), z0: Math.min(az, bz), x1: Math.max(ax, bx), z1: Math.max(az, bz),
      t: P.t[kind] ?? P.t.int, kind, unitKey: key, openings: ops
    });
  };

  const df = P.front;
  const dp = P.passage;
  const vb = df + dp; // start of the bedroom zone

  // ---------------------------------------------------------------- columns
  let cols;
  if (bedrooms === 0) {
    cols = [{ kind: 'studio', u0: 0, u1: w }];
  } else {
    const shares = [1.55 + 0.08 * bedrooms];
    for (let b = 0; b < bedrooms; b += 1) shares.push(b === bedrooms - 1 ? 1.15 : 1);
    const total = shares.reduce((s, x) => s + x, 0);
    let u = 0;
    cols = shares.map((s, i) => {
      const cw = (w * s) / total;
      const c = { kind: i === 0 ? 'living' : 'bed', u0: u, u1: u + cw, bed: i };
      u += cw;
      return c;
    });
  }

  const facadeOpenings = [];
  const entryU = Math.min(1.4, cols[0].u1 - 0.8);

  if (bedrooms === 0) {
    const bathW = Math.min(2.4, w * 0.36);
    addRoom('living', 'studio', 'Living & sleeping', 0, df, w, d, { facade: true });
    addRoom('kitchen', 'kitchen', 'Kitchenette', 0, 0, w - bathW, df);
    addRoom('bath', 'bath', 'Bath', w - bathW, 0, w, df);
    addWall(w - bathW, 0, w - bathW, df, 'int', [[df - 1.0, df - 0.2, 'door', { side: -1, hinge: 1 }]]);
    facadeOpenings.push([0.4, w * 0.55, 'slider']);
  } else {
    const living = cols[0];
    addRoom('living', 'living', 'Living & dining', living.u0, 0, living.u1, d, { facade: true, zones: { dining: [0.6, df + 0.6], lounge: [df + 0.9, d] } });
    facadeOpenings.push([living.u0 + 0.35, living.u1 - 0.35, 'slider']);

    const beds = cols.slice(1);
    // bedroom zone
    beds.forEach((c, i) => {
      const master = i === beds.length - 1;
      const name = master ? (bedrooms === 1 ? 'Bedroom' : 'Master bedroom') : `Bedroom ${beds.length - i}`;
      addRoom(master ? 'master' : `bed${beds.length - i}`, master ? 'master' : 'bedroom', name, c.u0, vb, c.u1, d, { facade: true });
      if (i > 0) addWall(c.u0, vb, c.u0, d, 'int');
    });
    // passage
    addRoom('passage', 'passage', 'Passage', beds[0].u0, df, w, vb);
    // service zone: kitchen behind the first bedroom column, baths/utility behind the others
    const service = [];
    beds.forEach((c, i) => {
      if (i === 0) {
        if (bedrooms === 1) {
          const split = c.u0 + (c.u1 - c.u0) * 0.56;
          service.push({ id: 'kitchen', type: 'kitchen', name: 'Kitchen', u0: c.u0, u1: split });
          service.push({ id: 'bath', type: 'bath', name: 'Bath', u0: split, u1: c.u1 });
        } else {
          service.push({ id: 'kitchen', type: 'kitchen', name: 'Kitchen', u0: c.u0, u1: c.u1 });
        }
      } else if (i === beds.length - 1 && beds.length >= 2) {
        const split = (c.u0 + c.u1) / 2;
        if (bedrooms === 2) {
          service.push({ id: 'bath2', type: 'bath', name: 'Bath 2', u0: c.u0, u1: split });
          service.push({ id: 'bath', type: 'bath', name: 'Master bath', u0: split, u1: c.u1 });
        } else {
          service.push({ id: 'bath', type: 'bath', name: 'Master bath', u0: c.u0, u1: c.u1 });
        }
      } else if (i === 1 && bedrooms >= 4) {
        const split = c.u0 + (c.u1 - c.u0) * 0.5;
        service.push({ id: 'utility', type: 'utility', name: 'Utility', u0: c.u0, u1: split });
        service.push({ id: 'powder', type: 'bath', name: 'Powder room', u0: split, u1: c.u1 });
      } else {
        service.push({ id: `bath${i + 1}`, type: 'bath', name: `Bath ${i + 1}`, u0: c.u0, u1: c.u1 });
      }
    });
    service.forEach((s, i) => {
      addRoom(s.id, s.type, s.name, s.u0, 0, s.u1, df);
      if (i > 0) addWall(s.u0, 0, s.u0, df, 'int');
    });

    // living | rest: open to the kitchen and the passage
    const kitchenOpen = [0.55, Math.min(df - 0.25, 1.95), 'opening'];
    // passage opening kept clear of the 12 cm walls that meet it (no coplanar faces in the reveal)
    addWall(living.u1, 0, living.u1, d, 'int', [kitchenOpen, [df + 0.08, vb - 0.08, 'opening']]);
    // service | passage: bath and utility doors
    addWall(
      beds[0].u0, df, w, df, 'int',
      service
        .filter((s) => s.type !== 'kitchen')
        .map((s) => {
          const mid = (s.u0 + s.u1) / 2 - beds[0].u0;
          const dw = Math.min(0.8, s.u1 - s.u0 - 0.5);
          return [mid - dw / 2, mid + dw / 2, 'door', { side: -1, hinge: -1 }];
        })
    );
    // passage | bedrooms: bedroom doors near the living-room end of each bedroom
    addWall(
      beds[0].u0, vb, w, vb, 'int',
      beds.map((c) => {
        const s0 = c.u0 - beds[0].u0 + 0.35;
        return [s0, s0 + 0.9, 'door', { side: 1, hinge: -1 }];
      })
    );
    beds.forEach((c) => {
      const ww = Math.min(2.2, c.u1 - c.u0 - 0.8);
      const m = (c.u0 + c.u1) / 2;
      facadeOpenings.push([m - ww / 2, m + ww / 2, 'window']);
    });
  }

  // corridor wall with the entrance, and the glazed facade
  addWall(0, 0, w, 0, 'party', [[entryU - 0.5, entryU + 0.5, 'entry', { side: 1, hinge: -1 }]]);
  addWall(0, d, w, d, 'glazing', facadeOpenings);

  // end facades: windows for the rooms that touch them
  const endSide = (atFar) => (atFar ? su : -su);
  if (farIsEnd || nearIsEnd) {
    for (const r of rooms) {
      const touchesFar = farIsEnd && Math.abs(r.local.u1 - w) < EPS;
      const touchesNear = nearIsEnd && Math.abs(r.local.u0) < EPS;
      if (!touchesFar && !touchesNear) continue;
      if (r.type === 'passage' || r.type === 'bedroom' || r.type === 'master') continue;
      const { z0, z1 } = r.rect;
      const span = z1 - z0;
      const ww = r.type === 'bath' ? Math.min(0.9, span - 0.6) : Math.min(1.8, span - 0.8);
      if (ww < 0.5) continue;
      const zm = (z0 + z1) / 2;
      const side = touchesFar ? endSide(true) : endSide(false);
      endWindows[side].push({ z0: zm - ww / 2, z1: zm + ww / 2, type: 'window', high: r.type === 'bath' });
    }
  }

  // balcony off the living room
  const lc = cols[0];
  const balconyU0 = lc.u0 + 0.3;
  const balconyU1 = bedrooms === 0 ? Math.min(w - 0.3, lc.u0 + w * 0.6) : lc.u1 - 0.3;
  const balcony = addRoom('balcony', 'balcony', 'Balcony', balconyU0, d, balconyU1, d + P.balconyDepth, { outside: true });

  plan.walls.push(...walls);
  plan.rooms.push(...rooms);

  const [ex, ez] = toPlate(entryU, 0);
  return {
    key,
    index,
    unit: slot.unit,
    bedrooms,
    row,
    rect: { x0, z0: row === 'A' ? zc : -plate.D / 2, x1, z1: row === 'A' ? plate.D / 2 : zc },
    frame,
    rooms,
    balcony,
    entry: { x: ex, z: ez },
    toPlate,
    facing: facingOf(row, farIsEnd ? su : nearIsEnd ? -su : 0)
  };
}

/** Compass facing of an apartment's main glazing (north is −z). */
function facingOf(row, endSign) {
  const ns = row === 'A' ? 'South' : 'North';
  if (!endSign) return ns;
  return `${ns}-${endSign > 0 ? 'East' : 'West'}`;
}

/* ------------------------------------------------------------- core and shell */

function addCoreAndShell(plan, plate, endWindows) {
  const { W, D } = plate;
  const C = PLAN.corridor;
  const cw = PLAN.coreW;
  const t = PLAN.t;
  const z0 = C / 2;
  const z1 = D / 2;
  const x0 = -cw / 2;
  const x1 = cw / 2;

  const lobbyD = 2.2;
  const liftW = 2.1;
  const liftD = 2.1;
  const stairW = 2.9;
  plan.core = {
    rect: { x0, z0, x1, z1 },
    lobby: { x0, z0, x1, z1: z0 + lobbyD },
    lifts: [0, 1].map((i) => ({ x0: x0 + i * liftW, z0: z0 + lobbyD, x1: x0 + (i + 1) * liftW, z1: z0 + lobbyD + liftD })),
    stair: { x0: x1 - stairW, z0: z0 + lobbyD, x1, z1 },
    shaft: { x0, z0: z0 + lobbyD + liftD, x1: x1 - stairW, z1 }
  };

  const W2 = W / 2;
  const core = plan.core;
  const add = (wx0, wz0, wx1, wz1, kind, openings = []) =>
    plan.walls.push({
      x0: wx0, z0: wz0, x1: wx1, z1: wz1, t: t[kind] ?? t.int, kind,
      openings: openings.map(([s0, s1, type, extra = {}]) => ({ s0, s1, type, ...extra }))
    });

  // core side walls (party with the neighbouring apartments) and the lift / stair enclosure
  add(x0, z0, x0, z1, 'core');
  add(x1, z0, x1, z1, 'core');
  const liftDoors = core.lifts.map((l) => [l.x0 - x0 + 0.5, l.x1 - x0 - 0.5, 'lift']);
  add(x0, z0 + lobbyD, x1, z0 + lobbyD, 'core', [...liftDoors, [cw - stairW + 0.8, cw - 0.8, 'door', { side: 1, hinge: 1 }]]);
  core.lifts.slice(1).forEach((l) => add(l.x0, l.z0, l.x0, l.z1, 'core'));
  add(x0, z0 + lobbyD + liftD, x1 - stairW, z0 + lobbyD + liftD, 'core');
  add(x1 - stairW, z0 + lobbyD, x1 - stairW, z1, 'core');
  add(x0, z1, x1, z1, 'ext', [[cw - stairW + 0.6, cw - 0.6, 'window']]);

  // corridor end windows and the two end facades
  for (const side of [-1, 1]) {
    const x = side * W2;
    const ops = [...endWindows[side], { z0: -C / 2 + 0.35, z1: C / 2 - 0.35, type: 'window' }]
      .sort((a, b) => a.z0 - b.z0)
      .map((o) => ({ s0: o.z0 + D / 2, s1: o.z1 + D / 2, type: o.type, high: o.high }));
    plan.walls.push({ x0: x, z0: -D / 2, x1: x, z1: D / 2, t: t.ext, kind: 'ext', openings: ops });
  }

  // services where a row segment has no apartment
  for (const s of plan.services) {
    add(s.x0, s.z1 > 0 ? s.z0 : s.z1, s.x1, s.z1 > 0 ? s.z0 : s.z1, 'core', [[0.6, 1.5, 'door', { side: s.z1 > 0 ? 1 : -1, hinge: 1 }]]);
    add(s.x0, s.z1 > 0 ? s.z1 : s.z0, s.x1, s.z1 > 0 ? s.z1 : s.z0, 'ext');
  }

  plan.corridor = { x0: -W2, z0: -C / 2, x1: W2, z1: C / 2 };
}

/* ------------------------------------------------------------------- helpers */

export function roomArea(r) {
  return (r.rect.x1 - r.rect.x0) * (r.rect.z1 - r.rect.z0);
}

export function unitCentre(u) {
  return { x: (u.rect.x0 + u.rect.x1) / 2, z: (u.rect.z0 + u.rect.z1) / 2 };
}

/** Bounds including the balcony. */
export function unitBounds(u) {
  const b = u.balcony.rect;
  return {
    x0: Math.min(u.rect.x0, b.x0),
    z0: Math.min(u.rect.z0, b.z0),
    x1: Math.max(u.rect.x1, b.x1),
    z1: Math.max(u.rect.z1, b.z1)
  };
}

/** Walls belonging to one apartment plus the shared ones that bound it. */
export function wallsForUnit(plan, u) {
  const r = unitBounds(u);
  const pad = 0.3;
  return plan.walls.filter((wl) => {
    if (wl.unitKey === u.key) return true;
    if (wl.unitKey) return false;
    const inX = wl.x1 >= r.x0 - pad && wl.x0 <= r.x1 + pad;
    const inZ = wl.z1 >= r.z0 - pad && wl.z0 <= r.z1 + pad;
    return inX && inZ;
  });
}

/** Clip a shared wall to an apartment's extent (so the interior doesn't show neighbours' walls). */
export function clipWall(wall, bounds) {
  const horizontal = Math.abs(wall.z1 - wall.z0) < EPS;
  const a = horizontal ? Math.max(wall.x0, bounds.x0) : Math.max(wall.z0, bounds.z0);
  const b = horizontal ? Math.min(wall.x1, bounds.x1) : Math.min(wall.z1, bounds.z1);
  if (b - a < 0.05) return null;
  const start = horizontal ? wall.x0 : wall.z0;
  const shift = a - start;
  const len = b - a;
  return {
    ...wall,
    x0: horizontal ? a : wall.x0,
    x1: horizontal ? b : wall.x1,
    z0: horizontal ? wall.z0 : a,
    z1: horizontal ? wall.z1 : b,
    openings: wall.openings
      .map((o) => ({ ...o, s0: o.s0 - shift, s1: o.s1 - shift }))
      .filter((o) => o.s1 > 0.05 && o.s0 < len - 0.05)
      .map((o) => ({ ...o, s0: Math.max(0, o.s0), s1: Math.min(len, o.s1) }))
  };
}

/** Plans are deterministic, so cache them per floor. */
const cache = new Map();
export function floorPlanFor(tower, level, plate) {
  const slots = level.units.length
    ? level.units.map((u) => ({ unit: u, bedrooms: u.bedrooms ?? bedroomsOf(u.type) ?? 2 }))
    : Array.from({ length: tower.unitsPerFloor }, () => ({ unit: null, bedrooms: tower.defaultBedrooms ?? 2 }));
  const sig = `${tower.id}|${plate.W.toFixed(2)}|${slots.map((s) => `${s.unit?.id ?? '-'}:${s.bedrooms}`).join(',')}`;
  let plan = cache.get(sig);
  if (!plan) {
    plan = buildFloorPlan(plate, slots);
    if (cache.size > 200) cache.clear();
    cache.set(sig, plan);
  }
  return plan;
}
