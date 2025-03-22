import { Canvas } from "@react-three/fiber";
import CameraController from "../components/3d/CameraController";
import Box from "../components/3d/Box";

const MainScene = () => {
  return (
    <Canvas fallback={<div>Sorry no WebGL supported!</div>}>
      <Box position={[-1, 0, 0]} />
      <Box position={[1, 0, 0]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      <CameraController />
    </Canvas>
  );
};

export default MainScene;
