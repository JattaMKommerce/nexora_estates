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
 * Speech drives the mouth through setMouthSource(fn): fn(now) returns viseme weights
 * { v: { aa, E, I, O, U, PP, FF, TH, DD, kk, CH, SS, RR, sil }, energy, accent, question } from
 * hannah-voice.js. The visemes are blended into one mouth pose (jaw, lip closure, rounding,
 * spreading, lower lip to teeth), the real loudness of her voice scales the jaw, and every control
 * is moved by a critically damped spring, so shapes flow and never snap or stay open.
 *
 * Life when not speaking: noise-driven head drift (never repeating), breathing in the chest and
 * shoulders, asymmetric blinks (fast close, slower open, sometimes double or half), saccades and
 * glances, a drifting resting micro-smile, a listening tilt; while speaking, nods and brow lifts
 * on stressed syllables and raised brows on questions.
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
  var SHAPES = ['jaw', 'close', 'round', 'wide', 'fv', 'relax', 'blink', 'browUp', 'browInner'];

  // Each viseme (Oculus / ARKit naming) as a mouth pose: [jaw open, lips closed, lips rounded,
  // lips spread, lower lip to upper teeth]. Speech gives weights per viseme; the face blends them.
  var POSE = {
    sil: [0, 0.12, 0, 0, 0],
    PP: [0.02, 1, 0, 0, 0],
    FF: [0.07, 0, 0, 0.12, 1],
    TH: [0.18, 0, 0, 0.12, 0],
    DD: [0.24, 0, 0, 0.15, 0],
    nn: [0.16, 0, 0, 0.12, 0],
    kk: [0.28, 0, 0, 0.05, 0],
    CH: [0.18, 0, 0.6, 0, 0],
    SS: [0.1, 0.04, 0, 0.5, 0],
    RR: [0.2, 0, 0.45, 0, 0],
    aa: [0.86, 0, 0, 0.1, 0],
    E: [0.5, 0, 0, 0.5, 0],
    I: [0.26, 0, 0, 0.75, 0],
    O: [0.6, 0, 0.7, 0, 0],
    U: [0.22, 0, 1, 0, 0]
  };
  var MOUTH = ['jaw', 'close', 'round', 'wide', 'fv'];
  // spring stiffness per mouth control (rad/s): lips are quick, the jaw is heavier
  var MOUTH_W = { jaw: 30, close: 46, round: 24, wide: 24, fv: 40 };

  function poseFrom(m) {
    var p = [0, 0, 0, 0, 0], tot = 0, k, i;
    if (!m || !m.v) return p;
    for (k in m.v) {
      var w = m.v[k];
      if (!(w > 0)) continue;
      var q = POSE[k] || POSE.sil;
      for (i = 0; i < 5; i++) p[i] += q[i] * w;
      tot += w;
    }
    if (tot > 1) { for (i = 0; i < 5; i++) p[i] /= tot; }
    else if (tot < 1) { for (i = 0; i < 5; i++) p[i] += POSE.sil[i] * (1 - tot); }
    // real audio: how loud she is right now decides how far the jaw actually opens
    if (m.energy != null) {
      p[0] *= 0.32 + 0.9 * m.energy;
      if (m.energy < 0.05) p[0] *= 0.4;
    }
    return p;
  }

  // smooth 1D gradient noise: motion that never repeats, unlike sums of sines
  function Noise(seed) {
    var g = new Float32Array(512), s = seed;
    for (var i = 0; i < 512; i++) { s = (s * 16807) % 2147483647; g[i] = (s / 2147483647) * 2 - 1; }
    return function (x) {
      var j = Math.floor(x), f = x - j, a = g[j & 511], b = g[(j + 1) & 511];
      var u = f * f * f * (f * (f * 6 - 15) + 10);
      return (a * f * (1 - u) + b * (f - 1) * u) * 2;
    };
  }
  function fbm(n, x) { return n(x) * 0.65 + n(x * 2.13 + 17.1) * 0.25 + n(x * 4.7 + 41.3) * 0.1; }

  // Expression targets for each mood. relax 0 = her photo's full smile; 1 = a calm, closed smile.
  var MOODS = {
    idle:       { relax: 0.3,  browUp: 0,    browInner: 0,    gx: 0,    gy: 0,    tilt: 0 },
    welcome:    { relax: 0,    browUp: 0.45, browInner: 0,    gx: 0,    gy: 0,    tilt: 0.012 },
    listening:  { relax: 0.35, browUp: 0.15, browInner: 0,    gx: 0,    gy: 0,    tilt: 0.02 },
    thinking:   { relax: 0.65, browUp: 0.1,  browInner: 0.45, gx: -2.6, gy: -2.2, tilt: -0.014 },
    speaking:   { relax: 0.4,  browUp: 0.1,  browInner: 0,    gx: 0,    gy: 0,    tilt: 0.006 },
    happy:      { relax: 0,    browUp: 0.3,  browInner: 0,    gx: 0,    gy: 0,    tilt: 0.014 },
    apologetic: { relax: 0.6,  browUp: 0,    browInner: 0.7,  gx: 0,    gy: 0.6,  tilt: -0.01 }
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
    var P = R.points, N = P.length;
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
    var JAW = 21;

    for (var i = 0; i < N; i++) {
      if (i >= 468) continue; // iris points only follow the head
      var x = P[i][0], y = P[i][1], o = i * 2;
      var u = (x - cx) / W, au = Math.abs(u), sg = u < 0 ? -1 : 1;
      var dm = y - mid(x);

      // jaw: everything below the lip line drops; the mouth corners and jaw angles follow less
      var below = smooth(-1.5, 3, dm);
      var prof = au < 1 ? lerp(1, 0.42, au * au) : 0.42 * (1 - smooth(1, 2.4, au));
      D.jaw[o + 1] = JAW * below * prof;

      // close: the lips meet (M, B, P); the upper lip does most of the travel over the teeth
      var g = gap(x);
      if (dm < 0) {
        var du = iu(clampX(x)) - y;
        D.close[o + 1] = 0.58 * g * (du <= 0 ? 1 : Math.exp(-du / 16));
      } else {
        var dl = y - il(clampX(x));
        D.close[o + 1] = -0.42 * g * (dl <= 0 ? 1 : Math.exp(-dl / 20));
        // fv (F, V): only the lower lip rises to touch the upper teeth
        D.fv[o + 1] = -0.8 * g * (dl <= 0 ? 1 : Math.exp(-dl / 14)) * (1 - smooth(0.85, 1.3, au));
      }

      // relax: mouth corners come in and down, the upper lip covers more of the teeth
      var c = smooth(0.3, 1.0, au) * (1 - smooth(1.7, 2.8, au));
      var vy = y - mid(x), vf = Math.exp(-(vy * vy) / (55 * 55));
      D.relax[o] = -sg * 7 * c * vf;
      D.relax[o + 1] = 4.5 * c * vf;
      if (dm < 0) {
        var du2 = iu(clampX(x)) - y;
        D.relax[o + 1] += 4 * (1 - smooth(0.35, 1.0, au)) * (du2 <= 0 ? 1 : Math.exp(-du2 / 18));
      } else if (au < 1) {
        var dl2 = y - il(clampX(x));
        D.relax[o + 1] -= 1.5 * (1 - au) * (dl2 <= 0 ? 1 : Math.exp(-dl2 / 20));
      }

      // round (O, U, W) and wide (E, I, S): the corners move in or out along the lip band
      var band = Math.exp(-(dm * dm) / (40 * 40)) * (1 - smooth(1.3, 2.4, au));
      D.round[o] = -sg * 17 * smooth(0.1, 1.0, Math.min(au, 1)) * band;
      // pushed-out lips: the centre of each lip moves away from the other, the corners close in
      D.round[o + 1] = (dm < 0 ? -2.5 : 2.5) * (1 - Math.min(1, au)) * band + (dm < 0 ? 2 : -2) * smooth(0.6, 1, Math.min(au, 1)) * band;
      D.wide[o] = sg * 5 * smooth(0.2, 1.0, Math.min(au, 1)) * band;
      D.wide[o + 1] = -1.2 * c * band;

      for (var k = 0; k < 2; k++) {
        var e = eyes[k];
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
      var ex = (q[0] - hcx) / 390, ey = (q[1] - hcy) / 430;
      var w = 1 - smooth(0.85, 1.4, Math.sqrt(ex * ex + ey * ey));
      return w * (1 - smooth(chinY + 30, chinY + 140, q[1]));
    });

    // breathing: the chest and shoulders (below the chin, above the counter) rise and fall; the
    // edges of the warped area and the counter stay put so nothing tears
    var desk = R.desk || chinY + 200;
    var pxs = R.pins.map(function (q) { return q[0]; });
    var minX = Math.min.apply(null, pxs), maxX = Math.max.apply(null, pxs);
    var midX = (minX + maxX) / 2, half = Math.max(1, (maxX - minX) / 2);
    var bodyW = R.pins.map(function (q) {
      var wy = smooth(chinY - 10, chinY + 70, q[1]) * (1 - smooth(desk - 110, desk - 30, q[1]));
      var wx = 1 - smooth(0.7, 0.95, Math.abs(q[0] - midX) / half);
      return wy * wx;
    });

    return {
      D: D, P: P, N: N, pins: R.pins, pinW: pinW, bodyW: bodyW,
      pivot: [cx, chinY + 160], mouth: { cx: cx, W: W },
      eyes: EYES.map(function (e) {
        var c0 = P[e.iris], c1 = P[e.irisEdge];
        return { iris: e.iris, r: Math.max(6, Math.hypot(c1[0] - c0[0], c1[1] - c0[1])) };
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

  var FS_MOUTH = 'varying vec2 v_uv; varying vec2 v_pos; uniform sampler2D u_tex; uniform sampler2D u_teeth;' + HEAD +
    'uniform vec4 u_teethRect; uniform vec3 u_low; uniform float u_mx; uniform float u_mw; uniform float u_jaw;' +
    'void main(){' +
    ' vec2 p0 = unhead(v_pos);' +
    ' vec2 tuv = (p0 - u_teethRect.xy) / u_teethRect.zw;' +
    ' float inside = step(0.0, tuv.x) * step(0.0, tuv.y) * step(tuv.x, 1.0) * step(tuv.y, 1.0);' +
    ' float tm = texture2D(u_teeth, tuv).r * inside;' +
    ' vec3 teeth = texture2D(u_tex, p0 / u_plate).rgb;' +
    ' float dx = p0.x - u_mx; float r = abs(dx) / u_mw;' +
    ' float dl = (u_low.x*dx*dx + u_low.y*dx + u_low.z) - p0.y;' +
    ' float hx = 1.0 - smoothstep(0.55, 1.0, r);' +
    ' vec3 cav = mix(vec3(0.085, 0.03, 0.035), vec3(0.30, 0.11, 0.11), hx * 0.6);' +
    ' float open = clamp(u_jaw * 1.6, 0.0, 1.0);' +
    ' cav = mix(cav, vec3(0.56, 0.25, 0.25), smoothstep(15.0, 3.0, dl) * hx * 0.7 * open);' +
    ' float lt = smoothstep(0.4, 1.8, dl) * (1.0 - smoothstep(3.2, 6.0, dl)) * smoothstep(0.85, 0.4, r) * clamp(u_jaw * 2.5 - 0.3, 0.0, 0.8);' +
    ' cav = mix(cav, vec3(0.80, 0.76, 0.70), lt);' +
    ' gl_FragColor = vec4(mix(cav, teeth, tm), 1.0); }';

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
    this.cur = { jaw: 0, close: 0, round: 0, wide: 0, fv: 0, relax: 0.3, blink: 0, browUp: 0, browInner: 0, gx: 0, gy: 0, tilt: 0, acc: 0 };
    this.vel = { jaw: 0, close: 0, round: 0, wide: 0, fv: 0, gx: 0, gy: 0, acc: 0 };
    this.bl = { t: -1, next: 1.2, close: 0.07, hold: 0.03, open: 0.17, amp: 1 };
    this.nodT = -1;
    this.saccade = { x: 0, y: 0, next: 1.5 };
    this.nz = [Noise(11), Noise(23), Noise(37), Noise(53), Noise(71)];
    this.breathPh = Math.random() * 6.28;
    this.breathPx = 0;
    this.accSide = 1;
    this.prevAcc = 0;
    this.wasSpeaking = false;

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
      .concat(IL.slice(1, -1).reverse().map(function (i) { return [P[i][0], P[i][1] - 1.5]; }));
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
    var fx = this.rig.P[1][0], fy = this.rig.P[168][1] + 60;
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
    if (Math.random() < 0.5) this.blink();
    this.mood = m;
  };
  Face.prototype.setMouthSource = function (fn) { this.mouthSource = fn; };
  Face.prototype.nod = function () { this.nodT = 0; };

  // a blink: the lid drops fast (accelerating), rests a moment, and lifts more slowly
  Face.prototype.blink = function (amp) {
    var b = this.bl;
    if (b.t >= 0) return;
    b.t = 0;
    b.close = 0.06 + Math.random() * 0.03;
    b.hold = 0.015 + Math.random() * 0.035;
    b.open = 0.13 + Math.random() * 0.09;
    b.amp = amp || (Math.random() < 0.14 ? 0.6 : 1);   // now and then a half blink
  };

  Face.prototype.frame = function (now) {
    // frame time in seconds, never negative (a frame stamped before the previous one would
    // otherwise kick the springs) and never huge (a hidden tab coming back)
    var dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = Math.max(this.last, now);
    var t = (now - this.t0) / 1000;
    var c = this.cur, v = this.vel, mood = MOODS[this.mood], nz = this.nz;
    var ease = function (k, target, tau) { c[k] += (target - c[k]) * (1 - Math.exp(-dt / tau)); };
    // critically damped spring: smooth in and out, never overshoots, never sticks
    var spring = function (k, target, w) {
      var n = Math.max(1, Math.ceil(dt / 0.008)), h = dt / n;
      for (var i = 0; i < n; i++) { v[k] += (w * w * (target - c[k]) - 2 * w * v[k]) * h; c[k] += v[k] * h; }
    };

    // 1. mouth: viseme weights → one pose, sprung like real articulators
    var m = this.mouthSource ? this.mouthSource(now) : null;
    var speaking = !!m;
    var pose = poseFrom(m);
    for (var q = 0; q < MOUTH.length; q++) {
      spring(MOUTH[q], pose[q], MOUTH_W[MOUTH[q]]);
      if (c[MOUTH[q]] < 0) c[MOUTH[q]] = 0;
    }
    var energy = m && m.energy != null ? m.energy : (speaking ? 0.5 : 0);

    // 2. stressed words: a small nod and a brow lift, alternating sides
    var accT = m ? m.accent || 0 : 0;
    if (accT > 0.6 && this.prevAcc < 0.3) {
      this.accSide = Math.random() < 0.5 ? -1 : 1;
      if (Math.random() < 0.15) this.blink();
    }
    this.prevAcc = accT;
    spring('acc', accT, 13);
    if (this.wasSpeaking && !speaking && Math.random() < 0.4) this.blink(); // a blink as she finishes
    this.wasSpeaking = speaking;

    // 3. expression: a warm resting micro-smile that drifts a little; brows lift on stress and questions
    ease('relax', mood.relax + (speaking ? 0.12 : 0) + 0.07 * fbm(nz[0], t * 0.07 + 100), 0.5);
    ease('browUp', mood.browUp + 0.38 * Math.max(0, c.acc) + (m && m.question ? 0.35 : 0) + 0.05 * fbm(nz[4], t * 0.3), 0.12);
    ease('browInner', mood.browInner, 0.35);
    ease('tilt', mood.tilt, 0.6);

    // 4. gaze: fast saccades between fixations; while talking an occasional glance away and back
    var sc = this.saccade;
    sc.next -= dt;
    if (sc.next <= 0) {
      var ox = sc.x, oy = sc.y, r = function (a) { return (Math.random() * 2 - 1) * a; };
      if (this.mood === 'thinking') { sc.x = r(0.9); sc.y = r(0.5); sc.next = 0.8 + Math.random() * 1.4; }
      else if (speaking && Math.random() < 0.16) {
        sc.x = (Math.random() < 0.5 ? -1 : 1) * (1.1 + Math.random() * 0.8); sc.y = r(0.4); sc.next = 0.35 + Math.random() * 0.5;
      } else if (speaking) { sc.x = r(0.35); sc.y = r(0.22); sc.next = 0.5 + Math.random() * 1.2; }
      else if (this.mood === 'listening') { sc.x = r(0.22); sc.y = r(0.15); sc.next = 0.7 + Math.random() * 1.5; }
      else { sc.x = r(0.55); sc.y = r(0.33); sc.next = 0.6 + Math.random() * 2.4; }
      if (Math.hypot(sc.x - ox, sc.y - oy) > 0.8 && Math.random() < 0.35) this.blink();
    }
    spring('gx', mood.gx + sc.x, 38);
    spring('gy', mood.gy + sc.y, 38);

    // 5. blinks every ~2.4-5.6 s, sometimes double; the lids follow the eyes down a touch
    var b = this.bl, blink = 0;
    if (b.t >= 0) {
      b.t += dt;
      var T1 = b.close, T2 = T1 + b.hold, T3 = T2 + b.open;
      if (b.t < T1) { var x1 = b.t / T1; blink = x1 * x1; }
      else if (b.t < T2) blink = 1;
      else if (b.t < T3) { var y1 = 1 - (b.t - T2) / b.open; blink = y1 * y1; }
      else { blink = 0; b.t = -1; b.next = Math.random() < 0.12 ? 0.16 : 2.4 + Math.random() * 3.2; }
      blink *= b.amp;
    } else {
      b.next -= dt;
      if (b.next <= 0) this.blink();
    }
    blink = Math.max(blink, Math.min(1, Math.max(0, c.gy / 2.6)) * 0.15);
    c.blink = this.debugBlink != null ? this.debugBlink : blink;

    // 6. breathing: a slow, slightly irregular rise of the chest and shoulders (shallower while talking)
    this.breathPh += dt * 2 * Math.PI / (4.0 + 0.7 * fbm(nz[3], t * 0.05)) * (speaking ? 0.85 : 1);
    var breath = (0.5 - 0.5 * Math.cos(this.breathPh)) * (speaking ? 0.6 : 1);
    this.breathPx = 1.8 * breath;

    // 7. head: layered noise drift, livelier with her voice; nods on stressed words and on request
    var act = speaking ? 1 + 0.9 * energy : (this.mood === 'listening' ? 0.6 : 1);
    var tx = 2.6 * fbm(nz[0], t * 0.21) * act;
    var ty = 1.6 * fbm(nz[1], t * 0.17) * act - 0.9 * breath;
    var rot = 0.009 * fbm(nz[2], t * 0.13) * act + c.tilt;
    if (speaking) {
      tx += 0.8 * fbm(nz[3], t * 0.9);
      rot += 0.003 * fbm(nz[4], t * 1.1);
      ty += c.jaw * 1.2;
    }
    ty += 3.4 * c.acc;
    rot += 0.0035 * c.acc * this.accSide;
    if (this.nodT >= 0) {
      this.nodT += dt;
      var nt = this.nodT / 0.75;
      if (nt >= 1) this.nodT = -1;
      else ty += 5 * Math.sin(Math.PI * nt) * (1 - nt * 0.3);
    }

    this.deform(c, tx, ty, rot);
    this.draw(c, tx, ty, rot);
  };

  Face.prototype.deform = function (c, tx, ty, rot) {
    var rig = this.rig, P = rig.P, N = rig.N, D = rig.D, pos = this.pos;
    var w = {
      jaw: c.jaw, close: Math.min(1, c.close), round: c.round, wide: c.wide, fv: Math.min(1, c.fv),
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
    for (i = 0; i < INNER_PAIRS.length; i++) {
      var a = INNER_PAIRS[i][0] * 2 + 1, b = INNER_PAIRS[i][1] * 2 + 1;
      if (pos[a] > pos[b] - 0.4) { var mid = (pos[a] + pos[b]) / 2; pos[a] = mid - 0.2; pos[b] = mid + 0.2; }
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
    var pins = rig.pins, lift = this.breathPx || 0;
    for (i = 0; i < pins.length; i++) {
      o = (N + i) * 2;
      var pw = rig.pinW[i], X = pins[i][0], Y = pins[i][1], by = -lift * rig.bodyW[i];
      if (pw <= 0) { pos[o] = X; pos[o + 1] = Y + by; continue; }
      var rx = X - px, ry = Y - py;
      pos[o] = X + (cs * rx - sn * ry + px + tx - X) * pw;
      pos[o + 1] = Y + (sn * rx + cs * ry + py + ty - Y) * pw + by;
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
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.teethTex);
    gl.uniform1i(pm.u.u_teeth, 1);
    gl.activeTexture(gl.TEXTURE0);
    var tr = this.teethRect;
    gl.uniform4f(pm.u.u_teethRect, tr[0], tr[1], tr[2], tr[3]);
    gl.uniform3f(pm.u.u_low, this.low[0], this.low[1], this.low[2]);
    gl.uniform1f(pm.u.u_mx, rig.mouth.cx);
    gl.uniform1f(pm.u.u_mw, rig.mouth.W);
    gl.uniform1f(pm.u.u_jaw, c.jaw);
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
