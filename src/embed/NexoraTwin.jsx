/**
 * The live 3D twin inside the Nexora website (index.html), which is not a React page.
 *
 * Nexora's own script (nexora/nexora-twin.js) decides when the twin is on screen and what it shows;
 * this module only mounts the same ExperienceApp the 3D site uses, in its "story" mode, and hands
 * back a small controller:
 *
 *   const twin = mount(element, { slug, on(event, data) })
 *   twin.scroll(chapter, progress)   'rise' builds the towers (0 → 1), 'floors' opens floors, …
 *   twin.target({ view, floor, room, style })   which floor / home / room the story shows
 *   twin.immersive(true | false)     full screen and interactive (the visitor drives) or directed
 *   twin.active(true | false)        pause drawing while it is hidden
 *   twin.compact(true | false)       phone layout
 *   twin.destroy()
 *
 * Events passed to `on`: status, project ({ project, featured }), immersive, loading, story.
 */
import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ExperienceApp from '../experience/ExperienceApp.jsx';
import { riseBuild, stageAt } from '../story/script.js';

function Twin({ slug, bind, emit }) {
  const story = useRef({
    scroll: { chapter: 'rise', progress: 0 },
    // the 3D site's own opening fly-in is not used here: Nexora has its own phases
    opening: { state: 'done', variant: 'full', n: 0 },
    reduced: Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches),
    compact: false,
    offset: { x: 0, y: 0 }
  });
  const [immersive, setImmersive] = useState(false);
  const [active, setActive] = useState(true);
  const [target, setTarget] = useState({ view: 'exterior', floor: null, room: null, style: 'warm' });
  const [command, setCommand] = useState(null);

  useEffect(() => {
    bind({ story, setImmersive, setActive, setTarget, setCommand });
  }, [bind]);

  const embed = useMemo(
    () => ({
      immersive,
      onImmersive: (on) => {
        setImmersive(on);
        emit('immersive', on);
      },
      command,
      active,
      story,
      storyTarget: target,
      onStatus: (s) => emit('status', s),
      onStoryEvent: (e) => emit('story', e),
      onProject: (project, featured) => emit('project', { project, featured }),
      onViewLoading: (busy) => emit('loading', busy)
    }),
    [immersive, command, active, target, emit]
  );

  return <ExperienceApp slug={slug} embed={embed} />;
}

export function mount(el, { slug = 'meridian-residences', on = null } = {}) {
  let h = null;
  let project = null;
  const queue = [];
  const run = (fn) => (h ? fn(h) : queue.push(fn));
  const emit = (type, data) => {
    if (type === 'project') project = data?.project || null;
    try {
      on?.(type, data);
    } catch (e) {
      console.error(e);
    }
  };
  const bind = (handles) => {
    h = handles;
    queue.splice(0).forEach((fn) => fn(h));
  };
  let n = 0;
  const root = createRoot(el);
  root.render(
    <StrictMode>
      <Twin slug={slug} bind={bind} emit={emit} />
    </StrictMode>
  );
  return {
    /**
     * What the construction shows at a 'rise' progress, for Nexora's caption:
     * { stage: 'foundation' | 'podium' | 'lower' | 'middle' | 'upper' | 'crown' | 'landscape',
     *   level: the frame's current level number or null, top: the top level's number, towers, homes }
     */
    build(progress) {
      const towers = project?.towers || [];
      const tallest = towers.reduce((a, t) => (!a || t.levels.length > a.levels.length ? t : a), null);
      const maxFloors = tallest?.levels.length || 1;
      const { b } = riseBuild(progress, false);
      const { stage, level } = stageAt(b, maxFloors);
      return {
        stage,
        b,
        level: level >= 0 && tallest ? tallest.levels[level]?.number ?? null : null,
        top: tallest ? tallest.levels[tallest.levels.length - 1]?.number ?? null : null,
        towers: towers.length,
        homes: towers.reduce((n, t) => n + t.levels.reduce((m, l) => m + (l.units?.length || 0), 0), 0),
        name: project?.name || null
      };
    },
    scroll(chapter, progress) {
      run((x) => {
        x.story.current.scroll = { chapter, progress: Math.min(1, Math.max(0, progress)) };
      });
    },
    target(t) {
      run((x) => x.setTarget((prev) => ({ ...prev, ...t })));
    },
    compact(on) {
      run((x) => {
        x.story.current.compact = Boolean(on);
      });
    },
    offset(o) {
      run((x) => {
        x.story.current.offset = { x: o?.x || 0, y: o?.y || 0 };
      });
    },
    immersive(on) {
      run((x) => x.setImmersive(Boolean(on)));
    },
    command(id, extra = {}) {
      run((x) => x.setCommand({ id, n: ++n, ...extra }));
    },
    active(on) {
      run((x) => x.setActive(Boolean(on)));
    },
    destroy() {
      root.unmount();
    }
  };
}
