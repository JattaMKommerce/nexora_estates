import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Load something asynchronously for a page: { status: 'loading' | 'ready' | 'error', data, error, retry }.
 * `key` identifies what is being loaded; when it changes, the load runs again.
 */
export function useResource(load, key) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null, key });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    setState((s) => (s.status === 'loading' && s.key === key ? s : { status: 'loading', data: null, error: null, key }));
    load().then(
      (data) => live && setState({ status: 'ready', data, error: null, key }),
      (error) => live && setState({ status: 'error', data: null, error, key })
    );
    return () => {
      live = false;
    };
    // `load` is a new closure on every render; `key` and `attempt` decide when to reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, attempt]);
  // Until the effect for a new key runs, report loading rather than the previous key's data.
  const current = state.key === key ? state : { status: 'loading', data: null, error: null };
  return { ...current, retry: () => setAttempt((n) => n + 1) };
}

/** Site settings (site.json) for every page. */
export const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);

/** Page title: "<page> · <brand>", or "<brand> · <tagline>" for the home page. */
export function useTitle(title) {
  const site = useSite();
  useEffect(() => {
    const brand = site?.brand.name || '';
    document.title = title ? [title, brand].filter(Boolean).join(' · ') : [brand, site?.brand.tagline].filter(Boolean).join(' · ');
  }, [title, site]);
}
