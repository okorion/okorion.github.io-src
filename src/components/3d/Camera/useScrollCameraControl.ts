import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three-stdlib";
import { lerp } from "three/src/math/MathUtils.js";

export const useScrollCameraControl = (
  controlsRef: React.RefObject<OrbitControls | null>,
  step = 0.5,
  minY = -10,
  maxY = 10,
  smoothness = 0.05,
) => {
  const { camera } = useThree();
  const targetY = useRef(camera.position.y);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const deltaY = e.deltaY > 0 ? -step : step;
      targetY.current = Math.max(
        minY,
        Math.min(maxY, targetY.current + deltaY),
      );
    };

    const animate = () => {
      camera.position.y = lerp(camera.position.y, targetY.current, smoothness);

      if (controlsRef.current) {
        controlsRef.current.target.y = lerp(
          controlsRef.current.target.y,
          targetY.current,
          smoothness,
        );
        controlsRef.current.update();
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", handleWheel);
    animate();

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [camera, controlsRef, step, minY, maxY, smoothness]);
};
