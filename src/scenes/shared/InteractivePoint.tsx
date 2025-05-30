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

type ParticleData = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  startTime: number;
  initialSize: number;
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

const initParticles = (
  scene: THREE.Scene,
  maxParticles: number,
  pointSize: number,
  color: THREE.ColorRepresentation,
) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(maxParticles * 3);
  const sizes = new Float32Array(maxParticles);
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 25);

  const circleTexture = createCircleTexture();
  const material = new THREE.PointsMaterial({
    size: pointSize,
    sizeAttenuation: true,
    transparent: false,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    color: new THREE.Color(color),
    map: circleTexture,
    vertexColors: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  return { points, geometry, material, circleTexture };
};

const updateParticles = (
  particlesData: ParticleData[],
  positions: Float32Array,
  sizes: Float32Array,
  pointSize: number,
  lifetime: number,
  delta: number,
  currentTime: number,
) => {
  return particlesData.filter((particle, index) => {
    const elapsed = currentTime - particle.startTime;
    if (elapsed > lifetime) return false;

    particle.position.addScaledVector(particle.velocity, delta);
    const ix = index * 3;
    positions[ix] = particle.position.x;
    positions[ix + 1] = particle.position.y;
    positions[ix + 2] = particle.position.z;

    const sizeRatio = 1 - elapsed / lifetime;
    const size = particle.initialSize * sizeRatio * sizeRatio;
    sizes[index] = size < pointSize * 0.05 ? 0 : size;

    particle.velocity.multiplyScalar(0.98);
    return true;
  });
};

const useMousePosition = (glDomElement: HTMLElement) => {
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = glDomElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    glDomElement.addEventListener("mousemove", handleMouseMove);
    return () => glDomElement.removeEventListener("mousemove", handleMouseMove);
  }, [glDomElement]);

  return mouse;
};

export const InteractivePoint = ({
  speed = 0.5,
  lifetime = 1.0,
  pointSize = 0.02,
  maxParticles = 5000,
  color = 0xffff00,
}: Props) => {
  const { camera, gl, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useMousePosition(gl.domElement);
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
    const { points, geometry, material, circleTexture } = initParticles(
      scene,
      maxParticles,
      pointSize,
      color,
    );
    particlesRef.current = points;
    geometryRef.current = geometry;

    return () => {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      circleTexture.dispose();
    };
  }, [scene, maxParticles, pointSize, color]);

  useFrame(({ clock }, delta) => {
    const currentTime = clock.getElapsedTime();
    if (!particlesRef.current || !geometryRef.current) return;

    // 카메라 초기 애니메이션 시간 이후에만 입자 작동
    const activationDelay = 2.0;
    if (currentTime < activationDelay) return;

    const positions = geometryRef.current.attributes.position
      .array as Float32Array;
    const sizes = geometryRef.current.attributes.size.array as Float32Array;

    raycaster.current.setFromCamera(mouse.current, camera);
    const direction = raycaster.current.ray.direction.clone().normalize();
    const origin = camera.position
      .clone()
      .add(direction.clone().multiplyScalar(2));

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

    particlesData.current = updateParticles(
      particlesData.current,
      positions,
      sizes,
      pointSize,
      lifetime,
      delta,
      currentTime,
    );

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.size.needsUpdate = true;
  });

  return null;
};
