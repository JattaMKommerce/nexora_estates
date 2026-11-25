/*
 * Hannah, Nexora's virtual receptionist: the welcome layer every visitor meets first.
 *
 * How it fits the site
 *   - The inline script in index.html's <head> decides, before the first paint, whether Hannah
 *     is shown (html.nx-hannah). She appears on the first page view of each browser session;
 *     ?welcome shows her again, ?skipwelcome skips her. The homepage never flashes.
 *   - The site loads underneath exactly as before (its loader keeps running, hidden).
 *   - "Enter Nexora" / "Skip introduction" remove the layer and press the site's own Enter
 *     button (waiting for the site to finish loading if needed). A phase shortcut then also
 *     jumps to that phase, the same call the footer links use.
 *   - "Talk to Hannah" in the site menu opens her again; closing returns to the same place.
 *
 * Hannah herself is LiveAvatar's official embed (iframe). Verified on 2026-11-16 by reading the
 * embed's code: it sends no postMessage events and accepts no commands, so this page cannot read
 * the conversation, her listening/speaking state, or the language chosen. The embed's own
 * controls handle those (language picker, Chat now, microphone, chat mode for typing,
 * Transcript). Her greeting, knowledge and voice are set in the LiveAvatar dashboard
 * (docs/hannah-receptionist.md). The embed fetches its own session token, so no API key is
 * involved here.
 *
 * Every conversation uses LiveAvatar credits from "Chat now" until the iframe goes away, so the
 * iframe is created once per opening and removed (ending the session) when the visitor leaves.
 */
(function () {
  'use strict';

  var CONFIG = {
    embedUrl: 'https://embed.liveavatar.com/v1/750d6fc3-b4b4-4749-a197-5147633e51d8',
    storageKey: 'nx-hannah-entered',
    loadTimeoutMs: 20000
  };

  // Shortcuts into the site: the phase numbers the site's skipToPhase() and footer links use.
  var STOPS = [
    [1, 'Site Evaluation'],
    [2, 'Master Planning'],
    [3, 'Construction'],
    [4, 'Fit-Out & Handover'],
    [5, 'Ready to Move In'],
    [6, 'Virtual Tour']
  ];

  var html = document.documentElement;
  var X = function () { return window.experience; };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ui = null;      // the open layer
  var avatar = null;  // the LiveAvatar iframe while the layer is open
  var inerted = [];
  var lenisWasRunning = false;

  /* Helpers ---------------------------------------------------------------------------------- */

  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'html') el.innerHTML = v;
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    (kids || []).forEach(function (c) {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }

  var ARROW = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var MIC = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="7" y="2.5" width="6" height="10" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 9.5a5.5 5.5 0 0 0 11 0M10 15v2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var LOGO = '<svg viewBox="0 0 53 36" fill="none" aria-hidden="true"><path d="M5 30V6H11L24 23.5V6H30V30H24L11 12.5V30H5Z" fill="#261d26"/><path d="M34 6H39V30H34V6Z" fill="#FFD200"/><path d="M42 13H47V30H42V13Z" fill="#261d26"/><path d="M42 6H47V10H42V6Z" fill="#6FE45D"/></svg>';

  function remember() {
    try { sessionStorage.setItem(CONFIG.storageKey, '1'); } catch (e) { /* private mode: fine */ }
  }

  function portraitPhone() {
    return !!(window.matchMedia && matchMedia('(max-width: 760px) and (orientation: portrait)').matches);
  }

  /* The layer -------------------------------------------------------------------------------- */

  function build(mode) {
    var returning = mode === 'return';

    var status = h('span', { class: 'hn__status', 'data-state': 'connecting', role: 'status', 'aria-live': 'polite' },
      [h('i', { 'aria-hidden': 'true' }), h('span', { text: 'Connecting…' })]);

    var veilText = h('p', { text: 'Connecting to Hannah…' });
    var retry = h('button', { type: 'button', class: 'hn__retry', text: 'Try again', hidden: true });
    var veil = h('div', { class: 'hn__veil' }, [h('span', { class: 'hn__spinner', 'aria-hidden': 'true' }), veilText, retry]);
    var frame = h('div', { class: 'hn__frame' }, [veil]);

    var mic = h('p', { class: 'hn__mic', 'data-state': 'unknown' });
    mic.innerHTML = MIC;
    var micText = h('span');
    mic.appendChild(micText);

    var stage = h('section', { class: 'hn__stage', 'aria-label': 'Hannah, Nexora’s virtual receptionist' }, [
      h('div', { class: 'hn__stageHead' }, [
        h('div', { class: 'hn__who' }, [h('strong', { text: 'Hannah' }), h('span', { text: 'Virtual receptionist' })]),
        status
      ]),
      frame,
      mic
    ]);

    var steps = h('ol', { class: 'hn__steps' }, [
      h('li', { class: 'is-current', html: '<span>1</span><span><b>Choose your language</b> in Hannah’s window (English, Hindi, Tamil and more), then press <b>Chat now</b>.</span>' }),
      h('li', { html: '<span>2</span><span><b>Allow the microphone</b> and talk to her, or switch her window to chat mode to type.</span>' }),
      h('li', { html: '<span>3</span><span>Ask about anything on Nexora. Open <b>Transcript</b> in her window to read the conversation.</span>' })
    ]);

    var stops = h('ul', { class: 'hn__stops' }, STOPS.map(function (s) {
      var b = h('button', { type: 'button', class: 'hn__stop', 'data-phase': s[0] },
        [h('span', { text: (s[0] < 10 ? '0' : '') + s[0] }), s[1]]);
      return h('li', null, [b]);
    }));

    var enter = h('button', { type: 'button', class: 'hn__enter', html: '<span>' + (returning ? 'Back to Nexora' : 'Enter Nexora') + '</span>' + ARROW });
    var skip = h('button', { type: 'button', class: 'hn__skip', html: '<span>' + (returning ? 'Close' : 'Skip introduction') + '</span>' + ARROW });

    var panel = h('section', { class: 'hn__panel' }, [
      h('p', { class: 'hn__eyebrow', text: 'Nexora · Virtual reception' }),
      h('h1', { class: 'hn__title', id: 'hn-title', text: returning ? 'Hannah is here to help.' : 'Welcome to Nexora.' }),
      h('p', { class: 'hn__lead', id: 'hn-lead', text: returning
        ? 'Ask Hannah anything about Nexora, or pick up the tour where you’d like.'
        : 'I’m Hannah, your virtual receptionist. I’ll guide you through our platform and help you discover everything Nexora has to offer.' }),
      steps,
      h('p', { class: 'hn__label', id: 'hn-stops', text: returning ? 'Go to' : 'Or go straight to' }),
      stops
    ]);
    stops.setAttribute('aria-labelledby', 'hn-stops');
    // Enter Nexora is its own grid item (not inside the panel) so it can stay pinned to the bottom
    // of the screen on phones, where the panel starts below the fold.
    var cta = h('div', { class: 'hn__cta' }, [enter]);
    var fine = h('p', { class: 'hn__fine', text: 'Hannah is an AI avatar provided by LiveAvatar, which processes what you say or type. Please don’t share sensitive personal details.' });

    var root = h('div', {
      id: 'hannah', class: 'hn', role: 'dialog', 'aria-modal': 'true',
      'aria-labelledby': 'hn-title', 'aria-describedby': 'hn-lead', tabindex: '-1', 'data-lenis-prevent': true
    }, [
      h('div', { class: 'hn__inner' }, [
        h('header', { class: 'hn__bar' }, [
          h('div', { class: 'hn__brand', html: LOGO + '<span class="hn__brandText"><span class="hn__brandName">Nexora</span><span class="hn__brandSub">powered by Jatta M Kommerce</span></span>' }),
          skip
        ]),
        h('main', { class: 'hn__main' }, [stage, panel, cta, fine])
      ])
    ]);

    // Wheel, touch and keys inside the layer are Hannah's: the site's scroll and phase handlers
    // listen on window and must not move the page underneath.
    ['wheel', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keyup'].forEach(function (t) {
      root.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
    });

    enter.addEventListener('click', function () { leave(0); });
    skip.addEventListener('click', function () { leave(0); });
    stops.addEventListener('click', function (e) {
      var b = e.target.closest('[data-phase]');
      if (b) leave(Number(b.getAttribute('data-phase')));
    });
    retry.addEventListener('click', function () { unmountAvatar(); mountAvatar(); });

    return {
      mode: mode, root: root, frame: frame, veil: veil, veilText: veilText, retry: retry,
      status: status, mic: mic, micText: micText, steps: steps, leaving: false
    };
  }

  function setStatus(state, text) {
    if (!ui) return;
    ui.status.setAttribute('data-state', state);
    ui.status.lastChild.textContent = text;
  }

  function setStep(n) {
    if (!ui) return;
    Array.prototype.forEach.call(ui.steps.children, function (li, i) {
      li.classList.toggle('is-done', i < n - 1);
      li.classList.toggle('is-current', i === n - 1);
    });
  }

  /* LiveAvatar embed ------------------------------------------------------------------------- */
  // The only avatar source today. A later Web SDK version (own transcript, language switching,
  // Groq answers, hand-off events) would replace mountAvatar/unmountAvatar and keep the layer.

  function mountAvatar() {
    if (!ui || avatar) return; // one iframe, so one LiveAvatar session, per opening
    var vertical = portraitPhone();
    ui.frame.classList.toggle('is-vertical', vertical);
    ui.frame.classList.remove('is-loaded', 'is-failed');
    ui.retry.hidden = true;
    ui.veilText.textContent = 'Connecting to Hannah…';

    if (navigator.onLine === false) { offline(); return; }
    setStatus('connecting', 'Connecting…');

    var iframe = h('iframe', {
      src: CONFIG.embedUrl + '?orientation=' + (vertical ? 'vertical' : 'horizontal'),
      title: 'Hannah, Nexora’s virtual receptionist (LiveAvatar)',
      // microphone: voice chat; autoplay: her voice; clipboard-write: the embed's Copy transcript
      allow: 'microphone; autoplay; clipboard-write'
    });
    var a = { iframe: iframe, loaded: false, timer: 0 };
    avatar = a;

    iframe.addEventListener('load', function () {
      if (avatar !== a || a.loaded) return;
      a.loaded = true;
      clearTimeout(a.timer);
      ui.frame.classList.add('is-loaded');
      setStatus('ready', 'Ready');
    });
    // A cross-origin iframe reports no errors, so a load that never finishes is the only sign.
    a.timer = setTimeout(function () {
      if (avatar !== a || a.loaded) return;
      setStatus('slow', 'Not connected');
      ui.frame.classList.add('is-failed');
      ui.veilText.textContent = 'Hannah is taking longer than usual to connect. Check your connection and try again, or enter Nexora now.';
      ui.retry.hidden = false;
    }, CONFIG.loadTimeoutMs);

    ui.frame.appendChild(iframe);
  }

  function unmountAvatar() {
    if (!avatar) return;
    var a = avatar;
    avatar = null;
    clearTimeout(a.timer);
    // Navigating the frame away unloads the embed, which disconnects its live session.
    try { a.iframe.src = 'about:blank'; } catch (e) { /* ignore */ }
    a.iframe.remove();
  }

  function offline() {
    setStatus('offline', 'Offline');
    ui.frame.classList.add('is-failed');
    ui.veilText.textContent = 'You seem to be offline. Hannah will connect when you are back online, or you can enter Nexora now.';
  }

  window.addEventListener('online', function () {
    if (ui && !ui.leaving && !avatar) mountAvatar();
  });
  window.addEventListener('offline', function () {
    if (ui && avatar && !avatar.loaded) { unmountAvatar(); offline(); }
  });

  // The page cannot see inside the embed, but it can tell when the visitor first clicks into it
  // (the window loses focus to the iframe): the guide then moves on to step 2.
  window.addEventListener('blur', function () {
    setTimeout(function () {
      if (ui && avatar && document.activeElement === avatar.iframe) setStep(2);
    }, 0);
  });

  /* Microphone ------------------------------------------------------------------------------- */

  var MIC_TEXT = {
    unknown: 'Allow the microphone when your browser asks, or type to Hannah in chat mode.',
    prompt: 'Your browser will ask for the microphone when you press Chat now.',
    granted: 'Microphone allowed. Just speak to Hannah.',
    denied: 'Microphone blocked for this site. Allow it from the address bar, or switch Hannah’s window to chat mode and type.',
    insecure: 'Voice needs a secure (https) connection. You can still type to Hannah in chat mode.'
  };

  function setMic(state) {
    if (!ui) return;
    if (!MIC_TEXT[state]) state = 'unknown';
    ui.mic.setAttribute('data-state', state);
    ui.micText.textContent = MIC_TEXT[state];
  }

  var micWatch = null;
  function watchMic() {
    if (!window.isSecureContext) { setMic('insecure'); return; }
    setMic('unknown');
    if (micWatch) { micWatch.then(function (p) { if (p) setMic(p.state); }); return; }
    if (!navigator.permissions || !navigator.permissions.query) return;
    // The embed asks for the microphone on this site's behalf (allow="microphone"), so this
    // site's permission is the one that counts.
    micWatch = navigator.permissions.query({ name: 'microphone' }).then(function (p) {
      setMic(p.state);
      p.addEventListener('change', function () { setMic(p.state); });
      return p;
    }, function () { return null; });
  }

  /* Opening and leaving ---------------------------------------------------------------------- */

  function setInert(on) {
    if (on) {
      Array.prototype.forEach.call(document.body.children, function (el) {
        if (el === ui.root || el.tagName === 'SCRIPT' || el.inert) return;
        el.inert = true;
        inerted.push(el);
      });
    } else {
      inerted.forEach(function (el) { el.inert = false; });
      inerted = [];
    }
  }

  function open(mode) {
    if (ui) return;
    ui = build(mode);
    html.classList.add('nx-hannah');
    document.body.appendChild(ui.root);
    setInert(true);
    if (mode === 'return') {
      var x = X();
      lenisWasRunning = !!(x && x.lenis && !x.lenis.isStopped);
      if (lenisWasRunning) x.lenis.stop();
    }
    watchMic();
    mountAvatar();
    ui.root.focus({ preventScroll: true });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (ui) ui.root.classList.add('is-in'); });
    });
  }

  function leave(phase) {
    if (!ui || ui.leaving) return;
    var closing = ui;
    closing.leaving = true;
    remember();
    unmountAvatar();
    setInert(false);
    html.classList.remove('nx-hannah');
    closing.root.classList.add('is-leaving');
    ui = null;
    setTimeout(function () { closing.root.remove(); }, reduceMotion ? 0 : 650);

    if (closing.mode === 'return') {
      var x = X();
      if (x && x.lenis && lenisWasRunning) x.lenis.start();
      if (phase) goToPhase(phase);
      var back = document.getElementById('menu-icon');
      if (back) back.focus({ preventScroll: true });
      return;
    }
    startSite(phase);
  }

  // The site's own entrance: its Enter button appears once its assets have loaded (html.loaded).
  function startSite(phase) {
    whenLoaded(function () {
      var btn = document.getElementById('enter-button');
      if (btn && html.classList.contains('loading-page')) btn.click();
      if (phase) whenStarted(function () { goToPhase(phase); });
    });
  }

  function whenLoaded(fn) {
    if (html.classList.contains('loaded')) { fn(); return; }
    var mo = new MutationObserver(function () {
      if (!html.classList.contains('loaded')) return;
      mo.disconnect();
      fn();
    });
    mo.observe(html, { attributes: true, attributeFilter: ['class'] });
  }

  function whenStarted(fn) {
    var tries = 0;
    (function poll() {
      var x = X();
      if (x && x.start && x.start.isShowing && !html.classList.contains('loading-page')) {
        setTimeout(fn, 700); // let the start screen settle before moving on, as a visitor would
        return;
      }
      if (++tries < 150) setTimeout(poll, 100);
    })();
  }

  function goToPhase(phase) {
    var x = X();
    if (!x || !x.skipToPhase) return;
    if (x.state && x.state.inDeepDive) {
      x.closeDeepDive();
      setTimeout(function () { x.skipToPhase(phase); }, 520);
    } else {
      x.skipToPhase(phase);
    }
  }

  // "Talk to Hannah" in the site menu
  document.querySelectorAll('[data-nx-hannah]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation(); // the site's menu listens on document; this click is ours
      var x = X();
      if (html.classList.contains('menu-open') && x && x.menu) x.menu.toggle();
      setTimeout(function () { open('return'); }, 250);
    });
  });

  window.NexoraHannah = {
    open: function () { open(html.classList.contains('loading-page') ? 'welcome' : 'return'); },
    enter: function (phase) { leave(phase || 0); },
    isOpen: function () { return !!ui; }
  };

  if (html.classList.contains('nx-hannah')) open('welcome');
})();
