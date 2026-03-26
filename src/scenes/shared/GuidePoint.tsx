import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  radius?: number;
  lifetime?: number;
  pointSize?: number;
  maxParticles?: number;
  color?: THREE.ColorRepresentation;
};

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  startTime: number;
  initialSize: number;
  initialColor: THREE.Color;
}

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
  lifetime = 3.0,
  pointSize = 0.09,
  maxParticles = 300,
  color = 0xffff00,
}: Props) => {
  const { camera, scene } = useThree();
  const particlesRef = useRef<THREE.Points | null>(null);
  const particlesData = useRef<ParticleData[]>([]);
  const recycledParticles = useRef<ParticleData[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const directionRef = useRef(new THREE.Vector3());
  const originRef = useRef(new THREE.Vector3());
  const jitterRef = useRef(new THREE.Vector3());

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);
    const colors = new Float32Array(maxParticles * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 25);

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
          gl_PointSize = size * (300.0 / -mvPosition.z);
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
  }, [scene, maxParticles]);

  useFrame(({ clock }, delta) => {
    const currentTime = clock.getElapsedTime();
    if (!particlesRef.current || !geometryRef.current) return;

    if (currentTime < 2.0) return;

    const positionAttr = geometryRef.current.attributes
      .position as THREE.BufferAttribute;
    const sizeAttr = geometryRef.current.attributes
      .size as THREE.BufferAttribute;
    const colorAttr = geometryRef.current.attributes
      .color as THREE.BufferAttribute;
    const particles = particlesData.current;
    const nextParticles = recycledParticles.current;
    const previousCount = particles.length;
    nextParticles.length = 0;

    const direction = directionRef.current;
    camera.getWorldDirection(direction);
    direction.normalize();

    const origin = originRef.current
      .copy(camera.position)
      .addScaledVector(direction, 2);

    if (particles.length < maxParticles) {
      const velocity = new THREE.Vector3()
        .copy(direction)
        .add(
          jitterRef.current.set(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
          ),
        );

      particles.push({
        position: new THREE.Vector3().copy(origin),
        velocity,
        startTime: currentTime,
        initialSize: pointSize,
        initialColor: new THREE.Color(color),
      });
    }

    let activeCount = 0;

    for (const particle of particles) {
      const elapsed = currentTime - particle.startTime;
      if (elapsed > lifetime) {
        continue;
      }

      particle.position.addScaledVector(particle.velocity, delta);
      positionAttr.setXYZ(activeCount, 0, particle.position.y, 0);

      const sizeRatio = 1 - elapsed / lifetime;
      const size =
        particle.initialSize * sizeRatio * sizeRatio * sizeRatio * sizeRatio;
      sizeAttr.setX(activeCount, size < pointSize * 0.05 ? 0 : size);

      const easedT = 1 - Math.pow(1 - elapsed / lifetime, 16);
      colorAttr.setXYZ(
        activeCount,
        THREE.MathUtils.lerp(particle.initialColor.r, 1, easedT),
        THREE.MathUtils.lerp(particle.initialColor.g, 0, easedT),
        THREE.MathUtils.lerp(particle.initialColor.b, 0, easedT),
      );

      particle.velocity.multiplyScalar(0.98);
      nextParticles.push(particle);
      activeCount += 1;
    }

    for (let i = activeCount; i < previousCount; i++) {
      sizeAttr.setX(i, 0);
      colorAttr.setXYZ(i, 0, 0, 0);
    }

    particlesData.current = nextParticles;
    recycledParticles.current = particles;
    positionAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  return null;
};
