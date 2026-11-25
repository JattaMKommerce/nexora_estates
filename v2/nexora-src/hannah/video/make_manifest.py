"""
Writes the website's list of Hannah's clips: v2/public/nexora/hannah/video/manifest.json

  clips: what she says (clips.json "key") → c###.mp4
  names: every spelling of a visitor's name (names.json key + aliases, lower case) → names/n####.mp4

Only clips whose file is really in the video folder are listed, so a missing clip never breaks her:
she simply shows that sentence in writing (or leaves the name out).

Run after adding clips:  python3 make_manifest.py
"""
import json, os, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
VIDEO = os.path.join(HERE, '..', '..', '..', 'public', 'nexora', 'hannah', 'video')

def has(f):
    return os.path.exists(os.path.join(VIDEO, f))

def lower(s):
    # same rule as nameKey() in hannah-video.js: lower case, ँ as ं, no nukta
    return unicodedata.normalize('NFC', s.strip().lower()).replace('\u093c', '').replace('\u0901', '\u0902')

clips = json.load(open(os.path.join(HERE, 'clips.json')))
names = json.load(open(os.path.join(HERE, 'names.json')))
m = {'idle': 'idle.mp4', 'poster': 'poster.jpg', 'clips': {}, 'names': {}}
missing = []
for c in clips:
    f = c['id'] + '.mp4'
    if has(f): m['clips'][c['key']] = f
    else: missing.append(c['id'])
for n in names:
    if not has(n['file']):
        missing.append(n['id']); continue
    for k in [n['key']] + n.get('aliases', []):
        m['names'].setdefault(lower(k), n['file'])
json.dump(m, open(os.path.join(VIDEO, 'manifest.json'), 'w'), ensure_ascii=False, indent=1)

# other languages: nexora/hannah/video/<code>/ holds c###.mp4 for the same sentences (see ../lang/make_lang.py)
LANG_DIR = os.path.join(HERE, '..', 'lang')
PACKS = os.path.join(VIDEO, '..', '..', 'hannah-lang')
ready, packs, notes = ['en'], [], []
for f in sorted(os.listdir(LANG_DIR)):
    if not f.endswith('_clips.json'): continue
    code = f[:-len('_clips.json')]
    if os.path.exists(os.path.join(PACKS, code + '.json')): packs.append(code)
    jobs = json.load(open(os.path.join(LANG_DIR, f)))
    lm = {'clips': {}}
    for j in jobs:
        # a clip in this language's own folder, or one it shares (Urdu speaks with the Hindi videos)
        if has(j['file']):
            lm['clips'][j['key']] = os.path.basename(j['file']) if j['file'].startswith(code + '/') else '../' + j['file']
    if lm['clips']:
        os.makedirs(os.path.join(VIDEO, code), exist_ok=True)
        json.dump(lm, open(os.path.join(VIDEO, code, 'manifest.json'), 'w'), ensure_ascii=False, indent=1)
    if len(lm['clips']) >= 0.95 * len(jobs): ready.append(code)
    notes.append('%s %d/%d' % (code, len(lm['clips']), len(jobs)))
json.dump({'ready': ready, 'packs': packs}, open(os.path.join(VIDEO, 'languages.json'), 'w'))
print(len(m['clips']), 'sentences,', len(set(m['names'].values())), 'names (%d spellings)' % len(m['names']),
      '; missing:', ' '.join(missing) if missing else 'none')
print('languages ready:', ready, '| packs:', packs, '|', ', '.join(notes))
