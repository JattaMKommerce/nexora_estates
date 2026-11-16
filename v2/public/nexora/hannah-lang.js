/*
 * Hannah's languages. Her knowledge base is in English; for any other language, the visitor's
 * words are translated into English, answered from the knowledge base, and her answer is
 * translated back. Translation and language detection use the browser's own on-device models
 * (Chrome's Translator and Language Detector APIs, Chrome 138+): free, no API key, nothing
 * leaves the device. The first use of a language downloads its model once.
 *
 * Where the browser can't translate a language (other browsers, or a language Chrome doesn't
 * offer yet), Hannah says so politely and continues in English.
 *
 * window.NexoraHannahLang → { list, get(code), detect(text), prepare(code, onProgress),
 *   translate(text, from, to), requested(text) }
 */
(function () {
  'use strict';

  // [code, English name, own name, speech-recognition locale, other names visitors may use]
  var LIST = [
    ['en', 'English', 'English', 'en-IN', 'angrezi inglish'],
    ['hi', 'Hindi', 'हिन्दी', 'hi-IN', 'हिंदी hindhi'],
    ['bn', 'Bengali', 'বাংলা', 'bn-IN', 'bangla'],
    ['te', 'Telugu', 'తెలుగు', 'te-IN', ''],
    ['mr', 'Marathi', 'मराठी', 'mr-IN', ''],
    ['ta', 'Tamil', 'தமிழ்', 'ta-IN', ''],
    ['ur', 'Urdu', 'اردو', 'ur-IN', ''],
    ['gu', 'Gujarati', 'ગુજરાતી', 'gu-IN', ''],
    ['kn', 'Kannada', 'ಕನ್ನಡ', 'kn-IN', 'kanada'],
    ['ml', 'Malayalam', 'മലയാളം', 'ml-IN', ''],
    ['or', 'Odia', 'ଓଡ଼ିଆ', 'or-IN', 'oriya'],
    ['pa', 'Punjabi', 'ਪੰਜਾਬੀ', 'pa-Guru-IN', 'panjabi'],
    ['as', 'Assamese', 'অসমীয়া', 'as-IN', ''],
    ['ne', 'Nepali', 'नेपाली', 'ne-NP', ''],
    ['es', 'Spanish', 'Español', 'es-ES', 'espanol'],
    ['fr', 'French', 'Français', 'fr-FR', 'francais'],
    ['de', 'German', 'Deutsch', 'de-DE', ''],
    ['pt', 'Portuguese', 'Português', 'pt-BR', 'portugues'],
    ['it', 'Italian', 'Italiano', 'it-IT', ''],
    ['nl', 'Dutch', 'Nederlands', 'nl-NL', ''],
    ['ru', 'Russian', 'Русский', 'ru-RU', ''],
    ['uk', 'Ukrainian', 'Українська', 'uk-UA', ''],
    ['pl', 'Polish', 'Polski', 'pl-PL', ''],
    ['tr', 'Turkish', 'Türkçe', 'tr-TR', 'turkce'],
    ['ar', 'Arabic', 'العربية', 'ar-SA', ''],
    ['fa', 'Persian', 'فارسی', 'fa-IR', 'farsi'],
    ['he', 'Hebrew', 'עברית', 'he-IL', ''],
    ['zh', 'Chinese', '中文', 'cmn-Hans-CN', 'mandarin'],
    ['ja', 'Japanese', '日本語', 'ja-JP', ''],
    ['ko', 'Korean', '한국어', 'ko-KR', ''],
    ['id', 'Indonesian', 'Bahasa Indonesia', 'id-ID', ''],
    ['ms', 'Malay', 'Bahasa Melayu', 'ms-MY', ''],
    ['vi', 'Vietnamese', 'Tiếng Việt', 'vi-VN', ''],
    ['th', 'Thai', 'ไทย', 'th-TH', ''],
    ['fil', 'Filipino', 'Filipino', 'fil-PH', 'tagalog'],
    ['sv', 'Swedish', 'Svenska', 'sv-SE', ''],
    ['da', 'Danish', 'Dansk', 'da-DK', ''],
    ['no', 'Norwegian', 'Norsk', 'nb-NO', ''],
    ['fi', 'Finnish', 'Suomi', 'fi-FI', ''],
    ['el', 'Greek', 'Ελληνικά', 'el-GR', ''],
    ['cs', 'Czech', 'Čeština', 'cs-CZ', ''],
    ['ro', 'Romanian', 'Română', 'ro-RO', ''],
    ['hu', 'Hungarian', 'Magyar', 'hu-HU', ''],
    ['bg', 'Bulgarian', 'Български', 'bg-BG', ''],
    ['hr', 'Croatian', 'Hrvatski', 'hr-HR', ''],
    ['sk', 'Slovak', 'Slovenčina', 'sk-SK', ''],
    ['sl', 'Slovenian', 'Slovenščina', 'sl-SI', ''],
    ['lt', 'Lithuanian', 'Lietuvių', 'lt-LT', ''],
    ['sw', 'Swahili', 'Kiswahili', 'sw-KE', '']
  ].map(function (r) { return { code: r[0], name: r[1], own: r[2], speech: r[3], alias: r[4] ? r[4].split(' ') : [] }; });

  var byCode = {};
  LIST.forEach(function (l) { byCode[l.code] = l; });
  // codes the detector may return for our languages
  var ALIAS_CODE = { iw: 'he', nb: 'no', nn: 'no', tl: 'fil', 'zh-Hant': 'zh', 'zh-Latn': 'zh' };

  // writing systems that point to one language on their own
  var SCRIPTS = [
    [/[ঀ-৿]/g, 'bn'], [/[਀-੿]/g, 'pa'], [/[઀-૿]/g, 'gu'], [/[଀-୿]/g, 'or'],
    [/[஀-௿]/g, 'ta'], [/[ఀ-౿]/g, 'te'], [/[ಀ-೿]/g, 'kn'], [/[ഀ-ൿ]/g, 'ml'],
    [/[ऀ-ॿ]/g, 'hi'], [/[؀-ۿ]/g, 'ar'], [/[֐-׿]/g, 'he'], [/[Ѐ-ӿ]/g, 'ru'],
    [/[Ͱ-Ͽ]/g, 'el'], [/[฀-๿]/g, 'th'], [/[가-힣]/g, 'ko'], [/[぀-ヿ]/g, 'ja'],
    [/[一-鿿]/g, 'zh']
  ];

  function fromScript(text) {
    var letters = (text.match(/\p{L}/gu) || []).length;
    if (!letters) return null;
    for (var i = 0; i < SCRIPTS.length; i++) {
      var n = (text.match(SCRIPTS[i][0]) || []).length;
      if (n / letters > 0.4) return SCRIPTS[i][1];
    }
    return null;
  }

  var detector = null, detectorTried = false;
  function getDetector() {
    if (detector || detectorTried || !self.LanguageDetector) return Promise.resolve(detector);
    detectorTried = true;
    return LanguageDetector.availability().then(function (a) {
      if (a === 'unavailable') return null;
      // it downloads only when no translator is waiting for the visitor's click
      if (a !== 'available' && queue.length) { detectorTried = false; return null; }
      return LanguageDetector.create().then(function (d) { detector = d; return d; });
    }).catch(function () { detectorTried = false; return null; });
  }

  /* Which language is this text in? Resolves to one of our codes, or null when unsure. */
  function detect(text, current) {
    var s = fromScript(text);
    // Devanagari is shared by Hindi, Marathi and Nepali; Arabic script by Arabic, Urdu and Persian.
    // Without a detector, text in those scripts keeps the language already chosen.
    var shared = (s === 'hi' && /^(mr|ne)$/.test(current)) || (s === 'ar' && /^(ur|fa)$/.test(current));
    var guess = shared ? current : s;
    if (s && s !== 'hi' && s !== 'ar') return Promise.resolve(s);
    // Latin-script text: a few words are too little to tell English from Spanish or Indonesian
    if (!s && text.trim().split(/\s+/).length < 3) return Promise.resolve(null);
    return getDetector().then(function (d) {
      if (!d) return guess;
      return d.detect(text).then(function (res) {
        var top = res && res[0];
        if (!top || top.confidence < 0.55) return guess;
        var c = ALIAS_CODE[top.detectedLanguage] || top.detectedLanguage.split('-')[0];
        return byCode[c] ? c : guess;
      });
    }).catch(function () { return guess; });
  }

  /* On-device translators, one per direction ("hi>en" understands Hindi, "en>hi" replies in it).
     The first use of a language downloads its model, and Chrome allows only one download per
     click or key press. So wanted translators wait in a queue, and every click or key press
     inside Hannah (gesture()) starts the next one; typing a message is plenty of key presses. */
  var made = {};      // key → translator
  var making = {};    // key → promise while being made
  var queue = [];     // keys waiting for a click or key press

  function make(key, onProgress) {
    if (made[key]) return Promise.resolve(made[key]);
    if (making[key]) return making[key];
    if (!self.Translator) return Promise.resolve(null);
    var pair = key.split('>');
    var p = Translator.availability({ sourceLanguage: pair[0], targetLanguage: pair[1] }).then(function (a) {
      if (a === 'unavailable') { unsupported[key] = true; return null; }
      return Translator.create({
        sourceLanguage: pair[0], targetLanguage: pair[1],
        monitor: function (m) {
          m.addEventListener('downloadprogress', function (e) { (onProgress || progress)(e.loaded, pair); });
        }
      });
    }).then(function (t) {
      delete making[key];
      if (t) { made[key] = t; queue = queue.filter(function (k) { return k !== key; }); }
      return t;
    }, function (e) {
      delete making[key];   // usually "needs a user gesture": it stays queued for the next one
      return null;
    });
    making[key] = p;
    return p;
  }
  var unsupported = {};
  var progress = function () {};

  function want(code) {
    if (code === 'en') return;
    [code + '>en', 'en>' + code].forEach(function (k) {
      if (!made[k] && !unsupported[k] && queue.indexOf(k) < 0) queue.push(k);
    });
  }

  function gesture() {
    if (!self.Translator) return;
    // each click or key press starts the next waiting download; earlier ones keep going meanwhile
    for (var i = 0; i < queue.length; i++) {
      if (!making[queue[i]] && !made[queue[i]]) { make(queue[i]); return; }
    }
  }

  function ready(from, to) { return from === to || !!made[from + '>' + to]; }
  function supported(code) { return !unsupported[code + '>en'] && !unsupported['en>' + code]; }

  /* Try to get a language fully ready now. Resolves { understand, reply }; anything still missing
     stays queued for the visitor's next click or key press. */
  function prepare(code, onProgress) {
    if (code === 'en') return Promise.resolve({ understand: true, reply: true });
    want(code);
    return make(code + '>en', onProgress).then(function (a) {
      return make('en>' + code, onProgress).then(function (b) { return { understand: !!a, reply: !!b }; });
    });
  }

  // names that must stay exactly as on the website (buttons, brand, email) when she translates
  var KEEP = ['Book a Demo', 'Talk to Hannah', 'Skip Introduction', 'Enter Site', 'Log in', 'Sign up',
    'Jatta M Kommerce', 'Nexora'];
  function setKeep(list) { if (list && list.length) KEEP = list.slice().sort(function (a, b) { return b.length - a.length; }); }

  function translate(text, from, to) {
    if (from === to || !text) return Promise.resolve(text);
    var kept = [];
    var src = text;
    if (from === 'en') {
      src = src.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, function (m) { kept.push(m); return 'ZQ' + kept.length; });
      KEEP.forEach(function (k) {
        src = src.split(k).join('\u0000' + k + '\u0000');
      });
      src = src.replace(/\u0000([^\u0000]+)\u0000/g, function (m, k) { kept.push(k); return 'ZQ' + kept.length; });
    }
    return make(from + '>' + to).then(function (t) {
      if (!t) throw new Error('not ready');
      return t.translate(src);
    }).then(function (out) {
      return out.replace(/ZQ(\d+)/g, function (m, n) { return kept[n - 1] || m; });
    });
  }

  /* Which languages can this browser translate at all? (checked once, quietly) */
  function check(code) {
    if (!self.Translator || code === 'en') return Promise.resolve(code === 'en');
    return Promise.all([
      Translator.availability({ sourceLanguage: code, targetLanguage: 'en' }),
      Translator.availability({ sourceLanguage: 'en', targetLanguage: code })
    ]).then(function (a) {
      if (a[0] === 'unavailable') unsupported[code + '>en'] = true;
      if (a[1] === 'unavailable') unsupported['en>' + code] = true;
      return a[0] !== 'unavailable' && a[1] !== 'unavailable';
    }, function () { return false; });
  }

  /* "Can you speak Hindi?", "Tamil please", "हिंदी में बात करो" → the language asked for, or null. */
  function requested(text) {
    var t = ' ' + text.toLowerCase().replace(/[.,!?;:"'()]/g, ' ').replace(/\s+/g, ' ') + ' ';
    var words = t.trim().split(' ').length;
    var asking = /\b(speak|talk|reply|answer|respond|switch|change|use|language|in|please|can you|do you know)\b|में|बात|मे/.test(t);
    for (var i = 0; i < LIST.length; i++) {
      var l = LIST[i];
      var names = [l.name.toLowerCase(), l.own.toLowerCase()].concat(l.alias);
      for (var j = 0; j < names.length; j++) {
        var n = names[j];
        if (n && t.indexOf(' ' + n + ' ') >= 0 && (asking || words <= 2)) return l.code;
      }
    }
    return null;
  }

  /* While the visitor types: if the letters show another language, queue it so their key
     presses can download it before they press send. */
  function noticeTyping(text, current) {
    var g = text ? fromScript(text) : null;
    if (g && g !== current && !(g === 'hi' && /^(mr|ne)$/.test(current)) && !(g === 'ar' && /^(ur|fa)$/.test(current))) want(g);
  }

  window.NexoraHannahLang = {
    list: LIST,
    want: want,
    gesture: gesture,
    ready: ready,
    check: check,
    supported: supported,
    noticeTyping: noticeTyping,
    setKeep: setKeep,
    onProgress: function (fn) { progress = fn; },
    get: function (code) { return byCode[code] || byCode.en; },
    detect: detect,
    prepare: prepare,
    translate: translate,
    requested: requested,
    canTranslate: function () { return !!self.Translator; }
  };
})();
