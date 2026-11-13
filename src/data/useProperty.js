import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchProperty } from './property.js';
import { propertyLocation } from './source.js';
import { createPrototypeProject } from './prototype.js';

/**
 * The 3D experience's property: `properties/<slug>/property.json`, or the built-in prototype.
 *
 * status: 'loading' | 'ready' | 'error'
 * - ready → project is set (from the property's data file, or the built-in prototype)
 * - error → data file missing or invalid; retry or open the built-in prototype
 */
export function useProperty({ slug, prototype: forcePrototype = false }) {
  const location = useMemo(() => propertyLocation(slug), [slug]);
  const [state, setState] = useState({ status: 'loading', project: null, error: null });
  const ctrlRef = useRef(null);

  const load = useCallback(async () => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    setState({ status: 'loading', project: null, error: null });
    try {
      const project = await fetchProperty(location, { signal: ctrl.signal });
      if (!ctrl.signal.aborted) setState({ status: 'ready', project, error: null });
    } catch (error) {
      if (!ctrl.signal.aborted) setState({ status: 'error', project: null, error });
    }
  }, [location]);

  const showPrototype = useCallback(() => {
    ctrlRef.current?.abort();
    setState({ status: 'ready', project: createPrototypeProject(), error: null });
  }, []);

  useEffect(() => {
    if (forcePrototype) showPrototype();
    else load();
    return () => ctrlRef.current?.abort();
  }, [forcePrototype, load, showPrototype]);

  return { ...state, location, retry: load, showPrototype };
}
