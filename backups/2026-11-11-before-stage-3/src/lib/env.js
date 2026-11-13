import { useEffect, useState } from 'react';

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext(); // free the probe context straight away
    return true;
  } catch {
    return false;
  }
}

/** Browser-specific steps for turning WebGL back on, for the "can't show 3D" screen. */
export function webglAdvice() {
  const ua = navigator.userAgent || '';
  if (/\bCode\/|Electron\//.test(ua)) {
    return {
      browser: 'an in-app preview browser',
      steps: ['Open this address in Chrome, Safari, Edge or Firefox instead; built-in editor previews often have 3D graphics turned off.']
    };
  }
  if (/Firefox\//.test(ua)) {
    return {
      browser: 'Firefox',
      steps: [
        'Open Settings → General → Performance and turn on “Use hardware acceleration when available”, then restart Firefox.',
        'about:support shows whether WebGL is blocked.'
      ]
    };
  }
  if (/Edg\//.test(ua) || /Chrome\//.test(ua)) {
    const name = /Edg\//.test(ua) ? 'Edge' : 'Chrome';
    return {
      browser: name,
      steps: [
        `Open ${name} Settings → System and turn on “Use graphics acceleration when available”, then relaunch.`,
        `If it is already on, quit ${name} completely and reopen it: after a graphics crash it turns 3D off until restart.`,
        `${name === 'Edge' ? 'edge' : 'chrome'}://gpu shows whether WebGL is available.`
      ]
    };
  }
  if (/Safari\//.test(ua)) {
    return {
      browser: 'Safari',
      steps: ['Safari has WebGL on by default. Try a new window, or check Develop → Feature Flags if developer features are enabled.']
    };
  }
  return { browser: 'this browser', steps: ['Try a current version of Chrome, Safari, Edge or Firefox with hardware acceleration on.'] };
}

const query = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q) : null);

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => Boolean(query('(prefers-reduced-motion: reduce)')?.matches));
  useEffect(() => {
    const mq = query('(prefers-reduced-motion: reduce)');
    if (!mq) return undefined;
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

const COMPACT_MAX = 760;

export function useViewport() {
  const read = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    compact: window.innerWidth <= COMPACT_MAX
  });
  const [vp, setVp] = useState(read);
  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setVp(read()));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return vp;
}

export const isCoarsePointer = () => Boolean(query('(pointer: coarse)')?.matches);

/** Rendering budget: phones and tablets get a lighter scene. */
export function detectQuality() {
  const coarse = isCoarsePointer();
  const small = Math.min(window.screen?.width || 1280, window.screen?.height || 800) < 820;
  const low = coarse || small;
  const fx = new URLSearchParams(window.location.search).get('fx') !== '0';
  return {
    low,
    fx,
    dpr: low ? [1, 1.6] : [1, 2],
    shadowMapSize: low ? 1024 : 2048,
    contextDensity: low ? 0.55 : 0.9
  };
}

export const fullscreenSupported = () =>
  typeof document !== 'undefined' && Boolean(document.documentElement.requestFullscreen) && document.fullscreenEnabled !== false;
