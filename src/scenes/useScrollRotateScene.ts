import { useEffect } from "react";
import { Group, Object3DEventMap } from "three";

export const useScrollRotateScene = (
  sceneRef: React.RefObject<Group<Object3DEventMap> | null>,
  step: number = 0.05,
) => {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY > 0 ? -step : step;

      if (sceneRef.current) {
        sceneRef.current.rotation.y += delta;
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [sceneRef, step]);
};
