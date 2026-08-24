import { readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  assertCareerExclusionSnapshotIntegrity,
  assertCareerExclusionSourceSync,
  parseCareerExclusionCatalog,
  sha256Hex,
} from "./career-exclusion-catalog-schema.mjs";

const snapshotPath =
  "config/career/github-lab-project-exclusions.generated.json";
const snapshotUrl = new URL(
  "../config/career/github-lab-project-exclusions.generated.json",
  import.meta.url,
);
const metadataUrl = new URL(
  "../config/career/github-lab-project-exclusions.metadata.json",
  import.meta.url,
);

function parseArguments(args) {
  const { values } = parseArgs({
    args,
    options: {
      check: { type: "boolean" },
      source: { type: "string" },
      write: { type: "boolean" },
    },
    strict: true,
  });
  if (values.check && values.write) {
    throw new Error("--check and --write cannot be combined");
  }
  const mode = values.write ? "write" : "check";
  const sourcePath = values.source;
  if (mode === "write" && !sourcePath) {
    throw new Error("--write requires --source <installed catalog path>");
  }
  return { mode, sourcePath };
}

async function readSourceCatalog(sourcePath) {
  const resolvedSourcePath = resolve(sourcePath);
  if (extname(resolvedSourcePath).toLowerCase() !== ".json") {
    throw new Error("career catalog source must be a JSON file");
  }
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- this is an explicit read-only operator-supplied catalog path.
  return readFile(resolvedSourcePath);
}

function createMetadata(sourceHash) {
  return {
    schemaVersion: "1.0",
    syncMode: "byte-identical-source-catalog",
    source: {
      kind: "installed-skill-reference",
      skill: "job-application-finalizer",
      relativePath: "references/github-lab-project-exclusions.json",
      sha256: sourceHash,
    },
    snapshot: {
      path: snapshotPath,
      sha256: sourceHash,
    },
  };
}

async function readRepositorySnapshot() {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- module-relative URL is fixed by this repository.
  const snapshotBytes = await readFile(snapshotUrl);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- module-relative URL is fixed by this repository.
  const metadata = JSON.parse(await readFile(metadataUrl, "utf8"));
  return { metadata, snapshotBytes };
}

async function writeRepositorySnapshot(sourceBytes) {
  parseCareerExclusionCatalog(sourceBytes, "installed source catalog");
  const metadata = createMetadata(sha256Hex(sourceBytes));
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- module-relative URL is fixed by this repository.
  await writeFile(snapshotUrl, sourceBytes);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- module-relative URL is fixed by this repository.
  await writeFile(
    metadataUrl,
    `${JSON.stringify(metadata, null, 2)}\n`,
    "utf8",
  );
  assertCareerExclusionSourceSync(sourceBytes, sourceBytes, metadata);
  return metadata.source.sha256;
}

const { mode, sourcePath } = parseArguments(process.argv.slice(2));
if (mode === "write") {
  const sourceBytes = await readSourceCatalog(sourcePath);
  const sourceHash = await writeRepositorySnapshot(sourceBytes);
  console.log(`Career exclusion catalog snapshot synced (${sourceHash}).`);
} else {
  const { metadata, snapshotBytes } = await readRepositorySnapshot();
  assertCareerExclusionSnapshotIntegrity(snapshotBytes, metadata);
  if (sourcePath) {
    const sourceBytes = await readSourceCatalog(sourcePath);
    assertCareerExclusionSourceSync(snapshotBytes, sourceBytes, metadata);
  }
  console.log(
    `Career exclusion catalog snapshot verified (${metadata.snapshot.sha256})${
      sourcePath ? " against installed source" : ""
    }.`,
  );
}
