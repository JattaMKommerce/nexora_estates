import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5175,
    host: true
  },
  preview: {
    port: 4175,
    host: true
  }
});

