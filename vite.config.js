import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import staticSite from './scripts/static-site.mjs';

/**
 * Static site: `npm run build` writes everything to dist/, including an HTML file for every route
 * (scripts/static-site.mjs), so any static host serves direct visits and refreshes.
 *
 * Pages live at nested paths (/properties/<slug>), so file URLs are absolute from the site root.
 * The site is built for the domain root by default; for a sub-folder, build with
 *   BASE_PATH=/folder/ npm run build
 */
function basePath() {
  const b = (process.env.BASE_PATH || '/').trim();
  return `/${b}/`.replace(/\/{2,}/g, '/');
}

export default defineConfig({
  plugins: [react(), staticSite()],
  base: basePath(),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1500
  },
  server: { port: 5173 },
  preview: { port: 4173 }
});
