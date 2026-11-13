import { useMemo, useState } from 'react';
import { furnishUnit } from '../../plan/furnish.js';
import { unitBounds } from '../../plan/layout.js';
import { bedroomsLabel, cls, levelName, STATUS_LABEL } from '../../lib/format.js';
import { IconClose } from './icons.jsx';

const FILL = { available: '#5aa978', hold: '#e0a23c', booked: '#9a9aa2', sold: '#86868e', unknown: '#9a9aa2', none: '#c9b28b' };
const EPS = 1e-3;

/**
 * Floor plan drawing (SVG) of the same plan the 3D views use. When the data file supplies a real
 * drawing for the level or residence type, it is offered first and labelled as supplied; the
 * generated drawing is always labelled illustrative.
 */
export function PlanView({ plan, level, tower, project, unitKey, hoveredKey, onHover, onSelect, onClose, matches }) {
  const pu = unitKey ? plan.units.find((u) => u.key === unitKey) : null;
  const unitImage = pu?.unit?.floorPlan || null;
  const levelImage = level.planImage?.src || null;
  const tabs = [
    unitImage && { id: 'unit-image', label: 'Residence plan (supplied)' },
    levelImage && { id: 'level-image', label: 'Floor plan (supplied)' },
    { id: 'floor', label: 'Floor plan' },
    pu && { id: 'unit', label: 'Residence layout' }
  ].filter(Boolean);
  const [tab, setTab] = useState(() => (unitImage ? 'unit-image' : levelImage && !pu ? 'level-image' : pu ? 'unit' : 'floor'));
  const active = tabs.find((t) => t.id === tab) ? tab : tabs[0].id;
  const hasInventory = project.mode !== 'prototype';

  const title = pu ? `${pu.unit?.number || `Home ${pu.index + 1}`} · ${pu.unit?.typeLabel || bedroomsLabel(pu.bedrooms)}` : `${levelName(level.number)} · ${tower.name}`;

  return (
    <section className="plan" aria-label="Floor plan">
      <header className="plan__head">
        <div>
          <p className="eyebrow">{pu ? `${tower.name} · ${levelName(level.number)}` : project.name}</p>
          <h2 className="display plan__title">{title}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close floor plan">
          <IconClose />
        </button>
      </header>
      {tabs.length > 1 && (
        <div className="tabs tabs--plan" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={active === t.id} className={cls('tabs__tab', active === t.id && 'is-active')} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div className="plan__body">
        {active === 'unit-image' || active === 'level-image' ? (
          <figure className="plan__figure">
            <img src={active === 'unit-image' ? unitImage : levelImage} alt={active === 'unit-image' ? 'Residence floor plan supplied by the developer' : 'Floor plan supplied by the developer'} />
            <figcaption>Drawing supplied by the developer{level.planImage?.label && active === 'level-image' ? ` · ${level.planImage.label}` : ''}.</figcaption>
          </figure>
        ) : (
          <PlanSvg
            plan={plan}
            focus={active === 'unit' ? pu : null}
            selectedKey={unitKey}
            hoveredKey={hoveredKey}
            onHover={onHover}
            onSelect={onSelect}
            hasInventory={hasInventory}
            matches={matches}
          />
        )}
      </div>
      <footer className="plan__foot">
        {active === 'floor' || active === 'unit' ? (
          <>
            <span className="stamp">Illustrative layout</span>
            <span>Generated from the residence mix for orientation only. It is not an architectural drawing and dimensions are indicative.</span>
          </>
        ) : (
          <span>Supplied drawings take precedence over the illustrative 3D layout.</span>
        )}
        {hasInventory && active === 'floor' && (
          <span className="legend legend--inline" aria-hidden="true">
            <span><i className="legend__dot legend__dot--available" />Available</span>
            <span><i className="legend__dot legend__dot--hold" />On hold</span>
            <span><i className="legend__dot legend__dot--taken" />Booked / sold</span>
          </span>
        )}
      </footer>
    </section>
  );
}

function PlanSvg({ plan, focus, selectedKey, hoveredKey, onHover, onSelect, hasInventory, matches }) {
  const box = useMemo(() => {
    if (focus) {
      const b = unitBounds(focus);
      const pad = 1.4;
      return [b.x0 - pad, b.z0 - pad, b.x1 - b.x0 + pad * 2, b.z1 - b.z0 + pad * 2];
    }
    return [-plan.W / 2 - 2.2, -plan.D / 2 - 3.2, plan.W + 4.4, plan.D + 6.4];
  }, [plan, focus]);

  const furniture = useMemo(() => plan.units.flatMap((u) => furnishUnit(u)), [plan]);
  const scale = focus ? 1 : 0.8;
  const text = (s) => s * scale * (focus ? 0.9 : 1.2);

  return (
    <svg className="plan__svg" viewBox={box.join(' ')} role="img" aria-label="Illustrative floor plan" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="tiles" width="0.6" height="0.6" patternUnits="userSpaceOnUse">
          <path d="M0 0H0.6V0.6" fill="none" stroke="#d8d2c6" strokeWidth="0.015" />
        </pattern>
        <pattern id="boards" width="2" height="0.2" patternUnits="userSpaceOnUse">
          <path d="M0 0.2H2" fill="none" stroke="#e7dfd1" strokeWidth="0.012" />
        </pattern>
      </defs>
      <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill="#f7f4ee" />

      {/* corridor and core */}
      <Rect r={plan.corridor} fill="#efebe3" />
      <Rect r={plan.core.rect} fill="#e6e1d8" />
      {plan.core.lifts.map((l, i) => (
        <g key={i}>
          <Rect r={l} fill="#dcd6cc" />
          <path d={`M${l.x0 + 0.3} ${l.z0 + 0.3}L${l.x1 - 0.3} ${l.z1 - 0.3}M${l.x1 - 0.3} ${l.z0 + 0.3}L${l.x0 + 0.3} ${l.z1 - 0.3}`} stroke="#b8b0a4" strokeWidth="0.03" />
        </g>
      ))}
      <Stair r={plan.core.stair} />
      {plan.services.map((s, i) => (
        <Rect key={i} r={s} fill="#e6e1d8" />
      ))}

      {/* rooms */}
      {plan.rooms.map((r) => {
        const wet = r.type === 'kitchen' || r.type === 'bath' || r.type === 'utility';
        return (
          <g key={r.id}>
            <Rect r={r.rect} fill={r.type === 'balcony' ? '#f0ece4' : '#fbf9f5'} />
            <Rect r={r.rect} fill={`url(#${wet ? 'tiles' : 'boards'})`} />
            {r.type === 'balcony' && <Rect r={r.rect} fill="none" stroke="#9aa6ad" strokeWidth="0.04" strokeDasharray="0.15 0.1" />}
          </g>
        );
      })}

      {/* status tint */}
      {plan.units.map((u) => {
        const status = hasInventory ? u.unit?.status || 'unknown' : 'none';
        const match = matches ? matches(u.unit) : true;
        const on = u.key === selectedKey || u.key === hoveredKey;
        if (focus && u.key !== focus.key) return <Rect key={u.key} r={u.rect} fill="#f0ede7" opacity={0.85} />;
        return <Rect key={u.key} r={u.rect} fill={on ? '#e9c27f' : FILL[status]} opacity={on ? 0.28 : match ? 0.16 : 0.04} />;
      })}

      {/* furniture outlines */}
      <g stroke="#b9b1a5" strokeWidth="0.02" fill="#ffffff" fillOpacity="0.55">
        {furniture
          .filter((f) => !['pendant', 'tv', 'art', 'mirror', 'lamp', 'upper'].includes(f.kind))
          .map((f) => (
            <rect
              key={f.id}
              x={-f.w / 2}
              y={-f.d / 2}
              width={f.w}
              height={f.d}
              rx={f.kind === 'plant' || f.kind === 'coffeeTable' ? Math.min(f.w, f.d) / 2 : 0.04}
              transform={`translate(${f.x} ${f.z}) rotate(${(-f.rot * 180) / Math.PI})`}
              fill={f.kind === 'rug' ? 'none' : undefined}
              strokeDasharray={f.kind === 'rug' ? '0.08 0.06' : undefined}
            />
          ))}
      </g>

      {/* walls */}
      {plan.walls.map((w, i) => (
        <Wall key={i} w={w} />
      ))}

      {/* labels */}
      {plan.rooms
        .filter((r) => !focus || r.unitKey === focus.key)
        .filter((r) => r.type !== 'passage')
        .map((r) => {
          const cx = (r.rect.x0 + r.rect.x1) / 2;
          const cz = (r.rect.z0 + r.rect.z1) / 2;
          const small = r.rect.x1 - r.rect.x0 < 2.2 || r.rect.z1 - r.rect.z0 < 2.2;
          if (!focus && small) return null;
          return (
            <text key={`t${r.id}`} x={cx} y={cz} className="plan__room" fontSize={text(small ? 0.26 : 0.34)} textAnchor="middle" dominantBaseline="middle">
              {r.name}
            </text>
          );
        })}
      {!focus && (
        <>
          <text x={0} y={0} className="plan__room" fontSize={text(0.34)} textAnchor="middle" dominantBaseline="middle">
            Corridor
          </text>
          <text x={(plan.core.lifts[0].x0 + plan.core.lifts[1].x1) / 2} y={plan.core.lifts[0].z1 + 0.9} className="plan__room" fontSize={text(0.26)} textAnchor="middle">
            Lifts
          </text>
          <text x={(plan.core.stair.x0 + plan.core.stair.x1) / 2} y={plan.core.stair.z1 - 0.4} className="plan__room" fontSize={text(0.26)} textAnchor="middle">
            Stairs
          </text>
          {plan.units.map((u) => {
            const status = hasInventory ? u.unit?.status || 'unknown' : 'none';
            const cx = (u.rect.x0 + u.rect.x1) / 2;
            const y = u.row === 'B' ? u.rect.z0 - 1.9 : u.rect.z1 + 2.2;
            return (
              <g key={`l${u.key}`} className="plan__unit-label">
                <text x={cx} y={y} fontSize={text(0.5)} textAnchor="middle" className="plan__unit-no">
                  {u.unit?.number || `Home ${u.index + 1}`}
                </text>
                <text x={cx} y={y + text(0.55)} fontSize={text(0.3)} textAnchor="middle" className="plan__unit-meta">
                  {(u.unit?.typeLabel || bedroomsLabel(u.bedrooms)) + (hasInventory ? ` · ${STATUS_LABEL[status]}` : '')}
                </text>
              </g>
            );
          })}
        </>
      )}

      {/* hit areas */}
      {plan.units.map((u) => (
        <rect
          key={`h${u.key}`}
          x={u.rect.x0}
          y={u.rect.z0}
          width={u.rect.x1 - u.rect.x0}
          height={u.rect.z1 - u.rect.z0}
          fill="transparent"
          className="plan__hit"
          onPointerEnter={() => onHover(u.key, true)}
          onPointerLeave={() => onHover(u.key, false)}
          onClick={() => onSelect(u.key)}
        >
          <title>{u.unit ? `${u.unit.number} · ${u.unit.typeLabel || ''}` : `Home ${u.index + 1}`}</title>
        </rect>
      ))}

      <NorthArrow x={box[0] + box[2] - 1.2} y={box[1] + 1.3} s={focus ? 0.7 : 1} />
      <ScaleBar x={box[0] + 0.8} y={box[1] + box[3] - 0.8} s={focus ? 0.7 : 1} />
    </svg>
  );
}

function Rect({ r, ...rest }) {
  return <rect x={r.x0} y={r.z0} width={Math.max(0, r.x1 - r.x0)} height={Math.max(0, r.z1 - r.z0)} {...rest} />;
}

function Stair({ r }) {
  const lines = [];
  const w = r.x1 - r.x0;
  const mid = r.x0 + w / 2;
  for (let z = r.z0 + 0.6; z < r.z1 - 1.1; z += 0.28) lines.push(z);
  return (
    <g stroke="#a9a196" strokeWidth="0.02">
      {lines.map((z) => (
        <path key={z} d={`M${r.x0 + 0.1} ${z}H${r.x1 - 0.1}`} />
      ))}
      <path d={`M${mid} ${r.z0 + 0.6}V${r.z1 - 1.1}`} strokeWidth="0.05" />
    </g>
  );
}

/** Solid wall segments, windows, glazing and door swings for one plan wall. */
function Wall({ w }) {
  const horiz = Math.abs(w.z1 - w.z0) < EPS;
  const len = horiz ? w.x1 - w.x0 : w.z1 - w.z0;
  const at = (s) => (horiz ? [w.x0 + s, w.z0] : [w.x0, w.z0 + s]);
  const seg = (s0, s1) => {
    const [a, b] = at(s0);
    const [c, d] = at(s1);
    return `M${a} ${b}L${c} ${d}`;
  };
  const color = w.kind === 'core' ? '#5d5953' : '#2c2b2e';

  if (w.kind === 'glazing') {
    const off = 0.045;
    const [nx, nz] = horiz ? [0, off] : [off, 0];
    const k = Math.max(1, Math.round(len / 1.4));
    const ticks = [];
    for (let i = 0; i <= k; i += 1) {
      const [x, z] = at((len * i) / k);
      ticks.push(`M${x - nx * 1.6} ${z - nz * 1.6}L${x + nx * 1.6} ${z + nz * 1.6}`);
    }
    const [a, b] = at(0);
    const [c, d] = at(len);
    return (
      <g stroke="#5f7f90" fill="none">
        <path d={`M${a - nx} ${b - nz}L${c - nx} ${d - nz}M${a + nx} ${b + nz}L${c + nx} ${d + nz}`} strokeWidth="0.025" />
        <path d={ticks.join('')} strokeWidth="0.05" stroke="#2c2b2e" />
      </g>
    );
  }

  const ops = [...w.openings].sort((a, b) => a.s0 - b.s0);
  const solids = [];
  let cur = 0;
  for (const o of ops) {
    if (o.s0 - cur > 0.01) solids.push([cur, o.s0]);
    cur = o.s1;
  }
  if (len - cur > 0.01) solids.push([cur, len]);

  return (
    <g>
      <path d={solids.map(([a, b]) => seg(a, b)).join('')} stroke={color} strokeWidth={w.t} strokeLinecap="square" fill="none" />
      {ops.map((o, i) => {
        if (o.type === 'window' || o.type === 'slider') {
          const off = w.t / 4;
          const [nx, nz] = horiz ? [0, off] : [off, 0];
          const [a, b] = at(o.s0);
          const [c, d] = at(o.s1);
          return (
            <path key={i} d={`M${a - nx} ${b - nz}L${c - nx} ${d - nz}M${a + nx} ${b + nz}L${c + nx} ${d + nz}M${a} ${b}L${c} ${d}`} stroke="#5f7f90" strokeWidth="0.02" fill="none" />
          );
        }
        if (o.type === 'door' || o.type === 'entry') {
          const width = o.s1 - o.s0;
          const hingeAtStart = (o.hinge ?? -1) < 0;
          const [hx, hz] = at(hingeAtStart ? o.s0 : o.s1);
          const e = horiz ? [hingeAtStart ? 1 : -1, 0] : [0, hingeAtStart ? 1 : -1];
          const side = o.side ?? 1;
          const n = horiz ? [0, side] : [side, 0];
          const A = [hx + e[0] * width, hz + e[1] * width];
          const B = [hx + n[0] * width, hz + n[1] * width];
          const sweep = e[0] * n[1] - e[1] * n[0] > 0 ? 1 : 0;
          return (
            <g key={i} fill="none" stroke="#7b746b">
              <path d={`M${hx} ${hz}L${B[0]} ${B[1]}`} strokeWidth="0.04" />
              <path d={`M${A[0]} ${A[1]}A${width} ${width} 0 0 ${sweep} ${B[0]} ${B[1]}`} strokeWidth="0.015" strokeDasharray="0.06 0.05" />
            </g>
          );
        }
        return null;
      })}
    </g>
  );
}

function NorthArrow({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="plan__north">
      <circle r="0.7" fill="none" stroke="#7b746b" strokeWidth="0.03" />
      <path d="M0 -0.55L0.22 0.25L0 0.1L-0.22 0.25Z" fill="#2c2b2e" />
      <text y="-0.85" fontSize="0.38" textAnchor="middle">
        N
      </text>
    </g>
  );
}

function ScaleBar({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="plan__scale">
      <path d="M0 0H5M0 -0.12V0.12M2.5 -0.08V0.08M5 -0.12V0.12" stroke="#2c2b2e" strokeWidth="0.04" fill="none" />
      <text x="2.5" y="-0.3" fontSize="0.32" textAnchor="middle">
        5 m (indicative)
      </text>
    </g>
  );
}
