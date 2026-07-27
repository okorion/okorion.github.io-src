import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import { useScrollCameraControl } from "../../../hooks/camera/useScrollCameraControl";

export const CameraController = () => {
  const viewportWidth = useThree((state) => state.size.width);
  const isNarrowViewport = viewportWidth <= 720;
  const controlsRef = useRef<CameraControls | null>(null);
  const introElapsed = useRef(0);
  const introTargetYRef = useRef<number | null>(null);
  const previousNarrowViewportRef = useRef(isNarrowViewport);
  const introVectors = useMemo(
    () =>
      isNarrowViewport
        ? {
            startPos: new Vector3(-0.15, 2.2, 7.2),
            endPos: new Vector3(-0.15, 0.48, 4.8),
            startTarget: new Vector3(-0.15, 2.2, 0),
            endTarget: new Vector3(-0.15, 0.48, 0),
            pos: new Vector3(),
            target: new Vector3(),
          }
        : {
            startPos: new Vector3(0, 2, 6),
            endPos: new Vector3(0, 0.37, 2.9),
            startTarget: new Vector3(0, 2, 0),
            endTarget: new Vector3(0, 0.37, 0),
            pos: new Vector3(),
            target: new Vector3(),
          },
    [isNarrowViewport],
  );

  useEffect(() => {
    if (previousNarrowViewportRef.current === isNarrowViewport) return;

    previousNarrowViewportRef.current = isNarrowViewport;
    const controls = controlsRef.current;

    if (!controls) {
      introElapsed.current = 0;
      return;
    }

    const wasIntroComplete = introElapsed.current >= 2;
    controls.getPosition(introVectors.pos);
    controls.getTarget(introVectors.target);

    const nextPositionY = wasIntroComplete
      ? introVectors.pos.y
      : introVectors.endPos.y;
    const nextTargetY = wasIntroComplete
      ? introVectors.target.y
      : introVectors.endTarget.y;

    introElapsed.current = 2;
    introTargetYRef.current = null;
    controls.setLookAt(
      introVectors.endPos.x,
      nextPositionY,
      introVectors.endPos.z,
      introVectors.endTarget.x,
      nextTargetY,
      introVectors.endTarget.z,
      true,
    );
  }, [introVectors, isNarrowViewport]);

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
