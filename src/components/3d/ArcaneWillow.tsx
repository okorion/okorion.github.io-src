import ModelLoader from "../../loader/ModelLoader";

export const ArcaneWillow = () => {
  return (
    <>
      <ModelLoader
        path="/models/ArcaneWillow.glb"
        scale={1}
        interpolate
        usePoints
      />
      <ModelLoader
        path="/models/ArcaneWillow.glb"
        scale={0.99}
        opacity={0.12}
      />
    </>
  );
};
