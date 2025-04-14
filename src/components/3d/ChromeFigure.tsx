import ModelLoader from "../../loader/ModelLoader";

export const ChromeFigure = () => {
  return (
    <ModelLoader
      path="/models/ChromeFigure.glb"
      position={[0, -0.02, 1.95]}
      rotation={[0, -0.3, 0]}
      scale={3}
    />
  );
};
