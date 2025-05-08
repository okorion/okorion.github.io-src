import { ModelPointsLoader } from "../../../loaders/ModelPointsLoader";

export const ChromeFigure = () => {
  return (
    <ModelPointsLoader
      path="/models/ChromeFigure.glb"
      scale={4}
      color="yellow"
      position={[-0.65, -0.02, 1.8]}
      rotation={[0, 0, 0]}
      pointCount={5000}
      pointSize={0.005}
      isAnimating
    />
  );
};
