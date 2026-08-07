import { readFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, projectRoot), "utf8");
}

function assertIncludes(content, expected, label) {
  if (!content.includes(expected)) {
    throw new Error(`${label}: required content is missing (${expected})`);
  }
}

function assertExcludes(content, unexpected, label) {
  if (content.includes(unexpected)) {
    throw new Error(
      `${label}: root portfolio imports legacy 3D code (${unexpected})`,
    );
  }
}

const [app, content, page, index, siteView] = await Promise.all([
  read("src/App.tsx"),
  read("src/portfolio/portfolioContent.ts"),
  read("src/portfolio/PortfolioPage.tsx"),
  read("index.html"),
  read("src/app/siteView.ts"),
]);

for (const legacyImport of [
  "scenes/mainScene",
  "@react-three",
  'from "three"',
]) {
  assertExcludes(app, legacyImport, "App.tsx");
}

assertIncludes(
  siteView,
  'DEFAULT_SITE_VIEW: SiteView = "portfolio"',
  "siteView.ts",
);

for (const evidenceLabel of [
  "Problem",
  "Contribution",
  "Decision",
  "Validation",
]) {
  assertIncludes(page, evidenceLabel, "PortfolioPage.tsx");
}

for (const projectName of [
  "LocalMesh Studio",
  "VizPort Studio",
  "Mermaid Sky Exporter",
]) {
  assertIncludes(content, projectName, "portfolioContent.ts");
}

for (const publicUrl of [
  "https://localmesh-studio.okorion.chatgpt.site",
  "https://vizport-studio.okorion.chatgpt.site",
  "https://mermaid-sky-exporter.vercel.app",
  "https://github.com/okorion",
]) {
  assertIncludes(`${content}\n${page}`, publicUrl, "public links");
}

for (const metadata of [
  "https://okorion.github.io/",
  "application/ld+json",
  "Product/Application Engineer",
  "<noscript>",
]) {
  assertIncludes(index, metadata, "index.html");
}

console.log(
  "Portfolio content, routing, public links, and metadata checks passed.",
);
