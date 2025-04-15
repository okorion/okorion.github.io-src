import ModelPointsLoader from "../../loader/ModelPointsLoader";

export const ChromeFigure = () => {
  return (
    <ModelPointsLoader
      path="/models/ChromeFigure.glb"
      scale={4}
      color="yellow"
      position={[-0.65, -0.02, 1.8]}
      rotation={[0, 0, 0]}
      pointCount={5000}
      pointSize={0.0001}
      isAnimating
    />
  );
};

// import ModelLoader from "../../loader/ModelLoader";

// export const ChromeFigure = () => {
//   return (
//     <ModelLoader
//       path="/models/ChromeFigure.glb"
//       position={[0, -0.02, 1.95]}
//       rotation={[0, -0.3, 0]}
//       scale={3}
//     />
//   );
// };
