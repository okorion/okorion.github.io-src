import * as THREE from "three";

/**
 * 포인트의 위치를 기준으로 HSL 기반 색상을 생성한다.
 * - H는 x/y/z의 정규화된 좌표 평균으로 계산
 * - S = 0.8, L = 0.5로 고정
 */
export function createVertexColors(
  position: THREE.Vector3,
  min: THREE.Vector3,
  size: THREE.Vector3,
): THREE.Color {
  const nx = (position.x - min.x) / size.x;
  const ny = (position.y - min.y) / size.y;
  const nz = (position.z - min.z) / size.z;

  const hue = (nx + ny + nz) / 3;

  return new THREE.Color().setHSL(hue % 1, 0.8, 0.5);
}
