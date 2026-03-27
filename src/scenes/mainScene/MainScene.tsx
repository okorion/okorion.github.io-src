import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
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
  const [contextLost, setContextLost] = useState(false);
  const removeContextListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      removeContextListenersRef.current?.();
    };
  }, []);

  return (
    <div className="relative h-full w-full">
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

          const handleContextLost = (event: Event) => {
            event.preventDefault();
            setContextLost(true);
          };

          const handleContextRestored = () => {
            setContextLost(false);
          };

          canvas.addEventListener("webglcontextlost", handleContextLost);
          canvas.addEventListener(
            "webglcontextrestored",
            handleContextRestored,
          );

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
        <SceneContent />
        <SceneControllers />
      </Canvas>
      {contextLost ? (
        <div
          aria-atomic="true"
          aria-live="polite"
          className="absolute inset-0 z-10 grid place-items-center bg-black text-white"
        >
          <div className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/70 shadow-[0_12px_36px_rgba(0,0,0,0.24)] backdrop-blur-md">
            WEBGL CONTEXT LOST
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MainScene;
