import { useState } from 'react';
import { useSite } from '../useResource.js';
import { FormStatus } from '../pages/Info.jsx';

/**
 * Enquiry and site-visit request. Static site rules apply: unless `forms.endpoint` is set in
 * site.json, nothing can be sent, and the form says so instead of pretending. With an endpoint, the
 * request is posted as JSON and reported as sent only when the server confirms it.
 */
export function Enquiry({ properties, slug }) {
  const site = useSite();
  const endpoint = site.forms?.endpoint || null;
  const { company } = site;
  const [state, setState] = useState({ status: 'idle', message: '' });
  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    if (!endpoint) {
      setState({ status: 'offline', message: 'Not sent: this website’s forms are not connected yet, so your details have not gone anywhere.' });
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ status: 'sending', message: 'Sending…' });
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'enquiry', ...data }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState({ status: 'sent', message: 'Sent. The team will be in touch.' });
      form.reset();
    } catch {
      setState({ status: 'error', message: 'Not sent: the server didn’t confirm it. Please try again, or use the contact details.' });
    }
  };

  const contact = [
    ['Phone', company.phone, company.phone ? `tel:${company.phone.replace(/\s+/g, '')}` : null],
    ['Email', company.email, company.email ? `mailto:${company.email}` : null],
    ['Sales gallery', company.address, null],
    ['Hours', company.hours, null]
  ];

  return (
    <section id="enquire" className="enquire tone-night" aria-labelledby="enquire-h">
      <div className="wrap enquire__grid">
        <div className="enquire__intro">
          <p className="kicker">Enquiries &amp; site visits</p>
          <h2 id="enquire-h" className="section__title">
            See it in person
          </h2>
          <p className="enquire__lede">Ask about a home, request the brochure, or book a visit to the site and sales gallery.</p>
          <dl className="enquire__contact">
            {contact.map(([label, value, href]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value ? href ? <a href={href}>{value}</a> : value : <span className="enquire__tba">To be added</span>}</dd>
              </div>
            ))}
          </dl>
        </div>

        <form className="enquire__form" onSubmit={onSubmit}>
          <FormStatus />
          <div className="enquire__row">
            <label>
              <span>Name</span>
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              <span>Phone</span>
              <input name="phone" type="tel" autoComplete="tel" required />
            </label>
          </div>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" />
          </label>
          <div className="enquire__row">
            <label>
              <span>Property</span>
              <select name="property" defaultValue={slug || ''}>
                {properties.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>I would like to</span>
              <select name="request" defaultValue="visit">
                <option value="visit">Book a site visit</option>
                <option value="call">Get a call back</option>
                <option value="brochure">Receive the brochure</option>
              </select>
            </label>
          </div>
          <div className="enquire__row">
            <label>
              <span>Preferred date</span>
              <input name="date" type="date" min={today} />
            </label>
            <label>
              <span>Preferred time</span>
              <select name="time" defaultValue="">
                <option value="">Any time</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </label>
          </div>
          <label>
            <span>Message (optional)</span>
            <textarea name="message" rows={3} />
          </label>
          <div className="enquire__submit">
            <button type="submit" className="button button--primary" disabled={state.status === 'sending'}>
              {endpoint ? 'Send request' : 'Send request (not connected)'}
            </button>
            {state.message && (
              <p className={`enquire__result is-${state.status}`} role="status">
                {state.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
