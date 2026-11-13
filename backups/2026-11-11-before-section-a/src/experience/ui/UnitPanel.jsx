import { bedroomsLabel, cls, formatArea, formatPrice, levelName, STATUS_LABEL } from '../../lib/format.js';
import { Icon360, IconArrowLeft, IconDoor, IconExternal, IconPlan } from './icons.jsx';
import { SourceLine } from './Hud.jsx';

const NA = <span className="na">Not provided</span>;

/**
 * Residence details. Every value comes from the data file; anything missing says "Not provided"
 * rather than being estimated. Booked / sold residences can still be viewed but are marked
 * unavailable.
 */
export function UnitPanel({ project, tower, level, pu, tour, onBack, onEnter, onPlan, onTour }) {
  const unit = pu.unit;
  const hasInventory = project.mode !== 'prototype';
  const status = hasInventory ? unit?.status || 'unknown' : 'none';
  const unavailable = status === 'booked' || status === 'sold';
  const area = (v) => (v ? formatArea(v, project.areaUnit) : NA);
  const title = unit?.number || `Home ${pu.index + 1}`;
  const type = unit?.typeLabel || bedroomsLabel(pu.bedrooms);

  return (
    <aside className="panel panel--unit" aria-labelledby="unit-title">
      <div className="panel__head">
        <p className="eyebrow">
          {tower.name} · {levelName(level.number)}
        </p>
        <h2 id="unit-title" className="display panel__title" key={pu.key}>
          {title}
        </h2>
        <p className="unit-tags">
          <span className="tag">{type}</span>
          <span className={cls('status', `status--${status}`)}>{STATUS_LABEL[status]}</span>
        </p>
      </div>

      <div className="panel__body">
        {unit ? (
          <dl className="facts">
            <div>
              <dt>Price</dt>
              <dd className="facts__price">
                {unit.price ? formatPrice(unit.price, project.currency) : NA}
                {unit.price && project.mode === 'demo' && <span className="sample">sample</span>}
              </dd>
            </div>
            <div>
              <dt>Carpet area</dt>
              <dd>{area(unit.carpet)}</dd>
            </div>
            <div>
              <dt>Built-up area</dt>
              <dd>{area(unit.builtUp)}</dd>
            </div>
            <div>
              <dt>Super built-up</dt>
              <dd>{area(unit.superBuiltUp)}</dd>
            </div>
            <div>
              <dt>Floor</dt>
              <dd>{levelName(level.number)}</dd>
            </div>
            <div>
              <dt>Facing</dt>
              <dd>{unit.facing || NA}</dd>
            </div>
          </dl>
        ) : (
          <p className="panel__note">
            Illustrative residence ({pu.facing.toLowerCase()} facing in the illustrative layout). There is no unit data, price or availability for it.
          </p>
        )}
        {unavailable && <p className="panel__note">This residence is {status}. You can still explore its layout.</p>}
      </div>

      <div className="panel__actions panel__actions--stack">
        <button type="button" className="btn btn--primary" onClick={onEnter}>
          <IconDoor /> Step inside
        </button>
        <div className="panel__row">
          <button type="button" className="btn btn--ghost" onClick={onPlan}>
            <IconPlan /> Floor plan
          </button>
          {tour ? (
            <button type="button" className="btn btn--ghost" onClick={onTour}>
              <Icon360 /> 360° tour
            </button>
          ) : (
            <button type="button" className="btn btn--ghost" disabled title="No 360° panoramas have been provided for this residence.">
              <Icon360 /> No 360° tour
            </button>
          )}
        </div>
        {unit?.virtualTourUrl && (
          <a className="btn btn--ghost" href={unit.virtualTourUrl} target="_blank" rel="noopener noreferrer">
            <IconExternal /> Open virtual tour
          </a>
        )}
        <button type="button" className="btn btn--text" onClick={onBack}>
          <IconArrowLeft /> All residences on {levelName(level.number)}
        </button>
      </div>

      <p className="panel__foot">
        <SourceLine project={project} />
        {tour?.sample && (
          <>
            <br />
            The 360° tour uses sample panoramas, not photographs of this residence.
          </>
        )}
      </p>
    </aside>
  );
}
