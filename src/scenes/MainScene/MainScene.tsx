import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { CameraController } from "../../components/three/controllers/CameraController";
import { LightController } from "../../components/three/controllers/LightController";
import { ArcaneWillow } from "../../components/three/objects/ArcaneWillow";
import { ChromeFigure } from "../../components/three/objects/ChromeFigure";
import { FallingParticle } from "../../components/three/objects/FallingParticle";
import { FloorPoints } from "../../components/three/objects/FloorPoints";
import { OverlayMenu3D } from "../../components/three/overlays/OverlayMenu3D";
import { useScrollRotateScene } from "../../hooks/scene/useScrollRotateScene";
import { GuidePoint } from "../Shared/GuidePoint";
import { InteractivePoint } from "../Shared/InteractivePoint";

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
        <GuidePoint />
        <InteractivePoint radius={1.0} speed={1.0} lifetime={2.0} />
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
