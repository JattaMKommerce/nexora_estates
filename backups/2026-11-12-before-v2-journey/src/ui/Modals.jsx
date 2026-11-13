import { useEffect, useState } from 'react';
import { ui, useUI } from '../core/bus.js';
import { DEEP } from '../content.js';
import { Planned } from './Overlays.jsx';
import Icon from './Icons.jsx';

function useEscape(open, close) {
  useEffect(() => {
    if (!open) return undefined;
    const f = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [open, close]);
}

export function DeepDive() {
  const id = useUI((s) => s.deep);
  const d = id && DEEP[id];
  const close = () => ui.set({ deep: null });
  useEscape(Boolean(d), close);
  return (
    <div className={`modal ${d ? 'is-on' : ''}`} onClick={close} aria-hidden={!d}>
      {d && (
        <div className="modal__card" role="dialog" aria-modal="true" aria-label={d.title} onClick={(e) => e.stopPropagation()}>
          <button className="board__close" onClick={close} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
          <h3 className="modal__title">
            {d.title} {d.planned && <Planned />}
          </h3>
          {d.paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The enquiry form. It only sends when site.json has a forms.endpoint; until then it says plainly
 * that nothing was sent (no pretend success).
 */
export function Contact({ site }) {
  const open = useUI((s) => s.contact);
  const endpoint = site?.forms?.endpoint || null;
  const [state, setState] = useState('idle'); // idle | sending | sent | failed | offline
  const close = () => {
    ui.set({ contact: false });
    setTimeout(() => setState('idle'), 400);
  };
  useEscape(open, close);
  async function submit(e) {
    e.preventDefault();
    if (!endpoint) {
      setState('offline');
      return;
    }
    setState('sending');
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget).entries());
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, source: 'v2-build-your-residence' }) });
      setState(r.ok ? 'sent' : 'failed');
    } catch {
      setState('failed');
    }
  }
  const email = site?.company?.email;
  return (
    <div className={`modal ${open ? 'is-on' : ''}`} onClick={close} aria-hidden={!open}>
      {open && (
        <div className="modal__card modal__card--form" role="dialog" aria-modal="true" aria-label="Get in touch" onClick={(e) => e.stopPropagation()}>
          <button className="board__close" onClick={close} aria-label="Close">
            <Icon name="close" size={18} />
          </button>
          <h3 className="modal__title">Get in Touch</h3>
          {!endpoint && <p className="form__notice">This form is not connected yet: messages are not sent anywhere.</p>}
          {state === 'sent' ? (
            <p className="form__done">Thank you — your message was sent.</p>
          ) : (
            <form onSubmit={submit} className="form">
              <label>
                Name
                <input name="name" required autoComplete="name" />
              </label>
              <label>
                Work email
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                Company
                <input name="company" autoComplete="organization" />
              </label>
              <label>
                Project
                <textarea name="message" rows={3} placeholder="Tell us about your project" />
              </label>
              <button className="btn btn--yellow" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send'} <Icon name="arrowRight" size={16} />
              </button>
              {state === 'offline' && (
                <p className="form__error">
                  Not sent: the form is not connected yet.{email ? ` Please write to ${email}.` : ' Contact details will be added soon.'}
                </p>
              )}
              {state === 'failed' && <p className="form__error">The message could not be sent. Please try again later.</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
