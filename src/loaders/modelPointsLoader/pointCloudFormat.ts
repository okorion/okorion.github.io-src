import {
  BufferAttribute,
  BufferGeometry,
  Int16BufferAttribute,
  Uint8BufferAttribute,
} from "three";

const HEADER_BYTES = 20;
const EXPECTED_MAGIC = "OPT1";
const SUPPORTED_VERSION = 1;
const COLOR_FLAG = 1;
const SUPPORTED_FLAGS = COLOR_FLAG;

export interface PointCloudAsset {
  geometry: BufferGeometry;
  pointCount: number;
  scatterDistance: number;
  usesVertexColors: boolean;
}

interface PointCloudHeader {
  colorsOffset: number;
  directionsOffset: number;
  expectedBytes: number;
  pointCount: number;
  positionsOffset: number;
  scatterDistance: number;
  usesVertexColors: boolean;
}

const readMagic = (buffer: ArrayBuffer) =>
  new TextDecoder().decode(new Uint8Array(buffer, 0, 4));

function readPointCloudHeader(buffer: ArrayBuffer): PointCloudHeader {
  if (
    buffer.byteLength < HEADER_BYTES ||
    readMagic(buffer) !== EXPECTED_MAGIC
  ) {
    throw new Error("Invalid point cloud asset");
  }

  const view = new DataView(buffer, 0, HEADER_BYTES);
  const version = view.getUint32(4, true);
  const pointCount = view.getUint32(8, true);
  const flags = view.getUint32(12, true);
  const scatterDistance = view.getFloat32(16, true);

  if (
    version !== SUPPORTED_VERSION ||
    (flags & ~SUPPORTED_FLAGS) !== 0 ||
    pointCount === 0 ||
    !Number.isFinite(scatterDistance) ||
    scatterDistance <= 0
  ) {
    throw new Error("Unsupported point cloud asset header");
  }

  const positionsOffset = HEADER_BYTES;
  const directionsOffset = positionsOffset + pointCount * 3 * 4;
  const colorsOffset = directionsOffset + pointCount * 3 * 2;
  const usesVertexColors = (flags & COLOR_FLAG) !== 0;

  return {
    colorsOffset,
    directionsOffset,
    expectedBytes: colorsOffset + (usesVertexColors ? pointCount * 3 : 0),
    pointCount,
    positionsOffset,
    scatterDistance,
    usesVertexColors,
  };
}

function createPointCloudGeometry(
  buffer: ArrayBuffer,
  header: PointCloudHeader,
) {
  const { colorsOffset, directionsOffset, pointCount, positionsOffset } =
    header;
  const positions = new Float32Array(buffer, positionsOffset, pointCount * 3);
  const directions = new Int16Array(buffer, directionsOffset, pointCount * 3);
  const colors = header.usesVertexColors
    ? new Uint8Array(buffer, colorsOffset, pointCount * 3)
    : new Uint8Array(pointCount * 3).fill(255);
  const geometry = new BufferGeometry();

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute(
    "direction",
    new Int16BufferAttribute(directions, 3, true),
  );
  geometry.setAttribute("color", new Uint8BufferAttribute(colors, 3, true));
  geometry.computeBoundingSphere();
  return geometry;
}

export function parsePointCloud(buffer: ArrayBuffer): PointCloudAsset {
  const header = readPointCloudHeader(buffer);

  if (buffer.byteLength !== header.expectedBytes) {
    throw new Error("Unsupported point cloud asset layout");
  }

  return {
    geometry: createPointCloudGeometry(buffer, header),
    pointCount: header.pointCount,
    scatterDistance: header.scatterDistance,
    usesVertexColors: header.usesVertexColors,
  };
}
