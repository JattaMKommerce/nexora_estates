// Renders Section A of the home page (the film and the drawing card) from the 3D model.
//
//   npm run dev            (in another terminal)
//   node scripts/render-section-a.mjs [--slug meridian-residences] [--base http://127.0.0.1:5173]
//        [--wide 220] [--tall 180] [--at 0,0.3,0.5] [--out <dir>]
//
// Writes public/assets/section-a/<slug>/{wide,tall}/NNNN.webp, drawing-{tall,wide}.webp and
// manifest.json. --at renders only those moments (0–1) into --out, for checking the look.
//
// Needs Google Chrome and the puppeteer-core package, which is not a dependency of this project:
// set PUPPETEER to its path (e.g. PUPPETEER=/path/to/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js).
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((out, a, i, all) => (a.startsWith('--') ? [...out, [a.slice(2), all[i + 1]]] : out), [])
);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = args.slug || 'meridian-residences';
const BASE = args.base || 'http://127.0.0.1:5173';
const OUT = args.out || join(ROOT, 'public/assets/section-a', SLUG);
const AT = args.at ? args.at.split(',').map(Number) : null;
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VARIANTS = [
  { id: 'wide', w: 1600, h: 900, count: Number(args.wide || 220) },
  { id: 'tall', w: 720, h: 1280, count: Number(args.tall || 180) }
].filter((v) => !args.only || args.only.split(',').includes(v.id));
// Frames per unit of film time in each chapter (relative): denser where the picture changes most
// between frames (the climb, and the full turn at the top), so scrolling slowly stays smooth.
const DENSITY = [
  [0, 0.4, 1],
  [0.4, 0.62, 0.9],
  [0.62, 0.84, 1.25],
  [0.84, 1, 2.2]
];
function filmTimes(n) {
  const total = DENSITY.reduce((s, [a, z, d]) => s + (z - a) * d, 0);
  return Array.from({ length: n }, (_, i) => {
    let m = (i / (n - 1)) * total;
    for (const [a, z, d] of DENSITY) {
      const w = (z - a) * d;
      if (m <= w + 1e-9) return Math.min(1, a + m / d);
      m -= w;
    }
    return 1;
  }).map((t) => Math.round(t * 1e5) / 1e5);
}

const DRAWINGS = [
  { id: 'tall', w: 1120, h: 1280 },
  { id: 'wide', w: 1368, h: 1200 }
];

const { default: puppeteer } = await import(process.env.PUPPETEER || 'puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars']
});
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

async function renderFilm(v) {
  const page = await browser.newPage();
  // a desktop screen, so the app picks its full-quality profile (render mode forces it anyway)
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(screen, 'width', { get: () => 1920 });
    Object.defineProperty(screen, 'height', { get: () => 1080 });
  });
  page.on('pageerror', (e) => log('pageerror', e.message));
  await page.setViewport({ width: v.w, height: v.h, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/__render/section-a?slug=${SLUG}&mode=frames`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__film?.status === 'ready', { timeout: 180000 });
  await sleep(4000); // reflections, window views and shaders settle
  const dir = AT ? OUT : join(OUT, v.id);
  if (!AT) rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const times = AT || filmTimes(v.count);
  const t0 = Date.now();
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    await page.evaluate((x) => window.__film.set(x), t);
    await page.waitForFunction((x) => window.__film.done() === x, { timeout: 30000, polling: 30 }, t);
    const name = AT ? `${v.id}-${t.toFixed(3)}.webp` : `${String(i).padStart(4, '0')}.webp`;
    await page.screenshot({ path: join(dir, name), type: 'webp', quality: AT ? 90 : 74 });
    if (!AT && i % 20 === 0) log(v.id, `${i}/${times.length}`, `${((Date.now() - t0) / (i + 1) / 1000).toFixed(2)} s/frame`);
  }
  await page.close();
  return { w: v.w, h: v.h, count: times.length, times };
}

async function renderDrawing(d) {
  const page = await browser.newPage();
  await page.setViewport({ width: d.w, height: d.h, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/__render/section-a?slug=${SLUG}&mode=drawing&layout=${d.id}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__drawingReady === true, { timeout: 60000 });
  await sleep(400);
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: join(OUT, `drawing-${d.id}.webp`), type: 'webp', quality: 88 });
  await page.close();
  return { w: d.w, h: d.h, src: `drawing-${d.id}.webp` };
}

const MANIFEST = join(OUT, 'manifest.json');
const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const manifest = { frames: {}, drawing: {}, ...previous, slug: SLUG, rendered: new Date().toISOString().slice(0, 10) };
if (!args['no-drawing']) for (const d of DRAWINGS) manifest.drawing[d.id] = await renderDrawing(d);
for (const v of VARIANTS) {
  log('rendering', v.id);
  manifest.frames[v.id] = { ...(await renderFilm(v)), pattern: `${v.id}/{n}.webp`, pad: 4 };
}
if (!AT) writeFileSync(MANIFEST, JSON.stringify(manifest) + '\n');
log('done', OUT);
await browser.close();
