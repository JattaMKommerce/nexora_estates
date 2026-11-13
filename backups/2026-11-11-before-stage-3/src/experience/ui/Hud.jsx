import { useEffect, useRef, useState } from 'react';
import { bedroomsLabel, cls, dateLabel, formatArea, formatPrice, initials, levelName, levelShort, plural, STATUS_LABEL } from '../../lib/format.js';
import { fullscreenSupported } from '../../lib/env.js';
import { sitePath } from '../../lib/paths.js';
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowUp,
  IconCollapse,
  IconExpand,
  IconFocus,
  IconMinus,
  IconOrbit,
  IconPlan,
  IconPlay,
  IconPlus
} from './icons.jsx';

const placeOf = (project) =>
  [project.location, project.city].filter(Boolean).join(' · ') || (project.mode === 'prototype' ? 'Illustrative scene' : '');

/* ------------------------------------------------------------------ top bar */

/** The brand mark leads back to the property's website (a full page load: it is another document). */
function BrandLink({ slug, name, children }) {
  if (!slug) return <div className="brand">{children}</div>;
  return (
    <a className="brand brand--link" href={sitePath(`properties/${slug}`)} title={`Back to the ${name} website`}>
      {children}
    </a>
  );
}

export function TopBar({ project, tower, onTower, crumbs, filters, minimal = false, onClose = null }) {
  const { name: brand, logo } = project.brand;
  const place = placeOf(project);
  return (
    <header className={cls('topbar', minimal && 'topbar--minimal')}>
      {!minimal && (
        <div className="topbar__id">
          {onClose ? (
            // Opened inside the homepage: return to the page instead of leaving it.
            <button type="button" className="topbar__close" onClick={onClose}>
              <IconArrowLeft />
              Back to website
            </button>
          ) : (
            (brand || logo) && (
              <BrandLink slug={project.slug} name={project.name}>
                {logo ? (
                  <img className="brand__logo" src={logo} alt="" />
                ) : (
                  <span className="brand__mark" aria-hidden="true">
                    {initials(brand)}
                  </span>
                )}
                {brand && <span className="brand__name">{brand}</span>}
              </BrandLink>
            )
          )}
          {place && <p className="eyebrow topbar__place">{place}</p>}
          <h1 className="display topbar__title">{project.name}</h1>
          {crumbs && crumbs.length > 1 && (
            <nav className="crumbs" aria-label="Where you are">
              {crumbs.map((c, i) => (
                <span key={c.label} className="crumbs__item">
                  {i > 0 && <span className="crumbs__sep" aria-hidden="true">/</span>}
                  {c.onClick && i < crumbs.length - 1 ? (
                    <button type="button" onClick={c.onClick}>
                      {c.label}
                    </button>
                  ) : (
                    <span aria-current={i === crumbs.length - 1 ? 'location' : undefined}>{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
      )}

      <div className="topbar__meta">
        <SourceBadge project={project} />
        {project.towers.length > 1 && onTower && (
          <div className="tabs" role="tablist" aria-label="Towers">
            {project.towers.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === tower.id}
                className={cls('tabs__tab', t.id === tower.id && 'is-active')}
                onClick={() => onTower(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
        {filters}
      </div>
    </header>
  );
}

export function SourceBadge({ project }) {
  if (project.mode === 'prototype') {
    return (
      <span className="badge badge--prototype" title="Illustrative geometry. No units, prices or availability.">
        <span className="badge__dot" aria-hidden="true" />
        Prototype · illustrative only
      </span>
    );
  }
  if (project.mode === 'demo') {
    return (
      <span className="badge badge--demo" title="Every residence, price and status on this site is sample data for demonstration.">
        <span className="badge__dot" aria-hidden="true" />
        Demo · sample data
      </span>
    );
  }
  const asOf = dateLabel(project.asOf);
  return (
    <span className="badge badge--live" title={`Availability from this site’s property data${asOf ? `, last updated ${asOf}` : ''}.`}>
      <span className="badge__dot" aria-hidden="true" />
      Availability
      {asOf && <span className="badge__time">· as of {asOf}</span>}
    </span>
  );
}

/* --------------------------------------------------------------- floor rail */

function AvailabilityBar({ counts }) {
  if (!counts) return null;
  if (!counts.total) return <span className="avail avail--empty" aria-hidden="true" />;
  const taken = counts.booked + counts.sold;
  return (
    <span className="avail" aria-hidden="true">
      {counts.available > 0 && <span className="avail__seg avail__seg--available" style={{ flexGrow: counts.available }} />}
      {counts.hold > 0 && <span className="avail__seg avail__seg--hold" style={{ flexGrow: counts.hold }} />}
      {taken > 0 && <span className="avail__seg avail__seg--taken" style={{ flexGrow: taken }} />}
    </span>
  );
}

function railLabel(level, showAvailability, matchCount) {
  const name = levelName(level.number);
  if (!showAvailability || !level.counts) return name;
  if (!level.counts.total) return `${name}, no residences listed`;
  const base = `${name}, ${level.counts.available} of ${plural(level.counts.total, 'residence')} available`;
  return matchCount === null ? base : `${base}, ${matchCount} match the filter`;
}

export function Filters({ types, filter, onFilter, compact }) {
  if (!types.length) return null;
  const set = (patch) => onFilter({ ...filter, ...patch });
  return (
    <div className={cls('filters', compact && 'filters--compact')} role="group" aria-label="Filter residences">
      <div className="chips">
        <button type="button" className={cls('chip', filter.type === 'all' && 'is-active')} onClick={() => set({ type: 'all' })}>
          All
        </button>
        {types.map((t) => (
          <button key={t.key} type="button" className={cls('chip', filter.type === t.key && 'is-active')} onClick={() => set({ type: filter.type === t.key ? 'all' : t.key })}>
            {t.label}
          </button>
        ))}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={filter.availableOnly} onChange={(e) => set({ availableOnly: e.target.checked })} />
        <span className="toggle__track" aria-hidden="true" />
        Available only
      </label>
    </div>
  );
}

export function FloorRail({ levels, selectedIndex, hoveredIndex, onHover, onSelect, showAvailability, matchCounts, filtering }) {
  const listRef = useRef(null);
  useEffect(() => {
    if (selectedIndex === null) return;
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedIndex]);

  const items = levels.map((level, index) => ({ level, index })).reverse();
  return (
    <nav className="rail" aria-label="Floors">
      <p className="rail__title">Floors</p>
      <ol className="rail__list" ref={listRef} onPointerLeave={() => onHover(null)}>
        {items.map(({ level, index }) => {
          const mc = filtering ? matchCounts[index] : null;
          return (
            <li key={level.number}>
              <button
                type="button"
                data-index={index}
                className={cls('rail__item', index === selectedIndex && 'is-selected', index === hoveredIndex && 'is-hovered', filtering && !mc && 'is-dim')}
                aria-pressed={index === selectedIndex}
                aria-label={railLabel(level, showAvailability, mc)}
                onPointerEnter={() => onHover(index, true)}
                onFocus={() => onHover(index, true)}
                onBlur={() => onHover(index, false)}
                onClick={() => onSelect(index)}
              >
                <span className="rail__num">{levelShort(level.number)}</span>
                {showAvailability && <AvailabilityBar counts={level.counts} />}
                {filtering && mc > 0 && <span className="rail__match">{mc}</span>}
              </button>
            </li>
          );
        })}
      </ol>
      {showAvailability && (
        <div className="legend" aria-hidden="true">
          <span><i className="legend__dot legend__dot--available" />Available</span>
          <span><i className="legend__dot legend__dot--hold" />On hold</span>
          <span><i className="legend__dot legend__dot--taken" />Booked</span>
        </div>
      )}
    </nav>
  );
}

/* -------------------------------------------------------------- floor panel */

export function FloorPanel({ project, tower, level, plan, index, count, onStep, onBack, onUnit, onUnitHover, hoveredKey, onPlan, matches, filters }) {
  const hasInventory = project.mode !== 'prototype';
  const c = level.counts;

  return (
    <aside className="panel" aria-labelledby="panel-title">
      <div className="panel__head">
        <p className="eyebrow">{tower.name}</p>
        <h2 id="panel-title" className="display panel__title" key={level.number}>
          {levelName(level.number)}
        </h2>
        <p className="panel__sub">
          {hasInventory && c ? (c.total ? `${c.available} of ${plural(c.total, 'residence')} available` : 'No residences listed on this level') : `${plural(plan.units.length, 'home')} · illustrative layout`}
        </p>
      </div>

      {filters}

      <div className="panel__body" aria-live="polite">
        <ul className="units">
          {plan.units.map((u) => {
            const unit = u.unit;
            const status = hasInventory ? unit?.status || 'unknown' : 'none';
            const match = matches(unit);
            return (
              <li key={u.key}>
                <button
                  type="button"
                  className={cls('unit-card', `is-${status}`, u.key === hoveredKey && 'is-hovered', !match && 'is-muted')}
                  onClick={() => onUnit(u.key)}
                  onPointerEnter={() => onUnitHover(u.key, true)}
                  onPointerLeave={() => onUnitHover(u.key, false)}
                >
                  <span className="unit-card__top">
                    <strong>{unit?.number || `Home ${u.index + 1}`}</strong>
                    <span className={cls('status', `status--${status}`)}>{STATUS_LABEL[status]}</span>
                  </span>
                  <span className="unit-card__meta">
                    {[unit?.typeLabel || bedroomsLabel(u.bedrooms), unit?.carpet ? `${formatArea(unit.carpet, project.areaUnit)} carpet` : null, unit?.facing || (!unit ? u.facing : null)]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                  {unit?.price ? <span className="unit-card__price">{formatPrice(unit.price, project.currency)}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
        {!hasInventory && <p className="panel__note">Prototype scene: residences are illustrative footprints with no units, prices or availability.</p>}
      </div>

      <div className="panel__nav">
        <button type="button" className="btn btn--ghost" onClick={() => onStep(1)} disabled={index >= count - 1}>
          <IconArrowUp /> Level above
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => onStep(-1)} disabled={index <= 0}>
          <IconArrowDown /> Level below
        </button>
      </div>
      <div className="panel__actions">
        <button type="button" className="btn btn--ghost" onClick={onPlan}>
          <IconPlan /> Floor plan
        </button>
        <button type="button" className="btn btn--primary" onClick={onBack}>
          <IconArrowLeft /> Back to building
        </button>
      </div>
      <p className="panel__foot">
        <SourceLine project={project} />
        <br />
        Layout shown is illustrative, not an architectural drawing.
      </p>
    </aside>
  );
}

export function SourceLine({ project }) {
  if (project.mode === 'prototype') return 'Prototype scene · illustrative only';
  if (project.mode === 'demo') return 'Demo property · every residence, price and status is sample data';
  const asOf = dateLabel(project.asOf);
  return asOf ? `Availability as of ${asOf}` : 'Availability from property data';
}

/* --------------------------------------------------------------------- dock */

export function Dock({ phase, autoRotate, onToggleRotate, onRecenter, onBack, onTour, tourActive, onPlan, onZoom }) {
  const [isFull, setIsFull] = useState(() => Boolean(document.fullscreenElement));
  const canFull = fullscreenSupported();
  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  const exterior = phase === 'building' || phase === 'floor';

  return (
    <div className="dock" role="toolbar" aria-label="View controls">
      {phase === 'floor' && (
        <button type="button" className="dock__btn dock__btn--text" onClick={onBack}>
          <IconArrowLeft />
          <span>All floors</span>
        </button>
      )}
      {onTour && !tourActive && (
        <button type="button" className="dock__btn" onClick={onTour} aria-label="Play the guided tour" title="Guided tour">
          <IconPlay />
        </button>
      )}
      {phase === 'floor' && onPlan && (
        <button type="button" className="dock__btn" onClick={onPlan} aria-label="Floor plan" title="Floor plan">
          <IconPlan />
        </button>
      )}
      {exterior && (
        <button type="button" className="dock__btn" onClick={onRecenter} aria-label="Recenter view" title="Recenter view">
          <IconFocus />
        </button>
      )}
      {phase === 'building' && (
        <button
          type="button"
          className="dock__btn"
          onClick={onToggleRotate}
          aria-pressed={autoRotate}
          aria-label={autoRotate ? 'Stop auto-orbit' : 'Start auto-orbit'}
          title={autoRotate ? 'Stop auto-orbit' : 'Auto-orbit'}
        >
          <IconOrbit />
        </button>
      )}
      {onZoom && (
        <>
          <button type="button" className="dock__btn" onClick={() => onZoom(-1)} aria-label="Zoom in" title="Zoom in">
            <IconPlus />
          </button>
          <button type="button" className="dock__btn" onClick={() => onZoom(1)} aria-label="Zoom out" title="Zoom out">
            <IconMinus />
          </button>
        </>
      )}
      {canFull && (
        <button
          type="button"
          className="dock__btn"
          onClick={toggleFull}
          aria-label={isFull ? 'Exit full screen' : 'Full screen'}
          title={isFull ? 'Exit full screen' : 'Full screen'}
        >
          {isFull ? <IconCollapse /> : <IconExpand />}
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- hint bar */

export function HintBar({ project, touch, showControls, phase }) {
  const note =
    project.mode === 'prototype'
      ? 'Prototype scene · illustrative geometry · no inventory data.'
      : project.mode === 'demo'
        ? 'Demo property with sample data. 3D massing and layouts are illustrative, not architectural drawings.'
        : 'Illustrative 3D massing and layouts generated from the property data. Not an architectural representation.';
  const controls =
    phase === 'floor'
      ? touch
        ? 'Tap a residence · Drag to orbit · Pinch to zoom'
        : 'Click a residence · Drag to orbit · Scroll to zoom'
      : touch
        ? 'Drag to orbit · Pinch to zoom · Tap a floor'
        : 'Drag to orbit · Scroll to zoom · Right-drag to pan · Click a floor';
  return (
    <footer className="hint">
      {showControls && <p className="hint__controls">{controls}</p>}
      <p className="hint__note">{note}</p>
    </footer>
  );
}

/* -------------------------------------------------------------------- intro */

/** Keeps an element mounted for `ms` after `show` turns false so it can fade out. */
export function usePresence(show, ms = 900) {
  const [mounted, setMounted] = useState(show);
  useEffect(() => {
    if (show) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), ms);
    return () => clearTimeout(t);
  }, [show, ms]);
  return { mounted: show || mounted, leaving: !show && mounted };
}

export function IntroOverlay({ project, tower, onSkip, leaving, skipLabel = 'Skip intro' }) {
  const isProto = project.mode === 'prototype';
  const levels = tower.levels.length;
  const towers = project.towers.length;
  const parts = [];
  if (towers > 1) parts.push(plural(towers, 'tower'));
  parts.push(plural(levels, 'level'));
  if (!isProto && tower.totals && tower.totals.total > 0) parts.push(`${tower.totals.available} residences available`);
  if (isProto) parts.push('Prototype scene');
  if (project.mode === 'demo') parts.push('Demo data');

  return (
    <div className={cls('intro', leaving && 'is-leaving')}>
      <div className="intro__inner">
        <p className="eyebrow intro__eyebrow">{placeOf(project) || tower.name}</p>
        <h1 className="display intro__title">{project.name}</h1>
        <p className="intro__meta">{parts.join(' · ')}</p>
      </div>
      {onSkip && (
        <button type="button" className="intro__skip" onClick={onSkip}>
          {skipLabel}
        </button>
      )}
    </div>
  );
}
