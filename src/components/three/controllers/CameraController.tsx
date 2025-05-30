import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { useScrollCameraControl } from "../../../hooks/camera/useScrollCameraControl";

export const CameraController = () => {
  const controlsRef = useRef<CameraControls | null>(null);

  const { camera } = useThree();
  const [manualTargetY, setManualTargetY] = useState<number | null>(null);

  useEffect(() => {
    const startPos = new Vector3(0, 2, 6);
    const endPos = new Vector3(0, 0.37, 2.9);

    const startTarget = new Vector3(0, 2, 0);
    const endTarget = new Vector3(0, 0.37, 0);

    const duration = 2000;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutCubic(t);

      const pos = startPos.clone().lerp(endPos, easedT);
      const target = startTarget.clone().lerp(endTarget, easedT);

      controlsRef.current?.setLookAt(
        pos.x,
        pos.y,
        pos.z,
        target.x,
        target.y,
        target.z,
        false,
      );

      setManualTargetY(target.y);

      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [camera]);

  const fixedPolarAngle = Math.PI / 2;
  const epsilon = 0.0001;

  useScrollCameraControl(controlsRef, 0.2, -2, 15, 0.05, manualTargetY);

  return (
    <CameraControls
      ref={controlsRef}
      minPolarAngle={fixedPolarAngle - epsilon}
      maxPolarAngle={fixedPolarAngle + epsilon}
      dollySpeed={0}
      truckSpeed={0}
    />
  );
};
