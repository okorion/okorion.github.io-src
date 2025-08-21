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
  const frameCount = useRef(0);
  const cachedBoundingData = useRef<{
    size: THREE.Vector3;
    min: THREE.Vector3;
    invSize: THREE.Vector3;
    lastUpdate: number;
  } | null>(null);

  useFrame(({ clock }, delta) => {
    if (
      !pointsRef.current ||
      !originalPositions.current ||
      !startPositions.current ||
      !movementDirections.current ||
      !boundingBoxRef.current
    )
      return;

    frameCount.current++;
    
    // Optimize: Skip some frames for less critical updates
    if (!isAnimating && frameCount.current % 2 !== 0) return;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const boundingBox = boundingBoxRef.current;
    const time = clock.getElapsedTime();

    // Cache bounding box calculations
    if (!cachedBoundingData.current || time - cachedBoundingData.current.lastUpdate > 1.0) {
      const size = boundingBox.getSize(new THREE.Vector3());
      const min = boundingBox.min.clone();
      cachedBoundingData.current = {
        size,
        min,
        invSize: new THREE.Vector3(1 / size.x, 1 / size.y, 1 / size.z),
        lastUpdate: time
      };
    }

    const { min, invSize } = cachedBoundingData.current;

    animationProgress.current = Math.min(
      animationProgress.current + delta / animationDuration,
      1,
    );
    const easeOut = 1 - Math.pow(1 - animationProgress.current, 3);
    const colors = color ? null : new Float32Array(pointCount * 3);

    // Pre-calculate common values
    const frequency = 2.0;
    const amplitude = 0.05;
    const timeFreq = time * frequency;
    const useAnimation = isAnimating || animationProgress.current >= 0.95;

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

      if (useAnimation) {
        const dir = movementDirections.current[idx];
        const offset = Math.sin(timeFreq + idx) * amplitude * 0.01;
        x += dir.x * offset;
        y += dir.y * offset;
        z += dir.z * offset;
      }

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;

      if (!color && vertexColors && colors) {
        // Optimized color calculation using cached inverse size
        const nx = (x - min.x) * invSize.x;
        const ny = (y - min.y) * invSize.y;
        const nz = (z - min.z) * invSize.z;
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
