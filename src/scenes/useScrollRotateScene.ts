import { useEffect, useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { lerp } from "three/src/math/MathUtils.js";

export const useScrollRotateScene = (
  sceneRef: React.RefObject<Group<Object3DEventMap> | null>,
  step: number = 0.1,
  smoothness: number = 0.01,
) => {
  const targetRotation = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY > 0 ? -step : step;
      targetRotation.current += delta;
    };

    const animate = () => {
      if (sceneRef.current) {
        sceneRef.current.rotation.y = lerp(
          sceneRef.current.rotation.y,
          targetRotation.current,
          smoothness,
        );
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", handleWheel);
    animate();

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [sceneRef, step, smoothness]);
};
