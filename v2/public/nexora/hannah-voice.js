/*
 * Hannah's voice and ears, using the browser's own speech services (no API keys, no cost).
 *
 * Speaking: the Web Speech API reads her reply aloud, one sentence at a time. Lip sync comes
 * from the words she is actually saying: each word is turned into a sequence of mouth shapes
 * (visemes) by spelling rules, laid out on a timeline, and that timeline is locked to the voice:
 *   - it starts on the voice's 'start' event and stops on 'end',
 *   - every 'boundary' (word) event re-anchors the timeline to that exact word and corrects
 *     the speaking rate, so the mouth stays on the word being heard,
 *   - voices that give no word events (some network voices) use a rate learned from the
 *     sentences already spoken.
 * mouth(now) returns the shape for the face; progress() tells the transcript how much to show.
 *
 * Listening: SpeechRecognition (Chrome, Edge, Safari) turns the visitor's speech into text.
 *
 * window.NexoraHannahVoice(config) → { speak, cancel, mouth, progress, speaking, listener, ... }
 */
(function () {
  'use strict';

  // mouth shapes: jaw open, lips closed, lips rounded, lips spread (0..1)
  // Consonants bring the lips together (most of the way, or fully for m, b, p); vowels open the
  // jaw. That open-close beat per syllable is what makes speech readable on the lips.
  var VIS = {
    sil: [0, 0, 0, 0],
    PP: [0, 0.95, 0, 0],
    FF: [0.05, 0.75, 0, 0.1],
    TH: [0.1, 0.35, 0, 0.1],
    DD: [0.1, 0.45, 0, 0.12],
    kk: [0.15, 0.25, 0, 0.05],
    CH: [0.1, 0.35, 0.4, 0],
    SS: [0.05, 0.5, 0, 0.3],
    RR: [0.1, 0.25, 0.35, 0],
    aa: [0.45, 0, 0, 0.1],
    E: [0.3, 0, 0, 0.25],
    I: [0.15, 0, 0, 0.35],
    O: [0.35, 0, 0.45, 0],
    U: [0.2, 0.08, 0.55, 0]
  };
  // small words are said lightly; the words that carry meaning get the full movement
  var LIGHT = /^(a|an|the|to|of|and|or|in|on|at|for|is|it|its|i|im|you|we|be|as|by|with|that|this|your|our|are|can|so|if|but|me|my|do|from|has|have|will|was|were|there|their|them|they|he|she|his|her|not|no|yes|all|any|up|out|into|about|than|then|just|also|very|more|most|some|each|every|which|what|when|where|who|how|would|could|should|may|might|shall|been|being|am|did|does|let|lets|here|now)$/i;
  var LEAD_MS = 60; // lips move slightly before the sound is heard, as in real speech

  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function numWords(n) {
    n = Math.floor(n);
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
    if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numWords(n % 100) : '');
    if (n < 1e6) return numWords(n / 1000) + ' thousand' + (n % 1000 ? ' ' + numWords(n % 1000) : '');
    return 'many';
  }

  // English spelling → mouth shapes with relative durations. Not a dictionary, but every word
  // gets the closures (m, b, p), lip-teeth (f, v), roundings (oo, w) and openings (a, o) it has.
  function wordShapes(word) {
    var w = word.toLowerCase().replace(/[^a-z]/g, '');
    var out = [];
    function push(v, d) {
      var last = out[out.length - 1];
      if (last && last[0] === v) last[1] += d * 0.5; else out.push([v, d]);
    }
    var n = w.length;
    if (n > 2 && w[n - 1] === 'e' && !/[aeiouy]/.test(w[n - 2]) && /[aeiouy]/.test(w.slice(0, n - 2))) { w = w.slice(0, n - 1); n--; }
    var i = 0;
    while (i < n) {
      var c = w[i], two = w.substr(i, 2), three = w.substr(i, 3);
      if (three === 'igh') { push('aa', 0.9); push('I', 0.5); i += 3; continue; }
      if (three === 'tch') { push('CH', 0.7); i += 3; continue; }
      if (three === 'tio' || three === 'sio') { push('CH', 0.7); i += 2; continue; }
      var hit = true;
      switch (two) {
        case 'th': push('TH', 0.6); break;
        case 'sh': case 'ch': push('CH', 0.7); break;
        case 'ph': push('FF', 0.65); break;
        case 'wh': push('U', 0.5); break;
        case 'ng': push('kk', 0.55); break;
        case 'ck': push('kk', 0.6); break;
        case 'qu': push('kk', 0.5); push('U', 0.4); break;
        case 'gh': break;
        case 'oo': push('U', 1); break;
        case 'ee': case 'ea': case 'ie': push('I', 1); break;
        case 'ai': case 'ay': case 'ei': case 'ey': push('E', 0.8); push('I', 0.4); break;
        case 'oa': push('O', 1); break;
        case 'ow': case 'ou': push('aa', 0.6); push('U', 0.6); break;
        case 'oi': case 'oy': push('O', 0.6); push('I', 0.5); break;
        case 'au': case 'aw': push('O', 1); break;
        case 'er': case 'ir': case 'ur': push('RR', 0.9); break;
        case 'ar': push('aa', 0.9); push('RR', 0.35); break;
        case 'or': push('O', 0.8); push('RR', 0.35); break;
        default: hit = false;
      }
      if (hit) { i += 2; continue; }
      if (i + 1 < n && c === w[i + 1] && !/[aeiou]/.test(c)) { i++; continue; }
      switch (c) {
        case 'a': push('aa', 1); break;
        case 'e': push('E', 0.9); break;
        case 'i': push('I', 0.9); break;
        case 'o': push('O', 1); break;
        case 'u': push('aa', 0.8); break;
        case 'y': push('I', 0.8); break;
        case 'b': case 'm': case 'p': push('PP', 0.75); break;
        case 'f': case 'v': push('FF', 0.65); break;
        case 't': case 'd': case 'n': case 'l': push('DD', 0.55); break;
        case 'k': case 'g': case 'q': push('kk', 0.6); break;
        case 'c': push(/[eiy]/.test(w[i + 1] || '') ? 'SS' : 'kk', 0.6); break;
        case 'x': push('kk', 0.4); push('SS', 0.5); break;
        case 's': case 'z': push('SS', 0.6); break;
        case 'j': push('CH', 0.65); break;
        case 'r': push('RR', 0.55); break;
        case 'w': push('U', 0.6); break;
        // h takes the shape of the vowel after it
      }
      i++;
    }
    return out;
  }

  /* Other writing systems ------------------------------------------------------------------ */

  // Indian scripts (Devanagari, Bengali, Gurmukhi, Gujarati, Odia, Tamil, Telugu, Kannada,
  // Malayalam) share one layout inside their Unicode blocks, so one table reads them all:
  // consonants by their place in the block, vowels from the vowel signs that follow them.
  function indicShapes(word) {
    var out = [];
    function push(v, d) { var l = out[out.length - 1]; if (l && l[0] === v) l[1] += d * 0.5; else out.push([v, d]); }
    var VOWEL = {
      0x3E: 'aa', 0x3F: 'I', 0x40: 'I', 0x41: 'U', 0x42: 'U', 0x43: 'RR', 0x44: 'RR', 0x45: 'E', 0x46: 'E', 0x47: 'E',
      0x48: 'E', 0x49: 'O', 0x4A: 'O', 0x4B: 'O', 0x4C: 'O', 0x62: 'RR', 0x63: 'RR'
    };
    var cps = Array.from(word);
    for (var i = 0; i < cps.length; i++) {
      var cp = cps[i].codePointAt(0);
      if (cp < 0x0900 || cp > 0x0D7F) continue;
      var o = cp & 0x7F;
      if (o >= 0x05 && o <= 0x14) {                       // a vowel on its own
        push(o <= 0x06 ? 'aa' : o <= 0x08 ? 'I' : o <= 0x0A ? 'U' : o <= 0x0C ? 'RR' : o <= 0x10 ? 'E' : 'O', 0.9);
      } else if ((o >= 0x15 && o <= 0x39) || (o >= 0x58 && o <= 0x5F)) {   // a consonant
        var c = o >= 0x58 ? 0x15 : o;
        push(c <= 0x19 ? 'kk' : c <= 0x1D ? 'CH' : c <= 0x29 ? 'DD' : c <= 0x2E ? 'PP' : c === 0x2F ? 'I' :
          c <= 0x31 ? 'RR' : c <= 0x34 ? 'DD' : c === 0x35 ? 'FF' : c <= 0x37 ? 'CH' : c === 0x38 ? 'SS' : 'kk', c === 0x39 ? 0.3 : 0.6);
        var nx = cps[i + 1] ? cps[i + 1].codePointAt(0) & 0x7F : -1;
        if (cps[i + 1] && (cps[i + 1].codePointAt(0) >> 7) === (cp >> 7) && nx === 0x3C) { i++; nx = cps[i + 1] ? cps[i + 1].codePointAt(0) & 0x7F : -1; }
        if (VOWEL[nx]) { push(VOWEL[nx], 0.9); i++; }
        else if (nx !== 0x4D && i < cps.length - 1) push('aa', 0.6);   // the built-in short "a"
        else if (nx === 0x4D) i++;
      } else if (o >= 0x01 && o <= 0x03) {
        push('DD', 0.3);                                     // nasal and breath marks
      } else if (VOWEL[o]) {
        push(VOWEL[o], 0.9);
      }
    }
    return out;
  }

  var CYR = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'ґ': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'є': 'ye', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  var ARB = {
    'ا': 'aa', 'آ': 'aa', 'أ': 'a', 'إ': 'i', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ٹ': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h',
    'خ': 'k', 'د': 'd', 'ڈ': 'd', 'ذ': 'z', 'ر': 'r', 'ڑ': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
    'ظ': 'z', 'ع': 'a', 'غ': 'g', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ں': 'n', 'ه': 'h',
    'ھ': 'h', 'ة': 'a', 'و': 'o', 'ي': 'i', 'ی': 'i', 'ى': 'a', 'ے': 'e', 'ئ': 'i', 'ؤ': 'o', 'ء': ''
  };
  // Hangul syllables: the vowel inside each syllable, and whether it starts with m, b or p
  var HANGUL_V = ['aa', 'E', 'aa', 'E', 'O', 'E', 'O', 'E', 'O', 'aa', 'E', 'E', 'O', 'U', 'O', 'E', 'I', 'U', 'U', 'I', 'I'];

  function shapesFor(word, lang) {
    var cp = word.codePointAt(0);
    if (/[ऀ-ൿ]/.test(word)) return indicShapes(word);
    if (/[Ѐ-ӿ]/.test(word)) return wordShapes(word.toLowerCase().split('').map(function (c) { return CYR[c] != null ? CYR[c] : c; }).join(''));
    if (/[؀-ۿ]/.test(word)) {
      // Arabic script rarely writes short vowels: give each consonant pair a short "a" between them
      var lat = '', prevC = false;
      Array.from(word).forEach(function (c) {
        var t = ARB[c]; if (t == null) return;
        var vowel = /^[aeiou]/.test(t);
        if (prevC && !vowel && t) lat += 'a';
        lat += t; prevC = !!t && !vowel;
      });
      return wordShapes(lat);
    }
    if (/[가-힣]/.test(word)) {
      var out = [];
      Array.from(word).forEach(function (c) {
        var k = c.codePointAt(0) - 0xAC00;
        if (k < 0 || k > 11171) return;
        var ini = Math.floor(k / 588), med = Math.floor((k % 588) / 28);
        out.push([ini === 6 || ini === 7 || ini === 8 || ini === 17 ? 'PP' : ini === 9 || ini === 10 ? 'SS' : 'DD', 0.5]);
        out.push([HANGUL_V[med] || 'aa', 0.9]);
      });
      return out;
    }
    if (/[A-Za-zÀ-ɏ]/.test(word)) return wordShapes(word.normalize('NFD').replace(/[̀-ͯ]/g, ''));
    // Chinese, Japanese, Thai and others: one light consonant and an open vowel per character
    var gen = [], cycle = ['aa', 'E', 'O', 'I', 'U'];
    Array.from(word).forEach(function (c, n) {
      var h = c.codePointAt(0);
      gen.push([h % 7 === 0 ? 'PP' : 'DD', 0.4]);
      gen.push([cycle[(h + n) % cycle.length], 0.8]);
    });
    return gen;
  }

  // a timeline for one spoken chunk: segments of mouth shapes in "units", words with char offsets
  function timeline(text, lang) {
    var segs = [], words = [], u = 0, en = !lang || lang === 'en';
    var re = /([\p{L}\p{M}']+)|(\d+)|([,;:—–،、，]|\s-\s)|([.!?।॥。！？؟])/gu, m;
    while ((m = re.exec(text))) {
      if (m[1] || m[2]) {
        var raw = m[1] || m[2];
        var light = en && LIGHT.test(raw.replace(/'/g, ''));
        var len = Array.from(raw).length;
        var amp = light ? 0.55 : (len >= 6 ? 1 : 0.85);
        var stress = !light && len >= 6;
        var wi = words.length;
        var shapes = [];
        if (m[2]) {
          if (en) numWords(Number(m[2])).split(' ').forEach(function (p) { shapes = shapes.concat(wordShapes(p)); });
          else for (var d = 0; d < raw.length; d++) shapes.push(['DD', 0.4], ['aa', 0.7]);
        } else {
          shapes = en ? wordShapes(raw) : shapesFor(raw, lang);
        }
        words.push({ ci: m.index, u: u });
        shapes.forEach(function (sh) { segs.push({ v: sh[0], a: u, b: u + sh[1], amp: amp, w: wi, stress: stress }); u += sh[1]; });
        segs.push({ v: 'sil', a: u, b: u + 0.12, amp: 1, w: wi }); u += 0.12;
      } else if (m[3]) {
        segs.push({ v: 'sil', a: u, b: u + 1.8, amp: 1, w: -1 }); u += 1.8;
      } else if (m[4]) {
        segs.push({ v: 'sil', a: u, b: u + 1.2, amp: 1, w: -1 }); u += 1.2;
      }
    }
    return { segs: segs, words: words, units: Math.max(u, 0.5), chars: text.length };
  }

  function sentences(text) {
    var out = [];
    (text.match(/[^.!?\u0964\u3002\uFF01\uFF1F\u061F]+[.!?\u0964\u3002\uFF01\uFF1F\u061F]*["')\]]*\s*/g) || [text]).forEach(function (s) {
      s = s.trim();
      if (!s) return;
      // long sentences are split at commas: some voices stop after about 15 seconds
      while (s.length > 190) {
        var cut = s.lastIndexOf(', ', 170);
        if (cut < 60) break;
        out.push(s.slice(0, cut + 1));
        s = s.slice(cut + 2);
      }
      out.push(s);
    });
    return out;
  }

  function Voice(cfg) {
    cfg = cfg || {};
    this.cfg = cfg;
    this.synth = window.speechSynthesis || null;
    this.muted = false;
    this.voice = null;
    this.lang = 'en';           // the language she is speaking
    this.cpsBy = {};            // characters per second for each language, learned as she speaks
    this.voices = {};           // the voice chosen for each language (kept once she has used it)
    this.job = null;
    this.simulate = !!cfg.simulate;
    var self = this;
    if (this.synth) {
      this.pickVoice();
      if (this.synth.addEventListener) this.synth.addEventListener('voiceschanged', function () { self.pickVoice(); });
    }
  }

  Voice.prototype.available = function () {
    if (this.simulate) return true;
    if (!(this.synth && window.SpeechSynthesisUtterance)) return false;
    // another language needs a voice that can read it; English can use the browser's default
    return this.lang === 'en' || !!this.voice;
  };

  // languages without their own voice that a related voice reads well (same script)
  var VOICE_FALLBACK = { mr: 'hi', ne: 'hi', sa: 'hi', as: 'bn', no: 'nb', nb: 'no', fil: 'tl', ms: 'id' };

  Voice.prototype.setLanguage = function (lang, locale) {
    this.lang = lang || 'en';
    this.listener.lang = locale || (this.lang === 'en' ? (this.cfg.recognitionLanguage || 'en-IN') : this.lang);
    this.voice = this.voices[this.lang] || null;
    if (!this.voice) this.pickVoice();
  };
  Voice.prototype.hasVoice = function () { return this.lang === 'en' || !!this.voice; };

  Voice.prototype.pickVoice = function () {
    if (this.voices[this.lang]) { this.voice = this.voices[this.lang]; return; } // once used, her voice stays the same
    var list = (this.synth && this.synth.getVoices()) || [];
    if (!list.length) return;
    if (this.lang !== 'en') {
      var lang = this.lang, female = /female|woman|lekha|vani|veena|kanya|google|amélie|amelie|anna|alice|milena|monica|paulina|luciana|joana|ellen|zosia|yelda|lesya|linh|damayanti|amira|majed|carmit|melina|sara|alva|nora|satu|ioana|laura|tina|lana|tünde|daria|zuzana|kyoko|yuna|tingting|meijia/i;
      var find = function (code) {
        var m = list.filter(function (v) { return v.lang.toLowerCase().replace('_', '-').split('-')[0] === code; });
        return m.filter(function (v) { return female.test(v.name); })[0] || m[0] || null;
      };
      this.voice = find(lang) || (VOICE_FALLBACK[lang] ? find(VOICE_FALLBACK[lang]) : null);
      return;
    }
    var prefs = this.cfg.preferredVoices || [];
    var pick = null;
    for (var i = 0; i < prefs.length && !pick; i++) {
      for (var j = 0; j < list.length; j++) {
        if (list[j].name.indexOf(prefs[i]) === 0 && /^en/i.test(list[j].lang)) { pick = list[j]; break; }
      }
    }
    if (!pick) {
      var female = /female|woman|samantha|karen|moira|tessa|serena|victoria|fiona|aria|jenny|sonia|libby|natasha|zira|susan|hazel|veena|heera|neerja/i;
      pick = list.filter(function (v) { return /^en/i.test(v.lang) && female.test(v.name); })[0] ||
        list.filter(function (v) { return /^en[-_](GB|US|IN|AU)/i.test(v.lang); })[0] ||
        list.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
    }
    this.voice = pick;
  };

  Voice.prototype.sayable = function (text) {
    if (this.lang !== 'en') return text.replace(/([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+)\.([a-z]{2,})/g, '$1 @ $2 . $3');
    var map = this.cfg.sayAs || {};
    Object.keys(map).forEach(function (k) { text = text.split(k).join(map[k]); });
    return text
      .replace(/([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+)\.([a-z]{2,})/g, '$1 at $2 dot $3')
      .replace(/\s*&\s*/g, ' and ')
      .replace(/(\d)\+/g, '$1 plus');
  };

  /*
   * speak(text, { onStart, onEnd(ok), onBlocked }) → Promise
   * onBlocked fires when the browser refuses to speak before the visitor has interacted.
   */
  Voice.prototype.speak = function (text, cb) {
    cb = cb || {};
    this.cancel();
    var self = this;
    var chunks = sentences(this.sayable(text));
    var total = chunks.reduce(function (a, c) { return a + c.length; }, 0) || 1;
    var job = { chunks: chunks, i: 0, done: 0, total: total, cur: null, ended: false, started: false, cb: cb };
    this.job = job;

    return new Promise(function (resolve) {
      job.resolve = resolve;
      if (self.muted || !self.available()) { finish(true); return; }
      // the browser loads its voice list late: wait briefly so she speaks in one voice throughout
      if (!self.simulate && !self.voice && self.synth && !self.synth.getVoices().length) {
        var waited = false, go = function () {
          if (waited) return;
          waited = true;
          self.pickVoice();
          next();
        };
        if (self.synth.addEventListener) self.synth.addEventListener('voiceschanged', go, { once: true });
        setTimeout(go, 1200);
        return;
      }
      if (!self.voice) self.pickVoice();
      next();
    });

    function finish(ok) {
      if (job.ended) return;
      job.ended = true;
      job.cur = null;
      if (self.job === job) self.job = null;
      clearTimeout(job.watch);
      if (cb.onEnd) cb.onEnd(ok);
      job.resolve(ok);
    }

    function next() {
      if (job.ended || self.job !== job) return;
      if (job.i >= chunks.length) { finish(true); return; }
      var text = chunks[job.i];
      var tl = timeline(text, self.lang);
      var cps = self.cps();
      // Chinese, Japanese and Korean pack a syllable into each character
      if (!self.cpsBy[self.lang] && /[\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7A3]/.test(text)) cps = 5.5;
      var cur = { text: text, tl: tl, anchorU: 0, anchorT: 0, unitMs: (text.length / cps) * 1000 / tl.units, on: false, lastB: null, t0: 0 };
      job.cur = cur;

      var begin = function () {
        if (cur.on) return;
        cur.on = true;
        cur.t0 = cur.anchorT = performance.now();
        if (self.voice) self.voices[self.lang] = self.voice;
        if (!job.started) { job.started = true; if (cb.onStart) cb.onStart(); }
      };
      var end = function () {
        if (job.cur !== cur || job.ended) return;
        var dur = performance.now() - cur.t0;
        // learn how fast this voice speaks (ignore chunks too short to measure)
        if (cur.on && dur > 600 && text.length > 4) self.cpsBy[self.lang] = cps * 0.6 + (text.length / (dur / 1000)) * 0.4;
        job.done += text.length;
        job.i++;
        next();
      };

      if (self.simulate) {
        begin();
        job.watch = setTimeout(end, (text.length / cps) * 1000);
        return;
      }

      var u = new SpeechSynthesisUtterance(text);
      if (self.voice) { u.voice = self.voice; u.lang = self.voice.lang; } else u.lang = 'en-GB';
      u.rate = self.cfg.rate || 1;
      u.pitch = self.cfg.pitch || 1;
      u.onstart = begin;
      u.onboundary = function (e) {
        if (job.cur !== cur || (e.name && e.name !== 'word')) return;
        if (!cur.on) begin();

        var now = performance.now();
        var words = cur.tl.words;
        if (!words.length) return;

        var elapsed = Number(e.elapsedTime);
        var boundaryTime = Number.isFinite(elapsed) && elapsed >= 0
          ? cur.t0 + elapsed * 1000
          : now;

        var charIndex = Number.isFinite(e.charIndex) ? e.charIndex : 0;
        var wi = 0;

        for (var k = 0; k < words.length; k++) {
          if (words[k].ci <= charIndex) wi = k;
          else break;
        }

        var w = words[wi];

        if (cur.lastB && w.u > cur.lastB.u) {
          var measured = (boundaryTime - cur.lastB.t) / (w.u - cur.lastB.u);

          if (measured > cur.unitMs * 0.4 && measured < cur.unitMs * 2.5) {
            cur.unitMs = cur.unitMs * 0.5 + measured * 0.5;
          }
        }

        cur.lastB = { u: w.u, t: boundaryTime };
        cur.anchorU = w.u;
        cur.anchorT = boundaryTime;
      };
      u.onend = end;
      u.onerror = function (e) {
        if (job.cur !== cur) return;
        if (e.error === 'not-allowed' && !job.started) {
          // the browser wants a click first; the caller retries after one
          finish(false);
          if (cb.onBlocked) cb.onBlocked();
          return;
        }
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        end();
      };
      self.synth.speak(u);
      // if the voice never starts (no voices installed, stuck engine), carry on in text
      clearTimeout(job.watch);
      job.watch = setTimeout(function () {
        if (job.cur === cur && !cur.on) { self.synth.cancel(); finish(false); }
        else if (job.cur === cur) {
          job.watch = setTimeout(function () { if (job.cur === cur) { self.synth.cancel(); end(); } }, (text.length / cps) * 2500 + 4000);
        }
      }, 5000);
    }
  };

  Voice.prototype.cps = function () { return this.cpsBy[this.lang] || (this.lang === 'en' ? 14.5 : 13); };

  Voice.prototype.cancel = function () {
    var job = this.job;
    this.job = null;
    if (this.synth && !this.simulate) { try { this.synth.cancel(); } catch (e) { /* ignore */ } }
    if (job && !job.ended) {
      job.ended = true;
      clearTimeout(job.watch);
      if (job.cb.onEnd) job.cb.onEnd(false);
      job.resolve(false);
    }
  };

  Voice.prototype.speaking = function () { return !!(this.job && this.job.cur && this.job.cur.on); };

  // where the voice is in the current sentence, in timeline units. If the voice is still talking
  // when the estimate runs out (a slower voice without word events), the last words are
  // stretched instead of the mouth stopping early.
  function position(cur, now) {
    var pos = cur.anchorU + (now - cur.anchorT) / cur.unitMs;
    var soft = cur.tl.units * 0.9;
    if (pos > soft && !cur.lastB) {
      var over = pos - soft, room = cur.tl.units - soft;
      pos = soft + room * (1 - Math.exp(-over / room));
    }
    return pos;
  }

  // the mouth shape for "now", with a short blend into the next shape (coarticulation)
  Voice.prototype.mouth = function (now) {
    var job = this.job, cur = job && job.cur;
    if (!cur || !cur.on) return null;
    var pos = position(cur, now + LEAD_MS);
    var segs = cur.tl.segs;
    if (pos >= cur.tl.units || !segs.length) return { jaw: 0, close: 0, round: 0, wide: 0 };
    var k = 0;
    while (k < segs.length - 1 && segs[k].b <= pos) k++;
    var s = segs[k], a = VIS[s.v], nx = segs[k + 1] ? VIS[segs[k + 1].v] : VIS.sil;
    var f = (pos - s.a) / Math.max(0.01, s.b - s.a);
    // ease into the next sound over the second half of this one (coarticulation)
    var t = f < 0.45 ? 0 : (f - 0.45) / 0.55;
    t = t * t * (3 - 2 * t) * 0.7;
    var amp = s.amp || 1;
    return {
      jaw: (a[0] + (nx[0] - a[0]) * t) * amp,
      close: a[1] + (nx[1] - a[1]) * t,
      round: (a[2] + (nx[2] - a[2]) * t) * amp,
      wide: (a[3] + (nx[3] - a[3]) * t) * amp,
      // where she is in the reply, for natural head and brow movement
      sentence: job.i, word: s.w, stress: !!s.stress
    };
  };

  // how much of the reply has been spoken (0..1), for the live transcript
  Voice.prototype.progress = function (now) {
    var job = this.job;
    if (!job) return 1;
    var cur = job.cur;
    if (!cur || !cur.on) return job.done / job.total;
    var pos = position(cur, now);
    var frac = Math.min(1, pos / cur.tl.units);
    return Math.min(1, (job.done + cur.text.length * frac) / job.total);
  };

  /* Listening -------------------------------------------------------------------------------- */

  function Listener(lang) {
    this.R = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    this.lang = lang || 'en-IN';
    this.rec = null;
    this.on = false;
  }
  Listener.prototype.supported = function () { return !!this.R && window.isSecureContext !== false; };

  /* start({ onInterim(text), onFinal(text), onEnd(heardSomething), onError(code) }) */
  Listener.prototype.start = function (cb) {
    if (!this.supported() || this.on) return false;
    var self = this;
    var rec = new this.R();
    rec.lang = this.lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    var finalText = '', heard = false;
    rec.onresult = function (e) {
      var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript; else interim += r[0].transcript;
      }
      heard = true;
      if (interim && cb.onInterim) cb.onInterim((finalText + ' ' + interim).trim());
    };
    rec.onerror = function (e) { if (cb.onError) cb.onError(e.error); };
    rec.onend = function () {
      self.on = false;
      self.rec = null;
      var t = finalText.trim();
      if (t && cb.onFinal) cb.onFinal(t);
      if (cb.onEnd) cb.onEnd(heard && !!t);
    };
    try { rec.start(); } catch (e) { return false; }
    this.rec = rec;
    this.on = true;
    return true;
  };
  Listener.prototype.stop = function (discard) {
    if (!this.rec) return;
    try { if (discard) this.rec.abort(); else this.rec.stop(); } catch (e) { /* ignore */ }
  };

  window.NexoraHannahVoice = function (cfg) {
    var v = new Voice(cfg);
    v.listener = new Listener(cfg && cfg.recognitionLanguage);
    if (/[?&]hannahdebug\b/.test(location.search)) window.__hannahVoice = v; // for checking timing in the console
    return v;
  };
  window.NexoraHannahVoice.timeline = timeline; // for testing in the console
})();
