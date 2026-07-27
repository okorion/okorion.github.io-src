import { useThree } from "@react-three/fiber";
import { AnimatedPointCloud } from "../../../loaders/modelPointsLoader/AnimatedPointCloud";

export function ArcaneWillow() {
  const isCompactViewport = useThree(
    (state) => state.size.width <= 720 || state.size.height <= 680,
  );

  return (
    <group position={[0, -10, 0]} scale={1}>
      <AnimatedPointCloud
        path="/models/ArcaneWillow.points"
        pointSize={0.015}
        pointLimit={isCompactViewport ? 36_000 : 60_000}
      />
    </group>
  );
}
