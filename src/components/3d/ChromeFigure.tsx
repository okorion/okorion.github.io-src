import ModelLoader from "../../loader/ModelLoader";

export const ChromeFigure = () => {
  return (
    <ModelLoader
      path="/models/ChromeFigure.glb"
      position={[0, 0, 2]}
      scale={3}
    />
  );
};
