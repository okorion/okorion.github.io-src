import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { PointMaterial } from "@react-three/drei";

type Props = {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  usePoints?: boolean;
  opacity?: number;
  interpolate?: boolean;
};

export default function ModelLoader({
  path,
  position,
  rotation,
  scale = 1,
  usePoints = false,
  opacity = 1,
  interpolate = false,
}: Props) {
  const gltf = useLoader(GLTFLoader, path);

  if (usePoints) {
    let sourceGeometry: THREE.BufferGeometry | null = null;

    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !sourceGeometry) {
        sourceGeometry = (child as THREE.Mesh).geometry.clone();
      }
    });

    if (!sourceGeometry) return null;

    const finalGeometry = interpolate
      ? (() => {
          const positionAttr = (sourceGeometry as THREE.BufferGeometry)
            .attributes.position;
          const interpolatedPoints: number[] = [];
          const a = new THREE.Vector3();
          const b = new THREE.Vector3();

          for (let i = 0; i < positionAttr.count - 1; i++) {
            a.fromBufferAttribute(positionAttr, i);
            b.fromBufferAttribute(positionAttr, i + 1);

            interpolatedPoints.push(a.x, a.y, a.z);

            const mid = new THREE.Vector3()
              .addVectors(a, b)
              .multiplyScalar(0.5);
            interpolatedPoints.push(mid.x, mid.y, mid.z);
          }

          b.fromBufferAttribute(positionAttr, positionAttr.count - 1);
          interpolatedPoints.push(b.x, b.y, b.z);

          const geo = new THREE.BufferGeometry();
          geo.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(interpolatedPoints, 3)
          );
          return geo;
        })()
      : sourceGeometry;

    return (
      <points
        geometry={finalGeometry}
        position={Array.isArray(position) ? position : [0, 0, 0]}
        rotation={Array.isArray(rotation) ? rotation : [0, 0, 0]}
        scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
      >
        <PointMaterial
          transparent
          color={"black"}
          size={0.03}
          sizeAttenuation
          depthWrite={false}
          opacity={opacity}
        />
      </points>
    );
  }

  gltf.scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((mat) => {
          mat.transparent = opacity < 1;
          mat.opacity = opacity;
        });
      } else {
        mesh.material.transparent = opacity < 1;
        mesh.material.opacity = opacity;
      }
    }
  });

  return (
    <primitive
      object={gltf.scene}
      position={Array.isArray(position) ? position : [0, 0, 0]}
      rotation={Array.isArray(rotation) ? rotation : [0, 0, 0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    />
  );
}
