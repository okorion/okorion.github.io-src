import { useRef } from "react";
import * as THREE from "three";
import { ModelPointsLoader } from "../../../loaders/modelPointsLoader";
import { useGLTFPoints } from "../../../loaders/modelPointsLoader/useGLTFPoints";
import { usePointsAnimation } from "../../../loaders/modelPointsLoader/usePointsAnimation";

export const ChromeFigure = () => {
  const pointCount = 5000;
  const color = "yellow";
  const path = "/models/ChromeFigure.glb";
  const pointsRef = useRef<THREE.Points>(null!);

  // 1. GLTF 로드 및 포인트 샘플링
  const {
    originalPositions,
    startPositions,
    movementDirections,
    boundingBoxRef,
    geometry,
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
    vertexColors: false,
    color,
    animationDuration: 0.5,
  });

  if (!geometry) return null;

  return (
    <group position={[-0.65, -0.02, 1.8]} rotation={[0, 0, 0]} scale={4}>
      <ModelPointsLoader
        path={path}
        pointCount={pointCount}
        color={color}
        pointSize={0.005}
        pointsRef={pointsRef}
      />
    </group>
  );
};
