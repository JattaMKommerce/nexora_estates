import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SIZE, WATER_Y, terrainHeight } from './geo.js';
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
    for (let i = 0; i < pos.count; i++) pos.setY(i, terrainHeight(pos.getX(i), pos.getZ(i)));
    g.computeVertexNormals();
    return g;
  }, []);
  const material = useMemo(() => {
    const m = makeTerrainMaterial();
    m.userData.uniforms.uPitRect.value.set(PIT.x0 + 0.3, PIT.x1 - 0.3, PIT.z0 + 0.3, PIT.z1 - 0.3);
    return m;
  }, []);
  const water = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.water, roughness: 0.12, metalness: 0.05, envMapIntensity: 1.1 }),
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
