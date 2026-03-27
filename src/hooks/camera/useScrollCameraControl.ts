import { useFrame, useThree } from "@react-three/fiber";
import CameraControls from "camera-controls";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";

export const useScrollCameraControl = (
  controlsRef: React.RefObject<CameraControls | null>,
  step = 0.5,
  minY = -10,
  maxY = 10,
  smoothness = 0.05,
  externalTargetYRef?: React.RefObject<number | null>,
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

  useFrame(() => {
    if (!controlsRef.current) return;

    if (
      externalTargetYRef?.current !== undefined &&
      externalTargetYRef.current !== null
    ) {
      targetY.current = externalTargetYRef.current;
    }

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
  });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const deltaY = e.deltaY > 0 ? -step : step;
      targetY.current = Math.max(
        minY,
        Math.min(maxY, targetY.current + deltaY),
      );
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [maxY, minY, step]);
};
