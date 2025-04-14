import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Object3DEventMap } from "three";
import { ArcaneWillow } from "../components/3d/ArcaneWillow";
import { CameraController } from "../components/3d/Camera/CameraController";
import { ChromeFigure } from "../components/3d/ChromeFigure";
import { Floor } from "../components/3d/Floor";
import { LightController } from "../components/3d/LightController";
import { OverlayMenu3D } from "../components/3d/OverlayMenu3D";
import { useScrollRotateScene } from "./useScrollRotateScene";

const MainScene = () => {
  const [isHovered, setHovered] = useState(false);
  const sceneRef = useRef<Group<Object3DEventMap> | null>(null);

  useScrollRotateScene(sceneRef, 0.05);

  return (
    <Canvas style={{ background: "#949494" }} shadows>
      <group ref={sceneRef}>
        <OverlayMenu3D setHovered={setHovered} />

        <ChromeFigure />
        <ArcaneWillow />
        <Floor />
      </group>

      <CameraController />
      <LightController isHovered={isHovered} />
    </Canvas>
  );
};

export default MainScene;
