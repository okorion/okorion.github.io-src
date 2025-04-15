import ModelLoader from "../../loader/ModelLoader";
import ModelPointsLoader from "../../loader/ModelPointsLoader";

export const ArcaneWillow = () => {
  return (
    <>
      <ModelPointsLoader path="/models/ArcaneWillow.glb" scale={1} />
      <ModelLoader
        path="/models/ArcaneWillow.glb"
        scale={0.998}
        opacity={0.2}
      />
    </>
  );
};
