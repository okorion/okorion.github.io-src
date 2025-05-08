import { useThree } from "@react-three/fiber";
import CameraControls from "camera-controls"; // 내부적으로 사용됨
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";

export const useScrollCameraControl = (
  controlsRef: React.RefObject<CameraControls | null>,
  step = 0.5,
  minY = -10,
  maxY = 10,
  smoothness = 0.05,
  externalTargetY?: number | null,
) => {
  const { camera } = useThree();
  const targetY = useRef(camera.position.y);
  const positionRef = useRef(new Vector3());
  const targetRef = useRef(new Vector3());

  useEffect(() => {
    if (!controlsRef.current) return;

    controlsRef.current.getPosition(positionRef.current);
    controlsRef.current.getTarget(targetRef.current);
    targetY.current = positionRef.current.y;
  }, [controlsRef]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const deltaY = e.deltaY > 0 ? -step : step;
      targetY.current = Math.max(
        minY,
        Math.min(maxY, targetY.current + deltaY),
      );
    };

    const animate = () => {
      if (!controlsRef.current) return;

      controlsRef.current.getPosition(positionRef.current);
      controlsRef.current.getTarget(targetRef.current);

      const newY = lerp(positionRef.current.y, targetY.current, smoothness);

      controlsRef.current.setLookAt(
        positionRef.current.x,
        newY,
        positionRef.current.z,
        targetRef.current.x,
        newY,
        targetRef.current.z,
        false,
      );

      requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", handleWheel);
    animate();

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [controlsRef, step, minY, maxY, smoothness]);

  useEffect(() => {
    if (externalTargetY !== undefined && externalTargetY !== null) {
      targetY.current = externalTargetY;
    }
  }, [externalTargetY]);
};
