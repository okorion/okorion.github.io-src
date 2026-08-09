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

function parseStaticImportSpecifier(statement) {
  const fromMarker = " from ";
  const markerIndex = statement.lastIndexOf(fromMarker);
  const searchStart =
    markerIndex === -1 ? "import ".length : markerIndex + fromMarker.length;
  const quoteStart = statement.indexOf('"', searchStart);
  const quoteEnd = statement.indexOf('"', quoteStart + 1);

  if (quoteStart === -1 || quoteEnd === -1) {
    throw new Error(`Unsupported static import syntax (${statement})`);
  }

  return statement.slice(quoteStart + 1, quoteEnd);
}

function getStaticImportSpecifiers(source) {
  const specifiers = [];
  let statement = "";

  for (const sourceLine of source.split("\n")) {
    const line = sourceLine.trim();
    if (statement || line.startsWith("import ")) {
      statement = `${statement} ${line}`.trim();
    }
    if (statement.endsWith(";")) {
      specifiers.push(parseStaticImportSpecifier(statement));
      statement = "";
    }
  }

  if (statement) {
    throw new Error(`Unterminated static import (${statement})`);
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
  hubLinks,
  index,
  main,
  page,
  profile,
  projects,
  readme,
  routeBoundary,
  sectionHeading,
  siteView,
  writing,
] = await Promise.all([
  readFile("src/App.tsx", "utf8"),
  readFile("src/portfolio/components/ContactSection.tsx", "utf8"),
  readFile("src/portfolio/portfolioContent.ts", "utf8"),
  readFile("src/portfolio/components/ProfessionalEvidenceSection.tsx", "utf8"),
  readFile("src/portfolio/components/ExternalLink.tsx", "utf8"),
  readFile("src/portfolio/components/SiteFooter.tsx", "utf8"),
  readFile("src/portfolio/components/SiteHeader.tsx", "utf8"),
  readFile("src/portfolio/components/HeroSection.tsx", "utf8"),
  readFile("src/components/ui/navigationHub/navigationLinks.ts", "utf8"),
  readFile("index.html", "utf8"),
  readFile("src/main.tsx", "utf8"),
  readFile("src/portfolio/PortfolioPage.tsx", "utf8"),
  readFile("src/portfolio/components/ProfileSection.tsx", "utf8"),
  readFile("src/portfolio/components/PublicBuildsSection.tsx", "utf8"),
  readFile("README.md", "utf8"),
  readFile("src/app/RouteErrorBoundary.tsx", "utf8"),
  readFile("src/portfolio/components/SectionHeading.tsx", "utf8"),
  readFile("src/app/siteView.ts", "utf8"),
  readFile("src/portfolio/components/TechnicalWritingSection.tsx", "utf8"),
]);

const auditedRootSources = [
  ["main.tsx", main],
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
  ["TechnicalWritingSection.tsx", writing],
  ["portfolioContent.ts", content],
  ["siteView.ts", siteView],
];

const approvedRootStaticImports = new Set([
  "react",
  "react-dom/client",
  "./App.tsx",
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
  "./components/TechnicalWritingSection",
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
  hubLinks,
  page,
  profile,
  projects,
  readme,
  writing,
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

for (const writingTitle of [
  "PWA 서비스워커가 MyHits 조회수 배지를 캐시한 문제 해결기",
  "🌆 GitHub.io 페이지 제작기 (2) - Points 컨셉의 3D Web 구현",
  "2026년 React 프로젝트에서 라이브러리를 고르는 기준",
]) {
  assertIncludes(content, writingTitle, "portfolioContent.ts");
}

assertIncludes(
  writing,
  "ariaLabel={`${item.title} — Read on Velog`}",
  "TechnicalWritingSection.tsx",
);

const writingItemCount =
  content.match(/publishedAt: "\d{4}-\d{2}-\d{2}"/g)?.length ?? 0;
if (writingItemCount !== 3) {
  throw new Error(
    `portfolioContent.ts: expected three technical writing items (${writingItemCount})`,
  );
}

for (const publicUrl of [
  "https://localmesh-studio.okorion.chatgpt.site",
  "https://vizport-studio.okorion.chatgpt.site",
  "https://mermaid-sky-exporter.vercel.app",
  "https://github.com/okorion",
  "https://velog.io/@okorion",
  "https://velog.io/@okorion/PWA-서비스워커가-MyHits-조회수-배지를-캐시한-문제-해결기-rfvfju0v",
  "https://velog.io/@okorion/GitHub.io-페이지-제작기-2-Points-web",
  "https://velog.io/@okorion/2026년-React-프로젝트에서-라이브러리를-고르는-기준",
]) {
  assertIncludes(portfolio, publicUrl, "public links");
}

for (const [label, surface] of [
  ["ContactSection.tsx", contact],
  ["navigationLinks.ts", hubLinks],
  ["TechnicalWritingSection + portfolioContent", `${writing}\n${content}`],
  ["index.html", index],
  ["README.md", readme],
]) {
  assertIncludes(surface, "Technical Writing", label);
  assertIncludes(surface, "https://velog.io/@okorion", label);
}

for (const [label, surface] of [
  ["ContactSection.tsx", contact],
  ["navigationLinks.ts", hubLinks],
  ["TechnicalWritingSection.tsx", writing],
  ["index.html", index],
]) {
  assertExcludes(surface, "https://okorion.github.io/tech-blog/", label);
  assertExcludes(surface, "Tech Blog", label);
}

assertIncludes(
  readme,
  "Learning Archive — 이전 강의 및 기술 학습 기록",
  "README.md",
);

for (const experienceCompany of [
  'company: "티맥스가이아"',
  'company: "티맥스메타에이아이 (구 티맥스메타버스)"',
]) {
  assertIncludes(content, experienceCompany, "portfolioContent.ts");
}

for (const identifyingCaseCopy of [
  "GAIA / FX Studio",
  "GAIA 2D Web Builder",
  "SmartMap —",
  "공식 행사",
  "송도",
]) {
  assertExcludes(content, identifyingCaseCopy, "case study copy");
}

for (const metadata of [
  "https://okorion.github.io/",
  "application/ld+json",
  "Product/Application Engineer",
  "<noscript>",
  '<script type="module" src="/src/main.tsx"></script>',
]) {
  assertIncludes(index, metadata, "index.html");
}

const moduleEntryCount = index.match(/type=["']module["']/g)?.length ?? 0;
if (moduleEntryCount !== 1) {
  throw new Error(
    `index.html: expected one module entry (${moduleEntryCount})`,
  );
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
  "세 개의 Collider",
  "Collider three types",
  "52.51MB",
  "stats.json",
  "webpack 산출물",
  "프로덕션 웹팩 결과",
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
