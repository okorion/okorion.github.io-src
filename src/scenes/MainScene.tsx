import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { ArcaneWillow } from "../components/3d/ArcaneWillow";
import { CameraController } from "../components/3d/Camera/CameraController";
import { ChromeFigure } from "../components/3d/ChromeFigure";
import { Floor } from "../components/3d/Floor";
import { LightController } from "../components/3d/LightController";
import { OverlayMenu3D } from "../components/3d/OverlayMenu3D";
import { useScrollRotateScene } from "./useScrollRotateScene";

const MainScene = () => {
  const sceneRef = useRef<Group<Object3DEventMap> | null>(null);

  useScrollRotateScene(sceneRef, 0.05);

  return (
    <Canvas style={{ background: "#000000" }} shadows>
      <group ref={sceneRef}>
        <OverlayMenu3D />

        <ChromeFigure />
        <ArcaneWillow />
        <Floor />
      </group>

      <CameraController />
      <LightController />
    </Canvas>
  );
};

export default MainScene;
