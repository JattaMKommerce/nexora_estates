/**
 * Vite plugin for the static website.
 *
 * 1. Catalogue. `properties/index.json` is generated from `public/properties/<slug>/property.json`:
 *    served live by the dev server, written into dist/ by the build. Each property's data has a
 *    single source (its own file); the catalogue is never edited by hand.
 *
 * 2. One HTML file per route. A static host has no router, so a direct visit to /properties/x or a
 *    refresh on /saas needs a real file there. After the build, dist/index.html is copied to
 *    dist/<route>/index.html for every route and every property, with that page's <title> and
 *    description. dist/404.html is also written: hosts that serve it for unknown paths then still
 *    open the site (and its "page not found" view, or a property added after the build).
 */
import fs from 'node:fs';
import path from 'node:path';
import { concretePaths, NOT_FOUND } from '../src/routes.js';
import { buildCatalogue } from '../src/data/catalogue.js';
import { isSlug, PROTOTYPE_SLUG } from '../src/data/slug.js';

/** [{ slug, raw }] for every valid property folder; problems are reported, never silently fixed. */
export function readProperties(publicDir, warn = console.warn) {
  const dir = path.join(publicDir, 'properties');
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name, 'property.json');
    if (!fs.statSync(path.join(dir, name)).isDirectory() || !fs.existsSync(file)) continue;
    if (!isSlug(name) || name === PROTOTYPE_SLUG) {
      warn(`properties/${name}: folder name must be lower-case letters, digits and dashes (and not "${PROTOTYPE_SLUG}"); skipped.`);
      continue;
    }
    try {
      out.push({ slug: name, raw: JSON.parse(fs.readFileSync(file, 'utf8')) });
    } catch (e) {
      warn(`properties/${name}/property.json is not valid JSON (${e.message}); skipped.`);
    }
  }
  return out;
}

function readSite(publicDir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(publicDir, 'site.json'), 'utf8'));
  } catch {
    return {};
  }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function pageHtml(template, { title, description, noindex }) {
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  if (description) {
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(description)}" />`);
  }
  if (noindex) html = html.replace('</head>', '    <meta name="robots" content="noindex" />\n  </head>');
  return html;
}

export default function staticSite() {
  let config;
  const catalogue = (warn) => buildCatalogue(readProperties(config.publicDir, warn));

  return {
    name: 'restate-static-site',

    configResolved(c) {
      config = c;
    },

    configureServer(server) {
      const url = `${config.base}properties/index.json`;
      server.middlewares.use((req, res, next) => {
        if ((req.url || '').split('?')[0] !== url) return next();
        try {
          const body = JSON.stringify(catalogue((m) => server.config.logger.warn(`[catalogue] ${m}`)), null, 2);
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.end(body);
        } catch (e) {
          next(e);
        }
      });
    },

    generateBundle() {
      const data = catalogue((m) => this.warn(m));
      this.emitFile({ type: 'asset', fileName: 'properties/index.json', source: `${JSON.stringify(data, null, 2)}\n` });
    },

    closeBundle() {
      if (config.command !== 'build') return;
      const out = path.resolve(config.root, config.build.outDir);
      const indexFile = path.join(out, 'index.html');
      if (!fs.existsSync(indexFile)) return;
      const template = fs.readFileSync(indexFile, 'utf8');
      const site = readSite(config.publicDir);
      const brand = (typeof site.brand?.name === 'string' && site.brand.name.trim()) || 'Restate';
      const tagline = typeof site.brand?.tagline === 'string' ? site.brand.tagline.trim() : '';
      const entries = readProperties(config.publicDir, () => {});
      const names = Object.fromEntries(entries.map((e) => [e.slug, (e.raw?.project?.name || e.slug).trim()]));

      let written = 0;
      for (const { path: p, route, params } of concretePaths(entries.map((e) => e.slug))) {
        const propertyName = params.slug ? (params.slug === PROTOTYPE_SLUG ? 'Prototype tower' : names[params.slug]) : null;
        const title =
          route.id === 'home'
            ? [brand, tagline].filter(Boolean).join(' · ')
            : [route.id === 'experience' ? `${propertyName} in 3D` : propertyName || route.title, brand].filter(Boolean).join(' · ');
        const description =
          route.description ||
          (route.id === 'property' ? `${propertyName}: towers, homes, availability, floor plans and a 3D tour.` : null) ||
          (route.id === 'experience' ? `Explore ${propertyName} in 3D: towers, floors, residences, floor plans and interiors.` : null);
        const html = pageHtml(template, { title, description, noindex: route.noindex });
        const file = p === '/' ? indexFile : path.join(out, p.slice(1), 'index.html');
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, html);
        written += 1;
      }
      fs.writeFileSync(path.join(out, '404.html'), pageHtml(template, { title: `${NOT_FOUND.title} · ${brand}`, noindex: true }));
      config.logger.info(`\n[static-site] ${written} route pages + 404.html written for ${entries.length} properties`);
    }
  };
}
