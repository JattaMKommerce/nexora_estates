import { useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';
import Stage from './three/Stage.jsx';
import { ui, useUI } from './core/bus.js';
import { loadData } from './core/data.js';
import { startScroll, measure } from './core/scroll.js';
import { TOUR, tourStops } from './content.js';
import { Loader, Nav, HeroText, Whiteout, Beats, ScrollButton, TourSpots, TourPanel } from './ui/Overlays.jsx';
import { Start, StageSection, Phase2, Phase4, End } from './ui/Pages.jsx';
import { Contact, DeepDive } from './ui/Modals.jsx';

export default function App() {
  const [data, setData] = useState(null);
  const entered = useUI((s) => s.entered);
  const set = useUI((s) => s.set);
  const section = useUI((s) => s.section);

  useEffect(() => {
    ui.set({ progress: 0.05 });
    loadData()
      .then((d) => {
        TOUR.splice(0, TOUR.length, ...tourStops(d.project));
        ui.set({ progress: 0.2 });
        setData(d);
      })
      .catch((e) => ui.set({ error: `The project could not be loaded. ${e.message}` }));
    const mgr = THREE.DefaultLoadingManager;
    mgr.onProgress = (_, loaded, total) => {
      const p = 0.2 + 0.7 * (loaded / Math.max(1, total));
      if (!ui.get().ready) ui.set({ progress: Math.max(ui.get().progress, p) });
    };
  }, []);

  useEffect(() => {
    // start at the top every visit; the page is a story
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    startScroll();
    document.fonts?.ready.then(() => measure());
  }, []);

  useEffect(() => {
    if (data) requestAnimationFrame(() => measure());
  }, [data]);

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !entered);
  }, [entered]);

  const onReady = useCallback(() => ui.set({ ready: true, progress: 1 }), []);
  const brand = data?.site?.brand?.name || 'Restate';

  return (
    <div className={`app set-${set} sec-${section}`}>
      {data && <Stage project={data.project} onReady={onReady} />}
      <Whiteout />
      <HeroText />
      <Beats project={data?.project} />
      <TourSpots />
      <main className="story">
        <Start />
        <StageSection id="hero" />
        <StageSection id="p1" />
        <StageSection id="p3" />
        <StageSection id="p5" />
        <StageSection id="tour" />
        <Phase2 />
        <Phase4 />
        <End project={data?.project} />
      </main>
      <Nav brand={brand} />
      <ScrollButton />
      <TourPanel />
      <DeepDive />
      <Contact site={data?.site} />
      <div className="veil" />
      <Loader brand={brand} />
    </div>
  );
}
