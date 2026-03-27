import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group, Object3DEventMap } from "three";
import { useScrollRotateScene } from "../../hooks/scene/useScrollRotateScene";
import { SceneControllers } from "./SceneControllers";
import { SceneObjects } from "./SceneObjects";
import { SceneOverlays } from "./SceneOverlays";

const MainScene = () => {
  const sceneRef = useRef<Group<Object3DEventMap>>(null);
  const [contextLost, setContextLost] = useState(false);
  const removeContextListenersRef = useRef<(() => void) | null>(null);

  useScrollRotateScene(sceneRef, 0.005, 0.07);

  useEffect(() => {
    return () => {
      removeContextListenersRef.current?.();
    };
  }, []);

  if (contextLost) {
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        className="absolute inset-0 z-10 grid place-items-center bg-black text-white"
      >
        <div className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/70 shadow-[0_12px_36px_rgba(0,0,0,0.24)] backdrop-blur-md">
          WEBGL CONTEXT LOST
        </div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 1);

        const canvas = gl.domElement;
        removeContextListenersRef.current?.();

        const handleContextLost = () => {
          setContextLost(true);
          console.error("THREE.WebGLRenderer: Context Lost.");
        };

        const handleContextRestored = () => {
          setContextLost(false);
          console.info("THREE.WebGLRenderer: Context Restored.");
        };

        canvas.addEventListener("webglcontextlost", handleContextLost);
        canvas.addEventListener("webglcontextrestored", handleContextRestored);

        removeContextListenersRef.current = () => {
          canvas.removeEventListener("webglcontextlost", handleContextLost);
          canvas.removeEventListener(
            "webglcontextrestored",
            handleContextRestored,
          );
        };
      }}
      style={{ background: "#000000" }}
    >
      <group ref={sceneRef}>
        <SceneOverlays />
        <SceneObjects />
      </group>
      <SceneControllers />
    </Canvas>
  );
};

export default MainScene;
