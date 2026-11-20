/*
 * Hannah on video: real talking clips, made once (offline, free) and played here.
 *
 * nexora/hannah/video/ holds:
 *   manifest.json  { idle: "idle.mp4", poster: "poster.jpg", clips: { "<exact sentence>": "c001.mp4", … },
 *                    names: { "divya": "names/divya.mp4", "दिव्या": "names/divya.mp4", … } }   (names optional)
 *   idle.mp4       her listening / breathing loop (no sound), starts and ends in her resting pose
 *   c###.mp4       one clip per sentence she can say, each also starting and ending in that pose
 * (made by v2/nexora-src/hannah/video/hannah_make_all_clips.ipynb)
 *
 * Two <video> layers: the idle loop underneath, the talking clip on top. When she speaks, the idle
 * loop is paused at its first frame (her resting pose) and the clip fades in over it; when the clip
 * ends it fades out and the idle loop carries on from that same resting pose, so no join is seen.
 *
 * window.NexoraHannahVideo(container, { base, manifestUrl, onReady(ok) }) → player
 *   player.ready → Promise<boolean>     player.has(sentence)     player.preload(sentence)
 *   player.speak(sentence, { onStart, onEnd(ok), onBlocked }) → Promise<ok>
 *     sentence may also be a list played back to back, e.g. [{ name: 'Divya' }, 'Lovely to meet you! …']:
 *     a name she has no clip for is left out (the chat still shows it)
 *   player.progress() → 0..1 of the current clip    player.speaking()    player.cancel()
 *   player.setMuted(bool)    player.destroy()
 *   player.addLanguage(code, base, manifestUrl) → Promise<bool>    player.setLanguage(code)
 *     another language's clips (same sentence keys, in its own folder); a sentence with no clip in the
 *     visitor's language is shown in writing only. Visitors' names always come from the main set.
 */
(function () {
  'use strict';

  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  // a name however it was typed: lower case, ँ as ं, no nukta (same rule as make_manifest.py)
  function nameKey(s) {
    return String(s || '').trim().toLowerCase().normalize('NFC').replace(/\u093C/g, '').replace(/\u0901/g, '\u0902');
  }

  function Player(container, opts) {
    var self = this;
    this.el = container;
    this.opts = opts || {};
    this.base = this.opts.base || '';
    // appended to every file, so re-made clips with the same name are never served stale
    this.q = this.opts.version ? '?v=' + encodeURIComponent(this.opts.version) : '';
    this.manifest = null;
    this.job = null;
    this.muted = false;
    this.cache = {};

    container.classList.add('hnv');
    this.poster = document.createElement('img');
    this.poster.className = 'hnv__poster';
    this.poster.alt = '';
    if (this.opts.poster) this.poster.src = this.opts.poster;
    this.idle = this.makeVideo('hnv__idle', true);
    this.talk = this.makeVideo('hnv__talk', false);
    container.appendChild(this.poster);
    container.appendChild(this.idle);
    container.appendChild(this.talk);

    this.ready = fetch(this.opts.manifestUrl, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('manifest ' + r.status);
      return r.json();
    }).then(function (m) {
      var clips = {}, names = {};
      Object.keys(m.clips || {}).forEach(function (k) { clips[norm(k)] = m.clips[k]; });
      Object.keys(m.names || {}).forEach(function (k) { names[nameKey(k)] = m.names[k]; });
      if (!Object.keys(clips).length) throw new Error('no clips');
      self.manifest = { idle: m.idle, poster: m.poster, clips: clips, names: names };
      self.sets = { en: { base: self.base, clips: clips } };
      self.lang = 'en';
      if (m.poster) self.poster.src = self.base + m.poster + self.q;
      self.idle.src = self.base + m.idle + self.q;
      self.idle.addEventListener('playing', function () { container.classList.add('is-live'); }, { once: true });
      self.playIdle();
      if (self.opts.onReady) self.opts.onReady(true);
      return true;
    }).catch(function (e) {
      if (window.console) console.warn('[Hannah] video clips unavailable:', e && e.message);
      if (self.opts.onReady) self.opts.onReady(false);
      return false;
    });
  }

  Player.prototype.makeVideo = function (cls, loop) {
    var v = document.createElement('video');
    v.className = cls;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.preload = 'auto';
    v.disablePictureInPicture = true;
    v.setAttribute('aria-hidden', 'true');
    if (loop) { v.muted = true; v.loop = true; v.autoplay = true; }
    return v;
  };

  Player.prototype.playIdle = function () {
    var p = this.idle.play();
    if (p && p.catch) p.catch(function () { /* the poster shows until it can play */ });
  };

  // one part: a sentence, or { name } for her clip of a visitor's name
  Player.prototype.url = function (part) {
    var m = this.manifest, f = null;
    if (!m || !part) return null;
    if (typeof part === 'object') {
      f = m.names[nameKey(part.name)];
      return f ? this.base + f + this.q : null;
    }
    // her clip of this sentence in the visitor's language; none yet → she writes it instead
    var set = this.sets[this.lang];
    f = set && set.clips[norm(part)];
    return f ? set.base + f + this.q : null;
  };

  // another language's clips: <base>/manifest.json = { clips: { "<English sentence>": "c083.mp4", … } }
  Player.prototype.addLanguage = function (code, base, manifestUrl) {
    var self = this;
    if (this.sets && this.sets[code]) return Promise.resolve(true);
    return fetch(manifestUrl, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (m) {
      var clips = {};
      Object.keys(m.clips || {}).forEach(function (k) { clips[norm(k)] = m.clips[k]; });
      self.sets[code] = { base: base, clips: clips };
      return true;
    }).catch(function () { return false; });
  };
  // a language without videos yet: she shows her sentences in writing (names too wait for its videos)
  Player.prototype.setLanguage = function (code) { this.lang = code || 'en'; };
  // the clips to play, in order (names without a clip are left out); null if a sentence is missing
  Player.prototype.urls = function (parts) {
    var self = this, out = [], ok = true;
    (Array.isArray(parts) ? parts : [parts]).forEach(function (p) {
      var u = self.url(p);
      if (u) out.push({ url: u, weight: typeof p === 'object' ? String(p.name).length + 6 : norm(p).length });
      else if (typeof p !== 'object') ok = false;
    });
    return ok && out.length ? out : null;
  };
  Player.prototype.has = function (parts) { return !!this.urls(parts); };

  // warm the browser cache for a clip she is likely to say next (keeps at most 4)
  Player.prototype.preload = function (parts) {
    var self = this;
    (this.urls(parts) || []).forEach(function (c) {
      var u = c.url;
      if (self.cache[u]) return;
      var keys = Object.keys(self.cache);
      if (keys.length >= 4) { self.cache[keys[0]].removeAttribute('src'); delete self.cache[keys[0]]; }
      var v = document.createElement('video');
      v.preload = 'auto';
      v.muted = true;
      v.src = u;
      self.cache[u] = v;
    });
  };

  Player.prototype.speak = function (parts, cb) {
    cb = cb || {};
    this.cancel();
    var self = this, list = this.urls(parts), talk = this.talk, el = this.el;
    var job = { ended: false, started: false, cb: cb, list: list || [], i: 0 };
    this.job = job;
    return new Promise(function (resolve) {
      job.resolve = resolve;
      if (!list) { finish(false); return; }
      talk.muted = self.muted;
      talk.onerror = function () { finish(false); };
      // each clip ends in her resting pose and the next starts in it, so they join without a seam
      talk.onended = function () {
        if (job.ended || self.job !== job) return;
        if (job.i + 1 < job.list.length) { job.i++; play(); } else finish(true);
      };
      play();

      function play() {
        talk.src = job.list[job.i].url;
        talk.currentTime = 0;
        var p = talk.play();
        if (p && p.then) {
          p.then(started, function (err) {
            if (job.ended) return;
            var blocked = err && err.name === 'NotAllowedError';
            finish(false);
            if (blocked && cb.onBlocked) cb.onBlocked();
          });
        } else {
          started();
        }
      }
      function started() {
        if (job.ended || self.job !== job) return;
        clearTimeout(job.watch);
        job.watch = setTimeout(function () { finish(true); }, ((talk.duration || 30) + 4) * 1000);
        if (job.started) return;
        job.started = true;
        // her resting pose underneath, so the clip's last frame meets the loop's first
        self.idle.pause();
        try { self.idle.currentTime = 0; } catch (e) { /* not loaded yet */ }
        el.classList.add('is-talking');
        if (cb.onStart) cb.onStart();
      }
    });

    function finish(ok) {
      if (job.ended) return;
      job.ended = true;
      clearTimeout(job.watch);
      if (self.job === job) self.job = null;
      el.classList.remove('is-talking');
      talk.onended = talk.onerror = null;
      self.playIdle();
      if (cb.onEnd) cb.onEnd(ok);
      job.resolve(ok);
    }
  };

  Player.prototype.speaking = function () { return !!(this.job && this.job.started); };

  // how far through everything she is saying (0..1), for the words appearing in the chat
  Player.prototype.progress = function () {
    var t = this.talk, job = this.job;
    if (!job) return 1;
    if (!job.started) return 0;
    var total = 0, before = 0;
    job.list.forEach(function (c, i) { total += c.weight; if (i < job.i) before += c.weight; });
    var here = t.duration ? Math.min(1, t.currentTime / t.duration) : 0;
    return total ? Math.min(1, (before + here * job.list[job.i].weight) / total) : here;
  };

  Player.prototype.cancel = function () {
    var job = this.job;
    if (!job) return;
    this.job = null;
    try { this.talk.pause(); } catch (e) { /* ignore */ }
    this.talk.onended = this.talk.onerror = null;
    this.el.classList.remove('is-talking');
    this.playIdle();
    if (!job.ended) {
      job.ended = true;
      clearTimeout(job.watch);
      if (job.cb.onEnd) job.cb.onEnd(false);
      job.resolve(false);
    }
  };

  // muted: she still talks on screen, without sound
  Player.prototype.setMuted = function (m) { this.muted = !!m; this.talk.muted = !!m; };

  Player.prototype.destroy = function () {
    this.cancel();
    [this.idle, this.talk].forEach(function (v) { try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) { /* ignore */ } });
    var c = this.cache;
    Object.keys(c).forEach(function (k) { c[k].removeAttribute('src'); });
    this.cache = {};
  };

  window.NexoraHannahVideo = function (container, opts) {
    var p = new Player(container, opts);
    if (/[?&]hannahdebug\b/.test(location.search)) window.__hannahVideo = p;
    return p;
  };
})();
