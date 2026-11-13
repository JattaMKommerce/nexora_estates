import { Link } from '../../router.jsx';
import { PageHead, Planned } from '../Layout.jsx';
import { useSite, useTitle } from '../useResource.js';

/** Whether forms can send anything, stated plainly. Nothing is ever reported as sent unless it was. */
export function FormStatus() {
  const site = useSite();
  const { email } = site.company;
  if (site.forms.endpoint) {
    return (
      <p className="formstate formstate--on" role="note">
        Forms on this site are connected. A message counts as sent only once the server confirms it.
      </p>
    );
  }
  return (
    <p className="formstate" role="note">
      <strong>Forms are not connected yet.</strong> This static version has nowhere to send messages, so forms will say so
      instead of pretending to send.{' '}
      {email ? (
        <>
          Until then, write to <a href={`mailto:${email}`}>{email}</a>.
        </>
      ) : (
        'A contact email will be listed here once it is added to the site settings.'
      )}
    </p>
  );
}

export function About() {
  useTitle('About us');
  const site = useSite();
  return (
    <>
      <PageHead eyebrow="About us" title={`About ${site.brand.name}`}>
        {site.brand.tagline}
      </PageHead>
      <section className="section">
        <div className="wrap">
          <p className="prose muted">The company story, team and approach will be written here once the company details are confirmed.</p>
          <Planned items={['Company story and mission', 'How the 3D experiences are made', 'Team (only real people, with their consent)']} />
        </div>
      </section>
    </>
  );
}

export function Contact() {
  useTitle('Contact');
  const { company } = useSite();
  const missing = <span className="muted">To be added</span>;
  return (
    <>
      <PageHead eyebrow="Contact" title="Talk to us" />
      <section className="section">
        <div className="wrap split">
          <dl className="specs">
            <div>
              <dt>Email</dt>
              <dd>{company.email ? <a href={`mailto:${company.email}`}>{company.email}</a> : missing}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{company.phone || missing}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{company.address || missing}</dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>{company.hours || missing}</dd>
            </div>
          </dl>
          <div>
            <FormStatus />
            <Planned items={['Contact form with validation', 'Map to the office']} />
          </div>
        </div>
      </section>
    </>
  );
}

export function Saas() {
  useTitle('For developers');
  return (
    <>
      <PageHead eyebrow="For developers and builders" title="Sell homes before they are built">
        Give every project its own immersive website: a realistic 3D building, live availability, floor plans, interiors and
        360° tours, under your brand.
      </PageHead>
      <section className="section">
        <div className="wrap">
          <div className="actions">
            <Link className="button button--primary" to="/book-a-demo">
              Book a demo
            </Link>
            <Link className="button" to="/book-a-demo">
              Contact sales
            </Link>
          </div>
          <Planned
            stage="Stage 8"
            items={[
              'Product overview and features',
              'Benefits for builders',
              '3D visualisation, inventory, virtual tours, project management, lead generation',
              'White-label branding and multi-property management',
              'Plans with “Contact sales” (no fixed prices)',
              'FAQ',
              'Book a demo'
            ]}
          />
        </div>
      </section>
    </>
  );
}

export function BookDemo() {
  useTitle('Book a demo');
  return (
    <>
      <PageHead eyebrow="Book a demo" title="See it with your own project">
        Tell us about your company and projects, and we will show you the platform.
      </PageHead>
      <section className="section">
        <div className="wrap">
          <FormStatus />
          <Planned
            stage="Stage 8"
            items={['Full name', 'Company name', 'Business email', 'Phone number', 'Number of projects', 'Message', 'Validation, and a clear “not connected” state until a server is configured']}
          />
          <p>
            <Link to="/saas">About the platform for developers</Link>
          </p>
        </div>
      </section>
    </>
  );
}

export function Login() {
  useTitle('Builder login');
  return (
    <>
      <PageHead eyebrow="Builder login" title="Builder accounts are not available yet">
        This version of the site is static: it has no accounts, so there is nothing to log in to. Builder accounts, project
        management and uploads come with the separate backend planned for later.
      </PageHead>
      <section className="section">
        <div className="wrap">
          <div className="actions">
            <Link className="button button--primary" to="/book-a-demo">
              Book a demo
            </Link>
            <Link className="button" to="/">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function Dashboard() {
  useTitle('Builder dashboard');
  return (
    <>
      <PageHead eyebrow="Builder dashboard" title="The dashboard is planned, not built">
        Managing projects, towers, units, assets, branding and enquiries needs a secure server with accounts and separate
        data for each builder. It will be built with that backend, not in this static version.
      </PageHead>
      <section className="section">
        <div className="wrap">
          <Planned
            stage="after the backend is chosen"
            items={[
              'Builder accounts with each builder’s data kept separate',
              'Projects, towers and units with availability',
              'Uploads: images, floor plans, 3D models, panoramas, brochures',
              'Logo and brand colours',
              'Publishing each property website',
              'Enquiries inbox'
            ]}
          />
        </div>
      </section>
    </>
  );
}

function Legal({ title }) {
  useTitle(title);
  return (
    <>
      <PageHead eyebrow="Legal" title={title}>
        <p className="label label--notice">Draft · needs legal review</p>
      </PageHead>
      <section className="section">
        <div className="wrap">
          <p className="prose muted">
            The text of this page has not been written yet. It must be prepared or reviewed by a lawyer for the company that
            operates this website before the site is published.
          </p>
        </div>
      </section>
    </>
  );
}

export const Privacy = () => <Legal title="Privacy policy" />;
export const Terms = () => <Legal title="Terms and conditions" />;

export function NotFound({ message }) {
  useTitle('Page not found');
  return (
    <>
      <PageHead eyebrow="404" title="This page doesn’t exist">
        {message || 'The address may be mistyped, or the page may have moved.'}
      </PageHead>
      <section className="section">
        <div className="wrap actions">
          <Link className="button button--primary" to="/">
            Home
          </Link>
          <Link className="button" to="/properties">
            All properties
          </Link>
        </div>
      </section>
    </>
  );
}
