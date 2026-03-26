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
    amplitudes: number[];
    phases: number[];
  } | null>(null);
  const frameSkipRef = useRef(0);

  const geometry = useMemo(() => {
    const positionAttr = new THREE.BufferAttribute(
      new Float32Array(pointCount * 3),
      3,
    );
    const amplitudes: number[] = [];
    const phases: number[] = [];

    for (let i = 0; i < pointCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = radius * Math.random();
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);

      positionAttr.setXYZ(i, x, 0, z);
      amplitudes.push(0.00005 + Math.random() * 0.00015);
      phases.push(Math.random() * Math.PI * 2);
    }

    jitterStateRef.current = { amplitudes, phases };

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
    const { amplitudes, phases } = jitterStateRef.current;
    const time = clock.getElapsedTime() * 0.9;
    const pointTotal = amplitudes.length;

    for (let i = 0; i < pointTotal; i++) {
      positionAttr.setY(i, Math.sin(time + phases[i]) * amplitudes[i]);
    }

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
