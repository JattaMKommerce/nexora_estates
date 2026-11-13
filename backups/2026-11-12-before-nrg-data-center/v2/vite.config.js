import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

/**
 * v2: the phase-by-phase "Build your residence" story, a separate site next to the original one.
 *
 *   npm run dev:v2      → http://localhost:5174   (the original site keeps running on 5173 with `npm run dev`)
 *   npm run build:v2    → dist-v2/
 *
 * It shares the original site's public/ folder (property data, textures, stills), so both sites read
 * the same project data. Nothing in src/ is imported or changed.
 */
const here = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: here('.'),
  publicDir: here('../public'),
  cacheDir: here('../node_modules/.vite-v2'),
  plugins: [react()],
  build: {
    outDir: here('../dist-v2'),
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 2000
  },
  server: { port: 5174 },
  preview: { port: 4174 }
});
