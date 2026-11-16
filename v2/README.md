# Nexora | Real Estate Development Platform
**Powered by Jatta M Kommerce**

Nexora is the next-generation real estate SaaS platform for builders, developers, and homeowners. It unifies 3D digital twins, intelligent site feasibility evaluations, milestone-based construction tracking, and automated handovers.

## Commands

| Command | Action | URL / output |
|---|---|---|
| `npm run dev` (same as `dev:v2`) | Nexora dev server | `http://localhost:5174` |
| `npm run build` (same as `build:v2`) | Builds the site | writes to `dist/` |
| `npm run preview` | Preview the production build | `http://localhost:4174` |

The site's sources are `v2/index.html` and `v2/public/` (`scripts.js`, `style.css`, `content.json`,
`images/`, `nexora/`). Copies of these files also sit in `v2/` and at the repository root (the static
upload set); keep them identical to `v2/public` and `v2/index.html`.

## Nexora additions (2026-11-13)

Everything new lives in `v2/public/nexora/`; `style.css` is untouched and `scripts.js` has five small,
commented patches (backups: `backups/2026-11-13-before-ui-pass/`).

- `nexora.css` — yellow buttons (no green), vibrant yellow entrance screen, endless shine on "powered by
  jattamkommerce" in the top bar, the yellow letter-by-letter text wipe, top-bar buttons, forms.
- `nexora.js` — text wipe on all main text (start page, phase intros, step summaries, panels);
  **Book a Demo** in the top bar and centered "Log in / Sign up" in the menu; scrolling **back**
  to earlier phases (wheel, ↑/PageUp, swipe; one gesture moves one place); the demo request form
  (required fields marked *) and the log in / sign up form; Escape closes panels.
- Favicon: `nexora/favicon.svg` (+ PNG fallbacks).

### Not connected yet

`content.json` → `settings`: `formEndpoint` and `authEndpoint` are `null`. Until the CRM is connected,
the demo form sends nothing and offers to email the request to `settings.contactEmail`; log in / sign up
say they are not connected. Set the endpoints (JSON POST) to switch both forms to live submission.

## Architecture & Features

- **Brand & Identity**: **Nexora**, powered by **Jatta M Kommerce**.
- **Media Engine**: Pre-rendered cinema-grade 3D CGI video scrubbing (`phase1_loop.mp4`, `phase3_loop3.mp4`, `phase4_loop.mp4`, `phase5_loop.mp4`) driven by `ScrollyVideo` and Lenis inertial smooth scroll.
- **5 Campaign Phases + Virtual Tour**:
  1. **Phase 1: Site Evaluation** — Luxury villa plot assessment: boundary laser survey, fiber telecom, municipal water, electrical transformer cabling, soil bearing capacity, zoning setbacks, green building solar paths, and rainwater recharge.
  2. **Phase 2: Master Planning** — Architectural villa layouts, municipal sanction drawings, RERA statutory registration, and launch-ready 3D interactive digital twins for buyers.
  3. **Phase 3: Construction** — 3D diorama timelapse showing the villa and society small house rising step-by-step: site mobilization, foundation raft & plinth, RCC frame & roof slab, concealed MEP rough-in, acoustic glazing, and society house shell & driveway.
  4. **Phase 4: Fit-Out & Handover** — Interior fit-out: Italian marble flooring, modular kitchens, 200+ point digital snagging audit via Nexora app, and transparent homeowner key handover.
  5. **Phase 5: Ready to Move In** — Gated living community: society clubhouse & pool, 24/7 security access control, and smart estate facility management.
  6. **Virtual Tour** — Interactive 3D hotspots exploring the villa architecture, private garden, society clubhouse & pool, living pavilion, master suite, and smart solar roof.
- **Comprehensive SaaS Footer**: Multi-column responsive footer with platform phases, solutions, technology modules, company links, and live system status indicators.
- **Diorama "Board" Modals**: Clicking any hotspot pin displays the scale-model architectural diagram with engineering specifications.
- **Local Asset Resolution**: Script and style bundles are hosted locally in `v2/public/` while streaming high-resolution MP4 video assets.
