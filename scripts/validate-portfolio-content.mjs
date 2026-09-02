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
  hubSurface,
  index,
  main,
  page,
  portfolioCss,
  profile,
  projects,
  readme,
  routeBoundary,
  sectionHeading,
  siteView,
  themeToggle,
  themeHook,
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
  readFile("src/components/ui/navigationHub/HubSurface.tsx", "utf8"),
  readFile("index.html", "utf8"),
  readFile("src/main.tsx", "utf8"),
  readFile("src/portfolio/PortfolioPage.tsx", "utf8"),
  readFile("src/portfolio/portfolio.css", "utf8"),
  readFile("src/portfolio/components/ProfileSection.tsx", "utf8"),
  readFile("src/portfolio/components/PublicBuildsSection.tsx", "utf8"),
  readFile("README.md", "utf8"),
  readFile("src/app/RouteErrorBoundary.tsx", "utf8"),
  readFile("src/portfolio/components/SectionHeading.tsx", "utf8"),
  readFile("src/app/siteView.ts", "utf8"),
  readFile("src/portfolio/components/ThemeToggle.tsx", "utf8"),
  readFile("src/portfolio/usePortfolioTheme.ts", "utf8"),
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
  ["ThemeToggle.tsx", themeToggle],
  ["TechnicalWritingSection.tsx", writing],
  ["usePortfolioTheme.ts", themeHook],
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
  "./usePortfolioTheme",
  "./portfolio.css",
  "../portfolioContent",
  "./ExternalLink",
  "./SectionHeading",
  "./ThemeToggle",
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
  hubSurface,
  index,
  page,
  profile,
  projects,
  readme,
  sectionHeading,
  themeToggle,
  writing,
].join("\n");

for (const [source, headingId, label] of [
  [evidence, "professional-evidence-title", "ProfessionalEvidenceSection.tsx"],
  [projects, "public-builds-title", "PublicBuildsSection.tsx"],
  [writing, "technical-writing-title", "TechnicalWritingSection.tsx"],
  [profile, "experience-title", "ProfileSection.tsx"],
]) {
  const labelledByMatch = source.match(/aria-labelledby\s*=\s*"([^"]+)"/);
  const headingIdMatch = source.match(/headingId\s*=\s*"([^"]+)"/);
  const labelledBy = labelledByMatch ? labelledByMatch[1] : undefined;
  const sectionHeadingId = headingIdMatch ? headingIdMatch[1] : undefined;
  if (labelledBy !== headingId || sectionHeadingId !== headingId) {
    throw new Error(
      `${label}: aria-labelledby and SectionHeading headingId must both be ${headingId}`,
    );
  }
}

const contactLabelledByMatch = contact.match(/aria-labelledby\s*=\s*"([^"]+)"/);
const contactHeadingTagMatch = contact.match(/<h2\b[^>]*>/);
const contactLabelledBy = contactLabelledByMatch
  ? contactLabelledByMatch[1]
  : undefined;
const contactHeadingTag = contactHeadingTagMatch
  ? contactHeadingTagMatch[0]
  : "";
const contactHeadingIdMatch = contactHeadingTag.match(/\bid\s*=\s*"([^"]+)"/);
const contactHeadingId = contactHeadingIdMatch
  ? contactHeadingIdMatch[1]
  : undefined;
if (
  contactLabelledBy !== "contact-title" ||
  contactHeadingId !== "contact-title"
) {
  throw new Error(
    "ContactSection.tsx: aria-labelledby and visible h2 id must both be contact-title",
  );
}

const sharedHeadingTag = sectionHeading.match(/<h2\b[^>]*>/)?.[0];
if (
  !sharedHeadingTag?.includes("id={headingId}") ||
  !sharedHeadingTag.includes('className="section-heading__eyebrow"')
) {
  throw new Error(
    "SectionHeading.tsx: the visible h2 must receive headingId and the eyebrow class",
  );
}

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

for (const [label, surface] of [
  ["HeroSection.tsx", hero],
  ["index.html", index],
]) {
  assertIncludes(surface, "Editor·Builder의 편집 흐름을", label);
  assertIncludes(surface, "저장과 실행까지 연결합니다.", label);
  assertExcludes(surface, "Editor·Builder의 복잡한 상태를", label);
}

const heroParagraphs = [...hero.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)];
const heroSummaryBodies = [];
let rendersHeroExperiment = false;
for (const [, attributes, body] of heroParagraphs) {
  const classNameMatch = attributes.match(/\bclassName\s*=\s*"([^"]*)"/);
  const classNames = classNameMatch ? classNameMatch[1].split(/\s+/) : [];
  if (classNames.includes("hero__summary")) {
    heroSummaryBodies.push(body);
  }
  if (classNames.includes("hero__experiment")) {
    rendersHeroExperiment = true;
  }
}
if (heroSummaryBodies.length !== 1) {
  throw new Error("HeroSection.tsx: hero summary must render exactly once");
}
if (rendersHeroExperiment) {
  throw new Error("HeroSection.tsx: hero experiment paragraph must not render");
}

const heroSummary = heroSummaryBodies[0].replace(/\s+/g, " ").trim();
const approvedHeroSummary =
  "React·TypeScript·Three.js로 2D·3D Editor·Builder와 지도 제품을 개발해 왔습니다. 편집 상태와 command·event, 저장 모델, Runtime이 한 흐름으로 동작하도록 연결하고 모바일·현장·운영 환경에서 직접 확인해 왔습니다.";
if (heroSummary !== approvedHeroSummary) {
  throw new Error(
    "HeroSection.tsx: the approved description must remain a single hero summary paragraph",
  );
}

const normalizedPortfolio = portfolio.replace(/\s+/g, " ").trim();
for (const removedCopy of [
  "각 사례에서 어떤 문제를 맡았고, 어떻게 판단해 구현하고 확인했는지 정리했습니다.",
  "직접 사용해 보고 코드를 살펴볼 수 있습니다.",
  "업무와 별도로 만든 개인 프로젝트입니다. 각 데모에서 구현한 기능과 현재 제한 사항을 함께 적었습니다.",
  "문제를 어떻게 좁혔고, 왜 이 방법을 택했는지 기록합니다.",
  "Velog에 쓴 글 가운데 문제 해결 과정과 직접 구현한 내용, 기술 선택 이유가 담긴 세 편을 골랐습니다.",
  "지금까지의 경력과 교육, 자격, 공개 특허를 한곳에 정리했습니다.",
  "지원용 이력서와 연락처는 채용 과정에서 별도로 공유합니다.",
  "업무 사례의 내부 명칭·스키마·고객 정보는 외부에 공개할 수 있도록 바꿔 적었습니다.",
  "개인 프로젝트는 회사 업무와 따로 진행했습니다.",
]) {
  const normalizedRemovedCopy = removedCopy.replace(/\s+/g, " ").trim();
  if (normalizedPortfolio.includes(normalizedRemovedCopy)) {
    throw new Error(
      `public portfolio sources: forbidden content is present (${removedCopy})`,
    );
  }
}

for (const [label, surface, approvedCopy] of [
  [
    "HeroSection.tsx",
    hero,
    "이전 포트폴리오의 인터랙티브 3D 장면도 함께 볼 수 있습니다.",
  ],
  ["navigationLinks.ts", hubLinks, "직접 구현한 내용과 문제 해결 기록"],
  ["HubSurface.tsx", hubSurface, "포트폴리오와 3D 장면을 둘러보세요."],
  [
    "HubSurface.tsx",
    hubSurface,
    "경력 프로필, 기술 글로 바로 이동할 수 있습니다.",
  ],
  [
    "README.md",
    readme,
    "주요 업무와 역할, 기술적 판단을 빠르게 살펴볼 수 있도록",
  ],
  ["index.html", index, "실제 환경에서 동작을 확인합니다."],
  [
    "portfolio.css",
    portfolioCss,
    "color-mix(in srgb, var(--page-accent) 7%, var(--page-bg))",
  ],
]) {
  assertIncludes(surface, approvedCopy, label);
}

for (const [label, surface, replacedCopy] of [
  [
    "ProfessionalEvidenceSection.tsx",
    evidence,
    "각 사례에서 어떤 문제를 맡았고, 어떻게 판단해 구현하고 확인했는지 정리했습니다.",
  ],
  [
    "PublicBuildsSection.tsx",
    projects,
    "직접 사용해 보고 코드를 살펴볼 수 있습니다.",
  ],
  [
    "PublicBuildsSection.tsx",
    projects,
    "업무와 별도로 만든 개인 프로젝트입니다.",
  ],
  [
    "TechnicalWritingSection.tsx",
    writing,
    "문제를 어떻게 좁혔고, 왜 이 방법을 택했는지 기록합니다.",
  ],
  [
    "TechnicalWritingSection.tsx",
    writing,
    "기술 선택 이유가 담긴 세 편을 골랐습니다.",
  ],
  [
    "ProfileSection.tsx",
    profile,
    "지금까지의 경력과 교육, 자격, 공개 특허를 한곳에 정리했습니다.",
  ],
  [
    "ContactSection.tsx",
    contact,
    "지원용 이력서와 연락처는 채용 과정에서 별도로 공유합니다.",
  ],
  [
    "SiteFooter.tsx",
    footer,
    "업무 사례의 내부 명칭·스키마·고객 정보는 외부에 공개할 수 있도록 바꿔",
  ],
  ["SectionHeading.tsx", sectionHeading, "description:"],
  ["SectionHeading.tsx", sectionHeading, "title?: string"],
  ["portfolio.css", portfolioCss, ".section-heading__body"],
  ["portfolio.css", portfolioCss, "--page-contact-muted"],
  [
    "HeroSection.tsx",
    hero,
    "기존 인터랙티브 장면은 별도 경험으로 보존했습니다.",
  ],
  [
    "ProfessionalEvidenceSection.tsx",
    evidence,
    "복잡한 기능일수록 상태와 책임부터 정리합니다.",
  ],
  [
    "ProfileSection.tsx",
    profile,
    "제품의 편집 화면부터 실행과 운영까지 다뤄 왔습니다.",
  ],
  ["ContactSection.tsx", contact, "프로젝트와 경력, 기술 글을 더 살펴보세요."],
  ["ProfessionalEvidenceSection.tsx", evidence, "PROFESSIONAL EVIDENCE"],
  [
    "ProfessionalEvidenceSection.tsx",
    evidence,
    "공개 가능한 범위에서 문제, 직접 기여, 핵심 판단, 검증 방법을 분리해 적었습니다.",
  ],
  [
    "PublicBuildsSection.tsx",
    projects,
    "직접 열어보고, 코드를 확인할 수 있는 실험입니다.",
  ],
  [
    "PublicBuildsSection.tsx",
    projects,
    "현업 제품과 분리된 개인 공개 프로젝트입니다.",
  ],
  [
    "PublicBuildsSection.tsx",
    projects,
    "데모의 동작 범위와 구현 경계를 함께 밝혔습니다.",
  ],
  [
    "TechnicalWritingSection.tsx",
    writing,
    "Velog의 글 중 트러블슈팅, 직접 구현, 기술 선택 기준이 드러나는 세 편만 선별했습니다.",
  ],
  ["ProfileSection.tsx", profile, "직무 포지셔닝과 직접 연결되는"],
  ["ContactSection.tsx", contact, "다음 근거를 바로 확인할 수 있습니다."],
  [
    "ContactSection.tsx",
    contact,
    "지원용 이력서와 연락처는 채용 과정에서 전달한 최신 문서를 기준으로",
  ],
  [
    "SiteFooter.tsx",
    footer,
    "개인 공개 프로젝트는 현업 제품과 별개의 실험입니다.",
  ],
  ["navigationLinks.ts", hubLinks, "경력과 공개 근거 요약"],
  ["HubSurface.tsx", hubSurface, "3D 장면과 공개 기록을 둘러보세요."],
  [
    "HubSurface.tsx",
    hubSurface,
    "경력 포트폴리오, 공개 소스와 기술 기록으로 이동할 수 있습니다.",
  ],
  ["portfolioContent.ts", content, "AI experiment"],
  ["portfolioContent.ts", content, "LocalMesh Studio의 3D 편집 화면"],
  [
    "portfolioContent.ts",
    content,
    "Esc 선택·드래그 취소, Delete/Backspace 삭제",
  ],
  ["README.md", readme, "3D 경험 보존"],
]) {
  assertExcludes(surface, replacedCopy, label);
}

for (const [label, surface, expected] of [
  ["PortfolioPage.tsx", page, "data-theme={theme}"],
  ["SiteHeader.tsx", header, "<ThemeToggle"],
  ["ThemeToggle.tsx", themeToggle, "aria-label={label}"],
  ["usePortfolioTheme.ts", themeHook, "hasManualOverride.current"],
  [
    "usePortfolioTheme.ts",
    themeHook,
    'window.matchMedia("(prefers-color-scheme: light)")',
  ],
  ["index.html", index, 'content="light dark"'],
]) {
  assertIncludes(surface, expected, label);
}

for (const [label, surface] of [
  ["usePortfolioTheme.ts", themeHook],
  ["index.html", index],
]) {
  assertIncludes(surface, "okorion.portfolio.theme.v1", label);
}

assertIncludes(portfolioCss, '.portfolio[data-theme="light"]', "portfolio.css");

const projectHoverRule = portfolioCss.match(
  /\.project-card:hover\s*\{([^}]*)\}/,
)?.[1];
if (!projectHoverRule) {
  throw new Error("portfolio.css: project card hover rule is missing");
}
assertExcludes(
  projectHoverRule,
  "transform:",
  "project card hover compositing",
);

const typographyTokens = new Set(
  [...portfolioCss.matchAll(/font-size:\s*var\((--type-[^)]+)\);/g)].map(
    ([, token]) => token,
  ),
);
const fontSizeDeclarationCount = portfolioCss.match(/font-size:/g)?.length ?? 0;
const tokenizedFontSizeDeclarationCount =
  portfolioCss.match(/font-size:\s*var\(--type-[^)]+\);/g)?.length ?? 0;

if (
  typographyTokens.size !== 7 ||
  tokenizedFontSizeDeclarationCount !== fontSizeDeclarationCount
) {
  throw new Error(
    `portfolio.css: expected seven typography tokens across every font-size declaration (${typographyTokens.size} tokens, ${tokenizedFontSizeDeclarationCount}/${fontSizeDeclarationCount} declarations)`,
  );
}

for (const evidenceLabel of [
  "Problem",
  "Contribution",
  "Decision",
  "Validation",
]) {
  assertIncludes(evidence, evidenceLabel, "ProfessionalEvidenceSection.tsx");
}

const publicProjectsBlock = content.match(
  /export const publicProjects:[\s\S]*?= \[([\s\S]*?)\];\n\nexport const technicalWritingItems/,
)?.[1];
if (!publicProjectsBlock) {
  throw new Error("portfolioContent.ts: publicProjects export is missing");
}
const publicProjectCount = publicProjectsBlock.match(/^\s+id: /gm)?.length ?? 0;
if (publicProjectCount !== 3) {
  throw new Error(
    `portfolioContent.ts: expected three public projects (${publicProjectCount})`,
  );
}
for (const [projectName, index] of [
  ["LocalMesh Studio", "01"],
  ["VizPort Studio", "02"],
  ["Mermaid Sky Exporter", "03"],
]) {
  assertIncludes(publicProjectsBlock, projectName, "portfolioContent.ts");
  assertIncludes(
    publicProjectsBlock,
    `index: "${index}"`,
    "portfolioContent.ts",
  );
}
for (const experimentCopy of [
  "3D mesh studio · AI-assisted toy project",
  "Chart codegen · AI-assisted toy project",
  "경력 대표 사례나 면접 주력 프로젝트로 소개하지 않습니다.",
]) {
  assertIncludes(publicProjectsBlock, experimentCopy, "portfolioContent.ts");
}
assertIncludes(projects, "프로젝트 성격·현재 범위", "PublicBuildsSection.tsx");

const expectedCredentials = [
  "SSAFY 7기 · 1,600시간 · 2022",
  "AWS Certified Solutions Architect – Associate · 2025.07 · 2028.07까지 유효",
  "리눅스마스터 2급 · 2025.07",
  "정보처리기사 · 2022.11",
  "SQL 개발자(SQLD) · 2021.12",
];
const expectedAdditionalCredentials = [
  "빅데이터분석기사 · 2025.12",
  "데이터분석 준전문가(ADsP) · 2025.09",
  "투자자산운용사 · 한국금융투자협회 · 2026.05",
];

for (const [exportName, block, expected] of [
  [
    "credentials",
    content.match(/export const credentials = \[([\s\S]*?)\] as const;/)?.[1],
    expectedCredentials,
  ],
  [
    "additionalCredentials",
    content.match(
      /export const additionalCredentials = \[([\s\S]*?)\] as const;/,
    )?.[1],
    expectedAdditionalCredentials,
  ],
]) {
  if (!block) {
    throw new Error(`portfolioContent.ts: ${exportName} export is missing`);
  }

  const actual = [...block.matchAll(/^\s*"([^"]+)",?$/gm)].map(
    ([, value]) => value,
  );
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `portfolioContent.ts: ${exportName} does not match the approved public order`,
    );
  }
}

for (const disclosureContract of [
  '<details className="credential-disclosure">',
  "<summary>",
  "Additional credentials",
  "additionalCredentials.length",
]) {
  assertIncludes(profile, disclosureContract, "ProfileSection.tsx");
}

for (const writingTitle of [
  "PWA 서비스워커가 MyHits 조회수 배지를 캐시한 문제 해결기",
  "🌆 GitHub.io 페이지 제작기 (2) - Points 컨셉의 3D Web 구현",
  "URL 기반 다이어그램 공유 설계 및 구현 (완전 클라이언트 방식)",
]) {
  assertIncludes(content, writingTitle, "portfolioContent.ts");
}

for (const replacedWritingContent of [
  "2026년 React 프로젝트에서 라이브러리를 고르는 기준",
  "https://velog.io/@okorion/2026년-React-프로젝트에서-라이브러리를-고르는-기준",
]) {
  assertExcludes(content, replacedWritingContent, "portfolioContent.ts");
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
  "https://velog.io/@okorion/URL-기반-다이어그램-공유-설계-및-구현완전-클라이언트-방식",
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
  "26-011371",
  "금융투자전문인력",
  "국가자격",
  "투자자산운용사 취득",
  "투자자산운용사 등록",
  "시험 합격일",
  "합격증 번호",
  "등록번호",
  "TOEIC",
  "토익",
  "한국사",
]) {
  assertExcludes(`${portfolio}\n${index}`, forbiddenClaim, "public portfolio");
}

console.log(
  "Portfolio content, routing, public links, and metadata checks passed.",
);
