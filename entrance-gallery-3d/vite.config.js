import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    port: 5175,
    host: true
  },
  plugins: [
    {
      name: 'serve-site-evaluation',
      configureServer(server) {
        server.middlewares.use('/site-evaluation', (req, res, next) => {
          let reqPath = req.url.split('?')[0];
          if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
          const filePath = path.resolve(__dirname, '../site-evaluation', '.' + reqPath);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath);
            const mimeTypes = {
              '.html': 'text/html',
              '.js': 'application/javascript',
              '.css': 'text/css',
              '.json': 'application/json',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.svg': 'image/svg+xml'
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
            return fs.createReadStream(filePath).pipe(res);
          }
          next();
        });
      }
    }
  ],
  preview: {
    port: 4175,
    host: true
  }
});
