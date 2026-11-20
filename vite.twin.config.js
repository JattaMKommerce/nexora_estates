import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * The live 3D twin for the Nexora website: `npm run build:twin` writes twin/ at the site root.
 *   twin/js/twin.js      entry (nexora/nexora-twin.js imports it on demand)
 *   twin/assets/…        models, textures, sky, 360° panoramas (from public/assets)
 *   twin/properties/…    the property data (from public/properties)
 * Everything is served under /twin/, so the 3D's file paths (`/assets/…`) become `/twin/assets/…`.
 * Section A's film frames (public/assets/section-a) are not used by the twin and are left out.
 */
const OUT = 'twin';
const COPY = ['assets/hdri', 'assets/models', 'assets/pano', 'assets/tex', 'assets/CREDITS.md', 'properties'];

function copyPublic() {
  return {
    name: 'twin-copy-public',
    apply: 'build',
    closeBundle() {
      for (const p of COPY) {
        const from = path.resolve('public', p);
        if (fs.existsSync(from)) fs.cpSync(from, path.resolve(OUT, p), { recursive: true });
      }
      // the 3D reads properties/<slug>/property.json; the catalogue is only used by the 3D website
    }
  };
}

export default defineConfig({
  plugins: [react(), copyPublic()],
  base: '/twin/',
  publicDir: false,
  build: {
    outDir: OUT,
    emptyOutDir: true,
    target: 'es2020',
    assetsDir: 'js',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: { twin: path.resolve('src/embed/twin-entry.js') },
      preserveEntrySignatures: 'exports-only',
      output: { entryFileNames: 'js/twin.js', chunkFileNames: 'js/[name]-[hash].js', assetFileNames: 'js/[name]-[hash][extname]' }
    }
  }
});
