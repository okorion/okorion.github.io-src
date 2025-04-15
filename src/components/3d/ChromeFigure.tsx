import ModelPointsLoader from "../../loader/ModelPointsLoader";

export const ChromeFigure = () => {
  return (
    <ModelPointsLoader
      path="/models/ChromeFigure.glb"
      color="yellow"
      scale={4}
      position={[0, -0.02, 1.95]}
      rotation={[0, -0.3, 0]}
      pointCount={3500}
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
