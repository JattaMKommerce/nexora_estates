/*
 * Hannah's conversation logic. Everything she says comes from hannah-knowledge.json: she never
 * makes up facts, prices or features. This file only decides WHICH knowledge-base answer fits.
 *
 * Order of decisions for each visitor message:
 *   1. a yes / no to the offer she just made ("Shall I open the demo form?")
 *   2. a request to go somewhere ("take me to construction", "open the demo form")
 *   3. who the visitor is (developer, home buyer, just exploring), when she has asked
 *   4. the best matching knowledge-base topic (phrases score high, single keywords lower)
 *   5. small talk (hello, thanks, how are you, are you real, goodbye)
 *   6. confusion → a simple explanation and three clear choices
 *   7. a Nexora question she has no answer for → a polite apology and the team's contact
 *   8. anything unrelated → a friendly acknowledgement and a way back to Nexora
 *
 * window.NexoraHannahBrain(kb) → { greeting(mode), reply(text) → { text, key, action, mood, tour, lead, fallback },
 *   tourNext(), tourEnd(), details(), clearPending() }
 * key: the exact sentence she says (her video clip); text: what the chat shows (with the visitor's name).
 * Onboarding (name → purpose → company), lead details (name → phone → email, each checked) and the
 * guided tour come from the 'onboarding', 'lead' and 'tour' sections of the knowledge base.
 * fallback: true marks steps 7 and 8, where hannah.js asks the AI (Groq, via /api/hannah.php) instead.
 */
(function () {
  'use strict';

  var CONTRACTIONS = {
    whats: 'what is', hows: 'how is', whos: 'who is', wheres: 'where is', thats: 'that is',
    im: 'i am', ive: 'i have', youre: 'you are', dont: 'do not', doesnt: 'does not', cant: 'can not',
    cannot: 'can not', wont: 'will not', isnt: 'is not', lets: 'let us', id: 'i would', ill: 'i will',
    wanna: 'want to', gonna: 'going to', u: 'you', r: 'are', ur: 'your', pls: 'please', plz: 'please',
    thx: 'thanks', ty: 'thank you'
  };
  var GENERIC = { use: 1, site: 1, website: 1, find: 1, app: 1, about: 1, product: 1, offer: 1, model: 1,
    build: 1, call: 1, who: 1, help: 1, explore: 1, inside: 1, store: 1, data: 1, number: 1, reach: 1, log: 1 };
  var YES = /^(yes|yeah|yea|yep|yup|sure|ok|okay|alright|all right|please|of course|absolutely|definitely|go ahead|sounds good|why not|let us do it|do it|great|perfect|yes please|sure thing|ya|haan|ha)\b/;
  var NO = /^(no|nope|nah|not now|not really|maybe later|later|no thanks|no thank you|do not|i do not think so|not yet)\b/;
  var CONFUSED = /\b(do not understand|confused|confusing|what do you mean|i am lost|lost|do not get it|not clear|too complicated|explain again|say that again|i do not know|not sure what|what should i do|huh|pardon)\b/;
  var NAV = /\b(take me|go to|goto|open|show me|navigate|jump to|bring me|let us see|i want to see|can i see|can you show|let me see|start the|start|enter|skip|visit|go into)\b/;

  function norm(s) {
    s = String(s || '').toLowerCase()
      .replace(/[‘’ʼ`]/g, "'")
      .replace(/'/g, '')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9+\- ]+/g, ' ')
      .replace(/\s+/g, ' ').trim();
    return s.split(' ').map(function (w) { return CONTRACTIONS[w] || w; }).join(' ');
  }
  function stem(w) {
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + 'y';
    if (w.length > 4 && /ed$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
    return w;
  }
  function stems(s) { return s ? s.split(' ').map(stem).join(' ') : ''; }
  function has(hay, needle) { return needle && (' ' + hay + ' ').indexOf(' ' + needle + ' ') >= 0; }

  /* Visitor details: checked before she accepts them ---------------------------------------- */

  var QWORD = /^(what|how|who|why|where|when|which|can|could|do|does|is|are|will|would|should|tell me|show me|explain)\b/;
  var DECLINE = /\b(skip|rather not|prefer not|do not want|not now|maybe later|later|no thanks|no thank you|not interested|private|none of your|wont tell|will not tell)\b/;
  var TOUR = /\b(tour|show me around|guide me|walk me through|take me around|how does this website work|how do i use|tutorial|show me how)\b/;
  var NOT_NAME = /^(hi+|hello|hey|hiya|yes|yeah|yep|ya|no|nope|ok|okay|sure|thanks|thank you|what|why|how|who|where|when|help|demo|price|pricing|nexora|tour|skip|fine|good|great|nothing|nobody|none|test|testing|hannah|namaste|good morning|good evening|good afternoon|sorry|maybe|later|cool|nice|wow|hmm+|bye|goodbye)$/;
  var NOT_NAME_START = /^(a|an|the|just|looking|here|from|with|interested|not|very|so|also|still|doing|feeling|fine|good|great)\b/;

  // "Priya", "my name is Priya Sharma", "I'm Rahul" → "Priya Sharma" (null if it isn't a name)
  function nameFrom(raw) {
    var t = String(raw || '').trim().replace(/[.!,]+$/, '');
    var m = t.match(/^(?:(?:hi|hello|hey)[\s,!]+)?(?:my name is|my names|my name's|i am|i'm|im|this is|it's|its|call me|name is|myself|name's)\s+(.+)$/i);
    var c = (m ? m[1] : t).replace(/\s+(here|this side)$/i, '').trim();
    if (!/^[A-Za-zÀ-ɏऀ-ॿ][A-Za-zÀ-ɏऀ-ॿ .'-]{0,38}$/.test(c)) return null;
    if (c.split(/\s+/).length > 3) return null;
    var n = norm(c);
    if (NOT_NAME.test(n) || NOT_NAME_START.test(n)) return null;
    return c.split(/\s+/).map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  }
  // 10-digit Indian mobile (with or without +91 / 0) or any number with a country code
  function phoneFrom(raw) {
    var t = String(raw || '').replace(/[\s().\-]/g, '');
    var m = t.match(/\+?\d{7,15}/);
    if (!m) return null;
    var d = m[0];
    if (/^(\+?91|0)?[6-9]\d{9}$/.test(d)) return '+91 ' + d.slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2');
    if (/^\+\d{8,15}$/.test(d)) return d;
    return null;
  }
  function emailFrom(raw) {
    var m = String(raw || '').trim().match(/^[^\s@<>(),;:]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/);
    return m ? m[0].toLowerCase() : null;
  }

  function Brain(kb) {
    this.kb = kb;
    this.state = { pending: null, askedRole: false, role: null, last: {}, lastTopic: null, turns: 0,
      stage: null, lead: null, tour: -1, nameTries: 0, data: {} };
    var self = this;
    // pre-normalise the knowledge base once
    (kb.topics || []).forEach(function (t) {
      t._phrases = (t.phrases || []).map(function (p) { var n = norm(p); return { n: n, s: stems(n) }; });
      t._keys = (t.keywords || []).map(function (k) { var n = norm(k); return { n: n, s: stems(n), w: GENERIC[n] ? 0.5 : 1 }; });
    });
    (kb.navigation || []).forEach(function (nv) { nv._names = (nv.names || []).map(norm); });
    (kb.smallTalk || []).forEach(function (st) { st._phrases = (st.phrases || []).map(norm); });
    var roles = kb.roles || {};
    Object.keys(roles).forEach(function (r) { roles[r]._keys = (roles[r].keywords || []).map(norm); });
    this.domain = {};
    (kb.domainWords || []).forEach(function (w) { self.domain[stem(norm(w))] = 1; });
    this.topicById = {};
    (kb.topics || []).forEach(function (t) { self.topicById[t.id] = t; });
  }

  // pick a line from a list, never the same one twice in a row
  Brain.prototype.pick = function (key, list) {
    if (typeof list === 'string') return list;
    if (!list || !list.length) return '';
    var last = this.state.last[key], i;
    do { i = Math.floor(Math.random() * list.length); } while (list.length > 1 && i === last);
    this.state.last[key] = i;
    return list[i];
  };

  Brain.prototype.greeting = function (mode) {
    var g = this.kb.greeting || {};
    this.state.pending = null;
    if (mode === 'return' && g.returning) return g.returning;
    if (this.kb.onboarding) this.state.stage = 'name';   // she asks their name first
    return g.first || 'Hello and welcome to Nexora! How can I help you today?';
  };

  // an answer plus its follow-up offer, which becomes the pending yes/no question
  Brain.prototype.answer = function (body, followUp, mood, action) {
    var text = body;
    this.state.pending = null;
    if (followUp && followUp.ask) {
      text += ' ' + followUp.ask;
      if (followUp.action || followUp.topic) this.state.pending = followUp;
      else this.state.askedRole = /developer|buyer|looking for a home|exploring/i.test(followUp.ask) || this.state.askedRole;
    }
    return { text: text, mood: mood || 'speaking', action: action || null };
  };

  Brain.prototype.go = function (action, label) {
    var r = (this.kb.replies || {}).navigate || {};
    this.state.pending = null;
    if (action.type === 'none') return null;
    var line = action.type === 'phase' ? r.phase : action.type === 'panel' ? r.panel : r.enter;
    if (!label) {
      var nav = (this.kb.navigation || []).filter(function (n) {
        return n.action.type === action.type && n.action.phase === action.phase && n.action.panel === action.panel;
      })[0];
      label = nav ? nav.label : 'that';
    }
    return { text: (line || 'Of course.').replace('{label}', label), mood: 'happy', action: action };
  };

  // a line that may contain {name}: the chat shows the name, her video says the line without it
  Brain.prototype.line = function (tpl, extra) {
    var name = this.state.data.name && this.state.data.name.split(' ')[0];   // first name in the chat
    tpl = String(tpl || '');
    var key = tpl.replace(/,?\s*\{name\}/g, '').replace(/\s+/g, ' ').trim();
    var r = { text: name ? tpl.replace(/\{name\}/g, name) : key, key: key, mood: 'speaking' };
    if (extra) Object.keys(extra).forEach(function (k) { r[k] = extra[k]; });
    return r;
  };

  Brain.prototype.roleOf = function (n) {
    var roles = this.kb.roles || {}, hit = null;
    Object.keys(roles).forEach(function (r) {
      if (!hit) (roles[r]._keys || []).forEach(function (k) { if (!hit && has(n, k)) hit = r; });
    });
    return hit;
  };

  // the first steps of a visit: name → what brings them here → (developers) company and role
  Brain.prototype.onboard = function (raw, n, words, question, declines) {
    var st = this.state, ob = this.kb.onboarding || {};
    if (st.stage === 'name') {
      if (declines) { st.stage = 'purpose'; return this.line(ob.nameSkipped); }
      var nm = question ? null : nameFrom(raw);
      if (nm && !this.roleOf(norm(nm))) { st.data.name = nm; st.stage = 'purpose'; return this.line(ob.niceToMeet, { mood: 'happy' }); }
      // a question or a request instead of a name: answer it, and ask for the name later
      if (question || words.length > 3 || this.roleOf(n)) { st.stage = null; return null; }
      if (++st.nameTries >= 2) { st.stage = 'purpose'; return this.line(ob.nameSkipped); }
      return this.line(ob.askNameAgain, { mood: 'apologetic' });
    }
    if (st.stage === 'purpose') {
      if (question) { st.stage = null; return null; }
      st.data.purpose = String(raw).slice(0, 200);
      var role = this.roleOf(n);
      if (role === 'developer') { st.data.role = role; st.stage = 'company'; return this.line(ob.askCompany, { mood: 'happy' }); }
      st.stage = null;
      if (role === 'buyer') { st.data.role = role; st.pending = { tour: true }; return this.line(ob.buyerTour, { mood: 'happy' }); }
      if (role === 'explorer' || declines) { st.data.role = 'explorer'; st.pending = { tour: true }; return this.line(ob.explorerTour); }
      return null;   // something else: she answers it normally (what they said is kept as their purpose)
    }
    if (st.stage === 'company') {
      st.stage = null;
      if (question) return null;
      st.data.company = String(raw).trim().slice(0, 120);
      st.pending = { tour: true };
      return this.line(ob.companyThanks, { mood: 'happy' });
    }
    return null;
  };

  // lead details for a demo: name (if not given yet) → phone → email, each checked
  Brain.prototype.leadStart = function () {
    var st = this.state, ld = this.kb.lead || {};
    st.stage = null;
    if (!st.data.name) { st.lead = 'name'; return this.line(ld.startNoName, { mood: 'happy' }); }
    st.lead = 'phone';
    return this.line(ld.start, { mood: 'happy' });
  };
  Brain.prototype.leadInput = function (raw, n, words, question, declines) {
    var st = this.state, ld = this.kb.lead || {}, ob = this.kb.onboarding || {};
    if (declines || (NO.test(n) && words.length <= 4)) { st.lead = null; return this.line(ld.declined, { mood: 'listening' }); }
    if (st.lead === 'name') {
      var nm = nameFrom(raw);
      if (nm) { st.data.name = nm; st.lead = 'phone'; return this.line(ld.askPhone); }
      if (question) return null;
      return this.line(ob.askNameAgain, { mood: 'apologetic' });
    }
    if (st.lead === 'phone') {
      var ph = phoneFrom(raw);
      if (ph) { st.data.phone = ph; st.lead = 'email'; return this.line(ld.askEmail); }
      if (question && !/\d/.test(raw)) return null;
      return this.line(ld.badPhone, { mood: 'apologetic' });
    }
    if (st.lead === 'email') {
      var em = emailFrom(raw);
      if (em) {
        st.data.email = em;
        st.lead = null;
        var r = this.line(ld.done, { mood: 'happy', action: { type: 'panel', panel: 'Contact' } });
        r.lead = this.details();
        return r;
      }
      if (question && raw.indexOf('@') < 0) return null;
      return this.line(ld.badEmail, { mood: 'apologetic' });
    }
    return null;
  };
  Brain.prototype.details = function () {
    var d = this.state.data, out = {};
    Object.keys(d).forEach(function (k) { out[k] = d[k]; });
    return out;
  };

  // the guided tour: one step per phase; the website moves there while she explains it
  Brain.prototype.tourStep = function (i) {
    var st = this.state, steps = ((this.kb.tour || {}).steps) || [];
    st.stage = null;
    if (i >= steps.length) return this.tourFinish();
    st.tour = i;
    var last = i === steps.length - 1;
    st.pending = last ? { tourDone: true } : { tourNext: true };
    return this.line(steps[i].say, { mood: i === 0 ? 'happy' : 'speaking', tour: { step: i, phase: steps[i].phase, last: last } });
  };
  Brain.prototype.tourFinish = function () {
    var st = this.state;
    st.tour = -1;
    st.pending = st.data.phone ? null : { leadOffer: true };
    return this.line((this.kb.tour || {}).finish, { mood: 'happy', tour: { finish: true } });
  };
  Brain.prototype.tourStop = function () {
    this.state.tour = -1;
    this.state.pending = null;
    return this.line((this.kb.tour || {}).stopped, { mood: 'listening', tour: { stop: true } });
  };
  // the tour's Next / End buttons
  Brain.prototype.tourNext = function () {
    return this.state.pending && this.state.pending.tourDone ? this.tourFinish() : this.tourStep(this.state.tour + 1);
  };
  Brain.prototype.tourEnd = function () { return this.tourStop(); };

  Brain.prototype.topicReply = function (t) {
    this.state.lastTopic = t.id;
    // asking for a demo starts the lead questions (until we have their phone number)
    if (t.id === 'demo' && this.kb.lead && !this.state.data.phone) return this.leadStart();
    return this.answer(t.answer, t.followUp, 'speaking');
  };

  Brain.prototype.reply = function (raw) {
    var kb = this.kb, st = this.state, rep = kb.replies || {};
    var n = norm(raw);
    st.turns++;
    if (!n) return { text: this.pick('notUnderstood', rep.notUnderstood), mood: 'apologetic' };
    var s = stems(n);
    var words = n.split(' ');
    var self = this;

    var question = /\?/.test(raw) || QWORD.test(n);
    var declines = DECLINE.test(n);

    // 0a. her own offers: the guided tour, the next tour step, taking their details
    var po = st.pending;
    if (po && (po.tour || po.tourNext || po.tourDone || po.leadOffer) && words.length <= 6) {
      if (NO.test(n) || declines) {
        st.pending = null;
        if (po.tourNext || po.tourDone) return this.tourStop();
        if (po.tour) return this.line((kb.onboarding || {}).tourDeclined, { mood: 'listening' });
        return this.line((kb.lead || {}).declined, { mood: 'listening' });
      }
      if (YES.test(n) || /^(next|continue|go on|carry on|go ahead|lets go|let us go|ok next)\b/.test(n)) {
        st.pending = null;
        if (po.tourNext || po.tourDone) return this.tourNext();
        if (po.tour) return this.tourStep(0);
        return this.leadStart();
      }
    }
    // 0b. their details, while she is asking for them
    if (st.lead) { var lr = this.leadInput(raw, n, words, question, declines); if (lr) return lr; }
    // 0c. the first steps of the visit
    if (st.stage) { var or = this.onboard(raw, n, words, question, declines); if (or) return or; }
    // 0d. "give me a tour", "show me around"
    if (kb.tour && TOUR.test(n) && !/virtual tour/.test(n)) return this.tourStep(0);

    // 1. yes / no to her last offer
    var pending = st.pending;
    if (pending && words.length <= 6) {
      if (NO.test(n)) { st.pending = null; return { text: this.pick('noThanks', rep.noThanks), mood: 'listening' }; }
      if (YES.test(n)) {
        st.pending = null;
        if (pending.action) return this.go(pending.action);
        if (pending.topic && this.topicById[pending.topic]) return this.topicReply(this.topicById[pending.topic]);
      }
    }

    // 2. "take me to …" / "open …" / "enter"
    if (NAV.test(n)) {
      var best = null, bestLen = 0;
      (kb.navigation || []).forEach(function (nv) {
        nv._names.forEach(function (name) { if (has(n, name) && name.length > bestLen) { best = nv; bestLen = name.length; } });
      });
      if (best) return this.go(best.action, best.label);
      if (/^(enter|skip|enter nexora|let us go|go in)$/.test(n)) return this.go({ type: 'enter' }, 'the website');
    }

    // 3. who the visitor is
    var roles = kb.roles || {}, roleHit = null;
    Object.keys(roles).forEach(function (r) {
      if (roleHit) return;
      roles[r]._keys.forEach(function (k) { if (!roleHit && has(n, k)) roleHit = r; });
    });
    if (roleHit && (st.askedRole || /\b(i am|we are|i work|my company|our company|as a)\b/.test(n) || words.length <= 5)) {
      st.role = roleHit;
      st.askedRole = false;
      var ro = roles[roleHit];
      return this.answer(ro.answer, ro.followUp, 'happy');
    }

    // 4. knowledge-base topics
    var top = null, topScore = 0;
    (kb.topics || []).forEach(function (t) {
      var score = 0, ph = 0;
      t._phrases.forEach(function (p) { if (ph < 2 && (has(n, p.n) || has(s, p.s))) { score += 3; ph++; } });
      var seen = {};
      t._keys.forEach(function (k) {
        if (seen[k.s]) return;
        if (has(n, k.n) || has(s, k.s)) { score += k.w; seen[k.s] = 1; }
      });
      if (score > topScore) { topScore = score; top = t; }
    });
    // one specific keyword is enough; generic words (site, use, app…) count half
    var threshold = 1;

    // 5. small talk, when it is the whole message (or there is no topic)
    var talk = null;
    (kb.smallTalk || []).forEach(function (stt) {
      stt._phrases.forEach(function (p) {
        if (talk) return;
        var whole = n === p || n.indexOf(p + ' ') === 0 && words.length <= p.split(' ').length + 2;
        if (whole || (has(n, p) && topScore < threshold && p.split(' ').length > 1)) talk = stt;
      });
    });
    if (talk && (topScore < 3 || talk.id === 'are-you-ai')) {
      st.pending = null;
      if (talk.askRole) st.askedRole = true;
      if (talk.id === 'capabilities' || talk.id === 'who-are-you') st.askedRole = false;
      var out = { text: this.pick('talk-' + talk.id, talk.answers), mood: talk.id === 'bye' || talk.id === 'thanks' ? 'happy' : 'welcome' };
      if (talk.id === 'bye') out.end = true;
      return out;
    }
    if (top && topScore >= threshold) return this.topicReply(top);

    // 6. confusion
    if (CONFUSED.test(n) || n === 'what' || n === 'help' || n === 'help me') {
      st.pending = null;
      return { text: this.pick('confused', rep.confused), mood: 'listening' };
    }

    // a bare "yes" with nothing pending
    if (YES.test(n) && words.length <= 3) {
      return { text: this.pick('capabilities', ['Great! What would you like to know about Nexora? I can explain how it works, show you around, or help you book a demo.']), mood: 'happy' };
    }
    if (NO.test(n) && words.length <= 3) {
      return { text: this.pick('noThanks', rep.noThanks), mood: 'listening' };
    }

    // 7 / 8. Nexora question without an answer, or something unrelated
    st.pending = null;
    var related = n.split(' ').concat(s.split(' ')).some(function (w) { return self.domain[w] || self.domain[stem(w)]; });
    if (related) {
      st.pending = { action: { type: 'panel', panel: 'Contact' } };
      return { text: this.pick('unknownNexora', rep.unknownNexora), mood: 'apologetic', fallback: true };
    }
    if (words.length === 1) {
      return { text: this.pick('notUnderstood', rep.notUnderstood), mood: 'apologetic' };
    }
    // her redirect asks whether they'd like to see what Nexora does: a "yes" answers that
    st.pending = { topic: 'what-is-nexora' };
    return { text: this.pick('offTopic', rep.offTopic), mood: 'happy', fallback: true };
  };

  // the AI answered instead of the knowledge base: forget the offer the local answer would have made
  Brain.prototype.clearPending = function () { this.state.pending = null; };

  window.NexoraHannahBrain = function (kb) { return new Brain(kb); };
})();
