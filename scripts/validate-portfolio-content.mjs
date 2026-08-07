import { readFile } from "node:fs/promises";

function assertIncludes(content, expected, label) {
  if (!content.includes(expected)) {
    throw new Error(`${label}: required content is missing (${expected})`);
  }
}

function assertExcludes(content, unexpected, label) {
  if (content.includes(unexpected)) {
    throw new Error(`${label}: forbidden content is present (${unexpected})`);
  }
}

function getStaticImportSpecifiers(source) {
  const specifiers = [];
  const staticImportPattern =
    /\bimport\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["'];/g;

  for (const match of source.matchAll(staticImportPattern)) {
    specifiers.push(match[1]);
  }

  return specifiers;
}

const [
  app,
  contact,
  content,
  evidence,
  externalLink,
  footer,
  header,
  hero,
  index,
  page,
  profile,
  projects,
  readme,
  routeBoundary,
  sectionHeading,
  siteView,
] = await Promise.all([
  readFile("src/App.tsx", "utf8"),
  readFile("src/portfolio/components/ContactSection.tsx", "utf8"),
  readFile("src/portfolio/portfolioContent.ts", "utf8"),
  readFile("src/portfolio/components/ProfessionalEvidenceSection.tsx", "utf8"),
  readFile("src/portfolio/components/ExternalLink.tsx", "utf8"),
  readFile("src/portfolio/components/SiteFooter.tsx", "utf8"),
  readFile("src/portfolio/components/SiteHeader.tsx", "utf8"),
  readFile("src/portfolio/components/HeroSection.tsx", "utf8"),
  readFile("index.html", "utf8"),
  readFile("src/portfolio/PortfolioPage.tsx", "utf8"),
  readFile("src/portfolio/components/ProfileSection.tsx", "utf8"),
  readFile("src/portfolio/components/PublicBuildsSection.tsx", "utf8"),
  readFile("README.md", "utf8"),
  readFile("src/app/RouteErrorBoundary.tsx", "utf8"),
  readFile("src/portfolio/components/SectionHeading.tsx", "utf8"),
  readFile("src/app/siteView.ts", "utf8"),
]);

const auditedRootSources = [
  ["App.tsx", app],
  ["RouteErrorBoundary.tsx", routeBoundary],
  ["PortfolioPage.tsx", page],
  ["ContactSection.tsx", contact],
  ["ExternalLink.tsx", externalLink],
  ["HeroSection.tsx", hero],
  ["ProfessionalEvidenceSection.tsx", evidence],
  ["ProfileSection.tsx", profile],
  ["PublicBuildsSection.tsx", projects],
  ["SectionHeading.tsx", sectionHeading],
  ["SiteFooter.tsx", footer],
  ["SiteHeader.tsx", header],
  ["portfolioContent.ts", content],
  ["siteView.ts", siteView],
];

const approvedRootStaticImports = new Set([
  "react",
  "./App.css",
  "./app/RouteErrorBoundary",
  "./app/siteView",
  "./portfolio/PortfolioPage",
  "../app/siteView",
  "./components/ContactSection",
  "./components/HeroSection",
  "./components/ProfessionalEvidenceSection",
  "./components/ProfileSection",
  "./components/PublicBuildsSection",
  "./components/SiteFooter",
  "./components/SiteHeader",
  "./portfolio.css",
  "../portfolioContent",
  "./ExternalLink",
  "./SectionHeading",
]);

for (const [label, source] of auditedRootSources) {
  for (const specifier of getStaticImportSpecifiers(source)) {
    if (!approvedRootStaticImports.has(specifier)) {
      throw new Error(
        `${label}: unaudited root static import is present (${specifier})`,
      );
    }
  }
}

const portfolio = [
  contact,
  content,
  evidence,
  footer,
  header,
  hero,
  page,
  profile,
  projects,
  readme,
].join("\n");

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
  assertIncludes(evidence, evidenceLabel, "ProfessionalEvidenceSection.tsx");
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
  assertIncludes(portfolio, publicUrl, "public links");
}

for (const metadata of [
  "https://okorion.github.io/",
  "application/ld+json",
  "Product/Application Engineer",
  "<noscript>",
]) {
  assertIncludes(index, metadata, "index.html");
}

for (const forbiddenClaim of [
  "지도 4종",
  "4개 지도",
  "4개의 지도",
  "지도 페이지 4종",
  "3종 Collider",
  "3종 Colider",
  "Collider 3종",
  "Colider 3종",
  "52.51MB",
  "stats.json",
  "SignalDesk",
  "Deploy Lens",
  "Private",
  "Restricted",
]) {
  assertExcludes(`${portfolio}\n${index}`, forbiddenClaim, "public portfolio");
}

console.log(
  "Portfolio content, routing, public links, and metadata checks passed.",
);
