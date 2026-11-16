/*
 * Hannah, Nexora's virtual receptionist: 100% independent, credit-free 3D AI receptionist.
 * Powered by Three.js, Web Speech API, and verified Nexora knowledge base.
 * Zero dependency on LiveAvatar, zero credits, zero subscription billing.
 */
(function () {
  'use strict';

  var CONFIG = {
    storageKey: 'nx-hannah-entered',
    modelUrl: '/hannah/hannah.glb',
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
  var inerted = [];
  var lenisWasRunning = false;
  var avatarController = null;
  var speechEngine = null;

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
    greeting: "Welcome to Nexora! I'm Hannah, your virtual receptionist. I'm here to guide you through our 3D real estate platform and development stages. What would you like to explore today?",
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
      [h('i', { 'aria-hidden': 'true' }), h('span', { text: 'Loading Hannah 3D…' })]);

    var veilText = h('p', { text: 'Preparing Hannah & 3D Rig…' });
    var veil = h('div', { class: 'hn__veil' }, [h('span', { class: 'hn__spinner', 'aria-hidden': 'true' }), veilText]);

    var canvas = h('canvas', { id: 'hn-avatar-canvas' });
    var caption = h('div', { class: 'hn__caption', style: 'opacity: 0;' });

    var micBtn = h('button', { type: 'button', class: 'hn__chatMic', title: 'Speak to Hannah', html: MIC });
    var textInput = h('input', { type: 'text', class: 'hn__chatInput', placeholder: 'Ask Hannah about Nexora or any stage…' });
    var sendBtn = h('button', { type: 'button', class: 'hn__chatSend', title: 'Send message', html: SEND });
    var chatBar = h('div', { class: 'hn__chatBar' }, [micBtn, textInput, sendBtn]);

    var frame = h('div', { class: 'hn__frame' }, [canvas, caption, chatBar, veil]);

    var mic = h('p', { class: 'hn__mic', 'data-state': 'granted' }, [
      h('span', { html: MIC }),
      h('span', { text: 'Free 100% self-hosted AI receptionist. No credits, no API limits.' })
    ]);

    var stage = h('section', { class: 'hn__stage', 'aria-label': 'Hannah 3D Avatar' }, [
      h('div', { class: 'hn__stageHead' }, [
        h('div', { class: 'hn__who' }, [h('strong', { text: 'Hannah' }), h('span', { text: 'AI Receptionist · Zero Credits' })]),
        status
      ]),
      frame,
      mic
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
          h('p', { class: 'hn__fine' }, [h('span', { text: 'Independent AI receptionist powered by Three.js & Web Speech API. Completely free with zero credit restrictions.' })])
        ])
      ])
    ]);

    enter.addEventListener('click', function () { leave(0); });
    skip.addEventListener('click', function () { leave(0); });
    stops.addEventListener('click', function (e) {
      var b = e.target.closest('[data-phase]');
      if (b) {
        var p = Number(b.getAttribute('data-phase'));
        handleUserInput("Explain Stage " + p + ": " + b.textContent.trim(), p);
      }
    });

    sendBtn.addEventListener('click', function () {
      var q = textInput.value;
      if (q && q.trim()) {
        textInput.value = '';
        handleUserInput(q.trim());
      }
    });

    textInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = textInput.value;
        if (q && q.trim()) {
          textInput.value = '';
          handleUserInput(q.trim());
        }
      }
    });

    micBtn.addEventListener('click', function () {
      if (speechEngine) {
        speechEngine.toggleListening();
      }
    });

    return {
      mode: mode, root: root, frame: frame, canvas: canvas, veil: veil,
      status: status, micBtn: micBtn, textInput: textInput, caption: caption,
      leaving: false
    };
  }

  function setStatus(state, text) {
    if (!ui) return;
    ui.status.setAttribute('data-state', state);
    ui.status.lastChild.textContent = text;
  }

  function showCaption(text) {
    if (!ui || !ui.caption) return;
    ui.caption.textContent = text;
    ui.caption.style.opacity = '1';
  }

  function hideCaption() {
    if (!ui || !ui.caption) return;
    ui.caption.style.opacity = '0';
  }

  /* ---------------- User Interaction Flow ---------------- */
  function handleUserInput(query, stagePhase) {
    if (speechEngine) speechEngine.stopSpeaking();
    setStatus('thinking', 'Thinking…');
    if (avatarController) avatarController.setExpression('thinking');

    var reply = KNOWLEDGE.answer(query);
    showCaption(reply);

    setTimeout(function () {
      if (avatarController) avatarController.setExpression('speaking');
      setStatus('speaking', 'Speaking…');
      if (speechEngine) {
        speechEngine.speak(reply, function () {
          setStatus('ready', 'Ready');
          if (avatarController) avatarController.setExpression('idle');
          if (stagePhase) {
            setTimeout(function () { leave(stagePhase); }, 2500);
          }
        });
      }
    }, 400);
  }

  /* ---------------- Three.js 3D Avatar Controller ---------------- */
  function init3DAvatar(canvas, onReady) {
    // Dynamically import Three.js modules
    var script = document.createElement('script');
    script.type = 'module';
    script.textContent = [
      'import * as THREE from "https://unpkg.com/three@0.187.0/build/three.module.js";',
      'import { GLTFLoader } from "https://unpkg.com/three@0.187.0/examples/jsm/loaders/GLTFLoader.js";',
      'window.__setupNexoraHannahAvatar(THREE, GLTFLoader);'
    ].join('\n');

    window.__setupNexoraHannahAvatar = function (THREE, GLTFLoader) {
      var width = canvas.clientWidth || 640;
      var height = canvas.clientHeight || 360;

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 50);
      camera.position.set(0, 1.48, 1.05);
      camera.lookAt(0, 1.43, 0);

      var renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.08;
      } catch (e) {
        console.warn('[Hannah] WebGL fallback:', e);
        onReady();
        return;
      }

      // Studio Lighting
      scene.add(new THREE.AmbientLight(0xfff6ea, 0.95));
      var keyLight = new THREE.DirectionalLight(0xffedd8, 1.75);
      keyLight.position.set(0.65, 2.1, 1.4);
      scene.add(keyLight);
      var fillLight = new THREE.DirectionalLight(0xdce7ff, 0.85);
      fillLight.position.set(-0.75, 1.6, 1.1);
      scene.add(fillLight);
      var rimLight = new THREE.DirectionalLight(0xffdfa8, 1.5);
      rimLight.position.set(0, 2.3, -1.2);
      scene.add(rimLight);

      var headMesh = null, teethMesh = null, neckBone = null, headBone = null;
      var morphDict = {}, currentWeights = {}, targetWeights = {};
      var state = 'idle';

      var loader = new GLTFLoader();
      loader.load(CONFIG.modelUrl, function (gltf) {
        var avatar = gltf.scene;
        avatar.position.set(0, 0, 0);

        avatar.traverse(function (child) {
          if (child.isBone) {
            var n = child.name.toLowerCase();
            if (n.indexOf('neck') !== -1) neckBone = child;
            if (n.indexOf('head') !== -1) headBone = child;
          }
          if (child.isMesh && child.morphTargetDictionary) {
            if (child.name === 'Wolf3D_Head' || child.name.toLowerCase().indexOf('head') !== -1) {
              headMesh = child;
              morphDict = child.morphTargetDictionary;
              Object.keys(morphDict).forEach(function (k) { currentWeights[k] = 0; targetWeights[k] = 0; });
            }
            if (child.name === 'Wolf3D_Teeth' || child.name.toLowerCase().indexOf('teeth') !== -1) teethMesh = child;
          }
          if (child.isMesh && child.material) {
            var nm = child.name.toLowerCase();
            if (nm.indexOf('hair') !== -1) {
              child.material = child.material.clone();
              child.material.color = new THREE.Color('#9f6e3c'); // Caramel hair
              child.material.roughness = 0.58;
            } else if (nm.indexOf('outfit') !== -1 || nm.indexOf('top') !== -1) {
              child.material = child.material.clone();
              child.material.color = new THREE.Color('#f5f2ea'); // Cream knit top
              child.material.roughness = 0.88;
            } else if (nm.indexOf('eye') !== -1 && nm.indexOf('cornea') === -1) {
              child.material = child.material.clone();
              child.material.color = new THREE.Color('#648b6f'); // Hazel-green eyes
            } else if (nm.indexOf('head') !== -1 || nm.indexOf('body') !== -1) {
              child.material = child.material.clone();
              child.material.color = new THREE.Color('#ffe2d1'); // Warm natural skin
            }
          }
        });

        scene.add(avatar);

        function setMorph(name, val) {
          if (morphDict[name] !== undefined) targetWeights[name] = Math.max(0, Math.min(1, val));
        }

        function setExpression(expr) {
          state = expr;
          setMorph('mouthSmileLeft', 0);
          setMorph('mouthSmileRight', 0);
          setMorph('browInnerUp', 0);
          if (expr === 'idle') { setMorph('mouthSmileLeft', 0.22); setMorph('mouthSmileRight', 0.22); }
          else if (expr === 'listening') { setMorph('mouthSmileLeft', 0.25); setMorph('mouthSmileRight', 0.25); setMorph('browInnerUp', 0.2); }
          else if (expr === 'thinking') { setMorph('browInnerUp', 0.25); }
          else if (expr === 'speaking') { setMorph('mouthSmileLeft', 0.25); setMorph('mouthSmileRight', 0.25); }
          else if (expr === 'interrupted') { setMorph('browInnerUp', 0.45); closeMouth(); }
        }

        function setViseme(name, weight, open) {
          var visemes = ['viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD', 'viseme_SS'];
          visemes.forEach(function (v) { setMorph(v, v === name ? weight : 0); });
          if (name === 'viseme_sil') closeMouth();
          else { setMorph('mouthOpen', open * 0.7); setMorph('jawOpen', open * 0.5); }
        }

        function closeMouth() {
          var visemes = ['viseme_aa', 'viseme_E', 'viseme_I', 'viseme_O', 'viseme_U', 'viseme_PP', 'viseme_FF', 'viseme_TH', 'viseme_DD', 'viseme_SS', 'mouthOpen', 'jawOpen'];
          visemes.forEach(function (v) { targetWeights[v] = 0; });
        }

        setExpression('idle');

        var clock = new THREE.Clock();
        var blinkTimer = 0, nextBlink = 3.5, isBlinking = false;

        function animate() {
          requestAnimationFrame(animate);
          var delta = Math.min(clock.getDelta(), 0.1);
          var elapsed = clock.getElapsedTime();

          // Lerp blendshapes
          if (headMesh) {
            var lerpSpeed = 18.0 * delta;
            Object.keys(targetWeights).forEach(function (k) {
              var idx = morphDict[k];
              if (idx !== undefined) {
                var cur = currentWeights[k] || 0;
                var nxt = THREE.MathUtils.lerp(cur, targetWeights[k], Math.min(lerpSpeed, 1.0));
                currentWeights[k] = nxt;
                headMesh.morphTargetInfluences[idx] = nxt;
                if (teethMesh && teethMesh.morphTargetDictionary[k] !== undefined) {
                  teethMesh.morphTargetInfluences[teethMesh.morphTargetDictionary[k]] = nxt;
                }
              }
            });
          }

          // Blinking
          blinkTimer += delta;
          if (!isBlinking && blinkTimer >= nextBlink) { isBlinking = true; blinkTimer = 0; nextBlink = 3.2 + Math.random() * 2.5; }
          if (isBlinking) {
            if (blinkTimer <= 0.15) {
              var b = Math.sin((blinkTimer / 0.15) * Math.PI);
              setMorph('eyeBlinkLeft', b); setMorph('eyeBlinkRight', b);
            } else {
              isBlinking = false;
              setMorph('eyeBlinkLeft', 0); setMorph('eyeBlinkRight', 0);
            }
          }

          // Subtle breathing sway
          if (headBone) {
            var sway = Math.sin(elapsed * 1.5) * 0.012;
            headBone.rotation.x = sway;
          }

          renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', function () {
          var w = canvas.clientWidth, h = canvas.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        });

        avatarController = {
          setExpression: setExpression,
          setViseme: setViseme,
          closeMouth: closeMouth
        };

        onReady();
      });
    };

    document.head.appendChild(script);
  }

  /* ---------------- Speech & STT Engine ---------------- */
  function initSpeechEngine(onViseme, onInterrupted) {
    var isSpeaking = false;
    var isListening = false;
    var visemeTimer = null;
    var recognition = null;

    var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onspeechstart = function () {
          if (isSpeaking) {
            stopSpeaking();
            onInterrupted();
          }
        };

        recognition.onresult = function (event) {
          if (isSpeaking) {
            stopSpeaking();
            onInterrupted();
          }
          var text = '';
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) text += event.results[i][0].transcript;
          }
          if (text && text.trim()) {
            handleUserInput(text.trim());
          }
        };
      } catch (e) {}
    }

    function stopSpeaking() {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      isSpeaking = false;
      if (visemeTimer) { clearInterval(visemeTimer); visemeTimer = null; }
      onViseme('viseme_sil', 0, 0);
    }

    function speak(text, onDone) {
      if (!('speechSynthesis' in window)) { if (onDone) onDone(); return; }
      stopSpeaking();

      var u = new SpeechSynthesisUtterance(text);
      var voices = window.speechSynthesis.getVoices();
      var female = voices.filter(function (v) { return /samantha|karen|victoria|female/i.test(v.name); })[0] || voices[0];
      if (female) u.voice = female;
      u.rate = 1.0;
      u.pitch = 1.05;

      isSpeaking = true;
      var visemeList = [
        { v: 'viseme_aa', o: 0.7 }, { v: 'viseme_O', o: 0.6 },
        { v: 'viseme_E', o: 0.5 }, { v: 'viseme_I', o: 0.4 },
        { v: 'viseme_PP', o: 0.1 }, { v: 'viseme_TH', o: 0.25 }
      ];
      var idx = 0;
      visemeTimer = setInterval(function () {
        if (!isSpeaking) return;
        var cur = visemeList[idx];
        onViseme(cur.v, 0.75, cur.o);
        idx = (idx + 1) % visemeList.length;
      }, 110);

      u.onend = function () {
        stopSpeaking();
        if (onDone) onDone();
      };
      u.onerror = function () {
        stopSpeaking();
        if (onDone) onDone();
      };

      window.speechSynthesis.speak(u);
    }

    function toggleListening() {
      if (!recognition) return;
      if (isListening) {
        recognition.stop();
        isListening = false;
        if (ui && ui.micBtn) ui.micBtn.classList.remove('is-listening');
      } else {
        stopSpeaking();
        try {
          recognition.start();
          isListening = true;
          if (ui && ui.micBtn) ui.micBtn.classList.add('is-listening');
          setStatus('listening', 'Listening…');
          if (avatarController) avatarController.setExpression('listening');
        } catch (e) {}
      }
    }

    return {
      speak: speak,
      stopSpeaking: stopSpeaking,
      toggleListening: toggleListening
    };
  }

  /* ---------------- Mount Avatar Layer ---------------- */
  function mountAvatar() {
    if (!ui) return;
    setStatus('connecting', 'Loading Hannah 3D…');

    init3DAvatar(ui.canvas, function () {
      ui.frame.classList.add('is-loaded');
      setStatus('ready', 'Ready');

      speechEngine = initSpeechEngine(
        function (viseme, weight, open) {
          if (avatarController) avatarController.setViseme(viseme, weight, open);
        },
        function () {
          setStatus('interrupted', 'Interrupted');
          if (avatarController) avatarController.setExpression('interrupted');
          setTimeout(function () {
            setStatus('listening', 'Listening…');
            if (avatarController) avatarController.setExpression('listening');
          }, 500);
        }
      );

      // Greet the visitor automatically
      setTimeout(function () {
        handleUserInput('', null);
      }, 600);
    });
  }

  /* ---------------- Dismiss / Enter Site ---------------- */
  function leave(phaseNumber) {
    if (!ui || ui.leaving) return;
    ui.leaving = true;
    remember();

    if (speechEngine) speechEngine.stopSpeaking();

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
