import { useMemo } from 'react';
import { Link } from '../../router.jsx';
import { experiencePath } from '../../routes.js';
import { loadProperty } from '../../data/source.js';
import { dateLabel, formatArea, formatPrice, STATUS_LABEL } from '../../lib/format.js';
import { Failed, Loading, PageHead, Planned } from '../Layout.jsx';
import { dataNotice, placeLine, STAGE_LABEL } from '../labels.js';
import { useResource, useTitle } from '../useResource.js';
import { NotFound } from './Info.jsx';

/** Per configuration: how many, carpet range, lowest price among available homes. */
function configurations(p) {
  const by = new Map();
  for (const t of p.towers) {
    for (const l of t.levels) {
      for (const u of l.units) {
        const k = u.typeLabel || u.type || 'Residence';
        if (!by.has(k)) by.set(k, { label: k, bedrooms: u.bedrooms ?? 99, total: 0, available: 0, carpet: [], price: [] });
        const c = by.get(k);
        c.total += 1;
        if (u.status === 'available') {
          c.available += 1;
          if (u.price) c.price.push(u.price);
        }
        if (u.carpet) c.carpet.push(u.carpet);
      }
    }
  }
  return [...by.values()].sort((a, b) => a.bedrooms - b.bedrooms);
}

const range = (list, fmt) => {
  if (!list.length) return null;
  const lo = Math.min(...list);
  const hi = Math.max(...list);
  return lo === hi ? fmt(lo) : `${fmt(lo)} – ${fmt(hi)}`;
};

export default function PropertyPage({ location }) {
  const { slug } = location.params;
  const res = useResource(() => loadProperty(slug), slug);
  const p = res.data;
  useTitle(p ? p.name : res.status === 'error' ? 'Property not found' : 'Property');
  const configs = useMemo(() => (p ? configurations(p) : []), [p]);

  if (res.status === 'loading') {
    return (
      <div className="wrap">
        <Loading label="Loading the property" />
      </div>
    );
  }
  if (res.status === 'error') {
    if (res.error?.code === 'NOT_FOUND') return <NotFound message={res.error.message} />;
    return (
      <div className="wrap">
        <Failed error={res.error} onRetry={res.retry} />
      </div>
    );
  }

  const notice = dataNotice(p);
  const sample = p.mode !== 'live';
  const m = p.marketing;
  return (
    <>
      <PageHead
        eyebrow={placeLine(p) || 'Property'}
        title={p.name}
        crumbs={
          <>
            <Link to="/properties">Properties</Link> <span aria-hidden="true">/</span> <span aria-current="page">{p.name}</span>
          </>
        }
      >
        {notice && <p className="label label--notice">{notice}</p>}
        {m.tagline && <p>{m.tagline}</p>}
      </PageHead>

      <section className="section section--tight">
        <div className="wrap">
          <div className="actions">
            <Link className="button button--primary" to={experiencePath(p.slug)}>
              Explore in 3D
            </Link>
            {p.towers.length > 1 &&
              p.towers.map((t) => (
                <Link key={t.id} className="button" to={`${experiencePath(p.slug)}?tower=${encodeURIComponent(t.id)}`}>
                  {t.name} in 3D
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <h2 className="section__title">Overview</h2>
            {m.description ? <p className="prose">{m.description}</p> : <p className="muted">No description provided.</p>}
            {m.highlights.length > 0 && (
              <ul className="ticks">
                {m.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </div>
          <dl className="specs">
            <div>
              <dt>Developer</dt>
              <dd>{p.developer || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{p.type || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Stage</dt>
              <dd>{p.stage ? STAGE_LABEL[p.stage] : 'Not provided'}</dd>
            </div>
            <div>
              <dt>Possession</dt>
              <dd>{p.possession || 'Not provided'}</dd>
            </div>
            <div>
              <dt>RERA</dt>
              <dd>{p.rera || 'Not provided'}</dd>
            </div>
            <div>
              <dt>Availability as of</dt>
              <dd>{p.asOf ? dateLabel(p.asOf) : 'Not provided'}</dd>
            </div>
          </dl>
        </div>
      </section>

      {configs.length > 0 && (
        <section className="section">
          <div className="wrap">
            <h2 className="section__title">Configurations{sample && <span className="muted small"> · sample figures</span>}</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Home</th>
                    <th scope="col">Carpet area</th>
                    <th scope="col">Available</th>
                    <th scope="col">From</th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map((c) => (
                    <tr key={c.label}>
                      <th scope="row">{c.label}</th>
                      <td>{range(c.carpet, (v) => formatArea(v, p.areaUnit)) || 'Not provided'}</td>
                      <td>
                        {c.available} of {c.total}
                      </td>
                      <td>{c.price.length ? formatPrice(Math.min(...c.price), p.currency) : c.available ? 'Price on request' : 'Sold out'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <h2 className="section__title">Towers</h2>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Tower</th>
                  <th scope="col">Floors</th>
                  <th scope="col">Homes</th>
                  <th scope="col">{STATUS_LABEL.available}</th>
                  <th scope="col">{STATUS_LABEL.hold}</th>
                  <th scope="col">Booked or sold</th>
                  <th scope="col">
                    <span className="sr-only">3D</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {p.towers.map((t) => (
                  <tr key={t.id}>
                    <th scope="row">{t.name}</th>
                    <td>{t.levels.length}</td>
                    <td>{t.totals ? t.totals.total : '—'}</td>
                    <td>{t.totals ? t.totals.available : '—'}</td>
                    <td>{t.totals ? t.totals.hold : '—'}</td>
                    <td>{t.totals ? t.totals.booked + t.totals.sold : '—'}</td>
                    <td>
                      <Link to={`${experiencePath(p.slug)}?tower=${encodeURIComponent(t.id)}`}>View in 3D</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {m.amenities.length > 0 && (
        <section className="section">
          <div className="wrap">
            <h2 className="section__title">Amenities{sample && <span className="muted small"> · sample list</span>}</h2>
            <ul className="chips-list">
              {m.amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section">
        <div className="wrap">
          <Planned
            stage="Stage 6"
            items={[
              'Cinematic property hero (the developer’s film or photos when supplied)',
              'Gallery: photographs when supplied, otherwise renders labelled “Illustrative render”',
              'Location map',
              'Floor plans',
              'Available units with filters',
              'Virtual tours',
              'Enquiry form and site-visit booking (they say whether they are connected)',
              'Brochure download (when the developer supplies one)'
            ]}
          />
        </div>
      </section>
    </>
  );
}
