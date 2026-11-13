import { Component } from 'react';
import { cls, initials } from '../../lib/format.js';

export function Loader({ visible, brand, message, variant }) {
  return (
    <div className={cls('loader', variant && `loader--${variant}`, !visible && 'is-hidden')} role="status" aria-live="polite" aria-hidden={!visible}>
      {brand && (
        <>
          <span className="loader__mark" aria-hidden="true">
            {initials(brand)}
          </span>
          <p className="loader__brand">{brand}</p>
        </>
      )}
      <span className="loader__line" aria-hidden="true">
        <span />
      </span>
      <p className="loader__msg">{message}</p>
    </div>
  );
}

function Action({ action }) {
  const className = cls('btn', action.primary ? 'btn--primary' : 'btn--ghost');
  if (action.href) {
    return (
      <a className={className} href={action.href}>
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={action.onClick}>
      {action.label}
    </button>
  );
}

export function StatusScreen({ eyebrow, title, message, steps, actions = [] }) {
  const list = actions.filter(Boolean);
  return (
    <div className="screen" role="alertdialog" aria-labelledby="screen-title" aria-describedby="screen-msg">
      <div className="card">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 id="screen-title" className="display card__title">
          {title}
        </h1>
        <p id="screen-msg" className="card__msg">
          {message}
        </p>
        {steps && steps.length > 0 && (
          <ol className="card__steps">
            {steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        )}
        {list.length > 0 && (
          <div className="card__actions">
            {list.map((a) => (
              <Action key={a.label} action={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[3D] view failed', error, info?.componentStack);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.error) return this.props.fallback(this.state.error);
    return this.props.children;
  }
}
