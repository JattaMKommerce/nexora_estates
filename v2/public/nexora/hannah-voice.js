/*
 * Hannah's voice and ears.
 *
 * TWO VOICES
 *   1. Groq (preferred): her replies are sent sentence by sentence to /api/hannah.php, which returns
 *      Groq Orpheus audio (voice "hannah"). The audio is decoded and played through the Web Audio
 *      API, and the lip sync is driven by THE SAME AUDIO CLOCK that plays it, so mouth and sound
 *      cannot drift apart:
 *        - each sentence's spelling becomes a sequence of visemes (aa, E, I, O, U, PP, FF, TH, DD,
 *          kk, CH, SS, RR, sil), stretched onto the phrases actually heard in the audio (found from
 *          its loudness: pauses in the text are matched to pauses in the sound),
 *        - the audio's loudness, low/high frequency balance and stressed syllables are measured
 *          once per sentence (10 ms frames) and drive how far the jaw opens, sibilants, and the
 *          head nods / brow raises on stressed words,
 *        - mouth(now) converts the animation frame's time into audio time with
 *          AudioContext.getOutputTimestamp(), which includes the speakers' output latency.
 *      The next sentence is fetched while the current one plays, and sentences are scheduled
 *      back to back on the audio clock, so there are no gaps or stalls between them.
 *   2. The browser's own Web Speech voice: used when the server is not available (no PHP, no key,
 *      Groq down, rate limited). Its lip sync is estimated from the text and corrected on word
 *      events, as before.
 *
 * mouth(now) → { v: {viseme: weight}, energy (0..1 or null), accent (0..1), question (bool) } | null
 * progress(now) → 0..1 of the reply spoken, for the live transcript.
 *
 * LISTENING: SpeechRecognition (Chrome, Edge, Safari) turns the visitor's speech into text.
 *
 * window.NexoraHannahVoice(config) → { speak, cancel, unlock, mouth, progress, speaking, listener }
 */
(function () {
  'use strict';

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

  /* Text → visemes ----------------------------------------------------------------------------- */

  // English spelling → visemes with relative durations. Not a dictionary, but every word gets the
  // closures (m, b, p), lip-teeth (f, v), roundings (oo, w) and openings (a, o) it has.
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

  var PAUSE_COMMA = 1.8, PAUSE_STOP = 1.2;

  // a timeline for one spoken chunk: viseme segments in "units", words with char offsets, and
  // phrases (stretches between pauses) so they can be matched to the pauses heard in the audio
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
        segs.push({ v: 'sil', a: u, b: u + PAUSE_COMMA, pause: true }); u += PAUSE_COMMA;
      } else if (m[4]) {
        segs.push({ v: 'sil', a: u, b: u + PAUSE_STOP, pause: true }); u += PAUSE_STOP;
      }
    }
    // phrases: [startUnit, endUnit] of speech between pauses
    var phrases = [], ps = null;
    segs.forEach(function (s) {
      if (s.pause) { if (ps != null) { phrases.push([ps, s.a]); ps = null; } }
      else if (ps == null && s.v !== 'sil') ps = s.a;
    });
    if (ps != null) phrases.push([ps, u]);
    return { segs: segs, words: words, units: Math.max(u, 0.5), chars: text.length, phrases: phrases };
  }

  // viseme weights at a timeline position, with coarticulation: near the edges of a segment its
  // neighbour blends in (50/50 exactly at the boundary), so shapes flow into each other and
  // never snap; bilabial closures still reach full closure in their middle
  function weightsAt(segs, pos) {
    var out = {};
    if (!segs.length) { out.sil = 1; return out; }
    var k = 0, n = segs.length;
    while (k < n - 1 && segs[k].b <= pos) k++;
    var s = segs[k], f = (pos - s.a) / Math.max(0.01, s.b - s.a);
    var add = function (v, w) { out[v] = (out[v] || 0) + w; };
    add(s.v, 1);
    var E = 0.35, x;
    if (f < E && k > 0) { x = (E - f) / E; x = x * x * (3 - 2 * x) * 0.5; add(segs[k - 1].v, x); add(s.v, -x); }
    if (f > 1 - E) {
      x = (f - (1 - E)) / E; x = Math.min(1, x); x = x * x * (3 - 2 * x) * 0.5;
      add(k < n - 1 ? segs[k + 1].v : 'sil', x); add(s.v, -x);
    }
    return out;
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

  // chunks for Groq: at most 195 characters (its limit is 200); the first one is kept short so her
  // voice starts quickly while the rest is being generated
  function ttsChunks(text) {
    var out = [];
    sentences(text).forEach(function (s) {
      while (s.length > 195) {
        var cut = s.lastIndexOf(', ', 190);
        if (cut < 40) cut = s.lastIndexOf(' ', 190);
        if (cut < 20) cut = 190;
        out.push(s.slice(0, cut + 1).trim());
        s = s.slice(cut + 1).trim();
      }
      if (s) out.push(s);
    });
    if (out.length && out[0].length > 120) {
      var f = out[0], c = f.indexOf(', ', 35);
      if (c < 0 || c > 110) c = f.lastIndexOf(' ', 90);
      if (c > 25) out.splice(0, 1, f.slice(0, c + 1).trim(), f.slice(c + 1).trim());
    }
    return out;
  }

  /* Audio analysis (once per sentence) --------------------------------------------------------- */

  var FPS = 100; // feature frames per second

  function analyse(buf) {
    var sr = buf.sampleRate, x = buf.getChannelData(0), hop = Math.round(sr / FPS);
    var nF = Math.ceil(x.length / hop);
    var env = new Float32Array(nF), hiR = new Float32Array(nF), loR = new Float32Array(nF);
    // one-pole filters: low band (< ~900 Hz, vowels) and high band (> ~3 kHz, s / sh / f / th)
    var aL = 1 - Math.exp(-2 * Math.PI * 900 / sr), aH = Math.exp(-2 * Math.PI * 3000 / sr);
    var lp = 0, hpPrev = 0, hpOut = 0;
    for (var f = 0; f < nF; f++) {
      var e = 0, el = 0, eh = 0, a = f * hop, b = Math.min(x.length, a + hop);
      for (var i = a; i < b; i++) {
        var s = x[i];
        lp += aL * (s - lp);
        hpOut = aH * (hpOut + s - hpPrev); hpPrev = s;
        e += s * s; el += lp * lp; eh += hpOut * hpOut;
      }
      var n = Math.max(1, b - a);
      env[f] = Math.sqrt(e / n);
      loR[f] = Math.sqrt(el / n);
      hiR[f] = Math.sqrt(eh / n);
    }
    // normalise loudness by the sentence's own loud parts, with a soft knee (perceived openness)
    var sorted = Array.prototype.slice.call(env).sort(function (p, q) { return p - q; });
    var ref = sorted[Math.floor(sorted.length * 0.95)] || 1e-4;
    var floor = Math.max(ref * 0.06, sorted[Math.floor(sorted.length * 0.1)] * 1.5);
    var lvl = new Float32Array(nF), sib = new Float32Array(nF);
    for (f = 0; f < nF; f++) {
      var v = Math.max(0, (env[f] - floor) / Math.max(1e-6, ref - floor));
      lvl[f] = Math.min(1, Math.sqrt(v));
      sib[f] = env[f] > floor ? Math.min(1, Math.max(0, (hiR[f] / (loR[f] + hiR[f] + 1e-6) - 0.25) / 0.5)) : 0;
    }
    // light smoothing (30 ms) so the jaw follows syllables, not every waveform wiggle
    var sm = new Float32Array(nF);
    for (f = 0; f < nF; f++) sm[f] = (lvl[Math.max(0, f - 1)] + lvl[f] * 2 + lvl[Math.min(nF - 1, f + 1)]) / 4;

    // voiced regions: loud enough, joined across short gaps (stops inside words)
    var on = [], start = -1, gap = 0;
    for (f = 0; f < nF; f++) {
      if (sm[f] > 0.1) { if (start < 0) start = f; gap = 0; }
      else if (start >= 0 && ++gap > 16) { on.push([start, f - gap]); start = -1; gap = 0; }
    }
    if (start >= 0) on.push([start, nF - 1 - gap]);
    var voicedStart = on.length ? on[0][0] / FPS : 0;
    var voicedEnd = on.length ? (on[on.length - 1][1] + 1) / FPS : buf.duration;

    // stressed syllables: clear local peaks well above the sentence's average loudness
    var mean = 0, cnt = 0;
    for (f = 0; f < nF; f++) if (sm[f] > 0.1) { mean += sm[f]; cnt++; }
    mean = cnt ? mean / cnt : 0.5;
    var accents = [], last = -1;
    for (f = 3; f < nF - 3; f++) {
      if (sm[f] > mean * 1.3 && sm[f] >= sm[f - 1] && sm[f] >= sm[f + 1] && sm[f] >= sm[f - 3] && sm[f] >= sm[f + 3] &&
          (last < 0 || f - last > 45)) { accents.push(f / FPS); last = f; }
    }
    return { lvl: sm, sib: sib, phrases: on.map(function (p) { return [p[0] / FPS, (p[1] + 1) / FPS]; }),
      voicedStart: voicedStart, voicedEnd: voicedEnd, accents: accents, frames: nF };
  }

  // piecewise-linear map from audio time (s, within the buffer) to timeline units: text phrases are
  // laid onto audio phrases when their counts match, else the whole sentence onto the voiced span
  function alignMap(tl, feat) {
    var A = feat.phrases, T = tl.phrases, pts = [];
    if (A.length && A.length === T.length) {
      for (var i = 0; i < A.length; i++) { pts.push([A[i][0], T[i][0]]); pts.push([A[i][1], T[i][1]]); }
    } else {
      pts.push([feat.voicedStart, T.length ? T[0][0] : 0]);
      pts.push([feat.voicedEnd, T.length ? T[T.length - 1][1] : tl.units]);
    }
    return pts;
  }
  function mapAt(pts, t) {
    if (t <= pts[0][0]) return pts[0][1] - (pts[0][0] - t) * 8; // before speech: a little before the first unit
    for (var i = 1; i < pts.length; i++) {
      if (t <= pts[i][0]) {
        var a = pts[i - 1], b = pts[i], k = (t - a[0]) / Math.max(1e-4, b[0] - a[0]);
        return a[1] + (b[1] - a[1]) * k;
      }
    }
    var l = pts[pts.length - 1];
    return l[1] + (t - l[0]) * 8;
  }
  function sample(arr, t) {
    var x = t * FPS, i = Math.floor(x);
    if (i < 0) return 0;
    if (i >= arr.length - 1) return arr.length ? arr[arr.length - 1] * 0 : 0;
    var k = x - i;
    return arr[i] * (1 - k) + arr[i + 1] * k;
  }

  /* The voice ---------------------------------------------------------------------------------- */

  function Voice(cfg) {
    cfg = cfg || {};
    this.cfg = cfg;
    this.synth = window.speechSynthesis || null;
    this.muted = false;
    this.voice = null;
    this.cps = 14.5;            // browser voice: characters per second, learned as she speaks
    this.job = null;
    this.simulate = !!cfg.simulate;
    this.AC = window.AudioContext || window.webkitAudioContext || null;
    this.cloud = !!(cfg.apiUrl && this.AC && window.fetch && !this.simulate);
    this.cloudDown = false;     // after a configuration error the browser voice is used for the visit
    this.ctx = null;
    this.audioCache = [];       // [{ text, promise }] most recent last
    var self = this;
    if (this.synth) {
      this.pickVoice();
      if (this.synth.addEventListener) this.synth.addEventListener('voiceschanged', function () { self.pickVoice(); });
    }
    // the audio engine can only start inside a click / key press / touch: take the first one
    if (this.cloud) {
      this._unlock = function () { self.unlock(); };
      ['pointerdown', 'keydown', 'touchend', 'click'].forEach(function (t) {
        window.addEventListener(t, self._unlock, { capture: true, passive: true });
      });
    }
  }

  Voice.prototype.available = function () {
    return this.simulate || (this.cloud && !this.cloudDown) || !!(this.synth && window.SpeechSynthesisUtterance);
  };

  // call from inside a user gesture: creates / resumes the AudioContext and primes it (iOS)
  Voice.prototype.unlock = function () {
    if (!this.cloud) return;
    try {
      if (!this.ctx) this.ctx = new this.AC({ latencyHint: 'interactive' });
      if (this.ctx.state !== 'running') this.ctx.resume();
      if (!this._primed) {
        var b = this.ctx.createBuffer(1, 1, 22050), s = this.ctx.createBufferSource();
        s.buffer = b; s.connect(this.ctx.destination); s.start(0);
        this._primed = true;
      }
    } catch (e) { /* ignore */ }
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
   * speak(text, { onStart, onEnd(ok), onBlocked }) → Promise<ok>
   * onBlocked fires when the browser refuses to play sound before the visitor has interacted.
   */
  Voice.prototype.speak = function (text, cb) {
    this.cancel();
    if (!this.muted && this.cloud && !this.cloudDown) return this.speakCloud(text, cb || {});
    return this.speakBrowser(text, cb || {});
  };

  /* Groq voice through the Web Audio API */

  // fetch + decode one chunk's audio (shared, so a greeting fetched before the first click plays
  // instantly afterwards)
  Voice.prototype.chunkAudio = function (text) {
    var self = this;
    for (var i = 0; i < this.audioCache.length; i++) {
      if (this.audioCache[i].text === text) {
        var hit = this.audioCache.splice(i, 1)[0];
        this.audioCache.push(hit);
        return hit.promise;
      }
    }
    if (!this.ctx) this.ctx = new this.AC({ latencyHint: 'interactive' }); // decoding works while suspended
    var ctx = this.ctx;
    var p = fetch(this.cfg.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'tts', text: text })
    }).then(function (r) {
      if (!r.ok) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          var err = new Error((j && j.error) || ('http ' + r.status));
          err.status = r.status; err.detail = j && j.detail;
          throw err;
        });
      }
      return r.arrayBuffer();
    }).then(function (ab) {
      return new Promise(function (res, rej) { ctx.decodeAudioData(ab, res, rej); });
    }).then(function (buf) {
      return { buf: buf, feat: analyse(buf), tl: timeline(text) };
    });
    var entry = { text: text, promise: p };
    p.catch(function () { var k = self.audioCache.indexOf(entry); if (k >= 0) self.audioCache.splice(k, 1); });
    this.audioCache.push(entry);
    if (this.audioCache.length > 24) this.audioCache.shift();
    return p;
  };

  Voice.prototype.speakCloud = function (text, cb) {
    var self = this;
    var chunks = ttsChunks(this.sayable(text));
    var total = chunks.reduce(function (a, c) { return a + c.length; }, 0) || 1;
    var job = { cloud: true, chunks: chunks, total: total, done: 0, items: [], playing: [], cur: null,
      nextAt: 0, i: 0, ended: false, started: false, cb: cb, question: false };
    this.job = job;

    return new Promise(function (resolve) {
      job.resolve = resolve;
      if (!chunks.length) { finish(true); return; }
      // start generating the first two sentences straight away
      fetchAhead(0);
      var ctx = self.ctx || (self.ctx = new self.AC({ latencyHint: 'interactive' }));
      var neverClicked = navigator.userActivation && !navigator.userActivation.hasBeenActive;
      if (ctx.state === 'running') { play(0); return; }
      if (neverClicked) { blocked(); return; }
      var settled = false;
      ctx.resume().then(function () { if (!settled) { settled = true; play(0); } }, function () {});
      setTimeout(function () {
        if (settled || job.ended) return;
        if (ctx.state === 'running') { settled = true; play(0); } else { settled = true; blocked(); }
      }, 350);
    });

    function blocked() {
      finish(false);
      if (cb.onBlocked) cb.onBlocked();
    }

    function fetchAhead(i) {
      for (var k = i; k < Math.min(chunks.length, i + 2); k++) {
        if (!job.items[k]) job.items[k] = self.chunkAudio(chunks[k]);
      }
    }

    function finish(ok) {
      if (job.ended) return;
      job.ended = true;
      job.cur = null;
      clearTimeout(job.watch);
      if (self.job === job) self.job = null;
      if (cb.onEnd) cb.onEnd(ok);
      job.resolve(ok);
    }

    // a sentence failed: say the rest with the browser's voice so the visitor still hears her
    function fallback(i, err) {
      if (job.ended || self.job !== job || job.failing) return;
      job.failing = true;
      if (window.console) console.warn('[Hannah] Groq voice unavailable (' + (err && (err.detail || err.message)) + '), using the browser voice');
      var s = err && err.status;
      if (s && s !== 429 && s !== 504 && s !== 408) self.cloudDown = true;
      // let the sentence that is already playing finish first
      var wait = job.playing.length ? Math.max(0, (job.nextAt - self.ctx.currentTime) * 1000) : 0;
      setTimeout(function () {
        if (job.ended || self.job !== job) return;
        job.ended = true;
        clearTimeout(job.watch);
        self.job = null;
        var offset = chunks.slice(0, i).reduce(function (a, c) { return a + c.length; }, 0);
        self.speakBrowser(chunks.slice(i).join(' '),
          { onStart: job.started ? null : cb.onStart, onEnd: cb.onEnd, onBlocked: cb.onBlocked },
          { offset: offset, total: total }).then(job.resolve);
      }, wait);
    }

    function play(i) {
      if (job.ended || self.job !== job) return;
      fetchAhead(i);
      job.items[i].then(function (a) {
        if (job.ended || self.job !== job) return;
        var ctx = self.ctx, f = a.feat;
        // trim silence the voice adds at the start and end, keep a natural pause between sentences
        var offset = Math.max(0, f.voicedStart - 0.05);
        var dur = Math.min(a.buf.duration - offset, f.voicedEnd + 0.14 - offset);
        var when = Math.max(ctx.currentTime + 0.02, job.nextAt);
        var src = ctx.createBufferSource();
        src.buffer = a.buf;
        src.connect(ctx.destination);
        src.start(when, offset, dur);
        var item = { i: i, src: src, at: when, offset: offset, dur: dur, a: a, map: alignMap(a.tl, f),
          chars: chunks[i].length, question: /\?\s*$/.test(chunks[i]) };
        job.playing.push(item);
        var pause = /[.!?]["')\]]*$/.test(chunks[i]) ? 0.22 : 0.05;
        job.nextAt = when + dur + pause;
        if (!job.started) {
          job.started = true;
          // onStart when the sound actually begins
          setTimeout(function () { if (!job.ended && cb.onStart) cb.onStart(); }, Math.max(0, (when - ctx.currentTime) * 1000));
        }
        src.onended = function () {
          if (job.ended || self.job !== job) return;
          job.done += item.chars;
          job.playing.splice(job.playing.indexOf(item), 1);
          if (i === chunks.length - 1) finish(true);
        };
        // schedule the next sentence as soon as it is ready (it starts when this one ends)
        if (i + 1 < chunks.length) play(i + 1);
        // safety net: if the audio never ends (device asleep), carry on
        clearTimeout(job.watch);
        job.watch = setTimeout(function () { if (!job.ended && i === chunks.length - 1) finish(true); },
          (job.nextAt - ctx.currentTime) * 1000 + 3000);
      }, function (err) {
        fallback(i, err);
      });
    }
  };

  // audio clock time that is coming out of the speakers at animation time `now` (ms)
  Voice.prototype.audioTime = function (now) {
    var ctx = this.ctx;
    if (!ctx) return 0;
    if (ctx.getOutputTimestamp) {
      var ts = ctx.getOutputTimestamp();
      if (ts && ts.performanceTime > 0) return ts.contextTime + (now - ts.performanceTime) / 1000;
    }
    return ctx.currentTime - (ctx.outputLatency || ctx.baseLatency || 0);
  };

  Voice.prototype.cloudItem = function (now) {
    var job = this.job;
    if (!job || !job.cloud || !job.playing.length) return null;
    var T = this.audioTime(now), best = null;
    for (var k = 0; k < job.playing.length; k++) {
      var it = job.playing[k];
      if (T >= it.at - 0.02 && T < it.at + it.dur + 0.02) { best = it; break; }
    }
    return best ? { it: best, t: T - best.at + best.offset } : null;
  };

  /* Browser voice (Web Speech API): the fallback */

  Voice.prototype.speakBrowser = function (text, cb, part) {
    var self = this;
    var chunks = sentences(this.sayable(text));
    var len = chunks.reduce(function (a, c) { return a + c.length; }, 0) || 1;
    var job = { chunks: chunks, i: 0, done: part ? part.offset : 0, total: part ? part.total : len, cur: null,
      ended: false, started: false, cb: cb };
    this.job = job;

    return new Promise(function (resolve) {
      job.resolve = resolve;
      if (self.muted || !(self.simulate || (self.synth && window.SpeechSynthesisUtterance))) { finish(true); return; }
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
      var cur = { text: text, tl: tl, anchorU: 0, anchorT: 0, unitMs: (text.length / self.cps) * 1000 / tl.units, on: false, lastB: null, t0: 0,
        question: /\?\s*$/.test(text) };
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
        var words = cur.tl.words;
        if (!words.length) return;
        var now = performance.now();
        var elapsed = Number(e.elapsedTime);
        var bt = Number.isFinite(elapsed) && elapsed >= 0 ? cur.t0 + elapsed * 1000 : now;
        var ci = Number.isFinite(e.charIndex) ? e.charIndex : 0, wi = 0;
        for (var k = 0; k < words.length; k++) { if (words[k].ci <= ci) wi = k; else break; }
        var w = words[wi];
        if (cur.lastB && w.u > cur.lastB.u) {
          var measured = (bt - cur.lastB.t) / (w.u - cur.lastB.u);
          if (measured > cur.unitMs * 0.4 && measured < cur.unitMs * 2.5) cur.unitMs = cur.unitMs * 0.5 + measured * 0.5;
        }
        cur.lastB = { u: w.u, t: bt };
        cur.anchorU = w.u;
        cur.anchorT = bt;
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
    if (job && job.playing) job.playing.forEach(function (p) { try { p.src.stop(); } catch (e) { /* ignore */ } });
    if (job && !job.ended) {
      job.ended = true;
      clearTimeout(job.watch);
      if (job.cb.onEnd) job.cb.onEnd(false);
      job.resolve(false);
    }
  };

  Voice.prototype.speaking = function () {
    var job = this.job;
    if (!job) return false;
    return job.cloud ? job.started : !!(job.cur && job.cur.on);
  };

  // browser voice: where it is in the current sentence, in timeline units. If the voice is still
  // talking when the estimate runs out (a slower voice without word events), the last words are
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

  // accent envelope: rises quickly at a stressed syllable and fades over ~300 ms
  function accentAt(list, t) {
    var a = 0;
    for (var i = 0; i < list.length; i++) {
      var d = t - list[i];
      if (d < -0.06) break;
      if (d < 0) a = Math.max(a, 1 + d / 0.06);
      else if (d < 0.8) a = Math.max(a, Math.exp(-d / 0.3));
    }
    return a;
  }

  // the mouth for "now": viseme weights plus how loud she is and whether a word is stressed
  Voice.prototype.mouth = function (now) {
    var job = this.job;
    if (!job) return null;
    if (job.cloud) {
      var c = this.cloudItem(now);
      if (!c) return job.started ? { v: { sil: 1 }, energy: 0, accent: 0, question: false } : null;
      var it = c.it, a = it.a, t = c.t;
      var pos = mapAt(it.map, t);
      var v = pos < 0 || pos >= a.tl.units ? { sil: 1 } : weightsAt(a.tl.segs, pos);
      var lvl = sample(a.feat.lvl, t), sib = sample(a.feat.sib, t);
      // the sound is the truth: if she is clearly talking where the text expects a pause, open the
      // mouth anyway; sibilance heard favours the hiss shape a little
      var silW = v.sil || 0;
      if (silW > 0 && lvl > 0.25) { var k = silW * Math.min(1, (lvl - 0.25) / 0.4); v.sil -= k; v.E = (v.E || 0) + k; }
      if (sib > 0.55 && lvl > 0.1) v.SS = (v.SS || 0) + (sib - 0.55) * 0.8;
      return { v: v, energy: lvl, accent: accentAt(a.feat.accents, t), question: it.question && t > it.dur * 0.45 };
    }
    var cur = job.cur;
    if (!cur || !cur.on) return null;
    var p = position(cur, now);
    if (p >= cur.tl.units || !cur.tl.segs.length) return { v: { sil: 1 }, energy: null, accent: 0, question: false };
    return { v: weightsAt(cur.tl.segs, p), energy: null, accent: 0, question: cur.question && p > cur.tl.units * 0.5 };
  };

  // how much of the reply has been spoken (0..1), for the live transcript
  Voice.prototype.progress = function (now) {
    var job = this.job;
    if (!job) return 1;
    if (job.cloud) {
      var c = this.cloudItem(now);
      if (!c) return job.done / job.total;
      var it = c.it, pos = mapAt(it.map, c.t);
      var frac = Math.min(1, Math.max(0, pos / it.a.tl.units));
      return Math.min(1, (job.done + it.chars * frac) / job.total);
    }
    var cur = job.cur;
    if (!cur || !cur.on) return job.done / job.total;
    var f = Math.min(1, position(cur, now) / cur.tl.units);
    return Math.min(1, (job.done + cur.text.length * f) / job.total);
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
  window.NexoraHannahVoice.analyse = analyse;
})();
