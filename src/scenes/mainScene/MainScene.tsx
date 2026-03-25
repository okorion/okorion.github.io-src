import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { useScrollRotateScene } from "../../hooks/scene/useScrollRotateScene";
import { SceneControllers } from "./SceneControllers";
import { SceneObjects } from "./SceneObjects";
import { SceneOverlays } from "./SceneOverlays";

const SceneContent = () => {
  const sceneRef = useRef<Group<Object3DEventMap>>(null);

  useScrollRotateScene(sceneRef, 0.005, 0.07);

  return (
    <group ref={sceneRef}>
      <SceneOverlays />
      <SceneObjects />
    </group>
  );
};

const MainScene = () => {
  return (
    <Canvas dpr={[1, 1.5]} style={{ background: "#000000" }}>
      <SceneContent />
      <SceneControllers />
    </Canvas>
  );
};

export default MainScene;
