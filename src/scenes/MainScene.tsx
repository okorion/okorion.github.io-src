import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { ArcaneWillow } from "../components/3d/ArcaneWillow";
import { CameraController } from "../components/3d/Camera/CameraController";
import { ChromeFigure } from "../components/3d/ChromeFigure";
import { FallingParticle } from "../components/3d/FallingParticle";
import { FloorPoints } from "../components/3d/FloorPoints";
import { LightController } from "../components/3d/LightController";
import { OverlayMenu3D } from "../components/3d/OverlayMenu3D";
import { useScrollRotateScene } from "./useScrollRotateScene";

const MainScene = () => {
  const sceneRef = useRef<Group<Object3DEventMap> | null>(null);

  useScrollRotateScene(sceneRef, 0.05);

  return (
    <Canvas style={{ background: "#000000" }}>
      <group ref={sceneRef}>
        <OverlayMenu3D />

        <ChromeFigure />
        <ArcaneWillow />
        <FloorPoints />
        <FallingParticle
          radius={6}
          pointCount={30000}
          pointSize={0.02}
          startY={12}
          endY={-10}
        />
        <FallingParticle
          radius={8}
          pointCount={100000}
          pointSize={0.01}
          startY={0}
          endY={-2}
        />
      </group>

      <CameraController />
      <LightController />
    </Canvas>
  );
};

export default MainScene;
