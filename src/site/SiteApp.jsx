import { useEffect, useMemo } from 'react';
import { loadSite } from '../data/source.js';
import { toSiteModel } from '../data/site.js';
import { Footer, Header } from './Layout.jsx';
import { SiteContext, useResource } from './useResource.js';
import Home from './pages/Home.jsx';
import PropertyPage from './pages/Property.jsx';
import { Locations, Projects, Properties, VirtualTours } from './pages/Listings.jsx';
import { About, BookDemo, Contact, Dashboard, Login, NotFound, Privacy, Saas, Terms } from './pages/Info.jsx';
import './site.css';

const PAGES = {
  home: Home,
  properties: Properties,
  property: PropertyPage,
  projects: Projects,
  locations: Locations,
  'virtual-tours': VirtualTours,
  about: About,
  contact: Contact,
  saas: Saas,
  'book-a-demo': BookDemo,
  login: Login,
  dashboard: Dashboard,
  privacy: Privacy,
  terms: Terms,
  'not-found': NotFound
};

/** The public website: every route except the full-screen 3D experience. */
export default function SiteApp({ location }) {
  const res = useResource(loadSite, 'site');
  // If site.json is missing the site still works, with every company detail shown as "to be added".
  const site = useMemo(() => res.data || toSiteModel({}), [res.data]);
  useEffect(() => {
    if (res.status === 'error') console.warn(`[site.json] ${res.error?.message} Company details show as “to be added”.`);
  }, [res.status, res.error]);

  useEffect(() => {
    const root = document.documentElement;
    if (site.brand.accent) root.style.setProperty('--accent', site.brand.accent);
    else root.style.removeProperty('--accent');
  }, [site.brand.accent]);

  const Page = PAGES[location.route.id] || NotFound;
  // The homepage opens on the live 3D building, with the header laid over it.
  const overlay = location.route.id === 'home';
  // `key`: a new page starts fresh (its own loading state), even when only the slug changes.
  const pageKey = `${location.route.id}:${location.params.slug || ''}`;
  return (
    <SiteContext.Provider value={site}>
      <div className={overlay ? 'site site--overlay' : 'site'}>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header current={location.route.id} overlay={overlay} />
        <main id="main" className="site-main" tabIndex={-1}>
          <Page key={pageKey} location={location} />
        </main>
        <Footer />
      </div>
    </SiteContext.Provider>
  );
}
