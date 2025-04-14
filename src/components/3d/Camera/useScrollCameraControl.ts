import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three-stdlib";

export const useScrollCameraControl = (
  controlsRef: React.RefObject<OrbitControls | null>,
  step = 0.5,
  minY = -10,
  maxY = 10
) => {
  const { camera } = useThree();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const deltaY = e.deltaY > 0 ? -step : step;
      const newY = Math.max(minY, Math.min(maxY, camera.position.y + deltaY));

      camera.position.y = newY;

      if (controlsRef.current) {
        controlsRef.current.target.y = newY;
        controlsRef.current.update();
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera, controlsRef, step, minY, maxY]);
};
