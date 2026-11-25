/*
 * Nexora additions that run next to the original site script (scripts.js). Loaded before it.
 *
 * The site script exposes its experience manager as window.experience; this file only uses that,
 * plus two small hooks patched into scripts.js:
 *   NexoraForms.render(block, parent, onResize)  renders the "contactForm" blocks of content.json
 *   NexoraBack.startIndex(explore, phase)         the step a phase opens on (its last step when the
 *                                                 visitor scrolls back into it)
 *
 *  1. Text fill wipe (yellow letter-by-letter sweep) for text that did not have it
 *  2. Top bar: Log in / Sign up + Book a Demo, Escape closes panels
 *  3. Scrolling back to earlier phases (wheel, keys, swipe)
 *  4. Forms: demo request and account (log in / sign up)
 */
(function () {
  'use strict';

  var html = document.documentElement;
  var X = function () { return window.experience; };
  var settings = function () { return (window.content && window.content.settings) || {}; };
  var now = function () { return performance.now(); };

  /* 1. Text fill wipe ------------------------------------------------------------------------ */

  // Text that gets the sweep. Elements with the site's .anim class sweep when they animate in
  // (class "in"); the others sweep when they scroll into view.
  var WIPE = [
    '.startScreen__paragraph',
    '.startScreen__midLabel',
    '.startScreen__bottomPara',
    '.introScreen .paragraph--large',
    '.exploreScreen__summaryParagraph',
    '.deepDiveFeature__heading',
    '.deepDiveFeature__content',
    '.deepDive__title',
    '.deepDive__intro'
  ].join(',');

  var wipeIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.target.isConnected) { wipeIO.unobserve(e.target); return; }
      if (e.isIntersecting && e.intersectionRatio >= 0.3) e.target.classList.add('nx-wiped');
      else if (!e.isIntersecting) e.target.classList.remove('nx-wiped');
    });
  }, { threshold: [0, 0.3] }) : null;

  function withAlpha(color, a) {
    var m = /rgba?\(([^)]+)\)/.exec(color);
    if (!m) return color;
    var p = m[1].split(',');
    return 'rgba(' + p[0].trim() + ', ' + p[1].trim() + ', ' + p[2].trim() + ', ' + a + ')';
  }

  function prepareWipe(el) {
    if (el.classList.contains('nx-wipe') || !el.textContent.trim()) return;
    if (el.querySelector('div, p, img, svg, ul, ol, table, form, input, button')) return;
    var span = document.createElement('span');
    span.className = 'nx-wipe__text';
    while (el.firstChild) span.appendChild(el.firstChild);
    el.appendChild(span);
    el.classList.add('nx-wipe');
    var color = getComputedStyle(el).color;
    span.style.setProperty('--wf', color);
    span.style.setProperty('--wd', withAlpha(color, 0.24));
    var chars = el.textContent.trim().length;
    span.style.setProperty('--wt', Math.min(3.4, Math.max(1.1, 0.7 + chars * 0.014)).toFixed(2) + 's');
    var delay = /anim-delay-(\d+)/.exec(el.className);
    if (delay) span.style.setProperty('--wdl', Number(delay[1]) / 10 + 's');
    if (!el.classList.contains('anim')) {
      if (wipeIO) wipeIO.observe(el);
      else el.classList.add('nx-wiped');
    }
  }

  function scanWipes(root) {
    if (root.nodeType !== 1) return;
    if (root.matches(WIPE)) prepareWipe(root);
    root.querySelectorAll(WIPE).forEach(prepareWipe);
  }

  new MutationObserver(function (records) {
    records.forEach(function (r) { r.addedNodes.forEach(scanWipes); });
  }).observe(document.body, { childList: true, subtree: true });
  scanWipes(document.body);

  /* 2. Top bar buttons and panels ------------------------------------------------------------ */

  function openPanel(key) {
    var x = X();
    if (!x || !x.state) return;
    if (html.classList.contains('menu-open') && x.menu) x.menu.toggle();
    if (x.state.inDeepDive) {
      x.closeDeepDive();
      setTimeout(function () { x.openDeepDive(key); }, 520);
    } else {
      x.openDeepDive(key);
    }
  }

  function bindPanelButtons(root) {
    root.querySelectorAll('[data-nx-open]').forEach(function (b) {
      if (b._nxBound) return;
      b._nxBound = true;
      b.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation(); // the site's menu listens on document; this click is ours
        openPanel(b.getAttribute('data-nx-open'));
      });
    });
  }
  bindPanelButtons(document);

  window.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var x = X();
    if (x && x.state && x.state.inDeepDive) x.closeDeepDive();
    else if (x && x.menu && html.classList.contains('menu-open')) x.menu.toggle();
  });

  // html.nx-deep while a panel is open (the site script sets no class for it)
  setInterval(function () {
    var x = X();
    html.classList.toggle('nx-deep', !!(x && x.state && x.state.inDeepDive));
  }, 150);

  /* 3. Scrolling back ------------------------------------------------------------------------ */

  // The site only moves forward between phases. Scrolling up at the start of a phase now goes to
  // the previous phase, opening it on its last step (or the bottom of its page), and from Phase 1
  // back to the start page. One gesture moves at most one place: if anything changed during a
  // wheel gesture (including trackpad inertia), the rest of that gesture is ignored.
  var Back = {
    pending: 0,
    busy: false,
    startIndex: function (explore, phase) {
      var s = Math.max(0, Math.min(this.pending || 0, phase.screens.length - 1));
      this.pending = 0;
      if (s > 0) {
        // put the phase film at the end of the step before, so scrolling up from here rewinds
        // a short way instead of playing the whole film from the start
        var prev = phase.screens[s - 1];
        var f = prev && prev.frame;
        if (f && f.length && phase.media) {
          try { explore.media.jumpToFrame(phase.media, [f[f.length - 1]]); } catch (err) { /* ignore */ }
        }
      }
      return s;
    }
  };
  window.NexoraBack = Back;

  function sig() {
    var x = X();
    if (!x || !x.state) return '';
    return [x.state.phaseIndex, x.start && x.start.isShowing ? 's' : '-', x.explore ? x.explore.stepIndex : '-',
      x.explore && x.explore.inTour ? 't' : '-'].join(':');
  }
  var lastSig = '';
  var sigAt = 0;
  function track() {
    var s = sig();
    if (s !== lastSig) { lastSig = s; sigAt = now(); }
    return s;
  }
  setInterval(track, 100);

  function pageTop() { return (window.scrollY || html.scrollTop || 0) <= 2; }

  function canGoBack() {
    var x = X();
    if (!x || !x.state || !window.content || Back.busy) return false;
    if (html.classList.contains('loading-page') || html.classList.contains('menu-open')) return false;
    if (x.inSkip || x.state.inDeepDive) return false;
    if (x.start && x.start.isShowing) return false;
    var idx = x.state.phaseIndex;
    if (!idx) return false;
    track();
    if (now() - sigAt < 900) return false;
    var ph = window.content.phases[idx - 1];
    if (!ph) return false;
    if (ph.type === 'explore') {
      var ex = x.explore;
      if (!ex || ex.inTour || ex.stepIndex !== 0) return false;
      var first = ph.screens[0];
      if (first && first.isTour) return true;
      return !!ex.allowScroll && pageTop();
    }
    return pageTop();
  }

  function nextFrame() { return new Promise(function (r) { requestAnimationFrame(function () { r(); }); }); }

  function scrollToY(y) {
    var x = X();
    var l = x && x.lenis;
    if (l && l.scrollTo) {
      if (l.resize) l.resize();
      l.scrollTo(y, { immediate: true, force: true });
    } else {
      window.scrollTo(0, y);
    }
  }

  function goBack() {
    var x = X();
    var idx = x.state.phaseIndex;
    Back.busy = true;
    var done = function () { setTimeout(function () { Back.busy = false; track(); }, 300); };
    var p;
    if (idx <= 1) {
      p = Promise.resolve(x.goToStart()).then(nextFrame).then(nextFrame).then(function () {
        var b = document.getElementById('start-bottom');
        if (b) scrollToY(Math.max(0, window.scrollY + b.getBoundingClientRect().bottom - window.innerHeight));
      });
    } else {
      var prev = window.content.phases[idx - 2];
      Back.pending = prev.type === 'explore' ? prev.screens.length - 1 : 0;
      p = Promise.resolve(x.skipToPhase(idx - 1)).then(function () {
        if (prev.type === 'explore') return null;
        return nextFrame().then(nextFrame).then(function () { scrollToY(html.scrollHeight); });
      });
    }
    p.then(done, done);
  }

  var preSig = '';
  var lastWheel = 0;
  var gestureSig = '';
  var gestureUsed = false;
  var upSum = 0;
  window.addEventListener('wheel', function () { preSig = sig(); }, { capture: true, passive: true });
  window.addEventListener('wheel', function (e) {
    var t = now();
    if (t - lastWheel > 260) { gestureSig = preSig; gestureUsed = false; upSum = 0; }
    lastWheel = t;
    if (sig() !== gestureSig) gestureUsed = true; // the site already moved during this gesture
    if (gestureUsed) return;
    if (e.deltaY > 0) { upSum = 0; return; }
    upSum -= e.deltaY;
    if (upSum < 30 || !canGoBack()) return;
    gestureUsed = true;
    goBack();
  }, { passive: true });

  window.addEventListener('keydown', function (e) {
    if ((e.key !== 'ArrowUp' && e.key !== 'PageUp') || e.repeat) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (canGoBack()) { e.preventDefault(); goBack(); }
  });

  var touch = null;
  window.addEventListener('touchstart', function (e) {
    var t = e.changedTouches[0];
    touch = { x: t.clientX, y: t.clientY, t: now(), sig: sig() };
  }, { capture: true, passive: true });
  window.addEventListener('touchend', function (e) {
    if (!touch) return;
    var t = e.changedTouches[0];
    var dy = t.clientY - touch.y;
    var dx = t.clientX - touch.x;
    var start = touch;
    touch = null;
    if (dy < 70 || Math.abs(dx) > 50 || now() - start.t > 900 || sig() !== start.sig || !pageTop()) return;
    var x = X();
    var ex = x && x.explore;
    var state = x && x.browser && x.browser.state;
    // on phones the site scrolls inside a step; from the top of a later step, a swipe down goes
    // to the step before
    if (state && state.isResponsive && ex && html.classList.contains('exploring') && ex.allowScroll &&
        ex.stepIndex > 0 && !ex.inTour && !(x.state && x.state.inDeepDive)) {
      if (ex.goToPrevStep()) ex.endScrollWait();
      return;
    }
    if (canGoBack()) goBack();
  }, { passive: true });

  /* 4. Forms --------------------------------------------------------------------------------- */

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

  var ICON_INFO = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 9v5M10 6.2v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var uid = 0;

  /**
   * A labelled field. Required fields carry a red *; optional ones say "(optional)".
   * opts: name, label, type (text|email|tel|password|date|select|textarea|checkbox), required,
   * options, placeholder, autocomplete, hint, wide, maxlength, validate(value, form) -> message|''
   */
  function field(fields, opts) {
    var id = 'nxf-' + opts.name + '-' + ++uid;
    var errId = id + '-err';
    var hintId = opts.hint ? id + '-hint' : null;
    var wrap = h('div', { class: 'nxf__field' + (opts.wide || opts.type === 'textarea' || opts.type === 'checkbox' ? ' nxf__field--wide' : '') });
    var input;
    if (opts.type === 'checkbox') {
      input = h('input', { type: 'checkbox', id: id, name: opts.name });
      var text = h('span', { html: opts.label + (opts.required ? ' <span class="nxf__req" aria-hidden="true">*</span>' : '') });
      wrap.appendChild(h('label', { class: 'nxf__check', for: id }, [input, text]));
    } else {
      wrap.appendChild(h('label', { class: 'nxf__label', for: id }, [
        opts.label,
        opts.required ? h('span', { class: 'nxf__req', 'aria-hidden': 'true', text: ' *' }) : h('span', { class: 'nxf__opt', text: ' (optional)' })
      ]));
      if (opts.type === 'select') {
        input = h('select', { id: id, name: opts.name },
          [h('option', { value: '', text: opts.placeholder || 'Select…' })].concat(
            opts.options.map(function (o) { return h('option', { value: o, text: o }); })));
      } else if (opts.type === 'textarea') {
        input = h('textarea', { id: id, name: opts.name, rows: 4, maxlength: opts.maxlength || 1000, placeholder: opts.placeholder });
      } else {
        input = h('input', {
          id: id, name: opts.name, type: opts.type || 'text', autocomplete: opts.autocomplete,
          placeholder: opts.placeholder, maxlength: opts.maxlength, inputmode: opts.inputmode, min: opts.min
        });
      }
      if (opts.type === 'password') {
        var toggle = h('button', { type: 'button', class: 'nxf__passToggle', 'aria-controls': id, text: 'Show' });
        toggle.addEventListener('click', function () {
          var show = input.type === 'password';
          input.type = show ? 'text' : 'password';
          toggle.textContent = show ? 'Hide' : 'Show';
        });
        wrap.appendChild(h('div', { class: 'nxf__pass' }, [input, toggle]));
      } else {
        wrap.appendChild(input);
      }
      if (opts.hint) wrap.appendChild(h('p', { class: 'nxf__hint', id: hintId, text: opts.hint }));
    }
    if (opts.required) input.setAttribute('aria-required', 'true');
    input.setAttribute('aria-describedby', [hintId, errId].filter(Boolean).join(' '));
    var err = h('p', { class: 'nxf__error', id: errId });
    wrap.appendChild(err);

    var f = {
      opts: opts, input: input, wrap: wrap, touched: false,
      value: function () { return opts.type === 'checkbox' ? input.checked : input.value.trim(); },
      check: function (form) {
        var v = f.value();
        var msg = '';
        if (opts.required && (opts.type === 'checkbox' ? !v : v === '')) msg = opts.requiredMsg || ('Please enter ' + opts.label.toLowerCase());
        else if (v !== '' && v !== false && opts.validate) msg = opts.validate(v, form) || '';
        err.textContent = msg;
        wrap.classList.toggle('is-invalid', !!msg);
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        return !msg;
      }
    };
    input.addEventListener('blur', function () { f.touched = true; f.check(fields); });
    input.addEventListener(opts.type === 'checkbox' || opts.type === 'select' ? 'change' : 'input', function () {
      if (f.touched || wrap.classList.contains('is-invalid')) f.check(fields);
    });
    fields.push(f);
    return wrap;
  }

  function byName(fields, name) {
    for (var i = 0; i < fields.length; i++) if (fields[i].opts.name === name) return fields[i];
    return null;
  }

  function validateAll(fields) {
    var first = null;
    fields.forEach(function (f) {
      f.touched = true;
      if (!f.check(fields) && !first) first = f;
    });
    if (first) {
      var x = X();
      if (x && x.deepDiveLenis && x.state && x.state.inDeepDive) {
        x.deepDiveLenis.scrollTo(first.wrap, { offset: -120, duration: 0.6 });
      } else {
        first.wrap.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      setTimeout(function () { first.input.focus({ preventScroll: true }); }, 250);
    }
    return !first;
  }

  var validEmail = function (v) { return EMAIL.test(v) ? '' : 'That email address doesn’t look right — please check it.'; };
  var validPhone = function (v) {
    var digits = v.replace(/[\s\-().]/g, '');
    return /^\+?\d{7,15}$/.test(digits) ? '' : 'Enter a valid phone number with country code, e.g. +91 98765 43210.';
  };
  var validName = function (v) { return v.length >= 2 ? '' : 'Please enter your full name.'; };

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function contactEmail() { return settings().contactEmail || 'contact@jattamkommerce.com'; }

  function statusBox() { return h('div', { class: 'nxf__status', role: 'status', 'aria-live': 'polite' }); }
  function showStatus(box, kind, title, body, actions, onResize) {
    box.className = 'nxf__status is-shown' + (kind ? ' is-' + kind : '');
    box.innerHTML = '';
    box.appendChild(h('strong', { text: title }));
    box.appendChild(h('div', { html: body }));
    if (actions && actions.length) box.appendChild(h('div', { class: 'nxf__actions' }, actions));
    if (onResize) onResize();
    var x = X();
    if (x && x.deepDiveLenis && x.state && x.state.inDeepDive) {
      setTimeout(function () { x.deepDiveLenis.scrollTo(box, { offset: -160, duration: 0.8 }); }, 120);
    }
  }

  function postJSON(url, payload) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; });
  }

  /** Book a free demo: the request form behind "Book a Demo" and the footer links. */
  function demoForm(block, parent, onResize) {
    var fields = [];
    var form = h('form', { class: 'nxf', novalidate: true, 'data-form': 'demo' });
    form.appendChild(h('p', { class: 'nxf__note', html: 'Fields marked <b>*</b> are required.' }));
    var grid = h('div', { class: 'nxf__grid' });
    grid.appendChild(field(fields, { name: 'name', label: 'Full name', required: true, autocomplete: 'name', placeholder: 'e.g. Priya Sharma', validate: validName, requiredMsg: 'Please enter your full name.' }));
    grid.appendChild(field(fields, { name: 'email', label: 'Work email', type: 'email', required: true, autocomplete: 'email', placeholder: 'you@company.com', validate: validEmail, requiredMsg: 'Please enter your work email.' }));
    grid.appendChild(field(fields, { name: 'phone', label: 'Phone (with country code)', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', maxlength: 20, placeholder: '+91 98765 43210', validate: validPhone, requiredMsg: 'Please enter a phone number we can reach you on.' }));
    grid.appendChild(field(fields, { name: 'company', label: 'Company / developer name', required: true, autocomplete: 'organization', placeholder: 'e.g. Skyline Developers', requiredMsg: 'Please enter your company or developer name.' }));
    grid.appendChild(field(fields, { name: 'role', label: 'Your role', type: 'select', required: true, requiredMsg: 'Please choose your role.',
      options: ['Developer / Builder', 'Sales & Marketing', 'Channel Partner / Broker', 'Architect / Consultant', 'Investor', 'Homebuyer', 'Other'] }));
    grid.appendChild(field(fields, { name: 'city', label: 'Project city', required: true, autocomplete: 'address-level2', placeholder: 'e.g. Bengaluru', requiredMsg: 'Please enter the city of your project.' }));
    grid.appendChild(field(fields, { name: 'projectType', label: 'Project type', type: 'select', required: true, requiredMsg: 'Please choose a project type.',
      options: ['Luxury villas', 'Gated community / society', 'Apartments / towers', 'Plotted development', 'Mixed-use', 'Commercial'] }));
    grid.appendChild(field(fields, { name: 'units', label: 'Number of units', type: 'select', options: ['1–50', '51–200', '201–500', 'More than 500'] }));
    grid.appendChild(field(fields, { name: 'stage', label: 'Project stage', type: 'select', options: ['Land / site evaluation', 'Planning & approvals', 'Under construction', 'Ready to move in'] }));
    grid.appendChild(field(fields, { name: 'date', label: 'Preferred demo date', type: 'date', min: today(),
      validate: function (v) { return v < today() ? 'Please choose today or a later date.' : ''; } }));
    grid.appendChild(field(fields, { name: 'time', label: 'Preferred time', type: 'select', options: ['Morning (10 am – 12 pm)', 'Afternoon (12 – 4 pm)', 'Evening (4 – 7 pm)'] }));
    grid.appendChild(field(fields, { name: 'message', label: 'What would you like to see?', type: 'textarea', maxlength: 1000, placeholder: 'Tell us about your project and what you want from the demo.' }));
    grid.appendChild(field(fields, { name: 'consent', label: 'I agree that Nexora (Jatta M Kommerce) may contact me about this request, and I accept the <a href="#privacy">Privacy Policy</a>.', type: 'checkbox', required: true, requiredMsg: 'Please tick this box so we can contact you.' }));
    form.appendChild(grid);
    var submit = h('button', { type: 'submit', class: 'nxf__submit', html: 'Book my free demo <span aria-hidden="true">→</span>' });
    form.appendChild(h('div', { class: 'nxf__actions' }, [submit]));
    var box = statusBox();
    form.appendChild(box);
    form.appendChild(h('div', { class: 'nxf__contact', html: '<h3>Prefer email?</h3>Write to <a href="mailto:' + contactEmail() + '">' + contactEmail() + '</a> and our team will reply.' }));

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateAll(fields)) { if (onResize) onResize(); return; }
      var data = {};
      fields.forEach(function (f) { data[f.opts.name] = f.value(); });
      var payload = Object.assign({ source: 'Nexora website — Book a demo', page: location.href, sentAt: new Date().toISOString() }, data);
      var endpoint = settings().formEndpoint;
      if (endpoint) {
        submit.disabled = true;
        postJSON(endpoint, payload).then(function () {
          form.querySelectorAll('input, select, textarea').forEach(function (i) { i.disabled = true; });
          showStatus(box, 'success', 'Thank you — your demo request was sent.', 'Our team will contact you on ' + data.email + ' to confirm a time.', null, onResize);
        }).catch(function () {
          submit.disabled = false;
          showStatus(box, 'error', 'Your request could not be sent.', 'Please try again in a moment, or email <a href="mailto:' + contactEmail() + '">' + contactEmail() + '</a>.', null, onResize);
        });
        return;
      }
      // No booking system is connected yet: nothing is sent. Offer the email route instead.
      var lines = [
        'Name: ' + data.name, 'Email: ' + data.email, 'Phone: ' + data.phone, 'Company: ' + data.company,
        'Role: ' + data.role, 'City: ' + data.city, 'Project type: ' + data.projectType,
        'Units: ' + (data.units || '—'), 'Stage: ' + (data.stage || '—'),
        'Preferred date: ' + (data.date || '—'), 'Preferred time: ' + (data.time || '—'), '', data.message || ''
      ];
      var body = lines.join('\n');
      var mail = 'mailto:' + contactEmail() + '?subject=' + encodeURIComponent('Nexora demo request — ' + data.company) + '&body=' + encodeURIComponent(body);
      var send = h('a', { class: 'nxf__submit', href: mail, text: 'Email this request' });
      var copy = h('button', { type: 'button', class: 'nxf__secondary', text: 'Copy details' });
      copy.addEventListener('click', function () {
        (navigator.clipboard ? navigator.clipboard.writeText(body) : Promise.reject()).then(function () {
          copy.textContent = 'Copied';
        }, function () { copy.textContent = 'Copy not available'; });
      });
      showStatus(box, '', 'Almost done — send it by email.',
        'Online booking isn’t connected yet, so this form has <b>not</b> sent anything. Your details are ready: ' +
        'press <b>Email this request</b> to send them to ' + contactEmail() + ' from your email app.', [send, copy], onResize);
    });

    parent.appendChild(form);
    if (onResize) onResize();
    return form;
  }

  /** Log in / Sign up. No account system is connected yet, and the form says so. */
  function authForm(block, parent, onResize) {
    var wrap = h('div', { class: 'nxf', 'data-form': 'auth' });
    var connected = !!settings().authEndpoint;
    if (!connected) {
      wrap.appendChild(h('div', { class: 'nxf__info', html: ICON_INFO + '<span>Nexora accounts are being set up. Sign-in isn’t connected yet, so nothing you type here is sent or stored. To get access now, <b>book a demo</b> and we’ll set up your team.</span>' }));
    }
    var tabs = h('div', { class: 'nxf__tabs', role: 'tablist', 'aria-label': 'Account' });
    var tLogin = h('button', { type: 'button', class: 'nxf__tab', role: 'tab', id: 'nxf-tab-login', 'aria-controls': 'nxf-panel-login', text: 'Log in' });
    var tSign = h('button', { type: 'button', class: 'nxf__tab', role: 'tab', id: 'nxf-tab-signup', 'aria-controls': 'nxf-panel-signup', text: 'Sign up' });
    tabs.appendChild(tLogin);
    tabs.appendChild(tSign);
    wrap.appendChild(tabs);

    function panel(kind, build) {
      var fields = [];
      var form = h('form', { class: 'nxf__panel', novalidate: true, id: 'nxf-panel-' + kind, role: 'tabpanel', 'aria-labelledby': 'nxf-tab-' + kind });
      form.appendChild(h('p', { class: 'nxf__note', html: 'Fields marked <b>*</b> are required.' }));
      var grid = h('div', { class: 'nxf__grid' });
      build(grid, fields);
      form.appendChild(grid);
      var submit = h('button', { type: 'submit', class: 'nxf__submit', text: kind === 'login' ? 'Log in' : 'Create account' });
      form.appendChild(h('div', { class: 'nxf__actions' }, [submit]));
      var box = statusBox();
      form.appendChild(box);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateAll(fields)) { if (onResize) onResize(); return; }
        var endpoint = settings().authEndpoint;
        if (endpoint) {
          var data = { action: kind };
          fields.forEach(function (f) { data[f.opts.name] = f.value(); });
          delete data.confirm;
          submit.disabled = true;
          postJSON(endpoint, data).then(function () {
            showStatus(box, 'success', kind === 'login' ? 'You’re logged in.' : 'Your account was created.', 'Welcome to Nexora.', null, onResize);
          }).catch(function () {
            submit.disabled = false;
            showStatus(box, 'error', kind === 'login' ? 'Those details didn’t work.' : 'We couldn’t create your account.', 'Please check your details and try again.', null, onResize);
          });
          return;
        }
        var demo = h('button', { type: 'button', class: 'nxf__submit', text: 'Book a demo' });
        demo.addEventListener('click', function () { openPanel('Contact'); });
        showStatus(box, '', kind === 'login' ? 'Sign-in isn’t available yet.' : 'Sign-up isn’t available yet.',
          'Nexora accounts aren’t connected yet, so nothing was sent or saved. Book a demo and our team will set up early access for you.',
          [demo], onResize);
      });
      return form;
    }

    var login = panel('login', function (grid, fields) {
      grid.appendChild(field(fields, { name: 'email', label: 'Email', type: 'email', required: true, wide: true, autocomplete: 'email', placeholder: 'you@company.com', validate: validEmail, requiredMsg: 'Please enter your email.' }));
      grid.appendChild(field(fields, { name: 'password', label: 'Password', type: 'password', required: true, wide: true, autocomplete: 'current-password', requiredMsg: 'Please enter your password.' }));
    });
    var signup = panel('signup', function (grid, fields) {
      grid.appendChild(field(fields, { name: 'name', label: 'Full name', required: true, autocomplete: 'name', validate: validName, requiredMsg: 'Please enter your full name.' }));
      grid.appendChild(field(fields, { name: 'company', label: 'Company', required: true, autocomplete: 'organization', requiredMsg: 'Please enter your company name.' }));
      grid.appendChild(field(fields, { name: 'email', label: 'Work email', type: 'email', required: true, autocomplete: 'email', placeholder: 'you@company.com', validate: validEmail, requiredMsg: 'Please enter your work email.' }));
      grid.appendChild(field(fields, { name: 'phone', label: 'Phone (with country code)', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', maxlength: 20, placeholder: '+91 98765 43210', validate: validPhone, requiredMsg: 'Please enter your phone number.' }));
      grid.appendChild(field(fields, { name: 'accountType', label: 'I am a', type: 'select', required: true, wide: true, requiredMsg: 'Please choose an account type.',
        options: ['Developer / Builder', 'Channel Partner / Broker', 'Architect / Consultant', 'Homebuyer / Investor'] }));
      grid.appendChild(field(fields, { name: 'password', label: 'Password', type: 'password', required: true, autocomplete: 'new-password', hint: 'At least 8 characters, with a letter and a number.', requiredMsg: 'Please choose a password.',
        validate: function (v) { return v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v) ? '' : 'Use at least 8 characters, with a letter and a number.'; } }));
      grid.appendChild(field(fields, { name: 'confirm', label: 'Confirm password', type: 'password', required: true, autocomplete: 'new-password', requiredMsg: 'Please type your password again.',
        validate: function (v, all) { var p = byName(all, 'password'); return p && p.value() === v ? '' : 'The passwords don’t match.'; } }));
      grid.appendChild(field(fields, { name: 'consent', label: 'I accept the Nexora <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.', type: 'checkbox', required: true, requiredMsg: 'Please accept the terms to continue.' }));
    });
    wrap.appendChild(login);
    wrap.appendChild(signup);

    var sw = h('p', { class: 'nxf__switch' });
    wrap.appendChild(sw);

    function select(kind) {
      var isLogin = kind === 'login';
      tLogin.setAttribute('aria-selected', String(isLogin));
      tSign.setAttribute('aria-selected', String(!isLogin));
      tLogin.tabIndex = isLogin ? 0 : -1;
      tSign.tabIndex = isLogin ? -1 : 0;
      login.hidden = !isLogin;
      signup.hidden = isLogin;
      sw.innerHTML = '';
      var b = h('button', { type: 'button', text: isLogin ? 'Create an account' : 'Log in' });
      b.addEventListener('click', function () { select(isLogin ? 'signup' : 'login'); (isLogin ? tSign : tLogin).focus(); });
      sw.appendChild(document.createTextNode(isLogin ? 'New to Nexora? ' : 'Already have an account? '));
      sw.appendChild(b);
      if (onResize) onResize();
    }
    tLogin.addEventListener('click', function () { select('login'); });
    tSign.addEventListener('click', function () { select('signup'); });
    tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var toSign = tLogin.getAttribute('aria-selected') === 'true';
      select(toSign ? 'signup' : 'login');
      (toSign ? tSign : tLogin).focus();
    });
    select(block && block.start === 'signup' ? 'signup' : 'login');

    parent.appendChild(wrap);
    if (onResize) onResize();
    return wrap;
  }

  window.NexoraForms = {
    render: function (block, parent, onResize) {
      return block && block.form === 'auth' ? authForm(block, parent, onResize) : demoForm(block, parent, onResize);
    }
  };
})();
