import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { usePointCloudAsset } from "./usePointCloudAsset";

const vertexShader = `
  attribute vec3 direction;
  uniform float uPointSize;
  uniform float uPointScale;
  uniform float uProgress;
  uniform float uScatterDistance;
  uniform float uTime;
  varying vec3 vColor;

  void main() {
    float easedProgress = 1.0 - pow(1.0 - uProgress, 3.0);
    vec3 startPosition = position + direction * uScatterDistance;
    vec3 animatedPosition = mix(startPosition, position, easedProgress);
    float phase = dot(position, vec3(12.9898, 78.233, 37.719));
    animatedPosition += direction * uScatterDistance * sin(uTime * 2.0 + phase) * 0.0005;

    vec4 modelViewPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    gl_PointSize = uPointSize * uPointScale / max(0.001, -modelViewPosition.z);
    gl_Position = projectionMatrix * modelViewPosition;
    vColor = color;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform float uUseVertexColor;
  varying vec3 vColor;

  void main() {
    vec2 centeredPoint = gl_PointCoord - vec2(0.5);
    if (dot(centeredPoint, centeredPoint) > 0.25) discard;
    vec3 resolvedColor = mix(uColor, vColor, uUseVertexColor);
    gl_FragColor = vec4(resolvedColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

interface AnimatedPointCloudProps {
  path: string;
  pointSize: number;
  pointLimit?: number;
  color?: THREE.ColorRepresentation;
  animationDuration?: number;
}

interface PointCloudMaterialProps {
  animationDuration: number;
  color: THREE.ColorRepresentation;
  pointSize: number;
  scatterDistance: number;
  usesVertexColors: boolean;
}

function createPointUniforms(props: PointCloudMaterialProps) {
  return {
    uColor: { value: new THREE.Color(props.color) },
    uPointScale: { value: 1 },
    uPointSize: { value: props.pointSize },
    uProgress: { value: 0 },
    uScatterDistance: { value: props.scatterDistance },
    uTime: { value: 0 },
    uUseVertexColor: { value: props.usesVertexColors ? 1 : 0 },
  };
}

function PointCloudMaterial(props: PointCloudMaterialProps) {
  const { gl, size } = useThree();
  const animationProgress = useRef(0);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => createPointUniforms(props),
    [
      props.color,
      props.pointSize,
      props.scatterDistance,
      props.usesVertexColors,
    ],
  );

  useFrame(({ clock }, delta) => {
    const material = materialRef.current;
    if (!material) return;
    animationProgress.current = Math.min(
      animationProgress.current + delta / props.animationDuration,
      1,
    );
    material.uniforms.uProgress.value = animationProgress.current;
    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uPointScale.value =
      (size.height * gl.getPixelRatio()) / 2;
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      transparent={false}
      depthWrite={false}
      blending={THREE.AdditiveBlending}
      vertexColors
    />
  );
}

export function AnimatedPointCloud({
  path,
  pointSize,
  pointLimit,
  color = "white",
  animationDuration = 0.5,
}: AnimatedPointCloudProps) {
  const asset = usePointCloudAsset(path);

  useEffect(() => {
    asset.geometry.setDrawRange(
      0,
      Math.min(pointLimit ?? asset.pointCount, asset.pointCount),
    );
  }, [asset, pointLimit]);

  return (
    <points geometry={asset.geometry}>
      <PointCloudMaterial
        animationDuration={animationDuration}
        color={color}
        pointSize={pointSize}
        scatterDistance={asset.scatterDistance}
        usesVertexColors={asset.usesVertexColors}
      />
    </points>
  );
}
