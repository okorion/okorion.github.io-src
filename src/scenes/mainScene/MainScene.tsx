import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import Stats from "stats.js";
import { Group, Object3DEventMap } from "three";
import { useScrollRotateScene } from "../../hooks/scene/useScrollRotateScene";
import { SceneControllers } from "./SceneControllers";
import { SceneObjects } from "./SceneObjects";
import { SceneOverlays } from "./SceneOverlays";

const StatsMonitor = () => {
  const panelsRef = useRef<Stats[]>([]);
  const drawCallRef = useRef<number>(0);

  const { gl } = useThree();

  useEffect(() => {
    const fps = new Stats();
    fps.showPanel(0);
    document.body.appendChild(fps.dom);

    const ms = new Stats();
    ms.showPanel(1);
    ms.dom.style.cssText = "position:fixed;top:0px;left:80px;z-index:10000;";
    document.body.appendChild(ms.dom);

    const mb = new Stats();
    mb.showPanel(2);
    mb.dom.style.cssText = "position:fixed;top:0px;left:160px;z-index:10000;";
    document.body.appendChild(mb.dom);

    panelsRef.current = [fps, ms, mb];

    return () => {
      panelsRef.current.forEach((panel) => {
        panel.dom?.parentNode?.removeChild(panel.dom);
      });
    };
  }, []);

  useFrame(() => {
    // gl is of type WebGLRenderer, which has the 'info' property
    const rendererStats = gl.info;
    drawCallRef.current = rendererStats.render?.calls ?? 0;

    panelsRef.current.forEach((panel) => {
      panel.begin();
      panel.end();
    });
  });

  useEffect(() => {
    const log = () => {
      console.log("Draw Calls:", drawCallRef.current);
      requestAnimationFrame(log);
    };
    requestAnimationFrame(log);
  }, []);

  return null;
};

const MainScene = () => {
  const sceneRef = useRef<Group<Object3DEventMap>>(null);

  useScrollRotateScene(sceneRef, 0.005, 0.07);

  return (
    <Canvas style={{ background: "#000000" }}>
      <StatsMonitor />
      <group ref={sceneRef}>
        <SceneOverlays />
        <SceneObjects />
      </group>
      <SceneControllers />
    </Canvas>
  );
};

export default MainScene;
