import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

// Hannah's server (/api/hannah.php) is plain PHP, as on Hostinger. In development the PHP built-in
// server runs it from the repo root, and Vite forwards /api/* to it.
const PHP_PORT = 8790;
function hannahApi() {
  let php = null;
  return {
    name: 'hannah-php-api',
    configureServer(server) {
      php = spawn('php', ['-S', `127.0.0.1:${PHP_PORT}`, '-t', here('..')], { stdio: 'ignore' });
      php.on('error', () => {
        server.config.logger.warn('[hannah] PHP not found: Hannah will use the browser voice and the knowledge base only.');
      });
      server.httpServer?.on('close', () => php && php.kill());
    }
  };
}

export default defineConfig({
  root: here('.'),
  publicDir: here('public'),
  cacheDir: here('../node_modules/.vite-v2'),
  plugins: [hannahApi()],
  build: {
    outDir: here('../dist'),
    emptyOutDir: true,
    target: 'es2020'
  },
  server: {
    port: 5174,
    cors: true,
    proxy: { '/api': { target: `http://127.0.0.1:${PHP_PORT}`, changeOrigin: false } }
  },
  preview: {
    port: 4174,
    cors: true,
    proxy: { '/api': { target: `http://127.0.0.1:${PHP_PORT}`, changeOrigin: false } }
  }
});
