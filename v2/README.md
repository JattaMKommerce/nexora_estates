# Nexora | Real Estate Development Platform
**Powered by Jatta M Kommerce**

Nexora is the next-generation real estate SaaS platform for builders, developers, and homeowners. It unifies 3D digital twins, intelligent site feasibility evaluations, milestone-based construction tracking, and automated handovers.

## Commands

| Command | Action | URL |
|---|---|---|
| `npm run dev:v2` | Launch the Nexora SaaS platform dev server | `http://localhost:5174` |
| `npm run build:v2` | Build production bundle for Nexora | writes to `dist-v2/` |
| `npm run preview:v2` | Preview production build | `http://localhost:4174` |
| `npm run dev` | Launch the legacy residential Restate 3D prototype | `http://localhost:5173` |
| `npm run build` | Build legacy Restate prototype | writes to `dist/` |

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
