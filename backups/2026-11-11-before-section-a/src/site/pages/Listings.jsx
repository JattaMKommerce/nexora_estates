import { Link } from '../../router.jsx';
import { experiencePath, propertyPath, prototypePath } from '../../routes.js';
import { loadCatalogue } from '../../data/source.js';
import { Failed, Loading, PageHead, Planned } from '../Layout.jsx';
import { PropertyCard } from '../PropertyCard.jsx';
import { dataNotice, STAGE_LABEL } from '../labels.js';
import { useResource, useTitle } from '../useResource.js';

function useListed() {
  const catalogue = useResource(loadCatalogue, 'catalogue');
  return { ...catalogue, list: (catalogue.data || []).filter((p) => p.listed) };
}

function CatalogueState({ c }) {
  if (c.status === 'loading') return <Loading label="Loading properties" />;
  if (c.status === 'error') return <Failed error={c.error} onRetry={c.retry} />;
  if (!c.list.length) return <p className="state">No properties are published yet.</p>;
  return null;
}

export function Properties() {
  useTitle('Properties');
  const c = useListed();
  return (
    <>
      <PageHead eyebrow="Properties" title="Homes you can explore in 3D">
        Every project on this site, with availability, floor plans and a 3D tour.
      </PageHead>
      <section className="section">
        <div className="wrap">
          <CatalogueState c={c} />
          <div className="grid">
            {c.list.map((p) => (
              <PropertyCard key={p.slug} p={p} />
            ))}
          </div>
          <Planned items={['Residence search across all projects: configuration, budget, availability, facing', 'Map and list views']} />
        </div>
      </section>
    </>
  );
}

const STAGES = ['upcoming', 'under-construction', 'ready'];

export function Projects() {
  useTitle('Projects');
  const c = useListed();
  const groups = [...STAGES.map((s) => [s, STAGE_LABEL[s]]), [null, 'Stage not given']]
    .map(([s, label]) => ({ label, items: c.list.filter((p) => (p.stage || null) === s) }))
    .filter((g) => g.items.length);
  return (
    <>
      <PageHead eyebrow="Projects" title="Developments by stage">
        New launches, projects under construction and homes ready to move into.
      </PageHead>
      <section className="section">
        <div className="wrap">
          <CatalogueState c={c} />
          {groups.map((g) => (
            <div key={g.label} className="group">
              <h2 className="group__h">{g.label}</h2>
              <div className="grid">
                {g.items.map((p) => (
                  <PropertyCard key={p.slug} p={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function Locations() {
  useTitle('Locations');
  const c = useListed();
  const cities = new Map();
  for (const p of c.list) {
    const k = p.city || 'City not given';
    if (!cities.has(k)) cities.set(k, []);
    cities.get(k).push(p);
  }
  return (
    <>
      <PageHead eyebrow="Locations" title="Where our projects are" />
      <section className="section">
        <div className="wrap">
          <CatalogueState c={c} />
          {[...cities.entries()].map(([city, items]) => (
            <div key={city} className="group">
              <h2 className="group__h">{city}</h2>
              <ul className="rows">
                {items.map((p) => (
                  <li key={p.slug} className="row">
                    <Link to={propertyPath(p.slug)}>{p.name}</Link>
                    <span className="muted">{p.location || 'Location not given'}</span>
                    <span className="muted">{p.geo ? (p.geo.sample ? 'Sample map position' : 'On the map') : 'No map position yet'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Planned items={['Map with every project, from each property’s coordinates', 'Neighbourhood and connectivity notes per project']} />
        </div>
      </section>
    </>
  );
}

export function VirtualTours() {
  useTitle('Virtual tours');
  const c = useListed();
  return (
    <>
      <PageHead eyebrow="Virtual tours" title="Step inside in 3D">
        Each experience opens full screen: choose a tower and a floor, select a residence, see its floor plan, walk through
        the interior and look around in 360°.
      </PageHead>
      <section className="section">
        <div className="wrap">
          <CatalogueState c={c} />
          <ul className="rows">
            {c.list.map((p) => (
              <li key={p.slug} className="row">
                <Link to={experiencePath(p.slug)}>{p.name} in 3D</Link>
                <span className="muted">{dataNotice(p) || 'Live data'}</span>
                <span className="muted">{p.hasTour ? 'Includes a 360° tour' : 'No 360° tour yet'}</span>
              </li>
            ))}
            <li className="row">
              <Link to={prototypePath()}>Prototype tower</Link>
              <span className="muted">Illustrative geometry only, no inventory</span>
              <span />
            </li>
          </ul>
          <Planned items={['Visual previews of tower, floor, apartment, interior and 360° steps']} />
        </div>
      </section>
    </>
  );
}
