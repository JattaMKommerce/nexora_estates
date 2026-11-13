import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useProperty } from '../data/useProperty.js';
import { DATA_FILE } from '../data/property.js';
import { floorPlanFor, plateFor } from '../plan/layout.js';
import { roomViews } from '../interior/viewpoints.js';
import { detectQuality, hasWebGL, isCoarsePointer, usePrefersReducedMotion, useViewport, webglAdvice } from '../lib/env.js';
import { cls, levelName } from '../lib/format.js';
import { Dock, Filters, FloorPanel, FloorRail, HintBar, IntroOverlay, TopBar, usePresence } from './ui/Hud.jsx';
import { UnitPanel } from './ui/UnitPanel.jsx';
import { PlanView } from './ui/PlanView.jsx';
import { InteriorHud, TourHud } from './ui/InteriorHud.jsx';
import { GuidedTourBar, useGuidedTour } from './ui/GuidedTour.jsx';
import { ErrorBoundary, Loader, StatusScreen } from './ui/Screens.jsx';
import { PROTOTYPE_SLUG } from '../data/slug.js';
import { sitePath } from '../lib/paths.js';
import './experience.css';

const Experience = lazy(() => import('../three/Experience.jsx'));

function readParams(slug) {
  const p = new URLSearchParams(window.location.search);
  const floor = p.get('floor');
  return {
    prototype: slug === PROTOTYPE_SLUG || p.has('prototype'),
    towerId: p.get('tower'),
    floor: floor !== null && floor !== '' && Number.isInteger(Number(floor)) ? Number(floor) : null,
    unit: (p.get('unit') || '').trim() || null,
    tour: p.get('tour')
  };
}

/** Inside the homepage the address belongs to the website: no deep-link parameters, no autoplaying tour. */
const embeddedParams = (slug) => ({ prototype: slug === PROTOTYPE_SLUG, towerId: null, floor: null, unit: null, tour: '0' });

const seenKey = (id) => `restate:guided-tour:${id}`;
const readSeen = (id) => {
  try {
    return window.localStorage.getItem(seenKey(id)) === '1';
  } catch {
    return false;
  }
};
const writeSeen = (id) => {
  try {
    window.localStorage.setItem(seenKey(id), '1');
  } catch {
    /* private mode: fine */
  }
};

function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** The floor and residence the guided tour shows: a mid-height floor with the most availability. */
function pickFeatured(tower, plate) {
  const n = tower.levels.length;
  let best = Math.min(n - 1, Math.max(0, Math.round(n * 0.6)));
  let score = -1;
  tower.levels.forEach((l, i) => {
    if (i < n * 0.35 || i > n * 0.8) return;
    const s = l.counts ? l.counts.available * 10 + l.units.length : 0;
    if (s > score) {
      score = s;
      best = i;
    }
  });
  const plan = floorPlanFor(tower, tower.levels[best], plate);
  const pick =
    plan.units.find((u) => u.unit?.status === 'available' && u.bedrooms >= 3) ||
    plan.units.find((u) => u.unit?.status === 'available') ||
    plan.units.find((u) => u.bedrooms >= 3) ||
    plan.units[0];
  return { floorIndex: best, unitKey: pick?.key ?? null, plan };
}

/**
 * The 3D experience (Phase 1 + 2): tower → floor → residence → floor plan → interior → 360° tour,
 * with the guided tour. `slug` names the property folder; "prototype" opens the built-in tower.
 *
 * Two ways to run it:
 *   full screen   /experience/<slug>, the whole document (no `embed`)
 *   embedded      the homepage hero (`embed` given). It starts as a live preview inside the page: the
 *                 building turns slowly, floors can be pointed at and the page still scrolls. Choosing a
 *                 floor (or embed.command) asks the page to go immersive; the same scene then fills the
 *                 screen with every control, and closing it returns to the preview.
 *
 * embed = { immersive, onImmersive(on), command: { id, n }, active, onStatus(status) }
 *   command ids: explore · tour · floor · plan · residence · interior · 360
 *   active: false pauses rendering while the hero is scrolled out of view
 */
export default function ExperienceApp({ slug, embed = null }) {
  const embedded = Boolean(embed);
  const immersive = !embedded || Boolean(embed.immersive);
  const embedRef = useRef(embed);
  embedRef.current = embed;
  const immersiveRef = useRef(immersive);
  immersiveRef.current = immersive;
  const boot = useMemo(() => (embedded ? embeddedParams(slug) : readParams(slug)), [slug, embedded]);
  const webgl = useMemo(hasWebGL, []);
  const quality = useMemo(detectQuality, []);
  const touch = useMemo(isCoarsePointer, []);
  const reducedMotion = usePrefersReducedMotion();
  const viewport = useViewport();
  const data = useProperty({ slug, prototype: boot.prototype });

  const [towerId, setTowerId] = useState(boot.towerId);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [unitKey, setUnitKey] = useState(null);
  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [mode, setMode] = useState('exterior'); // exterior | interior | tour
  const [styleId, setStyleId] = useState('warm');
  const [room, setRoom] = useState(null);
  const [tourScene, setTourScene] = useState(null);
  const [filter, setFilter] = useState({ type: 'all', availableOnly: false });
  const [sceneReady, setSceneReady] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [tourError, setTourError] = useState(null);
  // The fly-in opening plays on the full-screen page. Embedded, the scene starts at rest so it takes
  // over seamlessly from the poster image (the homepage's cinematic opening comes in Stage 4).
  const [intro, setIntro] = useState(!embedded);
  const [skipToken, setSkipToken] = useState(0);
  const [resetToken, setResetToken] = useState(0);
  const [zoomToken, setZoomToken] = useState({ n: 0, delta: 0 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(null);
  const pendingFloor = useRef(boot.floor);
  const pendingUnit = useRef(boot.unit);
  const pendingKey = useRef(null); // a residence (plan key) to select once its floor's plan exists
  const pendingView = useRef(null); // 'interior' | 'tour' to open once that residence is selected
  const tourReturn = useRef('exterior');

  // The full-screen page owns the whole document (no page scroll); embedded, the website does.
  useLayoutEffect(() => {
    if (embedded) return undefined;
    const root = document.documentElement;
    root.classList.add('xp-page');
    return () => root.classList.remove('xp-page');
  }, [embedded]);

  const project = data.status === 'ready' ? data.project : null;
  const brand = project?.brand.name || '';
  const hasInventory = project ? project.mode !== 'prototype' : false;
  const tower = useMemo(
    () => (project ? project.towers.find((t) => t.id === towerId) || project.towers[0] || null : null),
    [project, towerId]
  );
  const levels = tower ? tower.levels : [];
  const selectedLevel = selectedIndex !== null ? levels[selectedIndex] || null : null;
  const plate = useMemo(() => (tower ? plateFor(tower) : null), [tower]);
  const plan = useMemo(() => (tower && selectedLevel && plate ? floorPlanFor(tower, selectedLevel, plate) : null), [tower, selectedLevel, plate]);
  const pu = plan && unitKey ? plan.units.find((u) => u.key === unitKey) || null : null;
  const views = useMemo(() => roomViews(pu), [pu]);
  const tour = pu?.unit?.tour && project ? project.tours[pu.unit.tour] || null : null;
  const introActive = intro && !reducedMotion && mode === 'exterior';
  const phase = !tower
    ? 'none'
    : mode === 'interior' && pu
      ? 'interior'
      : mode === 'tour' && tour
        ? 'tour'
        : introActive
          ? 'intro'
          : selectedLevel
            ? 'floor'
            : 'building';
  const view = phase === 'interior' ? 'interior' : phase === 'tour' ? 'tour' : 'exterior';

  /* ----------------------------------------------------------- filtering */

  const filtering = filter.type !== 'all' || filter.availableOnly;
  const matches = useCallback(
    (u) => {
      if (!filtering) return true;
      if (!u) return false;
      return (filter.type === 'all' || u.typeKey === filter.type) && (!filter.availableOnly || u.status === 'available');
    },
    [filter, filtering]
  );
  const matchCounts = useMemo(() => levels.map((l) => l.units.filter(matches).length), [levels, matches]);
  const types = useMemo(() => {
    const map = new Map();
    for (const l of levels) for (const u of l.units) if (u.typeKey && !map.has(u.typeKey)) map.set(u.typeKey, { key: u.typeKey, label: u.typeLabel || u.type, b: u.bedrooms ?? 9 });
    return [...map.values()].sort((a, b) => a.b - b.b);
  }, [levels]);

  /* ------------------------------------------------------------- effects */

  useEffect(() => {
    setSelectedIndex(null);
    setHoveredIndex(null);
    setFilter({ type: 'all', availableOnly: false });
  }, [tower?.id]);

  useEffect(() => {
    if (selectedIndex !== null && selectedIndex >= levels.length) setSelectedIndex(null);
  }, [levels.length, selectedIndex]);

  // A different floor: start with no residence picked.
  useEffect(() => {
    setUnitKey(null);
    setHoveredUnit(null);
    if (selectedIndex === null) setPlanOpen(false);
  }, [selectedIndex, tower?.id]);

  // Leaving the residence closes its interior / tour.
  useEffect(() => {
    if (!pu && mode !== 'exterior') {
      setMode('exterior');
      setRoom(null);
    }
  }, [pu, mode]);

  const introWasActive = useRef(introActive);
  useEffect(() => {
    if (introWasActive.current && !introActive && !reducedMotion && !interacted && pendingFloor.current === null && !guided.active) {
      setAutoRotate(true);
    }
    introWasActive.current = introActive;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introActive, reducedMotion, interacted]);

  // Deep links (?floor=12&unit=A-1203) are honoured once the opening has finished.
  useEffect(() => {
    if (!sceneReady || introActive || pendingFloor.current === null || !levels.length) return;
    const i = levels.findIndex((l) => l.number === pendingFloor.current);
    pendingFloor.current = null;
    if (i >= 0) setSelectedIndex(i);
    else pendingUnit.current = null;
  }, [sceneReady, introActive, levels]);
  useEffect(() => {
    if (!plan) return;
    if (pendingKey.current) {
      const key = pendingKey.current;
      pendingKey.current = null;
      if (plan.units.some((u) => u.key === key)) setUnitKey(key);
      return;
    }
    if (!pendingUnit.current) return;
    const want = pendingUnit.current.toLowerCase();
    pendingUnit.current = null;
    const hit = plan.units.find((u) => u.unit && (u.unit.number.toLowerCase() === want || u.unit.id.toLowerCase() === want));
    if (hit) setUnitKey(hit.key);
  }, [plan]);

  /* ------------------------------------------------------------- actions */

  const onHover = useCallback((index, on = true) => {
    setHoveredIndex((h) => (on ? index : h === index ? null : h));
  }, []);
  const onUnitHover = useCallback((key, on = true) => {
    setHoveredUnit((h) => (on ? key : h === key ? null : h));
  }, []);

  const selectFloor = useCallback((index) => {
    setIntro(false);
    setAutoRotate(false);
    setHoveredIndex(null);
    setSelectedIndex(index);
  }, []);
  const onSelect = useCallback(
    (index) => {
      setInteracted(true);
      // In the homepage preview, choosing a floor opens the experience in place.
      if (!immersiveRef.current) embedRef.current?.onImmersive?.(true);
      selectFloor(index);
    },
    [selectFloor]
  );
  const back = useCallback(() => {
    setSelectedIndex(null);
    setPlanOpen(false);
  }, []);
  const step = useCallback(
    (delta) => setSelectedIndex((i) => (i === null ? i : Math.max(0, Math.min(levels.length - 1, i + delta)))),
    [levels.length]
  );
  const selectUnit = useCallback((key) => {
    setUnitKey(key);
    setHoveredUnit(null);
  }, []);
  const clearUnit = useCallback(() => setUnitKey(null), []);

  const enterInterior = useCallback(() => {
    setPlanOpen(false);
    setRoom(null);
    setViewLoading(true);
    setMode('interior');
  }, []);
  const exitInterior = useCallback(() => {
    setRoom(null);
    setViewLoading(true);
    setMode('exterior');
  }, []);
  const openTour = useCallback(() => {
    if (!tour) return;
    tourReturn.current = mode === 'tour' ? tourReturn.current : mode;
    setTourError(null);
    setPlanOpen(false);
    setTourScene(tour.scenes[0].id);
    setViewLoading(true);
    setMode('tour');
  }, [tour, mode]);
  const closeTour = useCallback(() => {
    setViewLoading(true);
    setMode(tourReturn.current === 'interior' ? 'interior' : 'exterior');
  }, []);

  const onIntroDone = useCallback(() => setIntro(false), []);
  const onSkipIntro = useCallback(() => {
    setIntro(false);
    setInteracted(true);
    setSkipToken((t) => t + 1);
  }, []);
  const onReady = useCallback(() => {
    setSceneReady(true);
    setViewLoading(false);
  }, []);
  const onViewReady = useCallback(() => setViewLoading(false), []);
  const onContextLost = useCallback(() => setContextLost(true), []);
  const zoom = useCallback((delta) => setZoomToken((z) => ({ n: z.n + 1, delta })), []);

  /* --------------------------------------------------------- guided tour */

  const featured = useMemo(() => (tower && plate ? pickFeatured(tower, plate) : null), [tower, plate]);
  const featuredViews = useMemo(() => {
    if (!featured) return [];
    return roomViews(featured.plan.units.find((u) => u.key === featured.unitKey));
  }, [featured]);

  const steps = useMemo(() => {
    if (!project || !tower || !featured) return [];
    const n = levels.length;
    const sweep = Array.from({ length: n }, (_, i) => ({ t: 0.3 + (i * 3.6) / Math.max(1, n - 1), run: () => setHoveredIndex(i) }));
    const living = featuredViews.find((v) => v.type === 'living' || v.type === 'studio');
    const bedroom = featuredViews.find((v) => v.type === 'master') || featuredViews.find((v) => v.type === 'bedroom');
    const featuredLevel = levels[featured.floorIndex];
    return [
      {
        id: 'welcome',
        title: project.name,
        text: 'A short guided tour: the building, its floors, a floor plan and a residence furnished in recommended interiors.',
        duration: 5.5,
        enter: () => {
          setMode('exterior');
          setSelectedIndex(null);
          setPlanOpen(false);
          setAutoRotate(true);
        }
      },
      {
        id: 'floors',
        title: 'Every floor is interactive',
        text: hasInventory ? 'Hover or tap any level to see how many residences are available on it.' : 'Hover or tap any level to open it up.',
        duration: 5,
        enter: () => setAutoRotate(false),
        at: [...sweep, { t: 4.4, run: () => setHoveredIndex(null) }]
      },
      {
        id: 'floor',
        title: `Opening ${levelName(featuredLevel.number)}`,
        text: hasInventory
          ? 'Selecting a level lifts the floors above away and reveals every residence. Green is available, amber on hold, grey booked.'
          : 'Selecting a level lifts the floors above away and reveals the residences on it.',
        duration: 6,
        enter: () => {
          setIntro(false);
          selectFloor(featured.floorIndex);
        }
      },
      {
        id: 'plan',
        title: 'Floor plans',
        text: 'The plan view draws the whole floor. Generated layouts are labelled illustrative; drawings supplied by the developer are shown instead when available.',
        duration: 6,
        enter: () => setPlanOpen(true)
      },
      {
        id: 'unit',
        title: 'Choose a residence',
        text: hasInventory ? 'Each home shows its configuration, carpet, built-up and super built-up areas, facing and price.' : 'Each home can be selected and explored.',
        duration: 5.5,
        enter: () => {
          setPlanOpen(false);
          setUnitKey(featured.unitKey);
        }
      },
      {
        id: 'inside',
        title: 'Step inside',
        text: 'The same layout in full 3D, furnished and lit by daylight through the glazing.',
        duration: 6,
        enter: () => {
          setUnitKey(featured.unitKey);
          setRoom(null);
          setViewLoading(true);
          setMode('interior');
        }
      },
      {
        id: 'styles',
        title: 'Recommended interiors',
        text: 'Switch between curated schemes: Warm Contemporary, Nordic Light and Luxe Marble.',
        duration: 9,
        enter: () => setStyleId('warm'),
        at: [
          { t: 3, run: () => setStyleId('nordic') },
          { t: 6, run: () => setStyleId('luxe') }
        ]
      },
      {
        id: 'walk',
        title: 'Room by room',
        text: 'Step into any room at eye level and drag to look around.',
        duration: 9,
        enter: () => setRoom(living?.id ?? null),
        at: bedroom ? [{ t: 4.5, run: () => setRoom(bedroom.id) }] : []
      },
      {
        id: 'done',
        title: 'Your turn',
        text: 'Explore freely. You can replay this tour any time with the play button.',
        duration: 4,
        enter: () => {
          setRoom(null);
          setStyleId('warm');
        }
      }
    ];
  }, [project, tower, featured, featuredViews, levels, hasInventory, selectFloor]);

  const guided = useGuidedTour(steps, {
    hold: viewLoading || !sceneReady,
    onEnd: (reason) => {
      if (project) writeSeen(project.id);
      setHoveredIndex(null);
      if (reason === 'done') {
        setRoom(null);
        setPlanOpen(false);
        setMode('exterior');
        setViewLoading(true);
        setUnitKey(null);
        setSelectedIndex(null);
      }
    }
  });

  // Autoplay once per visitor (per property) after the scene is ready; ?tour=1 forces, ?tour=0 disables.
  const autoplayChecked = useRef(false);
  useEffect(() => {
    if (!sceneReady || !project || !steps.length || autoplayChecked.current) return;
    autoplayChecked.current = true;
    const forced = boot.tour === '1';
    const disabled = boot.tour === '0' || reducedMotion || boot.floor !== null || boot.unit;
    if (forced || (!disabled && !readSeen(project.id))) guided.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneReady, project, steps.length]);

  const onUserStart = useCallback(() => {
    setAutoRotate(false);
    setInteracted(true);
    if (guided.active && !guided.paused) guided.pause();
  }, [guided]);

  /* ------------------------------------------------------------ embedded */

  // Preview: the building turns slowly (unless the visitor prefers reduced motion).
  useEffect(() => {
    if (!embedded || immersive || !sceneReady) return;
    setAutoRotate(!reducedMotion);
  }, [embedded, immersive, sceneReady, reducedMotion]);

  // Closing the immersive view returns the preview to the whole building.
  const wasImmersive = useRef(immersive);
  useEffect(() => {
    const was = wasImmersive.current;
    wasImmersive.current = immersive;
    if (!embedded || was === immersive) return;
    if (immersive) {
      // Opening: re-frame from the preview's distance to the full-screen view (a floor chosen at the
      // same moment takes its own flight instead).
      setResetToken((t) => t + 1);
      return;
    }
    if (guided.active) guided.stop('skip');
    pendingKey.current = null;
    pendingView.current = null;
    setPlanOpen(false);
    setRoom(null);
    setUnitKey(null);
    setHoveredUnit(null);
    setHoveredIndex(null);
    setSelectedIndex(null);
    setFilter({ type: 'all', availableOnly: false });
    if (mode !== 'exterior') {
      setViewLoading(true);
      setMode('exterior');
    }
    setResetToken((t) => t + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedded, immersive]);

  // Commands from the page ("Take the guided tour", "Open a floor plan", …), run once the scene is ready.
  const handledCommand = useRef(0);
  const command = embed?.command || null;
  useEffect(() => {
    if (!command || command.n === handledCommand.current || !sceneReady || !tower || !featured) return;
    handledCommand.current = command.n;
    if (command.slug && command.slug !== slug) return; // meant for another property
    const fi = featured.floorIndex;
    const openResidence = (view) => {
      pendingView.current = view;
      if (selectedIndex === fi && plan) setUnitKey(featured.unitKey);
      else {
        pendingKey.current = featured.unitKey;
        selectFloor(fi);
      }
    };
    setInteracted(true);
    switch (command.id) {
      case 'tour':
        guided.start();
        break;
      case 'floor':
        selectFloor(fi);
        break;
      case 'plan':
        selectFloor(fi);
        setPlanOpen(true);
        break;
      case 'residence':
        openResidence(null);
        break;
      case 'interior':
        openResidence('interior');
        break;
      case '360':
        openResidence('tour');
        break;
      default: // 'explore': the building, free to look around
        setAutoRotate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command, sceneReady, tower, featured]);

  // …and the residence's interior or 360° tour once that residence is selected.
  useEffect(() => {
    if (!pu || !pendingView.current) return;
    const view = pendingView.current;
    pendingView.current = null;
    if (view === 'interior') enterInterior();
    else if (view === 'tour' && tour) openTour();
  }, [pu, tour, enterInterior, openTour]);

  /* ------------------------------------------------------------ keyboard */

  useEffect(() => {
    const onKey = (e) => {
      if (!immersive) return; // the homepage preview leaves the keyboard to the page
      if (e.target instanceof Element && e.target.closest('input, textarea, select')) return;
      if (e.key === 'Escape') {
        if (guided.active) guided.stop('skip');
        else if (planOpen) setPlanOpen(false);
        else if (phase === 'tour') closeTour();
        else if (phase === 'interior') {
          if (room) setRoom(null);
          else exitInterior();
        } else if (unitKey) clearUnit();
        else if (selectedIndex !== null) back();
        else if (embedded) embedRef.current?.onImmersive?.(false);
        return;
      }
      if (phase !== 'floor' || unitKey) return;
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [guided, planOpen, phase, room, unitKey, selectedIndex, back, step, clearUnit, closeTour, exitInterior, immersive, embedded]);

  /* --------------------------------------------------------- url + title */

  // Embedded, the address and the title belong to the website.
  useEffect(() => {
    if (embedded || !project || !tower || introActive) return;
    const p = new URLSearchParams(window.location.search);
    if (project.towers.length > 1) p.set('tower', tower.id);
    else p.delete('tower');
    if (selectedLevel) p.set('floor', String(selectedLevel.number));
    else if (pendingFloor.current === null) p.delete('floor');
    if (pu?.unit) p.set('unit', pu.unit.number || pu.unit.id);
    else if (!pendingUnit.current) p.delete('unit');
    p.delete('tour');
    const qs = p.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
  }, [project, tower, selectedLevel, pu, introActive, embedded]);

  useEffect(() => {
    if (embedded) return;
    const parts = [pu?.unit?.number, project ? project.name : null, '3D Residence', brand || null].filter(Boolean);
    document.title = parts.join(' · ');
  }, [project, brand, pu, embedded]);

  useEffect(() => {
    if (!sceneReady || !webgl) return undefined;
    const id = (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(() => {
      import('../interior/prefetch.js').then((m) => m.prefetchInterior()).catch(() => {});
    });
    return () => (window.cancelIdleCallback || clearTimeout)(id);
  }, [sceneReady, webgl]);

  /* -------------------------------------------------------------- layout */

  const panelOpen = phase === 'floor';
  const inset = useMemo(() => {
    // Homepage preview: leave room for the website's text (left on wide screens, below on phones).
    if (!immersive) {
      return viewport.compact
        ? { x: 0, y: Math.round(viewport.height * 0.25), zoom: 2.3 }
        : { x: Math.round(Math.min(300, viewport.width * 0.16)), y: -Math.round(viewport.height * 0.05), zoom: 1.08 };
    }
    if (panelOpen) return viewport.compact ? { x: 0, y: Math.round(viewport.height * 0.22) } : { x: 210, y: 0 };
    return viewport.compact ? { x: -14, y: 0 } : { x: -32, y: 0 };
  }, [immersive, panelOpen, viewport.compact, viewport.height, viewport.width]);
  // Homepage preview: the wheel and (on touch screens) vertical swipes scroll the page, not the camera.
  const orbit = useMemo(() => ({ zoom: immersive, pan: immersive, rotate: immersive || !touch, touchScroll: !immersive && touch }), [immersive, touch]);

  const unitProps = useMemo(
    () => ({
      hasInventory,
      hoveredKey: hoveredUnit,
      selectedKey: unitKey,
      onUnitHover,
      onUnitSelect: selectUnit,
      matches,
      showPins: !viewport.compact || Boolean(unitKey)
    }),
    [hasInventory, hoveredUnit, unitKey, onUnitHover, selectUnit, matches, viewport.compact]
  );
  const focus = useMemo(() => {
    if (!pu) return null;
    const r = pu.rect;
    return { x: (r.x0 + r.x1) / 2, z: (r.z0 + r.z1) / 2, w: r.x1 - r.x0, d: r.z1 - r.z0 };
  }, [pu]);

  const interiorProps = useMemo(
    () => (plan && pu ? { plan, unitKey: pu.key, views, styleId, room, zoomToken } : null),
    [plan, pu, views, styleId, room, zoomToken]
  );
  const tourProps = useMemo(
    () =>
      tour
        ? {
            tour,
            sceneId: tourScene,
            onScene: setTourScene,
            zoomToken,
            onError: () => {
              setTourError(new Error('panorama'));
              setViewLoading(false);
            }
          }
        : null,
    [tour, tourScene, zoomToken]
  );

  const crumbs = useMemo(() => {
    if (!project || !tower) return null;
    const list = [{ label: tower.name, onClick: () => { setMode('exterior'); back(); } }];
    if (selectedLevel) list.push({ label: levelName(selectedLevel.number), onClick: () => { if (mode !== 'exterior') exitInterior(); clearUnit(); } });
    if (pu) list.push({ label: pu.unit?.number || `Home ${pu.index + 1}`, onClick: mode !== 'exterior' ? () => (mode === 'tour' ? closeTour() : exitInterior()) : null });
    if (phase === 'interior') list.push({ label: 'Interior' });
    if (phase === 'tour') list.push({ label: '360° tour' });
    return list;
  }, [project, tower, selectedLevel, pu, phase, mode, back, clearUnit, exitInterior, closeTour]);

  const advice = useMemo(() => (webgl ? null : webglAdvice()), [webgl]);
  const canShow3D = webgl && !contextLost && !sceneFailed && Boolean(tower);
  const loading = webgl && !sceneFailed && (data.status === 'loading' || (canShow3D && !sceneReady));
  const noTowers = data.status === 'ready' && project && project.towers.length === 0;
  const introPresence = usePresence(canShow3D && sceneReady && phase === 'intro', 900);
  const accentRgb = hexToRgb(project?.brand.accent);
  const rootStyle = accentRgb ? { '--gold': project.brand.accent, '--gold-rgb': accentRgb } : undefined;
  const exteriorHud = phase === 'building' || phase === 'floor';
  const filterBar = <Filters types={types} filter={filter} onFilter={setFilter} compact={viewport.compact} />;

  // Embedded, the page shows its own poster and messages; tell it how the scene is doing.
  const status = !webgl
    ? 'no-webgl'
    : sceneFailed
      ? 'failed'
      : contextLost
        ? 'lost'
        : data.status === 'error'
          ? 'data-error'
          : noTowers
            ? 'no-towers'
            : canShow3D && sceneReady
              ? 'ready'
              : 'loading';
  useEffect(() => {
    embedRef.current?.onStatus?.(status);
  }, [status]);
  const closeImmersive = useCallback(() => embedRef.current?.onImmersive?.(false), []);

  return (
    <div
      className={cls(
        'app',
        `phase-${phase}`,
        viewport.compact && 'is-compact',
        planOpen && 'plan-open',
        guided.active && 'touring',
        embedded && 'is-embedded',
        immersive && 'is-immersive'
      )}
      style={rootStyle}
    >
      {canShow3D && (
        <div className="stage">
          <ErrorBoundary onError={(error) => setSceneFailed(error || new Error('unknown'))} fallback={() => null}>
            <Suspense fallback={null}>
              <Experience
                key={project.id}
                view={view}
                tower={tower}
                source={project.source}
                selectedIndex={selectedIndex}
                hoveredIndex={introActive && !guided.active ? null : hoveredIndex}
                onHover={onHover}
                onSelect={onSelect}
                intro={introActive}
                onIntroDone={onIntroDone}
                onSkipIntro={onSkipIntro}
                resetToken={resetToken}
                skipToken={skipToken}
                autoRotate={autoRotate && phase === 'building'}
                onUserStart={onUserStart}
                reducedMotion={reducedMotion}
                quality={quality}
                inset={inset}
                orbit={orbit}
                active={!embedded || immersive || embed.active !== false}
                onReady={onReady}
                onViewReady={onViewReady}
                onContextLost={onContextLost}
                plan={plan}
                unitProps={unitProps}
                focus={focus}
                interior={interiorProps}
                tour={tourProps}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      <div className="vignette" aria-hidden="true" />

      {canShow3D && sceneReady && (
        <div className="hud">
          {exteriorHud &&
            (immersive ? (
              <TopBar
                project={project}
                tower={tower}
                onTower={mode === 'exterior' ? setTowerId : null}
                crumbs={crumbs}
                filters={hasInventory && !viewport.compact && !pu ? filterBar : null}
                onClose={embedded ? closeImmersive : null}
              />
            ) : (
              // Homepage preview: the website shows the name and text; only the data badge and tower tabs stay.
              <TopBar project={project} tower={tower} onTower={setTowerId} minimal />
            ))}
          {exteriorHud && (
            <FloorRail
              levels={levels}
              selectedIndex={selectedIndex}
              hoveredIndex={hoveredIndex}
              onHover={onHover}
              onSelect={onSelect}
              showAvailability={hasInventory}
              matchCounts={matchCounts}
              filtering={filtering}
            />
          )}
          {phase === 'floor' && plan && !pu && (
            <FloorPanel
              key={`${tower.id}-${selectedLevel.number}`}
              project={project}
              tower={tower}
              level={selectedLevel}
              plan={plan}
              index={selectedIndex}
              count={levels.length}
              onStep={step}
              onBack={back}
              onUnit={selectUnit}
              onUnitHover={onUnitHover}
              hoveredKey={hoveredUnit}
              onPlan={() => setPlanOpen(true)}
              matches={matches}
              filters={hasInventory && viewport.compact ? filterBar : null}
            />
          )}
          {phase === 'floor' && pu && (
            <UnitPanel
              key={pu.key}
              project={project}
              tower={tower}
              level={selectedLevel}
              pu={pu}
              tour={tour}
              onBack={clearUnit}
              onEnter={enterInterior}
              onPlan={() => setPlanOpen(true)}
              onTour={openTour}
            />
          )}
          {phase === 'interior' && (
            <InteriorHud
              project={project}
              tower={tower}
              level={selectedLevel}
              pu={pu}
              views={views}
              room={room}
              onRoom={setRoom}
              styleId={styleId}
              onStyle={setStyleId}
              onBack={exitInterior}
              onPlan={() => setPlanOpen(true)}
              onTour={openTour}
              tour={tour}
              touch={touch}
              compact={viewport.compact}
            />
          )}
          {phase === 'tour' && (
            <TourHud tour={tour} sceneId={tourScene} onScene={setTourScene} onBack={closeTour} unitLabel={pu.unit?.number || 'Residence'} />
          )}
          {phase !== 'intro' && immersive && (
            <Dock
              phase={phase}
              autoRotate={autoRotate}
              onToggleRotate={() => {
                setInteracted(true);
                setAutoRotate((a) => !a);
              }}
              onRecenter={() => setResetToken((t) => t + 1)}
              onBack={back}
              onTour={steps.length ? guided.start : null}
              tourActive={guided.active}
              onPlan={() => setPlanOpen(true)}
              onZoom={phase === 'interior' || phase === 'tour' ? zoom : null}
            />
          )}
          {exteriorHud && !guided.active && immersive && <HintBar project={project} touch={touch} showControls={!interacted} phase={phase} />}
          {planOpen && plan && (phase === 'floor' || phase === 'interior') && (
            <PlanView
              key={`${selectedLevel.number}-${unitKey || ''}`}
              plan={plan}
              level={selectedLevel}
              tower={tower}
              project={project}
              unitKey={unitKey}
              hoveredKey={hoveredUnit}
              onHover={onUnitHover}
              onSelect={(key) => {
                selectUnit(key);
              }}
              onClose={() => setPlanOpen(false)}
              matches={matches}
            />
          )}
          <GuidedTourBar tour={guided} />
        </div>
      )}

      {introPresence.mounted && project && tower && !guided.active && (
        <IntroOverlay project={project} tower={tower} onSkip={guided.active ? null : onSkipIntro} leaving={introPresence.leaving} />
      )}

      <Loader visible={loading && !embedded} brand={brand} message={data.status === 'loading' ? 'Loading property data' : 'Preparing the 3D scene'} />
      <Loader
        visible={!loading && viewLoading && canShow3D && immersive}
        brand=""
        variant="soft"
        message={phase === 'tour' ? 'Loading the 360° tour' : phase === 'interior' ? 'Preparing the residence' : 'Returning to the building'}
      />

      {/* Embedded, the homepage keeps its poster and explains instead (see `status`). */}
      {!embedded && (
        <>
          {!webgl && (
            <StatusScreen
              eyebrow={brand || project?.name}
              title="This browser can’t show the 3D view"
              message={`The 3D view needs WebGL graphics, and ${advice.browser} did not allow it. To fix this:`}
              steps={advice.steps}
              actions={[{ label: 'Reload', onClick: () => window.location.reload(), primary: true }]}
            />
          )}

          {sceneFailed && (
            <StatusScreen
              eyebrow={brand || project?.name}
              title="The 3D view could not start"
              message={`Your browser reported a graphics error (${sceneFailed.message || 'unknown'}). Reloading usually fixes this; an up-to-date browser with hardware acceleration turned on works best.`}
              actions={[{ label: 'Reload', onClick: () => window.location.reload(), primary: true }]}
            />
          )}

          {contextLost && (
            <StatusScreen
              eyebrow={brand || project?.name}
              title="The 3D view was interrupted"
              message="The graphics processor was reset by the browser (this can happen when the device is low on memory). Reload to continue."
              actions={[{ label: 'Reload', onClick: () => window.location.reload(), primary: true }]}
            />
          )}

          {tourError && phase === 'tour' && (
            <StatusScreen
              eyebrow="360° tour"
              title="The panorama couldn’t be loaded"
              message="The image for this view is missing or could not be downloaded. The rest of the residence is still available."
              actions={[{ label: 'Back', onClick: closeTour, primary: true }]}
            />
          )}

          {webgl && data.status === 'error' && (
            <StatusScreen
              eyebrow="3D Residence"
              title="Property data couldn’t be loaded"
              message={`${data.error?.message || `${DATA_FILE} could not be loaded.`} Availability is never guessed, so the tour opens only with this site’s property data or as a clearly labelled prototype.`}
              actions={[
                data.error?.code === 'NOT_FOUND'
                  ? { label: 'All properties', onClick: () => window.location.assign(sitePath('properties')), primary: true }
                  : { label: 'Try again', onClick: data.retry, primary: true },
                { label: 'View prototype tower', onClick: () => { pendingFloor.current = null; setSceneReady(false); setIntro(true); data.showPrototype(); } }
              ]}
            />
          )}

          {webgl && noTowers && (
            <StatusScreen
              eyebrow={project.name}
              title="No towers to show yet"
              message={`${DATA_FILE} has no tower with a floor count, so there is nothing to build in 3D. Add a tower with "floors" (and optionally "units"), then reload.`}
              actions={[
                { label: 'Reload', onClick: () => window.location.reload(), primary: true },
                { label: 'View prototype tower', onClick: () => { setSceneReady(false); setIntro(true); data.showPrototype(); } }
              ]}
            />
          )}
        </>
      )}
    </div>
  );
}
