import { DoubleSide } from "three";

export const Floor = () => {
  return (
    <mesh rotation={[0, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <cylinderGeometry args={[20, 20, 0.0015, 64]} />
      <meshStandardMaterial
        color="#bbbbbb"
        side={DoubleSide}
        transparent
        opacity={0.07}
      />
    </mesh>
  );
};
