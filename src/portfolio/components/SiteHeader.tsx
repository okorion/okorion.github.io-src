export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-brand" href="/" aria-label="오현규 포트폴리오 홈">
        <span className="site-brand__mark" aria-hidden="true">
          OH
        </span>
        <span className="site-brand__copy">
          <strong>오현규</strong>
          <span>Product / Application Engineer</span>
        </span>
      </a>
      <nav className="site-nav" aria-label="주요 섹션">
        <a href="#professional-evidence">경력 사례</a>
        <a href="#public-builds">공개 프로젝트</a>
        <a href="#experience">경력</a>
      </nav>
      <a className="site-header__lab" href="/?view=3d">
        <span className="site-header__lab-dot" aria-hidden="true" />
        3D Lab
      </a>
    </header>
  );
}
