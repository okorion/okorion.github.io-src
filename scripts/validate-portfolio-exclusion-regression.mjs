import {
  careerExclusionCatalogMetadata,
  careerExclusionCatalogSnapshotBytes,
} from "./career-exclusion-catalog.mjs";
import {
  assertCareerExclusionSnapshotIntegrity,
  assertCareerExclusionSourceSync,
  sha256Hex,
} from "./career-exclusion-catalog-schema.mjs";
import {
  assertNoBlockedCareerPortfolioContent,
  catalogBlockedCareerPortfolioAliases,
  catalogDerivedCareerPortfolioUrls,
  isCareerPortfolioBinaryAsset,
  loadCareerPortfolioTextSurfaces,
  readCareerPortfolioTree,
} from "./portfolio-exclusion-policy.mjs";

function expectBlocked(surfaces, label) {
  let blocked = false;
  try {
    assertNoBlockedCareerPortfolioContent(surfaces, label);
  } catch (error) {
    if (!String(error?.message).includes("forbidden content")) {
      throw error;
    }
    blocked = true;
  }
  if (!blocked) {
    throw new Error(`${label} was not rejected`);
  }
}

function expectRejected(action, label) {
  let rejected = false;
  try {
    action();
  } catch {
    rejected = true;
  }
  if (!rejected) {
    throw new Error(`${label} was not rejected`);
  }
}

for (const alias of catalogBlockedCareerPortfolioAliases) {
  expectBlocked(
    await loadCareerPortfolioTextSurfaces({
      contentMutations: new Map([
        [
          "src/portfolio/portfolio.css",
          `.excluded-regression { background-image: url("${alias}"); }`,
        ],
      ]),
    }),
    `catalog CSS alias regression (${alias})`,
  );
  expectBlocked(
    await loadCareerPortfolioTextSurfaces({
      contentMutations: new Map([["public/robots.txt", `Project: ${alias}`]]),
    }),
    `catalog public static alias regression (${alias})`,
  );
  expectBlocked(
    [["dist/regression-policy-data.yaml", `project: "${alias}"`]],
    `catalog dist alias regression (${alias})`,
  );
  expectBlocked(
    [[`public/assets/${alias}.png`, ""]],
    `catalog binary asset-path alias regression (${alias})`,
  );
}

for (const rawAssetUrl of catalogDerivedCareerPortfolioUrls) {
  expectBlocked(
    [
      [
        "src/portfolio/portfolio.css",
        `.excluded-regression { background-image: url("https://${rawAssetUrl}/main/public/og.png"); }`,
      ],
    ],
    `derived raw asset URL regression (${rawAssetUrl})`,
  );
}

const reviewerYamlMutation = [
  "project: VizPort Studio",
  "demo: https://vizport-studio.okorion.chatgpt.site",
].join("\n");

async function loadReviewerYamlFixture(root) {
  const surfaces = await readCareerPortfolioTree(root);
  if (surfaces.length !== 1 || surfaces[0][1].trim() !== reviewerYamlMutation) {
    throw new Error(`reviewer YAML fixture changed (${root})`);
  }
  return surfaces;
}

expectBlocked(
  await loadReviewerYamlFixture("scripts/fixtures/portfolio-exclusion/public"),
  "reviewer public YAML regression",
);
expectBlocked(
  await loadReviewerYamlFixture("scripts/fixtures/portfolio-exclusion/dist"),
  "reviewer copied dist YAML regression",
);

for (const extension of [
  "json",
  "yaml",
  "yml",
  "txt",
  "css",
  "html",
  "svg",
  "md",
]) {
  if (isCareerPortfolioBinaryAsset(`public/regression.${extension}`)) {
    throw new Error(`public text extension was misclassified (${extension})`);
  }
}
if (!isCareerPortfolioBinaryAsset("public/assets/regression.png")) {
  throw new Error("binary asset extension was not classified as binary");
}

const snapshotText = Buffer.from(careerExclusionCatalogSnapshotBytes).toString(
  "utf8",
);
const driftedSourceBytes = Buffer.from(
  snapshotText.replace("VizPort Studio", "VizPort Studio Drift"),
  "utf8",
);
expectRejected(
  () =>
    assertCareerExclusionSourceSync(
      careerExclusionCatalogSnapshotBytes,
      driftedSourceBytes,
      careerExclusionCatalogMetadata,
    ),
  "installed source catalog drift",
);

const invalidPolicyBytes = Buffer.from(
  snapshotText.replace('"decision": "omit-all"', '"decision": "include"'),
  "utf8",
);
const invalidPolicyHash = sha256Hex(invalidPolicyBytes);
const invalidPolicyMetadata = {
  ...careerExclusionCatalogMetadata,
  source: {
    ...careerExclusionCatalogMetadata.source,
    sha256: invalidPolicyHash,
  },
  snapshot: {
    ...careerExclusionCatalogMetadata.snapshot,
    sha256: invalidPolicyHash,
  },
};
expectRejected(
  () =>
    assertCareerExclusionSnapshotIntegrity(
      invalidPolicyBytes,
      invalidPolicyMetadata,
    ),
  "non-omit-all catalog policy",
);

console.log(
  `Catalog aliases rejected across CSS/public YAML/dist YAML/asset paths (${catalogBlockedCareerPortfolioAliases.length} aliases).`,
);
console.log("Catalog source drift and non-omit-all policy were rejected.");
