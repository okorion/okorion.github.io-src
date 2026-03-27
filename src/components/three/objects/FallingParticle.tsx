import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  radius?: number;
  pointCount?: number;
  pointSize?: number;
  color?: THREE.ColorRepresentation;
  opacity?: number;
  fallSpeed?: number;
  startY?: number;
  endY?: number;
};

export const FallingParticle = ({
  radius = 6,
  pointCount = 30000,
  pointSize = 0.01,
  color = "#e6e6e6",
  opacity = 0.12,
  fallSpeed = 0.0001,
  startY = 12,
  endY = -10,
}: Props) => {
  const { camera } = useThree();
  const globalAlpha = useRef(1);
  const pointsRef = useRef<THREE.Points>(null!);
  const velocities = useRef<Float32Array>(new Float32Array(pointCount));

  const geometry = useMemo(() => {
    const positions = new Float32Array(pointCount * 3);
    const alphas = new Float32Array(pointCount);
    const height = startY - endY;

    for (let i = 0; i < pointCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = radius * Math.sqrt(Math.random());
      const x = r * Math.cos(angle);
      const z = r * Math.sin(angle);
      const y = Math.random() * height + endY;

      positions.set([x, y, z], i * 3);
      alphas[i] = 1.0;
      velocities.current[i] = fallSpeed + Math.random() * 0.003;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    return geo;
  }, [radius, pointCount, startY, endY, fallSpeed]);

  useFrame(() => {
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const alphaAttr = geom.attributes.alpha as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const alphas = alphaAttr.array as Float32Array;
    const height = startY - endY;

    for (let i = 0; i < pointCount; i++) {
      const i3 = i * 3;
      const yIndex = i3 + 1;
      positions[yIndex] -= velocities.current[i];

      if (positions[yIndex] < endY) {
        const angle = Math.random() * 2 * Math.PI;
        const r = radius * Math.sqrt(Math.random());
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        const y = Math.random() * height + endY;

        positions.set([x, y, z], i3);
        alphas[i] = 1.0;
      } else {
        alphas[i] = Math.max(0, (positions[yIndex] - endY) / height);
      }
    }

    posAttr.needsUpdate = true;
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
          uOpacity: { value: opacity },
          uGlobalAlpha: { value: 1.0 },
        }}
        vertexShader={`
          uniform float uSize;
          attribute float alpha;
          varying float vAlpha;

          void main() {
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            float safeDistance = max(length(mvPosition.xyz), 0.75);
            gl_PointSize = clamp(uSize * (300.0 / safeDistance), 0.0, 12.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uGlobalAlpha;
          varying float vAlpha;

          void main() {
            vec2 centeredCoord = gl_PointCoord - vec2(0.5);
            float distanceFromCenter = length(centeredCoord);

            if (distanceFromCenter > 0.5) {
              discard;
            }

            float edgeFade = 1.0 - smoothstep(0.18, 0.5, distanceFromCenter);
            float finalAlpha = vAlpha * uGlobalAlpha * uOpacity * edgeFade;

            if (finalAlpha <= 0.0) {
              discard;
            }

            gl_FragColor = vec4(uColor, finalAlpha);
          }
        `}
      />
    </points>
  );
};
