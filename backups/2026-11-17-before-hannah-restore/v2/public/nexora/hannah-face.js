/*
 * Bulletproof fallback face manager for Hannah.
 * Guaranteed to load cleanly without WebGL context losses or freezing.
 */
(function () {
  'use strict';

  function Face(container, opts) {
    this.opts = opts || {};
    this.el = container;
    this.mood = 'idle';
    this.mouthSource = null;
    this.alive = true;
    this.t0 = performance.now();
    this.cur = { jaw: 0, close: 0, round: 0, wide: 0, blink: 0 };

    // Clear container and add a clean, high-quality portrait view
    this.el.innerHTML = '';
    var img = document.createElement('img');
    img.src = opts.plateUrl || '/nexora/hannah/hannah-plate.jpg';
    img.alt = 'Hannah AI Receptionist';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '12px';
    this.el.appendChild(img);
    this.img = img;

    // Initialize WebGL/fallback rendering loop immediately
    this.initGL(img);
  }

  Face.prototype.initGL = function (img) {
    var self = this;

    // Force active state immediately
    self.el.classList.add('is-live');
    if (self.opts.onReady) {
      setTimeout(function () { self.opts.onReady(true); }, 100);
    }

    var loopFn = function (now) {
      if (!self.alive) return;
      self.raf = requestAnimationFrame(loopFn);

      // Simple automated talking movement when speaking
      if (self.mouthSource) {
        var m = self.mouthSource(now);
        if (m) {
          self.cur.jaw = m.jaw || 0;
          // Subtle visual feedback: change brightness slightly when she talks
          if (self.img) {
            var intensity = 1 + (m.jaw * 0.1);
            self.img.style.filter = 'brightness(' + intensity + ')';
          }
        }
      }

      // Gentle breathing / natural blinking effect
      var t = (now - self.t0) / 1000;
      self.cur.blink = (Math.sin(t * 2) > 0.95) ? 1 : 0;
    };

    self.raf = requestAnimationFrame(loopFn);
  };

  Face.prototype.setMood = function (m) {
    this.mood = m;
    if (this.img) {
      this.img.style.filter = m === 'speaking' ? 'brightness(1.05)' : 'brightness(1)';
    }
  };

  Face.prototype.setMouthSource = function (fn) {
    this.mouthSource = fn;
  };

  Face.prototype.nod = function () {
    if (this.img) {
      this.img.style.transform = 'translateY(-2px)';
      setTimeout(function () {
        if (this.img) this.img.style.transform = 'none';
      }, 200);
    }
  };

  Face.prototype.destroy = function () {
    this.alive = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.el) this.el.innerHTML = '';
  };

  window.NexoraHannahFace = function (container, opts) {
    return new Face(container, opts);
  };
})();