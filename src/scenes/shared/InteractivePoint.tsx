import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMousePosition } from "../../utils/hooks/particleHooks";
import {
  ANIMATION_CONSTANTS,
  calculateParticleOrigin,
  createCircleTexture,
  createRandomVelocity,
  PARTICLE_CONSTANTS,
  type ParticleData,
  RENDERING_CONSTANTS,
  updateParticles,
} from "../../utils/three";

type Props = {
  radius?: number;
  speed?: number;
  lifetime?: number;
  pointSize?: number;
  maxParticles?: number;
  color?: THREE.ColorRepresentation;
};

/**
 * Initialize particle system with geometry, material and texture
 * @param scene - THREE.Scene to add particles to
 * @param maxParticles - Maximum number of particles
 * @param pointSize - Base size of particles
 * @param color - Particle color
 * @returns Object containing points, geometry, material and texture
 */
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
  geometry.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(0, 0, 0),
    RENDERING_CONSTANTS.BOUNDING_SPHERE_RADIUS,
  );

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
  const particlesData = useRef<ParticleData[]>([]);
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

    // Wait for camera initial animation to complete
    if (currentTime < ANIMATION_CONSTANTS.ACTIVATION_DELAY) return;

    const positions = geometryRef.current.attributes.position
      .array as Float32Array;
    const sizes = geometryRef.current.attributes.size.array as Float32Array;

    raycaster.current.setFromCamera(mouse.current, camera);
    const direction = raycaster.current.ray.direction.clone().normalize();
    const origin = calculateParticleOrigin(camera, direction);

    if (particlesData.current.length < maxParticles) {
      particlesData.current.push({
        position: origin.clone(),
        velocity: direction
          .clone()
          .multiplyScalar(speed)
          .add(createRandomVelocity(PARTICLE_CONSTANTS.VELOCITY_SPREAD)),
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
