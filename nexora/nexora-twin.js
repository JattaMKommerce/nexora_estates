/*
 * The live 3D twin inside Nexora's phases (Stage 1 of the merge).
 *
 * Phase 3 (Construction): the still picture is replaced by the real 3D towers, which rise floor by
 * floor as the visitor moves through the phase's steps (and come down again when they scroll back).
 * A caption follows the build ("Level 12 of 22"), and "Explore in 3D" opens the same scene full
 * screen, where the visitor can turn it, open any floor, see each home's plan and step inside.
 *
 * The 3D code (twin/js/twin.js, built by `npm run build:twin`) loads only once the visitor reaches
 * Phase 2, so the start of the site stays as fast as before. If the browser has no WebGL or the
 * 3D can't start, the phase simply keeps its picture.
 *
 * It only reads window.experience (the site script's engine): state.phaseIndex (1-based) and
 * explore.stepIndex. Loaded before scripts.js so its wheel guard runs before the site's own.
 */
(function () {
  'use strict';

  var CONFIG = {
    url: '/twin/js/twin.js?v=1',
    slug: 'meridian-residences',
    phase: 3,              // Construction: the towers rise step by step
    tourPhase: 7,          // Virtual Tour: the finished towers, ready to explore
    preloadFrom: 2,        // start loading the 3D on Phase 2
    // build progress ('rise' chapter, 0–1) the towers reach at each step of the phase:
    // 0.13 = empty site, 0.27 = foundations and podium, 0.555 = middle floors, 0.83 = upper floors, 1 = finished
    start: 0.13,
    steps: [0.27, 0.555, 0.83, 1],
    speed: 0.11            // progress per second while catching up (a full build takes about 8 s)
  };

  var html = document.documentElement;
  var X = function () { return window.experience; };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var twin = null;        // controller from twin.js
  var loading = false;
  var failed = false;
  var ready = false;
  var shown = false;
  var drawing = false;
  var immersive = false;
  var progress = CONFIG.start;
  var goal = CONFIG.start;
  var host = null;        // the 3D's element (inside the site's media window)
  var ui = null;          // caption and button
  var lastCaption = '';

  var STAGE_TEXT = {
    foundation: 'Foundations',
    podium: 'Podium & lobby',
    lower: 'Lower floors',
    middle: 'Middle floors',
    upper: 'Upper floors',
    crown: 'Crown & roof',
    landscape: 'Finished & landscaped'
  };

  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return Boolean(window.WebGL2RenderingContext && c.getContext('webgl2'));
    } catch (e) {
      return false;
    }
  }

  /* Elements ------------------------------------------------------------------------------- */

  function ensureHost() {
    var media = document.querySelector('.window__media');
    if (!media) return null;
    if (host && host.parentNode === media) return host;
    host = host || document.createElement('div');
    host.className = 'nx-twin';
    host.setAttribute('aria-hidden', 'true');
    media.appendChild(host);
    return host;
  }

  function buildUi() {
    if (ui) return ui;
    var box = document.createElement('div');
    box.className = 'nx-twinUi';
    box.innerHTML =
      '<div class="nx-twinUi__card">' +
        '<div class="nx-twinUi__live"><span class="nx-twinUi__dot"></span>Live 3D twin</div>' +
        '<div class="nx-twinUi__level"></div>' +
        '<div class="nx-twinUi__stage"></div>' +
        '<div class="nx-twinUi__bar"><span></span></div>' +
      '</div>' +
      '<button type="button" class="nx-twinUi__explore">' +
        '<span class="nx-twinUi__exploreIcon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.6 3.7L12 11.7 5.4 8 12 4.3ZM5 9.7l6 3.4v6.6l-6-3.4V9.7Zm8 10v-6.6l6-3.4v6.6l-6 3.4Z" fill="currentColor"/></svg>' +
        '</span>Explore in 3D</button>';
    document.body.appendChild(box);
    box.querySelector('.nx-twinUi__explore').addEventListener('click', function () { setImmersive(true); });
    ui = {
      box: box,
      level: box.querySelector('.nx-twinUi__level'),
      stage: box.querySelector('.nx-twinUi__stage'),
      bar: box.querySelector('.nx-twinUi__bar span')
    };
    return ui;
  }

  /* Loading -------------------------------------------------------------------------------- */

  // A dynamic import written out as code makes the dev server treat this plain script as a module
  // (and rewrite it), so it is built from a string instead.
  var importModule = new Function('u', 'return import(u)');

  function load() {
    if (twin || loading || failed) return;
    if (!hasWebGL()) { failed = true; return; }
    var el = ensureHost();
    if (!el) return;
    loading = true;
    importModule(CONFIG.url)
      .then(function (m) {
        return m.mount(el, { slug: CONFIG.slug, on: onEvent });
      })
      .then(function (t) {
        twin = t;
        loading = false;
        twin.scroll('rise', progress);
        twin.active(false);
        twin.compact(window.matchMedia('(max-width: 760px)').matches);
      })
      .catch(function (e) {
        loading = false;
        failed = true;
        console.warn('Nexora 3D twin could not load:', e);
      });
  }

  function onEvent(type, data) {
    if (type === 'status') {
      ready = data === 'ready';
      if (data === 'no-webgl' || data === 'failed' || data === 'lost' || data === 'data-error') {
        failed = true;
        hide();
      }
    } else if (type === 'immersive') {
      if (!data && immersive) setImmersive(false);
    }
  }

  /* Showing -------------------------------------------------------------------------------- */

  function show() {
    if (shown) return;
    shown = true;
    html.classList.add('nx-twin-on');
    buildUi().box.classList.add('is-on');
  }

  function hide() {
    if (!shown) return;
    shown = false;
    if (immersive) setImmersive(false);
    html.classList.remove('nx-twin-on');
    if (ui) ui.box.classList.remove('is-on');
  }

  function setImmersive(on) {
    if (!twin || on === immersive) return;
    immersive = on;
    html.classList.toggle('nx-twin-immersive', on);
    var x = X();
    try {
      if (on) { x && x.lenis && x.lenis.stop(); }
      else { x && x.lenis && x.lenis.start(); }
    } catch (e) { /* the site keeps scrolling as before */ }
    if (host) host.setAttribute('aria-hidden', on ? 'false' : 'true');
    twin.immersive(on);
  }

  function caption() {
    if (!ui || !twin) return;
    var info = twin.build(progress);
    if (html.classList.contains('nx-twin-tour')) {
      var t = info.name || 'Ready to explore';
      var st = (info.towers > 1 ? info.towers + ' towers · ' : '') + (info.homes ? info.homes + ' homes · every floor, plan and room in 3D' : 'every floor, plan and room in 3D');
      if (t + '|' + st !== lastCaption) { lastCaption = t + '|' + st; ui.level.textContent = t; ui.stage.textContent = st; }
      ui.bar.style.transform = 'scaleX(1)';
      return;
    }
    var text = info.level !== null && info.top !== null && (info.stage === 'lower' || info.stage === 'middle' || info.stage === 'upper')
      ? 'Level ' + info.level + ' of ' + info.top
      : STAGE_TEXT[info.stage] || '';
    var stage = (info.stage === 'lower' || info.stage === 'middle' || info.stage === 'upper')
      ? STAGE_TEXT[info.stage] + (info.towers > 1 ? ' · ' + info.towers + ' towers rising' : '')
      : (info.towers > 1 ? info.towers + ' towers' : '') + (info.homes ? (info.towers > 1 ? ' · ' : '') + info.homes + ' homes' : '');
    var key = text + '|' + stage;
    if (key !== lastCaption) {
      lastCaption = key;
      ui.level.textContent = text;
      ui.stage.textContent = stage;
    }
    ui.bar.style.transform = 'scaleX(' + Math.max(0.02, info.b).toFixed(3) + ')';
  }

  /* Following the site --------------------------------------------------------------------- */

  var last = performance.now();
  function tick(now) {
    requestAnimationFrame(tick);
    var dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    var x = X();
    if (!x || !x.state) return;
    var phase = x.state.phaseIndex;
    if (!twin && !loading && !failed && phase >= CONFIG.preloadFrom && !x.state.inDeepDive) load();
    if (!twin) return;
    // the site's media window may have been rebuilt: keep the 3D inside it
    if (host && !host.isConnected) ensureHost();

    var tour = phase === CONFIG.tourPhase;
    var inPhase = (phase === CONFIG.phase || tour) && !x.state.inDeepDive;
    html.classList.toggle('nx-twin-tour', tour);
    // it draws while its phase is open (a paused scene never finishes starting), and fades in
    // over the picture once it is ready
    if (inPhase !== drawing && !immersive) { drawing = inPhase; twin.active(inPhase); }
    if (inPhase && ready && !failed) show();
    else if (!inPhase && !immersive) hide();
    if (!shown) {
      // waiting off stage: next time the phase opens it starts from the empty site, or finished
      // when the visitor comes back from a later phase
      progress = goal = phase > CONFIG.phase ? 1 : CONFIG.start;
      twin.scroll('rise', progress);
      return;
    }
    if (tour) {
      // the tour: the finished development, centred; "Explore in 3D" opens floors, homes and rooms
      progress = goal = 1;
      if (!immersive) twin.scroll('hero', 0.5);
      caption();
      return;
    }
    if (!immersive) {
      var step = x.explore ? x.explore.stepIndex : 0;
      goal = CONFIG.steps[Math.max(0, Math.min(CONFIG.steps.length - 1, step || 0))];
      if (reduceMotion) progress = goal;
      else if (progress < goal) progress = Math.min(goal, progress + CONFIG.speed * dt);
      else if (progress > goal) progress = Math.max(goal, progress - CONFIG.speed * 1.6 * dt);
      twin.scroll('rise', progress);
    }
    caption();
  }
  requestAnimationFrame(tick);

  /* While the 3D is full screen, the wheel, keys and swipes belong to it, not to the site ------- */

  function guard(e) {
    if (!immersive) return;
    if (e.type === 'keydown') {
      if (e.key === 'Escape') { setImmersive(false); e.preventDefault(); }
      // arrow keys and page keys must not move the site's phases
      if (/^(Arrow|Page|Home|End| )/.test(e.key) || e.key === ' ') e.stopImmediatePropagation();
      return;
    }
    e.stopImmediatePropagation();
  }
  ['wheel', 'keydown', 'touchstart', 'touchmove'].forEach(function (t) {
    window.addEventListener(t, guard, { passive: true });
  });

  window.NexoraTwin = {
    get twin() { return twin; },
    open: function () { setImmersive(true); },
    close: function () { setImmersive(false); }
  };
})();
