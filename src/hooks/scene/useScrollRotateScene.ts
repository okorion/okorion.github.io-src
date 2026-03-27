import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { lerp } from "three/src/math/MathUtils.js";

export const useScrollRotateScene = (
  sceneRef: React.RefObject<Group<Object3DEventMap> | null>,
  step: number,
  smoothness: number,
) => {
  const targetRotation = useRef(0);
  const isDragging = useRef(false);
  const lastClientX = useRef(0);

  useFrame(() => {
    if (!sceneRef.current) return;

    sceneRef.current.rotation.y = lerp(
      sceneRef.current.rotation.y,
      targetRotation.current,
      smoothness,
    );
  });

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
      targetRotation.current += deltaX * step;
      lastClientX.current = e.clientX;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [step]);
};
