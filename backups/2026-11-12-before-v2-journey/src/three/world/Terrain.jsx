import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SIZE, WATER_Y, terrainHeight, fbm } from './geo.js';
import { makeTerrainMaterial, COLORS } from '../materials.js';
import { W } from '../../core/world.js';
import { quality } from '../../core/quality.js';
import { PIT } from '../dev/layout.js';
import { SCHEDULE } from '../dev/schedule.js';

/** The sculpted landscape and the resin water that fills the river and lake. */
export default function Terrain() {
  const geometry = useMemo(() => {
    const seg = quality.terrainSeg;
    const g = new THREE.PlaneGeometry(SIZE, SIZE, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    // large-scale colour variation (0–1): broad tone, medium mottling, meadow patches, greening mask
    const tvar = new Float32Array(pos.count * 4);
    const n01 = (v) => Math.min(1, Math.max(0, 0.5 + v * 1.6));
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z));
      tvar[i * 4] = n01(fbm(x * 0.0045, z * 0.0045, 2, 31));
      tvar[i * 4 + 1] = n01(fbm(x * 0.017 + 3.1, z * 0.017, 2, 47));
      tvar[i * 4 + 2] = n01(fbm(x * 0.0032 + 11, z * 0.0032, 2, 59));
      tvar[i * 4 + 3] = n01(fbm(x * 0.004 + 7, z * 0.004, 2, 71));
    }
    g.setAttribute('tvar', new THREE.BufferAttribute(tvar, 4));
    g.computeVertexNormals();
    return g;
  }, []);
  const material = useMemo(() => {
    const m = makeTerrainMaterial();
    m.userData.uniforms.uPitRect.value.set(PIT.x0 + 0.3, PIT.x1 - 0.3, PIT.z0 + 0.3, PIT.z1 - 0.3);
    return m;
  }, []);
  const water = useMemo(
    // resin water: slightly see-through, so the shallows show the riverbed and the deep middle reads darker
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.water,
        roughness: 0.07,
        metalness: 0.05,
        envMapIntensity: 1.35,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
      }),
    []
  );

  useFrame(() => {
    const u = material.userData.uniforms;
    u.uGreen.value = W.green;
    u.uScanR.value = W.scan.r;
    u.uScanI.value = W.scan.i;
    u.uGrid.value = W.holo.grid;
    u.uPit.value = W.B > SCHEDULE.dig[0] ? 1 : 0; // the land opens where the excavation starts
  });

  return (
    <group>
      <mesh geometry={geometry} material={material} receiveShadow />
      <mesh rotation-x={-Math.PI / 2} position-y={WATER_Y} material={water} receiveShadow>
        <planeGeometry args={[SIZE, SIZE]} />
      </mesh>
    </group>
  );
}
