import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  radius?: number;
  speed?: number;
  lifetime?: number;
  pointSize?: number;
  maxParticles?: number;
  color?: THREE.ColorRepresentation;
};

// 원형 텍스처 생성 함수
const createCircleTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d")!;

  context.beginPath();
  context.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  context.fillStyle = "white";
  context.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

export const GuidePoint = ({
  speed = 0.5,
  lifetime = 1.0,
  pointSize = 0.05,
  maxParticles = 1500,
  color = 0xffff00,
}: Props) => {
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const particlesRef = useRef<THREE.Points | null>(null);
  const particlesData = useRef<
    Array<{
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      startTime: number;
      initialSize: number;
    }>
  >([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  // 입자 시스템 초기화
  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const circleTexture = createCircleTexture();
    const material = new THREE.PointsMaterial({
      size: pointSize,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(color),
      map: circleTexture,
      vertexColors: false,
    });

    const points = new THREE.Points(geometry, material);
    particlesRef.current = points;
    geometryRef.current = geometry;
    scene.add(points);

    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      circleTexture.dispose();
    };
  }, [scene, pointSize, maxParticles, color]);

  useFrame(({ clock }, delta) => {
    const currentTime = clock.getElapsedTime();
    if (!particlesRef.current || !geometryRef.current) return;

    const activationDelay = 2.0;
    if (currentTime < activationDelay) return;

    const positions = geometryRef.current.attributes.position
      .array as Float32Array;
    const sizes = geometryRef.current.attributes.size.array as Float32Array;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.normalize();

    // 안정적 origin
    const origin = camera.position
      .clone()
      .add(direction.clone().multiplyScalar(2));

    raycaster.current.set(origin, direction);

    if (particlesData.current.length < maxParticles) {
      particlesData.current.push({
        position: origin.clone(),
        velocity: direction
          .clone()
          .multiplyScalar(speed)
          .add(
            new THREE.Vector3(
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1,
            ),
          ),
        startTime: currentTime,
        initialSize: pointSize,
      });
    }

    particlesData.current = particlesData.current.filter((particle, index) => {
      const elapsed = currentTime - particle.startTime;
      if (elapsed > lifetime) return false;

      particle.position.addScaledVector(particle.velocity, delta);
      const ix = index * 3;
      positions[ix] = 0;
      positions[ix + 1] = particle.position.y;
      positions[ix + 2] = 0;

      const sizeRatio = 1 - elapsed / lifetime;
      const size = particle.initialSize * sizeRatio * sizeRatio;
      sizes[index] = size < pointSize * 0.05 ? 0 : size;

      particle.velocity.multiplyScalar(0.98);
      return true;
    });

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.size.needsUpdate = true;
  });

  return null;
};
