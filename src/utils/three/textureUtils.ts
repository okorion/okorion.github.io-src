import * as THREE from "three";

/**
 * Create a circular texture for particle rendering
 * @param size - Size of the texture canvas (default: 64)
 * @param margin - Margin from edges (default: 2)
 * @returns THREE.CanvasTexture
 */
export const createCircleTexture = (
  size = 64,
  margin = 2,
): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d")!;

  context.beginPath();
  context.arc(size / 2, size / 2, size / 2 - margin, 0, Math.PI * 2);
  context.fillStyle = "white";
  context.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};
