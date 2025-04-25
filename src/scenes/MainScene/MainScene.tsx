import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { useScrollRotateScene } from "../../hooks/scene/useScrollRotateScene";
import { SceneControllers } from "./SceneControllers";
import { SceneObjects } from "./SceneObjects";
import { SceneOverlays } from "./SceneOverlays";

const MainScene = () => {
  const sceneRef = useRef<Group<Object3DEventMap>>(null);

  useScrollRotateScene(sceneRef, 0.05);

  return (
    <Canvas style={{ background: "#000000" }}>
      <group ref={sceneRef}>
        <SceneOverlays />
        <SceneObjects />
      </group>
      <SceneControllers />
    </Canvas>
  );
};

export default MainScene;
