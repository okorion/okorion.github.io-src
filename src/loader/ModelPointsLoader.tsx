import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

type Props = {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  opacity?: number;
  pointCount?: number;
  isAnimating?: boolean;
  color?: string;
  pointSize?: number;
};

export default function ModelPointsLoader({
  path,
  position,
  rotation,
  scale = 1,
  opacity = 1,
  pointCount = 100000,
  isAnimating = false,
  color = "#ffffff",
  pointSize = 0.02,
}: Props) {
  const gltf = useLoader(GLTFLoader, path);
  const pointsRef = useRef<THREE.Points>(null!);
  const originalPositions = useRef<Float32Array | null>(null);
  const startPositions = useRef<Float32Array | null>(null);
  const movementDirections = useRef<THREE.Vector3[] | null>(null);
  const animationProgress = useRef(0);
  const ANIMATION_DURATION = 3.0;

  const sampledGeometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;

    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.computeVertexNormals();

        const sampler = new MeshSurfaceSampler(mesh).build();
        originalPositions.current = new Float32Array(pointCount * 3);
        startPositions.current = new Float32Array(pointCount * 3);
        const dirList: THREE.Vector3[] = [];
        const boundingBox = new THREE.Box3().setFromObject(mesh);
        const modelSize = boundingBox.getSize(new THREE.Vector3()).length();
        const temp = new THREE.Vector3();

        for (let i = 0; i < pointCount; i++) {
          // 1. 원본 위치 샘플링
          sampler.sample(temp);
          originalPositions.current.set([temp.x, temp.y, temp.z], i * 3);

          // 2. 초기 산란 위치 계산
          const dir = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5,
          ).normalize();
          const startPos = temp.clone().add(dir.multiplyScalar(modelSize * 2));
          startPositions.current.set(
            [startPos.x, startPos.y, startPos.z],
            i * 3,
          );

          dirList.push(dir);
        }

        geo = new THREE.BufferGeometry();
        geo.setAttribute(
          "position",
          new THREE.BufferAttribute(startPositions.current, 3),
        );
        movementDirections.current = dirList;
      }
    });

    return geo;
  }, [gltf, pointCount]);

  useFrame(({ clock }, delta) => {
    if (
      !pointsRef.current ||
      !originalPositions.current ||
      !startPositions.current ||
      !movementDirections.current
    )
      return;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const time = clock.getElapsedTime();

    animationProgress.current = Math.min(
      animationProgress.current + delta / ANIMATION_DURATION,
      1,
    );

    const easeOut = 1 - Math.pow(1 - animationProgress.current, 3);

    for (let i = 0; i < positions.length; i += 3) {
      const idx = i / 3;

      // 초기 위치(startPositions)에서 원본 위치(originalPositions)로 보간
      const startX = startPositions.current[i];
      const startY = startPositions.current[i + 1];
      const startZ = startPositions.current[i + 2];

      const targetX = originalPositions.current[i];
      const targetY = originalPositions.current[i + 1];
      const targetZ = originalPositions.current[i + 2];

      positions[i] = startX + (targetX - startX) * easeOut;
      positions[i + 1] = startY + (targetY - startY) * easeOut;
      positions[i + 2] = startZ + (targetZ - startZ) * easeOut;

      if (!isAnimating && animationProgress.current < 0.95) return;

      const dir = movementDirections.current[idx];
      const frequency = 2.0;
      const amplitude = 0.05;
      const pointSpeed = 0.01;
      const offset = Math.sin(time * frequency + idx) * amplitude;

      positions[i] += dir.x * pointSpeed * offset;
      positions[i + 1] += dir.y * pointSpeed * offset;
      positions[i + 2] += dir.z * pointSpeed * offset;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!sampledGeometry) return null;

  return (
    <points
      ref={pointsRef}
      geometry={sampledGeometry}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    >
      <pointsMaterial
        attach="material"
        color={color}
        size={pointSize}
        sizeAttenuation
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
