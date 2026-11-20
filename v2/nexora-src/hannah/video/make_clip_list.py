"""
Every sentence Hannah can say, as a numbered clip list for the video notebook.

It follows hannah-brain.js exactly: greetings, each topic answer + its follow-up question, each role
answer + follow-up, every small-talk answer, every reply in replies.*, and the navigation lines
("Of course, opening {label}") for every place in the navigation list.

Run:  python3 make_clip_list.py
Writes clips.json here: [{"id", "key": what she says (the website looks the clip up by it),
"text": what the chat shows ({name} filled in there), "say": what the voice reads}]
Upload clips.json to the notebook. After editing hannah-knowledge.json, run it again: unchanged
sentences keep their id, so only new or changed ones need a new video.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
# python3 make_clip_list.py [knowledge.json]   (default: the site's hannah-knowledge.json)
KB = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', '..', '..', 'public', 'nexora', 'hannah-knowledge.json')
OUT = os.path.join(HERE, 'clips.json')

kb = json.load(open(KB))
lines = []

def add(t):
    t = re.sub(r'\s+', ' ', (t or '')).strip()
    if t and t not in lines:
        lines.append(t)

def answer(body, follow):
    return body + (' ' + follow['ask'] if follow and follow.get('ask') else '')

g = kb.get('greeting', {})
add(g.get('first')); add(g.get('returning'))
rep = kb.get('replies', {})
MORE_ASK = rep.get('moreAsk') or 'Would you like to hear more?'
for t in kb.get('topics', []):
    # a little at a time: each piece but the last asks "would you like to hear more?"
    pieces = [t.get('answer', '')] + list(t.get('more') or [])
    for i, piece in enumerate(pieces):
        add(answer(piece, {'ask': MORE_ASK} if i < len(pieces) - 1 else t.get('followUp')))
for r in kb.get('roles', {}).values():
    add(answer(r.get('answer', ''), r.get('followUp')))
for st in kb.get('smallTalk', []):
    for a in st.get('answers', []):
        add(a)
for k in ['offTopic', 'confused', 'unknownNexora', 'notUnderstood', 'noThanks', 'yesNothing', 'languageUnknown', 'langSwitched']:
    v = rep.get(k)
    for a in ([v] if isinstance(v, str) else (v or [])):
        add(a)
nav = rep.get('navigate', {})
for n in kb.get('navigation', []):
    line = nav.get(n['action']['type']) or 'Of course.'
    add(line.replace('{label}', n['label']))
if nav.get('enter'):
    add(nav['enter'].replace('{label}', 'the website'))
# onboarding, guided tour and lead questions
for k, v in kb.get('onboarding', {}).items():
    if not k.startswith('_'): add(v)
tour = kb.get('tour', {})
for st in tour.get('steps', []):
    add(st['say'])
for k in ['finish', 'stopped']:
    add(tour.get(k))
for k, v in kb.get('lead', {}).items():
    if not k.startswith('_'): add(v)

def spoken(t):
    # same as spokenKey() in hannah-brain.js: a leading {name} is her separate name clip; anywhere
    # else the name is shown in the chat only. Her video says the line without it.
    k = re.sub(r'^\{name\}[,!]?\s*', '', t)
    k = re.sub(r'\s+', ' ', re.sub(r',?\s*\{name\}', '', k)).strip()
    return k[:1].upper() + k[1:]

def sayable(t):
    # same rules as hannah-voice.js, so the voice reads it naturally
    t = re.sub(r'([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+)\.([a-z]{2,})', r'\1 at \2 dot \3', t)
    t = re.sub(r'\s*&\s*', ' and ', t)
    return re.sub(r'(\d)\+', r'\1 plus', t)

# keep ids stable across runs
old = {}
if os.path.exists(OUT):
    for c in json.load(open(OUT)):
        old[c.get('key', c['text'])] = c['id']
used = set(old.values())
n = max([int(i[1:]) for i in used] + [0])
clips = []
for t in lines:
    key = spoken(t)                       # what she actually says; the website looks clips up by this
    if key in old:
        cid = old[key]
    else:
        n += 1
        cid = 'c%03d' % n
    clips.append({'id': cid, 'key': key, 'text': t, 'say': sayable(key)})
json.dump(clips, open(OUT, 'w'), indent=1, ensure_ascii=False)
print(len(clips), 'clips,', sum(len(c['say']) for c in clips), 'characters ->', OUT)
