/**
 * Entry of the twin bundle (twin/js/twin.js), loaded by nexora/nexora-twin.js only when the visitor
 * nears a phase that shows the 3D. Kept tiny: the 3D code is a separate chunk, imported on demand,
 * so its styles are injected along with it.
 */
export const mount = (el, opts) => import('./NexoraTwin.jsx').then((m) => m.mount(el, opts));
