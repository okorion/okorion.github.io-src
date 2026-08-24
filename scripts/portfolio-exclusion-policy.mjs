import { readdir, readFile } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import {
  careerExclusionAliases,
  careerExclusionDerivedUrls,
} from "./career-exclusion-catalog.mjs";

const blockedCareerPortfolioDescriptions = [
  "개인 프로젝트로 local-first AI와 3D·데이터 시각화 도구를 만들고 공개합니다.",
  "오브젝트 선택·강조",
  "SceneCommand·Yjs",
  "로컬 LLM 명령",
  "샘플에서 추천 선택 → 미리보기 → React 코드 복사",
  "파일 최대 5MB",
  "재분석 전에는 이전 결과를 잠가",
  "WebGPU 렌더러는 확장 인터페이스만 마련했습니다.",
];

export const blockedCareerPortfolioContent = [
  ...new Set([
    ...careerExclusionAliases,
    ...careerExclusionDerivedUrls,
    ...blockedCareerPortfolioDescriptions,
  ]),
];

const binaryExtensions = new Set([
  ".avif",
  ".bmp",
  ".gif",
  ".glb",
  ".ico",
  ".jpeg",
  ".jpg",
  ".mp3",
  ".mp4",
  ".otf",
  ".pdf",
  ".png",
  ".points",
  ".ttf",
  ".wasm",
  ".webm",
  ".webp",
  ".woff",
  ".woff2",
  ".zip",
]);

export function isCareerPortfolioBinaryAsset(filePath) {
  return binaryExtensions.has(extname(filePath).toLowerCase());
}

export const catalogBlockedCareerPortfolioAliases = [...careerExclusionAliases];

export const catalogDerivedCareerPortfolioUrls = [
  ...careerExclusionDerivedUrls,
];

function normalizePath(filePath) {
  return relative(".", filePath).split(sep).join("/");
}

function assertPathInsideRoot(root, candidatePath) {
  const relativePath = relative(root, candidatePath);
  const escapesRoot =
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath);
  if (escapesRoot) {
    throw new Error(`career portfolio scan escaped ${root} (${candidatePath})`);
  }
  return candidatePath;
}

async function listDirectory(root, directory) {
  const safeDirectory = assertPathInsideRoot(root, directory);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is constrained to a fixed scan root above.
  return readdir(safeDirectory, { withFileTypes: true });
}

async function readSurfaceContent(root, filePath) {
  if (isCareerPortfolioBinaryAsset(filePath)) {
    return "";
  }

  const safeFilePath = assertPathInsideRoot(root, filePath);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- the path is constrained to a fixed scan root above.
  return readFile(safeFilePath, "utf8");
}

async function collectTree(root, directory, surfaces) {
  for (const entry of await listDirectory(root, directory)) {
    const filePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectTree(root, filePath, surfaces);
      continue;
    }
    if (!entry.isFile()) {
      throw new Error(
        `career portfolio scan found an unsupported filesystem entry (${filePath})`,
      );
    }

    surfaces.push([
      normalizePath(filePath),
      await readSurfaceContent(root, filePath),
    ]);
  }
  return surfaces;
}

export function isMissingOptionalRoot(error, root, resolvePath = resolve) {
  return (
    error?.code === "ENOENT" &&
    typeof error?.path === "string" &&
    resolvePath(error.path) === resolvePath(root)
  );
}

export async function readCareerPortfolioTree(root, { optional = false } = {}) {
  try {
    return await collectTree(root, root, []);
  } catch (error) {
    if (optional && isMissingOptionalRoot(error, root)) {
      return [];
    }
    throw error;
  }
}

export async function loadCareerPortfolioTextSurfaces({
  contentMutations = new Map(),
} = {}) {
  if (!(contentMutations instanceof Map)) {
    throw new Error("career portfolio content mutations must be a Map");
  }

  const surfaces = [
    ["index.html", await readFile("index.html", "utf8")],
    ["README.md", await readFile("README.md", "utf8")],
    ...(await readCareerPortfolioTree("src")),
    ...(await readCareerPortfolioTree("public")),
    ...(await readCareerPortfolioTree("dist", { optional: true })),
  ];
  const pendingMutations = new Set(contentMutations.keys());

  const mutatedSurfaces = surfaces.map(([label, content]) => {
    if (!contentMutations.has(label)) {
      return [label, content];
    }
    pendingMutations.delete(label);
    return [label, `${content}\n${contentMutations.get(label)}`];
  });

  if (pendingMutations.size > 0) {
    throw new Error(
      `career portfolio mutation target is missing (${[...pendingMutations].join(", ")})`,
    );
  }

  return mutatedSurfaces;
}

export function assertNoBlockedCareerPortfolioContent(surfaces, label) {
  for (const [surfaceLabel, content] of surfaces) {
    const normalizedSurface = `${surfaceLabel}\n${content}`.toLocaleLowerCase(
      "en-US",
    );
    for (const blockedContent of blockedCareerPortfolioContent) {
      if (
        normalizedSurface.includes(blockedContent.toLocaleLowerCase("en-US"))
      ) {
        throw new Error(
          `${label}: forbidden content is present in ${surfaceLabel} (${blockedContent})`,
        );
      }
    }
  }
}
