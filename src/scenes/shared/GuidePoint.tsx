import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  ANIMATION_CONSTANTS,
  calculateParticleOrigin,
  createCircleTexture,
  createRandomVelocity,
  EASING_CONSTANTS,
  PARTICLE_CONSTANTS,
  type ParticleData,
  RENDERING_CONSTANTS,
} from "../../utils/three";

type Props = {
  radius?: number;
  lifetime?: number;
  pointSize?: number;
  maxParticles?: number;
  color?: THREE.ColorRepresentation;
};

export const GuidePoint = ({
  lifetime = 3.0,
  pointSize = 0.09,
  maxParticles = 300,
  color = 0xffff00,
}: Props) => {
  const { camera, scene } = useThree();
  const particlesRef = useRef<THREE.Points | null>(null);
  const particlesData = useRef<ParticleData[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  // 입자 시스템 초기화
  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const colors = new Float32Array(maxParticles * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(0, 0, 0),
      RENDERING_CONSTANTS.BOUNDING_SPHERE_RADIUS,
    );

    const circleTexture = createCircleTexture();

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: circleTexture },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (${RENDERING_CONSTANTS.DISTANCE_ATTENUATION_FACTOR} / -mvPosition.z); // distance attenuation
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
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

    if (currentTime < ANIMATION_CONSTANTS.ACTIVATION_DELAY) return;

    const positions = geometryRef.current.attributes.position
      .array as Float32Array;
    const sizes = geometryRef.current.attributes.size.array as Float32Array;
    const colors = geometryRef.current.attributes.color.array as Float32Array;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.normalize();

    // Calculate stable origin position relative to camera
    const origin = calculateParticleOrigin(camera, direction);

    if (particlesData.current.length < maxParticles) {
      particlesData.current.push({
        position: origin.clone(),
        velocity: direction
          .clone()
          .add(createRandomVelocity(PARTICLE_CONSTANTS.GUIDE_VELOCITY_SPREAD)),
        startTime: currentTime,
        initialSize: pointSize,
        initialColor: new THREE.Color(color),
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

      // Update particle size with quartic falloff for dramatic effect
      const sizeRatio = 1 - elapsed / lifetime;
      const size =
        particle.initialSize * sizeRatio * sizeRatio * sizeRatio * sizeRatio;
      sizes[index] =
        size < pointSize * PARTICLE_CONSTANTS.MIN_SIZE_THRESHOLD ? 0 : size;

      // Transition to red color with strong easing
      const t = elapsed / lifetime;
      const easedT =
        1 - Math.pow(1 - t, EASING_CONSTANTS.COLOR_TRANSITION_POWER);

      const init = particle.initialColor!;
      colors[ix] = THREE.MathUtils.lerp(init.r, 1, easedT);
      colors[ix + 1] = THREE.MathUtils.lerp(init.g, 0, easedT);
      colors[ix + 2] = THREE.MathUtils.lerp(init.b, 0, easedT);

      particle.velocity.multiplyScalar(PARTICLE_CONSTANTS.VELOCITY_DAMPING);
      return true;
    });

    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.size.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true;
  });

  return null;
};
