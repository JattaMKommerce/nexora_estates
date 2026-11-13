/**
 * The project shown in the model comes from the same data file as the original site
 * (public/properties/<slug>/property.json), so towers, floors, homes and their availability are the
 * project's own. Company settings come from public/site.json.
 */
export const SLUG = new URLSearchParams(location.search).get('project') || 'meridian-residences';

const FALLBACK_SITE = { brand: { name: 'Restate' }, forms: { endpoint: null } };

export async function loadData() {
  const base = import.meta.env.BASE_URL || '/';
  const [property, site] = await Promise.all([
    fetch(`${base}properties/${SLUG}/property.json`).then((r) => {
      if (!r.ok) throw new Error(`Project data not found (${r.status})`);
      return r.json();
    }),
    fetch(`${base}site.json`)
      .then((r) => (r.ok ? r.json() : FALLBACK_SITE))
      .catch(() => FALLBACK_SITE)
  ]);
  return { property, site, project: summarise(property) };
}

/** What the scene and the copy need from the project data. */
function summarise(p) {
  const towers = (p.towers || []).slice(0, 3).map((t) => {
    const statusAt = {};
    for (const u of t.units || []) {
      const idx = Number(String(u.number).slice(-2)) - 1; // A-1203 → home 3 on floor 12
      statusAt[`${u.floor}:${idx}`] = u.status;
    }
    const available = (t.units || []).filter((u) => u.status === 'available').length;
    return {
      id: t.id,
      name: t.name,
      floors: t.floors,
      unitsPerFloor: Math.min(4, t.unitsPerFloor || 4),
      statusAt,
      available,
      total: (t.units || []).length
    };
  });
  return {
    name: p.project?.name || 'Sample project',
    fictional: Boolean(p.project?.fictional || p.mode === 'demo'),
    amenities: p.marketing?.amenities || [],
    unitTypes: Object.values(p.unitTypes || {}).map((u) => u.label),
    towers
  };
}
