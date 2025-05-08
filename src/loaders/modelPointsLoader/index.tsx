import { useRef } from "react";
import * as THREE from "three";
import { useGLTFPoints } from "./useGLTFPoints";
import { usePointsAnimation } from "./usePointsAnimation";

type Props = {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  opacity?: number;
  pointCount?: number;
  isAnimating?: boolean;
  vertexColors?: boolean;
  pointSize?: number;
  color?: THREE.ColorRepresentation;
};

export function ModelPointsLoader({
  path,
  position,
  rotation,
  scale = 1,
  opacity = 1,
  pointCount = 100000,
  isAnimating = false,
  vertexColors = false,
  pointSize = 0.02,
  color,
}: Props) {
  const pointsRef = useRef<THREE.Points>(null!);

  const {
    geometry,
    originalPositions,
    startPositions,
    movementDirections,
    boundingBoxRef,
  } = useGLTFPoints(path, pointCount, color);

  usePointsAnimation({
    pointsRef,
    originalPositions,
    startPositions,
    movementDirections,
    boundingBoxRef,
    isAnimating,
    pointCount,
    vertexColors,
    color,
  });

  if (!geometry) return null;

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    >
      <pointsMaterial
        attach="material"
        size={pointSize}
        sizeAttenuation
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={vertexColors && !color}
        color={color}
      />
    </points>
  );
}
