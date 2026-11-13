import { useEffect, useState } from 'react';
import { Link } from '../router.jsx';
import { cls, initials } from '../lib/format.js';
import { useSite } from './useResource.js';

export const NAV = [
  { to: '/', label: 'Home', ids: ['home'] },
  { to: '/properties', label: 'Properties', ids: ['properties', 'property'] },
  { to: '/projects', label: 'Projects', ids: ['projects'] },
  { to: '/locations', label: 'Locations', ids: ['locations'] },
  { to: '/virtual-tours', label: 'Virtual Tours', ids: ['virtual-tours'] },
  { to: '/about', label: 'About Us', ids: ['about'] },
  { to: '/contact', label: 'Contact', ids: ['contact'] }
];

function Brand() {
  const site = useSite();
  return (
    <Link className="sbrand" to="/" aria-label={`${site.brand.name}, home`}>
      {site.brand.logo ? (
        <img className="sbrand__logo" src={site.brand.logo} alt="" />
      ) : (
        <span className="sbrand__mark" aria-hidden="true">
          {initials(site.brand.name)}
        </span>
      )}
      <span className="sbrand__name">{site.brand.name}</span>
    </Link>
  );
}

/** The site header. `overlay`: transparent over the homepage's 3D hero until the page scrolls. */
export function Header({ current, overlay = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setOpen(false), [current]);
  useEffect(() => {
    if (!overlay) return undefined;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    // the open menu covers the page: stop the page behind it from scrolling
    const root = document.documentElement;
    root.classList.add('menu-open');
    window.addEventListener('keydown', onKey);
    const wide = window.matchMedia('(min-width: 1081px)');
    const onWide = () => wide.matches && setOpen(false);
    wide.addEventListener('change', onWide);
    return () => {
      root.classList.remove('menu-open');
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);
  return (
    <header className={cls('shead tone-night', open && 'is-open', overlay && !scrolled && !open ? 'is-clear' : 'is-solid')}>
      <div className="shead__bar wrap">
        <Brand />
        <button
          type="button"
          className="shead__toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="shead__burger" aria-hidden="true" />
        </button>
        <nav id="site-nav" className="shead__nav" aria-label="Main">
          <ul className="shead__links">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} aria-current={n.ids.includes(current) ? 'page' : undefined}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="shead__actions">
            <Link className="shead__login" to="/login" aria-current={current === 'login' ? 'page' : undefined}>
              Login
            </Link>
            <Link className="button button--primary button--sm" to="/book-a-demo">
              Book a Demo
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  const site = useSite();
  const { company, brand, social } = site;
  const missing = <span className="sfoot__missing">to be added</span>;
  return (
    <footer className="sfoot tone-night">
      <div className="wrap sfoot__top">
        <div className="sfoot__brand">
          <Brand />
          {brand.tagline && <p className="sfoot__tagline">{brand.tagline}</p>}
        </div>
        <Link className="button button--primary" to="/book-a-demo">
          Book a demo
        </Link>
      </div>
      <div className="wrap sfoot__grid">
        <div className="sfoot__col">
          <h2 className="sfoot__h">Explore</h2>
          <ul>
            <li>
              <Link to="/properties">Properties</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/locations">Locations</Link>
            </li>
            <li>
              <Link to="/virtual-tours">Virtual tours</Link>
            </li>
          </ul>
        </div>
        <div className="sfoot__col">
          <h2 className="sfoot__h">Platform</h2>
          <ul>
            <li>
              <Link to="/saas">For developers</Link>
            </li>
            <li>
              <Link to="/book-a-demo">Book a demo</Link>
            </li>
            <li>
              <Link to="/login">Builder login</Link>
            </li>
            <li>
              <Link to="/about">About us</Link>
            </li>
          </ul>
        </div>
        <div className="sfoot__col">
          <h2 className="sfoot__h">Contact</h2>
          <ul>
            <li>{company.email ? <a href={`mailto:${company.email}`}>{company.email}</a> : <>Email {missing}</>}</li>
            <li>{company.phone ? <a href={`tel:${company.phone.replace(/[^\d+]/g, '')}`}>{company.phone}</a> : <>Phone {missing}</>}</li>
            <li>{company.address || <>Address {missing}</>}</li>
            <li>
              <Link to="/contact">Contact page</Link>
            </li>
          </ul>
        </div>
        <div className="sfoot__col">
          <h2 className="sfoot__h">Follow</h2>
          {social.length > 0 ? (
            <ul>
              {social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="sfoot__missing">Social links to be added.</p>
          )}
        </div>
      </div>
      <div className="wrap sfoot__base">
        <span>
          © {new Date().getFullYear()} {company.legalName || brand.name}
          {!company.legalName && <span className="sfoot__missing"> · company details to be added</span>}
        </span>
        <span className="sfoot__legal">
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms and conditions</Link>
        </span>
      </div>
    </footer>
  );
}

export function PageHead({ eyebrow, title, crumbs, children }) {
  return (
    <header className="phead tone-night">
      <div className="wrap phead__inner">
        {crumbs && (
          <nav className="phead__crumbs" aria-label="Breadcrumb">
            {crumbs}
          </nav>
        )}
        {eyebrow && <p className="kicker">{eyebrow}</p>}
        <h1 className="phead__title">{title}</h1>
        {children && <div className="phead__lede">{children}</div>}
      </div>
    </header>
  );
}

/** What the brief asks this page to contain, so a Stage 1 page shows what is still to come. */
export function Planned({ items, stage }) {
  return (
    <aside className="planned" aria-label="Planned for this page">
      <p className="planned__h">
        <span className="planned__dot" aria-hidden="true" />
        Still to come on this page{stage ? ` · ${stage}` : ''}
      </p>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </aside>
  );
}

export function Loading({ label = 'Loading' }) {
  return (
    <p className="state" role="status">
      {label}…
    </p>
  );
}

export function Failed({ error, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <p>{error?.message || 'Something could not be loaded.'}</p>
      {onRetry && error?.code !== 'NOT_FOUND' && (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
