import { useCallback, useEffect, useRef, useState } from 'react';
import { cls } from '../../lib/format.js';
import { IconClose, IconNext, IconPause, IconPlay } from './icons.jsx';

/**
 * Automatic guided tour. Each step: { id, title, text, duration (s), enter(), at: [{ t, run }] }.
 * The clock stops while `hold` is true (a scene is loading) or the visitor pauses it.
 */
export function useGuidedTour(steps, { hold = false, onEnd } = {}) {
  const [state, setState] = useState({ active: false, index: 0, paused: false });
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const elapsed = useRef(0);
  const fired = useRef(new Set());
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const enter = useCallback((index) => {
    elapsed.current = 0;
    fired.current = new Set();
    stepsRef.current[index]?.enter?.();
    setState({ active: true, index, paused: false });
  }, []);

  const start = useCallback(() => enter(0), [enter]);
  const stop = useCallback((reason = 'skip') => {
    setState((s) => (s.active ? { ...s, active: false } : s));
    onEndRef.current?.(reason);
  }, []);
  const next = useCallback(() => {
    setState((s) => {
      if (!s.active) return s;
      const n = s.index + 1;
      if (n >= stepsRef.current.length) {
        queueMicrotask(() => {
          setState((x) => ({ ...x, active: false }));
          onEndRef.current?.('done');
        });
        return s;
      }
      queueMicrotask(() => enter(n));
      return s;
    });
  }, [enter]);
  const pause = useCallback(() => setState((s) => (s.active ? { ...s, paused: true } : s)), []);
  const resume = useCallback(() => setState((s) => (s.active ? { ...s, paused: false } : s)), []);

  useEffect(() => {
    if (!state.active || state.paused || hold) return undefined;
    const id = setInterval(() => {
      const step = stepsRef.current[state.index];
      if (!step) return;
      elapsed.current += 0.1;
      for (const a of step.at || []) {
        if (a.t <= elapsed.current && !fired.current.has(a)) {
          fired.current.add(a);
          a.run();
        }
      }
      if (elapsed.current >= step.duration) next();
    }, 100);
    return () => clearInterval(id);
  }, [state.active, state.paused, state.index, hold, next]);

  return { ...state, step: steps[state.index], total: steps.length, start, stop, next, pause, resume, held: hold };
}

export function GuidedTourBar({ tour }) {
  if (!tour.active || !tour.step) return null;
  const { step, index, total, paused, held } = tour;
  return (
    <div className="gtour" role="status" aria-live="polite">
      <div className="gtour__top">
        <span className="gtour__count">
          Guided tour · {index + 1} / {total}
        </span>
        <div className="gtour__btns">
          {paused ? (
            <button type="button" className="icon-btn" onClick={tour.resume} aria-label="Resume the tour">
              <IconPlay />
            </button>
          ) : (
            <button type="button" className="icon-btn" onClick={tour.pause} aria-label="Pause the tour">
              <IconPause />
            </button>
          )}
          <button type="button" className="icon-btn" onClick={tour.next} aria-label="Next step">
            <IconNext />
          </button>
          <button type="button" className="icon-btn" onClick={() => tour.stop('skip')} aria-label="End the tour">
            <IconClose />
          </button>
        </div>
      </div>
      <h2 className="display gtour__title" key={`t${index}`}>
        {step.title}
      </h2>
      <p className="gtour__text" key={`p${index}`}>
        {step.text}
      </p>
      <div className="gtour__dots" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cls('gtour__dot', i < index && 'is-done', i === index && 'is-current')}>
            {i === index && (
              <i
                key={`bar${index}`}
                style={{ animationDuration: `${step.duration}s`, animationPlayState: paused || held ? 'paused' : 'running' }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
