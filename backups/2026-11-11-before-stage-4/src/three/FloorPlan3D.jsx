import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { furnishUnit } from '../plan/furnish.js';
import { box, buildBalconies, buildFloors, buildFurnitureLow, buildStair, buildWalls, disposeAll, rectFloor } from '../plan/geometry.js';
import { invalidateShadows } from './shadows.js';
import { cls } from '../lib/format.js';

export const CUT_H = 2.2;
const noRaycast = () => null;

/**
 * The selected floor as a cut-away architectural model: finishes, walls cut at 2.2 m with dark
 * section caps, doors, glazing, core, balconies and suggested furniture. Every apartment is a
 * hover / click target tinted by availability.
 */
export const FloorPlan3D = memo(function FloorPlan3D({
  plan,
  mats,
  hasInventory,
  hoveredKey,
  selectedKey,
  onUnitHover,
  onUnitSelect,
  matches,
  showPins,
  reducedMotion
}) {
  const geo = useMemo(() => {
    const extra = [
      { rect: plan.corridor, mat: 'stone' },
      { rect: plan.core.lobby, mat: 'stone' },
      ...plan.core.lifts.map((r) => ({ rect: r, mat: 'concrete' })),
      { rect: plan.core.shaft, mat: 'concrete' },
      { rect: plan.core.stair, mat: 'concrete' },
      ...plan.services.map((r) => ({ rect: r, mat: 'concrete' }))
    ];
    const items = plan.units.flatMap((u) => furnishUnit(u));
    return {
      floors: buildFloors(plan.rooms, { y: 0.012, extra }),
      walls: buildWalls(plan.walls, { height: CUT_H, cut: true }),
      balconies: buildBalconies(plan.rooms, { y: 0.012 }),
      stair: buildStair(plan.core.stair, { height: CUT_H }),
      furniture: buildFurnitureLow(items, { maxH: CUT_H - 0.05 }),
      units: plan.units.map((u) => {
        const r = u.rect;
        const w = r.x1 - r.x0;
        const d = r.z1 - r.z0;
        const y = CUT_H + 0.03;
        const pts = [
          [r.x0, y, r.z0], [r.x1, y, r.z0], [r.x1, y, r.z1], [r.x0, y, r.z1], [r.x0, y, r.z0]
        ].map((p) => new THREE.Vector3(...p));
        return {
          key: u.key,
          fill: rectFloor({ x0: r.x0 + 0.1, z0: r.z0 + 0.1, x1: r.x1 - 0.1, z1: r.z1 - 0.1 }, 0.035, 1),
          outline: new THREE.BufferGeometry().setFromPoints(pts),
          hit: box(w, CUT_H, d, (r.x0 + r.x1) / 2, CUT_H / 2, (r.z0 + r.z1) / 2),
          pin: [(r.x0 + r.x1) / 2, CUT_H + 0.9, (r.z0 + r.z1) / 2]
        };
      })
    };
  }, [plan]);
  useEffect(() => () => disposeAll(geo), [geo]);

  const grow = useRef();
  useEffect(() => {
    const g = grow.current;
    if (!g) return undefined;
    if (reducedMotion) {
      g.scale.y = 1;
      invalidateShadows();
      return undefined;
    }
    const tween = gsap.fromTo(
      g.scale,
      { y: 0.001 },
      { y: 1, duration: 0.9, delay: 0.5, ease: 'power3.out', onUpdate: invalidateShadows, onComplete: invalidateShadows }
    );
    return () => tween.kill();
  }, [geo, reducedMotion]);

  const f = mats.furniture;
  return (
    <group>
      {geo.floors.wood && <mesh geometry={geo.floors.wood} material={mats.oak} receiveShadow raycast={noRaycast} />}
      {geo.floors.tile && <mesh geometry={geo.floors.tile} material={mats.tile} receiveShadow raycast={noRaycast} />}
      {geo.floors.stone && <mesh geometry={geo.floors.stone} material={mats.stone} receiveShadow raycast={noRaycast} />}
      {geo.floors.concrete && <mesh geometry={geo.floors.concrete} material={mats.core} receiveShadow raycast={noRaycast} />}
      {geo.floors.deck && <mesh geometry={geo.floors.deck} material={mats.deck} receiveShadow raycast={noRaycast} />}
      {geo.balconies.slab && <mesh geometry={geo.balconies.slab} material={mats.concrete} castShadow receiveShadow raycast={noRaycast} />}

      <group ref={grow}>
        {geo.walls.solid && <mesh geometry={geo.walls.solid} material={mats.wall} castShadow receiveShadow raycast={noRaycast} />}
        {geo.walls.core && <mesh geometry={geo.walls.core} material={mats.core} castShadow receiveShadow raycast={noRaycast} />}
        {geo.walls.cap && <mesh geometry={geo.walls.cap} material={mats.wallCap} raycast={noRaycast} />}
        {geo.walls.frame && <mesh geometry={geo.walls.frame} material={mats.frame} castShadow raycast={noRaycast} />}
        {geo.walls.doors && <mesh geometry={geo.walls.doors} material={mats.door} castShadow receiveShadow raycast={noRaycast} />}
        {geo.walls.doorFrame && <mesh geometry={geo.walls.doorFrame} material={mats.door} castShadow raycast={noRaycast} />}
        {geo.walls.liftDoors && <mesh geometry={geo.walls.liftDoors} material={mats.liftDoor} raycast={noRaycast} />}
        {geo.walls.glass && <mesh geometry={geo.walls.glass} material={mats.paneGlass} raycast={noRaycast} renderOrder={3} />}
        {geo.stair && <mesh geometry={geo.stair} material={mats.core} castShadow receiveShadow raycast={noRaycast} />}
        {geo.balconies.glass && <mesh geometry={geo.balconies.glass} material={mats.paneGlass} raycast={noRaycast} renderOrder={3} />}
        {geo.balconies.rail && <mesh geometry={geo.balconies.rail} material={mats.frame} raycast={noRaycast} />}
        {Object.entries(geo.furniture).map(([k, g]) =>
          g ? <mesh key={k} geometry={g} material={f[k]} castShadow receiveShadow raycast={noRaycast} /> : null
        )}
      </group>

      {geo.units.map((ug, i) => {
        const pu = plan.units[i];
        const unit = pu.unit;
        const key = ug.key;
        const hovered = hoveredKey === key;
        const selected = selectedKey === key;
        const status = hasInventory ? unit?.status || 'unknown' : 'none';
        const match = matches ? matches(unit) : true;
        return (
          <group key={key}>
            <mesh
              geometry={ug.hit}
              visible={false}
              onPointerOver={(e) => {
                e.stopPropagation();
                onUnitHover(key, true);
              }}
              onPointerOut={() => onUnitHover(key, false)}
              onClick={(e) => {
                e.stopPropagation();
                if (e.delta > 6) return;
                onUnitSelect(key);
              }}
            />
            {(match || selected) && (
              <mesh geometry={ug.fill} material={hovered || selected ? mats.unitHover : mats.status[status]} raycast={noRaycast} renderOrder={1} />
            )}
            {(hovered || selected) && <lineLoop geometry={ug.outline} material={selected ? mats.unitLineSel : mats.unitLine} raycast={noRaycast} />}
            {(showPins || hovered || selected) && (
              <Html position={ug.pin} center pointerEvents="none" zIndexRange={[20, 0]}>
                <div className={cls('unit-pin', `is-${status}`, selected && 'is-selected', hovered && 'is-hovered', !match && 'is-muted')}>
                  <i className="unit-pin__dot" aria-hidden="true" />
                  <strong>{unit ? unit.number || '—' : `Home ${i + 1}`}</strong>
                  {(unit?.typeLabel || !unit) && <span>{unit ? unit.typeLabel : `${pu.bedrooms === 0 ? 'Studio' : `${pu.bedrooms} BHK`}`}</span>}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
});
