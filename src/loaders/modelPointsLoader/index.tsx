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
  return (
    <points ref={pointsRef} geometry={geometry}>
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
