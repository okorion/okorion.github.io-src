import { OrbitControls } from "@react-three/drei";

export const CameraController = () => {
  // const fixedPolarAngle = Math.PI / 2;
  // const epsilon = 0.0001;

  return (
    <OrbitControls
      // enablePan={false}
      enableDamping={true}
      // minPolarAngle={fixedPolarAngle - epsilon}
      // maxPolarAngle={fixedPolarAngle + epsilon}
    />
  );
};
