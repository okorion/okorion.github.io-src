import type { SiteView } from "../../app/siteView";
import { siteContent } from "../portfolioContent";
import { ExternalLink } from "./ExternalLink";
import { ThemeToggle } from "./ThemeToggle";

interface SiteHeaderProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  view: SiteView;
}

export function SiteHeader({ theme, onToggleTheme, view }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="site-brand" href="/" aria-label="okorion 개인 프로젝트 홈">
        {siteContent.name}
      </a>
      <nav className="site-nav" aria-label="주요 화면">
        <a
          href="/?view=projects"
          aria-current={view === "projects" ? "page" : undefined}
        >
          전체 프로젝트
        </a>
        <a
          href="/?view=about"
          aria-current={view === "about" ? "page" : undefined}
        >
          소개
        </a>
        <ExternalLink href={siteContent.github}>GitHub</ExternalLink>
      </nav>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
}
