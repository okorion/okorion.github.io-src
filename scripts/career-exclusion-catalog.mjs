import { readFile } from "node:fs/promises";
import {
  assertCareerExclusionSnapshotIntegrity,
  collectCareerExclusionAliases,
  collectCareerExclusionDerivedUrls,
} from "./career-exclusion-catalog-schema.mjs";

// eslint-disable-next-line security/detect-non-literal-fs-filename -- module-relative URL is fixed by this repository.
export const careerExclusionCatalogSnapshotBytes = await readFile(
  new URL(
    "../config/career/github-lab-project-exclusions.generated.json",
    import.meta.url,
  ),
);
// eslint-disable-next-line security/detect-non-literal-fs-filename -- module-relative URL is fixed by this repository.
const metadataText = await readFile(
  new URL(
    "../config/career/github-lab-project-exclusions.metadata.json",
    import.meta.url,
  ),
  "utf8",
);

export const careerExclusionCatalogMetadata = JSON.parse(metadataText);
export const careerExclusionCatalog = assertCareerExclusionSnapshotIntegrity(
  careerExclusionCatalogSnapshotBytes,
  careerExclusionCatalogMetadata,
);
export const careerExclusionAliases = collectCareerExclusionAliases(
  careerExclusionCatalog,
);
export const careerExclusionDerivedUrls = collectCareerExclusionDerivedUrls(
  careerExclusionCatalog,
);
