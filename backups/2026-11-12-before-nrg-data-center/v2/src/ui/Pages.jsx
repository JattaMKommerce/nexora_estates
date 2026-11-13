import { useEffect, useRef, useState } from 'react';
import { live, ui, useUI, onFrame } from '../core/bus.js';
import { SECTIONS, sectionById } from '../core/story.js';
import { registerSection, registerSnaps, goToSection } from '../core/scroll.js';
import { START, PHASE2, PHASE4, TOUR_INTRO, END } from '../content.js';
import { Title, Lines, Badge, Planned } from './Overlays.jsx';
import Icon from './Icons.jsx';

const reg = (id) => (el) => registerSection(id, el);

/** Is this element on screen yet? (for reveal animations on the white pages) */
function useInView(ref, margin = '-12% 0px') {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return on;
}

/* --------------------------------------------------------------- start ---- */

export function Start() {
  const win = useRef();
  const head = useRef();
  useEffect(
    () =>
      onFrame(() => {
        const p = Math.min(1, live.scrollY / Math.max(1, live.vh));
        if (win.current) {
          const m = 28 * (1 - p);
          win.current.style.left = `${m}px`;
          win.current.style.right = `${m}px`;
          win.current.style.borderRadius = `${22 * (1 - p)}px`;
        }
      }),
    []
  );
  return (
    <section className="start" ref={reg('start')} data-section="start">
      <div className="start__window" ref={win} />
      <div className="start__top" ref={head}>
        <Title lines={START.title} as="h1" className="title--start" on />
        <p className="start__text fade is-in">{START.text}</p>
      </div>
      <div className="start__scroll">
        <span className="mouse" />
        Scroll to explore
      </div>
    </section>
  );
}

/* ------------------------------------------------------- stage sections ---- */

export function StageSection({ id }) {
  const sec = sectionById[id];
  const snaps = sec.stops.filter((s) => s.snap);
  const marks = useRef([]);
  useEffect(() => registerSnaps(id, marks.current), [id]);
  return (
    <section className="stageSec" ref={reg(id)} data-section={id} aria-hidden="true">
      {snaps.map((s, i) => (
        <span key={s.beat} className="snap" ref={(el) => (marks.current[i] = el)} />
      ))}
    </section>
  );
}

/* --------------------------------------------------------------- Phase 2 ---- */

function Intro({ badge, title, large }) {
  const ref = useRef();
  const on = useInView(ref);
  return (
    <div className="page__intro" ref={ref} data-solid>
      <Badge dark>{badge}</Badge>
      <Title lines={title} className="title--phase" on={on} />
      <p className={`page__large fade ${on ? 'is-in' : ''}`}>{large}</p>
    </div>
  );
}

function Blocks({ id, items, active, numbered = true }) {
  return (
    <div className="blocks" data-blocks={id}>
      {items.map((b, i) => (
        <article key={b.heading} data-block={i} className={`block ${active === i ? 'is-on' : ''}`}>
          <span className="block__ico">{numbered ? String(i + 1).padStart(2, '0') : <Icon name="cube" size={16} />}</span>
          <div>
            <h3>{b.heading}</h3>
            <p>{b.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function useActive(key) {
  return useUI((s) => (s.blocks.startsWith(`${key}:`) ? Number(s.blocks.split(':')[1]) : 0));
}

function Feature({ f }) {
  return (
    <div className="feature">
      <div className="feature__card">
        <div>
          <h3 className="feature__title">
            {f.heading} {f.planned && <Planned />}
          </h3>
          <p>{f.text}</p>
        </div>
        <button className="btn btn--dark" onClick={() => ui.set({ deep: f.deep })}>
          {f.button} <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </div>
  );
}

export function Phase2() {
  const a = useActive('approvals');
  const t = useActive('tools');
  const media = useRef();
  const text = useRef();
  // phones: the text column scrolls up under the live window; cut it off at the window's lower edge
  // so the window always shows the 3D, never the text passing beneath it
  useEffect(
    () =>
      onFrame(() => {
        const m = media.current;
        const tx = text.current;
        if (!m || !tx) return;
        if (live.vw > 760) {
          if (tx.style.clipPath) tx.style.clipPath = '';
          return;
        }
        const cut = m.getBoundingClientRect().bottom - tx.getBoundingClientRect().top;
        tx.style.clipPath = cut > 0 ? `inset(${Math.round(cut)}px 0 0 0)` : '';
      }),
    []
  );
  return (
    <section className="page" ref={reg('p2')} data-section="p2">
      <Intro badge={PHASE2.badge} title={PHASE2.title} large={PHASE2.large} />
      <div className="split split--live">
        <div className="split__media" ref={media}>
          <div className="liveWin" data-window="approvals">
            <span className="liveWin__tag">
              <i /> Live 3D model
            </span>
            <span className="liveWin__caption">{PHASE2.approvals[a]?.heading}</span>
          </div>
        </div>
        <div className="split__text" ref={text}>
          <Badge dark>{PHASE2.approvalsBadge}</Badge>
          <Blocks id="approvals" items={PHASE2.approvals} active={a} />
        </div>
      </div>
      <div className="breakHeading" data-solid>
        <span className="breakHeading__ico">
          <Icon name="cube" size={22} />
        </span>
        <h3>{PHASE2.breakHeading}</h3>
      </div>
      <div className="split split--flip" data-cover data-solid>
        <div className="split__text">
          <Badge dark>{PHASE2.toolsBadge}</Badge>
          <Blocks id="tools" items={PHASE2.tools} active={t} numbered={false} />
        </div>
        <div className="split__media">
          <div className="stills">
            {PHASE2.tools.map((b, i) => (
              <img key={b.img} src={b.img} alt={b.heading} className={t === i ? 'is-on' : ''} loading="lazy" />
            ))}
            <span className="stills__note">{PHASE2.toolsNote}</span>
          </div>
        </div>
      </div>
      <Feature f={PHASE2.feature} />
    </section>
  );
}

/* --------------------------------------------------------------- Phase 4 ---- */

export function Phase4() {
  const rail = useRef();
  const track = useRef();
  const [mode, setMode] = useState(0);
  const [dot, setDot] = useState(0);
  const items = PHASE4.rails[mode];
  useEffect(
    () =>
      onFrame(() => {
        const r = rail.current?.getBoundingClientRect();
        const tr = track.current;
        if (!r || !tr) return;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - live.vh)));
        const span = Math.max(0, tr.scrollWidth - tr.parentElement.clientWidth);
        tr.style.transform = `translate3d(${-p * span}px,0,0)`;
        const n = tr.children.length;
        const d = Math.min(n - 1, Math.floor(p * n * 0.999));
        setDot((x) => (x === d ? x : d));
      }),
    []
  );
  const imgRef = useRef();
  const imgOn = useInView(imgRef);
  return (
    <section className="page" ref={reg('p4')} data-section="p4">
      <Intro badge={PHASE4.badge} title={PHASE4.title} large={PHASE4.large} />
      <figure className={`imageBreak ${imgOn ? 'is-in' : ''}`} ref={imgRef} data-solid>
        <img src={PHASE4.image} alt={PHASE4.imageAlt} loading="lazy" />
        <figcaption>{PHASE4.imageNote}</figcaption>
      </figure>
      <div className="rail" ref={rail} data-cover data-solid>
        <div className="rail__sticky">
          <div className="rail__toggles" role="tablist">
            {PHASE4.toggles.map((label, i) => (
              <button key={label} role="tab" aria-selected={mode === i} className={mode === i ? 'is-on' : ''} onClick={() => setMode(i)}>
                {label}
              </button>
            ))}
          </div>
          <div className="rail__line">
            <span className="rail__fill" style={{ width: `${((dot + 1) / items.length) * 100}%` }} />
          </div>
          <div className="rail__view">
            <ol className="rail__track" ref={track}>
              {items.map((b, i) => (
                <li key={b.heading} className={i <= dot ? 'is-on' : ''}>
                  <span className="rail__dot" />
                  <span className="rail__n">{b.n}</span>
                  <h3>
                    {b.heading} {b.planned && <Planned />}
                  </h3>
                  <p>{b.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <Feature f={PHASE4.feature} />
    </section>
  );
}

/* ---------------------------------------------------------- tour + end ---- */

export function TourIntro() {
  const ref = useRef();
  const on = useInView(ref);
  return (
    <section className="page page--tourIntro" ref={reg('tourIntro')} data-section="tourIntro">
      <div className="tourIntro" ref={ref} data-cover data-solid>
        <Badge dark>{TOUR_INTRO.badge}</Badge>
        <Title lines={TOUR_INTRO.title} className="title--phase" on={on} />
        <p className={`page__large fade ${on ? 'is-in' : ''}`}>{TOUR_INTRO.large}</p>
      </div>
    </section>
  );
}

export function End({ project }) {
  const ref = useRef();
  const on = useInView(ref);
  return (
    <section className="page page--end" ref={reg('end')} data-section="end">
      <div className="end" ref={ref} data-solid>
        <Title lines={END.title} className="title--phase" on={on} />
        <p className="page__large">{END.text}</p>
        <div className="end__cta">
          <button className="btn btn--yellow" onClick={() => ui.set({ contact: true })}>
            Get in Touch <Icon name="arrowRight" size={16} />
          </button>
          <button className="btn btn--ghost" onClick={() => goToSection('start', { smooth: false })}>
            Watch again from the start
          </button>
        </div>
        <p className="end__note">
          Demo · {project?.name || 'The sample project'} is a fictional project. The 3D model and the surroundings are illustrative.
        </p>
      </div>
    </section>
  );
}

export const STAGE_IDS = SECTIONS.filter((s) => s.kind === 'stage').map((s) => s.id);
export { Lines };
