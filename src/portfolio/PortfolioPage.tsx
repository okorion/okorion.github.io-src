import type { SiteView } from "../app/siteView";
import { HeroSection } from "./components/HeroSection";
import { ProfileSection } from "./components/ProfileSection";
import { ProjectDetail } from "./components/ProjectDetail";
import { PublicBuildsSection } from "./components/PublicBuildsSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { featuredProjectIds, projects, siteContent } from "./portfolioContent";
import { usePortfolioTheme } from "./usePortfolioTheme";
import "./portfolio.css";

interface PortfolioPageProps {
  view: SiteView;
  projectId: string | null;
}

function HomePage() {
  const featured = featuredProjectIds.flatMap((id) =>
    projects.filter((project) => project.id === id),
  );
  const moreTitles = projects
    .filter((project) => !featured.some((item) => item.id === project.id))
    .map((project) => project.title)
    .join(" · ");
  return (
    <>
      <HeroSection />
      <PublicBuildsSection items={featured} heading="대표 프로젝트" />
      <div className="browse-more">
        <a href="/?view=projects">
          전체 프로젝트 보기 <span aria-hidden="true">→</span>
        </a>
        <p>{moreTitles}</p>
      </div>
      <section
        className="making-summary"
        aria-labelledby="making-summary-title"
      >
        <h2 id="making-summary-title">프로젝트 작업 방식</h2>
        <div>
          <p>{siteContent.humanRole}</p>
          <p>{siteContent.aiRole}</p>
        </div>
      </section>
    </>
  );
}

function AllProjectsPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">PROJECTS</p>
        <h1>{siteContent.projectsTitle}</h1>
        <p>{siteContent.projectsDescription}</p>
      </header>
      <PublicBuildsSection items={projects} />
    </>
  );
}

export function PortfolioPage({ view, projectId }: PortfolioPageProps) {
  const { theme, toggleTheme } = usePortfolioTheme();
  return (
    <div className="portfolio" data-theme={theme} data-default-view="portfolio">
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <div className="site-shell">
        <SiteHeader theme={theme} onToggleTheme={toggleTheme} view={view} />
        <main id="main-content" tabIndex={-1}>
          {projectId ? (
            <ProjectDetail projectId={projectId} />
          ) : view === "about" ? (
            <ProfileSection />
          ) : view === "projects" ? (
            <AllProjectsPage />
          ) : (
            <HomePage />
          )}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
