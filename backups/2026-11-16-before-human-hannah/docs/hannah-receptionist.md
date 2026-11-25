# Hannah: Nexora's virtual receptionist

Hannah is the first thing a visitor sees on the Nexora website. She is a full-screen welcome layer
in front of the existing site, which loads untouched behind her. She uses LiveAvatar's official
embed (the "Hannah (Friendly)" avatar).

- Code: `v2/public/nexora/hannah.js` and `hannah.css` (copies in `nexora/` and `dist/nexora/`).
- `index.html` changes: a short check in `<head>` that decides whether Hannah is shown, a
  **Talk to Hannah** button in the menu, and one `<script>` tag.
- Backups of the edited files: `backups/2026-11-16-before-hannah/`.

## How it behaves

| Situation | What happens |
|---|---|
| First page view in a browser session | Hannah is shown. The homepage never flashes, and the site keeps loading underneath. |
| **Enter Nexora** or **Skip introduction** | Hannah's window is closed, which ends her LiveAvatar session. The layer fades out, and the site starts as if its own "Enter Site" had been pressed. If the site is still loading, its loader shows and it starts by itself when ready. |
| A phase under "Or go straight to" | Same as Enter, then the site jumps to that phase (the same call the footer links use). |
| Reload in the same session | Straight to the site. |
| Menu → **Talk to Hannah** | Hannah opens again over the page. **Back to Nexora** returns to the same place. |
| `?welcome` in the URL | Shows Hannah again (useful for testing). |
| `?skipwelcome` in the URL | Skips her. |
| `hannah.js` blocked or failing | The site shows exactly as before. |

To change the embed, edit `CONFIG.embedUrl` at the top of `hannah.js` (in all copies).

## Required: set Hannah up in the LiveAvatar dashboard

Her greeting, knowledge and voice are configured only in LiveAvatar, not on the website. Open
app.liveavatar.com and edit the context used by this embed's voice agent.

### 1. Opening Intro (the greeting she speaks when a visitor presses Chat now)

> Welcome to Nexora! I'm Hannah, your virtual receptionist. I'll personally guide you through our
> platform and help you discover everything Nexora has to offer. What would you like to explore today?

### 2. Full prompt (her instructions and knowledge)

Paste the text below. It uses only what the Nexora website says. Update it whenever `content.json`
changes.

```text
You are Hannah, the virtual receptionist of Nexora, a real estate software platform powered by
Jatta M Kommerce. You welcome visitors on the Nexora website before they enter it.

HOW YOU SPEAK
- Warm, confident, professional and natural, like an experienced human receptionist.
- Keep answers short: two or three sentences, then ask ONE question.
- Vary your wording. Do not repeat the same phrases.
- Reply in the visitor's language. If they ask for a language you cannot speak (for example
  Kannada), say so politely and offer English or Hindi.
- Never invent anything. If something is not in the facts below, say you don't have that
  information and suggest booking a demo or emailing contact@jattamkommerce.com.

WHAT NEXORA IS (facts from the website)
- Nexora is a real estate digital twin and construction tracking SaaS platform, powered by
  Jatta M Kommerce. It helps developers and buyers visualise, manage and pre-sell villas and
  gated society developments before and while they are built.
- A digital twin is a photorealistic 3D replica of a development, created from architectural and
  engineering drawings, so people can explore it before it is finished.
- The website tells the story in five phases plus a virtual tour, using an illustrative luxury
  villa and gated society community:
  1. Site Evaluation: checking a plot before breaking ground (road access, boundary and
     topography survey, water and electrical utilities, municipal sanctions, zoning and setbacks,
     soil testing, solar path and cross-ventilation, environmental clearances, rainwater recharge).
  2. Master Planning: villa layouts, sanction plans, RERA registration, early material planning,
     green-building targets, and launching Nexora's interactive 3D digital twin for buyers, with a
     villa customiser for finishes, live inventory and booking, and a homeowner milestone and
     handover portal.
  3. Construction: the society, residential towers and clubhouse rising (site mobilisation and
     gatehouse, foundation raft, tower structure, clubhouse, pool and deck, sports court and
     children's play area, underground utilities).
  4. Fit-Out & Handover: premium interior finishes, modular kitchens and wardrobes, a 200+ point
     digital snag audit in the Nexora app, contractor snag resolution, the homeowner walkthrough
     and key handover, and commissioning of society facilities.
  5. Ready to Move In: society clubhouse and pool, 24/7 gated security, and estate facility
     management through the Nexora resident app.
  6. Virtual Tour: interactive points on the illustrative villa: architecture and driveway,
     private garden and courtyard, society clubhouse and pool, living and dining pavilion, master
     bedroom suite, smart security and solar roof.
- Platform modules described on the site: land and feasibility, 3D virtual sales gallery,
  construction milestone tracker, digital quality and snagging, buyer handover and resident portal.
- Nexora offers subscription plans for builders and developers. No prices are published.

WHAT IS NOT ON THE WEBSITE: NEVER MAKE IT UP
- There are no real project names, locations, prices, unit availability, floor plans or
  possession dates. The villa and society shown are illustrative examples of what Nexora can
  present. If asked, say so plainly and offer a demo.
- Accounts (Log in / Sign up) are not live yet.
- Do not promise prices, discounts or dates, and do not give legal or financial advice.

HELPING VISITORS FIND THEIR WAY
- To go in, the visitor presses the yellow "Enter Nexora" button next to you. "Skip introduction"
  at the top also goes straight in. The buttons under "Or go straight to" open a phase directly.
- Inside the site: scroll to move through the phases. The Menu at the top right lists every
  phase. "Book a Demo" at the top opens the demo request form. "Log in / Sign up" and
  "Talk to Hannah" are in the menu.
- For a demo, the visitor uses the Book a Demo form or emails contact@jattamkommerce.com. Do not
  collect phone numbers, email addresses or other personal details in this conversation; point
  to the form instead.

CONVERSATION FLOW
- After your greeting, find out whether the visitor is a developer or builder, a home buyer, or
  just exploring, and what they would like to see. Ask one question at a time.
- Give a short tour that suits them. For developers: the five phases and the digital twin. For
  buyers: the virtual tour, the amenities and the homeowner portal.
- When they seem ready, or after a few exchanges, invite them to press "Enter Nexora" or one of
  the phase buttons to explore.
```

### 3. Embed settings

- **Default language:** English. Visitors can change it in Hannah's window before pressing Chat now.
- **Time limit:** set one (for example 180 seconds) to cap the cost of each conversation. The
  embed currently has **no time limit**.
- Leave "Additional context via URL" empty for the Nexora site. The site is drawn by JavaScript,
  so a page summariser would see little of it. The Full prompt above is the reliable source.

## What LiveAvatar's embed can and cannot do (checked on 2026-11-16)

This was verified by reading the embed's own page code and LiveAvatar's documentation, not assumed.

- **No events for the host page.** The embed sends no `postMessage` events and accepts no
  commands. So the website cannot:
  - read the conversation, or show its own transcript
  - see whether Hannah is listening, thinking or speaking
  - change her language
  - detect when her introduction has finished

  That is why **Enter Nexora** is always visible, and Hannah is asked (in the prompt) to invite
  visitors to press it.
- **Controls inside Hannah's window:**
  - a language picker and the **Chat now** button
  - a microphone mute
  - **chat mode**, where typed messages go to the same conversation
  - **Transcript**, with Copy

  The welcome screen tells visitors where these are. The iframe is given `microphone`, `autoplay`
  and `clipboard-write` permissions so they all work.
- **Starting a session:** nothing starts until the visitor presses **Chat now**. Loading the page
  uses no credits.
- **Secrets:** the embed fetches its own session token with the embed ID. No API key is in the website.
- **Ending a session:** closing Hannah's window (Enter, Skip, a phase button, or leaving the page)
  unloads the embed, and its live connection disconnects.
- **Microphone status:** the welcome screen reads this site's microphone permission (asking,
  allowed or blocked) and explains what to do. That is the permission the embed uses.
- **Languages:** 35 options in Hannah's picker: Multilingual, English, Arabic, Bengali, Bulgarian,
  Chinese, Croatian, Czech, Danish, Dutch, Finnish, French, German, Greek, Hindi, Hungarian,
  Indonesian, Italian, Japanese, Korean, Malay, Maltese, Norwegian, Polish, Portuguese, Romanian,
  Russian, Slovak, Spanish, Swedish, Tagalog, Tamil, Turkish, Ukrainian, Vietnamese.
  - **Kannada is not available.**
  - Test Hindi with this voice before advertising it.

## Costs

From LiveAvatar's published credit rules:

| Item | Cost |
|---|---|
| Embed conversations | 2 credits per minute, from Chat now until the window closes |
| Free plan | 10 credits a month (about 5 minutes of conversation in total), no overage |
| Essential plan | $99 a month for about 1,100 credits; overage $0.095 per credit if turned on |
| Business plan | $475 a month for about 6,000 credits |
| Sandbox mode | Free, but only for a different demo avatar, and sessions last about a minute |

- When credits run out, visitors see "Insufficient credits…" inside Hannah's window. Enter Nexora
  and Skip still work.
- Check the plan before this goes live.
- Nothing else here costs money. No new libraries were added.

## Later: Groq, knowledge base, languages and leads (plan, not built)

The embed cannot use a custom language model. A custom model works only in LiveAvatar "FULL mode"
sessions created through their API. The path:

1. **Small backend** (the independent Node.js server already planned), holding the LiveAvatar API
   key in an environment variable. Its endpoint `POST /api/hannah/session` creates a FULL-mode
   session token (avatar, voice, context, language, `llm_configuration_id`) and returns only the
   token to the browser.
2. **Front end:** replace the iframe in `hannah.js` (`mountAvatar` / `unmountAvatar`) with
   LiveAvatar's Web SDK. Its events then give:
   - our own transcript panel
   - real listening and speaking indicators
   - language switching
   - a proper "ready to enter" hand-off

   The welcome layer itself stays.
3. **Language model:** LiveAvatar accepts any OpenAI-compatible `/chat/completions` endpoint. Two
   options:
   - **Point it straight at Groq.** Groq offers an OpenAI-compatible API, but whether LiveAvatar
     works with Groq's address has not been tested, and LiveAvatar's docs don't say how the base
     URL should be written.
   - **Point it at our own proxy (recommended).** The proxy adds the Nexora knowledge (from
     `content.json`, later a property database), detects the visitor's intent, calls Groq, and
     logs.
4. **Leads, with consent:**
   - a consent form on the page, not voice alone
   - `POST /api/leads` with validation
   - fields: name, phone, email, preferences, timeline, budget range, plus the consent text and time
   - stored in MySQL with parameterised queries and encryption at rest
   - a notification to the sales team

   Connecting the CRM needs your go-ahead first.
5. **Kannada** would need LiveAvatar to add it, or "LITE mode" (1 credit per minute) with our own
   speech-to-text and text-to-speech that support Kannada. That probably means a paid speech
   service, which needs your approval.

None of these use paid OpenAI or ElevenLabs services. The Groq free tier has rate limits.
