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
  const particlesData = useRef<ParticleData[]>([]);
  const recycledParticles = useRef<ParticleData[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const directionRef = useRef(new THREE.Vector3());
  const originRef = useRef(new THREE.Vector3());
  const jitterRef = useRef(new THREE.Vector3());

  useEffect(() => {
    const { points, geometry, material, circleTexture } = initParticles(
      scene,
      maxParticles,
      pointSize,
      color,
    );
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
    if (!geometryRef.current) return;
    if (currentTime < 2.0) return;

    const positionAttr = geometryRef.current.attributes
      .position as THREE.BufferAttribute;
    const sizeAttr = geometryRef.current.attributes
      .size as THREE.BufferAttribute;
    const particles = particlesData.current;
    const nextParticles = recycledParticles.current;
    const previousCount = particles.length;
    nextParticles.length = 0;

    raycaster.current.setFromCamera(mouse.current, camera);
    const direction = directionRef.current.copy(
      raycaster.current.ray.direction,
    );
    direction.normalize();
    const origin = originRef.current
      .copy(camera.position)
      .addScaledVector(direction, 2);

    if (particles.length < maxParticles) {
      const velocity = new THREE.Vector3()
        .copy(direction)
        .multiplyScalar(speed)
        .add(
          jitterRef.current.set(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
          ),
        );

      particles.push({
        position: new THREE.Vector3().copy(origin),
        velocity,
        startTime: currentTime,
        initialSize: pointSize,
      });
    }

    let activeCount = 0;

    for (const particle of particles) {
      const elapsed = currentTime - particle.startTime;
      if (elapsed > lifetime) {
        continue;
      }

      particle.position.addScaledVector(particle.velocity, delta);
      positionAttr.setXYZ(
        activeCount,
        particle.position.x,
        particle.position.y,
        particle.position.z,
      );

      const sizeRatio = 1 - elapsed / lifetime;
      const size = particle.initialSize * sizeRatio * sizeRatio;
      sizeAttr.setX(activeCount, size < pointSize * 0.05 ? 0 : size);

      particle.velocity.multiplyScalar(0.98);
      nextParticles.push(particle);
      activeCount += 1;
    }

    for (let i = activeCount; i < previousCount; i++) {
      sizeAttr.setX(i, 0);
    }

    particlesData.current = nextParticles;
    recycledParticles.current = particles;
    positionAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
  });

  return null;
};
