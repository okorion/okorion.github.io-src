import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";
import { useScrollCameraControl } from "../../../hooks/useScrollCameraControl";

export const CameraController = () => {
  const controlsRef = useRef<ThreeOrbitControls | null>(null);

  const { camera } = useThree();
  const [manualTargetY, setManualTargetY] = useState<number | null>(null);

  useEffect(() => {
    const startPos = new Vector3(0, 2, 6);
    const endPos = new Vector3(0, 0.37, 2.9);

    const startTarget = new Vector3(0, 2, 0);
    const endTarget = new Vector3(0, 0.37, 0);

    const duration = 2000;
    const startTime = performance.now();

    // ✅ easeOutCubic: 초반 빠름 → 후반 느림
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOutCubic(t); // <-- 핵심!

      camera.position.copy(startPos.clone().lerp(endPos, easedT));

      if (controlsRef.current) {
        controlsRef.current.target.copy(
          startTarget.clone().lerp(endTarget, easedT),
        );
        controlsRef.current.update();
      }
      setManualTargetY(startTarget.y + (endTarget.y - startTarget.y));
      if (t < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [camera]);

  const fixedPolarAngle = Math.PI / 2;
  const epsilon = 0.0001;

  useScrollCameraControl(controlsRef, 0.2, -2, 15, 0.05, manualTargetY);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping={true}
      enableZoom={false}
      minPolarAngle={fixedPolarAngle - epsilon}
      maxPolarAngle={fixedPolarAngle + epsilon}
    />
  );
};
