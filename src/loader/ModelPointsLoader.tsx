import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

type Props = {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  opacity?: number;
  pointCount?: number;
};

export default function ModelPointsLoader({
  path,
  position,
  rotation,
  scale = 1,
  opacity = 1,
  pointCount = 250000,
}: Props) {
  const gltf = useLoader(GLTFLoader, path);

  const sampledGeometry = (() => {
    let sampledGeo: THREE.BufferGeometry | null = null;

    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !sampledGeo) {
        const mesh = child as THREE.Mesh;
        mesh.geometry.computeVertexNormals();

        const sampler = new MeshSurfaceSampler(mesh).build();
        const positions = new Float32Array(pointCount * 3);
        const temp = new THREE.Vector3();

        for (let i = 0; i < pointCount; i++) {
          sampler.sample(temp);
          positions.set([temp.x, temp.y, temp.z], i * 3);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        sampledGeo = geo;
      }
    });

    return sampledGeo;
  })();

  if (!sampledGeometry) return null;

  return (
    <points
      geometry={sampledGeometry}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    >
      <pointsMaterial
        attach="material"
        color={"white"}
        size={0.02}
        sizeAttenuation
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
