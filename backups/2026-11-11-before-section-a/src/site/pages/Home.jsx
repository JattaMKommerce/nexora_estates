import { useCallback, useMemo, useState } from 'react';
import { Link } from '../../router.jsx';
import { loadCatalogue } from '../../data/source.js';
import { PROTOTYPE_SLUG } from '../../data/slug.js';
import { Failed, Loading } from '../Layout.jsx';
import { PropertyCard } from '../PropertyCard.jsx';
import { useResource, useSite, useTitle } from '../useResource.js';
import { useImmersive } from '../home/Hero3D.jsx';
import { Story } from '../home/Story.jsx';
import { Enquiry } from '../home/Enquiry.jsx';
import { IconArrow } from '../icons.jsx';

/**
 * The home page, one continuous experience:
 *   the story (one live 3D scene, pinned): opening → construction → architecture → floor by floor →
 *   inside a home → amenities; then the portfolio, enquiries and site visits, and a word for
 *   developers. The story's chapters replaced the earlier statement and "3D experience" sections
 *   (kept in backups/2026-11-11-before-homepage-refinement/).
 */
export default function Home() {
  useTitle(null);
  const site = useSite();
  const catalogue = useResource(loadCatalogue, 'catalogue');
  const listed = useMemo(() => (catalogue.data || []).filter((p) => p.listed), [catalogue.data]);
  const [chosen, setChosen] = useState(null);
  const stage = useImmersive();

  // The story shows the chosen project, else the site's default, else the first listed one. With no
  // published projects (or no catalogue) it shows the clearly labelled prototype tower.
  const noProjects = catalogue.status === 'error' || (catalogue.status === 'ready' && listed.length === 0);
  const slug =
    (chosen && listed.some((p) => p.slug === chosen) ? chosen : null) ||
    (listed.some((p) => p.slug === site.defaultProperty) ? site.defaultProperty : listed[0]?.slug) ||
    (noProjects ? PROTOTYPE_SLUG : null);

  const { open } = stage;
  const view3D = useCallback(
    (s) => {
      setChosen(s);
      open('explore', s);
    },
    [open]
  );
  const allSample = listed.length > 0 && listed.every((p) => p.fictional || p.mode !== 'live');

  return (
    <>
      <h1 className="sr-only">
        {site.brand.name}: {site.brand.tagline || 'immersive 3D property experiences'}
      </h1>
      <Story properties={listed} slug={slug} onSlug={setChosen} stage={stage} loading={catalogue.status === 'loading'} />

      <section id="portfolio" className="section portfolio" aria-labelledby="portfolio-h">
        <div className="wrap">
          <div className="portfolio__head">
            <div>
              <p className="kicker">The portfolio</p>
              <h2 id="portfolio-h" className="section__title">
                Choose a tower, a floor and a home
              </h2>
            </div>
            <div className="portfolio__aside">
              <p>
                Every development here has its own 3D sales gallery: the building in its setting, availability floor by
                floor, floor plans, furnished interiors and 360° tours, in the browser, on any screen.
              </p>
              <Link className="textlink" to="/properties">
                All properties <IconArrow />
              </Link>
            </div>
          </div>
          {catalogue.status === 'loading' && <Loading label="Loading properties" />}
          {catalogue.status === 'error' && <Failed error={catalogue.error} onRetry={catalogue.retry} />}
          {catalogue.status === 'ready' && (
            <div className="grid grid--cards">
              {listed.map((p) => (
                <PropertyCard key={p.slug} p={p} onView3D={view3D} />
              ))}
              {listed.length === 0 && <p className="state">No properties are published yet.</p>}
            </div>
          )}
          {allSample && (
            <p className="featured__note">
              These projects are fictional demonstrations. Their names, homes, prices and availability are sample data, and
              the images are stills from the illustrative 3D model.
            </p>
          )}
        </div>
      </section>

      <Enquiry properties={listed} slug={slug} />

      <section className="devband" aria-labelledby="devband-h">
        <div className="wrap devband__grid">
          <div>
            <p className="kicker">For developers and builders</p>
            <h2 id="devband-h" className="section__title">
              Give every project its own 3D sales gallery
            </h2>
          </div>
          <div className="devband__body">
            <ul className="devband__list">
              <li>Your towers and inventory in 3D, with availability on every floor</li>
              <li>Floor plans, furnished interiors and 360° tours</li>
              <li>A website for each project, under your brand</li>
              <li>Several properties managed in one place</li>
            </ul>
            <div className="actions">
              <Link className="button button--primary" to="/book-a-demo">
                Book a demo
              </Link>
              <Link className="button button--solid" to="/contact">
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
