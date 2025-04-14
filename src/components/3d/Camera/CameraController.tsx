import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useScrollCameraControl } from "./useScrollCameraControl";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";

export const CameraController = () => {
  const controlsRef = useRef<ThreeOrbitControls | null>(null);
  const fixedPolarAngle = Math.PI / 2;
  const epsilon = 0.0001;

  useScrollCameraControl(controlsRef, 0.2, -5, 5);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping={true}
      enableZoom={false}
      minPolarAngle={fixedPolarAngle - epsilon}
      maxPolarAngle={fixedPolarAngle + epsilon}
    />
  );
};
