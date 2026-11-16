// Bundles the live 360° view (v2/nexora-src/turntable) and the parts of three.js it uses into one
// file, v2/public/nexora/turntable.js, which the static site loads as an ES module.
//   node scripts/build-turntable.mjs        (also run by `npm run build`)
import { build } from 'rolldown';
import { fileURLToPath } from 'node:url';
import { statSync } from 'node:fs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const out = here('../v2/public/nexora/turntable.js');

await build({
  input: here('../v2/nexora-src/turntable/main.js'),
  output: { file: out, format: 'esm', minify: true },
  logLevel: 'warn'
});
console.log('built', out, Math.round(statSync(out).size / 1024) + ' KB');
