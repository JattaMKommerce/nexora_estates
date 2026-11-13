/**
 * Eye-level viewpoints for each room of an apartment (plate coordinates), chosen the way a person
 * would naturally stand: in the doorway or the far corner, looking towards the window or the
 * room's main feature.
 */
const EYE = 1.55;
const ORDER = { living: 0, studio: 0, kitchen: 1, master: 2, bedroom: 3, bath: 4, utility: 5, balcony: 6 };

export function roomViews(pu) {
  if (!pu) return [];
  const views = [];
  for (const r of pu.rooms) {
    const { u0, v0, u1, v1 } = r.local;
    const W = u1 - u0;
    const D = v1 - v0;
    const cu = (u0 + u1) / 2;
    let p;
    let l;
    let ly = 1.2;
    switch (r.type) {
      case 'living':
        p = [u1 - 0.6, v0 + 0.85];
        l = [u0 + W * 0.3, v1 - 0.4];
        break;
      case 'studio':
        p = [u1 - 0.6, v0 + 0.5];
        l = [u0 + W * 0.3, v1 - 0.4];
        break;
      case 'bedroom':
      case 'master':
        p = [u0 + 0.7, v0 + 0.5];
        l = [u1 - 0.9, v0 + D * 0.66];
        ly = 0.9;
        break;
      case 'kitchen':
        p = [u0 - 0.8, Math.min(v1 - 0.5, 1.25)];
        l = [u1 - 0.6, v0 + 0.5];
        ly = 0.95;
        break;
      case 'bath':
      case 'utility':
        if (W < 1.3) continue;
        p = [cu + Math.min(0.25, W * 0.12), v1 - 0.45]; // just inside the door, beside the open leaf
        l = [cu - 0.1, v0 + 0.35];
        ly = 0.9;
        break;
      case 'balcony':
        p = [cu, v0 - 1.0];
        l = [cu, v1 + 8];
        ly = 1.35;
        break;
      default:
        continue;
    }
    const [px, pz] = pu.toPlate(p[0], p[1]);
    const [lx, lz] = pu.toPlate(l[0], l[1]);
    views.push({ id: r.id, name: r.name, type: r.type, pos: [px, EYE, pz], look: [lx, ly, lz] });
  }
  return views.sort((a, b) => (ORDER[a.type] ?? 9) - (ORDER[b.type] ?? 9));
}
