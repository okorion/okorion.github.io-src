import { ModelPointsLoader } from "../../../loaders/modelPointsLoader/index";

export const ArcaneWillow = () => {
  return (
    <>
      <ModelPointsLoader
        path="/models/ArcaneWillow.glb"
        scale={1}
        position={[0, -10, 0]}
        pointCount={150000}
        pointSize={0.02}
        isAnimating
        vertexColors
      />
    </>
  );
};
