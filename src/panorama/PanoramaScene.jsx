import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import gsap from 'gsap';

/**
 * 360° viewer for equirectangular panoramas (2:1 images). Drag to look around (with inertia),
 * wheel / pinch / buttons to zoom, hotspots to move between rooms, cross-fades between scenes.
 *
 * Yaw is in degrees from the centre of the image (positive = to the right), pitch is positive
 * upwards — the same convention as the `yaw` / `hotspots` fields in the data file.
 */
const RADIUS = 400;
const DEG = Math.PI / 180;
const cache = new Map();
const loader = new THREE.TextureLoader();

function loadPano(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      new Promise((resolve, reject) =>
        loader.load(
          url,
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.minFilter = THREE.LinearFilter;
            t.generateMipmaps = false;
            resolve(t);
          },
          undefined,
          reject
        )
      )
    );
  }
  return cache.get(url);
}

/** Direction for a yaw / pitch on the inverted sphere (image centre is −x). */
export function panoDir(yaw, pitch, out = new THREE.Vector3()) {
  const y = yaw * DEG;
  const p = pitch * DEG;
  return out.set(-Math.cos(y) * Math.cos(p), Math.sin(p), -Math.sin(y) * Math.cos(p));
}

export default function PanoramaScene({ tour, sceneId, onScene, onReady, onError, zoomToken, reducedMotion }) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const scene = tour.scenes.find((s) => s.id === sceneId) || tour.scenes[0];
  const geometry = useMemo(() => {
    const g = new THREE.SphereGeometry(RADIUS, 72, 48);
    g.scale(-1, 1, 1);
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const front = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false, fog: false }), []);
  const back = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false, fog: false }), []);
  useEffect(() => () => {
    front.dispose();
    back.dispose();
  }, [front, back]);

  const view = useRef({ yaw: scene.yaw || 0, pitch: 0, vy: 0, vp: 0, fov: 75 });
  const dragging = useRef(false);
  const [shown, setShown] = useState(null);
  const readySent = useRef(false);

  useLayoutEffect(() => {
    const prev = { fov: camera.fov, near: camera.near, far: camera.far, pos: camera.position.clone() };
    camera.position.set(0, 0, 0);
    camera.near = 0.1;
    camera.far = RADIUS * 2;
    camera.fov = 75;
    camera.updateProjectionMatrix();
    return () => {
      camera.fov = prev.fov;
      camera.near = prev.near;
      camera.far = prev.far;
      camera.position.copy(prev.pos);
      camera.updateProjectionMatrix();
    };
  }, [camera]);

  // load + cross-fade
  useEffect(() => {
    let cancelled = false;
    loadPano(scene.image)
      .then((tex) => {
        if (cancelled) return;
        if (front.map && front.map !== tex) {
          back.map = front.map;
          back.opacity = front.opacity;
          back.needsUpdate = true;
        }
        front.map = tex;
        front.opacity = 0;
        front.needsUpdate = true;
        const v = view.current;
        const d = reducedMotion ? 0 : 0.9;
        gsap.to(front, { opacity: 1, duration: d, ease: 'power2.out' });
        gsap.to(back, { opacity: 0, duration: d, ease: 'power2.out' });
        if (shown !== null) {
          gsap.fromTo(v, { fov: Math.max(40, v.fov - 14) }, { fov: 75, duration: reducedMotion ? 0 : 1.1, ease: 'power3.out' });
          v.yaw = scene.yaw || 0;
          v.pitch = 0;
        }
        setShown(scene.id);
        if (!readySent.current) {
          readySent.current = true;
          onReady?.();
        }
        // warm the next scenes
        scene.hotspots.forEach((h) => {
          const next = tour.scenes.find((s) => s.id === h.to);
          if (next) loadPano(next.image).catch(() => {});
        });
      })
      .catch((err) => {
        if (!cancelled) onError?.(err);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id]);

  // drag / wheel / pinch
  useEffect(() => {
    const el = gl.domElement;
    const pointers = new Map();
    let pinch = 0;
    let last = null;
    const k = () => (view.current.fov / 75) * 0.18;
    const down = (e) => {
      el.setPointerCapture?.(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      last = { x: e.clientX, y: e.clientY, t: performance.now() };
      dragging.current = true;
      view.current.vy = 0;
      view.current.vp = 0;
    };
    const move = (e) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const v = view.current;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch) v.fov = THREE.MathUtils.clamp(v.fov * (pinch / dist), 30, 90);
        pinch = dist;
        return;
      }
      if (!last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      v.yaw -= dx * k();
      v.pitch = THREE.MathUtils.clamp(v.pitch + dy * k(), -85, 85);
      const dt = Math.max(1, performance.now() - last.t);
      v.vy = (-dx * k()) / dt;
      v.vp = (dy * k()) / dt;
      last = { x: e.clientX, y: e.clientY, t: performance.now() };
    };
    const up = (e) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = 0;
      if (!pointers.size) {
        last = null;
        dragging.current = false;
      }
    };
    const wheel = (e) => {
      e.preventDefault();
      view.current.fov = THREE.MathUtils.clamp(view.current.fov + e.deltaY * 0.04, 30, 90);
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
    const prevAction = el.style.touchAction;
    el.style.touchAction = 'none';
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
      el.style.touchAction = prevAction;
    };
  }, [gl]);

  useEffect(() => {
    if (!zoomToken?.n) return;
    view.current.fov = THREE.MathUtils.clamp(view.current.fov + zoomToken.delta * 10, 30, 90);
  }, [zoomToken]);

  const dir = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const v = view.current;
    if (!dragging.current) {
      const decay = Math.pow(0.0025, dt);
      v.yaw += v.vy * dt * 1000;
      v.pitch = THREE.MathUtils.clamp(v.pitch + v.vp * dt * 1000, -85, 85);
      v.vy *= decay;
      v.vp *= decay;
    }
    if (Math.abs(camera.fov - v.fov) > 0.01) {
      camera.fov += (v.fov - camera.fov) * Math.min(1, dt * 10);
      camera.updateProjectionMatrix();
    }
    camera.lookAt(panoDir(v.yaw, v.pitch, dir));
  });

  return (
    <>
      <mesh geometry={geometry} material={back} renderOrder={0} />
      <mesh geometry={geometry} material={front} renderOrder={1} />
      {shown === scene.id &&
        scene.hotspots.map((h) => {
          const target = tour.scenes.find((s) => s.id === h.to);
          if (!target) return null;
          return <Hotspot key={`${scene.id}-${h.to}`} h={h} label={h.label || target.name} onGo={() => onScene(h.to)} />;
        })}
    </>
  );
}

/** A marker on the sphere. Hidden while it is behind the viewer (projection would mirror it in front). */
function Hotspot({ h, label, onGo }) {
  const camera = useThree((st) => st.camera);
  const el = useRef(null);
  const dir = useMemo(() => panoDir(h.yaw, h.pitch), [h.yaw, h.pitch]);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    if (!el.current) return;
    camera.getWorldDirection(fwd);
    const show = fwd.dot(dir) > 0.15;
    el.current.style.visibility = show ? 'visible' : 'hidden';
  });
  const p = dir.clone().multiplyScalar(30);
  return (
    <Html position={[p.x, p.y, p.z]} center zIndexRange={[20, 0]}>
      <button ref={el} type="button" className="hotspot" onClick={onGo} style={{ visibility: 'hidden' }}>
        <span className="hotspot__ring" aria-hidden="true" />
        <span className="hotspot__label">{label}</span>
      </button>
    </Html>
  );
}
