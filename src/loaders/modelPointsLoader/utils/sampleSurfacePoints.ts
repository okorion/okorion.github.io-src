import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { createVertexColors } from "./createVertexColors";

export function sampleSurfacePoints({
  sampler,
  pointCount,
  modelSize,
  boundingBox,
  color,
}: {
  sampler: MeshSurfaceSampler;
  pointCount: number;
  modelSize: number;
  boundingBox: THREE.Box3;
  color?: THREE.ColorRepresentation;
}) {
  const originalPositions = new Float32Array(pointCount * 3);
  const startPositions = new Float32Array(pointCount * 3);
  const directions: THREE.Vector3[] = [];
  const colors = color ? null : new Float32Array(pointCount * 3);

  const size = boundingBox.getSize(new THREE.Vector3());
  const min = boundingBox.min;
  const temp = new THREE.Vector3();

  for (let i = 0; i < pointCount; i++) {
    sampler.sample(temp);
    originalPositions.set([temp.x, temp.y, temp.z], i * 3);

    const dir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5,
    ).normalize();

    const start = temp.clone().add(dir.multiplyScalar(modelSize * 2));
    startPositions.set([start.x, start.y, start.z], i * 3);
    directions.push(dir);

    if (!color && colors) {
      const col = createVertexColors(temp, min, size);
      colors.set([col.r, col.g, col.b], i * 3);
    }
  }

  return {
    originalPositions,
    startPositions,
    movementDirections: directions,
    vertexColorsArray: colors,
  };
}
