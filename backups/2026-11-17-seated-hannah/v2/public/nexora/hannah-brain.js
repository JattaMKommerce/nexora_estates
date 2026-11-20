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
 * window.NexoraHannahBrain(kb) → { greeting(mode), reply(text) → { text, action, mood } }
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
    build: 1, call: 1, who: 1, help: 1, explore: 1, inside: 1, store: 1, data: 1, number: 1, reach: 1, log: 1,
    nexora: 1, platform: 1, company: 1, software: 1 };  // nearly every question names Nexora: it can't decide the topic alone
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

  function Brain(kb) {
    this.kb = kb;
    this.state = { pending: null, askedRole: false, role: null, last: {}, lastTopic: null, turns: 0 };
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
    return mode === 'return' && g.returning ? g.returning : (g.first || 'Hello and welcome to Nexora! How can I help you today?');
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

  Brain.prototype.topicReply = function (t) {
    this.state.lastTopic = t.id;
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
      return { text: this.pick('unknownNexora', rep.unknownNexora), mood: 'apologetic' };
    }
    if (words.length === 1) {
      return { text: this.pick('notUnderstood', rep.notUnderstood), mood: 'apologetic' };
    }
    // her redirect asks whether they'd like to see what Nexora does: a "yes" answers that
    st.pending = { topic: 'what-is-nexora' };
    return { text: this.pick('offTopic', rep.offTopic), mood: 'happy' };
  };

  window.NexoraHannahBrain = function (kb) { return new Brain(kb); };
})();
