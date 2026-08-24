import { readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
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
  let mode = "check";
  let sourcePath;
  let waitingForSource = false;

  for (const argument of args) {
    if (waitingForSource) {
      sourcePath = argument;
      waitingForSource = false;
      continue;
    }
    if (argument === "--source") {
      waitingForSource = true;
      continue;
    }
    if (argument === "--write") {
      mode = "write";
      continue;
    }
    if (argument !== "--check") {
      throw new Error(`unknown catalog sync argument (${argument})`);
    }
  }

  if (waitingForSource) {
    throw new Error("--source requires a JSON path");
  }
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
  const snapshotBytes = await readFile(snapshotUrl);
  const metadata = JSON.parse(await readFile(metadataUrl, "utf8"));
  return { metadata, snapshotBytes };
}

async function writeRepositorySnapshot(sourceBytes) {
  parseCareerExclusionCatalog(sourceBytes, "installed source catalog");
  const metadata = createMetadata(sha256Hex(sourceBytes));
  await writeFile(snapshotUrl, sourceBytes);
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
