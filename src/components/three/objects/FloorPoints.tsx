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

export const FloorPoints = ({
  radius = 15,
  pointCount = 30000,
  pointSize = 0.02,
  color = "#bbbbbb",
  opacity = 0.7,
}: Props) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const jitterStateRef = useRef<{
    amplitudes: Float32Array;
    phases: Float32Array;
  } | null>(null);
  const frameSkipRef = useRef(0);

  const geometry = useMemo(() => {
    const positions = new Float32Array(pointCount * 3);
    const amplitudes = new Float32Array(pointCount);
    const phases = new Float32Array(pointCount);

    for (let i = 0; i < pointCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = radius * Math.random();
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);
      const i3 = i * 3;

      positions[i3] = x;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = z;
      amplitudes[i] = 0.00005 + Math.random() * 0.00015;
      phases[i] = Math.random() * Math.PI * 2;
    }

    jitterStateRef.current = { amplitudes, phases };

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [radius, pointCount]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y += 0.0005;
    frameSkipRef.current = (frameSkipRef.current + 1) % 3;
    if (frameSkipRef.current !== 0 || !jitterStateRef.current) {
      return;
    }

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const { amplitudes, phases } = jitterStateRef.current;
    const time = clock.getElapsedTime() * 0.9;

    for (let i = 0; i < pointCount; i++) {
      positions[i * 3 + 1] = Math.sin(time + phases[i]) * amplitudes[i];
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
