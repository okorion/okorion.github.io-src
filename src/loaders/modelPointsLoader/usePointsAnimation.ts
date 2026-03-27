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
  const sizeRef = useRef(new THREE.Vector3());
  const colorRef = useRef(new THREE.Color());
  const colorTupleRef = useRef(new Float32Array(3));

  useFrame(({ clock }, delta) => {
    if (
      !pointsRef.current ||
      !originalPositions.current ||
      !startPositions.current ||
      !movementDirections.current ||
      !boundingBoxRef.current
    )
      return;

    const geometry = pointsRef.current.geometry;
    const positionAttribute = geometry.getAttribute("position");
    if (
      !(positionAttribute instanceof THREE.BufferAttribute) ||
      !(positionAttribute.array instanceof Float32Array)
    ) {
      return;
    }

    const positions = positionAttribute.array;
    const boundingBox = boundingBoxRef.current;
    const size = boundingBox.getSize(sizeRef.current);
    const min = boundingBox.min;
    const time = clock.getElapsedTime();
    const safeSizeX = Math.max(size.x, Number.EPSILON);
    const safeSizeY = Math.max(size.y, Number.EPSILON);
    const safeSizeZ = Math.max(size.z, Number.EPSILON);
    const rawColorAttribute =
      !color && vertexColors ? geometry.getAttribute("color") : null;
    const colorAttribute =
      rawColorAttribute instanceof THREE.BufferAttribute &&
      rawColorAttribute.array instanceof Float32Array
        ? rawColorAttribute
        : null;
    const colors = colorAttribute?.array;

    animationProgress.current = Math.min(
      animationProgress.current + delta / animationDuration,
      1,
    );
    const easeOut = 1 - Math.pow(1 - animationProgress.current, 3);

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
        const nx = (x - min.x) / safeSizeX;
        const ny = (y - min.y) / safeSizeY;
        const nz = (z - min.z) / safeSizeZ;
        const hue = (nx + ny + nz) / 3;
        colorRef.current.setHSL((hue * 4) % 1, 0.8, 0.5);
        colorTupleRef.current[0] = colorRef.current.r;
        colorTupleRef.current[1] = colorRef.current.g;
        colorTupleRef.current[2] = colorRef.current.b;
        colors.set(colorTupleRef.current, i);
      }
    }

    positionAttribute.needsUpdate = true;
    if (!color && vertexColors && colorAttribute) {
      colorAttribute.needsUpdate = true;
    }
  });
}
