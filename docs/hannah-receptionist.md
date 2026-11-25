# Hannah: Nexora's virtual receptionist

Hannah is the first thing a visitor sees on the Nexora website: a video-call style welcome screen in
front of the site, which loads untouched behind her. She is Nexora's own: her portrait brought to
life in WebGL. LiveAvatar is not used.

Since 2026-11-17 her voice and her answers to open questions come from **Groq**, through a small PHP
file on our own server (`api/hannah.php`) that holds the API key. The key never reaches the browser.
If the server is unavailable, she falls back to the browser's own voice and the knowledge base, so
she always works. The conversation is not saved.

## Files

| File | What it does |
|---|---|
| `api/hannah.php` | **Server (Hostinger).** Holds the Groq key. `chat`: answers grounded in the knowledge base (`openai/gpt-oss-20b`). `tts`: her voice (`canopylabs/orpheus-v1-english`, voice `hannah`), cached in `api/.cache/`. Same-site only, rate-limited per visitor. |
| `api/.htaccess` | Lets the web reach only `hannah.php` in that folder. |
| `api/secrets.php` | Local key for development. **Ignored by git; never upload it.** |
| `v2/public/nexora/hannah.js` | The welcome screen and the conversation flow. |
| `v2/public/nexora/hannah.css` | Its look: off-white page, Nexora yellow, the call card, messages, ask bar. |
| `v2/public/nexora/hannah-face.js` | Her face in WebGL: viseme lip sync, springs, breathing, blinks, gaze, brows, head motion. |
| `v2/public/nexora/hannah-voice.js` | Her voice (Groq audio via Web Audio, browser voice as fallback), lip-sync timing, and listening. |
| `v2/public/nexora/hannah-brain.js` | Chooses her answer from the knowledge base; marks the questions it can't answer for the AI. |
| `v2/public/nexora/hannah-knowledge.json` | **Everything she knows. Edit this to train her** (the AI reads it too). |
| `v2/public/nexora/hannah/*` | Her portrait plate, its face rig and the message avatar. |

`index.html` loads the scripts. Copies: `v2/public/nexora/` (source) → `nexora/` (root, what
Hostinger serves) → `dist/nexora/` (`npm run build`). Keep all three in sync. `api/` exists only at
the root.

## Groq: how her voice and lip sync work

1. **Who answers.** The knowledge base answers what it knows, instantly and exactly (including
   navigation and "shall I open the demo form?" offers). Only questions it has no answer for go to
   the AI, which is told to use the same knowledge base facts only, to reply in 1-3 spoken
   sentences, and to never invent prices or features.
2. **Her voice.** The reply is cut into sentences of at most 195 characters (Groq's limit is 200;
   the first piece is kept short so she starts quickly). Each is fetched as audio while the
   previous one plays, and they are scheduled back to back on the Web Audio clock.
3. **Lip sync.** For each sentence: the text becomes visemes (aa, E, I, O, U, PP, FF, TH, DD, kk, CH,
   SS, RR, sil); the audio is measured every 10 ms (loudness, low/high frequency balance, stressed
   syllables); the text's phrases are stretched onto the phrases actually heard. The face reads the
   audio clock through `getOutputTimestamp()` (which includes speaker latency) every frame, blends
   the visemes into one mouth pose, scales the jaw by the real loudness and moves every control
   with a critically damped spring. Result: no drift, no snapping, the mouth never stays open.
4. **Life.** Noise-driven head drift, chest and shoulder breathing, asymmetric blinks (sometimes
   double or half), saccades and glances, a drifting resting smile, nods and brow lifts on stressed
   syllables, raised brows on questions, a listening tilt.

**Cost control.** Audio is cached on the server per sentence: the greeting and knowledge-base answers
are generated once, then served free. Limits per visitor IP: 15 AI answers a minute (300 a day) and
90 voice sentences a minute (2,500 a day); change `LIMITS` in `api/hannah.php`.

**Test switches.** `?hannahlocal` turns Groq off (browser voice + knowledge base only).
`?hannahdebug` exposes `__hannahFace` and `__hannahVoice` in the console.

## Putting it live on Hostinger

1. **Groq console (once):** open the Orpheus playground and accept its terms
   (console.groq.com → Playground → model `canopylabs/orpheus-v1-english`). Until then her voice
   falls back to the browser's.
2. **The key (once), never through git:** in Hostinger hPanel → File Manager, go to your home
   folder (the top level, `/home/u…/`, *above* `domains/` and `public_html`) and create
   `nexora-secrets.php` containing:
   ```php
   <?php return ['GROQ_API_KEY' => 'gsk_your_key_here'];
   ```
3. **Deploy** as usual through git: `api/hannah.php` and `api/.htaccess` must be included;
   `api/secrets.php` is ignored by git and must never be committed.
4. **Check:** open the site, click once, and she should speak in the Groq voice. A
   `[Hannah] ... unavailable` warning in the browser console names the problem
   (`not_configured` = key file not found; `model_terms_required` = step 1).

**Local development:** `npm run dev` also starts PHP's built-in server for `/api` (PHP is installed
on this Mac); the local key is in `api/secrets.php`.

## What visitors see and can do

- **Hannah on a call.** She sits at a reception desk in a 16:9 video card with her name, a status dot
  ("Listening", "Thinking", "Speaking") and these controls:
  - **Microphone:** talk hands-free. After each reply she listens again. She stops after three silent
    turns.
  - **Red button:** end the conversation and go to the website's entry page.
  - **⋯ menu:** mute her voice, start again, or go to the website.
  - **Expand:** full screen.
- **Live transcript.** Everything she says appears under the call, word by word as she says it. The
  visitor's own words appear while they speak (in italics until final).
- **Ask bar.** Microphone, text box and the yellow send button.
- **Skip Introduction** (top right) goes to the website's entry page.
- **Every way out leads to the website's entry page** (its loader and Enter Site button), never
  straight into a phase or panel. If a visitor asks for something specific ("take me to
  Construction", "book a demo"), Hannah says where to find it (the menu, the Book a Demo button),
  then closes onto the entry page.
- **She walks visitors through Nexora herself.** Her offers ("Shall I tell you about the next phase?")
  lead to her next answer, one phase at a time.

| Situation | What happens |
|---|---|
| First page view in a browser session | Hannah is shown and greets the visitor. The homepage never flashes. |
| The browser blocks sound until a click (Chrome often does on first visit) | Her greeting is shown as text, with **Tap to hear Hannah** on the video. A tap plays it. |
| Reload in the same session | Straight to the site. |
| Menu → **Talk to Hannah** | She opens again over the page, with a shorter greeting. **Back to Nexora** returns to the same place. |
| `?welcome` in the URL | Shows her again. `?skipwelcome` skips her. |
| A script fails to load | The site shows as before. Without WebGL she is a still photo; without speech she replies in text. |

## Training Hannah: `hannah-knowledge.json`

Hannah answers **only** from this file. If nothing in it fits a question, she apologises and offers
the team (email or the demo form). She never invents prices, features or company details.

Its sections:

- **`company`, `greeting`:** her greeting, the ask-bar placeholder and the contact email.
- **`topics`:** one entry per subject. To add one, copy an entry and change it:

  ```json
  {
    "id": "mobile-app",
    "keywords": ["mobile", "android", "iphone", "ios"],
    "phrases": ["is there an app", "mobile app"],
    "answer": "Yes. Site engineers use the Nexora mobile app for the 200+ point snag audit, and residents use the Nexora resident app.",
    "followUp": { "ask": "Would you like to see Fit-Out and Handover?", "action": { "type": "phase", "phase": 4 } }
  }
  ```

  - `keywords` are single words, which score 1 each. `phrases` are word groups, which score 3 each.
    The highest score wins.
  - `followUp` is the yes/no offer she makes next. On "yes" she does its `action`, or answers its
    `topic`.
- **`navigation`:** names for "take me to …" requests.
- **`roles`:** her tailored answer for developers, home buyers and visitors who are just exploring.
  She asks which one the visitor is before recommending anything.
- **`smallTalk`:** hello, how are you, who are you, are you real, thanks, goodbye.
- **`replies`:**
  - `offTopic`: polite redirects back to Nexora
  - `confused`: a simple explanation with three choices
  - `unknownNexora`: an apology and the team's contact
  - `notUnderstood`
  - navigation confirmations
- **`domainWords`:** words that mark a question as being about Nexora, so she apologises
  ("I don't have that") instead of treating it as off-topic.
- **`voice`:** preferred voices, rate, pitch and recognition language (`en-IN`).

Follow-ups either continue the conversation (`"topic": "<another entry's id>"`) or take the visitor to
the website's entry page (`"action": {"type":"enter"}`). `phase` and `panel` actions (in
`navigation`) also lead to the entry page; they only change what she says on the way out.

After editing:

1. Check the file is valid JSON.
2. Copy it to `nexora/` and run `npm run build`.
3. Try the new question at `?welcome`. In the browser console, `NexoraHannah.ask('your question')`
   asks it for you.

## Languages

Visitors can talk to Hannah in Indian and world languages. Her knowledge stays in English: the
visitor's words are translated to English, answered from `hannah-knowledge.json`, and her answer is
translated back. Translation and language detection are Chrome's own on-device models (Chrome 138
or newer): free, no API key, nothing leaves the device.

- **Choosing a language:** the 🌐 pill in the ask bar (about 50 languages), or just ask ("can you
  speak Hindi?", "Tamil please"). Typed messages in another script are detected automatically. To
  **speak**, the visitor should pick the language first: speech recognition must be told which
  language to listen for.
- **First use of a language** downloads its model, about a few seconds; a note shows progress. Chrome
  allows one download per click or key press, so Hannah downloads while the visitor types.
- **What works in Chrome (checked 2026-11-16):**
  - Understood and answered: Hindi, Bengali, Marathi, Telugu, Tamil and Kannada, plus about 30
    world languages (Spanish, French, German, Arabic, Chinese, Japanese, Korean, Russian, …).
  - Not offered by Chrome's translator yet: Malayalam, Gujarati, Urdu, Punjabi, Odia, Assamese,
    Nepali. She says so politely and continues in English.
- **Her voice** comes from the visitor's device. On this Mac: Hindi (Lekha) and Tamil (Vani), and
  most world languages. Marathi and Nepali use the Hindi voice. Where a device has no voice for a
  language (Bengali, Telugu, Kannada here), she replies in text and a note says so.
- **Lip sync in other scripts:** mouth shapes come from the letters themselves. Indian scripts use
  their consonant and vowel signs (lips close for प/ब/म in every Indian script); Cyrillic and Arabic
  script are read as sounds; Korean by syllable; others with a natural syllable rhythm.
- `languages.keepInEnglish` in the knowledge base lists names never translated (Book a Demo,
  Nexora, …) because they are labels on the website.
- **Other browsers** (Safari, Firefox) have no built-in translator: she works in English there.
- **Every language, everywhere** (including Malayalam, Gujarati, Urdu, Punjabi) would need a small
  server with a translation or AI service (for example Groq). That needs your go-ahead and a
  service account.

## How the face works (and its limits)

- Her portrait is placed in a reception scene (`hannah-plate.jpg`). 478 face points were found on it
  once, offline, with Google MediaPipe. These points become a mesh that moves her real lips, jaw,
  eyelids and brows. Her real upper teeth stay fixed while the jaw opens, revealing a mouth
  interior.
- **Lip sync:** each word she says is turned into mouth shapes (closed lips for m, b, p; lip on teeth
  for f, v; rounded for oo, w; open for a, o, and so on), laid on a timeline. The timeline starts
  and ends with the voice. Every word event from the voice re-anchors it to the word being heard.
- **Voices:**
  - Microsoft natural voices (Edge) and the Mac's own voices (Samantha, Ava, …) report every word, so
    the sync is exact.
  - Chrome's Google voices don't report words, so their timing is estimated per sentence and
    corrected as she goes. They come last in her preferred list.
- **Natural speech:** while talking, her smile softens so her lips cover her teeth between sounds.
  Small words ("the", "to") get light movement and meaningful words get full movement. Each
  sentence starts with a small nod and brow lift, often a glance away, and she blinks between
  sentences.
- **Expressions:** welcoming (bigger smile, raised brows), listening (soft smile, small nods while the
  visitor talks), thinking (gaze up and away, brows in), speaking, happy, apologetic (inner brows up),
  plus blinks, eye movements, breathing and small head motion.
- **Limits, honestly:**
  - It is a photo brought to life, not a filmed video. Small head motion looks natural; she can't
    turn her head or move her hands.
  - The scene is a real photo of her seated at the desk; only her face is animated, so her hands
    and body stay still.
  - Her base expression is the photo's broad smile, so she speaks with a gentle smile.
  - Voice quality depends on the visitor's browser and device.
  - Listening needs Chrome, Edge or Safari over https (or localhost). Chrome sends the audio to
    Google's speech service. In Firefox, visitors type.
  - She cannot discuss things outside the knowledge base. Free-form AI answers would need a
    language model behind a small server (the Groq idea from before). The brain was written so a
    model could later sit behind it, grounded in this same file.

## Testing (manual)

1. `npm run dev` and open `http://localhost:5174/?welcome` in Chrome.
2. Click once on Hannah if **Tap to hear Hannah** shows. She greets you, her lips move with the
   words, and the text appears under the call as she speaks.
3. Type: "hi", then "I'm a developer", then "yes". She tailors the answer and offers the modules.
4. Type: "how much does it cost?". She explains that there are no published prices and offers the
   demo form. Answer "yes": the form opens in the site.
5. Type: "what's the weather like?". She redirects politely. Type "I don't understand": she
   simplifies.
6. Press the microphone, allow it, and ask "what is a digital twin?" out loud. She nods while you
   talk, then answers.
7. ⋯ → Mute: replies arrive as text only. ⋯ → Start again: the conversation resets.
8. Say or type "take me to the virtual tour". She says it's in the menu, then closes onto the
   website's entry page.
9. Try a phone (or a narrow window): the call sits on top, the conversation scrolls, the ask bar
   stays at the bottom.
10. Type "नेक्सोरा की कीमत क्या है?". She answers in Hindi (the first time, after a short download).
    Pick தமிழ் with 🌐, then type or say a question in Tamil.

Debug flags: `?hannahmute` (start muted), `?hannahsim` (simulated speech without audio),
`?hannahdebug` (exposes `window.__hannahFace` and `window.__hannahVoice` in the console).

## Before this version

- The LiveAvatar welcome layer is saved in `backups/2026-11-16-before-independent-hannah/`, and the
  earlier version of this document in `backups/2026-11-16-before-human-hannah/`.
- The separate 3D-character test page (`hannah-local-test/`, `public/hannah/hannah.glb`) was left
  untouched and is not used by the site.
