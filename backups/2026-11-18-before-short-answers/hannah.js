/*
 * Hannah, Nexora's virtual receptionist: the welcome layer every visitor meets first.
 *
 * How it fits the site
 *   - The inline script in index.html's <head> decides, before the first paint, whether Hannah
 *     is shown (html.nx-hannah). She appears on the first page view of each browser session;
 *     ?welcome shows her again, ?skipwelcome skips her. The homepage never flashes.
 *   - The site loads underneath exactly as before (its loader keeps running, hidden).
 *   - "Skip introduction", the red end-call button, or Hannah herself ("take me to
 *     Construction", "open the demo form") remove the layer and start the site with its own
 *     Enter button, then go to the phase or panel asked for.
 *   - "Talk to Hannah" in the site menu opens her again; closing returns to the same place.
 *
 * Hannah is built from four parts, all in this folder and all running in the visitor's browser:
 *   hannah-face.js        her real portrait, animated in WebGL (expressions, blinks, lip sync)
 *   hannah-voice.js       speech out and speech in (the browser's Web Speech API)
 *   hannah-brain.js       chooses her answer from the knowledge base
 *   hannah-knowledge.json what she knows; edit this file to train her
 * No API keys, no paid services, and the conversation is not saved anywhere.
 *
 * URL flags for testing: ?welcome (show her again), ?hannahmute (start muted),
 * ?hannahsim (pretend to speak without audio, for screenshots).
 */
(function () {
  'use strict';

  var BASE = '/nexora/';
  var CONFIG = {
    storageKey: 'nx-hannah-entered',
    knowledgeUrl: BASE + 'hannah-knowledge.json?v=12',
    plateUrl: BASE + 'hannah/hannah-plate.jpg?v=12',
    rigUrl: BASE + 'hannah/hannah-face.json?v=12',
    avatarUrl: BASE + 'hannah/hannah-avatar.jpg?v=12',
    // her real talking videos (made once, free): see hannah-video.js. ?hannahface uses the old animated photo.
    videoBase: BASE + 'hannah/video/',
    videoVersion: '2',
    // optional AI server (Groq) for questions the knowledge base can't answer: off unless ?hannahai
    apiUrl: /[?&]hannahai\b/.test(location.search) ? '/api/hannah.php' : null,
    silentRestarts: 3          // hands-free listening stops after this many silent turns
  };

  // used only if hannah-knowledge.json cannot be loaded
  var FALLBACK_KB = {
    assistant: { name: 'Hannah', role: 'Virtual Receptionist' },
    company: { contactEmail: 'contact@jattamkommerce.com' },
    greeting: { first: 'Hello and welcome to Nexora! I’m Hannah, your virtual receptionist. How can I help you today?',
      placeholder: 'Ask me about Nexora, our products, or book a demo...' },
    topics: [], navigation: [], smallTalk: [], roles: {}, domainWords: [],
    replies: {
      offTopic: ['I’m sorry, I can’t look that up right now. You can explore the website, or email contact@jattamkommerce.com and the team will help.'],
      unknownNexora: ['I’m sorry, I can’t look that up right now. Please email contact@jattamkommerce.com and the team will help.'],
      notUnderstood: ['I’m sorry, I didn’t catch that. Could you say it another way?'],
      confused: ['No problem. You can explore the website, or email contact@jattamkommerce.com.'],
      navigate: { enter: 'Of course. Taking you into the website now.' }
    }
  };

  var html = document.documentElement;
  var X = function () { return window.experience; };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);

  var ui = null;
  var inerted = [];
  var lenisWasRunning = false;
  var muted = params.has('hannahmute');

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

  var ICON = {
    arrow: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8.5" y="3" width="7" height="11.5" rx="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    micOff: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8.5" y="3" width="7" height="11.5" rx="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M4 4l16 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    end: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.2 13.6c4.9-4.4 12.7-4.4 17.6 0l-1.9 2.6a1.2 1.2 0 0 1-1.5.4l-2.3-1.1a1.2 1.2 0 0 1-.7-1.1v-1.6a11 11 0 0 0-4.8 0v1.6c0 .5-.3.9-.7 1.1l-2.3 1.1a1.2 1.2 0 0 1-1.5-.4l-1.9-2.6Z" fill="currentColor"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 11.2 19.2 4.6c.6-.3 1.2.3.9.9l-6.6 14.7c-.3.7-1.3.6-1.5-.1l-1.6-5.4-5.4-1.6c-.7-.2-.8-1.2-.1-1.5Z" fill="currentColor"/><path d="m10.4 13.6 3.7-3.7" stroke="#ffd200" stroke-width="1.6" stroke-linecap="round"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    collapse: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10h-5V5M5 14h5v5M14 10l6-6M10 14l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="6" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="18" cy="12" r="1.7" fill="currentColor"/></svg>',
    spark: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5c.4 3.1 1.9 5.2 5.5 6.5-3.6 1.3-5.1 3.4-5.5 6.5-.4-3.1-1.9-5.2-5.5-6.5 3.6-1.3 5.1-3.4 5.5-6.5Z" fill="currentColor"/></svg>',
    sound: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };
  var LOGO = '<svg viewBox="0 0 53 36" fill="none" aria-hidden="true"><path d="M5 30V6H11L24 23.5V6H30V30H24L11 12.5V30H5Z" fill="#261d26"/><path d="M34 6H39V30H34V6Z" fill="#FFD200"/><path d="M42 13H47V30H42V13Z" fill="#261d26"/><path d="M42 6H47V10H42V6Z" fill="#6FE45D"/></svg>';
  var WAVES = '<svg class="hn__waves" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">' +
    '<defs><linearGradient id="hnw1" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ffd84d" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9a6" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="hnw2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd84d" stop-opacity=".42"/><stop offset="1" stop-color="#ffefc0" stop-opacity="0"/></linearGradient></defs>' +
    '<path d="M0 760C180 700 300 760 420 840S640 900 700 900H0Z" fill="url(#hnw1)"/>' +
    '<path d="M0 820C160 790 260 830 360 900H0Z" fill="#ffd84d" fill-opacity=".22"/>' +
    '<path d="M1600 640C1440 700 1330 800 1240 900H1600Z" fill="url(#hnw1)"/>' +
    '<path d="M1600 0V170C1520 120 1470 60 1450 0Z" fill="url(#hnw2)"/></svg>';

  function remember() {
    try { sessionStorage.setItem(CONFIG.storageKey, '1'); } catch (e) { /* private mode: fine */ }
  }
  function clock() {
    try { return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; }
  }

  /* The layer -------------------------------------------------------------------------------- */

  function build(mode) {
    var returning = mode === 'return';

    var video = h('div', { class: 'hn__video hnf' });
    var state = h('span', { class: 'hn__state', text: '' });
    var tag = h('div', { class: 'hn__tag' }, [
      h('p', { class: 'hn__name', html: ICON.spark + '<span>Hannah</span>' }),
      h('p', { class: 'hn__role', 'data-state': 'ready' }, [h('i', { 'aria-hidden': 'true' }), h('span', { text: 'Virtual Receptionist' }), state])
    ]);
    var expand = h('button', { type: 'button', class: 'hn__icon hn__expand', 'aria-label': 'Full screen', title: 'Full screen', html: ICON.expand });
    var callMic = h('button', { type: 'button', class: 'hn__round hn__callMic', 'aria-pressed': 'false', 'aria-label': 'Talk to Hannah with your microphone', title: 'Talk with your voice', html: ICON.mic });
    var end = h('button', { type: 'button', class: 'hn__round hn__end', 'aria-label': returning ? 'End conversation and go back to Nexora' : 'End conversation and enter Nexora', title: 'End conversation', html: ICON.end });
    var more = h('button', { type: 'button', class: 'hn__icon hn__more', 'aria-label': 'More options', title: 'More options', 'aria-haspopup': 'true', 'aria-expanded': 'false', html: ICON.more });
    var menu = h('div', { class: 'hn__menu', role: 'menu', hidden: true }, [
      h('button', { type: 'button', role: 'menuitem', 'data-do': 'mute', text: 'Mute Hannah’s voice' }),
      h('button', { type: 'button', role: 'menuitem', 'data-do': 'restart', text: 'Start again' }),
      h('button', { type: 'button', role: 'menuitem', 'data-do': 'enter', text: returning ? 'Back to Nexora' : 'Enter Nexora' })
    ]);
    var tap = h('button', { type: 'button', class: 'hn__tap', hidden: true, html: ICON.sound + '<span>Tap to hear Hannah</span>' });
    var call = h('section', { class: 'hn__call', 'aria-label': 'Hannah, Nexora’s virtual receptionist' }, [
      video, tag, expand, tap, h('div', { class: 'hn__callBtns' }, [callMic, end]), more, menu
    ]);

    var log = h('section', { class: 'hn__log', 'aria-label': 'Conversation', 'aria-live': 'polite', 'aria-relevant': 'additions' });

    var input = h('input', { type: 'text', class: 'hn__input', id: 'hn-input', autocomplete: 'off', enterkeyhint: 'send',
      'aria-label': 'Message Hannah', maxlength: '400', placeholder: 'Ask me about Nexora, our products, or book a demo...' });
    var askMic = h('button', { type: 'button', class: 'hn__askMic', 'aria-pressed': 'false', 'aria-label': 'Speak instead of typing', title: 'Speak', html: ICON.mic });
    var send = h('button', { type: 'submit', class: 'hn__send', 'aria-label': 'Send', title: 'Send', html: ICON.send });
    var form = h('form', { class: 'hn__ask', autocomplete: 'off' }, [askMic, input, send]);
    var note = h('p', { class: 'hn__note', role: 'status', hidden: true });

    var skip = h('button', { type: 'button', class: 'hn__skip', html: '<span>' + (returning ? 'Back to Nexora' : 'Skip Introduction') + '</span>' + ICON.arrow });

    // the guided tour's small window: what she is saying, and Next / End tour
    var pipCap = h('p', { class: 'hn__pipCap' });
    var pipEnd = h('button', { type: 'button', class: 'hn__pipBtn hn__pipEnd', text: 'End tour' });
    var pipNext = h('button', { type: 'button', class: 'hn__pipBtn hn__pipNext', text: 'Next' });
    var pipBar = h('div', { class: 'hn__pip' }, [pipCap, h('div', { class: 'hn__pipBtns' }, [pipEnd, pipNext])]);

    var root = h('div', {
      id: 'hannah', class: 'hn', role: 'dialog', 'aria-modal': 'true',
      'aria-label': 'Hannah, Nexora’s virtual receptionist', tabindex: '-1', 'data-lenis-prevent': true
    }, [
      h('div', { class: 'hn__bg', html: WAVES }),
      h('div', { class: 'hn__inner' }, [
        h('header', { class: 'hn__bar' }, [
          h('div', { class: 'hn__brand', html: LOGO + '<span class="hn__brandText"><span class="hn__brandName">Nexora</span><span class="hn__brandSub">Powered by Jatta M Kommerce</span></span>' }),
          skip
        ]),
        h('main', { class: 'hn__main' }, [call, pipBar, log, form, note])
      ])
    ]);

    // Wheel, touch and keys inside the layer are Hannah's: the site's scroll and phase handlers
    // listen on window and must not move the page underneath.
    ['wheel', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keyup'].forEach(function (t) {
      root.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
    });

    return {
      mode: mode, root: root, call: call, video: video, role: tag.querySelector('.hn__role'), state: state,
      expand: expand, callMic: callMic, end: end, more: more, menu: menu, tap: tap, log: log,
      form: form, input: input, askMic: askMic, send: send, note: note, skip: skip,
      pipCap: pipCap, pipNext: pipNext, pipEnd: pipEnd, pip: false, siteStarted: false,
      leaving: false, convo: null
    };
  }

  /* The conversation ------------------------------------------------------------------------- */

  function Conversation(u) {
    this.ui = u;
    this.kb = FALLBACK_KB;
    this.brain = null;
    this.voice = null;
    this.face = null;
    this.handsFree = false;   // mic on: she listens again after each reply
    this.silent = 0;
    this.greetingBlocked = false;
    this.userSpoke = false;
    this.saying = null;       // the reply being spoken: { el, text, raf }
    this.liveUser = null;     // the visitor's words while they speak
    this.token = 0;           // bumps on restart / close so stale callbacks do nothing
    this.closed = false;
    this.player = null;       // her talking videos (hannah-video.js)
    this.history = [];        // recent turns, sent to the AI for context
    this.aiDown = false;
  }

  // the old animated photo: used only when the videos are missing
  Conversation.prototype.makeFace = function () {
    var u = this.ui;
    u.video.className = 'hn__video hnf';
    this.face = window.NexoraHannahFace ? window.NexoraHannahFace(u.video, {
      plateUrl: CONFIG.plateUrl, rigUrl: CONFIG.rigUrl,
      onReady: function () { u.call.classList.add('is-ready'); }
    }) : null;
    if (!this.face) u.video.appendChild(h('img', { class: 'hnf__poster', src: CONFIG.plateUrl, alt: '' }));
  };

  Conversation.prototype.start = function () {
    var self = this, u = this.ui;
    var clipsReady = Promise.resolve(false);
    if (window.NexoraHannahVideo && !params.has('hannahface')) {
      u.video.className = 'hn__video';
      this.player = window.NexoraHannahVideo(u.video, {
        base: CONFIG.videoBase,
        version: CONFIG.videoVersion,
        manifestUrl: CONFIG.videoBase + 'manifest.json?v=' + CONFIG.videoVersion,
        poster: CONFIG.videoBase + 'poster.jpg?v=' + CONFIG.videoVersion,
        onReady: function (ok) { if (ok) u.call.classList.add('is-ready'); }
      });
      clipsReady = this.player.ready.then(function (ok) {
        if (!ok && !self.closed) {
          self.player.destroy();
          self.player = null;
          u.video.innerHTML = '';
          self.makeFace();
        }
        return ok;
      });
    } else {
      this.makeFace();
    }

    var kbReady = fetch(CONFIG.knowledgeUrl).then(function (r) {
      if (!r.ok) throw new Error('knowledge ' + r.status);
      return r.json();
    }).catch(function (e) {
      if (window.console) console.warn('[Hannah] knowledge base unavailable, using a minimal one:', e && e.message);
      return FALLBACK_KB;
    }).then(function (kb) {
      return kb;
    });
    Promise.all([kbReady, clipsReady]).then(function (res) {
      var kb = res[0];
      if (self.closed) return;
      self.kb = kb;
      self.brain = window.NexoraHannahBrain ? window.NexoraHannahBrain(kb) : null;
      var vcfg = Object.assign({}, kb.voice || {}, { simulate: params.has('hannahsim'), apiUrl: CONFIG.apiUrl });
      self.voice = window.NexoraHannahVoice ? window.NexoraHannahVoice(vcfg) : null;
      if (self.face && self.voice) self.face.setMouthSource(function (now) { return self.voice.mouth(now); });
      if (kb.greeting && kb.greeting.placeholder) u.input.placeholder = kb.greeting.placeholder;
      if (!self.voice || !self.voice.listener.supported()) {
        u.callMic.hidden = true;
        u.askMic.hidden = true;
      }
      self.syncMute();
      self.greet();
    });
    this.bind();
  };

  Conversation.prototype.bind = function () {
    var self = this, u = this.ui;

    u.form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = u.input.value.trim();
      if (!text) { u.input.focus(); return; }
      u.input.value = '';
      self.fromVisitor(text);
    });
    u.input.addEventListener('input', function () {
      // typing while she listens: the visitor has chosen the keyboard
      if (self.listening()) self.stopListening(true);
    });
    [u.callMic, u.askMic].forEach(function (b) {
      b.addEventListener('click', function () { self.toggleMic(); });
    });
    u.end.addEventListener('click', function () { leave(0); });
    u.pipNext.addEventListener('click', function () { self.tourButton(true); });
    u.pipEnd.addEventListener('click', function () { self.tourButton(false); });
    u.skip.addEventListener('click', function () { leave(0); });
    u.tap.addEventListener('click', function () { self.replayGreeting(); });
    // the browser lets her speak only after the visitor has interacted with the page
    u.video.addEventListener('click', function () { if (self.greetingBlocked) self.replayGreeting(); });

    u.more.addEventListener('click', function (e) {
      e.stopPropagation();
      self.menu(u.menu.hidden);
    });
    u.menu.addEventListener('click', function (e) {
      var b = e.target.closest('[data-do]');
      if (!b) return;
      self.menu(false);
      var d = b.getAttribute('data-do');
      if (d === 'mute') { muted = !muted; self.syncMute(); if (muted && self.voice) self.voice.cancel(); }   // on video she keeps talking, silently
      else if (d === 'restart') self.restart();
      else if (d === 'enter') leave(0);
    });
    u.root.addEventListener('click', function (e) {
      if (!u.menu.hidden && !u.menu.contains(e.target)) self.menu(false);
    });
    u.root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !u.menu.hidden) { self.menu(false); u.more.focus(); }
    });

    var fsEl = u.call;
    if (fsEl.requestFullscreen || fsEl.webkitRequestFullscreen) {
      u.expand.addEventListener('click', function () {
        var on = document.fullscreenElement || document.webkitFullscreenElement;
        if (on) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
        else (fsEl.requestFullscreen || fsEl.webkitRequestFullscreen).call(fsEl);
      });
      this.onFs = function () {
        var on = (document.fullscreenElement || document.webkitFullscreenElement) === fsEl;
        u.expand.innerHTML = on ? ICON.collapse : ICON.expand;
        u.expand.setAttribute('aria-label', on ? 'Exit full screen' : 'Full screen');
        u.expand.title = on ? 'Exit full screen' : 'Full screen';
      };
      document.addEventListener('fullscreenchange', this.onFs);
      document.addEventListener('webkitfullscreenchange', this.onFs);
    } else {
      u.expand.hidden = true;
    }
  };

  Conversation.prototype.menu = function (open) {
    var u = this.ui;
    u.menu.hidden = !open;
    u.more.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var mb = u.menu.querySelector('[data-do="mute"]');
      mb.textContent = muted ? 'Unmute Hannah’s voice' : 'Mute Hannah’s voice';
      mb.focus();
    }
  };

  // stop whatever she is saying (video or voice)
  Conversation.prototype.hush = function () {
    if (this.player) this.player.cancel();
    if (this.voice) this.voice.cancel();
  };

  Conversation.prototype.syncMute = function () {
    if (this.player) this.player.setMuted(muted);
    if (this.voice) this.voice.muted = muted;
    this.ui.call.classList.toggle('is-muted', muted);
  };

  Conversation.prototype.setState = function (state, label) {
    var u = this.ui;
    u.role.setAttribute('data-state', state);
    u.state.textContent = label ? ' · ' + label : '';
    if (this.face) this.face.setMood({ listening: 'listening', thinking: 'thinking', speaking: 'speaking' }[state] || 'idle');
  };

  /* Messages */

  Conversation.prototype.bubble = function (who, text) {
    var u = this.ui;
    var row = h('div', { class: 'hn__msg hn__msg--' + who });
    if (who === 'hannah') row.appendChild(h('img', { class: 'hn__avatar', src: this.player ? CONFIG.videoBase + 'avatar.jpg?v=' + CONFIG.videoVersion : CONFIG.avatarUrl, alt: '' }));
    var body = h('div', { class: 'hn__msgBody' });
    var b = h('p', { class: 'hn__bubble' });
    if (who === 'hannah') {
      // the full text for screen readers at once; on screen it appears as she says it
      b.appendChild(h('span', { class: 'hn__sr', text: 'Hannah: ' + text }));
      var said = h('span', { class: 'hn__said', 'aria-hidden': 'true' });
      var rest = h('span', { class: 'hn__unsaid', 'aria-hidden': 'true', text: text });
      b.appendChild(said);
      b.appendChild(rest);
    } else {
      b.appendChild(h('span', { class: 'hn__sr', text: 'You: ' }));
      b.appendChild(document.createTextNode(text));
    }
    body.appendChild(b);
    body.appendChild(h('p', { class: 'hn__time', text: clock() }));
    row.appendChild(body);
    u.log.appendChild(row);
    this.scroll();
    return row;
  };

  Conversation.prototype.scroll = function () {
    var log = this.ui.log;
    log.scrollTo ? log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' }) : (log.scrollTop = log.scrollHeight);
  };

  function reveal(row, text, n) {
    var said = row.querySelector('.hn__said'), rest = row.querySelector('.hn__unsaid');
    if (!said) return;
    // never cut a word in half
    if (n < text.length) { var sp = text.lastIndexOf(' ', n); n = sp > 0 ? sp : 0; }
    if (said.textContent.length === n) return false;
    said.textContent = text.slice(0, n);
    rest.textContent = text.slice(n);
    return true;
  }

  /*
   * Hannah says something: a bubble that fills in word by word as her voice speaks it, and her
   * face lip-syncs to the same words. Resolves when she has finished.
   */
  Conversation.prototype.say = function (text, mood, row, key) {
    var self = this, token = this.token;
    if (this.saying) this.finishSaying();
    row = row || this.bubble('hannah', text);
    var s = { row: row, text: text, raf: 0 };
    this.saying = s;
    this.setState('speaking', 'Speaking');
    if (this.face && mood && mood !== 'speaking') this.face.setMood(mood);
    var player = this.player && this.player.manifest ? this.player : null;
    var clip = player && player.has(key || text);

    var tick = function (now) {
      if (self.saying !== s) return;
      var p = clip ? player.progress() : self.voice ? self.voice.progress(now) : 1;
      // keep the newest words in view while the bubble grows
      var n = Math.round(text.length * p);
      if (reveal(row, text, n)) self.ui.log.scrollTop = self.ui.log.scrollHeight;
      if (self.ui.pipCap) self.ui.pipCap.textContent = text;
      s.raf = requestAnimationFrame(tick);
    };
    var blocked = function () {
      if (token !== self.token) return;
      self.greetingBlocked = true;
      self.ui.tap.hidden = false;
    };
    if (clip) {
      // her real talking video for this sentence
      reveal(row, text, 0);
      s.raf = requestAnimationFrame(tick);
      return player.speak(key || text, { onBlocked: blocked }).then(function (ok) {
        if (self.saying === s) self.finishSaying();
        return ok;
      });
    }
    if (player || !this.voice || muted || !this.voice.available()) {
      // no clip for this sentence (or no voice): she shows it in writing
      reveal(row, text, text.length);
      return new Promise(function (res) {
        // a moment to read before she moves on
        setTimeout(function () { if (self.saying === s) self.finishSaying(); res(true); }, Math.min(2400, 500 + text.length * 12));
      });
    }
    reveal(row, text, 0);
    s.raf = requestAnimationFrame(tick);
    return this.voice.speak(text, {
      onStart: function () { if (self.face && mood && mood !== 'speaking') self.face.setMood(mood); },
      onBlocked: blocked
    }).then(function (ok) {
      if (self.saying === s) self.finishSaying();
      return ok;
    });
  };

  Conversation.prototype.finishSaying = function () {
    var s = this.saying;
    if (!s) return;
    this.saying = null;
    cancelAnimationFrame(s.raf);
    reveal(s.row, s.text, s.text.length);
    this.setState('ready');
  };

  Conversation.prototype.greet = function () {
    var self = this;
    var text = this.brain ? this.brain.greeting(this.ui.mode) : FALLBACK_KB.greeting.first;
    if (this.face) this.face.setMood('welcome');
    this.greetRow = this.bubble('hannah', text);
    this.greetText = text;
    this.say(text, 'welcome', this.greetRow).then(function () { self.afterReply(); });
  };

  Conversation.prototype.replayGreeting = function () {
    var self = this;
    this.greetingBlocked = false;
    this.ui.tap.hidden = true;
    if (this.userSpoke || !this.greetRow) return;
    this.say(this.greetText, 'welcome', this.greetRow).then(function () { self.afterReply(); });
  };

  /* The visitor speaks or types */

  Conversation.prototype.fromVisitor = function (text) {
    var self = this, token = this.token;
    this.userSpoke = true;
    this.greetingBlocked = false;
    this.ui.tap.hidden = true;
    this.hush();
    this.finishSaying();
    if (this.liveUser) { this.liveUser.remove(); this.liveUser = null; }
    this.bubble('user', text);
    this.hideNote();
    this.setState('thinking', 'Thinking');
    var local = this.brain ? this.brain.reply(text) : { text: FALLBACK_KB.replies.unknownNexora[0], mood: 'apologetic', fallback: true };
    var t0 = performance.now();
    // the knowledge base answers what it knows (instant, exact, with navigation); anything else
    // goes to the AI on the server, grounded in the same knowledge base
    var answer = local && local.fallback ? this.askAI(text).then(function (ai) {
      if (!ai) return local;
      if (self.brain) self.brain.clearPending();
      return { text: ai, mood: 'speaking' };
    }) : Promise.resolve(local);
    answer.then(function (r) {
      if (token !== self.token || self.closed) return;
      if (r) { self.remember('user', text); self.remember('assistant', r.text); }
      if (r && self.player) self.player.preload(r.key || r.text);
      // a short, natural pause before answering (the AI's own thinking time counts towards it)
      var pause = Math.max(0, 450 + Math.min(700, text.length * 8) - (performance.now() - t0));
      setTimeout(function () { if (token === self.token) self.respond(r); }, pause);
    });
  };

  // Hannah answers: the guided tour moves the website, lead details are kept, actions run after
  Conversation.prototype.respond = function (r) {
    var self = this, token = this.token;
    if (this.closed) return;
    if (!r) { this.afterReply(); return; }
    var tour = r.tour || null;
    if (tour && tour.step != null) { pip(true); showPhase(tour.phase); setPipButtons(false, tour.last); }
    else if (tour && tour.finish) pip(false);
    if (r.lead) saveLead(r.lead);
    this.say(r.text, r.mood || 'speaking', null, r.key).then(function (ok) {
      if (token !== self.token || self.closed) return;
      if (tour && tour.step != null) { setPipButtons(true, tour.last); self.setState('ready'); return; }
      if (tour && tour.stop) { setTimeout(function () { if (token === self.token) leave(0); }, ok ? 400 : 1500); return; }
      if (r.action) { setTimeout(function () { if (token === self.token) act(r.action, r.lead); }, ok ? 250 : 900); return; }
      if (r.end) { self.handsFree = false; self.syncMic(); }
      self.afterReply();
    });
  };

  // the tour's own buttons
  Conversation.prototype.tourButton = function (next) {
    if (!this.brain || this.closed) return;
    this.token++;
    this.hush();
    this.finishSaying();
    var r = next ? this.brain.tourNext() : this.brain.tourEnd();
    this.bubble('user', next ? 'Next' : 'End the tour');
    this.respond(r);
  };


  // the last few turns, so the AI understands follow-up questions
  Conversation.prototype.remember = function (role, content) {
    this.history.push({ role: role, content: String(content).slice(0, 600) });
    if (this.history.length > 8) this.history.splice(0, this.history.length - 8);
  };

  // ask the AI (Groq, through our server; the key never reaches the browser). Resolves with the
  // answer text, or null when the AI is unavailable, so the knowledge base answers instead.
  Conversation.prototype.askAI = function (text) {
    var self = this;
    if (!CONFIG.apiUrl || this.aiDown || !window.fetch) return Promise.resolve(null);
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 9000);
    return fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'chat', message: text, history: this.history }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) {
          // not configured / not deployed: stop asking for the rest of the visit
          if (r.status === 404 || r.status === 405 || r.status === 403 || (j && j.error === 'not_configured')) self.aiDown = true;
          throw new Error((j && (j.detail || j.error)) || 'http ' + r.status);
        }
        return j && j.text ? String(j.text) : null;
      });
    }).catch(function (e) {
      if (window.console) console.warn('[Hannah] AI unavailable, answering from the knowledge base:', e && e.message);
      return null;
    }).then(function (t) { clearTimeout(timer); return t; });
  };

  Conversation.prototype.afterReply = function () {
    if (this.closed) return;
    this.setState('ready');
    if (this.handsFree) this.listen();
    else if (this.face) this.face.setMood('idle');
  };

  /* Microphone */

  Conversation.prototype.listening = function () { return !!(this.voice && this.voice.listener.on); };

  Conversation.prototype.toggleMic = function () {
    this.handsFree = !this.handsFree;
    this.silent = 0;
    this.greetingBlocked = false;
    this.ui.tap.hidden = true;
    this.syncMic();
    if (this.handsFree) {
      // talking over Hannah: she stops and listens
      this.hush();
      this.finishSaying();
      this.listen();
    } else {
      this.stopListening(false);
      this.setState('ready');
    }
  };

  Conversation.prototype.syncMic = function () {
    var u = this.ui, on = this.handsFree;
    [u.callMic, u.askMic].forEach(function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.classList.toggle('is-on', on);
    });
    u.callMic.title = on ? 'Stop listening' : 'Talk with your voice';
    u.askMic.title = on ? 'Stop listening' : 'Speak';
  };

  Conversation.prototype.listen = function () {
    var self = this, token = this.token, lastNod = 0;
    if (!this.voice || this.closed || this.listening()) return;
    var started = this.voice.listener.start({
      onInterim: function (t) {
        if (token !== self.token) return;
        if (!self.liveUser) {
          self.liveUser = self.bubble('user', '');
          self.liveUser.classList.add('is-live');
        }
        var b = self.liveUser.querySelector('.hn__bubble');
        b.lastChild.textContent = t;
        self.scroll();
        var now = Date.now();
        if (self.face && now - lastNod > 2600) { lastNod = now; self.face.nod(); }
      },
      onFinal: function (t) {
        if (token !== self.token) return;
        self.silent = 0;
        self.fromVisitor(t);
      },
      onError: function (code) {
        if (token !== self.token) return;
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          self.handsFree = false; self.syncMic();
          self.showNote((self.kb.replies && self.kb.replies.micBlocked) || 'The microphone is blocked. You can type your question instead.');
        } else if (code === 'audio-capture') {
          self.handsFree = false; self.syncMic();
          self.showNote('No microphone was found. You can type your question instead.');
        } else if (code === 'network') {
          self.handsFree = false; self.syncMic();
          self.showNote('Voice input needs an internet connection. You can type your question instead.');
        }
      },
      onEnd: function (heard) {
        if (token !== self.token) return;
        if (self.liveUser && !heard) { self.liveUser.remove(); self.liveUser = null; }
        if (heard || !self.handsFree || self.closed) return;
        if (self.saying) return;
        if (++self.silent >= CONFIG.silentRestarts) {
          self.handsFree = false; self.syncMic(); self.setState('ready');
          self.showNote('I stopped listening. Tap the microphone whenever you want to talk.');
          return;
        }
        setTimeout(function () { if (token === self.token && self.handsFree && !self.saying) self.listen(); }, 250);
      }
    });
    if (started) this.setState('listening', 'Listening');
    else if (this.handsFree) { this.handsFree = false; this.syncMic(); }
  };

  Conversation.prototype.stopListening = function (discard) {
    if (this.voice) this.voice.listener.stop(discard);
    if (this.liveUser && discard) { this.liveUser.remove(); this.liveUser = null; }
  };

  Conversation.prototype.showNote = function (t) { this.ui.note.textContent = t; this.ui.note.hidden = false; };
  Conversation.prototype.hideNote = function () { this.ui.note.hidden = true; };

  Conversation.prototype.restart = function () {
    this.token++;
    this.hush();
    this.stopListening(true);
    this.finishSaying();
    this.handsFree = false;
    this.syncMic();
    this.userSpoke = false;
    this.ui.log.innerHTML = '';
    this.hideNote();
    if (this.brain) this.brain = window.NexoraHannahBrain(this.kb);
    this.greet();
  };

  Conversation.prototype.close = function () {
    this.closed = true;
    this.token++;
    this.hush();
    if (this.voice) this.stopListening(true);
    if (this.player) this.player.destroy();
    if (this.saying) cancelAnimationFrame(this.saying.raf);
    this.saying = null;
    if (this.face) this.face.destroy();
    if (this.onFs) {
      document.removeEventListener('fullscreenchange', this.onFs);
      document.removeEventListener('webkitfullscreenchange', this.onFs);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
    }
  };

  // Hannah acts on a request: a phase, a site panel (Contact = Book a Demo form) or the site
  function act(action, lead) {
    if (!action) return;
    if (action.type === 'phase') leave(action.phase || 0);
    else if (action.type === 'panel') { leave(0, action.panel); if (action.panel === 'Contact') prefillDemo(lead || savedLead()); }
    else if (action.type === 'enter') leave(0);
  }

  /* The visitor's details (lead) ------------------------------------------------------------- */
  // Kept in this browser tab and announced as a 'nexora:lead' event. Where leads are finally sent
  // (the super-admin portal) is decided later: listen for that event, or read NexoraHannah.lead().

  var LEAD_KEY = 'nx-hannah-lead';
  function saveLead(d) {
    d = Object.assign({}, d, { at: new Date().toISOString(), page: location.href });
    try { sessionStorage.setItem(LEAD_KEY, JSON.stringify(d)); } catch (e) { /* private mode */ }
    try { window.dispatchEvent(new CustomEvent('nexora:lead', { detail: d })); } catch (e) { /* old browser */ }
  }
  function savedLead() {
    try { return JSON.parse(sessionStorage.getItem(LEAD_KEY) || 'null'); } catch (e) { return null; }
  }
  // fill the Book a Demo form with what she has learned, so the visitor only adds the rest
  function prefillDemo(d) {
    if (!d) return;
    var role = { developer: 'Developer / Builder', buyer: 'Homebuyer', explorer: 'Other' }[d.role];
    var tries = 0;
    (function fill() {
      var f = document.querySelector('form[data-form="demo"]');
      if (!f) { if (++tries < 40) setTimeout(fill, 150); return; }
      var set = function (name, v) {
        var el = f.querySelector('[name="' + name + '"]');
        if (!el || v == null || v === '' || el.value) return;
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      set('name', d.name); set('email', d.email); set('phone', d.phone);
      if (d.role === 'developer') set('company', d.company);
      set('role', role);
      if (d.purpose) set('message', 'What brought me to Nexora: ' + d.purpose);
    })();
  }

  /* The guided tour: Hannah in a small window while the website shows each phase -------------- */

  function pip(on) {
    if (!ui || !!ui.pip === on) return;
    ui.pip = on;
    ui.root.classList.toggle('is-pip', on);
    ui.root.setAttribute('aria-modal', on ? 'false' : 'true');
    var x = X();
    if (on) {
      remember();
      setInert(false);
      html.classList.remove('nx-hannah');
      if (x && x.lenis && ui.mode === 'return') x.lenis.start();
    } else {
      html.classList.add('nx-hannah');
      setInert(true);
      if (x && x.lenis && ui.mode === 'return') x.lenis.stop();
      ui.root.focus({ preventScroll: true });
    }
  }
  function showPhase(phase) {
    if (!ui || !phase) return;
    if (!ui.siteStarted && ui.mode !== 'return') { ui.siteStarted = true; startSite(phase); return; }
    // the site is already running: move straight there (once its start screen has finished)
    var tries = 0;
    (function go() {
      if (!html.classList.contains('loading-page') && X() && X().skipToPhase) goToPhase(phase);
      else if (++tries < 60) setTimeout(go, 150);
    })();
  }
  function setPipButtons(enabled, last) {
    if (!ui || !ui.pipNext) return;
    ui.pipNext.textContent = last ? 'Finish tour' : 'Next';
    ui.pipNext.disabled = false;
    ui.pipNext.classList.toggle('is-ready', enabled);
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
    ui.convo = new Conversation(ui);
    ui.convo.start();
    ui.root.focus({ preventScroll: true });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (ui) ui.root.classList.add('is-in'); });
    });
  }

  function leave(phase, panel) {
    if (!ui || ui.leaving) return;
    var closing = ui;
    closing.leaving = true;
    remember();
    closing.convo.close();
    setInert(false);
    html.classList.remove('nx-hannah');
    closing.root.classList.add('is-leaving');
    ui = null;
    setTimeout(function () { closing.root.remove(); }, reduceMotion ? 0 : 650);

    if (closing.mode === 'return') {
      var x = X();
      if (x && x.lenis && lenisWasRunning) x.lenis.start();
      if (phase) goToPhase(phase);
      if (panel) setTimeout(function () { openPanel(panel); }, 300);
      var back = document.getElementById('menu-icon');
      if (back) back.focus({ preventScroll: true });
      return;
    }
    startSite(phase, panel);
  }

  // The site's own entrance: its Enter button appears once its assets have loaded (html.loaded).
  function startSite(phase, panel) {
    whenLoaded(function () {
      var btn = document.getElementById('enter-button');
      if (btn && html.classList.contains('loading-page')) btn.click();
      if (phase) whenStarted(function () { goToPhase(phase); });
      else if (panel) whenStarted(function () { openPanel(panel); });
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

  // the same steps as the site's own panel buttons (nexora.js)
  function openPanel(key) {
    var x = X();
    if (!x || !x.openDeepDive) return;
    if (html.classList.contains('menu-open') && x.menu) x.menu.toggle();
    if (x.state && x.state.inDeepDive) {
      x.closeDeepDive();
      setTimeout(function () { x.openDeepDive(key); }, 520);
    } else {
      x.openDeepDive(key);
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
    isOpen: function () { return !!ui; },
    lead: savedLead,
    // for manual testing in the console: NexoraHannah.ask('how much does it cost?')
    ask: function (text) { if (ui && ui.convo) ui.convo.fromVisitor(text); }
  };

  if (html.classList.contains('nx-hannah')) open('welcome');
})();
