import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LightControllerProps {
  isHovered: boolean;
}

export const LightController = ({ isHovered }: LightControllerProps) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (!lightRef.current) return;
    const target = isHovered ? 3 : 1;
    lightRef.current.intensity += (target - lightRef.current.intensity) * 0.07;
  });

  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight ref={lightRef} position={[5, 5, 5]} castShadow />
    </>
  );
};
