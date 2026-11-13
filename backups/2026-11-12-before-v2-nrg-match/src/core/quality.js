/**
 * One quality profile per device, chosen once.
 * - high: Apple silicon and discrete graphics — everything on.
 * - mid: integrated laptop graphics (e.g. Intel Iris) — the same look with lighter ambient
 *   occlusion, fewer trees, a smaller mirror floor and a capped pixel ratio.
 * - low: phones and tablets — their own layout and a lighter scene; nothing is squeezed.
 * Force a profile with ?q=high, ?q=mid or ?q=low.
 */
function gpuName() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return '';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return String(name || '');
  } catch {
    return '';
  }
}

export function detectQuality() {
  const params = new URLSearchParams(location.search);
  const forced = params.get('q');
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const gpu = gpuName();
  let tier = 'high';
  if (coarse && small) tier = 'low';
  else if (/Intel|UHD|Iris|HD Graphics|SwiftShader|llvmpipe/i.test(gpu) && !/Apple/i.test(gpu)) tier = 'mid';
  else if ((navigator.hardwareConcurrency || 8) <= 4) tier = 'mid';
  if (forced === 'high' || forced === 'mid' || forced === 'low') tier = forced;
  const dprMax = { high: 1.75, mid: 1.25, low: 1.5 }[tier];
  return {
    tier,
    gpu,
    low: tier === 'low',
    dpr: Math.min(dprMax, window.devicePixelRatio || 1),
    trees: { high: 4600, mid: 3400, low: 1700 }[tier],
    shadow: { high: 4096, mid: 2048, low: 2048 }[tier],
    ao: tier !== 'low',
    aoSamples: tier === 'high' ? 16 : 8,
    aoDenoise: tier === 'high' ? 8 : 4,
    aoQuality: tier === 'high' ? 'medium' : 'performance',
    terrainSeg: { high: 340, mid: 280, low: 220 }[tier],
    reflector: tier !== 'low',
    reflectorRes: tier === 'high' ? 1024 : 512,
    tiltSamples: tier === 'high' ? 8 : 5,
    corridorLights: { high: 9, mid: 7, low: 4 }[tier],
    shadowEvery: tier === 'high' ? 6 : 12 // frames between shadow refreshes while nothing is being built
  };
}

export const quality = typeof window !== 'undefined' ? detectQuality() : { low: false, tier: 'high' };
