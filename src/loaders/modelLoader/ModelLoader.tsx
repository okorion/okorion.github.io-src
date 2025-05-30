import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
  opacity = 1,
}: Props) {
  const gltf = useLoader(GLTFLoader, path);
  gltf.scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      (mesh.material as THREE.MeshStandardMaterial).transparent = true;
      (mesh.material as THREE.MeshStandardMaterial).opacity = opacity;
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
