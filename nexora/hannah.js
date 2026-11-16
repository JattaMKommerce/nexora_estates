/*
 * Hannah, Nexora's virtual receptionist: 100% independent, credit-free human AI receptionist.
 * Powered by WebGL real-photo facial animation, Web Speech API, and verified Nexora knowledge base.
 * Zero dependency on LiveAvatar, zero credits, zero subscription billing.
 */
(function () {
  'use strict';

  var CONFIG = {
    storageKey: 'nx-hannah-entered',
    plateUrl: '/nexora/hannah/hannah-plate.jpg',
    rigUrl: '/nexora/hannah/hannah-face.json',
    avatarUrl: '/nexora/hannah/hannah-avatar.jpg',
    knowledgeUrl: '/nexora/hannah-knowledge.json',
    loadTimeoutMs: 15000
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
  var speechWatchdog = null;
  var hasUserInteracted = false;

  /* Helper to create DOM elements */
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
    try { sessionStorage.setItem(CONFIG.storageKey, '1'); } catch (e) {}
  }

  /* ---------------- Verified Knowledge Base Engine ---------------- */
  var KNOWLEDGE = {
    greeting: "Hello and welcome to Nexora! I'm Hannah, your virtual receptionist. I'm here to guide you through our platform and development stages. What would you like to explore today?",
    stages: {
      1: "Stage 1 is Site Evaluation: Comprehensive road access assessment, boundary and topography surveys, water and electrical utility verification, municipal sanction reviews, zoning and setbacks, soil compaction testing, and environmental clearances.",
      2: "Stage 2 is Master Planning: Crafting villa layouts, sanction plans, RERA registration compliance, early material planning, and launching Nexora's interactive 3D digital twin with villa customization.",
      3: "Stage 3 is Construction: Watching the society, residential towers, and clubhouse rise: site mobilization, foundation rafts, structural tower frameworks, clubhouse facilities, swimming pools, sports courts, and underground utilities.",
      4: "Stage 4 is Fit-Out & Handover: Premium bespoke interior finishes, modular designer kitchens, 200+ point digital snag audits in the Nexora app, contractor snag resolution, and official homeowner key handover.",
      5: "Stage 5 is Ready to Move In: Welcoming residents to active society amenities: operational clubhouse and pool, 24/7 smart gated security, and seamless estate facility management via the Nexora app.",
      6: "Stage 6 is Virtual Tour: Explore interactive points on our illustrative luxury villa: architectural facade and driveway, private courtyard gardens, society clubhouse, living and dining pavilion, and master bedroom suite."
    },
    answer: function (query) {
      var q = (query || '').toLowerCase().trim();
      if (!q) return KNOWLEDGE.greeting;
      if (q.indexOf('site') !== -1 || q.indexOf('evaluation') !== -1 || q.indexOf('stage 1') !== -1) return KNOWLEDGE.stages[1];
      if (q.indexOf('master') !== -1 || q.indexOf('planning') !== -1 || q.indexOf('stage 2') !== -1) return KNOWLEDGE.stages[2];
      if (q.indexOf('construct') !== -1 || q.indexOf('stage 3') !== -1 || q.indexOf('tower') !== -1 || q.indexOf('clubhouse') !== -1) return KNOWLEDGE.stages[3];
      if (q.indexOf('fit') !== -1 || q.indexOf('handover') !== -1 || q.indexOf('stage 4') !== -1 || q.indexOf('snag') !== -1) return KNOWLEDGE.stages[4];
      if (q.indexOf('ready') !== -1 || q.indexOf('move') !== -1 || q.indexOf('stage 5') !== -1) return KNOWLEDGE.stages[5];
      if (q.indexOf('virtual') !== -1 || q.indexOf('tour') !== -1 || q.indexOf('stage 6') !== -1 || q.indexOf('villa') !== -1) return KNOWLEDGE.stages[6];
      if (q.indexOf('price') !== -1 || q.indexOf('cost') !== -1 || q.indexOf('buy') !== -1) {
        return "Nexora is a technology platform for developers, and the society shown is an illustrative demonstration. For custom developer subscriptions or project sales details, please book a demo or email contact@jattamkommerce.com.";
      }
      if (q.indexOf('what is nexora') !== -1 || q.indexOf('about') !== -1 || q.indexOf('who are you') !== -1) {
        return "Nexora is a real estate digital twin and construction tracking SaaS platform powered by Jatta M Kommerce. It empowers builders, developers, and home buyers to visualize, manage, and pre-sell developments before and while they are built.";
      }
      return "I'm happy to help you with that! You can explore any of our six development stages using the buttons on the right, or press 'Enter Nexora' to step directly into the interactive 3D platform.";
    }
  };

  /* ---------------- UI Construction ---------------- */
  function build(mode) {
    var returning = mode === 'return';

    var status = h('span', { class: 'hn__status', 'data-state': 'connecting', role: 'status', 'aria-live': 'polite' },
      [h('i', { 'aria-hidden': 'true' }), h('span', { text: 'Loading Hannah…' })]);

    var veilText = h('p', { text: 'Preparing Hannah…' });
    var veil = h('div', { class: 'hn__veil' }, [h('span', { class: 'hn__spinner', 'aria-hidden': 'true' }), veilText]);

    var videoContainer = h('div', { class: 'hn__videoContainer hnf', id: 'hn-avatar-container' });
    var caption = h('div', { class: 'hn__caption', style: 'opacity: 0;' });

    var startBtn = h('button', {
      type: 'button',
      class: 'hn__startBtn',
      html: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><polygon points="6,4 16,10 6,16" fill="currentColor"/></svg><span>Talk to Hannah</span>'
    });
    var startHint = h('p', { class: 'hn__startHint', text: 'Click anywhere to begin audio conversation' });
    var startOverlay = h('div', { class: 'hn__startOverlay' }, [startBtn, startHint]);

    var micBtn = h('button', { type: 'button', class: 'hn__chatMic', title: 'Speak to Hannah', html: MIC });
    var textInput = h('input', { type: 'text', class: 'hn__chatInput', placeholder: 'Ask Hannah about Nexora or any stage…' });
    var sendBtn = h('button', { type: 'button', class: 'hn__chatSend', title: 'Send message', html: SEND });
    var chatBar = h('div', { class: 'hn__chatBar' }, [micBtn, textInput, sendBtn]);

    var frame = h('div', { class: 'hn__frame' }, [videoContainer, caption, chatBar, startOverlay, veil]);

    var micNote = h('p', { class: 'hn__mic', 'data-state': 'granted' }, [
      h('span', { html: MIC }),
      h('span', { text: 'Free 100% self-hosted human AI receptionist. Zero credits, zero subscriptions.' })
    ]);

    var stage = h('section', { class: 'hn__stage', 'aria-label': 'Hannah Virtual Receptionist' }, [
      h('div', { class: 'hn__stageHead' }, [
        h('div', { class: 'hn__who' }, [h('strong', { text: 'Hannah' }), h('span', { text: 'AI Receptionist · Zero Credits' })]),
        status
      ]),
      frame,
      micNote
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
        ? 'Ask Hannah anything about Nexora, or jump straight into any construction stage below.'
        : "I'm Hannah, your virtual receptionist. I'll guide you through our platform and help you discover everything Nexora has to offer." }),
      h('p', { class: 'hn__label', id: 'hn-stops', text: 'Or go straight to' }),
      stops
    ]);

    var root = h('div', {
      id: 'hannah', class: 'hn', role: 'dialog', 'aria-modal': 'true',
      'aria-label': 'Hannah Virtual Receptionist', tabindex: '-1', 'data-lenis-prevent': true
    }, [
      h('div', { class: 'hn__inner' }, [
        h('header', { class: 'hn__bar' }, [
          h('div', { class: 'hn__brand', html: LOGO + '<span class="hn__brandText"><span class="hn__brandName">Nexora</span><span class="hn__brandSub">powered by Jatta M Kommerce</span></span>' }),
          skip
        ]),
        h('main', { class: 'hn__main' }, [
          stage,
          panel,
          h('div', { class: 'hn__cta' }, [enter]),
          h('p', { class: 'hn__fine' }, [h('span', { text: 'Independent AI receptionist powered by WebGL & Web Speech API. Completely free with zero credit restrictions.' })])
        ])
      ])
    ]);

    enter.addEventListener('click', function () { leave(0); });
    skip.addEventListener('click', function () { leave(0); });

    startOverlay.addEventListener('click', function (e) {
      e.stopPropagation();
      unlockAndGreet();
    });

    frame.addEventListener('click', function (e) {
      if (!hasUserInteracted && !e.target.closest('.hn__chatBar')) {
        unlockAndGreet();
      }
    });

    stops.addEventListener('click', function (e) {
      var b = e.target.closest('[data-phase]');
      if (b) {
        unlockAudio();
        var p = Number(b.getAttribute('data-phase'));
        handleUserInput("Explain Stage " + p + ": " + b.textContent.trim(), p);
      }
    });

    sendBtn.addEventListener('click', function () {
      unlockAudio();
      var q = textInput.value;
      if (q && q.trim()) {
        textInput.value = '';
        handleUserInput(q.trim());
      }
    });

    textInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        unlockAudio();
        var q = textInput.value;
        if (q && q.trim()) {
          textInput.value = '';
          handleUserInput(q.trim());
        }
      }
    });

    micBtn.addEventListener('click', function () {
      unlockAudio();
      toggleListening();
    });

    return {
      mode: mode, root: root, frame: frame, videoContainer: videoContainer, veil: veil,
      startOverlay: startOverlay, status: status, micBtn: micBtn, textInput: textInput,
      caption: caption, leaving: false
    };
  }

  function unlockAudio() {
    if (hasUserInteracted) return;
    hasUserInteracted = true;
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      }
    } catch (e) {}
    if (ui && ui.startOverlay) {
      ui.startOverlay.style.opacity = '0';
      setTimeout(function () {
        if (ui && ui.startOverlay && ui.startOverlay.parentNode) {
          ui.startOverlay.parentNode.removeChild(ui.startOverlay);
        }
      }, 350);
    }
  }

  function unlockAndGreet() {
    unlockAudio();
    handleUserInput('', null);
  }

  function setStatus(state, text) {
    if (!ui) return;
    ui.status.setAttribute('data-state', state);
    ui.status.lastChild.textContent = text;
  }

  function showCaption(text, progress) {
    if (!ui || !ui.caption) return;
    if (progress != null && progress < 1) {
      var chars = Math.round(text.length * progress);
      var visible = text.substring(0, chars);
      var rest = text.substring(chars);
      ui.caption.innerHTML = '<span>' + visible + '</span><span style="opacity: 0.35;">' + rest + '</span>';
    } else {
      ui.caption.textContent = text;
    }
    ui.caption.style.opacity = '1';
  }

  function hideCaption() {
    if (!ui || !ui.caption) return;
    ui.caption.style.opacity = '0';
  }

  /* ---------------- Voice Speaking & Caption Synchronization ---------------- */
  function speakReply(text, onComplete, mood) {
    var targetMood = mood || 'speaking';
    if (!voice || !voice.available()) {
      showCaption(text);
      if (face) face.setMood(targetMood);
      setTimeout(function () {
        if (face) face.setMood('idle');
        if (onComplete) onComplete();
      }, Math.min(3000, 1000 + text.length * 25));
      return;
    }

    if (captionRaf) {
      cancelAnimationFrame(captionRaf);
      captionRaf = null;
    }

    if (speechWatchdog) {
      clearInterval(speechWatchdog);
      speechWatchdog = null;
    }
    speechWatchdog = setInterval(function () {
      if (isSpeaking && window.speechSynthesis && window.speechSynthesis.paused) {
        try { window.speechSynthesis.resume(); } catch (e) {}
      }
    }, 350);

    isSpeaking = true;
    setStatus('speaking', 'Speaking…');
    if (face) face.setMood(targetMood);

    var streamCaption = function () {
      if (!isSpeaking) return;
      var p = voice.progress(performance.now());
      showCaption(text, p);
      captionRaf = requestAnimationFrame(streamCaption);
    };
    streamCaption();

    voice.speak(text, {
      onBlocked: function () {
        isSpeaking = false;
        if (speechWatchdog) { clearInterval(speechWatchdog); speechWatchdog = null; }
        if (captionRaf) { cancelAnimationFrame(captionRaf); captionRaf = null; }
        if (ui && ui.startOverlay) {
          ui.startOverlay.style.opacity = '1';
        }
        setStatus('ready', 'Click to Listen');
      }
    }).then(function () {
      if (speechWatchdog) { clearInterval(speechWatchdog); speechWatchdog = null; }
      isSpeaking = false;
      if (captionRaf) {
        cancelAnimationFrame(captionRaf);
        captionRaf = null;
      }
      showCaption(text, 1.0);
      setStatus('ready', 'Ready');
      if (face) face.setMood('idle');
      if (onComplete) onComplete();
    }).catch(function () {
      if (speechWatchdog) { clearInterval(speechWatchdog); speechWatchdog = null; }
      isSpeaking = false;
      if (captionRaf) {
        cancelAnimationFrame(captionRaf);
        captionRaf = null;
      }
      showCaption(text, 1.0);
      setStatus('ready', 'Ready');
      if (face) face.setMood('idle');
      if (onComplete) onComplete();
    });
  }

  function stopSpeaking() {
    isSpeaking = false;
    if (speechWatchdog) {
      clearInterval(speechWatchdog);
      speechWatchdog = null;
    }
    if (captionRaf) {
      cancelAnimationFrame(captionRaf);
      captionRaf = null;
    }
    if (voice) voice.cancel();
    if (face) face.setMood('idle');
  }

  /* ---------------- Speech Recognition (Microphone) ---------------- */
  function toggleListening() {
    if (!voice || !voice.listener || !voice.listener.supported()) {
      alert("Microphone input is supported in Chrome, Edge, and Safari.");
      return;
    }

    if (isListening) {
      voice.listener.stop();
      isListening = false;
      if (ui && ui.micBtn) ui.micBtn.classList.remove('is-listening');
      setStatus('ready', 'Ready');
      if (face) face.setMood('idle');
    } else {
      stopSpeaking();
      isListening = true;
      if (ui && ui.micBtn) ui.micBtn.classList.add('is-listening');
      setStatus('listening', 'Listening…');
      if (face) face.setMood('listening');
      showCaption('Listening… Please speak now.');

      voice.listener.start({
        onInterim: function (t) {
          showCaption('“' + t + '…”');
        },
        onFinal: function (t) {
          isListening = false;
          if (ui && ui.micBtn) ui.micBtn.classList.remove('is-listening');
          showCaption('“' + t + '”');
          handleUserInput(t);
        },
        onEnd: function (heard) {
          isListening = false;
          if (ui && ui.micBtn) ui.micBtn.classList.remove('is-listening');
          if (!heard && !isSpeaking) {
            setStatus('ready', 'Ready');
            if (face) face.setMood('idle');
          }
        },
        onError: function (err) {
          isListening = false;
          if (ui && ui.micBtn) ui.micBtn.classList.remove('is-listening');
          setStatus('ready', 'Ready');
          if (face) face.setMood('idle');
        }
      });
    }
  }

  /* ---------------- User Interaction Flow ---------------- */
  function handleUserInput(query, stagePhase) {
    stopSpeaking();
    setStatus('thinking', 'Thinking…');
    if (face) face.setMood('thinking');

    var qLower = (query || '').toLowerCase().trim();
    var isGreeting = !query || qLower.indexOf('hello') !== -1 || qLower.indexOf('hi') !== -1 || qLower.indexOf('welcome') !== -1;
    var reply = KNOWLEDGE.answer(query);
    var targetMood = isGreeting ? 'welcome' : 'speaking';

    setTimeout(function () {
      speakReply(reply, function () {
        if (stagePhase) {
          setTimeout(function () { leave(stagePhase); }, 2200);
        }
      }, targetMood);
    }, 350);
  }

  /* ---------------- Mount Photorealistic Human Avatar ---------------- */
  function mountAvatar() {
    if (!ui) return;
    setStatus('connecting', 'Preparing Hannah…');

    // Initialize Web Speech voice engine
    if (window.NexoraHannahVoice) {
      voice = window.NexoraHannahVoice({ simulate: false });
    }

    // Initialize WebGL Photorealistic Face
    if (window.NexoraHannahFace) {
      face = window.NexoraHannahFace(ui.videoContainer, {
        plateUrl: CONFIG.plateUrl,
        rigUrl: CONFIG.rigUrl,
        onReady: function (ok) {
          if (ui.veil) {
            ui.veil.style.opacity = '0';
            setTimeout(function () { if (ui.veil) ui.veil.style.display = 'none'; }, 400);
          }
          ui.frame.classList.add('is-loaded');
          setStatus('ready', 'Ready');

          if (voice) {
            face.setMouthSource(function (now) {
              return voice.mouth(now);
            });
          }

          // Initial caption shows greeting
          showCaption(KNOWLEDGE.greeting);

          // If the visitor already interacted, speak immediately; otherwise wait for click to unlock audio
          if (hasUserInteracted) {
            handleUserInput('', null);
          }
        }
      });
    } else {
      // Fallback poster
      var poster = h('img', { class: 'hnf__poster', src: CONFIG.plateUrl, alt: 'Hannah' });
      ui.videoContainer.appendChild(poster);
      if (ui.veil) ui.veil.style.display = 'none';
      setStatus('ready', 'Ready');
      showCaption(KNOWLEDGE.greeting);
      if (hasUserInteracted) {
        handleUserInput('', null);
      }
    }
  }

  /* ---------------- Dismiss / Enter Site ---------------- */
  function leave(phaseNumber) {
    if (!ui || ui.leaving) return;
    ui.leaving = true;
    remember();

    stopSpeaking();
    if (face && typeof face.destroy === 'function') {
      face.destroy();
      face = null;
    }

    ui.root.classList.add('is-leaving');
    setTimeout(function () {
      html.classList.remove('nx-hannah');
      if (ui) { ui.root.remove(); ui = null; }
      if (window.experience && typeof window.experience.enterSite === 'function') {
        window.experience.enterSite();
      }
      if (phaseNumber && window.experience && typeof window.experience.skipToPhase === 'function') {
        window.experience.skipToPhase(phaseNumber);
      }
    }, 600);
  }

  function open(mode) {
    if (ui) return;
    ui = build(mode || 'first');
    document.body.appendChild(ui.root);
    requestAnimationFrame(function () {
      ui.root.classList.add('is-in');
      mountAvatar();
    });
  }

  /* Check on load whether to show Hannah */
  function init() {
    var q = location.search;
    var show = !sessionStorage.getItem(CONFIG.storageKey) || /[?&]welcome(=|&|$)/.test(q);
    if (/[?&]skipwelcome(=|&|$)/.test(q)) show = false;

    if (show) {
      html.classList.add('nx-hannah');
      open('first');
    } else {
      html.classList.remove('nx-hannah');
    }

    document.querySelectorAll('[data-nx-hannah], #menu-hannah').forEach(function (btn) {
      btn.addEventListener('click', function () { open('return'); });
    });
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
