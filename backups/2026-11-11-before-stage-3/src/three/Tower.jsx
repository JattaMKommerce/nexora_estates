import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import gsap from 'gsap';
import { FLOOR_H, SELECT_RISE, SLAB_T, buildCrownGeometries, buildFloorGeometries, disposeGeometries, levelBaseY } from './towerGeometry.js';
import { invalidateShadows } from './shadows.js';
import { levelName, plural } from '../lib/format.js';
import { FloorPlan3D } from './FloorPlan3D.jsx';

const noRaycast = () => null;
const MOVE = { duration: 1.15, ease: 'power3.inOut' };

/** How each floor should look and where it should sit for the current selection. */
function layoutFor(index, selected, dims) {
  if (selected === null || selected === undefined) return { mode: 'normal', offset: 0, delay: 0 };
  if (index === selected) return { mode: 'selected', offset: SELECT_RISE, delay: 0.05 };
  if (index > selected) {
    return { mode: 'ghost', offset: dims.lift + SELECT_RISE, delay: Math.min(0.35, (index - selected) * 0.018) };
  }
  return { mode: 'normal', offset: 0, delay: 0 };
}

function tagText(level, source) {
  if (source === 'prototype' || !level.counts) return 'Prototype · illustrative layout';
  const c = level.counts;
  if (c.total === 0) return 'No residences listed';
  return `${c.available} of ${plural(c.total, 'residence')} available`;
}

export function Tower({
  tower,
  dims,
  mats,
  source,
  selectedIndex,
  hoveredIndex,
  onHover,
  onSelect,
  reducedMotion,
  plan,
  unitProps
}) {
  const floorGeoms = useMemo(() => buildFloorGeometries(dims), [dims]);
  const crownGeoms = useMemo(() => buildCrownGeometries(dims), [dims]);
  useEffect(() => () => disposeGeometries(floorGeoms), [floorGeoms]);
  useEffect(() => () => disposeGeometries(crownGeoms), [crownGeoms]);

  const sel = selectedIndex ?? null;
  return (
    <group>
      {tower.levels.map((level, i) => {
        const layout = layoutFor(i, sel, dims);
        return (
          <FloorLevel
            key={level.number}
            index={i}
            level={level}
            dims={dims}
            geoms={floorGeoms}
            mats={mats}
            mode={layout.mode}
            offset={layout.offset}
            delay={layout.delay}
            hovered={i === hoveredIndex}
            tag={i === hoveredIndex ? tagText(level, source) : null}
            onHover={onHover}
            onSelect={onSelect}
            reducedMotion={reducedMotion}
            plan={i === sel ? plan : null}
            unitProps={i === sel ? unitProps : null}
          />
        );
      })}
      <Crown
        dims={dims}
        geoms={crownGeoms}
        mats={mats}
        lifted={sel !== null}
        delay={sel !== null ? Math.min(0.4, (tower.levels.length - sel) * 0.018) : 0}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

const FloorLevel = memo(function FloorLevel({
  index,
  level,
  dims,
  geoms,
  mats,
  mode,
  offset,
  delay,
  hovered,
  tag,
  onHover,
  onSelect,
  reducedMotion,
  plan,
  unitProps
}) {
  const group = useRef();
  const baseY = levelBaseY(dims, index);
  const variant = index % 2;
  const glass = mats.glass[(index * 5 + 3) % mats.glass.length];

  useLayoutEffect(() => {
    if (group.current) group.current.position.y = baseY;
    invalidateShadows();
  }, [baseY]);

  useEffect(() => {
    const g = group.current;
    if (!g) return undefined;
    invalidateShadows();
    const tween = gsap.to(g.position, {
      y: baseY + offset,
      duration: reducedMotion ? 0 : MOVE.duration,
      ease: MOVE.ease,
      delay: reducedMotion ? 0 : delay,
      overwrite: true,
      onUpdate: invalidateShadows,
      onComplete: invalidateShadows
    });
    return () => tween.kill();
  }, [baseY, offset, delay, reducedMotion, mode]);

  const handlers = useMemo(
    () => ({
      onPointerOver: (e) => {
        e.stopPropagation();
        onHover(index, true);
      },
      onPointerOut: () => onHover(index, false),
      onClick: (e) => {
        e.stopPropagation();
        if (e.delta > 6) return; // a drag to orbit, not a click
        onSelect(index);
      }
    }),
    [index, onHover, onSelect]
  );

  const pickable = mode === 'normal';
  return (
    <group ref={group}>
      <mesh geometry={geoms.hit} visible={false} raycast={pickable ? undefined : noRaycast} {...(pickable ? handlers : {})} />
      {mode === 'ghost' ? (
        <>
          <mesh geometry={geoms.ghostBox} material={mats.ghost} raycast={noRaycast} renderOrder={2} />
          <lineSegments geometry={geoms.outline} material={mats.ghostLine} raycast={noRaycast} renderOrder={2} />
        </>
      ) : mode === 'selected' ? (
        <>
          <mesh geometry={geoms.slab} material={mats.concrete} castShadow receiveShadow raycast={noRaycast} />
          {plan && unitProps && (
            <group position={[0, SLAB_T, 0]}>
              <FloorPlan3D plan={plan} mats={mats} reducedMotion={reducedMotion} {...unitProps} />
            </group>
          )}
        </>
      ) : (
        <>
          <mesh geometry={geoms.concrete[variant]} material={mats.concrete} castShadow receiveShadow raycast={noRaycast} />
          <mesh geometry={geoms.glass} material={glass} castShadow receiveShadow raycast={noRaycast} />
          <mesh geometry={geoms.metal[variant]} material={mats.metal} castShadow receiveShadow raycast={noRaycast} />
          <mesh geometry={geoms.rail[variant]} material={mats.rail} raycast={noRaycast} renderOrder={1} />
        </>
      )}
      {hovered && mode !== 'selected' && <HoverMarker geoms={geoms} mats={mats} dims={dims} level={level} tag={tag} />}
    </group>
  );
});

function HoverMarker({ geoms, mats, dims, level, tag }) {
  useFrame(({ clock }) => {
    mats.hoverFill.opacity = 0.11 + Math.sin(clock.elapsedTime * 3.2) * 0.04;
  });
  return (
    <>
      <mesh geometry={geoms.hoverBox} material={mats.hoverFill} raycast={noRaycast} renderOrder={4} />
      <lineSegments geometry={geoms.outline} material={mats.hoverLine} raycast={noRaycast} renderOrder={5} />
      <Html position={[dims.width / 2 + 0.5, FLOOR_H / 2, dims.depth / 2 + 0.5]} pointerEvents="none" zIndexRange={[30, 0]}>
        <div className="floor-tag">
          <span className="floor-tag__line" aria-hidden="true" />
          <span className="floor-tag__body">
            <strong>{levelName(level.number)}</strong>
            <span>{tag}</span>
          </span>
        </div>
      </Html>
    </>
  );
}

function Crown({ dims, geoms, mats, lifted, delay, reducedMotion }) {
  const group = useRef();
  useLayoutEffect(() => {
    if (group.current) group.current.position.y = dims.top;
    invalidateShadows();
  }, [dims.top]);

  useEffect(() => {
    const g = group.current;
    if (!g) return undefined;
    invalidateShadows();
    const tween = gsap.to(g.position, {
      y: dims.top + (lifted ? dims.lift + SELECT_RISE : 0),
      duration: reducedMotion ? 0 : MOVE.duration,
      delay: reducedMotion ? 0 : delay,
      ease: MOVE.ease,
      overwrite: true,
      onUpdate: invalidateShadows,
      onComplete: invalidateShadows
    });
    return () => tween.kill();
  }, [dims.top, dims.lift, lifted, delay, reducedMotion]);

  return (
    <group ref={group}>
      {lifted ? (
        <>
          <mesh geometry={geoms.ghost} material={mats.ghost} raycast={noRaycast} renderOrder={2} />
          <lineSegments geometry={geoms.outline} material={mats.ghostLine} raycast={noRaycast} renderOrder={2} />
        </>
      ) : (
        <>
          <mesh geometry={geoms.concrete} material={mats.concrete} castShadow receiveShadow raycast={noRaycast} />
          <mesh geometry={geoms.metal} material={mats.metal} castShadow receiveShadow raycast={noRaycast} />
          <mesh geometry={geoms.band} material={mats.warmLight} raycast={noRaycast} />
        </>
      )}
    </group>
  );
}
