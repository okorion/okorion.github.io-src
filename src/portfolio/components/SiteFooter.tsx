import { siteContent } from "../portfolioContent";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>{siteContent.name} · 개인 프로젝트</p>
      <nav aria-label="하단 탐색">
        <a href="/?view=about">소개 · 자격과 특허</a>
        <a href="/?view=3d">
          3D 경험 <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </footer>
  );
}
