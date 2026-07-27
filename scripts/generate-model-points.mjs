/* eslint-disable security/detect-object-injection, security/detect-non-literal-fs-filename */
// Build-only converter: indices are bounds-checked and file paths come from the fixed jobs below.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Color } from "three";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const GLB_JSON_CHUNK = 0x4e4f534a;
const GLB_BINARY_CHUNK = 0x004e4942;
const GLB_VERSION = 2;
const GLB_HEADER_BYTES = 12;
const GLB_CHUNK_HEADER_BYTES = 8;
const POINT_FILE_HEADER_BYTES = 20;
const POINT_FILE_VERSION = 1;
const POINT_FILE_COLOR_FLAG = 1;

const componentReaders = {
  5120: { bytes: 1, read: (view, offset) => view.getInt8(offset) },
  5121: { bytes: 1, read: (view, offset) => view.getUint8(offset) },
  5122: {
    bytes: 2,
    read: (view, offset) => view.getInt16(offset, true),
  },
  5123: {
    bytes: 2,
    read: (view, offset) => view.getUint16(offset, true),
  },
  5125: {
    bytes: 4,
    read: (view, offset) => view.getUint32(offset, true),
  },
  5126: {
    bytes: 4,
    read: (view, offset) => view.getFloat32(offset, true),
  },
};

const componentCounts = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};

const jobs = [
  {
    source: "assets/model-sources/ArcaneWillow.glb",
    output: "public/models/ArcaneWillow.points",
    pointCount: 60_000,
    seed: 0x7a11_0a1,
    vertexColors: true,
  },
  {
    source: "assets/model-sources/ChromeFigure.glb",
    output: "public/models/ChromeFigure.points",
    pointCount: 5_000,
    seed: 0xc4f1_6a7,
    vertexColors: false,
  },
];

function validateGlbHeader(fileBuffer) {
  if (
    fileBuffer.length < GLB_HEADER_BYTES ||
    fileBuffer.toString("ascii", 0, 4) !== "glTF" ||
    fileBuffer.readUInt32LE(4) !== GLB_VERSION ||
    fileBuffer.readUInt32LE(8) !== fileBuffer.length
  ) {
    throw new Error("Invalid GLB header");
  }
}

function readGlbChunk(fileBuffer, offset) {
  if (offset + GLB_CHUNK_HEADER_BYTES > fileBuffer.length) {
    throw new Error("Invalid GLB chunk header");
  }

  const chunkLength = fileBuffer.readUInt32LE(offset);
  const type = fileBuffer.readUInt32LE(offset + 4);
  const end = offset + GLB_CHUNK_HEADER_BYTES + chunkLength;
  if (end > fileBuffer.length) {
    throw new Error("Invalid GLB chunk length");
  }

  return {
    data: fileBuffer.subarray(offset + GLB_CHUNK_HEADER_BYTES, end),
    end,
    type,
  };
}

function parseGlb(fileBuffer) {
  validateGlbHeader(fileBuffer);

  let json;
  let binary;
  let offset = GLB_HEADER_BYTES;

  while (offset < fileBuffer.length) {
    const chunk = readGlbChunk(fileBuffer, offset);

    if (chunk.type === GLB_JSON_CHUNK) {
      json = JSON.parse(
        chunk.data.toString("utf8").replace(/\0+$/u, "").trim(),
      );
    } else if (chunk.type === GLB_BINARY_CHUNK) {
      binary = chunk.data;
    }

    offset = chunk.end;
  }

  if (!json || !binary) {
    throw new Error("GLB must include JSON and binary chunks");
  }

  return { json, binary };
}

function readAccessorLayout(json, accessorIndex) {
  const accessor = json.accessors?.[accessorIndex];
  if (!accessor || accessor.sparse) {
    throw new Error(`Unsupported accessor: ${accessorIndex}`);
  }

  const bufferView = json.bufferViews?.[accessor.bufferView];
  const component = componentReaders[accessor.componentType];
  const componentCount = componentCounts[accessor.type];

  if (!bufferView || !component || !componentCount) {
    throw new Error(`Unsupported accessor layout: ${accessorIndex}`);
  }

  return { accessor, bufferView, component, componentCount };
}

function validateAccessorBounds({
  accessor,
  accessorIndex,
  baseOffset,
  binaryLength,
  bufferView,
  elementBytes,
  stride,
}) {
  const bufferViewOffset = bufferView.byteOffset ?? 0;
  const lastElementEnd =
    baseOffset + Math.max(0, accessor.count - 1) * stride + elementBytes;
  const bufferViewEnd = bufferViewOffset + (bufferView.byteLength ?? 0);

  if (
    accessor.count <= 0 ||
    stride < elementBytes ||
    baseOffset < bufferViewOffset ||
    lastElementEnd > bufferViewEnd ||
    bufferViewEnd > binaryLength
  ) {
    throw new Error(`Invalid accessor bounds: ${accessorIndex}`);
  }
}

function createAccessorReader(json, binary, accessorIndex) {
  const { accessor, bufferView, component, componentCount } =
    readAccessorLayout(json, accessorIndex);

  const baseOffset = (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const stride = bufferView.byteStride ?? component.bytes * componentCount;
  const elementBytes = component.bytes * componentCount;
  validateAccessorBounds({
    accessor,
    accessorIndex,
    baseOffset,
    binaryLength: binary.byteLength,
    bufferView,
    elementBytes,
    stride,
  });

  const dataView = new DataView(
    binary.buffer,
    binary.byteOffset,
    binary.byteLength,
  );

  return {
    count: accessor.count,
    componentCount,
    read(index, componentIndex = 0) {
      return component.read(
        dataView,
        baseOffset + index * stride + componentIndex * component.bytes,
      );
    },
  };
}

function isTrianglePrimitive(candidate) {
  const mode = candidate.mode ?? 4;
  return mode === 4 && candidate.attributes?.POSITION !== undefined;
}

function findNodeTrianglePrimitive(json, node) {
  if (node?.mesh === undefined) return undefined;
  return json.meshes?.[node.mesh]?.primitives?.find(isTrianglePrimitive);
}

function findFirstTrianglePrimitive(json) {
  const sceneIndex = json.scene ?? 0;
  const scene = json.scenes?.[sceneIndex];
  const pendingNodeIndices = [...(scene?.nodes ?? [])];
  const visitedNodeIndices = new Set();

  while (pendingNodeIndices.length > 0) {
    const nodeIndex = pendingNodeIndices.shift();
    if (nodeIndex === undefined || visitedNodeIndices.has(nodeIndex)) continue;
    visitedNodeIndices.add(nodeIndex);

    const node = json.nodes?.[nodeIndex];
    const primitive = findNodeTrianglePrimitive(json, node);
    if (primitive) return primitive;

    pendingNodeIndices.unshift(...(node?.children ?? []));
  }

  throw new Error("No triangle primitive found in default scene");
}

function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b_79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function readPrimitiveData(json, binary, primitive) {
  const positionAccessor = createAccessorReader(
    json,
    binary,
    primitive.attributes.POSITION,
  );
  const indexAccessor =
    primitive.indices === undefined
      ? null
      : createAccessorReader(json, binary, primitive.indices);
  const positions = new Float32Array(positionAccessor.count * 3);

  for (let index = 0; index < positionAccessor.count; index += 1) {
    positions[index * 3] = positionAccessor.read(index, 0);
    positions[index * 3 + 1] = positionAccessor.read(index, 1);
    positions[index * 3 + 2] = positionAccessor.read(index, 2);
  }

  const indexCount = indexAccessor?.count ?? positionAccessor.count;
  const indices = new Uint32Array(indexCount);
  for (let index = 0; index < indexCount; index += 1) {
    indices[index] = indexAccessor?.read(index) ?? index;
  }

  return { positions, indices };
}

function calculateBounds(positions) {
  const min = [
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
  ];
  const max = [
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ];

  for (let index = 0; index < positions.length; index += 3) {
    for (let axis = 0; axis < 3; axis += 1) {
      const value = positions[index + axis];
      min[axis] = Math.min(min[axis], value);
      max[axis] = Math.max(max[axis], value);
    }
  }

  const size = max.map((value, axis) => value - min[axis]);
  const modelSize = Math.hypot(size[0], size[1], size[2]);
  return { min, size, modelSize };
}

function triangleArea(positions, a, b, c) {
  const abx = positions[b] - positions[a];
  const aby = positions[b + 1] - positions[a + 1];
  const abz = positions[b + 2] - positions[a + 2];
  const acx = positions[c] - positions[a];
  const acy = positions[c + 1] - positions[a + 1];
  const acz = positions[c + 2] - positions[a + 2];
  const crossX = aby * acz - abz * acy;
  const crossY = abz * acx - abx * acz;
  const crossZ = abx * acy - aby * acx;
  return Math.hypot(crossX, crossY, crossZ) * 0.5;
}

function buildAreaDistribution(positions, indices) {
  const triangleCount = Math.floor(indices.length / 3);
  const cumulativeAreas = new Float64Array(triangleCount);
  let totalArea = 0;

  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const a = indices[triangle * 3] * 3;
    const b = indices[triangle * 3 + 1] * 3;
    const c = indices[triangle * 3 + 2] * 3;
    totalArea += triangleArea(positions, a, b, c);
    cumulativeAreas[triangle] = totalArea;
  }

  if (totalArea <= 0) throw new Error("Primitive has no sampleable area");
  return { cumulativeAreas, totalArea };
}

function findTriangle(cumulativeAreas, targetArea) {
  let low = 0;
  let high = cumulativeAreas.length - 1;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (targetArea <= cumulativeAreas[middle]) high = middle;
    else low = middle + 1;
  }

  return low;
}

function writePointColor(colors, offset, point, bounds, color) {
  const normalized = point.map((value, axis) => {
    const safeSize = Math.max(bounds.size[axis], Number.EPSILON);
    return (value - bounds.min[axis]) / safeSize;
  });
  const hue = (normalized[0] + normalized[1] + normalized[2]) / 3;
  color.setHSL((hue * 4) % 1, 0.8, 0.5);
  colors[offset] = Math.round(color.r * 255);
  colors[offset + 1] = Math.round(color.g * 255);
  colors[offset + 2] = Math.round(color.b * 255);
}

function sampleTrianglePoint(positions, indices, triangle, random, target) {
  const a = indices[triangle * 3] * 3;
  const b = indices[triangle * 3 + 1] * 3;
  const c = indices[triangle * 3 + 2] * 3;
  const sqrtU = Math.sqrt(random());
  const weightA = 1 - sqrtU;
  const weightB = sqrtU * (1 - random());
  const weightC = 1 - weightA - weightB;

  for (let axis = 0; axis < 3; axis += 1) {
    target[axis] =
      positions[a + axis] * weightA +
      positions[b + axis] * weightB +
      positions[c + axis] * weightC;
  }
}

function writeRandomDirection(directions, offset, random) {
  const directionZ = random() * 2 - 1;
  const directionAngle = random() * Math.PI * 2;
  const directionRadius = Math.sqrt(1 - directionZ * directionZ);
  directions[offset] = Math.round(
    Math.cos(directionAngle) * directionRadius * 32_767,
  );
  directions[offset + 1] = Math.round(
    Math.sin(directionAngle) * directionRadius * 32_767,
  );
  directions[offset + 2] = Math.round(directionZ * 32_767);
}

function samplePointCloud({
  positions,
  indices,
  pointCount,
  seed,
  vertexColors,
}) {
  const random = createRandom(seed);
  const bounds = calculateBounds(positions);
  const { cumulativeAreas, totalArea } = buildAreaDistribution(
    positions,
    indices,
  );
  const sampledPositions = new Float32Array(pointCount * 3);
  const sampledDirections = new Int16Array(pointCount * 3);
  const sampledColors = vertexColors ? new Uint8Array(pointCount * 3) : null;
  const color = new Color();
  const point = [0, 0, 0];

  for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
    const triangle = findTriangle(cumulativeAreas, random() * totalArea);
    const offset = pointIndex * 3;

    sampleTrianglePoint(positions, indices, triangle, random, point);
    sampledPositions.set(point, offset);
    writeRandomDirection(sampledDirections, offset, random);

    if (sampledColors) {
      writePointColor(sampledColors, offset, point, bounds, color);
    }
  }

  return {
    colors: sampledColors,
    directions: sampledDirections,
    positions: sampledPositions,
    scatterDistance: bounds.modelSize * 2,
  };
}

function encodePointCloud(pointCloud) {
  const flags = pointCloud.colors ? POINT_FILE_COLOR_FLAG : 0;
  const totalBytes =
    POINT_FILE_HEADER_BYTES +
    pointCloud.positions.byteLength +
    pointCloud.directions.byteLength +
    (pointCloud.colors?.byteLength ?? 0);
  const output = Buffer.allocUnsafe(totalBytes);

  output.write("OPT1", 0, "ascii");
  output.writeUInt32LE(POINT_FILE_VERSION, 4);
  output.writeUInt32LE(pointCloud.positions.length / 3, 8);
  output.writeUInt32LE(flags, 12);
  output.writeFloatLE(pointCloud.scatterDistance, 16);

  let offset = POINT_FILE_HEADER_BYTES;
  Buffer.from(pointCloud.positions.buffer).copy(output, offset);
  offset += pointCloud.positions.byteLength;
  Buffer.from(pointCloud.directions.buffer).copy(output, offset);
  offset += pointCloud.directions.byteLength;
  if (pointCloud.colors)
    Buffer.from(pointCloud.colors.buffer).copy(output, offset);

  return output;
}

async function generatePointCloud(job) {
  const sourcePath = path.join(rootDir, job.source);
  const outputPath = path.join(rootDir, job.output);
  const { json, binary } = parseGlb(await readFile(sourcePath));
  const primitive = findFirstTrianglePrimitive(json);
  const primitiveData = readPrimitiveData(json, binary, primitive);
  const pointCloud = samplePointCloud({ ...primitiveData, ...job });
  const encoded = encodePointCloud(pointCloud);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, encoded);
  console.log(
    `${job.output}: ${job.pointCount.toLocaleString()} points, ${(encoded.length / 1024).toFixed(1)} KiB`,
  );
}

for (const job of jobs) await generatePointCloud(job);
