import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useProperty } from '../data/useProperty.js';
import { CROWN_H, FLOOR_H, towerDims } from '../three/towerGeometry.js';
import { layoutDevelopment } from '../three/city/layout.js';
import { floorPlanFor, plateFor } from '../plan/layout.js';
import { PlanSvg } from '../experience/ui/PlanView.jsx';

const ExperienceApp = lazy(() => import('../experience/ExperienceApp.jsx'));

/**
 * Development only (never built into the site): the page scripts/render-section-a.mjs drives to
 * render Section A of the home page from the 3D model.
 *
 *   /__render/section-a?slug=<slug>&mode=frames            the film, one frame per `window.__film.set(t)`
 *   /__render/section-a?slug=<slug>&mode=drawing&layout=tall|wide   the architect's drawing card
 */
export default function RenderSectionA() {
  const q = new URLSearchParams(window.location.search);
  const slug = q.get('slug') || 'meridian-residences';
  return q.get('mode') === 'drawing' ? <DrawingSheet slug={slug} layout={q.get('layout') || 'tall'} /> : <Frames slug={slug} />;
}

function Frames({ slug }) {
  const story = useRef({
    film: { t: 0, done: null },
    scroll: { chapter: 'hero', progress: 0 },
    opening: { state: 'done', variant: 'short', n: 0 },
    reduced: false,
    compact: false,
    offset: { x: 0, y: 0 }
  });
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    window.__film = {
      status,
      set: (t) => {
        story.current.film.t = t;
      },
      done: () => story.current.film.done
    };
  }, [status]);
  const embed = useMemo(
    () => ({
      immersive: false,
      active: true,
      story,
      look: 'morning',
      render: true,
      onStatus: setStatus,
      storyTarget: { view: 'exterior', floor: null, room: null, style: 'warm' }
    }),
    []
  );
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#e9e6df' }}>
      <Suspense fallback={null}>
        <ExperienceApp slug={slug} embed={embed} />
      </Suspense>
    </div>
  );
}

/* ------------------------------------------------------------------ drawing */

const PAPER = '#f5f1e9';
const INK = '#3d4245';

function DrawingSheet({ slug, layout }) {
  const { project } = useProperty({ slug });
  const model = useMemo(() => {
    if (!project?.towers?.length) return null;
    const list = project.towers.map((t) => ({ id: t.id, dims: towerDims(t) }));
    const dev = layoutDevelopment(list);
    const t0 = project.towers[0];
    const level = t0.levels[Math.floor(t0.levels.length / 2)];
    const plan = floorPlanFor(t0, level, plateFor(t0));
    return { dev, plan, tower: t0, level };
  }, [project]);
  useEffect(() => {
    if (model) document.fonts.ready.then(() => requestAnimationFrame(() => (window.__drawingReady = true)));
  }, [model]);
  if (!model) return null;
  const tall = layout === 'tall';
  return (
    <div className="sheet" style={{ position: 'fixed', inset: 0, background: PAPER, display: 'grid', gridTemplate: tall ? '1.75fr 1fr auto / 1fr' : '1fr auto / 1.15fr 1fr', padding: tall ? '5.5% 6% 4.5%' : '5% 4.5% 4%', gap: tall ? '2.5%' : '2% 4%', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: INK }}>
      <style>{`
        .sheet .plan__svg { width: 100%; height: 100%; display: block; }
        .sheet .plan__svg > rect:first-of-type { fill: ${PAPER}; }
        .sheet .plan__svg text { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .sheet .plan__room { fill: #7d776c; font-weight: 600; letter-spacing: 0.02em; }
        .sheet .plan__unit-no { fill: #2a2a27; font-family: 'Cormorant Garamond', serif !important; font-weight: 700; }
        .sheet .plan__unit-meta { fill: #6f695f; }
        .sheet .plan__hit { display: none; }
      `}</style>
      <div style={{ minHeight: 0, gridColumn: tall ? 'auto' : '1', gridRow: tall ? 'auto' : '1' }}>
        <Elevation dev={model.dev} />
      </div>
      <div style={{ minHeight: 0, borderTop: tall ? `1px solid ${INK}22` : 'none', borderLeft: tall ? 'none' : `1px solid ${INK}22`, paddingTop: tall ? '3%' : 0, paddingLeft: tall ? 0 : '6%' }}>
        <PlanSvg plan={model.plan} focus={null} selectedKey={null} hoveredKey={null} onHover={() => {}} onSelect={() => {}} hasInventory={false} matches={null} />
      </div>
      <div style={{ gridColumn: tall ? 'auto' : '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: `1px solid ${INK}33`, paddingTop: tall ? '2.2%' : '1.6%', fontSize: tall ? 22 : 18, letterSpacing: '0.04em' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: tall ? 36 : 28, fontWeight: 500, letterSpacing: 0 }}>{project.name}</span>
        <span style={{ textTransform: 'uppercase', fontSize: tall ? 15 : 13, letterSpacing: '0.18em', color: '#6f7c70' }}>Front elevation · Typical floor · Illustrative</span>
      </div>
    </div>
  );
}

/** The development's front (south) elevation, drawn from the same dimensions as the 3D model. */
function Elevation({ dev }) {
  const maxH = Math.max(...dev.towers.map((t) => t.dims.height));
  const left = Math.min(...dev.towers.map((t) => t.x - t.dims.outerW / 2)) - 14;
  const right = Math.max(...dev.towers.map((t) => t.x + t.dims.outerW / 2)) + 20;
  const vb = [left, -maxH - 6, right - left, maxH + 12];
  const tallest = dev.towers.reduce((a, b) => (b.dims.height > a.dims.height ? b : a));
  const trees = [];
  for (let x = left + 6; x < right - 8; x += 9.5) {
    if (dev.towers.some((t) => Math.abs(x - t.x) < t.dims.outerW / 2 + 2)) continue;
    trees.push(x);
  }
  return (
    <svg viewBox={vb.join(' ')} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }} role="img" aria-label="Front elevation (illustrative)">
      <g stroke={INK} fill="none" strokeLinecap="square">
        {/* ground */}
        <line x1={left} x2={right} y1={0} y2={0} strokeWidth={0.32} />
        {Array.from({ length: Math.floor((right - left) / 2.4) }, (_, i) => (
          <line key={i} x1={left + i * 2.4} y1={0.2} x2={left + i * 2.4 - 1.6} y2={2.4} strokeWidth={0.08} opacity={0.45} />
        ))}
        {/* trees in the landscape, as on an architect's elevation */}
        {trees.map((x, i) => {
          const r = 2.6 + ((i * 37) % 10) / 10;
          return (
            <g key={x} opacity={0.5}>
              <line x1={x} x2={x} y1={0} y2={-3.4} strokeWidth={0.12} />
              <circle cx={x} cy={-3.4 - r} r={r} strokeWidth={0.1} />
            </g>
          );
        })}
        {dev.towers.map((t) => (
          <TowerElevation key={t.id} cx={t.x} d={t.dims} />
        ))}
        {/* overall height */}
        <g transform={`translate(${tallest.x + tallest.dims.outerW / 2 + 7} 0)`} strokeWidth={0.09}>
          <line x1={0} x2={0} y1={0} y2={-tallest.dims.height} />
          <line x1={-1} x2={1} y1={0} y2={0} />
          <line x1={-1} x2={1} y1={-tallest.dims.height} y2={-tallest.dims.height} />
        </g>
      </g>
      <text x={tallest.x + tallest.dims.outerW / 2 + 8.4} y={-tallest.dims.height / 2} fontSize={2.3} fill={INK} transform={`rotate(-90 ${tallest.x + tallest.dims.outerW / 2 + 8.4} ${-tallest.dims.height / 2})`} textAnchor="middle" style={{ letterSpacing: '0.08em' }}>
        {tallest.dims.height.toFixed(1)} m · {tallest.dims.floors} floors
      </text>
    </svg>
  );
}

function TowerElevation({ cx, d }) {
  const W = d.width;
  const L = cx - W / 2;
  const R = cx + W / 2;
  const panes = Math.max(6, Math.round(W / 1.55));
  const slabs = Array.from({ length: d.floors + 1 }, (_, i) => d.base + i * FLOOR_H);
  const fins = Math.max(10, Math.round(W / 1.1));
  return (
    <g>
      {/* podium and lobby */}
      <rect x={L} y={-d.base} width={W} height={d.base} strokeWidth={0.14} />
      {Array.from({ length: Math.round(W / 3.1) + 1 }, (_, i) => (
        <line key={i} x1={L + (W * i) / Math.round(W / 3.1)} x2={L + (W * i) / Math.round(W / 3.1)} y1={-0.4} y2={-d.base + 0.3} strokeWidth={0.06} opacity={0.6} />
      ))}
      {/* storeys: slab edges (balconies) and glazing bars */}
      {slabs.map((y, i) => (
        <line key={i} x1={L - 0.5} x2={R + 0.5} y1={-y} y2={-y} strokeWidth={i === 0 || i === slabs.length - 1 ? 0.2 : 0.13} />
      ))}
      {Array.from({ length: panes + 1 }, (_, i) => (
        <line key={i} x1={L + (W * i) / panes} x2={L + (W * i) / panes} y1={-d.base} y2={-d.top} strokeWidth={0.045} opacity={0.55} />
      ))}
      {slabs.slice(0, -1).map((y, i) => (
        <line key={i} x1={L} x2={R} y1={-(y + 1.05)} y2={-(y + 1.05)} strokeWidth={0.04} opacity={0.4} />
      ))}
      {/* crown: fin screen and its cap */}
      {Array.from({ length: fins + 1 }, (_, i) => (
        <line key={i} x1={L + (W * i) / fins} x2={L + (W * i) / fins} y1={-d.top - 0.45} y2={-(d.top + CROWN_H - 0.28)} strokeWidth={0.05} opacity={0.7} />
      ))}
      <rect x={L - 0.3} y={-(d.top + CROWN_H)} width={W + 0.6} height={0.28} strokeWidth={0.1} />
      <rect x={L} y={-(d.top + 0.45)} width={W} height={0.45} strokeWidth={0.1} />
    </g>
  );
}
