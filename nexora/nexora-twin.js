/*
 * The live 3D twin inside Nexora's phases (Stage 1 of the merge).
 *
 * Phase 3 (Construction): the still picture is replaced by the real 3D towers, which rise floor by
 * floor as the visitor moves through the phase's steps (and come down again when they scroll back).
 * A caption follows the build ("Level 12 of 22"), and "Explore in 3D" opens the same scene full
 * screen, where the visitor can turn it, open any floor, see each home's plan and step inside.
 *
 * Phase 4 (Fit-Out & Handover): the floor-plan picture that slides past becomes the same 3D, now
 * floor by floor: as the panel crosses the screen the floors above lift away one level at a time
 * (low, middle, high), each home coloured by its status, with the level's figures beside it.
 * "Explore this floor" opens that floor full screen.
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
    fitPhase: 4,           // Fit-Out & Handover: floor by floor, in the picture panel that slides past
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
  var featured = null;    // the featured tower's levels and floor, from the 3D ('project' event)
  var fitOn = false;      // Phase 4's floor-by-floor panel is in use
  var fit = null;         // its caption (inside the panel)
  var fitStops = [];
  var fitStop = -1;
  var fitKey = '';
  var fitShift = '';
  var full = null;        // full-screen layer for "Explore this floor" (the panel moves sideways)

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

  function place(parent) {
    if (!parent) return null;
    if (!host) {
      host = document.createElement('div');
      host.className = 'nx-twin';
      host.setAttribute('aria-hidden', 'true');
    }
    if (host.parentNode !== parent) parent.appendChild(host);
    return host;
  }

  function ensureHost() {
    return place(document.querySelector('.window__media'));
  }

  // Phase 4's picture panel (the floor-plan picture is its fallback)
  function fitPanel() {
    var img = document.getElementById('phase' + CONFIG.fitPhase);
    return img ? img.closest('.imageBreak__media') : null;
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
    } else if (type === 'project') {
      featured = data && data.featured ? data.featured : null;
      fitStops = featured ? floorStops(featured.levels.length, featured.floorIndex) : [];
      fitStop = -1;
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
    if (fitOn) {
      if (on) {
        if (!full) {
          full = document.createElement('div');
          full.className = 'nx-twinFull';
          document.body.appendChild(full);
        }
        place(full);
      } else {
        place(fitPanel());
      }
    }
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

  /* Phase 4: floor by floor ---------------------------------------------------------------- */

  // the floors it opens: low, middle and high, always including the featured one (as the 3D site's
  // own "floor by floor" chapter does)
  function floorStops(count, feat) {
    if (!count) return [];
    var pick = [0.12, 0.38, 0.88].map(function (f) { return Math.min(count - 1, Math.max(0, Math.round(count * f))); });
    if (feat !== null && feat !== undefined) pick.push(feat);
    return pick.filter(function (v, i) { return pick.indexOf(v) === i; }).sort(function (a, b) { return a - b; });
  }

  function buildFit(panel) {
    if (fit && fit.box.parentNode === panel) return fit;
    if (!fit) {
      var box = document.createElement('div');
      box.className = 'nx-twinFit';
      box.innerHTML =
        '<div class="nx-twinFit__card">' +
          '<div class="nx-twinUi__live"><span class="nx-twinUi__dot"></span>Live 3D twin · Floor by floor<span class="nx-twinFit__count"></span></div>' +
          '<div class="nx-twinFit__level"></div>' +
          '<div class="nx-twinFit__text"></div>' +
          '<div class="nx-twinFit__legend" aria-hidden="true">' +
            '<span class="is-available">Available</span><span class="is-hold">On hold</span><span class="is-sold">Booked / sold</span>' +
          '</div>' +
          '<div class="nx-twinFit__dots" aria-hidden="true"></div>' +
          '<div class="nx-twinFit__note">Sample data · layouts illustrative</div>' +
        '</div>' +
        '<button type="button" class="nx-twinUi__explore nx-twinFit__explore">' +
          '<span class="nx-twinUi__exploreIcon" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3 6.6 3.7L12 11.7 5.4 8 12 4.3ZM5 9.7l6 3.4v6.6l-6-3.4V9.7Zm8 10v-6.6l6-3.4v6.6l-6 3.4Z" fill="currentColor"/></svg>' +
          '</span>Explore this floor</button>';
      box.querySelector('.nx-twinFit__explore').addEventListener('click', function () {
        if (!twin) return;
        var floor = fitStops[Math.max(0, fitStop)];
        setImmersive(true);
        twin.command('floor', Number.isInteger(floor) ? { floor: floor } : {});
      });
      fit = {
        box: box,
        count: box.querySelector('.nx-twinFit__count'),
        level: box.querySelector('.nx-twinFit__level'),
        text: box.querySelector('.nx-twinFit__text'),
        dots: box.querySelector('.nx-twinFit__dots')
      };
    }
    panel.appendChild(fit.box);
    return fit;
  }

  function fitCaption() {
    if (!fit) return;
    var n = fitStops.length;
    var k = Math.max(0, fitStop);
    var lv = featured && n ? featured.levels[fitStops[k]] : null;
    var key = n + '|' + k + '|' + (lv ? lv.number : '');
    if (key === fitKey) return;
    fitKey = key;
    var pad = function (v) { return (v < 10 ? '0' : '') + v; };
    fit.count.textContent = n > 1 ? ' · ' + pad(k + 1) + ' / ' + pad(n) : '';
    fit.level.textContent = lv ? 'Level ' + lv.number : 'Every floor, opened';
    var c = lv && lv.counts;
    fit.text.textContent = c
      ? c.available + ' of ' + c.total + ' homes available' + (c.hold ? ' · ' + c.hold + ' on hold' : '')
      : lv ? lv.units + ' homes on this level' : 'Each level\u2019s homes, coloured by availability';
    var dots = '';
    for (var i = 0; i < n; i++) dots += '<span' + (i === k ? ' class="is-on"' : '') + '></span>';
    fit.dots.innerHTML = dots;
  }

  function enterFit(panel) {
    fitOn = true;
    fitStop = -1;
    fitKey = '';
    html.classList.add('nx-twin-fit');
    panel.classList.add('nx-twinPanel');
    buildFit(panel);
    twin.scroll('floors', 0);
  }

  function leaveFit() {
    if (!fitOn) return;
    fitOn = false;
    html.classList.remove('nx-twin-fit');
    if (host) host.classList.remove('is-shown');
    if (fit) fit.box.classList.remove('is-on');
    fitStop = -1;
    fitShift = '';
    twin.offset({ x: 0, y: 0 });
    twin.target({ view: 'exterior', floor: null });
    // back to the Construction window, where the next phase that shows the 3D expects it
    ensureHost();
  }

  // returns true while Phase 4 owns the 3D
  function runFit(x, phase) {
    var want = phase === CONFIG.fitPhase && !x.state.inDeepDive;
    if (!want && !(fitOn && immersive)) { leaveFit(); return false; }
    var panel = fitPanel();
    if (!panel) { leaveFit(); return false; }
    if (!fitOn) enterFit(panel);
    if (!immersive) place(panel);
    buildFit(panel);
    var r = panel.getBoundingClientRect();
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var seen = r.width > 0 && r.right > -40 && r.left < vw + 40 && r.bottom > -40 && r.top < vh + 40;
    var draw = seen || immersive;
    if (draw !== drawing) { drawing = draw; twin.active(draw); }
    var on = ready && !failed && draw;
    host.classList.toggle('is-shown', on);
    fit.box.classList.toggle('is-on', on && !immersive);
    // the caption card sits at the lower left of the panel, so the building moves clear of it: to
    // the right on wide screens, up on phones (centred again full screen)
    var phone = vw <= 760;
    var shift = immersive ? 0 : Math.round(phone ? r.height * 0.17 : r.width * 0.13);
    if (shift + '|' + phone !== fitShift) {
      fitShift = shift + '|' + phone;
      twin.offset(phone ? { x: 0, y: shift } : { x: shift, y: 0 });
    }
    if (immersive) return true;
    // as the panel's centre crosses the screen, the floors open in turn: right to left on wide
    // screens, where the phase slides sideways, and bottom to top on phones, where it is a column
    var column = r.width >= vw * 0.85;
    var p = column
      ? (vh * 0.85 - (r.top + r.height / 2)) / (vh * 0.7)
      : (vw * 0.92 - (r.left + r.width / 2)) / (vw * 0.84);
    p = Math.max(0, Math.min(1, p));
    twin.scroll('floors', p);
    var n = fitStops.length;
    var k = n ? Math.min(n - 1, Math.floor(p * n)) : -1;
    if (k !== fitStop) {
      fitStop = k;
      twin.target({ view: 'exterior', floor: k >= 0 ? fitStops[k] : null });
    }
    fitCaption();
    return true;
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
    if (runFit(x, phase)) { if (shown) hide(); return; }
    // the site's media window may have been rebuilt: keep the 3D inside it
    if (host && (!host.isConnected || host.parentNode !== document.querySelector('.window__media'))) ensureHost();

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
  ['wheel', 'touchstart', 'touchmove'].forEach(function (t) {
    window.addEventListener(t, guard, { passive: true });
  });
  window.addEventListener('keydown', guard); // Escape is handled here (preventDefault needs a non-passive listener)

  window.NexoraTwin = {
    get twin() { return twin; },
    open: function () { setImmersive(true); },
    close: function () { setImmersive(false); }
  };
})();
