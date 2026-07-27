import { useThree } from "@react-three/fiber";
import { AnimatedPointCloud } from "../../../loaders/modelPointsLoader/AnimatedPointCloud";

export function ChromeFigure() {
  const isCompactViewport = useThree(
    (state) => state.size.width <= 720 || state.size.height <= 680,
  );

  return (
    <group position={[-0.65, -0.02, 1.8]} rotation={[0, 0, 0]} scale={4}>
      <AnimatedPointCloud
        path="/models/ChromeFigure.points"
        color="yellow"
        pointSize={0.005}
        pointLimit={isCompactViewport ? 3_500 : 5_000}
      />
    </group>
  );
}
