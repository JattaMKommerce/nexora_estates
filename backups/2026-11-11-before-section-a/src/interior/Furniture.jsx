import { memo, useMemo } from 'react';
import * as THREE from 'three';
import { Clone, RoundedBox, useGLTF } from '@react-three/drei';
import { assetPath } from '../lib/paths.js';

/**
 * High-detail furniture for the apartment interior. Upholstery, beds, joinery, kitchens and
 * bathrooms are modelled here with textured materials; accent pieces (chairs, tables, plants,
 * lamps, art, the balcony set) are CC0 scanned models from Poly Haven.
 *
 * Every piece is built facing +z (its front) with width along x, sitting on y = 0.
 */

const MODEL = (name) => assetPath(`assets/models/${name}.glb`);
export const MODELS = {
  armchair: MODEL('modern_arm_chair_01'),
  lounge: MODEL('mid_century_lounge_chair'),
  coffeeTable: MODEL('coffee_table_round_01'),
  coffeeTableStone: MODEL('modern_coffee_table_01'),
  sideTable: MODEL('side_table_01'),
  plant1: MODEL('potted_plant_01'),
  plant2: MODEL('potted_plant_02'),
  plant4: MODEL('potted_plant_04'),
  pendant: MODEL('modern_ceiling_lamp_01'),
  balconySet: MODEL('outdoor_table_chair_set_01'),
  vase: MODEL('ceramic_vase_01'),
  vaseRound: MODEL('ceramic_vase_02'),
  vaseTall: MODEL('ceramic_vase_03'),
  photo: MODEL('standing_picture_frame_01'),
  art: MODEL('hanging_picture_frame_01')
};

export function preloadModels() {
  Object.values(MODELS).forEach((u) => useGLTF.preload(u, false, true));
}

const R = { castShadow: true, receiveShadow: true };

/** A scanned model scaled into the item's box. fit: 'height' | 'footprint'; anchor 'floor' | 'ceiling'. */
function Model({ url, w, d, h, fit = 'height', anchor = 'floor', turn = 0 }) {
  const { scene } = useGLTF(url, false, true);
  const { scale, offset } = useMemo(() => {
    const b = new THREE.Box3().setFromObject(scene);
    const size = b.getSize(new THREE.Vector3());
    const s =
      fit === 'footprint'
        ? Math.min(w / Math.max(size.x, 1e-3), d / Math.max(size.z, 1e-3))
        : h / Math.max(size.y, 1e-3);
    const c = b.getCenter(new THREE.Vector3());
    return { scale: s, offset: [-c.x * s, (anchor === 'ceiling' ? -b.max.y : -b.min.y) * s, -c.z * s] };
  }, [scene, w, d, h, fit, anchor]);
  return (
    <group rotation-y={turn}>
      <group position={offset} scale={scale}>
        <Clone object={scene} castShadow receiveShadow />
      </group>
    </group>
  );
}

function Sofa({ w, d, m }) {
  const seatH = 0.42;
  const armW = 0.2;
  return (
    <group>
      <RoundedBox args={[w, 0.24, d]} radius={0.05} smoothness={3} position={[0, 0.17, 0]} material={m.fabric} {...R} />
      <RoundedBox args={[w - 0.1, 0.5, 0.24]} radius={0.08} smoothness={3} position={[0, 0.6, -d / 2 + 0.14]} material={m.fabric} {...R} />
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[armW, 0.36, d]} radius={0.07} smoothness={3} position={[s * (w / 2 - armW / 2), 0.47, 0]} material={m.fabric} {...R} />
      ))}
      {[-1, 1].map((s) => (
        <RoundedBox
          key={`c${s}`}
          args={[(w - 2 * armW) / 2 - 0.02, 0.16, d - 0.32]}
          radius={0.06}
          smoothness={3}
          position={[s * ((w - 2 * armW) / 4), seatH - 0.02, 0.1]}
          material={m.fabric}
          {...R}
        />
      ))}
      {[-1, 1].map((s) => (
        <RoundedBox
          key={`b${s}`}
          args={[(w - 2 * armW) / 2 - 0.06, 0.42, 0.18]}
          radius={0.08}
          smoothness={3}
          position={[s * ((w - 2 * armW) / 4), 0.66, -d / 2 + 0.34]}
          rotation-x={-0.12}
          material={m.fabric}
          {...R}
        />
      ))}
      <RoundedBox args={[0.42, 0.36, 0.13]} radius={0.06} smoothness={3} position={[w / 2 - armW - 0.3, 0.62, -d / 2 + 0.48]} rotation={[-0.25, 0.25, 0.05]} material={m.fabric2} {...R} />
      <RoundedBox args={[0.45, 0.4, 0.14]} radius={0.07} smoothness={3} position={[-w / 2 + armW + 0.32, 0.64, -d / 2 + 0.46]} rotation={[-0.22, -0.3, -0.06]} material={m.throw} {...R} />
      <RoundedBox args={[0.38, 0.32, 0.12]} radius={0.06} smoothness={3} position={[-w / 2 + armW + 0.68, 0.6, -d / 2 + 0.5]} rotation={[-0.3, 0.12, 0.04]} material={m.fabric2} {...R} />
      {/* a folded throw over one arm */}
      <RoundedBox args={[armW + 0.06, 0.03, d * 0.62]} radius={0.012} smoothness={2} position={[w / 2 - armW / 2, 0.665, 0.05]} material={m.throw} {...R} />
      <RoundedBox args={[0.03, 0.34, d * 0.62]} radius={0.012} smoothness={2} position={[w / 2 + 0.015, 0.5, 0.05]} material={m.throw} {...R} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (w / 2 - 0.08), 0.03, sz * (d / 2 - 0.08)]} material={m.dark} {...R}>
            <cylinderGeometry args={[0.022, 0.018, 0.06, 10]} />
          </mesh>
        ))
      )}
    </group>
  );
}

function Bed({ w, d, m }) {
  return (
    <group>
      <RoundedBox args={[w + 0.06, 0.3, d]} radius={0.03} smoothness={2} position={[0, 0.19, 0]} material={m.fabric2} {...R} />
      <RoundedBox args={[w - 0.04, 0.24, d - 0.08]} radius={0.07} smoothness={3} position={[0, 0.45, 0.02]} material={m.bedding} {...R} />
      <RoundedBox args={[w + 0.02, 0.07, d * 0.64]} radius={0.03} smoothness={3} position={[0, 0.58, d / 2 - d * 0.32 + 0.02]} material={m.bedding} {...R} />
      <RoundedBox args={[w + 0.04, 0.04, 0.5]} radius={0.015} smoothness={2} position={[0, 0.625, d / 2 - 0.42]} material={m.throw} {...R} />
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[w * 0.42, 0.14, 0.42]} radius={0.06} smoothness={3} position={[s * w * 0.23, 0.64, -d / 2 + 0.32]} rotation-x={-0.35} material={m.bedding} {...R} />
      ))}
      <RoundedBox args={[w * 0.3, 0.12, 0.3]} radius={0.05} smoothness={3} position={[w * 0.12, 0.66, -d / 2 + 0.6]} rotation={[-0.25, 0.2, 0]} material={m.fabric} {...R} />
      <ChannelHeadboard w={w + 0.24} d={d} m={m} />
    </group>
  );
}

/** Upholstered headboard with vertical channel tufting. */
function ChannelHeadboard({ w, d, m }) {
  const n = Math.max(6, Math.round(w / 0.16));
  const cw = w / n;
  return (
    <group position={[0, 0, -d / 2 - 0.03]}>
      <mesh position={[0, 0.62, -0.03]} material={m.dark} castShadow receiveShadow>
        <boxGeometry args={[w, 1.18, 0.04]} />
      </mesh>
      {Array.from({ length: n }, (_, i) => (
        <RoundedBox key={i} args={[cw - 0.008, 1.12, 0.09]} radius={0.04} smoothness={3} position={[-w / 2 + cw * (i + 0.5), 0.63, 0.02]} material={m.fabric} {...R} />
      ))}
    </group>
  );
}

/** Arc floor lamp: a stone base, a slender arched stem and a dome shade glowing underneath. */
function FloorLamp({ m }) {
  const arc = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.08, 0), new THREE.Vector3(0, 2.3, 0), new THREE.Vector3(0, 1.95, 1.1));
    return new THREE.TubeGeometry(curve, 32, 0.012, 8, false);
  }, []);
  return (
    <group>
      <mesh position={[0, 0.04, 0]} material={m.counter} {...R}>
        <cylinderGeometry args={[0.17, 0.18, 0.08, 28]} />
      </mesh>
      <mesh geometry={arc} material={m.metal} castShadow />
      <group position={[0, 1.95, 1.1]}>
        <mesh position={[0, -0.08, 0]} material={m.metal} castShadow>
          <sphereGeometry args={[0.2, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh position={[0, -0.075, 0]} rotation-x={Math.PI} material={m.shade}>
          <sphereGeometry args={[0.19, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>
    </group>
  );
}

function Wardrobe({ w, d, h, m }) {
  const doors = Math.max(2, Math.round(w / 0.55));
  const dw = w / doors;
  return (
    <group>
      <mesh position={[0, h / 2, 0]} material={m.cabinet} {...R}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {Array.from({ length: doors - 1 }, (_, i) => (
        <mesh key={i} position={[-w / 2 + dw * (i + 1), h / 2, d / 2 + 0.001]} material={m.dark}>
          <boxGeometry args={[0.006, h - 0.04, 0.004]} />
        </mesh>
      ))}
      {Array.from({ length: doors }, (_, i) => (
        <mesh key={`h${i}`} position={[-w / 2 + dw * (i + 0.5) + (i % 2 ? -1 : 1) * (dw / 2 - 0.06), h * 0.5, d / 2 + 0.015]} material={m.metal}>
          <boxGeometry args={[0.012, 0.32, 0.02]} />
        </mesh>
      ))}
    </group>
  );
}

function Counter({ w, d, m, sink, hob }) {
  const units = Math.max(1, Math.round(w / 0.6));
  const uw = w / units;
  return (
    <group>
      <mesh position={[0, 0.06, -0.04]} material={m.dark}>
        <boxGeometry args={[w, 0.12, d - 0.08]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} material={m.cabinet} {...R}>
        <boxGeometry args={[w, 0.76, d - 0.02]} />
      </mesh>
      {Array.from({ length: units - 1 }, (_, i) => (
        <mesh key={i} position={[-w / 2 + uw * (i + 1), 0.5, d / 2 - 0.009]} material={m.dark}>
          <boxGeometry args={[0.005, 0.74, 0.004]} />
        </mesh>
      ))}
      <mesh position={[0, 0.9, 0.01]} material={m.counter} {...R}>
        <boxGeometry args={[w + 0.02, 0.04, d + 0.02]} />
      </mesh>
      {sink && (
        <group position={[Math.min(w / 2 - 0.5, 0.4), 0.92, 0]}>
          <mesh position={[0, -0.005, 0.02]} material={m.steel}>
            <boxGeometry args={[0.55, 0.012, 0.4]} />
          </mesh>
          <mesh position={[0, 0.16, -0.22]} material={m.metal}>
            <cylinderGeometry args={[0.014, 0.014, 0.32, 10]} />
          </mesh>
          <mesh position={[0, 0.31, -0.13]} rotation-x={Math.PI / 2} material={m.metal}>
            <cylinderGeometry args={[0.012, 0.012, 0.2, 10]} />
          </mesh>
        </group>
      )}
      {hob && (
        <group position={[0, 0.925, 0.02]}>
          <mesh material={m.screen}>
            <boxGeometry args={[0.62, 0.01, 0.52]} />
          </mesh>
          {[[-0.15, -0.12], [0.15, -0.12], [-0.15, 0.12], [0.15, 0.12]].map(([x, z]) => (
            <mesh key={`${x}${z}`} position={[x, 0.006, z]} rotation-x={-Math.PI / 2} material={m.frame}>
              <ringGeometry args={[0.07, 0.085, 32]} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function Upper({ w, d, h, m }) {
  const units = Math.max(1, Math.round(w / 0.6));
  const uw = w / units;
  return (
    <group>
      <mesh position={[0, h / 2, 0]} material={m.cabinet} {...R}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {Array.from({ length: units - 1 }, (_, i) => (
        <mesh key={i} position={[-w / 2 + uw * (i + 1), h / 2, d / 2 + 0.001]} material={m.dark}>
          <boxGeometry args={[0.005, h - 0.02, 0.004]} />
        </mesh>
      ))}
      <mesh position={[0, -0.01, 0.02]} material={m.bulb}>
        <boxGeometry args={[w - 0.1, 0.01, 0.03]} />
      </mesh>
    </group>
  );
}

function Fridge({ w, d, h, m }) {
  return (
    <group>
      <mesh position={[0, h / 2, 0]} material={m.steel} {...R}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      <mesh position={[0, h * 0.62, d / 2 + 0.001]} material={m.dark}>
        <boxGeometry args={[w - 0.02, 0.006, 0.004]} />
      </mesh>
      {[0.42, 0.8].map((y) => (
        <mesh key={y} position={[-w / 2 + 0.07, h * y, d / 2 + 0.03]} material={m.dark}>
          <boxGeometry args={[0.02, 0.4, 0.03]} />
        </mesh>
      ))}
    </group>
  );
}

function DiningTable({ w, d, h, m }) {
  return (
    <group>
      <RoundedBox args={[w, 0.045, d]} radius={0.015} smoothness={2} position={[0, h - 0.0225, 0]} material={m.wood} {...R} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (w / 2 - 0.12), (h - 0.045) / 2, sz * (d / 2 - 0.1)]} material={m.dark} {...R}>
            <boxGeometry args={[0.045, h - 0.045, 0.045]} />
          </mesh>
        ))
      )}
    </group>
  );
}

function DiningChair({ w, d, m }) {
  return (
    <group>
      <RoundedBox args={[w, 0.07, d - 0.04]} radius={0.025} smoothness={2} position={[0, 0.46, 0.02]} material={m.fabric2} {...R} />
      <RoundedBox args={[w, 0.36, 0.04]} radius={0.015} smoothness={2} position={[0, 0.72, -d / 2 + 0.03]} rotation-x={-0.1} material={m.wood} {...R} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * (w / 2 - 0.04), 0.215, sz * (d / 2 - 0.05)]} material={m.wood} {...R}>
            <cylinderGeometry args={[0.015, 0.012, 0.43, 8]} />
          </mesh>
        ))
      )}
    </group>
  );
}

function Books({ n = 4, m }) {
  const tones = [m.fabric2, m.throw, m.cabinet, m.dark];
  return (
    <group>
      {Array.from({ length: n }, (_, i) => (
        <mesh key={i} position={[0, 0.018 + i * 0.034, 0]} rotation-y={(i % 2 ? 0.08 : -0.05) + i * 0.03} material={tones[i % tones.length]} castShadow receiveShadow>
          <boxGeometry args={[0.26 - i * 0.02, 0.032, 0.19 - i * 0.01]} />
        </mesh>
      ))}
    </group>
  );
}

function TvUnit({ w, d, h, m }) {
  return (
    <group>
      <group position={[w / 2 - 0.22, h, 0]}>
        <Model url={MODELS.vaseTall} w={0.12} d={0.12} h={0.42} />
      </group>
      <group position={[-w / 2 + 0.3, h, 0.02]}>
        <Books n={3} m={m} />
        <group position={[0, 0.11, 0]}>
          <Model url={MODELS.vaseRound} w={0.16} d={0.16} h={0.2} />
        </group>
      </group>
      <mesh position={[0, h / 2 + 0.08, 0]} material={m.wood} {...R}>
        <boxGeometry args={[w, h - 0.08, d]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * w * 0.25, h / 2 + 0.08, d / 2 + 0.001]} material={m.dark}>
          <boxGeometry args={[0.005, h - 0.12, 0.003]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`l${s}`} position={[s * (w / 2 - 0.08), 0.04, 0]} material={m.dark}>
          <boxGeometry args={[0.03, 0.08, d - 0.08]} />
        </mesh>
      ))}
    </group>
  );
}

function Tv({ w, h, m }) {
  return (
    <group>
      <mesh position={[0, h / 2, 0]} material={m.frame} {...R}>
        <boxGeometry args={[w, h, 0.035]} />
      </mesh>
      <mesh position={[0, h / 2, 0.018]} material={m.screen}>
        <boxGeometry args={[w - 0.02, h - 0.02, 0.002]} />
      </mesh>
    </group>
  );
}

function Rug({ w, d, m }) {
  return (
    <RoundedBox args={[w, 0.012, d]} radius={0.005} smoothness={1} position={[0, 0.006, 0]} material={m.rug} receiveShadow />
  );
}

function Nightstand({ w, d, h, m, photo = false }) {
  return (
    <group>
      {photo && (
        <group position={[w * 0.22, h, -0.04]} rotation-y={-0.25}>
          <Model url={MODELS.photo} w={0.16} d={0.1} h={0.22} />
        </group>
      )}
      <mesh position={[0, h / 2 + 0.06, 0]} material={m.wood} {...R}>
        <boxGeometry args={[w, h - 0.06, d]} />
      </mesh>
      <mesh position={[0, h * 0.62, d / 2 + 0.001]} material={m.dark}>
        <boxGeometry args={[w - 0.04, 0.005, 0.003]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (w / 2 - 0.04), 0.03, 0]} material={m.dark}>
          <boxGeometry args={[0.025, 0.06, d - 0.06]} />
        </mesh>
      ))}
    </group>
  );
}

function Lamp({ m }) {
  return (
    <group>
      <mesh position={[0, 0.12, 0]} material={m.metal} {...R}>
        <cylinderGeometry args={[0.05, 0.07, 0.24, 20]} />
      </mesh>
      <mesh position={[0, 0.33, 0]} material={m.shade} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.22, 24, 1, true]} />
      </mesh>
    </group>
  );
}

function Wc({ m }) {
  return (
    <group>
      <RoundedBox args={[0.38, 0.4, 0.55]} radius={0.09} smoothness={4} position={[0, 0.2, 0.04]} material={m.ceramic} {...R} />
      <RoundedBox args={[0.4, 0.04, 0.5]} radius={0.02} smoothness={2} position={[0, 0.42, 0.06]} material={m.ceramic} {...R} />
      <RoundedBox args={[0.42, 0.42, 0.16]} radius={0.04} smoothness={3} position={[0, 0.63, -0.24]} material={m.ceramic} {...R} />
    </group>
  );
}

function Vanity({ w, d, m }) {
  return (
    <group>
      <mesh position={[0, 0.62, 0]} material={m.wood} {...R}>
        <boxGeometry args={[w, 0.42, d]} />
      </mesh>
      <mesh position={[0, 0.845, 0]} material={m.counter} {...R}>
        <boxGeometry args={[w + 0.02, 0.03, d + 0.01]} />
      </mesh>
      <RoundedBox args={[0.46, 0.12, 0.34]} radius={0.05} smoothness={3} position={[0, 0.92, 0.03]} material={m.ceramic} {...R} />
      <mesh position={[0, 1.02, -d / 2 + 0.06]} material={m.metal}>
        <cylinderGeometry args={[0.012, 0.012, 0.2, 10]} />
      </mesh>
    </group>
  );
}

function Mirror({ w, h, m }) {
  return (
    <group>
      {/* backlit: a soft glow around the mirror's edge */}
      <mesh position={[0, h / 2, 0.004]} material={m.cove}>
        <boxGeometry args={[w + 0.06, h + 0.06, 0.004]} />
      </mesh>
      <mesh position={[0, h / 2, 0.01]} material={m.frame}>
        <boxGeometry args={[w + 0.03, h + 0.03, 0.02]} />
      </mesh>
      <mesh position={[0, h / 2, 0.021]} material={m.mirror}>
        <boxGeometry args={[w, h, 0.002]} />
      </mesh>
    </group>
  );
}

function Shower({ w, d, m }) {
  return (
    <group>
      <mesh position={[0, 0.025, 0]} material={m.ceramic} receiveShadow>
        <boxGeometry args={[w, 0.05, d]} />
      </mesh>
      <mesh position={[0, 1.0, d / 2]} material={m.showerGlass}>
        <boxGeometry args={[w, 1.95, 0.01]} />
      </mesh>
      <mesh position={[0, 1.98, d / 2]} material={m.metal}>
        <boxGeometry args={[w, 0.02, 0.02]} />
      </mesh>
      <mesh position={[0, 2.05, -d / 2 + 0.25]} material={m.metal}>
        <cylinderGeometry args={[0.11, 0.11, 0.015, 24]} />
      </mesh>
      {/* towel rail beside the shower, with a folded towel */}
      <group position={[w / 2 + 0.06, 1.2, d / 2 + 0.25]} rotation-y={Math.PI / 2}>
        <mesh material={m.metal} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.01, 0.01, 0.6, 10]} />
        </mesh>
        <RoundedBox args={[0.5, 0.42, 0.035]} radius={0.015} smoothness={2} position={[0, -0.2, 0.01]} material={m.bedding} {...R} />
      </group>
    </group>
  );
}

function Washer({ w, d, h, m }) {
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.02} smoothness={2} position={[0, h / 2, 0]} material={m.ceramic} {...R} />
      <mesh position={[0, h * 0.48, d / 2 + 0.005]} rotation-x={Math.PI / 2} material={m.frame}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 32]} />
      </mesh>
    </group>
  );
}

function Shelves({ w, d, h, m }) {
  return (
    <group>
      {[0, 0.45, 0.9, 1.35, h - 0.02].map((y) => (
        <mesh key={y} position={[0, y + 0.01, 0]} material={m.wood} {...R}>
          <boxGeometry args={[w, 0.025, d]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (w / 2 - 0.01), h / 2, 0]} material={m.wood} {...R}>
          <boxGeometry args={[0.025, h, d]} />
        </mesh>
      ))}
    </group>
  );
}

const PLANTS = { 1: 'plant1', 2: 'plant2', 4: 'plant4' };

export const FurnitureItem = memo(function FurnitureItem({ item, m }) {
  const { kind, x, y, z, rot, w, d, h } = item;
  let body = null;
  switch (kind) {
    case 'sofa':
      body = <Sofa w={w} d={d} m={m} />;
      break;
    case 'bed':
      body = <Bed w={w} d={d} m={m} />;
      break;
    case 'wardrobe':
      body = <Wardrobe w={w} d={d} h={h} m={m} />;
      break;
    case 'counter':
      body = <Counter w={w} d={d} m={m} sink={item.sink} hob={item.hob} />;
      break;
    case 'upper':
      body = <Upper w={w} d={d} h={h} m={m} />;
      break;
    case 'fridge':
      body = <Fridge w={w} d={d} h={h} m={m} />;
      break;
    case 'diningTable':
      body = (
        <>
          <DiningTable w={w} d={d} h={h} m={m} />
          <group position={[0, h, 0]}>
            <Model url={MODELS.vase} w={0.2} d={0.2} h={0.32} />
          </group>
        </>
      );
      break;
    case 'diningChair':
      body = <DiningChair w={w} d={d} m={m} />;
      break;
    case 'tvUnit':
      body = <TvUnit w={w} d={d} h={h} m={m} />;
      break;
    case 'tv':
      body = <Tv w={w} h={h} m={m} />;
      break;
    case 'rug':
      body = <Rug w={w} d={d} m={m} />;
      break;
    case 'nightstand':
      body = <Nightstand w={w} d={d} h={h} m={m} photo={item.id.charCodeAt(item.id.length - 1) % 2 === 0} />;
      break;
    case 'floorLamp':
      body = <FloorLamp m={m} />;
      break;
    case 'lamp':
      body = <Lamp m={m} />;
      break;
    case 'wc':
      body = <Wc m={m} />;
      break;
    case 'vanity':
      body = <Vanity w={w} d={d} m={m} />;
      break;
    case 'mirror':
      body = <Mirror w={w} h={h} m={m} />;
      break;
    case 'shower':
      body = <Shower w={w} d={d} m={m} />;
      break;
    case 'washer':
      body = <Washer w={w} d={d} h={h} m={m} />;
      break;
    case 'shelves':
      body = <Shelves w={w} d={d} h={h} m={m} />;
      break;
    case 'armchair':
      body = <Model url={MODELS.armchair} w={w} d={d} h={h} />;
      break;
    case 'lounge':
      body = <Model url={MODELS.lounge} w={w} d={d} h={h * 1.05} />;
      break;
    case 'coffeeTable':
      // Luxe Marble: a low stone-and-walnut table; the other styles keep the round one
      body =
        m.styleId === 'luxe' ? (
          <Model url={MODELS.coffeeTableStone} w={Math.max(w, 1.15)} d={d * 0.6} h={h * 0.9} fit="footprint" />
        ) : (
          <Model url={MODELS.coffeeTable} w={w} d={d} h={h} fit="footprint" />
        );
      break;
    case 'sideTable':
      body = <Model url={MODELS.sideTable} w={w} d={d} h={h} fit="footprint" />;
      break;
    case 'plant':
      body = <Model url={MODELS[PLANTS[item.variant] || 'plant2']} w={w} d={d} h={h} />;
      break;
    case 'pendant':
      body = <Model url={MODELS.pendant} w={w} d={d} h={0.75} anchor="ceiling" />;
      break;
    case 'balconySet':
      body = <Model url={MODELS.balconySet} w={w} d={d} h={h} fit="footprint" />;
      break;
    case 'art':
      body = <Model url={MODELS.art} w={w} d={d} h={h} />;
      break;
    default:
      return null;
  }
  return (
    <group position={[x, y, z]} rotation-y={rot}>
      {body}
    </group>
  );
});
