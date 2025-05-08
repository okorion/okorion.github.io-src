import { useEffect, useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { lerp } from "three/src/math/MathUtils.js";

export const useScrollRotateScene = (
  sceneRef: React.RefObject<Group<Object3DEventMap> | null>,
  step: number, // 0.003 ~ 0.01  	드래그 민감도
  smoothness: number, // 0.03 ~ 0.07   	따라가는 부드러움 정도
) => {
  const targetRotation = useRef(0);
  const isDragging = useRef(false);
  const lastClientX = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY > 0 ? -step * 10 : step * 10;
      targetRotation.current += delta;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastClientX.current = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastClientX.current;
      const delta = deltaX * step;
      targetRotation.current += delta;
      lastClientX.current = e.clientX;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
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
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    animate();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [sceneRef, step, smoothness]);
};
