import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";
import { useScrollCameraControl } from "../../../hooks/camera/useScrollCameraControl";

export const CameraController = () => {
  const controlsRef = useRef<CameraControls | null>(null);
  const introElapsed = useRef(0);
  const introTargetYRef = useRef<number | null>(null);
  const introVectors = useMemo(
    () => ({
      startPos: new Vector3(0, 2, 6),
      endPos: new Vector3(0, 0.37, 2.9),
      startTarget: new Vector3(0, 2, 0),
      endTarget: new Vector3(0, 0.37, 0),
      pos: new Vector3(),
      target: new Vector3(),
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const duration = 2;
    if (introElapsed.current >= duration) return;

    introElapsed.current = Math.min(introElapsed.current + delta, duration);

    const t = introElapsed.current / duration;
    const easedT = 1 - Math.pow(1 - t, 3);

    introVectors.pos
      .copy(introVectors.startPos)
      .lerp(introVectors.endPos, easedT);
    introVectors.target
      .copy(introVectors.startTarget)
      .lerp(introVectors.endTarget, easedT);

    controlsRef.current.setLookAt(
      introVectors.pos.x,
      introVectors.pos.y,
      introVectors.pos.z,
      introVectors.target.x,
      introVectors.target.y,
      introVectors.target.z,
      false,
    );

    introTargetYRef.current = t < 1 ? introVectors.target.y : null;
  });

  const fixedPolarAngle = Math.PI / 2;
  const epsilon = 0.0001;

  useScrollCameraControl(controlsRef, 0.2, -2, 15, 0.05, introTargetYRef);

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
