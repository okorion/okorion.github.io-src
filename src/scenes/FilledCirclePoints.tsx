import { PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

interface Props {
  radius?: number;
  rings?: number;
  segmentsPerRing?: number;
}

export function FilledCirclePoints({
  radius = 10,
  rings = 100,
  segmentsPerRing = 100,
}: Props) {
  const geometry = useMemo(() => {
    const points: number[] = [];

    for (let r = 0; r <= 1; r += 1 / rings) {
      const currentRadius = r * radius;
      const segments = Math.floor(segmentsPerRing * r) + 10; // 중심은 적고, 바깥쪽은 많이

      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = currentRadius * Math.cos(theta);
        const y = currentRadius * Math.sin(theta);
        points.push(x, y, 0);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [radius, rings, segmentsPerRing]);

  return (
    <points
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      geometry={geometry}
    >
      <PointMaterial
        color="black"
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}
