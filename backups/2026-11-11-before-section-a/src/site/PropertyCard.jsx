import { Link } from '../router.jsx';
import { experiencePath, propertyPath } from '../routes.js';
import { formatArea, formatPrice } from '../lib/format.js';
import { mediaUrl } from '../lib/paths.js';
import { dataNotice, placeLine, specLine, STAGE_LABEL } from './labels.js';

/**
 * One project in a listing, from its catalogue summary.
 * `onView3D`: on the homepage the 3D button opens the project in the live hero instead of leaving.
 */
export function PropertyCard({ p, onView3D }) {
  const notice = dataNotice(p);
  const sample = p.mode !== 'live';
  const poster = mediaUrl(p.poster);
  const specs = specLine(p);
  return (
    <article className="pcard">
      <Link className="pcard__media" to={propertyPath(p.slug)} tabIndex={-1} aria-hidden="true">
        {poster ? (
          <img src={poster} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="pcard__placeholder">Image to come</span>
        )}
        {poster && p.posterCredit && <span className="pcard__credit">{p.posterCredit}</span>}
      </Link>
      <div className="pcard__body">
        <p className="pcard__meta">
          {[p.stage ? STAGE_LABEL[p.stage] : null, placeLine(p)].filter(Boolean).join(' · ')}
        </p>
        <h3 className="pcard__name">
          <Link to={propertyPath(p.slug)}>{p.name}</Link>
        </h3>
        {p.tagline && <p className="pcard__tagline">{p.tagline}</p>}
        {specs.length > 0 && <p className="pcard__specs">{specs.join(' · ')}</p>}
        <dl className="pcard__facts">
          {p.carpetRange && (
            <div>
              <dt>Carpet area</dt>
              <dd>
                {formatArea(p.carpetRange[0], p.areaUnit)} – {formatArea(p.carpetRange[1], p.areaUnit)}
              </dd>
            </div>
          )}
          <div>
            <dt>From{sample && p.startingPrice ? ' · sample' : ''}</dt>
            <dd>{p.startingPrice ? formatPrice(p.startingPrice, p.currency) : 'Price on request'}</dd>
          </div>
          {p.units && (
            <div>
              <dt>Available{sample ? ' · sample' : ''}</dt>
              <dd>
                {p.units.available} of {p.units.total}
              </dd>
            </div>
          )}
        </dl>
        {notice && <p className="label label--notice">{notice}</p>}
        <div className="pcard__actions">
          <Link className="button button--primary" to={propertyPath(p.slug)}>
            Explore property
          </Link>
          {onView3D ? (
            <button type="button" className="button" onClick={() => onView3D(p.slug)}>
              View in 3D
            </button>
          ) : (
            <Link className="button" to={experiencePath(p.slug)}>
              View in 3D
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
