import { useRef } from "react";
import * as THREE from "three";

type Props = {
  geometry: THREE.BufferGeometry;
  color?: THREE.ColorRepresentation;
  pointSize?: number;
  pointsRef?: React.RefObject<THREE.Points>;
};

export function ModelPointsLoader({
  geometry,
  color,
  pointSize = 0.01,
  pointsRef,
}: Props) {
  const internalRef = useRef<THREE.Points>(null!);
  const actualRef = pointsRef ?? internalRef;

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
