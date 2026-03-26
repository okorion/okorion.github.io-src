import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  radius?: number;
  pointCount?: number;
  pointSize?: number;
  color?: THREE.ColorRepresentation;
  opacity?: number;
};

interface JitterSample {
  amplitude: number;
  phase: number;
}

const setPositionYWithinBounds = (
  attribute: THREE.BufferAttribute,
  vertexIndex: number,
  value: number,
) => {
  if (vertexIndex < 0 || vertexIndex >= attribute.count) {
    return;
  }

  attribute.setY(vertexIndex, value);
};

export const FloorPoints = ({
  radius = 15,
  pointCount = 30000,
  pointSize = 0.02,
  color = "#bbbbbb",
  opacity = 0.7,
}: Props) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const jitterStateRef = useRef<JitterSample[] | null>(null);
  const frameSkipRef = useRef(0);

  const geometry = useMemo(() => {
    const positionAttr = new THREE.BufferAttribute(
      new Float32Array(pointCount * 3),
      3,
    );
    const jitterSamples: JitterSample[] = [];

    for (let i = 0; i < pointCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = radius * Math.random();
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);

      positionAttr.setXYZ(i, x, 0, z);
      jitterSamples.push({
        amplitude: 0.00005 + Math.random() * 0.00015,
        phase: Math.random() * Math.PI * 2,
      });
    }

    jitterStateRef.current = jitterSamples;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", positionAttr);
    return geo;
  }, [radius, pointCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += 0.0005;
    frameSkipRef.current = (frameSkipRef.current + 1) % 3;
    if (frameSkipRef.current !== 0 || !jitterStateRef.current) {
      return;
    }

    const positionAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const time = clock.getElapsedTime() * 0.9;

    jitterStateRef.current.forEach((sample, index) => {
      setPositionYWithinBounds(
        positionAttr,
        index,
        Math.sin(time + sample.phase) * sample.amplitude,
      );
    });

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, -0.02, 0]} rotation={[0, 0, 0]}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial
        attach="material"
        size={pointSize}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={color}
      />
    </points>
  );
};
