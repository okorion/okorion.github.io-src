import { useRef } from "react";
import * as THREE from "three";
import { ModelPointsLoader } from "../../../loaders/modelPointsLoader";
import { useGLTFPoints } from "../../../loaders/modelPointsLoader/useGLTFPoints";
import { usePointsAnimation } from "../../../loaders/modelPointsLoader/usePointsAnimation";

export const ArcaneWillow = () => {
  const pointCount = 150000;
  const pointSize = 0.02;
  const path = "/models/ArcaneWillow.glb";
  const pointsRef = useRef<THREE.Points>(null!);
  const color = undefined; // vertexColors를 사용하므로 color는 undefined

  // 1. GLTF 로드 및 포인트 샘플링
  const {
    geometry,
    originalPositions,
    startPositions,
    movementDirections,
    boundingBoxRef,
  } = useGLTFPoints(path, pointCount, color);

  // 2. 애니메이션 처리
  usePointsAnimation({
    pointsRef,
    originalPositions,
    startPositions,
    movementDirections,
    boundingBoxRef,
    isAnimating: true,
    pointCount,
    vertexColors: true,
    color,
  });

  if (!geometry) return null;

  return (
    <group position={[0, -10, 0]} scale={1}>
      <ModelPointsLoader
        path={path}
        pointCount={pointCount}
        pointSize={pointSize}
        color={color}
        pointsRef={pointsRef}
      />
    </group>
  );
};
