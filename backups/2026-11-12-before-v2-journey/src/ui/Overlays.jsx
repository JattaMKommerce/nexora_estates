import { Fragment, useEffect, useRef, useState } from 'react';
import { live, ui, useUI, onFrame } from '../core/bus.js';
import { W, sstep, band } from '../core/world.js';
import { PHASES, SECTIONS } from '../core/story.js';
import { goToSection } from '../core/scroll.js';
import { registerAnchor } from '../three/anchors.js';
import { BEATS, HERO, NAV, TOUR } from '../content.js';

const PAGE_SECTIONS = new Set(['p2', 'p4', 'tourIntro', 'end']);
import Icon, { Mark } from './Icons.jsx';

/* --------------------------------------------------------------- shared bits ---- */

/** A big uppercase title whose letters rise in yellow and settle to the title colour. */
export function Title({ lines, as: Tag = 'h2', className = '', on = true }) {
  let n = 0;
  return (
    <Tag className={`title ${className} ${on ? 'is-in' : ''}`}>
      {lines.map((l, i) => (
        <span className="title__line" key={i}>
          <span className="title__inner">
            {l.split(' ').map((word, w) => (
              <Fragment key={w}>
                {w > 0 && ' '}
                <span className="title__word">
                  {[...word].map((ch, j) => {
                    const d = (i * 0.1 + n++ * 0.022).toFixed(3);
                    return (
                      <span className="title__ch" style={{ '--d': `${d}s` }} key={j}>
                        {ch}
                      </span>
                    );
                  })}
                </span>
              </Fragment>
            ))}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function Lines({ lines, on = true, className = '' }) {
  return (
    <p className={`lines ${className} ${on ? 'is-in' : ''}`}>
      {lines.map((l, i) => (
        <span className="lines__line" key={i}>
          <span className="lines__inner" style={{ '--d': `${0.08 * i + 0.1}s` }}>
            {l}
          </span>
        </span>
      ))}
    </p>
  );
}

export function Badge({ children, dark }) {
  return <span className={`badge ${dark ? 'badge--dark' : ''}`}>{children}</span>;
}

export function Planned() {
  return <span className="chip chip--planned">Planned</span>;
}

/* ----------------------------------------------------------------- loader ---- */

export function Loader({ brand }) {
  const progress = useUI((s) => s.progress);
  const ready = useUI((s) => s.ready);
  const entered = useUI((s) => s.entered);
  const error = useUI((s) => s.error);
  const auto = new URLSearchParams(location.search).has('enter');
  useEffect(() => {
    if (ready && auto) ui.set({ entered: true });
  }, [ready, auto]);
  return (
    <div className={`loader ${entered ? 'is-gone' : ''}`} aria-hidden={entered}>
      <div className="loader__brand">
        <Mark size={28} />
        <span>{brand}</span>
      </div>
      <div className="loader__center">
        <div className="loader__logo">
          <span className="mark">
            <Mark size={46} />
          </span>
          <Title lines={['Build Your', 'Residence']} as="p" className="loader__title" on />
        </div>
        {error ? (
          <p className="loader__error">{error}</p>
        ) : (
          <>
            <span className="loader__progress">{Math.round(progress * 100)}%</span>
            <button className={`btn btn--yellow loader__enter ${ready ? 'is-ready' : ''}`} disabled={!ready} onClick={() => ui.set({ entered: true })}>
              {ready ? 'Enter Site' : 'Loading the model…'}
            </button>
          </>
        )}
      </div>
      <p className="loader__note">A live 3D model · best with sound off and a mouse or trackpad</p>
    </div>
  );
}

/* -------------------------------------------------------------------- nav ---- */

export function Nav({ brand }) {
  const phase = useUI((s) => s.phase);
  const section = useUI((s) => s.section);
  const set = useUI((s) => s.set);
  const menu = useUI((s) => s.menu);
  const [tip, setTip] = useState(false);
  const light = set === 'corridor' && section !== 'start';
  const label = phase >= 1 ? PHASES[phase - 1]?.label : 'Menu';
  const bar = useRef();
  useEffect(
    () =>
      onFrame(() => {
        const h = document.documentElement.scrollHeight - live.vh;
        if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? live.scrollY / h : 0})`;
      }),
    []
  );
  return (
    <header className={`nav ${light || (set === 'model' && !PAGE_SECTIONS.has(section)) ? 'nav--light' : ''} ${section === 'start' ? 'nav--start' : ''}`}>
      <div className="nav__progress" ref={bar} />
      <a className="nav__logo" href="#" onClick={(e) => (e.preventDefault(), goToSection('start'))}>
        <Mark size={26} />
        <span className="nav__brand">{brand}</span>
        <span className="nav__sep" />
        <span className="nav__title">{NAV.title}</span>
      </a>
      <div className="nav__right">
        <button className="nav__twin" onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)} onClick={() => ui.set({ deep: 'twin' })}>
          <span className="diamond">
            <Icon name="sparkle" size={12} />
          </span>
          <span>{NAV.twinLabel}</span>
          <span className={`nav__tip ${tip ? 'is-on' : ''}`}>{NAV.twinText}</span>
        </button>
        <div className={`menu ${menu ? 'is-open' : ''}`}>
          <button className="menu__pill" onClick={() => ui.set({ menu: !menu })} aria-expanded={menu}>
            <span className={`menu__num ${phase >= 1 ? 'is-on' : ''}`}>{phase >= 1 ? Math.min(phase, 6) : 0}</span>
            <span className="menu__label">{label}</span>
            <span className="menu__icon">
              <Icon name={menu ? 'close' : 'menu'} size={18} />
            </span>
          </button>
          <div className="menu__panel">
            <ol>
              {PHASES.map((p) => (
                <li key={p.id}>
                  <button
                    className={phase === p.n ? 'is-on' : ''}
                    onClick={() => {
                      ui.set({ menu: false, board: null, tourLoc: null });
                      goToSection(p.id, { smooth: false });
                    }}
                  >
                    <span>{p.n < 6 ? `Phase ${p.n}` : 'Tour'}</span>
                    {p.label}
                  </button>
                </li>
              ))}
            </ol>
            <button className="btn btn--dark menu__contact" onClick={() => ui.set({ menu: false, contact: true })}>
              Get in Touch <Icon name="arrowRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------- hero overlays ---- */

export function HeroText() {
  const a = useRef();
  const b = useRef();
  const c = useRef();
  const [state, setState] = useState({ a: false, b: false, c: false });
  useEffect(
    () =>
      onFrame(() => {
        const S = live.S;
        const oa = band(S, 0.1, 0.3, 0.78, 0.95);
        const ob = band(S, 0.98, 1.15, 1.6, 1.78);
        const oc = band(S, 1.78, 1.92, 2.3, 2.48);
        document.documentElement.style.setProperty('--heroScrim', Math.max(oa, ob, oc * 0.8).toFixed(3));
        if (a.current) a.current.style.opacity = oa;
        if (b.current) b.current.style.opacity = ob;
        if (c.current) c.current.style.opacity = oc;
        const next = { a: oa > 0.2, b: ob > 0.2, c: oc > 0.15 };
        setState((s) => (s.a === next.a && s.b === next.b && s.c === next.c ? s : next));
      }),
    []
  );
  return (
    <div className="hero" aria-live="polite">
      <div className="hero__intro" ref={a}>
        <span className="hero__label">{HERO.label}</span>
        <p className={`hero__para lines ${state.a ? 'is-in' : ''}`}>
          <span className="lines__line">
            <span className="lines__inner hero__hl" style={{ '--d': '0.05s' }}>
              <Icon name="cube" size={22} /> {HERO.intro.highlight}
            </span>
          </span>
          {HERO.intro.lines.map((l, i) => (
            <span className="lines__line" key={i}>
              <span className="lines__inner" style={{ '--d': `${0.12 + i * 0.07}s` }}>
                {l}
              </span>
            </span>
          ))}
        </p>
      </div>
      <div className="hero__second" ref={b}>
        <Lines lines={HERO.second} on={state.b} className="hero__para" />
      </div>
      <div className="hero__build" ref={c}>
        <Title lines={HERO.build.title} className="title--hero title--light" on={state.c} />
        <p className={`hero__buildText fade ${state.c ? 'is-in' : ''}`}>{HERO.build.text}</p>
      </div>
    </div>
  );
}

/** The flash of daylight when the camera steps out of the corridor. */
export function Whiteout() {
  const el = useRef();
  useEffect(
    () =>
      onFrame(() => {
        if (el.current) el.current.style.opacity = W.white;
      }),
    []
  );
  return <div className="whiteout" ref={el} />;
}

/* ------------------------------------------------------- model-phase beats ---- */

function Node({ id, node, onOpen, active }) {
  const ref = useRef();
  useEffect(() => {
    registerAnchor(id, ref.current, node.at);
    return () => registerAnchor(id, null);
  }, [id, node.at]);
  return (
    <button ref={ref} className={`node node--${node.kind} ${active ? 'is-active' : ''}`} onClick={onOpen} aria-label={`${node.title}: more`}>
      <span className="node__dot">
        <Icon name="sparkle" size={13} />
      </span>
      <span className="node__label">{node.title}</span>
    </button>
  );
}

export function Beats({ project }) {
  const beat = useUI((s) => s.beat);
  const board = useUI((s) => s.board);
  useEffect(() => {
    if (board && board.beat !== beat) ui.set({ board: null });
  }, [beat, board]);
  return (
    <div className="beats">
      {Object.entries(BEATS).map(([id, b]) => {
        const on = beat === id;
        if (b.type === 'intro')
          return (
            <div key={id} className={`beat beat--intro ${on ? 'is-on' : ''}`}>
              <div className="beat__head">
                <Badge>{b.badge}</Badge>
                <Title lines={b.title} className="title--phase title--light" on={on} />
              </div>
              <p className={`beat__large fade ${on ? 'is-in' : ''}`}>{b.large}</p>
            </div>
          );
        if (b.type === 'nodes')
          return (
            <div key={id} className={`beat beat--nodes ${on ? 'is-on' : ''} ${EXITS.has(id) ? 'is-exit' : ''}`}>
              <div className="beat__nodes">
                {b.nodes.map((n, i) => (
                  <Node
                    key={i}
                    id={`${id}-${i}`}
                    node={n}
                    active={board?.beat === id && board.index === i}
                    onOpen={() => ui.set({ board: { beat: id, index: i } })}
                  />
                ))}
              </div>
              <div className={`beat__summary fade ${on ? 'is-in' : ''}`}>
                <span className="beat__step">
                  <Icon name="sparkle" size={11} /> Step {String(stepNo(id)).padStart(2, '0')}
                </span>
                <p>{b.summary}</p>
              </div>
            </div>
          );
        return (
          <div key={id} className={`beat beat--exit ${on ? 'is-on' : ''}`}>
            <p className="beat__caption">{b.caption}</p>
          </div>
        );
      })}
      <Board project={project} />
      <Explore beat={beat} />
      <StepDots beat={beat} />
    </div>
  );
}

/** Which step of its phase a beat is (p1-b → 2). */
function stepNo(id) {
  const phase = id.split('-')[0];
  const steps = Object.entries(BEATS).filter(([k, b]) => k.startsWith(`${phase}-`) && b.type === 'nodes').map(([k]) => k);
  return steps.indexOf(id) + 1;
}

/** "Scroll to explore", bottom left, on the 3D phases. */
function Explore({ beat }) {
  const on = Boolean(beat && BEATS[beat] && BEATS[beat].type !== 'exit');
  return (
    <div className={`explore ${on ? 'is-on' : ''}`}>
      <span className="mouse" />
      Scroll to explore
    </div>
  );
}

/** The phase's steps as dots on the right edge; the current step is a green bar. */
function StepDots({ beat }) {
  const phase = beat?.split('-')[0];
  const steps = phase ? Object.entries(BEATS).filter(([k, b]) => k.startsWith(`${phase}-`) && b.type === 'nodes').map(([k]) => k) : [];
  const on = steps.includes(beat);
  return (
    <div className={`stepDots ${on && steps.length > 1 ? 'is-on' : ''}`} aria-hidden="true">
      {steps.map((k) => (
        <i key={k} className={k === beat ? 'is-on' : ''} />
      ))}
    </div>
  );
}

function Board({ project }) {
  const board = useUI((s) => s.board);
  const [shown, setShown] = useState(null);
  useEffect(() => {
    if (board) setShown(board);
  }, [board]);
  const b = shown && BEATS[shown.beat];
  const n = b?.nodes?.[shown.index];
  if (!n) return <aside className="board" />;
  const total = b.nodes.length;
  const go = (d) => ui.set({ board: { beat: shown.beat, index: (shown.index + d + total) % total } });
  let stat = null;
  if (n.stat === 'available' && project?.towers?.length) {
    const avail = project.towers.reduce((s, t) => s + t.available, 0);
    const all = project.towers.reduce((s, t) => s + t.total, 0);
    stat = `${avail} of ${all} homes are marked available in this project’s sample data.`;
  }
  return (
    <aside className={`board ${board ? 'is-on' : ''}`} role="dialog" aria-label={n.title}>
      <div className="board__top">
        <span className="board__icon">
          <Icon name={n.icon} size={26} />
        </span>
        <span className="board__kind">{n.kind === 'platform' ? 'Restate platform' : 'Development step'}</span>
        {n.planned && <Planned />}
        <button className="board__close" onClick={() => ui.set({ board: null })} aria-label="Close">
          <Icon name="close" size={18} />
        </button>
      </div>
      <h3 className="board__title">{n.title}</h3>
      <p className="board__text">{n.text}</p>
      {stat && <p className="board__stat">{stat}</p>}
      <div className="board__nav">
        <button onClick={() => go(-1)} aria-label="Previous">
          <Icon name="arrowLeft" size={16} />
        </button>
        <span>
          {shown.index + 1} / {total}
        </span>
        <button onClick={() => go(1)} aria-label="Next">
          <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------ scroll button ---- */

const NEXT = {
  start: { to: 'hero', label: 'Scroll to explore' },
  hero: { to: 'p1', label: 'Scroll to Phase 1' },
  p1: { to: 'p2', label: 'Scroll to Phase 2' },
  p2: { to: 'p3', label: 'Scroll to Phase 3' },
  p3: { to: 'p4', label: 'Scroll to Phase 4' },
  p4: { to: 'p5', label: 'Scroll to Phase 5' },
  p5: { to: 'tourIntro', label: 'Scroll to Take a Tour' },
  tourIntro: { to: 'tour', label: 'Scroll to Take a Tour' }
};
const EXITS = new Set(['hero-build', 'p1-exit', 'p3-exit', 'p5-a']);

export function ScrollButton() {
  const section = useUI((s) => s.section);
  const beat = useUI((s) => s.beat);
  const tourLoc = useUI((s) => s.tourLoc);
  const board = useUI((s) => s.board);
  const ring = useRef();
  const next = NEXT[section];
  useEffect(
    () =>
      onFrame(() => {
        const el = document.querySelector(`[data-section="${ui.get().section}"]`);
        if (!el || !ring.current) return;
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - live.vh)));
        ring.current.style.strokeDashoffset = `${(1 - p) * 69.1}`;
      }),
    []
  );
  const [pageEnd, setPageEnd] = useState(false);
  useEffect(
    () =>
      onFrame(() => {
        const sec = ui.get().section;
        const el = PAGE_SECTIONS.has(sec) ? document.querySelector(`[data-section="${sec}"]`) : null;
        const end = el ? el.getBoundingClientRect().bottom < live.vh * 1.9 : false;
        setPageEnd((v) => (v === end ? v : end));
      }),
    []
  );
  const shown = EXITS.has(beat) || section === 'tourIntro' || pageEnd;
  const hidden = !next || tourLoc || board || section === 'start' || !shown;
  return (
    <button className={`scrollBtn ${EXITS.has(beat) ? 'is-go' : ''} ${hidden ? 'is-hidden' : ''}`} onClick={() => next && goToSection(next.to)}>
      <span className="scrollBtn__ring">
        <svg viewBox="0 0 26 26" width="44" height="44" aria-hidden="true">
          <circle cx="13" cy="13" r="11" className="scrollBtn__track" />
          <circle cx="13" cy="13" r="11" className="scrollBtn__fill" ref={ring} />
        </svg>
        <span className="mouse" />
      </span>
      <span>{next?.label}</span>
    </button>
  );
}

/* ---------------------------------------------------------------- the tour ---- */

export function TourSpots() {
  const beat = useUI((s) => s.beat);
  const tourLoc = useUI((s) => s.tourLoc);
  const on = beat === 'tour' && !tourLoc;
  const drag = useRef(null);
  return (
    <div className={`tourSpots ${on ? 'is-on' : ''}`}>
      <div
        className="tourSpots__drag"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, yaw: live.orbit.yaw };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          live.orbit.yaw = Math.max(-0.7, Math.min(0.7, drag.current.yaw - (e.clientX - drag.current.x) * 0.0035));
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      />
      {TOUR.map((t) => (
        <TourSpot key={t.id} stop={t} />
      ))}
      <p className="tourSpots__hint">
        <Icon name="drag" size={16} /> Drag to look around · choose a place to visit
      </p>
    </div>
  );
}

function TourSpot({ stop }) {
  const ref = useRef();
  useEffect(() => {
    registerAnchor(`tour-${stop.id}`, ref.current, stop.at);
    return () => registerAnchor(`tour-${stop.id}`, null);
  }, [stop]);
  return (
    <button ref={ref} className="node node--tour" onClick={() => ui.set({ tourLoc: stop.id })}>
      <span className="node__dot">
        <Icon name="plus" size={12} stroke={2.2} />
      </span>
      <span className="node__label">{stop.title}</span>
    </button>
  );
}

export function TourPanel() {
  const tourLoc = useUI((s) => s.tourLoc);
  const [shown, setShown] = useState(null);
  useEffect(() => {
    if (tourLoc) setShown(tourLoc);
    document.documentElement.classList.toggle('is-locked-tour', Boolean(tourLoc));
  }, [tourLoc]);
  const i = TOUR.findIndex((t) => t.id === shown);
  const stop = TOUR[i];
  return (
    <aside className={`tourPanel ${tourLoc ? 'is-on' : ''}`} aria-hidden={!tourLoc}>
      {stop && (
        <>
          <div className="tourPanel__head">
            <Badge dark>Virtual tour · {i + 1} of {TOUR.length}</Badge>
            <button className="board__close" onClick={() => ui.set({ tourLoc: null })} aria-label="Back to overview">
              <Icon name="close" size={18} />
            </button>
          </div>
          <h3 className="tourPanel__title">{stop.title}</h3>
          {stop.blocks.map((b) => (
            <div className="tourPanel__block" key={b.heading}>
              <h4>{b.heading}</h4>
              <p>{b.text}</p>
            </div>
          ))}
          <div className="tourPanel__nav">
            <button className="btn btn--ghost" onClick={() => ui.set({ tourLoc: null })}>
              <Icon name="arrowLeft" size={16} /> Overview
            </button>
            <button className="btn btn--dark" onClick={() => ui.set({ tourLoc: TOUR[(i + 1) % TOUR.length].id })}>
              Next: {TOUR[(i + 1) % TOUR.length].title} <Icon name="arrowRight" size={16} />
            </button>
          </div>
          <div className="tourPanel__chips">
            {TOUR.map((t) => (
              <button key={t.id} className={t.id === shown ? 'is-on' : ''} onClick={() => ui.set({ tourLoc: t.id })}>
                {t.title}
              </button>
            ))}
          </div>
        </>
      )}
    </aside>
  );
}

export function sectionsWithStage() {
  return SECTIONS.filter((s) => s.kind === 'stage').map((s) => s.id);
}

export { sstep };
