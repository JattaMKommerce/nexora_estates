import { DataError } from './errors.js';

/**
 * GET a JSON file with a timeout and clear, user-facing errors.
 * Many static hosts (and the dev server) answer a missing file with the site's own index.html,
 * so an HTML response counts as "not found" rather than "invalid JSON".
 */
export async function fetchJson(url, { label, notFound, signal, timeout = 12000 } = {}) {
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  const timer = setTimeout(() => ctrl.abort(), timeout);
  const name = label || String(url);
  try {
    let res;
    try {
      res = await fetch(url, { signal: ctrl.signal, cache: 'no-cache', headers: { Accept: 'application/json' } });
    } catch (err) {
      if (signal?.aborted) throw err;
      throw new DataError(ctrl.signal.aborted ? `${name} took too long to load.` : `${name} could not be loaded.`, 'NETWORK');
    }
    if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) {
      throw new DataError(notFound || `${name} is missing from this site.`, 'NOT_FOUND');
    }
    if (!res.ok) {
      throw new DataError(
        res.status === 404 ? notFound || `${name} is missing from this site.` : `${name} could not be loaded (HTTP ${res.status}).`,
        res.status === 404 ? 'NOT_FOUND' : 'HTTP'
      );
    }
    try {
      return await res.json();
    } catch {
      throw new DataError(`${name} is not valid JSON. Check for a missing comma, quote or bracket.`, 'INVALID');
    }
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}
