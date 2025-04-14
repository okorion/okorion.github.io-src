import { FilledCirclePoints } from "./FilledCirclePoints";

export const Floor = () => {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#bbbbbb" />
      </mesh>
      <FilledCirclePoints radius={10} rings={100} segmentsPerRing={100} />
    </>
  );
};
