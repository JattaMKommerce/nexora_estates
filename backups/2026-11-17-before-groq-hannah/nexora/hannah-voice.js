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
  var VIS = {
    sil: [0, 0.12, 0, 0],
    PP: [0.02, 1, 0, 0],
    FF: [0.08, 0.45, 0, 0.1],
    TH: [0.2, 0, 0, 0.1],
    DD: [0.26, 0, 0, 0.15],
    kk: [0.3, 0, 0, 0.05],
    CH: [0.2, 0, 0.55, 0],
    SS: [0.12, 0.05, 0, 0.45],
    RR: [0.22, 0, 0.4, 0],
    aa: [0.9, 0, 0, 0.1],
    E: [0.55, 0, 0, 0.45],
    I: [0.28, 0, 0, 0.7],
    O: [0.62, 0, 0.65, 0],
    U: [0.25, 0, 1, 0]
  };

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

  // a timeline for one spoken chunk: segments of mouth shapes in "units", words with char offsets
  function timeline(text) {
    var segs = [], words = [], u = 0;
    var re = /([A-Za-z']+)|(\d+)|([,;:—–]|\s-\s)|([.!?])/g, m;
    while ((m = re.exec(text))) {
      if (m[1] || m[2]) {
        var parts = m[1] ? [m[1]] : numWords(Number(m[2])).split(' ');
        words.push({ ci: m.index, u: u });
        parts.forEach(function (p) {
          wordShapes(p).forEach(function (s) { segs.push({ v: s[0], a: u, b: u + s[1] }); u += s[1]; });
        });
        segs.push({ v: 'sil', a: u, b: u + 0.12 }); u += 0.12;
      } else if (m[3]) {
        segs.push({ v: 'sil', a: u, b: u + 1.8 }); u += 1.8;
      } else if (m[4]) {
        segs.push({ v: 'sil', a: u, b: u + 1.2 }); u += 1.2;
      }
    }
    return { segs: segs, words: words, units: Math.max(u, 0.5), chars: text.length };
  }

  function sentences(text) {
    var out = [];
    (text.match(/[^.!?]+[.!?]*["')\]]*\s*/g) || [text]).forEach(function (s) {
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
    this.cps = 14.5;            // characters per second, learned as she speaks
    this.job = null;
    this.simulate = !!cfg.simulate;
    var self = this;
    if (this.synth) {
      this.pickVoice();
      if (this.synth.addEventListener) this.synth.addEventListener('voiceschanged', function () { self.pickVoice(); });
    }
  }

  Voice.prototype.available = function () {
    return this.simulate || !!(this.synth && window.SpeechSynthesisUtterance);
  };

  Voice.prototype.pickVoice = function () {
    if (this.locked) return; // once she has spoken, her voice stays the same
    var list = (this.synth && this.synth.getVoices()) || [];
    if (!list.length) return;
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
      if (!self.simulate && !self.voice && !self.synth.getVoices().length) {
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
      var tl = timeline(text);
      var cur = { text: text, tl: tl, anchorU: 0, anchorT: 0, unitMs: (text.length / self.cps) * 1000 / tl.units, on: false, lastB: null, t0: 0 };
      job.cur = cur;

      var begin = function () {
        if (cur.on) return;
        cur.on = true;
        cur.t0 = cur.anchorT = performance.now();
        if (self.voice) self.locked = true;
        if (!job.started) { job.started = true; if (cb.onStart) cb.onStart(); }
      };
      var end = function () {
        if (job.cur !== cur || job.ended) return;
        var dur = performance.now() - cur.t0;
        // learn how fast this voice speaks (ignore chunks too short to measure)
        if (cur.on && dur > 600 && text.length > 12) self.cps = self.cps * 0.6 + (text.length / (dur / 1000)) * 0.4;
        job.done += text.length;
        job.i++;
        next();
      };

      if (self.simulate) {
        begin();
        job.watch = setTimeout(end, (text.length / self.cps) * 1000);
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
        var now = performance.now(), words = cur.tl.words, wi = 0;
        for (var k = 0; k < words.length; k++) { if (words[k].ci <= e.charIndex) wi = k; else break; }
        var w = words[wi];
        if (cur.lastB && w.u > cur.lastB.u) {
          var measured = (now - cur.lastB.t) / (w.u - cur.lastB.u);
          if (measured > cur.unitMs * 0.4 && measured < cur.unitMs * 2.5) cur.unitMs = cur.unitMs * 0.5 + measured * 0.5;
        }
        cur.lastB = { u: w.u, t: now };
        cur.anchorU = w.u;
        cur.anchorT = now;
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
          job.watch = setTimeout(function () { if (job.cur === cur) { self.synth.cancel(); end(); } }, (text.length / self.cps) * 2500 + 4000);
        }
      }, 5000);
    }
  };

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
    var pos = position(cur, now);
    var segs = cur.tl.segs;
    if (pos >= cur.tl.units || !segs.length) return { jaw: 0, close: 0.1, round: 0, wide: 0 };
    var k = 0;
    while (k < segs.length - 1 && segs[k].b <= pos) k++;
    var s = segs[k], a = VIS[s.v], nx = segs[k + 1] ? VIS[segs[k + 1].v] : VIS.sil;
    var f = (pos - s.a) / Math.max(0.01, s.b - s.a);
    var t = f < 0.6 ? 0 : (f - 0.6) / 0.4;
    t = t * t * (3 - 2 * t) * 0.6;
    return {
      jaw: a[0] + (nx[0] - a[0]) * t,
      close: a[1] + (nx[1] - a[1]) * t,
      round: a[2] + (nx[2] - a[2]) * t,
      wide: a[3] + (nx[3] - a[3]) * t
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
