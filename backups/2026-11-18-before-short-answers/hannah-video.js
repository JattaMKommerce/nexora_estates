/*
 * Hannah on video: real talking clips, made once (offline, free) and played here.
 *
 * nexora/hannah/video/ holds:
 *   manifest.json  { idle: "idle.mp4", poster: "poster.jpg", clips: { "<exact sentence>": "c001.mp4", … } }
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
 *   player.progress() → 0..1 of the current clip    player.speaking()    player.cancel()
 *   player.setMuted(bool)    player.destroy()
 */
(function () {
  'use strict';

  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }

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
      var clips = {};
      Object.keys(m.clips || {}).forEach(function (k) { clips[norm(k)] = m.clips[k]; });
      if (!Object.keys(clips).length) throw new Error('no clips');
      self.manifest = { idle: m.idle, poster: m.poster, clips: clips };
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

  Player.prototype.url = function (sentence) {
    var f = this.manifest && this.manifest.clips[norm(sentence)];
    return f ? this.base + f + this.q : null;
  };
  Player.prototype.has = function (sentence) { return !!this.url(sentence); };

  // warm the browser cache for a clip she is likely to say next (keeps at most 4)
  Player.prototype.preload = function (sentence) {
    var u = this.url(sentence);
    if (!u || this.cache[u]) return;
    var keys = Object.keys(this.cache);
    if (keys.length >= 4) { this.cache[keys[0]].removeAttribute('src'); delete this.cache[keys[0]]; }
    var v = document.createElement('video');
    v.preload = 'auto';
    v.muted = true;
    v.src = u;
    this.cache[u] = v;
  };

  Player.prototype.speak = function (sentence, cb) {
    cb = cb || {};
    this.cancel();
    var self = this, url = this.url(sentence), talk = this.talk, el = this.el;
    var job = { ended: false, started: false, cb: cb };
    this.job = job;
    return new Promise(function (resolve) {
      job.resolve = resolve;
      if (!url) { finish(false); return; }
      talk.muted = self.muted;
      talk.src = url;
      talk.currentTime = 0;
      talk.onended = function () { finish(true); };
      talk.onerror = function () { finish(false); };
      var p = talk.play();
      var started = function () {
        if (job.ended || self.job !== job) return;
        job.started = true;
        // her resting pose underneath, so the clip's last frame meets the loop's first
        self.idle.pause();
        try { self.idle.currentTime = 0; } catch (e) { /* not loaded yet */ }
        el.classList.add('is-talking');
        if (cb.onStart) cb.onStart();
        clearTimeout(job.watch);
        job.watch = setTimeout(function () { finish(true); }, ((talk.duration || 30) + 4) * 1000);
      };
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

  Player.prototype.progress = function () {
    var t = this.talk;
    if (!this.job) return 1;
    if (!this.job.started || !t.duration) return 0;
    return Math.min(1, t.currentTime / t.duration);
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
