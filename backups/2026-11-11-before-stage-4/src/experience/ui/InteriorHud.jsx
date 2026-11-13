import { STYLES } from '../../interior/styleData.js';
import { bedroomsLabel, cls, levelName } from '../../lib/format.js';
import { Icon360, IconArrowLeft, IconPlan, IconSofa } from './icons.jsx';

/** Interior controls: recommended styles, room navigation and the way back. */
export function InteriorHud({ project, tower, level, pu, views, room, onRoom, styleId, onStyle, onBack, onPlan, onTour, tour, touch, compact }) {
  const unit = pu.unit;
  const title = unit?.number || `Home ${pu.index + 1}`;
  const type = unit?.typeLabel || bedroomsLabel(pu.bedrooms);
  return (
    <>
      <header className="ihead">
        <button type="button" className="back-btn" onClick={onBack}>
          <IconArrowLeft />
          <span>{levelName(level.number)}</span>
        </button>
        <div className="ihead__title">
          <p className="eyebrow">
            {project.name} · {tower.name}
          </p>
          <h1 className="display">
            {title} <span>{type}</span>
          </h1>
        </div>
        <span className="badge badge--prototype" title="The layout and styling are illustrative.">
          <span className="badge__dot" aria-hidden="true" />
          {pu.unit?.interior ? 'Interior model supplied' : 'Illustrative interior'}
        </span>
      </header>

      <aside className={cls('ipanel', compact && 'ipanel--compact')} aria-label="Interior options">
        <section>
          <p className="eyebrow ipanel__label">
            <IconSofa /> Recommended interiors
          </p>
          <div className="styles">
            {STYLES.map((s) => (
              <button key={s.id} type="button" className={cls('style-card', s.id === styleId && 'is-active')} onClick={() => onStyle(s.id)} aria-pressed={s.id === styleId}>
                <span className="style-card__swatch" aria-hidden="true">
                  {s.swatch.map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </span>
                <span className="style-card__text">
                  <strong>{s.name}</strong>
                  {!compact && <span>{s.blurb}</span>}
                </span>
              </button>
            ))}
          </div>
        </section>
        {!compact && (
          <section className="ipanel__actions">
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
          </section>
        )}
        {!compact && (
          <p className="panel__foot">
            Layout, furniture and finishes are illustrative styling suggestions and are not part of the residence unless the developer states otherwise.
          </p>
        )}
      </aside>

      <nav className="rooms" aria-label="Rooms">
        <button type="button" className={cls('room-chip', room === null && 'is-active')} onClick={() => onRoom(null)}>
          Overview
        </button>
        {views.map((v) => (
          <button key={v.id} type="button" className={cls('room-chip', room === v.id && 'is-active')} onClick={() => onRoom(v.id)}>
            {v.name}
          </button>
        ))}
      </nav>

      <footer className="hint hint--interior">
        <p className="hint__controls">
          {room === null
            ? touch
              ? 'Drag to orbit · Pinch to zoom · Pick a room to step in'
              : 'Drag to orbit · Scroll to zoom · Pick a room to step in'
            : touch
              ? 'Drag to look around · Use + / − to zoom'
              : 'Drag to look around · Scroll to zoom'}
        </p>
      </footer>
    </>
  );
}

/** 360° tour controls. */
export function TourHud({ tour, sceneId, onScene, onBack, unitLabel }) {
  return (
    <>
      <header className="ihead">
        <button type="button" className="back-btn" onClick={onBack}>
          <IconArrowLeft />
          <span>{unitLabel}</span>
        </button>
        <div className="ihead__title">
          <p className="eyebrow">360° tour</p>
          <h1 className="display">{tour.title}</h1>
        </div>
        {tour.sample && (
          <span className="badge badge--demo" title={tour.credit || 'Sample panoramas'}>
            <span className="badge__dot" aria-hidden="true" />
            Sample panoramas · not this property
          </span>
        )}
      </header>
      <nav className="rooms" aria-label="Tour scenes">
        {tour.scenes.map((s) => (
          <button key={s.id} type="button" className={cls('room-chip', s.id === sceneId && 'is-active')} onClick={() => onScene(s.id)}>
            {s.name}
          </button>
        ))}
      </nav>
      <footer className="hint hint--interior">
        <p className="hint__controls">Drag to look around · Scroll or pinch to zoom · Tap a marker to move between rooms</p>
        {tour.credit && <p className="hint__note">{tour.credit}</p>}
      </footer>
    </>
  );
}
