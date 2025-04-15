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
  vertexColors?: boolean;
  pointSize?: number;
  color?: THREE.ColorRepresentation;
};

export default function ModelPointsLoader({
  path,
  position,
  rotation,
  scale = 1,
  opacity = 1,
  pointCount = 100000,
  isAnimating = false,
  vertexColors = false,
  pointSize = 0.02,
  color,
}: Props) {
  const gltf = useLoader(GLTFLoader, path);
  const pointsRef = useRef<THREE.Points>(null!);
  const originalPositions = useRef<Float32Array | null>(null);
  const startPositions = useRef<Float32Array | null>(null);
  const movementDirections = useRef<THREE.Vector3[] | null>(null);
  const animationProgress = useRef(0);
  const ANIMATION_DURATION = 6.0;
  const boundingBoxRef = useRef<THREE.Box3 | null>(null);

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
        const temp = new THREE.Vector3();

        const boundingBox = new THREE.Box3().setFromObject(mesh);
        boundingBoxRef.current = boundingBox;

        const size = boundingBox.getSize(new THREE.Vector3());
        const min = boundingBox.min;
        const modelSize = size.length();

        // 초기 색상 버퍼 (color prop이 없을 경우에만 설정)
        const colors = color ? null : new Float32Array(pointCount * 3);

        for (let i = 0; i < pointCount; i++) {
          sampler.sample(temp);
          originalPositions.current.set([temp.x, temp.y, temp.z], i * 3);

          // 초기 색상 계산 (color prop이 없을 경우에만)
          if (!color && colors) {
            const nx = (temp.x - min.x) / size.x;
            const ny = (temp.y - min.y) / size.y;
            const nz = (temp.z - min.z) / size.z;
            const hue = (nx + ny + nz) / 3;
            const calculatedColor = new THREE.Color().setHSL(hue % 1, 0.8, 0.5);
            colors.set(
              [calculatedColor.r, calculatedColor.g, calculatedColor.b],
              i * 3,
            );
          }

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
        // color prop이 없을 경우에만 색상 속성 설정
        if (!color && colors) {
          geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        }

        movementDirections.current = dirList;
      }
    });

    return geo;
  }, [gltf, pointCount, color]); // color를 의존성에 추가하여 변경 시 재계산

  useFrame(({ clock }, delta) => {
    if (
      !pointsRef.current ||
      !originalPositions.current ||
      !startPositions.current ||
      !movementDirections.current ||
      !boundingBoxRef.current
    )
      return;

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const time = clock.getElapsedTime();
    const boundingBox = boundingBoxRef.current;
    const size = boundingBox.getSize(new THREE.Vector3());
    const min = boundingBox.min;

    animationProgress.current = Math.min(
      animationProgress.current + delta / ANIMATION_DURATION,
      1,
    );
    const easeOut = 1 - Math.pow(1 - animationProgress.current, 3);

    // color prop이 없고 vertexColors가 true일 때만 색상 계산
    const colors = color ? null : new Float32Array(pointCount * 3);

    for (let i = 0; i < positions.length; i += 3) {
      const idx = i / 3;

      const startX = startPositions.current[i];
      const startY = startPositions.current[i + 1];
      const startZ = startPositions.current[i + 2];

      const targetX = originalPositions.current[i];
      const targetY = originalPositions.current[i + 1];
      const targetZ = originalPositions.current[i + 2];

      let x = startX + (targetX - startX) * easeOut;
      let y = startY + (targetY - startY) * easeOut;
      let z = startZ + (targetZ - startZ) * easeOut;

      if (!isAnimating && animationProgress.current < 0.95) {
        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;
      } else {
        const dir = movementDirections.current[idx];
        const frequency = 2.0;
        const amplitude = 0.05;
        const pointSpeed = 0.01;
        const offset = Math.sin(time * frequency + idx) * amplitude;

        x += dir.x * pointSpeed * offset;
        y += dir.y * pointSpeed * offset;
        z += dir.z * pointSpeed * offset;

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;
      }

      // 색상 계산 (color prop이 없고 vertexColors가 true일 때만)
      if (!color && vertexColors && colors) {
        const nx = (positions[i] - min.x) / size.x;
        const ny = (positions[i + 1] - min.y) / size.y;
        const nz = (positions[i + 2] - min.z) / size.z;
        const hue = (nx + ny + nz) / 3;
        const calculatedColor = new THREE.Color().setHSL(
          (hue * 4) % 1,
          0.8,
          0.5,
        );
        colors.set(
          [calculatedColor.r, calculatedColor.g, calculatedColor.b],
          i,
        );
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    if (!color && vertexColors && colors) {
      pointsRef.current.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3),
      );
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
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
        size={pointSize}
        sizeAttenuation
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={vertexColors && !color}
        color={color}
      />
    </points>
  );
}
