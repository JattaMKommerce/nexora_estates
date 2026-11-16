/*
 * Hannah's face: her real portrait, brought to life in WebGL.
 *
 * hannah-plate.jpg is her photo placed in a 16:9 reception scene. hannah-face.json holds the
 * 478 MediaPipe face landmarks of that photo (found once, offline), the canonical face-mesh
 * triangles with the mouth and eye openings cut out, and fixed "pin" points around the head.
 *
 * Every frame the landmarks are moved by a few expression shapes (jaw, lip closure, rounding,
 * spreading, smile relax, blink, brows) plus a small head motion, and the photo is drawn through
 * the deformed mesh. The mouth opening is drawn as its own layer: her real upper teeth stay
 * attached to the upper jaw while the lower lip and chin move, revealing a mouth interior. The
 * eye openings are their own layer too, so the lids close over the eyes and the irises can move.
 *
 * Speech drives the mouth through setMouthSource(fn): fn() returns {jaw, close, round, wide}
 * (0..1) for "now" and comes from the lip-sync timeline in hannah-voice.js.
 *
 * window.NexoraHannahFace(container, { plateUrl, rigUrl, onReady }) → face
 *   face.setMood('idle' | 'welcome' | 'listening' | 'thinking' | 'speaking' | 'happy' | 'apologetic')
 *   face.setMouthSource(fn | null)   face.nod()   face.destroy()
 * Without WebGL the plate is shown as a still photo.
 */
(function () {
  'use strict';

  var IU = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308];   // inner upper lip
  var IL = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308];   // inner lower lip
  var INNER_PAIRS = [[191, 95], [80, 88], [81, 178], [82, 87], [13, 14], [312, 317], [311, 402], [310, 318], [415, 324]];
  var EYES = [
    { up: [33, 246, 161, 160, 159, 158, 157, 173, 133], low: [33, 7, 163, 144, 145, 153, 154, 155, 133],
      browLow: [46, 53, 52, 65, 55], browUp: [70, 63, 105, 66, 107], iris: 468, irisEdge: 469, inner: 133 },
    { up: [263, 466, 388, 387, 386, 385, 384, 398, 362], low: [263, 249, 390, 373, 374, 380, 381, 382, 362],
      browLow: [276, 283, 282, 295, 285], browUp: [300, 293, 334, 296, 336], iris: 473, irisEdge: 474, inner: 362 }
  ];
  var SHAPES = ['jaw', 'close', 'round', 'wide', 'relax', 'blink', 'browUp', 'browInner'];

  // Expression targets for each mood:
  // idle: natural neutral resting face with relaxed lips, calm gaze
  // welcome: warm friendly smile when greeting visitors
  // listening: attentive listening reaction (head tilt, attentive eyes/brow, relaxed lips)
  // thinking: thoughtful glance away, subtle brow movement, relaxed lips
  // speaking: mouth driven by speech visemes
  // happy: warm smile
  var MOODS = {
    idle:       { relax: 0.35, browUp: 0,    browInner: 0,    gx: 0,    gy: 0,    tilt: 0 },
    welcome:    { relax: 0,    browUp: 0.3,  browInner: 0,    gx: 0,    gy: 0,    tilt: 0.01 },
    listening:  { relax: 0.35, browUp: 0.15, browInner: 0,    gx: 0.4,  gy: -0.2, tilt: 0.018 },
    thinking:   { relax: 0.55, browUp: 0.1,  browInner: 0.35, gx: -2.0, gy: -1.6, tilt: -0.012 },
    speaking:   { relax: 0.3,  browUp: 0.1,  browInner: 0,    gx: 0,    gy: 0,    tilt: 0.006 },
    happy:      { relax: 0,    browUp: 0.25, browInner: 0,    gx: 0,    gy: 0,    tilt: 0.012 },
    apologetic: { relax: 0.6,  browUp: 0,    browInner: 0.55, gx: 0,    gy: 0.5,  tilt: -0.008 }
  };

  function smooth(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // y of a contour at x (contour sorted by x), clamped at its ends
  function contour(P, idx) {
    var pts = idx.map(function (i) { return P[i]; }).slice().sort(function (a, b) { return a[0] - b[0]; });
    return function (x) {
      if (x <= pts[0][0]) return pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        if (x <= pts[i][0]) {
          var a = pts[i - 1], b = pts[i], t = (x - a[0]) / Math.max(1e-6, b[0] - a[0]);
          return a[1] + (b[1] - a[1]) * t;
        }
      }
      return pts[pts.length - 1][1];
    };
  }

  /* The rig: one displacement field per expression shape, evaluated at every landmark --------- */

  function buildRig(R) {
    // the shapes are measured in portrait pixels; the plate shows the portrait scaled by k
    var k = R.scale || 1;
    var P0 = R.points, N = P0.length;
    var P = P0.map(function (p) { return [p[0] / k, p[1] / k]; });
    var D = {};
    SHAPES.forEach(function (s) { D[s] = new Float32Array(N * 2); });

    var iu = contour(P, IU), il = contour(P, IL);
    var xL = P[78][0], xR = P[308][0];
    var cx = (P[13][0] + P[14][0]) / 2;
    var W = (P[291][0] - P[61][0]) / 2;
    var clampX = function (x) { return Math.min(xR, Math.max(xL, x)); };
    var mid = function (x) { x = clampX(x); return (iu(x) + il(x)) / 2; };
    var gap = function (x) { x = clampX(x); return Math.max(0, il(x) - iu(x)); };

    var eyes = EYES.map(function (e) {
      var xs = e.up.map(function (i) { return P[i][0]; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs);
      var bx = e.browLow.concat(e.browUp).map(function (i) { return P[i][0]; });
      return {
        up: contour(P, e.up), low: contour(P, e.low), brow: contour(P, e.browLow),
        cx: (x0 + x1) / 2, hw: (x1 - x0) / 2,
        bx0: Math.min.apply(null, bx), bx1: Math.max.apply(null, bx), innerX: P[e.inner][0],
        set: e.up.concat(e.low)
      };
    });
    var JAW = 6.5;

    for (var i = 0; i < N; i++) {
      if (i >= 468) continue; // iris points only follow the head
      var x = P[i][0], y = P[i][1], o = i * 2;
      var u = (x - cx) / W, au = Math.abs(u), sg = u < 0 ? -1 : 1;
      var dm = y - mid(x);

      // jaw: subtle natural speech opening for vowels (photo is already a smile)
      var below = smooth(-1.0, 3, dm);
      var prof = au < 1 ? lerp(1, 0.42, au * au) : 0.42 * (1 - smooth(1, 2.4, au));
      D.jaw[o + 1] = JAW * below * prof;

      // close: the lower lip rises naturally to meet the upper teeth/lip (M, B, P, F)
      // upper lip stays anchored to upper jaw/skull bone to prevent smeared teeth
      var g = gap(x);
      if (dm < 0) {
        var du = iu(clampX(x)) - y;
        D.close[o + 1] = 0.08 * g * (du <= 0 ? 1 : Math.exp(-du / 14));
      } else {
        var dl = y - il(clampX(x));
        D.close[o + 1] = -0.92 * g * (dl <= 0 ? 1 : Math.exp(-dl / 18));
      }

      // relax: subtle resting tension
      var c = smooth(0.3, 1.0, au) * (1 - smooth(1.7, 2.8, au));
      var vy = y - mid(x), vf = Math.exp(-(vy * vy) / (55 * 55));
      D.relax[o] = -sg * 4.0 * c * vf;
      D.relax[o + 1] = 1.2 * c * vf;
      if (dm < 0) {
        var du2 = iu(clampX(x)) - y;
        D.relax[o + 1] += 0.8 * (1 - smooth(0.35, 1.0, au)) * (du2 <= 0 ? 1 : Math.exp(-du2 / 18));
      } else if (au < 1) {
        var dl2 = y - il(clampX(x));
        D.relax[o + 1] -= 1.2 * (1 - au) * (dl2 <= 0 ? 1 : Math.exp(-dl2 / 20));
      }

      // round (O, U, W) and wide (E, I, S): natural subtle lip shaping
      var band = Math.exp(-(dm * dm) / (40 * 40)) * (1 - smooth(1.3, 2.4, au));
      D.round[o] = -sg * 7.0 * smooth(0.1, 1.0, Math.min(au, 1)) * band;
      D.round[o + 1] = (dm < 0 ? -1.0 : 1.5) * (1 - Math.min(1, au)) * band + (dm < 0 ? 1.0 : -1.0) * smooth(0.6, 1, Math.min(au, 1)) * band;
      D.wide[o] = sg * 3.5 * smooth(0.2, 1.0, Math.min(au, 1)) * band;
      D.wide[o + 1] = -0.8 * c * band;

      for (var ei = 0; ei < 2; ei++) {
        var e = eyes[ei];
        var ex = (x - e.cx) / e.hw, hw = 1 - smooth(0.85, 1.35, Math.abs(ex));
        var yu = e.up(x), yl = e.low(x), yb = e.brow(x);
        var travel = Math.max(0, yl - yu) * 0.96;
        // blink: the upper lid comes down over the eye; the skin above follows a little
        if (hw > 0) {
          var dU = yu - y;
          if (dU >= -0.6 && y > yb + 2) D.blink[o + 1] += travel * Math.exp(-Math.max(0, dU) / 8) * hw;
          else if (y >= yl - 0.6) D.blink[o + 1] -= travel * 0.06 * Math.exp(-Math.max(0, y - yl) / 6) * hw;
          // relaxing the smile releases the lower lids a touch
          if (y >= yl - 0.6) D.relax[o + 1] += 1.2 * Math.exp(-Math.max(0, y - yl) / 10) * hw;
        }
        // brows: brow and forehead lift, fading to nothing at the eyelid
        var out = Math.max(0, e.bx0 - 25 - x, x - e.bx1 - 25);
        var hx = 1 - smooth(0, 25, Math.max(0, e.bx0 - x, x - e.bx1));
        if (out <= 0 && hx > 0) {
          var w;
          if (y <= yb) w = Math.exp(-(yb - y) / 45);
          else if (y < yu) w = 1 - smooth(yb, yu - 4, y);
          else w = 0;
          D.browUp[o + 1] -= 6 * w * hx;
          var span = Math.abs(e.innerX - e.cx) * 2.2;
          var wi = 1 - smooth(0, span, Math.abs(x - e.innerX));
          D.browInner[o + 1] -= 5 * w * wi * hx;
          D.browInner[o] += (e.innerX > e.cx ? -1 : 1) * 1.4 * w * wi * hx;
        }
      }
    }

    // where the head can move: fully inside the head and hair, not at the shoulders or the desk
    var chinY = P[152][1];
    var hcx = cx, hcy = P[168][1] + 40;
    var pinW = R.pins.map(function (q) {
      var qx = q[0] / k, qy = q[1] / k;
      var ex = (qx - hcx) / 390, ey = (qy - hcy) / 430;
      var w = 1 - smooth(0.85, 1.4, Math.sqrt(ex * ex + ey * ey));
      return w * (1 - smooth(chinY + 30, chinY + 140, qy));
    });

    // back to plate pixels
    SHAPES.forEach(function (s) { var d = D[s]; for (var j = 0; j < d.length; j++) d[j] *= k; });

    return {
      D: D, P: P0, N: N, pins: R.pins, pinW: pinW, k: k,
      pivot: [cx * k, (chinY + 160) * k], mouth: { cx: cx * k, W: W * k },
      eyes: EYES.map(function (e) {
        var c0 = P0[e.iris], c1 = P0[e.irisEdge];
        return { iris: e.iris, r: Math.max(5, Math.hypot(c1[0] - c0[0], c1[1] - c0[1])) };
      })
    };
  }

  /* WebGL ------------------------------------------------------------------------------------ */

  var VS = 'attribute vec2 a_pos; attribute vec2 a_uv; uniform vec4 u_view;' +
    'varying vec2 v_uv; varying vec2 v_pos;' +
    'void main(){ v_uv = a_uv; v_pos = a_pos; vec2 c = (a_pos - u_view.xy) / u_view.zw * 2.0 - 1.0;' +
    ' gl_Position = vec4(c.x, -c.y, 0.0, 1.0); }';

  var HEAD = 'uniform vec4 u_head; uniform vec2 u_pivot; uniform vec2 u_plate;' +
    'vec2 unhead(vec2 p){ vec2 q = p - u_pivot - u_head.zw; return vec2(u_head.x*q.x + u_head.y*q.y, -u_head.y*q.x + u_head.x*q.y) + u_pivot; }';

  var FS_TEX = 'varying vec2 v_uv; varying vec2 v_pos; uniform sampler2D u_tex;' +
    'void main(){ gl_FragColor = vec4(texture2D(u_tex, v_uv).rgb, 1.0); }';

  var FS_MOUTH = 'varying vec2 v_uv; varying vec2 v_pos; uniform sampler2D u_tex;' + HEAD +
    'uniform vec4 u_teethRect; uniform float u_jaw; uniform float u_k;' +
    'void main(){' +
    ' vec2 p0 = unhead(v_pos);' +
    ' vec2 samplePos = p0;' +
    ' float maxTeethY = u_teethRect.y + u_teethRect.w * 0.92;' +
    ' samplePos.y = min(p0.y, maxTeethY);' +
    ' vec3 col = texture2D(u_tex, samplePos / u_plate).rgb;' +
    ' float depth = max(0.0, p0.y - maxTeethY);' +
    ' float shadow = smoothstep(0.0, 7.0 * u_k, depth);' +
    ' vec3 darkCavity = vec3(0.10, 0.035, 0.03);' +
    ' col = mix(col, darkCavity, shadow * 0.85);' +
    ' gl_FragColor = vec4(col, 1.0); }';

  var FS_EYE = 'varying vec2 v_uv; varying vec2 v_pos; uniform sampler2D u_tex;' + HEAD +
    'uniform vec2 u_iris; uniform float u_irisR; uniform vec2 u_gaze;' +
    'void main(){ vec2 p0 = unhead(v_pos);' +
    ' float f = 1.0 - smoothstep(u_irisR * 0.9, u_irisR * 2.0, length(p0 - u_iris));' +
    ' gl_FragColor = vec4(texture2D(u_tex, (p0 - u_gaze * f) / u_plate).rgb, 1.0); }';

  function compile(gl, vs, fs, hp) {
    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, (type === gl.FRAGMENT_SHADER ? 'precision ' + hp + ' float;\n' : '') + src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'a_pos');
    gl.bindAttribLocation(p, 1, 'a_uv');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {};
    var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
    return { p: p, u: u };
  }

  /* The face --------------------------------------------------------------------------------- */

  function Face(container, opts) {
    this.opts = opts || {};
    this.el = container;
    this.mood = 'idle';
    this.mouthSource = null;
    this.alive = true;
    this.t0 = performance.now();
    this.cur = { jaw: 0, close: 0, round: 0, wide: 0, relax: 0.35, blink: 0, browUp: 0, browInner: 0, gx: 0, gy: 0, tilt: 0 };
    this.nextBlink = 1200;
    this.blinkT = -1;
    this.nodT = -1;
    this.saccade = { x: 0, y: 0, next: 1500 };
    this.nodAmp = 5;
    this.browPulse = 0;
    this.glance = { x: 0, y: 0 };
    this.glanceT = 0;
    this.lastSentence = -1;
    this.lastWord = -1;

    var poster = document.createElement('img');
    poster.className = 'hnf__poster';
    poster.alt = '';
    poster.decoding = 'async';
    poster.src = this.opts.plateUrl;
    container.appendChild(poster);
    this.poster = poster;

    var self = this;
    var img = new Image();
    img.decoding = 'async';
    img.src = this.opts.plateUrl;
    Promise.all([
      fetch(this.opts.rigUrl).then(function (r) { if (!r.ok) throw new Error('rig ' + r.status); return r.json(); }),
      img.decode ? img.decode().then(function () { return img; }) : new Promise(function (res) { img.onload = function () { res(img); }; })
    ]).then(function (res) {
      if (!self.alive) return;
      self.rig = buildRig(res[0]);
      self.raw = res[0];
      self.initGL(res[1]);
    }).catch(function (e) {
      if (window.console) console.warn('[Hannah] face animation unavailable, showing her photo:', e && e.message);
      if (self.opts.onReady) self.opts.onReady(false);
    });
  }

  Face.prototype.initGL = function (img) {
    var canvas = document.createElement('canvas');
    canvas.className = 'hnf__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    var gl = canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: false }) ||
             canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('no WebGL');
    this.canvas = canvas;
    this.gl = gl;
    var hp = (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT) || {}).precision > 0 ? 'highp' : 'mediump';
    this.progTex = compile(gl, VS, FS_TEX, hp);
    this.progMouth = compile(gl, VS, FS_MOUTH, hp);
    this.progEye = compile(gl, VS, FS_EYE, hp);

    var R = this.raw, rig = this.rig, P = rig.P;
    var plateW = R.plate[0], plateH = R.plate[1];
    this.plate = [plateW, plateH];

    // vertices: the 478 landmarks, then the pins
    var NV = P.length + R.pins.length;
    this.pos = new Float32Array(NV * 2);
    var uv = new Float32Array(NV * 2);
    for (var i = 0; i < P.length; i++) { uv[i * 2] = P[i][0] / plateW; uv[i * 2 + 1] = P[i][1] / plateH; }
    for (var j = 0; j < R.pins.length; j++) {
      var k = (P.length + j) * 2;
      uv[k] = R.pins[j][0] / plateW; uv[k + 1] = R.pins[j][1] / plateH;
    }
    this.posBuf = gl.createBuffer();
    this.uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);

    function ibo(list) {
      var a = new Uint16Array(list.length * 3);
      list.forEach(function (t, n) { a[n * 3] = t[0]; a[n * 3 + 1] = t[1]; a[n * 3 + 2] = t[2]; });
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, a, gl.STATIC_DRAW);
      return { b: b, n: a.length };
    }
    var remap = function (t) { return t.map(function (v) { return v >= 478 ? v : v; }); };
    this.meshIdx = ibo(R.tris.concat(R.skirt.map(remap)));
    this.mouthIdx = ibo(R.mouthTris);
    this.eyeIdx = [ibo(R.eyeTrisR), ibo(R.eyeTrisL)];

    // full-plate quad behind everything
    this.quadPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, plateW, 0, 0, plateH, plateW, plateH]), gl.STATIC_DRAW);
    this.quadUv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadUv);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

    function tex(source) {
      var t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    }
    this.plateTex = tex(img);

    // teeth mask: the original mouth opening, nudged up a pixel at the bottom so no lip shows under the teeth
    var loop = IU.map(function (i) { return [P[i][0], P[i][1]]; })
      .concat(IL.slice(1, -1).reverse().map(function (i) { return [P[i][0], P[i][1] - 1.5 * rig.k]; }));
    var xs = loop.map(function (p) { return p[0]; }), ys = loop.map(function (p) { return p[1]; });
    var rx = Math.floor(Math.min.apply(null, xs)) - 6, ry = Math.floor(Math.min.apply(null, ys)) - 6;
    var rw = Math.ceil(Math.max.apply(null, xs)) + 6 - rx, rh = Math.ceil(Math.max.apply(null, ys)) + 6 - ry;
    var mc = document.createElement('canvas');
    mc.width = rw; mc.height = rh;
    var m = mc.getContext('2d');
    m.fillStyle = '#000'; m.fillRect(0, 0, rw, rh);
    m.fillStyle = '#fff';
    m.beginPath();
    loop.forEach(function (p, n) { if (n) m.lineTo(p[0] - rx, p[1] - ry); else m.moveTo(p[0] - rx, p[1] - ry); });
    m.closePath(); m.fill();
    this.teethTex = tex(mc);
    this.teethRect = [rx, ry, rw, rh];

    var self = this;
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      self.gl = null;
      self.el.classList.remove('is-live');
    });
    this.el.appendChild(canvas);
    this.resize();
    if ('ResizeObserver' in window) {
      this.ro = new ResizeObserver(function () { self.resize(); });
      this.ro.observe(this.el);
    } else {
      window.addEventListener('resize', this._onResize = function () { self.resize(); });
    }
    this.last = performance.now();
    var first = true;
    var loopFn = function (now) {
      if (!self.alive) return;
      self.raf = requestAnimationFrame(loopFn);
      if (!self.gl) return;
      self.frame(now);
      if (first) {
        first = false;
        self.el.classList.add('is-live');
        if (self.opts.onReady) self.opts.onReady(true);
      }
    };
    this.raf = requestAnimationFrame(loopFn);
  };

  Face.prototype.resize = function () {
    if (!this.canvas) return;
    var r = this.el.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    // cover-fit the plate, keeping her face centred
    var pw = this.plate[0], ph = this.plate[1], a = w / h;
    var vw, vh;
    if (a < pw / ph) { vh = ph; vw = ph * a; } else { vw = pw; vh = pw / a; }
    var fx = this.rig.P[1][0], fy = this.rig.P[168][1] + 60 * this.rig.k;
    var x0 = Math.min(pw - vw, Math.max(0, fx - vw / 2));
    var y0 = Math.min(ph - vh, Math.max(0, fy - vh * 0.42));
    if (a > pw / ph) y0 = Math.min(ph - vh, Math.max(0, fy - vh * 0.45));
    this.view = [x0, y0, vw, vh];
    // the poster uses the same framing
    this.poster.style.objectPosition = (vw >= pw ? 50 : (x0 / (pw - vw)) * 100) + '% ' + (vh >= ph ? 50 : (y0 / (ph - vh)) * 100) + '%';
  };

  Face.prototype.setMood = function (m) {
    if (!MOODS[m] || m === this.mood) return;
    // a blink often comes with a change of expression
    if (this.blinkT < 0 && Math.random() < 0.5) this.nextBlink = 0;
    this.mood = m;
  };
  Face.prototype.setMouthSource = function (fn) { this.mouthSource = fn; };
  Face.prototype.nod = function (amp) { this.nodT = 0; this.nodAmp = amp || 5; };

  // What people do while talking: a small nod and brow lift as each sentence starts, often a
  // glance away while they gather the thought, a blink between sentences, and light emphasis on
  // the words that matter.
  Face.prototype.gestures = function (m, dt) {
    this.browPulse = Math.max(0, this.browPulse - dt * 0.9);
    if (this.glanceT > 0) { this.glanceT -= dt; if (this.glanceT <= 0) { this.glance.x = 0; this.glance.y = 0; } }
    if (!m) { this.lastSentence = -1; this.lastWord = -1; return; }
    if (m.sentence !== this.lastSentence) {
      this.lastSentence = m.sentence;
      if (this.nodT < 0) this.nod(2.6);
      this.browPulse = 0.35;
      if (Math.random() < 0.45) {
        this.glance.x = (Math.random() < 0.5 ? -1 : 1) * (1.4 + Math.random());
        this.glance.y = -0.6 - Math.random() * 0.6;
        this.glanceT = 0.45 + Math.random() * 0.35;
      }
      if (m.sentence > 0 && this.blinkT < 0 && Math.random() < 0.6) this.nextBlink = 120;
    }
    if (m.word !== this.lastWord) {
      this.lastWord = m.word;
      if (m.stress && Math.random() < 0.3) {
        this.browPulse = Math.max(this.browPulse, 0.22);
        if (this.nodT < 0 && Math.random() < 0.5) this.nod(1.6);
      }
    }
  };

  Face.prototype.frame = function (now) {
    var dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    var t = (now - this.t0) / 1000;
    var c = this.cur, mood = MOODS[this.mood];

    // mouth from speech, smoothed like real articulators (lips close fast, the jaw is heavier)
    var m = this.mouthSource ? this.mouthSource(now) : null;
    var tgt = m || { jaw: 0, close: 0, round: 0, wide: 0 };
    var ease = function (k, target, tau) { c[k] += (target - c[k]) * (1 - Math.exp(-dt / tau)); };
    ease('jaw', tgt.jaw, 0.055);
    ease('close', tgt.close, 0.035);
    ease('round', tgt.round, 0.07);
    ease('wide', tgt.wide, 0.07);
    this.gestures(m, dt);
    ease('relax', mood.relax, 0.25);
    ease('browUp', mood.browUp + this.browPulse, 0.12);
    ease('browInner', mood.browInner, 0.25);
    ease('tilt', mood.tilt, 0.45);

    // gaze: small saccades around the camera; thinking looks up and away
    this.saccade.next -= dt * 1000;
    if (this.saccade.next <= 0) {
      var amp = this.mood === 'thinking' ? 0.8 : 0.55;
      this.saccade.x = (Math.random() * 2 - 1) * amp;
      this.saccade.y = (Math.random() * 2 - 1) * amp * 0.6;
      this.saccade.next = 900 + Math.random() * 2600;
    }
    var k = this.rig.k;
    ease('gx', (mood.gx + this.saccade.x + this.glance.x) * k, 0.06);
    ease('gy', (mood.gy + this.saccade.y + this.glance.y) * k, 0.06);

    // blinks: every 2-6 s, about 160 ms, sometimes double
    var blink = 0;
    if (this.blinkT >= 0) {
      this.blinkT += dt * 1000;
      var bt = this.blinkT;
      blink = bt < 70 ? smooth(0, 70, bt) : 1 - smooth(70, 170, bt);
      if (bt > 170) { this.blinkT = -1; this.nextBlink = (Math.random() < 0.15 ? 180 : 2000 + Math.random() * 4000); }
    } else {
      this.nextBlink -= dt * 1000;
      if (this.nextBlink <= 0) this.blinkT = 0;
    }
    c.blink = this.debugBlink != null ? this.debugBlink : blink;

    // head: slow drift, breathing, speech bob, nods
    var tx = (2.2 * Math.sin(t * 0.37) + 1.1 * Math.sin(t * 0.83 + 1.0)) * k;
    var ty = (1.3 * Math.sin(t * 0.29 + 2.0) + 0.7 * Math.sin(t * 1.55)) * k;
    var rot = 0.006 * Math.sin(t * 0.31 + 0.5) + 0.003 * Math.sin(t * 0.77) + c.tilt;
    if (m) { ty += c.jaw * 0.6 * k; rot += 0.003 * Math.sin(t * 1.3); }
    if (this.nodT >= 0) {
      this.nodT += dt;
      var nt = this.nodT / 0.75;
      if (nt >= 1) this.nodT = -1;
      else ty += this.nodAmp * k * Math.sin(Math.PI * nt) * (1 - nt * 0.3);
    }

    this.deform(c, tx, ty, rot);
    this.draw(c, tx, ty, rot);
  };

  Face.prototype.deform = function (c, tx, ty, rot) {
    var rig = this.rig, P = rig.P, N = rig.N, D = rig.D, pos = this.pos;
    var w = {
      jaw: c.jaw, close: Math.min(1, c.close), round: c.round, wide: c.wide,
      relax: c.relax, blink: c.blink, browUp: c.browUp, browInner: c.browInner
    };
    var i, s, o;
    for (i = 0; i < N * 2; i++) pos[i] = P[i >> 1][i & 1];
    for (s = 0; s < SHAPES.length; s++) {
      var k = SHAPES[s], ws = w[k];
      if (Math.abs(ws) < 1e-4) continue;
      var d = D[k];
      for (i = 0; i < 468 * 2; i++) pos[i] += d[i] * ws;
    }
    // the lips may meet but never pass through each other
    var seal = smooth(0.55, 0.95, w.close);
    for (i = 0; i < INNER_PAIRS.length; i++) {
      var ia = INNER_PAIRS[i][0] * 2, ib = INNER_PAIRS[i][1] * 2;
      if (seal > 0) {
        var targetY = pos[ia + 1];
        pos[ib + 1] += (targetY + 0.3 - pos[ib + 1]) * seal;
      }
      if (pos[ia + 1] > pos[ib + 1] - 0.2) {
        pos[ib + 1] = pos[ia + 1] + 0.2;
      }
    }
    // lower lip curve (before head motion) for the mouth shader: a parabola through its corners and centre
    var mx = rig.mouth.cx;
    var l0 = [pos[78 * 2] - mx, pos[78 * 2 + 1]], l1 = [pos[14 * 2] - mx, pos[14 * 2 + 1]], l2 = [pos[308 * 2] - mx, pos[308 * 2 + 1]];
    this.low = parabola(l0, l1, l2);

    // head motion
    var cs = Math.cos(rot), sn = Math.sin(rot), px = rig.pivot[0], py = rig.pivot[1];
    for (i = 0; i < N; i++) {
      o = i * 2;
      var qx = pos[o] - px, qy = pos[o + 1] - py;
      pos[o] = cs * qx - sn * qy + px + tx;
      pos[o + 1] = sn * qx + cs * qy + py + ty;
    }
    var pins = rig.pins;
    for (i = 0; i < pins.length; i++) {
      o = (N + i) * 2;
      var pw = rig.pinW[i], X = pins[i][0], Y = pins[i][1];
      if (pw <= 0) { pos[o] = X; pos[o + 1] = Y; continue; }
      var rx = X - px, ry = Y - py;
      pos[o] = X + (cs * rx - sn * ry + px + tx - X) * pw;
      pos[o + 1] = Y + (sn * rx + cs * ry + py + ty - Y) * pw;
    }
    this.head = [cs, sn, tx, ty];
  };

  function parabola(a, b, c) {
    // y = A x^2 + B x + C through three points
    var d = (a[0] - b[0]) * (a[0] - c[0]) * (b[0] - c[0]) || 1e-6;
    var A = (c[0] * (b[1] - a[1]) + b[0] * (a[1] - c[1]) + a[0] * (c[1] - b[1])) / d;
    var B = (c[0] * c[0] * (a[1] - b[1]) + b[0] * b[0] * (c[1] - a[1]) + a[0] * a[0] * (b[1] - c[1])) / d;
    var C = (b[0] * c[0] * (b[0] - c[0]) * a[1] + c[0] * a[0] * (c[0] - a[0]) * b[1] + a[0] * b[0] * (a[0] - b[0]) * c[1]) / d;
    return [A, B, C];
  }

  Face.prototype.draw = function (c) {
    var gl = this.gl, rig = this.rig;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.plateTex);

    var view = this.view, head = this.head, plate = this.plate;
    var useProg = function (pr) {
      gl.useProgram(pr.p);
      gl.uniform4f(pr.u.u_view, view[0], view[1], view[2], view[3]);
      if (pr.u.u_tex) gl.uniform1i(pr.u.u_tex, 0);
      if (pr.u.u_head) gl.uniform4f(pr.u.u_head, head[0], head[1], head[2], head[3]);
      if (pr.u.u_pivot) gl.uniform2f(pr.u.u_pivot, rig.pivot[0], rig.pivot[1]);
      if (pr.u.u_plate) gl.uniform2f(pr.u.u_plate, plate[0], plate[1]);
    };
    var attribs = function (posBuf, uvBuf) {
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    };

    // 1. the still plate
    useProg(this.progTex);
    attribs(this.quadPos, this.quadUv);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // the deformed vertices for everything else
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.pos, gl.DYNAMIC_DRAW);
    attribs(this.posBuf, this.uvBuf);

    // 2. inside the mouth: her upper teeth stay put, the rest is the mouth interior
    var pm = this.progMouth;
    useProg(pm);
    var tr = this.teethRect;
    if (pm.u.u_teethRect) gl.uniform4f(pm.u.u_teethRect, tr[0], tr[1], tr[2], tr[3]);
    if (pm.u.u_jaw) gl.uniform1f(pm.u.u_jaw, c.jaw);
    if (pm.u.u_k) gl.uniform1f(pm.u.u_k, rig.k);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mouthIdx.b);
    gl.drawElements(gl.TRIANGLES, this.mouthIdx.n, gl.UNSIGNED_SHORT, 0);

    // 3. the eyes: the eyeballs stay put under the lids; the irises follow the gaze
    var pe = this.progEye;
    useProg(pe);
    gl.uniform2f(pe.u.u_gaze, c.gx, c.gy);
    for (var e = 0; e < 2; e++) {
      var ie = rig.eyes[e], P = rig.P;
      gl.uniform2f(pe.u.u_iris, P[ie.iris][0], P[ie.iris][1]);
      gl.uniform1f(pe.u.u_irisR, ie.r);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.eyeIdx[e].b);
      gl.drawElements(gl.TRIANGLES, this.eyeIdx[e].n, gl.UNSIGNED_SHORT, 0);
    }

    // 4. the face and its surroundings, warped
    useProg(this.progTex);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.meshIdx.b);
    gl.drawElements(gl.TRIANGLES, this.meshIdx.n, gl.UNSIGNED_SHORT, 0);
  };

  Face.prototype.destroy = function () {
    this.alive = false;
    cancelAnimationFrame(this.raf);
    if (this.ro) this.ro.disconnect();
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    var ext = this.gl && this.gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
    this.gl = null;
  };

  window.NexoraHannahFace = function (container, opts) {
    var f = new Face(container, opts);
    if (/[?&]hannahdebug\b/.test(location.search)) window.__hannahFace = f; // for checking expressions in the console
    return f;
  };
})();
