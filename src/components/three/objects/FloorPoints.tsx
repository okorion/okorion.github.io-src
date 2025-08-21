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
  const frameCount = useRef(0);
  const rotationSpeed = useRef(0.0005);
  
  // Pre-compute random offsets for better performance
  const randomOffsets = useMemo(() => {
    const offsets = new Float32Array(pointCount);
    for (let i = 0; i < pointCount; i++) {
      offsets[i] = (Math.random() - 0.5) * 0.0002;
    }
    return offsets;
  }, [pointCount]);

  const geometry = useMemo(() => {
    const positions = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      // 폴라 좌표로 입자 위치 생성 (중심에 밀집)
      const angle = Math.random() * 2 * Math.PI;
      const r = radius * Math.random(); // sqrt를 사용하면 중심 밀도 증가

      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);

      positions.set([x, 0, z], i * 3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [radius, pointCount]);

  useFrame(() => {
    if (!pointsRef.current) return;
    
    frameCount.current++;
    
    // Optimize rotation - only update every frame
    pointsRef.current.rotation.y += rotationSpeed.current;

    // Optimize: Reduce frequency of position updates for better performance
    if (frameCount.current % 3 === 0) {
      const positions = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      
      // Use pre-computed offsets in a cycling pattern for better performance
      const offsetCycle = frameCount.current / 3;
      for (let i = 1; i < positions.length; i += 3) {
        const offsetIndex = ((i / 3) + offsetCycle) % pointCount;
        positions[i] = randomOffsets[offsetIndex];
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
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