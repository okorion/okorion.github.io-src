import { Canvas } from "@react-three/fiber";
import CameraController from "../components/3d/CameraController";
import ModelLoader from "../loader/ModelLoader";
import { FilledCirclePoints } from "./FilledCirclePoints";

const MainScene = () => {
  return (
    <Canvas style={{ background: "#949494" }} shadows>
      <ambientLight intensity={4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      <ModelLoader
        path="/src/models/ChromeFigure.glb"
        position={[0, 0, 0]}
        scale={3}
      />
      <ModelLoader
        path="/src/models/ArcaneWillow.glb"
        scale={1}
        interpolate
        usePoints
      />
      <ModelLoader
        path="/src/models/ArcaneWillow.glb"
        scale={0.99}
        opacity={0.12}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#bbbbbb" />
      </mesh>
      <FilledCirclePoints radius={10} rings={100} segmentsPerRing={100} />

      <CameraController />
    </Canvas>
  );
};

export default MainScene;
