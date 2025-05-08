import { useRef } from "react";
import * as THREE from "three";
import { useGLTFPoints } from "./useGLTFPoints";

type Props = {
  path: string;
  pointCount?: number;
  color?: THREE.ColorRepresentation;
  pointSize?: number;
  pointsRef?: React.RefObject<THREE.Points>;
};

export function ModelPointsLoader({
  path,
  pointCount = 100000,
  color,
  pointSize = 0.01,
  pointsRef,
}: Props) {
  const internalRef = useRef<THREE.Points>(null!);
  const actualRef = pointsRef ?? internalRef;

  const { geometry } = useGLTFPoints(path, pointCount, color);

  if (!geometry) return null;

  return (
    <points ref={actualRef} geometry={geometry}>
      <pointsMaterial
        attach="material"
        size={pointSize}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={!color}
        color={color}
      />
    </points>
  );
}
