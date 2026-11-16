# Backups

Copies of the code taken before a stage modified or replaced it. Nothing here is built or served
(the site is built from `src/` and `public/` only). To restore a file, copy it back into place.

| Folder | Taken | Contains |
|---|---|---|
| `2026-11-11-before-stage-3/` | before Stage 3 (photorealistic environment) | the whole `src/` folder as it was after Stage 2, including `src/three/Site.jsx` (the original low-poly city, replaced in Stage 3), plus the README and asset credits of that time. It also holds `three/glsl.js` and `three/glazing.js`, two new files written at the very start of Stage 3 that the backed-up code does not use. |
| `2026-11-11-before-stage-4/` | before Stage 4 (scroll-driven story and construction) | the whole `src/` and `scripts/` folders and the README as they were after Stage 3 |
| `2026-11-11-before-homepage-refinement/` | before the homepage refinement (centred hero, full story, showcase, enquiry) | the whole `src/` folder and the README as they were after Stage 4, including the home page's statement and "3D experience" journey sections, which the refinement removed from the page |
| `2026-11-11-before-section-a/` | before Section A (the pre-rendered opening section of the home page) | the whole `src/` and `scripts/` folders and the README as they were after the homepage refinement |
| `2026-11-11-before-v2/` | before the separate "v2" site (the NRG-style phase story in `v2/`) | `package.json` as it was before the `dev:v2`, `build:v2` and `preview:v2` scripts were added. Nothing else in the original site was changed; v2 lives in its own folder. |
| `2026-11-12-before-v2-visual-upgrade/` | before the v2 3D visual-quality upgrade | the whole `v2/src/` folder as it was after the first v2 build (the NRG-style phase story) |
| `2026-11-12-before-v2-nrg-match/` | before matching v2 to the NRG reference (colours, interface styling, one-step-per-scroll) | the whole `v2/src/` folder and `v2/index.html` after the first visual upgrade |
| `2026-11-12-before-v2-journey/` | before the compact scroll journey, the daylight lobby entrance, the new tower architecture and the world pass | the whole `v2/src/` folder and `v2/index.html` after the NRG-matching pass |
| `2026-11-13-before-ui-pass/` | before the Nexora UI pass (text wipe everywhere, scroll-back, 360° turntables, Book a Demo + Log in buttons, demo form, yellow buttons, warm entrance, shining "powered by") | `v2/index.html`, `v2/public/scripts.js`, `style.css`, `content.json`, the identical copies at the repo root, and `package.json` |
| `2026-11-13-before-360-picture-revert/` | before the live 3D villa / community models were removed (the user wanted the 360° on the existing pictures, not new 3D) | the 3D source (`v2/nexora-src/turntable/`), its build script, the built `v2/public/nexora/` folder (with `turntable.js` and the `3d/` textures), and `v2/index.html`, `content.json`, `scripts.js`, `package.json`, `v2/README.md` as they were with the 3D models. To bring the 3D back, copy these files back into place. |
