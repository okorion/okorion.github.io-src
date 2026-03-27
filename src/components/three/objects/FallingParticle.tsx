import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  radius?: number;
  pointCount?: number;
  pointSize?: number;
  color?: THREE.ColorRepresentation;
  fallSpeed?: number;
  startY?: number;
  endY?: number;
};

export const FallingParticle = ({
  radius = 6,
  pointCount = 30000,
  pointSize = 0.01,
  color = "#e6e6e6",
  fallSpeed = 0.0001,
  startY = 12,
  endY = -10,
}: Props) => {
  const { camera } = useThree();
  const globalAlpha = useRef(1);
  const pointsRef = useRef<THREE.Points>(null!);
  const velocities = useRef<number[]>([]);

  const geometry = useMemo(() => {
    const positionAttr = new THREE.BufferAttribute(
      new Float32Array(pointCount * 3),
      3,
    );
    const alphaAttr = new THREE.BufferAttribute(
      new Float32Array(pointCount),
      1,
    );
    const nextVelocities: number[] = [];
    const height = startY - endY;

    for (let i = 0; i < pointCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = radius * Math.sqrt(Math.random());
      const x = distance * Math.cos(angle);
      const z = distance * Math.sin(angle);
      const y = Math.random() * height + endY;

      positionAttr.setXYZ(i, x, y, z);
      alphaAttr.setX(i, 1);
      nextVelocities.push(fallSpeed + Math.random() * 0.003);
    }

    velocities.current = nextVelocities;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", positionAttr);
    geo.setAttribute("alpha", alphaAttr);
    return geo;
  }, [radius, pointCount, startY, endY, fallSpeed]);

  useFrame(() => {
    const geom = pointsRef.current.geometry;
    const positionAttr = geom.attributes.position as THREE.BufferAttribute;
    const alphaAttr = geom.attributes.alpha as THREE.BufferAttribute;
    const height = startY - endY;
    const velocityList = velocities.current;

    for (let i = 0; i < pointCount; i++) {
      const nextY = positionAttr.getY(i) - velocityList[i];

      if (nextY < endY) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = radius * Math.sqrt(Math.random());
        const x = distance * Math.cos(angle);
        const z = distance * Math.sin(angle);
        const y = Math.random() * height + endY;

        positionAttr.setXYZ(i, x, y, z);
        alphaAttr.setX(i, 1);
        continue;
      }

      positionAttr.setY(i, nextY);
      alphaAttr.setX(i, Math.max(0, (nextY - endY) / height));
    }

    positionAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;

    const targetAlpha = camera.position.y <= startY ? 1 : 0;
    globalAlpha.current += (targetAlpha - globalAlpha.current) * 0.05;

    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uGlobalAlpha.value = globalAlpha.current;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry attach="geometry" {...geometry} />
      <shaderMaterial
        attach="material"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uColor: { value: new THREE.Color(color) },
          uSize: { value: pointSize },
          uGlobalAlpha: { value: 1.0 },
        }}
        vertexShader={`
          uniform float uSize;
          attribute float alpha;
          varying float vAlpha;
          void main() {
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = uSize * (300.0 / length(mvPosition.xyz));
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uGlobalAlpha;
          varying float vAlpha;
          void main() {
            gl_FragColor = vec4(uColor, vAlpha * uGlobalAlpha);
          }
        `}
      />
    </points>
  );
};
