import * as THREE from 'three';

/**
 * Hotspots are HTML elements pinned to points in the 3D model. Each frame the director projects
 * every registered point through the camera and moves its element there (no React renders).
 */
const anchors = new Map();
const v = new THREE.Vector3();

export function registerAnchor(id, el, pos) {
  if (!el) {
    anchors.delete(id);
    return;
  }
  anchors.set(id, { el, pos: new THREE.Vector3(...pos) });
}

export function project(camera, size) {
  if (!anchors.size) return;
  for (const a of anchors.values()) {
    v.copy(a.pos).project(camera);
    const behind = v.z > 1;
    const x = (v.x * 0.5 + 0.5) * size.width;
    const y = (-v.y * 0.5 + 0.5) * size.height;
    const off = behind || x < -40 || x > size.width + 40 || y < -40 || y > size.height + 40;
    a.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    a.el.classList.toggle('is-off', off);
  }
}

/** Screen position of a world point (for the board that opens next to a hotspot). */
export function screenOf(pos, camera, size) {
  v.set(...pos).project(camera);
  return { x: (v.x * 0.5 + 0.5) * size.width, y: (-v.y * 0.5 + 0.5) * size.height };
}
