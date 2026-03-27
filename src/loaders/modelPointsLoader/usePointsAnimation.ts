import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

export function usePointsAnimation({
  pointsRef,
  originalPositions,
  startPositions,
  movementDirections,
  boundingBoxRef,
  isAnimating,
  vertexColors,
  color,
  animationDuration = 0.5,
}: {
  pointsRef: React.RefObject<THREE.Points>;
  originalPositions: React.RefObject<Float32Array | null>;
  startPositions: React.RefObject<Float32Array | null>;
  movementDirections: React.RefObject<THREE.Vector3[] | null>;
  boundingBoxRef: React.RefObject<THREE.Box3 | null>;
  isAnimating: boolean;
  vertexColors: boolean;
  color?: THREE.ColorRepresentation;
  animationDuration: number;
}) {
  const animationProgress = useRef(0);
  const boundingBoxSize = useRef(new THREE.Vector3());
  const tempColor = useRef(new THREE.Color());

  useFrame(({ clock }, delta) => {
    if (
      !pointsRef.current ||
      !originalPositions.current ||
      !startPositions.current ||
      !movementDirections.current ||
      !boundingBoxRef.current
    ) {
      return;
    }

    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.getAttribute("position");
    if (!(positionAttribute instanceof THREE.BufferAttribute)) {
      return;
    }

    const boundingBox = boundingBoxRef.current;
    const size = boundingBox.getSize(boundingBoxSize.current);
    const min = boundingBox.min;
    const time = clock.getElapsedTime();
    const safeSizeX = Math.max(size.x, Number.EPSILON);
    const safeSizeY = Math.max(size.y, Number.EPSILON);
    const safeSizeZ = Math.max(size.z, Number.EPSILON);
    const colorAttribute =
      !color && vertexColors ? geometry.getAttribute("color") : undefined;
    const resolvedColorAttribute =
      colorAttribute instanceof THREE.BufferAttribute
        ? colorAttribute
        : undefined;

    animationProgress.current = Math.min(
      animationProgress.current + delta / animationDuration,
      1,
    );
    const easeOut = 1 - Math.pow(1 - animationProgress.current, 3);

    for (let idx = 0; idx < positionAttribute.count; idx++) {
      const i = idx * 3;
      const sx = startPositions.current[i];
      const sy = startPositions.current[i + 1];
      const sz = startPositions.current[i + 2];

      const tx = originalPositions.current[i];
      const ty = originalPositions.current[i + 1];
      const tz = originalPositions.current[i + 2];

      let x = sx + (tx - sx) * easeOut;
      let y = sy + (ty - sy) * easeOut;
      let z = sz + (tz - sz) * easeOut;

      if (isAnimating || animationProgress.current >= 0.95) {
        const dir = movementDirections.current[idx];
        const frequency = 2.0;
        const amplitude = 0.05;
        const offset = Math.sin(time * frequency + idx) * amplitude;
        x += dir.x * 0.01 * offset;
        y += dir.y * 0.01 * offset;
        z += dir.z * 0.01 * offset;
      }

      positionAttribute.setXYZ(idx, x, y, z);

      if (resolvedColorAttribute) {
        const nx = (x - min.x) / safeSizeX;
        const ny = (y - min.y) / safeSizeY;
        const nz = (z - min.z) / safeSizeZ;
        const hue = (nx + ny + nz) / 3;
        tempColor.current.setHSL((hue * 4) % 1, 0.8, 0.5);
        resolvedColorAttribute.setXYZ(
          idx,
          tempColor.current.r,
          tempColor.current.g,
          tempColor.current.b,
        );
      }
    }

    positionAttribute.needsUpdate = true;
    if (resolvedColorAttribute) {
      resolvedColorAttribute.needsUpdate = true;
    }
  });
}
