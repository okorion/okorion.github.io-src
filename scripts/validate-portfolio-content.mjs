import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import {
  assertPublicProjectContent,
  loadCareerPortfolioTextSurfaces,
} from "./portfolio-exclusion-policy.mjs";

const read = (path) => readFile(path, "utf8");
const [app, content, index, page, routes, css, readme] = await Promise.all([
  read("src/App.tsx"),
  read("src/portfolio/portfolioContent.ts"),
  read("index.html"),
  read("src/portfolio/PortfolioPage.tsx"),
  read("src/app/siteView.ts"),
  read("src/portfolio/portfolio.css"),
  read("README.md"),
]);
const surfaces = await loadCareerPortfolioTextSurfaces();
assertPublicProjectContent(surfaces);

// Selected content contract. These assertions replace the previous career
// timeline / fixed technology copy requirements for this product site.
const featured = content.match(
  /export const featuredProjectIds\s*=\s*\[([^\]]+)\]/,
)?.[1];
assert.deepEqual(
  [...featured.matchAll(/"([^"]+)"/g)].map((match) => match[1]),
  ["rust-lab", "report-review-tool", "aether-studio"],
);
const ids = [...content.matchAll(/\bid: "([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(ids, [
  "rust-lab",
  "report-review-tool",
  "aether-studio",
  "ember-studio",
  "mermaid-sky",
  "vizport",
  "localmesh",
]);
assert.equal(new Set(ids).size, ids.length, "project IDs must be unique");
const report = content.slice(
  content.indexOf('id: "report-review-tool"'),
  content.indexOf('id: "aether-studio"'),
);
for (const required of [
  "4~5시간",
  "2~3시간",
  "2주 간격으로 총 두 차례",
  "최종",
  "예시 데이터",
]) {
  assert.ok(report.includes(required), `report scope missing: ${required}`);
}
assert.match(
  report,
  /links:\s*\[\]/,
  "report has no public demo or source link",
);
for (const disallowed of ["45시간", "23시간", "50%", "월간 절감", "ROI"]) {
  assert.ok(
    !report.includes(disallowed),
    `report claim not approved: ${disallowed}`,
  );
}
const sourceUrls = [
  ...content.matchAll(/kind: "source"[\s\S]*?href: "([^"]+)"/g),
].map((match) => match[1]);
assert.deepEqual(sourceUrls, [
  "https://github.com/okorion/mermaid-sky-exporter",
  "https://github.com/okorion/vizport-studio",
  "https://github.com/okorion/localmesh-studio",
]);
for (const match of content.matchAll(/src: "(\/images\/projects\/[^"]+)"/g)) {
  await access(`public${match[1]}`);
}
for (const required of [
  "내가 정한 방향과 피드백",
  "AI가 맡은 일",
  "자격",
  "공동 발명자",
]) {
  assert.ok(
    content.includes(required),
    `role / about content missing: ${required}`,
  );
}

// Keep the default page independent of WebGL and its optional heavy route.
assert.match(routes, /DEFAULT_SITE_VIEW[^=]*= "portfolio"/);
assert.match(app, /lazy\(/);
for (const legacyImport of [
  "scenes/mainScene",
  "@react-three",
  'from "three"',
]) {
  assert.ok(
    !app.includes(legacyImport),
    `root eagerly imports ${legacyImport}`,
  );
}
assert.ok(!page.includes("ProfessionalEvidenceSection"));
assert.ok(!page.includes("TechnicalWritingSection"));
if (/\b(?:animation|transition)\s*:/.test(css)) {
  assert.match(css, /prefers-reduced-motion/);
}
assert.match(css, /:focus-visible/);
assert.match(index, /<html lang="ko">/);
assert.equal((index.match(/type="module"/g) ?? []).length, 1);
for (const required of [
  "<noscript>",
  "application/ld+json",
  "https://okorion.github.io/",
  "AI",
  "site-og.jpg",
]) {
  assert.ok(index.includes(required), `metadata missing: ${required}`);
}
await access("public/images/projects/site-og.jpg");
JSON.parse(
  index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
);
JSON.parse(await read("public/favicon/site.webmanifest"));

// Inspect all source/static output, including filenames and metadata. Career
// credentials remain descriptive and never include certificate identifiers.
const publicText = surfaces.map((entry) => entry.join("\n")).join("\n");
for (const forbidden of [
  "tech-blog",
  "Career Profile",
  "Developer-Portfolio-",
  "45시간 → 23시간",
  "26-011371",
  "금융투자전문인력",
  "투자자산운용사 취득",
  "투자자산운용사 등록",
  "지도 4종",
  "4개 지도",
  "Collider 3종",
  "52.51MB",
  "SignalDesk",
  "Deploy Lens",
]) {
  assert.ok(
    !publicText.includes(forbidden),
    `unapproved public copy: ${forbidden}`,
  );
}
assert.ok(readme.includes("portfolioContent.ts"));
console.log(
  "Product content, role boundaries, privacy, lazy 3D and metadata checks passed.",
);
