import { useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { sampleSurfacePoints } from "./utils/sampleSurfacePoints";

export function useGLTFPoints(
  path: string,
  pointCount: number,
  color?: THREE.ColorRepresentation,
) {
  const gltf = useLoader(GLTFLoader, path);
  const originalPositions = useRef<Float32Array | null>(null);
  const startPositions = useRef<Float32Array | null>(null);
  const movementDirections = useRef<THREE.Vector3[] | null>(null);
  const boundingBoxRef = useRef<THREE.Box3 | null>(null);

  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null;

    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !geo) {
        const mesh = child as THREE.Mesh;
        const sampler = new MeshSurfaceSampler(mesh).build();
        const boundingBox = new THREE.Box3().setFromObject(mesh);
        boundingBoxRef.current = boundingBox;

        const modelSize = boundingBox.getSize(new THREE.Vector3()).length();

        const {
          originalPositions: oPos,
          startPositions: sPos,
          movementDirections: dirs,
          vertexColorsArray: colors,
        } = sampleSurfacePoints({
          sampler,
          pointCount,
          modelSize,
          boundingBox,
          color,
        });

        originalPositions.current = oPos;
        startPositions.current = sPos;
        movementDirections.current = dirs;

        geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
        if (!color && colors) {
          geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        }
      }
    });

    return geo;
  }, [gltf, pointCount, color]);

  return {
    geometry,
    originalPositions,
    startPositions,
    movementDirections,
    boundingBoxRef,
  };
}
