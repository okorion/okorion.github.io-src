import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import { useScrollCameraControl } from "../../../hooks/camera/useScrollCameraControl";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

export const CameraController = () => {
  const viewportWidth = useThree((state) => state.size.width);
  const isNarrowViewport = viewportWidth <= 720;
  const prefersReducedMotion = useReducedMotion();
  const controlsRef = useRef<CameraControls | null>(null);
  const introElapsed = useRef(0);
  const introTargetYRef = useRef<number | null>(null);
  const suspendScrollLookAtRef = useRef(false);
  const reframeSequenceRef = useRef(0);
  const introTargetReleaseFramesRef = useRef(0);
  const previousNarrowViewportRef = useRef(isNarrowViewport);
  const previousReducedMotionRef = useRef(prefersReducedMotion);
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
    const viewportChanged =
      previousNarrowViewportRef.current !== isNarrowViewport;
    const reducedMotionEnabled =
      !previousReducedMotionRef.current && prefersReducedMotion;

    previousNarrowViewportRef.current = isNarrowViewport;
    previousReducedMotionRef.current = prefersReducedMotion;
    if (!viewportChanged && !reducedMotionEnabled) return;

    const controls = controlsRef.current;

    if (!controls) {
      if (viewportChanged) introElapsed.current = 0;
      return;
    }

    const shouldCompleteIntro =
      reducedMotionEnabled && introElapsed.current < 2;
    controls.getPosition(introVectors.pos);
    controls.getTarget(introVectors.target);

    introElapsed.current = 2;
    introTargetYRef.current = shouldCompleteIntro
      ? introVectors.endTarget.y
      : null;
    // The camera frame runs before the scroll-control frame. Keep the final
    // target through one full frame so the scroll controller can sync to it.
    introTargetReleaseFramesRef.current = shouldCompleteIntro ? 2 : 0;
    suspendScrollLookAtRef.current = true;
    const reframeSequence = reframeSequenceRef.current + 1;
    reframeSequenceRef.current = reframeSequence;
    const finishReframing = () => {
      if (reframeSequenceRef.current === reframeSequence) {
        suspendScrollLookAtRef.current = false;
      }
    };

    void controls
      .setLookAt(
        introVectors.endPos.x,
        shouldCompleteIntro ? introVectors.endPos.y : introVectors.pos.y,
        introVectors.endPos.z,
        introVectors.endTarget.x,
        shouldCompleteIntro ? introVectors.endTarget.y : introVectors.target.y,
        introVectors.endTarget.z,
        !prefersReducedMotion,
      )
      .then(finishReframing, finishReframing);
  }, [introVectors, isNarrowViewport, prefersReducedMotion]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (introTargetReleaseFramesRef.current > 0) {
      introTargetReleaseFramesRef.current -= 1;
      if (introTargetReleaseFramesRef.current === 0) {
        introTargetYRef.current = null;
      }
    }

    const duration = 2;
    if (introElapsed.current >= duration) return;

    if (prefersReducedMotion) {
      introElapsed.current = duration;
      introTargetYRef.current = introVectors.endTarget.y;
      introTargetReleaseFramesRef.current = 1;
      controlsRef.current.setLookAt(
        introVectors.endPos.x,
        introVectors.endPos.y,
        introVectors.endPos.z,
        introVectors.endTarget.x,
        introVectors.endTarget.y,
        introVectors.endTarget.z,
        false,
      );
      return;
    }

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

  useScrollCameraControl(
    controlsRef,
    0.2,
    -2,
    15,
    0.05,
    introTargetYRef,
    suspendScrollLookAtRef,
  );

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
