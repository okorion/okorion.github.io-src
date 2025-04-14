import { Canvas } from "@react-three/fiber";
import { CameraController } from "../components/3d/Camera/CameraController";
import { Floor } from "../components/3d/Floor";
import { LightController } from "../components/3d/LightController";
import { useState } from "react";
import { ArcaneWillow } from "../components/3d/ArcaneWillow";
import { ChromeFigure } from "../components/3d/ChromeFigure";
import { OverlayMenu3D } from "../components/3d/OverlayMenu3D";

const MainScene = () => {
  const [isHovered, setHovered] = useState(false);

  return (
    <Canvas style={{ background: "#949494" }} shadows>
      <OverlayMenu3D setHovered={setHovered} />

      <ChromeFigure />
      <ArcaneWillow />
      <Floor />

      <CameraController />
      <LightController isHovered={isHovered} />
    </Canvas>
  );
};

export default MainScene;
