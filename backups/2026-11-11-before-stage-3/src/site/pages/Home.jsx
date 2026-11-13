import { useCallback, useMemo, useState } from 'react';
import { Link } from '../../router.jsx';
import { loadCatalogue } from '../../data/source.js';
import { PROTOTYPE_SLUG } from '../../data/slug.js';
import { mediaUrl } from '../../lib/paths.js';
import { cls } from '../../lib/format.js';
import { Failed, Loading } from '../Layout.jsx';
import { PropertyCard } from '../PropertyCard.jsx';
import { useResource, useSite, useTitle } from '../useResource.js';
import { Hero3D, useImmersive } from '../home/Hero3D.jsx';
import { IconArrow, IconBuilding, IconLayers, IconPanorama, IconPlan, IconSofa } from '../icons.jsx';

/** The five views of the experience. Each opens in the live hero ("command" ids, see ExperienceApp). */
const JOURNEY = [
  {
    id: 'explore',
    icon: IconBuilding,
    title: 'The whole development',
    text: 'Turn the building, switch between towers and see at a glance how many homes are available on every floor.',
    img: 'media/experience/building.jpg',
    action: 'Explore the building'
  },
  {
    id: 'floor',
    icon: IconLayers,
    title: 'Any floor, opened up',
    text: 'Choose a level and the floors above lift away, showing every residence on it in the colour of its availability.',
    img: 'media/experience/floor.jpg',
    action: 'Open a floor'
  },
  {
    id: 'plan',
    icon: IconPlan,
    title: 'The floor plan',
    text: 'A plan of the whole floor. Select a residence for its configuration, carpet and built-up areas, facing and price.',
    img: 'media/experience/plan.jpg',
    action: 'See a floor plan'
  },
  {
    id: 'interior',
    icon: IconSofa,
    title: 'Inside the residence',
    text: 'Step into the same layout, furnished in three recommended interior styles, and look around it room by room.',
    img: 'media/experience/interior.jpg',
    action: 'Step inside'
  },
  {
    id: '360',
    icon: IconPanorama,
    title: 'A 360° look around',
    text: 'Where panoramas are supplied, look around each room in 360°. The demo projects use clearly labelled sample panoramas.',
    img: 'media/experience/tour.jpg',
    action: 'Look around in 360°'
  }
];

function Journey({ onOpen, disabled }) {
  const [active, setActive] = useState(0);
  const [missing, setMissing] = useState({});
  const ActiveIcon = JOURNEY[active].icon;
  return (
    <section className="journey tone-night" aria-labelledby="journey-h">
      <div className="wrap journey__grid">
        <header className="journey__intro">
          <p className="kicker">The 3D experience</p>
          <h2 id="journey-h" className="section__title">
            From the skyline <br />
            to the sofa
          </h2>
          <p className="journey__lede">Five views of one live model. Each opens right here, in the building at the top of this page.</p>
        </header>

        <figure className="journey__figure">
          <div className="journey__frame">
            {JOURNEY.map((s, i) =>
              missing[s.id] ? null : (
                <img
                  key={s.id}
                  className={cls(i === active && 'is-active')}
                  src={mediaUrl(s.img)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={() => setMissing((m) => ({ ...m, [s.id]: true }))}
                />
              )
            )}
            {missing[JOURNEY[active].id] && (
              <span className="journey__placeholder" aria-hidden="true">
                <ActiveIcon width="44" height="44" />
              </span>
            )}
          </div>
          <figcaption>Still from the 3D view of a fictional demo project · illustrative</figcaption>
        </figure>

        <ol className="journey__steps">
          {JOURNEY.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.id} className={cls('journey__step', i === active && 'is-active')} onMouseEnter={() => setActive(i)}>
                <button type="button" className="journey__head" aria-expanded={i === active} onClick={() => setActive(i)} onFocus={() => setActive(i)}>
                  <span className="journey__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="journey__title">{s.title}</span>
                  <Icon className="journey__icon" />
                </button>
                <div className="journey__body">
                  <div>
                    <p>{s.text}</p>
                    <button type="button" className="textlink" onClick={() => onOpen(s.id)} disabled={disabled} tabIndex={i === active ? 0 : -1}>
                      {s.action} <IconArrow />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function Home() {
  useTitle(null);
  const site = useSite();
  const catalogue = useResource(loadCatalogue, 'catalogue');
  const listed = useMemo(() => (catalogue.data || []).filter((p) => p.listed), [catalogue.data]);
  const [chosen, setChosen] = useState(null);
  const stage = useImmersive();

  // The hero shows the chosen project, else the site's default, else the first listed one. With no
  // published projects (or no catalogue) it shows the clearly labelled prototype tower.
  const noProjects = catalogue.status === 'error' || (catalogue.status === 'ready' && listed.length === 0);
  const slug =
    (chosen && listed.some((p) => p.slug === chosen) ? chosen : null) ||
    (listed.some((p) => p.slug === site.defaultProperty) ? site.defaultProperty : listed[0]?.slug) ||
    (noProjects ? PROTOTYPE_SLUG : null);

  const { open } = stage;
  const openView = useCallback((id) => open(id, slug), [open, slug]);
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
      <Hero3D properties={listed} slug={slug} onSlug={setChosen} stage={stage} loading={catalogue.status === 'loading'} />

      <section id="discover" className="statement" aria-labelledby="statement-h">
        <div className="wrap statement__grid">
          <p className="kicker statement__kicker">{site.brand.name}</p>
          <h2 id="statement-h" className="statement__text">
            Choose a tower, a floor and a home. See its plan and step inside, <em>before a single brick is laid.</em>
          </h2>
          <div className="statement__aside">
            <p>
              Every project gets its own 3D sales gallery: the building in its setting, availability floor by floor, floor
              plans, furnished interiors and 360° tours. It runs in the browser, on any screen.
            </p>
            <div className="actions">
              <Link className="button button--solid" to="/properties">
                All properties
              </Link>
              <Link className="textlink" to="/saas">
                For developers <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Journey onOpen={openView} disabled={!slug} />

      <section className="section featured" aria-labelledby="featured-h">
        <div className="wrap">
          <div className="section__head">
            <div>
              <p className="kicker">Properties</p>
              <h2 id="featured-h" className="section__title">
                Featured developments
              </h2>
            </div>
            <Link className="textlink" to="/properties">
              All properties <IconArrow />
            </Link>
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
