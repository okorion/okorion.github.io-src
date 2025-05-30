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
  pointCount,
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
  pointCount: number;
  vertexColors: boolean;
  color?: THREE.ColorRepresentation;
  animationDuration: number;
}) {
  const animationProgress = useRef(0);

  useFrame(({ clock }, delta) => {
    if (
      !pointsRef.current ||
      !originalPositions.current ||
      !startPositions.current ||
      !movementDirections.current ||
      !boundingBoxRef.current
    )
      return;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const boundingBox = boundingBoxRef.current;
    const size = boundingBox.getSize(new THREE.Vector3());
    const min = boundingBox.min;
    const time = clock.getElapsedTime();

    animationProgress.current = Math.min(
      animationProgress.current + delta / animationDuration,
      1,
    );
    const easeOut = 1 - Math.pow(1 - animationProgress.current, 3);
    const colors = color ? null : new Float32Array(pointCount * 3);

    for (let i = 0; i < positions.length; i += 3) {
      const idx = i / 3;

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

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;

      if (!color && vertexColors && colors) {
        const nx = (x - min.x) / size.x;
        const ny = (y - min.y) / size.y;
        const nz = (z - min.z) / size.z;
        const hue = (nx + ny + nz) / 3;
        const col = new THREE.Color().setHSL((hue * 4) % 1, 0.8, 0.5);
        colors.set([col.r, col.g, col.b], i);
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (!color && vertexColors && colors) {
      pointsRef.current.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3),
      );
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });
}
