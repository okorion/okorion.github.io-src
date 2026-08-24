import { posix, win32 } from "node:path";
import {
  isMissingOptionalRoot,
  readCareerPortfolioTree,
} from "./portfolio-exclusion-policy.mjs";

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

const windowsResolve = (candidatePath) =>
  win32.resolve("C:\\career-portfolio", candidatePath);
const linuxResolve = (candidatePath) =>
  posix.resolve("/career-portfolio", candidatePath);

for (const testCase of [
  {
    label: "Windows absolute optional root ENOENT",
    error: { code: "ENOENT", path: "C:\\career-portfolio\\dist" },
    resolvePath: windowsResolve,
    expected: true,
  },
  {
    label: "Linux absolute optional root ENOENT",
    error: { code: "ENOENT", path: "/career-portfolio/dist" },
    resolvePath: linuxResolve,
    expected: true,
  },
  {
    label: "Windows child ENOENT is not optional-root missing",
    error: {
      code: "ENOENT",
      path: "C:\\career-portfolio\\dist\\assets\\missing.js",
    },
    resolvePath: windowsResolve,
    expected: false,
  },
  {
    label: "Linux child ENOENT is not optional-root missing",
    error: { code: "ENOENT", path: "/career-portfolio/dist/assets/missing.js" },
    resolvePath: linuxResolve,
    expected: false,
  },
  {
    label: "Windows outside ENOENT is not optional-root missing",
    error: { code: "ENOENT", path: "C:\\outside\\dist" },
    resolvePath: windowsResolve,
    expected: false,
  },
  {
    label: "Linux outside ENOENT is not optional-root missing",
    error: { code: "ENOENT", path: "/outside/dist" },
    resolvePath: linuxResolve,
    expected: false,
  },
  {
    label: "root permission error is not hidden",
    error: { code: "EACCES", path: "/career-portfolio/dist" },
    resolvePath: linuxResolve,
    expected: false,
  },
  {
    label: "ENOENT without a path is not hidden",
    error: { code: "ENOENT" },
    resolvePath: linuxResolve,
    expected: false,
  },
]) {
  assertEqual(
    isMissingOptionalRoot(testCase.error, "dist", testCase.resolvePath),
    testCase.expected,
    testCase.label,
  );
}

const actualMissingRoot =
  "__career_portfolio_optional_dist_regression_root_must_not_exist__";
const actualMissingRootSurfaces = await readCareerPortfolioTree(
  actualMissingRoot,
  { optional: true },
);
assertEqual(
  actualMissingRootSurfaces.length,
  0,
  "actual missing optional root scan",
);

console.log(
  "Windows/Linux optional dist handling accepts only the missing root and rejects other path errors.",
);
