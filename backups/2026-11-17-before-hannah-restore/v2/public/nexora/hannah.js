/*
 * Streamlined, bulletproof Hannah receptionist controller.
 */
(function () {
  'use strict';

  var CONFIG = {
    storageKey: 'nx-hannah-entered',
    plateUrl: '/nexora/hannah/hannah-plate.jpg',
    rigUrl: '/nexora/hannah/hannah-face.json',
    knowledgeUrl: '/nexora/hannah-knowledge.json'
  };

  var STOPS = [
    [1, 'Site Evaluation'],
    [2, 'Master Planning'],
    [3, 'Construction'],
    [4, 'Fit-Out & Handover'],
    [5, 'Ready to Move In'],
    [6, 'Virtual Tour']
  ];

  var html = document.documentElement;
  var ui = null;
  var face = null;
  var voice = null;
  var isSpeaking = false;
  var isListening = false;
  var captionRaf = null;
  var hasUserInteracted = false;

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
  var SEND = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10L17 3L10 17L9 11L3 10Z" fill="currentColor"/></svg>';
  var LOGO = '<svg viewBox="0 0 53 36" fill="none" aria-hidden="true"><path d="M5 30V6H11L24 23.5V6H30V30H24L11 12.5V30H5Z" fill="#261d26"/><path d="M34 6H39V30H34V6Z" fill="#FFD200"/><path d="M42 13H47V30H42V13Z" fill="#261d26"/><path d="M42 6H47V10H42V6Z" fill="#6FE45D"/></svg>';

  function remember() {
    try { sessionStorage.setItem(CONFIG.storageKey, '1'); } catch (e) { }
  }

  var KNOWLEDGE = {
    greeting: "Hello and welcome to Nexora! I'm Hannah, your virtual receptionist. What would you like to explore today?",
    stages: {
      1: "Stage 1 is Site Evaluation: Road access, boundary surveys, utility verification, and municipal sanction reviews.",
      2: "Stage 2 is Master Planning: Villa layouts, sanction plans, RERA compliance, and interactive 3D digital twins.",
      3: "Stage 3 is Construction: Foundation rafts, structural tower frameworks, clubhouse facilities, and swimming pools.",
      4: "Stage 4 is Fit-Out & Handover: Bespoke interior finishes, designer kitchens, and digital snag audits.",
      5: "Stage 5 is Ready to Move In: Operational amenities, smart gated security, and estate management.",
      6: "Stage 6 is Virtual Tour: Explore our illustrative luxury villa facade, private gardens, and master suite."
    },
    answer: function (query) {
      var q = (query || '').toLowerCase().trim();
      if (!q) return KNOWLEDGE.greeting;
      if (q.indexOf('site') !== -1 || q.indexOf('1') !== -1) return KNOWLEDGE.stages[1];
      if (q.indexOf('master') !== -1 || q.indexOf('2') !== -1) return KNOWLEDGE.stages[2];
      if (q.indexOf('construct') !== -1 || q.indexOf('3') !== -1) return KNOWLEDGE.stages[3];
      if (q.indexOf('fit') !== -1 || q.indexOf('4') !== -1) return KNOWLEDGE.stages[4];
      if (q.indexOf('ready') !== -1 || q.indexOf('5') !== -1) return KNOWLEDGE.stages[5];
      if (q.indexOf('tour') !== -1 || q.indexOf('6') !== -1) return KNOWLEDGE.stages[6];
      return "I'm happy to help! You can explore our development stages using the buttons on the right, or press 'Enter Nexora'.";
    }
  };

  function build(mode) {
    var returning = mode === 'return';
    var status = h('span', { class: 'hn__status', 'data-state': 'connecting', role: 'status', 'aria-live': 'polite' },
      [h('i', { 'aria-hidden': 'true' }), h('span', { text: 'Loading Hannah…' })]);

    var veil = h('div', { class: 'hn__veil' }, [h('span', { class: 'hn__spinner', 'aria-hidden': 'true' }), h('p', { text: 'Preparing Hannah…' })]);
    var videoContainer = h('div', { class: 'hn__videoContainer hnf', id: 'hn-avatar-container' });
    var caption = h('div', { class: 'hn__caption', style: 'opacity: 0;' });

    var startBtn = h('button', { type: 'button', class: 'hn__startBtn', html: '<span>Talk to Hannah</span>' });
    var startOverlay = h('div', { class: 'hn__startOverlay' }, [startBtn]);

    var micBtn = h('button', { type: 'button', class: 'hn__chatMic', title: 'Speak', html: MIC });
    var textInput = h('input', { type: 'text', class: 'hn__chatInput', placeholder: 'Ask Hannah anything…' });
    var sendBtn = h('button', { type: 'button', class: 'hn__chatSend', title: 'Send', html: SEND });
    var chatBar = h('div', { class: 'hn__chatBar' }, [micBtn, textInput, sendBtn]);

    var frame = h('div', { class: 'hn__frame' }, [videoContainer, caption, chatBar, startOverlay, veil]);
    var stops = h('ul', { class: 'hn__stops' }, STOPS.map(function (s) {
      return h('li', null, [h('button', { type: 'button', class: 'hn__stop', 'data-phase': s[0] }, [h('span', { text: '0' + s[0] }), s[1]])]);
    }));

    var enter = h('button', { type: 'button', class: 'hn__enter', html: '<span>' + (returning ? 'Back to Nexora' : 'Enter Nexora') + '</span>' + ARROW });
    var skip = h('button', { type: 'button', class: 'hn__skip', html: '<span>Skip</span>' + ARROW });

    var panel = h('section', { class: 'hn__panel' }, [
      h('p', { class: 'hn__eyebrow', text: 'Nexora · Virtual reception' }),
      h('h1', { class: 'hn__title', text: 'Welcome to Nexora.' }),
      h('p', { class: 'hn__lead', text: KNOWLEDGE.greeting }),
      stops
    ]);

    var root = h('div', { id: 'hannah', class: 'hn', role: 'dialog' }, [
      h('div', { class: 'hn__inner' }, [
        h('header', { class: 'hn__bar' }, [h('div', { class: 'hn__brand', html: LOGO + '<span>Nexora</span>' }), skip]),
        h('main', { class: 'hn__main' }, [
          h('section', { class: 'hn__stage' }, [h('div', { class: 'hn__stageHead' }, [h('strong', { text: 'Hannah' }), status]), frame]),
          panel,
          h('div', { class: 'hn__cta' }, [enter])
        ])
      ])
    ]);

    enter.addEventListener('click', function () { leave(0); });
    skip.addEventListener('click', function () { leave(0); });
    startOverlay.addEventListener('click', function () { unlockAndGreet(); });

    stops.addEventListener('click', function (e) {
      var b = e.target.closest('[data-phase]');
      if (b) {
        unlockAudio();
        var p = Number(b.getAttribute('data-phase'));
        handleUserInput("Explain Stage " + p, p);
      }
    });

    sendBtn.addEventListener('click', function () {
      unlockAudio();
      if (textInput.value.trim()) {
        var q = textInput.value.trim();
        textInput.value = '';
        handleUserInput(q);
      }
    });

    textInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && textInput.value.trim()) {
        unlockAudio();
        var q = textInput.value.trim();
        textInput.value = '';
        handleUserInput(q);
      }
    });

    return { root: root, videoContainer: videoContainer, veil: veil, startOverlay: startOverlay, status: status, textInput: textInput };
  }

  function unlockAudio() {
    if (hasUserInteracted) return;
    hasUserInteracted = true;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (ui && ui.startOverlay) ui.startOverlay.style.display = 'none';
  }

  function unlockAndGreet() {
    unlockAudio();
    handleUserInput('');
  }

  function showCaption(text) {
    if (ui && ui.caption) {
      ui.caption.textContent = text;
      ui.caption.style.opacity = '1';
    }
  }

  function speakReply(text, onComplete) {
    if (!voice || !voice.available()) {
      showCaption(text);
      if (onComplete) onComplete();
      return;
    }
    isSpeaking = true;
    if (face) face.setMood('speaking');
    showCaption(text);

    voice.speak(text, {
      onEnd: function () {
        isSpeaking = false;
        if (face) face.setMood('idle');
        if (onComplete) onComplete();
      },
      onBlocked: function () {
        isSpeaking = false;
        if (ui && ui.startOverlay) ui.startOverlay.style.display = 'flex';
      }
    });
  }

  function handleUserInput(query, stagePhase) {
    if (face) face.setMood('thinking');
    var reply = KNOWLEDGE.answer(query);
    speakReply(reply, function () {
      if (stagePhase) {
        setTimeout(function () { leave(stagePhase); }, 2000);
      }
    });
  }

  function mountAvatar() {
    if (!ui) return;
    if (window.NexoraHannahVoice) {
      voice = window.NexoraHannahVoice({ simulate: false });
    }
    if (window.NexoraHannahFace) {
      face = window.NexoraHannahFace(ui.videoContainer, {
        plateUrl: CONFIG.plateUrl,
        rigUrl: CONFIG.rigUrl,
        onReady: function () {
          if (ui.veil) ui.veil.style.display = 'none';
          showCaption(KNOWLEDGE.greeting);
          if (hasUserInteracted) handleUserInput('');
        }
      });
    }
  }

  function leave(phaseNumber) {
    if (face && typeof face.destroy === 'function') face.destroy();
    html.classList.remove('nx-hannah');
    if (ui && ui.root) ui.root.remove();
    if (window.experience && typeof window.experience.enterSite === 'function') {
      window.experience.enterSite();
    }
    if (phaseNumber && window.experience && typeof window.experience.skipToPhase === 'function') {
      window.experience.skipToPhase(phaseNumber);
    }
  }

  function open(mode) {
    if (ui) return;
    ui = build(mode);
    document.body.appendChild(ui.root);
    mountAvatar();
  }

  function init() {
    var show = !sessionStorage.getItem(CONFIG.storageKey) || /[?&]welcome/.test(location.search);
    if (/[?&]skipwelcome/.test(location.search)) show = false;
    if (show) {
      html.classList.add('nx-hannah');
      open('first');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NexoraHannah = {
    open: function () { open('return'); },
    close: function () { leave(0); }
  };
})();