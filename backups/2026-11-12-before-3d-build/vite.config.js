import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: here('.'),
  publicDir: here('public'),
  cacheDir: here('../node_modules/.vite-v2'),
  build: {
    outDir: here('../dist-v2'),
    emptyOutDir: true,
    target: 'es2020'
  },
  server: {
    port: 5174,
    cors: true
  },
  preview: {
    port: 4174,
    cors: true
  }
});
