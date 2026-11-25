"""
Writes hannah_all_languages_kaggle.ipynb: every language's clips in ONE Kaggle run (2 GPUs, unattended).

Run after make_lang.py:  python3 make_all_langs_nb.py
Languages are made in priority order (ORDER); the run stops starting new clips at 11 h 15 min, so whatever
is finished is always saved before Kaggle's 12-hour limit.
"""
import json, os

VID = os.path.dirname(os.path.abspath(__file__))
LANG = os.path.join(VID, '..', 'lang')
base = json.load(open(os.path.join(VID, 'hannah_make_clips_kaggle.ipynb')))
S = lambda c: ''.join(c['source'])
install = S(base['cells'][3])
picture = S(base['cells'][4])
ORDER = ['hi', 'kn', 'ta', 'te', 'ml', 'mr', 'gu', 'bn', 'pa', 'or', 'ur', 'es', 'fr', 'it', 'pt', 'ja', 'zh']

jobs = []
c185 = [c for c in json.load(open(os.path.join(VID, 'clips.json'))) if c['id'] == 'c185'][0]
jobs.append({'id': 'c185', 'say': c185['say'], 'engine': 'kokoro', 'voice': 'af_bella', 'lang': 'a', 'file': 'c185.mp4'})
per = {}
for code in ORDER:
    js = [j for j in json.load(open(os.path.join(LANG, code + '_clips.json'))) if not j.get('shared')]
    per[code] = len(js)
    jobs += [{k: j[k] for k in ('id', 'say', 'engine', 'voice', 'lang', 'file')} for j in js]
HI_REF = "नमस्ते, नेक्सोरा में आपका स्वागत है। मैं हन्ना हूँ, आपकी वर्चुअल रिसेप्शनिस्ट, और आज मैं आपकी गाइड हूँ।"
n_f5 = sum(j['engine'] == 'f5' for j in jobs)

def md(s): return {'cell_type': 'markdown', 'metadata': {}, 'source': s}
def code(s): return {'cell_type': 'code', 'metadata': {}, 'execution_count': None, 'outputs': [], 'source': s}

install = install.replace('# 2b. Install everything in its own clean Python 3.10 (5–8 minutes)', '# 3. Install the tools (15–20 minutes)')
install = install.replace('!/content/venv/bin/python -m spacy download en_core_web_sm -q > /dev/null 2>&1',
    '!/content/venv/bin/python -m spacy download en_core_web_sm -q > /dev/null 2>&1\n'
    '!uv pip install -q --python /content/venv/bin/python "misaki[zh]" && echo "CHINESE OK" || echo "CHINESE ADD-ON FAILED"\n'
    '!uv pip install -q --python /content/venv/bin/python "misaki[ja]" && /content/venv/bin/python -m unidic download > /dev/null 2>&1 '
    '&& echo "JAPANESE OK" || echo "JAPANESE ADD-ON FAILED"')
install += '''
# IndicF5: the Indian languages Kokoro can't speak, copying Hannah's own voice
!uv venv -q --seed --python 3.10 /content/venv_f5
!uv pip install -q --python /content/venv_f5/bin/python torch==2.5.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/cu121
!uv pip install -q --python /content/venv_f5/bin/python "git+https://github.com/ai4bharat/IndicF5.git" "transformers<4.50" "numpy<=1.26.4" "pyarrow==17.0.0" soundfile setuptools
!/content/venv_f5/bin/python -c "import f5_tts, torch, soundfile; print('INDICF5 OK, GPU:', torch.cuda.is_available())"
'''

cells = [
md('''# Hannah — ALL languages in one run (Kaggle, 2 free GPUs)

Makes her talking clips in **%d languages** (%s) plus one new English line: **%d clips**.
Hindi, Urdu, Spanish, French, Italian, Portuguese, Japanese and Chinese use Kokoro; the other Indian languages
use IndicF5 copying Hannah's own voice. Both GPUs work at once. About **9–10 hours**. It stops starting new
clips at 11 h 15 min, so everything finished is always saved.

**Before Save Version (once):**
1. **Settings → Accelerator → GPU T4 x2**, and **Settings → Turn on internet**
2. **Add-ons → Secrets → Add Secret**: Label **HF_TOKEN**, Value: your Hugging Face token → **Save**, and make
   sure its **switch is on** for this notebook (needed for the Indian languages)
3. **Save Version → Save & Run All (Commit) → Save**. You can close the tab.
4. When it's done: **Your Work → this notebook → Output → download** (arrives as results.zip). Tell Claude.
''' % (len(ORDER), ', '.join(ORDER), len(jobs))),
code('''# 1. GPUs, and the clock (the run stops starting new clips before Kaggle's 12-hour limit)
import subprocess, os, time
os.environ['MPLBACKEND'] = 'Agg'
os.makedirs('/content', exist_ok=True)
open('/content/start.txt', 'w').write(str(time.time()))
try:
    print(subprocess.run(['nvidia-smi', '-L'], capture_output=True, text=True).stdout or 'NO GPU!')
except FileNotFoundError:
    print('NO GPU! Settings → Accelerator → GPU T4 x2')
'''),
code('''# 2. Folders, and the Hugging Face token (Kaggle secret HF_TOKEN) for IndicF5
W = '/content/hannah_clips'
for d in ['wav', 'web']:
    os.makedirs(W + '/' + d, exist_ok=True)
tok = ''
try:
    from kaggle_secrets import UserSecretsClient
    tok = (UserSecretsClient().get_secret('HF_TOKEN') or '').strip()
except Exception as e:
    print('secret not readable:', repr(e)[:120])
if tok:
    os.environ['HF_TOKEN'] = tok
    os.makedirs(os.path.expanduser('~/.cache/huggingface'), exist_ok=True)
    open(os.path.expanduser('~/.cache/huggingface/token'), 'w').write(tok)
    print('HF TOKEN OK')
else:
    print('NO HF_TOKEN SECRET: Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Bengali, Odia will be skipped')
'''),
code(install),
code(picture.replace('# 3. Hannah', '# 4. Hannah')),
code('''# 5. Everything she will say, in every language (from make_lang.py)
import json
JOBS = json.loads(r\'\'\'''' + json.dumps(jobs, ensure_ascii=False) + '''\'\'\')
json.dump(JOBS, open('/content/jobs.json', 'w'), ensure_ascii=False)
json.dump({'text': \'''' + HI_REF + '''\'}, open('/content/ref.json', 'w'), ensure_ascii=False)
from collections import Counter
print(len(JOBS), 'clips:', dict(Counter(j['file'].split('/')[0] if '/' in j['file'] else 'english' for j in JOBS)))
'''),
code('''%%writefile /content/voices_kokoro.py
# 6. Kokoro voices (Hindi, Urdu, English, Spanish, French, Italian, Portuguese, Japanese, Chinese)
import json, os, numpy as np, soundfile as sf
from kokoro import KPipeline
W = '/content/hannah_clips'
jobs = json.load(open('/content/jobs.json'))
REF = json.load(open('/content/ref.json'))
pipes = {}
def tts(lang, voice, text):
    if lang not in pipes: pipes[lang] = KPipeline(lang_code=lang)
    return np.concatenate([np.asarray(x) for _, _, x in pipes[lang](text, voice=voice, speed=0.95)])
pad = np.zeros(int(24000 * 0.35), dtype=np.float32)
# Hannah's own voice reading Hindi: the voice IndicF5 copies for the other Indian languages
sf.write('/content/ref_hi.wav', np.concatenate([pad[:6000], tts('h', 'af_bella', REF['text']), pad[:6000]]), 24000)
n = 0
for j in jobs:
    if j['engine'] != 'kokoro': continue
    out = '%s/wav/%s.wav' % (W, j['id'])
    if os.path.exists(out): continue
    try:
        sf.write(out, np.concatenate([pad, tts(j['lang'], j['voice'], j['say']), pad]), 24000)
        n += 1
        if n % 100 == 0: print('kokoro voices', n, flush=True)
    except Exception as e:
        print('VOICE FAILED', j['id'], repr(e)[:150], flush=True)
print('KOKORO VOICES OK', n)
'''),
code('''!/content/venv/bin/python /content/voices_kokoro.py 2>&1 | grep -E "voices|OK|FAILED|Error"
'''),
code('''%%writefile /content/voices_f5.py
# 7. IndicF5 voices: Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Punjabi, Bengali, Odia (worker k of K)
import json, os, sys, numpy as np, soundfile as sf, torch
k, K = int(sys.argv[1]), int(sys.argv[2])
W = '/content/hannah_clips'
jobs = [j for j in json.load(open('/content/jobs.json')) if j['engine'] == 'f5']
REF = json.load(open('/content/ref.json'))
from transformers import AutoModel
model = AutoModel.from_pretrained('ai4bharat/IndicF5', trust_remote_code=True)
try:
    model = model.to('cuda')
except Exception as e:
    print('(IndicF5 on CPU)', repr(e)[:80], flush=True)
pad = np.zeros(int(24000 * 0.35), dtype=np.float32)
n = 0
for i, j in enumerate(jobs):
    if i % K != k: continue
    out = '%s/wav/%s.wav' % (W, j['id'])
    if os.path.exists(out): continue
    try:
        a = np.asarray(model(j['say'], ref_audio_path='/content/ref_hi.wav', ref_text=REF['text']))
        if a.dtype == np.int16: a = a.astype(np.float32) / 32768.0
        sf.write(out, np.concatenate([pad, a.astype(np.float32), pad]), 24000)
        n += 1
        if n % 50 == 0: print('f5 voices worker', k, n, flush=True)
    except Exception as e:
        print('F5 FAILED', j['id'], repr(e)[:200], flush=True)
print('F5 VOICES OK worker', k, n)
'''),
code('''# both GPUs at once (skipped without the HF_TOKEN secret)
if os.environ.get('HF_TOKEN'):
    !/content/venv_f5/bin/python -c "from huggingface_hub import snapshot_download; snapshot_download('ai4bharat/IndicF5'); print('IndicF5 downloaded')"
    !CUDA_VISIBLE_DEVICES=0 /content/venv_f5/bin/python /content/voices_f5.py 0 2 > /content/f5_0.log 2>&1 & CUDA_VISIBLE_DEVICES=1 /content/venv_f5/bin/python /content/voices_f5.py 1 2 > /content/f5_1.log 2>&1 & wait
    !grep -hE "voices|OK|FAILED|Error" /content/f5_0.log /content/f5_1.log | tail -30
else:
    print('IndicF5 skipped: no HF_TOKEN secret')
'''),
code('''%%writefile /content/videos.py
# 8. A talking clip for every voice (Ditto), easing in and out of her resting pose (worker k of K)
import os, sys, json, copy, subprocess, traceback, time
k, K = int(sys.argv[1]), int(sys.argv[2])
os.chdir('/content/ditto'); sys.path.insert(0, '/content/ditto')
from stream_pipeline_offline import StreamSDK
from inference import run
CFG, ROOT = './checkpoints/ditto_cfg/v0.4_hubert_cfg_pytorch.pkl', './checkpoints/ditto_pytorch'
MORE = {'setup_kwargs': {'fade_type': 's', 'fade_out_keys': ('exp', 'pitch', 'yaw', 'roll', 't')},
        'run_kwargs': {'fade_in': 8, 'fade_out': 8}}
W = '/content/hannah_clips'
DEADLINE = float(open('/content/start.txt').read()) + 11.25 * 3600
jobs = json.load(open('/content/jobs.json'))
os.makedirs('/content/raw', exist_ok=True)
sdk = StreamSDK(CFG, ROOT)
done, failed = 0, []
for i, j in enumerate(jobs):
    if i % K != k: continue
    if time.time() > DEADLINE:
        print('TIME LIMIT: stopping here so the finished clips are saved', flush=True); break
    web, wav, raw = W + '/web/' + j['file'], '%s/wav/%s.wav' % (W, j['id']), '/content/raw/%s.mp4' % j['id']
    if os.path.exists(web) or not os.path.exists(wav): continue
    os.makedirs(os.path.dirname(web), exist_ok=True)
    try:
        try:
            run(sdk, wav, '/content/hannah.jpg', raw, more_kwargs=copy.deepcopy(MORE))
        except Exception:
            traceback.print_exc(); sdk = StreamSDK(CFG, ROOT)
            run(sdk, wav, '/content/hannah.jpg', raw, more_kwargs=copy.deepcopy(MORE))
        tmp = '/content/raw/%s.web.mp4' % j['id']
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-vf', 'scale=1280:-2', '-c:v', 'libx264',
                        '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k',
                        '-movflags', '+faststart', tmp], check=True)
        os.replace(tmp, web)
        os.remove(raw)
        done += 1
        print('%d/%d %s ok' % (i + 1, len(jobs), j['id']), flush=True)
    except Exception:
        traceback.print_exc(); failed.append(j['id'])
print('WORKER', k, 'made', done, 'FAILED:', failed if failed else 'none')
'''),
code('''!CUDA_VISIBLE_DEVICES=0 /content/venv/bin/python /content/videos.py 0 2 > /content/v0.log 2>&1 & CUDA_VISIBLE_DEVICES=1 /content/venv/bin/python /content/videos.py 1 2 > /content/v1.log 2>&1 & wait
!grep -hE "WORKER|TIME LIMIT|Error" /content/v0.log /content/v1.log | tail -20
!grep -hc " ok$" /content/v0.log /content/v1.log
'''),
code('''# 9. The finished clips: one zip per language in this notebook's Output
import json, os, zipfile
jobs = json.load(open('/content/jobs.json'))
groups = {}
for j in jobs:
    if os.path.exists(W + '/web/' + j['file']):
        g = j['file'].split('/')[0] if '/' in j['file'] else 'english'
        groups.setdefault(g, []).append(j['file'])
print({g: len(v) for g, v in groups.items()}, 'of', len(jobs))
os.makedirs('/kaggle/working', exist_ok=True)
for g, lst in sorted(groups.items()):
    with zipfile.ZipFile('/kaggle/working/hannah_%s_clips.zip' % g, 'w', zipfile.ZIP_STORED) as z:
        for f in lst: z.write(W + '/web/' + f, f)
    print('ready in Output: hannah_%s_clips.zip (%d clips)' % (g, len(lst)))
'''),
]
nb = {'cells': cells, 'metadata': {'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'},
      'language_info': {'name': 'python'},
      'kaggle': {'accelerator': 'nvidiaTeslaT4', 'isInternetEnabled': True, 'isGpuEnabled': True}},
      'nbformat': 4, 'nbformat_minor': 4}
for c in nb['cells']:
    s = c['source']
    c['source'] = [l + '\n' for l in s.split('\n')[:-1]] + [s.split('\n')[-1]]
json.dump(nb, open(os.path.join(VID, 'hannah_all_languages_kaggle.ipynb'), 'w'), indent=1, ensure_ascii=False)
print(len(jobs), 'jobs;', n_f5, 'IndicF5;', per)
